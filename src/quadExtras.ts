import { Graphics } from 'pixi.js';
import { Quadtree, Circle, Line } from '@timohausmann/quadtree-ts';

export function getAllObjects(qt: Quadtree<any>): any[] {
  const set = new Set();
  function parseMe(el: any) {
    if (el.objects.length > 0) {
      for (const o of el.objects) {
        set.add(o);
      }
    }
    for (const node of el.nodes) {
      parseMe(node);
    }
  }
  parseMe(qt);
  return Array.from(set);
}

const CIRCLE_FILL = 0xff00ff;
const EXTRA_FILL = 0xaaaa00;

export function updateQuadTreeGraphics(
  qt: Quadtree<any>,
  gfx: Graphics,
  extraShapes: any[] = [],
) {
  const objects = [...getAllObjects(qt), ...extraShapes];
  gfx.clear();
  gfx.lineStyle(0);
  for (const obj of objects) {
    if (obj instanceof Circle) {
      if (extraShapes.includes(obj)) gfx.beginFill(EXTRA_FILL, 0.5);
      else gfx.beginFill(CIRCLE_FILL, 0.25);
      gfx.drawCircle(obj.x, obj.y, obj.r);
      gfx.endFill();
    }
  }
}

function circleCircleCollides(c1: Circle, c2: Circle): boolean {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const sumRs = c1.r + c2.r;
  return Math.abs(dx * dx + dy * dy) < sumRs * sumRs;
}

function lineLineCollides(l1: Line, l2: Line): boolean {
  const det =
    (l1.x2 - l1.x1) * (l2.y2 - l2.y1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1);
  if (det === 0) return false;
  const lambda =
    ((l2.y2 - l2.y1) * (l2.x2 - l1.x1) + (l2.x1 - l2.x2) * (l2.y2 - l1.y1)) /
    det;
  const gamma =
    ((l1.y1 - l1.y2) * (l2.x2 - l1.x1) + (l1.x2 - l1.x1) * (l2.y2 - l1.y1)) /
    det;
  return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
}

// circle-circle
// line-line
export function onlyColliding(testObj: any, candidates: any[]): any[] {
  const collided: any[] = [];
  if (testObj instanceof Circle) {
    for (const candidate of candidates) {
      if (candidate === testObj) continue;
      if (candidate instanceof Circle) {
        if (circleCircleCollides(testObj, candidate)) {
          collided.push(candidate);
        }
      } /*else if (candidate instanceof Line) {
        // ASSUME LINE ~ CIRCLE CENTERED ON ITS CENTER AND RADIUS DIST/2
        const x = (candidate.x1 + candidate.x2) / 2;
        const y = (candidate.y1 + candidate.y2) / 2;
        const r = distXY(candidate.x1 - candidate.x2, candidate.y1 - candidate.y2) / 2;
        if (circleCircleCollides(testObj, new Circle({ x, y, r }))) {
          collided.push(candidate);
        }
      } */ else {
        throw new Error('unsupported');
      }
    }
  } else if (testObj instanceof Line) {
    for (const candidate of candidates) {
      if (candidate === testObj) continue;
      if (candidate instanceof Line) {
        if (lineLineCollides(testObj, candidate)) {
          collided.push(candidate);
        }
      } else {
        throw new Error('unsupported');
      }
    }
  } else {
    throw new Error('unsupported');
  }
  return collided;
}
