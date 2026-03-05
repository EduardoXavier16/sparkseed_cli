import type { ProjectConfig, SupportedLanguage } from './types';

import type { ProjectStructure } from './types';

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
      },
      dependencies,
      devDependencies,
    },
    null,
    2
  );
}

export function generateTsConfig(config: ProjectConfig): string {
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

export function generateReadme(config: ProjectConfig): string {
  const hasBackend = ['api', 'fullstack'].includes(config.type);
  const language: SupportedLanguage = config.cliLanguage ?? 'en';

  if (language === 'pt') {
    return generateReadmePt(config, hasBackend);
  }

  if (language === 'es') {
    return generateReadmeEs(config, hasBackend);
  }

  return generateReadmeEn(config, hasBackend);
}

function generateReadmePt(config: ProjectConfig, hasBackend: boolean): string {
  return [
    `# ${config.projectName}`,
    '',
    config.description,
    '',
    '## 🚀 Começando',
    '',
    '### Pré-requisitos',
    '',
    '- Node.js 18+',
    '- npm/yarn/pnpm',
    '',
    '### Instalação',
    '',
    '```bash',
    '# Instalar dependências',
    'npm install',
    '',
    '# Iniciar servidor de desenvolvimento',
    'npm run dev',
    '```',
    '',
    '## 📁 Estrutura do Projeto',
    '',
    '```',
    'src/',
    '├── components/     # Componentes reutilizáveis',
    '├── pages/          # Páginas da aplicação',
    '├── hooks/          # Custom React hooks',
    '├── context/        # Contextos React',
    '├── services/       # Serviços e chamadas de API',
    '├── styles/         # Estilos globais',
    '├── types/          # Tipos TypeScript',
    '├── utils/          # Funções utilitárias',
    '└── assets/         # Imagens, ícones, fontes',
    '```',
    '',
    '## 🛠️ Stack Técnica',
    '',
    `- **Framework:** ${config.framework}`,
    `- **Linguagem:** ${config.language === 'typescript' ? 'TypeScript' : 'JavaScript'}`,
    `- **Estilização:** ${config.styling}`,
    config.database ? `- **Banco de Dados:** ${config.database}` : '',
    '',
    '## 📋 Scripts Disponíveis',
    '',
    '- `npm run dev` - Inicia o servidor de desenvolvimento',
    '- `npm run build` - Gera build de produção',
    '- `npm run preview` - Preview do build de produção',
    '- `npm run lint` - Executa ESLint',
    '- `npm run test` - Executa testes',
    '',
    '## 📖 Documentação',
    '',
    '- [PRD](./docs/PRD.md) - Documento de Requisitos de Produto',
    '- [Design System](./docs/DESIGN_SYSTEM.md)',
    '- [Arquitetura](./docs/ARCHITECTURE.md)',
    hasBackend ? '- [Documentação da API](./docs/API.md)' : '',
    '',
    '## 🤝 Contribuindo',
    '',
    '1. Faça um fork do repositório',
    '2. Crie sua branch de feature',
    '3. Faça commit das mudanças',
    '4. Envie para sua branch',
    '5. Abra um Pull Request',
    '',
    '## 📄 Licença',
    '',
    'MIT License',
    '',
  ].join('\n');
}

function generateReadmeEs(config: ProjectConfig, hasBackend: boolean): string {
  return [
    `# ${config.projectName}`,
    '',
    config.description,
    '',
    '## 🚀 Empezando',
    '',
    '### Prerrequisitos',
    '',
    '- Node.js 18+',
    '- npm/yarn/pnpm',
    '',
    '### Instalación',
    '',
    '```bash',
    '# Instalar dependencias',
    'npm install',
    '',
    '# Iniciar servidor de desarrollo',
    'npm run dev',
    '```',
    '',
    '## 📁 Estructura del Proyecto',
    '',
    '```',
    'src/',
    '├── components/     # Componentes reutilizables',
    '├── pages/          # Páginas de la aplicación',
    '├── hooks/          # Custom React hooks',
    '├── context/        # Contextos React',
    '├── services/       # Servicios y llamadas a API',
    '├── styles/         # Estilos globales',
    '├── types/          # Tipos de TypeScript',
    '├── utils/          # Funciones utilitarias',
    '└── assets/         # Imágenes, íconos, fuentes',
    '```',
    '',
    '## 🛠️ Stack Técnico',
    '',
    `- **Framework:** ${config.framework}`,
    `- **Lenguaje:** ${config.language === 'typescript' ? 'TypeScript' : 'JavaScript'}`,
    `- **Estilos:** ${config.styling}`,
    config.database ? `- **Base de Datos:** ${config.database}` : '',
    '',
    '## 📋 Scripts Disponibles',
    '',
    '- `npm run dev` - Inicia el servidor de desarrollo',
    '- `npm run build` - Genera el build de producción',
    '- `npm run preview` - Preview del build de producción',
    '- `npm run lint` - Ejecuta ESLint',
    '- `npm run test` - Ejecuta tests',
    '',
    '## 📖 Documentación',
    '',
    '- [PRD](./docs/PRD.md) - Documento de Requisitos de Producto',
    '- [Design System](./docs/DESIGN_SYSTEM.md)',
    '- [Arquitectura](./docs/ARCHITECTURE.md)',
    hasBackend ? '- [Documentación de la API](./docs/API.md)' : '',
    '',
    '## 🤝 Contribuir',
    '',
    '1. Haz un fork del repositorio',
    '2. Crea tu rama de feature',
    '3. Haz commit de tus cambios',
    '4. Haz push a la rama',
    '5. Abre un Pull Request',
    '',
    '## 📄 Licencia',
    '',
    'MIT License',
    '',
  ].join('\n');
}

function generateReadmeEn(config: ProjectConfig, hasBackend: boolean): string {
  return [
    `# ${config.projectName}`,
    '',
    config.description,
    '',
    '## 🚀 Getting Started',
    '',
    '### Prerequisites',
    '',
    '- Node.js 18+',
    '- npm/yarn/pnpm',
    '',
    '### Installation',
    '',
    '```bash',
    '# Install dependencies',
    'npm install',
    '',
    '# Start development server',
    'npm run dev',
    '```',
    '',
    '## 📁 Project Structure',
    '',
    '```',
    'src/',
    '├── components/     # Reusable components',
    '├── pages/          # Application pages',
    '├── hooks/          # Custom React hooks',
    '├── context/        # React contexts',
    '├── services/       # Services and API calls',
    '├── styles/         # Global styles',
    '├── types/          # TypeScript types',
    '├── utils/          # Utility functions',
    '└── assets/         # Images, icons, fonts',
    '```',
    '',
    '## 🛠️ Tech Stack',
    '',
    `- **Framework:** ${config.framework}`,
    `- **Language:** ${config.language === 'typescript' ? 'TypeScript' : 'JavaScript'}`,
    `- **Styling:** ${config.styling}`,
    config.database ? `- **Database:** ${config.database}` : '',
    '',
    '## 📋 Available Scripts',
    '',
    '- `npm run dev` - Start development server',
    '- `npm run build` - Build for production',
    '- `npm run preview` - Preview production build',
    '- `npm run lint` - Run ESLint',
    '- `npm run test` - Run tests',
    '',
    '## 📖 Documentation',
    '',
    '- [PRD](./docs/PRD.md) - Product Requirements Document',
    '- [Design System](./docs/DESIGN_SYSTEM.md)',
    '- [Architecture](./docs/ARCHITECTURE.md)',
    hasBackend ? '- [API Documentation](./docs/API.md)' : '',
    '',
    '## 🤝 Contributing',
    '',
    '1. Fork the repository',
    '2. Create your feature branch',
    '3. Commit your changes',
    '4. Push to the branch',
    '5. Open a Pull Request',
    '',
    '## 📄 License',
    '',
    'MIT License',
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

export function generateMainFile(): string {
  return [
    "import React from 'react';",
    "import ReactDOM from 'react-dom/client';",
    "import App from './App';",
    "import './styles/globals.css';",
    '',
    "ReactDOM.createRoot(document.getElementById('root')!).render(",
    '  <React.StrictMode>',
    '    <App />',
    '  </React.StrictMode>',
    ');',
    '',
  ].join('\n');
}

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

export function generateUseAuthHook(): string {
  return [
    "import { useContext } from 'react';",
    "import { AuthContext } from '@/context/AuthContext';",
    '',
    'export const useAuth = () => {',
    '  const context = useContext(AuthContext);',
    '  ',
    '  if (!context) {',
    "    throw new Error('useAuth must be used within an AuthProvider');",
    '  }',
    '  ',
    '  return context;',
    '};',
    '',
  ].join('\n');
}

export function generateUseThemeHook(): string {
  return [
    "import { useContext } from 'react';",
    "import { ThemeContext } from '@/context/ThemeContext';",
    '',
    'export const useTheme = () => {',
    '  const context = useContext(ThemeContext);',
    '  ',
    '  if (!context) {',
    "    throw new Error('useTheme must be used within a ThemeProvider');",
    '  }',
    '  ',
    '  return context;',
    '};',
    '',
  ].join('\n');
}

export function generateAuthContext(): string {
  return [
    "import React, { createContext, useState, useEffect, type ReactNode } from 'react';",
    "import { authService } from '@/services/auth';",
    '',
    'export interface User {',
    '  id: string;',
    '  email: string;',
    '  name: string;',
    '}',
    '',
    'export interface AuthContextType {',
    '  user: User | null;',
    '  isLoading: boolean;',
    '  isAuthenticated: boolean;',
    '  login: (email: string, password: string) => Promise<void>;',
    '  register: (name: string, email: string, password: string) => Promise<void>;',
    '  logout: () => Promise<void>;',
    '}',
    '',
    'export const AuthContext = createContext<AuthContextType | undefined>(undefined);',
    '',
    'interface AuthProviderProps {',
    '  children: ReactNode;',
    '}',
    '',
    'export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {',
    '  const [user, setUser] = useState<User | null>(null);',
    '  const [isLoading, setIsLoading] = useState(true);',
    '',
    '  useEffect(() => {',
    "    const token = localStorage.getItem('token');",
    '    if (token) {',
    '      authService',
    '        .getCurrentUser()',
    '        .then(setUser)',
    "        .catch(() => localStorage.removeItem('token'))",
    '        .finally(() => setIsLoading(false));',
    '    } else {',
    '      setIsLoading(false);',
    '    }',
    '  }, []);',
    '',
    '  const login = async (email: string, password: string) => {',
    '    const response = await authService.login(email, password);',
    "    localStorage.setItem('token', response.token);",
    '    setUser(response.user);',
    '  };',
    '',
    '  const register = async (name: string, email: string, password: string) => {',
    '    const response = await authService.register(name, email, password);',
    "    localStorage.setItem('token', response.token);",
    '    setUser(response.user);',
    '  };',
    '',
    '  const logout = async () => {',
    '    await authService.logout();',
    "    localStorage.removeItem('token');",
    '    setUser(null);',
    '  };',
    '',
    '  return (',
    '    <AuthContext.Provider',
    '      value={{ user, isLoading, isAuthenticated: user !== null, login, register, logout }}',
    '    >',
    '      {children}',
    '    </AuthContext.Provider>',
    '  );',
    '};',
    '',
  ].join('\n');
}

export function generateThemeContext(): string {
  return [
    "import React, { createContext, useState, useEffect, type ReactNode } from 'react';",
    '',
    'export type Theme = "light" | "dark";',
    '',
    'export interface ThemeContextType {',
    '  theme: Theme;',
    '  toggleTheme: () => void;',
    '}',
    '',
    'export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);',
    '',
    'interface ThemeProviderProps {',
    '  children: ReactNode;',
    '}',
    '',
    'export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {',
    "  const [theme, setTheme] = useState<Theme>('light');",
    '',
    '  useEffect(() => {',
    '    const storedTheme = window.localStorage.getItem("theme");',
    "    if (storedTheme === 'light' || storedTheme === 'dark') {",
    '      setTheme(storedTheme);',
    '    }',
    '  }, []);',
    '',
    '  useEffect(() => {',
    '    window.localStorage.setItem("theme", theme);',
    '    document.documentElement.dataset.theme = theme;',
    '  }, [theme]);',
    '',
    '  const toggleTheme = () => {',
    "    setTheme((current) => (current === 'light' ? 'dark' : 'light'));",
    '  };',
    '',
    '  return (',
    '    <ThemeContext.Provider value={{ theme, toggleTheme }}>',
    '      {children}',
    '    </ThemeContext.Provider>',
    '  );',
    '};',
    '',
  ].join('\n');
}

export function generateApiService(): string {
  return [
    "import axios from 'axios';",
    '',
    "const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';",
    '',
    'export const api = axios.create({',
    '  baseURL: API_BASE_URL,',
    '  withCredentials: true,',
    '});',
    '',
  ].join('\n');
}

export function generateAuthService(): string {
  return [
    "import type { AxiosResponse } from 'axios';",
    "import { api } from './api';",
    '',
    'interface AuthResponse {',
    '  token: string;',
    '  user: {',
    '    id: string;',
    '    email: string;',
    '    name: string;',
    '  };',
    '}',
    '',
    'export const authService = {',
    '  async register(name: string, email: string, password: string): Promise<AuthResponse> {',
    '    const response: AxiosResponse<AuthResponse> = await api.post("/auth/register", {',
    '      name,',
    '      email,',
    '      password,',
    '    });',
    '    return response.data;',
    '  },',
    '',
    '  async login(email: string, password: string): Promise<AuthResponse> {',
    '    const response: AxiosResponse<AuthResponse> = await api.post("/auth/login", {',
    '      email,',
    '      password,',
    '    });',
    '    return response.data;',
    '  },',
    '',
    '  async getCurrentUser(): Promise<AuthResponse["user"]> {',
    '    const response: AxiosResponse<AuthResponse["user"]> = await api.get("/auth/me");',
    '    return response.data;',
    '  },',
    '',
    '  async logout(): Promise<void> {',
    '    await api.post("/auth/logout");',
    '  },',
    '};',
    '',
  ].join('\n');
}

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
  return [
    '<!doctype html>',
    '<html lang="en">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    `    <title>${config.projectName}</title>`,
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  </head>',
    '  <body>',
    '    <div id="root"></div>',
    '    <script type="module" src="/src/main.tsx"></script>',
    '  </body>',
    '</html>',
    '',
  ].join('\n');
}

export function generateTypesIndex(): string {
  return ['export interface ApiResponse<T> {', '  data: T;', '  error?: string;', '}', ''].join(
    '\n'
  );
}

export function generateCnUtility(): string {
  return [
    "import type { ClassValue } from 'clsx';",
    "import { clsx } from 'clsx';",
    "import { twMerge } from 'tailwind-merge';",
    '',
    'export function cn(...inputs: ClassValue[]): string {',
    '  return twMerge(clsx(inputs));',
    '}',
    '',
  ].join('\n');
}

export function generateFormatUtility(config: ProjectConfig): string {
  const defaultLocale = config.primaryLocale ?? 'en-US';
  const defaultCurrency =
    config.database === 'postgresql' ? 'BRL' : config.database === 'mysql' ? 'USD' : 'USD';

  return [
    `const DEFAULT_LOCALE = '${defaultLocale}';`,
    `const DEFAULT_CURRENCY = '${defaultCurrency}';`,
    '',
    'export function formatDate(date: Date): string {',
    '  return new Intl.DateTimeFormat(DEFAULT_LOCALE).format(date);',
    '}',
    '',
    'export function formatCurrency(value: number, currency: string = DEFAULT_CURRENCY): string {',
    '  return new Intl.NumberFormat(DEFAULT_LOCALE, {',
    "    style: 'currency',",
    '    currency,',
    '  }).format(value);',
    '}',
    '',
  ].join('\n');
}

export function generateZustandStore(): string {
  return [
    "import { create } from 'zustand';",
    '',
    'interface IAppState {',
    '  readonly isAuthenticated: boolean;',
    '  readonly userName: string | null;',
    '}',
    '',
    'interface IAppActions {',
    '  readonly login: (userName: string) => void;',
    '  readonly logout: () => void;',
    '}',
    '',
    'type IStoreState = IAppState & IAppActions;',
    '',
    'export const useAppStore = create<IStoreState>((set) => ({',
    '  isAuthenticated: false,',
    '  userName: null,',
    '  login: (userName: string): void => {',
    '    set(() => ({',
    '      isAuthenticated: true,',
    '      userName,',
    '    }));',
    '  },',
    '  logout: (): void => {',
    '    set(() => ({',
    '      isAuthenticated: false,',
    '      userName: null,',
    '    }));',
    '  },',
    '}));',
    '',
  ].join('\n');
}

export function generateReduxStore(): string {
  return [
    "import { configureStore } from '@reduxjs/toolkit';",
    '',
    'export interface IAppState {',
    '  readonly isAuthenticated: boolean;',
    '}',
    '',
    'interface IAction {',
    '  readonly type: string;',
    '}',
    '',
    'const initialState: IAppState = {',
    '  isAuthenticated: false,',
    '};',
    '',
    'const rootReducer = (state: IAppState = initialState, action: IAction): IAppState => {',
    '  switch (action.type) {',
    '    default:',
    '      return state;',
    '  }',
    '};',
    '',
    'export const store = configureStore({',
    '  reducer: rootReducer,',
    '});',
    '',
    'export type IRootState = ReturnType<typeof store.getState>;',
    'export type IAppDispatch = typeof store.dispatch;',
    '',
  ].join('\n');
}

export function generateReduxHooks(): string {
  return [
    "import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';",
    "import type { IAppDispatch, IRootState } from './index';",
    '',
    'export const useAppDispatch = (): IAppDispatch => useDispatch<IAppDispatch>();',
    'export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;',
    '',
  ].join('\n');
}

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

export function generateBackendPackageJson(config: ProjectConfig): string {
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
        'db:migrate': 'prisma migrate dev',
        'db:generate': 'prisma generate',
      },
      dependencies: {
        '@prisma/client': '^5.7.0',
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
        prisma: '^5.7.0',
        tsx: '^4.6.0',
        typescript: '^5.3.0',
        vitest: '^1.0.0',
      },
    },
    null,
    2
  );
}

