// src/neural-network/config.ts
var TRAINING_SETS = 10;
var EPOCHS = 4;
var TENSORS_PER_SET = 1024;
var BATCH_SIZE = 1024;
var SEED = 123;
var BOARD_SIZE = 5;

// src/neural-network/tf.ts
import * as tensorflow from "@tensorflow/tfjs-node";
var tf_default = tensorflow;

// src/neural-network/board.ts
var Board = class {
  constructor(size) {
    this.size = size;
    this.board = new Uint8Array(size * size);
  }
  board;
  reset() {
    this.board.fill(0 /* None */);
  }
  set(x, y, value) {
    this.validateCoords(x, y);
    this.board[x + y * this.size] = value;
  }
  setOnIndex(index, value) {
    this.board[index] = value;
  }
  getAsTensorForColor(color) {
    const oldBoard = this.board;
    const squaredSize = this.size * this.size;
    const newBoard = new Uint8Array(squaredSize * 2);
    for (let i = 0, l = squaredSize; i < l; ++i) {
      newBoard[i] = oldBoard[i] !== 0 /* None */ ? 1 : 0;
    }
    for (let i = 0, l = squaredSize; i < l; ++i) {
      newBoard[i + squaredSize] = oldBoard[i] === color ? 1 : 0;
    }
    return tf_default.tensor(newBoard, [squaredSize * 2], "bool");
  }
  transpose() {
    const data = this.board;
    const size = this.size;
    for (let i = 0; i < size; ++i)
      for (let j = i; j < size; ++j) {
        const tmp = data[i * size + j];
        data[i * size + j] = data[j * size + i];
        data[j * size + i] = tmp;
      }
  }
  getExpectedTensor(x, y) {
    this.validateCoords(x, y);
    const newBoard = new Uint8Array(this.size * this.size);
    newBoard[x + y * this.size] = 1;
    return tf_default.tensor(newBoard, [this.size * this.size], "bool");
  }
  validateCoords(x, y) {
    if ((x | 0) !== x || x < 0 || x >= this.size || (y | 0) !== y || y < 0 || y >= this.size)
      throw new Error();
  }
};

// src/neural-network/seeded-random.ts
var SeededRandom = class {
  constructor(seed) {
    this.seed = seed;
  }
  next01() {
    return ((this.seed = Math.imul(1597334677, this.seed)) >>> 0) / 2 ** 32;
  }
  int(max) {
    return this.next01() * max | 0;
  }
  bool() {
    return this.int(2) === 0;
  }
};
var seeded_random_default = SeededRandom;

// src/neural-network/training-set-generator.ts
var generateData = function(seed) {
  const random = new seeded_random_default(seed);
  const board = new Board(BOARD_SIZE);
  const finalX = [];
  const finalY = [];
  for (let i = 0; i < TENSORS_PER_SET; i++) {
    board.reset();
    for (let i2 = 0, l = random.int(BOARD_SIZE); i2 < l; ++i2) {
      board.setOnIndex(random.int(BOARD_SIZE * BOARD_SIZE), 2 /* Blue */);
    }
    if (random.bool())
      board.transpose();
    {
      const xIndex2 = random.int(BOARD_SIZE);
      for (let i2 = 0; i2 < BOARD_SIZE; ++i2) {
        board.set(xIndex2, i2, 2 /* Blue */);
      }
      board.set(xIndex2, random.int(BOARD_SIZE), 0 /* None */);
    }
    const xIndex = random.int(BOARD_SIZE);
    const yIndex = random.int(BOARD_SIZE);
    for (let i2 = 0, l = random.int(BOARD_SIZE); i2 < l; ++i2) {
      board.setOnIndex(random.int(BOARD_SIZE * BOARD_SIZE), 1 /* Red */);
    }
    for (let i2 = 0; i2 < BOARD_SIZE; ++i2) {
      board.set(xIndex, i2, 1 /* Red */);
    }
    board.set(xIndex, yIndex, 0 /* None */);
    if (random.bool())
      board.transpose();
    finalX.push(board.getAsTensorForColor(1 /* Red */));
    finalY.push(board.getExpectedTensor(xIndex, yIndex));
  }
  return { xs: finalX, ys: finalY };
};

// src/neural-network/main.ts
var model = tf_default.sequential({
  layers: [
    tf_default.layers.dense({
      units: BOARD_SIZE * BOARD_SIZE * 2,
      inputShape: [BOARD_SIZE * BOARD_SIZE * 2]
    }),
    tf_default.layers.dense({
      units: BOARD_SIZE * BOARD_SIZE * 2,
      activation: "relu6"
    }),
    tf_default.layers.dense({
      units: BOARD_SIZE * BOARD_SIZE,
      activation: "softmax"
    })
  ]
});
model.compile({
  optimizer: tf_default.train.adam(0.01),
  loss: tf_default.losses.meanSquaredError,
  metrics: ["accuracy"]
});
var trainModelHavingData = (data) => model.fitDataset(tf_default.data.zip({
  xs: tf_default.data.array(data.xs),
  ys: tf_default.data.array(data.ys)
}).batch(BATCH_SIZE), { epochs: EPOCHS });
var tensor = tf_default;
var doStuff = async () => {
  let previousTraining = Promise.resolve();
  for (let i = 0; i < TRAINING_SETS; ++i) {
    const data = generateData(SEED + i * 29 + 34567);
    await previousTraining;
    previousTraining = trainModelHavingData(data);
  }
  await previousTraining;
  const result = model.predict(tf_default.tensor([
    1,
    0,
    0,
    1,
    1,
    1,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    1,
    1,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
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
    1,
    0,
    0,
    1,
    0
  ].map((e) => e === 1), [1, BOARD_SIZE * BOARD_SIZE * 2])).dataSync();
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
  tensor
};
