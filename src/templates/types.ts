export type { ProjectConfig, SupportedLanguage } from '../types';

export interface ProjectStructure {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: ProjectStructure[];
}
