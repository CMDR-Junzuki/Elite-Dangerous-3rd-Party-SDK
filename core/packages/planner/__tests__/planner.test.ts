import { describe, expect, it } from "vitest";
import {
  analyzeConflict,
  expansionTargets,
  factionStateEffect,
  influenceEffect,
  predictConflictWinner,
  retreatRisk,
} from "../src/bgs.js";
import { findEngineer } from "../src/engineer";
import { createInventory } from "../src/material";
import {
  estimateMeritsBracket,
  estimateMeritsPerHour,
  getMeritsForRank,
  getPowerplaySalary,
  meritsToNextRank,
  POWERPLAY_SALARIES,
  POWERS,
} from "../src/powerplay";

describe("planner", () => {
  it("creates inventory", () => {
    const inv = createInventory();
    expect(inv.materials).toBeDefined();
    expect(inv.timestamp).toBeDefined();
  });

  it("finds engineer by name", () => {
    const eng = findEngineer("Felicity Farseer");
    expect(eng).toBeDefined();
    expect(eng?.name).toBe("Felicity Farseer");
  });

  it("returns unknown engineer gracefully", () => {
    const eng = findEngineer("Nonexistent Engineer");
    expect(eng).toBeUndefined();
  });

  it("has all 13 powers", () => {
    expect(POWERS).toHaveLength(13);
    expect(POWERS).toContain("Aisling Duval");
    expect(POWERS).toContain("Nakato Kaine");
  });

  it("getMeritsForRank returns correct thresholds", () => {
    expect(getMeritsForRank(1)).toBe(0);
    expect(getMeritsForRank(2)).toBe(2000);
    expect(getMeritsForRank(3)).toBe(5000);
    expect(getMeritsForRank(4)).toBe(9000);
    expect(getMeritsForRank(5)).toBe(15000);
    expect(getMeritsForRank(6)).toBe(23000);
    expect(getMeritsForRank(10)).toBe(55000);
    expect(getMeritsForRank(100)).toBe(775000);
  });

  it("meritsToNextRank computes correctly", () => {
    expect(meritsToNextRank(0)).toEqual({ rank: 1, meritsNeeded: 2000 });
    expect(meritsToNextRank(2000)).toEqual({ rank: 2, meritsNeeded: 3000 });
    expect(meritsToNextRank(50000)).toEqual({ rank: 9, meritsNeeded: 5000 });
    expect(meritsToNextRank(775000)).toEqual({ rank: 100, meritsNeeded: 0 });
  });

  it("getPowerplaySalary returns correct values", () => {
    expect(getPowerplaySalary("top_100_pct")).toBe(500000);
    expect(getPowerplaySalary("top_75_pct")).toBe(2500000);
    expect(getPowerplaySalary("top_50_pct")).toBe(5000000);
    expect(getPowerplaySalary("top_25_pct")).toBe(10000000);
    expect(getPowerplaySalary("top_10_pct")).toBe(50000000);
    expect(getPowerplaySalary("top_10")).toBe(100000000);
    expect(getPowerplaySalary("top_1")).toBe(1000000000);
  });

  it("POWERPLAY_SALARIES matches getPowerplaySalary", () => {
    for (const [bracket, salary] of Object.entries(POWERPLAY_SALARIES)) {
      expect(getPowerplaySalary(bracket as any)).toBe(salary);
    }
  });

  it("estimateMeritsBracket covers all tiers", () => {
    expect(estimateMeritsBracket(0)).toBe("top_100_pct");
    expect(estimateMeritsBracket(100)).toBe("top_100_pct");
    expect(estimateMeritsBracket(1000)).toBe("top_75_pct");
    expect(estimateMeritsBracket(5000)).toBe("top_50_pct");
    expect(estimateMeritsBracket(10000)).toBe("top_25_pct");
    expect(estimateMeritsBracket(50000)).toBe("top_10_pct");
    expect(estimateMeritsBracket(200000)).toBe("top_10");
    expect(estimateMeritsBracket(500000)).toBe("top_1");
  });

  it("estimateMeritsPerHour returns non-zero for known activities", () => {
    expect(estimateMeritsPerHour("mining")).toBeGreaterThan(0);
    expect(estimateMeritsPerHour("combat_zone")).toBeGreaterThan(0);
    expect(estimateMeritsPerHour("unknown_activity")).toBe(3000);
  });

  describe("factionStateEffect", () => {
    it("returns known effects for Boom", () => {
      const effect = factionStateEffect("Boom");
      expect(effect.influenceTrend).toBe("positive");
      expect(effect.affectedActivities).toContain("trade");
    });

    it("returns known effects for Retreat", () => {
      const effect = factionStateEffect("Retreat");
      expect(effect.influenceTrend).toBe("negative");
      expect(effect.affectedActivities).toContain("all");
    });

    it("returns neutral for unknown states", () => {
      const effect = factionStateEffect("MysteryState");
      expect(effect.influenceTrend).toBe("neutral");
      expect(effect.affectedActivities).toEqual([]);
    });
  });

  describe("influenceEffect", () => {
    it("estimates high-value mission impact", () => {
      const result = influenceEffect("mission_completed", { reward: 5000000 });
      expect(result.influenceDelta).toBe(0.02);
      expect(result.confidence).toBe("medium");
    });

    it("estimates standard mission impact", () => {
      const result = influenceEffect("mission_completed", { reward: 500000 });
      expect(result.influenceDelta).toBe(0.004);
    });

    it("estimates bounty impact", () => {
      const result = influenceEffect("bounty", { amount: 200000 });
      expect(result.influenceDelta).toBe(0.04);
      expect(result.confidence).toBe("low");
    });

    it("estimates murder negative impact", () => {
      const result = influenceEffect("murder", { count: 2 });
      expect(result.influenceDelta).toBe(-0.004);
    });

    it("returns zero for unknown action", () => {
      const result = influenceEffect("unknown", {});
      expect(result.influenceDelta).toBe(0);
      expect(result.confidence).toBe("low");
    });
  });

  describe("analyzeConflict", () => {
    it("predicts winner based on influence", () => {
      const result = analyzeConflict(
        { type: "election", status: "active", faction1: "A", faction2: "B" },
        [
          {
            name: "A",
            factionState: "None",
            influence: 0.6,
            allegiance: "Fed",
            government: "Dem",
          },
          {
            name: "B",
            factionState: "None",
            influence: 0.4,
            allegiance: "Ind",
            government: "Corp",
          },
        ],
      );
      expect(result?.predictedWinner).toBe("A");
      expect(result?.faction1Advantage).toBeCloseTo(0.2, 10);
      expect(result?.analysis).toContain("significant influence advantage");
    });

    it("returns null if faction not found", () => {
      const result = analyzeConflict(
        { type: "war", status: "active", faction1: "A", faction2: "Missing" },
        [
          {
            name: "A",
            factionState: "None",
            influence: 0.5,
            allegiance: "",
            government: "",
          },
        ],
      );
      expect(result).toBeNull();
    });
  });

  describe("expansionTargets", () => {
    it("scores and ranks potential expansion targets", () => {
      const current = {
        system: "Home",
        population: 1000000,
        allegiance: "Federation",
        government: "Democracy",
        security: "Medium",
        economy: "HighTech",
        factions: [
          {
            name: "MyFaction",
            factionState: "None",
            influence: 0.5,
            allegiance: "Federation",
            government: "Democracy",
          },
        ],
      };
      const nearby = [
        {
          system: "Target1",
          population: 5000000,
          allegiance: "Federation",
          government: "Democracy",
          security: "Medium",
          economy: "Agriculture",
          factions: [
            {
              name: "Other",
              factionState: "None",
              influence: 0.05,
              allegiance: "Independent",
              government: "Corp",
            },
          ],
        },
        {
          system: "Target2",
          population: 50000,
          allegiance: "Independent",
          government: "Anarchy",
          security: "Low",
          economy: "Extraction",
          factions: [],
        },
      ];
      const targets = expansionTargets(current, nearby, "MyFaction");
      expect(targets).toHaveLength(2);
      expect(targets[0].system).toBe("Target1");
      expect(targets[0].score).toBeGreaterThan(targets[1].score);
      expect(targets[0].reasons.length).toBeGreaterThan(0);
    });

    it("skips current system", () => {
      const current = {
        system: "Home",
        population: 1000,
        allegiance: "",
        government: "",
        security: "",
        economy: "",
        factions: [],
      };
      const targets = expansionTargets(current, [current], "MyFaction");
      expect(targets).toHaveLength(0);
    });

    it("skips systems where faction already present", () => {
      const current = {
        system: "Home",
        population: 1000,
        allegiance: "",
        government: "",
        security: "",
        economy: "",
        factions: [],
      };
      const sysWithFaction = {
        system: "Elsewhere",
        population: 1000,
        allegiance: "",
        government: "",
        security: "",
        economy: "",
        factions: [
          {
            name: "MyFaction",
            factionState: "None",
            influence: 0.1,
            allegiance: "",
            government: "",
          },
        ],
      };
      const targets = expansionTargets(current, [sysWithFaction], "MyFaction");
      expect(targets).toHaveLength(0);
    });
  });

  describe("retreatRisk", () => {
    it("returns critical for very low influence", () => {
      const risk = retreatRisk({
        name: "Faction",
        factionState: "None",
        influence: 0.005,
        allegiance: "",
        government: "",
      });
      expect(risk.riskLevel).toBe("critical");
      expect(risk.inRetreatState).toBe(false);
    });

    it("returns high for influence below 2.5%", () => {
      const risk = retreatRisk({
        name: "Faction",
        factionState: "None",
        influence: 0.02,
        allegiance: "",
        government: "",
      });
      expect(risk.riskLevel).toBe("high");
    });

    it("returns critical for retreat state with low influence", () => {
      const risk = retreatRisk({
        name: "Faction",
        factionState: "Retreat",
        influence: 0.02,
        allegiance: "",
        government: "",
      });
      expect(risk.riskLevel).toBe("critical");
      expect(risk.inRetreatState).toBe(true);
    });

    it("returns none for >7.5% influence", () => {
      const risk = retreatRisk({
        name: "Faction",
        factionState: "None",
        influence: 0.1,
        allegiance: "",
        government: "",
      });
      expect(risk.riskLevel).toBe("none");
    });

    it("includes analysis text", () => {
      const risk = retreatRisk({
        name: "TestFaction",
        factionState: "Retreat",
        influence: 0.04,
        allegiance: "",
        government: "",
      });
      expect(risk.analysis).toContain("TestFaction");
      expect(risk.analysis).toContain("high");
    });
  });

  describe("predictConflictWinner", () => {
    it("predicts higher influence faction", () => {
      const result = predictConflictWinner(
        { type: "war", status: "active", faction1: "A", faction2: "B" },
        [
          {
            name: "A",
            factionState: "None",
            influence: 0.6,
            allegiance: "",
            government: "",
          },
          {
            name: "B",
            factionState: "None",
            influence: 0.4,
            allegiance: "",
            government: "",
          },
        ],
      );
      expect(result).toBe("A");
    });

    it("returns null for equal influence", () => {
      const result = predictConflictWinner(
        { type: "war", status: "active", faction1: "A", faction2: "B" },
        [
          {
            name: "A",
            factionState: "None",
            influence: 0.5,
            allegiance: "",
            government: "",
          },
          {
            name: "B",
            factionState: "None",
            influence: 0.5,
            allegiance: "",
            government: "",
          },
        ],
      );
      expect(result).toBeNull();
    });

    it("returns null if factions not found", () => {
      const result = predictConflictWinner(
        { type: "war", status: "active", faction1: "A", faction2: "Missing" },
        [
          {
            name: "A",
            factionState: "None",
            influence: 0.5,
            allegiance: "",
            government: "",
          },
        ],
      );
      expect(result).toBeNull();
    });
  });
});
