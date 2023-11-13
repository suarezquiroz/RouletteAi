import { readFileSync } from 'fs';
import { getDozen, getMinizone, getSide, getColumn, roulette, roulettePosition, getMinizoneNumbers, circularMean } from './roulette.js';
import { fibonacciDozen } from './systems/fibonacci-dozen.js';
import { fibonacciColor } from './systems/fibonacci-evens.js';
import { betColor, betDozen } from './systems/outside-bets.js';

const dataPoints = 0;
const fileData = readFileSync('./data/platinum.txt', 'utf-8');
const data = fileData
  .split(/\r?\n/)
  .map((d) => {
    return parseInt(d);
  })
  .slice(-dataPoints);

console.log('data points:', data.length);

const printList = (numberList, label) => {
  for (const number in numberList) {
    if (Object.hasOwnProperty.call(numberList, number)) {
      const element = numberList[number];
      console.log('number:', number);
      const positionList = element.map((n) => roulettePosition(n)).sort((a, b) => a - b);

      const nextPositionTrend = circularMean(positionList);
      console.log('next zone trend:', getMinizoneNumbers(getMinizone(nextPositionTrend)).join(', '));
      const list = positionList.map((pos) => roulette[pos]);

      const filteredList = positionList.filter((item, index, array) => array.indexOf(item) === index);
      //.filter((item) => hotNumbers.some((hot) => hot[0] === item));
      //console.log(label, positionList.join());
      // console.log(
      //   'zones:',
      //   filteredList
      //     .map((n) => getMinizone(n))
      //     .filter((item, index, array) => array.indexOf(item) === index)
      //     .join()
      // );
      // console.log(
      //   'cuadrant:',
      //   list
      //     .map((n) => getSide(roulettePosition(n)))
      //     .reduce(
      //       (result, side) => {
      //         result[side] = result[side] + 1;
      //         return result;
      //       },
      //       { 0: 0, 1: 0, 2: 0, 3: 0 }
      //     )
      // );
      // console.log('hits:', list.length, 'unique:', filteredList.length, '\n');
    }
  }
};

const frequencyData = [];
const nextNumbers = {};
const positions = [];
const nextZones = [];
const previousNumbers = {};

data.forEach((n, index, arr) => {
  if (n == -2) return;
  const pos = roulettePosition(n);
  positions.push(pos);
  const minizone = getMinizone(pos);
  frequencyData[pos] = (frequencyData[pos] | 0) + 1;

  const next = arr[index + 1];
  if (next == -2) return;
  if (typeof next == 'number') {
    const nextPos = roulettePosition(next);
    const nextMinizone = getMinizone(nextPos);
    if (nextNumbers[n]) {
      nextNumbers[n].push(next);
    } else {
      nextNumbers[n] = [next];
    }
    if (nextZones[minizone]) {
      nextZones[minizone].set(nextMinizone, (nextZones[minizone].get(nextMinizone) ?? 0) + 1);
    } else {
      nextZones[minizone] = new Map([[nextMinizone, 1]]);
    }
  }

  const prev = arr[index - 1];
  if (prev && next > -2) {
    if (previousNumbers[n]) {
      previousNumbers[n].push(prev);
    } else {
      previousNumbers[n] = [prev];
    }
  }
});

const temperatures = frequencyData.map((hits, i) => [roulette[i], hits, i]).sort((a, b) => b[1] - a[1]);
const hotNumbers = temperatures; //.slice(0, 18);

const printNumbers = hotNumbers.map((h) => [
  ('\nnumber: ' + h[0]) | 'N/A',
  '\nfrom: ' + (previousNumbers[h[0]] ? previousNumbers[h[0]].filter((item, index, array) => array.indexOf(item) === index) : 'N/A'),
]);

console.log('Hot ones:\n\r');
console.table(
  hotNumbers.map((h) => ({ number: h[0], hits: h[1], minizone: getMinizone(h[2]), dozen: getDozen(h[0]), column: getColumn(h[0]) }))
  //.sort((a, b) => a.minizone - b.minizone)
);

printList(nextNumbers, 'next: ');

console.log('Next zones:\n\r');
console.table(
  nextZones.map((numbers, i) => ({
    zone: getMinizoneNumbers(i).join(', '),
    next: [...numbers.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(
        (z) => getMinizoneNumbers(z[0])[1] //.join(' ') + ' W: ' + z[1]
      )
      .join(' | '),
  }))
);

const mean = circularMean(positions);
console.log('🚀 ~ file: nextzone.js:122 ~ mean position:', mean);
console.log('🚀 ~ file: nextzone.js:122 ~ mean number:', roulette[mean]);

//console.table(nextNumbers);

const fibonacciD1 = fibonacciDozen(1, false);
const fibonacciC3 = fibonacciDozen(3, true);
let bank = 0;
data.forEach((n) => {
  bank += fibonacciD1.nextBet(n);
  bank += fibonacciC3.nextBet(n);
});
console.log('Dozen wins: ', fibonacciD1.getWins());
console.log('Dozen maxBet: ', fibonacciD1.getMaxBet());
console.log('Column wins: ', fibonacciC3.getWins());
console.log('Column maxBet: ', fibonacciC3.getMaxBet());

const dozensResults = {};
for (let dozen = 1; dozen < 4; dozen++) {
  for (let column = 1; column < 4; column++) {
    let bankroll = 0;
    const dozenBets = fibonacciDozen(dozen, false);
    const columnBets = fibonacciDozen(column, false);
    data.forEach((n) => {
      bankroll += dozenBets.nextBet(n);
      bankroll += columnBets.nextBet(n);
    });
    dozensResults['dozen' + dozen + 'column' + column] = {
      dozenWins: dozenBets.getWins(),
      dozenMaxBet: dozenBets.getMaxBet(),
      columnWins: columnBets.getWins(),
      columnMaxBet: columnBets.getMaxBet(),
      bankroll,
    };
  }
}
// console.log('fibonacci dozens/columns:');
// console.table(dozensResults);

const fibonacciBlack = fibonacciColor('black');
const fibonacciRed = fibonacciColor('red');
let blackBankroll = 0,
  redBankroll = 0;

data.forEach((n) => {
  blackBankroll += fibonacciBlack.nextBet(n);
  redBankroll += fibonacciRed.nextBet(n);
});
const colorsResults = {
  black: {
    Wins: fibonacciBlack.getWins(),
    MaxBet: fibonacciBlack.getMaxBet(),
    Bankroll: blackBankroll,
  },
  red: {
    Wins: fibonacciRed.getWins(),
    MaxBet: fibonacciRed.getMaxBet(),
    Bankroll: redBankroll,
  },
};
// console.log('Fibonacci color bets:');
// console.table(colorsResults);

const poppyColor = betColor('black', 3);
const poppyDozen = betDozen(3, 2, false);
let poppyColorBankroll = 0;
let poppyDozenBankroll = 0;

data.forEach((n) => {
  poppyColorBankroll += poppyColor.nextBet(n);
  poppyDozenBankroll += poppyDozen.nextBet(n);
});
const poppyResults = {
  color: {
    Wins: poppyColor.getWins(),
    Bankroll: poppyColorBankroll,
  },
  dozen: {
    Wins: poppyDozen.getWins(),
    Bankroll: poppyDozenBankroll,
  },
  total: {
    Wins: poppyColor.getWins() + poppyDozen.getWins(),
    Bankroll: poppyColorBankroll + poppyDozenBankroll,
  },
};
// console.log('Poppy 3/2 bets:');
// console.table(poppyResults);
