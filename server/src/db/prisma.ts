import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { config } from '../config';

// Prisma 7 uses a driver adapter (the bundled query engine is gone). The
// connection string is supplied at runtime — prisma.config.ts is CLI-only.
// Keep the pool small: each warm serverless instance holds its own pool, so a
// low max avoids exhausting the database's connection limit under concurrency.
// In production DATABASE_URL should point at a pooled endpoint (e.g. Neon's
// "-pooler" / PgBouncer host).
const adapter = new PrismaPg({ connectionString: config.databaseUrl, max: 3 });

export const prisma = new PrismaClient({
  adapter,
  log: config.isDev ? ['warn', 'error'] : ['error'],
});
