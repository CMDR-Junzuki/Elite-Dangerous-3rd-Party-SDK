import { describe, expect, it } from "vitest";
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
});
