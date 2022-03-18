import { getTweetCount } from './twitter.js';

const count = {
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
  '6': 0,
  'X': 0,
};

const stats = {
  total: 0,
  max: '0',
  dnfp: 0,
  maxp: 0,
};

function computeTotal() {
  stats.total = Object.values(count).reduce((acc, num) => {
    return acc += num;
  }, 0);
}

function computeMax() {
  let maxTotal = 0;
  Object.keys(count).forEach((num) => {
    if (count[num] > maxTotal) {
      maxTotal = count[num];
      stats.max = num;
    }
  });
}

function computePercentages() {
  let pct = ((count.X / stats.total) * 100).toString();
  stats.dnfp = parseFloat(pct.slice(0, 4));

  pct = ((count[stats.max] / stats.total) * 100).toString();
  stats.maxp = parseFloat(pct.slice(0, 4));
}

export async function tallyScores() {
  const scores = Object.keys(count);

  for (let value of scores) {
    count[value] = await getTweetCount(value);
  }
}

export function computeStats() {
  computeTotal();
  computeMax();
  computePercentages();

  return { count, stats };
}

