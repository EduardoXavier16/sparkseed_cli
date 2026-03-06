import { describe, expect, it } from 'vitest';
import { formatDesignSystem, generateDesignSystem } from '../src/generators/design-system';
import { formatPRD, generatePRD } from '../src/generators/prd';
import { generateProjectStructure } from '../src/generators/project-structure';
import type { ProjectConfig, SupportedLanguage } from '../src/types';

interface IPackageJson {
  readonly scripts?: Record<string, string>;
  readonly dependencies?: Record<string, string>;
  readonly devDependencies?: Record<string, string>;
}

const mockConfig: ProjectConfig = {
  projectName: 'test-project',
  description: 'A test project',
  type: 'web' as const,
  framework: 'react',
  language: 'typescript' as const,
  styling: 'tailwind' as const,
  targetAudience: 'Test users',
  mainGoal: 'Test goal',
  features: ['auth', 'tests'],
  pages: ['Home', 'About'],
  components: ['Button', 'Input'],
  auth: true,
  colorPalette: {
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'Fira Code',
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  cliLanguage: 'en',
};

describe('PRD Generator', () => {
  it('should generate PRD with correct structure', () => {
    const prd = generatePRD(mockConfig);

    expect(prd).toHaveProperty('overview');
    expect(prd).toHaveProperty('objectives');
    expect(prd).toHaveProperty('targetAudience');
    expect(prd).toHaveProperty('userPersonas');
    expect(prd).toHaveProperty('userStories');
    expect(prd).toHaveProperty('functionalRequirements');
    expect(prd).toHaveProperty('nonFunctionalRequirements');
    expect(prd).toHaveProperty('technicalStack');
    expect(prd).toHaveProperty('milestones');
    expect(prd).toHaveProperty('successMetrics');
  });

  it('should include project name in overview', () => {
    const prd = generatePRD(mockConfig);
    expect(prd.overview).toContain(mockConfig.projectName);
  });

  it('should generate at least 3 user stories', () => {
    const prd = generatePRD(mockConfig);
    expect(prd.userStories.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Design System Generator', () => {
  it('should generate Design System with correct structure', () => {
    const ds = generateDesignSystem(mockConfig);

    expect(ds).toHaveProperty('introduction');
    expect(ds).toHaveProperty('colors');
    expect(ds).toHaveProperty('typography');
    expect(ds).toHaveProperty('spacing');
    expect(ds).toHaveProperty('breakpoints');
    expect(ds).toHaveProperty('components');
    expect(ds).toHaveProperty('guidelines');
  });

  it('should include color palette', () => {
    const ds = generateDesignSystem(mockConfig);
    expect(ds.colors.palette).toHaveProperty('primary');
    expect(ds.colors.palette).toHaveProperty('secondary');
  });

  it('should generate components based on config', () => {
    const ds = generateDesignSystem(mockConfig);
    expect(ds.components.length).toBe(mockConfig.components.length);
  });
});

describe('Project Structure Generator', () => {
  it('should generate project structure with root folder', () => {
    const structure = generateProjectStructure(mockConfig);

    expect(structure.name).toBe(mockConfig.projectName);
    expect(structure.type).toBe('folder');
    expect(structure.children).toBeDefined();
  });

  it('should include package.json', () => {
    const structure = generateProjectStructure(mockConfig);
    const frontendChildren = structure.children?.[0]?.children;
    const packageJson = frontendChildren?.find((c) => c.name === 'package.json');
    expect(packageJson).toBeDefined();
  });

  it('should include src folder', () => {
    const structure = generateProjectStructure(mockConfig);
    const frontendChildren = structure.children?.[0]?.children;
    const srcFolder = frontendChildren?.find((c) => c.name === 'src');
    expect(srcFolder).toBeDefined();
  });

  it('should include components folder with configured components', () => {
    const structure = generateProjectStructure(mockConfig);
    const frontendChildren = structure.children?.[0]?.children;
    const srcFolder = frontendChildren?.find((c) => c.name === 'src');
    const componentsFolder = srcFolder?.children?.find((c) => c.name === 'components');

    expect(componentsFolder).toBeDefined();
    expect(componentsFolder?.children?.length).toBe(mockConfig.components.length);
  });

  it('should include tsconfig.node.json for TypeScript frontend', () => {
    const structure = generateProjectStructure(mockConfig);
    const frontendChildren = structure.children?.[0]?.children;
    const tsconfigNode = frontendChildren?.find((child) => child.name === 'tsconfig.node.json');

    expect(tsconfigNode).toBeDefined();
  });

  it('should generate store and dependency for Zustand when configured', () => {
    const zustandConfig: ProjectConfig = {
      ...mockConfig,
      globalState: 'zustand',
    };

    const structure = generateProjectStructure(zustandConfig);
    const frontendChildren = structure.children?.[0]?.children;
    const srcFolder = frontendChildren?.find((child) => child.name === 'src');
    const storeFolder = srcFolder?.children?.find((child) => child.name === 'store');
    const zustandStoreFile = storeFolder?.children?.find(
      (child) => child.name === 'useAppStore.ts'
    );
    const packageJsonFile = frontendChildren?.find((child) => child.name === 'package.json');

    expect(storeFolder).toBeDefined();
    expect(zustandStoreFile).toBeDefined();
    expect(packageJsonFile?.content).toBeDefined();

    if (packageJsonFile?.content) {
      const parsed = JSON.parse(packageJsonFile.content) as {
        readonly dependencies?: Record<string, string>;
      };
      expect(parsed.dependencies?.zustand).toBeDefined();
    }
  });

  it('should generate store and dependencies for Redux Toolkit when configured', () => {
    const reduxConfig: ProjectConfig = {
      ...mockConfig,
      globalState: 'redux-toolkit',
    };

    const structure = generateProjectStructure(reduxConfig);
    const frontendChildren = structure.children?.[0]?.children;
    const srcFolder = frontendChildren?.find((child) => child.name === 'src');
    const storeFolder = srcFolder?.children?.find((child) => child.name === 'store');
    const reduxStoreFile = storeFolder?.children?.find((child) => child.name === 'index.ts');
    const reduxHooksFile = storeFolder?.children?.find((child) => child.name === 'hooks.ts');
    const packageJsonFile = frontendChildren?.find((child) => child.name === 'package.json');

    expect(storeFolder).toBeDefined();
    expect(reduxStoreFile).toBeDefined();
    expect(reduxHooksFile).toBeDefined();
    expect(packageJsonFile?.content).toBeDefined();

    if (packageJsonFile?.content) {
      const parsed = JSON.parse(packageJsonFile.content) as {
        readonly dependencies?: Record<string, string>;
      };
      expect(parsed.dependencies?.['@reduxjs/toolkit']).toBeDefined();
      expect(parsed.dependencies?.['react-redux']).toBeDefined();
    }
  });

  it('should generate only backend and docs for API-only projects', () => {
    const apiConfig: ProjectConfig = {
      ...mockConfig,
      type: 'api',
      framework: 'express',
      pages: [],
      components: [],
    };

    const structure = generateProjectStructure(apiConfig);
    const childNames = (structure.children ?? []).map((child) => child.name);

    expect(childNames).not.toContain('frontend');
    expect(childNames).toContain('backend');
    expect(childNames).toContain('docs');
    expect(childNames).not.toContain('docker-compose.yml');

    const docsFolder = (structure.children ?? []).find((child) => child.name === 'docs');
    const apiDocFile = docsFolder?.children?.find((child) => child.name === 'API.md');

    expect(apiDocFile).toBeDefined();
    expect(apiDocFile?.content).toBeDefined();
  });

  it('should generate frontend, backend, docs and docker-compose for fullstack projects', () => {
    const fullstackConfig: ProjectConfig = {
      ...mockConfig,
      type: 'fullstack',
      framework: 'react',
      pages: ['Home'],
      components: ['Button'],
    };

    const structure = generateProjectStructure(fullstackConfig);
    const childNames = (structure.children ?? []).map((child) => child.name);

    expect(childNames).toContain('frontend');
    expect(childNames).toContain('backend');
    expect(childNames).toContain('docs');

    const dockerComposeFolder = (structure.children ?? []).find(
      (child) => child.name === 'docker-compose'
    );

    expect(dockerComposeFolder).toBeDefined();
    
    const dockerComposeFile = dockerComposeFolder?.children?.find(
      (child) => child.name === 'docker-compose.yml'
    );

    expect(dockerComposeFile).toBeDefined();
    expect(dockerComposeFile?.content).toBeDefined();

    if (dockerComposeFile?.content) {
      expect(dockerComposeFile.content).toContain(fullstackConfig.projectName);
    }
  });

  it('should adapt frontend structure for Next.js framework', () => {
    const nextConfig: ProjectConfig = {
      ...mockConfig,
      framework: 'nextjs',
    };

    const structure = generateProjectStructure(nextConfig);
    const frontendFolder = (structure.children ?? []).find((child) => child.name === 'frontend');
    const frontendChildren = frontendFolder?.children ?? [];

    const hasIndexHtml = frontendChildren.some((child) => child.name === 'index.html');
    const hasViteConfig = frontendChildren.some((child) => child.name.startsWith('vite.config.'));
    const hasPublicFolder = frontendChildren.some((child) => child.name === 'public');

    expect(hasIndexHtml).toBe(false);
    expect(hasViteConfig).toBe(false);
    expect(hasPublicFolder).toBe(false);
  });

  it('should generate style files according to styling option', () => {
    const createConfigWithStyling = (styling: ProjectConfig['styling']): ProjectConfig => ({
      ...mockConfig,
      styling,
      components: ['Button'],
    });

    const getComponentStyleExtension = (styling: ProjectConfig['styling']): string | null => {
      const config = createConfigWithStyling(styling);
      const structure = generateProjectStructure(config);
      const frontendFolder = (structure.children ?? []).find((child) => child.name === 'frontend');
      const frontendChildren = frontendFolder?.children ?? [];
      const srcFolder = frontendChildren.find((child) => child.name === 'src');
      const componentsFolder = srcFolder?.children?.find((child) => child.name === 'components');
      const buttonFolder = componentsFolder?.children?.find((child) => child.name === 'Button');
      const styleFile = buttonFolder?.children?.find((child) =>
        child.name.startsWith('Button.styles.')
      );

      if (!styleFile) {
        return null;
      }

      const parts = styleFile.name.split('.');
      return parts.length > 2 ? parts[parts.length - 1] : null;
    };

    const tailwindExt = getComponentStyleExtension('tailwind');
    const scssExt = getComponentStyleExtension('scss');
    const styledComponentsExt = getComponentStyleExtension('styled-components');

    expect(tailwindExt).toBe('ts');
    expect(scssExt).toBe('scss');
    expect(styledComponentsExt).toBe('ts');
  });

  it('should generate format util with primary locale from config', () => {
    const localeConfig: ProjectConfig = {
      ...mockConfig,
      primaryLocale: 'pt-BR',
      database: 'postgresql',
    };

    const structure = generateProjectStructure(localeConfig);
    const frontendFolder = (structure.children ?? []).find((child) => child.name === 'frontend');
    const frontendChildren = frontendFolder?.children ?? [];
    const srcFolder = frontendChildren.find((child) => child.name === 'src');
    const utilsFolder = srcFolder?.children?.find((child) => child.name === 'utils');
    const formatFile = utilsFolder?.children?.find((child) => child.name.startsWith('format.'));

    expect(formatFile).toBeDefined();
    const content = formatFile?.content;

    expect(content).toBeDefined();

    if (typeof content === 'string') {
      expect(content).toContain("const DEFAULT_LOCALE = 'pt-BR'");
      expect(content).toContain("const DEFAULT_CURRENCY = 'BRL'");
      expect(content).not.toContain("new Intl.DateTimeFormat('pt-BR')");
      expect(content).not.toContain("currency: 'BRL'");
    }
  });

  it('should reflect selected non-react frameworks in README', () => {
    const frameworks: Array<'vue' | 'svelte'> = ['vue', 'svelte'];

    frameworks.forEach((framework) => {
      const config: ProjectConfig = {
        ...mockConfig,
        framework,
      };

      const structure = generateProjectStructure(config);
      const frontendFolder = (structure.children ?? []).find((child) => child.name === 'frontend');
      const frontendChildren = frontendFolder?.children ?? [];
      const readmeFile = frontendChildren.find((child) => child.name === 'README.md');

      expect(readmeFile).toBeDefined();
      const content = readmeFile?.content;

      expect(content).toBeDefined();

      if (typeof content === 'string') {
        expect(content).toContain(framework);
      }
    });
  });

  it('should include Prisma and Biome scripts in backend package.json', () => {
    const apiConfig: ProjectConfig = {
      ...mockConfig,
      type: 'api',
      framework: 'express',
      database: 'postgresql',
      pages: [],
      components: [],
    };

    const structure = generateProjectStructure(apiConfig);
    const backendFolder = (structure.children ?? []).find((child) => child.name === 'backend');
    const backendChildren = backendFolder?.children ?? [];
    const packageJsonFile = backendChildren.find((child) => child.name === 'package.json');

    expect(packageJsonFile).toBeDefined();
    const content = packageJsonFile?.content;

    expect(content).toBeDefined();

    if (typeof content === 'string') {
      const parsed = JSON.parse(content) as IPackageJson;

      expect(parsed.scripts?.['db:migrate']).toBeDefined();
      expect(parsed.scripts?.['db:generate']).toBeDefined();
      expect(parsed.scripts?.lint).toBe('biome lint .');
      expect(parsed.scripts?.format).toBe('biome format .');
      expect(parsed.dependencies?.['@prisma/client']).toBeDefined();
      expect(parsed.devDependencies?.prisma).toBeDefined();
      expect(parsed.devDependencies?.['@biomejs/biome']).toBeDefined();
    }
  });

  it('should generate Prisma provider matching selected database', () => {
    const databaseConfigs: Array<{ db: 'postgresql' | 'mysql' | 'sqlite'; provider: string }> = [
      { db: 'postgresql', provider: 'postgresql' },
      { db: 'mysql', provider: 'mysql' },
      { db: 'sqlite', provider: 'sqlite' },
    ];

    databaseConfigs.forEach(({ db, provider }) => {
      const config: ProjectConfig = {
        ...mockConfig,
        type: 'api',
        framework: 'express',
        database: db,
        pages: [],
        components: [],
      };

      const structure = generateProjectStructure(config);
      const backendFolder = (structure.children ?? []).find((child) => child.name === 'backend');
      const backendChildren = backendFolder?.children ?? [];
      const srcFolder = backendChildren.find((child) => child.name === 'src');
      const databaseFolder = srcFolder?.children?.find((child) => child.name === 'database');
      const schemaFile = databaseFolder?.children?.find((child) => child.name === 'schema.prisma');

      expect(schemaFile).toBeDefined();
      const content = schemaFile?.content;

      expect(content).toBeDefined();

      if (typeof content === 'string') {
        expect(content).toContain(`provider = "${provider}"`);
      }
    });
  });
});

describe('PRD and Design System i18n', () => {
  const languages: SupportedLanguage[] = ['en', 'pt', 'es'];

  it('should format PRD headings according to selected language', () => {
    languages.forEach((language) => {
      const prd = generatePRD({ ...mockConfig, cliLanguage: language });
      const markdown = formatPRD(prd, language);

      if (language === 'en') {
        expect(markdown).toContain('Product Requirements Document (PRD)');
        expect(markdown).toContain('Objectives');
      }

      if (language === 'pt') {
        expect(markdown).toContain('Documento de Requisitos de Produto (PRD)');
        expect(markdown).toContain('Objetivos');
      }

      if (language === 'es') {
        expect(markdown).toContain('Documento de Requisitos de Producto (PRD)');
        expect(markdown).toContain('Objetivos');
      }
    });
  });

  it('should format Design System headings according to selected language', () => {
    languages.forEach((language) => {
      const configWithLanguage: ProjectConfig = {
        ...mockConfig,
        cliLanguage: language,
      };

      const ds = generateDesignSystem(configWithLanguage);
      const markdown = formatDesignSystem(ds, language);

      if (language === 'en') {
        expect(markdown).toContain('Design System');
        expect(markdown).toContain('Colors');
        expect(markdown).toContain('Typography');
      }

      if (language === 'pt') {
        expect(markdown).toContain('Design System');
        expect(markdown).toContain('Cores');
        expect(markdown).toContain('Tipografia');
      }

      if (language === 'es') {
        expect(markdown).toContain('Design System');
        expect(markdown).toContain('Colores');
        expect(markdown).toContain('Tipografía');
      }
    });
  });
});

describe('CLI language prompts', () => {
  it('should provide localized project name messages for each cliLanguage', async () => {
    const { getProjectPromptTexts } = await import('../src/prompts/project-prompts');

    const englishTexts = getProjectPromptTexts('en');
    const portugueseTexts = getProjectPromptTexts('pt');
    const spanishTexts = getProjectPromptTexts('es');

    expect(englishTexts.projectNameMessage).toBe('What is your project name?');
    expect(portugueseTexts.projectNameMessage).toBe('Qual é o nome do seu projeto?');
    expect(spanishTexts.projectNameMessage).toBe('¿Cuál es el nombre de tu proyecto?');
  });
});
