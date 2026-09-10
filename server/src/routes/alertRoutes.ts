import { Router } from 'express';
import { alertController } from '../controllers/alertController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { advanceAlertSchema, idParamSchema } from '../schemas';

export const alertRoutes = Router();

// Public read of open/active alerts + their response chain.
alertRoutes.get('/', asyncHandler(alertController.list));

// Advance an alert one step. Requires authentication (records the acting officer).
alertRoutes.post(
  '/:id/advance',
  authenticate,
  validate({ params: idParamSchema, body: advanceAlertSchema }),
  asyncHandler(alertController.advance),
);
