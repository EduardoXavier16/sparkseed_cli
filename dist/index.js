#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const ora_1 = __importDefault(require("ora"));
const path = __importStar(require("path"));
const ai_1 = require("./ai");
const plugins_1 = require("./plugins");
const design_system_generator_1 = require("./generators/design-system/design-system-generator");
const file_writer_1 = require("./generators/file-writer");
const prd_generator_1 = require("./generators/prd/prd-generator");
const builder_1 = require("./generators/project-structure/builder");
const project_prompts_1 = require("./prompts/project-prompts");
const component_generator_1 = require("./subgenerators/component-generator");
const file_writer_2 = require("./subgenerators/file-writer");
const prompts_1 = require("./subgenerators/prompts");
const resource_generator_1 = require("./subgenerators/resource-generator");
const CLI_MESSAGES = {
    en: {
        generatingDocs: '\n⚙️  Generating documents and project structure...\n',
        prdStart: 'Generating PRD...',
        prdSuccess: 'PRD generated!',
        dsStart: 'Generating Design System...',
        dsSuccess: 'Design System generated!',
        structureStart: 'Generating file structure...',
        structureSuccess: 'Structure generated!',
        summaryTitle: '\n✅ Project successfully created!\n',
        structureAtLabel: '📁 Structure created at:',
        generatedDocsTitle: '\n📋 Generated documents:',
        docPrd: '  - docs/PRD.md',
        docDesignSystem: '  - docs/DESIGN_SYSTEM.md',
        docArchitecture: '  - docs/ARCHITECTURE.md',
        docApi: '  - docs/API.md',
        nextStepsTitle: '\n🚀 Next steps:',
        stepCdPrefix: '  cd ',
        stepInstall: '  npm install',
        stepDev: '  npm run dev',
        docsHint: '\n📖 Check the documentation in docs/ for more details.\n',
    },
    pt: {
        generatingDocs: '\n⚙️  Gerando documentos e estrutura do projeto...\n',
        prdStart: 'Gerando PRD...',
        prdSuccess: 'PRD gerado!',
        dsStart: 'Gerando Design System...',
        dsSuccess: 'Design System gerado!',
        structureStart: 'Gerando estrutura de arquivos...',
        structureSuccess: 'Estrutura gerada!',
        summaryTitle: '\n✅ Projeto criado com sucesso!\n',
        structureAtLabel: '📁 Estrutura criada em:',
        generatedDocsTitle: '\n📋 Documentos gerados:',
        docPrd: '  - docs/PRD.md',
        docDesignSystem: '  - docs/DESIGN_SYSTEM.md',
        docArchitecture: '  - docs/ARCHITECTURE.md',
        docApi: '  - docs/API.md',
        nextStepsTitle: '\n🚀 Próximos passos:',
        stepCdPrefix: '  cd ',
        stepInstall: '  npm install',
        stepDev: '  npm run dev',
        docsHint: '\n📖 Veja a documentação em docs/ para mais detalhes.\n',
    },
    es: {
        generatingDocs: '\n⚙️  Generando documentos y estructura del proyecto...\n',
        prdStart: 'Generando PRD...',
        prdSuccess: 'PRD generado!',
        dsStart: 'Generando Design System...',
        dsSuccess: 'Design System generado!',
        structureStart: 'Generando estructura de archivos...',
        structureSuccess: 'Estructura generada!',
        summaryTitle: '\n✅ Proyecto creado con éxito!\n',
        structureAtLabel: '📁 Estructura creada en:',
        generatedDocsTitle: '\n📋 Documentos generados:',
        docPrd: '  - docs/PRD.md',
        docDesignSystem: '  - docs/DESIGN_SYSTEM.md',
        docArchitecture: '  - docs/ARCHITECTURE.md',
        docApi: '  - docs/API.md',
        nextStepsTitle: '\n🚀 Próximos pasos:',
        stepCdPrefix: '  cd ',
        stepInstall: '  npm install',
        stepDev: '  npm run dev',
        docsHint: '\n📖 Consulta la documentación en docs/ para más detalles.\n',
    },
};
const SHORT_VERSION_FLAG = '-v';
const SHORT_VERSION_COMMAND = 'v';
const BUILTIN_VERSION_FLAG = '-V';
const LONG_VERSION_OPTION = '--version';
function getCliLanguage() {
    const envLanguage = process.env.SPARKSEED_CLI_LANG;
    if (envLanguage === 'pt' || envLanguage === 'es') {
        return envLanguage;
    }
    return 'en';
}
function resolveFrontendSrcPath(projectRoot) {
    const frontendSrcPath = path.join(projectRoot, 'src');
    if (fs.existsSync(frontendSrcPath)) {
        return frontendSrcPath;
    }
    const monorepoFrontendSrcPath = path.join(projectRoot, 'frontend', 'src');
    if (fs.existsSync(monorepoFrontendSrcPath)) {
        return monorepoFrontendSrcPath;
    }
    return frontendSrcPath;
}
function resolveBackendSrcPath(projectRoot) {
    const backendSrcPath = path.join(projectRoot, 'src');
    if (fs.existsSync(backendSrcPath)) {
        return backendSrcPath;
    }
    const monorepoBackendSrcPath = path.join(projectRoot, 'backend', 'src');
    if (fs.existsSync(monorepoBackendSrcPath)) {
        return monorepoBackendSrcPath;
    }
    return backendSrcPath;
}
const program = new commander_1.Command();
const writeLine = (message) => {
    process.stdout.write(`${message}\n`);
};
program
    .name('sparkseed')
    .description('Interactive CLI to generate complete project boilerplates')
    .version('1.0.0');
