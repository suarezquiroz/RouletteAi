import { readFileSync } from 'fs';
import {
  getDozen,
  getMinizone,
  getSide,
  getColumn,
  roulette,
  roulettePosition,
  getMinizoneNumbers,
  circularMean,
  getAdjacentNumbers,
  getNumberAt,
  circularStandardDeviation,
} from './roulette.js';
import { fibonacciDozen } from './systems/fibonacci-dozen.js';
import { fibonacciColor } from './systems/fibonacci-evens.js';
import { betColor, betDozen } from './systems/outside-bets.js';

const winningNumber = process.argv[2];
const dataPoints = 0;
const minimumHits = 3;
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

      const adjacentNumbers = getAdjacentNumbers(nextPositionTrend);
      const trendZone = [adjacentNumbers[0], nextPositionTrend, adjacentNumbers[1]].map((p) => getNumberAt(p));
      console.log('next zone trend:', trendZone.join(', '));
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
const nextPositions = {};
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
      nextPositions[pos].push(nextPos);
    } else {
      nextNumbers[n] = [next];
      nextPositions[pos] = [nextPos];
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

const nextZoneBynumber = {};
const jumps = {};
const means = {};
const stdev = {};
const jumpsMap = new Map();
const l = roulette.length;
roulette.forEach((number) => {
  const pos = roulettePosition(+number);
  const adjacentNumbers = getAdjacentNumbers(pos);

  const adjacentPositions = [((pos - 1) % l) + l, ((pos + 1) % l) + l];

  const spreadHits = [...nextPositions[pos], ...nextPositions[(((pos - 1) % l) + l) % l], ...nextPositions[(((pos + 1) % l) + l) % l]];

  const nextHits = spreadHits.reduce((list, p) => {
    const n = getNumberAt(p);
    //const n = p;
    const label = '' + (n == -1 ? '00 ' : n.toString() + ' ');
    if (list[label]) {
      list[label] = list[label] + 1;
    } else {
      list[label] = 1;
    }
    return list;
  }, {});

  const entries = Object.entries(nextHits)
    .sort((a, b) => b[1] - a[1])
    .filter((pair) => pair[1] >= minimumHits);
  const label = '' + (number == -1 ? '00 ' : number.toString() + ' ');
  nextZoneBynumber[label] = Object.fromEntries(entries);

  means[label] = getNumberAt(circularMean(spreadHits));
  stdev[label] = circularStandardDeviation(spreadHits);

  entries.forEach((hit) => {
    const jumpName = (number == -1 ? '00' : number) + '-' + (hit[0] == -1 ? '00 ' : hit[0]);

    jumps[jumpName] = hit[1];
  });
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
console.log('Roulete mean number:', roulette[mean]);

//console.table(nextNumbers);

const fibonacciD1 = fibonacciDozen(2, true);
const fibonacciC3 = fibonacciDozen(3, true);
let bank = 0;
let maxBank = 0;
let plays = 0;
data.forEach((n, index) => {
  if (maxBank < 500) {
    plays = index;
    bank += fibonacciD1.nextBet(n);
    bank += fibonacciC3.nextBet(n);
    if (bank > maxBank) {
      maxBank = bank;
    }
  }
});
console.log('fibonacci bank:', bank);
console.log('fibonacci max bank:', maxBank);
console.log('fibonacci plays:', plays);
console.log('Column 2 wins: ', fibonacciD1.getWins());
console.log('Column 2 maxBet: ', fibonacciD1.getMaxBet());
console.log('Column 3 wins: ', fibonacciC3.getWins());
console.log('Column 3 maxBet: ', fibonacciC3.getMaxBet());

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

console.table(
  nextZoneBynumber,
  roulette.map((n) => (n == -1 ? '00 ' : n.toString() + ' '))
);

//console.table(jumps);

console.log('number jumps:');
console.table(
  { [winningNumber]: nextZoneBynumber[winningNumber + ' '] }
  //roulette.map((n) => (n == -1 ? '00 ' : n.toString() + ' '))
);

console.log('Average jump landing:');
console.table(
  { [winningNumber]: means[winningNumber + ' '] }
  //roulette.map((n) => (n == -1 ? '00 ' : n.toString() + ' '))
);

console.log('Standard Deviation:', stdev[winningNumber + ' ']);
