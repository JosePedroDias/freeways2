const a_charCode = 'a'.charCodeAt(0);
const A_charCode = 'A'.charCodeAt(0);

const lettersBackToIndices = new Map<string, number>();

export function getLetter(n: number, isUppercase: boolean): string {
  const charCode = isUppercase ? A_charCode : a_charCode;

  const b = [n];
  let div;

  let sp = 0;
  while (sp < b.length) {
    if (b[sp] > 25) {
      div = Math.floor(b[sp] / 26);
      b[sp + 1] = div - 1;
      b[sp] %= 26;
    }
    sp += 1;
  }

  let label = '';
  for (let i = 0; i < b.length; i += 1) {
    label = String.fromCharCode(charCode + b[i]) + label;
  }

  lettersBackToIndices.set(label, n);

  return label;
}

export function getIndexFromLetter(label: string): number {
  return lettersBackToIndices.get(label) as number; // TODO
}
