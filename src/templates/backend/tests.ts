import type { ProjectStructure } from '../types';

export function generateBackendAuthServiceUnitTest(): string {
  return [
    "import { describe, it, expect } from 'vitest';",
    "import { authService } from '../src/services/auth.service';",
    '',
    "describe('authService', () => {",
    "  it('exposes register, login, logout and getUserById methods', () => {",
    "    expect(typeof authService.register).toBe('function');",
    "    expect(typeof authService.login).toBe('function');",
    "    expect(typeof authService.logout).toBe('function');",
    "    expect(typeof authService.getUserById).toBe('function');",
    '  });',
    '',
    "  it.skip('registers a new user (requires configured test database)', async () => {",
    '    expect(true).toBe(true);',
    '  });',
    '});',
    '',
  ].join('\n');
}

export function generateBackendUserServiceUnitTest(): string {
  return [
    "import { describe, it, expect } from 'vitest';",
    "import { userService } from '../src/services/user.service';",
    '',
    "describe('userService', () => {",
    "  it('exposes getUserById and updateUser methods', () => {",
    "    expect(typeof userService.getUserById).toBe('function');",
    "    expect(typeof userService.updateUser).toBe('function');",
    '  });',
    '',
    "  it.skip('updates a user profile (requires configured test database)', async () => {",
    '    expect(true).toBe(true);',
    '  });',
    '});',
    '',
  ].join('\n');
}

export function generateBackendHealthRouteIntegrationTest(): string {
  return [
    "import request from 'supertest';",
    "import app from '../src/app';",
    '',
    "describe('Health route', () => {",
    "  it('returns a 200 status with ok payload', async () => {",
    "    const response = await request(app).get('/health');",
    '    expect(response.status).toBe(200);',
    "    expect(response.body.status).toBe('ok');",
    "    expect(typeof response.body.timestamp).toBe('string');",
    '  });',
    '});',
    '',
  ].join('\n');
}

export function generateBackendTestsFolder(): ProjectStructure {
  return {
    name: 'tests',
    type: 'folder',
    children: [
      {
        name: 'unit',
        type: 'folder',
        children: [{ name: '.gitkeep', type: 'file' }],
      },
      {
        name: 'integration',
        type: 'folder',
        children: [{ name: '.gitkeep', type: 'file' }],
      },
    ],
  };
}

export function generateBackendLogsFolder(): ProjectStructure {
  return {
    name: 'logs',
    type: 'folder',
    children: [{ name: '.gitkeep', type: 'file' }],
  };
}
