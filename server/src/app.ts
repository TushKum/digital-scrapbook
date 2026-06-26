import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { config } from './config';
import { apiRouter } from './routes';
import { requestLogger } from './middleware/requestLogger';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

// Builds the Express application (separated from listen() so it can be tested).
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',') }));
  app.use(express.json({ limit: '256kb' }));
  app.use(requestLogger);

  app.use('/api', apiRouter);

  const frontendDist = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (req.method !== 'GET') {
        return next();
      }
      res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
        if (err) {
          next(err);
        }
      });
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
