/**
 * Maps for parsing CAPI outfitting module symbols into display information.
 * Sources: EDMarketConnector edmc_data.py outfitting_*_maps
 */

import { getModuleByEdId } from "../lookups";

/** Module slot/group categories */
export const companionCategoryMap: Record<string, string> = {
  Weapon: "Hardpoint",
  Utility: "Utility",
  Armour: "Bulkhead",
  PowerPlant: "Power Plant",
  MainEngines: "Thrusters",
  FrameShiftDrive: "Frame Shift Drive",
  LifeSupport: "Life Support",
  PowerDistributor: "Power Distributor",
  Radar: "Sensors",
  FuelTank: "Fuel Tank",
  Standard: "Standard",
  Internal: "Internal",
};

/** Ship slot names for outfitting display */
export const slotNameMap: Record<string, string> = {
  Standard: "Standard",
  Hardpoint: "Hardpoint",
  Utility: "Utility",
  Internal: "Internal",
  Military: "Military",
  PlanetaryApproachSuite: "Planetary Approach Suite",
  VehicleHangar: "Vehicle Hangar",
  FighterHangar: "Fighter Hangar",
};

/** Weapon mount types */
export const weaponMountMap: Record<string, string> = {
  Fixed: "Fixed",
  Gimbal: "Gimballed",
  Turret: "Turret",
};

/** Weapon classes (sizes) */
export const weaponClassMap: Record<string, string> = {
  Huge: "Huge",
  Large: "Large",
  Medium: "Medium",
  Small: "Small",
};

/** Rating translation */
export const ratingMap: Record<string, string> = {
  E: "E",
  D: "D",
  C: "C",
  B: "B",
  A: "A",
};

/**
 * Parse a CAPI module symbol into structured information.
 * Symbol pattern examples:
 *   Hpt_BeamLaser_Fixed_Small -> { category: "Laser", name: "Beam Laser", mount: "Fixed", class: 1 }
 *   Int_ShieldGenerator_Size3_Class5 -> { category: "Shield Generator", name: "Shield Generator", class: 3, rating: "A" }
 */
export interface ParsedModule {
  symbol: string;
  edId?: number;
  category: string;
  name: string;
  mount?: string;
  class?: number;
  rating?: string;
}

const WEAPON_RE = /^Hpt_([A-Za-z]+)_([A-Za-z]+)_([A-Za-z]+)$/;
const WEAPON_MOUNT_RE = /^Hpt_([A-Za-z]+)_([A-Za-z]+)_([A-Za-z]+)_([A-Za-z]+)$/;
const INTERNAL_RE = /^Int_([A-Za-z]+)_Size(\d+)_Class(\d+)$/;
const UTILITY_RE = /^Hpt_([A-Za-z]+)_Size(\d+)_Class(\d+)$/;
const STANDARD_RE = /^([A-Za-z]+)_Size(\d+)_Class(\d+)$/;

export function parseModuleSymbol(symbol: string): ParsedModule {
  const result: ParsedModule = { symbol, category: "", name: symbol };

  let match = symbol.match(INTERNAL_RE);
  if (match) {
    result.category = match[1];
    result.name = match[1].replace(/([A-Z])/g, " $1").trim();
    result.class = parseInt(match[2], 10);
    const ratingCode = parseInt(match[3], 10);
    result.rating = ["E", "D", "C", "B", "A"][ratingCode - 1] || "E";
    return result;
  }

  match = symbol.match(STANDARD_RE);
  if (match) {
    result.category = match[1];
    result.name = match[1].replace(/([A-Z])/g, " $1").trim();
    result.class = parseInt(match[2], 10);
    const ratingCode = parseInt(match[3], 10);
    result.rating = ["E", "D", "C", "B", "A"][ratingCode - 1] || "E";
    return result;
  }

  match = symbol.match(WEAPON_MOUNT_RE);
  if (match) {
    result.category = match[1].replace(/([A-Z])/g, " $1").trim();
    result.name = match[2].replace(/([A-Z])/g, " $1").trim();
    result.mount = weaponMountMap[match[3]] ?? match[3];
    result.class = ["Small", "Medium", "Large", "Huge"].indexOf(match[4]) + 1;
    if (result.class === 0) result.class = undefined;
    return result;
  }

  match = symbol.match(WEAPON_RE);
  if (match) {
    result.category = match[1].replace(/([A-Z])/g, " $1").trim();
    result.name = match[2].replace(/([A-Z])/g, " $1").trim();
    result.class = ["Small", "Medium", "Large", "Huge"].indexOf(match[3]) + 1;
    if (result.class === 0) result.class = undefined;
    return result;
  }

  match = symbol.match(UTILITY_RE);
  if (match) {
    result.category = match[1].replace(/([A-Z])/g, " $1").trim();
    result.name = match[1].replace(/([A-Z])/g, " $1").trim();
    result.class = parseInt(match[2], 10);
    const ratingCode = parseInt(match[3], 10);
    result.rating = ["E", "D", "C", "B", "A"][ratingCode - 1] || "E";
    return result;
  }

  return result;
}

/**
 * Get module display name from CAPI module ID (edID).
 */
export function getModuleDisplayName(edId: number): string {
  const module = getModuleByEdId(edId);
  if (!module) return "";
  if (module.name) return module.name;
  return parseModuleSymbol(module.symbol).name;
}
