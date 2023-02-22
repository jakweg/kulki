
import { BATCH_SIZE, BOARD_SIZE, EPOCHS, SEED, TRAINING_SETS } from './config';
import tf from './tf';
import { generateData } from './training-set-generator';


const model = tf.sequential({
    layers: [
        tf.layers.dense({
            units: BOARD_SIZE * BOARD_SIZE * 2,
            inputShape: [BOARD_SIZE * BOARD_SIZE * 2],
        }),
        tf.layers.dense({
            units: BOARD_SIZE * BOARD_SIZE * 2,
            activation: 'relu6',
        }),
        tf.layers.dense({
            units: BOARD_SIZE * BOARD_SIZE,
            activation: 'softmax',
        }),
    ]
})

model.compile({
    optimizer: tf.train.adam(0.01),
    loss: tf.losses.meanSquaredError,
    metrics: ['accuracy']
});


const range = (length: number) => [...new Array(length)].map((_, i) => i)

const trainModelHavingData = (data: any) => model.fitDataset(tf.data.zip({
    xs: tf.data.array(data.xs),
    ys: tf.data.array(data.ys)
}).batch(BATCH_SIZE), { epochs: EPOCHS, })


export const tensor = tf
export const doStuff = async () => {

    let previousTraining: Promise<any> = Promise.resolve()
    for (let i = 0; i < TRAINING_SETS; ++i) {
        const data = generateData(SEED + i * 29 + 34567)
        await previousTraining
        previousTraining = trainModelHavingData(data)
    }
    await previousTraining

    const result = (model.predict(tf.tensor([
        1, 0, 0, 1, 1,
        1, 0, 0, 1, 1,
        0, 0, 0, 1, 1,
        0, 0, 0, 0, 0,
        1, 0, 0, 1, 1,

        1, 0, 0, 1, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 0,
        1, 0, 0, 1, 0,
    ].map(e => e === 1), [1, BOARD_SIZE * BOARD_SIZE * 2])) as any).dataSync()

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
