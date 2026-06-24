import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';
import { CodeforcesService } from '../services/CodeforcesService';

const cfService = new CodeforcesService();

/**
 * Worker to poll Codeforces contests.
 * We listen on 'contest-poller' queue.
 */
export const contestPollerWorker = new Worker(
  'contest-poller',
  async (job: Job) => {
    logger.info(`Starting job ${job.id} - fetching contest ${job.data.contestId}`);
    
    try {
      const standings = await cfService.getContestStandings(job.data.contestId);
      
      // Typical structure: standings.contest, standings.problems, standings.rows
      logger.info(`Fetched ${standings.rows.length} rows for contest ${job.data.contestId}`);
      
      // TODO: Save standings to the database or update ratings
      
      return { success: true, rowsCount: standings.rows.length };
    } catch (error: any) {
      logger.error(`Contest Poller Failed for ${job.data.contestId}: ${error.message}`);
      throw error;
    }
  },
  { 
    connection: redis as any,
    concurrency: 1 // CF API is rate limited, keep concurrency low
  }
);

contestPollerWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

contestPollerWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed with ${err.message}`);
});
