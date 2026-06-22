import { blockRepository } from '../repositories/blockRepository';
import { toBlockDTO } from '../domain/serialize';
import { computeAggregate } from '../domain/aggregate';
import { AppError } from '../errors/AppError';
import type { AggregateDTO, BlockDTO, TimeKey } from '../types';
import type { SubmitReportInput, UpdateStockInput } from '../schemas';

export const blockService = {
  async list(): Promise<BlockDTO[]> {
    const rows = await blockRepository.findAll();
    return rows.map(toBlockDTO);
  },

  async getById(id: string): Promise<BlockDTO> {
    const row = await blockRepository.findById(id);
    if (!row) throw AppError.notFound(`Block '${id}' not found`, { id });
    return toBlockDTO(row);
  },

  async aggregate(window: TimeKey): Promise<AggregateDTO> {
    const blocks = await this.list();
    return computeAggregate(blocks, window);
  },

  // Submit an IDSP report — increments the block's snapshot counters.
  async submitReport(id: string, input: SubmitReportInput): Promise<BlockDTO> {
    if (!(await blockRepository.exists(id))) {
      throw AppError.notFound(`Block '${id}' not found`, { id });
    }
    await blockRepository.incrementSnapshot(id, input.window, {
      sForms: input.sForms,
      pForms: input.pForms,
      newCases: input.newCases,
    });
    return this.getById(id);
  },

  // Update a PHC's stock levels for a window.
  async updateStock(id: string, input: UpdateStockInput): Promise<BlockDTO> {
    if (!(await blockRepository.exists(id))) {
      throw AppError.notFound(`Block '${id}' not found`, { id });
    }
    await blockRepository.setStock(id, input.window, {
      ors: input.ors,
      zinc: input.zinc,
      antibiotics: input.antibiotics,
    });
    return this.getById(id);
  },
};