export function generateBackendTsConfig(config: ProjectConfig): string {
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

export function generateAuthServiceBackend(config: ProjectConfig): string {
  const lines: string[] = [
    "import bcrypt from 'bcrypt';",
    "import jwt from 'jsonwebtoken';",
    "import { Prisma } from '@prisma/client';",
    "import { prisma } from '../database';",
    "import { config } from '../config';",
    "import { HttpError } from '../utils/httpError';",
    '',
    'const handlePrismaError = (error: unknown): never => {',
    '  if (error instanceof Prisma.PrismaClientKnownRequestError) {',
    "    if (error.code === 'P2002') {",
    "      throw new HttpError(409, 'Email already registered');",
    '    }',
    '  }',
    '',
    '  if (error instanceof Error) {',
    '    throw new HttpError(500, error.message);',
    '  }',
    '',
    "  throw new HttpError(500, 'Unexpected database error');",
    '};',
    '',
    'export const authService = {',
    '  async register(name: string, email: string, password: string) {',
    '    try {',
    '      const existingUser = await prisma.user.findUnique({ where: { email } });',
    '      ',
    '      if (existingUser) {',
    "        throw new HttpError(409, 'Email already registered');",
    '      }',
    '  ',
    '      const hashedPassword = await bcrypt.hash(password, 12);',
    '      ',
    '      const user = await prisma.user.create({',
    '        data: { name, email, password: hashedPassword },',
    '      });',
    '  ',
    '      const token = jwt.sign({ userId: user.id, email: user.email }, config.jwt.secret, {',
    '        expiresIn: config.jwt.expiresIn,',
    '      });',
    '  ',
    '      return {',
    '        token,',
    '        user: { id: user.id, email: user.email, name: user.name },',
    '      };',
    '    } catch (error) {',
    '      handlePrismaError(error);',
    '    }',
    '  },',
    '',
    '  async login(email: string, password: string) {',
    '    try {',
    '      const user = await prisma.user.findUnique({ where: { email } });',
    '      ',
    '      if (!user) {',
    "        throw new HttpError(401, 'Invalid credentials');",
    '      }',
    '  ',
    '      const isPasswordValid = await bcrypt.compare(password, user.password);',
    '      ',
    '      if (!isPasswordValid) {',
    "        throw new HttpError(401, 'Invalid credentials');",
    '      }',
    '  ',
    '      const token = jwt.sign({ userId: user.id, email: user.email }, config.jwt.secret, {',
    '        expiresIn: config.jwt.expiresIn,',
    '      });',
    '  ',
    '      return {',
    '        token,',
    '        user: { id: user.id, email: user.email, name: user.name },',
    '      };',
    '    } catch (error) {',
    '      handlePrismaError(error);',
    '    }',
    '  },',
    '',
    '  async logout(token: string) {',
    '    if (!token) {',
    '      return;',
    '    }',
    '    // In a real system we would implement token blacklist or rotation',
    '  },',
    '',
    '  async getUserById(id: string) {',
    '    try {',
    '      const user = await prisma.user.findUnique({',
    '        where: { id },',
    '        select: { id: true, email: true, name: true, createdAt: true },',
    '      });',
    '',
    '      if (!user) {',
    "        throw new HttpError(404, 'User not found');",
    '      }',
    '',
    '      return user;',
    '    } catch (error) {',
    '      handlePrismaError(error);',
    '    }',
    '  },',
    '};',
    '',
  ];

  return lines.join('\n');
}

export function generateArchitectureDoc(config: ProjectConfig): string {
  const language: SupportedLanguage = config.cliLanguage ?? 'en';

  if (language === 'pt') {
    return [
      '# Arquitetura do Projeto',
      '',
      '## Visão Geral',
      '',
      `Este documento descreve a arquitetura e a estrutura do projeto **${config.projectName}**.`,
      '',
      '## Stack de Tecnologia',
      '',
      `- **Frontend:** ${config.framework}`,
      `- **Linguagem:** ${config.language === 'typescript' ? 'TypeScript' : 'JavaScript'}`,
      `- **Estilização:** ${config.styling}`,
      config.database ? `- **Banco de Dados:** ${config.database}` : '',
      '',
      '## Estrutura de Pastas',
      '',
      '```',
      'src/',
      '├── components/     # Componentes React reutilizáveis',
      '├── pages/          # Páginas da aplicação',
      '├── hooks/          # Custom React hooks',
      '├── context/        # Contextos React (Auth, Theme, etc.)',
      '├── services/       # Serviços e chamadas de API',
      '├── styles/         # Estilos globais e variáveis CSS',
      '├── types/          # Tipos TypeScript',
      '├── utils/          # Funções utilitárias',
      '└── assets/         # Imagens, ícones, fontes',
      '```',
      '',
      '## Padrões de Código',
      '',
      '### Componentes',
      '',
      '- Componentes funcionais com React Hooks',
      '- TypeScript para segurança de tipos',
      '- Styled Components/Tailwind para estilização',
      '- Testes unitários com Vitest + Testing Library',
      '',
      '### Nomenclatura',
      '',
      '- Componentes: PascalCase (ex.: `Button.tsx`)',
      '- Hooks: camelCase com prefixo `use` (ex.: `useAuth.ts`)',
      '- Utils: camelCase (ex.: `formatDate.ts`)',
      '- Tipos: PascalCase (ex.: `User.ts`)',
      '',
      '## Fluxo de Dados',
      '',
      '1. Componentes consomem dados via hooks',
      '2. Hooks chamam serviços',
      '3. Serviços fazem requisições HTTP pelo cliente de API',
      '4. Estado global gerenciado via Context API',
      '',
      '## Boas Práticas',
      '',
      '- Componentes pequenos e focados em uma única responsabilidade',
      '- Extrair lógica repetida para hooks personalizados',
      '- Usar TypeScript em modo estrito',
      '- Escrever testes para componentes e hooks críticos',
      '- Usar code splitting para rotas pesadas',
      '',
    ].join('\n');
  }

  if (language === 'es') {
    return [
      '# Arquitectura del Proyecto',
      '',
      '## Visión General',
      '',
      `Este documento describe la arquitectura y estructura del proyecto **${config.projectName}**.`,
      '',
      '## Stack de Tecnología',
      '',
      `- **Frontend:** ${config.framework}`,
      `- **Lenguaje:** ${config.language === 'typescript' ? 'TypeScript' : 'JavaScript'}`,
      `- **Estilos:** ${config.styling}`,
      config.database ? `- **Base de Datos:** ${config.database}` : '',
      '',
      '## Estructura de Carpetas',
      '',
      '```',
      'src/',
      '├── components/     # Componentes React reutilizables',
      '├── pages/          # Páginas de la aplicación',
      '├── hooks/          # Custom React hooks',
      '├── context/        # Contextos React (Auth, Theme, etc.)',
      '├── services/       # Servicios y llamadas a la API',
      '├── styles/         # Estilos globales y variables CSS',
      '├── types/          # Tipos de TypeScript',
      '├── utils/          # Funciones utilitarias',
      '└── assets/         # Imágenes, íconos, fuentes',
      '```',
      '',
      '## Estándares de Código',
      '',
      '### Componentes',
      '',
      '- Componentes funcionales con React Hooks',
      '- TypeScript para seguridad de tipos',
      '- Styled Components/Tailwind para estilos',
      '- Tests unitarios con Vitest + Testing Library',
      '',
      '### Nomenclatura',
      '',
      '- Componentes: PascalCase (ej.: `Button.tsx`)',
      '- Hooks: camelCase con prefijo `use` (ej.: `useAuth.ts`)',
      '- Utils: camelCase (ej.: `formatDate.ts`)',
      '- Tipos: PascalCase (ej.: `User.ts`)',
      '',
      '## Flujo de Datos',
      '',
      '1. Los componentes consumen datos mediante hooks',
      '2. Los hooks llaman a los servicios',
      '3. Los servicios realizan peticiones HTTP a través del cliente de API',
      '4. El estado global se gestiona mediante Context API',
      '',
      '## Buenas Prácticas',
      '',
      '- Componentes pequeños y enfocados en una sola responsabilidad',
      '- Extraer lógica repetida a hooks personalizados',
      '- Usar TypeScript en modo estricto',
      '- Escribir tests para componentes y hooks críticos',
      '- Usar code splitting para rutas pesadas',
      '',
    ].join('\n');
  }

  return [
    '# Project Architecture',
    '',
    '## Overview',
    '',
    `This document describes the architecture and structure of the **${config.projectName}** project.`,
    '',
    '## Technology Stack',
    '',
    `- **Frontend:** ${config.framework}`,
    `- **Language:** ${config.language === 'typescript' ? 'TypeScript' : 'JavaScript'}`,
    `- **Styling:** ${config.styling}`,
    config.database ? `- **Database:** ${config.database}` : '',
    '',
    '## Folder Structure',
    '',
    '```',
    'src/',
    '├── components/     # Reusable React components',
    '├── pages/          # Application pages',
    '├── hooks/          # Custom React hooks',
    '├── context/        # React contexts (Auth, Theme, etc.)',
    '├── services/       # Services and API calls',
    '├── styles/         # Global styles and CSS variables',
    '├── types/          # TypeScript types',
    '├── utils/          # Utility functions',
    '└── assets/         # Images, icons, fonts',
    '```',
    '',
    '## Code Standards',
    '',
    '### Components',
    '',
    '- Functional components with React Hooks',
    '- TypeScript for type safety',
    '- Styled Components/Tailwind for styling',
    '- Unit tests with Vitest + Testing Library',
    '',
    '### Naming',
    '',
    '- Components: PascalCase (e.g. `Button.tsx`)',
    '- Hooks: camelCase with `use` prefix (e.g. `useAuth.ts`)',
    '- Utils: camelCase (e.g. `formatDate.ts`)',
    '- Types: PascalCase (e.g. `User.ts`)',
    '',
    '## Data Flow',
    '',
    '1. Components consume data via hooks',
    '2. Hooks call services',
    '3. Services perform HTTP requests through the API client',
    '4. Global state managed via Context API',
    '',
    '## Best Practices',
    '',
    '- Small, focused components with a single responsibility',
    '- Extract repeated logic to custom hooks',
    '- Use TypeScript in strict mode',
    '- Write unit tests for critical components and hooks',
    '- Use code splitting for heavy routes',
    '',
  ].join('\n');
}

export function generateApiDoc(config: ProjectConfig): string {
  const language: SupportedLanguage = config.cliLanguage ?? 'en';

  if (language === 'pt') {
    return [
      '# Documentação da API',
      '',
      '## URL Base',
      '',
      '```',
      'Desenvolvimento: http://localhost:3000/api',
      'Produção: https://api.yoursite.com/api',
      '```',
      '',
      '## Autenticação',
      '',
      'A API utiliza JWT para autenticação. Inclua o token no cabeçalho Authorization:',
      '',
      '```',
      'Authorization: Bearer <token>',
      '```',
      '',
      '## Endpoints',
      '',
      '### Auth',
      '',
      '#### POST /auth/register',
      '```json',
      '{',
      '  "name": "John Doe",',
      '  "email": "john@example.com",',
      '  "password": "securepassword"',
      '}',
      '```',
      '',
      '#### POST /auth/login',
      '```json',
      '{',
      '  "email": "john@example.com",',
      '  "password": "securepassword"',
      '}',
      '```',
      '',
      '#### GET /auth/me',
      'Requer autenticação.',
      '',
      '### Users',
      '',
      '#### GET /users/profile',
      'Requer autenticação.',
      '',
      '#### PUT /users/profile',
      'Requer autenticação.',
      '',
      '## Códigos de Status',
      '',
      '- `200` - Sucesso',
      '- `201` - Criado',
      '- `400` - Requisição inválida',
      '- `401` - Não autorizado',
      '- `404` - Não encontrado',
      '- `500` - Erro interno do servidor',
      '',
    ].join('\n');
  }

  if (language === 'es') {
    return [
      '# Documentación de la API',
      '',
      '## URL Base',
      '',
      '```',
      'Desarrollo: http://localhost:3000/api',
      'Producción: https://api.yoursite.com/api',
      '```',
      '',
      '## Autenticación',
      '',
      'La API utiliza JWT para autenticación. Incluye el token en el encabezado Authorization:',
      '',
      '```',
      'Authorization: Bearer <token>',
      '```',
      '',
      '## Endpoints',
      '',
      '### Auth',
      '',
      '#### POST /auth/register',
      '```json',
      '{',
      '  "name": "John Doe",',
      '  "email": "john@example.com",',
      '  "password": "securepassword"',
      '}',
      '```',
      '',
      '#### POST /auth/login',
      '```json',
      '{',
      '  "email": "john@example.com",',
      '  "password": "securepassword"',
      '}',
      '```',
      '',
      '#### GET /auth/me',
      'Requiere autenticación.',
      '',
      '### Users',
      '',
      '#### GET /users/profile',
      'Requiere autenticación.',
      '',
      '#### PUT /users/profile',
      'Requiere autenticación.',
      '',
      '## Códigos de Estado',
      '',
      '- `200` - Éxito',
      '- `201` - Creado',
      '- `400` - Petición inválida',
      '- `401` - No autorizado',
      '- `404` - No encontrado',
      '- `500` - Error interno del servidor',
      '',
    ].join('\n');
  }

  return [
    '# API Documentation',
    '',
    '## Base URL',
    '',
    '```',
    'Development: http://localhost:3000/api',
    'Production: https://api.yoursite.com/api',
    '```',
    '',
    '## Authentication',
    '',
    'The API uses JWT for authentication. Include the token in the Authorization header:',
    '',
    '```',
    'Authorization: Bearer <token>',
    '```',
    '',
    '## Endpoints',
    '',
    '### Auth',
    '',
    '#### POST /auth/register',
    '```json',
    '{',
    '  "name": "John Doe",',
    '  "email": "john@example.com",',
    '  "password": "securepassword"',
    '}',
    '```',
    '',
    '#### POST /auth/login',
    '```json',
    '{',
    '  "email": "john@example.com",',
    '  "password": "securepassword"',
    '}',
    '```',
    '',
    '#### GET /auth/me',
    'Requires authentication.',
    '',
    '### Users',
    '',
    '#### GET /users/profile',
    'Requires authentication.',
    '',
    '#### PUT /users/profile',
    'Requires authentication.',
    '',
    '## Status Codes',
    '',
    '- `200` - Success',
    '- `201` - Created',
    '- `400` - Bad Request',
    '- `401` - Unauthorized',
    '- `404` - Not Found',
    '- `500` - Internal Server Error',
    '',
  ].join('\n');
}

export function generateBackendIndexFile(): string {
  return [
    "import app from './app';",
    "import { logger } from './utils/logger';",
    '',
    'const DEFAULT_PORT = 3000;',
    '',
    'const portFromEnv = process.env.PORT;',
    '',
    'const port = portFromEnv !== undefined ? Number(portFromEnv) || DEFAULT_PORT : DEFAULT_PORT;',
    '',
    'app.listen(port, () => {',
    '  logger.info(`Server running on port ${port}`);',
    "  logger.info(`Environment: ${process.env.NODE_ENV ?? 'development'}`);",
    '});',
    '',
  ].join('\n');
}

export function generateBackendAppFile(): string {
  return [
    "import express from 'express';",
    "import cors from 'cors';",
    "import { routes } from './routes';",
    "import { errorMiddleware } from './middlewares/error.middleware';",
    "import { logger } from './utils/logger';",
    "import { config } from './config';",
    '',
    'const app = express();',
    '',
    'app.use(cors(config.cors));',
    'app.use(express.json());',
    'app.use(express.urlencoded({ extended: true }));',
    '',
    'app.use((req, res, next) => {',
    '  logger.info(`${req.method} ${req.path}`);',
    '  next();',
    '});',
    '',
    "app.use('/api', routes);",
    '',
    "app.get('/health', (req, res) => {",
    "  res.json({ status: 'ok', timestamp: new Date().toISOString() });",
    '});',
    '',
    'app.use(errorMiddleware);',
    '',
    'export default app;',
    '',
  ].join('\n');
}

export function generateBackendConfigFile(): string {
  return [
    "import dotenv from 'dotenv';",
    '',
    'dotenv.config();',
    '',
    'const DEFAULT_PORT = 3000;',
    '',
    'const parseAllowedOrigins = (value: string | undefined): string[] | undefined => {',
    '  if (value === undefined) {',
    '    return undefined;',
    '  }',
    '',
    '  return value',
    "    .split(',')",
    '    .map((origin) => origin.trim())',
    '    .filter((origin) => origin.length > 0);',
    '};',
    '',
    'const getJwtSecret = (): string => {',
    '  const secret = process.env.JWT_SECRET;',
    '',
    '  if (secret === undefined) {',
    "    throw new Error('JWT_SECRET environment variable must be set for security reasons.');",
    '  }',
    '',
    '  return secret;',
    '};',
    '',
    'const corsAllowedOrigins = parseAllowedOrigins(process.env.CORS_ALLOWED_ORIGINS);',
    '',
    'export const config = {',
    '  port: Number(process.env.PORT) || DEFAULT_PORT,',
    "  nodeEnv: process.env.NODE_ENV ?? 'development',",
    '  jwt: {',
    '    secret: getJwtSecret(),',
    "    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',",
    '  },',
    '  database: {',
    "    url: process.env.DATABASE_URL ?? '',",
    '  },',
    '  cors: {',
    '    origin: corsAllowedOrigins ?? "*",',
    '    credentials: true,',
    '  },',
    '};',
    '',
  ].join('\n');
}

export function generateRoutesIndexFile(): string {
  return [
    "export { authRoutes } from './auth.routes';",
    "export { userRoutes } from './user.routes';",
    '',
  ].join('\n');
}

export function generateAuthRoutesFile(): string {
  return [
    "import { Router } from 'express';",
    "import { authController } from '../controllers/auth.controller';",
    '',
    'export const authRoutes = Router();',
    '',
    "authRoutes.post('/register', authController.register);",
    "authRoutes.post('/login', authController.login);",
    "authRoutes.post('/logout', authController.logout);",
    "authRoutes.get('/me', authController.getCurrentUser);",
    '',
  ].join('\n');
}

export function generateUserRoutesFile(): string {
  return [
    "import { Router } from 'express';",
    "import { userController } from '../controllers/user.controller';",
    "import { authMiddleware } from '../middlewares/auth.middleware';",
    '',
    'export const userRoutes = Router();',
    'userRoutes.use(authMiddleware);',
    '',
    "userRoutes.get('/profile', userController.getProfile);",
    "userRoutes.put('/profile', userController.updateProfile);",
    '',
  ].join('\n');
}

export function generateAuthControllerFile(): string {
  return [
    "import type { AuthRequest } from '../middlewares/auth.middleware';",
    "import type { NextFunction, Response } from 'express';",
    "import { authService } from '../services/auth.service';",
    '',
    'export const authController = {',
    '  async register(req: AuthRequest, res: Response, next: NextFunction) {',
    '    try {',
    '      const { name, email, password } = req.body;',
    '      const result = await authService.register(name, email, password);',
    '      res.status(201).json(result);',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  },',
    '',
    '  async login(req: AuthRequest, res: Response, next: NextFunction) {',
    '    try {',
    '      const { email, password } = req.body;',
    '      const result = await authService.login(email, password);',
    '      res.json(result);',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  },',
    '',
    '  async logout(req: AuthRequest, res: Response, next: NextFunction) {',
    '    try {',
    '      const token = req.headers.authorization?.split(" ")[1] ?? "";',
    '      await authService.logout(token);',
    "      res.json({ message: 'Logged out successfully' });",
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  },',
    '',
    '  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {',
    '    try {',
    '      const userId = req.user?.userId;',
    '      if (userId === undefined) {',
    "        res.status(401).json({ message: 'Unauthorized' });",
    '        return;',
    '      }',
    '      const user = await authService.getUserById(userId);',
    '      res.json(user);',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  },',
    '};',
    '',
  ].join('\n');
}

