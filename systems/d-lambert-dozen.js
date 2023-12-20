import { betDozen } from './outside-bets.js';

export const dAlembertDozen = (data, dozen1 = 1, baseUnit = 1) => {
  let unit = baseUnit;
  const isColumn1 = dozen1 > 3;

  const dozen1Bet = betDozen(dozen1, unit, isColumn1);

  let bankroll = 0;
  let minBankroll = 0;
  let maxBankroll = 0;
  let plays = 0;

  let maxBet = 1;
  let lastResult = 0;
  let losses = 0;

  const targetScale = 20;
  let target = targetScale;

  data.forEach((n, index) => {
    if (n == -2) return;
    if (maxBankroll < 200000) {
      plays = index;
      const result1 = dozen1Bet.nextBet(n, unit);

      if (result1 < 0) {
        losses++;
        unit += baseUnit;

        if (unit > maxBet) {
          maxBet = unit;
        }
      } else {
        unit = unit > baseUnit ? unit - baseUnit : baseUnit;
        // if (bankroll >= target) {
        //   target += targetScale;
        //   unit = baseUnit;
        // }
      }

      bankroll += result1 ;
      lastResult = result1 ;

      if (bankroll > maxBankroll) {
        maxBankroll = bankroll;
      }
      if (bankroll < minBankroll) {
        minBankroll = bankroll;
      }
    }
  });

  const results = {
    bankroll,
    maxBankroll,
    minBankroll,
    maxBet: maxBet * 2,
    plays,
    losses,
    target,
    dozenBetWins: dozen1Bet.getWins(),
    
  };

  return results;
};

export default { dAlembertDozen };
