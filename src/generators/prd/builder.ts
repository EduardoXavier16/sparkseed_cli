import {
  FunctionalRequirement,
  Milestone,
  PRD,
  ProjectConfig,
  TechnicalStack,
  UserPersona,
  UserStory,
} from '../../types';

export function generatePRD(config: ProjectConfig): PRD {
  const userPersonas: UserPersona[] = buildUserPersonas();
  const userStories: UserStory[] = buildUserStories(config);
  const functionalRequirements: FunctionalRequirement[] = buildFunctionalRequirements(config);
  const nonFunctionalRequirements: string[] = buildNonFunctionalRequirements();
  const technicalStack: TechnicalStack = buildTechnicalStack(config);
  const milestones: Milestone[] = buildMilestones();
  const successMetrics: string[] = buildSuccessMetrics();
  
  // Build AI guidance section
  const aiGuidanceSection = config.agentGuidance 
    ? `\n\n## 🤖 Para o Agente de IA\n\n${config.agentGuidance}\n\n### ⚠️ Importante: Extensões Necessárias\n\nEste PRD define a estrutura BASE. Um agente de IA DEVE:\n\n1. **Expandir as entidades** conforme o contexto de negócio específico\n2. **Adicionar campos** necessários para as regras de negócio\n3. **Criar novos endpoints** não documentados aqui\n4. **Implementar validações** específicas do domínio\n\n${config.businessContext ? `\n**Contexto de Negócio:**\n${config.businessContext}\n` : ''}
${config.userRoles && config.userRoles.length > 0 ? `\n**Papéis de Usuário Definidos:**\n${config.userRoles.map((role, idx) => `${idx + 1}. **${role.name}** - ${role.description}\n   - Permissões: ${role.permissions.join(', ') || 'não definidas'}`).join('\n')}\n` : ''}
${config.workflows && config.workflows.length > 0 ? `\n**Workflows de Negócio:**\n${config.workflows.map((workflow, idx) => `${idx + 1}. **${workflow.name}** - ${workflow.description}\n   - Status: ${workflow.statuses.join(' → ')}\n   - Transições: ${workflow.transitions.join(', ')}`).join('\n')}\n` : ''}
### 📋 Checklist para o Agente

Antes de começar a implementar, o agente deve:

- [ ] Ler e entender o DOMAIN_MODEL.md completo
- [ ] Ler e entender o API.md completo  
- [ ] Ler e entender o SCREEN_MAP.md completo
- [ ] Identificar entidades/campos faltantes para o domínio específico
- [ ] Documentar extensões propostas antes de implementar
- [ ] Validar regras de negócio com o DOMAIN_MODEL.md
- [ ] Seguir padrões de código do AGENT_GUIDE.md

**NUNCA invente:**
- Entidades não documentadas sem justificativa
- Campos sem descrição no domínio
- Endpoints sem especificação no API.md
- Regras de negócio não validadas
` 
    : '';
  
  const userJourneysSection = config.userJourneys && config.userJourneys.length > 0
    ? '\n\n## User Journeys\n\n' + config.userJourneys.map((journey, idx) => {
        const steps = journey.steps.map((step, stepIdx) => 
          `   ${stepIdx + 1}. **${step.action}**${step.screen ? ` (Screen: ${step.screen})` : ''}${step.description ? ` - ${step.description}` : ''}`
        ).join('\n');
        const preConds = journey.preConditions?.length ? `\n\n**Pre-conditions:**\n${journey.preConditions.map(c => `- ${c}`).join('\n')}` : '';
        const postConds = journey.postConditions?.length ? `\n\n**Post-conditions:**\n${journey.postConditions.map(c => `- ${c}`).join('\n')}` : '';
        return `### ${idx + 1}. ${journey.name}\n\n${journey.description}${preConds}\n\n**Steps:**\n${steps}${postConds}\n`;
      }).join('\n')
    : '';

  const overview = `The project **${config.projectName}** is ${config.description.toLowerCase()}.
This document describes the product requirements, features, user personas,
user stories, user journeys, technical requirements and success metrics to guide development.${userJourneysSection}${aiGuidanceSection}`;

  return {
    overview,
    objectives: [
      `Build a modern and efficient ${config.type} application using ${config.framework}`,
      'Provide an exceptional user experience with an intuitive interface',
      'Implement the core features needed to solve the user problem',
      'Ensure scalability, security and maintainability of the codebase',
      'Follow industry best practices for development and design',
    ],
    targetAudience: config.targetAudience,
    userPersonas,
    userStories,
    functionalRequirements,
    nonFunctionalRequirements,
    technicalStack,
    milestones,
    successMetrics,
  };
}

