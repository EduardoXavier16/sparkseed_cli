import type { ProjectConfig } from '../types';

export function generateGlobalStyles(config: ProjectConfig): string {
  const fontFamilyBody = config.typography.fontFamily.body;

  return [
    '@tailwind base;',
    '@tailwind components;',
    '@tailwind utilities;',
    '',
    ':root {',
    `  --font-body: '${fontFamilyBody}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;`,
    '}',
    '',
    'body {',
    '  margin: 0;',
    '  font-family: var(--font-body);',
    '  background-color: #f9fafb;',
    '  color: #111827;',
    '}',
    '',
    'button:focus-visible,',
    'a:focus-visible {',
    '  outline: 2px solid var(--color-primary);',
    '  outline-offset: 2px;',
    '}',
    '',
  ].join('\n');
}

export function generateCssVariables(config: ProjectConfig): string {
  return [
    ':root {',
    `  --color-primary: ${config.colorPalette.primary};`,
    `  --color-secondary: ${config.colorPalette.secondary};`,
    `  --color-accent: ${config.colorPalette.accent};`,
    '}',
    '',
  ].join('\n');
}

export function generateIndexHtml(config: ProjectConfig): string {
  const description = config.description ?? 'Modern web application';

  return [
    '<!doctype html>',
    '<html lang="en">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    `    <title>${config.projectName}</title>`,
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `    <meta name="description" content="${description}" />`,
    '    <meta property="og:type" content="website" />',
    `    <meta property="og:title" content="${config.projectName}" />`,
    `    <meta property="og:description" content="${description}" />`,
    '    <meta property="og:url" content="https://example.com" />',
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${config.projectName}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    '  </head>',
    '  <body>',
    '    <div id="root"></div>',
    '    <script type="module" src="/src/main.tsx"></script>',
    '  </body>',
    '</html>',
    '',
  ].join('\n');
}
