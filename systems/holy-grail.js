import { betDozen } from './outside-bets.js';

export const holyGrail = (data, dozen1 = 1, dozen2 = 3, baseUnit = 1) => {
  let unit = baseUnit;
  const isColumn1 = dozen1 > 3;
  const isColumn2 = dozen2 > 3;

  const dozen1Bet = betDozen(dozen1, unit, isColumn1);
  const dozen2Bet = betDozen(dozen2, unit, isColumn2);

  let bankroll = 0;
  let maxBankroll = 0;
  let plays = 0;

  let maxBet = 1;
  let lastResult = 0;
  let losses = 0;

  const targetScale = 10;
  let target = targetScale;

  data.forEach((n, index) => {
    if (n == -2) return;
    if (maxBankroll < 100000) {
      plays = index;
      const result1 = dozen1Bet.nextBet(n, unit);
      const result2 = dozen2Bet.nextBet(n, unit);

      if (result1 < 0 && result2 < 0) {
        losses++;
        unit += baseUnit;

        if (unit > maxBet) {
          maxBet = unit;
        }
      } else if (bankroll >= target) {
        //unit = unit > baseUnit ? unit - baseUnit : baseUnit;
        if (bankroll >= target) {
          target += targetScale;
          unit = baseUnit;
        }
      }

      bankroll += result1 + result2;
      lastResult = result1 + result2;

      if (bankroll > maxBankroll) {
        maxBankroll = bankroll;
      }
    }
  });

  const results = {
    bankroll,
    maxBankroll,
    maxBet: maxBet * 2,
    plays,
    losses,
    target,
    dozen1BetWins: dozen1Bet.getWins(),
    dozen2BetWins: dozen2Bet.getWins(),
  };

  return results;
};

export default { holyGrail };
