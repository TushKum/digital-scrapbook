// Diagnostic probe: imports config + logger (pino). A crash here vs
// probe-config working pins the failure on logger.ts / pino transports.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { logger } from '../server/src/logger';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  logger.info('probe-logger invoked');
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ probe: 'logger', ok: true }));
}
