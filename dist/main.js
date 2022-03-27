/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/color-ball.ts":
/*!***************************!*\
  !*** ./src/color-ball.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.ColorBall = void 0;\nclass ColorBall {\n    constructor(game, initialPositionX, initialPositionY, color) {\n        this.game = game;\n        this.color = color;\n        this.removed = false;\n        console.assert(!!color);\n        this.posX = initialPositionX;\n        this.posY = initialPositionY;\n        this.element = document.createElement('div');\n        this.element.classList.add('ball', 'added');\n        setTimeout(() => this.element.classList.remove('added'), 1000);\n        this.updateElementProperties();\n        game.addBallElement(this.element);\n    }\n    onSelected() {\n        this.element.classList.add('selected');\n    }\n    onUnselected() {\n        this.element.classList.remove('selected');\n    }\n    moveByPath(steps) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const realSteps = new Set();\n            const length = steps.length;\n            let lastStep = steps[0];\n            let lastOffset = { x: 0, y: 0 };\n            for (let i = 1; i < length; i++) {\n                const it = steps[i];\n                const offset = { x: it.x - lastStep.x, y: it.y - lastStep.y };\n                if (offset.x !== lastOffset.x || offset.y !== lastOffset.y) {\n                    lastOffset = offset;\n                    realSteps.add(lastStep);\n                }\n                lastStep = it;\n            }\n            realSteps.add(lastStep);\n            for (const step of realSteps) {\n                yield this.moveTo(step.x, step.y);\n            }\n        });\n    }\n    remove() {\n        if (this.removed)\n            return;\n        this.removed = true;\n        this.element.classList.add('removed');\n        setTimeout(() => {\n            this.element.remove();\n        }, 500);\n    }\n    moveTo(x, y) {\n        return this.game.scheduler.schedule(() => {\n            this.posX = x;\n            this.posY = y;\n            this.updateElementProperties();\n        });\n    }\n    updateElementProperties() {\n        console.assert(!this.removed);\n        const func = this.element.style.setProperty.bind(this.element.style);\n        func('--x', this.posX.toString());\n        func('--y', this.posY.toString());\n        func('--color', this.color);\n    }\n}\nexports.ColorBall = ColorBall;\nexports.default = ColorBall;\n\n\n//# sourceURL=webpack:///./src/color-ball.ts?");

/***/ }),

/***/ "./src/colors.ts":
/*!***********************!*\
  !*** ./src/colors.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.randomBallColor = exports.GAME_COLORS = void 0;\nexports.GAME_COLORS = ['blue', 'red', 'orange', 'green', 'yellow', 'purple', 'white'];\nexports.randomBallColor = () => exports.GAME_COLORS[Math.random() * exports.GAME_COLORS.length | 0];\n\n\n//# sourceURL=webpack:///./src/colors.ts?");

/***/ }),

/***/ "./src/event-emitter.ts":
/*!******************************!*\
  !*** ./src/event-emitter.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.EventEmitter = void 0;\nclass EventEmitter {\n    constructor() {\n        this.eventListeners = new Map();\n    }\n    addEventListener(type, callback) {\n        console.assert(!!callback);\n        const list = this.eventListeners.get(type);\n        if (list)\n            list.add(callback);\n        else\n            this.eventListeners.set(type, new Set([callback]));\n    }\n    emit(type, extra = undefined) {\n        const list = this.eventListeners.get(type);\n        if (list)\n            for (const listener of list.values())\n                listener(extra);\n    }\n}\nexports.EventEmitter = EventEmitter;\nexports.default = EventEmitter;\n\n\n//# sourceURL=webpack:///./src/event-emitter.ts?");

/***/ }),

