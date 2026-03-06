import chalk from 'chalk';
import { Command } from 'commander';
import * as fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import * as path from 'path';
import { createLLMClient, LLMConfig, LLMMessage } from './llm-client';
import { formatContextForPrompt, loadProjectContext } from './project-context';

const AI_SYSTEM_PROMPT = `You are an expert software architect and developer assistant. You help developers with:
- Code analysis and explanation
- Refactoring suggestions
- Best practices and design patterns
- Debugging and troubleshooting
- Architecture decisions
- Code generation

Always provide clear, concise, and actionable advice. Include code examples when relevant.`;

export function registerAiCommands(program: Command): void {
  // AI Chat command
  program
    .command('ai:chat')
    .description('Chat with AI about your project')
    .option('-p, --provider <provider>', 'AI provider (openai, anthropic, ollama)', 'openai')
    .option('-m, --model <model>', 'Model to use')
    .option('--base-url <url>', 'Base URL for Ollama or custom providers')
    .action(async (options) => {
      try {
        const config = await getAIConfig(options);
        const projectRoot = process.cwd();
        
        console.log(chalk.blue('\n🤖 SparkSeed AI Chat\n'));
        console.log(chalk.gray(`Provider: ${config.provider} | Model: ${config.model || 'default'}\n`));
        console.log(chalk.gray('Type "exit" to quit, "clear" to clear conversation\n'));

        const client = createLLMClient(config);
        const context = await loadProjectContext(projectRoot);
        const contextText = formatContextForPrompt(context);
        
        const conversation: LLMMessage[] = [];

        while (true) {
          const { userInput } = await inquirer.prompt<{ userInput: string }>([
            {
              type: 'input',
              name: 'userInput',
              message: chalk.green('You:'),
            },
          ]);

          const input = userInput.trim().toLowerCase();
          
          if (input === 'exit' || input === 'quit') {
            console.log(chalk.blue('\n👋 Goodbye!\n'));
            break;
          }

          if (input === 'clear') {
            conversation.length = 0;
            console.log(chalk.yellow('\n💬 Conversation cleared\n'));
            continue;
          }

          if (!userInput.trim()) {
            continue;
          }

          const spinner = ora(chalk.blue('AI is thinking...')).start();
          
          try {
            const messages: LLMMessage[] = [
              ...conversation,
              { role: 'user', content: userInput },
            ];

            const fullContext = `Here's the project context:\n${contextText}\n\nUser question: ${userInput}`;
            
            const response = await client.chat(
              [{ role: 'user', content: fullContext }],
              AI_SYSTEM_PROMPT
            );

            spinner.succeed();
            console.log(chalk.cyan('\n🤖 AI:'));
            console.log(chalk.white(response.content));
            console.log();

            conversation.push({ role: 'user', content: userInput });
            conversation.push({ role: 'assistant', content: response.content });

            // Keep conversation manageable
            if (conversation.length > 20) {
              conversation.splice(0, 2);
            }
          } catch (error) {
            spinner.fail();
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
          }
        }
      } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // AI Explain command
  program
    .command('ai:explain')
    .description('Explain a specific file or code snippet')
    .argument('[file]', 'File to explain')
    .option('-p, --provider <provider>', 'AI provider (openai, anthropic, ollama)', 'openai')
    .option('-d, --detailed', 'Provide detailed explanation', false)
    .action(async (file, options) => {
      try {
        const config = await getAIConfig(options);
        const projectRoot = process.cwd();
        
        let codeToExplain = '';
        
        if (file) {
          const filePath = path.resolve(projectRoot, file);
          if (!fs.existsSync(filePath)) {
            console.error(chalk.red(`File not found: ${file}`));
            process.exit(1);
          }
          codeToExplain = await fs.promises.readFile(filePath, 'utf-8');
        } else {
          const { codeInput } = await inquirer.prompt<{ codeInput: string }>([
            {
              type: 'editor',
              name: 'codeInput',
              message: 'Enter or paste the code to explain:',
            },
          ]);
          codeToExplain = codeInput;
        }

        const spinner = ora(chalk.blue('AI is analyzing the code...')).start();
        const client = createLLMClient(config);
        
        const prompt = `Please explain this code${options.detailed ? ' in detail' : ''}. Include:
1. What the code does
2. Key patterns or techniques used
3. Any potential improvements or issues

Code:
\`\`\`
${codeToExplain.substring(0, 5000)}
\`\`\``;

        const response = await client.chat(
          [{ role: 'user', content: prompt }],
          'You are an expert code educator. Explain code clearly and concisely.'
        );

        spinner.succeed();
        console.log(chalk.cyan('\n📖 Explanation:\n'));
        console.log(chalk.white(response.content));
        console.log();
      } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // AI Refactor command
  program
    .command('ai:refactor')
    .description('Get refactoring suggestions for code')
    .argument('[file]', 'File to refactor')
    .option('-p, --provider <provider>', 'AI provider (openai, anthropic, ollama)', 'openai')
    .option('-f, --focus <focus>', 'Focus area (performance, readability, security, all)', 'all')
    .action(async (file, options) => {
      try {
        const config = await getAIConfig(options);
        const projectRoot = process.cwd();
        
        let codeToRefactor = '';
        let filePath = '';
        
        if (file) {
          filePath = path.resolve(projectRoot, file);
          if (!fs.existsSync(filePath)) {
            console.error(chalk.red(`File not found: ${file}`));
            process.exit(1);
          }
          codeToRefactor = await fs.promises.readFile(filePath, 'utf-8');
        } else {
          const { codeInput } = await inquirer.prompt<{ codeInput: string }>([
            {
              type: 'editor',
              name: 'codeInput',
              message: 'Enter or paste the code to refactor:',
            },
          ]);
          codeToRefactor = codeInput;
        }

        const spinner = ora(chalk.blue('AI is analyzing for refactoring...')).start();
        const client = createLLMClient(config);
        
        const focusAreas = {
          performance: 'Focus on performance optimizations',
          readability: 'Focus on code readability and maintainability',
          security: 'Focus on security improvements',
          all: 'Consider all aspects: performance, readability, security, and best practices',
        };

        const prompt = `Please analyze this code and suggest refactoring improvements.
${focusAreas[options.focus as keyof typeof focusAreas]}

For each suggestion:
1. Explain the issue
2. Show the refactored code
3. Explain the benefits

Code:
\`\`\`
${codeToRefactor.substring(0, 5000)}
\`\`\``;

        const response = await client.chat(
          [{ role: 'user', content: prompt }],
          'You are an expert code refactoring specialist. Provide practical, actionable refactoring suggestions.'
        );

        spinner.succeed();
        console.log(chalk.cyan('\n🔧 Refactoring Suggestions:\n'));
        console.log(chalk.white(response.content));
        console.log();

        // Ask if user wants to apply changes
        if (file) {
          const { applyChanges } = await inquirer.prompt<{ applyChanges: boolean }>([
            {
              type: 'confirm',
              name: 'applyChanges',
              message: 'Would you like to create a backup and show the refactored version?',
              default: false,
            },
          ]);

          if (applyChanges) {
            const backupPath = `${filePath}.backup.${Date.now()}`;
            await fs.promises.copyFile(filePath, backupPath);
            console.log(chalk.yellow(`\n💾 Backup created: ${backupPath}\n`));
            
            const { showRefactored } = await inquirer.prompt<{ showRefactored: boolean }>([
              {
                type: 'confirm',
                name: 'showRefactored',
                message: 'Would you like the AI to show the complete refactored version?',
                default: true,
              },
            ]);

            if (showRefactored) {
              const refactoringSpinner = ora(chalk.blue('Generating refactored code...')).start();
              
              const refactorPrompt = `Based on your previous suggestions, please provide the COMPLETE refactored version of this code.
Include all imports and the full implementation.

Code to refactor:
\`\`\`
${codeToRefactor.substring(0, 5000)}
\`\`\``;

              const refactorResponse = await client.chat(
                [{ role: 'user', content: refactorPrompt }],
                'You are an expert coder. Provide complete, production-ready refactored code.'
              );

              refactoringSpinner.succeed();
              console.log(chalk.cyan('\n✨ Refactored Code:\n'));
              console.log(chalk.white(refactorResponse.content));
              console.log();
            }
          }
        }
      } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });
}

async function getAIConfig(options: Record<string, string>): Promise<LLMConfig> {
  const config: LLMConfig = {
    provider: options.provider as LLMConfig['provider'],
    baseUrl: options.baseUrl as string | undefined,
    model: options.model as string | undefined,
  };

  // Try to get API key from environment
  if (config.provider === 'openai') {
    config.apiKey = process.env.OPENAI_API_KEY;
    if (!config.apiKey && config.provider === 'openai' && !config.baseUrl) {
      const { apiKey } = await inquirer.prompt<{ apiKey?: string }>([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your OpenAI API key (or set OPENAI_API_KEY env var):',
        },
      ]);
      config.apiKey = apiKey;
    }
  } else if (config.provider === 'anthropic') {
    config.apiKey = process.env.ANTHROPIC_API_KEY;
    if (!config.apiKey) {
      const { apiKey } = await inquirer.prompt<{ apiKey?: string }>([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your Anthropic API key (or set ANTHROPIC_API_KEY env var):',
        },
      ]);
      config.apiKey = apiKey;
    }
  }

  return config;
}
