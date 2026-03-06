import type { ProjectConfig, ProjectStructure } from './types';

import {
  generateAccessibilityDoc,
  generateAgentGuide,
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
  generateBackendAuthServiceUnitTest,
  generateBackendBiomeConfig,
  generateBackendConfigFile,
  generateBackendEnvExample,
  generateBackendGitignore,
  generateBackendHealthRouteIntegrationTest,
  generateBackendIndexFile,
  generateBackendPackageJson,
  generateBackendTsConfig,
  generateBackendUserServiceUnitTest,
  generateBackendVitestConfig,
  generateBiomeConfig,
  generateCnUtility,
  generateComponentStyles,
  generateComponentTemplate,
  generateComponentTest,
  generateCssVariables,
  generateDatabaseIndexFile,
  generateDockerCompose,
  generateDomainModelDoc,
  generateDrizzleIndex,
  generateDrizzleSchema,
  generateEnvExample,
  generateErrorMiddlewareFile,
  generateEslintConfig,
  generateFormatUtility,
  generateGitHubActionsWorkflow,
  generateGitignore,
  generateGlobalStyles,
  generateHttpErrorFile,
  generateIndexHtml,
  generateKnexConfig,
  generateLoggerFile,
  generateMainFile,
  generateMongooseModels,
  generateNodeTsConfig,
  generateOpenAPISpec,
  generatePackageJson,
  generatePageTemplate,
  generatePlaywrightAuthSpec,
  generatePlaywrightConfig,
  generatePlaywrightNavigationSpec,
  generatePrettierConfig,
  generatePrismaSchema,
  generateQaGuide,
  generateReadme,
  generateRedisConfig,
  generateRedisDockerCompose,
  generateReduxHooks,
  generateReduxStore,
  generateReleaseChecklist,
  generateRobotsTxt,
  generateRoutesIndexFile,
  generateScreensMapDoc,
  generateSequelizeIndex,
  generateSequelizeModels,
  generateSitemapXml,
  generateSupabaseClient,
  generateThemeContext,
  generateTsConfig,
  generateTypeORMConfig,
  generateTypesIndex,
  generateUseAuthHook,
  generateUserControllerFile,
  generateUserRoutesFile,
  generateUserServiceBackend,
  generateUseThemeHook,
  generateViteConfig,
  generateVitestConfig,
  generateZustandStore,
} from '../../templates';

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
      content: generateTsConfig(),
    },
    {
      name: 'tsconfig.node.json',
      type: 'file',
      content: generateNodeTsConfig(),
    },
    {
      name: 'vitest.config.ts',
      type: 'file',
      content: generateVitestConfig(config),
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
      buildPublicFolder(config),
      buildIndexHtmlFile(config),
      buildViteConfigFile(config, configExtension)
    );
  }

  children.push(buildBiomeConfig());

  const testsFolder: ProjectStructure = {
    name: 'tests',
    type: 'folder',
    children: [
      {
        name: 'e2e',
        type: 'folder',
        children: [
          {
            name: 'auth.spec.ts',
            type: 'file',
            content: generatePlaywrightAuthSpec(),
          },
          {
            name: 'navigation.spec.ts',
            type: 'file',
            content: generatePlaywrightNavigationSpec(),
          },
        ],
      },
    ],
  };

  children.push({
    name: 'playwright.config.ts',
    type: 'file',
    content: generatePlaywrightConfig(config),
  });

  children.push(testsFolder);

  // Add .github/workflows for CI/CD
  children.push({
    name: '.github',
    type: 'folder',
    children: [
      {
        name: 'workflows',
        type: 'folder',
        children: [
          {
            name: 'ci-cd.yml',
            type: 'file',
            content: generateGitHubActionsWorkflow(config),
          },
        ],
      },
    ],
  });

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
      content: generateBackendTsConfig(),
    },
    {
      name: 'vitest.config.ts',
      type: 'file',
      content: generateBackendVitestConfig(),
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

  // Add .github/workflows for CI/CD (backend only projects)
  if (!['fullstack', 'web'].includes(config.type)) {
    children.push({
      name: '.github',
      type: 'folder',
      children: [
        {
          name: 'workflows',
          type: 'folder',
          children: [
            {
              name: 'ci-cd.yml',
              type: 'file',
              content: generateGitHubActionsWorkflow(config),
            },
          ],
        },
      ],
    });
  }

  return {
    name: 'backend',
    type: 'folder',
    children,
  };
}