/***/ "./src/game-scheduler.ts":
/*!*******************************!*\
  !*** ./src/game-scheduler.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.GameScheduler = void 0;\nconst event_emitter_1 = __webpack_require__(/*! ./event-emitter */ \"./src/event-emitter.ts\");\nclass GameScheduler extends event_emitter_1.default {\n    constructor(interval = 250) {\n        super();\n        this.interval = interval;\n        this.nextAllowedStart = 0;\n        this.enqueuedTasks = [];\n    }\n    schedule(task) {\n        console.assert(!!task);\n        return new Promise((resolve, reject) => {\n            const wasEmpty = this.enqueuedTasks.length === 0;\n            this.enqueuedTasks.push(() => {\n                try {\n                    task();\n                }\n                catch (e) {\n                    reject(e);\n                }\n                resolve();\n            });\n            if (wasEmpty) {\n                this.emit('queue-non-empty');\n                if (this.nextAllowedStart < Date.now()) {\n                    this.executeTask();\n                }\n                else {\n                    clearTimeout(this.timeoutId);\n                    this.timeoutId = setTimeout(this.executeTask.bind(this), this.interval);\n                }\n            }\n        });\n    }\n    executeTask() {\n        this.nextAllowedStart = Date.now() + this.interval;\n        const task = this.enqueuedTasks.shift();\n        console.assert(!!task);\n        task();\n        if (this.enqueuedTasks.length !== 0)\n            this.timeoutId = setTimeout(this.executeTask.bind(this), this.interval);\n        else\n            this.emit('queue-empty');\n    }\n}\nexports.GameScheduler = GameScheduler;\nexports.default = GameScheduler;\n\n\n//# sourceURL=webpack:///./src/game-scheduler.ts?");

/***/ }),

/***/ "./src/game-tile.ts":
/*!**************************!*\
  !*** ./src/game-tile.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.GameTile = void 0;\nconst color_ball_1 = __webpack_require__(/*! ./color-ball */ \"./src/color-ball.ts\");\nclass GameTile {\n    constructor(game, positionX, positionY) {\n        this.game = game;\n        this.positionX = positionX;\n        this.positionY = positionY;\n        this.myBall = null;\n        this.element = document.createElement('div');\n        this.element.classList.add('tile');\n        this.element.style.setProperty('--x', positionX.toString());\n        this.element.style.setProperty('--y', positionY.toString());\n        this.game.notifyIamEmpty(this);\n        this.element.addEventListener('click', () => this.game.notifyIWasClicked(this));\n        this.element.addEventListener('mouseenter', () => this.game.notifyIWasHovered(this));\n    }\n    get myColor() {\n        var _a;\n        return ((_a = this.myBall) === null || _a === void 0 ? void 0 : _a.color) || null;\n    }\n    set isPreview(v) {\n        if (v)\n            this.element.classList.add('preview');\n        else\n            this.element.classList.remove('preview');\n    }\n    set isTraveledTile(v) {\n        if (v)\n            this.element.classList.add('traveled');\n        else\n            this.element.classList.remove('traveled');\n    }\n    onUnselected() {\n        var _a;\n        this.element.classList.remove('selected');\n        (_a = this.myBall) === null || _a === void 0 ? void 0 : _a.onUnselected();\n    }\n    onSelected() {\n        var _a;\n        this.element.style.setProperty('--color', this.myColor);\n        this.element.classList.add('selected');\n        (_a = this.myBall) === null || _a === void 0 ? void 0 : _a.onSelected();\n    }\n    setMyBallColor(color) {\n        var _a;\n        (_a = this.myBall) === null || _a === void 0 ? void 0 : _a.remove();\n        this.myBall = new color_ball_1.default(this.game, this.positionX, this.positionY, color);\n        this.game.notifyIDoHaveBall(this);\n        this.game.notifyIRequireCheck(this);\n    }\n    clearColor() {\n        var _a;\n        (_a = this.myBall) === null || _a === void 0 ? void 0 : _a.remove();\n        this.myBall = null;\n        this.game.notifyIamEmpty(this);\n    }\n    transferBallByPath(other, steps) {\n        return __awaiter(this, void 0, void 0, function* () {\n            console.assert(other !== this);\n            console.assert(!other.myColor);\n            console.assert(!!this.myColor);\n            console.assert(!other.myBall);\n            console.assert(!!this.myBall);\n            yield this.myBall.moveByPath(steps);\n            other.myBall = this.myBall;\n            other.game.notifyIDoHaveBall(other);\n            other.game.notifyIRequireCheck(other);\n            this.myBall = null;\n            this.game.notifyIamEmpty(this);\n        });\n    }\n}\nexports.GameTile = GameTile;\nexports.default = GameTile;\n\n\n//# sourceURL=webpack:///./src/game-tile.ts?");

