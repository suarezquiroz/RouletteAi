import { getColor } from '../roulette.js';

export const fibonacciColor = (color) => {
  let bets = [0, 1];

  const getResult = (n) => {
    if (color === getColor(n)) {
      return true;
    } else {
      return false;
    }
  };

  let maxBet = 1;
  let wins = 0;

  const nextBet = (n) => {
    let win = 0;
    const winner = getResult(n);
    if (winner) {
      wins++;
      win = bets.pop();
      bets.pop();
      if (bets.length < 2) {
        bets[0] = 0;
        bets[1] = 1;
      }
    } else {
      win = -1 * bets[bets.length - 1];

      if (bets.length - 1 >= 13) {
        bets = [0, 1];
      } else {
        let next = bets[bets.length - 1] + bets[bets.length - 2];

        bets.push(next);

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
export default { fibonacciColor };
