export const GAME_COLORS = ['blue', 'red', 'orange', 'green', 'yellow', 'purple', 'white']

// noinspection JSUnusedGlobalSymbols
export type GameColor = typeof GAME_COLORS[number]
export default GameColor

export const randomBallColor = (): GameColor => GAME_COLORS[Math.random() * GAME_COLORS.length | 0]
