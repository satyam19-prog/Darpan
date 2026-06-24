import axios from 'axios';
import { fetchWithRetry } from '../utils/apiUtils';

export class LeetCodeService {
  private endpoint = 'https://leetcode.com/graphql';

  /**
   * Fetch user public profile
   */
  async getUserProfile(username: string) {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            userAvatar
            reputation
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const data = await this.executeGraphql(query, { username });
    return data.data?.matchedUser;
  }

  /**
   * Fetch user contest ranking
   */
  async getUserContestRanking(username: string) {
    const query = `
      query getUserContestRanking($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
        }
      }
    `;
    
    const data = await this.executeGraphql(query, { username });
    return data.data?.userContestRanking;
  }

  private async executeGraphql(query: string, variables: any) {
    const response = await fetchWithRetry<any>(this.endpoint, {
      method: 'POST',
      data: {
        query,
        variables
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response;
  }
}
