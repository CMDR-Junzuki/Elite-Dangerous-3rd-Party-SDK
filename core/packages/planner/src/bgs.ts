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

export interface StateEffect {
  influenceTrend: "positive" | "negative" | "neutral";
  affectedActivities: string[];
  description: string;
}

const STATE_EFFECTS: Record<string, StateEffect> = {
  Boom: {
    influenceTrend: "positive",
    affectedActivities: ["trade", "passenger_missions"],
    description: "Economic growth, increased trade profits",
  },
  Bust: {
    influenceTrend: "negative",
    affectedActivities: ["trade"],
    description: "Economic decline, reduced trade profits",
  },
  CivilUnrest: {
    influenceTrend: "negative",
    affectedActivities: ["bounty", "security"],
    description: "Increased bounties, decreased security",
  },
  CivilWar: {
    influenceTrend: "negative",
    affectedActivities: ["conflict_zones"],
    description: "Conflict between factions in same system",
  },
  Election: {
    influenceTrend: "positive",
    affectedActivities: ["missions"],
    description: "Peaceful competition for influence",
  },
  Expansion: {
    influenceTrend: "positive",
    affectedActivities: ["trade", "exploration"],
    description: "Faction expanding to new systems",
  },
  Famine: {
    influenceTrend: "negative",
    affectedActivities: ["trade", "missions"],
    description: "Food shortages, decreased influence",
  },
  Investment: {
    influenceTrend: "positive",
    affectedActivities: ["trade", "exploration"],
    description: "Increased investment in system development",
  },
  Lockdown: {
    influenceTrend: "negative",
    affectedActivities: ["crime", "black_market"],
    description: "Increased security, reduced crime",
  },
  Outbreak: {
    influenceTrend: "negative",
    affectedActivities: ["trade", "missions"],
    description: "Health crisis, decreased influence",
  },
  Retreat: {
    influenceTrend: "negative",
    affectedActivities: ["all"],
    description: "Faction losing presence in system",
  },
  War: {
    influenceTrend: "negative",
    affectedActivities: ["conflict_zones"],
    description: "Open warfare between factions",
  },
  PirateAttack: {
    influenceTrend: "negative",
    affectedActivities: ["security", "trade"],
    description: "Increased pirate activity",
  },
  InfrastructureFailure: {
    influenceTrend: "negative",
    affectedActivities: ["station_services"],
    description: "Reduced station services",
  },
  NaturalDisaster: {
    influenceTrend: "negative",
    affectedActivities: ["all"],
    description: "Damage from natural causes",
  },
  Blight: {
    influenceTrend: "negative",
    affectedActivities: ["trade"],
    description: "Agricultural crisis",
  },
  Drought: {
    influenceTrend: "negative",
    affectedActivities: ["trade"],
    description: "Water shortages",
  },
  Flood: {
    influenceTrend: "negative",
    affectedActivities: ["trade", "stations"],
    description: "Widespread flooding",
  },
  Plague: {
    influenceTrend: "negative",
    affectedActivities: ["all"],
    description: "Deadly disease outbreak",
  },
  LabourDemand: {
    influenceTrend: "positive",
    affectedActivities: ["missions"],
    description: "Increased demand for workers",
  },
  PublicHoliday: {
    influenceTrend: "positive",
    affectedActivities: ["trade", "passenger_missions"],
    description: "Celebration boosting local economy",
  },
  TechnologicalLeap: {
    influenceTrend: "positive",
    affectedActivities: ["exploration", "missions"],
    description: "Advanced tech development",
  },
  TradeAgreement: {
    influenceTrend: "positive",
    affectedActivities: ["trade"],
    description: "Increased trade opportunities",
  },
  TerroristAttack: {
    influenceTrend: "negative",
    affectedActivities: ["security", "all"],
    description: "Increased security responses",
  },
  UnderRepair: {
    influenceTrend: "neutral",
    affectedActivities: ["station_services"],
    description: "Recovering from damage",
  },
  Colonisation: {
    influenceTrend: "positive",
    affectedActivities: ["trade", "missions"],
    description: "New colony being established",
  },
};

/**
 * Get the effect of a BGS state on influence and activities.
 */
