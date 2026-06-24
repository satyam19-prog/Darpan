// ========================================
// Darpan CP Tracker - BullMQ Queue Setup
// Yeh module saare background job queues define karta hai
// Contest polling, upsolving check, plagiarism detection, notifications — sab ke liye alag queue
// ========================================

import { Queue } from 'bullmq';
import { redis } from './redis';
import { logger } from '../utils/logger';

/**
 * Shared connection options — saari queues same Redis connection use karengi
 */
const connectionOpts = { connection: redis as any };

/**
 * Contest Poller Queue — Codeforces se contest ratings aur standings fetch karne ke liye
 * Yeh queue periodically CF API hit karegi for public contest data
 */
export const contestPollerQueue = new Queue('contest-poller', {
  ...connectionOpts,
  defaultJobOptions: {
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

/**
 * Private Contest Poller Queue — Camp ke private contests ka data fetch karne ke liye
 * Admin/Mentor jab private contest add kare toh yeh queue uska standings pull karegi
 */
export const privateContestPollerQueue = new Queue('private-contest-poller', {
  ...connectionOpts,
  defaultJobOptions: {
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

/**
 * Upsolving Checker Queue — Students ne upsolved kiya ya nahi yeh check karne ke liye
 * Contest ke baad deadline ke andar upsolve hua ya nahi track karega
 */
export const upsolvingCheckerQueue = new Queue('upsolving-checker', {
  ...connectionOpts,
  defaultJobOptions: {
    removeOnComplete: { count: 200 },
    removeOnFail: { count: 50 },
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
  },
});

/**
 * Plagiarism Checker Queue — Code similarity check karne ke liye
 * Contest ke submissions compare karke suspicious matches flag karega
 */
export const plagiarismCheckerQueue = new Queue('plagiarism-checker', {
  ...connectionOpts,
  defaultJobOptions: {
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 25 },
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 15000,
    },
  },
});

/**
 * Notification Queue — Email/in-app notifications bhejne ke liye
 * Contest reminders, badge earned, plagiarism flag — sab notifications isse jayengi
 */
export const notificationQueue = new Queue('notification', {
  ...connectionOpts,
  defaultJobOptions: {
    removeOnComplete: { count: 500 },
    removeOnFail: { count: 100 },
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
  },
});

logger.info('BullMQ: Saari 5 queues initialize ho gayi — contest-poller, private-contest-poller, upsolving-checker, plagiarism-checker, notification');
