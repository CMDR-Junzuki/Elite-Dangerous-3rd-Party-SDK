import {
  getAvailableModifications,
  ON_FOOT_MODIFICATIONS,
  planOnFootEngineering,
  SUIT_BASE_STATS,
  SUIT_UPGRADE_COSTS,
  WEAPON_BASE_STATS,
  WEAPON_UPGRADE_COSTS,
} from "@elite-dangerous-sdk/data";
import { describe, expect, it } from "vitest";
import { calculateSuitStats, calculateWeaponStats } from "../src/on-foot.js";

describe("on-foot engineering data", () => {
  describe("suit base stats", () => {
    it("should have all 3 suit types", () => {
      expect(Object.keys(SUIT_BASE_STATS)).toEqual([
        "dominator",
        "maverick",
        "artemis",
      ]);
    });

    it("should have correct dominator shield", () => {
      expect(SUIT_BASE_STATS.dominator.shield).toBe(15.0);
    });

    it("should have correct maverick goods capacity", () => {
      expect(SUIT_BASE_STATS.maverick.goodsCapacity).toBe(40);
    });

    it("should have correct artemis battery", () => {
      expect(SUIT_BASE_STATS.artemis.battery).toBe(17);
    });
  });

  describe("weapon base stats", () => {
    it("should have correct Karma L-6 stats", () => {
      const l6 = WEAPON_BASE_STATS["Karma L-6"];
      expect(l6.dps).toBe(44.4);
      expect(l6.magazineSize).toBe(2);
      expect(l6.effectiveRange).toBe(300);
    });

    it("should have correct Manticore Executioner headshot", () => {
      const exec = WEAPON_BASE_STATS["Manticore Executioner"];
      expect(exec.headshotMultiplier).toBe(3.0);
    });
  });

  describe("suit upgrade costs", () => {
    it("should have costs for all suit types", () => {
      expect(Object.keys(SUIT_UPGRADE_COSTS)).toEqual([
        "dominator",
        "maverick",
        "artemis",
      ]);
    });

    it("should have correct dominator G5 costs", () => {
      const g5 = SUIT_UPGRADE_COSTS.dominator.g5;
      expect(g5["Titanium Plating"]).toBe(35);
      expect(g5["Suit Schematic"]).toBe(15);
    });
  });

  describe("weapon upgrade costs", () => {
    it("should have costs for 3 manufacturers", () => {
      expect(Object.keys(WEAPON_UPGRADE_COSTS)).toEqual([
        "kinematic",
        "takada",
        "manticore",
      ]);
    });

    it("should have correct kinematic G5 costs", () => {
      const g5 = WEAPON_UPGRADE_COSTS.kinematic.g5;
      expect(g5["Tungsten Carbide"]).toBe(12);
      expect(g5["Weapon Schematic"]).toBe(5);
    });
  });

  describe("modifications", () => {
    it("should have 25 modifications", () => {
      expect(Object.keys(ON_FOOT_MODIFICATIONS)).toHaveLength(25);
    });

    it("should have 14 suit modifications", () => {
      const suitMods = Object.values(ON_FOOT_MODIFICATIONS).filter(
        (m) => m.type === "suit",
      );
      expect(suitMods).toHaveLength(14);
    });

    it("should have 11 weapon modifications", () => {
      const weaponMods = Object.values(ON_FOOT_MODIFICATIONS).filter(
        (m) => m.type === "weapon",
      );
      expect(weaponMods).toHaveLength(11);
    });

    it("should have engineers on each modification", () => {
      for (const [name, mod] of Object.entries(ON_FOOT_MODIFICATIONS)) {
        expect(mod.engineers.length).toBeGreaterThanOrEqual(1);
      }
    });

    it("Night Vision should require Oden Geiger and Yi Shen", () => {
      const nv = ON_FOOT_MODIFICATIONS["Night Vision"];
      expect(nv.engineers).toContain("Oden Geiger");
      expect(nv.engineers).toContain("Yi Shen");
    });
  });

  describe("getAvailableModifications", () => {
    it("should return all suit mods for dominator", () => {
      const mods = getAvailableModifications("suit", "dominator");
      expect(mods.length).toBeGreaterThan(10);
    });

    it("should not include weapon mods in suit query", () => {
      const mods = getAvailableModifications("suit");
      for (const m of mods) {
        expect(m.type).toBe("suit");
      }
    });
  });
});

