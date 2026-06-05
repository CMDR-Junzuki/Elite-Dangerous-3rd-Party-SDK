import {
  ON_FOOT_MODIFICATIONS,
  SUIT_BASE_STATS,
  WEAPON_BASE_STATS,
} from "@elite-dangerous-sdk/data";

export type SuitType = "dominator" | "maverick" | "artemis";
export type WeaponManufacturer = "kinematic" | "takada" | "manticore";
export type WeaponCategory = "kinetic" | "thermal" | "plasma" | "explosive";
export type WeaponSize = "primary" | "secondary";
export type FireMode = "automatic" | "semi-auto" | "burst";

export interface ResistanceValues {
  kinetic: number;
  thermal: number;
  plasma: number;
  explosive: number;
}

export interface SuitStats {
  suitType: SuitType;
  shield: number;
  shieldRegen: number;
  battery: number;
  health: number;
  emergencyAir: number;
  sprintDuration: number;
  backpackCapacity: number;
  ammoCapacity: number;
  meleeDamage: number;
  combatMovementSpeed: number;
  resistance: ResistanceValues;
  jumpAssist: boolean;
  nightVision: boolean;
  enhancedTracking: boolean;
  quieterFootsteps: boolean;
  reducedToolDrain: boolean;
}

export interface WeaponStats {
  name: string;
  manufacturer: WeaponManufacturer;
  category: WeaponCategory;
  size: WeaponSize;
  fireMode: FireMode;
  grade: number;
  dps: number;
  headshotMultiplier: number;
  effectiveRange: number;
  magazineSize: number;
  reserveAmmo: number;
  reloadTime: number;
  handlingSpeed: number;
  recoil: number;
  stowedReloading: boolean;
  audioMasking: boolean;
  noiseSuppressor: boolean;
  scopeMagnification: boolean;
  hipFireAccuracy: number;
}

export function calculateSuitStats(
  suitType: SuitType,
  modifications: string[],
): SuitStats {
  const base = SUIT_BASE_STATS[suitType];

  const result: SuitStats = {
    suitType,
    shield: base.shield,
    shieldRegen: base.shieldRegen,
    battery: base.battery,
    health: base.health,
    emergencyAir: base.emergencyAir,
    sprintDuration: 1,
    backpackCapacity: 1,
    ammoCapacity: 1,
    meleeDamage: 1,
    combatMovementSpeed: 0,
    resistance: { ...base.resistance },
    jumpAssist: false,
    nightVision: false,
    enhancedTracking: false,
    quieterFootsteps: false,
    reducedToolDrain: false,
  };

  for (const modName of modifications) {
    const mod = ON_FOOT_MODIFICATIONS[modName];
    if (!mod || mod.type !== "suit") continue;
    if (mod.compatibleSuits && !mod.compatibleSuits.includes(suitType))
      continue;

    for (const [stat, value] of Object.entries(mod.effects)) {
      switch (stat) {
        case "backpackCapacity":
          result.backpackCapacity = 1 + value;
          break;
        case "battery":
          result.battery = base.battery * (1 + value);
          break;
        case "shieldRegen":
          result.shieldRegen = base.shieldRegen * (1 + value);
          break;
        case "emergencyAir":
          result.emergencyAir = value;
          break;
        case "sprintDuration":
          result.sprintDuration = 1 + value;
          break;
        case "meleeDamage":
          result.meleeDamage = 1 + value;
          break;
        case "ammoCapacity":
          result.ammoCapacity = 1 + value;
          break;
        case "combatMovementSpeed":
          result.combatMovementSpeed = value;
          break;
        case "jumpAssist":
          result.jumpAssist = true;
          break;
        case "nightVision":
          result.nightVision = true;
          break;
        case "scanRange":
        case "scanTime":
          result.enhancedTracking = true;
          break;
        case "footstepNoise":
          result.quieterFootsteps = true;
          break;
        case "toolEnergyDrain":
          result.reducedToolDrain = true;
          break;
        case "kineticResistance":
          result.resistance.kinetic =
            1 - (1 - base.resistance.kinetic) * (1 - value);
          break;
        case "thermalResistance":
          result.resistance.thermal =
            1 - (1 - base.resistance.thermal) * (1 - value);
          break;
        case "plasmaResistance":
          result.resistance.plasma =
            1 - (1 - base.resistance.plasma) * (1 - value);
          break;
        case "explosiveResistance":
          result.resistance.explosive =
            1 - (1 - base.resistance.explosive) * (1 - value);
          break;
      }
    }
  }

  return result;
}

export function calculateWeaponStats(
  weaponName: string,
  grade: number,
  modifications: string[],
): WeaponStats | null {
  const base = WEAPON_BASE_STATS[weaponName];
  if (!base) return null;

  const gradeDpsMultipliers: Record<string, number> = {
    "Karma C-44": 1.6,
    "Karma AR-50": 1.6,
    "Karma P-15": 1.6,
    "Karma L-6": 1.6,
    "TK Aphelion": 1.6,
    "TK Eclipse": 1.6,
    "TK Zenith": 1.6,
    "Manticore Executioner": 2.86,
    "Manticore Intimidator": 2.86,
    "Manticore Oppressor": 2.86,
    "Manticore Tormentor": 2.86,
  };

  const multiplier = gradeDpsMultipliers[weaponName] ?? 1.6;
  const gradeFactor = 1 + (multiplier - 1) * ((grade - 1) / 4);

  const result: WeaponStats = {
    name: base.name,
    manufacturer: base.manufacturer,
    category: base.category,
    size: base.size,
    fireMode: base.fireMode,
    grade,
    dps: base.dps * gradeFactor,
    headshotMultiplier: base.headshotMultiplier,
    effectiveRange: base.effectiveRange,
    magazineSize: base.magazineSize,
    reserveAmmo: base.reserveAmmo,
    reloadTime: base.reloadTime,
    handlingSpeed: 1,
    recoil: 1,
    stowedReloading: false,
    audioMasking: false,
    noiseSuppressor: false,
    scopeMagnification: false,
    hipFireAccuracy: 0,
  };

  for (const modName of modifications) {
    const mod = ON_FOOT_MODIFICATIONS[modName];
    if (!mod || mod.type !== "weapon") continue;

    for (const [stat, value] of Object.entries(mod.effects)) {
      switch (stat) {
        case "effectiveRange":
          result.effectiveRange = base.effectiveRange * (1 + value);
          break;
        case "headshotMultiplier":
          result.headshotMultiplier = base.headshotMultiplier * (1 + value);
          break;
        case "magazineSize":
          result.magazineSize = Math.round(base.magazineSize * (1 + value));
          break;
        case "reloadSpeed":
          result.reloadTime = base.reloadTime / (1 + value);
          break;
        case "handlingSpeed":
          result.handlingSpeed = 1 + value;
          break;
        case "recoil":
          result.recoil = 1 + value;
          break;
        case "hipFireAccuracy":
          result.hipFireAccuracy = value;
          break;
        case "stowedReloading":
          result.stowedReloading = true;
          break;
        case "audioMasking":
          result.audioMasking = true;
          break;
        case "noiseSuppressor":
          result.noiseSuppressor = true;
          break;
        case "scopeMagnification":
          result.scopeMagnification = true;
          break;
      }
    }
  }

  return result;
}

export function calculateEffectiveDps(
  weaponStats: WeaponStats,
  hitRate: number,
  headshotRate: number,
): number {
  const bodyDmg = weaponStats.dps * hitRate * (1 - headshotRate);
  const headDmg =
    weaponStats.dps * hitRate * headshotRate * weaponStats.headshotMultiplier;
  return bodyDmg + headDmg;
}
