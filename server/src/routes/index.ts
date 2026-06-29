import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { blockRoutes } from './blockRoutes';
import { dispatchRoutes } from './dispatchRoutes';
import { healthController } from '../controllers/healthController';
import { blockController } from '../controllers/blockController';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { aggregateQuerySchema } from '../schemas';

export const apiRouter = Router();

apiRouter.get('/health', healthController.health);
apiRouter.get('/ready', asyncHandler(healthController.ready));

apiRouter.get(
  '/aggregate',
  validate({ query: aggregateQuerySchema }),
  asyncHandler(blockController.aggregate),
);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/blocks', blockRoutes);
apiRouter.use('/dispatches', dispatchRoutes);
