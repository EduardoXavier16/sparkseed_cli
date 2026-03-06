import type { ProjectConfig } from '../types';

export function generatePackageJson(config: ProjectConfig): string {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  if (config.framework === 'react' || config.framework === 'nextjs') {
    dependencies.react = '^18.2.0';
    dependencies['react-dom'] = '^18.2.0';

    if (config.framework === 'nextjs') {
      dependencies.next = '^14.0.0';
    } else {
      dependencies['react-router-dom'] = '^6.20.0';
    }
  }

  if (config.globalState === 'zustand') {
    dependencies.zustand = '^5.0.0';
  }

  if (config.globalState === 'redux-toolkit') {
    dependencies['@reduxjs/toolkit'] = '^2.2.0';
    dependencies['react-redux'] = '^9.1.0';
  }

  if (config.styling === 'tailwind') {
    dependencies.tailwindcss = '^3.4.0';
    dependencies.postcss = '^8.4.32';
    dependencies.autoprefixer = '^10.4.16';
    dependencies.clsx = '^2.0.0';
    dependencies['tailwind-merge'] = '^2.1.0';
  } else if (config.styling === 'styled-components') {
    dependencies['styled-components'] = '^6.1.0';
  } else if (config.styling === 'chakra-ui') {
    dependencies['@chakra-ui/react'] = '^2.8.0';
    dependencies['@emotion/react'] = '^11.11.0';
    dependencies['@emotion/styled'] = '^11.11.0';
  }

  dependencies.clsx = '^2.0.0';
  dependencies.axios = '^1.6.0';

  devDependencies.typescript = '^5.3.0';
  devDependencies.vite = '^5.0.0';
  devDependencies['@types/react'] = '^18.2.0';
  devDependencies['@types/react-dom'] = '^18.2.0';
  devDependencies['@vitejs/plugin-react'] = '^4.2.0';
  devDependencies.eslint = '^8.55.0';
  devDependencies['eslint-plugin-react'] = '^7.33.0';
  devDependencies['eslint-plugin-react-hooks'] = '^4.6.0';
  devDependencies.prettier = '^3.1.0';
  devDependencies['@biomejs/biome'] = '^1.8.0';
  devDependencies.vitest = '^1.0.0';
  devDependencies['@testing-library/react'] = '^14.1.0';
  devDependencies['@testing-library/jest-dom'] = '^6.1.0';
  devDependencies['@playwright/test'] = '^1.43.0';

  return JSON.stringify(
    {
      name: config.projectName,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        lint: 'biome lint .',
        'lint:eslint': 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
        'lint:eslint:fix': 'eslint . --ext ts,tsx --fix',
        format: 'biome format .',
        'format:prettier': 'prettier --write "src/**/*.{ts,tsx}"',
        test: 'vitest',
        'test:ui': 'vitest --ui',
        'test:watch': 'vitest --watch',
        'test:coverage': 'vitest --coverage',
        'test:e2e': 'playwright test',
      },
      dependencies,
      devDependencies,
    },
    null,
    2
  );
}

export function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noImplicitReturns: true,
        noImplicitThis: true,
        useUnknownInCatchVariables: true,
        exactOptionalPropertyTypes: true,
        noUncheckedIndexedAccess: true,
        forceConsistentCasingInFileNames: true,
        allowSyntheticDefaultImports: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
          '@components/*': ['./src/components/*'],
          '@pages/*': ['./src/pages/*'],
          '@hooks/*': ['./src/hooks/*'],
          '@context/*': ['./src/context/*'],
          '@services/*': ['./src/services/*'],
          '@styles/*': ['./src/styles/*'],
          '@types/*': ['./src/types/*'],
          '@utils/*': ['./src/utils/*'],
          '@assets/*': ['./src/assets/*'],
        },
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    },
    null,
    2
  );
}

export function generateNodeTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        composite: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        strict: true,
      },
      include: ['vite.config.*', 'vitest.config.*'],
    },
    null,
    2
  );
}

export function generateVitestConfig(config: ProjectConfig): string {
  const isNextJs = config.framework === 'nextjs';
  const includePatterns = isNextJs ? ["'src/**/*.{ts,tsx}'"] : ["'src/**/*.{ts,tsx}'"];

  return [
    "import { defineConfig } from 'vitest/config';",
    '',
    'export default defineConfig({',
    '  test: {',
    "    environment: 'jsdom',",
    '    globals: true,',
    `    include: [${includePatterns.join(', ')}],`,
    '    coverage: {',
    "      provider: 'v8',",
    "      reporter: ['text', 'lcov'],",
    '      thresholds: {',
    '        lines: 80,',
    '        branches: 70,',
    '        functions: 80,',
    '        statements: 80,',
    '      },',
    '    },',
    '  },',
    '});',
    '',
  ].join('\n');
}

export function generatePlaywrightConfig(config: ProjectConfig): string {
  const isNextJs = config.framework === 'nextjs';
  const defaultPort = isNextJs ? 3000 : 5173;

  return [
    "import { defineConfig } from '@playwright/test';",
    '',
    'export default defineConfig({',
    "  testDir: './tests/e2e',",
    '  use: {',
    '    baseURL: `http://localhost:' + String(defaultPort) + '`,',
    '    headless: true,',
    '  },',
    '});',
    '',
  ].join('\n');
}

export function generateViteConfig(config: ProjectConfig): string {
  const projectName = config.projectName;

  return [
    "import { defineConfig } from 'vite';",
    "import react from '@vitejs/plugin-react';",
    '',
    'const DEFAULT_PORT = 5173;',
    '',
    'export default defineConfig({',
    '  plugins: [react()],',
    '  server: {',
    '    port: Number(process.env.PORT) || DEFAULT_PORT,',
    `    open: true,`,
    `  },`,
    `  define: { __APP_NAME__: JSON.stringify('${projectName}') },`,
    '});',
    '',
  ].join('\n');
}

export function generateEslintConfig(): string {
  return [
    'module.exports = {',
    '  root: true,',
    '  env: { browser: true, es2020: true },',
    '  extends: [',
    "    'eslint:recommended',",
    "    'plugin:@typescript-eslint/recommended',",
    "    'plugin:react-hooks/recommended',",
    '  ],',
    "  ignorePatterns: ['dist', '.eslintrc.cjs'],",
    "  parser: '@typescript-eslint/parser',",
    "  plugins: ['@typescript-eslint', 'react-refresh'],",
    '  rules: {',
    "    'react-refresh/only-export-components': [",
    "      'warn',",
    '      { allowConstantExport: true },',
    '    ],',
    "    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],",
    '  },',
    '};',
    '',
  ].join('\n');
}

export function generatePrettierConfig(): string {
  return JSON.stringify(
    {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
      printWidth: 100,
      arrowParens: 'always',
    },
    null,
    2
  );
}

export function generateBiomeConfig(): string {
  return JSON.stringify(
    {
      $schema: 'https://biomejs.dev/schemas/1.8.0/schema.json',
      formatter: {
        enabled: true,
      },
      linter: {
        enabled: true,
      },
      javascript: {
        formatter: {
          quoteStyle: 'single',
          semicolons: 'asNeeded',
        },
      },
    },
    null,
    2
  );
}
