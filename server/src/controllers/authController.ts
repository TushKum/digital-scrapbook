import type { Request, Response } from 'express';
import { authService } from '../services/authService';
import { dto } from '../middleware/validate';
import { currentUser } from '../middleware/authenticate';
import type { LoginInput } from '../schemas';

export const authController = {
  async login(_req: Request, res: Response) {
    const { body } = dto<{ body: LoginInput }>(res);
    const result = await authService.login(body);
    res.json(result);
  },

  // Returns the authenticated user (token validated by `authenticate`).
  async me(_req: Request, res: Response) {
    const payload = currentUser(res);
    const user = await authService.getById(payload.sub);
    res.json({ user });
  },
};
