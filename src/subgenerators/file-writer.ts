import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';

interface FileToWrite {
  filePath: string;
  content: string;
}

export async function writeFilesToDisk(
  files: FileToWrite[],
  baseDir: string,
  dryRun = false
): Promise<void> {
  const spinner = ora('Writing files...').start();

  try {
    for (const file of files) {
      const fullPath = path.resolve(baseDir, file.filePath);
      const dir = path.dirname(fullPath);

      if (dryRun) {
        console.warn(chalk.cyan(`[DRY RUN] Would create: ${fullPath}`));
        continue;
      }

      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file if it doesn't exist
      if (fs.existsSync(fullPath)) {
        console.warn(chalk.yellow(`File already exists, skipping: ${fullPath}`));
        continue;
      }

      fs.writeFileSync(fullPath, file.content, 'utf-8');
    }

    spinner.succeed('Files written successfully!');
  } catch (error) {
    spinner.fail('Failed to write files');
    throw error;
  }
}

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getProjectRoot(): string {
  return process.cwd();
}

export function detectProjectType(): 'frontend' | 'backend' | 'fullstack' | 'unknown' {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return 'unknown';
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const hasReact = deps.react || deps.next;
    const hasExpress = deps.express || deps.fastify;
    
    if (hasReact && hasExpress) {
      return 'fullstack';
    }
    if (hasReact) {
      return 'frontend';
    }
    if (hasExpress) {
      return 'backend';
    }
  } catch {
    // Ignore parse errors
  }

  return 'unknown';
}
