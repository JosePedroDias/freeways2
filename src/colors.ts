function randInt(n: number) {
  return Math.floor(Math.random() * n);
}

const POW256_1 = 256;
const POW256_2 = POW256_1 * POW256_1;

export function getRandomColor(
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
  return rgbToNumber(r, g, b);
}


export function rgbToNumber(r:number, g:number, b:number):number {
  return POW256_2 * r + POW256_1 * g + b;
}

export function numberToRgb(clr:number):[number, number, number] {
  const b = clr % POW256_1;
  const rest = (clr - b) / POW256_1;
  const g = rest % POW256_1;
  const r = (rest - g) / POW256_1;
  return [r, g, b];
}


// TODO: rgb <-> hsv
