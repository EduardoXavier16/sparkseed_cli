#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import * as fs from 'fs';
import ora from 'ora';
import * as path from 'path';
import { registerAiCommands } from './ai';
import { registerPluginCommands } from './plugins';
import {
  formatDesignSystem,
  generateDesignSystem,
} from './generators/design-system/design-system-generator';
import { writeProjectToDisk } from './generators/file-writer';
import { formatPRD, generatePRD } from './generators/prd/prd-generator';
import { generateProjectStructure } from './generators/project-structure/builder';
import { askProjectQuestions } from './prompts/project-prompts';
import {
  generateComponentStyles,
  generateComponentTemplate,
  generateComponentTest,
  generatePageTemplate,
  generatePageTest,
} from './subgenerators/component-generator';
import { getProjectRoot, writeFilesToDisk } from './subgenerators/file-writer';
import { askComponentConfig, askPageConfig, askResourceConfig } from './subgenerators/prompts';
import {
  generateController,
  generateResourceTest,
  generateRoutes,
  generateService,
} from './subgenerators/resource-generator';
import type { ComponentConfig, PageConfig, ResourceConfig } from './subgenerators/types';
import type { SupportedLanguage } from './types';

interface ICliMessages {
  readonly generatingDocs: string;
  readonly prdStart: string;
  readonly prdSuccess: string;
  readonly dsStart: string;
  readonly dsSuccess: string;
  readonly structureStart: string;
  readonly structureSuccess: string;
  readonly summaryTitle: string;
  readonly structureAtLabel: string;
  readonly generatedDocsTitle: string;
  readonly docPrd: string;
  readonly docDesignSystem: string;
  readonly docArchitecture: string;
  readonly docApi: string;
  readonly nextStepsTitle: string;
  readonly stepCdPrefix: string;
  readonly stepInstall: string;
  readonly stepDev: string;
  readonly docsHint: string;
}

const CLI_MESSAGES: Record<SupportedLanguage, ICliMessages> = {
  en: {
    generatingDocs: '\n⚙️  Generating documents and project structure...\n',
    prdStart: 'Generating PRD...',
    prdSuccess: 'PRD generated!',
    dsStart: 'Generating Design System...',
    dsSuccess: 'Design System generated!',
    structureStart: 'Generating file structure...',
    structureSuccess: 'Structure generated!',
    summaryTitle: '\n✅ Project successfully created!\n',
    structureAtLabel: '📁 Structure created at:',
    generatedDocsTitle: '\n📋 Generated documents:',
    docPrd: '  - docs/PRD.md',
    docDesignSystem: '  - docs/DESIGN_SYSTEM.md',
    docArchitecture: '  - docs/ARCHITECTURE.md',
    docApi: '  - docs/API.md',
    nextStepsTitle: '\n🚀 Next steps:',
    stepCdPrefix: '  cd ',
    stepInstall: '  npm install',
    stepDev: '  npm run dev',
    docsHint: '\n📖 Check the documentation in docs/ for more details.\n',
  },
  pt: {
    generatingDocs: '\n⚙️  Gerando documentos e estrutura do projeto...\n',
    prdStart: 'Gerando PRD...',
    prdSuccess: 'PRD gerado!',
    dsStart: 'Gerando Design System...',
    dsSuccess: 'Design System gerado!',
    structureStart: 'Gerando estrutura de arquivos...',
    structureSuccess: 'Estrutura gerada!',
    summaryTitle: '\n✅ Projeto criado com sucesso!\n',
    structureAtLabel: '📁 Estrutura criada em:',
    generatedDocsTitle: '\n📋 Documentos gerados:',
    docPrd: '  - docs/PRD.md',
    docDesignSystem: '  - docs/DESIGN_SYSTEM.md',
    docArchitecture: '  - docs/ARCHITECTURE.md',
    docApi: '  - docs/API.md',
    nextStepsTitle: '\n🚀 Próximos passos:',
    stepCdPrefix: '  cd ',
    stepInstall: '  npm install',
    stepDev: '  npm run dev',
    docsHint: '\n📖 Veja a documentação em docs/ para mais detalhes.\n',
  },
  es: {
    generatingDocs: '\n⚙️  Generando documentos y estructura del proyecto...\n',
    prdStart: 'Generando PRD...',
    prdSuccess: 'PRD generado!',
    dsStart: 'Generando Design System...',
    dsSuccess: 'Design System generado!',
    structureStart: 'Generando estructura de archivos...',
    structureSuccess: 'Estructura generada!',
    summaryTitle: '\n✅ Proyecto creado con éxito!\n',
    structureAtLabel: '📁 Estructura creada en:',
    generatedDocsTitle: '\n📋 Documentos generados:',
    docPrd: '  - docs/PRD.md',
    docDesignSystem: '  - docs/DESIGN_SYSTEM.md',
    docArchitecture: '  - docs/ARCHITECTURE.md',
    docApi: '  - docs/API.md',
    nextStepsTitle: '\n🚀 Próximos pasos:',
    stepCdPrefix: '  cd ',
    stepInstall: '  npm install',
    stepDev: '  npm run dev',
    docsHint: '\n📖 Consulta la documentación en docs/ para más detalles.\n',
  },
};

