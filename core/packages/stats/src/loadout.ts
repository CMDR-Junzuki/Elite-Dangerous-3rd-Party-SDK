import type {
  Bulkhead,
  HardpointModule,
  InternalModule,
  Ship,
  StandardModule,
} from "@elite-dangerous-sdk/data";

export interface EquippedModule {
  module: StandardModule | HardpointModule | InternalModule;
  slotIndex: number;
  engineering?: ModuleEngineering;
}

export interface ModuleEngineering {
  blueprintName: string;
  grade: number;
  experimentalEffect?: string;
}

export interface Loadout {
  ship: Ship;
  bulkhead: Bulkhead;
  standardModules: (EquippedModule | null)[];
  hardpointModules: (EquippedModule | null)[];
  internalModules: (EquippedModule | null)[];
  cargo: number;
  fuel: number;
  fuelCapacity: number;
}

export function calculateTotalMass(loadout: Loadout): number {
  let mass = loadout.ship.properties.hullMass;
  mass += loadout.bulkhead.mass;

  for (const mod of [
    ...loadout.standardModules,
    ...loadout.hardpointModules,
    ...loadout.internalModules,
  ]) {
    if (mod) {
      mass += mod.module.mass ?? 0;
    }
  }

  mass += loadout.cargo;
  mass += loadout.fuel;

  return mass;
}
