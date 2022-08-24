import { describe, expect, it } from 'vitest';

import { rgbToNumber, numberToRgb } from './colors';

describe('rgbToNumber', () => {
  it('basic', () => {
    expect(rgbToNumber(0, 0, 0)).toEqual(0);
    expect(rgbToNumber(0, 0, 255)).toEqual(255);
    expect(rgbToNumber(0, 255, 0)).toEqual(65280);
    expect(rgbToNumber(255, 0, 0)).toEqual(16711680);
    expect(rgbToNumber(255, 255, 255)).toEqual(16777215);
  });
});

describe('numberToRgb', () => {
  it('basic', () => {
    expect(numberToRgb(0)).toEqual([0, 0, 0]);
    expect(numberToRgb(255)).toEqual([0, 0, 255]);
    expect(numberToRgb(65280)).toEqual([0, 255, 0]);
    expect(numberToRgb(16711680)).toEqual([255, 0, 0]);
    expect(numberToRgb(16777215)).toEqual([255, 255, 255]);
  });
});
