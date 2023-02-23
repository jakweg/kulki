
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
            units: BOARD_SIZE * BOARD_SIZE * BOARD_SIZE * BOARD_SIZE * BOARD_SIZE,
            activation: 'relu6',
        }),
        tf.layers.dense({
            units: BOARD_SIZE * BOARD_SIZE * BOARD_SIZE * BOARD_SIZE,
            activation: 'softmax',
        }),
    ]
})

model.compile({
    optimizer: tf.train.adam(0.01),
    loss: tf.losses.meanSquaredError,
    metrics: ['accuracy']
});



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

    model.save('file://./model')
    console.log('OK');

}
await doStuff()
