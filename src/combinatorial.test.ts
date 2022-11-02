import { describe, expect, it } from 'vitest';

import { combinationsOnce, combine2, pairUp } from './combinatorial';

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
