import { ProjectConfig } from '../types';
export interface ProjectStructure {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: ProjectStructure[];
}
export declare function generateProjectStructure(config: ProjectConfig): ProjectStructure;
//# sourceMappingURL=project-structure.d.ts.map