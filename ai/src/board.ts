import { COLORS_COUNT } from './config'
import tf from './tf'

export const enum Color {
    None = 0,
    Red,
    Blue,
}

export class Board {
    private board: Uint8Array
    constructor(public readonly size: number) {
        this.board = new Uint8Array(size * size)
    }

    public reset() {
        this.board.fill(Color.None)
    }

    public set(x: number, y: number, value: Color) {
        this.validateCoords(x, y)

        this.board[x + y * this.size] = value
    }
    public getAtIndex(index: number): Color {
        return this.board[index]
    }

    public setAtIndex(index: number, value: Color) {
        this.board[index] = value
    }

    public getAsTensorForColors(use2d: boolean = false) {
        const oldBoard = this.board
        const squaredSize = this.size * this.size
        const newBoard = new Uint8Array(squaredSize * COLORS_COUNT)
        for (let c = 0; c < COLORS_COUNT; ++c) {
            for (let i = 0, l = squaredSize; i < l; ++i) {
                newBoard[i + c * squaredSize] = oldBoard[i] === c ? 1 : 0
            }
        }

        return tf.tensor(newBoard, use2d ? [1, squaredSize * COLORS_COUNT] : [squaredSize * COLORS_COUNT], 'bool')
    }

    public transpose() {
        const data = this.board
        const size = this.size
        for (let i = 0; i < size; ++i)
            for (let j = i; j < size; ++j) {
                const tmp = data[i * size + j]
                data[i * size + j] = data[j * size + i]
                data[j * size + i] = tmp
            }
    }

    public coordsToIndex(x: number, y: number): number {
        this.validateCoords(x, y)
        return x + y * this.size
    }

    public indexToCoords(index: number): [number, number] {
        return [index % this.size, (index / this.size) | 0,]
    }

    public getExpectedTensor(emptyIndex: number, moveFromIndex: number) {
        const newBoard = new Uint8Array(this.size * this.size * this.size * this.size)
        newBoard[this.size * this.size * emptyIndex + moveFromIndex] = 1

        return tf.tensor(newBoard, [newBoard.length], 'bool')
    }


    private validateCoords(x: number, y: number) {
        if ((x | 0) !== x || x < 0 || x >= this.size
            || (y | 0) !== y || y < 0 || y >= this.size) throw new Error()
    }

    public toStringVisualization(): string {
        const output: string[] = []
        const board = this.board
        const size = this.size;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const value = board[x + y * size]
                if (value === Color.None)
                    output.push(` .`)
                else
                    output.push(` ${value}`)
            }
            output.push('\n')
        }
        return output.join('')
    }

    public static fromString(value: string): Board {
        const lines = value.trim().split('\n').map(e => e.trim()).filter(e => !!e)
        const size = lines.length
        const board = new Board(size)

        let lineIndex = 0
        for (const line of lines) {
            const letters = line.split(' ')
            let letterIndex = 0
            for (const letter of letters) {
                const value = parseInt(letter.trim()) || Color.None
                board.set(letterIndex, lineIndex, value)
                letterIndex++
            }
            lineIndex++
        }

        return board
    }


    public static fromResult(result: Float32Array): Board {
        const size = Math.round(Math.sqrt(Math.sqrt(result.length)))

        const board = new Board(size)

        const max = Math.max(...result)

        const index = result.indexOf(max)
        const moveFromIndex = index % (size * size)
        const moveToIndex = (index / (size * size)) | 0

        board.setAtIndex(moveFromIndex, 4 as Color)
        board.setAtIndex(moveToIndex, 3 as Color)

        return board
    }

    public static mergeTwo(a: Board, b: Board): Board {
        const size = a.size;
        if (size !== b.size) throw new Error()
        const board = new Board(size)

        for (let i = 0; i < size * size; ++i)
            board.board[i] = a.board[i] + b.board[i]

        return board
    }
}