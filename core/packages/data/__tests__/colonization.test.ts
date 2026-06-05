import { describe, expect, it } from "vitest";
import {
  BodyFeature,
  BodyType,
  colonizationCosts,
  getColonizationCosts,
  getSiteType,
  getTotalHaul,
  mapSitePads,
  primaryPortsT1,
  primaryPortsT2,
  primaryPortsT3,
  STELLAR_REMNANTS,
  siteTypes,
} from "../src";

describe("siteTypes", () => {
  it("has 60 entries", () => {
    expect(siteTypes.length).toBe(60);
  });

  it("first entry is Unknown with correct shape", () => {
    const u = siteTypes[0];
    expect(u.displayName).toBe("");
    expect(u.haul).toBe(0);
    expect(u.buildClass).toBe("unknown");
    expect(u.tier).toBe(0);
    expect(u.padSize).toBe("none");
    expect(u.orbital).toBe(true);
  });

  it("second entry has installation subType", () => {
    expect(siteTypes[1].displayName).toBe("Installation?");
    expect(siteTypes[1].subTypes).toEqual(["installation"]);
  });

  it("Coriolis starport has expected values", () => {
    const c = siteTypes[5];
    expect(c.displayName).toBe("Coriolis");
    expect(c.haul).toBe(63001);
    expect(c.buildClass).toBe("starport");
    expect(c.tier).toBe(2);
    expect(c.padSize).toBe("large");
    expect(c.score).toBe(8);
    expect(c.needs).toEqual({ tier: 2, count: 3 });
    expect(c.gives).toEqual({ tier: 3, count: 1 });
  });
});

describe("getSiteType", () => {
  it("returns Coriolis for no_truss", () => {
    expect(getSiteType("no_truss")?.displayName).toBe("Coriolis");
  });

  it("strips (primary) suffix before lookup", () => {
    expect(getSiteType("no_truss (primary)")?.displayName).toBe("Coriolis");
  });

  it("matches by altTypes", () => {
    expect(getSiteType("coriolis")?.displayName).toBe("Coriolis");
  });

  it("returns Commercial for plutus", () => {
    expect(getSiteType("plutus")?.displayName).toBe("Commercial");
  });

  it("returns Medium Agriculture for annona", () => {
    const t = getSiteType("annona");
    expect(t?.displayName).toBe("Medium Agriculture");
    expect(t?.padMap).toEqual({ picumnus: "large", annona: "small" });
  });

  it("returns undefined for empty string", () => {
    expect(getSiteType("")).toBeUndefined();
  });

  it("returns undefined for unknown type", () => {
    expect(getSiteType("nonexistent")).toBeUndefined();
  });
});

describe("mapSitePads", () => {
  it("has Coriolis pads for no_truss", () => {
    expect(mapSitePads.no_truss).toEqual([8, 11, 5]);
  });

  it("has Commercial outpost pads for plutus", () => {
    expect(mapSitePads.plutus).toEqual([3, 1, 0]);
  });

  it("has Planetary port pads for zeus", () => {
    expect(mapSitePads.zeus).toEqual([4, 4, 8]);
  });

  it("has Small Agriculture pads for consus", () => {
    expect(mapSitePads.consus).toEqual([1, 0, 0]);
  });
});

describe("primaryPorts", () => {
  it("T1 has 6 entries", () => {
    expect(primaryPortsT1).toEqual([
      "plutus",
      "vulcan",
      "dysnomia",
      "vesta",
      "prometheus",
      "nemesis",
    ]);
  });

  it("T2 has 4 entries", () => {
    expect(primaryPortsT2).toEqual([
      "no_truss",
      "dual_truss",
      "quad_truss",
      "asteroid",
    ]);
  });

  it("T3 has 6 entries", () => {
    expect(primaryPortsT3).toEqual([
      "apollo",
      "artemis",
      "ocellus",
      "dodec",
      "quint_truss",
      "dec_truss",
    ]);
  });
});

