import type { Loadout } from "./loadout.js";
import { calculateTotalMass } from "./loadout.js";

export interface JumpRangeResult {
  current: number;
  max: number;
  fuelUsed: number;
  mass: number;
}

function getGuardianBoost(loadout: Loadout): number {
  let boost = 0;
  for (const m of loadout.internalModules) {
    if (m && (m.module as any).grp === "gfsb") {
      boost += (m.module as any).jumpboost ?? 0;
    }
  }
  return boost;
}

function calcJumpRange(
  mass: number,
  fsd: any,
  fuel: number,
  reserveFuel: number,
  guardianBoost: number,
): number {
  const maxFuel = fsd.maxfuel!;
  const fuelUsed = Math.min(fuel, maxFuel);
  const base =
    (fuelUsed / fsd.fuelmul!) ** (1 / fsd.fuelpower!) *
    (fsd.optmass! / (mass + reserveFuel));
  return base + guardianBoost;
}

export function calculateJumpRange(loadout: Loadout): JumpRangeResult | null {
  const fsdSlot = loadout.standardModules.find(
    (m: any) => m?.module.grp === "fsd",
  );
  if (!fsdSlot) return null;

  const fsd = fsdSlot.module as any;
  if (!fsd.maxfuel || !fsd.optmass || !fsd.fuelmul) return null;

  const totalMass = calculateTotalMass(loadout);
  const reserveFuel = loadout.ship.properties.reserveFuelCapacity ?? 0;
  const guardianBoost = getGuardianBoost(loadout);

  const currentFuel = Math.min(loadout.fuel, fsd.maxfuel);
  const current = calcJumpRange(
    totalMass,
    fsd,
    currentFuel,
    reserveFuel,
    guardianBoost,
  );

  const maxJumpFuel = Math.min(fsd.maxfuel, loadout.fuel);
  const remainingMass = Math.max(0, loadout.fuel - maxJumpFuel);
  const maxMass = totalMass - remainingMass;
  const max = calcJumpRange(
    maxMass,
    fsd,
    maxJumpFuel,
    reserveFuel,
    guardianBoost,
  );

  return {
    current,
    max: max >= current ? max : current,
    fuelUsed: currentFuel,
    mass: totalMass,
  };
}
