import type { ProjectConfig, ProjectStructure } from './types';

import {
  generateApiDoc,
  generateApiService,
  generateArchitectureDoc,
  generateAuthContext,
  generateAuthControllerFile,
  generateAuthMiddlewareFile,
  generateAuthRoutesFile,
  generateAuthService,
  generateAuthServiceBackend,
  generateBackendAppFile,
  generateBackendBiomeConfig,
  generateBackendConfigFile,
  generateBackendEnvExample,
  generateBackendGitignore,
  generateBackendIndexFile,
  generateBackendPackageJson,
  generateBackendTsConfig,
  generateBiomeConfig,
  generateCnUtility,
  generateComponentStyles,
  generateComponentTemplate,
  generateComponentTest,
  generateCssVariables,
  generateDatabaseIndexFile,
  generateDockerCompose,
  generateEnvExample,
  generateErrorMiddlewareFile,
  generateEslintConfig,
  generateFormatUtility,
  generateGitignore,
  generateGlobalStyles,
  generateHttpErrorFile,
  generateIndexHtml,
  generateLoggerFile,
  generateMainFile,
  generateNodeTsConfig,
  generatePackageJson,
  generatePageTemplate,
  generatePrettierConfig,
  generatePrismaSchema,
  generateReadme,
  generateReduxHooks,
  generateReduxStore,
  generateRoutesIndexFile,
  generateThemeContext,
  generateTsConfig,
  generateTypesIndex,
  generateUseAuthHook,
  generateUserControllerFile,
  generateUserRoutesFile,
  generateUserServiceBackend,
  generateUseThemeHook,
  generateViteConfig,
  generateZustandStore,
} from './templates';

export function buildFrontendStructure(
  config: ProjectConfig,
  extension: string,
  configExtension: string,
  isNextJs: boolean
): ProjectStructure | null {
  if (!['web', 'fullstack', 'mobile', 'desktop'].includes(config.type)) {
    return null;
  }

  const children: ProjectStructure[] = [];

  const rootFiles: ProjectStructure[] = [
    {
      name: 'package.json',
      type: 'file',
      content: generatePackageJson(config),
    },
    {
      name: 'tsconfig.json',
      type: 'file',
      content: generateTsConfig(config),
    },
    {
      name: 'tsconfig.node.json',
      type: 'file',
      content: generateNodeTsConfig(),
    },
    {
      name: '.eslintrc.cjs',
      type: 'file',
      content: generateEslintConfig(),
    },
    {
      name: '.prettierrc',
      type: 'file',
      content: generatePrettierConfig(),
    },
    {
      name: '.gitignore',
      type: 'file',
      content: generateGitignore(),
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(config),
    },
    {
      name: '.env.example',
      type: 'file',
      content: generateEnvExample(config),
    },
  ];

  children.push(...rootFiles);

  const srcFolder: ProjectStructure = buildSrcFolder(config, extension);
  children.push(srcFolder);

  if (!isNextJs) {
    children.push(
      buildPublicFolder(),
      buildIndexHtmlFile(config),
      buildViteConfigFile(config, configExtension)
    );
  }

  children.push(buildBiomeConfig());

  return {
    name: 'frontend',
    type: 'folder',
    children,
  };
}

export function buildBackendStructure(
  config: ProjectConfig,
  extension: string
): ProjectStructure | null {
  const hasBackend = ['api', 'fullstack'].includes(config.type);
  if (!hasBackend) {
    return null;
  }

  const children: ProjectStructure[] = [];

  children.push(
    {
      name: 'package.json',
      type: 'file',
      content: generateBackendPackageJson(config),
    },
    {
      name: 'tsconfig.json',
      type: 'file',
      content: generateBackendTsConfig(config),
    },
    {
      name: '.env.example',
      type: 'file',
      content: generateBackendEnvExample(config),
    },
    {
      name: '.gitignore',
      type: 'file',
      content: generateBackendGitignore(),
    }
  );

  const srcFolder = buildBackendSrcFolder(config, extension);
  children.push(
    srcFolder,
    buildBackendTestsFolder(),
    buildBackendLogsFolder(),
    buildBackendBiomeConfig()
  );

  return {
    name: 'backend',
    type: 'folder',
    children,
  };
}

