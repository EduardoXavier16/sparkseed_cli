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
const design_system_generator_1 = require("./generators/design-system-generator");
const file_writer_1 = require("./generators/file-writer");
const prd_generator_1 = require("./generators/prd-generator");
const project_structure_1 = require("./generators/project-structure");
const project_prompts_1 = require("./prompts/project-prompts");
const program = new commander_1.Command();
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
        console.log(chalk_1.default.blue('\n🚀 Welcome to sparkseed!\n'));
        console.log(chalk_1.default.gray('We will ask you a few questions to configure your project.\n'));
        // Ask questions
        const config = await (0, project_prompts_1.askProjectQuestions)();
        console.log(chalk_1.default.blue('\n⚙️  Generating documents and project structure...\n'));
        // Generate PRD
        const prdSpinner = (0, ora_1.default)('Generating PRD...').start();
        const prd = (0, prd_generator_1.generatePRD)(config);
        const prdMarkdown = (0, prd_generator_1.formatPRD)(prd);
        prdSpinner.succeed('PRD generated!');
        // Generate Design System
        const dsSpinner = (0, ora_1.default)('Generating Design System...').start();
        const designSystem = (0, design_system_generator_1.generateDesignSystem)(config);
        const dsMarkdown = (0, design_system_generator_1.formatDesignSystem)(designSystem);
        dsSpinner.succeed('Design System generated!');
        // Generate project structure
        const structureSpinner = (0, ora_1.default)('Generating file structure...').start();
        const structure = (0, project_structure_1.generateProjectStructure)(config);
        structureSpinner.succeed('Structure generated!');
        // Write to disk
        const targetDir = path.resolve(process.cwd(), directory);
        await (0, file_writer_1.writeProjectToDisk)(structure, targetDir, prdMarkdown, dsMarkdown);
        // Summary
        console.log(chalk_1.default.green('\n✅ Project successfully created!\n'));
        console.log(chalk_1.default.gray('📁 Structure created at:'), chalk_1.default.cyan(targetDir));
        console.log('\n📋 Generated documents:');
        console.log(chalk_1.default.gray('  - docs/PRD.md'));
        console.log(chalk_1.default.gray('  - docs/DESIGN_SYSTEM.md'));
        console.log(chalk_1.default.gray('  - docs/ARCHITECTURE.md'));
        if (config.type === 'fullstack' || config.type === 'api') {
            console.log(chalk_1.default.gray('  - docs/API.md'));
        }
        console.log('\n🚀 Next steps:');
        console.log(chalk_1.default.gray(`  cd ${directory}`));
        console.log(chalk_1.default.gray('  npm install'));
        console.log(chalk_1.default.gray('  npm run dev'));
        console.log(chalk_1.default.blue('\n📖 Check the documentation in docs/ for more details.\n'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Erro ao criar projeto:'));
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('init')
    .description('Inicializar CLI interativa (atalho para create)')
    .action(async () => {
    program.parse(['node', 'sparkseed', 'create']);
});
program.parse();
//# sourceMappingURL=index.js.map