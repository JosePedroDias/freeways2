export function simplifyNumber(n: number, digits = 1): number {
  const s = n.toFixed(digits);
  return parseFloat(s);
}
