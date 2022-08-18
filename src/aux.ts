import { Point, Rectangle } from 'pixi.js';

const DIGITS = 1;

export function simplifyNumber(n: number): number {
  const s = n.toFixed(DIGITS);
  return parseFloat(s);
}

export function simplifyPoint(p: Point): Point {
  return new Point(simplifyNumber(p.x), simplifyNumber(p.y));
}

export function simplifyPointToPair(p: Point): [number, number] {
  return [simplifyNumber(p.x), simplifyNumber(p.y)];
}

export function simplifyRectangleToArray4(
  r: Rectangle,
): [number, number, number, number] {
  return [
    simplifyNumber(r.x),
    simplifyNumber(r.y),
    simplifyNumber(r.width),
    simplifyNumber(r.height),
  ];
}
