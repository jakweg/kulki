
export const TRAINING_SETS = parseInt(process.env.TRAINING_SETS) || 5
export const EPOCHS = parseInt(process.env.EPOCHS) || 10
export const TENSORS_PER_SET = parseInt(process.env.TENSORS_PER_SET) || 10240
export const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 1024

export const SEED = parseInt(process.env.BATCH_SIZE) || Date.now() || 123
export const COLORS_COUNT = 2
export const BOARD_SIZE = 5
export const MIN_LINE_LENGTH = 4

console.log({
    TRAINING_SETS
    , EPOCHS
    , TENSORS_PER_SET
    , BATCH_SIZE
});
