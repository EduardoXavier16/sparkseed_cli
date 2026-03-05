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

- [ ] Estrutura de testes end-to-end:
  - [ ] Adicionar template de ferramenta E2E (ex.: Playwright) para o frontend.
  - [ ] Gerar testes E2E básicos para fluxo de autenticação e páginas principais.
- [ ] Cobertura de testes mínima:
  - [ ] Configurar thresholds de coverage em Vitest para components, hooks e services.
- [ ] Testes de backend:
  - [ ] Adicionar exemplos de testes unitários e de integração para rotas e serviços Express.
- [ ] Pipelines de qualidade:
  - [ ] Scripts `test`, `test:watch` e `test:coverage` prontos no boilerplate.

## 13. SEO, Performance e Acessibilidade

- [ ] Metadados SEO padrão:
  - [ ] Gerar tags `<title>` e `<meta>` (description, Open Graph, Twitter) nos templates de páginas.
- [ ] Arquivos auxiliares:
  - [ ] Gerar `sitemap.xml` e `robots.txt` com base nas páginas configuradas.
- [ ] Acessibilidade:
  - [ ] Checklist básico de acessibilidade em documentação (ex.: `docs/ACCESSIBILITY.md`).
  - [ ] Componentes padrão com foco visível e atributos ARIA essenciais.
- [ ] Performance:
  - [ ] Incluir no README orientações de uso de Lighthouse e Web Vitals no projeto gerado.

## 14. Projeto Web Completo (A a Z)

- [ ] Workflow de desenvolvimento pronto:
  - [ ] Gerar scripts para `dev`, `build`, `lint`, `test`, `e2e`, `format` e `typecheck` nos projetos gerados.
- [ ] Exemplo de CI/CD:
  - [ ] Adicionar template de workflow (ex.: GitHub Actions) rodando lint, testes e build.
- [ ] Checklists de entrega:
  - [ ] Gerar checklist de release (ex.: `docs/RELEASE_CHECKLIST.md`) cobrindo QA, SEO e deploy.
- [ ] Onboarding do time:
  - [ ] Seção dedicada no README explicando o fluxo de trabalho de ponta a ponta (A → Z) para o projeto gerado.

## 15. Guia para Agentes de IA (Agent Guide)

- [ ] Estrutura de documentação para LLMs:
  - [ ] Definir arquivo `docs/AGENT_GUIDE.md` com foco em agentes de IA.
  - [ ] Descrever a arquitetura geral do projeto gerado e principais pastas (`frontend`, `backend`, `docs`, etc.).
  - [ ] Explicar os contratos de tipos e convenções de import (aliases `@/...`) que os agentes devem respeitar.
- [ ] Checklists de alteração guiados:
  - [ ] Criar checklists passo a passo para tarefas típicas (ex.: adicionar página, adicionar endpoint, criar fluxo de autenticação).
  - [ ] Incluir seções “Antes de alterar”, “Durante a alteração” e “Após a alteração” com validações obrigatórias (lint, testes, typecheck).
- [ ] Regras de segurança para LLMs:
  - [ ] Deixar explícito o que **não** deve ser modificado automaticamente (ex.: secrets, configs sensíveis, arquivos de migração).
  - [ ] Orientar sempre a rodar testes e linters antes de sugerir mudanças finais.
- [ ] Padrões de commit e PR para agentes:
  - [ ] Sugerir formato de mensagens de commit e descrição de PR que facilitem revisão humana de mudanças propostas por IA.

## 16. Subgenerators da CLI

- [ ] Subgenerators de frontend:
  - [ ] `sparkseed generate component` para criar componente + estilos + teste alinhados ao Design System.
  - [ ] `sparkseed generate page` para criar página + teste básico de render.
- [ ] Subgenerators de backend:
  - [ ] `sparkseed generate resource` para criar rota + controller + service + testes base.
- [ ] Subgenerators de testes:
  - [ ] `sparkseed generate test:component` e `sparkseed generate test:api` seguindo o padrão Vitest + RTL.
- [ ] Subgenerators de documentação:
  - [ ] `sparkseed generate doc:feature` e checklists de release/QA baseados nos docs existentes.

## 17. Suporte a Múltiplos ORMs e Bancos de Dados

- [ ] Escolha de ORM na CLI para projetos com backend (ex.: Prisma, Drizzle, Sequelize).
- [ ] Escolha de banco de dados por ORM (ex.: PostgreSQL, MySQL, SQLite, outros suportados).
- [ ] Geração de configuração, dependências e schema/migrations alinhados ao ORM e banco escolhidos.
- [ ] Ajuste dos templates de services/repositories para desacoplar acesso a dados da lógica de domínio.

## 18. Modelagem de Domínio Específica por Projeto

- [ ] Perguntar na CLI pelas entidades de domínio (nome, descrição, tipo de dado, obrigatoriedade).
- [ ] Permitir definir relacionamentos (1-N, N-N) entre entidades e restrições básicas.
- [ ] Gerar documentação de modelo de domínio (ex.: `docs/DOMAIN_MODEL.md`) com tabelas de campos e relacionamentos.
- [ ] Gerar/atualizar `schema.prisma` (ou equivalente) com base no modelo de domínio definido, indo além apenas de `User`.
- [ ] Integrar o modelo de domínio com o PRD (seções de entidades e suas responsabilidades).

## 19. Especificação Detalhada de APIs de Domínio

- [ ] Para cada entidade, permitir configurar endpoints (CRUD + ações específicas) via CLI.
- [ ] Gerar seções detalhadas em `docs/API.md` com método, path, query params, body e resposta.
- [ ] Documentar códigos de erro e mensagens de negócio para cada endpoint (incluindo casos de validação).
- [ ] Gerar skeletons de controllers/services alinhados a esses contratos, sem lógica de domínio implementada.
- [ ] Manter contratos de API estáveis para que agentes de IA não precisem “inventar” endpoints.

## 20. Fluxos de Uso (User Journeys) de Negócio

- [ ] Perguntar na CLI pelos principais fluxos de negócio (ex.: “criar pedido”, “aprovar orçamento”).
- [ ] Descrever passo a passo cada fluxo (pré-condições, passos, pós-condições, erros principais).
- [ ] Integrar fluxos ao PRD em uma seção dedicada de “User Journeys”.
- [ ] Sugerir quais endpoints/telas estão envolvidos em cada fluxo para orientar implementação.
- [ ] Opcional: gerar esqueleto de testes de integração ou E2E baseados nesses fluxos.

## 21. Mapa de Telas e Navegação

- [ ] Perguntar na CLI quais páginas/telas principais o projeto terá e seu objetivo.
- [ ] Gerar uma visão de “mapa de telas” (ex.: `docs/SCREENS_MAP.md`) com rotas, hierarquia e navegação.
- [ ] Relacionar telas com user stories e fluxos de uso existentes no PRD.
- [ ] Ajustar templates de páginas para refletir esse mapa de telas (nomes de rotas, títulos, breadcrumbs).
- [ ] Garantir que o Design System e o mapa de telas forneçam contexto suficiente para agentes de IA criarem UI sem improvisar estrutura.
