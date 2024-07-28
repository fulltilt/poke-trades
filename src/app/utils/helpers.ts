export function fixedTwoDecimals(val: number | undefined) {
  if (!val) return undefined;
  return (Math.round(val * 100) / 100).toFixed(2);
}
