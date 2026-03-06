import type { ProjectConfig } from '../types';

export function generateTypeORMConfig(config: ProjectConfig): string {
  const entities = config.domainEntities || [];

  const lines: string[] = [
    "import 'reflect-metadata';",
    "import { DataSource, EntitySchema } from 'typeorm';",
    '',
  ];

  // If no domain entities, generate default User entity
  if (entities.length === 0) {
    lines.push(
      '// User Entity',
      "export interface User {",
      '  id: string;',
      '  email: string;',
      '  password: string;',
      '  name: string;',
      '  createdAt: Date;',
      '  updatedAt: Date;',
      '}',
      '',
      "export const UserEntity = new EntitySchema<User>({",
      "  name: 'User',",
      "  tableName: 'users',",
      '  columns: {',
      "    id: {",
      '      type: String,',
      '      primary: true,',
      "      generated: 'uuid',",
      '    },',
      "    email: {",
      '      type: String,',
      '      unique: true,',
      '    },',
      "    password: {",
      '      type: String,',
      '    },',
      "    name: {",
      '      type: String,',
      '    },',
      "    createdAt: {",
      '      type: Date,',
      "      createDate: true,",
      '    },',
      "    updatedAt: {",
      '      type: Date,',
      "      updateDate: true,",
      '    },',
      '  },',
      '});',
      '',
      '// Data Source',
      "export const AppDataSource = new DataSource({",
      "  type: 'postgres',",
      '  host: process.env.DB_HOST || "localhost",',
      '  port: parseInt(process.env.DB_PORT || "5432"),',
      '  username: process.env.DB_USER || "postgres",',
      '  password: process.env.DB_PASSWORD || "postgres",',
      '  database: process.env.DB_NAME || "mydb",',
      "  synchronize: process.env.NODE_ENV !== 'production',",
      "  logging: process.env.NODE_ENV === 'development',",
      "  entities: [UserEntity],",
      "  migrations: ['src/database/migrations/*.ts'],",
      '});',
      ''
    );
    return lines.join('\n');
  }

  // Generate entities from domain entities
  entities.forEach((entity) => {
    const modelName = entity.name;
    const tableName = modelName.toLowerCase() + 's';

    lines.push(`// ${modelName} Entity`);
    lines.push(`export interface ${modelName} {`);
    lines.push('  id: string;');

    entity.fields.forEach((field) => {
      const tsType = getTypeORMTsType(field.type);
      const fieldName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
      lines.push(`  ${fieldName}${field.required ? '' : '?'}: ${tsType};`);
    });

    lines.push('  createdAt: Date;');
    lines.push('  updatedAt: Date;');
    lines.push('}');
    lines.push('');

    lines.push(`export const ${modelName}Entity = new EntitySchema<${modelName}>({`);
    lines.push(`  name: '${modelName}',`);
    lines.push(`  tableName: '${tableName}',`);
    lines.push('  columns: {');
    lines.push("    id: {");
    lines.push('      type: String,');
    lines.push('      primary: true,');
    lines.push("      generated: 'uuid',");
    lines.push('    },');

    entity.fields.forEach((field) => {
      const ormType = getTypeORMType(field.type);
      const fieldName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
      lines.push(`    ${fieldName}: {`);
      lines.push(`      type: ${ormType},`);
      if (field.unique) {
        lines.push('      unique: true,');
      }
      if (!field.required) {
        lines.push('      nullable: true,');
      }
      lines.push('    },');
    });

    lines.push("    createdAt: {");
    lines.push('      type: Date,');
    lines.push("      createDate: true,");
    lines.push('    },');
    lines.push("    updatedAt: {");
    lines.push('      type: Date,');
    lines.push("      updateDate: true,");
    lines.push('    },');
    lines.push('  },');
    lines.push('});');
    lines.push('');
  });

  // Generate Data Source
  const entityList = entities.length > 0 
    ? `entities: [${entities.map(e => `${e.name}Entity`).join(', ')}],`
    : 'entities: [],';

  lines.push('// Data Source');
  lines.push('export const AppDataSource = new DataSource({');
  lines.push("  type: 'postgres',");
  lines.push('  host: process.env.DB_HOST || "localhost",');
  lines.push('  port: parseInt(process.env.DB_PORT || "5432"),');
  lines.push('  username: process.env.DB_USER || "postgres",');
  lines.push('  password: process.env.DB_PASSWORD || "postgres",');
  lines.push('  database: process.env.DB_NAME || "mydb",');
  lines.push("  synchronize: process.env.NODE_ENV !== 'production',");
  lines.push("  logging: process.env.NODE_ENV === 'development',");
  lines.push(`  ${entityList}`);
  lines.push("  migrations: ['src/database/migrations/*.ts'],");
  lines.push('});');
  lines.push('');

  return lines.join('\n');
}