describe("colonizationCosts", () => {
  it("has entries for all major starport types", () => {
    expect(colonizationCosts.coriolis).toBeDefined();
    expect(colonizationCosts.ocellus).toBeDefined();
    expect(colonizationCosts.orbis).toBeDefined();
    expect(colonizationCosts.dodec).toBeDefined();
    expect(colonizationCosts.asteroid).toBeDefined();
  });

  it("has more than 50 cost entries", () => {
    expect(Object.keys(colonizationCosts).length).toBeGreaterThan(50);
  });

  it("Coriolis costs include expected materials", () => {
    expect(colonizationCosts.coriolis.steel).toBe(14076);
    expect(colonizationCosts.coriolis.titanium).toBe(8205);
    expect(colonizationCosts.coriolis.aluminium).toBe(10055);
  });

  it("Surface outpost costs include surface-specific materials", () => {
    const costs = colonizationCosts["surface-outpost"];
    expect(costs.surfacestabilisers).toBe(610);
    expect(costs.structuralregulators).toBe(678);
  });
});

describe("getColonizationCosts", () => {
  it("returns costs for settlement displayName2", () => {
    const costs = getColonizationCosts("Agriculture Settlement: Large");
    expect(costs.steel).toBeGreaterThan(0);
    expect(costs.aluminium).toBeGreaterThan(0);
  });

  it("returns empty object for unknown type", () => {
    expect(getColonizationCosts("Nonexistent")).toEqual({});
  });
});

describe("getTotalHaul", () => {
  it("returns correct total for Agriculture Settlement: Large", () => {
    expect(getTotalHaul("Agriculture Settlement: Large")).toBe(8517);
  });

  it("returns 0 for unknown type", () => {
    expect(getTotalHaul("Nonexistent")).toBe(0);
  });

  it("calculates haul matching sum of costs", () => {
    const haul = getTotalHaul("Agriculture Settlement: Large");
    const costs = getColonizationCosts("Agriculture Settlement: Large");
    const sum = Object.values(costs).reduce((s, v) => s + v, 0);
    expect(haul).toBe(sum);
  });
});

describe("BodyType enum", () => {
  it("has expected string values", () => {
    expect(BodyType.Un).toBe("un");
    expect(BodyType.Star).toBe("st");
    expect(BodyType.EarthLikeWorld).toBe("elw");
    expect(BodyType.WaterWorld).toBe("ww");
    expect(BodyType.GasGiant).toBe("gg");
    expect(BodyType.Rocky).toBe("rb");
    expect(BodyType.RockyIce).toBe("ri");
    expect(BodyType.Icy).toBe("ib");
    expect(BodyType.HighMetalContent).toBe("hmc");
    expect(BodyType.MetalRich).toBe("mrb");
    expect(BodyType.AmmoniaWorld).toBe("aw");
    expect(BodyType.BlackHole).toBe("bh");
    expect(BodyType.NeutronStar).toBe("ns");
    expect(BodyType.WhiteDwarf).toBe("wd");
  });
});

describe("BodyFeature enum", () => {
  it("has expected string values", () => {
    expect(BodyFeature.Bio).toBe("bio");
    expect(BodyFeature.Geo).toBe("geo");
    expect(BodyFeature.Landable).toBe("landable");
    expect(BodyFeature.Rings).toBe("rings");
    expect(BodyFeature.Terraformable).toBe("terraformable");
    expect(BodyFeature.Volcanism).toBe("volcanism");
    expect(BodyFeature.Atmosphere).toBe("atmosphere");
    expect(BodyFeature.Tidal).toBe("tidal");
  });
});

describe("STELLAR_REMNANTS", () => {
  it("contains BlackHole, NeutronStar, WhiteDwarf", () => {
    expect(STELLAR_REMNANTS).toContain(BodyType.BlackHole);
    expect(STELLAR_REMNANTS).toContain(BodyType.NeutronStar);
    expect(STELLAR_REMNANTS).toContain(BodyType.WhiteDwarf);
    expect(STELLAR_REMNANTS.length).toBe(3);
  });
});
