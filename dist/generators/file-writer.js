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
exports.writeProjectToDisk = writeProjectToDisk;
const fs = __importStar(require("fs"));
const ora_1 = __importDefault(require("ora"));
const path = __importStar(require("path"));
const FILE_WRITER_MESSAGES = {
    en: {
        creating: 'Creating project structure...',
        success: 'Project successfully created!',
        error: 'Error while creating project',
    },
    pt: {
        creating: 'Criando estrutura do projeto...',
        success: 'Projeto criado com sucesso!',
        error: 'Erro ao criar projeto',
    },
    es: {
        creating: 'Creando estructura del proyecto...',
        success: 'Proyecto creado con éxito!',
        error: 'Error al crear el proyecto',
    },
};
async function writeStructure(structure, basePath, prdContent, designSystemContent) {
    const currentPath = path.join(basePath, structure.name);
    if (structure.type === 'folder') {
        // Create directory
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath, { recursive: true });
        }
        // Write children - pass currentPath as the new base for children
        if (structure.children) {
            for (const child of structure.children) {
                await writeStructure(child, currentPath, prdContent, designSystemContent);
            }
        }
    }
    else if (structure.type === 'file') {
        // Handle documentation files with special content
        if (structure.name === 'PRD.md' && prdContent) {
            fs.writeFileSync(path.join(basePath, structure.name), prdContent, 'utf-8');
        }
        else if (structure.name === 'DESIGN_SYSTEM.md' && designSystemContent) {
            fs.writeFileSync(path.join(basePath, structure.name), designSystemContent, 'utf-8');
        }
        else if (structure.name === '.gitkeep') {
            // Skip .gitkeep files
        }
        else if (structure.content) {
            fs.writeFileSync(path.join(basePath, structure.name), structure.content, 'utf-8');
        }
    }
}
async function writeProjectToDisk(structure, baseDir, prdContent, designSystemContent, language) {
    const selectedLanguage = language ?? 'en';
    const messages = FILE_WRITER_MESSAGES[selectedLanguage];
    const spinner = (0, ora_1.default)(messages.creating).start();
    try {
        await writeStructure(structure, baseDir, prdContent, designSystemContent);
        spinner.succeed(messages.success);
    }
    catch (error) {
        spinner.fail(messages.error);
        throw error;
    }
}
//# sourceMappingURL=file-writer.js.map