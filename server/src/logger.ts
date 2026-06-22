import pino from 'pino';
import { config } from './config';

// Structured logger; pretty-printed in development, JSON in production.
export const logger = pino({
  level: config.logLevel,
  transport: config.isDev
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } }
    : undefined,
});
