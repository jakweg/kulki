"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPath = void 0;
const sorted_list_1 = require("./sorted-list");
/**
 * Finds the shortest path between two points, doesn't include cross tile moves for example from [0,0]->[1,1]
 * Returns list of positions or null if failed to find a path
 * @param sx x coordinate of start
 * @param sy y coordinate of start
 * @param dx x coordinate of destination
 * @param dy y coordinate of destination
 * @param tester callback which will be executed to check if tile is walkable or not
 * @returns list of positions between points start and destination, index 0 is start and last index is destination element, returns null if failed to determine path
 */
exports.findPath = (sx, sy, dx, dy, tester) => {
    const calculateCost = (x1, y1, x2, y2) => (Math.abs(x1 - x2) + Math.abs(y1 - y2)) * 10;
    const calculateCostG = (x, y) => calculateCost(x, y, sx, sy);
    const calculateCostH = (x, y) => calculateCost(x, y, dx, dy);
    const createNode = (x, y) => {
        const costG = calculateCostG(x, y);
        const costH = calculateCostH(x, y);
        return {
            x, y, costH, costG,
            costF: costG + costH,
        };
    };
    const fCostComparator = (o1, o2) => o1.costF < o2.costF;
    const openNodes = new sorted_list_1.default(fCostComparator);
    const closedNodes = new sorted_list_1.default(fCostComparator);
    const executeWithWalkableNeighboursNotInClosed = (x, y, callback) => {
        x--;
        if (tester(x, y) && !closedNodes.has(n => x === n.x && y === n.y))
            callback(createNode(x, y));
        x++;
        y--;
        if (tester(x, y) && !closedNodes.has(n => x === n.x && y === n.y))
            callback(createNode(x, y));
        x++;
        y++;
        if (tester(x, y) && !closedNodes.has(n => x === n.x && y === n.y))
            callback(createNode(x, y));
        x--;
        y++;
        if (tester(x, y) && !closedNodes.has(n => x === n.x && y === n.y))
            callback(createNode(x, y));
    };
    openNodes.add(createNode(sx, sy));
    while (true) {
        const current = openNodes.getAndRemoveFirst();
        if (!current) {
            // unable to find path :/
            return null;
        }
        closedNodes.add(current);
        if (current.x === dx && current.y === dy) {
            // found path!
            const stack = [];
            let tmp = current;
            while (tmp) {
                stack.unshift(tmp);
                tmp = tmp.parent;
            }
            return stack;
        }
        executeWithWalkableNeighboursNotInClosed(current.x, current.y, (neighbour) => {
            if (!openNodes.has(e => e.x === neighbour.x && e.y === neighbour.y)) {
                neighbour.parent = current;
                openNodes.add(neighbour);
            }
        });
    }
};
exports.default = exports.findPath;
