# sparkseed – Roadmap de Melhorias

## 1. Internacionalização Completa (i18n)

- [x] Usar `cliLanguage` (`en` | `pt` | `es`) também nos *generators*:
  - [x] `generatePRD`: gerar PRD em EN/PT/ES.
  - [x] `generateDesignSystem`: gerar DESIGN_SYSTEM.md em EN/PT/ES.
  - [x] `generateProjectStructure`: gerar README, ARCHITECTURE.md e outros textos em EN/PT/ES.
- [x] Definir **fallback padrão**:
  - [x] Se `cliLanguage` não estiver definido, assumir `'en'`.

## 2. Consistência de Idioma nas Mensagens da CLI

- [x] Padronizar mensagens da CLI que ainda estão em Português:
  - [x] Atualizar textos em `src/generators/file-writer.ts` (`Criando estrutura do projeto...`, `Projeto criado com sucesso!`, `Erro ao criar projeto`).
- [x] Opcional: internacionalizar mensagens de *spinner* e logs de CLI com base em `cliLanguage`.

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

- [ ] TSConfig gerado mais “rigoroso”:
  - [ ] Habilitar `strict: true`.
  - [ ] Habilitar `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, etc.
- [ ] Estado global opcional:
  - [ ] Perguntar se o usuário quer `Zustand` ou `Redux Toolkit` (quando fizer sentido).
  - [ ] Gerar boilerplate de store de acordo com escolha.
- [ ] Testes de componentes gerados:
  - [ ] Conteúdo real de testes em `*.test.tsx` usando Vitest + React Testing Library.
  - [ ] Cobrir render básico + props principais dos componentes.

## 6. Backend – Segurança e Boas Práticas

- [ ] CORS configurável:
  - [ ] Extrair config de CORS para `config.cors` e deixar claro como restringir `origin`.
- [ ] Variáveis de ambiente sensíveis:
  - [ ] Evitar `JWT_SECRET` com fallback fraco (`'default-secret'`) no código gerado.
  - [ ] Adicionar aviso (ou comentário) deixando explícito que `JWT_SECRET` **deve** ser configurado.
- [ ] Tratamento de erros de Prisma:
  - [ ] Criar exemplos de tratamento de erros do Prisma convertidos em `HttpError`.
  - [ ] Usar esse padrão nos serviços gerados (`user.service`, etc.).

## 7. DX da Própria CLI `sparkseed`

- [ ] Scripts adicionais em `package.json` da CLI:
  - [ ] Adicionar `lint` (ESLint) e `format` (Prettier) para o próprio projeto da CLI.
- [ ] Configuração de ESLint/Prettier:
  - [ ] Adicionar `.eslintrc` com regras alinhadas ao padrão rigoroso (sem `any`, etc.).
  - [ ] Adicionar configuração de Prettier para consistência de formatação.

## 8. Biome como Padrão nos Projetos Gerados

- [ ] Adicionar Biome como dependência de desenvolvimento nos templates gerados (frontend/backend).
- [ ] Gerar arquivo de configuração do Biome (`biome.json` ou equivalente) com regras alinhadas ao padrão do projeto.
- [ ] Adicionar scripts `lint`/`format` baseados em Biome nos `package.json` gerados.
- [ ] (Opcional) Manter compatibilidade com ESLint/Prettier apenas quando explicitamente desejado.
 
## 9. Expansão da Suíte de Testes

- [ ] Cobrir mais combinações de `ProjectConfig`:
  - [ ] `type: 'api'` (apenas backend).
  - [ ] `type: 'fullstack'` (frontend + backend + docker-compose).
  - [ ] Diferentes `framework` (`react`, `nextjs`, outros).
  - [ ] Diferentes opções de `styling`.
- [ ] Testar comportamento com `cliLanguage`:
  - [ ] Validar que mensagens de `inquirer` mudam conforme `cliLanguage`.
  - [ ] (Opcional) Testar que PRD/Design System gerados respeitam o idioma, assim que a i18n dos artefatos for implementada.

## 10. Internacionalização dos Utilitários Gerados

- [ ] Tornar `formatDate` / `formatCurrency` configuráveis por locale:
  - [ ] Perguntar na CLI qual locale principal (`en-US`, `pt-BR`, `es-ES`, etc.).
  - [ ] Gerar utilitários com `Intl.DateTimeFormat` / `Intl.NumberFormat` usando esse locale.
  - [ ] Evitar fixar `pt-BR` e `BRL` como padrão “hardcoded”.

## 11. Pequenos Ajustes de Consistência

- [ ] Remover qualquer string remanescente em PT no código fixo ou mover para sistema de i18n.
- [ ] Revisar labels/emojis para manter consistência entre idiomas (nomes de páginas, mensagens de help, etc.).
- [ ] Garantir que novas features sigam o padrão:
  - [ ] Sem `any`.
  - [ ] Sem `console.log` (apenas `console.warn`/`console.error` quando necessário).
  - [ ] Funções curtas e focadas, com tipos de retorno explícitos.

