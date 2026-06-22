import { prisma } from '../db/prisma';
import type { Lang } from '../types';

export const dispatchRepository = {
  findByLang(lang: Lang) {
    return prisma.dispatch.findMany({
      where: { lang, active: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });
  },

  create(input: { lang: Lang; text: string; priority: number }) {
    return prisma.dispatch.create({ data: input });
  },
};
