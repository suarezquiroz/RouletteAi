const american = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, -1, 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14,
  2,
];
const european = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

export const roulette = american;

export const getDozen = (n) => {
  return Math.ceil(n / 12);
};
export const getColumn = (n) => {
  return n < 1 ? 0 : ((n + 2) % 3) + 1;
};

export const roulettePosition = (n) => {
  return roulette.indexOf(n);
};

const zeroNeighbors = [16, 4, 23, 35, 14, 2, 0, 28, 9, 26, 30, 11, 7];
const doubleZeroNeighbors = [15, 3, 24, 36, 13, 1, -1, 27, 10, 25, 29, 12, 8];
const orphans1 = [20, 32, 17, 5, 22, 34];
const orphans2 = [19, 31, 18, 6, 21, 33];

export const getColor = (n) => {
  const pos = roulette.indexOf(n);
  let color = 'red';
  if (pos === 0 || pos === 19) {
    color = 'zero';
  } else if (pos % 2) {
    color = 'black';
  }
  return color;
};

export const minizoneSize = 3;
export const getMinizone = (position) => Math.floor(position / minizoneSize);
export const getMinizoneNumbers = (zone) => roulette.slice(minizoneSize * zone, minizoneSize * (zone + 1));
export const getSide = (p) => Math.floor(p / 9.501);

export const getAdjacentNumbers = (pos) => {
  const l = roulette.length;
  return [roulette[(((pos - 1) % l) + l) % l], roulette[(((pos + 1) % l) + l) % l]];
};
export const getNumberAt = (pos) => {
  const l = roulette.length;
  return roulette[((pos % l) + l) % l];
};

// Circular means are useful if you are dealing with data that are inherently "circular" such as the day or month of the year, or direction.
// For example, imagine your data consists of the month in which an event occurs, and you want to report the average month. If you had 3 observations in December, and 3 in February, the average should be in January (1) whereas the more conventional arithmetic mean would tell you the answer was 7. The trick to dealing with this issue is to convert the data into radians, and do a bunch of trigonometry.

const mean = (positions = []) => {
  return positions.reduce((a, b) => a + b, 0) / positions.length;
};

// returns mean position
export const circularMean = (positions) => {
  const radians = numbersToRadians(positions);
  const meanCos = mean(radians.map((r) => Math.cos(r)));
  const meanSin = mean(radians.map((r) => Math.sin(r)));
  const radiansMean = Math.atan2(meanSin, meanCos);
  const degrees = radiansMean * (180 / Math.PI);
  const result = degrees >= 0 ? degrees : degrees + 360;
  return Math.round(result / (360 / roulette.length));
};

const numbersToRadians = (positions) => {
  return positions.map((p) => p * (360 / roulette.length) * (Math.PI / 180));
};

// Javascript program to calculate the
// standard deviation of an array
export function circularStandardDeviation(positions) {
  const radians = numbersToRadians(positions);

  const meanCos = Math.pow(mean(radians.map((r) => Math.cos(r))), 2);
  const meanSin = Math.pow(mean(radians.map((r) => Math.sin(r))), 2);
  //const circularSD = Math.sqrt(-2 * Math.log(meanCos + meanSin))
  // Returning the standard deviation
  return Math.sqrt(-2 * Math.log(meanCos + meanSin));
}

//Reference: http://en.wikipedia.org/wiki/Mean_of_circular_quantities

export default {
  roulettePosition,
  getDozen,
  getColumn,
  roulette,
  getMinizone,
  getSide,
  getAdjacentNumbers,
  circularMean,
  getNumberAt,
  circularStandardDeviation,
};
