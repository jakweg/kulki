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

    public getAsTensorForColor(color: Color, use2d: boolean = false) {
        const oldBoard = this.board
        const squaredSize = this.size * this.size
        const newBoard = new Uint8Array(squaredSize * 2)
        for (let i = 0, l = squaredSize; i < l; ++i) {
            newBoard[i] = oldBoard[i] !== Color.None ? 1 : 0
        }
        for (let i = 0, l = squaredSize; i < l; ++i) {
            newBoard[i + squaredSize] = oldBoard[i] === color ? 1 : 0
        }

        return tf.tensor(newBoard, use2d ? [1, squaredSize * 2] : [squaredSize * 2], 'bool')
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
        const size = Math.round(Math.sqrt(result.length))
        const board = new Board(size)

        const max = Math.max(...result)

        for (let i = 0; i < size * size; ++i)
            if (result[i] === max)
                board.setOnIndex(i, 1)

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