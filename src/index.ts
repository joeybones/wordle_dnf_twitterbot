import { formatTweet } from "./message.js";
import {
  tallyScores,
  computeStats,
} from "./stats.js";
import { tweet } from "./twitter.js";

async function main() {
  const count = await tallyScores();
  const data = computeStats(count);
  const message = formatTweet(data);

  //console.log(message);
  await tweet(message)
}

main();