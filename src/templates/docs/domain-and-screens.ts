import type { ProjectConfig, SupportedLanguage } from '../types';

export function generateDomainModelDoc(config: ProjectConfig): string {
  const language: SupportedLanguage = config.cliLanguage ?? 'en';
  const entities = config.domainEntities || [];

  if (entities.length === 0) {
    return language === 'pt'
      ? '# Modelo de Domínio\n\nNenhuma entidade de domínio definida para este projeto.\n'
      : '# Domain Model\n\nNo domain entities defined for this project.\n';
  }

  if (language === 'pt') {
    const lines: string[] = [
      '# Modelo de Domínio',
      '',
      '## Visão Geral',
      '',
      'Este documento descreve as entidades de domínio, seus relacionamentos, regras de negócio e workflows.',
      '',
      '---',
      '',
      '## Entidades',
      '',
    ];

    entities.forEach((entity, entityIdx) => {
      lines.push(`### ${entityIdx + 1}. ${entity.name}`, '');
      lines.push(`**Descrição:** ${entity.description}`, '');

      // Tabela de campos
      lines.push('#### Campos', '');
      lines.push('| Campo | Tipo | Obrigatório | Único | Padrão | Descrição | Exemplo |');
      lines.push('|-------|------|-------------|-------|---------|-----------|---------|');

      entity.fields.forEach((field) => {
        const required = field.required ? '✅ Sim' : '❌ Não';
        const unique = field.unique ? '✅ Sim' : '❌ Não';
        const defaultValue = getDefaultValue(field.type);
        const description = field.description || getFieldDescription(field.name, field.type);
        const example = getFieldExample(field.type);

        lines.push(
          `| ${field.name} | \`${field.type}\` | ${required} | ${unique} | \`${defaultValue}\` | ${description} | \`${example}\` |`
        );
      });

      lines.push('');

      // Relacionamentos
      if (entity.relationships && entity.relationships.length > 0) {
        lines.push('#### Relacionamentos', '');
        lines.push('| Entidade Relacionada | Tipo | Descrição | Cardinalidade |');
        lines.push('|---------------------|------|-----------|---------------|');

        entity.relationships.forEach((rel) => {
          const cardinality = getCardinality(rel.type);
          lines.push(
            `| ${rel.entity} | ${rel.type} | ${rel.description || '-'} | ${cardinality} |`
          );
        });

        lines.push('');
      }

      // Regras de negócio
      lines.push('#### Regras de Negócio', '');
      lines.push(getBusinessRules(entity.name, config));
      lines.push('');

      // Validações
      lines.push('#### Validações', '');
      lines.push(getValidations(entity));
      lines.push('');

      // Exemplos de uso
      lines.push('#### Exemplos de Uso', '');
      lines.push(getUsageExamples(entity));
      lines.push('');

      lines.push('---');
      lines.push('');
    });

    // Workflows
    lines.push('## Workflows', '');
    lines.push(generateWorkflows(config));
    lines.push('');

    // Matriz de permissões
    lines.push('## Matriz de Permissões', '');
    lines.push(generatePermissionMatrix(config));
    lines.push('');

    return lines.join('\n');
  }

  // English version
  const lines: string[] = [
    '# Domain Model',
    '',
    '## Overview',
    '',
    'This document describes domain entities, their relationships, business rules, and workflows.',
    '',
    '---',
    '',
    '## Entities',
    '',
  ];

  entities.forEach((entity, entityIdx) => {
    lines.push(`### ${entityIdx + 1}. ${entity.name}`, '');
    lines.push(`**Description:** ${entity.description}`, '');

    // Fields table
    lines.push('#### Fields', '');
    lines.push('| Field | Type | Required | Unique | Default | Description | Example |');
    lines.push('|-------|------|----------|--------|---------|-------------|---------|');

    entity.fields.forEach((field) => {
      const required = field.required ? '✅ Yes' : '❌ No';
      const unique = field.unique ? '✅ Yes' : '❌ No';
      const defaultValue = getDefaultValue(field.type);
      const description = field.description || getFieldDescription(field.name, field.type);
      const example = getFieldExample(field.type);

      lines.push(
        `| ${field.name} | \`${field.type}\` | ${required} | ${unique} | \`${defaultValue}\` | ${description} | \`${example}\` |`
      );
    });

    lines.push('');

    // Relationships
    if (entity.relationships && entity.relationships.length > 0) {
      lines.push('#### Relationships', '');
      lines.push('| Related Entity | Type | Description | Cardinality |');
      lines.push('|---------------|------|-------------|-------------|');

      entity.relationships.forEach((rel) => {
        const cardinality = getCardinality(rel.type);
        lines.push(`| ${rel.entity} | ${rel.type} | ${rel.description || '-'} | ${cardinality} |`);
      });

      lines.push('');
    }

    // Business rules
    lines.push('#### Business Rules', '');
    lines.push(getBusinessRules(entity.name, config));
    lines.push('');

    // Validations
    lines.push('#### Validations', '');
    lines.push(getValidations(entity));
    lines.push('');

    // Usage examples
    lines.push('#### Usage Examples', '');
    lines.push(getUsageExamples(entity));
    lines.push('');

    lines.push('---');
    lines.push('');
  });

  // Workflows
  lines.push('## Workflows', '');
  lines.push(generateWorkflows(config));
  lines.push('');

  // Permission matrix
  lines.push('## Permission Matrix', '');
  lines.push(generatePermissionMatrix(config));
  lines.push('');

  return lines.join('\n');
}

