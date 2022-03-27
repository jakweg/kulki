"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table2d = void 0;
class Table2d {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        console.assert(width > 0, 'width > 0');
        console.assert(height > 0, 'height > 0');
        this._array = new Array(width * height);
    }
    get(x, y) {
        console.assert(x >= 0 && x < this.width, 'invalid x ' + x);
        console.assert(y >= 0 && y < this.height, 'invalid y ' + y);
        return this._array[x + y * this.width];
    }
    getOrUndefined(x, y) {
        if (x >= 0 && x < this.width)
            if (y >= 0 && y < this.height)
                return this._array[x + y * this.width];
    }
    fill(generator) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this._array[x + y * this.width] = generator(x, y);
            }
        }
    }
    forEach(func) {
        this._array.forEach(func);
    }
}
exports.Table2d = Table2d;
exports.default = Table2d;
