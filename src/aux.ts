import { Point } from 'pixi.js';

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

export function pairToPoint(pair: [number, number]): Point {
  return new Point(pair[0], pair[1]);
}