function getDefaultValue(fieldType: string): string {
  const defaults: Record<string, string> = {
    string: "''",
    number: '0',
    boolean: 'false',
    date: 'now()',
    email: "''",
    text: "''",
    json: '{}',
  };
  return defaults[fieldType] || "''";
}

function getFieldDescription(fieldName: string, fieldType: string): string {
  const descriptions: Record<string, string> = {
    id: 'Identificador único',
    email: 'Endereço de email válido',
    password: 'Senha criptografada',
    name: 'Nome completo ou razão social',
    phone: 'Número de telefone',
    address: 'Endereço completo',
    status: 'Status atual do registro',
    createdAt: 'Data de criação',
    updatedAt: 'Data de última atualização',
  };
  return descriptions[fieldName.toLowerCase()] || `Campo do tipo ${fieldType}`;
}

function getFieldExample(fieldType: string): string {
  const examples: Record<string, string> = {
    string: '"texto"',
    number: '123',
    boolean: 'true',
    date: '2024-01-15T10:30:00Z',
    email: '"user@example.com"',
    text: '"texto longo..."',
    json: '{"key": "value"}',
  };
  return examples[fieldType] || '"exemplo"';
}

function getCardinality(relType: string): string {
  const cardinalities: Record<string, string> = {
    'one-to-many': '1:N',
    'many-to-many': 'N:M',
    'one-to-one': '1:1',
  };
  return cardinalities[relType] || relType;
}

function getBusinessRules(entityName: string, _config: ProjectConfig): string {
  const projectName = _config.projectName ?? 'aplicação';

  const rules: Record<string, string[]> = {
    User: [
      'Email deve ser único em todo o sistema',
      'Senha deve ter no mínimo 8 caracteres',
      'Senha deve conter letras maiúsculas, minúsculas e números',
      'Usuário não pode ser excluído se possuir registros relacionados',
    ],
    Order: [
      'Ordem só pode ser cancelada se estiver com status "Aberta"',
      'Ordem só pode ser iniciada se estiver com status "Aprovada"',
      'Ordem só pode ser concluída se estiver com status "Em andamento"',
      'Toda ordem deve ter pelo menos um item',
      'Valor total é calculado automaticamente',
    ],
    Product: [
      'SKU deve ser único',
      'Preço de venda deve ser maior que preço de custo',
      'Produto não pode ser excluído se possuir vendas vinculadas',
      'Estoque negativo não é permitido',
    ],
  };

  const entityRules = rules[entityName] || [
    `Registro deve ser criado com todos os campos obrigatórios no projeto ${projectName}`,
    `Campos únicos devem ser validados antes de salvar`,
    `Registro não pode ser excluído se possuir dependências`,
  ];

  return entityRules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n');
}

function getValidations(entity: {
  fields: Array<{ type: string; name: string; required?: boolean; unique?: boolean }>;
}): string {
  const validations: string[] = [];

  entity.fields.forEach((field) => {
    if (field.type === 'email') {
      validations.push(
        `- **${field.name}**: Deve ser um email válido (regex: /^[\\w-\\.]+@[\\w-]+\\.[a-z]{2,}$/i)`
      );
    }
    if (field.type === 'string' && field.name.toLowerCase().includes('phone')) {
      validations.push(`- **${field.name}**: Deve conter apenas números (regex: /^\\d{10,11}$/)`);
    }
    if (field.type === 'string' && field.name.toLowerCase().includes('password')) {
      validations.push(
        `- **${field.name}**: Mínimo 8 caracteres, deve conter maiúscula, minúscula e número`
      );
    }
    if (field.required) {
      validations.push(`- **${field.name}**: Campo obrigatório, não pode ser nulo ou vazio`);
    }
    if (field.unique) {
      validations.push(`- **${field.name}**: Deve ser único, verificar existência antes de salvar`);
    }
  });

  return validations.length > 0
    ? validations.join('\n')
    : '- Nenhuma validação específica além das padrão';
}