function buildUserPersonas(): UserPersona[] {
  return [
    {
      name: 'Primary User',
      role: 'End user of the system',
      goals: [
        'Perform tasks efficiently',
        'Have an intuitive and pleasant experience',
        'Access relevant information quickly',
      ],
      painPoints: [
        'Slow and complex systems',
        'Lack of clarity in functionality',
        'Difficulty finding what they need',
      ],
      behaviors: [
        'Accesses the system daily',
        'Prefers shortcuts and fast actions',
        'Values immediate visual feedback',
      ],
    },
    {
      name: 'Administrator',
      role: 'System manager',
      goals: [
        'Manage users and permissions',
        'Monitor system usage',
        'Generate reports and insights',
      ],
      painPoints: [
        'Lack of visibility into the system',
        'Repetitive manual processes',
        'Difficulty auditing actions',
      ],
      behaviors: [
        'Accesses the system for configuration',
        'Needs granular controls',
        'Values logs and action history',
      ],
    },
  ];
}

function buildUserStories(config: ProjectConfig): UserStory[] {
  const baseStories: UserStory[] = [
    {
      id: 'US001',
      title: 'User registration',
      description:
        'As a user, I want to register on the platform to access the system features',
      acceptanceCriteria: [
        'The user can provide name, email and password',
        'The system validates email uniqueness',
        'The password has at least 8 characters',
        'The user receives a confirmation email',
      ],
      priority: 'high',
    },
    {
      id: 'US002',
      title: 'User login',
      description: 'As a registered user, I want to log in so I can access my account',
      acceptanceCriteria: [
        'The user can log in with email and password',
        'The system validates incorrect credentials',
        'There is a "Forgot my password" option',
        'Login keeps the session active',
      ],
      priority: 'high',
    },
    {
      id: 'US003',
      title: 'Main dashboard',
      description:
        'As a user, I want to see a dashboard with relevant information when I access the system',
      acceptanceCriteria: [
        'The dashboard loads in up to 2 seconds',
        'It shows summarized and accessible information',
        'It allows quick navigation to other sections',
      ],
      priority: 'high',
    },
    {
      id: 'US004',
      title: 'User profile',
      description:
        'As a user, I want to manage my profile so I can keep my information up to date',
      acceptanceCriteria: [
        'The user can edit name and personal data',
        'The user can change the password',
        'The user can upload a profile picture',
      ],
      priority: 'medium',
    },
    {
      id: 'US005',
      title: 'Notifications',
      description:
        'As a user, I want to receive notifications about relevant activity',
      acceptanceCriteria: [
        'The system notifies the user about important actions',
        'The user can configure notification preferences',
        'There is a notification center available to the user',
      ],
      priority: 'medium',
    },
  ];

  // Add user stories from configured user journeys
  if (config.userJourneys && config.userJourneys.length > 0) {
    config.userJourneys.forEach((journey, idx) => {
      baseStories.push({
        id: `US${String(100 + idx + 1)}`,
        title: journey.name,
        description: `As a user, I want to ${journey.description.toLowerCase()} so I can achieve my goal`,
        acceptanceCriteria: journey.steps.map((step) => 
          `The system allows the user to: ${step.action}${step.screen ? ` on ${step.screen}` : ''}`
        ),
        priority: 'high',
      });
    });
  }

  return baseStories;
}

function buildFunctionalRequirements(config: ProjectConfig): FunctionalRequirement[] {
  const baseRequirements: FunctionalRequirement[] = [
    {
      id: 'FR001',
      title: 'Authentication system',
      description:
        'The system must implement secure user authentication with support for login, registration and password recovery',
      priority: 'high',
    },
    {
      id: 'FR002',
      title: 'Session management',
      description:
        'The system must manage user sessions with automatic timeout and the ability to log out from all devices',
      priority: 'high',
    },
    {
      id: 'FR003',
      title: 'Core entity CRUD',
      description:
        'The system must allow creating, reading, updating and deleting the core business entities',
      priority: 'high',
    },
    {
      id: 'FR004',
      title: 'Search and filters',
      description:
        'The system must provide data search and filtering capabilities using multiple criteria',
      priority: 'medium',
    },
    {
      id: 'FR005',
      title: 'Data export',
      description:
        'The system must allow exporting data in common formats (CSV, PDF, Excel)',
      priority: 'medium',
    },
    {
      id: 'FR006',
      title: 'Responsiveness',
      description:
        'The system must be fully responsive and work on mobile devices, tablets and desktop',
      priority: 'high',
    },
    {
      id: 'FR007',
      title: 'Accessibility',
      description:
        'The system must follow WCAG 2.1 level AA accessibility guidelines',
      priority: 'high',
    },
  ];

  // Add functional requirements from domain entities
  if (config.domainEntities && config.domainEntities.length > 0) {
    config.domainEntities.forEach((entity, idx) => {
      baseRequirements.push({
        id: `FR${String(100 + idx + 1)}`,
        title: `${entity.name} management`,
        description: `The system must allow managing ${entity.name.toLowerCase()} entities with the following fields: ${entity.fields.map(f => f.name).join(', ')}`,
        priority: 'high',
      });
    });
  }

  return baseRequirements;
}

