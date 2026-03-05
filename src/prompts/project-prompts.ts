import inquirer from 'inquirer';
import {
  ColorPalette,
  GlobalStateLibrary,
  ProjectConfig,
  SupportedLanguage,
  Typography,
} from '../types';

interface Answers {
  projectName: string;
  description: string;
  type: 'web' | 'mobile' | 'desktop' | 'api' | 'fullstack';
  framework: string;
  language: 'typescript' | 'javascript';
  styling: 'css' | 'scss' | 'tailwind' | 'styled-components' | 'emotion' | 'chakra-ui';
  targetAudience: string;
  mainGoal: string;
}

interface IProjectPromptTexts {
  readonly projectNameMessage: string;
  readonly projectNameRequired: string;
  readonly projectDescriptionMessage: string;
  readonly projectDescriptionDefault: string;
  readonly projectTypeMessage: string;
  readonly frameworkMessage: string;
  readonly languageMessage: string;
  readonly stylingMessage: string;
  readonly cssPureLabel: string;
  readonly targetAudienceMessage: string;
  readonly targetAudienceDefault: string;
  readonly mainGoalMessage: string;
  readonly mainGoalDefault: string;
  readonly databaseMessage: string;
  readonly noDatabaseLabel: string;
  readonly authMessage: string;
  readonly featuresMessage: string;
  readonly pagesMessage: string;
  readonly pagesDefault: string;
  readonly componentsMessage: string;
  readonly componentsDefault: string;
  readonly localeMessage: string;
  readonly primaryColorMessage: string;
  readonly secondaryColorMessage: string;
  readonly accentColorMessage: string;
  readonly backgroundColorMessage: string;
  readonly surfaceColorMessage: string;
  readonly fontFamilyMessage: string;
  readonly globalStateMessage: string;
  readonly globalStateNoneLabel: string;
  readonly globalStateZustandLabel: string;
  readonly globalStateReduxToolkitLabel: string;
  readonly languageSelectMessage: string;
  readonly languageOptionEnglish: string;
  readonly languageOptionPortuguese: string;
  readonly languageOptionSpanish: string;
}

