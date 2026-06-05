export interface Coords {
  x: number;
  y: number;
  z: number;
}

export function distance(a: Coords, b: Coords): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function sphereSearch(
  center: Coords,
  radius: number,
  systems: Coords[],
): Coords[] {
  return systems.filter((s) => distance(center, s) <= radius);
}

export function midpoint(a: Coords, b: Coords): Coords {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
  };
}

export function bearing(
  a: Coords,
  b: Coords,
): { azimuth: number; elevation: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  const horz = Math.sqrt(dx * dx + dz * dz);
  return {
    azimuth: Math.atan2(dx, dz) * (180 / Math.PI),
    elevation: Math.atan2(dy, horz) * (180 / Math.PI),
  };
}
