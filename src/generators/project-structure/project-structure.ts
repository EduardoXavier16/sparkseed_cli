import type { ProjectConfig } from './types';
import { generateProjectStructure as buildProjectStructure } from './builder';
import type { ProjectStructure } from './types';

export type { ProjectStructure };

export function generateProjectStructure(config: ProjectConfig): ProjectStructure {
  return buildProjectStructure(config);
}
