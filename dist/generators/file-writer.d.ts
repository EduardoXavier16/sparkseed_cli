import { ProjectStructure } from './project-structure';
export declare function writeProjectToDisk(structure: ProjectStructure, baseDir: string, prdContent?: string, designSystemContent?: string): Promise<void>;
export declare function createDirectoryIfNotExists(dirPath: string): void;
export declare function fileExists(filePath: string): boolean;
export declare function readJsonFile<T>(filePath: string): T | null;
export declare function writeJsonFile<T>(filePath: string, data: T): void;
//# sourceMappingURL=file-writer.d.ts.map