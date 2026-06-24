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

  async getUserProfile(username: string): Promise<any> {
    try {
      const url = `https://www.codechef.com/users/${username}`;
      const html = await fetchWithRetry<string>(url);
      const $ = cheerio.load(html);
      
      const ratingStr = $('.rating-number').text();
      const rating = parseInt(ratingStr, 10) || 0;

      const highestRatingStr = $('.rating-header .rating-data-section').find('small').text();
      const match = highestRatingStr.match(/Highest Rating (\d+)/);
      const highestRating = match ? parseInt(match[1], 10) : rating;

      const stars = $('.rating-star').text() || '1★';
      
      return {
        rating,
        highestRating,
        stars
      };
    } catch (e) {
      return null;
    }
  }
}