export function generateUserControllerFile(): string {
  return [
    "import type { AuthRequest } from '../middlewares/auth.middleware';",
    "import type { NextFunction, Response } from 'express';",
    "import { userService } from '../services/user.service';",
    '',
    'export const userController = {',
    '  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {',
    '    try {',
    '      const userId = req.user?.userId;',
    '      if (userId === undefined) {',
    "        res.status(401).json({ message: 'Unauthorized' });",
    '        return;',
    '      }',
    '      const user = await userService.getUserById(userId);',
    '      res.json(user);',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  },',
    '',
    '  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {',
    '    try {',
    '      const userId = req.user?.userId;',
    '      if (userId === undefined) {',
    "        res.status(401).json({ message: 'Unauthorized' });",
    '        return;',
    '      }',
    '      const updates = req.body as { name?: string; email?: string };',
    '      const user = await userService.updateUser(userId, updates);',
    '      res.json(user);',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  },',
    '};',
    '',
  ].join('\n');
}

export function generateUserServiceBackend(): string {
  return [
    "import { Prisma } from '@prisma/client';",
    "import { prisma } from '../database';",
    "import { HttpError } from '../utils/httpError';",
    '',
    'const handlePrismaError = (error: unknown): never => {',
    '  if (error instanceof Prisma.PrismaClientKnownRequestError) {',
    "    if (error.code === 'P2025') {",
    "      throw new HttpError(404, 'User not found');",
    '    }',
    '  }',
    '',
    '  if (error instanceof Error) {',
    '    throw new HttpError(500, error.message);',
    '  }',
    '',
    "  throw new HttpError(500, 'Unexpected database error');",
    '};',
    '',
    'export const userService = {',
    '  async getUserById(id: string) {',
    '    try {',
    '      const user = await prisma.user.findUnique({',
    '        where: { id },',
    '        select: { id: true, email: true, name: true, createdAt: true },',
    '      });',
    '',
    '      if (!user) {',
    "        throw new HttpError(404, 'User not found');",
    '      }',
    '',
    '      return user;',
    '    } catch (error) {',
    '      handlePrismaError(error);',
    '    }',
    '  },',
    '',
    '  async updateUser(id: string, updates: { name?: string; email?: string }) {',
    '    try {',
    '      const user = await prisma.user.update({',
    '        where: { id },',
    '        data: updates,',
    '        select: { id: true, email: true, name: true, updatedAt: true },',
    '      });',
    '',
    '      return user;',
    '    } catch (error) {',
    '      handlePrismaError(error);',
    '    }',
    '  },',
    '};',
    '',
  ].join('\n');
}