function getUsageExamples(entity: { name: string; fields: Array<{ name: string }> }): string {
  const entityNameLower = entity.name.toLowerCase();

  return `**Criar novo ${entityNameLower}:**
\`\`\`typescript
const ${entityNameLower} = await ${entityNameLower}Repository.create({
  ${entity.fields[0]?.name || 'name'}: 'Exemplo',
  ${entity.fields[1]?.name || 'email'}: 'exemplo@email.com',
});
\`\`\`

**Buscar por ID:**
\`\`\`typescript
const ${entityNameLower} = await ${entityNameLower}Repository.findById('uuid');
\`\`\`

**Atualizar:**
\`\`\`typescript
await ${entityNameLower}Repository.update('uuid', {
  ${entity.fields[0]?.name || 'name'}: 'Novo valor',
});
\`\`\`

**Excluir:**
\`\`\`typescript
await ${entityNameLower}Repository.delete('uuid');
\`\`\`
`;
}

function generateWorkflows(config: ProjectConfig): string {
  if (config.userJourneys && config.userJourneys.length > 0) {
    return config.userJourneys
      .map((journey, idx) => {
        const steps = journey.steps
          .map(
            (step, stepIdx) =>
              `   ${stepIdx + 1}. **${step.action}**${step.screen ? ` (Tela: ${step.screen})` : ''}`
          )
          .join('\n');

        return `### ${idx + 1}. ${journey.name}
**Descrição:** ${journey.description}

**Pré-condições:**
${journey.preConditions?.map((c: string) => `- ${c}`).join('\n') || '- Nenhuma'}

**Passos:**
${steps}

**Pós-condições:**
${journey.postConditions?.map((c: string) => `- ${c}`).join('\n') || '- Nenhuma'}

---
`;
      })
      .join('\n');
  }

  return `### 1. Fluxo de Autenticação

**Descrição:** Processo completo de autenticação de usuário

**Pré-condições:**
- Usuário deve estar cadastrado no sistema

**Passos:**
   1. Usuário acessa tela de login
   2. Usuário insere email e senha
   3. Sistema valida credenciais
   4. Sistema gera token JWT
   5. Sistema redireciona para dashboard

**Pós-condições:**
- Usuário autenticado recebe token de acesso
- Token é armazenado no localStorage/cookie

---

### 2. Fluxo de CRUD

**Descrição:** Operação padrão de Create, Read, Update, Delete

**Pré-condições:**
- Usuário deve estar autenticado
- Usuário deve ter permissão para a operação

**Passos:**
   1. Usuário acessa lista de registros
   2. Sistema busca registros no banco
   3. Usuário seleciona ação (criar/editar/excluir)
   4. Sistema valida dados
   5. Sistema persiste alteração

**Pós-condições:**
- Dados são persistidos no banco
- Usuário recebe feedback da operação

---
`;
}

function generatePermissionMatrix(_config: ProjectConfig): string {
  const operations = ['create', 'read', 'update', 'delete'];

  let matrix = '| Entidade | Admin | User | Guest |\n';
  matrix += '|----------|-------|------|-------|\n';

  if (_config.domainEntities && _config.domainEntities.length > 0) {
    _config.domainEntities.forEach((entity) => {
      const adminPerms = operations.map(() => '✅').join(' ');
      const userPerms = ['read', 'update']
        .map(() => '✅')
        .concat(['create', 'delete'].map(() => '❌'))
        .join(' ');
      const guestPerms = operations.map(() => '❌').join(' ');

      matrix += `| ${entity.name} | ${adminPerms} | ${userPerms} | ${guestPerms} |\n`;
    });
  }

  matrix += `
**Legenda:**
- ✅ = Permitido
- ❌ = Negado
- ⚠️ = Permitido com restrições

**Regras de Permissão:**
1. **Admin**: Acesso completo a todas as entidades e operações
2. **User**: Pode ler e atualizar seus próprios registros
3. **Guest**: Apenas leitura de entidades públicas
`;

  return matrix;
}

