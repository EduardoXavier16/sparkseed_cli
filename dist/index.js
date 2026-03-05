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
const ora_1 = __importDefault(require("ora"));
const path = __importStar(require("path"));
const design_system_generator_1 = require("./generators/design-system/design-system-generator");
const file_writer_1 = require("./generators/file-writer");
const prd_generator_1 = require("./generators/prd/prd-generator");
const builder_1 = require("./generators/project-structure/builder");
const project_prompts_1 = require("./prompts/project-prompts");
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
program.parse();
//# sourceMappingURL=index.js.map