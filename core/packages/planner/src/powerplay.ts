/**
 * Powerplay 2.0 tools for tracking standings, merits, and control systems.
 * Ranks changed from 1-5 to 1-100 with Powerplay 2.0 (Update 18, 2024).
 * Source: INARA Powerplay 2.0 guide, Elite Dangerous wiki.
 */

export type PowerName =
  | "Aisling Duval"
  | "Archon Delaine"
  | "Arissa Lavigny-Duval"
  | "Denton Patreus"
  | "Edmund Mahon"
  | "Felicia Winters"
  | "Jerome Archer"
  | "Li Yong-Rui"
  | "Pranav Antal"
  | "Yuri Grom"
  | "Zachary Hudson"
  | "Zemina Torval"
  | "Nakato Kaine";

export const POWERS: PowerName[] = [
  "Aisling Duval",
  "Archon Delaine",
  "Arissa Lavigny-Duval",
  "Denton Patreus",
  "Edmund Mahon",
  "Felicia Winters",
  "Jerome Archer",
  "Li Yong-Rui",
  "Pranav Antal",
  "Yuri Grom",
  "Zachary Hudson",
  "Zemina Torval",
  "Nakato Kaine",
];

export type GalPower = PowerName;

/** Type of a system in Powerplay 2.0. */
export enum PowerplaySystemType {
  Undefined = 0,
  Control = 1,
  Exploited = 2,
  Stronghold = 3,
  Fortified = 4,
  Preparation = 5,
  Expansion = 6,
  Contested = 7,
}

export const POWERPLAY_SYSTEM_TYPE_NAMES: Record<PowerplaySystemType, string> =
  {
    [PowerplaySystemType.Undefined]: "Undefined",
    [PowerplaySystemType.Control]: "Control",
    [PowerplaySystemType.Exploited]: "Exploited",
    [PowerplaySystemType.Stronghold]: "Stronghold",
    [PowerplaySystemType.Fortified]: "Fortified",
    [PowerplaySystemType.Preparation]: "Preparation",
    [PowerplaySystemType.Expansion]: "Expansion",
    [PowerplaySystemType.Contested]: "Contested",
  };

/** A system under a power's influence in Powerplay 2.0. */
export interface PowerplaySystem {
  name: string;
  systemAddress?: number;
  power: GalPower;
  type: PowerplaySystemType;
  controlSystem?: string;
  undermined?: boolean;
  fortificationTrigger?: number;
  fortificationDone?: number;
  underminingTrigger?: number;
  underminingDone?: number;
  coords?: [number, number, number];
}

/** Static data about a Powerplay power. */
export interface PowerplayPowerData {
  name: GalPower;
  homeSystem: string;
  ethos: string;
  knownControlSystems: string[];
}

/** Current Powerplay 2.0 state for a commander pledged to a power. */
export interface PowerplayState {
  power: PowerName;
  rank: number;
  merits: number;
  meritsToNextRank: number;
  weeklyAllocation: number;
  votingPledges?: number;
  totalVouchers?: number;
}

/** A Powerplay 2.0 control system that projects influence to surrounding systems. */
export interface ControlSystem {
  system: string;
  systemAddress?: number;
  controllingPower: PowerName;
  exploitedSystems?: string[];
  undermined?: boolean;
  fortificationTrigger?: number;
  fortificationDone?: number;
  underminingTrigger?: number;
  underminingDone?: number;
}

/**
 * Merits required for each rank in Powerplay 2.0.
 * Rank 1: 0 merits (complete initial 5 assignments)
 * Rank 2: 2,000 merits
 * Rank 3: 5,000 merits
 * Rank 4: 9,000 merits
 * Rank 5: 15,000 merits
 * Ranks 6-99: previous rank + 8,000 merits
 * Rank 100: 775,000 merits
 */
