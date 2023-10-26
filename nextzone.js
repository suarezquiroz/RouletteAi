import { readFileSync } from 'fs';
import { getDozen, getMinizone, getSide, getColumn, roulette, roulettePosition } from './roulette.js';
import { fibonacciDozen } from './systems/fibonacci-dozen.js';

const dataPoints = 700;
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

      const list = positionList.map((pos) => roulette[pos]);

      const filteredList = positionList.filter((item, index, array) => array.indexOf(item) === index);
      //.filter((item) => hotNumbers.some((hot) => hot[0] === item));
      console.log(label, list.join());
      console.log(
        'zones:',
        filteredList
          .map((n) => getMinizone(n))
          .filter((item, index, array) => array.indexOf(item) === index)
          .join()
      );
      console.log(
        'cuadrant:',
        list
          .map((n) => getSide(roulettePosition(n)))
          .reduce(
            (result, side) => {
              result[side] = result[side] + 1;
              return result;
            },
            { 0: 0, 1: 0, 2: 0, 3: 0 }
          )
      );
      console.log('hits:', list.length, 'unique:', filteredList.length, '\n');
    }
  }
};

const frequencyData = [];
const nextNumbers = {};
const nextZones = {};
const previousNumbers = {};

data.forEach((n, index, arr) => {
  if (n == -2) return;
  const pos = roulettePosition(n);
  frequencyData[pos] = (frequencyData[pos] | 0) + 1;

  const next = arr[index + 1];
  if (next == -2) return;
  if (next && next > -2) {
    if (nextNumbers[n]) {
      nextNumbers[n].push(next);
    } else {
      nextNumbers[n] = [next];
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

//printList(nextNumbers, 'next: ');

const printNumbers = hotNumbers.map((h) => [
  ('\nnumber: ' + h[0]) | 'N/A',
  '\nfrom: ' + (previousNumbers[h[0]] ? previousNumbers[h[0]].filter((item, index, array) => array.indexOf(item) === index) : 'N/A'),
]);
// console.log('Hot ones:\n\r');
// console.table(
//   hotNumbers.map((h) => ({ number: h[0], hits: h[1], minizone: getMinizone(h[2]), dozen: getDozen(h[0]), column: getColumn(h[0]) }))
//   //.sort((a, b) => a.minizone - b.minizone)
// );

//console.table(nextNumbers);
// const fibonacciD1 = fibonacciDozen(1, false);
// const fibonacciC3 = fibonacciDozen(3, true);
let bank = 0;
// data.forEach((n) => {
//   bank += fibonacciD1.nextBet(n);
//   bank += fibonacciC3.nextBet(n);
// });
// console.log('Dozen wins: ', fibonacciD1.getWins());
// console.log('Dozen maxBet: ', fibonacciD1.getMaxBet());
// console.log('Column wins: ', fibonacciC3.getWins());
// console.log('Column maxBet: ', fibonacciC3.getMaxBet());

const results = {};
for (let dozen = 1; dozen < 4; dozen++) {
  for (let column = 1; column < 4; column++) {
    let bankroll = 0;
    const dozenBets = fibonacciDozen(dozen, false);
    const columnBets = fibonacciDozen(column, true);
    data.forEach((n) => {
      bankroll += dozenBets.nextBet(n);
      bankroll += columnBets.nextBet(n);
    });
    results['dozen' + dozen + 'column' + column] = {
      dozenWins: dozenBets.getWins(),
      dozenMaxBet: dozenBets.getMaxBet(),
      columnWins: columnBets.getWins(),
      columnMaxBet: columnBets.getMaxBet(),
      bankroll,
    };
  }
}
console.table(results);
