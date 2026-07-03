// Diagnostic probe: imports only the config module. A module-scope crash here
// (vs probe-basic working) pins the failure on config.ts / dotenv.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { config } from '../server/src/config';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('content-type', 'application/json');
  res.end(
    JSON.stringify({
      probe: 'config',
      nodeEnv: config.nodeEnv,
      serveWeb: config.serveWeb,
      databaseUrlSet: config.databaseUrl.length > 0,
      jwtSecretSet: config.jwtSecret.length > 0,
    }),
  );
}
