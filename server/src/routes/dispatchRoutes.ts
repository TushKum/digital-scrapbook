import { Router } from 'express';
import { dispatchController } from '../controllers/dispatchController';
import { asyncHandler } from '../middleware/asyncHandler';
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
  validate({ body: addDispatchSchema }),
  asyncHandler(dispatchController.add),
);
