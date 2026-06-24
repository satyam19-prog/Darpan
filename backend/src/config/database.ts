// ========================================
// Darpan CP Tracker - Prisma Client Singleton
// Yeh module Prisma client ka single instance maintain karta hai
// Development mein hot-reload se multiple connections na ban jaayein isliye global var use karte hain
// ========================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

/**
 * Global variable jo dev hot-reload ke dauran Prisma client ko re-create hone se rokta hai
 * Production mein toh ek hi instance banega, lekin dev mein nodemon restart karta rehta hai
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Prisma client instance — puri app mein yahi ek instance use hoga */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'stdout' },
            { level: 'warn', emit: 'stdout' },
          ]
        : [{ level: 'error', emit: 'stdout' }],
  });

// Development mein query logging enable karo
if (process.env.NODE_ENV === 'development') {
  (prisma as any).$on('query', (e: any) => {
    logger.debug(`Prisma Query: ${e.query} — Duration: ${e.duration}ms`);
  });
}

// Global mein store karo taaki hot-reload mein naya instance na bane
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful disconnect — server shutdown ke time Prisma connection band karo
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected — database connection band ho gayi');
}
