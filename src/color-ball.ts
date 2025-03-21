import GameColor from './colors'
import { Game } from './game'
import { Position } from './path-finder'

export class ColorBall {
	private removed: boolean = false
	private posX: number
	private posY: number
	private readonly element: HTMLElement

	constructor(
		private readonly game: Game,
		initialPositionX: number,
		initialPositionY: number,
		public readonly color: GameColor,
	) {
		console.assert(!!color)

		this.posX = initialPositionX
		this.posY = initialPositionY
		this.element = document.createElement('div')
		this.element.classList.add('ball', 'added', `color-${color}`)
		setTimeout(() => this.element.classList.remove('added'), 1000)

		this.updateElementProperties()
		game.addBallElement(this.element)
	}

	public onSelected() {
		this.element.classList.add('selected')
	}
	public onUnselected() {
		this.element.classList.remove('selected')
	}

	public async moveByPath(steps: Position[]) {
		const realSteps = new Set<Position>()
		const length = steps.length
		let lastStep = steps[0]
		let lastOffset = { x: 0, y: 0 }
		for (let i = 1; i < length; i++) {
			const it = steps[i]
			const offset = { x: it.x - lastStep.x, y: it.y - lastStep.y }
			if (offset.x !== lastOffset.x || offset.y !== lastOffset.y) {
				lastOffset = offset
				realSteps.add(lastStep)
			}
			lastStep = it
		}
		realSteps.add(lastStep)

		for (const step of realSteps) {
			await this.moveTo(step.x, step.y)

		}
	}

	public remove() {
		if (this.removed) return
		this.removed = true
		this.element.classList.add('removed')
		setTimeout(() => {
			this.element.remove()
		}, 500)
	}

	private moveTo(x: number, y: number): Promise<void> {
		return this.game.scheduler.schedule(() => {
			this.posX = x
			this.posY = y
			this.updateElementProperties()
		})
	}

	private updateElementProperties() {
		console.assert(!this.removed)
		const func = this.element.style.setProperty.bind(this.element.style)

		func('--x', this.posX.toString())
		func('--y', this.posY.toString())
		func('--color', `var(--${this.color})`)
	}
}

export default ColorBall
