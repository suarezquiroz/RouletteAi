import { getColor } from '../roulette.js';

const defaultRange = [1, 12];
const defaultColumn = 1;

export const betColor = (color, bet) => {
  const getResult = (n) => {
    if (color === getColor(n)) {
      return true;
    } else {
      return false;
    }
  };

  let wins = 0;

  const nextBet = (n) => {
    let win = 0;
    const winner = getResult(n);
    if (winner) {
      wins++;
      win = bet;
    } else {
      win = -1 * bet;
    }
    return win;
  };

  const getWins = () => wins;
  return { nextBet, getWins };
};

export const betDozen = (dozen, bet, isColumn) => {
  let range = defaultRange;
  let column = defaultColumn;

  if (isColumn) {
    column = dozen;
  } else {
    if (dozen == 2) {
      range = [13, 24];
    } else if (dozen == 3) {
      range = [25, 36];
    }
  }
  const getResult = (n, isColumn) => {
    if (isColumn) {
      return getColumn(n) === column;
    } else {
      if (range[0] <= n && range[1] >= n) {
        return true;
      } else {
        return false;
      }
    }
  };
  let wins = 0;

  const nextBet = (n) => {
    let win = 0;
    const winner = getResult(n, isColumn);
    if (winner) {
      wins++;
      win = bet * 2;
    } else {
      win = -1 * bet;
    }
    return win;
  };

  const getWins = () => wins;
  return { nextBet, getWins };
};
export default { betColor, betDozen };
