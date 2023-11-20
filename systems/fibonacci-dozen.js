import { getColumn } from '../roulette.js';

const defaultRange = [1, 12];
const defaultColumn = 1;

export const fibonacciDozen = (dozen = 1, isColumn) => {
  //console.log(isColumn ? 'column: ' : 'Dozen: ', dozen);
  const bets = [0, 1];
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
  let maxBet = 1;
  let wins = 0;
  const nextBet = (n) => {
    //console.log(isColumn ? 'column: ' : 'Dozen: ', dozen, ' bet:', bets[1]);
    let win = 0;
    const winner = getResult(n, isColumn);
    if (winner) {
      wins++;
      win = bets[1] * 2;
      bets[0] = 0;
      bets[1] = 1;
    } else {
      win = -1 * bets[1];
      if (bets[1] >= 21) {
        bets[0] = 0;
        bets[1] = 1;
      } else {
        let next = bets[0] + bets[1];
        bets[0] = bets[1];
        bets[1] = next;
        if (next > maxBet) {
          maxBet = next;
        }
      }
    }
    //console.log('result:', n, 'win:', win, '\n');
    return win;
  };

  const getMaxBet = () => maxBet;
  const getWins = () => wins;
  return { nextBet, getMaxBet, getWins };
};
export default { fibonacciDozen };
