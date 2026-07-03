import 'dotenv/config';

// Centralised, validated environment configuration. Missing required vars are
// collected instead of thrown at module load, so a serverless entry can import
// this module and surface a readable error per request; assertConfig() is the
// fail-loud gate, called from createApp() and the server bootstrap.
const missingVars: string[] = [];

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === '') {
    missingVars.push(name);
    return '';
  }
  return v;
}

export function assertConfig(): void {
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missingVars.join(', ')}`);
  }
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProd = nodeEnv === 'production';
// Vercel runs the API as a serverless function, forces NODE_ENV=production, and
// serves the SPA from its CDN. Detect it so the function stays API-only and so
// we demand real secrets there instead of falling back to dev defaults.
const onVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

// Serve the built SPA (dist/) from this same service so the frontend and /api
// share one origin in production — no CORS, single deploy (Render/local). Never
// on Vercel: express.static() is ignored there; the CDN serves the SPA.
const serveWeb = !onVercel && (process.env.SERVE_WEB === 'true' || isProd);

export const config = {
  nodeEnv,
  isDev: nodeEnv !== 'production',
  // In production the app runs as one service and binds the host-injected PORT.
  // In dev the web (vite) server owns PORT, so the API stays on API_PORT to
  // avoid colliding with it.
  apiPort: serveWeb ? Number(process.env.PORT) || 8787 : Number(process.env.API_PORT) || 8787,
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  serveWeb,
  // Require a real DATABASE_URL in production / on Vercel so a missing var fails
  // loudly at boot instead of silently connecting to a dev localhost. Local dev
  // keeps the docker-compose default.
  databaseUrl:
    isProd || onVercel
      ? required('DATABASE_URL')
      : required('DATABASE_URL', 'postgresql://neervana:neervana@localhost:5432/neervana?schema=public'),
  // Auth. Require a real secret in production so we never ship the dev default.
  jwtSecret: isProd || onVercel ? required('JWT_SECRET') : process.env.JWT_SECRET ?? 'neervana-dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  // Default seeded operator
  seedOfficerUser: process.env.SEED_OFFICER_USER ?? 'nodal.officer',
  seedOfficerPassword: process.env.SEED_OFFICER_PASSWORD ?? 'neervana@2026',
  seedOfficerName: process.env.SEED_OFFICER_NAME ?? 'District Nodal Officer',
} as const;

export type Config = typeof config;
