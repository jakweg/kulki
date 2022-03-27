export class Table2d<T> {
	private readonly _array: T[]

	constructor(
		public readonly width: number,
		public readonly height: number,
	) {
		console.assert(width > 0, 'width > 0')
		console.assert(height > 0, 'height > 0')
		this._array = new Array(width * height)
	}

	public get(x: number, y: number): T {
		console.assert(x >= 0 && x < this.width, 'invalid x ' + x)
		console.assert(y >= 0 && y < this.height, 'invalid y ' + y)
		return this._array[x + y * this.width]
	}

	public getOrUndefined(x: number, y: number): T | undefined{
		if (x >= 0 && x < this.width)
			if (y >= 0 && y < this.height)
				return this._array[x + y * this.width]
	}

	public fill(generator: (x: number, y: number) => T) {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this._array[x + y * this.width] = generator(x, y)
			}
		}
	}

	public forEach(func: (obj: T) => void) {
		this._array.forEach(func)
	}
}

export default Table2d
