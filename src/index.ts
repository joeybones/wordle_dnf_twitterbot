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

function convertToWord(guess: string) {
  switch (guess) {
    case '1':
      return 'first';
    case '2':
      return 'second';
    case '3':
      return 'third';
    case '4':
      return 'fourth';
    case '5':
      return 'fifth';
    case '6':
      return 'sixth';
  }
}

function determineEasyBlurb(max: string, maxp: number) {
  const blurb = {
    '2': `${maxp}% of players are getting it on their second try — wow!`,
    '3': `${maxp}% are solving it on their third try.`,
    '4': `The majority of players, around ${maxp}%, are solving it on their fourth try.`,
    '5': `${maxp}% of players are solving it on their fifth try.`,
    '6': `${maxp}% of players are solving it in their sixth try.`,
    'X': `The majority are not finishing it today.`
  }

  return blurb[max];
}

function getBlurb(stats: ComputedStats) {
  const { max, dnfp, maxp } = stats;

  const blurb = [
    `${dnfp}% of players cannot finish today's Wordle. It's a real hard one! ${determineEasyBlurb(max, maxp)}`,
    `Today's Wordle is very challenging for many people. Its fail rate is around ${dnfp}%. ${determineEasyBlurb(max, maxp)}`,
    `Today's Wordle is challenging. Around ${dnfp}% of players cannot guess the word correctly. ${determineEasyBlurb(max, maxp)}`,
    `Most people can complete today's Wordle, but ${dnfp}% cannot solve it in six tries. ${determineEasyBlurb(max, maxp)}`,
    `Almost everyone is finishing the Wordle today, but ${dnfp}% of players couldn't get it. ${determineEasyBlurb(max, maxp)}`,
    `A small percentage, roughly ${dnfp}% of players, are unable to solve today's Wordle. ${determineEasyBlurb(max, maxp)}`,
    `Less than 1% of players are not able to solve today's Wordle. ${determineEasyBlurb(max, maxp)}`,
    `A mere ${dnfp}% of players can't solve today's Wordle in six tries. ${determineEasyBlurb(max, maxp)}`
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
  } else if (dnfp > 2) {
    tier = 4;
  } else if (dnfp > 1) {
    tier = 5;
  } else if (dnfp > 0.5) {
    tier = 6;
  } else {
    tier = 7;
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
