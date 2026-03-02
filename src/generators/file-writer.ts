import * as fs from 'fs';
import * as path from 'path';
import { ProjectStructure } from './project-structure';
import ora from 'ora';

export async function writeProjectToDisk(
  structure: ProjectStructure,
  baseDir: string,
  prdContent?: string,
  designSystemContent?: string
): Promise<void> {
  const spinner = ora('Criando estrutura do projeto...').start();

  try {
    await writeStructure(structure, baseDir, prdContent, designSystemContent);
    spinner.succeed('Projeto criado com sucesso!');
  } catch (error) {
    spinner.fail('Erro ao criar projeto');
    throw error;
  }
}

async function writeStructure(
  structure: ProjectStructure,
  basePath: string,
  prdContent?: string,
  designSystemContent?: string
): Promise<void> {
  const currentPath = path.join(basePath, structure.name);

  if (structure.type === 'folder') {
    // Create directory
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath, { recursive: true });
    }

    // Write children - pass currentPath as the new base for children
    if (structure.children) {
      for (const child of structure.children) {
        await writeStructure(child, currentPath, prdContent, designSystemContent);
      }
    }
  } else if (structure.type === 'file') {
    // Handle documentation files with special content
    if (structure.name === 'PRD.md' && prdContent) {
      fs.writeFileSync(path.join(basePath, structure.name), prdContent, 'utf-8');
    } else if (structure.name === 'DESIGN_SYSTEM.md' && designSystemContent) {
      fs.writeFileSync(path.join(basePath, structure.name), designSystemContent, 'utf-8');
    } else if (structure.name === '.gitkeep') {
      // Skip .gitkeep files
    } else if (structure.content) {
      fs.writeFileSync(path.join(basePath, structure.name), structure.content, 'utf-8');
    }
  }
}

export function createDirectoryIfNotExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function readJsonFile<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export function writeJsonFile<T>(filePath: string, data: T): void {
  const dir = path.dirname(filePath);
  createDirectoryIfNotExists(dir);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