export function buildDocsStructure(config: ProjectConfig, hasBackend: boolean): ProjectStructure {
  const features = config.features || [];
  const hasOpenAPI = hasBackend && (features.includes('docs') || features.includes('api'));

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
        name: 'QA_GUIDE.md',
        type: 'file',
        content: generateQaGuide(config),
      },
      {
        name: 'API.md',
        type: 'file',
        content: hasBackend ? generateApiDoc(config) : undefined,
      },
      {
        name: 'ACCESSIBILITY.md',
        type: 'file',
        content: generateAccessibilityDoc(config),
      },
      {
        name: 'AGENT_GUIDE.md',
        type: 'file',
        content: generateAgentGuide(config),
      },
      {
        name: 'RELEASE_CHECKLIST.md',
        type: 'file',
        content: generateReleaseChecklist(config),
      },
      {
        name: 'DOMAIN_MODEL.md',
        type: 'file',
        content:
          config.domainEntities && config.domainEntities.length > 0
            ? generateDomainModelDoc(config)
            : undefined,
      },
      {
        name: 'SCREENS_MAP.md',
        type: 'file',
        content:
          config.screenMap && config.screenMap.length > 0
            ? generateScreensMapDoc(config)
            : undefined,
      },
      ...(hasOpenAPI
        ? [
            {
              name: 'openapi.json',
              type: 'file' as const,
              content: generateOpenAPISpec(config),
            },
          ]
        : []),
    ],
  };
}

export function buildDockerCompose(config: ProjectConfig): ProjectStructure | null {
  if (config.type !== 'fullstack') {
    return null;
  }

  const content = generateDockerCompose(config);
  const features = config.features || [];
  const children: ProjectStructure[] = [
    {
      name: 'docker-compose.yml',
      type: 'file',
      content,
    },
  ];

  // Add Redis if cache or session feature is enabled
  if (features.includes('cache') || features.includes('session') || features.includes('redis')) {
    children.push({
      name: 'docker-compose.redis.yml',
      type: 'file',
      content: generateRedisDockerCompose(),
    });
  }

  return {
    name: 'docker-compose',
    type: 'folder',
    children,
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
  const children: ProjectStructure[] = [
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
  ];

  return {
    name: 'services',
    type: 'folder',
    children,
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

function buildPublicFolder(config: ProjectConfig): ProjectStructure {
  return {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'favicon.ico', type: 'file' },
      {
        name: 'robots.txt',
        type: 'file',
        content: generateRobotsTxt(),
      },
      {
        name: 'sitemap.xml',
        type: 'file',
        content: generateSitemapXml(config),
      },
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

  // Add lib folder with Redis and/or Supabase configs
  const features = config.features || [];
  const hasRedis =
    features.includes('cache') || features.includes('session') || features.includes('redis');
  const hasSupabase = features.includes('supabase') || config.database === 'supabase';

  if (hasRedis || hasSupabase) {
    const libChildren: ProjectStructure[] = [];

    if (hasRedis) {
      libChildren.push({
        name: `redis.${extension}`,
        type: 'file',
        content: generateRedisConfig(config),
      });
    }

    if (hasSupabase) {
      libChildren.push({
        name: `supabase.${extension}`,
        type: 'file',
        content: generateSupabaseClient(config),
      });
    }

    srcChildren.push({
      name: 'lib',
      type: 'folder',
      children: libChildren,
    });
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
        content: generateAuthServiceBackend(),
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
  const orm = config.orm || 'prisma';

  const children: ProjectStructure[] = [];

  if (orm === 'prisma') {
    children.push(
      {
        name: 'schema.prisma',
        type: 'file',
        content: generatePrismaSchema(config),
      },
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateDatabaseIndexFile(),
      }
    );
  } else if (orm === 'drizzle') {
    children.push(
      {
        name: `schema.${extension}`,
        type: 'file',
        content: generateDrizzleSchema(config),
      },
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateDrizzleIndex(config),
      }
    );
  } else if (orm === 'sequelize') {
    children.push(
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateSequelizeIndex(config),
      },
      {
        name: `models.${extension}`,
        type: 'file',
        content: generateSequelizeModels(config),
      }
    );
  } else if (orm === 'typeorm') {
    children.push(
      {
        name: `data-source.${extension}`,
        type: 'file',
        content: generateTypeORMConfig(config),
      },
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateDatabaseIndexFile(),
      }
    );
  } else if (orm === 'mongoose') {
    children.push(
      {
        name: `models.${extension}`,
        type: 'file',
        content: generateMongooseModels(config),
      },
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateDatabaseIndexFile(),
      }
    );
  } else if (orm === 'knex') {
    children.push(
      {
        name: `knexfile.${extension}`,
        type: 'file',
        content: generateKnexConfig(config),
      },
      {
        name: `index.${extension}`,
        type: 'file',
        content: generateDatabaseIndexFile(),
      }
    );
  }

  return {
    name: 'database',
    type: 'folder',
    children,
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
        children: [
          {
            name: 'auth.service.test.ts',
            type: 'file',
            content: generateBackendAuthServiceUnitTest(),
          },
          {
            name: 'user.service.test.ts',
            type: 'file',
            content: generateBackendUserServiceUnitTest(),
          },
        ],
      },
      {
        name: 'integration',
        type: 'folder',
        children: [
          {
            name: 'health-route.test.ts',
            type: 'file',
            content: generateBackendHealthRouteIntegrationTest(),
          },
        ],
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
