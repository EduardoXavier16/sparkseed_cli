import type { ProjectConfig } from '../types';

export function generateBackendPackageJson(config: ProjectConfig): string {
  const orm = config.orm || 'prisma';
  
  const ormDependencies: Record<string, { dependencies: Record<string, string>; devDependencies: Record<string, string>; scripts: Record<string, string> }> = {
    prisma: {
      dependencies: {
        '@prisma/client': '^5.7.0',
      },
      devDependencies: {
        prisma: '^5.7.0',
      },
      scripts: {
        'db:migrate': 'prisma migrate dev',
        'db:generate': 'prisma generate',
      },
    },
    drizzle: {
      dependencies: {
        'drizzle-orm': '^0.29.0',
        postgres: '^3.4.0',
      },
      devDependencies: {
        'drizzle-kit': '^0.20.0',
      },
      scripts: {
        'db:generate': 'drizzle-kit generate:pg',
        'db:migrate': 'drizzle-kit migrate',
      },
    },
    sequelize: {
      dependencies: {
        sequelize: '^6.35.0',
        'pg': '^8.11.0',
        'pg-hstore': '^2.3.4',
      },
      devDependencies: {
        'sequelize-cli': '^6.6.0',
      },
      scripts: {
        'db:migrate': 'sequelize-cli db:migrate',
        'db:seed': 'sequelize-cli db:seed:all',
      },
    },
    typeorm: {
      dependencies: {
        'typeorm': '^0.3.17',
        'pg': '^8.11.0',
        'reflect-metadata': '^0.1.13',
      },
      devDependencies: {
        '@types/reflect-metadata': '^0.1.0',
      },
      scripts: {
        'db:migrate': 'typeorm migration:run',
        'db:generate': 'typeorm migration:generate',
      },
    },
    mongoose: {
      dependencies: {
        mongoose: '^8.0.0',
      },
      devDependencies: {},
      scripts: {
        'db:migrate': 'echo "Migrations handled by Mongoose schemas"',
      },
    },
    knex: {
      dependencies: {
        knex: '^3.1.0',
        'pg': '^8.11.0',
      },
      devDependencies: {},
      scripts: {
        'db:migrate': 'knex migrate:latest',
        'db:generate': 'knex migrate:make',
      },
    },
  };

  const ormConfig = ormDependencies[orm];

  // Optional database services
  const features = config.features || [];
  const optionalDependencies: Record<string, string> = {};
  const optionalDevDependencies: Record<string, string> = {};

  if (features.includes('cache') || features.includes('session')) {
    optionalDependencies.ioredis = '^5.3.0';
  }

  if (config.database === 'supabase' || features.includes('supabase')) {
    optionalDependencies['@supabase/supabase-js'] = '^2.38.0';
  }

  return JSON.stringify(
    {
      name: `${config.projectName}-backend`,
      private: true,
      version: '1.0.0',
      main: 'dist/index.js',
      scripts: {
        dev: 'tsx watch src/index.ts',
        build: 'tsc',
        start: 'node dist/index.js',
        lint: 'biome lint .',
        'lint:eslint': 'eslint . --ext .ts',
        format: 'biome format .',
        test: 'vitest',
        'test:watch': 'vitest --watch',
        'test:coverage': 'vitest --coverage',
        ...ormConfig.scripts,
      },
      dependencies: {
        ...ormConfig.dependencies,
        bcrypt: '^5.1.0',
        cors: '^2.8.5',
        dotenv: '^16.3.0',
        express: '^4.18.0',
        jsonwebtoken: '^9.0.0',
        winston: '^3.11.0',
        zod: '^3.22.0',
      },
      devDependencies: {
        '@types/bcrypt': '^5.0.0',
        '@types/cors': '^2.8.0',
        '@types/express': '^4.17.0',
        '@types/jsonwebtoken': '^9.0.0',
        '@types/node': '^20.10.0',
        '@biomejs/biome': '^1.8.0',
        ...ormConfig.devDependencies,
        tsx: '^4.6.0',
        typescript: '^5.3.0',
        vitest: '^1.0.0',
        supertest: '^6.4.2',
      },
    },
    null,
    2
  );
}

export function generateBackendTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        moduleResolution: 'node',
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
          '@controllers/*': ['./src/controllers/*'],
          '@services/*': ['./src/services/*'],
          '@models/*': ['./src/models/*'],
          '@middlewares/*': ['./src/middlewares/*'],
          '@routes/*': ['./src/routes/*'],
          '@utils/*': ['./src/utils/*'],
          '@types/*': ['./src/types/*'],
          '@config/*': ['./src/config/*'],
        },
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'tests'],
    },
    null,
    2
  );
}

export function generateBackendVitestConfig(): string {
  return [
    "import { defineConfig } from 'vitest/config';",
    '',
    'export default defineConfig({',
    '  test: {',
    "    environment: 'node',",
    '    globals: true,',
    "    include: ['tests/**/*.test.ts'],",
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

export function generateBackendEnvExample(config: ProjectConfig): string {
  const databaseUrl = `"postgresql://user:password@localhost:5432/${config.projectName}?schema=public"`;

  return [
    '# Server Configuration',
    'PORT=3000',
    'NODE_ENV=development',
    '',
    '# Database Configuration',
    `DATABASE_URL=${databaseUrl}`,
    '',
    '# JWT Configuration',
    '# SECURITY: You MUST change this secret in production and keep it private.',
    'JWT_SECRET=your-super-secret-jwt-key-change-in-production',
    'JWT_EXPIRES_IN=7d',
    '',
    '# Logging',
    'LOG_LEVEL=info',
    '',
  ].join('\n');
}

export function generateBackendGitignore(): string {
  return [
    'node_modules',
    'dist',
    '.env',
    '.env.local',
    '*.log',
    'logs/',
    'coverage',
    '.DS_Store',
    '',
  ].join('\n');
}

export function generateBackendBiomeConfig(): string {
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
