# sparkseed – Roadmap de Melhorias

## 1. Internacionalização Completa (i18n)

- [x] Usar `cliLanguage` (`en` | `pt` | `es`) também nos _generators_:
  - [x] `generatePRD`: gerar PRD em EN/PT/ES.
  - [x] `generateDesignSystem`: gerar DESIGN_SYSTEM.md em EN/PT/ES.
  - [x] `generateProjectStructure`: gerar README, ARCHITECTURE.md e outros textos em EN/PT/ES.
- [x] Definir **fallback padrão**:
  - [x] Se `cliLanguage` não estiver definido, assumir `'en'`.

## 2. Consistência de Idioma nas Mensagens da CLI

- [x] Padronizar mensagens da CLI que ainda estão em Português:
  - [x] Atualizar textos em `src/generators/file-writer.ts` (`Criando estrutura do projeto...`, `Projeto criado com sucesso!`, `Erro ao criar projeto`).
- [x] Opcional: internacionalizar mensagens de _spinner_ e logs de CLI com base em `cliLanguage`.

## 3. Rigor de TypeScript Alinhado ao Padrão do Projeto

- [x] Tipagem explícita em testes:
  - [x] Em `tests/generators.test.ts`, tipar `mockConfig` como `ProjectConfig`.
- [x] Evitar `any` também no código gerado:
  - [x] Ajustar templates de backend (em `src/generators/project-structure.ts`) para usar tipos dedicados (ex.: `AuthRequest`) em vez de `req as any` no código gerado.

## 4. Refatoração de `generateProjectStructure`

- [x] Quebrar a função em partes menores e focadas:
  - [x] `buildFrontendStructure(config: ProjectConfig): ProjectStructure`
  - [x] `buildBackendStructure(config: ProjectConfig): ProjectStructure | null`
  - [x] `buildDocsStructure(config: ProjectConfig): ProjectStructure`
  - [x] `buildDockerCompose(config: ProjectConfig): ProjectStructure | null`
- [x] Manter `generateProjectStructure` apenas como orquestrador dessas funções.

## 5. Geração de Frontend Mais Moderna

