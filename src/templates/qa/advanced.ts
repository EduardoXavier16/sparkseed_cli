import type { ProjectConfig } from '../types';

export function generateK6Script(config: ProjectConfig): string {
  return `import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Ramp up to 100 users
    { duration: '1m', target: 100 },    // Stay at 100 users
    { duration: '30s', target: 200 },   // Ramp up to 200 users
    { duration: '1m', target: 200 },    // Stay at 200 users
    { duration: '30s', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests should be below 500ms
    errors: ['rate<0.1'],               // Error rate should be less than 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test home page
  let res = http.get(BASE_URL);
  check(res, {
    'home page status is 200': (r) => r.status === 200,
    'home page load time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(res.status !== 200);
  sleep(1);

  // Test health endpoint
  res = http.get(\`\${BASE_URL}/health\`);
  check(res, {
    'health endpoint status is 200': (r) => r.status === 200,
  });
  errorRate.add(res.status !== 200);
  sleep(0.5);

${
  config.auth
    ? `
  // Test login
  const loginPayload = JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  });

  res = http.post(\`\${BASE_URL}/api/auth/login\`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, {
    'login status is 200 or 401': (r) => [200, 401].includes(r.status),
  });
  errorRate.add(![200, 401].includes(res.status));
  sleep(1);
`
    : ''
}

${
  config.domainEntities && config.domainEntities.length > 0
    ? config.domainEntities.slice(0, 2).map((entity) => {
        const entityName = entity.name.toLowerCase();
        return `
  // Test ${entityName} list
  res = http.get(\`\${BASE_URL}/api/${entityName}s\`);
  check(res, {
    '${entityName} list status is 200': (r) => r.status === 200,
  });
  errorRate.add(res.status !== 200);
  sleep(0.5);
`;
      }).join('')
    : ''
}
}

export function handleSummary(data) {
  return {
    'load-test-results.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const { summary } = data;
  return \`
Load Test Results:
  - Requests: \${summary.metrics.http_reqs.values.count}
  - Request Rate: \${summary.metrics.http_reqs.values.rate.toFixed(2)}/s
  - Avg Response Time: \${summary.metrics.http_req_duration.values.avg.toFixed(2)}ms
  - P95 Response Time: \${summary.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
  - Error Rate: \${(summary.metrics.errors.values.rate * 100).toFixed(2)}%
\`;
}
`;
}

export function generateK6Config(config: ProjectConfig): string {
  return JSON.stringify(
    {
      name: `${config.projectName}-load-tests`,
      scripts: {
        'test:load': 'k6 run load-tests/script.js',
        'test:load:stress': 'k6 run --vus 500 --duration 30s load-tests/script.js',
        'test:load:soak': 'k6 run --duration 10m load-tests/script.js',
      },
    },
    null,
    2
  );
}

export function generateAxeCoreTest(config: ProjectConfig): string {
  return `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('homepage should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });

  test('all interactive elements should be focusable', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    const focusViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'keyboard'
    );
    expect(focusViolations).toHaveLength(0);
  });

  test('color contrast should meet WCAG standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );
    expect(contrastViolations).toHaveLength(0);
  });

  test('forms should have proper labels', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    const labelViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'label'
    );
    expect(labelViolations).toHaveLength(0);
  });
});
`;
}

export function generateSonarQubeConfig(config: ProjectConfig): string {
  return `# SonarQube configuration for ${config.projectName}

sonar.projectKey=${config.projectName.replace(/-/g, '_')}
sonar.organization=${config.projectName.replace(/-/g, '')}

# Source directories
sonar.sources=src
sonar.tests=tests

# Language settings
sonar.language=ts,tsx
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Exclude test files and generated code
sonar.exclusions=**/*.test.ts,**/*.spec.ts,**/node_modules/**,**/dist/**,**/coverage/**

# Test files
sonar.test.inclusions=**/*.test.ts,**/*.spec.ts

# Quality gate
sonar.qualitygate.wait=true

# Coverage requirements
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts,**/tests/**

# Code smell thresholds
sonar.issue.ignore.multicriteria=e1,e2

# Ignore function length for test files
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S138
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.test.ts

# Ignore cognitive complexity for test files
sonar.issue.ignore.multicriteria.e2.ruleKey=typescript:S3776
sonar.issue.ignore.multicriteria.e2.resourceKey=**/*.test.ts
`;
}

export function generateQAWorkflow(config: ProjectConfig): string {
  return `name: QA Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  accessibility:
    name: Accessibility Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run accessibility tests
        run: npm run test:e2e:accessibility

  load-test:
    name: Load Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci -g k6
      - name: Run load tests
        run: k6 run load-tests/script.js
        env:
          BASE_URL: \${{ secrets.TEST_BASE_URL }}

  sonarqube:
    name: SonarQube Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: \${{ secrets.SONAR_HOST_URL }}
`;
}

export function generateQAGuide(config: ProjectConfig): string {
  return `# QA Guide

This guide covers quality assurance practices for ${config.projectName}.

## Load Testing with k6

### Running Load Tests

\`\`\`bash
# Basic load test
npm run test:load

# Stress test (500 users)
npm run test:load:stress

# Soak test (10 minutes)
npm run test:load:soak
\`\`\`

### Metrics to Watch

- **Response Time (p95)**: Should be < 500ms
- **Error Rate**: Should be < 10%
- **Requests/second**: Monitor for degradation
- **Active VUs**: Track concurrent users

### Interpreting Results

\`\`\`
Load Test Results:
  - Requests: 10000
  - Request Rate: 166.67/s
  - Avg Response Time: 245.32ms
  - P95 Response Time: 432.18ms
  - Error Rate: 0.12%
\`\`\`

## Accessibility Testing with axe-core

### Running Accessibility Tests

\`\`\`bash
# Run all accessibility tests
npm run test:e2e:accessibility

# Run specific test
npm run test:e2e:accessibility -- --grep "homepage"
\`\`\`

### WCAG Levels Tested

- **WCAG 2.1 Level A**: Minimum accessibility
- **WCAG 2.1 Level AA**: Standard compliance (recommended)

### Common Violations

1. **Missing alt text**: All images must have alt attributes
2. **Color contrast**: Text must have sufficient contrast
3. **Keyboard navigation**: All interactive elements must be focusable
4. **Form labels**: All form inputs must have associated labels
5. **Heading structure**: Must have proper h1-h6 hierarchy

## Static Analysis with SonarQube

### Running Analysis

\`\`\`bash
# Local analysis
npm run sonar:scan

# Or via Docker
docker run --rm -e SONAR_HOST_URL=http://localhost:9000 sonarsource/sonar-scanner-cli
\`\`\`

### Quality Gates

The project enforces these quality gates:

- **Coverage**: > 80%
- **Code Smells**: < 5%
- **Bugs**: 0
- **Security Hotspots**: 0
- **Duplications**: < 3%

### Fixing Common Issues

1. **Code Duplication**: Extract common logic into utilities
2. **Complex Functions**: Break down into smaller functions
3. **Missing Types**: Add TypeScript types
4. **Security Issues**: Follow OWASP guidelines

## CI/CD Integration

All QA checks run automatically on:

- Push to main/develop branches
- Pull requests to main

### Required Checks

- ✅ Accessibility tests pass
- ✅ Load tests meet thresholds
- ✅ SonarQube quality gate passes
- ✅ Test coverage > 80%

## Manual Testing Checklist

### Before Release

- [ ] All automated tests pass
- [ ] Load test results are acceptable
- [ ] No accessibility violations
- [ ] SonarQube quality gate passes
- [ ] Manual smoke test completed
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified

### Performance Checklist

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1
`;
}
