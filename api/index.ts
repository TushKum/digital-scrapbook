// Vercel serverless entry for the Express API.
//
// Vercel has native TypeScript support for files under api/, so it compiles this
// on the fly — tsx is only used by local dev/start scripts, never in production.
// The whole Express app becomes ONE Vercel Function, and Vercel passes the
// ORIGINAL request path through unchanged: POST /api/auth/login still arrives as
// "/api/auth/login", so createApp()'s `app.use('/api', apiRouter)` mount keeps
// working as-is (Express strips its own mount prefix; Vercel does not strip /api).
//
// This file must ONLY export the app — no app.listen() and no SIGINT/SIGTERM
// handlers. Those live in server/src/index.ts for the long-running Render
// service. The SPA (dist/) is served by Vercel's CDN, and createApp()'s
// static/SPA branch is gated off on Vercel (config.serveWeb is false when the
// VERCEL env is set), so this function stays API-only.
//
// The Prisma client is imported transitively (createApp -> routes -> repos ->
// db/prisma) and instantiated once at module scope, so warm Fluid invocations
// reuse the connection pool.
import { createApp } from '../server/src/app';

const app = createApp();

export default app;
