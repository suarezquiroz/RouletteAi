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

export const getMinizone = (p) => Math.floor(p / 3);
export const getSide = (p) => Math.floor(p / 9.501);

export default { roulettePosition, getDozen, getColumn, roulette, getMinizone, getSide };
