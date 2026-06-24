// ========================================
// Darpan CP Tracker - Redis Connection Singleton
// Yeh module IORedis ka single connection provide karta hai puri app ke liye
// BullMQ queues, rate limiting, caching — sab isko use karenge
// ========================================

import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

/**
 * Redis connection instance — REDIS_URL se configure hota hai
 * maxRetriesPerRequest null rakhna padta hai BullMQ ke liye
 */
export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // BullMQ ke liye zaroori hai yeh setting
  enableReadyCheck: false,
  retryStrategy(times: number): number | null {
    // 5 baar retry ke baad give up kar do
    if (times > 5) {
      logger.error(`Redis: ${times} retries ke baad bhi connect nahi ho paa raha, giving up`);
      return null;
    }
    // Exponential backoff — har retry ke saath delay badhaao
    const delay = Math.min(times * 200, 5000);
    logger.warn(`Redis: Retry #${times}, ${delay}ms mein reconnect karenge`);
    return delay;
  },
});

// Connection event handlers
redis.on('connect', () => {
  logger.info('Redis: Connection established — connected ho gaya ✅');
});

redis.on('ready', () => {
  logger.info('Redis: Ready to accept commands — kaam shuru kar sakte hain');
});

redis.on('error', (error: Error) => {
  logger.error(`Redis: Connection error — ${error.message}`);
});

redis.on('close', () => {
  logger.warn('Redis: Connection closed — band ho gaya connection');
});

/**
 * Redis connection ko gracefully band karo
 * Server shutdown ke time call hoga yeh
 */
export async function disconnectRedis(): Promise<void> {
  await redis.quit();
  logger.info('Redis: Gracefully disconnected — connection band ho gayi');
}
