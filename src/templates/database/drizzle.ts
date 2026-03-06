import type { ProjectConfig } from '../types';

export function generateDrizzleSchema(config: ProjectConfig): string {
  const entities = config.domainEntities || [];

  const lines: string[] = [
    "import { pgTable, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core';",
    "import { relations } from 'drizzle-orm';",
    '',
  ];

  // If no domain entities, generate default User table
  if (entities.length === 0) {
    lines.push(
      '// User table',
      "export const users = pgTable('users', {",
      "  id: uuid('id').defaultRandom().primaryKey(),",
      "  email: text('email').notNull().unique(),",
      "  password: text('password').notNull(),",
      "  name: text('name').notNull(),",
      "  createdAt: timestamp('created_at').defaultNow().notNull(),",
      "  updatedAt: timestamp('updated_at').defaultNow().notNull(),",
      '});',
      '',
      "export const usersRelations = relations(users, ({}) => ({}));",
      ''
    );
    return lines.join('\n');
  }

  // Generate tables from domain entities
  entities.forEach((entity) => {
    const tableName = entity.name.toLowerCase() + 's';
    const modelName = entity.name;

    lines.push(`// ${entity.name} table`);
    lines.push(`export const ${tableName} = pgTable('${tableName}', {`);
    lines.push("  id: uuid('id').defaultRandom().primaryKey(),");

    entity.fields.forEach((field) => {
      const drizzleType = getDrizzleType(field.type);
      const modifiers = [];

      if (field.required) {
        modifiers.push('.notNull()');
      }

      if (field.unique) {
        modifiers.push('.unique()');
      }

      const fieldName = field.name.charAt(0).toLowerCase() + field.name.slice(1);
      lines.push(`  ${fieldName}: ${drizzleType}('${fieldName}')${modifiers.join('')},`);
    });

    lines.push("  createdAt: timestamp('created_at').defaultNow().notNull(),");
    lines.push("  updatedAt: timestamp('updated_at').defaultNow().notNull(),");
    lines.push('});');
    lines.push('');

    // Generate relations if defined
    if (entity.relationships && entity.relationships.length > 0) {
      lines.push(`export const ${tableName}Relations = relations(${tableName}, ({}) => ({}));`);
      lines.push('');
    }
  });

  return lines.join('\n');
}

export function generateDrizzleIndex(config: ProjectConfig): string {
  const entities = config.domainEntities || [];

  const lines: string[] = [
    "// Database client configuration",
    "import { drizzle } from 'drizzle-orm/postgres-js';",
    "import postgres from 'postgres';",
    "import * as schema from './schema';",
    '',
    "const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb';",
    '',
    '// For query purposes',
    'const queryClient = postgres(connectionString);',
    "export const db = drizzle(queryClient, { schema });",
    '',
  ];

  // Export all tables
  if (entities.length > 0) {
    lines.push('// Export all tables');
    lines.push('export * from "./schema";');
    lines.push('');
  }

  return lines.join('\n');
}

function getDrizzleType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'text',
    number: 'integer',
    boolean: 'boolean',
    date: 'timestamp',
    email: 'text',
    text: 'text',
    json: 'jsonb',
  };
  return typeMap[fieldType] || 'text';
}
