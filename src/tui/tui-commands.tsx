import React from 'react';
import chalk from 'chalk';
import { Command } from 'commander';
import { render } from 'ink';
import { CreateProject } from '../tui/apps/create-project';

export function registerTUICommands(program: Command): void {
  program
    .command('tui:create')
    .description('Create a new project with TUI (Terminal User Interface)')
    .argument('[directory]', 'Directory where the project will be created', '.')
    .option('-n, --name <name>', 'Project name')
    .action(async (directory, options) => {
      const projectName = options.name || directory || 'my-awesome-project';

      console.log(chalk.green('\n🌱 Starting SparkSeed TUI...\n'));

      // Render the TUI app
      const { waitUntilExit } = render(
        <CreateProject projectName={projectName} />
      );

      await waitUntilExit();
      
      console.log(chalk.green('\n✨ Project creation completed!\n'));
    });

  program
    .command('tui:welcome')
    .description('Show welcome screen with TUI')
    .action(() => {
      const { waitUntilExit } = render(
        <CreateProject projectName="demo-project" />
      );
      waitUntilExit();
    });
}
