import * as fs from 'fs';
import ora from 'ora';
import * as path from 'path';
import type { SupportedLanguage } from '../types';
import { ProjectStructure } from './project-structure';

interface IFileWriterMessages {
  readonly creating: string;
  readonly success: string;
  readonly error: string;
}

const FILE_WRITER_MESSAGES: Record<SupportedLanguage, IFileWriterMessages> = {
  en: {
    creating: 'Creating project structure...',
    success: 'Project successfully created!',
    error: 'Error while creating project',
  },
  pt: {
    creating: 'Criando estrutura do projeto...',
    success: 'Projeto criado com sucesso!',
    error: 'Erro ao criar projeto',
  },
  es: {
    creating: 'Creando estructura del proyecto...',
    success: 'Proyecto creado con éxito!',
    error: 'Error al crear el proyecto',
  },
};

export async function writeProjectToDisk(
  structure: ProjectStructure,
  baseDir: string,
  prdContent?: string,
  designSystemContent?: string,
  language?: SupportedLanguage
): Promise<void> {
  const selectedLanguage: SupportedLanguage = language ?? 'en';
  const messages = FILE_WRITER_MESSAGES[selectedLanguage];
  const spinner = ora(messages.creating).start();

  try {
    await writeStructure(structure, baseDir, prdContent, designSystemContent);
    spinner.succeed(messages.success);
  } catch (error) {
    spinner.fail(messages.error);
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