program
    .command('create')
    .description('Create a new project')
    .argument('[directory]', 'Directory where the project will be created', '.')
    .action(async (directory) => {
    try {
        writeLine(chalk_1.default.blue('\n🚀 Welcome to sparkseed!\n'));
        writeLine(chalk_1.default.gray('We will first ask you which language you prefer for the interactive questions.\n'));
        // Ask questions
        const config = await (0, project_prompts_1.askProjectQuestions)();
        const language = config.cliLanguage ?? 'en';
        const messages = CLI_MESSAGES[language];
        writeLine(chalk_1.default.blue(messages.generatingDocs));
        // Generate PRD
        const prdSpinner = (0, ora_1.default)(messages.prdStart).start();
        const prd = (0, prd_generator_1.generatePRD)(config);
        const prdMarkdown = (0, prd_generator_1.formatPRD)(prd, config.cliLanguage);
        prdSpinner.succeed(messages.prdSuccess);
        // Generate Design System
        const dsSpinner = (0, ora_1.default)(messages.dsStart).start();
        const designSystem = (0, design_system_generator_1.generateDesignSystem)(config);
        const dsMarkdown = (0, design_system_generator_1.formatDesignSystem)(designSystem, config.cliLanguage);
        dsSpinner.succeed(messages.dsSuccess);
        // Generate project structure
        const structureSpinner = (0, ora_1.default)(messages.structureStart).start();
        const structure = (0, builder_1.generateProjectStructure)(config);
        structureSpinner.succeed(messages.structureSuccess);
        // Write to disk
        const targetDir = path.resolve(process.cwd(), directory);
        await (0, file_writer_1.writeProjectToDisk)(structure, targetDir, prdMarkdown, dsMarkdown, config.cliLanguage);
        // Summary
        writeLine(chalk_1.default.green(messages.summaryTitle));
        writeLine(`${chalk_1.default.gray(messages.structureAtLabel)} ${chalk_1.default.cyan(targetDir)}`);
        writeLine(messages.generatedDocsTitle);
        writeLine(chalk_1.default.gray(messages.docPrd));
        writeLine(chalk_1.default.gray(messages.docDesignSystem));
        writeLine(chalk_1.default.gray(messages.docArchitecture));
        if (config.type === 'fullstack' || config.type === 'api') {
            writeLine(chalk_1.default.gray(messages.docApi));
        }
        writeLine(messages.nextStepsTitle);
        writeLine(chalk_1.default.gray(`${messages.stepCdPrefix}${directory}`));
        writeLine(chalk_1.default.gray(messages.stepInstall));
        writeLine(chalk_1.default.gray(messages.stepDev));
        writeLine(chalk_1.default.blue(messages.docsHint));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Error while creating project:'));
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('init')
    .description('Initialize interactive CLI (shortcut for create)')
    .action(async () => {
    program.parse(['node', 'sparkseed', 'create']);
});
program
    .command('generate:component')
    .description('Generate a new React component in the current project')
    .action(async () => {
    const spinner = (0, ora_1.default)('Generating component...').start();
    try {
        const language = getCliLanguage();
        const projectRoot = (0, file_writer_2.getProjectRoot)();
        const srcDir = resolveFrontendSrcPath(projectRoot);
        const componentAnswers = await (0, prompts_1.askComponentConfig)(language);
        const componentConfig = {
            componentName: componentAnswers.componentName,
            description: componentAnswers.description,
            withStyles: componentAnswers.withStyles,
            withTest: componentAnswers.withTest,
            projectName: path.basename(projectRoot),
            language: 'typescript',
            framework: 'react',
            styling: 'tailwind',
        };
        const componentDir = path.join(srcDir, 'components', componentConfig.componentName);
        const isTypescript = componentConfig.language === 'typescript';
        const ext = isTypescript ? 'tsx' : 'jsx';
        const files = [];
        files.push({
            filePath: path.relative(projectRoot, path.join(componentDir, `${componentConfig.componentName}.${ext}`)),
            content: (0, component_generator_1.generateComponentTemplate)(componentConfig),
        });
        if (componentConfig.withStyles) {
            files.push({
                filePath: path.relative(projectRoot, path.join(componentDir, `${componentConfig.componentName}.styles.${isTypescript ? 'ts' : 'js'}`)),
                content: (0, component_generator_1.generateComponentStyles)(componentConfig),
            });
        }
        if (componentConfig.withTest) {
            files.push({
                filePath: path.relative(projectRoot, path.join(componentDir, `${componentConfig.componentName}.test.${isTypescript ? 'tsx' : 'jsx'}`)),
                content: (0, component_generator_1.generateComponentTest)(componentConfig),
            });
        }
        await (0, file_writer_2.writeFilesToDisk)(files, projectRoot);
        spinner.succeed('Component generated successfully.');
    }
    catch (error) {
        spinner.fail('Failed to generate component.');
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('generate:page')
    .description('Generate a new page component in the current project')
    .action(async () => {
    const spinner = (0, ora_1.default)('Generating page...').start();
    try {
        const language = getCliLanguage();
        const projectRoot = (0, file_writer_2.getProjectRoot)();
        const srcDir = resolveFrontendSrcPath(projectRoot);
        const pageAnswers = await (0, prompts_1.askPageConfig)(language);
        const pageConfig = {
            pageName: pageAnswers.pageName,
            description: pageAnswers.description,
            withTest: pageAnswers.withTest,
            projectName: path.basename(projectRoot),
            language: 'typescript',
            framework: 'react',
            styling: 'tailwind',
        };
        const pagesDir = path.join(srcDir, 'pages');
        const isTypescript = pageConfig.language === 'typescript';
        const ext = isTypescript ? 'tsx' : 'jsx';
        const files = [];
        files.push({
            filePath: path.relative(projectRoot, path.join(pagesDir, `${pageConfig.pageName}.${ext}`)),
            content: (0, component_generator_1.generatePageTemplate)({
                pageName: pageConfig.pageName,
                language: pageConfig.language,
                description: pageConfig.description,
            }),
        });
        if (pageConfig.withTest) {
            files.push({
                filePath: path.relative(projectRoot, path.join(pagesDir, `${pageConfig.pageName}.test.${isTypescript ? 'tsx' : 'jsx'}`)),
                content: (0, component_generator_1.generatePageTest)({
                    pageName: pageConfig.pageName,
                    language: pageConfig.language,
                }),
            });
        }
        await (0, file_writer_2.writeFilesToDisk)(files, projectRoot);
        spinner.succeed('Page generated successfully.');
    }
    catch (error) {
        spinner.fail('Failed to generate page.');
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('generate:resource')
    .description('Generate backend resource (controller, service, routes, tests)')
    .action(async () => {
    const spinner = (0, ora_1.default)('Generating resource...').start();
    try {
        const language = getCliLanguage();
        const projectRoot = (0, file_writer_2.getProjectRoot)();
        const srcDir = resolveBackendSrcPath(projectRoot);
        const resourceAnswers = await (0, prompts_1.askResourceConfig)(language);
        const resourceConfig = {
            resourceName: resourceAnswers.resourceName,
            description: resourceAnswers.description,
            withController: resourceAnswers.withController,
            withService: resourceAnswers.withService,
            withRoutes: resourceAnswers.withRoutes,
            withTest: resourceAnswers.withTest,
            projectName: path.basename(projectRoot),
            language: 'typescript',
            framework: 'express',
            styling: 'none',
        };
        const controllersDir = path.join(srcDir, 'controllers');
        const servicesDir = path.join(srcDir, 'services');
        const routesDir = path.join(srcDir, 'routes');
        const testsDir = path.join(projectRoot, 'tests', 'resources');
        const files = [];
        if (resourceConfig.withController) {
            files.push({
                filePath: path.relative(projectRoot, path.join(controllersDir, `${resourceConfig.resourceName}.controller.ts`)),
                content: (0, resource_generator_1.generateController)(resourceConfig),
            });
        }
        if (resourceConfig.withService) {
            files.push({
                filePath: path.relative(projectRoot, path.join(servicesDir, `${resourceConfig.resourceName}.service.ts`)),
                content: (0, resource_generator_1.generateService)(resourceConfig),
            });
        }
        if (resourceConfig.withRoutes) {
            files.push({
                filePath: path.relative(projectRoot, path.join(routesDir, `${resourceConfig.resourceName}.routes.ts`)),
                content: (0, resource_generator_1.generateRoutes)(resourceConfig),
            });
        }
        if (resourceConfig.withTest) {
            files.push({
                filePath: path.relative(projectRoot, path.join(testsDir, `${resourceConfig.resourceName}.controller.test.ts`)),
                content: (0, resource_generator_1.generateResourceTest)(resourceConfig),
            });
        }
        await (0, file_writer_2.writeFilesToDisk)(files, projectRoot);
        spinner.succeed('Resource generated successfully.');
    }
    catch (error) {
        spinner.fail('Failed to generate resource.');
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
// Register AI commands
(0, ai_1.registerAiCommands)(program);
// Register Plugin commands
(0, plugins_1.registerPluginCommands)(program);
const normalizedArgs = process.argv.map((arg) => {
    if (arg === SHORT_VERSION_FLAG) {
        return BUILTIN_VERSION_FLAG;
    }
    if (arg === SHORT_VERSION_COMMAND) {
        return LONG_VERSION_OPTION;
    }
    return arg;
});
program.parse(normalizedArgs);
//# sourceMappingURL=index.js.map