export function generateMongooseModels(config: ProjectConfig): string {
  const entities = config.domainEntities || [];

  const lines: string[] = [
    "import mongoose, { Schema, Document, Model } from 'mongoose';",
    '',
  ];

  // If no domain entities, generate default User model
  if (entities.length === 0) {
    lines.push(
      '// User Interface',
      'export interface IUser extends Document {',
      '  _id: string;',
      '  email: string;',
      '  password: string;',
      '  name: string;',
      '  createdAt: Date;',
      '  updatedAt: Date;',
      '}',
      '',
      '// User Schema',
      'const UserSchema: Schema<IUser> = new Schema({',
      "  email: { type: String, required: true, unique: true },",
      "  password: { type: String, required: true },",
      "  name: { type: String, required: true },",
      '}, {',
      "  timestamps: true,",
      "  toJSON: { virtuals: true },",
      "  toObject: { virtuals: true },",
      '});',
      '',
      '// User Model',
      "export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);",
      ''
    );
    return lines.join('\n');
  }

  // Generate models from domain entities
  entities.forEach((entity) => {
    const modelName = entity.name;
    const schemaName = `${modelName}Schema`;
    const interfaceName = `I${modelName}`;

    lines.push(`// ${modelName} Interface`);
    lines.push(`export interface ${interfaceName} extends Document {`);
    lines.push('  _id: string;');

    entity.fields.forEach((field) => {
      const tsType = getMongooseTsType(field.type);
      const fieldName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
      lines.push(`  ${fieldName}${field.required ? '' : '?'}: ${tsType};`);
    });

    lines.push('  createdAt: Date;');
    lines.push('  updatedAt: Date;');
    lines.push('}');
    lines.push('');

    lines.push(`// ${modelName} Schema`);
    lines.push(`const ${schemaName}: Schema<${interfaceName}> = new Schema({`);

    entity.fields.forEach((field) => {
      const mongooseType = getMongooseType(field.type);
      const fieldName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
      const options = [];

      if (field.required) {
        options.push('required: true');
      }
      if (field.unique) {
        options.push('unique: true');
      }
      if (field.type === 'email') {
        options.push('match: [/^\\S+@\\S+\\.\\S+$/, "Please enter a valid email"]');
      }

      lines.push(`  ${fieldName}: { type: ${mongooseType}${options.length > 0 ? ', ' + options.join(', ') : ''} },`);
    });

    lines.push('}, {');
    lines.push('  timestamps: true,');
    lines.push('  toJSON: { virtuals: true },');
    lines.push('  toObject: { virtuals: true },');
    lines.push('});');
    lines.push('');

    lines.push(`// ${modelName} Model`);
    lines.push(`export const ${modelName}: Model<${interfaceName}> = mongoose.model<${interfaceName}>('${modelName}', ${schemaName});`);
    lines.push('');
  });

  return lines.join('\n');
}

export function generateKnexConfig(config: ProjectConfig): string {
  const lines: string[] = [
    "import knex, { Knex } from 'knex';",
    '',
    "const config: Knex.Config = {",
    "  client: 'pg',",
    '  connection: process.env.DATABASE_URL || {',
    '    host: process.env.DB_HOST || "localhost",',
    '    port: parseInt(process.env.DB_PORT || "5432"),',
    '    user: process.env.DB_USER || "postgres",',
    '    password: process.env.DB_PASSWORD || "postgres",',
    '    database: process.env.DB_NAME || "mydb",',
    '  },',
    '  migrations: {',
    "    directory: './migrations',",
    "    extension: 'ts',",
    '  },',
    '  seeds: {',
    "    directory: './seeds',",
    '  },',
    '};',
    '',
    "export const db = knex(config);",
    '',
    'export default db;',
    '',
  ];

  return lines.join('\n');
}

function getTypeORMType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'String',
    number: 'Int',
    boolean: 'Boolean',
    date: 'Date',
    email: 'String',
    text: 'Text',
    json: 'SimpleJson',
  };
  return typeMap[fieldType] || 'String';
}

function getTypeORMTsType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    date: 'Date',
    email: 'string',
    text: 'string',
    json: 'any',
  };
  return typeMap[fieldType] || 'string';
}

function getMongooseType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'String',
    number: 'Number',
    boolean: 'Boolean',
    date: 'Date',
    email: 'String',
    text: 'String',
    json: 'Schema.Types.Mixed',
  };
  return typeMap[fieldType] || 'String';
}

function getMongooseTsType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    date: 'Date',
    email: 'string',
    text: 'string',
    json: 'any',
  };
  return typeMap[fieldType] || 'string';
}
