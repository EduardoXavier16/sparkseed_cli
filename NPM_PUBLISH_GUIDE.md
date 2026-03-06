# 📦 Guia de Publicação no NPM

Este guia ensina **passo a passo** como publicar sua CLI `sparkseed` no npm.

---

## 📋 Pré-requisitos

1. **Conta no npm** - Crie em [npmjs.com](https://www.npmjs.com/)
2. **Node.js instalado** - Versão 18 ou superior (recomendado 22.20.0+)
3. **Git configurado** - Para versionamento

---

## 🚀 Passo a Passo

### **Passo 1: Criar Conta no NPM**

1. Acesse [https://www.npmjs.com/](https://www.npmjs.com/)
2. Clique em **"Sign Up"**
3. Preencha:
   - Username (ex: `seu-username`)
   - Email
   - Senha
4. Confirme o email recebido

---

### **Passo 2: Preparar o Projeto**

#### 2.1 Verificar `package.json`

Seu `package.json` deve ter:

```json
{
  "name": "sparkseed",           // ← Nome único no npm
  "version": "1.0.0",            // ← Comece com 1.0.0
  "description": "Sua descrição",
  "main": "dist/index.js",       // ← Arquivo principal
  "bin": {
    "sparkseed": "./dist/index.js"  // ← Comando da CLI
  },
  "keywords": ["cli", "boilerplate"],
  "author": "Seu Nome",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/seu-username/sparkseed.git"
  },
  "bugs": {
    "url": "https://github.com/seu-username/sparkseed/issues"
  },
  "homepage": "https://github.com/seu-username/sparkseed#readme"
}
```

#### 2.2 Criar `.npmignore`

Arquivo `.npmignore` (o que NÃO publicar):

```
node_modules/
dist/
src/
tests/
.git/
.gitignore
.env
.env.example
*.log
.DS_Store
.vscode/
.idea/
coverage/
```

#### 2.3 Criar `.npmrc` (Opcional)

Arquivo `.npmrc` na raiz:

```
registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

---

### **Passo 3: Login no NPM**

No terminal:

```bash
# Fazer login
npm login

# Ou criar conta pelo terminal
npm adduser
```

Você verá:
```
Username: seu-username
Password: ********
Email: (this IS public) seu@email.com
```

✅ **Sucesso:** `Logged in as seu-username on https://registry.npmjs.org/.`

---

### **Passo 4: Testar Localmente**

Antes de publicar, teste:

```bash
# Build do projeto
npm run build

# Testar CLI localmente
npm link

# Usar a CLI
sparkseed --help
sparkseed create

# Remover link
npm unlink
```

---

### **Passo 5: Publicar no NPM**

#### 5.1 Publicação Inicial

```bash
# Publicar pela primeira vez
npm publish --access public
```

**Importante:** O `--access public` é necessário para pacotes scoped (@username/package).

#### 5.2 Verificar Publicação

1. Acesse: `https://www.npmjs.com/package/sparkseed`
2. Você deve ver sua página do pacote

---

### **Passo 6: Instalar e Testar**

```bash
# Instalar globalmente para testar
npm install -g sparkseed

# Testar comandos
sparkseed --help
sparkseed create

# Ou usar sem instalar
npx sparkseed --help
```

---

## 🔄 Atualizações

### **Versionamento Semântico**

Use o formato `MAJOR.MINOR.PATCH`:

- **MAJOR** (1.0.0 → 2.0.0): Mudanças incompatíveis
- **MINOR** (1.0.0 → 1.1.0): Novas features (compatível)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

### **Comandos de Versionamento**

```bash
# Atualizar versão patch (1.0.0 → 1.0.1)
npm version patch

# Atualizar versão minor (1.0.0 → 1.1.0)
npm version minor

# Atualizar versão major (1.0.0 → 2.0.0)
npm version major

# Atualizar para versão específica
npm version 1.2.3
```

### **Publicar Atualização**

```bash
# Atualizar versão e publicar
npm version patch
npm publish

# Ou manualmente
npm version 1.0.1
npm publish
```

---

## 📊 Comandos Úteis

### **Informações do Pacote**

```bash
# Ver informações do pacote
npm view sparkseed

# Ver versões disponíveis
npm view sparkseed versions

# Ver readme
npm view sparkseed readme
```

### **Gerenciar Tags**

```bash
# Adicionar tag
npm dist-tag add sparkseed@1.0.0 beta

# Listar tags
npm dist-tag ls sparkseed

# Remover tag
npm dist-tag rm sparkseed beta
```

### **Despublicar (Unpublish)**

```bash
# Despublicar versão específica (apenas nas primeiras 72h)
npm unpublish sparkseed@1.0.1

# Despublicar pacote inteiro (apenas nas primeiras 72h)
npm unpublish sparkseed --force
```

⚠️ **Atenção:** Após 72 horas, você não pode despublicar, apenas marcar como deprecated.

### **Depreciar Pacote**

```bash
# Marcar versão como deprecated
npm deprecate sparkseed@1.0.0 "Esta versão tem bugs críticos"

# Marcar todas as versões
npm deprecate sparkseed "Use sparkseed-cli em vez disso"
```

---

## 🐛 Solução de Problemas

### **Erro: E403 Forbidden**

```
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/sparkseed
```

**Causa:** Nome já existe ou sem permissão.

**Solução:**
```bash
# Verificar se nome existe
npm view sparkseed

# Escolher outro nome no package.json
{
  "name": "sparkseed-cli"  // ← Nome único
}
```

### **Erro: E404 Not Found**

```
npm ERR! 404 Not Found - PUT https://registry.npmjs.org/sparkseed
```

**Causa:** Não fez login.

**Solução:**
```bash
npm login
npm publish --access public
```

### **Erro: Nome Muito Longo**

```
npm ERR! name can no longer contain more than 214 characters
```

**Solução:** Use nome curto no `package.json`.

### **Erro: Caracteres Inválidos**

```
npm ERR! name can only contain URL-friendly characters
```

**Solução:** Use apenas letras minúsculas, números, hífens e underscores.

```json
{
  "name": "sparkseed-cli",    // ✅ Correto
  "name": "SparkSeed CLI",    // ❌ Errado
  "name": "@seu-username/sparkseed"  // ✅ Scoped (recomendado)
}
```

---

## 🎯 Boas Práticas

### **1. Use Scoped Packages (Opcional)**

```json
{
  "name": "@seu-username/sparkseed"
}
```

**Vantagens:**
- Nome garantido (ninguém mais usa @seu-username)
- Mais profissional
- Evita conflitos de nome

**Publicar:**
```bash
npm publish --access public
```

### **2. Mantenha CHANGELOG.md**

```markdown
# Changelog

## [1.1.0] - 2024-01-15

### Added
- Suporte a TypeORM
- Novos comandos de IA

### Fixed
- Bug no generate:component

## [1.0.0] - 2024-01-01

### Added
- Lançamento inicial
```

### **3. Use Git Tags**

```bash
# Criar tag
git tag -a v1.0.0 -m "Release 1.0.0"

# Push da tag
git push origin v1.0.0
```

### **4. Automatize com GitHub Actions**

`.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Configurar Secret:**
1. GitHub Repo → Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `NPM_TOKEN`
4. Value: `npm_...` (pegue em npmjs.com → Access Tokens)

---

## 📈 Estatísticas e Analytics

### **Ver Downloads**

```bash
# Ver downloads
npm view sparkseed downloads

# Ou acesse
https://www.npmjs.com/package/sparkseed?activeTab=versions
```

### **Badges para README**

```markdown
[![npm version](https://badge.fury.io/js/sparkseed.svg)](https://badge.fury.io/js/sparkseed)
[![npm downloads](https://img.shields.io/npm/dm/sparkseed.svg)](https://www.npmjs.com/package/sparkseed)
[![npm total downloads](https://img.shields.io/npm/dt/sparkseed.svg)](https://www.npmjs.com/package/sparkseed)
```

---

## 🔐 Segurança

### **Nunca Publique:**

- `.env` files
- Chaves de API
- Senhas
- Tokens
- `node_modules/`

### **Use .npmignore:**

```
.env
.env.*
*.key
*.pem
secrets/
credentials/
```

---

## 📞 Suporte NPM

- **Documentação:** [https://docs.npmjs.com/](https://docs.npmjs.com/)
- **Suporte:** [https://www.npmjs.com/support](https://www.npmjs.com/support)
- **Status:** [https://status.npmjs.org/](https://status.npmjs.org/)

---

## ✅ Checklist de Publicação

- [ ] Conta npm criada
- [ ] Login feito (`npm login`)
- [ ] `package.json` configurado corretamente
- [ ] `.npmignore` criado
- [ ] Build feito (`npm run build`)
- [ ] Testes passando (`npm test`)
- [ ] README.md completo
- [ ] LICENSE incluído
- [ ] Versão 1.0.0
- [ ] Publicado (`npm publish --access public`)
- [ ] Testado instalação (`npm install -g sparkseed`)
- [ ] Tag git criada (`git tag v1.0.0`)

---

**🎉 Parabéns! Sua CLI está publicada no npm!** 🌱
