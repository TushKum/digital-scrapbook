// Diagnostic probe: imports the Prisma client module (module-scope
// PrismaClient + driver adapter + generated client). A crash here vs
// probe-logger working pins the failure on the generated client / WASM
// bundling. Also runs one real query on request to test the full data path.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { prisma } from '../server/src/db/prisma';

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('content-type', 'application/json');
  try {
    const rows = await prisma.$queryRaw`SELECT 1 AS ok`;
    res.end(JSON.stringify({ probe: 'prisma', moduleLoaded: true, query: rows }));
  } catch (err) {
    const detail = err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ probe: 'prisma', moduleLoaded: true, queryError: detail }));
  }
}
