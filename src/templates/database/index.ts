// Database templates
export { generatePrismaSchema, generateDatabaseIndexFile } from './prisma';
export { generateDrizzleSchema, generateDrizzleIndex } from './drizzle';
export { generateSequelizeModels, generateSequelizeIndex } from './sequelize';
export { generateTypeORMConfig, generateMongooseModels, generateKnexConfig } from './typeorm-mongoose-knex';
export { generateRedisConfig, generateSupabaseClient, generateRedisDockerCompose } from './redis-supabase';
