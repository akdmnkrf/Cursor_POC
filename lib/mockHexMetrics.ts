const MAX_INT_32 = 0x7fffffff;

function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) & MAX_INT_32;
}

function toRange(seed: number, min: number, max: number): number {
  const span = max - min + 1;
  return min + (seed % span);
}

export function getStableOrderCount(hexId: string): number {
  return toRange(hashString(`order:${hexId}`), 0, 1000);
}

export function getStableCpEstimation(hexId: string): number {
  return toRange(hashString(`cp:${hexId}`), 120, 2000);
}
