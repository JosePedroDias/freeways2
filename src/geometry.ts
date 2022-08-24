import { Point } from 'pixi.js';
import { PointArr } from './level';

export function distXY(dx: number, dy: number): number {
  return Math.sqrt(dx * dx + dy * dy);
}

export function dist(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function distSquared(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return dx * dx + dy * dy;
}

export function getVersor(p1: Point, p2: Point): Point {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (dx === 0 && dy === 0) {
    return new Point(1, 0);
  }
  return new Point(dx / d, dy / d);
}

const D = 3;
// un center
export function uct(a:Point, b:Point): [Point, Point] {
  const v = getVersor(a, b);
  const a_ = new Point(a.x - D*v.x, a.y - D*v.y);
  const b_ = new Point(b.x + D*v.x, b.y + D*v.y);
  return [a_, b_];
}

export function uctArr(a:PointArr, b:PointArr): [PointArr, PointArr] {
  const aa = new Point(a[0], a[1]);
  const bb = new Point(b[0], b[1]);
  const [cc, dd] = uct(aa, bb);
  return [
    [cc.x, cc.y],
    [dd.x, dd.y],
  ];
}

export function getAngleFromVersor(p: Point): number {
  return Math.atan2(p.y, p.x);
}

export function getVersorFromAngle(ang: number): Point {
  return new Point(Math.cos(ang), Math.sin(ang));
}

export function rotate90Degrees(p: Point): Point {
  return new Point(p.y, -p.x);
}

export function angleBetweenVersors(v1: Point, v2: Point): number {
  let dAng = getAngleFromVersor(v2) - getAngleFromVersor(v1);
  if (dAng > Math.PI) dAng -= 2 * Math.PI;
  else if (dAng < -Math.PI) dAng += 2 * Math.PI;
  return dAng;
}

export function lerp(a: number, b: number, r: number): number {
  return a * (1 - r) + b * r;
}

export function lerp2(a: Point, b: Point, r: number): Point {
  return new Point(a.x * (1 - r) + b.x * r, a.y * (1 - r) + b.y * r);
}

export function averagePoint(points: Point[]): Point {
  const avg = new Point(0, 0);
  for (const p of points) {
    avg.x += p.x;
    avg.y += p.y;
  }
  avg.x /= points.length;
  avg.y /= points.length;
  return avg;
}

export function nearestPoint(from: Point, points: Point[]): Point {
  let minDist = -1;
  let candidate: Point = new Point(0, 0);
  for (const p of points) {
    const dSq = distSquared(p, from);
    if (minDist === -1 || dSq < minDist) {
      candidate = p;
      minDist = dSq;
    }
  }
  return candidate;
}
