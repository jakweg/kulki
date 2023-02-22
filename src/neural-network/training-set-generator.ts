import { Board, Color } from "./board";
import { BOARD_SIZE, TENSORS_PER_SET } from "./config";
import SeededRandom from "./seeded-random";

export const generateData = function (seed: number) {
    const random = new SeededRandom(seed)
    const board = new Board(BOARD_SIZE)

    const finalX = []
    const finalY = []

    for (let i = 0; i < TENSORS_PER_SET; i++) {
        board.reset()

        for (let i = 0, l = random.int(BOARD_SIZE); i < l; ++i) {
            board.setOnIndex(random.int(BOARD_SIZE * BOARD_SIZE), Color.Blue)
        }

        if (random.bool())
            board.transpose()

        {
            const xIndex = random.int(BOARD_SIZE)
            for (let i = 0; i < BOARD_SIZE; ++i) {
                board.set(xIndex, i, Color.Blue)
            }
            board.set(xIndex, random.int(BOARD_SIZE), Color.None)
        }
        const xIndex = random.int(BOARD_SIZE)
        const yIndex = random.int(BOARD_SIZE)

        // put some random stuff
        for (let i = 0, l = random.int(BOARD_SIZE); i < l; ++i) {
            board.setOnIndex(random.int(BOARD_SIZE * BOARD_SIZE), Color.Red)
        }

        for (let i = 0; i < BOARD_SIZE; ++i) {
            board.set(xIndex, i, Color.Red)
        }

        board.set(xIndex, yIndex, Color.None)

        if (random.bool())
            board.transpose()

        finalX.push(board.getAsTensorForColor(Color.Red))
        finalY.push(board.getExpectedTensor(xIndex, yIndex))
    }
    return { xs: finalX, ys: finalY }
};