import { getTodaysWordle } from "./date.js";
import { ComputedStats, WordleDNFData } from "./stats.js";

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

function determineEasyBlurb(max: string, maxp: number) {
  const blurb = {
    '2': `${maxp}% of players are getting it on their second try — wow!`,
    '3': `${maxp}% are solving it on their third try.`,
    '4': `${maxp}% of players are solving it on their fourth try.`,
    '5': `${maxp}% of players are solving it on their fifth try.`,
    '6': `${maxp}% of players are just barely making it in six.`,
    'X': `Brace yourselves. It's a real hard one!`
  }

  return blurb[max];
}

function getBlurb(stats: ComputedStats) {
  const { max, dnfp, maxp } = stats;

  const blurb = [
    `${dnfp}% of players cannot finish today's Wordle. ${determineEasyBlurb(max, maxp)}`,
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

export function formatTweet(data: WordleDNFData) {
  const { stats } = data;

  let statsText = 
`${getBlurb(stats)}

${getCountBlurb(data)}`;

  return statsText;
}
