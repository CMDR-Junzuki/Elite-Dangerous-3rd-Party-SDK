import { BodyFeature, BodyType, getSiteType } from "@elite-dangerous-sdk/data";
import { describe, expect, it } from "vitest";
import type { RawSys } from "../src";
import {
  applyTax,
  buildSystemModel2,
  COLONY_STATE_NAMES,
  ColonyState,
  type ConstructionResource,
  createConstructionSite,
  getPreReqNeeded,
  getResourceShortfall,
  getTotalProgress,
  hasPreReq2,
  parseColonisationConstructionDepot,
  predictSurfaceSlots,
} from "../src";

describe("Colonization", () => {
  it("has 6 colony states", () => {
    expect(Object.keys(ColonyState).length / 2).toBe(6);
  });

  it("has named values for all states", () => {
    expect(COLONY_STATE_NAMES[ColonyState.None]).toBe("None");
    expect(COLONY_STATE_NAMES[ColonyState.Active]).toBe("Active");
    expect(COLONY_STATE_NAMES[ColonyState.Failed]).toBe("Failed");
  });

  it("createConstructionSite creates a valid site", () => {
    const site = createConstructionSite(1234, true);
    expect(site.marketId).toBe(1234);
    expect(site.primaryPort).toBe(true);
    expect(site.constructionProgress).toBe(0);
    expect(site.constructionComplete).toBe(false);
    expect(site.resourcesRequired).toEqual([]);
    expect(site.id).toBeTruthy();
  });

  it("getResourceShortfall returns correct values", () => {
    const resource: ConstructionResource = {
      name: "$steel_name;",
      nameLocalised: "Steel",
      requiredAmount: 1000,
      providedAmount: 300,
      payment: 500,
    };
    expect(getResourceShortfall(resource)).toBe(700);

    const full: ConstructionResource = {
      name: "$steel_name;",
      nameLocalised: "Steel",
      requiredAmount: 1000,
      providedAmount: 1000,
      payment: 500,
    };
    expect(getResourceShortfall(full)).toBe(0);

    const over: ConstructionResource = {
      name: "$steel_name;",
      nameLocalised: "Steel",
      requiredAmount: 1000,
      providedAmount: 1200,
      payment: 500,
    };
    expect(getResourceShortfall(over)).toBe(0);
  });

  it("getTotalProgress returns correct progress", () => {
    const site = createConstructionSite(1, false);
    expect(getTotalProgress(site)).toBe(0);

    site.resourcesRequired = [
      {
        name: "$steel_name;",
        nameLocalised: "Steel",
        requiredAmount: 1000,
        providedAmount: 500,
        payment: 500,
      },
      {
        name: "$titanium_name;",
        nameLocalised: "Titanium",
        requiredAmount: 500,
        providedAmount: 500,
        payment: 300,
      },
    ];
    const progress = getTotalProgress(site);
    expect(progress).toBeCloseTo(1000 / 1500, 5);
  });

  it("parseColonisationConstructionDepot parses journal event", () => {
    const site = parseColonisationConstructionDepot({
      MarketID: 3956008962,
      ConstructionProgress: 0.703,
      ConstructionComplete: false,
      ConstructionFailed: false,
      ResourcesRequired: [
        {
          Name: "$aluminium_name;",
          Name_Localised: "Aluminium",
          RequiredAmount: 491,
          ProvidedAmount: 491,
          Payment: 3239,
        },
        {
          Name: "$steel_name;",
          Name_Localised: "Steel",
          RequiredAmount: 1000,
          ProvidedAmount: 300,
          Payment: 5000,
        },
      ],
    });

    expect(site.marketId).toBe(3956008962);
    expect(site.constructionProgress).toBeCloseTo(0.703, 3);
    expect(site.constructionComplete).toBe(false);
    expect(site.resourcesRequired).toHaveLength(2);
    expect(site.resourcesRequired[0].nameLocalised).toBe("Aluminium");
    expect(site.resourcesRequired[0].providedAmount).toBe(491);
    expect(site.resourcesRequired[1].nameLocalised).toBe("Steel");
    expect(site.resourcesRequired[1].requiredAmount).toBe(1000);
    expect(site.resourcesRequired[1].providedAmount).toBe(300);
    expect(getResourceShortfall(site.resourcesRequired[1])).toBe(700);
  });
});

