/**
 * Convert CAPI sparse object arrays to proper arrays with nulls for gaps.
 * CAPI returns arrays as objects: {0: item0, 2: item2, ...}
 */
export function listify<T>(
  obj: Record<string, T> | T[] | undefined | null,
): (T | null)[] {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;

  const keys = Object.keys(obj)
    .map(Number)
    .filter((k) => !Number.isNaN(k));
  if (keys.length === 0) return [];

  const maxKey = Math.max(...keys);
  const result: (T | null)[] = new Array(maxKey + 1).fill(null);
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}