export function factionStateEffect(state: string): StateEffect {
  return (
    STATE_EFFECTS[state] ?? {
      influenceTrend: "neutral",
      affectedActivities: [],
      description: state,
    }
  );
}

export interface InfluenceEstimate {
  influenceDelta: number;
  confidence: "low" | "medium" | "high";
  breakdown: string;
}

/**
 * Estimate influence change from BGS actions.
 * Based on observed community data points (Frontier does not publish exact formulas).
 */
export function influenceEffect(
  action: string,
  params: Record<string, number>,
): InfluenceEstimate {
  switch (action) {
    case "mission_completed": {
      const reward = params.reward ?? 0;
      if (reward >= 4000000) {
        return {
          influenceDelta: 0.02,
          confidence: "medium",
          breakdown: "High-value mission (~4M+ CR): ~2.0% influence",
        };
      }
      if (reward >= 1000000) {
        return {
          influenceDelta: 0.01,
          confidence: "medium",
          breakdown: "Medium-value mission (~1M CR): ~1.0% influence",
        };
      }
      return {
        influenceDelta: 0.004,
        confidence: "medium",
        breakdown: "Standard mission: ~0.4% influence",
      };
    }
    case "bounty": {
      const amount = params.amount ?? 0;
      const delta = Math.min(amount / 1000000, 0.04);
      return {
        influenceDelta: delta,
        confidence: "low",
        breakdown: `Bounty voucher (${amount.toLocaleString()} CR): ~${(delta * 100).toFixed(1)}% influence`,
      };
    }
    case "bonds": {
      const bondAmount = params.amount ?? 0;
      const bondDelta = Math.min(bondAmount / 2000000, 0.03);
      return {
        influenceDelta: bondDelta,
        confidence: "low",
        breakdown: `Combat bonds (${bondAmount.toLocaleString()} CR): ~${(bondDelta * 100).toFixed(1)}% influence`,
      };
    }
    case "exploration": {
      const systems = params.systems ?? 1;
      const firstDiscoveries = params.firstDiscoveries ?? 0;
      const delta = systems * 0.002 + firstDiscoveries * 0.008;
      return {
        influenceDelta: Math.min(delta, 0.05),
        confidence: "low",
        breakdown: `Exploration data (${systems} systems, ${firstDiscoveries} first discoveries): ~${(Math.min(delta, 0.05) * 100).toFixed(1)}% influence`,
      };
    }
    case "trade": {
      const profit = params.profit ?? 0;
      const tradeDelta = Math.min(profit / 5000000, 0.03);
      return {
        influenceDelta: tradeDelta,
        confidence: "low",
        breakdown: `Trade profit (${profit.toLocaleString()} CR): ~${(tradeDelta * 100).toFixed(1)}% influence`,
      };
    }
    case "murder": {
      const count = params.count ?? 1;
      return {
        influenceDelta: -(count * 0.002),
        confidence: "low",
        breakdown: `Ship destroyed (${count}): ~-${(count * 0.2).toFixed(1)}% influence`,
      };
    }
    default:
      return {
        influenceDelta: 0,
        confidence: "low",
        breakdown: "Unknown action",
      };
  }
}

export interface ConflictAnalysis {
  predictedWinner: string | null;
  faction1WonDays: number;
  faction2WonDays: number;
  faction1Advantage: number;
  faction2Advantage: number;
  status: string;
  analysis: string;
}

/**
 * Analyze a conflict and provide detailed breakdown.
 */
