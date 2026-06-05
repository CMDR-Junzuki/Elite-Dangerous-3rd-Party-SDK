import { describe, expect, it } from "vitest";
import {
  applyBlueprintGrade,
  computeEngineeringChanges,
  getAvailableBlueprints,
  getStatMod,
} from "../src/engineering";

describe("getStatMod", () => {
  it("returns StatMod for damage", () => {
    const mod = getStatMod("damage");
    expect(mod).toBeDefined();
    expect(mod!.higherbetter).toBe(true);
  });

  it("returns StatMod for shieldboost", () => {
    const mod = getStatMod("shieldboost");
    expect(mod).toBeDefined();
    expect(mod!.higherbetter).toBe(true);
  });

  it("returns StatMod for hullboost", () => {
    const mod = getStatMod("hullboost");
    expect(mod).toBeDefined();
  });

  it("returns StatMod for rof with higherbetter false", () => {
    const mod = getStatMod("rof");
    expect(mod).toBeDefined();
    expect(mod!.higherbetter).toBe(false);
  });

  it("returns undefined for unknown stat", () => {
    const mod = getStatMod("FakeStat");
    expect(mod).toBeUndefined();
  });
});

describe("getAvailableBlueprints", () => {
  it("returns blueprints for pl (pulse laser)", () => {
    const bps = getAvailableBlueprints("pl");
    expect(bps.length).toBeGreaterThan(0);
    expect(bps).toContain("Weapon_Overcharged");
  });

  it("returns blueprints for fsd", () => {
    const bps = getAvailableBlueprints("fsd");
    expect(bps).toContain("FSD_LongRange");
  });

  it("returns empty for unknown module group", () => {
    const bps = getAvailableBlueprints("nonexistent");
    expect(bps).toEqual([]);
  });
});

describe("applyBlueprintGrade", () => {
  it("applies multiplicative modifier (damage)", () => {
    const result = applyBlueprintGrade(
      { damage: 10 },
      { damage: [0.5, 1.0] },
      1,
    );
    expect(result.damage).toBe(10 * (1 + 0.5));
  });

  it("applies max roll at grade 5", () => {
    const result = applyBlueprintGrade(
      { damage: 10 },
      { damage: [0.5, 1.0] },
      5,
    );
    expect(result.damage).toBe(10 * (1 + 1.0));
  });

  it("converts rof via 1/(1+mod)-1", () => {
    const result = applyBlueprintGrade({ rof: 2.0 }, { rof: [-0.5, -0.5] }, 1);
    const expRof = 1 / (1 + -0.5) - 1;
    expect(result.rof).toBe(2.0 * (1 + expRof));
  });

  it("handles rof with zero change", () => {
    const result = applyBlueprintGrade({ rof: 2.0 }, { rof: [0, 0] }, 1);
    expect(result.rof).toBe(2.0);
  });

  it("compound formula for shieldboost", () => {
    const result = applyBlueprintGrade(
      { shieldboost: 0.0 },
      { shieldboost: [0.2, 0.6] },
      5,
    );
    expect(result.shieldboost).toBe((1 + 0.0) * (1 + 0.6) - 1);
  });

  it("compound formula for hullboost", () => {
    const result = applyBlueprintGrade(
      { hullboost: 0.5 },
      { hullboost: [0.2, 0.4] },
      5,
    );
    expect(result.hullboost).toBe((1 + 0.5) * (1 + 0.4) - 1);
  });

  it("merges special features additively", () => {
    const result = applyBlueprintGrade(
      { damage: 10.0 },
      { damage: [0.5, 1.0] },
      5,
      { damage: [0.1, 0.2] },
    );
    expect(result.damage).toBe(10.0 * (1 + 1.0 + 0.2));
  });

  it("respects roll quality", () => {
    const low = applyBlueprintGrade(
      { damage: 10.0 },
      { damage: [0.0, 1.0] },
      5,
      undefined,
      0.0,
    );
    const high = applyBlueprintGrade(
      { damage: 10.0 },
      { damage: [0.0, 1.0] },
      5,
      undefined,
      1.0,
    );
    expect(low.damage).toBeLessThan(high.damage);
  });

  it("handles multiple stats including rof", () => {
    const result = applyBlueprintGrade(
      { damage: 10.0, rof: 1.5 },
      { damage: [-0.1, -0.05], rof: [-0.15, -0.1] },
      5,
    );
    expect(result.damage).toBeDefined();
    expect(result.rof).toBeDefined();
  });
});

describe("computeEngineeringChanges", () => {
  it("returns stub for unknown blueprint", () => {
    const result = computeEngineeringChanges(
      { damage: 10.0 },
      { blueprintName: "FakeBP", grade: 1 },
    );
    expect(result).not.toBeNull();
    expect(result!.blueprintName).toBe("FakeBP");
    expect(result!.changes).toEqual({});
  });

  it("returns result for unknown blueprint with experimentalEffect", () => {
    const result = computeEngineeringChanges(
      { damage: 10.0 },
      { blueprintName: "FakeBP", grade: 1, experimentalEffect: "FakeSpecial" },
    );
    expect(result).not.toBeNull();
    expect(result!.changes).toEqual({});
  });
});
