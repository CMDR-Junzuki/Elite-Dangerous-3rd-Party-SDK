import { describe, expect, it } from "vitest";
import {
  getAllTitans,
  getDefeatedTitans,
  getTitanByName,
  getTitanBySystem,
  parseThargoidWarState,
  THARGOID_WAR_STATE_NAMES,
  ThargoidWarState,
  TITAN_NAMES,
  TITANS,
} from "../src";

describe("Thargoid War State", () => {
  it("has 6 war states", () => {
    expect(Object.keys(ThargoidWarState).length / 2).toBe(6);
  });

  it("has named values", () => {
    expect(THARGOID_WAR_STATE_NAMES[ThargoidWarState.None]).toBe("None");
    expect(THARGOID_WAR_STATE_NAMES[ThargoidWarState.Alert]).toBe("Alert");
    expect(THARGOID_WAR_STATE_NAMES[ThargoidWarState.Invasion]).toBe(
      "Invasion",
    );
    expect(THARGOID_WAR_STATE_NAMES[ThargoidWarState.Controlled]).toBe(
      "Controlled",
    );
    expect(THARGOID_WAR_STATE_NAMES[ThargoidWarState.Recovery]).toBe(
      "Recovery",
    );
    expect(THARGOID_WAR_STATE_NAMES[ThargoidWarState.Maelstrom]).toBe(
      "Maelstrom",
    );
  });

  it("has 8 titans", () => {
    expect(TITAN_NAMES).toHaveLength(8);
    for (const name of TITAN_NAMES) {
      expect(TITANS[name]).toBeDefined();
      expect(TITANS[name].systemName).toBeTruthy();
      expect(TITANS[name].state).toBe("defeated");
    }
  });

  it("getAllTitans returns all 8", () => {
    expect(getAllTitans()).toHaveLength(8);
  });

  it("getDefeatedTitans returns all 8 (war is over)", () => {
    expect(getDefeatedTitans()).toHaveLength(8);
  });

  it("getTitanByName finds known titans", () => {
    const taranis = getTitanByName("Taranis");
    expect(taranis).toBeDefined();
    expect(taranis!.systemName).toBe("Hyades Sector FB-N b7-6");

    expect(getTitanByName("Unknown")).toBeUndefined();
  });

  it("getTitanBySystem finds by system name", () => {
    // Check all system names resolve back to the correct titan
    for (const name of TITAN_NAMES) {
      const info = TITANS[name];
      const found = getTitanBySystem(info.systemName);
      expect(
        found,
        `Failed for ${name} with systemName "${info.systemName}"`,
      ).toBeDefined();
      expect(found!.name).toBe(name);
    }
  });

  it("parseThargoidWarState maps WarType strings", () => {
    expect(parseThargoidWarState({})).toBe(ThargoidWarState.None);
    expect(parseThargoidWarState({ WarType: "Alert" })).toBe(
      ThargoidWarState.Alert,
    );
    expect(parseThargoidWarState({ WarType: "Invasion" })).toBe(
      ThargoidWarState.Invasion,
    );
    expect(parseThargoidWarState({ WarType: "Controlled" })).toBe(
      ThargoidWarState.Controlled,
    );
    expect(parseThargoidWarState({ WarType: "Recovery" })).toBe(
      ThargoidWarState.Recovery,
    );
    expect(parseThargoidWarState({ WarType: "Maelstrom" })).toBe(
      ThargoidWarState.Maelstrom,
    );
    expect(parseThargoidWarState({ WarType: "Unknown" })).toBe(
      ThargoidWarState.None,
    );
  });
});
