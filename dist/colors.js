"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBallColor = exports.GAME_COLORS = void 0;
exports.GAME_COLORS = ['blue', 'red', 'orange', 'green', 'yellow', 'purple', 'white'];
exports.randomBallColor = () => exports.GAME_COLORS[Math.random() * exports.GAME_COLORS.length | 0];
