import { describe, expect, it } from 'vitest';

import { simplifyNumber } from './aux';

describe('simplifyNumber', () => {
  it('basic', () => {
    expect(simplifyNumber(0.333333)).toBe(0.3);
    expect(simplifyNumber(0.333333, 1)).toBe(0.3);
    expect(simplifyNumber(0.333333, 2)).toBe(0.33);
    expect(simplifyNumber(0.6666, 2)).toBe(0.67);
  });
});
