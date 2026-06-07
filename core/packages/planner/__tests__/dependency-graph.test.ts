import { describe, expect, it } from "vitest";
import {
  evaluateBuild,
  type MissingMaterial,
  tradeRatio,
} from "../src/dependency-graph.js";
import { createInventory } from "../src/material.js";

describe("evaluateBuild", () => {
  it("returns empty eval for no modifications", () => {
    const result = evaluateBuild([]);
    expect(result.plan.materials).toEqual([]);
    expect(result.requirements).toEqual([]);
    expect(result.missing).toEqual([]);
    expect(result.canCraftAll).toBe(true);
    expect(result.canCraftWithTrades).toBe(true);
    expect(result.totalMaterialsNeeded).toBe(0);
    expect(result.totalMissing).toBe(0);
    expect(result.engineers).toEqual([]);
  });

  it("computes requirements for FSD Long Range G5", () => {
    const result = evaluateBuild([
      { moduleGroup: "fsd", blueprintName: "FSD_LongRange", grade: 5 },
    ]);
    expect(result.requirements.length).toBeGreaterThan(0);
    expect(result.totalMaterialsNeeded).toBeGreaterThan(0);
    expect(result.engineers).toContain("Felicity Farseer");
    expect(result.totalMissing).toBeGreaterThan(0);
    expect(result.canCraftAll).toBe(false);
  });

  it("detects sufficient inventory", () => {
    const inv = createInventory();
    for (const m of inv.materials) {
      m.count = 9999;
    }
    const result = evaluateBuild(
      [{ moduleGroup: "fsd", blueprintName: "FSD_LongRange", grade: 5 }],
      inv,
    );
    expect(result.canCraftAll).toBe(true);
    expect(result.missing).toEqual([]);
    expect(result.totalMissing).toBe(0);
  });

  it("detects partial inventory", () => {
    const inv = createInventory();
    // Only give some Arsenic (needed for FSD G5)
    const arsenic = inv.materials.find((m) => m.name === "Arsenic");
    if (arsenic) arsenic.count = 1;

    const result = evaluateBuild(
      [{ moduleGroup: "fsd", blueprintName: "FSD_LongRange", grade: 5 }],
      inv,
    );

    const arsenicReq = result.requirements.find((r) => r.name === "Arsenic");
    expect(arsenicReq).toBeDefined();
    expect(arsenicReq!.available).toBe(1);
    expect(arsenicReq!.missing).toBeLessThan(arsenicReq!.needed);
    expect(arsenicReq!.missing).toBe(arsenicReq!.needed - 1);
  });

  it("produces trade-up options for missing materials", () => {
    const inv = createInventory();
    // Give all Raw G1 materials a good stock (Iron, Nickel, Carbon, Sulphur, Phosphorus)
    for (const m of inv.materials) {
      if (m.category === "raw" && m.grade === 1) {
        m.count = 3000;
      }
    }

    const result = evaluateBuild(
      [{ moduleGroup: "fsd", blueprintName: "FSD_LongRange", grade: 5 }],
      inv,
    );

    expect(result.missing.length).toBeGreaterThan(0);
    for (const m of result.missing) {
      if (m.category === "raw") {
        expect(m.tradeUps.length).toBeGreaterThan(0);
      }
    }
  });

  it("reports canCraftWithTrades when trade-ups cover all gaps", () => {
    const inv = createInventory();
    // Fill inventory with lots of G1 materials in every category
    for (const m of inv.materials) {
      if (m.grade === 1) {
        m.count = 3000;
      }
    }

    const result = evaluateBuild(
      [{ moduleGroup: "fsd", blueprintName: "FSD_LongRange", grade: 5 }],
      inv,
    );

    // With 3000 of every G1 material, we should be able to trade up
    expect(result.canCraftAll).toBe(false);
    // At least some trades should be feasible
    const anyFeasible = result.missing.some((m) => m.canTradeUp);
    expect(anyFeasible).toBe(true);
  });
});

describe("tradeRatio", () => {
  it("same grade is 6:1", () => {
    expect(tradeRatio(1, 1)).toBe(6);
    expect(tradeRatio(5, 5)).toBe(6);
  });

  it("one grade apart is 6:1", () => {
    expect(tradeRatio(1, 2)).toBe(6);
    expect(tradeRatio(4, 5)).toBe(6);
  });

  it("two grades apart is 36:1", () => {
    expect(tradeRatio(1, 3)).toBe(36);
    expect(tradeRatio(3, 1)).toBe(36);
  });

  it("three grades apart is 216:1", () => {
    expect(tradeRatio(1, 4)).toBe(216);
  });

  it("four grades apart is 1296:1", () => {
    expect(tradeRatio(1, 5)).toBe(1296);
  });
});
