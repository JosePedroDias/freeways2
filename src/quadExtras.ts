import { Graphics } from "pixi.js";
import { Quadtree, Circle, Line } from '@timohausmann/quadtree-ts';

export function getAllObjects(qt: Quadtree<any>):any[] {
    const set = new Set();
    function parseMe(el:any) {
        if (el.objects.length > 0) {
            for (let o of el.objects) {
                set.add(o);
            }
        }
        for (let node of el.nodes) {
            parseMe(node);
        }
    }
    parseMe(qt);
    return Array.from(set);
}

const CIRCLE_FILL = 0xFF00FF;

export function updateQuadTreeGraphics(qt: Quadtree<any>, gfx:Graphics) {
    const objects = getAllObjects(qt);
    gfx.clear();
    gfx.lineStyle(0);
    for (let obj of objects) {
        if (obj instanceof Circle) {
            gfx.beginFill(CIRCLE_FILL, 0.5);
            gfx.drawCircle(obj.x, obj.y, obj.r);
            gfx.endFill();
        }
    }
}

function circleCircleCollides(c1:Circle, c2:Circle):boolean {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const sumRs = c1.r + c2.r;
    return Math.abs(dx*dx + dy*dy) < sumRs * sumRs;
}

function lineLineCollides(l1:Line, l2:Line):boolean {
    const det = (l1.x2 - l1.x1) * (l2.y2 - l2.y1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1);
    if (det === 0) return false;
    const lambda = ((l2.y2 - l2.y1) * (l2.x2 - l1.x1) + (l2.x1 - l2.x2) * (l2.y2 - l1.y1)) / det;
    const gamma = ((l1.y1 - l1.y2) * (l2.x2 - l1.x1) + (l1.x2 - l1.x1) * (l2.y2 - l1.y1)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
}

// circle-circle
// line-line
export function onlyColliding(testObj:any, candidates:any[]):any[] {
    const collided:any[] = [];
    if (testObj instanceof Circle) {
        for (let candidate of candidates) {
            if (candidate === testObj) continue;
            if (candidate instanceof Circle) {
                if (circleCircleCollides(testObj, candidate)) {
                    collided.push(candidate);
                }
            }
            else {
                throw new Error('unsupported');
            }
        }
    }
    else if (testObj instanceof Line) {
        for (let candidate of candidates) {
            if (candidate === testObj) continue;
            if (candidate instanceof Line) {
                if (lineLineCollides(testObj, candidate)) {
                    collided.push(candidate);
                }
            }
            else {
                throw new Error('unsupported');
            }
        }
    }
    else {
        throw new Error('unsupported');
    }
    return collided;
}