export function generateAuthMiddlewareFile(): string {
  return [
    "import type { NextFunction, Request, Response } from 'express';",
    "import jwt from 'jsonwebtoken';",
    "import { config } from '../config';",
    '',
    'export interface AuthRequest extends Request {',
    '  user?: { userId: string; email: string };',
    '}',
    '',
    'export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {',
    '  const authHeader = req.headers.authorization;',
    '  ',
    "  if (authHeader === undefined || !authHeader.startsWith('Bearer ')) {",
    "    res.status(401).json({ message: 'Authorization token required' });",
    '    return;',
    '  }',
    '',
    "  const token = authHeader.split(' ')[1];",
    '',
    '  try {',
    '    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string };',
    '    req.user = decoded;',
    '    next();',
    '  } catch (error) {',
    "    res.status(401).json({ message: 'Invalid or expired token' });",
    '  }',
    '};',
    '',
  ].join('\n');
}

export function generateErrorMiddlewareFile(): string {
  return [
    "import type { NextFunction, Request, Response } from 'express';",
    "import { logger } from '../utils/logger';",
    "import { HttpError } from '../utils/httpError';",
    '',
    'export const errorMiddleware = (',
    '  error: Error,',
    '  req: Request,',
    '  res: Response,',
    '  next: NextFunction',
    ') => {',
    '  logger.error(`Error: ${error.message}`, { stack: error.stack });',
    '',
    '  const statusCode = error instanceof HttpError ? error.statusCode : 500;',
    '',
    '  res.status(statusCode).json({',
    '    error: {',
    "      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,",
    '      statusCode,',
    '    },',
    '  });',
    '};',
    '',
  ].join('\n');
}

