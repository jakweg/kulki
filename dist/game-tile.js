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
exports.GameTile = void 0;
const color_ball_1 = require("./color-ball");
class GameTile {
    constructor(game, positionX, positionY) {
        this.game = game;
        this.positionX = positionX;
        this.positionY = positionY;
        this.myBall = null;
        this.element = document.createElement('div');
        this.element.classList.add('tile');
        this.element.style.setProperty('--x', positionX.toString());
        this.element.style.setProperty('--y', positionY.toString());
        this.game.notifyIamEmpty(this);
        this.element.addEventListener('click', () => this.game.notifyIWasClicked(this));
        console.log(this.element);
        this.element.addEventListener('mouseenter', () => this.game.notifyIWasHovered(this));
    }
    get myColor() {
        var _a;
        return ((_a = this.myBall) === null || _a === void 0 ? void 0 : _a.color) || null;
    }
    set isPreview(v) {
        if (v)
            this.element.classList.add('preview');
        else
            this.element.classList.remove('preview');
    }
    set isTraveledTile(v) {
        if (v)
            this.element.classList.add('traveled');
        else
            this.element.classList.remove('traveled');
    }
    onUnselected() {
        var _a;
        this.element.classList.remove('selected');
        (_a = this.myBall) === null || _a === void 0 ? void 0 : _a.onUnselected();
    }
    onSelected() {
        var _a;
        this.element.style.setProperty('--color', this.myColor);
        this.element.classList.add('selected');
        (_a = this.myBall) === null || _a === void 0 ? void 0 : _a.onSelected();
    }
    setMyBallColor(color) {
        var _a;
        (_a = this.myBall) === null || _a === void 0 ? void 0 : _a.remove();
        this.myBall = new color_ball_1.default(this.game, this.positionX, this.positionY, color);
        this.game.notifyIDoHaveBall(this);
        this.game.notifyIRequireCheck(this);
    }
    clearColor() {
        var _a;
        (_a = this.myBall) === null || _a === void 0 ? void 0 : _a.remove();
        this.myBall = null;
        this.game.notifyIamEmpty(this);
    }
    transferBallByPath(other, steps) {
        return __awaiter(this, void 0, void 0, function* () {
            console.assert(other !== this);
            console.assert(!other.myColor);
            console.assert(!!this.myColor);
            console.assert(!other.myBall);
            console.assert(!!this.myBall);
            yield this.myBall.moveByPath(steps);
            other.myBall = this.myBall;
            other.game.notifyIDoHaveBall(other);
            other.game.notifyIRequireCheck(other);
            this.myBall = null;
            this.game.notifyIamEmpty(this);
        });
    }
}
exports.GameTile = GameTile;
exports.default = GameTile;
console.log('xd');
