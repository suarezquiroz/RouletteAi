export const getDozen = (n) => {
  return Math.ceil(n / 12);
};
export const getColumn = (n) => {
  return n < 1 ? 0 : ((n + 2) % 3) + 1;
};

export const roulettePosition = (n) => {
  return roulette.indexOf(n);
};

export const roulette = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, -1, 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14,
  2,
];

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

export const getMinizone = (p) => Math.floor(p / 4);
export const getSide = (p) => Math.floor(p / 9.501);

export default { roulettePosition, getDozen, getColumn, roulette, getMinizone, getSide };
