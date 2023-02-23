import { Board, Color } from "./board";
import { BOARD_SIZE, MIN_LINE_LENGTH, TENSORS_PER_SET } from "./config";
import SeededRandom from "./seeded-random";

export const generateData = function (seed: number) {
    const random = new SeededRandom(seed)
    const board = new Board(BOARD_SIZE)

    const finalX = []
    const finalY = []

    for (let i = 0; i < TENSORS_PER_SET; i++) {
        board.reset()

        for (let i = 0, l = random.int(BOARD_SIZE); i < l; ++i)
            board.setOnIndex(random.int(BOARD_SIZE * BOARD_SIZE), Color.Blue)

        for (let i = 0, l = random.int(BOARD_SIZE); i < l; ++i)
            board.setOnIndex(random.int(BOARD_SIZE * BOARD_SIZE), Color.Blue)

        if (random.bool())
            board.transpose()

        {
            const xIndex = random.int(BOARD_SIZE)
            for (let i = 0; i < BOARD_SIZE; ++i) {
                board.set(xIndex, i, Color.Blue)
            }
            board.set(xIndex, random.int(BOARD_SIZE), Color.None)
        }
        let xIndex = random.int(BOARD_SIZE)
        let yIndex = random.int(BOARD_SIZE)

        // put some random stuff
        for (let i = 0, l = random.int(BOARD_SIZE); i < l; ++i) {
            board.setOnIndex(random.int(BOARD_SIZE * BOARD_SIZE), Color.Red)
        }

        // set proper line
        for (let i = 0, o = random.int(BOARD_SIZE - MIN_LINE_LENGTH + 1); i < MIN_LINE_LENGTH; ++i) {
            board.set(xIndex, i + o, Color.Red)
        }

        // set this one missing
        board.set(xIndex, yIndex, Color.None)


        if (random.bool()) {
            board.transpose()

            const tmp = xIndex
            xIndex = yIndex
            yIndex = tmp

        }

        finalX.push(board.getAsTensorForColor(Color.Red))
        finalY.push(board.getExpectedTensor(xIndex, yIndex))
    }
    return { xs: finalX, ys: finalY }
};