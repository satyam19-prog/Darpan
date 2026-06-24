import * as cheerio from 'cheerio';
import { fetchWithRetry } from '../utils/apiUtils';

export class CodeChefService {
  /**
   * Scrape CodeChef user profile for rating.
   * Note: CodeChef official API is restricted, so scraping is the standard approach.
   */
  async getUserRating(username: string): Promise<number | null> {
    try {
      const url = `https://www.codechef.com/users/${username}`;
      const html = await fetchWithRetry<string>(url);
      const $ = cheerio.load(html);
      
      const ratingStr = $('.rating-number').text();
      const rating = parseInt(ratingStr, 10);
      
      if (isNaN(rating)) return null;
      return rating;
    } catch (e) {
      return null;
    }
  }
}
