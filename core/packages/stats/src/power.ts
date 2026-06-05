import type { Loadout } from "./loadout.js";

export interface PowerResult {
  available: number;
  used: number;
  remaining: number;
  pctUsed: number;
}

export function calculatePower(loadout: Loadout): PowerResult {
  const pp = loadout.standardModules.find((m: any) => m?.module.grp === "pp");
  let available = 0;

  if (pp) {
    available = (pp.module as any).pgen ?? 0;
  }

  let used = 0;
  const allModules = [
    ...loadout.standardModules,
    ...loadout.hardpointModules,
    ...loadout.internalModules,
  ];
  for (const m of allModules) {
    if (m) {
      used += (m.module as any).power ?? 0;
    }
  }

  return {
    available,
    used,
    remaining: available - used,
    pctUsed: available > 0 ? (used / available) * 100 : 0,
  };
}
