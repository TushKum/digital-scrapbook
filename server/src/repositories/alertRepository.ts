import { prisma } from '../db/prisma';

const withEvents = { events: { orderBy: { at: 'asc' as const } } };
const ordering = [{ raisedAt: 'desc' as const }];

export const alertRepository = {
  findAll() {
    return prisma.alert.findMany({ include: withEvents, orderBy: ordering });
  },

  findById(id: string) {
    return prisma.alert.findUnique({ where: { id }, include: withEvents });
  },

  // Append a response event and move the alert to the next status, atomically.
  advance(
    id: string,
    status: string,
    closedAt: Date | null,
    event: { action: string; actor: string; note: string | null; at: Date },
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.responseEvent.create({ data: { alertId: id, ...event } });
      await tx.alert.update({
        where: { id },
        data: closedAt ? { status, closedAt } : { status },
      });
      return tx.alert.findUnique({ where: { id }, include: withEvents });
    });
  },
};
