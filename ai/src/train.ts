
import * as fs from 'fs/promises';
import { BATCH_SIZE, BOARD_SIZE, COLORS_COUNT, EPOCHS, SEED, TRAINING_SETS } from './config';
import tf from './tf';
import { generateData } from './training-set-generator';

const CREATE_NEW = false

const compileArgs: tf.ModelCompileArgs = {
    optimizer: tf.train.adam(0.01),
    loss: tf.losses.meanSquaredError,
    metrics: ['accuracy']
}

const newModel = () => {
    const model = tf.sequential({
        layers: [
            tf.layers.dense({
                units: BOARD_SIZE * BOARD_SIZE * COLORS_COUNT,
                inputShape: [BOARD_SIZE * BOARD_SIZE * COLORS_COUNT],
            }),
            tf.layers.dense({
                units: BOARD_SIZE * BOARD_SIZE * BOARD_SIZE * BOARD_SIZE * BOARD_SIZE * COLORS_COUNT,
                activation: 'relu6',
            }),
            tf.layers.dense({
                units: BOARD_SIZE * BOARD_SIZE * BOARD_SIZE * BOARD_SIZE,
                activation: 'softmax',
            }),
        ]
    })

    model.compile(compileArgs)

    return model
}

const MODELS_PATH = await (fs.stat('/models').then(() => 'file:///models/').catch(() => 'file://./'))

const loadModel = async () => {
    try {
        const model = await tf.loadLayersModel(MODELS_PATH + 'model/model.json')

        model.compile(compileArgs);

        return model
    } catch {
        console.info('Failed to load model, using new one')
        return newModel()
    }
}

const model = CREATE_NEW ? newModel() : await loadModel()

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
        model.save(MODELS_PATH + 'model-tmp')
        previousTraining = trainModelHavingData(data)
    }
    await previousTraining

    model.save(MODELS_PATH + 'model')
    console.log('OK');

}
await doStuff()