export function generateScreensMapDoc(config: ProjectConfig): string {
  const language: SupportedLanguage = config.cliLanguage ?? 'en';
  const screens = config.screenMap || [];

  if (screens.length === 0) {
    return language === 'pt'
      ? '# Mapa de Telas\n\nNenhum mapa de telas definido para este projeto.\n'
      : '# Screen Map\n\nNo screen map defined for this project.\n';
  }

  if (language === 'pt') {
    const lines: string[] = [
      '# Mapa de Telas',
      '',
      '## Visão Geral',
      '',
      'Este documento descreve a estrutura de navegação, telas, componentes e ações do usuário.',
      '',
      '---',
      '',
      '## Hierarquia de Navegação',
      '',
      '```',
      '/',
      '├── /home              (Página Inicial)',
      '├── /dashboard         (Dashboard)',
      '├── /auth',
      '│   ├── /login         (Login)',
      '│   └── /register      (Registro)',
      '├── /orders            (Ordens de Serviço)',
      '│   ├── /new           (Nova Ordem)',
      '│   └── /:id           (Detalhes da Ordem)',
      '└── /settings          (Configurações)',
      '```',
      '',
      '---',
      '',
      '## Catálogo de Telas',
      '',
    ];

    screens.forEach((screen, idx) => {
      lines.push(`### ${idx + 1}. ${screen.name}`, '');
      lines.push(`**Rota:** \`${screen.route}\``, '');
      lines.push(`**Descrição:** ${screen.description}`, '');

      // Propósito
      lines.push('#### Propósito', '');
      lines.push(getScreenPurpose(screen.name, config));
      lines.push('');

      // Componentes
      lines.push('#### Componentes Principais', '');
      lines.push(getScreenComponents(screen.name));
      lines.push('');

      // Ações do usuário
      lines.push('#### Ações do Usuário', '');
      lines.push(getUserActions(screen.name));
      lines.push('');

      // Dados necessários
      lines.push('#### Dados Necessários', '');
      lines.push(getRequiredData(screen.name, config));
      lines.push('');

      // Validações
      lines.push('#### Validações', '');
      lines.push(getScreenValidations(screen.name));
      lines.push('');

      // Estados
      lines.push('#### Estados da Tela', '');
      lines.push(getScreenStates(screen.name));
      lines.push('');

      // Navegação
      lines.push('#### Navegação', '');
      lines.push(getNavigation(screen.route));
      lines.push('');

      lines.push('---');
      lines.push('');
    });

    // Fluxos de navegação
    lines.push('## Fluxos de Navegação', '');
    lines.push(generateNavigationFlows(config));
    lines.push('');

    return lines.join('\n');
  }

  // English version
  const lines: string[] = [
    '# Screen Map',
    '',
    '## Overview',
    '',
    'This document describes navigation structure, screens, components, and user actions.',
    '',
    '---',
    '',
    '## Navigation Hierarchy',
    '',
    '```',
    '/',
    '├── /home              (Home Page)',
    '├── /dashboard         (Dashboard)',
    '├── /auth',
    '│   ├── /login         (Login)',
    '│   └── /register      (Register)',
    '├── /orders            (Service Orders)',
    '│   ├── /new           (New Order)',
    '│   └── /:id           (Order Details)',
    '└── /settings          (Settings)',
    '```',
    '',
    '---',
    '',
    '## Screen Catalog',
    '',
  ];

  screens.forEach((screen, idx) => {
    lines.push(`### ${idx + 1}. ${screen.name}`, '');
    lines.push(`**Route:** \`${screen.route}\``, '');
    lines.push(`**Description:** ${screen.description}`, '');

    // Purpose
    lines.push('#### Purpose', '');
    lines.push(getScreenPurpose(screen.name, config));
    lines.push('');

    // Components
    lines.push('#### Main Components', '');
    lines.push(getScreenComponents(screen.name));
    lines.push('');

    // User actions
    lines.push('#### User Actions', '');
    lines.push(getUserActions(screen.name));
    lines.push('');

    // Required data
    lines.push('#### Required Data', '');
    lines.push(getRequiredData(screen.name, config));
    lines.push('');

    // Validations
    lines.push('#### Validations', '');
    lines.push(getScreenValidations(screen.name));
    lines.push('');

    // States
    lines.push('#### Screen States', '');
    lines.push(getScreenStates(screen.name));
    lines.push('');

    // Navigation
    lines.push('#### Navigation', '');
    lines.push(getNavigation(screen.route));
    lines.push('');

    lines.push('---');
    lines.push('');
  });

  // Navigation flows
  lines.push('## Navigation Flows', '');
  lines.push(generateNavigationFlows(config));
  lines.push('');

  return lines.join('\n');
}

