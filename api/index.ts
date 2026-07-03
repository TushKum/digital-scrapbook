// Vercel serverless entry for the Express API.
//
// The import MUST be static: Vercel's builder compiles the TypeScript import
// graph (api/ -> server/src/**) into the function bundle. A dynamic import()
// is left unbundled and fails at runtime with ERR_MODULE_NOT_FOUND, because
// the raw .ts sources aren't executable in the deployed function.
//
// Vercel passes the ORIGINAL request path through unchanged, so createApp()'s
// `app.use('/api', apiRouter)` mount keeps working as-is. No app.listen() here —
// that lives in server/src/index.ts for the long-running Render service.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server/src/app';

type ExpressHandler = (req: IncomingMessage, res: ServerResponse) => void;

// Created once per instance and reused across warm invocations (same lifetime
// as a module-scope instance). Wrapped in the handler so a createApp() failure
// surfaces as a readable JSON error instead of FUNCTION_INVOCATION_FAILED.
let app: ExpressHandler | undefined;

export default function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    app ??= createApp() as unknown as ExpressHandler;
    return app(req, res);
  } catch (err) {
    const detail = err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err);
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'boot_failure', detail }));
  }
}
