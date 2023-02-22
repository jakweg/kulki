
// import * as tf from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs-node';
import SeededRandom from '../seeded-random.js';

const BOARD_SIZE = 5
const MIN_LINE_LENGTH = 3

const model = tf.sequential({
    layers: [
        tf.layers.dense({
            units: BOARD_SIZE * BOARD_SIZE,
            inputShape: [BOARD_SIZE * BOARD_SIZE],
        }),
        tf.layers.dense({
            units: BOARD_SIZE * BOARD_SIZE,
        }),
    ]
})

model.compile({
    optimizer: tf.train.sgd(1),
    loss: tf.losses.meanSquaredError,
    metrics: ['MAE']
});

const transpose = (data: any[]) => {
    for (let i = 0; i < BOARD_SIZE; ++i)
        for (let j = i; j < BOARD_SIZE; ++j) {
            const tmp = data[i * BOARD_SIZE + j]
            data[i * BOARD_SIZE + j] = data[j * BOARD_SIZE + i]
            data[j * BOARD_SIZE + i] = tmp
        }
}

const range = (length: number) => [...new Array(length)].map((_, i) => i)

const trainModelHavingData = (data: any) => model.fitDataset(tf.data.zip({ xs: tf.data.array(data.xs), ys: tf.data.array(data.ys) }).batch(128), { epochs: 5, })

const SEED = 123
const TRIES = 1024 * 32

const generateData = function (seed: number) {
    const random = new SeededRandom(SEED)
    const xsArray = [...new Array(BOARD_SIZE * BOARD_SIZE)].map(() => false)
    const ysArray = [...new Array(BOARD_SIZE * BOARD_SIZE)].map(() => false)

    const finalX = []
    const finalY = []

    for (let i = 0; i < TRIES; i++) {
        xsArray.fill(false)
        ysArray.fill(false)
        const xIndex = (random.next() * BOARD_SIZE) | 0
        const yIndex = (random.next() * BOARD_SIZE) | 0

        // put some random stuff
        for (let i = 0, l = (random.next() * 3) | 0; i < l; ++i)
            xsArray[(random.next() * BOARD_SIZE * BOARD_SIZE) | 0] = false

        for (let i = 0; i < BOARD_SIZE; ++i)
            xsArray[i * BOARD_SIZE + xIndex] = true

        xsArray[yIndex * BOARD_SIZE + xIndex] = false
        ysArray[yIndex * BOARD_SIZE + xIndex] = true

        if (random.next() > 0.5) {
            transpose(xsArray)
            transpose(ysArray)
        }


        finalX.push(tf.tensor(xsArray, [BOARD_SIZE * BOARD_SIZE], 'bool'))
        finalY.push(tf.tensor(ysArray, [BOARD_SIZE * BOARD_SIZE], 'bool'))
    }
    return { xs: finalX, ys: finalY }
};

export const tensor = tf
export const doStuff = async () => {

    let previousTraining: Promise<any> = Promise.resolve()
    for (let i = 0; i < 3; ++i) {
        const data = generateData(SEED + i + 34567)
        await previousTraining
        previousTraining = trainModelHavingData(data)
    }
    await previousTraining

    const result = (model.predict(tf.tensor([
        0, 0, 0, 1, 0,
        1, 0, 0, 1, 1,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 1,
    ].map(e => e === 1), [1, BOARD_SIZE * BOARD_SIZE])) as any).dataSync()

    const rows = []
    for (let i = 0; i < BOARD_SIZE; i++) {
        rows.push(([...result.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE)].map((e: number) => e.toFixed(5))))
    }
    console.table(rows)
    const max = (result as number[]).reduce((p, c) => c > p ? c : p, -1)
    rows.length = 0
    for (let i = 0; i < BOARD_SIZE; i++) {
        rows.push(([...result.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE)].map((e: number) => e === max ? 1 : 0)))
    }
    console.table(rows)
}
await doStuff()
