import { prisma } from '../db/prisma';
import type { TimeKey } from '../types';

const withRelations = { snapshots: true, stock: true } as const;
const ordering = [{ sortOrder: 'asc' as const }, { id: 'asc' as const }];

export const blockRepository = {
  findAll() {
    return prisma.block.findMany({ include: withRelations, orderBy: ordering });
  },

  findById(id: string) {
    return prisma.block.findUnique({ where: { id }, include: withRelations });
  },

  exists(id: string) {
    return prisma.block.count({ where: { id } }).then((n) => n > 0);
  },

  // Increment IDSP / case counters for a block's snapshot in a window.
  incrementSnapshot(
    blockId: string,
    window: TimeKey,
    delta: { sForms?: number; pForms?: number; newCases?: number },
  ) {
    const data: Record<string, { increment: number }> = {};
    if (delta.sForms) data.sForms = { increment: delta.sForms };
    if (delta.pForms) data.pForms = { increment: delta.pForms };
    if (delta.newCases) {
      data.newCases = { increment: delta.newCases };
      data.activeCases = { increment: delta.newCases };
    }
    return prisma.snapshot.update({
      where: { blockId_window: { blockId, window } },
      data,
    });
  },

  // Set absolute stock levels for a block's window.
  setStock(
    blockId: string,
    window: TimeKey,
    values: { ors?: number; zinc?: number; antibiotics?: number },
  ) {
    return prisma.stock.update({
      where: { blockId_window: { blockId, window } },
      data: values,
    });
  },
};
