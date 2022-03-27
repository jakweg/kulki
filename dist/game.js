"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const colors_1 = require("./colors");
const event_emitter_1 = require("./event-emitter");
const game_scheduler_1 = require("./game-scheduler");
const game_tile_1 = require("./game-tile");
const path_finder_1 = require("./path-finder");
const table2d_1 = require("./table2d");
class Game extends event_emitter_1.default {
    constructor(options) {
        super();
        this.options = options;
        this.scheduler = new game_scheduler_1.default();
        this.emptyTiles = new Set();
        this.tilesRequireCheck = new Set();
        this.nextBallColors = [];
        this.selectedTile = null;
        this.score = 0;
        this.isGameOver = false;
        this.boardTiles = new table2d_1.default(this.options.boardWidth, this.options.boardHeight);
        this.scheduler.addEventListener('queue-empty', () => this.onSchedulerQueueEmptyStatusChanged(true));
        this.scheduler.addEventListener('queue-non-empty', () => this.onSchedulerQueueEmptyStatusChanged(false));
    }
    generateTiles() {
        this.options.boardElement.innerHTML = '';
        this.emptyTiles.clear();
        this.tilesRequireCheck.clear();
        this.boardTiles.fill((x, y) => {
            const tile = new game_tile_1.default(this, x, y);
            this.options.boardElement.appendChild(tile.element);
            return tile;
        });
        // this.boardTiles.get(1, 1).myColor = Colors.orange
        // this.boardTiles.get(0, 1).myColor = Colors.orange
        // this.boardTiles.get(1, 0).myColor = Colors.orange
    }
    addBallElement(element) {
        this.options.boardElement.appendChild(element);
    }
    notifyIamEmpty(me) {
        this.emptyTiles.add(me);
    }
    notifyIDoHaveBall(me) {
        this.emptyTiles.delete(me);
    }
    notifyIWasClicked(me) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.assert(!!me);
            if (this.selectedTile === me) {
                me === null || me === void 0 ? void 0 : me.onUnselected();
                this.selectedTile = null;
                return;
            }
            if (me.myColor) {
                (_a = this.selectedTile) === null || _a === void 0 ? void 0 : _a.onUnselected();
                me.onSelected();
                this.selectedTile = me;
            }
            else if (this.selectedTile) {
                const path = path_finder_1.default(this.selectedTile.positionX, this.selectedTile.positionY, me.positionX, me.positionY, (x, y) => { var _a; return ((_a = this.boardTiles.getOrUndefined(x, y)) === null || _a === void 0 ? void 0 : _a.myColor) === null; });
                if (path) {
                    this.selectedTile.onUnselected();
                    yield this.selectedTile.transferBallByPath(me, path);
                    this.selectedTile = null;
                    const count = yield this.executePostMoveCheck();
                    if (count === 0 || this.options.boardWidth * this.options.boardHeight === this.emptyTiles.size)
                        yield this.scheduler.schedule(() => {
                            for (let i = 0; i < this.options.spawnBallsAfterEveryMoveCount; i++) {
                                this.placeRandomBall();
                                this.executePostMoveCheck();
                            }
                        });
                    yield this.executePostMoveCheck();
                    this.checkLoseCondition();
                }
            }
        });
    }
    notifyIWasHovered(me) {
        console.log('hover');
        console.assert(!!me);
        if (this.selectedTile) {
            const path = path_finder_1.default(this.selectedTile.positionX, this.selectedTile.positionY, me.positionX, me.positionY, (x, y) => { var _a; return ((_a = this.boardTiles.getOrUndefined(x, y)) === null || _a === void 0 ? void 0 : _a.myColor) === null; });
            if (path) {
                this.boardTiles.forEach(obj => obj.isPreview = false);
                path.forEach(({ x, y }) => this.boardTiles.get(x, y).isPreview = true);
            }
        }
    }
    notifyIRequireCheck(me) {
        this.tilesRequireCheck.add(me);
    }
    placeRandomBall() {
        if (this.checkLoseCondition())
            return;
        let index = Math.random() * this.emptyTiles.size | 0;
        const iterator = this.emptyTiles.values();
        while (index-- > 0)
            iterator.next();
        const tile = iterator.next().value;
        tile.setMyBallColor(this.getRandomBallColor());
    }
    checkLoseCondition() {
        if (this.isGameOver)
            return true;
        if (this.emptyTiles.size === 0) {
            this.isGameOver = true;
            this.options.boardElement.classList.add('game-over');
            this.emit('game-over', this.score);
            return true;
        }
        return false;
    }
    executePostMoveCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            const tilesToBeCleared = new Set();
            const getWithThisColorInRow = (color, startX, startY, offsetX, offsetY, dontDoReverse = false) => {
                const list = new Set();
                let currentX = startX;
                let currentY = startY;
                if (dontDoReverse) {
                    currentX += offsetX;
                    currentY += offsetY;
                }
                while (true) {
                    const tile = this.boardTiles.getOrUndefined(currentX, currentY);
                    if (!tile)
                        break;
                    if (tile.myColor !== color)
                        break;
                    list.add(tile);
                    currentX += offsetX;
                    currentY += offsetY;
                }
                if (!dontDoReverse)
                    getWithThisColorInRow(color, startX, startY, -offsetX, -offsetY, true)
                        .forEach(e => list.add(e));
                if (!dontDoReverse) {
                    if (list.size >= this.options.requiredSameColorsBallsToClearCount)
                        for (const gameTile of list) {
                            tilesToBeCleared.add(gameTile);
                        }
                }
                return list;
            };
            for (const tile of this.tilesRequireCheck) {
                const color = tile.myColor;
                if (!color)
                    continue;
                getWithThisColorInRow(color, tile.positionX, tile.positionY, 1, 0);
                getWithThisColorInRow(color, tile.positionX, tile.positionY, 0, 1);
                getWithThisColorInRow(color, tile.positionX, tile.positionY, 1, 1);
                getWithThisColorInRow(color, tile.positionX, tile.positionY, -1, 1);
            }
            if (tilesToBeCleared.size !== 0) {
                yield this.scheduler.schedule(() => tilesToBeCleared.forEach(e => e.clearColor()));
                this.score += tilesToBeCleared.size;
                this.emit('score-changed', this.score);
            }
            this.tilesRequireCheck.clear();
            return tilesToBeCleared.size;
        });
    }
    resetGame() {
        this.nextBallColors.length = 0;
        this.score = 0;
        this.isGameOver = false;
        this.options.boardElement.classList.remove('game-over');
        this.emit('score-changed', this.score);
        this.generateTiles();
        for (let i = 0; i < this.options.spawnBallsAfterEveryMoveCount; i++) {
            this.nextBallColors.push(colors_1.randomBallColor());
        }
        for (let i = 0; i < this.options.initialBallsCount; i++) {
            this.placeRandomBall();
        }
        this.executePostMoveCheck();
    }
    onSchedulerQueueEmptyStatusChanged(empty) {
        if (empty) {
            this.options.boardElement.classList.remove('moves-in-progress');
        }
        else
            this.options.boardElement.classList.add('moves-in-progress');
    }
    getRandomBallColor() {
        const next = this.nextBallColors.shift();
        this.nextBallColors.push(colors_1.randomBallColor());
        this.emit('next-ball-colors-changed', this.nextBallColors);
        return next;
    }
}
exports.Game = Game;
exports.default = Game;
