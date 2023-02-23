import { Board, Color } from "./board";
import { BOARD_SIZE, COLORS_COUNT, MIN_LINE_LENGTH, TENSORS_PER_SET } from "./config";
import SeededRandom from "./seeded-random";
import { repeatUntil } from "./utils";

export const generateData = function (seed: number) {
    const random = new SeededRandom(seed)
    const board = new Board(BOARD_SIZE)

    const finalX = []
    const finalY = []

    for (let i = 0; i < TENSORS_PER_SET; i++) {
        board.reset()

        let xIndex = random.int(BOARD_SIZE)
        let yIndex = random.int(BOARD_SIZE)

        // put some random balls
        for (let color = 1; color < COLORS_COUNT; ++color) {
            for (let i = 0, l = random.int(BOARD_SIZE); i < l; ++i) {
                board.setAtIndex(random.int(BOARD_SIZE * BOARD_SIZE), color)
            }
        }

        // set proper line
        const lineLength = random.intRange(MIN_LINE_LENGTH, BOARD_SIZE)
        const offset = random.int(BOARD_SIZE - lineLength + 1)
        for (let i = 0; i < lineLength; ++i) {
            board.set(xIndex, i + offset, Color.Red)
        }


        let indexToMoveFrom = repeatUntil(
            () => random.int(BOARD_SIZE * BOARD_SIZE),
            (index) => board.getAtIndex(index) !== Color.None
        )

        // set this one missing
        board.setAtIndex(indexToMoveFrom, Color.Red)
        board.set(xIndex, yIndex, Color.None)

        if (random.bool()) {
            board.transpose()

            const tmp = xIndex
            xIndex = yIndex
            yIndex = tmp

            const coords = board.indexToCoords(indexToMoveFrom)
            indexToMoveFrom = board.coordsToIndex(coords[1], coords[0])
        }

        board.shiftColors(random.int(COLORS_COUNT), COLORS_COUNT)

        finalX.push(board.getAsTensorForColors())
        finalY.push(board.getExpectedTensor(board.coordsToIndex(xIndex, yIndex), indexToMoveFrom))
    }
    return { xs: finalX, ys: finalY }
};