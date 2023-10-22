import { readFileSync } from 'fs';
import { getMinizone, getSide, roulette, roulettePosition } from './roulette.js';

const dataPoints = 300;
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

      const filteredList = list.filter((item, index, array) => array.indexOf(item) === index);
      //.filter((item) => hotNumbers.some((hot) => hot[0] === item));
      console.log(label, list.join());
      console.log(
        'zones:',
        filteredList
          .map((n) => getMinizone(roulettePosition(n)))
          .filter((item, index, array) => array.indexOf(item) === index)
          .join()
      );
      console.log(
        'sides:',
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

const temperatures = frequencyData.map((hits, i) => [roulette[i], hits]).sort((a, b) => b[1] - a[1]);
const hotNumbers = temperatures.slice(0, 18);

printList(nextNumbers, 'next: ');

// console.log('hot originators:');
// for (const number in previousZones) {
//   if (Object.hasOwnProperty.call(previousZones, number)) {
//     const element = previousZones[number];
//     console.log('number:', number);
//     const list = element
//       .map((n) => roulettePosition(n))
//       .sort((a, b) => a - b)
//       .map((pos) => roulette[pos]);

//     const filteredList = list.filter((item, index, array) => array.indexOf(item) === index);
//     console.log('from:', filteredList.join());
//     console.log('hits:', list.length, 'unique:', filteredList.length, '\n');
//   }
// }

const printNumbers = hotNumbers.map((h) => [
  ('\nnumber: ' + h[0]) | 'N/A',
  '\nfrom: ' + (previousNumbers[h[0]] ? previousNumbers[h[0]].filter((item, index, array) => array.indexOf(item) === index) : 'N/A'),
]);
// console.log('Hot ones:\n\r');
console.table(
  hotNumbers.map((h) => ({ number: h[0], hits: h[1], minizone: getMinizone(roulettePosition(h[0])) }))
  //.sort((a, b) => a.minizone - b.minizone)
);

//console.table(nextNumbers);
