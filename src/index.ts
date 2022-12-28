import Game from './game'

export const INSTANCE = new Game({
	boardElement: document.getElementById('board'),
	boardHeight: 9,
	boardWidth: 9,
	spawnBallsAfterEveryMoveCount: 3,
	initialBallsCount: 5,
	requiredSameColorsBallsToClearCount: 5,
})
// @ts-ignore
window.INSTANCE = INSTANCE


const scoreSpan = document.getElementById('score')
const nextColorsSpan = document.getElementById('next-colors')

INSTANCE.addEventListener('score-changed', (score) => {
	scoreSpan.innerText = `${score}`
})

INSTANCE.addEventListener('game-over', (score) => {
	requestAnimationFrame(() => requestAnimationFrame(() => alert('Koniec gry, twój wynik to ' + score)))
})

INSTANCE.addEventListener('next-ball-colors-changed', (nextColors) => {
	const children = nextColorsSpan.children
	if (children.length !== nextColors.length) {
		nextColorsSpan.innerHTML = ''
		for (const color of nextColors) {
			const span = document.createElement('span')
			span.style.setProperty('--color', color)
			nextColorsSpan.appendChild(span)
		}
	} else {
		let i = 0
		for (const child of children) {
			(child as HTMLElement).style.setProperty('--color', nextColors[i])
			i++
		}
	}
})

INSTANCE.resetGame()

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js');
}