const SHORT_VERSION_FLAG = '-v';
const SHORT_VERSION_COMMAND = 'v';
const BUILTIN_VERSION_FLAG = '-V';
const LONG_VERSION_OPTION = '--version';

function getCliLanguage(): SupportedLanguage {
  const envLanguage = process.env.SPARKSEED_CLI_LANG;
  if (envLanguage === 'pt' || envLanguage === 'es') {
    return envLanguage;
  }
  return 'en';
}

function resolveFrontendSrcPath(projectRoot: string): string {
  const frontendSrcPath = path.join(projectRoot, 'src');
  if (fs.existsSync(frontendSrcPath)) {
    return frontendSrcPath;
  }

  const monorepoFrontendSrcPath = path.join(projectRoot, 'frontend', 'src');
  if (fs.existsSync(monorepoFrontendSrcPath)) {
    return monorepoFrontendSrcPath;
  }

  return frontendSrcPath;
}

function resolveBackendSrcPath(projectRoot: string): string {
  const backendSrcPath = path.join(projectRoot, 'src');
  if (fs.existsSync(backendSrcPath)) {
    return backendSrcPath;
  }

  const monorepoBackendSrcPath = path.join(projectRoot, 'backend', 'src');
  if (fs.existsSync(monorepoBackendSrcPath)) {
    return monorepoBackendSrcPath;
  }

  return backendSrcPath;
}

const program = new Command();

const writeLine = (message: string): void => {
  process.stdout.write(`${message}\n`);
};

