import { prisma } from './prisma';
import { SEED_BLOCKS, SEED_DISPATCHES } from '../domain/seedData';
import { TIME_KEYS } from '../types';
import { logger } from '../logger';
import { config } from '../config';
import { authService } from '../services/authService';
import { userRepository } from '../repositories/userRepository';

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

  // Seed the default operator (idempotent; password is bcrypt-hashed).
  await userRepository.upsert({
    username: config.seedOfficerUser,
    passwordHash: await authService.hashPassword(config.seedOfficerPassword),
    displayName: config.seedOfficerName,
    role: 'nodal_officer',
  });

  const [blocks, snapshots, stock, dispatches, users] = await Promise.all([
    prisma.block.count(),
    prisma.snapshot.count(),
    prisma.stock.count(),
    prisma.dispatch.count(),
    prisma.user.count(),
  ]);
  logger.info({ blocks, snapshots, stock, dispatches, users }, 'seed complete');
}

main()
  .catch((err) => {
    logger.error({ err }, 'seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
