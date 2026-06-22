import { createApp } from './app';
import { config } from './config';
import { logger } from './logger';
import { prisma } from './db/prisma';

const app = createApp();

const server = app.listen(config.apiPort, () => {
  logger.info(`NEERVANA surveillance API listening on http://localhost:${config.apiPort}`);
});

// Non-fatal connectivity probe so the server still serves (and the frontend can
// show a graceful error) even if the database is briefly unreachable at boot.
prisma
  .$queryRaw`SELECT 1`
  .then(() => logger.info('database connection established'))
  .catch((err: unknown) => logger.warn({ err }, 'database not reachable at startup'));

async function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('shutdown complete');
    process.exit(0);
  });
  // Force-exit if connections don't drain in time.
  setTimeout(() => process.exit(1), 10_000).unref();
}

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => void shutdown(sig));
}
