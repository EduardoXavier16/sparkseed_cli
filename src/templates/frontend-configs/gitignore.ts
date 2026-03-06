import type { ProjectConfig } from '../types';

export function generateGitignore(): string {
  return [
    '# Logs',
    'logs',
    '*.log',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    'pnpm-debug.log*',
    'lerna-debug.log*',
    '',
    'node_modules',
    'dist',
    'dist-ssr',
    '*.local',
    '',
    '# Editor directories and files',
    '.vscode/*',
    '!.vscode/extensions.json',
    '.idea',
    '.DS_Store',
    '*.suo',
    '*.ntvs*',
    '*.njsproj',
    '*.sln',
    '*.sw?',
    '',
    '# Environment',
    '.env',
    '.env.local',
    '.env.*.local',
    '',
    '# Test',
    'coverage',
    '',
  ].join('\n');
}

export function generateEnvExample(config: ProjectConfig): string {
  return [
    '# API Configuration',
    'VITE_API_URL=http://localhost:3000/api',
    '',
    '# App Configuration',
    `VITE_APP_NAME=${config.projectName}`,
    'VITE_APP_ENV=development',
    '',
  ].join('\n');
}
