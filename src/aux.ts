import { Point } from 'pixi.js';

export function distXY(dx: number, dy: number): number {
  return Math.sqrt(dx * dx + dy * dy);
}

export function dist(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
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

export function simplifyNumber(n: number, digits = 1): number {
  const s = n.toFixed(digits);
  return parseFloat(s);
}

export function combinationsOnce(n: number, ignoreMyself: boolean): [number, number][] {
  const pairs: [number, number][] = [];
  for (let a = 0; a < n; ++a) {
    for (let b = 0; b < n; ++b) {
      if (ignoreMyself && a === b) continue;
      if (a > b) continue; // don't add same pair twice
      pairs.push([a, b]);
    }
  }
  return pairs;
}
