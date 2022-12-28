import GameColor, { randomBallColor } from './colors'
import EventEmitter from './event-emitter'
import GameScheduler from './game-scheduler'
import GameTile from './game-tile'
import findPath from './path-finder'
import Table2d from './table2d'

export interface GameOptions {
	boardWidth: number
	boardHeight: number
	boardElement: HTMLElement
	spawnBallsAfterEveryMoveCount: number
	initialBallsCount: number
	requiredSameColorsBallsToClearCount: number
}

export interface GameEvent {
	'score-changed': number,
	'game-over': number,
	'next-ball-colors-changed': GameColor[]
}

export class Game extends EventEmitter<GameEvent> {
	public readonly scheduler = new GameScheduler()
	private readonly boardTiles: Table2d<GameTile>
	private readonly emptyTiles = new Set<GameTile>()
	private readonly tilesRequireCheck = new Set<GameTile>()
	private readonly nextBallColors: GameColor[] = []
	private selectedTile: GameTile = null
	private score: number = 0
	private isGameOver = false

	constructor(public readonly options: GameOptions) {
		super()
		this.boardTiles = new Table2d<GameTile>(this.options.boardWidth, this.options.boardHeight)

		this.scheduler.addEventListener('queue-empty', () => this.onSchedulerQueueEmptyStatusChanged(true))
		this.scheduler.addEventListener('queue-non-empty', () => this.onSchedulerQueueEmptyStatusChanged(false))
	}

	generateTiles() {
		this.options.boardElement.innerHTML = ''
		this.emptyTiles.clear()
		this.tilesRequireCheck.clear()
		this.boardTiles.fill((x, y) => {
			const tile = new GameTile(this, x, y)
			this.options.boardElement.appendChild(tile.element)
			return tile
		})

		// this.boardTiles.get(1, 1).myColor = Colors.orange
		// this.boardTiles.get(0, 1).myColor = Colors.orange
		// this.boardTiles.get(1, 0).myColor = Colors.orange
	}

	addBallElement(element: HTMLElement) {
		this.options.boardElement.appendChild(element)
	}

	notifyIamEmpty(me: GameTile) {
		this.emptyTiles.add(me)
	}

	notifyIDoHaveBall(me: GameTile) {
		this.emptyTiles.delete(me)
	}

	async notifyIWasClicked(me: GameTile) {
		console.assert(!!me)
		this.boardTiles.forEach(obj => obj.isPreview = false)
		if (this.selectedTile === me) {
			me?.onUnselected()
			this.selectedTile = null
			return
		}

		if (me.myColor) {
			this.selectedTile?.onUnselected()
			me.onSelected()
			this.selectedTile = me
		} else if (this.selectedTile) {
			const path = findPath(
				this.selectedTile.positionX,
				this.selectedTile.positionY,
				me.positionX,
				me.positionY,
				(x, y) => this.boardTiles.getOrUndefined(x, y)?.myColor === null,
			)

			if (path) {
				this.selectedTile.onUnselected()

				path.forEach(({ x, y }) => this.boardTiles.get(x, y).isTraveledTile = true)
				await this.selectedTile.transferBallByPath(me, path)

				this.selectedTile = null

				const count = await this.executePostMoveCheck()
				if (count === 0 || this.options.boardWidth * this.options.boardHeight === this.emptyTiles.size)
					await this.scheduler.schedule(async () => {
						for (let i = 0; i < this.options.spawnBallsAfterEveryMoveCount; i++) {
							this.placeRandomBall()
							await this.executePostMoveCheck()
						}
					})
				await this.executePostMoveCheck()
				path.forEach(({ x, y }) => this.boardTiles.get(x, y).isTraveledTile = false)
				this.checkLoseCondition()
			}
		}
	}