export function getMeritsForRank(rank: number): number {
  if (rank <= 1) return 0;
  if (rank === 2) return 2000;
  if (rank === 3) return 5000;
  if (rank === 4) return 9000;
  if (rank === 5) return 15000;
  if (rank >= 100) return 775000;
  // Ranks 6-99: each step adds 8,000 merits
  return 15000 + (rank - 5) * 8000;
}

/**
 * Salary brackets for Powerplay 2.0.
 * Salary is based on weekly merit percentile standing within a power,
 * NOT on rank number. Every pledged commander who earns >= 1 merit qualifies.
 */
export type PowerplaySalaryBracket =
  | "top_100_pct"
  | "top_75_pct"
  | "top_50_pct"
  | "top_25_pct"
  | "top_10_pct"
  | "top_10"
  | "top_1";

/**
 * Salary for each bracket (weekly credits).
 * Source: INARA Powerplay 2.0 guide.
 *   top_100_pct:    500,000 CR (anyone who earned >= 1 merit)
 *   top_75_pct:   2,500,000 CR
 *   top_50_pct:   5,000,000 CR
 *   top_25_pct:  10,000,000 CR
 *   top_10_pct:  50,000,000 CR
 *   top_10:     100,000,000 CR (exact rank position)
 *   top_1:    1,000,000,000 CR (exact rank position)
 */
export const POWERPLAY_SALARIES: Record<PowerplaySalaryBracket, number> = {
  top_100_pct: 500000,
  top_75_pct: 2500000,
  top_50_pct: 5000000,
  top_25_pct: 10000000,
  top_10_pct: 50000000,
  top_10: 100000000,
  top_1: 1000000000,
};

export function getPowerplaySalary(bracket: string): number {
  return POWERPLAY_SALARIES[bracket as PowerplaySalaryBracket] ?? 0;
}

/**
 * Roughly estimate a salary bracket from weekly merit earnings.
 *
 * **WARNING:** Actual Powerplay 2.0 salary brackets are determined by your
 * percentile standing relative to other commanders in the same power, NOT
 * by absolute merit count. The thresholds below are extremely coarse
 * heuristics and WILL be wrong in many situations.
 *
 * This function exists only as a rough guideline. For accurate bracket
 * detection, query the Frontier CAPI or Inara API for your actual standing.
 */
export function estimateMeritsBracket(
  weeklyMerits: number,
): PowerplaySalaryBracket {
  if (weeklyMerits <= 0) return "top_100_pct";
  if (weeklyMerits >= 500000) return "top_1";
  if (weeklyMerits >= 200000) return "top_10";
  if (weeklyMerits >= 50000) return "top_10_pct";
  if (weeklyMerits >= 10000) return "top_25_pct";
  if (weeklyMerits >= 5000) return "top_50_pct";
  if (weeklyMerits >= 1000) return "top_75_pct";
  return "top_100_pct";
}

/**
 * Calculate merits to next rank.
 */
export function meritsToNextRank(currentMerits: number): {
  rank: number;
  meritsNeeded: number;
} {
  let rank = 1;
  for (let r = 100; r >= 1; r--) {
    if (currentMerits >= getMeritsForRank(r)) {
      rank = r;
      break;
    }
  }

  if (rank >= 100) return { rank: 100, meritsNeeded: 0 };

  const nextRankMerits = getMeritsForRank(rank + 1);
  return { rank, meritsNeeded: nextRankMerits - currentMerits };
}

/**
 * Estimate merits earned per hour for a given activity (Powerplay 2.0).
 * Powerplay 2.0 (Update 18) introduced 4x-20x merit multipliers,
 * dramatically increasing rates vs Powerplay 1.0.
 * Source: INARA Powerplay 2.0 guide, player reports.
 */
export function estimateMeritsPerHour(activity: string): number {
  const rates: Record<string, number> = {
    mining: 30000,
    combat_zone: 20000,
    undermining: 15000,
    fortification: 20000,
    expansion: 18000,
    bounty_hunting: 12000,
    assignment: 5000,
    trade: 3000,
    voucher_turn_in: 10000,
  };
  return rates[activity.toLowerCase()] ?? 3000;
}
