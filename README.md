# 🚀 sparkseed

Interactive CLI that generates complete project boilerplates with **PRD**, **Design System**, **architecture** and **file structure**.

## ✨ Features

- 📋 **PRD Generation** – Complete Product Requirements Document with:
  - Project goals
  - User personas
  - User stories
  - Functional and non-functional requirements
  - Technical stack
  - Milestones and success metrics

- 🎨 **Design System** – Complete design system with:
  - Semantic color palette
  - Typography
  - Spacing scale
  - Responsive breakpoints
  - Component specification
  - Accessibility guidelines

- 📁 **Project Structure** – Ready-to-use boilerplate:
  - Reusable components
  - Pre-configured pages
  - Custom hooks
  - React contexts
  - API services
  - Global styles
  - TypeScript types
  - Utilities

## 🛠️ Installation

```bash
# Go to the project directory
cd "C:\projects\my-cli"

# Install dependencies
npm install

# Build the project (for production/CLI usage)
npm run build
```

## 🚀 Usage

### Interactive mode

```bash
# During development
npm run dev

# After build
npm start
```

### Commands

```bash
# Create a new project
npm run dev create

# Or after build (using the global CLI)
npx sparkseed create

# Or in a specific directory
npx sparkseed create my-project
```

## 📋 Usage Flow

1. Run `npm run dev` or `npm start`
2. Answer the interactive questions:
   - Project name and description
   - Project type (Web, Mobile, Desktop, API, Fullstack)
   - Preferred framework
   - Language (TypeScript/JavaScript)
   - Styling approach
   - Target audience and main goal
   - Desired features
   - Pages and components
   - Colors and typography

3. The CLI will generate:
   - `docs/PRD.md` – Product Requirements Document
   - `docs/DESIGN_SYSTEM.md` – Complete Design System
   - `docs/ARCHITECTURE.md` – Architecture documentation
   - `docs/API.md` – API documentation (when applicable)
   - A complete project structure with files and folders

## 📁 Generated Structure

```
meu-projeto/
├── docs/
│   ├── PRD.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md
│   └── API.md
├── src/
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── ...
│   ├── pages/
│   │   ├── Home/
│   │   ├── About/
│   │   └── ...
│   ├── hooks/
│   ├── context/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── assets/
├── package.json
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
├── vite.config.ts
└── README.md
```

## 🎯 Supported Frameworks

### Frontend
- ⚛️ React
- ⚡ Next.js
- 🔷 Vue.js
- 🎯 Nuxt.js
- 📐 Angular
- 🚀 Svelte

### Mobile
- 📱 React Native
- Flutter
- ⚡ Ionic

### Desktop
- 💻 Electron
- 📦 Tauri

### Backend
- 🟢 Node.js + Express
- ⚡ Fastify
- 🐍 Python + FastAPI
- 🐍 Django
- ☕ Spring Boot

## 🎨 Styling Options

- 🎨 Tailwind CSS
- 💅 Styled Components
- 💖 Emotion
- 🎭 Chakra UI
- 📜 SCSS/SASS
- 📄 Plain CSS

## 📚 Generated Documentation

### PRD (Product Requirements Document)
- Product overview
- Goals and objectives
- User personas
- User stories with acceptance criteria
- Functional requirements
- Non-functional requirements
- Technical stack
- Milestone timeline
- Success metrics

### Design System
- Color system (palette and semantics)
- Typography (fonts, sizes, weights)
- Spacing and layout
- Responsive breakpoints
- Component specification
- Accessibility guidelines
- Motion guidelines

### Architecture
- Folder structure
- Code standards
- Data flow
- Best practices

## 🧪 Tests

```bash
# Run tests
npm test

# Tests with UI
npm run test:ui
```

## 🤝 Contributing

1. Fork this repository
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License – see the LICENSE file for details.

## 🙏 Acknowledgements

This CLI was created to speed up project setup and ensure consistency and best practices from day one.

---

**Built with ❤️ using sparkseed**