/***/ }),

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Game = void 0;\nconst colors_1 = __webpack_require__(/*! ./colors */ \"./src/colors.ts\");\nconst event_emitter_1 = __webpack_require__(/*! ./event-emitter */ \"./src/event-emitter.ts\");\nconst game_scheduler_1 = __webpack_require__(/*! ./game-scheduler */ \"./src/game-scheduler.ts\");\nconst game_tile_1 = __webpack_require__(/*! ./game-tile */ \"./src/game-tile.ts\");\nconst path_finder_1 = __webpack_require__(/*! ./path-finder */ \"./src/path-finder.ts\");\nconst table2d_1 = __webpack_require__(/*! ./table2d */ \"./src/table2d.ts\");\nconst time_meter_1 = __webpack_require__(/*! ./time-meter */ \"./src/time-meter.ts\");\nclass Game extends event_emitter_1.default {\n    constructor(options) {\n        super();\n        this.options = options;\n        this.scheduler = new game_scheduler_1.default();\n        this.emptyTiles = new Set();\n        this.tilesRequireCheck = new Set();\n        this.nextBallColors = [];\n        this.selectedTile = null;\n        this.score = 0;\n        this.isGameOver = false;\n        this.boardTiles = new table2d_1.default(this.options.boardWidth, this.options.boardHeight);\n        this.scheduler.addEventListener('queue-empty', () => this.onSchedulerQueueEmptyStatusChanged(true));\n        this.scheduler.addEventListener('queue-non-empty', () => this.onSchedulerQueueEmptyStatusChanged(false));\n    }\n    generateTiles() {\n        this.options.boardElement.innerHTML = '';\n        this.emptyTiles.clear();\n        this.tilesRequireCheck.clear();\n        this.boardTiles.fill((x, y) => {\n            const tile = new game_tile_1.default(this, x, y);\n            this.options.boardElement.appendChild(tile.element);\n            return tile;\n        });\n        // this.boardTiles.get(1, 1).myColor = Colors.orange\n        // this.boardTiles.get(0, 1).myColor = Colors.orange\n        // this.boardTiles.get(1, 0).myColor = Colors.orange\n    }\n    addBallElement(element) {\n        this.options.boardElement.appendChild(element);\n    }\n    notifyIamEmpty(me) {\n        this.emptyTiles.add(me);\n    }\n    notifyIDoHaveBall(me) {\n        this.emptyTiles.delete(me);\n    }\n    notifyIWasClicked(me) {\n        var _a;\n        return __awaiter(this, void 0, void 0, function* () {\n            console.assert(!!me);\n            this.boardTiles.forEach(obj => obj.isPreview = false);\n            if (this.selectedTile === me) {\n                me === null || me === void 0 ? void 0 : me.onUnselected();\n                this.selectedTile = null;\n                return;\n            }\n            if (me.myColor) {\n                (_a = this.selectedTile) === null || _a === void 0 ? void 0 : _a.onUnselected();\n                me.onSelected();\n                this.selectedTile = me;\n            }\n            else if (this.selectedTile) {\n                const path = path_finder_1.default(this.selectedTile.positionX, this.selectedTile.positionY, me.positionX, me.positionY, (x, y) => { var _a; return ((_a = this.boardTiles.getOrUndefined(x, y)) === null || _a === void 0 ? void 0 : _a.myColor) === null; });\n                if (path) {\n                    this.selectedTile.onUnselected();\n                    path.forEach(({ x, y }) => this.boardTiles.get(x, y).isTraveledTile = true);\n                    yield this.selectedTile.transferBallByPath(me, path);\n                    this.selectedTile = null;\n                    const count = yield this.executePostMoveCheck();\n                    if (count === 0 || this.options.boardWidth * this.options.boardHeight === this.emptyTiles.size)\n                        yield this.scheduler.schedule(() => {\n                            for (let i = 0; i < this.options.spawnBallsAfterEveryMoveCount; i++) {\n                                this.placeRandomBall();\n                                this.executePostMoveCheck();\n                            }\n                        });\n                    yield this.executePostMoveCheck();\n                    path.forEach(({ x, y }) => this.boardTiles.get(x, y).isTraveledTile = false);\n                    this.checkLoseCondition();\n                }\n            }\n        });\n    }\n    notifyIWasHovered(me) {\n        console.assert(!!me);\n        if (this.selectedTile) {\n            const path = path_finder_1.default(this.selectedTile.positionX, this.selectedTile.positionY, me.positionX, me.positionY, (x, y) => { var _a; return ((_a = this.boardTiles.getOrUndefined(x, y)) === null || _a === void 0 ? void 0 : _a.myColor) === null; });\n            if (path) {\n                this.boardTiles.forEach(obj => obj.isPreview = false);\n                path.forEach(({ x, y }) => this.boardTiles.get(x, y).isPreview = true);\n            }\n        }\n    }\n    notifyIRequireCheck(me) {\n        this.tilesRequireCheck.add(me);\n    }\n    placeRandomBall() {\n        if (this.checkLoseCondition())\n            return;\n        let index = Math.random() * this.emptyTiles.size | 0;\n        const iterator = this.emptyTiles.values();\n        while (index-- > 0)\n            iterator.next();\n        const tile = iterator.next().value;\n        tile.setMyBallColor(this.getRandomBallColor());\n    }\n    checkLoseCondition() {\n        if (this.isGameOver)\n            return true;\n        if (this.emptyTiles.size === 0) {\n            this.isGameOver = true;\n            this.options.boardElement.classList.add('game-over');\n            this.emit('game-over', this.score);\n            return true;\n        }\n        return false;\n    }\n    executePostMoveCheck() {\n        return __awaiter(this, void 0, void 0, function* () {\n            const tilesToBeCleared = new Set();\n            const getWithThisColorInRow = (color, startX, startY, offsetX, offsetY, dontDoReverse = false) => {\n                const list = new Set();\n                let currentX = startX;\n                let currentY = startY;\n                if (dontDoReverse) {\n                    currentX += offsetX;\n                    currentY += offsetY;\n                }\n                while (true) {\n                    const tile = this.boardTiles.getOrUndefined(currentX, currentY);\n                    if (!tile)\n                        break;\n                    if (tile.myColor !== color)\n                        break;\n                    list.add(tile);\n                    currentX += offsetX;\n                    currentY += offsetY;\n                }\n                if (!dontDoReverse)\n                    getWithThisColorInRow(color, startX, startY, -offsetX, -offsetY, true)\n                        .forEach(e => list.add(e));\n                if (!dontDoReverse) {\n                    if (list.size >= this.options.requiredSameColorsBallsToClearCount)\n                        for (const gameTile of list) {\n                            tilesToBeCleared.add(gameTile);\n                        }\n                }\n                return list;\n            };\n            for (const tile of this.tilesRequireCheck) {\n                const color = tile.myColor;\n                if (!color)\n                    continue;\n                getWithThisColorInRow(color, tile.positionX, tile.positionY, 1, 0);\n                getWithThisColorInRow(color, tile.positionX, tile.positionY, 0, 1);\n                getWithThisColorInRow(color, tile.positionX, tile.positionY, 1, 1);\n                getWithThisColorInRow(color, tile.positionX, tile.positionY, -1, 1);\n            }\n            if (tilesToBeCleared.size !== 0) {\n                yield this.scheduler.schedule(() => tilesToBeCleared.forEach(e => e.clearColor()));\n                this.score += tilesToBeCleared.size;\n                this.emit('score-changed', this.score);\n            }\n            this.tilesRequireCheck.clear();\n            return tilesToBeCleared.size;\n        });\n    }\n    resetGame() {\n        this.nextBallColors.length = 0;\n        this.score = 0;\n        this.isGameOver = false;\n        this.options.boardElement.classList.remove('game-over');\n        this.emit('score-changed', this.score);\n        this.generateTiles();\n        for (let i = 0; i < this.options.spawnBallsAfterEveryMoveCount; i++) {\n            this.nextBallColors.push(colors_1.randomBallColor());\n        }\n        for (let i = 0; i < this.options.initialBallsCount; i++) {\n            this.placeRandomBall();\n        }\n        this.executePostMoveCheck();\n    }\n    onSchedulerQueueEmptyStatusChanged(empty) {\n        if (empty) {\n            this.options.boardElement.classList.remove('moves-in-progress');\n        }\n        else\n            this.options.boardElement.classList.add('moves-in-progress');\n    }\n    getRandomBallColor() {\n        const next = this.nextBallColors.shift();\n        this.nextBallColors.push(colors_1.randomBallColor());\n        this.emit('next-ball-colors-changed', this.nextBallColors);\n        return next;\n    }\n}\n__decorate([\n    time_meter_1.TimeMeter()\n], Game.prototype, \"notifyIWasClicked\", null);\n__decorate([\n    time_meter_1.TimeMeter()\n], Game.prototype, \"placeRandomBall\", null);\n__decorate([\n    time_meter_1.TimeMeter()\n], Game.prototype, \"executePostMoveCheck\", null);\nexports.Game = Game;\nexports.default = Game;\n\n\n//# sourceURL=webpack:///./src/game.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.INSTANCE = void 0;\nconst game_1 = __webpack_require__(/*! ./game */ \"./src/game.ts\");\nexports.INSTANCE = new game_1.default({\n    boardElement: document.getElementById('board'),\n    boardHeight: 9,\n    boardWidth: 9,\n    spawnBallsAfterEveryMoveCount: 3,\n    initialBallsCount: 5,\n    requiredSameColorsBallsToClearCount: 5,\n});\n// @ts-ignore\nwindow.INSTANCE = exports.INSTANCE;\nconst scoreSpan = document.getElementById('score');\nconst nextColorsSpan = document.getElementById('next-colors');\nexports.INSTANCE.addEventListener('score-changed', (score) => {\n    scoreSpan.innerText = `${score}`;\n});\nexports.INSTANCE.addEventListener('game-over', (score) => {\n    requestAnimationFrame(() => requestAnimationFrame(() => alert('Koniec gry, twój wynik to ' + score)));\n});\nexports.INSTANCE.addEventListener('next-ball-colors-changed', (nextColors) => {\n    const children = nextColorsSpan.children;\n    if (children.length !== nextColors.length) {\n        nextColorsSpan.innerHTML = '';\n        for (const color of nextColors) {\n            const span = document.createElement('span');\n            span.style.setProperty('--color', color);\n            nextColorsSpan.appendChild(span);\n        }\n    }\n    else {\n        let i = 0;\n        for (const child of children) {\n            child.style.setProperty('--color', nextColors[i]);\n            i++;\n        }\n    }\n});\nexports.INSTANCE.resetGame();\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/path-finder.ts":
/*!****************************!*\
  !*** ./src/path-finder.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.findPath = void 0;\nconst sorted_list_1 = __webpack_require__(/*! ./sorted-list */ \"./src/sorted-list.ts\");\n/**\n * Finds the shortest path between two points, doesn't include cross tile moves for example from [0,0]->[1,1]\n * Returns list of positions or null if failed to find a path\n * @param sx x coordinate of start\n * @param sy y coordinate of start\n * @param dx x coordinate of destination\n * @param dy y coordinate of destination\n * @param tester callback which will be executed to check if tile is walkable or not\n * @returns list of positions between points start and destination, index 0 is start and last index is destination element, returns null if failed to determine path\n */\nexports.findPath = (sx, sy, dx, dy, tester) => {\n    const calculateCost = (x1, y1, x2, y2) => (Math.abs(x1 - x2) + Math.abs(y1 - y2)) * 10;\n    const calculateCostG = (x, y) => calculateCost(x, y, sx, sy);\n    const calculateCostH = (x, y) => calculateCost(x, y, dx, dy);\n    const createNode = (x, y) => {\n        const costG = calculateCostG(x, y);\n        const costH = calculateCostH(x, y);\n        return {\n            x, y, costH, costG,\n            costF: costG + costH,\n        };\n    };\n    const fCostComparator = (o1, o2) => o1.costF < o2.costF;\n    const openNodes = new sorted_list_1.default(fCostComparator);\n    const closedNodes = new sorted_list_1.default(fCostComparator);\n    const executeWithWalkableNeighboursNotInClosed = (x, y, callback) => {\n        x--;\n        if (tester(x, y) && !closedNodes.has(n => x === n.x && y === n.y))\n            callback(createNode(x, y));\n        x++;\n        y--;\n        if (tester(x, y) && !closedNodes.has(n => x === n.x && y === n.y))\n            callback(createNode(x, y));\n        x++;\n        y++;\n        if (tester(x, y) && !closedNodes.has(n => x === n.x && y === n.y))\n            callback(createNode(x, y));\n        x--;\n        y++;\n        if (tester(x, y) && !closedNodes.has(n => x === n.x && y === n.y))\n            callback(createNode(x, y));\n    };\n    openNodes.add(createNode(sx, sy));\n    while (true) {\n        const current = openNodes.getAndRemoveFirst();\n        if (!current) {\n            // unable to find path :/\n            return null;\n        }\n        closedNodes.add(current);\n        if (current.x === dx && current.y === dy) {\n            // found path!\n            const stack = [];\n            let tmp = current;\n            while (tmp) {\n                stack.unshift(tmp);\n                tmp = tmp.parent;\n            }\n            return stack;\n        }\n        executeWithWalkableNeighboursNotInClosed(current.x, current.y, (neighbour) => {\n            if (!openNodes.has(e => e.x === neighbour.x && e.y === neighbour.y)) {\n                neighbour.parent = current;\n                openNodes.add(neighbour);\n            }\n        });\n    }\n};\nexports.default = exports.findPath;\n\n\n//# sourceURL=webpack:///./src/path-finder.ts?");

