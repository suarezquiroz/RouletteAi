import { getColor, getColumn } from '../roulette.js';

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

const getDozenRange = (dozen) => {
  let range = defaultRange;
  let column = defaultColumn;

  if (dozen1 > 3) {
    column = dozen;
  } else {
    if (dozen1 == 2) {
      range = [13, 24];
    } else if (dozen1 == 3) {
      range = [25, 36];
    }
  }
  return range;
};

export const betDozen = (dozen, baseUnit = 1, isColumn) => {
  let range = defaultRange;
  let column = defaultColumn;

  if (isColumn || dozen > 3) {
    column = ((dozen + 2) % 3) + 1;
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

  const nextBet = (n, units = 1) => {
    let win = 0;
    const winner = getResult(n, isColumn);
    if (winner) {
      wins++;
      win = baseUnit * units * 2;
    } else {
      win = -1 * baseUnit * units;
    }
    return win;
  };

  const getWins = () => wins;
  return { nextBet, getWins };
};

export const betHolyGrail = (dozen1, dozen2, bet) => {
  let range = defaultRange;
  let column = defaultColumn;

  if (dozen1 > 3) {
    column = dozen1;
  } else {
    if (dozen1 == 2) {
      range = [13, 24];
    } else if (dozen1 == 3) {
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