export function generateLoggerFile(): string {
  return [
    "import winston from 'winston';",
    '',
    'export const logger = winston.createLogger({',
    "  level: process.env.LOG_LEVEL ?? 'info',",
    '  format: winston.format.combine(',
    '    winston.format.timestamp(),',
    '    winston.format.json()',
    '  ),',
    '  transports: [',
    "    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),",
    "    new winston.transports.File({ filename: 'logs/combined.log' }),",
    '  ],',
    '});',
    '',
    "if (process.env.NODE_ENV !== 'production') {",
    '  logger.add(',
    '    new winston.transports.Console({',
    '      format: winston.format.simple(),',
    '    })',
    '  );',
    '}',
    '',
  ].join('\n');
}

export function generateHttpErrorFile(): string {
  return [
    'export class HttpError extends Error {',
    '  constructor(public statusCode: number, message: string) {',
    '    super(message);',
    "    this.name = 'HttpError';",
    '  }',
    '}',
    '',
  ].join('\n');
}

export function generatePrismaSchema(config: ProjectConfig): string {
  const provider =
    config.database === 'postgresql'
      ? 'postgresql'
      : config.database === 'mysql'
        ? 'mysql'
        : 'sqlite';

  return [
    'generator client {',
    '  provider = "prisma-client-js"',
    '}',
    '',
    'datasource db {',
    `  provider = "${provider}"`,
    '  url      = env("DATABASE_URL")',
    '}',
    '',
    'model User {',
    '  id        String   @id @default(uuid())',
    '  email     String   @unique',
    '  password  String',
    '  name      String',
    '  createdAt DateTime @default(now())',
    '  updatedAt DateTime @updatedAt',
    '  ',
    '  @@map("users")',
    '}',
    '',
  ].join('\n');
}

export function generateDatabaseIndexFile(): string {
  return [
    "import { PrismaClient } from '@prisma/client';",
    '',
    'export const prisma = new PrismaClient();',
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
