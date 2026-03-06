import type { ProjectConfig } from '../types';

export function generateComponentTemplate(component: string, config: ProjectConfig): string {
  const componentName = component.charAt(0).toUpperCase() + component.slice(1);
  const isTailwind = config.styling === 'tailwind';

  const importStyles = isTailwind ? '' : `import './${componentName}.styles';`;

  return [
    "import React from 'react';",
    "import { cn } from '@/utils/cn';",
    importStyles,
    '',
    `export interface ${componentName}Props {`,
    '  className?: string;',
    '  children?: React.ReactNode;',
    "  variant?: 'default' | 'outline' | 'ghost' | 'link';",
    "  size?: 'sm' | 'md' | 'lg';",
    '  disabled?: boolean;',
    '  loading?: boolean;',
    '}',
    '',
    `export const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(`,
    "  ({ className, children, variant = 'default', size = 'md', disabled, loading, ...props }, ref) => {",
    '    return (',
    '      <div',
    '        ref={ref}',
    '        className={cn(',
    `          '${componentName}',`,
    "          variant === 'default' ? 'bg-primary text-white' : '',",
    "          size === 'sm' ? 'px-3 py-1 text-sm' : 'px-4 py-2',",
    '          className',
    '        )}',
    '        data-disabled={disabled}',
    '        data-loading={loading}',
    '        {...props}',
    '      >',
    '        {loading && <span className="loader">Loading...</span>}',
    '        {children}',
    '      </div>',
    '    );',
    '  }',
    ');',
    '',
    `${componentName}.displayName = '${componentName}';`,
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');
}

export function generateComponentStyles(component: string, config: ProjectConfig): string {
  const componentName = component.charAt(0).toUpperCase() + component.slice(1);

  if (config.styling === 'tailwind') {
    return `// ${componentName} component styles\n// Styles are handled via Tailwind classes in the component\n`;
  }

  if (config.styling === 'scss') {
    return [
      `.${componentName} {`,
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  gap: 0.5rem;',
      '  ',
      '  &--default {',
      '    background-color: var(--color-primary);',
      '    color: white;',
      '  }',
      '  ',
      '  &--outline {',
      '    background-color: transparent;',
      '    border: 1px solid var(--color-primary);',
      '    color: var(--color-primary);',
      '  }',
      '  ',
      '  &--ghost {',
      '    background-color: transparent;',
      '    color: var(--color-primary);',
      '  }',
      '  ',
      '  &[data-disabled] {',
      '    opacity: 0.5;',
      '    cursor: not-allowed;',
      '  }',
      '}',
      '',
    ].join('\n');
  }

  return [
    "import styled from 'styled-components';",
    '',
    `export const ${componentName}Wrapper = styled.div<{ $variant: string; $size: string }>\``,
    '  background-color: var(--color-primary);',
    '  color: white;',
    '  padding: 0.5rem 1rem;',
    '`;',
    '',
  ].join('\n');
}

export function generateComponentTest(component: string): string {
  const componentName = component.charAt(0).toUpperCase() + component.slice(1);

  return [
    "import { describe, it, expect } from 'vitest';",
    "import { render, screen } from '@testing-library/react';",
    `import ${componentName} from './${componentName}';`,
    '',
    `describe('${componentName}', () => {`,
    "  it('renders correctly', () => {",
    `    render(<${componentName}>Test</${componentName}>);`,
    "    expect(screen.getByText('Test')).toBeInTheDocument();",
    '  });',
    '',
    "  it('applies variant classes', () => {",
    `    const { container } = render(<${componentName} variant="outline">Test</${componentName}>);`,
    `    expect(container.firstChild).toHaveClass('${componentName}--outline');`,
    '  });',
    '',
    "  it('handles disabled state', () => {",
    `    render(<${componentName} disabled>Test</${componentName}>);`,
    "    expect(screen.getByText('Test')).toHaveAttribute('data-disabled');",
    '  });',
    '});',
    '',
  ].join('\n');
}

export function generatePageTemplate(page: string, config: ProjectConfig): string {
  const pageName = page.charAt(0).toUpperCase() + page.slice(1);
  const isNextJs = config.framework === 'nextjs';

  if (isNextJs) {
    return [
      `export default function ${pageName}Page() {`,
      '  return (',
      `    <div className="${page.toLowerCase()}">`,
      `      <h1>${pageName}</h1>`,
      '      <p>Page content goes here</p>',
      '    </div>',
      '  );',
      '}',
      '',
    ].join('\n');
  }

  return [
    "import React from 'react';",
    '',
    `export const ${pageName} = () => {`,
    '  return (',
    `    <div className="${page.toLowerCase()}">`,
    `      <h1>${pageName}</h1>`,
    '      <p>Page content goes here</p>',
    '    </div>',
    '  );',
    '};',
    '',
    `export default ${pageName};`,
    '',
  ].join('\n');
}

export function generatePlaywrightAuthSpec(): string {
  return [
    "import { test, expect } from '@playwright/test';",
    '',
    "test.describe('Authentication flow', () => {",
    "  test('login page renders with email and password fields', async ({ page }) => {",
    "    await page.goto('/login');",
    "    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();",
    "    await expect(page.getByLabel('Email')).toBeVisible();",
    "    await expect(page.getByLabel('Password')).toBeVisible();",
    "    await expect(page.getByRole('button')).toBeVisible();",
    '  });',
    '',
    "  test('redirects to dashboard after login in future implementation', async () => {",
    "    test.fixme(true, 'Implement login E2E when backend is configured');",
    '  });',
    '});',
    '',
  ].join('\n');
}

export function generatePlaywrightNavigationSpec(): string {
  return [
    "import { test, expect } from '@playwright/test';",
    '',
    "test.describe('Main navigation', () => {",
    "  test('home page loads with main heading', async ({ page }) => {",
    "    await page.goto('/');",
    "    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();",
    '  });',
    '',
    "  test('navigation links can be extended in future tests', async () => {",
    "    test.todo('Add checks for main navigation links once layout is finalized');",
    '  });',
    '});',
    '',
  ].join('\n');
}
