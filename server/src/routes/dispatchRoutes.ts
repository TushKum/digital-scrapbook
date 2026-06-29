import { Router } from 'express';
import { dispatchController } from '../controllers/dispatchController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { addDispatchSchema, dispatchesQuerySchema } from '../schemas';

export const dispatchRoutes = Router();

dispatchRoutes.get(
  '/',
  validate({ query: dispatchesQuerySchema }),
  asyncHandler(dispatchController.list),
);

dispatchRoutes.post(
  '/',
  authenticate,
  validate({ body: addDispatchSchema }),
  asyncHandler(dispatchController.add),
);