export function analyzeConflict(
  conflict: Conflict,
  factions: FactionPresence[],
): ConflictAnalysis | null {
  const f1 = factions.find((f) => f.name === conflict.faction1);
  const f2 = factions.find((f) => f.name === conflict.faction2);
  if (!f1 || !f2) return null;

  const f1WonDays = conflict.faction1WonDays ?? 0;
  const f2WonDays = conflict.faction2WonDays ?? 0;
  const pred = predictConflictWinner(conflict, factions);
  const influenceGap = Math.abs(f1.influence - f2.influence);

  let analysis = `${conflict.faction1} (${(f1.influence * 100).toFixed(1)}%) vs ${conflict.faction2} (${(f2.influence * 100).toFixed(1)}%) in a ${conflict.status} ${conflict.type}`;
  if (f1WonDays > 0 || f2WonDays > 0) {
    analysis += ` | Days won: ${f1WonDays}-${f2WonDays}`;
  }
  if (pred) {
    analysis += ` | ${pred} predicted to win`;
    if (influenceGap > 0.05) {
      analysis += " (significant influence advantage)";
    } else if (influenceGap > 0.02) {
      analysis += " (moderate influence advantage)";
    } else {
      analysis += " (close contest)";
    }
  }

  return {
    predictedWinner: pred,
    faction1WonDays: f1WonDays,
    faction2WonDays: f2WonDays,
    faction1Advantage: f1.influence - f2.influence,
    faction2Advantage: f2.influence - f1.influence,
    status: conflict.status,
    analysis,
  };
}

export interface ExpansionTarget {
  system: string;
  population: number;
  government: string;
  economy: string;
  distanceLy?: number;
  score: number;
  reasons: string[];
}

/**
 * Evaluate nearby systems as potential expansion targets for a faction.
 */
export function expansionTargets(
  currentSystem: SystemBgsData,
  nearbySystems: SystemBgsData[],
  factionName: string,
): ExpansionTarget[] {
  const results: ExpansionTarget[] = [];
  for (const sys of nearbySystems) {
    if (sys.system === currentSystem.system) continue;

    const existingFaction = sys.factions?.find((f) => f.name === factionName);
    if (existingFaction) continue;

    const reasons: string[] = [];
    let score = 0;

    if (sys.population > 1000000) {
      score += 30;
      reasons.push("High population");
    } else if (sys.population > 100000) {
      score += 15;
      reasons.push("Medium population");
    } else {
      score += 5;
    }

    if (sys.government === "Democracy" || sys.government === "Confederacy") {
      score += 10;
      reasons.push("Compatible government");
    }

    if (
      sys.economy === "Agriculture" ||
      sys.economy === "Extraction" ||
      sys.economy === "Refinery"
    ) {
      score += 10;
      reasons.push("Primary economy");
    }

    const nonNativeFactions = sys.factions?.filter(
      (f) => f.allegiance !== currentSystem.allegiance,
    );
    if (nonNativeFactions && nonNativeFactions.length > 0) {
      const avgOppInfluence =
        nonNativeFactions.reduce((s, f) => s + f.influence, 0) /
        nonNativeFactions.length;
      if (avgOppInfluence < 0.1) {
        score += 15;
        reasons.push("Weak opposing factions present");
      }
    }

    results.push({
      system: sys.system,
      population: sys.population,
      government: sys.government,
      economy: sys.economy,
      score,
      reasons,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

export interface RetreatRisk {
  riskLevel: "none" | "low" | "medium" | "high" | "critical";
  influence: number;
  inRetreatState: boolean;
  analysis: string;
}

/**
 * Assess the retreat risk for a faction presence.
 * Factions below 2.5% influence are at risk of retreating.
 * Factions in Retreat state below 5% are at critical risk.
 */
export function retreatRisk(factionPresence: FactionPresence): RetreatRisk {
  const inf = factionPresence.influence;
  const inRetreat = factionPresence.factionState === "Retreat";

  let riskLevel: RetreatRisk["riskLevel"] = "none";
  if (inRetreat && inf < 0.025) {
    riskLevel = "critical";
  } else if (inRetreat && inf < 0.05) {
    riskLevel = "high";
  } else if (inRetreat) {
    riskLevel = "medium";
  } else if (inf < 0.01) {
    riskLevel = "critical";
  } else if (inf < 0.025) {
    riskLevel = "high";
  } else if (inf < 0.05) {
    riskLevel = "medium";
  } else if (inf < 0.075) {
    riskLevel = "low";
  }

  let analysis = `${factionPresence.name} at ${(inf * 100).toFixed(1)}% influence`;
  if (inRetreat) {
    analysis += ` and in Retreat state`;
  }
  analysis += `: ${riskLevel} retreat risk`;

  return { riskLevel, influence: inf, inRetreatState: inRetreat, analysis };
}
