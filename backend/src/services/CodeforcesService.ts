import { fetchWithRetry, ApiError } from '../utils/apiUtils';
import crypto from 'crypto';
import { env } from '../config/env';

export class CodeforcesService {
  private baseUrl = 'https://codeforces.com/api';

  /**
   * Fetch basic user profile info
   */
  async getUserInfo(handles: string[]) {
    if (handles.length === 0) return [];
    
    // CF allows max 10000 handles, we chunk them if needed, but realistically it's small.
    const url = `${this.baseUrl}/user.info?handles=${handles.join(';')}`;
    const data = await fetchWithRetry<any>(url);
    
    if (data.status === 'FAILED') {
      throw new ApiError(400, data.comment || 'Failed to fetch CF User Info');
    }
    return data.result; // Array of user objects
  }

  /**
   * Fetch contest standings
   */
  async getContestStandings(contestId: number, handles?: string[]) {
    let url = `${this.baseUrl}/contest.standings?contestId=${contestId}&showUnofficial=true`;
    if (handles && handles.length > 0) {
      url += `&handles=${handles.join(';')}`;
    }
    
    const data = await fetchWithRetry<any>(url);
    if (data.status === 'FAILED') {
      throw new ApiError(400, data.comment || 'Failed to fetch CF Standings');
    }
    return data.result;
  }

  /**
   * Fetch user rating history
   */
  async getUserRating(handle: string) {
    const url = `${this.baseUrl}/user.rating?handle=${handle}`;
    const data = await fetchWithRetry<any>(url);
    if (data.status === 'FAILED') {
      throw new ApiError(400, data.comment || 'Failed to fetch CF Rating');
    }
    return data.result;
  }

  /**
   * Helper to generate authenticated API requests (for private group contests)
   */
  private generateAuthParams(methodName: string, params: Record<string, string>) {
    if (!env.CF_API_KEY || !env.CF_API_SECRET) {
      throw new Error('CF API Key and Secret are required for this action');
    }

    const time = Math.floor(Date.now() / 1000);
    params['apiKey'] = env.CF_API_KEY;
    params['time'] = time.toString();

    // Sort keys alphabetically
    const keys = Object.keys(params).sort();
    const sortedParams = keys.map(k => `${k}=${params[k]}`).join('&');

    const rand = Math.random().toString(36).substring(2, 8); // 6 chars
    const toSign = `${rand}/${methodName}?${sortedParams}#${env.CF_API_SECRET}`;

    const apiSig = `${rand}${crypto.createHash('sha512').update(toSign).digest('hex')}`;
    return `${sortedParams}&apiSig=${apiSig}`;
  }
}
