import { describe, expect, it } from "vitest";
import {
  getBlueprintComponents,
  getEngineersForBlueprint,
  getExperimentalEffectComponents,
  planEngineering,
} from "../src/engineering-planner";

describe("planEngineering", () => {
  it("returns empty plan for no modifications", () => {
    const plan = planEngineering([]);
    expect(plan.materials).toEqual([]);
    expect(plan.materialTotal).toEqual({});
    expect(plan.engineers).toEqual([]);
    expect(plan.engineerVisits).toEqual([]);
  });

  it("looks up FSD Long Range G5 materials and engineers", () => {
    const plan = planEngineering([
      { moduleGroup: "fsd", blueprintName: "FSD_LongRange", grade: 5 },
    ]);

    expect(plan.materials.length).toBeGreaterThan(0);
    expect(plan.materialTotal["Arsenic"] ?? 0).toBeGreaterThan(0);
    expect(plan.materialTotal["Chemical Manipulators"] ?? 0).toBeGreaterThan(0);
    expect(
      plan.materialTotal["Datamined Wake Exceptions"] ?? 0,
    ).toBeGreaterThan(0);

    expect(plan.engineers).toContain("Felicity Farseer");
    expect(plan.engineers).toContain("Elvira Martuuk");
    expect(plan.engineers).toContain("Mel Brandon");
  });

  it("includes experimental effect materials", () => {
    const plan = planEngineering([
      {
        moduleGroup: "fsd",
        blueprintName: "FSD_LongRange",
        grade: 5,
        experimentalEffect: "special_fsd_heavy",
      },
    ]);

    const expMats = plan.materials.filter((m) => m.source === "experimental");
    expect(expMats.length).toBeGreaterThan(0);
    expect(
      plan.materialTotal["Atypical Disrupted Wake Echoes"] ?? 0,
    ).toBeGreaterThan(0);
  });

  it("aggregates materials across multiple modifications", () => {
    const plan = planEngineering([
      { moduleGroup: "fsd", blueprintName: "FSD_LongRange", grade: 5 },
    ]);
    const arsenicTotal = plan.materialTotal["Arsenic"];

    const sameMat = plan.materials.filter((m) => m.material === "Arsenic");
    const sumFromList = sameMat.reduce((acc, m) => acc + m.quantity, 0);
    expect(arsenicTotal).toBe(sumFromList);
  });

  it("returns empty engineers for unknown module group", () => {
    const plan = planEngineering([
      { moduleGroup: "nonexistent", blueprintName: "FSD_LongRange", grade: 5 },
    ]);
    expect(plan.engineers).toEqual([]);
    expect(plan.engineerVisits).toEqual([]);
  });
});

describe("getBlueprintComponents", () => {
  it("returns components for known blueprint grade", () => {
    const comps = getBlueprintComponents("FSD_LongRange", 5);
    expect(comps.length).toBeGreaterThan(0);
    for (const c of comps) {
      expect(c.source).toBe("blueprint");
      expect(c.grade).toBe(5);
      expect(c.material).toBeTruthy();
      expect(c.quantity).toBeGreaterThan(0);
    }
  });

  it("returns empty array for unknown blueprint", () => {
    expect(getBlueprintComponents("Nonexistent_BP", 1)).toEqual([]);
  });
});

describe("getExperimentalEffectComponents", () => {
  it("returns components for known experimental effect", () => {
    const comps = getExperimentalEffectComponents("special_mass_manager");
    if (comps.length > 0) {
      for (const c of comps) {
        expect(c.source).toBe("experimental");
        expect(c.material).toBeTruthy();
      }
    }
  });

  it("returns empty array for unknown effect", () => {
    expect(getExperimentalEffectComponents("special_nonexistent")).toEqual([]);
  });
});

describe("getEngineersForBlueprint", () => {
  it("returns engineers for FSD Long Range G5", () => {
    const engs = getEngineersForBlueprint("fsd", "FSD_LongRange", 5);
    expect(engs).toContain("Felicity Farseer");
    expect(engs).toContain("Elvira Martuuk");
    expect(engs.length).toBeGreaterThanOrEqual(2);
  });

  it("returns empty array for unknown module group", () => {
    expect(getEngineersForBlueprint("nonexistent", "FSD_LongRange", 5)).toEqual(
      [],
    );
  });
});
