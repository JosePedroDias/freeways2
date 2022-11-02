import { describe, expect, it } from 'vitest';

import { rgbToNumber, numberToRgb, rgbToHsv, hsvToRgb } from './colors';

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

describe('rgbToHsv', () => {
  it('basic', () => {
    expect(rgbToHsv(0, 0, 0)).toEqual([0, 0, 0]);
    expect(rgbToHsv(127.5, 127.5, 127.5)).toEqual([0, 0, 0.5]);
    expect(rgbToHsv(255, 255, 255)).toEqual([0, 0, 1]);
    expect(rgbToHsv(255, 0, 0)).toEqual([0, 1, 1]);
    expect(rgbToHsv(0, 255, 0)).toEqual([0.3333333333333333, 1, 1]);
    expect(rgbToHsv(0, 0, 255)).toEqual([0.6666666666666666, 1, 1]);
    expect(rgbToHsv(255, 255, 0)).toEqual([0.16666666666666666, 1, 1]);
    expect(rgbToHsv(0, 255, 255)).toEqual([0.5, 1, 1]);
    expect(rgbToHsv(255, 0, 255)).toEqual([0.8333333333333334, 1, 1]);
  });
});

describe('hsvToRgb', () => {
  it('basic', () => {
    expect(hsvToRgb(0, 0, 0)).toEqual([0, 0, 0]);
    expect(hsvToRgb(0, 0, 0.5)).toEqual([127.5, 127.5, 127.5]);
    expect(hsvToRgb(0, 0, 1)).toEqual([255, 255, 255]);
    expect(hsvToRgb(0, 1, 1)).toEqual([255, 0, 0]);
    expect(hsvToRgb(0.3333333333333333, 1, 1)).toEqual([0, 255, 0]);
    expect(hsvToRgb(0.6666666666666666, 1, 1)).toEqual([0, 0, 255]);
    expect(hsvToRgb(0.16666666666666666, 1, 1)).toEqual([255, 255, 0]);
    expect(hsvToRgb(0.5, 1, 1)).toEqual([0, 255, 255]);
    expect(hsvToRgb(0.8333333333333334, 1, 1)).toEqual([255, 0, 255]);
  });
});
