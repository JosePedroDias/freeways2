import { Segment } from './segment';

import { Graphics, Point } from 'pixi.js';

import { combinationsOnce, combine2, pairUp } from './combinatorial';

// https://en.wikipedia.org/wiki/Intersection_(Euclidean_geometry)#Two_lines
// https://www.codegrepper.com/code-examples/javascript/javascript+get+point+of+line+intersection
// same function as quadExtras lineLineCollides but with different types as it's called super often
export function lineLineCollides(
  l1a: Point,
  l1b: Point,
  l2a: Point,
  l2b: Point,
): boolean {
  const det =
    (l1b.x - l1a.x) * (l2b.y - l2a.y) - (l2b.x - l2a.x) * (l1b.y - l1a.y);
  if (det === 0) return false;
  const lambda =
    ((l2b.y - l2a.y) * (l2b.x - l1a.x) + (l2a.x - l2b.x) * (l2b.y - l1a.y)) /
    det;
  const gamma =
    ((l1a.y - l1b.y) * (l2b.x - l1a.x) + (l1b.x - l1a.x) * (l2b.y - l1a.y)) /
    det;
  return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
}

export function lineLineCollidesAt(
  l1a: Point,
  l1b: Point,
  l2a: Point,
  l2b: Point,
): Point | false {
  const det =
    (l1b.x - l1a.x) * (l2b.y - l2a.y) - (l2b.x - l2a.x) * (l1b.y - l1a.y);
  if (det === 0) return false;
  const lambda =
    ((l2b.y - l2a.y) * (l2b.x - l1a.x) + (l2a.x - l2b.x) * (l2b.y - l1a.y)) /
    det;
  const gamma =
    ((l1a.y - l1b.y) * (l2b.x - l1a.x) + (l1b.x - l1a.x) * (l2b.y - l1a.y)) /
    det;
  if (0 < lambda && lambda < 1 && 0 < gamma && gamma < 1) {
    return new Point(
      l1a.x + lambda * (l1b.x - l1a.x),
      l1a.y + lambda * (l1b.y - l1a.y)
    );
  }
  return false;
}

export function segmentsToGraph(segments: Segment[], gfx: Graphics) {
  gfx.clear();

  const segmentIndices = combinationsOnce(segments.length, true);
  for (const [si1, si2] of segmentIndices) {
    const seg1 = segments[si1];
    const seg2 = segments[si2];

    console.log(`segments #${si1} vs #${si2}...`);

    //if (si1 === si2) {
    // TODO
    //} else {
    const pairs1 = pairUp(seg1.points);
    const pairs2 = pairUp(seg2.points);
    let int: Point | false = false;
    for (const [[l1a, l1b], [l2a, l2b]] of combine2(pairs1, pairs2)) {
      if ((int = lineLineCollidesAt(l1a, l1b, l2a, l2b))) {
        //console.log('lines', l1a, l1b, l2a, l2b);
        console.log('int', int);
        gfx.beginFill(0xffffff, 0.75);
        gfx.drawCircle(int.x, int.y, 5);
        gfx.endFill();
      }
    }
    //}
  }
}
