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

export function rgbToNumber(r: number, g: number, b: number): number {
  return POW256_2 * r + POW256_1 * g + b;
}

export function numberToRgb(clr: number): [number, number, number] {
  const b = clr % POW256_1;
  const rest = (clr - b) / POW256_1;
  const g = rest % POW256_1;
  const r = (rest - g) / POW256_1;
  return [r, g, b];
}

// TODO: rgb <-> hsv

export function hsvToRgb(
  h: number,
  s: number,
  v: number,
): [number, number, number] {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r, g, b: number;
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    default:
      (r = v), (g = p), (b = q);
      break;
  }

  return [
    255 * r,
    255 * g,
    255 * b,
    //Math.round(r * 255),
    //Math.round(g * 255),
    //Math.round(b * 255)
  ];
}

export function rgbToHsv(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h;
  const s = max === 0 ? 0 : d / max;
  const v = max / 255;

  switch (max) {
    case min:
      h = 0;
      break;
    case r:
      h = g - b + d * (g < b ? 6 : 0);
      h /= 6 * d;
      break;
    case g:
      h = b - r + d * 2;
      h /= 6 * d;
      break;
    case b:
      h = r - g + d * 4;
      h /= 6 * d;
      break;
    default:
      h = 0; // ?
  }

  return [h, s, v];
}
