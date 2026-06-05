/**
 * Background Simulation (BGS) Tools.
 * Tracks faction influence, states, conflicts, and system information.
 */

export type FactionState =
  | "None"
  | "Boom"
  | "Bust"
  | "CivilUnrest"
  | "CivilWar"
  | "Conflict"
  | "Election"
  | "Expansion"
  | "Famine"
  | "Investment"
  | "Lockdown"
  | "Outbreak"
  | "Retreat"
  | "War"
  | "InfrastructureFailure"
  | "NaturalDisaster"
  | "PirateAttack"
  | "TerroristAttack"
  | "Blight"
  | "Drought"
  | "Flood"
  | "Plague"
  | "LabourDemand"
  | "PublicHoliday"
  | "TechnologicalLeap"
  | "TradeAgreement"
  | "UnderRepair"
  | "Colonisation";

export interface FactionPresence {
  name: string;
  factionState: FactionState;
  influence: number; // 0.0 - 1.0
  allegiance: string;
  government: string;
  activeStates?: string[];
  pendingStates?: string[];
  recoveringStates?: string[];
}

export interface SystemBgsData {
  system: string;
  systemAddress?: number;
  population: number;
  allegiance: string;
  government: string;
  security: string;
  economy: string;
  secondEconomy?: string;
  factions: FactionPresence[];
  conflicts?: Conflict[];
}

export interface Conflict {
  type: "war" | "civilwar" | "election";
  status: "active" | "pending";
  faction1: string;
  faction2: string;
  faction1WonDays?: number;
  faction2WonDays?: number;
  faction1Stake?: string;
  faction2Stake?: string;
}

/**
 * Get the state description for a faction state.
 */
export function getStateDescription(state: FactionState): string {
  const descriptions: Record<string, string> = {
    None: "No active state",
    Boom: "Economic growth, increased trade profits",
    Bust: "Economic decline, reduced trade profits",
    CivilUnrest: "Increased bounties, decreased security",
    CivilWar: "Conflict between factions in same system",
    Conflict: "Active combat between factions",
    Election: "Peaceful competition for influence",
    Expansion: "Faction expanding to new systems",
    Famine: "Food shortages, decreased influence",
    Investment: "Increased investment in system development",
    Lockdown: "Increased security, reduced crime",
    Outbreak: "Health crisis, decreased influence",
    Retreat: "Faction losing presence in system",
    War: "Open warfare between factions",
    InfrastructureFailure: "Reduced station services",
    NaturalDisaster: "Damage from natural causes",
    PirateAttack: "Increased pirate activity",
    TerroristAttack: "Increased security responses",
    Colonisation: "New colony being established",
    TechnologicalLeap: "Advanced tech development",
    UnderRepair: "Recovering from damage",
  };
  return descriptions[state] ?? state;
}

/**
 * Check if a state is positive for influence growth.
 */
export function isPositiveState(state: FactionState | string): boolean {
  const positive = [
    "Boom",
    "Expansion",
    "Investment",
    "TechnologicalLeap",
    "TradeAgreement",
    "Colonisation",
    "Election",
  ];
  return positive.includes(state);
}

/**
 * Check if a state is negative for influence.
 */
export function isNegativeState(state: FactionState | string): boolean {
  const negative = [
    "Bust",
    "CivilUnrest",
    "Famine",
    "Lockdown",
    "Outbreak",
    "Retreat",
    "NaturalDisaster",
    "PirateAttack",
    "InfrastructureFailure",
  ];
  return negative.includes(state);
}

/**
 * Determine which faction would win a conflict based on influence.
 */
export function predictConflictWinner(
  conflict: Conflict,
  factions: FactionPresence[],
): string | null {
  const f1 = factions.find((f) => f.name === conflict.faction1);
  const f2 = factions.find((f) => f.name === conflict.faction2);
  if (!f1 || !f2) return null;
  if (f1.influence > f2.influence) return f1.name;
  if (f2.influence > f1.influence) return f2.name;
  return null; // too close to call
}
