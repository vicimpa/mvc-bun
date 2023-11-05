export function numberCount(value: number, count = 2) {
  return ('0'.repeat(count) + value).slice(-count);
}