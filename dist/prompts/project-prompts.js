"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askProjectQuestions = askProjectQuestions;
const inquirer_1 = __importDefault(require("inquirer"));
async function askProjectQuestions() {
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'What is your project name?',
            default: 'my-awesome-project',
            validate: (input) => {
                if (input.trim().length === 0) {
                    return 'Project name is required';
                }
                return true;
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Briefly describe the project:',
            default: 'An awesome project',
        },
        {
            type: 'list',
            name: 'type',
            message: 'What type of project is it?',
            choices: [
                { name: '🌐 Web Application', value: 'web' },
                { name: '📱 Mobile Application', value: 'mobile' },
                { name: '🖥️ Desktop Application', value: 'desktop' },
                { name: '🔌 API / Backend', value: 'api' },
                { name: '🔄 Fullstack (Web + API)', value: 'fullstack' },
            ],
        },
        {
            type: 'list',
            name: 'framework',
            message: 'Which framework do you want to use?',
            choices: (answers) => {
                const choices = [];
                if (['web', 'fullstack'].includes(answers.type)) {
                    choices.push({ name: '⚛️ React', value: 'react' }, { name: '⚡ Next.js', value: 'nextjs' }, { name: '🔷 Vue.js', value: 'vue' }, { name: '🎯 Nuxt.js', value: 'nuxt' }, { name: '📐 Angular', value: 'angular' }, { name: '🚀 Svelte', value: 'svelte' });
                }
                if (answers.type === 'mobile') {
                    choices.push({ name: '📱 React Native', value: 'react-native' }, { name: 'Flutter Flutter', value: 'flutter' }, { name: '⚡ Ionic', value: 'ionic' }, { name: '🎯 NativeScript', value: 'nativescript' });
                }
                if (answers.type === 'desktop') {
                    choices.push({ name: '💻 Electron', value: 'electron' }, { name: '📦 Tauri', value: 'tauri' });
                }
                if (['api', 'fullstack'].includes(answers.type)) {
                    choices.push({ name: '🟢 Node.js + Express', value: 'express' }, { name: '⚡ Fastify', value: 'fastify' }, { name: '🐍 Python + FastAPI', value: 'fastapi' }, { name: '🐍 Django', value: 'django' }, { name: '☕ Spring Boot', value: 'spring' }, { name: '🦀 Rust + Actix', value: 'actix' });
                }
                return choices.length > 0 ? choices : [{ name: 'Vanilla', value: 'vanilla' }];
            },
        },
        {
            type: 'list',
            name: 'language',
            message: 'Which language do you want to use?',
            choices: [
                { name: 'TypeScript', value: 'typescript' },
                { name: 'JavaScript', value: 'javascript' },
            ],
            default: 'typescript',
        },
        {
            type: 'list',
            name: 'styling',
            message: 'Which styling approach do you prefer?',
            choices: (answers) => {
                const isReactEcosystem = ['react', 'nextjs', 'react-native'].includes(answers.framework);
                return [
                    { name: '🎨 Tailwind CSS', value: 'tailwind' },
                    ...(isReactEcosystem ? [
                        { name: '💅 Styled Components', value: 'styled-components' },
                        { name: '💖 Emotion', value: 'emotion' },
                        { name: '🎭 Chakra UI', value: 'chakra-ui' },
                    ] : []),
                    { name: '📜 SCSS/SASS', value: 'scss' },
                    { name: '📄 CSS Puro', value: 'css' },
                ];
            },
        },
        {
            type: 'input',
            name: 'targetAudience',
            message: 'What is the target audience of this project?',
            default: 'General users looking for an efficient and intuitive solution',
        },
        {
            type: 'input',
            name: 'mainGoal',
            message: 'What is the main goal of this project?',
            default: 'Provide an exceptional user experience while solving the core problem efficiently',
        },
    ]);
    // Database question for backend/fullstack projects
    let database;
    if (['api', 'fullstack'].includes(answers.type)) {
        const dbAnswer = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'database',
                message: 'Which database do you want to use?',
                choices: [
                    { name: '🐘 PostgreSQL', value: 'postgresql' },
                    { name: '🦆 MySQL', value: 'mysql' },
                    { name: '🔷 SQLite', value: 'sqlite' },
                    { name: '🍃 MongoDB', value: 'mongodb' },
                    { name: '🔴 Redis', value: 'redis' },
                    { name: '❌ No database', value: 'none' },
                ],
            },
        ]);
        database = dbAnswer.database !== 'none' ? dbAnswer.database : undefined;
    }
    // Auth question
    let auth = false;
    if (['api', 'fullstack', 'web'].includes(answers.type)) {
        const authAnswer = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'auth',
                message: 'Do you want to include an authentication system?',
                default: true,
            },
        ]);
        auth = authAnswer.auth;
    }
    // Features question
    const featuresAnswer = await inquirer_1.default.prompt([
        {
            type: 'checkbox',
            name: 'features',
            message: 'Which features do you want to include?',
            choices: [
                { name: '👤 User authentication', value: 'auth', checked: auth },
                { name: '📧 Email sending', value: 'email' },
                { name: '📁 File upload', value: 'upload' },
                { name: '🔍 Search and filters', value: 'search' },
                { name: '📊 Dashboard / Analytics', value: 'dashboard' },
                { name: '🔔 Notifications', value: 'notifications' },
                { name: '💳 Payments', value: 'payments' },
                { name: '🌐 Internationalization (i18n)', value: 'i18n' },
                { name: '🌓 Light/dark theme', value: 'darkmode' },
                { name: '📱 PWA / Offline support', value: 'pwa' },
                { name: '🧪 Automated tests', value: 'tests' },
                { name: '📝 Logging and monitoring', value: 'logging' },
                { name: '🐳 Docker', value: 'docker' },
                { name: '🚀 CI/CD', value: 'cicd' },
            ],
        },
    ]);
    // Pages question
    const pagesAnswer = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'pages',
            message: 'Which pages should the application have? (separate with commas)',
            default: 'Home, About, Contact, Login, Dashboard',
            filter: (input) => {
                return input.split(',').map((p) => p.trim()).filter((p) => p.length > 0);
            },
        },
    ]);
    // Components question
    const componentsAnswer = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'components',
            message: 'Which common components do you need? (separate with commas)',
            default: 'Button, Input, Card, Modal, Navbar, Sidebar, Table, Form',
            filter: (input) => {
                return input.split(',').map((c) => c.trim()).filter((c) => c.length > 0);
            },
        },
    ]);
    // Color palette questions
    const colorAnswers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'primaryColor',
            message: 'Primary color (hex or name):',
            default: '#3B82F6',
        },
        {
            type: 'input',
            name: 'secondaryColor',
            message: 'Secondary color (hex or name):',
            default: '#6366F1',
        },
        {
            type: 'input',
            name: 'accentColor',
            message: 'Accent color (hex or name):',
            default: '#8B5CF6',
        },
        {
            type: 'input',
            name: 'backgroundColor',
            message: 'Background color:',
            default: '#FFFFFF',
        },
        {
            type: 'input',
            name: 'surfaceColor',
            message: 'Surface color (cards, modals):',
            default: '#F9FAFB',
        },
    ]);
    // Typography questions
    const typographyAnswers = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'fontFamily',
            message: 'Which font family do you want to use?',
            choices: [
                { name: 'Inter (modern and clean)', value: 'Inter' },
                { name: 'Roboto (versatile)', value: 'Roboto' },
                { name: 'Poppins (friendly)', value: 'Poppins' },
                { name: 'Montserrat (elegant)', value: 'Montserrat' },
                { name: 'Open Sans (readable)', value: 'Open Sans' },
                { name: 'Lato (professional)', value: 'Lato' },
                { name: 'System UI (native)', value: 'system-ui' },
            ],
            default: 'Inter',
        },
    ]);
    const colorPalette = {
        primary: colorAnswers.primaryColor,
        secondary: colorAnswers.secondaryColor,
        accent: colorAnswers.accentColor,
        background: colorAnswers.backgroundColor,
        surface: colorAnswers.surfaceColor,
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        text: {
            primary: '#111827',
            secondary: '#6B7280',
            disabled: '#9CA3AF',
        },
    };
    const typography = {
        fontFamily: {
            heading: typographyAnswers.fontFamily,
            body: typographyAnswers.fontFamily,
            mono: 'Fira Code',
        },
        fontSizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        fontWeights: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeights: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
        },
    };
    return {
        projectName: answers.projectName,
        description: answers.description,
        type: answers.type,
        framework: answers.framework,
        language: answers.language,
        styling: answers.styling,
        targetAudience: answers.targetAudience,
        mainGoal: answers.mainGoal,
        database,
        auth,
        features: featuresAnswer.features,
        pages: pagesAnswer.pages,
        components: componentsAnswer.components,
        colorPalette,
        typography,
    };
}
//# sourceMappingURL=project-prompts.js.map