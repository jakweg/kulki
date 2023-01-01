export interface Position {
	x: number
	y: number
}

export type WalkableTester = ((x: number, y: number) => boolean)

type PositionToExpand = Readonly<{
	x: number
	y: number
	cost: number
	from: PositionToExpand | null
	lastDirection: number
	distance: number
	historyOfPathIds: ReadonlySet<number>
}>

const computeFieldId = (x: number, y: number) => (x << 4 | y) & 0xFF

const offsets = [[0, -1, 0], [1, 1, 0], [2, 0, 1], [3, 0, -1]]

export const findPath = (sx: number, sy: number,
	dx: number, dy: number,
	tester: WalkableTester): Position[] | null => {

	if (!tester(dx, dy)) return null

	const calculateDistance = (x1: number, y1: number,
		x2: number, y2: number) => (Math.abs(x1 - x2) + Math.abs(y1 - y2))

	const found: PositionToExpand[] = []
	const toExpand: PositionToExpand[] = []

	toExpand.push({
		x: sx, y: sy,
		cost: 0,
		from: null,
		lastDirection: -1,
		distance: calculateDistance(sx, sy, dx, dy),
		historyOfPathIds: new Set([computeFieldId(sx, sy)])
	})

	let smallestCostOfFoundPath = Number.MAX_SAFE_INTEGER

	let limitToAnyPath = 2000
	let limitToNotFound = 10_000

	while (toExpand.length > 0) {
		if (limitToAnyPath-- < 0 && found.length > 0)
			break

		if (limitToNotFound-- === 0) return null

		const current = toExpand.pop()
		if (current.cost > smallestCostOfFoundPath) continue

		if (current.x === dx && current.y === dy) {
			if (smallestCostOfFoundPath > current.cost) {
				found.length = 0
				smallestCostOfFoundPath = current.cost
			}
			found.push(current)
		}

		for (const [direction, ox, oy] of offsets) {
			const newCost = current.cost + (current.lastDirection === direction ? 1 : 1001)

			if (newCost >= smallestCostOfFoundPath) continue

			const x = current.x + ox
			const y = current.y + oy

			const id = computeFieldId(x, y)

			if (current.historyOfPathIds.has(id)) continue

			if (!tester(x, y)) continue

			const newExpander = {
				x, y, cost: newCost,
				from: current,
				lastDirection: direction,
				distance: calculateDistance(x, y, dx, dy),
				historyOfPathIds: new Set([...current.historyOfPathIds, id])
			}
			if (newExpander.distance <= current.distance)
				toExpand.push(newExpander)
			else
				toExpand.unshift(newExpander)
		}
	}

	const foundPath = found[0]
	let path: Position[] = []
	let tmp = foundPath
	while (tmp != null) {
		path.unshift({ x: tmp.x, y: tmp.y })
		tmp = tmp.from
	}

	return path
}

export default findPath