export function buildDocsStructure(config: ProjectConfig, hasBackend: boolean): ProjectStructure {
  return {
    name: 'docs',
    type: 'folder',
    children: [
      { name: 'PRD.md', type: 'file' },
      { name: 'DESIGN_SYSTEM.md', type: 'file' },
      {
        name: 'ARCHITECTURE.md',
        type: 'file',
        content: generateArchitectureDoc(config),
      },
      {
        name: 'API.md',
        type: 'file',
        content: hasBackend ? generateApiDoc(config) : undefined,
      },
    ],
  };
}

export function buildDockerCompose(config: ProjectConfig): ProjectStructure | null {
  if (config.type !== 'fullstack') {
    return null;
  }

  const content = generateDockerCompose(config);

  return {
    name: 'docker-compose.yml',
    type: 'file',
    content,
  };
}

function buildSrcFolder(config: ProjectConfig, extension: string): ProjectStructure {
  const srcChildren: ProjectStructure[] = [
    {
      name: `main.${extension}`,
      type: 'file',
      content: generateMainFile(),
    },
    {
      name: 'vite-env.d.ts',
      type: 'file',
      content: '/// <reference types="vite/client" />\n',
    },
  ];

  const componentsFolder: ProjectStructure = buildComponentsFolder(config, extension);
  const pagesFolder: ProjectStructure = buildPagesFolder(config, extension);
  const hooksFolder: ProjectStructure = buildHooksFolder(extension);
  const contextFolder: ProjectStructure = buildContextFolder(extension);
  const servicesFolder: ProjectStructure = buildServicesFolder(extension);
  const stylesFolder: ProjectStructure = buildStylesFolder(config);
  const typesFolder: ProjectStructure = buildTypesFolder(extension);
  const utilsFolder: ProjectStructure = buildUtilsFolder(config, extension);
  const assetsFolder: ProjectStructure = buildAssetsFolder();
  const storeFolder = buildStoreFolder(config, extension);

  srcChildren.push(
    componentsFolder,
    pagesFolder,
    hooksFolder,
    contextFolder,
    servicesFolder,
    stylesFolder,
    typesFolder,
    utilsFolder,
    assetsFolder
  );

  if (storeFolder !== null) {
    srcChildren.push(storeFolder);
  }

  return {
    name: 'src',
    type: 'folder',
    children: srcChildren,
  };
}

function buildComponentsFolder(config: ProjectConfig, extension: string): ProjectStructure {
  return {
    name: 'components',
    type: 'folder',
    children: config.components.map<ProjectStructure>((component) => ({
      name: component,
      type: 'folder',
      children: [
        {
          name: `${component}.${extension}x`,
          type: 'file',
          content: generateComponentTemplate(component, config),
        },
        {
          name: `${component}.styles.${getStylesExtension(config)}`,
          type: 'file',
          content: generateComponentStyles(component, config),
        },
        {
          name: `${component}.test.${extension}x`,
          type: 'file',
          content: generateComponentTest(component),
        },
      ],
    })),
  };
}

function buildPagesFolder(config: ProjectConfig, extension: string): ProjectStructure {
  return {
    name: 'pages',
    type: 'folder',
    children: config.pages.map<ProjectStructure>((page) => ({
      name: page,
      type: 'folder',
      children: [
        {
          name: `index.${extension}x`,
          type: 'file',
          content: generatePageTemplate(page, config),
        },
      ],
    })),
  };
}

function buildHooksFolder(extension: string): ProjectStructure {
  return {
    name: 'hooks',
    type: 'folder',
    children: [
      {
        name: `useAuth.${extension}`,
        type: 'file',
        content: generateUseAuthHook(),
      },
      {
        name: `useTheme.${extension}`,
        type: 'file',
        content: generateUseThemeHook(),
      },
    ],
  };
}

