"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePRD = generatePRD;
exports.formatPRD = formatPRD;
function generatePRD(config) {
    const userPersonas = [
        {
            name: 'Usuário Primário',
            role: 'Usuário final do sistema',
            goals: [
                'Realizar tarefas de forma eficiente',
                'Ter uma experiência intuitiva e agradável',
                'Acessar informações relevantes rapidamente',
            ],
            painPoints: [
                'Sistemas lentos e complicados',
                'Falta de clareza nas funcionalidades',
                'Dificuldade em encontrar o que precisa',
            ],
            behaviors: [
                'Acessa o sistema diariamente',
                'Prefere atalhos e funcionalidades rápidas',
                'Valoriza feedback visual imediato',
            ],
        },
        {
            name: 'Administrador',
            role: 'Gestor do sistema',
            goals: [
                'Gerenciar usuários e permissões',
                'Monitorar o uso do sistema',
                'Gerar relatórios e insights',
            ],
            painPoints: [
                'Falta de visibilidade sobre o sistema',
                'Processos manuais repetitivos',
                'Dificuldade em auditar ações',
            ],
            behaviors: [
                'Acessa o sistema para configurações',
                'Precisa de controles granulares',
                'Valoriza logs e histórico de ações',
            ],
        },
    ];
    const userStories = [
        {
            id: 'US001',
            title: 'Cadastro de usuário',
            description: 'Como usuário, quero me cadastrar na plataforma para acessar as funcionalidades do sistema',
            acceptanceCriteria: [
                'O usuário deve poder informar nome, e-mail e senha',
                'O sistema deve validar e-mail único',
                'A senha deve ter no mínimo 8 caracteres',
                'O usuário deve receber e-mail de confirmação',
            ],
            priority: 'high',
        },
        {
            id: 'US002',
            title: 'Login de usuário',
            description: 'Como usuário cadastrado, quero fazer login para acessar minha conta',
            acceptanceCriteria: [
                'O usuário deve poder logar com e-mail e senha',
                'O sistema deve validar credenciais incorretas',
                'Deve haver opção de "Esqueci minha senha"',
                'O login deve manter sessão ativa',
            ],
            priority: 'high',
        },
        {
            id: 'US003',
            title: 'Dashboard principal',
            description: 'Como usuário, quero visualizar um dashboard com informações relevantes ao acessar o sistema',
            acceptanceCriteria: [
                'O dashboard deve carregar em até 2 segundos',
                'Deve mostrar informações resumidas e acessíveis',
                'Deve permitir navegação rápida para outras seções',
            ],
            priority: 'high',
        },
        {
            id: 'US004',
            title: 'User profile',
            description: 'As a user, I want to manage my profile so I can keep my information up to date',
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
            description: 'As a user, I want to receive notifications about relevant activity',
            acceptanceCriteria: [
                'The system notifies the user about important actions',
                'The user can configure notification preferences',
                'There is a notification center available to the user',
            ],
            priority: 'medium',
        },
    ];
    const functionalRequirements = [
        {
            id: 'FR001',
            title: 'Authentication system',
            description: 'The system must implement secure user authentication with support for login, registration and password recovery',
            priority: 'high',
        },
        {
            id: 'FR002',
            title: 'Session management',
            description: 'The system must manage user sessions with automatic timeout and the ability to log out from all devices',
            priority: 'high',
        },
        {
            id: 'FR003',
            title: 'Core entity CRUD',
            description: 'The system must allow creating, reading, updating and deleting the core business entities',
            priority: 'high',
        },
        {
            id: 'FR004',
            title: 'Search and filters',
            description: 'The system must provide data search and filtering capabilities using multiple criteria',
            priority: 'medium',
        },
        {
            id: 'FR005',
            title: 'Data export',
            description: 'The system must allow exporting data in common formats (CSV, PDF, Excel)',
            priority: 'medium',
        },
        {
            id: 'FR006',
            title: 'Responsiveness',
            description: 'The system must be fully responsive and work on mobile devices, tablets and desktop',
            priority: 'high',
        },
        {
            id: 'FR007',
            title: 'Accessibility',
            description: 'The system must follow WCAG 2.1 level AA accessibility guidelines',
            priority: 'high',
        },
    ];
    const nonFunctionalRequirements = [
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
    const technicalStack = {
        frontend: [
            config.framework === 'nextjs' ? 'Next.js 14+' : config.framework === 'react' ? 'React 18+' : config.framework,
            config.language === 'typescript' ? 'TypeScript 5+' : 'JavaScript ES6+',
            config.styling === 'tailwind' ? 'Tailwind CSS' : config.styling === 'scss' ? 'SCSS' : config.styling === 'styled-components' ? 'Styled Components' : 'CSS Modules',
            'React Query / SWR for data fetching',
            'Zustand / Redux Toolkit for global state',
            'React Hook Form for forms',
            'Zod for schema validation',
        ],
        backend: config.database ? [
            config.framework === 'express' ? 'Express.js' : config.framework === 'fastify' ? 'Fastify' : config.framework === 'fastapi' ? 'FastAPI' : 'Node.js',
            'Prisma ORM / Drizzle',
            'JWT for authentication',
            'Bcrypt for password hashing',
        ] : undefined,
        database: config.database ? config.database.toUpperCase() : undefined,
        hosting: 'Vercel / Netlify (frontend) + Railway / Render (backend)',
        tools: [
            'Git and GitHub',
            'Prettier and ESLint',
            'Husky for git hooks',
            'Docker for containerization',
            'GitHub Actions for CI/CD',
            'Storybook for component documentation',
        ],
    };
    const milestones = [
        {
            phase: 'Fase 1 - Fundação',
            duration: '1-2 semanas',
            deliverables: [
                'Setup do projeto e configuração de ferramentas',
                'Implementação do Design System',
                'Estrutura de pastas e arquitetura',
                'Configuração de CI/CD',
            ],
        },
        {
            phase: 'Fase 2 - Autenticação',
            duration: '1-2 semanas',
            deliverables: [
                'Sistema de login e cadastro',
                'Recuperação de senha',
                'Proteção de rotas',
                'Gerenciamento de sessão',
            ],
        },
        {
            phase: 'Fase 3 - Funcionalidades Core',
            duration: '3-4 semanas',
            deliverables: [
                'Implementação das páginas principais',
                'Componentes principais',
                'Integração com API/backend',
                'Gerenciamento de estado',
            ],
        },
        {
            phase: 'Fase 4 - Funcionalidades Avançadas',
            duration: '2-3 semanas',
            deliverables: [
                'Dashboard e analytics',
                'Notificações',
                'Upload de arquivos',
                'Exportação de dados',
            ],
        },
        {
            phase: 'Fase 5 - Polimento e Testes',
            duration: '1-2 semanas',
            deliverables: [
                'Testes automatizados',
                'Otimização de performance',
                'Acessibilidade',
                'Documentação',
                'Deploy em produção',
            ],
        },
    ];
    const successMetrics = [
        'Tempo de carregamento da página inicial < 3s',
        'Score Lighthouse > 90 em todas as categorias',
        'Taxa de conversão de cadastro > 60%',
        'Taxa de retenção de usuários (D7) > 40%',
        'NPS (Net Promoter Score) > 50',
        'Cobertura de testes > 80%',
        'Zero erros críticos em produção',
        'Tempo de resposta da API < 200ms (p95)',
    ];
    const prd = {
        overview: `The project **${config.projectName}** is ${config.description.toLowerCase()}.
This document describes the product requirements, features, user personas,
user stories, technical requirements and success metrics to guide development.`,
        objectives: [
            `Build a modern and efficient ${config.type} application using ${config.framework}`,
            'Provide an exceptional user experience with an intuitive interface',
            'Implement the core features needed to solve the user problem',
            'Ensure scalability, security and maintainability of the codebase',
            'Follow industry best practices for development and design',
        ],
        targetAudience: config.targetAudience,
        userPersonas: userPersonas,
        userStories: userStories,
        functionalRequirements: functionalRequirements,
        nonFunctionalRequirements: nonFunctionalRequirements,
        technicalStack: technicalStack,
        milestones: milestones,
        successMetrics: successMetrics,
    };
    return prd;
}
function formatPRD(prd) {
    let markdown = `# 📋 Product Requirements Document (PRD)\n\n`;
    markdown += `## ${prd.overview}\n\n`;
    markdown += `## 🎯 Objectives\n\n`;
    prd.objectives.forEach((obj, i) => {
        markdown += `${i + 1}. ${obj}\n`;
    });
    markdown += `\n`;
    markdown += `## 👥 Target Audience\n\n`;
    markdown += `${prd.targetAudience}\n\n`;
    markdown += `## 🎭 User Personas\n\n`;
    prd.userPersonas.forEach((persona) => {
        markdown += `### ${persona.name}\n`;
        markdown += `**Role:** ${persona.role}\n\n`;
        markdown += `**Goals:**\n`;
        persona.goals.forEach((goal) => {
            markdown += `- ${goal}\n`;
        });
        markdown += `\n**Pain Points:**\n`;
        persona.painPoints.forEach((pain) => {
            markdown += `- ${pain}\n`;
        });
        markdown += `\n**Behaviors:**\n`;
        persona.behaviors.forEach((behavior) => {
            markdown += `- ${behavior}\n`;
        });
        markdown += `\n---\n\n`;
    });
    markdown += `## 📖 User Stories\n\n`;
    prd.userStories.forEach((story) => {
        markdown += `### ${story.id} - ${story.title}\n`;
        markdown += `**Description:** ${story.description}\n\n`;
        markdown += `**Acceptance Criteria:**\n`;
        story.acceptanceCriteria.forEach((criteria) => {
            markdown += `- [ ] ${criteria}\n`;
        });
        markdown += `**Priority:** ${story.priority === 'high' ? '🔴 High' : story.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}\n\n`;
    });
    markdown += `## ⚙️ Functional Requirements\n\n`;
    prd.functionalRequirements.forEach((req) => {
        const priorityIcon = req.priority === 'high' ? '🔴' : req.priority === 'medium' ? '🟡' : '🟢';
        markdown += `### ${req.id} - ${req.title}\n`;
        markdown += `${req.description}\n\n`;
        markdown += `**Prioridade:** ${priorityIcon} ${req.priority.toUpperCase()}\n\n`;
    });
    markdown += `## 📐 Non-Functional Requirements\n\n`;
    prd.nonFunctionalRequirements.forEach((req, i) => {
        markdown += `${i + 1}. ${req}\n`;
    });
    markdown += `\n`;
    markdown += `## 🛠️ Technical Stack\n\n`;
    markdown += `### Frontend\n`;
    prd.technicalStack.frontend.forEach((tech) => {
        markdown += `- ${tech}\n`;
    });
    markdown += `\n`;
    if (prd.technicalStack.backend) {
        markdown += `### Backend\n`;
        prd.technicalStack.backend.forEach((tech) => {
            markdown += `- ${tech}\n`;
        });
        markdown += `\n`;
    }
    if (prd.technicalStack.database) {
        markdown += `### Database\n`;
        markdown += `- ${prd.technicalStack.database}\n\n`;
    }
    if (prd.technicalStack.hosting) {
        markdown += `### Hosting\n`;
        markdown += `- ${prd.technicalStack.hosting}\n\n`;
    }
    markdown += `### Tooling\n`;
    prd.technicalStack.tools.forEach((tool) => {
        markdown += `- ${tool}\n`;
    });
    markdown += `\n`;
    markdown += `## 📅 Milestones\n\n`;
    prd.milestones.forEach((milestone) => {
        markdown += `### ${milestone.phase} (${milestone.duration})\n`;
        milestone.deliverables.forEach((deliverable) => {
            markdown += `- [ ] ${deliverable}\n`;
        });
        markdown += `\n`;
    });
    markdown += `## 📊 Success Metrics\n\n`;
    prd.successMetrics.forEach((metric, i) => {
        markdown += `${i + 1}. ${metric}\n`;
    });
    markdown += `\n`;
    markdown += `---\n\n`;
    markdown += `*Document automatically generated by the sparkseed CLI*\n`;
    return markdown;
}
//# sourceMappingURL=prd-generator.js.map