import { readFile } from 'fs/promises';
const fileData = await readFile(new URL('./data/platinum.txt', import.meta.url), 'utf-8');
const data = fileData.split(/\r?\n/).map((d) => {
  return parseInt(d);
});

// const data = [
//   33, 22, 26, 10, 21, 22, 16, 0, 30, 20, 17, 26, 14, 8, 7, 30, 2, 11, 26, 32, 27, 0, 35, 34, 9, 23, 13, 20, 16, 8, 1, 25, 10, 25, 20, 19,
//   19, 28, 7, 30, 24, 14, 17, 25, 18, 21, 2, 36, 15, 34, 6, 17, 21, 12, 25, 18, 2, 12, 27, 8, 6, 16, 17, 18, 25, 5, 21, 2, 10, 26, 21, 22,
//   21, 29, 25, 12, 25, 13, 23, 7, 26, 19, 30, 29, 11, 20, 35, 3, 29, 17, 17, 36, -1, 18, 7, 9, 25, 29, 25, 35, 26, 9, 11, 0, 23, 6, 12, 35,
//   1, 17, 36, 9, 18, 6, 13, 30, 3, 32, 35, 33, 14, 30, 12, 2, 6, 5, -1, 23, 34, 30, 28, 18, 6, -1, 31, 0, 15, 24, 5, 20, 9, 31, 26, 16, 4,
//   31, 24, 26, 8, 23, 31, 5, 17, 22, 12, 12, 4, 19, 32, 15, 4, 35, 34, 18, 3, 16, 6, 32, 4, 0, 0, 34, 31, 24, 22, 30, 14, 1, 35, 4, 8, 19,
//   26, 27, 22, 15, 28, 8, 29, 29, 31, 8, 24, 3, 12, 15, 8, 36, 15, 0, 4, 9, 7, 34, 22, 11, 29, 32, 22, 18, 26, 26, 25, 18, 17, 5, 17, 10, 21,
//   12, 31, -1, 22, 11, 26, 35, -1, 10, 32, 17, 13, 2, 23, 30, 5, 26, 21, 2, 21, 13, 17, 9, 7, 6, 3, 30, 33, 26, 29, 27, 3, 10, 32, 16, 15,
//   24, 27, 21, 11, 19, 17, 30, 4, 31, 30, 22, 35, 17, 30, 12, 11, 13, 6, 20, 2, 9, 11, 6, 16, 17, 28, 20, 19, 23, 30, 13, 36, 30, 8, 11, 4,
//   13, 19, 5, 6, 4, 9, 10, 19, 28, 28, 14, 1, 21, 16, 20, 32, 30, 2, 36, 33, 9, 0, 11, 30, 3, 17, 14, 32, 14, 28, 28, 25, 3, 24, 30, 22, 8,
//   32, 13, 1, 15, 0, 3, 11, 12, 11, 7, 19, 5, 18, 8, 26, 24, 3, 34, -1, 25, 34, 12, 6, 24, 31, 11, 12, 30, 20, 6, 1, 36, 5, 7, 4, 12, 4, 13,
//   26, 23, 20, 21, 4, 21, 13, 21, 35, 21, 29, 6, 29, 3, 26, 20, 7, 7, 29, -1, 22, 22, 31, -1, 27, 28, 16, -1, 13, 26, 18, 2, 2, 24, 0, 26,
//   -1, 15, 8, 29, 28, 31, 13, 36, 23, 17, 0, 27, 15, 24, 28, 13, 15, 9, 9, 1, 17, 8, 24, 10, 17, 32, 9, 7, 20, 32, -1, 18, 30, 35, 11, 11, 0,
//   9, 9, 14, 32, 25, 33, 22, 18, 2, 27, 36, 9, 25, 20, 15, 20, 16, 4, 2, 29, 7, 7, 30, 18, 10, 9, 3, 1, 10, 0, 29, 9, 7, 0, 23, 31, 6, 30, 3,
//   11, 18, 35, 25, 4, 29, 33, 4, 11, 20, 18, 35, 11, 20, 23, 9, 3, -1, 11, 28, -1, 27, 5, 21, 27, 6, 26,
// ];
console.log('data points:', data.length);
const roulette = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, -1, 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14,
  2,
];

const roulettePosition = (n) => {
  return roulette.indexOf(n);
};
const frequencyData = [];
const nextZones = {};
const previousZones = {};

data.forEach((n, index, arr) => {
  const pos = roulettePosition(n);
  frequencyData[pos] = (frequencyData[pos] | 0) + 1;

  const next = arr[index + 1];
  if (next != undefined) {
    if (nextZones[n]) {
      nextZones[n].push(next);
    } else {
      nextZones[n] = [next];
    }
  }

  const prev = arr[index - 1];
  if (prev != undefined) {
    if (previousZones[n]) {
      previousZones[n].push(prev);
    } else {
      previousZones[n] = [prev];
    }
  }
});

const temperatures = frequencyData.map((p, i) => [roulette[i], p]).sort((a, b) => b[1] - a[1]);
const hotNumbers = temperatures.slice(0, 12);

for (const number in nextZones) {
  if (Object.hasOwnProperty.call(nextZones, number)) {
    const element = nextZones[number];
    console.log('number:', number);
    const list = element
      .map((n) => roulettePosition(n))
      .sort((a, b) => a - b)
      .map((pos) => roulette[pos]);

    const filteredList = list
      .filter((item, index, array) => array.indexOf(item) === index)
      .filter((item) => hotNumbers.some((hot) => hot[0] === item));
    console.log('next:', filteredList.join());
    console.log('hits:', list.length, 'unique:', filteredList.length, '\n');
  }
}

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
  '\nnumber: ' + h[0],
  '\nfrom: ' + previousZones[h[0]].filter((item, index, array) => array.indexOf(item) === index),
]);
console.log('Hot ones:\n', hotNumbers.join('\n'));
