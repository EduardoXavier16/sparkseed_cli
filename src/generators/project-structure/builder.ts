import type { ProjectStructure } from './types';
import type { ProjectConfig } from './types';

import {
  buildBackendStructure,
  buildDockerCompose,
  buildDocsStructure,
  buildFrontendStructure,
} from './sections';

export function generateProjectStructure(config: ProjectConfig): ProjectStructure {
  const isNextJs = config.framework === 'nextjs';
  const hasBackend = ['api', 'fullstack'].includes(config.type);
  const isTypescript = config.language === 'typescript';
  const extension = isTypescript ? 'ts' : 'js';
  const configExtension = isTypescript ? 'ts' : 'js';

  const children: ProjectStructure[] = [];

  const frontend = buildFrontendStructure(config, extension, configExtension, isNextJs);
  if (frontend !== null) {
    children.push(frontend);
  }

  const backend = buildBackendStructure(config, extension);
  if (backend !== null) {
    children.push(backend);
  }

  const docs = buildDocsStructure(config, hasBackend);
  children.push(docs);

  const dockerCompose = buildDockerCompose(config);
  if (dockerCompose !== null) {
    children.push(dockerCompose);
  }

  return {
    name: config.projectName,
    type: 'folder',
    children,
  };
}

