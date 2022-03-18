import { getTodaysWordle } from "./date.js";
import {
  tallyScores,
  computeStats,
  WordleDNFData,
  ComputedStats,
} from "./stats.js";
import { tweet } from "./twitter.js";

await tallyScores();

function getCountBlurb(data: WordleDNFData) {
  const { stats, count } = data;
  const { max, dnfp, maxp } = stats;

  let blurb = 
`Wordle ${getTodaysWordle()}
1/6: ${count['1']} ${(max === '1') ? '*' : ''}
2/6: ${count['2']} ${(max === '2') ? '*' : ''}
3/6: ${count['3']} ${(max === '3') ? '*' : ''}
4/6: ${count['4']} ${(max === '4') ? '*' : ''}
5/6: ${count['5']} ${(max === '5') ? '*' : ''}
6/6: ${count['6']} ${(max === '6') ? '*' : ''}
X/6: ${count.X} ${(max === 'X') ? '*' : ''}`
  return blurb
}

function getTimeOfDayBlurb() {
  const hours = new Date(Date.now()).getHours();

  if (hours < 12) {
    return `Morning tally:`;
  } else if (hours < 18) {
    return `Afternoon update:`;
  } else if (hours < 23) {
    return `Evening tally:`;
  }
}

function getBlurb(stats: ComputedStats) {
  const { max, dnfp } = stats;

  const blurb = [
    "Most people cannot finish today's Wordle.",
    "Today's Wordle is very challenging for many people.",
    "Today's Wordle is challenging.",
    "Most people can complete today's Wordle.",
    "Almost everyone is finishing the Wordle today.",
  ];

  let tier: number;

  if (max === "X") {
    tier = 0;
  } else if (dnfp > 20) {
    tier = 1;
  } else if (dnfp > 15) {
    tier = 2;
  } else if (dnfp > 5) {
    tier = 3;
  } else {
    tier = 4;
  }

  return `${getTimeOfDayBlurb()} ${blurb[tier]}`;
}

function formatTweet(data: WordleDNFData) {
  const { stats } = data;

  let statsText = 
`${getBlurb(stats)}

${getCountBlurb(data)}`;

  return statsText;
}

const data = computeStats();
const message = formatTweet(data);
await tweet(message)