describe("applyTax", () => {
  it("returns same cost when taxCount <= 0", () => {
    expect(applyTax(2, 10, 0)).toBe(10);
    expect(applyTax(3, 10, 0)).toBe(10);
    expect(applyTax(2, 10, -1)).toBe(10);
    expect(applyTax(3, 10, -1)).toBe(10);
  });

  it("tier 3 with taxCount 1 doubles the cost", () => {
    expect(applyTax(3, 10, 1)).toBe(20);
    expect(applyTax(3, 100, 1)).toBe(200);
  });

  it("tier 3 with taxCount 2 triples the cost", () => {
    expect(applyTax(3, 10, 2)).toBe(30);
  });

  it("non-tier 3 with taxCount 1 adds truncated 75%", () => {
    expect(applyTax(2, 10, 1)).toBe(17);
    expect(applyTax(1, 8, 1)).toBe(14);
  });

  it("non-tier 3 with taxCount 2 adds truncated 150%", () => {
    expect(applyTax(2, 10, 2)).toBe(25);
  });
});

describe("sumTierPoints", () => {
  it("calculates plus from a Commercial outpost (gives T2)", () => {
    const sys: RawSys = {
      v: 1,
      rev: 1,
      name: "Test",
      id64: 1,
      architect: "t",
      pos: [0, 0, 0],
      reserveLevel: "pristine",
      bodies: [
        {
          name: "B1",
          num: 1,
          distLS: 100,
          parents: [0],
          type: BodyType.Un,
          subType: "U",
          features: [],
          radius: 1000,
          temp: 300,
          gravity: 0.1,
        },
      ],
      sites: [
        {
          id: "s1",
          buildId: "b1",
          marketId: 1,
          name: "Commercial",
          bodyNum: 1,
          buildType: "plutus",
          status: "complete",
        },
      ],
      slots: {},
      revs: [],
    };
    const r = buildSystemModel2(sys, false);
    expect(r.tierPoints.tier2).toBe(1);
    expect(r.tierPoints.tier3).toBe(0);
  });

  it("deducts needs for a non-primary Coriolis starport", () => {
    const sys: RawSys = {
      v: 1,
      rev: 1,
      name: "Test",
      id64: 1,
      architect: "t",
      pos: [0, 0, 0],
      reserveLevel: "pristine",
      bodies: [
        {
          name: "B1",
          num: 1,
          distLS: 100,
          parents: [0],
          type: BodyType.Un,
          subType: "U",
          features: [],
          radius: 1000,
          temp: 300,
          gravity: 0.1,
        },
      ],
      sites: [
        {
          id: "s1",
          buildId: "b1",
          marketId: 1,
          name: "Commercial",
          bodyNum: 1,
          buildType: "plutus",
          status: "complete",
        },
        {
          id: "s2",
          buildId: "b2",
          marketId: 2,
          name: "Coriolis",
          bodyNum: 1,
          buildType: "no_truss",
          status: "complete",
        },
      ],
      slots: {},
      revs: [],
    };
    const r = buildSystemModel2(sys, false);
    expect(r.tierPoints.tier2).toBe(-2);
    expect(r.tierPoints.tier3).toBe(1);
  });
});

describe("getPreReqNeeded", () => {
  it("returns satellite types for satellite prereq", () => {
    const st = getSiteType("aergia")!;
    expect(st.preReq).toBe("satellite");
    expect(getPreReqNeeded(st)).toEqual(["hermes", "angelia", "eirene"]);
  });

  it("returns comms types for comms prereq", () => {
    const st = getSiteType("tellus_e")!;
    expect(st.preReq).toBe("comms");
    expect(getPreReqNeeded(st)).toEqual(["pistis", "soter", "aletheia"]);
  });

  it("returns installationMil types for settlementMilitary prereq", () => {
    const st = getSiteType("vacuna")!;
    expect(st.preReq).toBe("settlementMilitary");
    expect(getPreReqNeeded(st)).toEqual([
      "ioke",
      "bellona",
      "enyo",
      "polemos",
      "minerva",
    ]);
  });

  it("returns relay types for relay prereq", () => {
    const st = getSiteType("dicaeosyne")!;
    expect(st.preReq).toBe("relay");
    expect(getPreReqNeeded(st)).toEqual(["enodia", "ichnaea"]);
  });

  it("returns empty array for no prereq", () => {
    const st = getSiteType("plutus")!;
    expect(st.preReq).toBeUndefined();
    expect(getPreReqNeeded(st)).toEqual([]);
  });
});

