import type { ProjectConfig } from '../types';

export function generateDockerCompose(config: ProjectConfig): string {
  const databaseUrl = `postgresql://user:password@db:5432/${config.projectName}`;

  return [
    "version: '3.8'",
    '',
    'services:',
    '  frontend:',
    '    build:',
    '      context: ./frontend',
    '      dockerfile: Dockerfile',
    '    ports:',
    '      - "3000:3000"',
    '    depends_on:',
    '      - backend',
    '',
    '  backend:',
    '    build:',
    '      context: ./backend',
    '      dockerfile: Dockerfile',
    '    ports:',
    '      - "3001:3001"',
    '    environment:',
    '      - PORT=3001',
    `      - DATABASE_URL=${databaseUrl}`,
    '    depends_on:',
    '      - db',
    '',
    '  db:',
    '    image: postgres:15-alpine',
    '    ports:',
    '      - "5432:5432"',
    '    environment:',
    '      - POSTGRES_USER=user',
    '      - POSTGRES_PASSWORD=password',
    `      - POSTGRES_DB=${config.projectName}`,
    '    volumes:',
    '      - postgres_data:/var/lib/postgresql/data',
    '',
    'volumes:',
    '  postgres_data:',
    '',
  ].join('\n');
}

export function generateGitHubActionsWorkflow(config: ProjectConfig): string {
  const hasBackend = ['api', 'fullstack'].includes(config.type);
  const isFullstack = config.type === 'fullstack';

  const steps: string[] = [];

  if (isFullstack) {
    steps.push(
      '      - name: Setup Backend',
      '        run: |',
      '          cd backend',
      '          npm ci',
      '          npx prisma generate',
      '',
      '      - name: Build Backend',
      '        run: |',
      '          cd backend',
      '          npm run build',
      '',
      '      - name: Lint Backend',
      '        run: |',
      '          cd backend',
      '          npm run lint',
      '',
      '      - name: Test Backend',
      '        run: |',
      '          cd backend',
      '          npm test',
      ''
    );
  } else if (hasBackend) {
    steps.push(
      '      - name: Setup Backend',
      '        run: |',
      '          npm ci',
      '          npx prisma generate',
      '',
      '      - name: Build Backend',
      '        run: npm run build',
      '',
      '      - name: Lint Backend',
      '        run: npm run lint',
      '',
      '      - name: Test Backend',
      '        run: npm test',
      ''
    );
  } else {
    steps.push(
      '      - name: Install dependencies',
      '        run: npm ci',
      '',
      '      - name: Build',
      '        run: npm run build',
      '',
      '      - name: Lint',
      '        run: npm run lint',
      '',
      '      - name: Test',
      '        run: npm test',
      ''
    );
  }

  if (isFullstack) {
    steps.push(
      '      - name: Setup Frontend',
      '        run: |',
      '          cd frontend',
      '          npm ci',
      '',
      '      - name: Build Frontend',
      '        run: |',
      '          cd frontend',
      '          npm run build',
      '',
      '      - name: Lint Frontend',
      '        run: |',
      '          cd frontend',
      '          npm run lint',
      '',
      '      - name: Test Frontend',
      '        run: |',
      '          cd frontend',
      '          npm test',
      ''
    );
  }

  return [
    'name: CI/CD Pipeline',
    '',
    'on:',
    '  push:',
    '    branches: [main, develop]',
    '  pull_request:',
    '    branches: [main, develop]',
    '',
    'jobs:',
    '  build-and-test:',
    '    runs-on: ubuntu-latest',
    '',
    '    steps:',
    '      - name: Checkout code',
    '        uses: actions/checkout@v4',
    '',
    '      - name: Setup Node.js',
    '        uses: actions/setup-node@v4',
    '        with:',
    "          node-version: '20'",
    "          cache: 'npm'",
    '',
    ...steps,
    '      - name: Upload coverage reports',
    '        uses: codecov/codecov-action@v4',
    '        with:',
    '          token: ${{ secrets.CODECOV_TOKEN }}',
    '          fail_ci_if_error: false',
    '',
  ].join('\n');
}
