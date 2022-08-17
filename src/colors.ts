export function getRandomColor(): number {
  return Math.floor(Math.random() * 256 * 256 * 256);
}

function randInt(n: number) {
  return Math.floor(Math.random() * n);
}

const POW256_1 = 256;
const POW256_2 = 256 * 256;

export function getRandomColor2(
  minR: number,
  maxR: number,
  minG: number,
  maxG: number,
  minB: number,
  maxB: number,
): number {
  const r = minR + randInt(maxR - minR);
  const g = minG + randInt(maxG - minG);
  const b = minB + randInt(maxB - minB);
  return Math.floor(POW256_2 * r + POW256_1 * g + b);
}