program
  .name('sparkseed')
  .description('Interactive CLI to generate complete project boilerplates')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new project')
  .argument('[directory]', 'Directory where the project will be created', '.')
  .action(async (directory: string) => {
    try {
      writeLine(chalk.blue('\n🚀 Welcome to sparkseed!\n'));
      writeLine(
        chalk.gray(
          'We will first ask you which language you prefer for the interactive questions.\n'
        )
      );

      // Ask questions
      const config = await askProjectQuestions();
      const language: SupportedLanguage = config.cliLanguage ?? 'en';
      const messages = CLI_MESSAGES[language];

      writeLine(chalk.blue(messages.generatingDocs));

      // Generate PRD
      const prdSpinner = ora(messages.prdStart).start();
      const prd = generatePRD(config);
      const prdMarkdown = formatPRD(prd, config.cliLanguage);
      prdSpinner.succeed(messages.prdSuccess);

      // Generate Design System
      const dsSpinner = ora(messages.dsStart).start();
      const designSystem = generateDesignSystem(config);
      const dsMarkdown = formatDesignSystem(designSystem, config.cliLanguage);
      dsSpinner.succeed(messages.dsSuccess);

      // Generate project structure
      const structureSpinner = ora(messages.structureStart).start();
      const structure = generateProjectStructure(config);
      structureSpinner.succeed(messages.structureSuccess);

      // Write to disk
      const targetDir = path.resolve(process.cwd(), directory);
      await writeProjectToDisk(structure, targetDir, prdMarkdown, dsMarkdown, config.cliLanguage);

      // Summary
      writeLine(chalk.green(messages.summaryTitle));
      writeLine(`${chalk.gray(messages.structureAtLabel)} ${chalk.cyan(targetDir)}`);
      writeLine(messages.generatedDocsTitle);
      writeLine(chalk.gray(messages.docPrd));
      writeLine(chalk.gray(messages.docDesignSystem));
      writeLine(chalk.gray(messages.docArchitecture));
      if (config.type === 'fullstack' || config.type === 'api') {
        writeLine(chalk.gray(messages.docApi));
      }

      writeLine(messages.nextStepsTitle);
      writeLine(chalk.gray(`${messages.stepCdPrefix}${directory}`));
      writeLine(chalk.gray(messages.stepInstall));
      writeLine(chalk.gray(messages.stepDev));

      writeLine(chalk.blue(messages.docsHint));
    } catch (error) {
      console.error(chalk.red('\n❌ Error while creating project:'));
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize interactive CLI (shortcut for create)')
  .action(async () => {
    program.parse(['node', 'sparkseed', 'create']);
  });

program
  .command('generate:component')
  .description('Generate a new React component in the current project')
  .action(async () => {
    const spinner = ora('Generating component...').start();

    try {
      const language = getCliLanguage();
      const projectRoot = getProjectRoot();
      const srcDir = resolveFrontendSrcPath(projectRoot);

      const componentAnswers = await askComponentConfig(language);
      const componentConfig: ComponentConfig = {
        componentName: componentAnswers.componentName,
        description: componentAnswers.description,
        withStyles: componentAnswers.withStyles,
        withTest: componentAnswers.withTest,
        projectName: path.basename(projectRoot),
        language: 'typescript',
        framework: 'react',
        styling: 'tailwind',
      };

      const componentDir = path.join(srcDir, 'components', componentConfig.componentName);
      const isTypescript = componentConfig.language === 'typescript';
      const ext = isTypescript ? 'tsx' : 'jsx';

      const files: { filePath: string; content: string }[] = [];

      files.push({
        filePath: path.relative(
          projectRoot,
          path.join(componentDir, `${componentConfig.componentName}.${ext}`)
        ),
        content: generateComponentTemplate(componentConfig),
      });

      if (componentConfig.withStyles) {
        files.push({
          filePath: path.relative(
            projectRoot,
            path.join(
              componentDir,
              `${componentConfig.componentName}.styles.${isTypescript ? 'ts' : 'js'}`
            )
          ),
          content: generateComponentStyles(componentConfig),
        });
      }

      if (componentConfig.withTest) {
        files.push({
          filePath: path.relative(
            projectRoot,
            path.join(
              componentDir,
              `${componentConfig.componentName}.test.${isTypescript ? 'tsx' : 'jsx'}`
            )
          ),
          content: generateComponentTest(componentConfig),
        });
      }

      await writeFilesToDisk(files, projectRoot);
      spinner.succeed('Component generated successfully.');
    } catch (error) {
      spinner.fail('Failed to generate component.');
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('generate:page')
  .description('Generate a new page component in the current project')
  .action(async () => {
    const spinner = ora('Generating page...').start();

    try {
      const language = getCliLanguage();
      const projectRoot = getProjectRoot();
      const srcDir = resolveFrontendSrcPath(projectRoot);

      const pageAnswers = await askPageConfig(language);
      const pageConfig: PageConfig = {
        pageName: pageAnswers.pageName,
        description: pageAnswers.description,
        withTest: pageAnswers.withTest,
        projectName: path.basename(projectRoot),
        language: 'typescript',
        framework: 'react',
        styling: 'tailwind',
      };

      const pagesDir = path.join(srcDir, 'pages');
      const isTypescript = pageConfig.language === 'typescript';
      const ext = isTypescript ? 'tsx' : 'jsx';

      const files: { filePath: string; content: string }[] = [];

      files.push({
        filePath: path.relative(projectRoot, path.join(pagesDir, `${pageConfig.pageName}.${ext}`)),
        content: generatePageTemplate({
          pageName: pageConfig.pageName,
          language: pageConfig.language,
          description: pageConfig.description,
        }),
      });

      if (pageConfig.withTest) {
        files.push({
          filePath: path.relative(
            projectRoot,
            path.join(pagesDir, `${pageConfig.pageName}.test.${isTypescript ? 'tsx' : 'jsx'}`)
          ),
          content: generatePageTest({
            pageName: pageConfig.pageName,
            language: pageConfig.language,
          }),
        });
      }

      await writeFilesToDisk(files, projectRoot);
      spinner.succeed('Page generated successfully.');
    } catch (error) {
      spinner.fail('Failed to generate page.');
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('generate:resource')
  .description('Generate backend resource (controller, service, routes, tests)')
  .action(async () => {
    const spinner = ora('Generating resource...').start();

    try {
      const language = getCliLanguage();
      const projectRoot = getProjectRoot();
      const srcDir = resolveBackendSrcPath(projectRoot);

      const resourceAnswers = await askResourceConfig(language);
      const resourceConfig: ResourceConfig = {
        resourceName: resourceAnswers.resourceName,
        description: resourceAnswers.description,
        withController: resourceAnswers.withController,
        withService: resourceAnswers.withService,
        withRoutes: resourceAnswers.withRoutes,
        withTest: resourceAnswers.withTest,
        projectName: path.basename(projectRoot),
        language: 'typescript',
        framework: 'express',
        styling: 'none',
      };

      const controllersDir = path.join(srcDir, 'controllers');
      const servicesDir = path.join(srcDir, 'services');
      const routesDir = path.join(srcDir, 'routes');
      const testsDir = path.join(projectRoot, 'tests', 'resources');

      const files: { filePath: string; content: string }[] = [];

      if (resourceConfig.withController) {
        files.push({
          filePath: path.relative(
            projectRoot,
            path.join(controllersDir, `${resourceConfig.resourceName}.controller.ts`)
          ),
          content: generateController(resourceConfig),
        });
      }

      if (resourceConfig.withService) {
        files.push({
          filePath: path.relative(
            projectRoot,
            path.join(servicesDir, `${resourceConfig.resourceName}.service.ts`)
          ),
          content: generateService(resourceConfig),
        });
      }

      if (resourceConfig.withRoutes) {
        files.push({
          filePath: path.relative(
            projectRoot,
            path.join(routesDir, `${resourceConfig.resourceName}.routes.ts`)
          ),
          content: generateRoutes(resourceConfig),
        });
      }

      if (resourceConfig.withTest) {
        files.push({
          filePath: path.relative(
            projectRoot,
            path.join(testsDir, `${resourceConfig.resourceName}.controller.test.ts`)
          ),
          content: generateResourceTest(resourceConfig),
        });
      }

      await writeFilesToDisk(files, projectRoot);
      spinner.succeed('Resource generated successfully.');
    } catch (error) {
      spinner.fail('Failed to generate resource.');
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Register AI commands
registerAiCommands(program);

// Register Plugin commands
registerPluginCommands(program);

const normalizedArgs = process.argv.map((arg) => {
  if (arg === SHORT_VERSION_FLAG) {
    return BUILTIN_VERSION_FLAG;
  }
  if (arg === SHORT_VERSION_COMMAND) {
    return LONG_VERSION_OPTION;
  }
  return arg;
});

program.parse(normalizedArgs);
