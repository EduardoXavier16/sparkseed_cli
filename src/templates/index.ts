// Frontend configs
export {
  generatePackageJson,
  generateTsConfig,
  generateNodeTsConfig,
  generateVitestConfig,
  generatePlaywrightConfig,
  generateViteConfig,
  generateEslintConfig,
  generatePrettierConfig,
  generateBiomeConfig,
} from './frontend-configs/package-json';

export { generateGitignore, generateEnvExample } from './frontend-configs/gitignore';

// Backend configs
export {
  generateBackendPackageJson,
  generateBackendTsConfig,
  generateBackendVitestConfig,
  generateBackendEnvExample,
  generateBackendGitignore,
  generateBackendBiomeConfig,
} from './backend-configs/backend-package-json';

// Components
export {
  generateComponentTemplate,
  generateComponentStyles,
  generateComponentTest,
  generatePageTemplate,
  generatePlaywrightAuthSpec,
  generatePlaywrightNavigationSpec,
} from './components/component-templates';

export {
  generateUseAuthHook,
  generateUseThemeHook,
  generateAuthContext,
  generateThemeContext,
} from './components/contexts';

// Frontend
export { generateApiService, generateAuthService, generateMainFile } from './frontend/services-and-store';

export { generateZustandStore, generateReduxStore, generateReduxHooks } from './frontend/services-and-store';

export { generateGlobalStyles, generateCssVariables, generateIndexHtml } from './frontend/styles';

// Utils
export { generateCnUtility, generateFormatUtility, generateTypesIndex } from './utils/utilities';

// Database
export {
  generatePrismaSchema,
  generateDatabaseIndexFile,
  generateDrizzleSchema,
  generateDrizzleIndex,
  generateSequelizeModels,
  generateSequelizeIndex,
  generateTypeORMConfig,
  generateMongooseModels,
  generateKnexConfig,
  generateRedisConfig,
  generateSupabaseClient,
  generateRedisDockerCompose,
} from './database';

// CI/CD
export { generateDockerCompose, generateGitHubActionsWorkflow } from './ci-cd/workflows';

// SEO
export { generateSitemapXml, generateRobotsTxt } from './seo/sitemap';

// Backend
export {
  generateBackendIndexFile,
  generateBackendAppFile,
  generateBackendConfigFile,
} from './backend/app-files';

export {
  generateRoutesIndexFile,
  generateAuthRoutesFile,
  generateUserRoutesFile,
  generateAuthControllerFile,
  generateUserControllerFile,
} from './backend/routes-and-controllers';

export {
  generateAuthServiceBackend,
  generateUserServiceBackend,
  generateAuthMiddlewareFile,
  generateErrorMiddlewareFile,
  generateLoggerFile,
  generateHttpErrorFile,
} from './backend/services-and-middlewares';

export {
  generateBackendAuthServiceUnitTest,
  generateBackendUserServiceUnitTest,
  generateBackendHealthRouteIntegrationTest,
} from './backend/tests';

// Docs
export { generateReadme } from './docs/readme';

export { generateArchitectureDoc } from './docs/architecture';

export { generateQaGuide, generateAccessibilityDoc } from './docs/qa-and-accessibility';

export { generateApiDoc } from './docs/api';

export { generateDomainModelDoc, generateScreensMapDoc } from './docs/domain-and-screens';

export { generateReleaseChecklist } from './docs/release-checklist';

export { generateAgentGuide } from './docs/agent-guide';

export { generateOpenAPISpec, generateSwaggerUI } from './docs/openapi';

export {
  generateStorybookMainConfig,
  generateStorybookPreviewConfig,
  generateComponentStory,
  generateStorybookPackageJson,
  generateViteStorybookConfig,
} from './docs/storybook';

// Deploy
export {
  generateVercelConfig,
  generateNetlifyConfig,
  generateRailwayToml,
  generateRenderYaml,
  generateDockerfile,
  generateNginxConfig,
  generateDeployGuide,
} from './deploy';

export {
  generateSentryConfig,
  generateDatadogConfig,
  generateNewRelicConfig,
  generatePrometheusConfig,
  generateGrafanaDashboard,
  generateMonitoringGuide,
} from './deploy/monitoring';
