import type { Request, Response } from 'express';
import { alertService } from '../services/alertService';
import { dto } from '../middleware/validate';
import { currentUser } from '../middleware/authenticate';
import type { AdvanceAlertInput } from '../schemas';

export const alertController = {
  async list(_req: Request, res: Response) {
    res.json(await alertService.list());
  },

  async advance(_req: Request, res: Response) {
    const { params, body } = dto<{ params: { id: string }; body: AdvanceAlertInput }>(res);
    const user = currentUser(res);
    res.json(await alertService.advance(params.id, body, user.sub));
  },
};
