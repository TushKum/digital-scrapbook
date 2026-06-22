import type { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { logger } from '../logger';

export const healthController = {
  // Liveness — process is up.
  health(_req: Request, res: Response) {
    res.json({
      status: 'ok',
      service: 'neervana-surveillance-api',
      district: 'Patiala',
      time: new Date().toISOString(),
    });
  },

  // Readiness — database is reachable.
  async ready(_req: Request, res: Response) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ready', db: 'up' });
    } catch (err) {
      logger.warn({ err }, 'readiness check failed');
      res.status(503).json({ status: 'unavailable', db: 'down' });
    }
  },
};