describe("hasPreReq2", () => {
  it("returns true when matching site exists", () => {
    const sys: RawSys = {
      v: 1,
      rev: 1,
      name: "Test",
      id64: 1,
      architect: "t",
      pos: [0, 0, 0],
      reserveLevel: "pristine",
      bodies: [
        {
          name: "B1",
          num: 1,
          distLS: 100,
          parents: [0],
          type: BodyType.Un,
          subType: "U",
          features: [],
          radius: 1000,
          temp: 300,
          gravity: 0.1,
        },
      ],
      sites: [
        {
          id: "s1",
          buildId: "b1",
          marketId: 1,
          name: "Satellite",
          bodyNum: 1,
          buildType: "hermes",
          status: "complete",
        },
      ],
      slots: {},
      revs: [],
    };
    const r = buildSystemModel2(sys, false);
    const touristType = getSiteType("aergia")!;
    expect(hasPreReq2(r.siteMaps, touristType)).toBe(true);
  });

  it("returns false when no matching site exists", () => {
    const sys: RawSys = {
      v: 1,
      rev: 1,
      name: "Test",
      id64: 1,
      architect: "t",
      pos: [0, 0, 0],
      reserveLevel: "pristine",
      bodies: [
        {
          name: "B1",
          num: 1,
          distLS: 100,
          parents: [0],
          type: BodyType.Un,
          subType: "U",
          features: [],
          radius: 1000,
          temp: 300,
          gravity: 0.1,
        },
      ],
      sites: [
        {
          id: "s1",
          buildId: "b1",
          marketId: 1,
          name: "Commercial",
          bodyNum: 1,
          buildType: "plutus",
          status: "complete",
        },
      ],
      slots: {},
      revs: [],
    };
    const r = buildSystemModel2(sys, false);
    const touristType = getSiteType("aergia")!;
    expect(hasPreReq2(r.siteMaps, touristType)).toBe(false);
  });

  it("returns true when siteMaps is undefined", () => {
    const plutus = getSiteType("plutus")!;
    expect(hasPreReq2(undefined, plutus)).toBe(true);
  });
});

describe("predictSurfaceSlots", () => {
  it("returns 0 for body temp > 700", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Rocky,
        features: [BodyFeature.Landable],
        temp: 800,
        gravity: 0.5,
        radius: 5000,
        subType: "Rocky world",
      }),
    ).toBe(0);
  });

  it("returns 0 for gravity > 2.7", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Rocky,
        features: [BodyFeature.Landable],
        temp: 300,
        gravity: 3.0,
        radius: 5000,
        subType: "Rocky world",
      }),
    ).toBe(0);
  });

  it("returns 0 for non-landable body", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.GasGiant,
        features: [],
        temp: 200,
        gravity: 0.5,
        radius: 5000,
        subType: "Gas giant",
      }),
    ).toBe(0);
  });

  it("returns 1 for radius < 1500", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Rocky,
        features: [BodyFeature.Landable],
        temp: 300,
        gravity: 0.1,
        radius: 1000,
        subType: "Rocky world",
      }),
    ).toBe(1);
  });

  it("returns 2 for radius 1500-3749", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Rocky,
        features: [BodyFeature.Landable],
        temp: 300,
        gravity: 0.1,
        radius: 2000,
        subType: "Rocky world",
      }),
    ).toBe(2);
  });

  it("returns 3 for radius 3750-5999", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Rocky,
        features: [BodyFeature.Landable],
        temp: 300,
        gravity: 0.1,
        radius: 4000,
        subType: "Rocky world",
      }),
    ).toBe(3);
  });

  it("returns 4 for radius >= 6000", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Rocky,
        features: [BodyFeature.Landable],
        temp: 300,
        gravity: 0.1,
        radius: 6000,
        subType: "Rocky world",
      }),
    ).toBe(4);
  });

  it("adds +1 for High metal content world", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.HighMetalContent,
        features: [BodyFeature.Landable],
        temp: 300,
        gravity: 0.1,
        radius: 1000,
        subType: "High metal content world",
      }),
    ).toBe(2);
  });

  it("adds +1 for Terraformable", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Rocky,
        features: [BodyFeature.Landable, BodyFeature.Terraformable],
        temp: 300,
        gravity: 0.1,
        radius: 1000,
        subType: "Rocky world",
      }),
    ).toBe(2);
  });

  it("adds +1 for Volcanism or Geo", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Rocky,
        features: [BodyFeature.Landable, BodyFeature.Volcanism],
        temp: 300,
        gravity: 0.1,
        radius: 1000,
        subType: "Rocky world",
      }),
    ).toBe(2);
  });

  it("adds +2 for Atmosphere", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Rocky,
        features: [BodyFeature.Landable, BodyFeature.Atmosphere],
        temp: 300,
        gravity: 0.1,
        radius: 1000,
        subType: "Rocky world",
      }),
    ).toBe(3);
  });

  it("caps at 7 with all bonuses", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.HighMetalContent,
        features: [
          BodyFeature.Landable,
          BodyFeature.Terraformable,
          BodyFeature.Volcanism,
          BodyFeature.Atmosphere,
        ],
        temp: 300,
        gravity: 0.5,
        radius: 10000,
        subType: "High metal content world",
      }),
    ).toBe(7);
  });

  it("returns -1 for Unknown body type", () => {
    expect(
      predictSurfaceSlots({
        type: BodyType.Un,
        features: [],
        temp: 300,
        gravity: 0.1,
        radius: 1000,
        subType: "",
      }),
    ).toBe(-1);
  });
});

