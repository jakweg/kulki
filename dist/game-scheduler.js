"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameScheduler = void 0;
const event_emitter_1 = require("./event-emitter");
class GameScheduler extends event_emitter_1.default {
    constructor(interval = 350) {
        super();
        this.interval = interval;
        this.nextAllowedStart = 0;
        this.enqueuedTasks = [];
    }
    schedule(task) {
        console.assert(!!task);
        return new Promise((resolve, reject) => {
            const wasEmpty = this.enqueuedTasks.length === 0;
            this.enqueuedTasks.push(() => {
                try {
                    task();
                }
                catch (e) {
                    reject(e);
                }
                resolve();
            });
            if (wasEmpty) {
                this.emit('queue-non-empty');
                if (this.nextAllowedStart < Date.now()) {
                    this.executeTask();
                }
                else {
                    clearTimeout(this.timeoutId);
                    this.timeoutId = setTimeout(this.executeTask.bind(this), this.interval);
                }
            }
        });
    }
    executeTask() {
        this.nextAllowedStart = Date.now() + this.interval;
        const task = this.enqueuedTasks.shift();
        console.assert(!!task);
        task();
        if (this.enqueuedTasks.length !== 0)
            this.timeoutId = setTimeout(this.executeTask.bind(this), this.interval);
        else
            this.emit('queue-empty');
    }
}
exports.GameScheduler = GameScheduler;
exports.default = GameScheduler;
