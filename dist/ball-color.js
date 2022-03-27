"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BallColor;
(function (BallColor) {
    BallColor["blue"] = "blue";
    BallColor["red"] = "red";
    BallColor["orange"] = "orange";
})(BallColor = exports.BallColor || (exports.BallColor = {}));
exports.ballColors = [];
for (const ballColorKey in BallColor)
    // noinspection JSUnfilteredForInLoop
    exports.ballColors.push(BallColor[ballColorKey]);
exports.randomBallColor = () => exports.ballColors[Math.random() * exports.ballColors.length | 0];
