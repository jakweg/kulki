"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSTANCE = void 0;
const game_1 = require("./game");
exports.INSTANCE = new game_1.default({
    boardElement: document.getElementById('board'),
    boardHeight: 9,
    boardWidth: 9,
    spawnBallsAfterEveryMoveCount: 3,
    initialBallsCount: 5,
    requiredSameColorsBallsToClearCount: 5,
});
// @ts-ignore
window.INSTANCE = exports.INSTANCE;
const scoreSpan = document.getElementById('score');
const nextColorsSpan = document.getElementById('next-colors');
exports.INSTANCE.addEventListener('score-changed', (score) => {
    scoreSpan.innerText = `${score}`;
});
exports.INSTANCE.addEventListener('game-over', (score) => {
    requestAnimationFrame(() => requestAnimationFrame(() => alert('Koniec gry, twój wynik to ' + score)));
});
exports.INSTANCE.addEventListener('next-ball-colors-changed', (nextColors) => {
    const children = nextColorsSpan.children;
    if (children.length !== nextColors.length) {
        nextColorsSpan.innerHTML = '';
        for (const color of nextColors) {
            const span = document.createElement('span');
            span.style.setProperty('--color', color);
            nextColorsSpan.appendChild(span);
        }
    }
    else {
        let i = 0;
        for (const child of children) {
            child.style.setProperty('--color', nextColors[i]);
            i++;
        }
    }
});
exports.INSTANCE.resetGame();
