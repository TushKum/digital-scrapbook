import 'dotenv/config';

// Centralised, validated environment configuration.
function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const config = {
  nodeEnv,
  isDev: nodeEnv !== 'production',
  apiPort: Number(process.env.API_PORT) || 8787,
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  databaseUrl: required('DATABASE_URL', 'postgresql://neervana:neervana@localhost:5432/neervana?schema=public'),
} as const;

export type Config = typeof config;
