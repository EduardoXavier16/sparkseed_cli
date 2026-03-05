import inquirer from 'inquirer';

interface ISubGeneratorPrompts {
  readonly componentNameMessage: string;
  readonly componentNameRequired: string;
  readonly componentDescriptionMessage: string;
  readonly withStylesMessage: string;
  readonly withTestMessage: string;
  readonly pageNameMessage: string;
  readonly pageNameRequired: string;
  readonly pageDescriptionMessage: string;
  readonly resourceNameMessage: string;
  readonly resourceNameRequired: string;
  readonly resourceDescriptionMessage: string;
  readonly withControllerMessage: string;
  readonly withServiceMessage: string;
  readonly withRoutesMessage: string;
  readonly targetNameMessage: string;
  readonly targetTypeMessage: string;
  readonly testFrameworkMessage: string;
}

const PROMPTS: Record<'en' | 'pt' | 'es', ISubGeneratorPrompts> = {
  en: {
    componentNameMessage: 'What is the component name?',
    componentNameRequired: 'Component name is required',
    componentDescriptionMessage: 'Brief description of the component:',
    withStylesMessage: 'Generate styles file?',
    withTestMessage: 'Generate test file?',
    pageNameMessage: 'What is the page name?',
    pageNameRequired: 'Page name is required',
    pageDescriptionMessage: 'Brief description of the page:',
    resourceNameMessage: 'What is the resource name?',
    resourceNameRequired: 'Resource name is required',
    resourceDescriptionMessage: 'Brief description of the resource:',
    withControllerMessage: 'Generate controller?',
    withServiceMessage: 'Generate service?',
    withRoutesMessage: 'Generate routes?',
    targetNameMessage: 'What is the target name for the test?',
    targetTypeMessage: 'What type of test?',
    testFrameworkMessage: 'Which test framework?',
  },
  pt: {
    componentNameMessage: 'Qual é o nome do componente?',
    componentNameRequired: 'Nome do componente é obrigatório',
    componentDescriptionMessage: 'Breve descrição do componente:',
    withStylesMessage: 'Gerar arquivo de estilos?',
    withTestMessage: 'Gerar arquivo de teste?',
    pageNameMessage: 'Qual é o nome da página?',
    pageNameRequired: 'Nome da página é obrigatório',
    pageDescriptionMessage: 'Breve descrição da página:',
    resourceNameMessage: 'Qual é o nome do recurso?',
    resourceNameRequired: 'Nome do recurso é obrigatório',
    resourceDescriptionMessage: 'Breve descrição do recurso:',
    withControllerMessage: 'Gerar controller?',
    withServiceMessage: 'Gerar service?',
    withRoutesMessage: 'Gerar rotas?',
    targetNameMessage: 'Qual é o nome do alvo para o teste?',
    targetTypeMessage: 'Qual tipo de teste?',
    testFrameworkMessage: 'Qual framework de teste?',
  },
  es: {
    componentNameMessage: '¿Cuál es el nombre del componente?',
    componentNameRequired: 'El nombre del componente es obligatorio',
    componentDescriptionMessage: 'Breve descripción del componente:',
    withStylesMessage: '¿Generar archivo de estilos?',
    withTestMessage: '¿Generar archivo de prueba?',
    pageNameMessage: '¿Cuál es el nombre de la página?',
    pageNameRequired: 'El nombre de la página es obligatorio',
    pageDescriptionMessage: 'Breve descripción de la página:',
    resourceNameMessage: '¿Cuál es el nombre del recurso?',
    resourceNameRequired: 'El nombre del recurso es obligatorio',
    resourceDescriptionMessage: 'Breve descripción del recurso:',
    withControllerMessage: '¿Generar controlador?',
    withServiceMessage: '¿Generar servicio?',
    withRoutesMessage: '¿Generar rutas?',
    targetNameMessage: '¿Cuál es el nombre del objetivo para la prueba?',
    targetTypeMessage: '¿Qué tipo de prueba?',
    testFrameworkMessage: '¿Qué framework de prueba?',
  },
};

