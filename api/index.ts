// Vercel serverless entry for the Express API.
//
// The Express app is created lazily on the first request instead of at module
// load. Two reasons:
//  - a module-scope crash (missing env var, import failure) would surface as an
//    opaque FUNCTION_INVOCATION_FAILED page; here we catch it and return the
//    real error as JSON so it can be diagnosed from the HTTP response;
//  - the created app is cached on globalThis, so warm invocations reuse it (and
//    the module-scope PrismaClient inside it), same as the eager pattern.
//
// Vercel passes the ORIGINAL request path through unchanged, so createApp()'s
// `app.use('/api', apiRouter)` mount keeps working as-is. No app.listen() here —
// that lives in server/src/index.ts for the long-running Render service.
import type { IncomingMessage, ServerResponse } from 'node:http';

type ExpressHandler = (req: IncomingMessage, res: ServerResponse) => void;

const cache = globalThis as { __neervanaApp?: ExpressHandler };

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (!cache.__neervanaApp) {
      const { createApp } = await import('../server/src/app');
      cache.__neervanaApp = createApp() as unknown as ExpressHandler;
    }
    return cache.__neervanaApp(req, res);
  } catch (err) {
    const detail = err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err);
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'boot_failure', detail }));
  }
}
