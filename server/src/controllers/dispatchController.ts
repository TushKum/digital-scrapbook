import type { Request, Response } from 'express';
import { dispatchService } from '../services/dispatchService';
import { dto } from '../middleware/validate';
import type { AddDispatchInput } from '../schemas';
import type { Lang } from '../types';

export const dispatchController = {
  async list(_req: Request, res: Response) {
    const { query } = dto<{ query: { lang?: Lang } }>(res);
    if (query.lang) {
      res.json(await dispatchService.getByLang(query.lang));
      return;
    }
    res.json(await dispatchService.getAll());
  },

  async add(_req: Request, res: Response) {
    const { body } = dto<{ body: AddDispatchInput }>(res);
    const created = await dispatchService.add(body);
    res.status(201).json(created);
  },
};
