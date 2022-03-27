import ColorBall from './color-ball'
import { GameColor } from './colors'
import { Game } from './game'
import { Position } from './path-finder'

export class GameTile {
	public readonly element: HTMLElement
	private myBall: ColorBall = null

	constructor(
		public readonly  game: Game,
		public readonly positionX: number,
		public readonly positionY: number,
	) {
		this.element = document.createElement('div')
		this.element.classList.add('tile')
		this.element.style.setProperty('--x', positionX.toString())
		this.element.style.setProperty('--y', positionY.toString())
		this.game.notifyIamEmpty(this)
		this.element.addEventListener('click', () => this.game.notifyIWasClicked(this))
		this.element.addEventListener('mouseenter', () => this.game.notifyIWasHovered(this))
	}

	public get myColor(): GameColor | null {
		return this.myBall?.color || null
	}

	public set isPreview(v: boolean) {
		if (v) this.element.classList.add('preview')
		else this.element.classList.remove('preview')
	}

	public set isTraveledTile(v: boolean) {
		if (v) this.element.classList.add('traveled')
		else this.element.classList.remove('traveled')
	}

	public onUnselected() {
		this.element.classList.remove('selected')
		this.myBall?.onUnselected()
	}

	public onSelected() {
		this.element.style.setProperty('--color', this.myColor)
		this.element.classList.add('selected')
		this.myBall?.onSelected()
	}

	public setMyBallColor(color: GameColor) {
		this.myBall?.remove()
		this.myBall = new ColorBall(this.game, this.positionX, this.positionY, color)
		this.game.notifyIDoHaveBall(this)
		this.game.notifyIRequireCheck(this)
	}

	public clearColor() {
		this.myBall?.remove()
		this.myBall = null
		this.game.notifyIamEmpty(this)
	}

	public async transferBallByPath(other: GameTile, steps: Position[]) {
		console.assert(other !== this)
		console.assert(!other.myColor)
		console.assert(!!this.myColor)
		console.assert(!other.myBall)
		console.assert(!!this.myBall)

		await this.myBall.moveByPath(steps)

		other.myBall = this.myBall
		other.game.notifyIDoHaveBall(other)
		other.game.notifyIRequireCheck(other)

		this.myBall = null
		this.game.notifyIamEmpty(this)
	}

}


export default GameTile