function getScreenPurpose(screenName: string, _config: ProjectConfig): string {
  const projectName = _config.projectName ?? 'aplicação';

  const purposes: Record<string, string> = {
    Home: 'Página inicial do sistema. Apresenta visão geral e acesso rápido às funcionalidades principais.',
    Dashboard: 'Painel de controle com métricas, gráficos e resumo das atividades recentes.',
    Login: 'Autenticação de usuários cadastrados no sistema.',
    Register: 'Cadastro de novos usuários no sistema.',
    Orders: 'Lista de ordens de serviço com filtros e ordenação.',
    'New Order': 'Formulário para criação de nova ordem de serviço.',
    'Order Details': 'Visualização detalhada de uma ordem de serviço específica.',
    Settings: 'Configurações do sistema e preferências do usuário.',
    Profile: 'Gerenciamento do perfil do usuário.',
  };

  return (
    purposes[screenName] ||
    `Tela para gerenciamento de ${screenName.toLowerCase()} no projeto ${projectName}.`
  );
}

function getScreenComponents(screenName: string): string {
  const components: Record<string, string[]> = {
    Home: [
      '- `Header` - Cabeçalho com logo e menu de navegação',
      '- `HeroSection` - Seção de destaque com call-to-action',
      '- `FeaturesGrid` - Grid com principais funcionalidades',
      '- `Footer` - Rodapé com links institucionais',
    ],
    Dashboard: [
      '- `StatsCards` - Cards com métricas principais',
      '- `RecentOrdersTable` - Tabela de ordens recentes',
      '- `ActivityChart` - Gráfico de atividades',
      '- `QuickActions` - Botões de ações rápidas',
    ],
    Login: [
      '- `LoginForm` - Formulário de login',
      '- `EmailInput` - Campo de email com validação',
      '- `PasswordInput` - Campo de senha com toggle de visibilidade',
      '- `SubmitButton` - Botão de submit',
      '- `ForgotPasswordLink` - Link para recuperação de senha',
    ],
    Orders: [
      '- `OrdersTable` - Tabela de ordens com paginação',
      '- `FiltersBar` - Barra de filtros e busca',
      '- `StatusBadge` - Badge de status da ordem',
      '- `ActionButton` - Botões de ação (editar, excluir)',
    ],
    'New Order': [
      '- `OrderForm` - Formulário de ordem de serviço',
      '- `CustomerSelect` - Select de clientes com busca',
      '- `ServiceTypeSelect` - Select de tipos de serviço',
      '- `DatePicker` - Seletor de data',
      '- `FileUpload` - Upload de anexos',
      '- `SubmitButton` - Botão de submit',
    ],
  };

  const screenComponents = components[screenName] || [
    '- `PageHeader` - Cabeçalho da página com título e breadcrumbs',
    '- `ContentArea` - Área de conteúdo principal',
    '- `LoadingSpinner` - Indicador de carregamento',
  ];

  return screenComponents.join('\n');
}

function getUserActions(screenName: string): string {
  const actions: Record<string, string[]> = {
    Home: [
      '1. **Clicar em "Começar"** → Navega para /dashboard',
      '2. **Clicar em funcionalidade** → Navega para tela específica',
      '3. **Clicar em "Login"** → Navega para /auth/login',
    ],
    Dashboard: [
      '1. **Clicar em ordem** → Navega para detalhes da ordem',
      '2. **Clicar em "Nova Ordem"** → Navega para /orders/new',
      '3. **Filtrar por status** → Atualiza lista de ordens',
      '4. **Exportar relatório** → Baixa PDF/CSV',
    ],
    Login: [
      '1. **Preencher email** → Valida formato de email',
      '2. **Preencher senha** → Toggle de visibilidade',
      '3. **Clicar "Entrar"** → Submete formulário',
      '4. **Clicar "Esqueci senha"** → Navega para /auth/forgot-password',
    ],
    'New Order': [
      '1. **Selecionar cliente** → Abre modal de busca',
      '2. **Preencher formulário** → Validação em tempo real',
      '3. **Adicionar anexos** → Upload de arquivos',
      '4. **Clicar "Salvar"** → Cria ordem e redireciona',
      '5. **Clicar "Cancelar"** → Volta para lista de ordens',
    ],
  };

  const screenActions = actions[screenName] || [
    '1. **Preencher campos** → Validação em tempo real',
    '2. **Clicar em salvar** → Submete formulário',
    '3. **Clicar em cancelar** → Volta para tela anterior',
  ];

  return screenActions.join('\n');
}

