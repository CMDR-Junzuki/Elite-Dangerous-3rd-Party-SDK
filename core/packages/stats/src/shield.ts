import type { Loadout } from "./loadout.js";

export interface ShieldResult {
  absoluteShield: number;
  generatorStrength: number;
  boostersStrength: number;
  shieldAddition: number;
  shieldMultiplier: number;
  shieldBoosters: number;
  kinetic: number;
  thermal: number;
  explosive: number;
}

const SG_GROUPS = new Set(["sg", "bsg", "psg"]);

function getShieldMultiplier(mass: number, sg: any): number {
  const minMass = sg.minmass!;
  const optMass = sg.optmass!;
  const maxMass = sg.maxmass!;
  const minMul = sg.minmul!;
  const optMul = sg.optmul!;
  const maxMul = sg.maxmul!;

  if (!optMass || mass <= 1) return optMul ?? 1;

  const xnorm = Math.min(1, (maxMass - mass) / (maxMass - minMass));
  const exponent =
    Math.log((optMul - minMul) / (maxMul - minMul)) /
    Math.log(Math.min(1, (maxMass - optMass) / (maxMass - minMass)));
  const ynorm = xnorm ** exponent;
  return minMul + ynorm * (maxMul - minMul);
}

function diminishingReturnsShields(
  shieldMult: number,
  combinedMult: number,
): number {
  const max = shieldMult * 0.7;
  if (combinedMult < max) {
    return max / 2 + (max - max / 2) * (combinedMult / max);
  }
  return combinedMult;
}

export function calculateShield(loadout: Loadout): ShieldResult {
  const baseShield = loadout.ship.properties.baseShieldStrength;
  const hullMass = loadout.ship.properties.hullMass;

  const shieldGen = loadout.internalModules.find(
    (m: any) => m && SG_GROUPS.has(m.module.grp),
  );

  let shieldMultiplier = 1;
  let generatorStrength = 0;
  let sgKinDmg = 1;
  let sgThermDmg = 1;
  let sgExplDmg = 1;

  if (shieldGen) {
    const sg = shieldGen.module as any;
    shieldMultiplier = getShieldMultiplier(hullMass, sg);
    generatorStrength = baseShield * shieldMultiplier;

    sgKinDmg = 1 - (sg.kinres ?? 0);
    sgThermDmg = 1 - (sg.thermres ?? 0);
    sgExplDmg = 1 - (sg.explres ?? 0);
  }

  let totalBoost = 1;
  let boosterKinDmg = 1;
  let boosterThermDmg = 1;
  let boosterExplDmg = 1;
  let boosterCount = 0;

  for (const hp of loadout.hardpointModules) {
    if (hp && (hp.module as any).grp === "sb") {
      const sb = hp.module as any;
      totalBoost += sb.shieldboost ?? 0;
      boosterKinDmg *= 1 - (sb.kinres ?? 0);
      boosterThermDmg *= 1 - (sb.thermres ?? 0);
      boosterExplDmg *= 1 - (sb.explres ?? 0);
      boosterCount++;
    }
  }

  totalBoost -= 1;
  const boostersStrength = generatorStrength * totalBoost;

  let shieldAddition = 0;
  for (const m of loadout.internalModules) {
    if (m && (m.module as any).grp === "gsrp") {
      shieldAddition += (m.module as any).shieldaddition ?? 0;
    }
  }

  const absoluteShield = generatorStrength + boostersStrength + shieldAddition;

  const combinedKinDmg = diminishingReturnsShields(
    sgKinDmg,
    sgKinDmg * boosterKinDmg,
  );
  const combinedThermDmg = diminishingReturnsShields(
    sgThermDmg,
    sgThermDmg * boosterThermDmg,
  );
  const combinedExplDmg = diminishingReturnsShields(
    sgExplDmg,
    sgExplDmg * boosterExplDmg,
  );

  return {
    absoluteShield,
    generatorStrength,
    boostersStrength,
    shieldAddition,
    shieldMultiplier,
    shieldBoosters: boosterCount,
    kinetic: 1 - combinedKinDmg,
    thermal: 1 - combinedThermDmg,
    explosive: 1 - combinedExplDmg,
  };
}
