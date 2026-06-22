import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { config } from '../config';

// Prisma 7 uses a driver adapter (the bundled query engine is gone). The
// connection string is supplied at runtime — prisma.config.ts is CLI-only.
const adapter = new PrismaPg({ connectionString: config.databaseUrl });

export const prisma = new PrismaClient({
  adapter,
  log: config.isDev ? ['warn', 'error'] : ['error'],
});
