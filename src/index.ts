#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';
import * as path from 'path';
import {
  formatDesignSystem,
  generateDesignSystem,
} from './generators/design-system/design-system-generator';
import { writeProjectToDisk } from './generators/file-writer';
import { formatPRD, generatePRD } from './generators/prd/prd-generator';
import { generateProjectStructure } from './generators/project-structure/builder';
import { askProjectQuestions } from './prompts/project-prompts';
import type { SupportedLanguage } from './types';
import {
  generateComponentTemplate,
  generateComponentStyles,
  generateComponentTest,
  generatePageTemplate,
  generatePageTest,
} from './subgenerators/component-generator';
import {
  generateController,
  generateService,
  generateRoutes,
  generateResourceTest,
} from './subgenerators/resource-generator';
import {
  askComponentConfig,
  askPageConfig,
  askResourceConfig,
} from './subgenerators/prompts';
import { writeFilesToDisk, getProjectRoot } from './subgenerators/file-writer';

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

program.parse();