export function getPrompts(language: 'en' | 'pt' | 'es' = 'en'): ISubGeneratorPrompts {
  return PROMPTS[language];
}

export async function askComponentConfig(language: 'en' | 'pt' | 'es' = 'en'): Promise<{
  componentName: string;
  description?: string;
  withStyles: boolean;
  withTest: boolean;
}> {
  const texts = getPrompts(language);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'componentName',
      message: texts.componentNameMessage,
      validate: (input: string) => {
        if (!input.trim()) {
          return texts.componentNameRequired;
        }
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
          return 'Component name must start with uppercase letter and use PascalCase';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: texts.componentDescriptionMessage,
      default: 'A reusable UI component',
    },
    {
      type: 'confirm',
      name: 'withStyles',
      message: texts.withStylesMessage,
      default: true,
    },
    {
      type: 'confirm',
      name: 'withTest',
      message: texts.withTestMessage,
      default: true,
    },
  ]);

  return answers;
}

export async function askPageConfig(language: 'en' | 'pt' | 'es' = 'en'): Promise<{
  pageName: string;
  description?: string;
  withTest: boolean;
}> {
  const texts = getPrompts(language);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'pageName',
      message: texts.pageNameMessage,
      validate: (input: string) => {
        if (!input.trim()) {
          return texts.pageNameRequired;
        }
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
          return 'Page name must start with uppercase letter and use PascalCase';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: texts.pageDescriptionMessage,
      default: 'A page component',
    },
    {
      type: 'confirm',
      name: 'withTest',
      message: texts.withTestMessage,
      default: true,
    },
  ]);

  return answers;
}

export async function askResourceConfig(language: 'en' | 'pt' | 'es' = 'en'): Promise<{
  resourceName: string;
  description?: string;
  withController: boolean;
  withService: boolean;
  withRoutes: boolean;
  withTest: boolean;
}> {
  const texts = getPrompts(language);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'resourceName',
      message: texts.resourceNameMessage,
      validate: (input: string) => {
        if (!input.trim()) {
          return texts.resourceNameRequired;
        }
        if (!/^[a-z][a-zA-Z0-9]*$/.test(input)) {
          return 'Resource name must start with lowercase letter and use camelCase';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: texts.resourceDescriptionMessage,
      default: 'A backend resource',
    },
    {
      type: 'confirm',
      name: 'withController',
      message: texts.withControllerMessage,
      default: true,
    },
    {
      type: 'confirm',
      name: 'withService',
      message: texts.withServiceMessage,
      default: true,
    },
    {
      type: 'confirm',
      name: 'withRoutes',
      message: texts.withRoutesMessage,
      default: true,
    },
    {
      type: 'confirm',
      name: 'withTest',
      message: texts.withTestMessage,
      default: true,
    },
  ]);

  return answers;
}

export async function askTestConfig(language: 'en' | 'pt' | 'es' = 'en'): Promise<{
  targetName: string;
  targetType: 'component' | 'api' | 'hook' | 'service';
  testFramework: 'vitest' | 'jest' | 'playwright';
}> {
  const texts = getPrompts(language);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'targetName',
      message: texts.targetNameMessage,
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Target name is required';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'targetType',
      message: texts.targetTypeMessage,
      choices: [
        { name: '🧩 Component', value: 'component' },
        { name: '🔌 API / Endpoint', value: 'api' },
        { name: '🪝 Hook', value: 'hook' },
        { name: '⚙️ Service', value: 'service' },
      ],
    },
    {
      type: 'list',
      name: 'testFramework',
      message: texts.testFrameworkMessage,
      choices: [
        { name: 'Vitest', value: 'vitest' },
        { name: 'Jest', value: 'jest' },
        { name: 'Playwright (E2E)', value: 'playwright' },
      ],
      default: 'vitest',
    },
  ]);

  return answers;
}
