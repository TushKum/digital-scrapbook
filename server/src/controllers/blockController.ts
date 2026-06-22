import type { Request, Response } from 'express';
import { blockService } from '../services/blockService';
import { dto } from '../middleware/validate';
import type { SubmitReportInput, UpdateStockInput } from '../schemas';
import type { TimeKey } from '../types';

export const blockController = {
  async list(_req: Request, res: Response) {
    res.json(await blockService.list());
  },

  async getById(_req: Request, res: Response) {
    const { params } = dto<{ params: { id: string } }>(res);
    res.json(await blockService.getById(params.id));
  },

  async aggregate(_req: Request, res: Response) {
    const { query } = dto<{ query: { window: TimeKey } }>(res);
    res.json(await blockService.aggregate(query.window));
  },

  async submitReport(_req: Request, res: Response) {
    const { params, body } = dto<{ params: { id: string }; body: SubmitReportInput }>(res);
    const block = await blockService.submitReport(params.id, body);
    res.status(201).json(block);
  },

  async updateStock(_req: Request, res: Response) {
    const { params, body } = dto<{ params: { id: string }; body: UpdateStockInput }>(res);
    res.json(await blockService.updateStock(params.id, body));
  },
};