function buildNonFunctionalRequirements(): string[] {
  return [
    'The system must have an initial load time under 3 seconds',
    'The system must support at least 1000 concurrent users',
    'The system must provide 99.9% availability (uptime)',
    'The system must enforce HTTPS for all communications',
    'The system must follow OWASP security best practices',
    'The codebase must maintain at least 80% test coverage',
    'The system must support the latest two versions of Chrome, Firefox, Safari and Edge',
    'The system must follow ESLint/Prettier code style rules',
    'The system must have up-to-date technical documentation',
    'The system must support internationalization (i18n)',
  ];
}

function buildTechnicalStack(config: ProjectConfig): TechnicalStack {
  const frontendStack: string[] = [
    config.framework === 'nextjs'
      ? 'Next.js 14+'
      : config.framework === 'react'
        ? 'React 18+'
        : config.framework,
    config.language === 'typescript' ? 'TypeScript 5+' : 'JavaScript ES6+',
    config.styling === 'tailwind'
      ? 'Tailwind CSS'
      : config.styling === 'scss'
        ? 'SCSS'
        : config.styling === 'styled-components'
          ? 'Styled Components'
          : 'CSS Modules',
    'React Query / SWR for data fetching',
    'Zustand / Redux Toolkit for global state',
    'React Hook Form for forms',
    'Zod for schema validation',
  ];

  const backendStack =
    config.database === undefined
      ? undefined
      : [
          config.framework === 'express'
            ? 'Express.js'
            : config.framework === 'fastify'
              ? 'Fastify'
              : config.framework === 'fastapi'
                ? 'FastAPI'
                : 'Node.js',
          'Prisma ORM / Drizzle',
          'JWT for authentication',
          'Bcrypt for password hashing',
        ];

  const databaseStack =
    config.database === undefined ? undefined : config.database.toUpperCase();

  const toolsStack: string[] = [
    'Git and GitHub',
    'Prettier and ESLint',
    'Husky for git hooks',
    'Docker for containerization',
    'GitHub Actions for CI/CD',
    'Storybook for component documentation',
  ];

  return {
    frontend: frontendStack,
    backend: backendStack,
    database: databaseStack,
    hosting: 'Vercel / Netlify (frontend) + Railway / Render (backend)',
    tools: toolsStack,
  };
}

function buildMilestones(): Milestone[] {
  return [
    {
      phase: 'Phase 1 - Foundation',
      duration: '1-2 weeks',
      deliverables: [
        'Project setup and tooling configuration',
        'Design System implementation',
        'Folder structure and architecture',
        'CI/CD configuration',
      ],
    },
    {
      phase: 'Phase 2 - Authentication',
      duration: '1-2 weeks',
      deliverables: [
        'Login and registration system',
        'Password recovery',
        'Route protection',
        'Session management',
      ],
    },
    {
      phase: 'Phase 3 - Core Features',
      duration: '3-4 weeks',
      deliverables: [
        'Implementation of main pages',
        'Core components',
        'Integration with API/backend',
        'State management',
      ],
    },
    {
      phase: 'Phase 4 - Advanced Features',
      duration: '2-3 weeks',
      deliverables: ['Dashboard and analytics', 'Notifications', 'File upload', 'Data export'],
    },
    {
      phase: 'Phase 5 - Polish and Testing',
      duration: '1-2 weeks',
      deliverables: [
        'Automated tests',
        'Performance optimization',
        'Accessibility improvements',
        'Documentation',
        'Production deployment',
      ],
    },
  ];
}

function buildSuccessMetrics(): string[] {
  return [
    'Initial home page load time < 3s',
    'Lighthouse score > 90 in all categories',
    'Sign-up conversion rate > 60%',
    'User retention rate (D7) > 40%',
    'NPS (Net Promoter Score) > 50',
    'Test coverage > 80%',
    'Zero critical errors in production',
    'API response time < 200ms (p95)',
  ];
}

