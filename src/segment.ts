import { Graphics, Point } from 'pixi.js';
import { rotate90Degrees, distXY, dist, getVersor } from './geometry';
import { MIN_DIST, ROAD_COLORS, ROAD_RADIUS } from './constants';

export type Segment = {
  points: Point[];
  versors: Point[];
};

export function updateGfx(segment: Segment, gfx: Graphics) {
  gfx.clear();

  gfx.lineStyle(0);

  const path: Point[] = [];

  const l = segment.points.length;
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
      const p = segment.points[i];
      let v_;
      if (doAverage) {
        const v0 = segment.versors[i - 1];
        const v1 = segment.versors[i];
        v_ = new Point(v0.x + v1.x, v0.y + v1.y);
        const d = distXY(v_.x, v_.y);
        v_.x /= d;
        v_.y /= d;
      } else {
        v_ = segment.versors[isLastOne ? i - 1 : i];
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

  /* if (true) {
        gfx.beginFill(0xFFFFFF, 0.25);
        for (let {x, y} of segment.points) {
            gfx.drawCircle(x, y, 1.5);
        }
        gfx.endFill();
    } */
}

export function onMove(
  segment: Segment,
  gfx: Graphics,
  p: Point,
): [Point, Point] | undefined {
  const lastP = segment.points.at(-1);
  if (!lastP) {
    segment.points.push(p.clone());
    updateGfx(segment, gfx);
  } else {
    const d = dist(lastP, p);
    if (d > MIN_DIST) {
      segment.points.push(p.clone());
      const v = getVersor(p, lastP);
      segment.versors.push(v);

      /* const v0 = segment.versors.at(-2);
            const v1 = segment.versors.at(-1);
            if (v0 && v1) {
                const ang = angleBetweenVersors(v0, v1);
                console.log( (RAD_TO_DEG * ang).toFixed(1) );
            } */

      updateGfx(segment, gfx);

      const v0 = segment.points.at(-2);
      const v1 = segment.points.at(-1);
      if (v0 && v1) {
        return [v0, v1];
      }
    }
  }
  return undefined;
}
