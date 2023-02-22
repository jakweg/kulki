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
    public setOnIndex(index: number, value: Color) {
        this.board[index] = value
    }

    public getAsTensorForColor(color: Color) {
        const oldBoard = this.board
        const squaredSize = this.size * this.size
        const newBoard = new Uint8Array(squaredSize * 2)
        for (let i = 0, l = squaredSize; i < l; ++i) {
            newBoard[i] = oldBoard[i] !== Color.None ? 1 : 0
        }
        for (let i = 0, l = squaredSize; i < l; ++i) {
            newBoard[i + squaredSize] = oldBoard[i] === color ? 1 : 0
        }

        return tf.tensor(newBoard, [squaredSize * 2], 'bool')
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

    public getExpectedTensor(x: number, y: number) {
        this.validateCoords(x, y)

        const newBoard = new Uint8Array(this.size * this.size)
        newBoard[x + y * this.size] = 1

        return tf.tensor(newBoard, [this.size * this.size], 'bool')
    }


    private validateCoords(x: number, y: number) {
        if ((x | 0) !== x || x < 0 || x >= this.size
            || (y | 0) !== y || y < 0 || y >= this.size) throw new Error()
    }
}