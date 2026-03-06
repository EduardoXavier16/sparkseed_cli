import inquirer from 'inquirer';
import {
  ApiEndpoint,
  ColorPalette,
  DomainEntity,
  EntityField,
  GlobalStateLibrary,
  JourneyStep,
  ProjectConfig,
  ScreenMap,
  SupportedLanguage,
  Typography,
  UserJourney,
  UserRole,
  Workflow,
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
  readonly ormMessage: string;
  readonly ormPrismaLabel: string;
  readonly ormDrizzleLabel: string;
  readonly ormSequelizeLabel: string;
  readonly ormTypeormLabel: string;
  readonly ormMongooseLabel: string;
  readonly ormKnexLabel: string;
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
  readonly domainEntitiesMessage: string;
  readonly domainEntityNameMessage: string;
  readonly domainEntityDescriptionMessage: string;
  readonly domainEntityFieldsMessage: string;
  readonly domainEntityFieldNameMessage: string;
  readonly domainEntityFieldTypeMessage: string;
  readonly domainEntityFieldRequiredMessage: string;
  readonly domainEntityFieldUniqueMessage: string;
  readonly domainEntityAddMoreFieldsMessage: string;
  readonly domainEntityAddAnotherMessage: string;
  readonly userJourneysMessage: string;
  readonly userJourneyNameMessage: string;
  readonly userJourneyDescriptionMessage: string;
  readonly userJourneyStepsMessage: string;
  readonly userJourneyStepActionMessage: string;
  readonly userJourneyStepScreenMessage: string;
  readonly userJourneyAddMoreStepsMessage: string;
  readonly userJourneyAddAnotherMessage: string;
  readonly screenMapMessage: string;
  readonly screenNameMessage: string;
  readonly screenRouteMessage: string;
  readonly screenDescriptionMessage: string;
  readonly screenAddAnotherMessage: string;
  readonly apiEndpointsMessage: string;
  readonly apiEndpointMethodMessage: string;
  readonly apiEndpointPathMessage: string;
  readonly apiEndpointDescriptionMessage: string;
  readonly apiEndpointAuthRequiredMessage: string;
  readonly apiEndpointAddAnotherMessage: string;
  readonly businessContextMessage: string;
  readonly businessContextDefault: string;
  readonly userRolesMessage: string;
  readonly userRoleNameMessage: string;
  readonly userRoleDescriptionMessage: string;
  readonly userRolePermissionsMessage: string;
  readonly userRoleAddAnotherMessage: string;
  readonly workflowEntitiesMessage: string;
  readonly workflowNameMessage: string;
  readonly workflowDescriptionMessage: string;
  readonly workflowStatusesMessage: string;
  readonly workflowTransitionsMessage: string;
  readonly workflowAddAnotherMessage: string;
  readonly agentGuidanceMessage: string;
  readonly agentGuidanceDefault: string;
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
    ormMessage: 'Which ORM do you want to use?',
    ormPrismaLabel: '🔷 Prisma (type-safe, modern)',
    ormDrizzleLabel: '⚡ Drizzle (lightweight, fast)',
    ormSequelizeLabel: '🔄 Sequelize (classic, mature)',
    ormTypeormLabel: '📦 TypeORM (decorators, enterprise)',
    ormMongooseLabel: '🍃 Mongoose (MongoDB)',
    ormKnexLabel: '🔨 Knex.js (SQL query builder)',
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
    domainEntitiesMessage: 'Do you want to define domain entities for your project?',
    domainEntityNameMessage: 'Entity name (e.g., User, Product, Order):',
    domainEntityDescriptionMessage: 'Entity description:',
    domainEntityFieldsMessage: 'Define fields for this entity',
    domainEntityFieldNameMessage: 'Field name:',
    domainEntityFieldTypeMessage: 'Field type:',
    domainEntityFieldRequiredMessage: 'Is this field required?',
    domainEntityFieldUniqueMessage: 'Is this field unique?',
    domainEntityAddMoreFieldsMessage: 'Add another field?',
    domainEntityAddAnotherMessage: 'Add another entity?',
    userJourneysMessage: 'Do you want to define user journeys (business flows)?',
    userJourneyNameMessage: 'Journey name (e.g., "Create Order", "User Registration"):',
    userJourneyDescriptionMessage: 'Journey description:',
    userJourneyStepsMessage: 'Define steps for this journey',
    userJourneyStepActionMessage: 'Step action:',
    userJourneyStepScreenMessage: 'Screen involved (optional):',
    userJourneyAddMoreStepsMessage: 'Add another step?',
    userJourneyAddAnotherMessage: 'Add another journey?',
    screenMapMessage: 'Do you want to define the screen map (navigation structure)?',
    screenNameMessage: 'Screen name:',
    screenRouteMessage: 'Screen route (e.g., /dashboard, /products/:id):',
    screenDescriptionMessage: 'Screen description:',
    screenAddAnotherMessage: 'Add another screen?',
    apiEndpointsMessage: 'Do you want to define API endpoints?',
    apiEndpointMethodMessage: 'HTTP method:',
    apiEndpointPathMessage: 'Endpoint path (e.g., /api/users, /api/orders/:id):',
    apiEndpointDescriptionMessage: 'Endpoint description:',
    apiEndpointAuthRequiredMessage: 'Is authentication required?',
    apiEndpointAddAnotherMessage: 'Add another endpoint?',
    businessContextMessage: 'Describe your business context and main use cases:',
    businessContextDefault: 'A platform for managing service orders, customers, and technicians.',
    userRolesMessage: 'Do you want to define user roles and permissions?',
    userRoleNameMessage: 'Role name (e.g., Admin, Customer, Technician):',
    userRoleDescriptionMessage: 'Role description:',
    userRolePermissionsMessage: 'Permissions (comma-separated, e.g., create_order,view_orders,manage_users):',
    userRoleAddAnotherMessage: 'Add another role?',
    workflowEntitiesMessage: 'Do you want to define business workflows (status transitions)?',
    workflowNameMessage: 'Workflow name (e.g., Order Status, Project Lifecycle):',
    workflowDescriptionMessage: 'Workflow description:',
    workflowStatusesMessage: 'Statuses (comma-separated, e.g., Draft,Active,Completed,Cancelled):',
    workflowTransitionsMessage: 'Allowed transitions (e.g., Draft→Active, Active→Completed):',
    workflowAddAnotherMessage: 'Add another workflow?',
    agentGuidanceMessage: 'Any specific guidance for AI agents working on this project?',
    agentGuidanceDefault: 'Follow the domain model strictly. Extend entities only as documented. Validate all business rules.',
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
    ormMessage: 'Qual ORM você quer usar?',
    ormPrismaLabel: '🔷 Prisma (type-safe, moderno)',
    ormDrizzleLabel: '⚡ Drizzle (leve, rápido)',
    ormSequelizeLabel: '🔄 Sequelize (clássico, maduro)',
    ormTypeormLabel: '📦 TypeORM (decorators, enterprise)',
    ormMongooseLabel: '🍃 Mongoose (MongoDB)',
    ormKnexLabel: '🔨 Knex.js (query builder SQL)',
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
    domainEntitiesMessage: 'Você quer definir entidades de domínio para o seu projeto?',
    domainEntityNameMessage: 'Nome da entidade (ex.: User, Product, Order):',
    domainEntityDescriptionMessage: 'Descrição da entidade:',
    domainEntityFieldsMessage: 'Defina os campos para esta entidade',
    domainEntityFieldNameMessage: 'Nome do campo:',
    domainEntityFieldTypeMessage: 'Tipo do campo:',
    domainEntityFieldRequiredMessage: 'Este campo é obrigatório?',
    domainEntityFieldUniqueMessage: 'Este campo é único?',
    domainEntityAddMoreFieldsMessage: 'Adicionar outro campo?',
    domainEntityAddAnotherMessage: 'Adicionar outra entidade?',
    userJourneysMessage: 'Você quer definir fluxos de usuário (user journeys)?',
    userJourneyNameMessage: 'Nome do fluxo (ex.: "Criar Pedido", "Registro de Usuário"):',
    userJourneyDescriptionMessage: 'Descrição do fluxo:',
    userJourneyStepsMessage: 'Defina os passos para este fluxo',
    userJourneyStepActionMessage: 'Ação do passo:',
    userJourneyStepScreenMessage: 'Tela envolvida (opcional):',
    userJourneyAddMoreStepsMessage: 'Adicionar outro passo?',
    userJourneyAddAnotherMessage: 'Adicionar outro fluxo?',
    screenMapMessage: 'Você quer definir o mapa de telas (estrutura de navegação)?',
    screenNameMessage: 'Nome da tela:',
    screenRouteMessage: 'Rota da tela (ex.: /dashboard, /products/:id):',
    screenDescriptionMessage: 'Descrição da tela:',
    screenAddAnotherMessage: 'Adicionar outra tela?',
    apiEndpointsMessage: 'Você quer definir endpoints de API?',
    apiEndpointMethodMessage: 'Método HTTP:',
    apiEndpointPathMessage: 'Caminho do endpoint (ex.: /api/users, /api/orders/:id):',
    apiEndpointDescriptionMessage: 'Descrição do endpoint:',
    apiEndpointAuthRequiredMessage: 'Autenticação é obrigatória?',
    apiEndpointAddAnotherMessage: 'Adicionar outro endpoint?',
    businessContextMessage: 'Descreva o contexto de negócio e principais casos de uso:',
    businessContextDefault: 'Uma plataforma para gerenciar ordens de serviço, clientes e técnicos.',
    userRolesMessage: 'Você quer definir papéis de usuário e permissões?',
    userRoleNameMessage: 'Nome do papel (ex.: Admin, Cliente, Técnico):',
    userRoleDescriptionMessage: 'Descrição do papel:',
    userRolePermissionsMessage: 'Permissões (separe por vírgula, ex.: create_order,view_orders,manage_users):',
    userRoleAddAnotherMessage: 'Adicionar outro papel?',
    workflowEntitiesMessage: 'Você quer definir fluxos de negócio (transições de status)?',
    workflowNameMessage: 'Nome do fluxo (ex.: Status da OS, Ciclo de Vida do Projeto):',
    workflowDescriptionMessage: 'Descrição do fluxo:',
    workflowStatusesMessage: 'Status (separe por vírgula, ex.: Rascunho,Ativo,Concluido,Cancelado):',
    workflowTransitionsMessage: 'Transições permitidas (ex.: Rascunho→Ativo, Ativo→Concluido):',
    workflowAddAnotherMessage: 'Adicionar outro fluxo?',
    agentGuidanceMessage: 'Alguma orientação específica para agentes de IA trabalhando neste projeto?',
    agentGuidanceDefault: 'Siga o modelo de domínio estritamente. Estenda entidades apenas conforme documentado. Valide todas as regras de negócio.',
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
    ormMessage: '¿Qué ORM quieres usar?',
    ormPrismaLabel: '🔷 Prisma (type-safe, moderno)',
    ormDrizzleLabel: '⚡ Drizzle (ligero, rápido)',
    ormSequelizeLabel: '🔄 Sequelize (clásico, maduro)',
    ormTypeormLabel: '📦 TypeORM (decorators, enterprise)',
    ormMongooseLabel: '🍃 Mongoose (MongoDB)',
    ormKnexLabel: '🔨 Knex.js (SQL query builder)',
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
    domainEntitiesMessage: '¿Quieres definir entidades de dominio para tu proyecto?',
    domainEntityNameMessage: 'Nombre de la entidad (ej.: User, Product, Order):',
    domainEntityDescriptionMessage: 'Descripción de la entidad:',
    domainEntityFieldsMessage: 'Define los campos para esta entidad',
    domainEntityFieldNameMessage: 'Nombre del campo:',
    domainEntityFieldTypeMessage: 'Tipo del campo:',
    domainEntityFieldRequiredMessage: '¿Este campo es obligatorio?',
    domainEntityFieldUniqueMessage: '¿Este campo es único?',
    domainEntityAddMoreFieldsMessage: '¿Añadir otro campo?',
    domainEntityAddAnotherMessage: '¿Añadir otra entidad?',
    userJourneysMessage: '¿Quieres definir flujos de usuario (user journeys)?',
    userJourneyNameMessage: 'Nombre del flujo (ej.: "Crear Pedido", "Registro de Usuario"):',
    userJourneyDescriptionMessage: 'Descripción del flujo:',
    userJourneyStepsMessage: 'Define los pasos para este flujo',
    userJourneyStepActionMessage: 'Acción del paso:',
    userJourneyStepScreenMessage: 'Pantalla involucrada (opcional):',
    userJourneyAddMoreStepsMessage: '¿Añadir otro paso?',
    userJourneyAddAnotherMessage: '¿Añadir otro flujo?',
    screenMapMessage: '¿Quieres definir el mapa de pantallas (estructura de navegación)?',
    screenNameMessage: 'Nombre de la pantalla:',
    screenRouteMessage: 'Ruta de la pantalla (ej.: /dashboard, /products/:id):',
    screenDescriptionMessage: 'Descripción de la pantalla:',
    screenAddAnotherMessage: '¿Añadir otra pantalla?',
    apiEndpointsMessage: '¿Quieres definir endpoints de API?',
    apiEndpointMethodMessage: 'Método HTTP:',
    apiEndpointPathMessage: 'Ruta del endpoint (ej.: /api/users, /api/orders/:id):',
    apiEndpointDescriptionMessage: 'Descripción del endpoint:',
    apiEndpointAuthRequiredMessage: '¿Se requiere autenticación?',
    apiEndpointAddAnotherMessage: '¿Añadir otro endpoint?',
    businessContextMessage: 'Describe tu contexto de negocio y principales casos de uso:',
    businessContextDefault: 'Una plataforma para gestionar órdenes de servicio, clientes y técnicos.',
    userRolesMessage: '¿Quieres definir roles de usuario y permisos?',
    userRoleNameMessage: 'Nombre del rol (ej.: Admin, Cliente, Técnico):',
    userRoleDescriptionMessage: 'Descripción del rol:',
    userRolePermissionsMessage: 'Permisos (separados por comas, ej.: create_order,view_orders,manage_users):',
    userRoleAddAnotherMessage: '¿Añadir otro rol?',
    workflowEntitiesMessage: '¿Quieres definir flujos de negocio (transiciones de estado)?',
    workflowNameMessage: 'Nombre del flujo (ej.: Estado de Orden, Ciclo de Vida del Proyecto):',
    workflowDescriptionMessage: 'Descripción del flujo:',
    workflowStatusesMessage: 'Estados (separados por comas, ej.: Borrador,Activo,Completado,Cancelado):',
    workflowTransitionsMessage: 'Transiciones permitidas (ej.: Borrador→Activo, Activo→Completado):',
    workflowAddAnotherMessage: '¿Añadir otro flujo?',
    agentGuidanceMessage: '¿Alguna orientación específica para agentes de IA trabajando en este proyecto?',
    agentGuidanceDefault: 'Sigue el modelo de dominio estrictamente. Extiende entidades solo según lo documentado. Valida todas las reglas de negocio.',
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

async function askDomainEntities(language: SupportedLanguage): Promise<DomainEntity[]> {
  const texts = PROMPT_TEXTS[language];
  const entities: DomainEntity[] = [];

  const wantEntities = await inquirer.prompt<{ wantEntities: boolean }>([
    {
      type: 'confirm',
      name: 'wantEntities',
      message: texts.domainEntitiesMessage,
      default: false,
    },
  ]);

  if (!wantEntities.wantEntities) {
    return entities;
  }

  let addAnother = true;
  while (addAnother) {
    const entityAnswer = await inquirer.prompt<{ name: string; description: string }>([
      {
        type: 'input',
        name: 'name',
        message: texts.domainEntityNameMessage,
        validate: (input: string) => input.trim().length > 0 || 'Entity name is required',
      },
      {
        type: 'input',
        name: 'description',
        message: texts.domainEntityDescriptionMessage,
      },
    ]);

    const fields: EntityField[] = [];
    let addMoreFields = true;
    while (addMoreFields) {
      const fieldAnswer = await inquirer.prompt<{
        name: string;
        type: EntityField['type'];
        required: boolean;
        unique: boolean;
      }>([
        {
          type: 'input',
          name: 'name',
          message: texts.domainEntityFieldNameMessage,
          validate: (input: string) => input.trim().length > 0 || 'Field name is required',
        },
        {
          type: 'list',
          name: 'type',
          message: texts.domainEntityFieldTypeMessage,
          choices: [
            { name: 'String', value: 'string' },
            { name: 'Number', value: 'number' },
            { name: 'Boolean', value: 'boolean' },
            { name: 'Date', value: 'date' },
            { name: 'Email', value: 'email' },
            { name: 'Text (long)', value: 'text' },
            { name: 'JSON', value: 'json' },
          ],
        },
        {
          type: 'confirm',
          name: 'required',
          message: texts.domainEntityFieldRequiredMessage,
          default: true,
        },
        {
          type: 'confirm',
          name: 'unique',
          message: texts.domainEntityFieldUniqueMessage,
          default: false,
        },
      ]);

      fields.push({
        name: fieldAnswer.name,
        type: fieldAnswer.type,
        required: fieldAnswer.required,
        unique: fieldAnswer.unique,
      });

      const moreFields = await inquirer.prompt<{ addMore: boolean }>([
        {
          type: 'confirm',
          name: 'addMore',
          message: texts.domainEntityAddMoreFieldsMessage,
          default: true,
        },
      ]);
      addMoreFields = moreFields.addMore;
    }

    entities.push({
      name: entityAnswer.name,
      description: entityAnswer.description,
      fields,
    });

    const another = await inquirer.prompt<{ addAnother: boolean }>([
      {
        type: 'confirm',
        name: 'addAnother',
        message: texts.domainEntityAddAnotherMessage,
        default: true,
      },
    ]);
    addAnother = another.addAnother;
  }

  return entities;
}

async function askUserJourneys(language: SupportedLanguage): Promise<UserJourney[]> {
  const texts = PROMPT_TEXTS[language];
  const journeys: UserJourney[] = [];

  const wantJourneys = await inquirer.prompt<{ wantJourneys: boolean }>([
    {
      type: 'confirm',
      name: 'wantJourneys',
      message: texts.userJourneysMessage,
      default: false,
    },
  ]);

  if (!wantJourneys.wantJourneys) {
    return journeys;
  }

  let addAnother = true;
  while (addAnother) {
    const journeyAnswer = await inquirer.prompt<{ name: string; description: string }>([
      {
        type: 'input',
        name: 'name',
        message: texts.userJourneyNameMessage,
        validate: (input: string) => input.trim().length > 0 || 'Journey name is required',
      },
      {
        type: 'input',
        name: 'description',
        message: texts.userJourneyDescriptionMessage,
      },
    ]);

    const steps: JourneyStep[] = [];
    let addMoreSteps = true;
    let stepOrder = 1;
    while (addMoreSteps) {
      const stepAnswer = await inquirer.prompt<{ action: string; screen?: string }>([
        {
          type: 'input',
          name: 'action',
          message: texts.userJourneyStepActionMessage,
          validate: (input: string) => input.trim().length > 0 || 'Step action is required',
        },
        {
          type: 'input',
          name: 'screen',
          message: texts.userJourneyStepScreenMessage,
        },
      ]);

      steps.push({
        order: stepOrder++,
        action: stepAnswer.action,
        screen: stepAnswer.screen || undefined,
      });

      const moreSteps = await inquirer.prompt<{ addMore: boolean }>([
        {
          type: 'confirm',
          name: 'addMore',
          message: texts.userJourneyAddMoreStepsMessage,
          default: true,
        },
      ]);
      addMoreSteps = moreSteps.addMore;
    }

    journeys.push({
      name: journeyAnswer.name,
      description: journeyAnswer.description,
      steps,
    });

    const another = await inquirer.prompt<{ addAnother: boolean }>([
      {
        type: 'confirm',
        name: 'addAnother',
        message: texts.userJourneyAddAnotherMessage,
        default: true,
      },
    ]);
    addAnother = another.addAnother;
  }

  return journeys;
}

async function askScreenMap(language: SupportedLanguage): Promise<ScreenMap[]> {
  const texts = PROMPT_TEXTS[language];
  const screens: ScreenMap[] = [];

  const wantScreens = await inquirer.prompt<{ wantScreens: boolean }>([
    {
      type: 'confirm',
      name: 'wantScreens',
      message: texts.screenMapMessage,
      default: false,
    },
  ]);

  if (!wantScreens.wantScreens) {
    return screens;
  }

  let addAnother = true;
  while (addAnother) {
    const screenAnswer = await inquirer.prompt<{ name: string; route: string; description: string }>(
      [
        {
          type: 'input',
          name: 'name',
          message: texts.screenNameMessage,
          validate: (input: string) => input.trim().length > 0 || 'Screen name is required',
        },
        {
          type: 'input',
          name: 'route',
          message: texts.screenRouteMessage,
          validate: (input: string) => input.trim().length > 0 || 'Screen route is required',
        },
        {
          type: 'input',
          name: 'description',
          message: texts.screenDescriptionMessage,
        },
      ]
    );

    screens.push({
      name: screenAnswer.name,
      route: screenAnswer.route,
      description: screenAnswer.description,
    });

    const another = await inquirer.prompt<{ addAnother: boolean }>([
      {
        type: 'confirm',
        name: 'addAnother',
        message: texts.screenAddAnotherMessage,
        default: true,
      },
    ]);
    addAnother = another.addAnother;
  }

  return screens;
}

async function askApiEndpoints(language: SupportedLanguage): Promise<ApiEndpoint[]> {
  const texts = PROMPT_TEXTS[language];
  const endpoints: ApiEndpoint[] = [];

  const wantEndpoints = await inquirer.prompt<{ wantEndpoints: boolean }>([
    {
      type: 'confirm',
      name: 'wantEndpoints',
      message: texts.apiEndpointsMessage,
      default: false,
    },
  ]);

  if (!wantEndpoints.wantEndpoints) {
    return endpoints;
  }

  let addAnother = true;
  while (addAnother) {
    const endpointAnswer = await inquirer.prompt<{
      method: ApiEndpoint['method'];
      path: string;
      description: string;
      authRequired: boolean;
    }>([
      {
        type: 'list',
        name: 'method',
        message: texts.apiEndpointMethodMessage,
        choices: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          { name: 'PUT', value: 'PUT' },
          { name: 'DELETE', value: 'DELETE' },
          { name: 'PATCH', value: 'PATCH' },
        ],
      },
      {
        type: 'input',
        name: 'path',
        message: texts.apiEndpointPathMessage,
        validate: (input: string) => input.trim().length > 0 || 'Endpoint path is required',
      },
      {
        type: 'input',
        name: 'description',
        message: texts.apiEndpointDescriptionMessage,
      },
      {
        type: 'confirm',
        name: 'authRequired',
        message: texts.apiEndpointAuthRequiredMessage,
        default: true,
      },
    ]);

    endpoints.push({
      method: endpointAnswer.method,
      path: endpointAnswer.path,
      description: endpointAnswer.description,
      authRequired: endpointAnswer.authRequired,
    });

    const another = await inquirer.prompt<{ addAnother: boolean }>([
      {
        type: 'confirm',
        name: 'addAnother',
        message: texts.apiEndpointAddAnotherMessage,
        default: true,
      },
    ]);
    addAnother = another.addAnother;
  }

  return endpoints;
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

  // ORM question (only for projects with database)
  let orm: 'prisma' | 'drizzle' | 'sequelize' | 'typeorm' | 'mongoose' | 'knex' | undefined;
  if (database && ['api', 'fullstack'].includes(answers.type)) {
    const ormAnswer = await inquirer.prompt<{
      orm: 'prisma' | 'drizzle' | 'sequelize' | 'typeorm' | 'mongoose' | 'knex';
    }>([
      {
        type: 'list',
        name: 'orm',
        message: texts.ormMessage,
        choices: [
          { name: texts.ormPrismaLabel, value: 'prisma' },
          { name: texts.ormDrizzleLabel, value: 'drizzle' },
          { name: texts.ormSequelizeLabel, value: 'sequelize' },
          { name: texts.ormTypeormLabel, value: 'typeorm' },
          { name: texts.ormMongooseLabel, value: 'mongoose' },
          { name: texts.ormKnexLabel, value: 'knex' },
        ],
        default: 'prisma',
      },
    ]);
    orm = ormAnswer.orm;
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

  // Ask about domain entities (for projects with database)
  const domainEntities: DomainEntity[] =
    database && ['api', 'fullstack'].includes(answers.type)
      ? await askDomainEntities(cliLanguage)
      : [];

  // Ask about user journeys
  const userJourneys: UserJourney[] = await askUserJourneys(cliLanguage);

  // Ask about screen map
  const screenMap: ScreenMap[] =
    ['web', 'fullstack'].includes(answers.type) && answers.framework === 'react'
      ? await askScreenMap(cliLanguage)
      : [];

  // Ask about API endpoints (for projects with backend)
  const apiEndpoints: ApiEndpoint[] =
    ['api', 'fullstack'].includes(answers.type)
      ? await askApiEndpoints(cliLanguage)
      : [];

  // Ask about business context
  const businessContextAnswer = await inquirer.prompt<{ businessContext: string }>([
    {
      type: 'input',
      name: 'businessContext',
      message: texts.businessContextMessage,
      default: texts.businessContextDefault,
    },
  ]);

  // Ask about user roles
  const userRoles: UserRole[] = [];
  const wantRoles = await inquirer.prompt<{ wantRoles: boolean }>([
    {
      type: 'confirm',
      name: 'wantRoles',
      message: texts.userRolesMessage,
      default: true,
    },
  ]);

  if (wantRoles.wantRoles) {
    let addAnotherRole = true;
    while (addAnotherRole) {
      const roleAnswer = await inquirer.prompt<{ name: string; description: string; permissions: string }>([
        {
          type: 'input',
          name: 'name',
          message: texts.userRoleNameMessage,
          validate: (input: string) => input.trim().length > 0 || 'Role name is required',
        },
        {
          type: 'input',
          name: 'description',
          message: texts.userRoleDescriptionMessage,
        },
        {
          type: 'input',
          name: 'permissions',
          message: texts.userRolePermissionsMessage,
        },
      ]);

      userRoles.push({
        name: roleAnswer.name,
        description: roleAnswer.description,
        permissions: roleAnswer.permissions.split(',').map((p: string) => p.trim()).filter((p: string) => p.length > 0),
      });

      const another = await inquirer.prompt<{ addAnother: boolean }>([
        {
          type: 'confirm',
          name: 'addAnother',
          message: texts.userRoleAddAnotherMessage,
          default: true,
        },
      ]);
      addAnotherRole = another.addAnother;
    }
  }

  // Ask about workflows
  const workflows: Workflow[] = [];
  const wantWorkflows = await inquirer.prompt<{ wantWorkflows: boolean }>([
    {
      type: 'confirm',
      name: 'wantWorkflows',
      message: texts.workflowEntitiesMessage,
      default: true,
    },
  ]);

  if (wantWorkflows.wantWorkflows) {
    let addAnotherWorkflow = true;
    while (addAnotherWorkflow) {
      const workflowAnswer = await inquirer.prompt<{ name: string; description: string; statuses: string; transitions: string }>([
        {
          type: 'input',
          name: 'name',
          message: texts.workflowNameMessage,
          validate: (input: string) => input.trim().length > 0 || 'Workflow name is required',
        },
        {
          type: 'input',
          name: 'description',
          message: texts.workflowDescriptionMessage,
        },
        {
          type: 'input',
          name: 'statuses',
          message: texts.workflowStatusesMessage,
        },
        {
          type: 'input',
          name: 'transitions',
          message: texts.workflowTransitionsMessage,
        },
      ]);

      workflows.push({
        name: workflowAnswer.name,
        description: workflowAnswer.description,
        statuses: workflowAnswer.statuses.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0),
        transitions: workflowAnswer.transitions.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0),
      });

      const another = await inquirer.prompt<{ addAnother: boolean }>([
        {
          type: 'confirm',
          name: 'addAnother',
          message: texts.workflowAddAnotherMessage,
          default: true,
        },
      ]);
      addAnotherWorkflow = another.addAnother;
    }
  }

  // Ask about agent guidance
  const agentGuidanceAnswer = await inquirer.prompt<{ agentGuidance: string }>([
    {
      type: 'input',
      name: 'agentGuidance',
      message: texts.agentGuidanceMessage,
      default: texts.agentGuidanceDefault,
    },
  ]);

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
    orm,
    auth,
    globalState: globalState && globalState !== 'none' ? globalState : undefined,
    features: featuresAnswer.features,
    pages: pagesAnswer.pages,
    components: componentsAnswer.components,
    colorPalette,
    typography,
    cliLanguage,
    primaryLocale: localeAnswer.primaryLocale,
    domainEntities: domainEntities.length > 0 ? domainEntities : undefined,
    userJourneys: userJourneys.length > 0 ? userJourneys : undefined,
    screenMap: screenMap.length > 0 ? screenMap : undefined,
    apiEndpoints: apiEndpoints.length > 0 ? apiEndpoints : undefined,
    businessContext: businessContextAnswer.businessContext,
    userRoles: userRoles.length > 0 ? userRoles : undefined,
    workflows: workflows.length > 0 ? workflows : undefined,
    agentGuidance: agentGuidanceAnswer.agentGuidance,
  };
}
