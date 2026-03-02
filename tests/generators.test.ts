import { describe, it, expect } from 'vitest';
import { generatePRD } from '../src/generators/prd-generator';
import { generateDesignSystem } from '../src/generators/design-system-generator';
import { generateProjectStructure } from '../src/generators/project-structure';

const mockConfig = {
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
    const packageJson = frontendChildren?.find(c => c.name === 'package.json');
    expect(packageJson).toBeDefined();
  });

  it('should include src folder', () => {
    const structure = generateProjectStructure(mockConfig);
    const frontendChildren = structure.children?.[0]?.children;
    const srcFolder = frontendChildren?.find(c => c.name === 'src');
    expect(srcFolder).toBeDefined();
  });

  it('should include components folder with configured components', () => {
    const structure = generateProjectStructure(mockConfig);
    const frontendChildren = structure.children?.[0]?.children;
    const srcFolder = frontendChildren?.find(c => c.name === 'src');
    const componentsFolder = srcFolder?.children?.find(c => c.name === 'components');
    
    expect(componentsFolder).toBeDefined();
    expect(componentsFolder?.children?.length).toBe(mockConfig.components.length);
  });
});