describe("buildSystemModel2", () => {
  it("builds a model with 1 body and 1 site", () => {
    const sys: RawSys = {
      v: 1,
      rev: 1,
      name: "Alpha System",
      id64: 999,
      architect: "cmdr",
      pos: [10, 20, 30],
      reserveLevel: "major",
      bodies: [
        {
          name: "Alpha 1",
          num: 1,
          distLS: 500,
          parents: [0],
          type: BodyType.Rocky,
          subType: "Rocky world",
          features: [BodyFeature.Landable],
          radius: 2000,
          temp: 300,
          gravity: 0.2,
        },
      ],
      sites: [
        {
          id: "site-a",
          buildId: "build-a",
          marketId: 100,
          name: "Small Agriculture Hub",
          bodyNum: 1,
          buildType: "consus",
          status: "complete",
        },
      ],
      slots: {},
      revs: [{ rev: 1, name: "initial" }],
    };
    const result = buildSystemModel2(sys, false);
    expect(result.name).toBe("Alpha System");
    expect(result.bodies.length).toBe(1);
    expect(result.sites.length).toBe(1);
    expect(result.siteMaps.length).toBe(1);

    const site = result.siteMaps[0];
    expect(site.name).toBe("Small Agriculture Hub");
    expect(site.type.displayName).toBe("Small Agriculture");
    expect(site.body?.name).toBe("Alpha 1");
    expect(result.bodyMap["Alpha 1"]).toBeDefined();
  });

  it("calculates tier points for a complete system", () => {
    const sys: RawSys = {
      v: 1,
      rev: 1,
      name: "Points Test",
      id64: 1,
      architect: "t",
      pos: [0, 0, 0],
      reserveLevel: "pristine",
      bodies: [
        {
          name: "B1",
          num: 1,
          distLS: 100,
          parents: [0],
          type: BodyType.Un,
          subType: "U",
          features: [],
          radius: 1000,
          temp: 300,
          gravity: 0.1,
        },
      ],
      sites: [
        {
          id: "s1",
          buildId: "b1",
          marketId: 1,
          name: "Comm Outpost",
          bodyNum: 1,
          buildType: "plutus",
          status: "complete",
        },
      ],
      slots: {},
      revs: [],
    };
    const r = buildSystemModel2(sys, false);
    expect(r.systemScore).toBe(3);
    expect(r.tierPoints).toEqual({ tier2: 1, tier3: 0 });
  });

  it("site is routed to body.orbital when orbital is true", () => {
    const sys: RawSys = {
      v: 1,
      rev: 1,
      name: "Orbital Test",
      id64: 1,
      architect: "t",
      pos: [0, 0, 0],
      reserveLevel: "pristine",
      bodies: [
        {
          name: "B1",
          num: 1,
          distLS: 100,
          parents: [0],
          type: BodyType.Un,
          subType: "U",
          features: [],
          radius: 1000,
          temp: 300,
          gravity: 0.1,
        },
      ],
      sites: [
        {
          id: "s1",
          buildId: "b1",
          marketId: 1,
          name: "Comm Outpost",
          bodyNum: 1,
          buildType: "plutus",
          status: "complete",
        },
      ],
      slots: {},
      revs: [],
    };
    const r = buildSystemModel2(sys, false);
    const body = r.bodyMap.B1;
    expect(body.orbital.length).toBe(1);
    expect(body.surface.length).toBe(0);
    expect(body.sites.length).toBe(1);
  });
});