const PROMPT_TEXTS: Record<SupportedLanguage, IProjectPromptTexts> = {
  en: {
    projectNameMessage: 'What is your project name?',
    projectNameRequired: 'Project name is required',
    projectDescriptionMessage: 'Briefly describe the project:',
    projectDescriptionDefault: 'An awesome project',
    projectTypeMessage: 'What type of project is it?',
    frameworkMessage: 'Which framework do you want to use?',
    languageMessage: 'Which language do you want to use?',
    stylingMessage: 'Which styling approach do you prefer?',
    cssPureLabel: '📄 Plain CSS',
    targetAudienceMessage: 'What is the target audience of this project?',
    targetAudienceDefault: 'General users looking for an efficient and intuitive solution',
    mainGoalMessage: 'What is the main goal of this project?',
    mainGoalDefault:
      'Provide an exceptional user experience while solving the core problem efficiently',
    databaseMessage: 'Which database do you want to use?',
    noDatabaseLabel: '❌ No database',
    authMessage: 'Do you want to include an authentication system?',
    featuresMessage: 'Which features do you want to include?',
    pagesMessage: 'Which pages should the application have? (separate with commas)',
    pagesDefault: 'Home, About, Contact, Login, Dashboard',
    componentsMessage: 'Which common components do you need? (separate with commas)',
    componentsDefault: 'Button, Input, Card, Modal, Navbar, Sidebar, Table, Form',
    localeMessage: 'What is the primary locale for formatting (e.g. en-US, pt-BR, es-ES)?',
    primaryColorMessage: 'Primary color (hex or name):',
    secondaryColorMessage: 'Secondary color (hex or name):',
    accentColorMessage: 'Accent color (hex or name):',
    backgroundColorMessage: 'Background color:',
    surfaceColorMessage: 'Surface color (cards, modals):',
    fontFamilyMessage: 'Which font family do you want to use?',
    globalStateMessage: 'Do you want to add a global state library?',
    globalStateNoneLabel: '🚫 No global state library',
    globalStateZustandLabel: '🧠 Zustand (simple, hooks-based store)',
    globalStateReduxToolkitLabel: '🧰 Redux Toolkit (scalable state management)',
    languageSelectMessage: 'Select the language for the interactive questions:',
    languageOptionEnglish: 'English',
    languageOptionPortuguese: 'Portuguese',
    languageOptionSpanish: 'Spanish',
  },
  pt: {
    projectNameMessage: 'Qual é o nome do seu projeto?',
    projectNameRequired: 'Nome do projeto é obrigatório',
    projectDescriptionMessage: 'Descreva brevemente o projeto:',
    projectDescriptionDefault: 'Um projeto incrível',
    projectTypeMessage: 'Que tipo de projeto é?',
    frameworkMessage: 'Qual framework você quer usar?',
    languageMessage: 'Qual linguagem você quer usar?',
    stylingMessage: 'Qual abordagem de estilização você prefere?',
    cssPureLabel: '📄 CSS puro',
    targetAudienceMessage: 'Qual é o público-alvo deste projeto?',
    targetAudienceDefault: 'Usuários em geral buscando uma solução eficiente e intuitiva',
    mainGoalMessage: 'Qual é o principal objetivo deste projeto?',
    mainGoalDefault:
      'Proporcionar uma experiência excepcional enquanto resolve o problema principal de forma eficiente',
    databaseMessage: 'Qual banco de dados você quer usar?',
    noDatabaseLabel: '❌ Sem banco de dados',
    authMessage: 'Você quer incluir um sistema de autenticação?',
    featuresMessage: 'Quais funcionalidades você quer incluir?',
    pagesMessage: 'Quais páginas o aplicativo deve ter? (separe com vírgulas)',
    pagesDefault: 'Home, Sobre, Contato, Login, Dashboard',
    componentsMessage: 'Quais componentes comuns você precisa? (separe com vírgulas)',
    componentsDefault: 'Button, Input, Card, Modal, Navbar, Sidebar, Table, Form',
    localeMessage: 'Qual é o locale principal para formatação (ex.: en-US, pt-BR, es-ES)?',
    primaryColorMessage: 'Cor primária (hex ou nome):',
    secondaryColorMessage: 'Cor secundária (hex ou nome):',
    accentColorMessage: 'Cor de destaque (hex ou nome):',
    backgroundColorMessage: 'Cor de fundo:',
    surfaceColorMessage: 'Cor de superfície (cards, modais):',
    fontFamilyMessage: 'Qual família de fonte você quer usar?',
    globalStateMessage: 'Você quer adicionar uma biblioteca de estado global?',
    globalStateNoneLabel: '🚫 Sem biblioteca de estado global',
    globalStateZustandLabel: '🧠 Zustand (store simples baseado em hooks)',
    globalStateReduxToolkitLabel: '🧰 Redux Toolkit (estado global escalável)',
    languageSelectMessage: 'Selecione o idioma para as perguntas interativas:',
    languageOptionEnglish: 'Inglês',
    languageOptionPortuguese: 'Português',
    languageOptionSpanish: 'Espanhol',
  },
  es: {
    projectNameMessage: '¿Cuál es el nombre de tu proyecto?',
    projectNameRequired: 'El nombre del proyecto es obligatorio',
    projectDescriptionMessage: 'Describe brevemente el proyecto:',
    projectDescriptionDefault: 'Un proyecto increíble',
    projectTypeMessage: '¿Qué tipo de proyecto es?',
    frameworkMessage: '¿Qué framework quieres usar?',
    languageMessage: '¿Qué lenguaje quieres usar?',
    stylingMessage: '¿Qué enfoque de estilos prefieres?',
    cssPureLabel: '📄 CSS puro',
    targetAudienceMessage: '¿Cuál es el público objetivo de este proyecto?',
    targetAudienceDefault: 'Usuarios en general que buscan una solución eficiente e intuitiva',
    mainGoalMessage: '¿Cuál es el objetivo principal de este proyecto?',
    mainGoalDefault:
      'Proporcionar una experiencia excepcional mientras resuelve el problema principal de forma eficiente',
    databaseMessage: '¿Qué base de datos quieres usar?',
    noDatabaseLabel: '❌ Sin base de datos',
    authMessage: '¿Quieres incluir un sistema de autenticación?',
    featuresMessage: '¿Qué funcionalidades quieres incluir?',
    pagesMessage: '¿Qué páginas debe tener la aplicación? (separa con comas)',
    pagesDefault: 'Home, Acerca de, Contacto, Login, Dashboard',
    componentsMessage: '¿Qué componentes comunes necesitas? (separa con comas)',
    componentsDefault: 'Button, Input, Card, Modal, Navbar, Sidebar, Table, Form',
    localeMessage: '¿Cuál es el locale principal para formato (ej.: en-US, pt-BR, es-ES)?',
    primaryColorMessage: 'Color primario (hex o nombre):',
    secondaryColorMessage: 'Color secundario (hex o nombre):',
    accentColorMessage: 'Color de acento (hex o nombre):',
    backgroundColorMessage: 'Color de fondo:',
    surfaceColorMessage: 'Color de superficie (cards, modals):',
    fontFamilyMessage: '¿Qué familia tipográfica quieres usar?',
    globalStateMessage: '¿Quieres añadir una librería de estado global?',
    globalStateNoneLabel: '🚫 Sin librería de estado global',
    globalStateZustandLabel: '🧠 Zustand (store simple basado en hooks)',
    globalStateReduxToolkitLabel: '🧰 Redux Toolkit (gestión de estado escalable)',
    languageSelectMessage: 'Selecciona el idioma para las preguntas interactivas:',
    languageOptionEnglish: 'Inglés',
    languageOptionPortuguese: 'Portugués',
    languageOptionSpanish: 'Español',
  },
};

