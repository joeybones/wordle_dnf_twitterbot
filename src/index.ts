import { tallyScores, computeStats } from './stats.js';
import { tweet } from './twitter.js';


await tallyScores();

function formatTweet(data) {
  const { stats } = data;

  const blurb = [
    "Most people cannot finish today's Wordle.",
    "Today's Wordle is very challenging for many people.",
    "Today's Wordle is challenging.",
    "Most people can complete today's Wordle.",
    "Almost everyone is finishing the Wordle today."
  ]

  let tier;

  if (stats.max === 'X') {
    tier = 0;

  } else if (stats.dnfp > 20) {
    tier = 1;
  } else if (stats.dnfp > 15) {
    tier = 2;
  } else if (stats.dnfp > 5) {
    tier = 3;
  } else { 
    tier = 4;
  }

  let statsText = "Most common score: " + data.stats.max + " (" + data.stats.maxp + "%)\n" + "Did not finish: " + data.stats.dnfp + "%";

  return blurb[tier] + "\n\n" + statsText
}

const data = computeStats();
const message = formatTweet(data);

await tweet(message);

console.log(message);
