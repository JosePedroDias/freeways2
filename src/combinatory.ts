export function combinationsOnce(
  n: number,
  ignoreMyself: boolean,
): [number, number][] {
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

export function combine2<A, B>(arrA: A[], arrB: B[]): [A, B][] {
  const result: [A, B][] = [];

  const lA = arrA.length;
  const lB = arrB.length;

  for (let i = 0; i < lA; ++i) {
    for (let j = 0; j < lB; ++j) {
      result.push([arrA[i], arrB[j]]);
    }
  }

  return result;
}

export function pairUp<T>(arr: T[]): [T, T][] {
  const result: [T, T][] = [];
  const l = arr.length;
  for (let i = 0; i < l - 1; ++i) {
    result.push([arr[i], arr[i + 1]]);
  }
  return result;
}
