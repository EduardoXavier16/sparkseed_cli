"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProjectStructure = generateProjectStructure;
function generateProjectStructure(config) {
    const isReactEcosystem = ['react', 'nextjs', 'react-native'].includes(config.framework);
    const isNextJs = config.framework === 'nextjs';
    const hasBackend = ['api', 'fullstack'].includes(config.type);
    const isTypescript = config.language === 'typescript';
    const ext = isTypescript ? 'ts' : 'js';
    const configExt = isTypescript ? 'ts' : 'js';
    const structure = {
        name: config.projectName,
        type: 'folder',
        children: [],
    };
    // Frontend structure
    if (['web', 'fullstack', 'mobile', 'desktop'].includes(config.type)) {
        const frontendChildren = [
            {
                name: 'package.json',
                type: 'file',
                content: generatePackageJson(config),
            },
            {
                name: 'tsconfig.json',
                type: 'file',
                content: generateTsConfig(config),
            },
            {
                name: '.eslintrc.cjs',
                type: 'file',
                content: generateEslintConfig(config),
            },
            {
                name: '.prettierrc',
                type: 'file',
                content: generatePrettierConfig(),
            },
            {
                name: '.gitignore',
                type: 'file',
                content: generateGitignore(config),
            },
            {
                name: 'README.md',
                type: 'file',
                content: generateReadme(config),
            },
            {
                name: '.env.example',
                type: 'file',
                content: generateEnvExample(config),
            },
        ];
        const srcFolder = {
            name: 'src',
            type: 'folder',
            children: [
                {
                    name: 'main.' + ext,
                    type: 'file',
                    content: generateMainFile(config),
                },
                {
                    name: 'vite-env.d.ts',
                    type: 'file',
                    content: '/// <reference types="vite/client" />\n',
                },
            ],
        };
        const componentsFolder = {
            name: 'components',
            type: 'folder',
            children: config.components.map((component) => ({
                name: component,
                type: 'folder',
                children: [
                    {
                        name: component + '.' + ext + 'x',
                        type: 'file',
                        content: generateComponentTemplate(component, config),
                    },
                    {
                        name: component + '.styles.' + (config.styling === 'tailwind' ? 'ts' : config.styling === 'scss' ? 'scss' : configExt),
                        type: 'file',
                        content: generateComponentStyles(component, config),
                    },
                    {
                        name: component + '.test.' + ext + 'x',
                        type: 'file',
                        content: generateComponentTest(component, config),
                    },
                ],
            })),
        };
        const pagesFolder = {
            name: 'pages',
            type: 'folder',
            children: config.pages.map((page) => ({
                name: page,
                type: 'folder',
                children: [
                    {
                        name: 'index.' + ext + 'x',
                        type: 'file',
                        content: generatePageTemplate(page, config),
                    },
                ],
            })),
        };
        const hooksFolder = {
            name: 'hooks',
            type: 'folder',
            children: [
                {
                    name: 'useAuth.' + ext,
                    type: 'file',
                    content: generateUseAuthHook(config),
                },
                {
                    name: 'useTheme.' + ext,
                    type: 'file',
                    content: generateUseThemeHook(config),
                },
            ],
        };
        const contextFolder = {
            name: 'context',
            type: 'folder',
            children: [
                {
                    name: 'AuthContext.' + ext + 'x',
                    type: 'file',
                    content: generateAuthContext(config),
                },
                {
                    name: 'ThemeContext.' + ext + 'x',
                    type: 'file',
                    content: generateThemeContext(config),
                },
            ],
        };
        const servicesFolder = {
            name: 'services',
            type: 'folder',
            children: [
                {
                    name: 'api.' + ext,
                    type: 'file',
                    content: generateApiService(config),
                },
                {
                    name: 'auth.' + ext,
                    type: 'file',
                    content: generateAuthService(config),
                },
            ],
        };
        const stylesFolder = {
            name: 'styles',
            type: 'folder',
            children: [
                {
                    name: 'globals.css',
                    type: 'file',
                    content: generateGlobalStyles(config),
                },
                {
                    name: 'variables.css',
                    type: 'file',
                    content: generateCssVariables(config),
                },
            ],
        };
        const typesFolder = {
            name: 'types',
            type: 'folder',
            children: [
                {
                    name: 'index.' + ext,
                    type: 'file',
                    content: generateTypesIndex(config),
                },
            ],
        };
        const utilsFolder = {
            name: 'utils',
            type: 'folder',
            children: [
                {
                    name: 'cn.' + ext,
                    type: 'file',
                    content: "import { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n",
                },
                {
                    name: 'format.' + ext,
                    type: 'file',
                    content: "export function formatDate(date: Date): string {\n  return new Intl.DateTimeFormat('pt-BR').format(date);\n}\n\nexport function formatCurrency(value: number, currency: string = 'BRL'): string {\n  return new Intl.NumberFormat('pt-BR', {\n    style: 'currency',\n    currency,\n  }).format(value);\n}\n",
                },
            ],
        };
        const assetsFolder = {
            name: 'assets',
            type: 'folder',
            children: [
                {
                    name: 'images',
                    type: 'folder',
                    children: [{ name: '.gitkeep', type: 'file' }],
                },
                {
                    name: 'icons',
                    type: 'folder',
                    children: [{ name: '.gitkeep', type: 'file' }],
                },
                {
                    name: 'fonts',
                    type: 'folder',
                    children: [{ name: '.gitkeep', type: 'file' }],
                },
            ],
        };
        srcFolder.children.push(componentsFolder, pagesFolder, hooksFolder, contextFolder, servicesFolder, stylesFolder, typesFolder, utilsFolder, assetsFolder);
        frontendChildren.push(srcFolder);
        if (!isNextJs) {
            frontendChildren.push({
                name: 'public',
                type: 'folder',
                children: [
                    { name: 'favicon.ico', type: 'file' },
                    { name: 'robots.txt', type: 'file', content: 'User-agent: *\nAllow: /\n' },
                ],
            });
        }
        if (!isNextJs) {
            frontendChildren.push({
                name: 'index.html',
                type: 'file',
                content: generateIndexHtml(config),
            });
        }
        if (!isNextJs) {
            frontendChildren.push({
                name: 'vite.config.' + configExt + 't',
                type: 'file',
                content: generateViteConfig(config),
            });
        }
        structure.children.push({
            name: 'frontend',
            type: 'folder',
            children: frontendChildren,
        });
    }
    // Backend structure
    if (hasBackend) {
        const backendChildren = [
            {
                name: 'package.json',
                type: 'file',
                content: generateBackendPackageJson(config),
            },
            {
                name: 'tsconfig.json',
                type: 'file',
                content: generateBackendTsConfig(config),
            },
            {
                name: '.env.example',
                type: 'file',
                content: generateBackendEnvExample(config),
            },
            {
                name: '.gitignore',
                type: 'file',
                content: generateBackendGitignore(),
            },
        ];
        const srcFolder = {
            name: 'src',
            type: 'folder',
            children: [
                {
                    name: 'index.' + ext,
                    type: 'file',
                    content: "import app from './app';\nimport { logger } from './utils/logger';\n\nconst PORT = process.env.PORT || 3000;\n\napp.listen(PORT, () => {\n  logger.info(`Server running on port ${PORT}`);\n  logger.info(`Environment: ${process.env.NODE_ENV}`);\n});\n",
                },
                {
                    name: 'app.' + ext,
                    type: 'file',
                    content: "import express from 'express';\nimport cors from 'cors';\nimport { routes } from './routes';\nimport { errorMiddleware } from './middlewares/error.middleware';\nimport { logger } from './utils/logger';\n\nconst app = express();\n\napp.use(cors());\napp.use(express.json());\napp.use(express.urlencoded({ extended: true }));\n\napp.use((req, res, next) => {\n  logger.info(`${req.method} ${req.path}`);\n  next();\n});\n\napp.use('/api', routes);\n\napp.get('/health', (req, res) => {\n  res.json({ status: 'ok', timestamp: new Date().toISOString() });\n});\n\napp.use(errorMiddleware);\n\nexport default app;\n",
                },
                {
                    name: 'config.' + ext,
                    type: 'file',
                    content: "import dotenv from 'dotenv';\n\ndotenv.config();\n\nexport const config = {\n  port: process.env.PORT || 3000,\n  nodeEnv: process.env.NODE_ENV || 'development',\n  jwt: {\n    secret: process.env.JWT_SECRET || 'default-secret',\n    expiresIn: process.env.JWT_EXPIRES_IN || '7d',\n  },\n  database: {\n    url: process.env.DATABASE_URL || '',\n  },\n};\n",
                },
                {
                    name: 'routes',
                    type: 'folder',
                    children: [
                        {
                            name: 'index.' + ext,
                            type: 'file',
                            content: "export { authRoutes } from './auth.routes';\nexport { userRoutes } from './user.routes';\n",
                        },
                        {
                            name: 'auth.routes.' + ext,
                            type: 'file',
                            content: "import { Router } from 'express';\nimport { authController } from '../controllers/auth.controller';\n\nexport const authRoutes = Router();\n\nauthRoutes.post('/register', authController.register);\nauthRoutes.post('/login', authController.login);\nauthRoutes.post('/logout', authController.logout);\nauthRoutes.get('/me', authController.getCurrentUser);\n",
                        },
                        {
                            name: 'user.routes.' + ext,
                            type: 'file',
                            content: "import { Router } from 'express';\nimport { userController } from '../controllers/user.controller';\nimport { authMiddleware } from '../middlewares/auth.middleware';\n\nexport const userRoutes = Router();\nuserRoutes.use(authMiddleware);\n\nuserRoutes.get('/profile', userController.getProfile);\nuserRoutes.put('/profile', userController.updateProfile);\n",
                        },
                    ],
                },
                {
                    name: 'controllers',
                    type: 'folder',
                    children: [
                        {
                            name: 'auth.controller.' + ext,
                            type: 'file',
                            content: "import { Request, Response, NextFunction } from 'express';\nimport { authService } from '../services/auth.service';\n\nexport const authController = {\n  async register(req: Request, res: Response, next: NextFunction) {\n    try {\n      const { name, email, password } = req.body;\n      const result = await authService.register(name, email, password);\n      res.status(201).json(result);\n    } catch (error) {\n      next(error);\n    }\n  },\n\n  async login(req: Request, res: Response, next: NextFunction) {\n    try {\n      const { email, password } = req.body;\n      const result = await authService.login(email, password);\n      res.json(result);\n    } catch (error) {\n      next(error);\n    }\n  },\n\n  async logout(req: Request, res: Response, next: NextFunction) {\n    try {\n      await authService.logout(req.headers.authorization?.split(' ')[1] || '');\n      res.json({ message: 'Logged out successfully' });\n    } catch (error) {\n      next(error);\n    }\n  },\n\n  async getCurrentUser(req: Request, res: Response, next: NextFunction) {\n    try {\n      const userId = (req as any).user.userId;\n      const user = await authService.getUserById(userId);\n      res.json(user);\n    } catch (error) {\n      next(error);\n    }\n  },\n};\n",
                        },
                        {
                            name: 'user.controller.' + ext,
                            type: 'file',
                            content: "import { Request, Response, NextFunction } from 'express';\nimport { userService } from '../services/user.service';\n\nexport const userController = {\n  async getProfile(req: Request, res: Response, next: NextFunction) {\n    try {\n      const userId = (req as any).user.userId;\n      const user = await userService.getUserById(userId);\n      res.json(user);\n    } catch (error) {\n      next(error);\n    }\n  },\n\n  async updateProfile(req: Request, res: Response, next: NextFunction) {\n    try {\n      const userId = (req as any).user.userId;\n      const updates = req.body;\n      const user = await userService.updateUser(userId, updates);\n      res.json(user);\n    } catch (error) {\n      next(error);\n    }\n  },\n};\n",
                        },
                    ],
                },
                {
                    name: 'services',
                    type: 'folder',
                    children: [
                        {
                            name: 'auth.service.' + ext,
                            type: 'file',
                            content: generateAuthServiceBackend(config),
                        },
                        {
                            name: 'user.service.' + ext,
                            type: 'file',
                            content: "import { prisma } from '../database';\n\nexport const userService = {\n  async getUserById(id: string) {\n    return prisma.user.findUnique({\n      where: { id },\n      select: { id: true, email: true, name: true, createdAt: true },\n    });\n  },\n\n  async updateUser(id: string, updates: { name?: string; email?: string }) {\n    return prisma.user.update({\n      where: { id },\n      data: updates,\n      select: { id: true, email: true, name: true, updatedAt: true },\n    });\n  },\n};\n",
                        },
                    ],
                },
                {
                    name: 'middlewares',
                    type: 'folder',
                    children: [
                        {
                            name: 'auth.middleware.' + ext,
                            type: 'file',
                            content: "import { Request, Response, NextFunction } from 'express';\nimport jwt from 'jsonwebtoken';\nimport { config } from '../config';\n\nexport interface AuthRequest extends Request {\n  user?: { userId: string; email: string };\n}\n\nexport const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {\n  const authHeader = req.headers.authorization;\n  \n  if (!authHeader || !authHeader.startsWith('Bearer ')) {\n    res.status(401).json({ message: 'Authorization token required' });\n    return;\n  }\n\n  const token = authHeader.split(' ')[1];\n\n  try {\n    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string };\n    req.user = decoded;\n    next();\n  } catch (error) {\n    res.status(401).json({ message: 'Invalid or expired token' });\n  }\n};\n",
                        },
                        {
                            name: 'error.middleware.' + ext,
                            type: 'file',
                            content: "import { Request, Response, NextFunction } from 'express';\nimport { logger } from './logger';\n\nexport const errorMiddleware = (\n  error: Error,\n  req: Request,\n  res: Response,\n  next: NextFunction\n) => {\n  logger.error(`Error: ${error.message}`, { stack: error.stack });\n\n  const statusCode = (error as any).statusCode || 500;\n\n  res.status(statusCode).json({\n    error: {\n      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,\n      statusCode,\n    },\n  });\n};\n",
                        },
                    ],
                },
                {
                    name: 'utils',
                    type: 'folder',
                    children: [
                        {
                            name: 'logger.' + ext,
                            type: 'file',
                            content: "import winston from 'winston';\n\nexport const logger = winston.createLogger({\n  level: process.env.LOG_LEVEL || 'info',\n  format: winston.format.combine(\n    winston.format.timestamp(),\n    winston.format.json()\n  ),\n  transports: [\n    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),\n    new winston.transports.File({ filename: 'logs/combined.log' }),\n  ],\n});\n\nif (process.env.NODE_ENV !== 'production') {\n  logger.add(new winston.transports.Console({\n    format: winston.format.simple(),\n  }));\n}\n",
                        },
                        {
                            name: 'httpError.' + ext,
                            type: 'file',
                            content: "export class HttpError extends Error {\n  constructor(\n    public statusCode: number,\n    message: string\n  ) {\n    super(message);\n    this.name = 'HttpError';\n  }\n}\n",
                        },
                    ],
                },
            ],
        };
        if (config.database) {
            srcFolder.children.push({
                name: 'database',
                type: 'folder',
                children: [
                    {
                        name: 'schema.prisma',
                        type: 'file',
                        content: `generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "${config.database === 'postgresql' ? 'postgresql' : config.database === 'mysql' ? 'mysql' : 'sqlite'}"\n  url      = env("DATABASE_URL")\n}\n\nmodel User {\n  id        String   @id @default(uuid())\n  email     String   @unique\n  password  String\n  name      String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  \n  @@map("users")\n}\n`,
                    },
                    {
                        name: 'index.' + ext,
                        type: 'file',
                        content: "import { PrismaClient } from '@prisma/client';\n\nexport const prisma = new PrismaClient();\n",
                    },
                ],
            });
        }
        backendChildren.push(srcFolder);
        backendChildren.push({
            name: 'tests',
            type: 'folder',
            children: [
                {
                    name: 'unit',
                    type: 'folder',
                    children: [{ name: '.gitkeep', type: 'file' }],
                },
                {
                    name: 'integration',
                    type: 'folder',
                    children: [{ name: '.gitkeep', type: 'file' }],
                },
            ],
        });
        backendChildren.push({
            name: 'logs',
            type: 'folder',
            children: [{ name: '.gitkeep', type: 'file' }],
        });
        structure.children.push({
            name: 'backend',
            type: 'folder',
            children: backendChildren,
        });
    }
    // Documentation folder
    structure.children.push({
        name: 'docs',
        type: 'folder',
        children: [
            { name: 'PRD.md', type: 'file' },
            { name: 'DESIGN_SYSTEM.md', type: 'file' },
            {
                name: 'ARCHITECTURE.md',
                type: 'file',
                content: generateArchitectureDoc(config),
            },
            {
                name: 'API.md',
                type: 'file',
                content: hasBackend ? generateApiDoc(config) : undefined,
            },
        ],
    });
    if (config.type === 'fullstack') {
        structure.children.push({
            name: 'docker-compose.yml',
            type: 'file',
            content: `version: '3.8'\n\nservices:\n  frontend:\n    build:\n      context: ./frontend\n      dockerfile: Dockerfile\n    ports:\n      - "3000:3000"\n    depends_on:\n      - backend\n\n  backend:\n    build:\n      context: ./backend\n      dockerfile: Dockerfile\n    ports:\n      - "3001:3001"\n    environment:\n      - PORT=3001\n      - DATABASE_URL=postgresql://user:password@db:5432/${config.projectName}\n    depends_on:\n      - db\n\n  db:\n    image: postgres:15-alpine\n    ports:\n      - "5432:5432"\n    environment:\n      - POSTGRES_USER=user\n      - POSTGRES_PASSWORD=password\n      - POSTGRES_DB=${config.projectName}\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n\nvolumes:\n  postgres_data:\n`,
        });
    }
    return structure;
}
function generatePackageJson(config) {
    const dependencies = {};
    const devDependencies = {};
    if (config.framework === 'react' || config.framework === 'nextjs') {
        dependencies['react'] = '^18.2.0';
        dependencies['react-dom'] = '^18.2.0';
        if (config.framework === 'nextjs') {
            dependencies['next'] = '^14.0.0';
        }
        else {
            dependencies['react-router-dom'] = '^6.20.0';
        }
    }
    if (config.styling === 'tailwind') {
        dependencies['tailwindcss'] = '^3.4.0';
        dependencies['postcss'] = '^8.4.32';
        dependencies['autoprefixer'] = '^10.4.16';
        dependencies['clsx'] = '^2.0.0';
        dependencies['tailwind-merge'] = '^2.1.0';
    }
    else if (config.styling === 'styled-components') {
        dependencies['styled-components'] = '^6.1.0';
    }
    else if (config.styling === 'chakra-ui') {
        dependencies['@chakra-ui/react'] = '^2.8.0';
        dependencies['@emotion/react'] = '^11.11.0';
        dependencies['@emotion/styled'] = '^11.11.0';
    }
    dependencies['clsx'] = '^2.0.0';
    dependencies['axios'] = '^1.6.0';
    devDependencies['typescript'] = '^5.3.0';
    devDependencies['vite'] = '^5.0.0';
    devDependencies['@types/react'] = '^18.2.0';
    devDependencies['@types/react-dom'] = '^18.2.0';
    devDependencies['@vitejs/plugin-react'] = '^4.2.0';
    devDependencies['eslint'] = '^8.55.0';
    devDependencies['eslint-plugin-react'] = '^7.33.0';
    devDependencies['eslint-plugin-react-hooks'] = '^4.6.0';
    devDependencies['prettier'] = '^3.1.0';
    devDependencies['vitest'] = '^1.0.0';
    devDependencies['@testing-library/react'] = '^14.1.0';
    devDependencies['@testing-library/jest-dom'] = '^6.1.0';
    return JSON.stringify({
        name: config.projectName,
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
            dev: 'vite',
            build: 'tsc && vite build',
            preview: 'vite preview',
            lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
            'lint:fix': 'eslint . --ext ts,tsx --fix',
            format: 'prettier --write "src/**/*.{ts,tsx}"',
            test: 'vitest',
            'test:ui': 'vitest --ui',
        },
        dependencies,
        devDependencies,
    }, null, 2);
}
function generateTsConfig(config) {
    return JSON.stringify({
        compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
            baseUrl: '.',
            paths: {
                '@/*': ['./src/*'],
                '@components/*': ['./src/components/*'],
                '@pages/*': ['./src/pages/*'],
                '@hooks/*': ['./src/hooks/*'],
                '@context/*': ['./src/context/*'],
                '@services/*': ['./src/services/*'],
                '@styles/*': ['./src/styles/*'],
                '@types/*': ['./src/types/*'],
                '@utils/*': ['./src/utils/*'],
                '@assets/*': ['./src/assets/*'],
            },
        },
        include: ['src'],
        references: [{ path: './tsconfig.node.json' }],
    }, null, 2);
}
function generateEslintConfig(config) {
    return `module.exports = {\n  root: true,\n  env: { browser: true, es2020: true },\n  extends: [\n    'eslint:recommended',\n    'plugin:@typescript-eslint/recommended',\n    'plugin:react-hooks/recommended',\n  ],\n  ignorePatterns: ['dist', '.eslintrc.cjs'],\n  parser: '@typescript-eslint/parser',\n  plugins: ['@typescript-eslint', 'react-refresh'],\n  rules: {\n    'react-refresh/only-export-components': [\n      'warn',\n      { allowConstantExport: true },\n    ],\n    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],\n  },\n};\n`;
}
function generatePrettierConfig() {
    return JSON.stringify({
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        printWidth: 100,
        arrowParens: 'always',
    }, null, 2);
}
function generateGitignore(config) {
    return `# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\nnode_modules\ndist\ndist-ssr\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n\n# Environment\n.env\n.env.local\n.env.*.local\n\n# Test\ncoverage\n`;
}
function generateReadme(config) {
    const hasBackend = ['api', 'fullstack'].includes(config.type);
    return `# ${config.projectName}\n\n${config.description}\n\n## 🚀 Getting Started\n\n### Prerequisites\n\n- Node.js 18+\n- npm/yarn/pnpm\n\n### Installation\n\n\`\`\`bash\n# Install dependencies\nnpm install\n\n# Start development server\nnpm run dev\n\`\`\`\n\n## 📁 Project Structure\n\n\`\`\`\nsrc/\n├── components/     # Componentes reutilizaveis\n├── pages/          # Paginas da aplicacao\n├── hooks/          # Custom React hooks\n├── context/        # Contextos React\n├── services/       # Servicos e chamadas de API\n├── styles/         # Estilos globais\n├── types/          # Tipos TypeScript\n├── utils/          # Funcoes utilitarias\n└── assets/         # Imagens, icones, fontes\n\`\`\`\n\n## 🛠️ Tech Stack\n\n- **Framework:** ${config.framework}\n- **Language:** ${config.language === 'typescript' ? 'TypeScript' : 'JavaScript'}\n- **Styling:** ${config.styling}\n${config.database ? `- **Database:** ${config.database}` : ''}\n\n## 📋 Available Scripts\n\n- \`npm run dev\` - Start development server\n- \`npm run build\` - Build for production\n- \`npm run preview\` - Preview production build\n- \`npm run lint\` - Run ESLint\n- \`npm run test\` - Run tests\n\n## 📖 Documentation\n\n- [PRD](./docs/PRD.md) - Product Requirements Document\n- [Design System](./docs/DESIGN_SYSTEM.md)\n- [Architecture](./docs/ARCHITECTURE.md)\n${hasBackend ? `- [API Documentation](./docs/API.md)` : ''}\n\n## 🤝 Contributing\n\n1. Fork the repository\n2. Create your feature branch\n3. Commit your changes\n4. Push to the branch\n5. Open a Pull Request\n\n## 📄 License\n\nMIT License\n`;
}
function generateEnvExample(config) {
    return `# API Configuration\nVITE_API_URL=http://localhost:3000/api\n\n# App Configuration\nVITE_APP_NAME=${config.projectName}\nVITE_APP_ENV=development\n`;
}
function generateMainFile(config) {
    return `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './styles/globals.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n`;
}
function generateComponentTemplate(component, config) {
    const componentName = component.charAt(0).toUpperCase() + component.slice(1);
    const isTailwind = config.styling === 'tailwind';
    return `import React from 'react';\nimport { cn } from '@/utils/cn';\n${isTailwind ? '' : "import './" + componentName + ".styles';"}\n\nexport interface ${componentName}Props {\n  className?: string;\n  children?: React.ReactNode;\n  variant?: 'default' | 'outline' | 'ghost' | 'link';\n  size?: 'sm' | 'md' | 'lg';\n  disabled?: boolean;\n  loading?: boolean;\n}\n\nexport const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(\n  ({ className, children, variant = 'default', size = 'md', disabled, loading, ...props }, ref) => {\n    return (\n      <div\n        ref={ref}\n        className={cn(\n          '${componentName}',\n          variant === 'default' ? 'bg-primary text-white' : '',\n          size === 'sm' ? 'px-3 py-1 text-sm' : 'px-4 py-2',\n          className\n        )}\n        data-disabled={disabled}\n        data-loading={loading}\n        {...props}\n      >\n        {loading && <span className="loader">Loading...</span>}\n        {children}\n      </div>\n    );\n  }\n);\n\n${componentName}.displayName = '${componentName}';\n\nexport default ${componentName};\n`;
}
function generateComponentStyles(component, config) {
    const componentName = component.charAt(0).toUpperCase() + component.slice(1);
    if (config.styling === 'tailwind') {
        return `// ${componentName} component styles\n// Styles are handled via Tailwind classes in the component\n`;
    }
    else if (config.styling === 'scss') {
        return `.${componentName} {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  \n  &--default {\n    background-color: var(--color-primary);\n    color: white;\n  }\n  \n  &--outline {\n    background-color: transparent;\n    border: 1px solid var(--color-primary);\n    color: var(--color-primary);\n  }\n  \n  &--ghost {\n    background-color: transparent;\n    color: var(--color-primary);\n  }\n  \n  &[data-disabled] {\n    opacity: 0.5;\n    cursor: not-allowed;\n  }\n}\n`;
    }
    else {
        return `import styled from 'styled-components';\n\nexport const ${componentName}Wrapper = styled.div<{ $variant: string; $size: string }>\`\n  background-color: var(--color-primary);\n  color: white;\n  padding: 0.5rem 1rem;\n\`;\n`;
    }
}
function generateComponentTest(component, config) {
    const componentName = component.charAt(0).toUpperCase() + component.slice(1);
    return `import { describe, it, expect } from 'vitest';\nimport { render, screen } from '@testing-library/react';\nimport ${componentName} from './${componentName}';\n\ndescribe('${componentName}', () => {\n  it('renders correctly', () => {\n    render(<${componentName}>Test</${componentName}>);\n    expect(screen.getByText('Test')).toBeInTheDocument();\n  });\n\n  it('applies variant classes', () => {\n    const { container } = render(<${componentName} variant="outline">Test</${componentName}>);\n    expect(container.firstChild).toHaveClass('${componentName}--outline');\n  });\n\n  it('handles disabled state', () => {\n    render(<${componentName} disabled>Test</${componentName}>);\n    expect(screen.getByText('Test')).toHaveAttribute('data-disabled');\n  });\n});\n`;
}
function generatePageTemplate(page, config) {
    const pageName = page.charAt(0).toUpperCase() + page.slice(1);
    const isNextJs = config.framework === 'nextjs';
    if (isNextJs) {
        return `export default function ${pageName}Page() {\n  return (\n    <div className="${page.toLowerCase()}">\n      <h1>${pageName}</h1>\n      <p>Page content goes here</p>\n    </div>\n  );\n}\n`;
    }
    return `import React from 'react';\n\nexport const ${pageName} = () => {\n  return (\n    <div className="${page.toLowerCase()}">\n      <h1>${pageName}</h1>\n      <p>Page content goes here</p>\n    </div>\n  );\n};\n\nexport default ${pageName};\n`;
}
function generateUseAuthHook(config) {
    return `import { useContext } from 'react';\nimport { AuthContext } from '@/context/AuthContext';\n\nexport const useAuth = () => {\n  const context = useContext(AuthContext);\n  \n  if (!context) {\n    throw new Error('useAuth must be used within an AuthProvider');\n  }\n  \n  return context;\n};\n`;
}
function generateUseThemeHook(config) {
    return `import { useContext } from 'react';\nimport { ThemeContext } from '@/context/ThemeContext';\n\nexport const useTheme = () => {\n  const context = useContext(ThemeContext);\n  \n  if (!context) {\n    throw new Error('useTheme must be used within a ThemeProvider');\n  }\n  \n  return context;\n};\n`;
}
function generateAuthContext(config) {
    return `import React, { createContext, useState, useEffect, ReactNode } from 'react';\nimport { authService } from '@/services/auth';\n\nexport interface User {\n  id: string;\n  email: string;\n  name: string;\n}\n\nexport interface AuthContextType {\n  user: User | null;\n  isLoading: boolean;\n  isAuthenticated: boolean;\n  login: (email: string, password: string) => Promise<void>;\n  register: (name: string, email: string, password: string) => Promise<void>;\n  logout: () => Promise<void>;\n}\n\nexport const AuthContext = createContext<AuthContextType | undefined>(undefined);\n\ninterface AuthProviderProps {\n  children: ReactNode;\n}\n\nexport const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {\n  const [user, setUser] = useState<User | null>(null);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    const token = localStorage.getItem('token');\n    if (token) {\n      authService.getCurrentUser()\n        .then(setUser)\n        .catch(() => localStorage.removeItem('token'))\n        .finally(() => setIsLoading(false));\n    } else {\n      setIsLoading(false);\n    }\n  }, []);\n\n  const login = async (email: string, password: string) => {\n    const response = await authService.login(email, password);\n    localStorage.setItem('token', response.token);\n    setUser(response.user);\n  };\n\n  const register = async (name: string, email: string, password: string) => {\n    const response = await authService.register(name, email, password);\n    localStorage.setItem('token', response.token);\n    setUser(response.user);\n  };\n\n  const logout = async () => {\n    await authService.logout();\n    localStorage.removeItem('token');\n    setUser(null);\n  };\n\n  return (\n    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>\n      {children}\n    </AuthContext.Provider>\n  );\n};\n`;
}
function generateThemeContext(config) {
    return `import React, { createContext, useState, useEffect, ReactNode } from 'react';\n\nexport type Theme = 'light' | 'dark';\n\nexport interface ThemeContextType {\n  theme: Theme;\n  toggleTheme: () => void;\n  setTheme: (theme: Theme) => void;\n}\n\nexport const ThemeContext = createContext<ThemeContextType | undefined>(undefined);\n\ninterface ThemeProviderProps {\n  children: ReactNode;\n  defaultTheme?: Theme;\n}\n\nexport const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = 'light' }) => {\n  const [theme, setThemeState] = useState<Theme>(defaultTheme);\n\n  useEffect(() => {\n    const savedTheme = localStorage.getItem('theme') as Theme | null;\n    if (savedTheme) {\n      setThemeState(savedTheme);\n    }\n  }, []);\n\n  const setTheme = (newTheme: Theme) => {\n    setThemeState(newTheme);\n    localStorage.setItem('theme', newTheme);\n    document.documentElement.classList.toggle('dark', newTheme === 'dark');\n  };\n\n  const toggleTheme = () => {\n    setTheme(theme === 'light' ? 'dark' : 'light');\n  };\n\n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n};\n`;
}
function generateApiService(config) {
    return `import axios from 'axios';\n\nconst API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';\n\nexport const api = axios.create({\n  baseURL: API_URL,\n  headers: {\n    'Content-Type': 'application/json',\n  },\n});\n\napi.interceptors.request.use((config) => {\n  const token = localStorage.getItem('token');\n  if (token) {\n    config.headers.Authorization = \`Bearer \${token}\`;\n  }\n  return config;\n});\n\napi.interceptors.response.use(\n  (response) => response,\n  (error) => {\n    if (error.response?.status === 401) {\n      localStorage.removeItem('token');\n      window.location.href = '/login';\n    }\n    return Promise.reject(error);\n  }\n);\n\nexport default api;\n`;
}
function generateAuthService(config) {
    return `import api from './api';\n\nexport interface LoginRequest {\n  email: string;\n  password: string;\n}\n\nexport interface RegisterRequest {\n  name: string;\n  email: string;\n  password: string;\n}\n\nexport interface AuthResponse {\n  token: string;\n  user: {\n    id: string;\n    email: string;\n    name: string;\n  };\n}\n\nexport const authService = {\n  async login(email: string, password: string): Promise<AuthResponse> {\n    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });\n    return data;\n  },\n\n  async register(name: string, email: string, password: string): Promise<AuthResponse> {\n    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });\n    return data;\n  },\n\n  async logout(): Promise<void> {\n    await api.post('/auth/logout');\n  },\n\n  async getCurrentUser(): Promise<AuthResponse['user']> {\n    const { data } = await api.get<AuthResponse['user']>('/auth/me');\n    return data;\n  },\n};\n`;
}
function generateGlobalStyles(config) {
    return `@import './variables.css';\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml {\n  font-size: 16px;\n  scroll-behavior: smooth;\n}\n\nbody {\n  font-family: var(--font-body);\n  background-color: var(--color-background);\n  color: var(--color-text-primary);\n  line-height: var(--line-height-normal);\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  font-family: var(--font-heading);\n  font-weight: var(--font-weight-bold);\n  line-height: var(--line-height-tight);\n}\n\na {\n  color: var(--color-primary);\n  text-decoration: none;\n}\n\na:hover {\n  text-decoration: underline;\n}\n\nbutton {\n  font-family: inherit;\n  cursor: pointer;\n}\n\nimg {\n  max-width: 100%;\n  height: auto;\n  display: block;\n}\n\ninput, textarea, select {\n  font-family: inherit;\n  font-size: inherit;\n}\n\n:focus-visible {\n  outline: 2px solid var(--color-primary);\n  outline-offset: 2px;\n}\n`;
}
function generateCssVariables(config) {
    const colors = config.colorPalette;
    return `:root {\n  --color-primary: ${colors.primary};\n  --color-secondary: ${colors.secondary};\n  --color-accent: ${colors.accent};\n  --color-background: ${colors.background};\n  --color-surface: ${colors.surface};\n  --color-error: ${colors.error};\n  --color-success: ${colors.success};\n  --color-warning: ${colors.warning};\n  \n  --color-text-primary: ${colors.text.primary};\n  --color-text-secondary: ${colors.text.secondary};\n  --color-text-disabled: ${colors.text.disabled};\n  \n  --font-heading: '${config.typography.fontFamily.heading}', sans-serif;\n  --font-body: '${config.typography.fontFamily.body}', sans-serif;\n  --font-mono: '${config.typography.fontFamily.mono}', monospace;\n  \n  --font-weight-normal: ${config.typography.fontWeights.normal};\n  --font-weight-medium: ${config.typography.fontWeights.medium};\n  --font-weight-semibold: ${config.typography.fontWeights.semibold};\n  --font-weight-bold: ${config.typography.fontWeights.bold};\n  \n  --line-height-tight: ${config.typography.lineHeights.tight};\n  --line-height-normal: ${config.typography.lineHeights.normal};\n  --line-height-relaxed: ${config.typography.lineHeights.relaxed};\n  \n  --spacing-1: 0.25rem;\n  --spacing-2: 0.5rem;\n  --spacing-3: 0.75rem;\n  --spacing-4: 1rem;\n  --spacing-5: 1.25rem;\n  --spacing-6: 1.5rem;\n  --spacing-8: 2rem;\n  \n  --breakpoint-sm: 640px;\n  --breakpoint-md: 768px;\n  --breakpoint-lg: 1024px;\n  --breakpoint-xl: 1280px;\n  --breakpoint-2xl: 1536px;\n  \n  --transition-fast: 150ms ease;\n  --transition-normal: 300ms ease;\n  --transition-slow: 500ms ease;\n  \n  --radius-sm: 0.25rem;\n  --radius-md: 0.5rem;\n  --radius-lg: 0.75rem;\n  --radius-xl: 1rem;\n  --radius-full: 9999px;\n}\n\n.dark {\n  --color-background: #111827;\n  --color-surface: #1F2937;\n  --color-text-primary: #F9FAFB;\n  --color-text-secondary: #9CA3AF;\n  --color-text-disabled: #4B5563;\n}\n`;
}
function generateTypesIndex(config) {
    return `export interface User {\n  id: string;\n  email: string;\n  name: string;\n  createdAt: Date;\n  updatedAt: Date;\n}\n\nexport interface ApiResponse<T> {\n  data: T;\n  message?: string;\n  status: number;\n}\n\nexport interface PaginationParams {\n  page: number;\n  limit: number;\n  sortBy?: string;\n  sortOrder?: 'asc' | 'desc';\n}\n\nexport interface PaginatedResponse<T> {\n  data: T[];\n  total: number;\n  page: number;\n  limit: number;\n  totalPages: number;\n}\n`;
}
function generateIndexHtml(config) {
    return `<!DOCTYPE html>\n<html lang="pt-BR">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <meta name="description" content="${config.description}" />\n    <title>${config.projectName}</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>\n`;
}
function generateViteConfig(config) {
    return `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport path from 'path';\n\nexport default defineConfig({\n  plugins: [react()],\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src'),\n      '@components': path.resolve(__dirname, './src/components'),\n      '@pages': path.resolve(__dirname, './src/pages'),\n      '@hooks': path.resolve(__dirname, './src/hooks'),\n      '@context': path.resolve(__dirname, './src/context'),\n      '@services': path.resolve(__dirname, './src/services'),\n      '@styles': path.resolve(__dirname, './src/styles'),\n      '@types': path.resolve(__dirname, './src/types'),\n      '@utils': path.resolve(__dirname, './src/utils'),\n      '@assets': path.resolve(__dirname, './src/assets'),\n    },\n  },\n  server: {\n    port: 3000,\n    open: true,\n  },\n  build: {\n    sourcemap: true,\n  },\n});\n`;
}
function hasBackend(type) {
    return ['api', 'fullstack'].includes(type);
}
function generateBackendPackageJson(config) {
    return JSON.stringify({
        name: `${config.projectName}-backend`,
        version: '1.0.0',
        description: `Backend API for ${config.projectName}`,
        main: 'dist/index.js',
        scripts: {
            dev: 'tsx watch src/index.ts',
            build: 'tsc',
            start: 'node dist/index.js',
            lint: 'eslint . --ext .ts',
            test: 'vitest',
            'db:migrate': 'prisma migrate dev',
            'db:generate': 'prisma generate',
        },
        dependencies: {
            '@prisma/client': '^5.7.0',
            'bcrypt': '^5.1.0',
            'cors': '^2.8.5',
            'dotenv': '^16.3.0',
            'express': '^4.18.0',
            'jsonwebtoken': '^9.0.0',
            'winston': '^3.11.0',
            'zod': '^3.22.0',
        },
        devDependencies: {
            '@types/bcrypt': '^5.0.0',
            '@types/cors': '^2.8.0',
            '@types/express': '^4.17.0',
            '@types/jsonwebtoken': '^9.0.0',
            '@types/node': '^20.10.0',
            'prisma': '^5.7.0',
            'tsx': '^4.6.0',
            'typescript': '^5.3.0',
            'vitest': '^1.0.0',
        },
    }, null, 2);
}
function generateBackendTsConfig(config) {
    return JSON.stringify({
        compilerOptions: {
            target: 'ES2020',
            module: 'commonjs',
            lib: ['ES2020'],
            outDir: './dist',
            rootDir: './src',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            moduleResolution: 'node',
            baseUrl: '.',
            paths: {
                '@/*': ['./src/*'],
                '@controllers/*': ['./src/controllers/*'],
                '@services/*': ['./src/services/*'],
                '@models/*': ['./src/models/*'],
                '@middlewares/*': ['./src/middlewares/*'],
                '@routes/*': ['./src/routes/*'],
                '@utils/*': ['./src/utils/*'],
                '@types/*': ['./src/types/*'],
                '@config/*': ['./src/config/*'],
            },
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist', 'tests'],
    }, null, 2);
}
function generateBackendEnvExample(config) {
    return `# Server Configuration\nPORT=3000\nNODE_ENV=development\n\n# Database Configuration\nDATABASE_URL="postgresql://user:password@localhost:5432/${config.projectName}?schema=public"\n\n# JWT Configuration\nJWT_SECRET=your-super-secret-jwt-key-change-in-production\nJWT_EXPIRES_IN=7d\n\n# Logging\nLOG_LEVEL=info\n`;
}
function generateBackendGitignore() {
    return `node_modules\ndist\n.env\n.env.local\n*.log\nlogs/\ncoverage\n.DS_Store\n`;
}
function generateAuthServiceBackend(config) {
    return `import bcrypt from 'bcrypt';\nimport jwt from 'jsonwebtoken';\nimport { prisma } from '../database';\nimport { config } from '../config';\n\nexport const authService = {\n  async register(name: string, email: string, password: string) {\n    const existingUser = await prisma.user.findUnique({ where: { email } });\n    \n    if (existingUser) {\n      throw new Error('Email already registered');\n    }\n\n    const hashedPassword = await bcrypt.hash(password, 12);\n    \n    const user = await prisma.user.create({\n      data: { name, email, password: hashedPassword },\n    });\n\n    const token = jwt.sign({ userId: user.id, email: user.email }, config.jwt.secret, {\n      expiresIn: config.jwt.expiresIn,\n    });\n\n    return {\n      token,\n      user: { id: user.id, email: user.email, name: user.name },\n    };\n  },\n\n  async login(email: string, password: string) {\n    const user = await prisma.user.findUnique({ where: { email } });\n    \n    if (!user) {\n      throw new Error('Invalid credentials');\n    }\n\n    const isPasswordValid = await bcrypt.compare(password, user.password);\n    \n    if (!isPasswordValid) {\n      throw new Error('Invalid credentials');\n    }\n\n    const token = jwt.sign({ userId: user.id, email: user.email }, config.jwt.secret, {\n      expiresIn: config.jwt.expiresIn,\n    });\n\n    return {\n      token,\n      user: { id: user.id, email: user.email, name: user.name },\n    };\n  },\n\n  async logout(token: string) {\n    return Promise.resolve();\n  },\n\n  async getUserById(userId: string) {\n    const user = await prisma.user.findUnique({\n      where: { id: userId },\n      select: { id: true, email: true, name: true, createdAt: true },\n    });\n    \n    if (!user) {\n      throw new Error('User not found');\n    }\n    \n    return user;\n  },\n};\n`;
}
function generateArchitectureDoc(config) {
    return `# Project Architecture\n\n## Overview\n\nThis document describes the architecture and structure of the **${config.projectName}** project.\n\n## Technology Stack\n\n- **Frontend:** ${config.framework}\n- **Language:** ${config.language === 'typescript' ? 'TypeScript' : 'JavaScript'}\n- **Styling:** ${config.styling}\n${config.database ? `- **Database:** ${config.database}` : ''}\n\n## Folder Structure\n\n\`\`\`\nsrc/\n├── components/     # Reusable React components\n├── pages/          # Application pages\n├── hooks/          # Custom React hooks\n├── context/        # React contexts (Auth, Theme, etc.)\n├── services/       # Services and API calls\n├── styles/         # Global styles and CSS variables\n├── types/          # TypeScript types\n├── utils/          # Utility functions\n└── assets/         # Images, icons, fonts\n\`\`\`\n\n## Code Standards\n\n### Components\n\n- Functional components with React Hooks\n- TypeScript for type safety\n- Styled Components/Tailwind for styling\n- Unit tests with Vitest + Testing Library\n\n### Naming\n\n- Components: PascalCase (e.g. \`Button.tsx\`)\n- Hooks: camelCase with \`use\` prefix (e.g. \`useAuth.ts\`)\n- Utils: camelCase (e.g. \`formatDate.ts\`)\n- Types: PascalCase (e.g. \`User.ts\`)\n\n## Data Flow\n\n1. Components consume data via hooks\n2. Hooks call services\n3. Services perform HTTP requests through the API client\n4. Global state managed via Context API\n\n## Best Practices\n\n- Small, focused components with a single responsibility\n- Extract repeated logic to custom hooks\n- Use TypeScript in strict mode\n- Write unit tests for critical components and hooks\n- Use code splitting for heavy routes\n`;
}
function generateApiDoc(config) {
    return `# API Documentation\n\n## Base URL\n\n\`\`\`\nDevelopment: http://localhost:3000/api\nProduction: https://api.yoursite.com/api\n\`\`\`\n\n## Authentication\n\nThe API uses JWT for authentication. Include the token in the Authorization header:\n\n\`\`\`\nAuthorization: Bearer <token>\n\`\`\`\n\n## Endpoints\n\n### Auth\n\n#### POST /auth/register\n\`\`\`json\n{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "password": "securepassword"\n}\n\`\`\`\n\n#### POST /auth/login\n\`\`\`json\n{\n  "email": "john@example.com",\n  "password": "securepassword"\n}\n\`\`\`\n\n#### GET /auth/me\nRequires authentication.\n\n### Users\n\n#### GET /users/profile\nRequires authentication.\n\n#### PUT /users/profile\nRequires authentication.\n\n## Status Codes\n\n- \`200\` - Success\n- \`201\` - Created\n- \`400\` - Bad Request\n- \`401\` - Unauthorized\n- \`404\` - Not Found\n- \`500\` - Internal Server Error\n`;
}
//# sourceMappingURL=project-structure.js.map