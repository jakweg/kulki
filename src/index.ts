import Game from './game';

const scoreSpan = document.getElementById('score')
const nextColorsSpan = document.getElementById('next-colors')

let oldInstance: Game | undefined = undefined
const startGame = () => {
	oldInstance?.terminate()
	const instance = oldInstance = new Game({
		boardElement: document.getElementById('board'),
		boardHeight: 9,
		boardWidth: 9,
		spawnBallsAfterEveryMoveCount: 3,
		initialBallsCount: 5,
		requiredSameColorsBallsToClearCount: 5,
	})

	instance.addEventListener('score-changed', (score) => {
		if (!instance.isActive) return
		scoreSpan.innerText = `${score}`
	})

	instance.addEventListener('game-over', (score) => {
		if (!instance.isActive) return
		requestAnimationFrame(() => requestAnimationFrame(() => alert('Koniec gry, twój wynik to ' + score)))
	})

	instance.addEventListener('next-ball-colors-changed', (nextColors) => {
		if (!instance.isActive) return
		const children = nextColorsSpan.children
		if (children.length !== nextColors.length) {
			nextColorsSpan.innerHTML = ''
			for (const color of nextColors) {
				const span = document.createElement('span')
				span.style.setProperty('--color', `var(--${color})`)
				nextColorsSpan.appendChild(span)
			}
		} else {
			let i = 0
			for (const child of children) {
				(child as HTMLElement).style.setProperty('--color', `var(--${nextColors[i]})`)
				i++
			}
		}
	})
	instance.resetGame()
}

document.getElementById('reset-btn').addEventListener('click', () => startGame())
startGame()

if ((location.port === '' || location.port === '443') && 'serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js');
}