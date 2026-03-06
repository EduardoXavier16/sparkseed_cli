import chalk from 'chalk';
import { Command } from 'commander';
import * as fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import * as path from 'path';
import { getAvailablePlugins, installPlugin, Plugin } from './plugin-registry';

export function registerPluginCommands(program: Command): void {
  // List plugins
  program
    .command('plugins:list')
    .description('List available plugins')
    .action(() => {
      const plugins = getAvailablePlugins();

      console.log(chalk.green('\n🌱 Available SparkSeed Plugins\n'));
      console.log(chalk.gray('Use `sparkseed plugins:install <name>` to install\n'));

      plugins.forEach((plugin, index) => {
        console.log(chalk.green(`${index + 1}. ${chalk.bold(plugin.name)}`));
        console.log(chalk.gray(`   ${plugin.description}`));
        console.log(chalk.gray(`   Version: ${plugin.version}`));
        console.log();
      });
    });

  // Install plugin
  program
    .command('plugins:install [plugin]')
    .description('Install a plugin')
    .action(async (pluginName) => {
      const projectRoot = process.cwd();
      const pluginsDir = path.join(projectRoot, 'plugins');

      let plugin: Plugin | null = null;

      if (pluginName) {
        plugin = installPlugin(pluginName);
        if (!plugin) {
          console.error(chalk.red(`Plugin not found: ${pluginName}`));
          console.log(chalk.yellow('\nAvailable plugins:'));
          getAvailablePlugins().forEach((p) => console.log(`  - ${p.name}`));
          process.exit(1);
        }
      } else {
        // Interactive selection
        const plugins = getAvailablePlugins();
        const { selectedPlugin } = await inquirer.prompt<{ selectedPlugin: string }>([
          {
            type: 'list',
            name: 'selectedPlugin',
            message: 'Select a plugin to install:',
            choices: plugins.map((p) => ({
              name: `${p.name} - ${p.description}`,
              value: p.name,
            })),
          },
        ]);

        plugin = installPlugin(selectedPlugin);
      }

      if (!plugin) {
        console.error(chalk.red('Failed to install plugin'));
        process.exit(1);
      }

      const spinner = ora(chalk.green(`Installing ${plugin.name}...`)).start();

      try {
        // Create plugins directory
        if (!fs.existsSync(pluginsDir)) {
          fs.mkdirSync(pluginsDir, { recursive: true });
        }

        // Create plugin directory
        const pluginDir = path.join(pluginsDir, plugin.name.replace('@', '').replace('/', '-'));
        if (!fs.existsSync(pluginDir)) {
          fs.mkdirSync(pluginDir, { recursive: true });
        }

        // Write plugin files
        for (const file of plugin.files) {
          const filePath = path.join(projectRoot, file.path);
          const dirPath = path.dirname(filePath);

          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }

          fs.writeFileSync(filePath, file.content, 'utf-8');
        }

        // Update package.json
        const packageJsonPath = path.join(projectRoot, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

          // Add dependencies
          if (plugin.dependencies) {
            packageJson.dependencies = {
              ...packageJson.dependencies,
              ...plugin.dependencies,
            };
          }

          fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        }

        // Update plugin config
        const pluginConfigPath = path.join(projectRoot, 'sparkseed.config.json');
        if (fs.existsSync(pluginConfigPath)) {
          const config = JSON.parse(fs.readFileSync(pluginConfigPath, 'utf-8'));
          config.plugins.enabled.push(plugin.name);
          config.plugins.options[plugin.name] = plugin.config;
          fs.writeFileSync(pluginConfigPath, JSON.stringify(config, null, 2));
        }

        spinner.succeed(chalk.green(`${plugin.name} installed successfully!`));

        console.log(chalk.green('\n📦 Next steps:'));
        console.log(chalk.gray('1. Run `npm install` to install dependencies'));
        console.log(chalk.gray(`2. Configure the plugin in sparkseed.config.json`));
        console.log(chalk.gray('3. Import and use the plugin in your code'));

        if (plugin.config) {
          console.log(chalk.yellow('\n⚙️  Configuration:'));
          console.log(chalk.gray(JSON.stringify(plugin.config, null, 2)));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to install plugin'));
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // Uninstall plugin
  program
    .command('plugins:uninstall <plugin>')
    .description('Uninstall a plugin')
    .action(async (pluginName) => {
      const projectRoot = process.cwd();
      const spinner = ora(chalk.yellow(`Uninstalling ${pluginName}...`)).start();

      try {
        const plugin = installPlugin(pluginName);

        if (plugin) {
          // Remove plugin files
          for (const file of plugin.files) {
            const filePath = path.join(projectRoot, file.path);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        }

        // Remove from plugin config
        const pluginConfigPath = path.join(projectRoot, 'sparkseed.config.json');
        if (fs.existsSync(pluginConfigPath)) {
          const config = JSON.parse(fs.readFileSync(pluginConfigPath, 'utf-8'));
          config.plugins.enabled = config.plugins.enabled.filter((p: string) => p !== pluginName);
          delete config.plugins.options[pluginName];
          fs.writeFileSync(pluginConfigPath, JSON.stringify(config, null, 2));
        }

        spinner.succeed(chalk.green(`${pluginName} uninstalled successfully!`));
        console.log(chalk.yellow('\n📝 Note: You may want to run `npm uninstall` to remove dependencies'));
      } catch (error) {
        spinner.fail(chalk.red('Failed to uninstall plugin'));
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // Plugin info
  program
    .command('plugins:info <plugin>')
    .description('Show plugin information')
    .action((pluginName) => {
      const plugin = installPlugin(pluginName);

      if (!plugin) {
        console.error(chalk.red(`Plugin not found: ${pluginName}`));
        process.exit(1);
      }

      console.log(chalk.green(`\n🌱 ${plugin.name}\n`));
      console.log(chalk.gray(plugin.description));
      console.log();
      console.log(chalk.green('Version:'), plugin.version);
      console.log(chalk.green('Dependencies:'));
      Object.entries(plugin.dependencies).forEach(([dep, version]) => {
        console.log(chalk.gray(`  - ${dep}: ${version}`));
      });
      console.log();
      console.log(chalk.green('Files:'));
      plugin.files.forEach((file) => {
        console.log(chalk.gray(`  - ${file.path}`));
      });
      console.log();
      if (plugin.config) {
        console.log(chalk.green('Configuration:'));
        console.log(chalk.gray(JSON.stringify(plugin.config, null, 2)));
      }
    });
}
