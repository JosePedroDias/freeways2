import { Graphics, Point } from 'pixi.js';
import { Quadtree, Line } from '@timohausmann/quadtree-ts';

import { rotate90Degrees, distXY, dist, getVersor } from './geometry';
import { H, MIN_DIST, ROAD_COLORS, ROAD_RADIUS, W } from './constants';
import { pairUp } from './combinatorial';

export type Segment = Point[];

function computeVersors(seg: Segment): Point[] {
  const pairs = pairUp(seg);
  const versors: Point[] = [];
  for (const [a, b] of pairs) {
    versors.push(getVersor(a, b));
  }
  return versors;
}

export function updateSegmentGfx(segment: Segment, gfx: Graphics) {
  gfx.clear();

  gfx.lineStyle(0);

  const path: Point[] = [];
  const versors = computeVersors(segment);

  const l = segment.length;
  if (l < 2) return;

  const cases = [
    { from: 0, sign: 1 },
    { from: l - 1, sign: -1 },
  ];

  for (const { from, sign } of cases) {
    let i = from;
    let step = 0;
    while (step++ < l) {
      const isLastOne = i === l - 1;
      const doAverage = i > 0 && !isLastOne;
      const p = segment[i];
      let v_;
      if (doAverage) {
        const v0 = versors[i - 1];
        const v1 = versors[i];
        v_ = new Point(v0.x + v1.x, v0.y + v1.y);
        const d = distXY(v_.x, v_.y);
        v_.x /= d;
        v_.y /= d;
      } else {
        v_ = versors[isLastOne ? i - 1 : i];
      }
      const v = rotate90Degrees(v_);
      v.x = p.x + ROAD_RADIUS * sign * v.x;
      v.y = p.y + ROAD_RADIUS * sign * v.y;
      path.push(v);

      i = i + sign;
    }
  }

  gfx.beginFill(ROAD_COLORS[0], 1);
  gfx.drawPolygon(path);
  gfx.endFill();
}

export function onMove(
  segment: Segment,
  gfx: Graphics,
  p: Point,
): [Point, Point] | undefined {
  const lastP = segment.at(-1);
  if (!lastP) {
    segment.push(p.clone());
    updateSegmentGfx(segment, gfx);
  } else {
    const d = dist(lastP, p);
    if (d > MIN_DIST) {
      segment.push(p.clone());

      updateSegmentGfx(segment, gfx);

      const v0 = segment.at(-2);
      const v1 = segment.at(-1);
      if (v0 && v1) {
        return [v0, v1];
      }
    }
  }
  return undefined;
}

// TODO DITCH THIS
export const qtSegments = new Quadtree({
  width: W,
  height: H,
  maxObjects: 10, // optional, default: 10
  maxLevels: 4, // optional, default:  4
});

export function updateSegmentsQT(segments: Segment[]) {
  qtSegments.clear();
  for (const seg of segments) {
    for (const [p1, p2] of pairUp(seg)) {
      qtSegments.insert(
        new Line({
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
        }),
      );
    }
  }
}