	notifyIWasHovered(me: GameTile) {
		console.assert(!!me)
		if (this.selectedTile) {
			const path = findPath(
				this.selectedTile.positionX,
				this.selectedTile.positionY,
				me.positionX,
				me.positionY,
				(x, y) => this.boardTiles.getOrUndefined(x, y)?.myColor === null,
			)

			if (path) {
				this.boardTiles.forEach(obj => obj.isPreview = false)
				path.forEach(({ x, y }) => this.boardTiles.get(x, y).isPreview = true)
			}
		}
	}

	notifyIRequireCheck(me: GameTile) {
		this.tilesRequireCheck.add(me)
	}

	placeRandomBall() {
		if (this.checkLoseCondition()) return

		let index = Math.random() * this.emptyTiles.size | 0
		const iterator = this.emptyTiles.values()
		while (index-- > 0) iterator.next()

		const tile: GameTile = iterator.next().value
		tile.setMyBallColor(this.getRandomBallColor())
	}

	public checkLoseCondition(): boolean {
		if (this.isGameOver) return true
		if (this.emptyTiles.size === 0) {
			this.isGameOver = true
			this.options.boardElement.classList.add('game-over')
			this.emit('game-over', this.score)
			return true
		}
		return false
	}

	async executePostMoveCheck(): Promise<number> {
		const tilesToBeCleared = new Set<GameTile>()

		const getWithThisColorInRow = (color: GameColor,
			startX: number, startY: number,
			offsetX: number, offsetY: number,
			dontDoReverse: boolean = false): Set<GameTile> => {
			const list = new Set<GameTile>()
			let currentX = startX
			let currentY = startY
			if (dontDoReverse) {
				currentX += offsetX
				currentY += offsetY
			}
			while (true) {
				const tile = this.boardTiles.getOrUndefined(currentX, currentY)
				if (!tile) break
				if (tile.myColor !== color) break
				list.add(tile)
				currentX += offsetX
				currentY += offsetY
			}
			if (!dontDoReverse)
				getWithThisColorInRow(color, startX, startY, -offsetX, -offsetY, true)
					.forEach(e => list.add(e))

			if (!dontDoReverse) {
				if (list.size >= this.options.requiredSameColorsBallsToClearCount)
					for (const gameTile of list) {
						tilesToBeCleared.add(gameTile)
					}
			}
			return list
		}


		for (const tile of this.tilesRequireCheck) {
			const color = tile.myColor
			if (!color) continue

			getWithThisColorInRow(color, tile.positionX, tile.positionY, 1, 0)
			getWithThisColorInRow(color, tile.positionX, tile.positionY, 0, 1)
			getWithThisColorInRow(color, tile.positionX, tile.positionY, 1, 1)
			getWithThisColorInRow(color, tile.positionX, tile.positionY, -1, 1)
		}

		if (tilesToBeCleared.size !== 0) {
			await this.scheduler.schedule(() => tilesToBeCleared.forEach(e => e.clearColor()))

			this.score += tilesToBeCleared.size
			this.emit('score-changed', this.score)
		}
		this.tilesRequireCheck.clear()

		return tilesToBeCleared.size
	}

	public resetGame() {
		this.nextBallColors.length = 0
		this.score = 0
		this.isGameOver = false
		this.options.boardElement.classList.remove('game-over')
		this.emit('score-changed', this.score)
		this.generateTiles()
		for (let i = 0; i < this.options.spawnBallsAfterEveryMoveCount; i++) {
			this.nextBallColors.push(randomBallColor())
		}
		for (let i = 0; i < this.options.initialBallsCount; i++) {
			this.placeRandomBall()
		}
		this.executePostMoveCheck()
	}

	private onSchedulerQueueEmptyStatusChanged(empty: boolean) {
		if (empty) {
			this.options.boardElement.classList.remove('moves-in-progress')
		} else
			this.options.boardElement.classList.add('moves-in-progress')

	}

	private getRandomBallColor(): GameColor {
		const next = this.nextBallColors.shift()
		this.nextBallColors.push(randomBallColor())
		this.emit('next-ball-colors-changed', this.nextBallColors)
		return next
	}
}

export default Game
