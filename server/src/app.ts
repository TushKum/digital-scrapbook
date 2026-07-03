import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { assertConfig, config } from './config';
import { apiRouter } from './routes';
import { requestLogger } from './middleware/requestLogger';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

// Builds the Express application (separated from listen() so it can be tested).
export function createApp() {
  assertConfig();

  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',') }));
  app.use(express.json({ limit: '256kb' }));
  app.use(requestLogger);

  app.use('/api', apiRouter);

  // In production, serve the built SPA (dist/) from this same origin so the
  // frontend and API share one host. The negative-lookahead fallback returns
  // index.html for client-side routes while leaving unmatched /api/* requests
  // to the JSON 404 handler below.
  if (config.serveWeb) {
    const webDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(webDir));
    app.get(/^\/(?!api\/).*/, (_req, res) => {
      res.sendFile(path.join(webDir, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
