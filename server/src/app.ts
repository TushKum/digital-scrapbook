import express from 'express';
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

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
