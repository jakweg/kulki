import Game from './game';
import { getLostText, init as initLanguage } from './lang';

const scoreSpan = document.getElementById('score')
const nextColorsSpan = document.getElementById('next-colors')

const readSerializeState = () => {
	try {
		return localStorage.getItem('lastGame')
	} catch (_) {
		// ignore
	}
}

let oldInstance: Game | undefined = undefined
const startGame = (ignoreSerialized: boolean) => {
	oldInstance?.terminate()
	const board = document.getElementById('board')
	const instance = oldInstance = new Game({
		boardElement: board,
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
		requestAnimationFrame(() => requestAnimationFrame(() => alert(getLostText(score))))
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
	instance.deserializeGameOrReset(ignoreSerialized ? undefined : readSerializeState())
}

document.getElementById('reset-btn').addEventListener('click', () => startGame(true))
startGame(false)

if ((location.port === '' || location.port === '443') && 'serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js');
}

let lastSerializationDate = Date.now()
const performSerialization = () => {
	const doRealPerform = () => {
		const now = Date.now();
		if (now - lastSerializationDate < 500) return
		lastSerializationDate = now
		try {
			const state = oldInstance?.serialize()
			localStorage.setItem('lastGame', state || '')
		} catch (_) {
			// ignore
		}
	}
	if (document.getElementById('board').classList.contains('moves-in-progress'))
		setTimeout(performSerialization, 500)
	else
		doRealPerform()
}

document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'visible') return
	performSerialization()
})

window.addEventListener('blur', () => performSerialization())
initLanguage()
document.body.classList.remove('loading')

window.addEventListener("beforeinstallprompt", e => e.preventDefault());