"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortedList = void 0;
class SortedList {
    constructor(isFirstLess) {
        this.isFirstLess = isFirstLess;
        this.mList = [];
    }
    add(obj) {
        for (let i = 0; i < this.mList.length; i++) {
            if (this.isFirstLess(obj, this.mList[i])) {
                this.mList.splice(i, 0, obj);
                return;
            }
        }
        this.mList.push(obj);
    }
    getFirst() {
        return this.mList[0];
    }
    has(check) {
        return !!this.mList.find(check);
    }
    getAndRemoveFirst() {
        return this.mList.shift();
    }
}
exports.SortedList = SortedList;
exports.default = SortedList;
