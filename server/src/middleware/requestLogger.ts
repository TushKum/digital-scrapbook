import type { RequestHandler } from 'express';
import { logger } from '../logger';

// Logs each request with method, path, status and duration.
export const requestLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info(
      { method: req.method, path: req.originalUrl, status: res.statusCode, ms: Math.round(ms * 10) / 10 },
      'request',
    );
  });
  next();
};