function getRequiredData(screenName: string, _config: ProjectConfig): string {
  const data: Record<string, string> = {
    Home: '- Nenhuma (página pública)',
    Dashboard: `- **Usuário autenticado** (JWT token)
- **Estatísticas** (API: GET /api/stats)
- **Ordens recentes** (API: GET /api/orders?limit=5)`,
    Login: '- Nenhuma (página pública)',
    Orders: `- **Usuário autenticado** (JWT token)
- **Lista de ordens** (API: GET /api/orders)
- **Filtros aplicados** (query params)`,
    'New Order': `- **Usuário autenticado** (JWT token)
- **Lista de clientes** (API: GET /api/customers)
- **Tipos de serviço** (API: GET /api/service-types)`,
    'Order Details': `- **Usuário autenticado** (JWT token)
- **ID da ordem** (URL param: :id)
- **Dados da ordem** (API: GET /api/orders/:id)`,
  };

  const projectName = _config.projectName ?? 'aplicação';

  return (
    data[screenName] ||
    `- **Usuário autenticado** (JWT token)
- **Dados específicos** (consultar documentação da API do projeto ${projectName})`
  );
}

function getScreenValidations(screenName: string): string {
  const validations: Record<string, string[]> = {
    Login: [
      '- Email: formato válido, obrigatório',
      '- Senha: obrigatória, mínimo 8 caracteres',
      '- Rate limiting: máximo 5 tentativas por minuto',
    ],
    'New Order': [
      '- Cliente: obrigatório, deve existir no sistema',
      '- Descrição: obrigatória, mínimo 10 caracteres',
      '- Data: obrigatória, não pode ser data passada',
      '- Anexos: máximo 5 arquivos, 10MB cada',
    ],
    Register: [
      '- Email: formato válido, único no sistema',
      '- Senha: mínimo 8 caracteres, maiúscula, minúscula, número',
      '- Confirmação de senha: deve coincidir com senha',
      '- Termos: deve aceitar termos de uso',
    ],
  };

  const screenValidations = validations[screenName] || [
    '- Campos obrigatórios: validação em tempo real',
    '- Formato dos dados: validação com regex',
    '- Integração: validação de existência no backend',
  ];

  return screenValidations.join('\n');
}

function getScreenStates(screenName: string): string {
  const screenLabel = screenName || 'tela';

  return `- **Contexto** → Estados principais da ${screenLabel}
- **Loading** → Exibe skeleton/loading spinner
- **Success** → Exibe conteúdo principal
- **Error** → Exibe mensagem de erro com opção de retry
- **Empty** → Exibe mensagem quando não há dados (se aplicável)
- **Offline** → Exibe aviso de conexão (se aplicável)`;
}

function getNavigation(_currentRoute: string): string {
  const routeLabel = _currentRoute || 'rota atual';

  return `**Rota atual:** \`${routeLabel}\`

**Vem de:**
- Tela anterior (histórico do navegador)
- Redirect após login (se aplicável)

**Vai para:**
- Detalhes (ao clicar em item)
- Edição (ao clicar em editar)
- Lista (ao cancelar ou após salvar)

**Query Params:**
- \`?page=1\` - Paginação
- \`?sort=createdAt\` - Ordenação
- \`?filter=status\` - Filtros`;
}

function generateNavigationFlows(_config: ProjectConfig): string {
  const projectName = _config.projectName ?? 'aplicação';

  return `### 1. Fluxo de Autenticação

\`\`\`
/home → /auth/login → /dashboard
              ↓
       /auth/forgot-password
\`\`\`

**Descrição:** Usuário navega da home para login, após autenticação é redirecionado para dashboard do projeto ${projectName}.

---

### 2. Fluxo de Ordem de Serviço

\`\`\`
/dashboard → /orders → /orders/new → /orders/:id
                    ↓                      ↓
              (lista ordens)         (detalhes ordem)
\`\`\`

**Descrição:** Usuário acessa lista de ordens, cria nova ordem, visualiza detalhes.

---

### 3. Fluxo de Edição

\`\`\`
/orders/:id → /orders/:id/edit → /orders/:id
              (form edição)      (atualizado)
\`\`\`

**Descrição:** Usuário visualiza ordem, clica em editar, salva alterações e retorna para detalhes.

---
`;
}
