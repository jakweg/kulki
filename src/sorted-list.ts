export class SortedList<T> {
	private mList: T[] = []

	public constructor(private readonly isFirstLess: (o1: T, o2: T) => boolean) {
	}

	add(obj: T) {
		for (let i = 0; i < this.mList.length; i++) {
			if (this.isFirstLess(obj, this.mList[i])) {
				this.mList.splice(i, 0, obj)
				return
			}
		}
		this.mList.push(obj)
	}

	getFirst(): T | undefined {
		return this.mList[0]
	}

	has(check: (obj: T) => boolean): boolean {
		return !!this.mList.find(check)
	}

	getAndRemoveFirst(): T | undefined {
		return this.mList.shift()
	}
}

export default SortedList
