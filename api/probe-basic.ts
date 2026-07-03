// Diagnostic probe: zero app imports. If this responds, the platform, routing,
// and function build are fine — and its marker identifies the live deployment.
import type { IncomingMessage, ServerResponse } from 'node:http';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('content-type', 'application/json');
  res.end(
    JSON.stringify({
      probe: 'basic',
      marker: 'bisect-2-cjs',
      node: process.version,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
    }),
  );
}
