import { Router } from 'express';
import { blockController } from '../controllers/blockController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { idParamSchema, submitReportSchema, updateStockSchema } from '../schemas';

export const blockRoutes = Router();

blockRoutes.get('/', asyncHandler(blockController.list));

blockRoutes.get(
  '/:id',
  validate({ params: idParamSchema }),
  asyncHandler(blockController.getById),
);

// Submit an IDSP report (increments counters). Requires authentication.
blockRoutes.post(
  '/:id/reports',
  authenticate,
  validate({ params: idParamSchema, body: submitReportSchema }),
  asyncHandler(blockController.submitReport),
);

// Update PHC stock levels. Requires authentication.
blockRoutes.patch(
  '/:id/stock',
  authenticate,
  validate({ params: idParamSchema, body: updateStockSchema }),
  asyncHandler(blockController.updateStock),
);