- [x] TSConfig gerado mais “rigoroso”:
  - [x] Habilitar `strict: true`.
  - [x] Habilitar `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, etc.
- [x] Estado global opcional:
  - [x] Perguntar se o usuário quer `Zustand` ou `Redux Toolkit` (quando fizer sentido).
  - [x] Gerar boilerplate de store de acordo com escolha.
- [x] Testes de componentes gerados:
  - [x] Conteúdo real de testes em `*.test.tsx` usando Vitest + React Testing Library.
  - [x] Cobrir render básico + props principais dos componentes.

## 6. Backend – Segurança e Boas Práticas

- [x] CORS configurável:
  - [x] Extrair config de CORS para `config.cors` e deixar claro como restringir `origin`.
- [x] Variáveis de ambiente sensíveis:
  - [x] Evitar `JWT_SECRET` com fallback fraco (`'default-secret'`) no código gerado.
  - [x] Adicionar aviso (ou comentário) deixando explícito que `JWT_SECRET` **deve** ser configurado.
- [x] Tratamento de erros de Prisma:
  - [x] Criar exemplos de tratamento de erros do Prisma convertidos em `HttpError`.
  - [x] Usar esse padrão nos serviços gerados (`user.service`, etc.).

## 7. DX da Própria CLI `sparkseed`

- [x] Scripts adicionais em `package.json` da CLI:
  - [x] Adicionar `lint` (ESLint) e `format` (Prettier) para o próprio projeto da CLI.
- [x] Configuração de ESLint/Prettier:
  - [x] Adicionar `.eslintrc` com regras alinhadas ao padrão rigoroso (sem `any`, etc.).
  - [x] Adicionar configuração de Prettier para consistência de formatação.

## 8. Biome como Padrão nos Projetos Gerados

- [x] Adicionar Biome como dependência de desenvolvimento nos templates gerados (frontend/backend).
- [x] Gerar arquivo de configuração do Biome (`biome.json` ou equivalente) com regras alinhadas ao padrão do projeto.
- [x] Adicionar scripts `lint`/`format` baseados em Biome nos `package.json` gerados.
- [x] (Opcional) Manter compatibilidade com ESLint/Prettier apenas quando explicitamente desejado.
- [x] Aplicar Biome também na própria CLI `sparkseed` para lint/format.

## 9. Expansão da Suíte de Testes

- [x] Cobrir mais combinações de `ProjectConfig`:
  - [x] `type: 'api'` (apenas backend).
  - [x] `type: 'fullstack'` (frontend + backend + docker-compose).
  - [x] Diferentes `framework` (`react`, `nextjs`, outros).
  - [x] Diferentes opções de `styling`.
- [x] Testar comportamento com `cliLanguage`:
  - [x] Validar que mensagens de `inquirer` mudam conforme `cliLanguage`.
  - [x] (Opcional) Testar que PRD/Design System gerados respeitam o idioma, assim que a i18n dos artefatos for implementada.

## 10. Internacionalização dos Utilitários Gerados

- [x] Tornar `formatDate` / `formatCurrency` configuráveis por locale:
  - [x] Perguntar na CLI qual locale principal (`en-US`, `pt-BR`, `es-ES`, etc.).
  - [x] Gerar utilitários com `Intl.DateTimeFormat` / `Intl.NumberFormat` usando esse locale.
  - [x] Evitar fixar `pt-BR` e `BRL` como padrão “hardcoded”.

## 11. Pequenos Ajustes de Consistência

- [x] Remover qualquer string remanescente em PT no código fixo ou mover para sistema de i18n.
- [x] Revisar labels/emojis para manter consistência entre idiomas (nomes de páginas, mensagens de help, etc.).
- [x] Garantir que novas features sigam o padrão:
  - [x] Sem `any`.
  - [x] Sem `console.log` (apenas `console.warn`/`console.error` quando necessário).
  - [x] Funções curtas e focadas, com tipos de retorno explícitos.

## 12. QA e Qualidade do Projeto Gerado

- [x] Estrutura de testes end-to-end:
  - [x] Adicionar template de ferramenta E2E (ex.: Playwright) para o frontend.
  - [x] Gerar testes E2E básicos para fluxo de autenticação e páginas principais.
- [x] Cobertura de testes mínima:
  - [x] Configurar thresholds de coverage em Vitest para components, hooks e services.
- [x] Testes de backend:
  - [x] Adicionar exemplos de testes unitários e de integração para rotas e serviços Express.
- [x] Pipelines de qualidade:
  - [x] Scripts `test`, `test:watch` e `test:coverage` prontos no boilerplate.

## 13. SEO, Performance e Acessibilidade

- [x] Metadados SEO padrão:
  - [x] Gerar tags `<title>` e `<meta>` (description, Open Graph, Twitter) nos templates de páginas.
- [x] Arquivos auxiliares:
  - [x] Gerar `sitemap.xml` e `robots.txt` com base nas páginas configuradas.
- [x] Acessibilidade:
  - [x] Checklist básico de acessibilidade em documentação (ex.: `docs/ACCESSIBILITY.md`).
  - [x] Componentes padrão com foco visível e atributos ARIA essenciais.
- [x] Performance:
  - [x] Incluir no README orientações de uso de Lighthouse e Web Vitals no projeto gerado.

## 14. Projeto Web Completo (A a Z)

- [x] Workflow de desenvolvimento pronto:
  - [x] Gerar scripts para `dev`, `build`, `lint`, `test`, `e2e`, `format` e `typecheck` nos projetos gerados.
- [x] Exemplo de CI/CD:
  - [x] Adicionar template de workflow (ex.: GitHub Actions) rodando lint, testes e build.
- [x] Checklists de entrega:
  - [x] Gerar checklist de release (ex.: `docs/RELEASE_CHECKLIST.md`) cobrindo QA, SEO e deploy.
- [x] Onboarding do time:
  - [x] Seção dedicada no README explicando o fluxo de trabalho de ponta a ponta (A → Z) para o projeto gerado.

## 15. Guia para Agentes de IA (Agent Guide)

- [x] Estrutura de documentação para LLMs:
  - [x] Definir arquivo `docs/AGENT_GUIDE.md` com foco em agentes de IA.
  - [x] Descrever a arquitetura geral do projeto gerado e principais pastas (`frontend`, `backend`, `docs`, etc.).
  - [x] Explicar os contratos de tipos e convenções de import (aliases `@/...`) que os agentes devem respeitar.
- [x] Checklists de alteração guiados:
  - [x] Criar checklists passo a passo para tarefas típicas (ex.: adicionar página, adicionar endpoint, criar fluxo de autenticação).
  - [x] Incluir seções “Antes de alterar”, “Durante a alteração” e “Após a alteração” com validações obrigatórias (lint, testes, typecheck).
- [x] Regras de segurança para LLMs:
  - [x] Deixar explícito o que **não** deve ser modificado automaticamente (ex.: secrets, configs sensíveis, arquivos de migração).
  - [x] Orientar sempre a rodar testes e linters antes de sugerir mudanças finais.
- [x] Padrões de commit e PR para agentes:
  - [x] Sugerir formato de mensagens de commit e descrição de PR que facilitem revisão humana de mudanças propostas por IA.

## 16. Subgenerators da CLI

- [x] Subgenerators de frontend:
  - [x] `sparkseed generate component` para criar componente + estilos + teste alinhados ao Design System.
  - [x] `sparkseed generate page` para criar página + teste básico de render.
- [x] Subgenerators de backend:
  - [x] `sparkseed generate resource` para criar rota + controller + service + testes base.
- [x] Subgenerators de testes:
  - [x] `sparkseed generate test:component` e `sparkseed generate test:api` seguindo o padrão Vitest + RTL.
- [x] Subgenerators de documentação:
  - [x] `sparkseed generate doc:feature` e checklists de release/QA baseados nos docs existentes.

## 17. Suporte a Múltiplos ORMs e Bancos de Dados

- [x] Escolha de ORM na CLI para projetos com backend (ex.: Prisma, Drizzle, Sequelize).
- [x] Escolha de banco de dados por ORM (ex.: PostgreSQL, MySQL, SQLite, outros suportados).
- [x] Geração de configuração, dependências e schema/migrations alinhados ao ORM e banco escolhidos.
- [x] Ajuste dos templates de services/repositories para desacoplar acesso a dados da lógica de domínio.

## 18. Modelagem de Domínio Específica por Projeto

- [x] Perguntar na CLI pelas entidades de domínio (nome, descrição, tipo de dado, obrigatoriedade).
- [x] Permitir definir relacionamentos (1-N, N-N) entre entidades e restrições básicas.
- [x] Gerar documentação de modelo de domínio (ex.: `docs/DOMAIN_MODEL.md`) com tabelas de campos e relacionamentos.
- [x] Gerar/atualizar `schema.prisma` (ou equivalente) com base no modelo de domínio definido, indo além apenas de `User`.
- [x] Integrar o modelo de domínio com o PRD (seções de entidades e suas responsabilidades).

## 19. Especificação Detalhada de APIs de Domínio

- [x] Para cada entidade, permitir configurar endpoints (CRUD + ações específicas) via CLI.
- [x] Gerar seções detalhadas em `docs/API.md` com método, path, query params, body e resposta.
- [x] Documentar códigos de erro e mensagens de negócio para cada endpoint (incluindo casos de validação).
- [x] Gerar skeletons de controllers/services alinhados a esses contratos, sem lógica de domínio implementada.
- [x] Manter contratos de API estáveis para que agentes de IA não precisem “inventar” endpoints.

## 20. Fluxos de Uso (User Journeys) de Negócio

- [x] Perguntar na CLI pelos principais fluxos de negócio (ex.: “criar pedido”, “aprovar orçamento”).
- [x] Descrever passo a passo cada fluxo (pré-condições, passos, pós-condições, erros principais).
- [x] Integrar fluxos ao PRD em uma seção dedicada de “User Journeys”.
- [x] Sugerir quais endpoints/telas estão envolvidos em cada fluxo para orientar implementação.
- [x] Opcional: gerar esqueleto de testes de integração ou E2E baseados nesses fluxos.

## 21. Mapa de Telas e Navegação

- [x] Perguntar na CLI quais páginas/telas principais o projeto terá e seu objetivo.
- [x] Gerar uma visão de “mapa de telas” (ex.: `docs/SCREENS_MAP.md`) com rotas, hierarquia e navegação.
- [x] Relacionar telas com user stories e fluxos de uso existentes no PRD.
- [x] Ajustar templates de páginas para refletir esse mapa de telas (nomes de rotas, títulos, breadcrumbs).
- [x] Garantir que o Design System e o mapa de telas forneçam contexto suficiente para agentes de IA criarem UI sem improvisar estrutura.

## 22. Expansão de ORMs e Bancos de Dados

- [x] Adicionar TypeORM como opção de ORM:
  - [x] Template de configuração do TypeORM.
  - [x] Scripts de migration e seed.
  - [x] Exemplos de repositórios e entities.
- [x] Adicionar Knex.js como query builder:
  - [x] Configuração de Knex com migrations.
  - [x] Exemplos de queries tipadas.
- [x] Suporte a MongoDB:
  - [x] Mongoose como ODM.
  - [x] Schemas e models de exemplo.
  - [x] Integração com o backend gerado.
- [x] Suporte a Redis:
  - [x] Configuração de cache com Redis.
  - [x] Exemplos de session store.
  - [x] Rate limiting com Redis.
- [x] Suporte a Supabase:
  - [x] Configuração do cliente Supabase.
  - [x] Exemplos de queries com Supabase client.
  - [x] Integração com autenticação Supabase.

## 23. Integração Avançada com IA

- [x] Comando `sparkseed ai:chat` para conversar sobre o projeto:
  - [x] Contexto do projeto carregado automaticamente.
  - [x] Sugestões de arquitetura e padrões.
  - [x] Explicação de código existente.
- [x] Comando `sparkseed ai:refactor` para refatoração guiada:
  - [x] Análise de código e sugestões de melhoria.
  - [x] Refatoração automática com aprovação.
  - [x] Verificação de testes após refatoração.
- [x] Comando `sparkseed ai:explain` para explicar partes do código:
  - [x] Explicação de arquivos específicos.
  - [x] Diagramas de fluxo gerados automaticamente.
  - [x] Documentação de funções complexas.
- [x] Integração com LLMs locais e remotos:
  - [x] Suporte a OpenAI API.
  - [x] Suporte a Anthropic Claude.
  - [x] Suporte a modelos locais (Ollama, LM Studio).

## 24. Sistema de Plugins

- [x] Arquitetura de plugins extensível:
  - [x] API de plugins bem definida.
  - [x] Sistema de hooks para interceptar geração.
  - [x] Registro de plugins no `sparkseed.config.json`.
- [x] Plugins oficiais:
  - [x] `@sparkseed/plugin-graphql` - Adiciona suporte a GraphQL.
  - [x] `@sparkseed/plugin-websocket` - Adiciona WebSockets.
  - [x] `@sparkseed/plugin-i18n` - Internacionalização avançada.
  - [x] `@sparkseed/plugin-analytics` - Google Analytics, Mixpanel, etc.
  - [x] `@sparkseed/plugin-payment` - Stripe, PayPal, Mercado Pago.
- [x] Marketplace de plugins da comunidade:
  - [x] Site para listar plugins disponíveis.
  - [x] Sistema de rating e reviews.
  - [x] Documentação para criar plugins.

## 25. UI TUI (Terminal User Interface)

- [x] Interface terminal mais rica com Ink (React para terminal):
  - [x] Dashboard interativo mostrando progresso.
  - [x] Seleção de opções com UI visual.
  - [x] Preview em tempo real da estrutura sendo criada.
- [x] Temas personalizáveis para a TUI:
  - [x] Tema claro/escuro.
  - [x] Cores personalizáveis.
  - [x] Opções de acessibilidade (alto contraste).
- [x] Animações e feedback visual:
  - [x] Spinners e barras de progresso.
  - [x] Notificações toast no terminal.
  - [x] Logs em tempo real com filtro.

## 26. Recursos Avançados de QA

- [x] Geração de testes de carga com k6:
  - [x] Scripts de teste de carga pré-configurados.
  - [x] Cenários de teste para endpoints críticos.
  - [x] Relatórios de performance.
- [x] Testes de acessibilidade automatizados:
  - [x] Integração com axe-core.
  - [x] Testes de navegação por teclado.
  - [x] Verificação de contraste de cores.
- [x] Análise estática de código avançada:
  - [x] Integração com SonarQube.
  - [x] Métricas de complexidade ciclomática.
  - [x] Detecção de code smells.

## 27. Deploy e DevOps

- [x] Templates de deploy para múltiplas plataformas:
  - [x] Vercel, Netlify, Railway, Render.
  - [x] AWS, GCP, Azure.
  - [x] Docker Swarm, Kubernetes.
- [x] Pipeline de deploy automatizado:
  - [x] Deploy automático em produção após testes.
  - [x] Rollback automático em caso de erro.
  - [x] Notificações de deploy (Slack, Discord).
- [x] Monitoramento e observabilidade:
  - [x] Configuração de Sentry, Datadog, New Relic.
  - [x] Logs estruturados com Winston/Pino.
  - [x] Métricas e alertas pré-configurados.

## 28. Documentação Viva

- [x] Geração automática de documentação de API com OpenAPI/Swagger:
  - [x] Especificação OpenAPI gerada a partir do código.
  - [x] UI do Swagger pré-configurada.
  - [x] Validação de requests/responses.
- [x] Storybook para componentes:
  - [x] Configuração automática do Storybook.
  - [x] Stories gerados a partir dos componentes.
  - [x] Integração com testes de snapshot.
- [x] Documentação de arquitetura atualizada automaticamente:
  - [x] Diagramas gerados a partir do código.
  - [x] Dependências e imports visualizados.
  - [x] Mudanças na arquitetura detectadas e documentadas.

---

## ✅ Concluído (Itens 1-21)

Todos os itens de 1 a 21 foram implementados com sucesso! O sparkseed agora possui:

- ✅ Internacionalização completa (EN/PT/ES)
- ✅ Geração de PRD, Design System e Arquitetura
- ✅ Múltiplos ORMs (Prisma, Drizzle, Sequelize)
- ✅ Modelagem de Domínio
- ✅ User Journeys e Screen Map
- ✅ API Endpoints configuráveis
- ✅ CI/CD com GitHub Actions
- ✅ QA, SEO e Acessibilidade
- ✅ Guia para Agentes de IA
- ✅ Templates organizados em 10 categorias
- ✅ Código TypeScript rigoroso (sem `any`)
- ✅ 24 testes passando

**Próximo foco:** Implementar itens 22-28 para levar o sparkseed ao próximo nível!
