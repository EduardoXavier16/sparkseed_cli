# 🌱 SparkSeed CLI

**Interactive CLI that generates complete project boilerplates with PRD, Design System, Architecture, and more!**

[![npm version](https://badge.fury.io/js/sparkseed.svg)](https://www.npmjs.com/package/sparkseed)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

### 📋 Documentation Generation
- **PRD (Product Requirements Document)** - Complete product specifications
- **Design System** - Colors, typography, components, accessibility guidelines
- **Architecture Documentation** - Project structure and best practices
- **API Documentation** - OpenAPI/Swagger specification
- **QA Guide** - Testing and quality assurance guidelines
- **Accessibility Guide** - WCAG compliance
- **AI Agent Guide** - Guide for AI assistants working on the code
- **Release Checklist** - Pre-release and deployment checklist
- **Domain Model** - Entity relationship documentation
- **Screen Map** - Navigation structure

### 🛠️ Technology Support

#### Frontend Frameworks
- ⚛️ React
- ⚡ Next.js
- 🔷 Vue.js
- 🎯 Nuxt.js
- 📐 Angular
- 🚀 Svelte

#### Backend Frameworks
- 🟢 Node.js + Express
- ⚡ Fastify
- 🐍 Python + FastAPI
- 🐍 Django
- ☕ Spring Boot

#### ORMs (6 Options!)
- 🔷 **Prisma** - Type-safe, modern
- ⚡ **Drizzle** - Lightweight, fast
- 🔄 **Sequelize** - Classic, mature
- 📦 **TypeORM** - Decorators, enterprise
- 🍃 **Mongoose** - MongoDB ODM
- 🔨 **Knex.js** - SQL query builder

#### Databases
- 🐘 PostgreSQL
- 🦆 MySQL
- 🔷 SQLite
- 🍃 MongoDB
- 🔴 Redis (cache/session)
- 🔺 Supabase

### 🤖 AI Integration

Three powerful AI commands:

```bash
# Chat about your project
sparkseed ai:chat

# Explain code
sparkseed ai:explain [file]

# Get refactoring suggestions
sparkseed ai:refactor [file]
```

**Supported LLMs:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic Claude
- Ollama (local models)

### 🔌 Plugin System

Extend sparkseed with official plugins:

```bash
# List available plugins
sparkseed plugins:list

# Install a plugin
sparkseed plugins:install @sparkseed/plugin-graphql

# Uninstall a plugin
sparkseed plugins:uninstall @sparkseed/plugin-graphql

# View plugin info
sparkseed plugins:info @sparkseed/plugin-graphql
```

**Official Plugins:**
- `@sparkseed/plugin-graphql` - GraphQL support
- `@sparkseed/plugin-websocket` - WebSocket support
- `@sparkseed/plugin-i18n` - Internationalization
- `@sparkseed/plugin-analytics` - Analytics integration
- `@sparkseed/plugin-payment` - Payment processing (Stripe)

### 🚀 Deploy & DevOps

**Deploy Templates:**
- Vercel
- Netlify
- Railway
- Render
- Docker

**Monitoring Integration:**
- Sentry (error tracking)
- Datadog (APM)
- New Relic
- Prometheus + Grafana

### 🎨 UI Options

- Tailwind CSS
- Styled Components
- Emotion
- Chakra UI
- SCSS/SASS
- Plain CSS

### 📦 Additional Features

- ✅ CI/CD with GitHub Actions
- ✅ Storybook for components
- ✅ Load testing with k6
- ✅ Accessibility testing with axe-core
- ✅ SonarQube integration
- ✅ Internationalization (EN/PT/ES)
- ✅ User Journeys documentation
- ✅ Screen Map documentation

---

## 📦 Installation

### From npm (Recommended)

```bash
# Install globally
npm install -g sparkseed

# Or use with npx (no installation required)
npx sparkseed --help
```

### From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/sparkseed.git
cd sparkseed

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

---

## 🚀 Usage

### Interactive Mode

```bash
# Start interactive CLI
sparkseed create

# Or create in a specific directory
sparkseed create my-awesome-project
```

### Commands

```bash
# Create a new project
sparkseed create [directory]

# Generate a React component
sparkseed generate:component

# Generate a page
sparkseed generate:page

# Generate a backend resource
sparkseed generate:resource

# AI Commands
sparkseed ai:chat              # Chat about your project
sparkseed ai:explain [file]    # Explain code
sparkseed ai:refactor [file]   # Get refactoring suggestions

# Plugin Commands
sparkseed plugins:list         # List available plugins
sparkseed plugins:install      # Install a plugin
sparkseed plugins:uninstall    # Uninstall a plugin
sparkseed plugins:info         # View plugin info

# Help
sparkseed --help
sparkseed [command] --help
```

---

## 📋 Interactive Flow

When you run `sparkseed create`, you'll be asked:

1. **Language** - Choose CLI language (EN/PT/ES)
2. **Project Name** - Your project name
3. **Description** - Brief project description
4. **Project Type** - Web, Mobile, Desktop, API, or Fullstack
5. **Framework** - Choose your preferred framework
6. **Language** - TypeScript or JavaScript
7. **Styling** - CSS approach (Tailwind, SCSS, etc.)
8. **Database** - Choose database (if applicable)
9. **ORM** - Choose ORM (Prisma, Drizzle, Sequelize, TypeORM, Mongoose, Knex)
10. **Authentication** - Include auth system?
11. **Features** - Select desired features
12. **Pages** - List of pages
13. **Components** - Common components needed
14. **Domain Entities** - Define your data models
15. **User Journeys** - Define business flows
16. **Screen Map** - Define navigation structure
17. **API Endpoints** - Define API endpoints
18. **Color Palette** - Primary, secondary, accent colors
19. **Typography** - Font families and sizes
20. **Global State** - Zustand, Redux Toolkit, or none
21. **Locale** - Primary locale for formatting

---

## 📁 Generated Structure

```
my-project/
├── docs/
│   ├── PRD.md                    # Product Requirements
│   ├── DESIGN_SYSTEM.md          # Design System
│   ├── ARCHITECTURE.md           # Architecture Guide
│   ├── API.md                    # API Documentation
│   ├── QA_GUIDE.md               # QA Guidelines
│   ├── ACCESSIBILITY.md          # Accessibility Guide
│   ├── AGENT_GUIDE.md            # AI Agent Guide
│   ├── RELEASE_CHECKLIST.md      # Release Checklist
│   ├── DOMAIN_MODEL.md           # Domain Model (if defined)
│   ├── SCREENS_MAP.md            # Screen Map (if defined)
│   └── openapi.json              # OpenAPI Spec (if API enabled)
├── src/
│   ├── components/               # Reusable components
│   ├── pages/                    # Application pages
│   ├── hooks/                    # Custom hooks
│   ├── context/                  # React contexts
│   ├── services/                 # API services
│   ├── styles/                   # Global styles
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   └── assets/                   # Images, icons, fonts
├── .github/
│   └── workflows/
│       └── ci-cd.yml            # CI/CD pipeline
├── tests/
│   ├── e2e/                      # E2E tests (Playwright)
│   └── unit/                     # Unit tests (Vitest)
├── load-tests/
│   └── script.js                 # k6 load tests
├── .storybook/                   # Storybook config
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── DEPLOY.md                     # Deployment guide
```

---

## 🎯 Examples

### Create a Fullstack App

```bash
sparkseed create my-fullstack-app
# Follow interactive prompts
# Select: Fullstack → React → TypeScript → Tailwind → PostgreSQL → Prisma
```

### Generate a Component

```bash
cd my-fullstack-app
sparkseed generate:component
# Follow prompts to create component with styles and tests
```

### Use AI to Explain Code

```bash
export OPENAI_API_KEY=sk-...
sparkseed ai:explain src/components/Button.tsx
```

### Install a Plugin

```bash
sparkseed plugins:install @sparkseed/plugin-graphql
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# AI Configuration
export OPENAI_API_KEY=sk-...        # OpenAI API key
export ANTHROPIC_API_KEY=sk-ant-... # Anthropic API key
export SPARKSEED_CLI_LANG=en        # CLI language (en/pt/es)

# For Ollama (local models)
export OLLAMA_BASE_URL=http://localhost:11434
```

### sparkseed.config.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "plugins": {
    "enabled": ["@sparkseed/plugin-graphql"],
    "options": {
      "@sparkseed/plugin-graphql": {
        "graphqlPath": "/graphql",
        "playground": true
      }
    }
  }
}
```

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run load tests
npm run test:load
```

---

## 📚 Documentation

After creating a project, check these files:

- `docs/PRD.md` - Product requirements
- `docs/DESIGN_SYSTEM.md` - Design guidelines
- `docs/ARCHITECTURE.md` - Architecture overview
- `docs/AGENT_GUIDE.md` - Guide for AI assistants
- `docs/RELEASE_CHECKLIST.md` - Pre-release checklist
- `DEPLOY.md` - Deployment guide

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [Commander.js](https://github.com/tj/commander.js)
- [Inquirer](https://github.com/SBoudrias/Inquirer.js)
- [Ora](https://github.com/sindresorhus/ora)
- [Chalk](https://github.com/chalk/chalk)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/sparkseed/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/sparkseed/discussions)
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

**Happy Coding! 🌱**