describe("on-foot stat calculator", () => {
  describe("calculateSuitStats", () => {
    it("should return base stats with no mods", () => {
      const stats = calculateSuitStats("dominator", []);
      expect(stats.shield).toBe(15.0);
      expect(stats.sprintDuration).toBe(1);
    });

    it("should apply Night Vision", () => {
      const stats = calculateSuitStats("dominator", ["Night Vision"]);
      expect(stats.nightVision).toBe(true);
    });

    it("should multiply battery with Improved Battery Capacity", () => {
      const stats = calculateSuitStats("artemis", [
        "Improved Battery Capacity",
      ]);
      expect(stats.battery).toBe(17 * 1.5);
    });

    it("should apply Damage Resistance multiplicatively", () => {
      const stats = calculateSuitStats("dominator", ["Damage Resistance"]);
      expect(stats.resistance.thermal).toBeCloseTo(
        1 - (1 - 0.6) * (1 - 0.1),
        5,
      );
    });
  });

  describe("calculateWeaponStats", () => {
    it("should return null for unknown weapon", () => {
      expect(calculateWeaponStats("Unknown", 1, [])).toBeNull();
    });

    it("should return base stats at grade 1", () => {
      const stats = calculateWeaponStats("Karma C-44", 1, []);
      expect(stats).not.toBeNull();
      expect(stats!.dps).toBeCloseTo(8.0, 1);
    });

    it("should increase DPS with grade", () => {
      const g1 = calculateWeaponStats("Karma C-44", 1, []);
      const g5 = calculateWeaponStats("Karma C-44", 5, []);
      expect(g5!.dps).toBeGreaterThan(g1!.dps);
    });

    it("should apply Magazine Size mod", () => {
      const stats = calculateWeaponStats("Karma C-44", 1, ["Magazine Size"]);
      expect(stats!.magazineSize).toBe(90);
    });

    it("should apply Greater Range mod", () => {
      const stats = calculateWeaponStats("Karma C-44", 1, ["Greater Range"]);
      expect(stats!.effectiveRange).toBe(25 * 1.5);
    });
  });
});

describe("on-foot planner", () => {
  it("should plan suit upgrade materials", () => {
    const plan = planOnFootEngineering([
      {
        type: "suit",
        name: "dominator",
        currentGrade: 1,
        targetGrade: 5,
        modifications: [],
      },
    ]);
    expect(plan.materialTotal["Suit Schematic"]).toBe(31);
    expect(plan.materialTotal["Manufacturing Instructions"]).toBe(31);
    expect(plan.materialTotal["Titanium Plating"]).toBe(80);
  });

  it("should plan weapon upgrade materials", () => {
    const plan = planOnFootEngineering([
      {
        type: "weapon",
        name: "Karma C-44",
        currentGrade: 1,
        targetGrade: 5,
        modifications: [],
      },
    ]);
    expect(plan.materialTotal["Weapon Schematic"]).toBe(12);
    expect(plan.materialTotal["Compression-Liquefied Gas"]).toBe(12);
  });

  it("should plan modification materials and credits", () => {
    const plan = planOnFootEngineering([
      {
        type: "suit",
        name: "dominator",
        currentGrade: 5,
        targetGrade: 5,
        modifications: ["Night Vision", "Faster Shield Regen"],
      },
    ]);
    expect(plan.totalCredits).toBe(1_750_000);
    expect(plan.engineers).toContain("Oden Geiger");
    expect(plan.engineers).toContain("Kit Fowler");
  });

  it("should combine upgrade and mod materials", () => {
    const plan = planOnFootEngineering([
      {
        type: "suit",
        name: "dominator",
        currentGrade: 1,
        targetGrade: 5,
        modifications: ["Night Vision"],
      },
    ]);
    expect(plan.materials.length).toBeGreaterThan(0);
    expect(plan.engineers).toContain("Oden Geiger");
  });
});
