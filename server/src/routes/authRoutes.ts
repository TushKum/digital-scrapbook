import { Router } from 'express';
import { authController } from '../controllers/authController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { loginSchema } from '../schemas';

export const authRoutes = Router();

authRoutes.post('/login', validate({ body: loginSchema }), asyncHandler(authController.login));
authRoutes.get('/me', authenticate, asyncHandler(authController.me));
