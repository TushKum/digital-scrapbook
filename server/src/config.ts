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
  // Render and most PaaS inject PORT; fall back to API_PORT, then a dev default.
  apiPort: Number(process.env.PORT) || Number(process.env.API_PORT) || 8787,
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  // Serve the built SPA (dist/) from this same service so the frontend and
  // /api share one origin in production — no CORS, single deploy.
  serveWeb: process.env.SERVE_WEB === 'true' || nodeEnv === 'production',
  databaseUrl: required('DATABASE_URL', 'postgresql://neervana:neervana@localhost:5432/neervana?schema=public'),
  // Auth
  jwtSecret: process.env.JWT_SECRET ?? 'neervana-dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  // Default seeded operator
  seedOfficerUser: process.env.SEED_OFFICER_USER ?? 'nodal.officer',
  seedOfficerPassword: process.env.SEED_OFFICER_PASSWORD ?? 'neervana@2026',
  seedOfficerName: process.env.SEED_OFFICER_NAME ?? 'District Nodal Officer',
} as const;

export type Config = typeof config;
