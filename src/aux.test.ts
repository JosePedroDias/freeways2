import { describe, expect, it } from 'vitest';

import { Point } from 'pixi.js';
import {
  dist,
  getVersor,
  getAngleFromVersor,
  getVersorFromAngle,
  rotate90Degrees,
  simplifyNumber,
  combinationsOnce,
  combine2,
  pairUp,
} from './aux';

describe('dist', () => {
  it('dist 1', () => {
    expect(dist(new Point(0, 0), new Point(1, 0))).toBe(1);
  });
});

describe('getVersor', () => {
  it('45 deg', () => {
    const v = getVersor(new Point(1, 0), new Point(0, 1));
    expect(v.x).toBeCloseTo(-0.707);
    expect(v.y).toBeCloseTo(0.707);
  });
});

describe('getAngleFromVersor', () => {
  it('45 deg', () => {
    expect(getAngleFromVersor(new Point(0.707, -0.707))).toBe(-Math.PI / 4);
  });
});

describe('getVersorFromAngle', () => {
  it('0 deg', () => {
    expect(getVersorFromAngle(0)).toEqual(new Point(1, 0));
  });
});

describe('rotate90Degrees', () => {
  it('45 deg', () => {
    expect(rotate90Degrees(new Point(1, 0))).toEqual(new Point(0, -1));
  });
});

describe('simplifyNumber', () => {
  it('basic', () => {
    expect(simplifyNumber(0.333333)).toBe(0.3);
    expect(simplifyNumber(0.333333, 1)).toBe(0.3);
    expect(simplifyNumber(0.333333, 2)).toBe(0.33);
    expect(simplifyNumber(0.6666, 2)).toBe(0.67);
  });
});

describe('combinationsOnce', () => {
  it('basic', () => {
    expect(combinationsOnce(3, true)).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
    expect(combinationsOnce(3, false)).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
      [2, 2],
    ]);
  });
});

describe('combine2', () => {
  it('basic', () => {
    expect(combine2(['A', 'B'], [1, 2, 3])).toEqual([
      ['A', 1],
      ['A', 2],
      ['A', 3],
      ['B', 1],
      ['B', 2],
      ['B', 3],
    ]);
  });
});

describe('pairUp', () => {
  it('basic', () => {
    expect(pairUp([1, 2, 3, 4])).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
  });
});
