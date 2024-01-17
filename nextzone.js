import { readFileSync } from 'fs';
import {
  getDozen,
  getMinizone,
  getSide,
  getColumn,
  roulette,
  roulettePosition,
  getMinizoneNumbers,
  mean,
  circularMean,
  getAdjacentNumbers,
  getNumberAt,
  circularStandardDeviation,
  transposeObjectMatrix,
} from './roulette.js';
import { fibonacciDozen } from './systems/fibonacci-dozen.js';
import { fibonacciColor } from './systems/fibonacci-evens.js';
import { betColor, betDozen } from './systems/outside-bets.js';
import { holyGrail } from './systems/holy-grail.js';
import {dAlembertDozen} from './systems/d-lambert-dozen.js';

const winningNumber = process.argv[2];
//maintenance after 6746
const dataPoints = [6745];
const minimumHits = 3;
const fileData = readFileSync('./data/platinum.txt', 'utf-8');
const data = fileData
  .split(/\r?\n/)
  .map((d) => {
    return parseInt(d);
  })
  .slice(dataPoints[0], dataPoints[1]);

console.log('data points:', data.length);

const printList = (numberList, label) => {
  for (const number in numberList) {
    if (Object.hasOwnProperty.call(numberList, number)) {
      const element = numberList[number];
      console.log('number:', number);
      const positionList = element.map((n) => roulettePosition(n)).sort((a, b) => a - b);

      const nextPositionTrend = circularMean(positionList);

      const adjacentNumbers = getAdjacentNumbers(nextPositionTrend);
      const trendZone = [adjacentNumbers[0], getNumberAt(nextPositionTrend), adjacentNumbers[1]];
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
const nextPositions = Object.fromEntries(roulette.map((_, i) => [i, []]));
const nextDozenData = Object.fromEntries(roulette.map((n) => [ n == -1 ? '00 ' : n.toString() + ' ', {1:0,2:0,3:0,4:0,5:0,6:0}]));
const spreadedFrequecy = Object.fromEntries(roulette.map((n) => [n, 0]));
const positions = [];
const nextZones = [];
const dozenData = [];
const columnData = [];
const previousNumbers = {};

data.forEach((n, index, arr) => {
  if (n == -2) return;
  const pos = roulettePosition(n);
  positions.push(pos);
  dozenData.push(getDozen(n));
  columnData.push(getColumn(n));
  
  const minizone = getMinizone(pos);
  frequencyData[pos] = (frequencyData[pos] | 0) + 1;

  const next = arr[index + 1];
  if (next == -2) return;
  if (typeof next == 'number') {
    const nextPos = roulettePosition(next);
    const nextMinizone = getMinizone(nextPos);
    const nextDozen = getDozen(next)
    const nextColumn = getColumn(next)
    nextDozenData[ n == -1 ? '00 ' : n.toString() + ' '][nextDozen] += 1
    nextDozenData[ n == -1 ? '00 ' : n.toString() + ' '][3+nextColumn] += 1

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

const spreadData = positions
  .map((p) => {
    return [roulette[p], 
    roulette[p], 
    ...getAdjacentNumbers(p)];
  })
  .flat();
spreadData.forEach((n) => {
  if (spreadedFrequecy[n] >= 0) {
    spreadedFrequecy[n] += 1;
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
  nextZoneBynumber[label] = Object.fromEntries(entries.slice(0, 12));

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


// console.log('Next zones:\n\r');
// console.table(
//   nextZones.map((numbers, i) => ({
//     zone: getMinizoneNumbers(i).join(', '),
//     next: [...numbers.entries()]
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 6)
//       .map(
//         (z) => getMinizoneNumbers(z[0])[1] //.join(' ') + ' W: ' + z[1]
//       )
//       .join(' | '),
//   }))
// );


//console.table(nextNumbers);

const fibonacciD1 = fibonacciDozen(1, false);
const fibonacciC3 = fibonacciDozen(3, true);
let bank = 0;
let maxBank = 0;
let plays = 0;
data.forEach((n, index) => {
  if (n != -2 && maxBank < 5000) {
    plays = index;
    bank += fibonacciD1.nextBet(n);
    bank += fibonacciC3.nextBet(n);
    if (bank > maxBank) {
      maxBank = bank;
    }
  }
});
console.log('\nfibonacci bank:', bank);
console.log('fibonacci max bank:', maxBank);
console.log('fibonacci plays:', plays);
console.log('Dozen 1 wins: ', fibonacciD1.getWins());
console.log('Dozen 1 maxBet: ', fibonacciD1.getMaxBet());
console.log('Column 1 wins: ', fibonacciC3.getWins());
console.log('Column 1 maxBet: ', fibonacciC3.getMaxBet());

console.log('\nD`Lambert Dozen:');
const dAlembertResults = {};
for (let dozen1 = 1; dozen1 <= 6; dozen1++) {

  const results = dAlembertDozen(data, dozen1, 1);
  dAlembertResults['dozen-' + dozen1 ] = results;
}
console.table(dAlembertResults);

const dozensResults = {};
for (let dozen = 1; dozen < 4; dozen++) {
  for (let column = 1; column < 4; column++) {
    let bankroll = 0;
    const dozenBets = fibonacciDozen(dozen, false);
    const columnBets = fibonacciDozen(column, true);
    data.forEach((n) => {
      if (n != -2) {
        bankroll += dozenBets.nextBet(n);
        bankroll += columnBets.nextBet(n);
      }
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
console.log('fibonacci dozens/columns:');
console.table(dozensResults);

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

// const poppyColor = betColor('black', 3);
// const poppyDozen = betDozen(3, 2, true);
// let poppyColorBankroll = 0;
// let poppyDozenBankroll = 0;
// let maxPoppyBankroll = 0;

// data.forEach((n) => {
//   poppyColorBankroll += poppyColor.nextBet(n);
//   poppyDozenBankroll += poppyDozen.nextBet(n);
//   if (poppyColorBankroll + poppyDozenBankroll > maxPoppyBankroll) {
//     maxPoppyBankroll = poppyColorBankroll + poppyDozenBankroll;
//   }
// });
// const poppyResults = {
//   color: {
//     Wins: poppyColor.getWins(),
//     Bankroll: poppyColorBankroll,
//   },
//   dozen: {
//     Wins: poppyDozen.getWins(),
//     Bankroll: poppyDozenBankroll,
//   },
//   total: {
//     Wins: poppyColor.getWins() + poppyDozen.getWins(),
//     Bankroll: poppyColorBankroll + poppyDozenBankroll,
//   },
//   max: {
//     Bankroll: maxPoppyBankroll,
//   },
// };
// console.log('Poppy 3/2 bets:');
// console.table(poppyResults);

// console.log('\nJumps:');
// console.table(
//   nextZoneBynumber,
//   roulette.map((n) => (n == -1 ? '00 ' : n.toString() + ' '))
// );

// console.log('transposed:');
// console.table(
//   transposeObjectMatrix(nextZoneBynumber),
//   roulette.map((n) => (n == -1 ? '00 ' : n.toString() + ' '))
// );

//console.table(jumps);

// console.log('Holy Grail:');
// const holyGrailResults = {};
// for (let dozen1 = 1; dozen1 <= 6; dozen1++) {
//   for (let dozen2 = 1; dozen2 <= 6; dozen2++) {
//     if (dozen1 != dozen2) {
//       const results = holyGrail(data, dozen1, dozen2, 1);
//       if (results.bankroll > 0) {
//         holyGrailResults['dozen-' + dozen1 + '_dozen-' + dozen2] = results;
//       }
//     }
//   }
// }
// console.table(holyGrailResults);

console.log('spreaded frequencies:')
console.table(Object.entries(spreadedFrequecy).sort((a, b) => b[1] - a[1]));


printList(nextNumbers, 'next: ');
const rouletteMean = circularMean(positions);
console.log('Roulete mean number:', roulette[rouletteMean]);

const spacings = Object.fromEntries(roulette.map((n) => [n, []]));
const maxSpacings = Object.fromEntries(roulette.map((n) => [n, 0]));

let lastIndexes = Object.fromEntries(roulette.map((n) => [n, 0]));
let sessionStart = 0;
data.forEach((n, i) => {
  if (n == -2) {
    sessionStart = i;
    lastIndexes = Object.fromEntries(roulette.map((n) => [n, i]));
  } else {
    if (lastIndexes[n] > sessionStart + 1) {
      const gap = i - lastIndexes[n];

      if (gap > maxSpacings[n]) {
        maxSpacings[n] = gap;
      }

      spacings[n].push(gap);
    }
    lastIndexes[n] = i;
  }
});

const averageSpacings = Object.fromEntries(roulette.map((n) => [n, 0]));

for (const number in spacings) {
  if (Object.hasOwnProperty.call(spacings, number)) {
    const gaps = spacings[number];
    averageSpacings[number] = Math.round(mean(gaps));
  }
}

const spagcingData = Object.fromEntries(
  Object.entries(averageSpacings)
    .sort((a, b) => a[1] - b[1])
    .map((e) => [' ' + e[0] + ' ', { average: e[1], max: maxSpacings[e[0]], wins: spreadedFrequecy[e[0]] }])
);
console.log('spagcingData');
console.table(spagcingData);

console.log('winning number jumps:');
console.table(
  { [winningNumber]: nextZoneBynumber[winningNumber + ' '] }
  //roulette.map((n) => (n == -1 ? '00 ' : n.toString() + ' '))
);

console.log('next dozen occurrences:')
console.table({[winningNumber]: nextDozenData[winningNumber+' ']},['1','2','3','4','5','6']);

console.log('Average jump landing:');
console.table(
  { [winningNumber]: means[winningNumber + ' '] }
  //roulette.map((n) => (n == -1 ? '00 ' : n.toString() + ' '))
);

console.log('Standard Deviation:', stdev[winningNumber + ' ']);
