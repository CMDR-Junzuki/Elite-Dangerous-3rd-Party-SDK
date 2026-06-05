import type { Loadout } from "./loadout.js";

export interface WeaponStat {
  name: string;
  damage: number;
  dps: number;
  sdps: number;
  burstDps?: number;
  range: number;
  falloff: number;
  shotSpeed: number;
  thermalLoad: number;
  distributorDraw: number;
  eps: number;
  hps: number;
  ammo: number;
  jitter: number;
  piercing: number;
  mount: string;
  rof: number;
  sustainedFactor: number;
}

export interface WeaponStatsResult {
  totalDps: number;
  totalSdps: number;
  weapons: WeaponStat[];
  thermalLoad: number;
  distDraw: number;
}

function calcRoF(w: any): number {
  const burst = w.burst ?? 1;
  const burstRoF = w.burstrof ?? 1;
  const fireint = w.fireint;
  const intRoF = fireint != null ? 1 / fireint : (w.rof ?? 1);
  const charge = w.charge ?? 0;
  return burst / ((burst - 1) / burstRoF + 1 / intRoF + charge);
}

function calcSustainedFactor(w: any, rof: number): number {
  const clipSize = w.clip;
  if (clipSize != null && clipSize > 0) {
    const burst = w.burst ?? 1;
    const burstRoF = w.burstrof ?? 1;
    const burstOverhead = (burst - 1) / burstRoF;
    const reload = w.reload ?? 0;
    const srof = clipSize / ((clipSize - burst) / rof + burstOverhead + reload);
    return srof / rof;
  }
  return 1;
}

export function calculateWeapons(loadout: Loadout): WeaponStatsResult {
  let totalDps = 0;
  let totalSdps = 0;
  let thermalLoad = 0;
  let distDraw = 0;
  const weapons: WeaponStat[] = [];

  for (const hp of loadout.hardpointModules) {
    if (!hp) continue;
    const w = hp.module as any;
    if (!w.damage) continue;

    const rof = calcRoF(w);
    const damagePerShot = w.damage * (w.roundspershot ?? 1);
    const dps = damagePerShot * rof;
    const sustainedFactor = calcSustainedFactor(w, rof);
    const sdps = dps * sustainedFactor;
    const eps = (w.distdraw ?? 0) * rof;
    const hps = (w.thermload ?? 0) * rof;

    let burstDps: number | undefined;
    if (w.burst && w.burst > 1 && w.burstrof) {
      burstDps = damagePerShot * w.burstrof;
    }

    totalDps += dps;
    totalSdps += sdps;
    thermalLoad += w.thermload ?? 0;
    distDraw += w.distdraw ?? 0;

    weapons.push({
      name: w.name ?? w.symbol ?? "",
      damage: w.damage,
      dps,
      sdps,
      burstDps,
      range: w.range ?? 0,
      falloff: w.falloff ?? 0,
      shotSpeed: w.shotspeed ?? 0,
      thermalLoad: w.thermload ?? 0,
      distributorDraw: w.distdraw ?? 0,
      eps,
      hps,
      ammo: w.ammo ?? 0,
      jitter: w.jitter ?? 0,
      piercing: w.piercing ?? 0,
      mount: w.mount ?? "Fixed",
      rof,
      sustainedFactor,
    });
  }

  return { totalDps, totalSdps, weapons, thermalLoad, distDraw };
}
