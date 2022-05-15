const LAUNCH_DATE = new Date(2021, 5, 19, 0, 0, 0, 0);
const ONE_DAY_EXACTLY_MS = 1000 * 60 * 60 * 24;

export function getWordle(today: Date) {
  const sDateObject = new Date(LAUNCH_DATE);
  const eDateObject = new Date(today);

  // setHours returns MS since epoch
  const msDiff = eDateObject.setHours(0, 0, 0, 0) - sDateObject.setHours(0, 0, 0, 0)
  const dayDiff = Math.round(msDiff / ONE_DAY_EXACTLY_MS)

  return dayDiff
}

export function getTodaysDate() {
  const today = new Date(Date.now());
  return new Date(`${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()} 00:00:00`);
}

export function getTodaysWordle() {
  console.log(`${getTodaysDate()} - ${getWordle(getTodaysDate())}`);
  return getWordle(getTodaysDate());
}