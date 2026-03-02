#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';
import * as path from 'path';
import { formatDesignSystem, generateDesignSystem } from './generators/design-system-generator';
import { writeProjectToDisk } from './generators/file-writer';
import { formatPRD, generatePRD } from './generators/prd-generator';
import { generateProjectStructure } from './generators/project-structure';
import { askProjectQuestions } from './prompts/project-prompts';

const program = new Command();

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
      console.log(chalk.blue('\n🚀 Welcome to sparkseed!\n'));
      console.log(chalk.gray('We will ask you a few questions to configure your project.\n'));

      // Ask questions
      const config = await askProjectQuestions();

      console.log(chalk.blue('\n⚙️  Generating documents and project structure...\n'));

      // Generate PRD
      const prdSpinner = ora('Generating PRD...').start();
      const prd = generatePRD(config);
      const prdMarkdown = formatPRD(prd);
      prdSpinner.succeed('PRD generated!');

      // Generate Design System
      const dsSpinner = ora('Generating Design System...').start();
      const designSystem = generateDesignSystem(config);
      const dsMarkdown = formatDesignSystem(designSystem);
      dsSpinner.succeed('Design System generated!');

      // Generate project structure
      const structureSpinner = ora('Generating file structure...').start();
      const structure = generateProjectStructure(config);
      structureSpinner.succeed('Structure generated!');

      // Write to disk
      const targetDir = path.resolve(process.cwd(), directory);
      await writeProjectToDisk(structure, targetDir, prdMarkdown, dsMarkdown);

      // Summary
      console.log(chalk.green('\n✅ Project successfully created!\n'));
      console.log(chalk.gray('📁 Structure created at:'), chalk.cyan(targetDir));
      console.log('\n📋 Generated documents:');
      console.log(chalk.gray('  - docs/PRD.md'));
      console.log(chalk.gray('  - docs/DESIGN_SYSTEM.md'));
      console.log(chalk.gray('  - docs/ARCHITECTURE.md'));
      if (config.type === 'fullstack' || config.type === 'api') {
        console.log(chalk.gray('  - docs/API.md'));
      }

      console.log('\n🚀 Next steps:');
      console.log(chalk.gray(`  cd ${directory}`));
      console.log(chalk.gray('  npm install'));
      console.log(chalk.gray('  npm run dev'));

      console.log(chalk.blue('\n📖 Check the documentation in docs/ for more details.\n'));
    } catch (error) {
      console.error(chalk.red('\n❌ Erro ao criar projeto:'));
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Inicializar CLI interativa (atalho para create)')
  .action(async () => {
    program.parse(['node', 'sparkseed', 'create']);
  });

program.parse();
