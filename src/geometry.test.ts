import { describe, expect, it } from 'vitest';

import { Point } from 'pixi.js';
import {
  dist,
  getVersor,
  getAngleFromVersor,
  getVersorFromAngle,
  rotate90Degrees,
} from './geometry';

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