export function getProjectPromptTexts(language: SupportedLanguage): IProjectPromptTexts {
  return PROMPT_TEXTS[language];
}

async function askCliLanguage(): Promise<SupportedLanguage> {
  const languageAnswer = await inquirer.prompt<{ cliLanguage: SupportedLanguage }>([
    {
      type: 'list',
      name: 'cliLanguage',
      message: PROMPT_TEXTS.en.languageSelectMessage,
      choices: [
        { name: `🇺🇸 ${PROMPT_TEXTS.en.languageOptionEnglish}`, value: 'en' },
        { name: `🇧🇷 ${PROMPT_TEXTS.en.languageOptionPortuguese}`, value: 'pt' },
        { name: `🇪🇸 ${PROMPT_TEXTS.en.languageOptionSpanish}`, value: 'es' },
      ],
      default: 'en',
    },
  ]);
  return languageAnswer.cliLanguage;
}

export async function askProjectQuestions(): Promise<ProjectConfig> {
  const cliLanguage = await askCliLanguage();
  const texts = PROMPT_TEXTS[cliLanguage];

  const answers = await inquirer.prompt<Answers>([
    {
      type: 'input',
      name: 'projectName',
      message: texts.projectNameMessage,
      default: 'my-awesome-project',
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return texts.projectNameRequired;
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: texts.projectDescriptionMessage,
      default: texts.projectDescriptionDefault,
    },
    {
      type: 'list',
      name: 'type',
      message: texts.projectTypeMessage,
      choices: [
        { name: '🌐 Web Application', value: 'web' },
        { name: '📱 Mobile Application', value: 'mobile' },
        { name: '🖥️ Desktop Application', value: 'desktop' },
        { name: '🔌 API / Backend', value: 'api' },
        { name: '🔄 Fullstack (Web + API)', value: 'fullstack' },
      ],
    },
    {
      type: 'list',
      name: 'framework',
      message: texts.frameworkMessage,
      choices: (answers: { type: string }) => {
        const choices = [];

        if (['web', 'fullstack'].includes(answers.type)) {
          choices.push(
            { name: '⚛️ React', value: 'react' },
            { name: '⚡ Next.js', value: 'nextjs' },
            { name: '🔷 Vue.js', value: 'vue' },
            { name: '🎯 Nuxt.js', value: 'nuxt' },
            { name: '📐 Angular', value: 'angular' },
            { name: '🚀 Svelte', value: 'svelte' }
          );
        }

        if (answers.type === 'mobile') {
          choices.push(
            { name: '📱 React Native', value: 'react-native' },
            { name: '🎯 Flutter', value: 'flutter' },
            { name: '⚡ Ionic', value: 'ionic' },
            { name: '🎯 NativeScript', value: 'nativescript' }
          );
        }

        if (answers.type === 'desktop') {
          choices.push(
            { name: '💻 Electron', value: 'electron' },
            { name: '📦 Tauri', value: 'tauri' }
          );
        }

        if (['api', 'fullstack'].includes(answers.type)) {
          choices.push(
            { name: '🟢 Node.js + Express', value: 'express' },
            { name: '⚡ Fastify', value: 'fastify' },
            { name: '🐍 Python + FastAPI', value: 'fastapi' },
            { name: '🐍 Django', value: 'django' },
            { name: '☕ Spring Boot', value: 'spring' },
            { name: '🦀 Rust + Actix', value: 'actix' }
          );
        }

        return choices.length > 0 ? choices : [{ name: 'Vanilla', value: 'vanilla' }];
      },
    },
    {
      type: 'list',
      name: 'language',
      message: texts.languageMessage,
      choices: [
        { name: 'TypeScript', value: 'typescript' },
        { name: 'JavaScript', value: 'javascript' },
      ],
      default: 'typescript',
    },
    {
      type: 'list',
      name: 'styling',
      message: texts.stylingMessage,
      choices: (answers: { framework: string }) => {
        const isReactEcosystem = ['react', 'nextjs', 'react-native'].includes(answers.framework);

        return [
          { name: '🎨 Tailwind CSS', value: 'tailwind' },
          ...(isReactEcosystem
            ? [
                { name: '💅 Styled Components', value: 'styled-components' },
                { name: '💖 Emotion', value: 'emotion' },
                { name: '🎭 Chakra UI', value: 'chakra-ui' },
              ]
            : []),
          { name: '📜 SCSS/SASS', value: 'scss' },
          { name: texts.cssPureLabel, value: 'css' },
        ];
      },
    },
    {
      type: 'input',
      name: 'targetAudience',
      message: texts.targetAudienceMessage,
      default: texts.targetAudienceDefault,
    },
    {
      type: 'input',
      name: 'mainGoal',
      message: texts.mainGoalMessage,
      default: texts.mainGoalDefault,
    },
  ]);

  // Database question for backend/fullstack projects
  let database: string | undefined;
  if (['api', 'fullstack'].includes(answers.type)) {
    const dbAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'database',
        message: texts.databaseMessage,
        choices: [
          { name: '🐘 PostgreSQL', value: 'postgresql' },
          { name: '🦆 MySQL', value: 'mysql' },
          { name: '🔷 SQLite', value: 'sqlite' },
          { name: '🍃 MongoDB', value: 'mongodb' },
          { name: '🔴 Redis', value: 'redis' },
          { name: texts.noDatabaseLabel, value: 'none' },
        ],
      },
    ]);
    database = dbAnswer.database !== 'none' ? dbAnswer.database : undefined;
  }

  // Auth question
  let auth: boolean = false;
  if (['api', 'fullstack', 'web'].includes(answers.type)) {
    const authAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'auth',
        message: texts.authMessage,
        default: true,
      },
    ]);
    auth = authAnswer.auth;
  }

  // Global state library question (only when it makes sense)
  let globalState: GlobalStateLibrary | 'none' | undefined;
  const supportsGlobalState =
    answers.language === 'typescript' &&
    ['web', 'fullstack'].includes(answers.type) &&
    answers.framework === 'react';

  if (supportsGlobalState) {
    const globalStateAnswer = await inquirer.prompt<{
      globalState: GlobalStateLibrary | 'none';
    }>([
      {
        type: 'list',
        name: 'globalState',
        message: texts.globalStateMessage,
        choices: [
          { name: texts.globalStateNoneLabel, value: 'none' },
          { name: texts.globalStateZustandLabel, value: 'zustand' },
          { name: texts.globalStateReduxToolkitLabel, value: 'redux-toolkit' },
        ],
        default: 'none',
      },
    ]);

    globalState = globalStateAnswer.globalState;
  }

  // Features question
  const featuresAnswer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'features',
      message: texts.featuresMessage,
      choices: [
        { name: '👤 User authentication', value: 'auth', checked: auth },
        { name: '📧 Email sending', value: 'email' },
        { name: '📁 File upload', value: 'upload' },
        { name: '🔍 Search and filters', value: 'search' },
        { name: '📊 Dashboard / Analytics', value: 'dashboard' },
        { name: '🔔 Notifications', value: 'notifications' },
        { name: '💳 Payments', value: 'payments' },
        { name: '🌐 Internationalization (i18n)', value: 'i18n' },
        { name: '🌓 Light/dark theme', value: 'darkmode' },
        { name: '📱 PWA / Offline support', value: 'pwa' },
        { name: '🧪 Automated tests', value: 'tests' },
        { name: '📝 Logging and monitoring', value: 'logging' },
        { name: '🐳 Docker', value: 'docker' },
        { name: '🚀 CI/CD', value: 'cicd' },
      ],
    },
  ]);

  // Pages question
  const pagesAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'pages',
      message: texts.pagesMessage,
      default: texts.pagesDefault,
      filter: (input: string) => {
        return input
          .split(',')
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0);
      },
    },
  ]);

  // Components question
  const componentsAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'components',
      message: texts.componentsMessage,
      default: texts.componentsDefault,
      filter: (input: string) => {
        return input
          .split(',')
          .map((c: string) => c.trim())
          .filter((c: string) => c.length > 0);
      },
    },
  ]);

  const localeAnswer = await inquirer.prompt<{ primaryLocale: string }>([
    {
      type: 'input',
      name: 'primaryLocale',
      message: texts.localeMessage,
      default: 'en-US',
    },
  ]);

  // Color palette questions
  const colorAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'primaryColor',
      message: texts.primaryColorMessage,
      default: '#3B82F6',
    },
    {
      type: 'input',
      name: 'secondaryColor',
      message: texts.secondaryColorMessage,
      default: '#6366F1',
    },
    {
      type: 'input',
      name: 'accentColor',
      message: texts.accentColorMessage,
      default: '#8B5CF6',
    },
    {
      type: 'input',
      name: 'backgroundColor',
      message: texts.backgroundColorMessage,
      default: '#FFFFFF',
    },
    {
      type: 'input',
      name: 'surfaceColor',
      message: texts.surfaceColorMessage,
      default: '#F9FAFB',
    },
  ]);

  // Typography questions
  const typographyAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'fontFamily',
      message: texts.fontFamilyMessage,
      choices: [
        { name: 'Inter (modern and clean)', value: 'Inter' },
        { name: 'Roboto (versatile)', value: 'Roboto' },
        { name: 'Poppins (friendly)', value: 'Poppins' },
        { name: 'Montserrat (elegant)', value: 'Montserrat' },
        { name: 'Open Sans (readable)', value: 'Open Sans' },
        { name: 'Lato (professional)', value: 'Lato' },
        { name: 'System UI (native)', value: 'system-ui' },
      ],
      default: 'Inter',
    },
  ]);

  const colorPalette: ColorPalette = {
    primary: colorAnswers.primaryColor,
    secondary: colorAnswers.secondaryColor,
    accent: colorAnswers.accentColor,
    background: colorAnswers.backgroundColor,
    surface: colorAnswers.surfaceColor,
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
  };

  const typography: Typography = {
    fontFamily: {
      heading: typographyAnswers.fontFamily,
      body: typographyAnswers.fontFamily,
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
  };

  return {
    projectName: answers.projectName,
    description: answers.description,
    type: answers.type,
    framework: answers.framework,
    language: answers.language,
    styling: answers.styling,
    targetAudience: answers.targetAudience,
    mainGoal: answers.mainGoal,
    database,
    auth,
    globalState: globalState && globalState !== 'none' ? globalState : undefined,
    features: featuresAnswer.features,
    pages: pagesAnswer.pages,
    components: componentsAnswer.components,
    colorPalette,
    typography,
    cliLanguage,
    primaryLocale: localeAnswer.primaryLocale,
  };
}
