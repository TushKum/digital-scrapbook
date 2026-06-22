import { prisma } from './prisma';
import { SEED_BLOCKS, SEED_DISPATCHES } from '../domain/seedData';
import { TIME_KEYS } from '../types';
import { logger } from '../logger';

// Idempotent seed: upserts blocks/snapshots/stock by natural keys and resets the
// dispatch feed. Safe to run repeatedly.
async function main() {
  for (const b of SEED_BLOCKS) {
    await prisma.block.upsert({
      where: { id: b.id },
      create: {
        id: b.id,
        name: b.name,
        namePa: b.namePa,
        phc: b.phc,
        population: b.population,
        posX: b.posX,
        posZ: b.posZ,
        areaW: b.areaW,
        areaD: b.areaD,
        sortOrder: b.sortOrder,
      },
      update: {
        name: b.name,
        namePa: b.namePa,
        phc: b.phc,
        population: b.population,
        posX: b.posX,
        posZ: b.posZ,
        areaW: b.areaW,
        areaD: b.areaD,
        sortOrder: b.sortOrder,
      },
    });

    for (const w of TIME_KEYS) {
      const s = b.snapshots[w];
      await prisma.snapshot.upsert({
        where: { blockId_window: { blockId: b.id, window: w } },
        create: { blockId: b.id, window: w, ...s },
        update: { ...s },
      });
      const st = b.stock[w];
      await prisma.stock.upsert({
        where: { blockId_window: { blockId: b.id, window: w } },
        create: { blockId: b.id, window: w, ...st },
        update: { ...st },
      });
    }
  }

  // Reset the dispatch feed to the canonical set.
  await prisma.dispatch.deleteMany({});
  await prisma.dispatch.createMany({ data: SEED_DISPATCHES });

  const [blocks, snapshots, stock, dispatches] = await Promise.all([
    prisma.block.count(),
    prisma.snapshot.count(),
    prisma.stock.count(),
    prisma.dispatch.count(),
  ]);
  logger.info({ blocks, snapshots, stock, dispatches }, 'seed complete');
}

main()
  .catch((err) => {
    logger.error({ err }, 'seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
