import { Segment } from './segment';

import { Graphics, Point } from 'pixi.js';

import { combinationsOnce, combine2, pairUp } from './combinatorial';
import { angleBetweenVersors, dist, getVersor, lerp2 } from './geometry';
import { getRandomColor2 } from './colors';

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
      l1a.y + lambda * (l1b.y - l1a.y),
    );
  }
  return false;
}

export function isPointInsideLineSegment(
  p: Point,
  a: Point,
  b: Point,
): boolean {
  const v1 = getVersor(a, p);
  const v2 = getVersor(p, b);
  const ang = angleBetweenVersors(v1, v2);
  return (Math.abs(ang) < Math.PI/2);
}

export function doesSegmentSelfIntersect(segment: Segment): boolean {
  const pairs = pairUp(segment.points);
  const combs = combinationsOnce(pairs.length, false);
  for (const [pi1, pi2] of combs) {
    const [l1a, l1b] = pairs[pi1];
    const [l2a, l2b] = pairs[pi2];
    if (lineLineCollides(l1a, l1b, l2a, l2b)) {
      return true;
    }
  }
  return false;
}

type Edge = {
  from: Point;
  to: Point;
  points: Point[];
};

export function segmentsToGraph(segments: Segment[], gfx: Graphics) {
  const edges: Edge[] = [];
  const vertices: Point[] = [];

  const ints = [];

  gfx.clear();
  const segmentIndices = combinationsOnce(segments.length, true);
  for (const [si1, si2] of segmentIndices) {
    const seg1 = segments[si1];
    const seg2 = segments[si2];
    const pairs1 = pairUp(seg1.points);
    const pairs2 = pairUp(seg2.points);
    let int: Point | false = false;
    for (const [[l1a, l1b], [l2a, l2b]] of combine2(pairs1, pairs2)) {
      if ((int = lineLineCollidesAt(l1a, l1b, l2a, l2b))) {
        gfx.beginFill(0xffffff, 0.75);
        gfx.drawCircle(int.x, int.y, 5);
        gfx.endFill();

        ints.push({ vertex: int, touching: [si1, si2] });
        vertices.push(int);
      }
    }
  }

  for (let i = 0; i < segments.length; ++i) {
    const points = segments[i].points;
    const lookFor = ints
      .filter((int) => int.touching.includes(i))
      .map((int) => ({
        vertex: int.vertex,
        bestIndex: -1,
        smallestDistance: -1,
      }));
    for (const [idx, p] of Object.entries(points)) {
      for (const lf of lookFor) {
        const d = dist(p, lf.vertex);
        if (lf.smallestDistance === -1 || lf.smallestDistance > d) {
          lf.smallestDistance = d;
          lf.bestIndex = +idx;
        }
      }
    }
    lookFor.sort((a, b) => a.bestIndex - b.bestIndex);
    const pairs = pairUp(lookFor);
    for (const [a, b] of pairs) {
      const from = a.vertex;
      const to = b.vertex;
      let edgePoints = points.slice(a.bestIndex, b.bestIndex);
      
      if (edgePoints.length < 2) {
        edgePoints = [
          lerp2(from, to, 0.1),
          lerp2(from, to, 0.9),
        ];
      }
      else if (edgePoints.length === 2) {
        edgePoints.splice(1, 0, lerp2(edgePoints[0], edgePoints[1], 0.66));
        edgePoints.splice(1, 0, lerp2(edgePoints[0], edgePoints[1], 0.33));
      }
      else if (edgePoints.length === 3) {
        edgePoints.splice(2, 0, lerp2(edgePoints[1], edgePoints[2], 0.5));
        edgePoints.splice(1, 0, lerp2(edgePoints[0], edgePoints[1], 0.5));
      }

      if (!isPointInsideLineSegment(edgePoints[0], from, edgePoints[1])) {
        edgePoints.shift();
      }
      if (!isPointInsideLineSegment(edgePoints[edgePoints.length-1], to, edgePoints[edgePoints.length-2])) {
        edgePoints.pop();
      }

      const firstP = edgePoints[0];
      if (dist(firstP, from) > 1) {
        edgePoints.unshift(lerp2(from, firstP, 0.1));
      }
      const lastP = edgePoints.at(-1) as Point;
      if (dist(lastP, to) > 1) {
        edgePoints.push(lerp2(to, lastP, 0.1));
      }

      const edge = {
        from,
        to,
        points: edgePoints,
      };
      edges.push(edge);
      gfx.lineStyle({
        width: 4,
        color: getRandomColor2(64, 200, 64, 200, 64, 200),
        join: 'round',
        cap: 'round',
      } as any);
      for (const [i, p] of Object.entries(edge.points)) {
        if (i === '0') gfx.moveTo(p.x, p.y);
        else gfx.lineTo(p.x, p.y);
      }
    }
  }

  console.log('vertices', vertices);
  console.log('edges', edges);
}
