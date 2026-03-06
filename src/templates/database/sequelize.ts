import type { ProjectConfig } from '../types';

export function generateSequelizeModels(config: ProjectConfig): string {
  const entities = config.domainEntities || [];

  const lines: string[] = [
    "import { Sequelize, DataTypes, Model, Optional } from 'sequelize';",
    "import sequelize from './index';",
    '',
  ];

  // If no domain entities, generate default User model
  if (entities.length === 0) {
    lines.push(
      '// User Model',
      'interface UserAttributes {',
      '  id: string;',
      '  email: string;',
      '  password: string;',
      '  name: string;',
      '  createdAt: Date;',
      '  updatedAt: Date;',
      '}',
      '',
      'interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}',
      '',
      'export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {',
      '  declare id: string;',
      '  declare email: string;',
      '  declare password: string;',
      '  declare name: string;',
      '  declare createdAt: Date;',
      '  declare updatedAt: Date;',
      '}',
      '',
      "User.init({",
      "  id: {",
      '    type: DataTypes.UUID,',
      '    defaultValue: DataTypes.UUIDV4,',
      '    primaryKey: true,',
      '  },',
      "  email: {",
      '    type: DataTypes.STRING,',
      '    allowNull: false,',
      '    unique: true,',
      '    validate: { isEmail: true },',
      '  },',
      "  password: {",
      '    type: DataTypes.STRING,',
      '    allowNull: false,',
      '  },',
      "  name: {",
      '    type: DataTypes.STRING,',
      '    allowNull: false,',
      '  },',
      "  createdAt: DataTypes.DATE,",
      "  updatedAt: DataTypes.DATE,",
      '}, {',
      "  sequelize,",
      "  tableName: 'users',",
      "  modelName: 'User',",
      '});',
      '',
      'export default User;',
      ''
    );
    return lines.join('\n');
  }

  // Generate models from domain entities
  entities.forEach((entity) => {
    const modelName = entity.name;
    const tableName = entity.name.toLowerCase() + 's';

    lines.push(`// ${modelName} Model`);
    lines.push(`interface ${modelName}Attributes {`);
    lines.push('  id: string;');

    entity.fields.forEach((field) => {
      const tsType = getSequelizeTsType(field.type);
      const fieldName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
      lines.push(`  ${fieldName}${field.required ? '' : '?'}: ${tsType};`);
    });

    lines.push('  createdAt: Date;');
    lines.push('  updatedAt: Date;');
    lines.push('}');
    lines.push('');
    lines.push(`interface ${modelName}CreationAttributes extends Optional<${modelName}Attributes, "id" | "createdAt" | "updatedAt"> {}`);
    lines.push('');
    lines.push(`export class ${modelName} extends Model<${modelName}Attributes, ${modelName}CreationAttributes> implements ${modelName}Attributes {`);
    lines.push('  declare id: string;');

    entity.fields.forEach((field) => {
      const tsType = getSequelizeTsType(field.type);
      const fieldName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
      lines.push(`  declare ${fieldName}${field.required ? '' : '?'}: ${tsType};`);
    });

    lines.push('  declare createdAt: Date;');
    lines.push('  declare updatedAt: Date;');
    lines.push('}');
    lines.push('');
    lines.push(`${modelName}.init({`);
    lines.push("  id: {");
    lines.push('    type: DataTypes.UUID,');
    lines.push('    defaultValue: DataTypes.UUIDV4,');
    lines.push('    primaryKey: true,');
    lines.push('  },');

    entity.fields.forEach((field) => {
      const sequelizeType = getSequelizeType(field.type);
      const fieldName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
      const validations = [];

      if (!field.required) {
        validations.push('    allowNull: true,');
      } else {
        validations.push('    allowNull: false,');
      }

      if (field.unique) {
        validations.push('    unique: true,');
      }

      if (field.type === 'email') {
        validations.push("    validate: { isEmail: true },");
      }

      lines.push(`  ${fieldName}: {`);
      lines.push(`    type: ${sequelizeType},`);
      lines.push(...validations);
      lines.push('  },');
    });

    lines.push('  createdAt: DataTypes.DATE,');
    lines.push('  updatedAt: DataTypes.DATE,');
    lines.push('}, {');
    lines.push('  sequelize,');
    lines.push(`  tableName: '${tableName}',`);
    lines.push(`  modelName: '${modelName}',`);
    lines.push('});');
    lines.push('');
    lines.push(`export default ${modelName};`);
    lines.push('');
  });

  return lines.join('\n');
}

export function generateSequelizeIndex(config: ProjectConfig): string {
  const lines: string[] = [
    "import { Sequelize } from 'sequelize';",
    '',
    "const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb';",
    '',
    'const sequelize = new Sequelize(connectionString, {',
    '  dialect: "postgres",',
    '  logging: false,',
    '});',
    '',
    'export default sequelize;',
    '',
  ];

  return lines.join('\n');
}

function getSequelizeType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'DataTypes.STRING',
    number: 'DataTypes.INTEGER',
    boolean: 'DataTypes.BOOLEAN',
    date: 'DataTypes.DATE',
    email: 'DataTypes.STRING',
    text: 'DataTypes.TEXT',
    json: 'DataTypes.JSON',
  };
  return typeMap[fieldType] || 'DataTypes.STRING';
}

function getSequelizeTsType(fieldType: string): string {
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
