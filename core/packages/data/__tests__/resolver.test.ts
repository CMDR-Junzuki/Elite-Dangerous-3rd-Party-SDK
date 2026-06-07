import { describe, expect, it } from "vitest";
import {
  getCommodityBySymbol,
  getEngineerByEdId,
  getModuleByEdId,
  getShipByEdId,
  resolveCommodity,
  resolveEngineer,
  resolveEngineerByName,
  resolveMaterial,
  resolveMaterialBySymbol,
  resolveMicroresource,
  resolveMicroresourceBySymbol,
  resolveModule,
  resolveOutfitting,
  resolveShip,
  resolveShipByName,
  resolveShipyard,
} from "../src/resolver.js";

describe("resolveModule", () => {
  it("resolves FSD module (edId=128064128)", () => {
    const mod = resolveModule(128064128);
    expect(mod).not.toBeNull();
    expect((mod as any).grp).toBe("fsd");
  });

  it("returns null for unknown edId", () => {
    expect(resolveModule(-1)).toBeNull();
  });
});

describe("resolveShip", () => {
  it("resolves Sidewinder (edId=128049249)", () => {
    const ship = resolveShip(128049249);
    expect(ship).not.toBeNull();
    expect(ship.properties.name).toContain("Sidewinder");
  });

  it("returns null for unknown edId", () => {
    expect(resolveShip(-1)).toBeNull();
  });
});

describe("resolveShipByName", () => {
  it("resolves exact name", () => {
    const ship = resolveShipByName("Sidewinder");
    expect(ship).not.toBeNull();
  });

  it("returns null for unknown name", () => {
    expect(resolveShipByName("nonexistent_ship_xyz")).toBeNull();
  });
});

describe("resolveCommodity", () => {
  it("resolves Gold by symbol", () => {
    const com = resolveCommodity("Gold");
    expect(com).not.toBeNull();
    expect(com.name).toContain("Gold");
  });

  it("returns null for unknown symbol", () => {
    expect(resolveCommodity("xyz_invalid")).toBeNull();
  });
});

describe("resolveEngineer", () => {
  it("resolves Felicity Farseer (edId=300100)", () => {
    const eng = resolveEngineer(300100);
    expect(eng).not.toBeNull();
    expect(eng.name).toContain("Farseer");
  });

  it("returns null for unknown edId", () => {
    expect(resolveEngineer(-1)).toBeNull();
  });
});

describe("resolveEngineerByName", () => {
  it("resolves by name case-insensitively", () => {
    const eng = resolveEngineerByName("Felicity Farseer");
    expect(eng).not.toBeNull();
  });

  it("returns null for unknown name", () => {
    expect(resolveEngineerByName("nonexistent engineer")).toBeNull();
  });
});

describe("resolveMaterial", () => {
  it("resolves Nickel by edId", () => {
    const mat = resolveMaterial(128672319);
    expect(mat).not.toBeNull();
    expect(mat.name).toContain("Nickel");
  });

  it("returns null for unknown edId", () => {
    expect(resolveMaterial(-1)).toBeNull();
  });
});

describe("resolveMaterialBySymbol", () => {
  it("resolves by symbol", () => {
    const mat = resolveMaterialBySymbol("Nickel");
    expect(mat).not.toBeNull();
  });

  it("returns null for unknown symbol", () => {
    expect(resolveMaterialBySymbol("xyz")).toBeNull();
  });
});

describe("resolveMicroresource", () => {
  it("resolves healthpack (edId=128932270)", () => {
    const mr = resolveMicroresource(128932270);
    expect(mr).not.toBeNull();
  });

  it("returns null for unknown edId", () => {
    expect(resolveMicroresource(-1)).toBeNull();
  });
});

describe("resolveMicroresourceBySymbol", () => {
  it("resolves by symbol", () => {
    const mr = resolveMicroresourceBySymbol("healthpack");
    expect(mr).not.toBeNull();
  });

  it("returns null for unknown symbol", () => {
    expect(resolveMicroresourceBySymbol("xyz")).toBeNull();
  });
});

describe("resolveOutfitting", () => {
  it("resolves Sidewinder armour (edId=128049250)", () => {
    const o = resolveOutfitting(128049250);
    expect(o).not.toBeNull();
  });

  it("returns null for unknown edId", () => {
    expect(resolveOutfitting(-1)).toBeNull();
  });
});

describe("resolveShipyard", () => {
  it("resolves Sidewinder by edId", () => {
    const s = resolveShipyard(128049249);
    expect(s).not.toBeNull();
  });

  it("returns null for unknown edId", () => {
    expect(resolveShipyard(-1)).toBeNull();
  });
});

describe("legacy aliases", () => {
  it("getModuleByEdId resolves modules", () => {
    expect(getModuleByEdId(128064128)).not.toBeNull();
  });

  it("getShipByEdId resolves ships", () => {
    expect(getShipByEdId(128049249)).not.toBeNull();
  });

  it("getCommodityBySymbol resolves commodities", () => {
    expect(getCommodityBySymbol("Gold")).not.toBeNull();
  });

  it("getEngineerByEdId resolves engineers", () => {
    expect(getEngineerByEdId(300100)).not.toBeNull();
  });
});
