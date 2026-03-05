export interface SubGeneratorConfig {
  projectName: string;
  language: 'typescript' | 'javascript';
  framework: string;
  styling: string;
}

export interface ComponentConfig extends SubGeneratorConfig {
  componentName: string;
  withStyles: boolean;
  withTest: boolean;
  description?: string;
}

export interface PageConfig extends SubGeneratorConfig {
  pageName: string;
  withTest: boolean;
  description?: string;
}

export interface ResourceConfig extends SubGeneratorConfig {
  resourceName: string;
  withController: boolean;
  withService: boolean;
  withRoutes: boolean;
  withTest: boolean;
  description?: string;
}

export interface TestConfig extends SubGeneratorConfig {
  targetName: string;
  targetType: 'component' | 'api' | 'hook' | 'service';
  testFramework: 'vitest' | 'jest' | 'playwright';
}