/***/ }),

/***/ "./src/sorted-list.ts":
/*!****************************!*\
  !*** ./src/sorted-list.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.SortedList = void 0;\nclass SortedList {\n    constructor(isFirstLess) {\n        this.isFirstLess = isFirstLess;\n        this.mList = [];\n    }\n    add(obj) {\n        for (let i = 0; i < this.mList.length; i++) {\n            if (this.isFirstLess(obj, this.mList[i])) {\n                this.mList.splice(i, 0, obj);\n                return;\n            }\n        }\n        this.mList.push(obj);\n    }\n    getFirst() {\n        return this.mList[0];\n    }\n    has(check) {\n        return !!this.mList.find(check);\n    }\n    getAndRemoveFirst() {\n        return this.mList.shift();\n    }\n}\nexports.SortedList = SortedList;\nexports.default = SortedList;\n\n\n//# sourceURL=webpack:///./src/sorted-list.ts?");

/***/ }),

/***/ "./src/table2d.ts":
/*!************************!*\
  !*** ./src/table2d.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Table2d = void 0;\nclass Table2d {\n    constructor(width, height) {\n        this.width = width;\n        this.height = height;\n        console.assert(width > 0, 'width > 0');\n        console.assert(height > 0, 'height > 0');\n        this._array = new Array(width * height);\n    }\n    get(x, y) {\n        console.assert(x >= 0 && x < this.width, 'invalid x ' + x);\n        console.assert(y >= 0 && y < this.height, 'invalid y ' + y);\n        return this._array[x + y * this.width];\n    }\n    getOrUndefined(x, y) {\n        if (x >= 0 && x < this.width)\n            if (y >= 0 && y < this.height)\n                return this._array[x + y * this.width];\n    }\n    fill(generator) {\n        for (let x = 0; x < this.width; x++) {\n            for (let y = 0; y < this.height; y++) {\n                this._array[x + y * this.width] = generator(x, y);\n            }\n        }\n    }\n    forEach(func) {\n        this._array.forEach(func);\n    }\n}\nexports.Table2d = Table2d;\nexports.default = Table2d;\n\n\n//# sourceURL=webpack:///./src/table2d.ts?");

/***/ }),

/***/ "./src/time-meter.ts":
/*!***************************!*\
  !*** ./src/time-meter.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.TimeMeter = void 0;\nfunction TimeMeter() {\n    return function (target, key, descriptor) {\n        const original = descriptor.value;\n        descriptor.value = function (...args) {\n            const start = performance.now();\n            try {\n                return original.apply(this, args);\n            }\n            finally {\n                const end = performance.now();\n                console.log('Executing function', key, 'took', end - start, 'ms');\n            }\n        };\n        return descriptor;\n    };\n}\nexports.TimeMeter = TimeMeter;\n\n\n//# sourceURL=webpack:///./src/time-meter.ts?");

/***/ })

/******/ });