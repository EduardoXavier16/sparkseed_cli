import type { ProjectConfig } from '../types';

export function generatePrismaSchema(config: ProjectConfig): string {
  const provider =
    config.database === 'postgresql'
      ? 'postgresql'
      : config.database === 'mysql'
        ? 'mysql'
        : 'sqlite';

  const entities = config.domainEntities || [];

  // If no domain entities, generate default User model
  if (entities.length === 0) {
    return [
      'generator client {',
      '  provider = "prisma-client-js"',
      '}',
      '',
      'datasource db {',
      `  provider = "${provider}"`,
      '  url      = env("DATABASE_URL")',
      '}',
      '',
      'model User {',
      '  id        String   @id @default(uuid())',
      '  email     String   @unique',
      '  password  String',
      '  name      String',
      '  createdAt DateTime @default(now())',
      '  updatedAt DateTime @updatedAt',
      '  ',
      '  @@map("users")',
      '}',
      '',
    ].join('\n');
  }

  // Generate models from domain entities
  const lines: string[] = [
    'generator client {',
    '  provider = "prisma-client-js"',
    '}',
    '',
    'datasource db {',
    `  provider = "${provider}"`,
    '  url      = env("DATABASE_URL")',
    '}',
    '',
  ];

  entities.forEach((entity) => {
    const modelName = entity.name;
    const tableName = modelName.toLowerCase() + 's';

    lines.push(`model ${modelName} {`);
    lines.push('  id        String   @id @default(uuid())');

    entity.fields.forEach((field) => {
      const prismaType = getPrismaType(field.type);
      const modifiers = [];

      if (!field.required) {
        modifiers.push('?');
      }

      if (field.unique) {
        modifiers.push(' @unique');
      }

      const fieldName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
      lines.push(`  ${fieldName}   ${prismaType}${modifiers.join('')}`);
    });

    // Add timestamps
    lines.push('  createdAt   DateTime @default(now())');
    lines.push('  updatedAt   DateTime @updatedAt');

    // Add relationships if defined
    if (entity.relationships && entity.relationships.length > 0) {
      lines.push('');
      entity.relationships.forEach((rel) => {
        const relName = rel.entity;
        if (rel.type === 'one-to-many') {
          lines.push(`  ${relName.toLowerCase()}s   ${relName}[]`);
        } else if (rel.type === 'one-to-one') {
          lines.push(`  ${relName.toLowerCase()}   ${relName}?`);
        }
      });
    }

    lines.push('');
    lines.push(`  @@map("${tableName}")`);
    lines.push('}');
    lines.push('');
  });

  return lines.join('\n');
}

function getPrismaType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'String',
    number: 'Int',
    boolean: 'Boolean',
    date: 'DateTime',
    email: 'String',
    text: 'String',
    json: 'Json',
  };
  return typeMap[fieldType] || 'String';
}

export function generateDatabaseIndexFile(): string {
  return [
    "import { PrismaClient } from '@prisma/client';",
    '',
    'export const prisma = new PrismaClient();',
    '',
  ].join('\n');
}
