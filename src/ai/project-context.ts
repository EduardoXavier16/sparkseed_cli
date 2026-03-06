import * as fs from 'fs';
import * as path from 'path';

export interface ProjectContext {
  name: string;
  description: string;
  structure: FileNode[];
  files: CodeFile[];
  documentation: DocFile[];
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  depth: number;
}

export interface CodeFile {
  path: string;
  content: string;
  language: string;
}

export interface DocFile {
  path: string;
  content: string;
  type: 'readme' | 'prd' | 'design-system' | 'architecture' | 'api' | 'other';
}

export async function loadProjectContext(projectRoot: string, maxFiles: number = 50): Promise<ProjectContext> {
  const name = path.basename(projectRoot);
  const structure = await buildFileTree(projectRoot, 0);
  const files = await loadCodeFiles(projectRoot, maxFiles);
  const documentation = await loadDocumentation(projectRoot);

  return {
    name,
    description: await extractProjectDescription(projectRoot),
    structure,
    files,
    documentation,
  };
}

async function buildFileTree(dirPath: string, depth: number, maxDepth: number = 4): Promise<FileNode[]> {
  const nodes: FileNode[] = [];
  
  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    
    // Filter out common ignored directories
    const filteredEntries = entries.filter(
      (entry) =>
        !entry.name.startsWith('.') &&
        entry.name !== 'node_modules' &&
        entry.name !== 'dist' &&
        entry.name !== 'build' &&
        entry.name !== '.git' &&
        entry.name !== 'src'
    );

    for (const entry of filteredEntries.slice(0, 20)) { // Limit number of top-level items
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const childNode: FileNode = {
          name: entry.name,
          type: 'folder',
          depth,
          children: [],
        };
        
        if (depth < maxDepth) {
          childNode.children = await buildFileTree(fullPath, depth + 1, maxDepth);
        }
        
        nodes.push(childNode);
      } else {
        nodes.push({
          name: entry.name,
          type: 'file',
          depth,
        });
      }
    }
  } catch (error) {
    // Ignore errors when reading directories
  }

  return nodes;
}

async function loadCodeFiles(projectRoot: string, maxFiles: number): Promise<CodeFile[]> {
  const codeFiles: CodeFile[] = [];
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.html'];
  
  const dirsToScan = ['src', 'app', 'lib', 'components', 'pages', 'routes', 'controllers', 'services', 'models', 'database'];
  
  for (const dir of dirsToScan) {
    if (codeFiles.length >= maxFiles) break;
    
    const dirPath = path.join(projectRoot, dir);
    if (await exists(dirPath)) {
      const files = await scanDirectory(dirPath, extensions, maxFiles - codeFiles.length);
      codeFiles.push(...files);
    }
  }

  return codeFiles.slice(0, maxFiles);
}

async function scanDirectory(dir: string, extensions: string[], maxFiles: number): Promise<CodeFile[]> {
  const files: CodeFile[] = [];
  
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (files.length >= maxFiles) break;
      
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const subFiles = await scanDirectory(fullPath, extensions, maxFiles - files.length);
          files.push(...subFiles);
        }
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        const content = await fs.promises.readFile(fullPath, 'utf-8');
        const relativePath = path.relative(process.cwd(), fullPath);
        
        files.push({
          path: relativePath,
          content,
          language: getLanguageFromExtension(entry.name),
        });
      }
    }
  } catch (error) {
    // Ignore read errors
  }

  return files;
}

async function loadDocumentation(projectRoot: string): Promise<DocFile[]> {
  const docs: DocFile[] = [];
  const docsPath = path.join(projectRoot, 'docs');
  
  if (!(await exists(docsPath))) {
    return docs;
  }

  const docFiles = [
    { name: 'README.md', type: 'readme' as const },
    { name: 'PRD.md', type: 'prd' as const },
    { name: 'DESIGN_SYSTEM.md', type: 'design-system' as const },
    { name: 'ARCHITECTURE.md', type: 'architecture' as const },
    { name: 'API.md', type: 'api' as const },
  ];

  for (const doc of docFiles) {
    const filePath = path.join(docsPath, doc.name);
    if (await exists(filePath)) {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      docs.push({
        path: path.relative(process.cwd(), filePath),
        content,
        type: doc.type,
      });
    }
  }

  // Load other markdown files
  try {
    const entries = await fs.promises.readdir(docsPath);
    for (const entry of entries) {
      if (entry.endsWith('.md') && !docFiles.some((d) => d.name === entry)) {
        const filePath = path.join(docsPath, entry);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        docs.push({
          path: path.relative(process.cwd(), filePath),
          content,
          type: 'other',
        });
      }
    }
  } catch (error) {
    // Ignore errors
  }

  return docs;
}

async function extractProjectDescription(projectRoot: string): Promise<string> {
  // Try to read from package.json
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (await exists(packageJsonPath)) {
      const content = await fs.promises.readFile(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);
      if (pkg.description) {
        return pkg.description;
      }
    }
  } catch (error) {
    // Ignore errors
  }

  // Try to read from README
  try {
    const readmePath = path.join(projectRoot, 'README.md');
    if (await exists(readmePath)) {
      const content = await fs.promises.readFile(readmePath, 'utf-8');
      const firstParagraph = content.split('\n\n')[1];
      if (firstParagraph) {
        return firstParagraph.replace(/[#*`]/g, '').trim();
      }
    }
  } catch (error) {
    // Ignore errors
  }

  return 'Project without description';
}

function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop();
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    css: 'css',
    scss: 'scss',
    html: 'html',
    md: 'markdown',
  };
  return map[ext || ''] || 'text';
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function formatContextForPrompt(context: ProjectContext, maxLength: number = 8000): string {
  let result = `# Project: ${context.name}\n\n`;
  result += `# Description: ${context.description}\n\n`;
  
  result += '## File Structure:\n```\n';
  result += formatFileTree(context.structure, 0);
  result += '```\n\n';

  if (context.documentation.length > 0) {
    result += '## Documentation:\n\n';
    for (const doc of context.documentation) {
      result += `### ${doc.type.toUpperCase()}: ${doc.path}\n`;
      result += `${doc.content.substring(0, 500)}...\n\n`;
    }
  }

  if (context.files.length > 0) {
    result += '## Key Files:\n\n';
    for (const file of context.files.slice(0, 10)) {
      result += `### ${file.path}\n`;
      result += `\`\`\`${file.language}\n`;
      result += `${file.content.substring(0, 300)}\n`;
      result += '```\n\n';
    }
  }

  // Truncate if too long
  if (result.length > maxLength) {
    result = result.substring(0, maxLength) + '\n\n[Truncated due to length limits...]';
  }

  return result;
}

function formatFileTree(nodes: FileNode[], indent: number = 0): string {
  let result = '';
  const prefix = '  '.repeat(indent);
  
  for (const node of nodes) {
    if (node.type === 'folder') {
      result += `${prefix}📁 ${node.name}/\n`;
      if (node.children) {
        result += formatFileTree(node.children, indent + 1);
      }
    } else {
      result += `${prefix}📄 ${node.name}\n`;
    }
  }
  
  return result;
}
