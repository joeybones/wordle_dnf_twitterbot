import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';
import { getTodaysWordle, getTodaysDate } from './date.js';

type TweetCountResult = {
  start: string;
  end: string;
  tweet_count: number;
}

const writeClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACESSS_SECRET,
});

const readClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

function reduceCounts(data: TweetCountResult[]) {
  let count = 0;

  data.forEach((result) => {
    count += result.tweet_count;
  });

  return count;
}

export async function getTweetCount(score) {
  let count = 0;

  try {
    const response = await readClient.v2.tweetCountRecent(`Wordle ${getTodaysWordle()} ${score}/6`, { start_time: getTodaysDate().toISOString()});
    count = reduceCounts(response.data);
  } catch (e) {
    console.log(e)
  } finally {
    return count;
  }
}

export async function tweet(message) {
  try {
    writeClient.v2.tweet(message);
  } catch (e) {
    console.log(e);
  }
}
