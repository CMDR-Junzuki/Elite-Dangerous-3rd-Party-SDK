export interface CarrierJump {
  fromSystem: string;
  toSystem: string;
  distanceLy: number;
  fuelCost: number;
  cooldownMinutes: number;
  departureTime?: Date;
}

export interface CarrierCargo {
  totalCapacity: number;
  used: number;
  reserved: number;
  available: number;
  fuel: {
    current: number;
    max: number;
    pct: number;
  };
}

export interface CarrierFinance {
  balance: number;
  weeklyMaintenance: number;
  reserveBalance: number;
  taxRate: number;
  jumpsRemaining: number;
}

/**
 * Calculate carrier jump fuel cost.
 * Verified formula from EDCD community and Frontier forums
 * (https://forums.frontier.co.uk/threads/how-much-the-fleet-carrier-consumes-for-ly.563024/):
 *   fuel = round(5 + distance_ly * (cargo_mass + fuel_mass + 25000) / 200000)
 *
 * Where:
 *   carrier_hull = 25,000t (constant)
 *   cargo_mass = cargo hold usage (0-25,000t including installed services)
 *   fuel_mass = tritium in fuel depot (0-1,000t)
 *   Base fuel cost per jump = 5t
 *   Maximum range per jump = 500 LY
 */
export function calculateJumpFuelCost(
  distanceLy: number,
  ladenMass: number,
): number {
  // Fuel = round(5 + distance * (total mass) / 200000)
  // Carrier hull mass = 25000t, ladenMass = cargo + fuel depot contents
  const totalMass = ladenMass + 25000;
  return Math.max(1, Math.round(5 + (distanceLy * totalMass) / 200000));
}

/**
 * Estimate jump time including cooldown.
 * Carrier jumps: ~15 min charge, instant jump, ~5 min cooldown = ~20 min total.
 * Jump time does not depend on distance; all carrier jumps take the same time.
 */
export function estimateJumpTime(): {
  chargeMinutes: number;
  jumpDuration: string;
  cooldownMinutes: number;
  totalMinutes: number;
} {
  const charge = 15;
  const cooldown = 5;
  const total = charge + 0.1 + cooldown;

  return {
    chargeMinutes: charge,
    jumpDuration: "< 1 minute",
    cooldownMinutes: cooldown,
    totalMinutes: Math.ceil(total),
  };
}

/**
 * Calculate weekly carrier maintenance cost.
 * Values are well-known community numbers:
 *   Base upkeep: 5,000,000 CR/week
 *   Services: 150,000 - 750,000 CR/week each
 */
export function calculateWeeklyMaintenance(services: string[]): number {
  // Verified service costs from Fandom wiki, roguey.co.uk, PTN calculator, Steam community
  const baseCosts: Record<string, number> = {
    "Universal Cartographics": 1850000,
    Outfitting: 5000000,
    Repair: 1500000,
    Refuel: 1500000,
    Rearm: 1500000,
    Armoury: 1500000,
    Shipyard: 6500000,
    "Vista Genomics": 1500000,
    Bar: 1750000,
    "Concourse Bar": 1750000,
    "Pioneer Supplies": 5000000,
    "Redemption Office": 1850000,
    "Secure Warehouse": 2000000,
  };

  const base = 5000000;
  const extras = services.reduce((sum, s) => {
    const cost = Object.entries(baseCosts).find(([k]) =>
      s.toLowerCase().includes(k.toLowerCase()),
    );
    return sum + (cost ? cost[1] : 0);
  }, 0);

  return base + extras;
}

/**
 * Determine if carrier can afford another week of maintenance.
 */
export function canAffordMaintenance(
  balance: number,
  weeklyMaintenance: number,
): boolean {
  return balance >= weeklyMaintenance * 1.1; // 10% buffer
}
