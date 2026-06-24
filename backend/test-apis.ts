import { CodeforcesService } from './src/services/CodeforcesService';
import { LeetCodeService } from './src/services/LeetCodeService';

async function test() {
  try {
    console.log('--- Testing Codeforces ---');
    const cf = new CodeforcesService();
    const cfInfo = await cf.getUserInfo(['tourist']);
    console.log('CF Info:', cfInfo[0]?.handle, '| Rating:', cfInfo[0]?.rating);

    console.log('\n--- Testing LeetCode ---');
    const lc = new LeetCodeService();
    const lcInfo = await lc.getUserProfile('neal_wu'); // using a known LC user
    console.log('LC Info:', lcInfo?.username, '| Real Name:', lcInfo?.profile?.realName);

    console.log('\nAll API tests completed successfully!');
  } catch (error: any) {
    console.error('API Test Failed:', error.message);
  }
}

test();
