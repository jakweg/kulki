import GameColor, { GAME_COLORS } from './colors'
import EventEmitter from './event-emitter'
import GameScheduler from './game-scheduler'
import GameTile from './game-tile'
import findPath from './path-finder'
import SeededRandom from './seeded-random'
import Table2d from './table2d'

const CURRENT_VERSION = 1

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
	private readonly random = new SeededRandom((Date.now() / 1000 / 5) | 0)
	public readonly scheduler = new GameScheduler()
	public isActive = true
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

	clearState() {
		this.options.boardElement.innerHTML = ''
		this.emptyTiles.clear()
		this.tilesRequireCheck.clear()
		this.boardTiles.fill((x, y) => {
			const tile = new GameTile(this, x, y)
			this.options.boardElement.appendChild(tile.element)
			return tile
		})
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
		if (!this.isActive) return
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
						if (!this.isActive) return
						for (let i = 0; i < this.options.spawnBallsAfterEveryMoveCount; i++) {
							this.placeRandomBall()
							await this.executePostMoveCheck()
						}
					})
				if (!this.isActive) return
				await this.executePostMoveCheck()
				path.forEach(({ x, y }) => this.boardTiles.get(x, y).isTraveledTile = false)
				this.checkLoseCondition()
				if (!this.isActive) return
			}
		}
	}

	notifyIWasHovered(me: GameTile) {
		if (!this.isActive) return
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
		if (!this.isActive) return
		if (this.checkLoseCondition()) return

		let index = this.random.next() * this.emptyTiles.size | 0
		const iterator = this.emptyTiles.values()
		while (index-- > 0) iterator.next()

		const tile: GameTile = iterator.next().value
		tile.setMyBallColor(this.getRandomBallColor())
	}

	private setDeserializedColors(colors: GameColor[]) {
		let i = 0
		this.boardTiles.forEach(tile => {
			const color = colors[i++]
			if (color) {
				tile.setMyBallColor(color)
				this.emptyTiles.delete(tile)
			}
		})
	}

	public serialize(): any {
		if (this.isGameOver) return null
		const colors: GameColor[] = []
		this.boardTiles.forEach(t => colors.push(t.myColor))
		return JSON.stringify({
			version: CURRENT_VERSION,
			score: this.score,
			random: this.random.seed,
			nextBallColors: this.nextBallColors,
			colors
		})
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
		if (!this.isActive) return
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

	public deserializeGameOrReset(serialized: string) {
		this.nextBallColors.length = 0
		this.score = 0
		this.isGameOver = false
		this.options.boardElement.classList.remove('game-over')
		this.options.boardElement.classList.remove('moves-in-progress')

		this.clearState()

		let restored = false
		if (serialized)
			try {
				const json = JSON.parse(serialized)
				if (json.version === CURRENT_VERSION) {
					this.setDeserializedColors(json.colors)
					this.score = json.score
					this.random.seed = +json.seed || 0
					this.nextBallColors.push(...json.nextBallColors)
					this.emit('next-ball-colors-changed', this.nextBallColors)
					restored = true
				}
			} catch (_) {
			}

		this.emit('score-changed', this.score)
		if (!restored) {
			for (let i = 0; i < this.options.spawnBallsAfterEveryMoveCount; i++) {
				this.nextBallColors.push(this.randomizeColor())
			}
			for (let i = 0; i < this.options.initialBallsCount; i++) {
				this.placeRandomBall()
			}
		}
		this.executePostMoveCheck()
	}

	public terminate() {
		this.isActive = false
	}

	private onSchedulerQueueEmptyStatusChanged(empty: boolean) {
		if (!this.isActive) return
		if (empty) {
			this.options.boardElement.classList.remove('moves-in-progress')
		} else
			this.options.boardElement.classList.add('moves-in-progress')

	}

	private getRandomBallColor(): GameColor {
		if (!this.isActive) return
		const next = this.nextBallColors.shift()
		this.nextBallColors.push(this.randomizeColor())
		this.emit('next-ball-colors-changed', this.nextBallColors)
		return next
	}

	private randomizeColor(): GameColor {
		return GAME_COLORS[this.random.next() * GAME_COLORS.length | 0]
	}
}

export default Game
