export const GAME_COLORS = [...new Array(7)].map((_, i) => `c${i}`)

// noinspection JSUnusedGlobalSymbols
export type GameColor = typeof GAME_COLORS[number]
export default GameColor
