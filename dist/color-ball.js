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
exports.ColorBall = void 0;
class ColorBall {
    constructor(game, initialPositionX, initialPositionY, color) {
        this.game = game;
        this.color = color;
        this.removed = false;
        console.assert(!!color);
        this.posX = initialPositionX;
        this.posY = initialPositionY;
        this.element = document.createElement('div');
        this.element.classList.add('ball', 'added');
        setTimeout(() => this.element.classList.remove('added'), 1000);
        this.updateElementProperties();
        game.addBallElement(this.element);
    }
    onSelected() {
        this.element.classList.add('selected');
    }
    onUnselected() {
        this.element.classList.remove('selected');
    }
    moveByPath(steps) {
        return __awaiter(this, void 0, void 0, function* () {
            const realSteps = new Set();
            const length = steps.length;
            let lastStep = steps[0];
            let lastOffset = { x: 0, y: 0 };
            for (let i = 1; i < length; i++) {
                const it = steps[i];
                const offset = { x: it.x - lastStep.x, y: it.y - lastStep.y };
                if (offset.x !== lastOffset.x || offset.y !== lastOffset.y) {
                    lastOffset = offset;
                    realSteps.add(lastStep);
                }
                lastStep = it;
            }
            realSteps.add(lastStep);
            for (const step of realSteps) {
                yield this.moveTo(step.x, step.y);
            }
        });
    }
    remove() {
        if (this.removed)
            return;
        this.removed = true;
        this.element.classList.add('removed');
        setTimeout(() => {
            this.element.remove();
        }, 500);
    }
    moveTo(x, y) {
        return this.game.scheduler.schedule(() => {
            this.posX = x;
            this.posY = y;
            this.updateElementProperties();
        });
    }
    updateElementProperties() {
        console.assert(!this.removed);
        const func = this.element.style.setProperty.bind(this.element.style);
        func('--x', this.posX.toString());
        func('--y', this.posY.toString());
        func('--color', this.color);
    }
}
exports.ColorBall = ColorBall;
exports.default = ColorBall;
