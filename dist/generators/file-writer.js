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
exports.createDirectoryIfNotExists = createDirectoryIfNotExists;
exports.fileExists = fileExists;
exports.readJsonFile = readJsonFile;
exports.writeJsonFile = writeJsonFile;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ora_1 = __importDefault(require("ora"));
async function writeProjectToDisk(structure, baseDir, prdContent, designSystemContent) {
    const spinner = (0, ora_1.default)('Criando estrutura do projeto...').start();
    try {
        await writeStructure(structure, baseDir, prdContent, designSystemContent);
        spinner.succeed('Projeto criado com sucesso!');
    }
    catch (error) {
        spinner.fail('Erro ao criar projeto');
        throw error;
    }
}
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
function createDirectoryIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
function fileExists(filePath) {
    return fs.existsSync(filePath);
}
function readJsonFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
function writeJsonFile(filePath, data) {
    const dir = path.dirname(filePath);
    createDirectoryIfNotExists(dir);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
//# sourceMappingURL=file-writer.js.map