function buildContextFolder(extension: string): ProjectStructure {
  return {
    name: 'context',
    type: 'folder',
    children: [
      {
        name: `AuthContext.${extension}x`,
        type: 'file',
        content: generateAuthContext(),
      },
      {
        name: `ThemeContext.${extension}x`,
        type: 'file',
        content: generateThemeContext(),
      },
    ],
  };
}

function buildServicesFolder(extension: string): ProjectStructure {
  return {
    name: 'services',
    type: 'folder',
    children: [
      {
        name: `api.${extension}`,
        type: 'file',
        content: generateApiService(),
      },
      {
        name: `auth.${extension}`,
        type: 'file',
        content: generateAuthService(),
      },
    ],
  };
}

function buildStylesFolder(config: ProjectConfig): ProjectStructure {
  return {
    name: 'styles',
    type: 'folder',
    children: [
      {
        name: 'globals.css',
        type: 'file',
        content: generateGlobalStyles(config),
      },
      {
        name: 'variables.css',
        type: 'file',
        content: generateCssVariables(config),
      },
    ],
  };
}

function buildTypesFolder(extension: string): ProjectStructure {
  return {
    name: 'types',
    type: 'folder',
    children: [
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateTypesIndex(),
      },
    ],
  };
}

function buildUtilsFolder(config: ProjectConfig, extension: string): ProjectStructure {
  return {
    name: 'utils',
    type: 'folder',
    children: [
      {
        name: `cn.${extension}`,
        type: 'file',
        content: generateCnUtility(),
      },
      {
        name: `format.${extension}`,
        type: 'file',
        content: generateFormatUtility(config),
      },
    ],
  };
}

function buildAssetsFolder(): ProjectStructure {
  return {
    name: 'assets',
    type: 'folder',
    children: [
      {
        name: 'images',
        type: 'folder',
        children: [{ name: '.gitkeep', type: 'file' }],
      },
      {
        name: 'icons',
        type: 'folder',
        children: [{ name: '.gitkeep', type: 'file' }],
      },
      {
        name: 'fonts',
        type: 'folder',
        children: [{ name: '.gitkeep', type: 'file' }],
      },
    ],
  };
}

function buildStoreFolder(config: ProjectConfig, extension: string): ProjectStructure | null {
  if (config.language !== 'typescript') {
    return null;
  }

  if (!config.globalState) {
    return null;
  }

  const children: ProjectStructure[] = [];

  if (config.globalState === 'zustand') {
    children.push({
      name: `useAppStore.${extension}`,
      type: 'file',
      content: generateZustandStore(),
    });
  }

  if (config.globalState === 'redux-toolkit') {
    children.push(
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateReduxStore(),
      },
      {
        name: `hooks.${extension}`,
        type: 'file',
        content: generateReduxHooks(),
      }
    );
  }

  if (children.length === 0) {
    return null;
  }

  return {
    name: 'store',
    type: 'folder',
    children,
  };
}

function buildPublicFolder(): ProjectStructure {
  return {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'favicon.ico', type: 'file' },
      { name: 'robots.txt', type: 'file', content: 'User-agent: *\nAllow: /\n' },
    ],
  };
}

function buildIndexHtmlFile(config: ProjectConfig): ProjectStructure {
  return {
    name: 'index.html',
    type: 'file',
    content: generateIndexHtml(config),
  };
}

function buildViteConfigFile(config: ProjectConfig, configExtension: string): ProjectStructure {
  return {
    name: `vite.config.${configExtension}t`,
    type: 'file',
    content: generateViteConfig(config),
  };
}

function buildBiomeConfig(): ProjectStructure {
  return {
    name: 'biome.json',
    type: 'file',
    content: generateBiomeConfig(),
  };
}

