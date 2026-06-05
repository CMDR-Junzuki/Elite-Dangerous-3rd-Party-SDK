import { describe, expect, it } from "vitest";
import {
  hardpointModules,
  hardpointModulesByEdId,
  internalModulesByEdId,
  ships,
  shipsByEdId,
  standardModules,
  standardModulesByEdId,
} from "../src/generated/coriolis";
import { cqcRanks } from "../src/generated/fdevids/CQCRank";
import { combatRanks } from "../src/generated/fdevids/combatrank";
import { commoditiesBySymbol } from "../src/generated/fdevids/commodity";
import { empireRanks } from "../src/generated/fdevids/EmpireRank";
import { explorationRanks } from "../src/generated/fdevids/ExplorationRank";
import { economies } from "../src/generated/fdevids/economy";
import { engineers } from "../src/generated/fdevids/engineers";
import { federationRanks } from "../src/generated/fdevids/FederationRank";
import { governments } from "../src/generated/fdevids/government";
import { materials } from "../src/generated/fdevids/material";
import { outfittings } from "../src/generated/fdevids/outfitting";
import { securities } from "../src/generated/fdevids/security";
import { shipyards } from "../src/generated/fdevids/shipyard";
import { systemAllegiances } from "../src/generated/fdevids/systemallegiance";
import { tradeRanks } from "../src/generated/fdevids/TradeRank";
import {
  getCommodityBySymbol,
  getEngineerByEdId,
  getModuleByEdId,
  getShipByEdId,
} from "../src/lookups";

describe("coriolis ships", () => {
  it("has all expected ships", () => {
    const expected = [
      "Sidewinder",
      "Eagle",
      "Hauler",
      "Adder",
      "Federal Dropship",
      "Anaconda",
      "Type-9 Heavy",
      "Type-10 Defender",
    ];
    for (const name of expected) {
      expect(ships.find((s) => s.properties?.name === name)).toBeTruthy();
    }
  });

  it("has shipsByEdId map with all ships", () => {
    expect(shipsByEdId.size).toBeGreaterThanOrEqual(38);
  });

  it("Sidewinder has expected mass", () => {
    const ship = getShipByEdId(128049249);
    expect(ship?.properties?.hullMass).toBe(25);
    expect(ship?.properties?.masslock).toBe(6);
  });

  it("Anaconda has expected hardpoint slots", () => {
    const ship = getShipByEdId(128049303);
    const hps = ship?.slots?.hardpoints;
    expect(hps).toBeDefined();
    expect(hps?.length).toBe(10);
  });

  it("each ship has required fields", () => {
    for (const ship of ships) {
      expect(ship.edID).toBeDefined();
      expect(ship.properties?.name).toBeTruthy();
      expect(ship.properties?.hullMass).toBeGreaterThan(0);
    }
  });
});

describe("coriolis modules", () => {
  it("has armor modules", () => {
    const bulkheads = standardModules.filter((m) => m.grp === "s");
    expect(bulkheads.length).toBeGreaterThanOrEqual(12);
  });

  it("has power plant modules", () => {
    const pp = standardModules.filter((m) => m.grp === "pp");
    expect(pp.length).toBeGreaterThanOrEqual(8);
  });

  it("has frame shift drive modules", () => {
    const fsd = standardModules.filter((m) => m.grp === "fsd");
    expect(fsd.length).toBeGreaterThanOrEqual(8);
  });

  it("has weapon modules in hardpoints", () => {
    const weapons = hardpointModules.filter(
      (m) => m.grp === "mc" || m.grp === "pl",
    );
    expect(weapons.length).toBeGreaterThanOrEqual(4);
  });

  it("finds module by edId", () => {
    const module = getModuleByEdId(128064128);
    expect(module).not.toBeNull();
    expect((module as any)?.grp).toBe("fsd");
  });

  it("all module maps are populated", () => {
    expect(hardpointModulesByEdId.size).toBeGreaterThan(0);
    expect(internalModulesByEdId.size).toBeGreaterThan(0);
    expect(standardModulesByEdId.size).toBeGreaterThan(0);
  });

  it("returns null for unknown module", () => {
    expect(getModuleByEdId(9999999)).toBeNull();
  });
});

describe("FDevID data", () => {
  it("has commodities", () => {
    expect(commoditiesBySymbol.size).toBeGreaterThanOrEqual(100);
    const bertrandite = getCommodityBySymbol("Bertrandite");
    expect(bertrandite).not.toBeNull();
    expect(bertrandite?.category).toBe("Minerals");
  });

  it("has outfitting categories", () => {
    expect(outfittings.length).toBeGreaterThan(0);
    expect(outfittings.some((o) => o.category === "standard")).toBe(true);
  });

  it("has shipyard entries", () => {
    expect(shipyards.length).toBeGreaterThanOrEqual(38);
    const sidewinderFind = shipyards.find((s) => s.symbol === "SideWinder");
    expect(sidewinderFind).toBeTruthy();
  });

  it("has engineers", () => {
    expect(engineers.length).toBeGreaterThanOrEqual(38);
    const felicity = getEngineerByEdId(300100);
    expect(felicity?.name).toBe("Felicity Farseer");
  });

  it("has materials", () => {
    expect(materials.length).toBeGreaterThanOrEqual(50);
    expect(materials.some((m) => m.type === "Raw")).toBe(true);
    expect(materials.some((m) => m.type === "Manufactured")).toBe(true);
    expect(materials.some((m) => m.type === "Encoded")).toBe(true);
  });

  it("has rank tables", () => {
    expect(combatRanks.length).toBeGreaterThanOrEqual(9);
    expect(tradeRanks.length).toBeGreaterThanOrEqual(9);
    expect(explorationRanks.length).toBeGreaterThanOrEqual(9);
    expect(empireRanks.length).toBeGreaterThanOrEqual(15);
    expect(federationRanks.length).toBeGreaterThanOrEqual(15);
    expect(cqcRanks.length).toBeGreaterThanOrEqual(9);
  });

  it("has economy data", () => {
    expect(economies.length).toBeGreaterThan(0);
    expect(economies.find((e) => e.name === "Agriculture")).toBeTruthy();
  });

  it("has government data", () => {
    expect(governments.length).toBeGreaterThan(0);
    expect(governments.find((g) => g.name === "Democracy")).toBeTruthy();
  });

  it("has allegiance data", () => {
    expect(systemAllegiances.length).toBeGreaterThan(0);
    expect(
      systemAllegiances.find((a) => a.system_allegiance === "Federation"),
    ).toBeTruthy();
    expect(
      systemAllegiances.find((a) => a.system_allegiance === "Empire"),
    ).toBeTruthy();
  });

  it("has security data", () => {
    expect(securities.length).toBeGreaterThan(0);
    expect(securities.find((s) => s.name === "High")).toBeTruthy();
  });
});
