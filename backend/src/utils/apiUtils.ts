import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { logger } from './logger';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Helper fetcher with retry logic.
 * Useful for CF API which drops connections or rate limits.
 */
export const fetchWithRetry = async <T>(
  url: string,
  config?: AxiosRequestConfig,
  retries: number = 3,
  backoffMs: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get<T>(url, config);
      return response.data;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      const axiosError = error as AxiosError;
      
      const status = axiosError.response?.status;
      const shouldRetry = !status || status >= 500 || status === 429;

      if (!shouldRetry || isLastAttempt) {
        logger.error(`API Fetch Failed: ${url} (Attempt ${attempt}/${retries}) - Status: ${status}`);
        throw new ApiError(status || 500, axiosError.message);
      }

      logger.warn(`API Fetch Failed: ${url} (Attempt ${attempt}/${retries}). Retrying in ${backoffMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }
  throw new Error('Unreachable');
};
