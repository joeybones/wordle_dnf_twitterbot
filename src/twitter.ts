import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';
import { getTodaysWordle, getTodaysDate } from './date.js';

type TweetCountResult = {
  start: string;
  end: string;
  tweet_count: number;
}

const twitterClient = new TwitterApi({
  accessToken: process.env.TWITTER_API_BEARER_TOKEN
});

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
    const response = await twitterClient.v2.tweetCountRecent(`Wordle ${getTodaysWordle()} ${score}/6`, { start_time: getTodaysDate().toISOString()});
    count = reduceCounts(response.data);
  } catch (e) {
    console.log(e)
  } finally {
    return count;
  }
}

export async function tweet(message) {
  twitterClient.v2.tweet(message);
}