function buildBackendSrcFolder(config: ProjectConfig, extension: string): ProjectStructure {
  const srcChildren: ProjectStructure[] = [
    {
      name: `index.${extension}`,
      type: 'file',
      content: generateBackendIndexFile(),
    },
    {
      name: `app.${extension}`,
      type: 'file',
      content: generateBackendAppFile(),
    },
    {
      name: `config.${extension}`,
      type: 'file',
      content: generateBackendConfigFile(),
    },
    buildRoutesFolder(extension),
    buildControllersFolder(extension),
    buildBackendServicesFolder(config, extension),
    buildMiddlewaresFolder(extension),
    buildBackendUtilsFolder(extension),
  ];

  if (config.database) {
    srcChildren.push(buildDatabaseFolder(config, extension));
  }

  return {
    name: 'src',
    type: 'folder',
    children: srcChildren,
  };
}

function buildRoutesFolder(extension: string): ProjectStructure {
  return {
    name: 'routes',
    type: 'folder',
    children: [
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateRoutesIndexFile(),
      },
      {
        name: `auth.routes.${extension}`,
        type: 'file',
        content: generateAuthRoutesFile(),
      },
      {
        name: `user.routes.${extension}`,
        type: 'file',
        content: generateUserRoutesFile(),
      },
    ],
  };
}

function buildControllersFolder(extension: string): ProjectStructure {
  return {
    name: 'controllers',
    type: 'folder',
    children: [
      {
        name: `auth.controller.${extension}`,
        type: 'file',
        content: generateAuthControllerFile(),
      },
      {
        name: `user.controller.${extension}`,
        type: 'file',
        content: generateUserControllerFile(),
      },
    ],
  };
}

function buildBackendServicesFolder(config: ProjectConfig, extension: string): ProjectStructure {
  return {
    name: 'services',
    type: 'folder',
    children: [
      {
        name: `auth.service.${extension}`,
        type: 'file',
        content: generateAuthServiceBackend(config),
      },
      {
        name: `user.service.${extension}`,
        type: 'file',
        content: generateUserServiceBackend(),
      },
    ],
  };
}

function buildMiddlewaresFolder(extension: string): ProjectStructure {
  return {
    name: 'middlewares',
    type: 'folder',
    children: [
      {
        name: `auth.middleware.${extension}`,
        type: 'file',
        content: generateAuthMiddlewareFile(),
      },
      {
        name: `error.middleware.${extension}`,
        type: 'file',
        content: generateErrorMiddlewareFile(),
      },
    ],
  };
}

function buildBackendUtilsFolder(extension: string): ProjectStructure {
  return {
    name: 'utils',
    type: 'folder',
    children: [
      {
        name: `logger.${extension}`,
        type: 'file',
        content: generateLoggerFile(),
      },
      {
        name: `httpError.${extension}`,
        type: 'file',
        content: generateHttpErrorFile(),
      },
    ],
  };
}

function buildDatabaseFolder(config: ProjectConfig, extension: string): ProjectStructure {
  return {
    name: 'database',
    type: 'folder',
    children: [
      {
        name: 'schema.prisma',
        type: 'file',
        content: generatePrismaSchema(config),
      },
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateDatabaseIndexFile(),
      },
    ],
  };
}

function buildBackendTestsFolder(): ProjectStructure {
  return {
    name: 'tests',
    type: 'folder',
    children: [
      {
        name: 'unit',
        type: 'folder',
        children: [{ name: '.gitkeep', type: 'file' }],
      },
      {
        name: 'integration',
        type: 'folder',
        children: [{ name: '.gitkeep', type: 'file' }],
      },
    ],
  };
}

function buildBackendLogsFolder(): ProjectStructure {
  return {
    name: 'logs',
    type: 'folder',
    children: [{ name: '.gitkeep', type: 'file' }],
  };
}

function buildBackendBiomeConfig(): ProjectStructure {
  return {
    name: 'biome.json',
    type: 'file',
    content: generateBackendBiomeConfig(),
  };
}

function getStylesExtension(config: ProjectConfig): string {
  if (config.styling === 'tailwind') {
    return 'ts';
  }

  if (config.styling === 'scss') {
    return 'scss';
  }

  return 'ts';
}
