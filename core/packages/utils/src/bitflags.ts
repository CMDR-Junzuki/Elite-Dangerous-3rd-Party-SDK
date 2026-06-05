/** Parse a bitflag field from Status.json - returns array of set flag names */
export function parseBitflags(
  value: number,
  flags: Record<string, number>,
): string[] {
  const result: string[] = [];
  for (const [name, bit] of Object.entries(flags)) {
    if (value & bit) result.push(name);
  }
  return result;
}

/** Check if a specific flag bit is set */
export function hasFlag(value: number, flag: number): boolean {
  return (value & flag) === flag;
}

/** Create a combined flags value from multiple flags */
export function combineFlags(...flags: number[]): number {
  return flags.reduce((acc, f) => acc | f, 0);
}
