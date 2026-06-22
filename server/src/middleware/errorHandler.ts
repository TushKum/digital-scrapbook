import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../logger';

// Centralised error handler — normalises Zod, AppError, Prisma and unknown
// errors into a consistent JSON envelope.
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'validation_error',
      message: 'Request validation failed',
      issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Prisma "record not found" (e.g. update on a missing row)
  const code = (err as { code?: string })?.code;
  if (code === 'P2025') {
    res.status(404).json({ error: 'not_found', message: 'Resource not found' });
    return;
  }

  logger.error({ err, path: req.originalUrl }, 'unhandled error');
  res.status(500).json({ error: 'internal_error', message: 'Internal server error' });
};
