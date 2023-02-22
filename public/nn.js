// src/neural-network/main.ts
import * as tf from "@tensorflow/tfjs-node";

// src/seeded-random.ts
var SeededRandom = class {
  constructor(seed) {
    this.seed = seed;
  }
  next() {
    return ((this.seed = Math.imul(1597334677, this.seed)) >>> 0) / 2 ** 32;
  }
};
var seeded_random_default = SeededRandom;

// src/neural-network/main.ts
var BOARD_SIZE = 5;
var model = tf.sequential({
  layers: [
    tf.layers.dense({
      units: BOARD_SIZE * BOARD_SIZE,
      inputShape: [BOARD_SIZE * BOARD_SIZE]
    }),
    tf.layers.dense({
      units: BOARD_SIZE * BOARD_SIZE
    })
  ]
});
model.compile({
  optimizer: tf.train.sgd(1),
  loss: tf.losses.meanSquaredError,
  metrics: ["MAE"]
});
var transpose = (data2) => {
  for (let i = 0; i < BOARD_SIZE; ++i)
    for (let j = i; j < BOARD_SIZE; ++j) {
      const tmp = data2[i * BOARD_SIZE + j];
      data2[i * BOARD_SIZE + j] = data2[j * BOARD_SIZE + i];
      data2[j * BOARD_SIZE + i] = tmp;
    }
};
var trainModelHavingData = (data2) => model.fitDataset(tf.data.zip({ xs: tf.data.array(data2.xs), ys: tf.data.array(data2.ys) }).batch(128), { epochs: 5 });
var SEED = 123;
var TRIES = 1024 * 32;
var generateData = function(seed) {
  const random = new seeded_random_default(SEED);
  const xsArray = [...new Array(BOARD_SIZE * BOARD_SIZE)].map(() => false);
  const ysArray = [...new Array(BOARD_SIZE * BOARD_SIZE)].map(() => false);
  const finalX = [];
  const finalY = [];
  for (let i = 0; i < TRIES; i++) {
    xsArray.fill(false);
    ysArray.fill(false);
    const xIndex = random.next() * BOARD_SIZE | 0;
    const yIndex = random.next() * BOARD_SIZE | 0;
    for (let i2 = 0, l = random.next() * 3 | 0; i2 < l; ++i2)
      xsArray[random.next() * BOARD_SIZE * BOARD_SIZE | 0] = false;
    for (let i2 = 0; i2 < BOARD_SIZE; ++i2)
      xsArray[i2 * BOARD_SIZE + xIndex] = true;
    xsArray[yIndex * BOARD_SIZE + xIndex] = false;
    ysArray[yIndex * BOARD_SIZE + xIndex] = true;
    if (random.next() > 0.5) {
      transpose(xsArray);
      transpose(ysArray);
    }
    finalX.push(tf.tensor(xsArray, [BOARD_SIZE * BOARD_SIZE], "bool"));
    finalY.push(tf.tensor(ysArray, [BOARD_SIZE * BOARD_SIZE], "bool"));
  }
  return { xs: finalX, ys: finalY };
};
var tensor2 = tf;
var doStuff = async () => {
  let previousTraining = Promise.resolve();
  for (let i = 0; i < 3; ++i) {
    const data2 = generateData(SEED + i + 34567);
    await previousTraining;
    previousTraining = trainModelHavingData(data2);
  }
  await previousTraining;
  const result = model.predict(tf.tensor([
    0,
    0,
    0,
    1,
    0,
    1,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1
  ].map((e) => e === 1), [1, BOARD_SIZE * BOARD_SIZE])).dataSync();
  const rows = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    rows.push([...result.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE)].map((e) => e.toFixed(5)));
  }
  console.table(rows);
  const max = result.reduce((p, c) => c > p ? c : p, -1);
  rows.length = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    rows.push([...result.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE)].map((e) => e === max ? 1 : 0));
  }
  console.table(rows);
};
await doStuff();
export {
  doStuff,
  tensor2 as tensor
};
