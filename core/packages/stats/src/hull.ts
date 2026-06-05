import type { Loadout } from "./loadout.js";

export interface HullResult {
  hullHealth: number;
  armourHardness: number;
  effectiveHull: number;
  kineticResistance: number;
  thermalResistance: number;
  explosiveResistance: number;
  hullReinforcement: number;
}

function diminishingReturnsArmour(
  bulkheadDmg: number,
  ...hrpDmgs: number[]
): number {
  const max = Math.min(0.7, bulkheadDmg, ...hrpDmgs);
  const combined = hrpDmgs.reduce((agg, v) => agg * v, bulkheadDmg);
  const diminished = 0.35 + (max - 0.35) * (combined / max);
  if (diminished < 0.7) {
    return diminished;
  }
  return combined;
}

const HRP_GROUPS = new Set(["hr", "ghrp", "mahr"]);
const _MRP_GROUPS = new Set(["mrp", "gmrp"]);

export function calculateHull(loadout: Loadout): HullResult {
  const ship = loadout.ship.properties;
  const bh = loadout.bulkhead;

  const baseBulkheads = ship.baseArmour * (1 + (bh.hullboost ?? 0));
  let hullReinforcement = 0;
  const hullExplDmgs: number[] = [];
  const hullKinDmgs: number[] = [];
  const hullThermDmgs: number[] = [];

  for (const m of loadout.internalModules) {
    if (m && HRP_GROUPS.has((m.module as any).grp)) {
      const hrp = m.module as any;
      hullReinforcement += hrp.hullreinforcement ?? 0;
      hullExplDmgs.push(1 - (hrp.explres ?? 0));
      hullKinDmgs.push(1 - (hrp.kinres ?? 0));
      hullThermDmgs.push(1 - (hrp.thermres ?? 0));
    }
  }

  const hullHealth = baseBulkheads + hullReinforcement;
  const armourHardness = ship.hardness;

  const bhExplDmg = 1 - (bh.explres ?? 0);
  const bhKinDmg = 1 - (bh.kinres ?? 0);
  const bhThermDmg = 1 - (bh.thermres ?? 0);

  const combinedExplDmg = diminishingReturnsArmour(bhExplDmg, ...hullExplDmgs);
  const combinedKinDmg = diminishingReturnsArmour(bhKinDmg, ...hullKinDmgs);
  const combinedThermDmg = diminishingReturnsArmour(
    bhThermDmg,
    ...hullThermDmgs,
  );

  const avgResMultiplier =
    (combinedExplDmg + combinedKinDmg + combinedThermDmg) / 3;
  const effectiveHull =
    avgResMultiplier > 0 ? hullHealth / avgResMultiplier : hullHealth;

  return {
    hullHealth,
    armourHardness,
    effectiveHull,
    kineticResistance: 1 - combinedKinDmg,
    thermalResistance: 1 - combinedThermDmg,
    explosiveResistance: 1 - combinedExplDmg,
    hullReinforcement,
  };
}
