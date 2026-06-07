import { describe, expect, it } from "vitest";
import { CommanderStateEngine } from "../src/commander-state.js";

describe("CommanderStateEngine", () => {
  describe("export / import", () => {
    it("export returns a deep clone", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "LoadGame",
        timestamp: "t",
        Commander: "Test",
        FID: "F1",
        Ship: "Sidewinder",
        ShipID: 1,
        Credits: 1000,
        Loan: 0,
        GameMode: "Open",
      });
      const snapshot = engine.export();
      expect(snapshot.commander.name).toBe("Test");
      snapshot.commander.name = "Mutated";
      expect(engine.getState().commander.name).toBe("Test");
    });

    it("import restores state", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "LoadGame",
        timestamp: "t",
        Commander: "Alpha",
        FID: "F42",
        Ship: "Python",
        ShipID: 7,
        Credits: 5000000,
        Loan: 0,
        GameMode: "Open",
      });
      engine.update({
        event: "Location",
        timestamp: "t",
        StarSystem: "Sol",
        SystemAddress: 1,
        StarPos: [0, 0, 0],
        Docked: false,
      });
      const snapshot = engine.export();
      engine.update({
        event: "FSDJump",
        timestamp: "t",
        StarSystem: "Achernar",
        SystemAddress: 2,
        StarPos: [10, 0, 0],
        JumpDist: 50,
        FuelLevel: 30,
      });
      expect(engine.getState().location.system).toBe("Achernar");
      engine.import(snapshot);
      expect(engine.getState().commander.name).toBe("Alpha");
      expect(engine.getState().location.system).toBe("Sol");
    });

    it("import with empty snapshot resets state", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "LoadGame",
        timestamp: "t",
        Commander: "Test",
        FID: "X",
        Ship: "Sidewinder",
        ShipID: 1,
        Credits: 0,
        Loan: 0,
        GameMode: "Open",
      });
      engine.import({
        commander: {
          name: "",
          fid: "",
          credits: 0,
          loan: 0,
          ranks: {
            combat: 0,
            trade: 0,
            explore: 0,
            cqc: 0,
            empire: 0,
            federation: 0,
            soldier: 0,
            exobiologist: 0,
          },
          progress: {
            combat: 0,
            trade: 0,
            explore: 0,
            cqc: 0,
            empire: 0,
            federation: 0,
            soldier: 0,
            exobiologist: 0,
          },
        },
        location: {
          system: "",
          systemAddress: 0,
          starPos: [0, 0, 0],
          body: "",
          bodyType: "",
          bodyID: 0,
          station: "",
          stationType: "",
          marketID: 0,
          docked: false,
          latitude: 0,
          longitude: 0,
          altitude: 0,
          heading: 0,
          planetRadius: 0,
          onPlanet: false,
          inSupercruise: false,
          jumping: false,
          systemAllegiance: "",
          systemEconomy: "",
          systemGovernment: "",
          systemSecurity: "",
          population: 0,
          powerplayState: "",
          powers: [],
          factions: [],
          conflicts: [],
        },
        ship: {
          current: "",
          shipID: 0,
          name: "",
          ident: "",
          fuelLevel: 0,
          fuelCapacity: 0,
          hullHealth: 100,
          unladenMass: 0,
          maxJumpRange: 0,
          modules: [],
        },
        fleet: [],
        materials: {
          raw: [],
          manufactured: [],
          encoded: [],
          items: [],
          components: [],
          consumables: [],
          data: [],
        },
        missions: [],
        carrier: null,
        navRoute: [],
        flags: { odyssey: false, horizons: false, gameMode: "", group: "" },
        squadron: {
          name: "",
          rank: "",
          alignedPower: "",
          homeSystem: "",
          factionName: "",
          powerplayState: "",
          id: 0,
          currentRating: 0,
          ratings: [],
        },
      });
      expect(engine.getState().commander.name).toBe("");
    });
  });
  describe("initial state", () => {
    it("returns empty state on construction", () => {
      const engine = new CommanderStateEngine();
      const state = engine.getState();
      expect(state.commander.name).toBe("");
      expect(state.ship.current).toBe("");
      expect(state.location.system).toBe("");
      expect(state.missions).toHaveLength(0);
      expect(state.carrier).toBeNull();
      expect(state.navRoute).toHaveLength(0);
    });

    it("reset clears state", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "LoadGame",
        timestamp: "t",
        Commander: "Test",
        FID: "F123",
        Ship: "Sidewinder",
        ShipID: 1,
        Credits: 1000,
        Loan: 0,
        GameMode: "Open",
      });
      expect(engine.getState().commander.name).toBe("Test");
      engine.reset();
      expect(engine.getState().commander.name).toBe("");
    });
  });

  describe("LoadGame", () => {
    it("sets commander and ship info", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "LoadGame",
        timestamp: "t",
        Commander: "CMDR Test",
        FID: "F12345",
        Ship: "Krait_MkII",
        ShipID: 42,
        ShipName: "Void Walker",
        ShipIdent: "KT-1",
        FuelLevel: 50,
        FuelCapacity: 100,
        Credits: 5000000,
        Loan: 0,
        GameMode: "Open",
        Group: "TestGroup",
        Horizons: true,
        Odyssey: true,
      });
      const s = engine.getState();
      expect(s.commander.name).toBe("CMDR Test");
      expect(s.commander.fid).toBe("F12345");
      expect(s.commander.credits).toBe(5000000);
      expect(s.ship.current).toBe("Krait_MkII");
      expect(s.ship.shipID).toBe(42);
      expect(s.ship.name).toBe("Void Walker");
      expect(s.ship.ident).toBe("KT-1");
      expect(s.ship.fuelLevel).toBe(50);
      expect(s.ship.fuelCapacity).toBe(100);
      expect(s.flags.odyssey).toBe(true);
      expect(s.flags.horizons).toBe(true);
      expect(s.flags.gameMode).toBe("Open");
      expect(s.flags.group).toBe("TestGroup");
    });

    it("uses defaults for optional fields", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "LoadGame",
        timestamp: "t",
        Commander: "Test",
        FID: "F1",
        Ship: "Sidewinder",
        ShipID: 1,
        Credits: 0,
        Loan: 0,
        GameMode: "Solo",
      });
      const s = engine.getState();
      expect(s.ship.fuelLevel).toBe(0);
      expect(s.flags.group).toBe("");
    });
  });

  describe("location tracking", () => {
    it("Location event sets star system and position", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Location",
        timestamp: "t",
        StarSystem: "Sol",
        SystemAddress: 1,
        StarPos: [0, 0, 0],
        Docked: true,
        StationName: "Li Qing Jao",
        StationType: "Orbis",
      });
      const s = engine.getState();
      expect(s.location.system).toBe("Sol");
      expect(s.location.systemAddress).toBe(1);
      expect(s.location.docked).toBe(true);
      expect(s.location.station).toBe("Li Qing Jao");
    });

    it("FSDJump updates system and fuel", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "FSDJump",
        timestamp: "t",
        StarSystem: "Alpha Centauri",
        SystemAddress: 2,
        StarPos: [1.0, 2.0, 3.0],
        JumpDist: 4.37,
        FuelLevel: 75,
      });
      const s = engine.getState();
      expect(s.location.system).toBe("Alpha Centauri");
      expect(s.location.starPos).toEqual([1.0, 2.0, 3.0]);
      expect(s.ship.fuelLevel).toBe(75);
    });

    it("Docked sets station info", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Docked",
        timestamp: "t",
        StationName: "Murchison Base",
        StationType: "Outpost",
        StarSystem: "Eravate",
        MarketID: 123,
      });
      const s = engine.getState();
      expect(s.location.docked).toBe(true);
      expect(s.location.station).toBe("Murchison Base");
      expect(s.location.stationType).toBe("Outpost");
      expect(s.location.marketID).toBe(123);
    });

    it("Undocked clears station", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Docked",
        timestamp: "t",
        StationName: "Test",
        StationType: "Station",
        StarSystem: "S",
      });
      engine.update({
        event: "Undocked",
        timestamp: "t",
        StationName: "Test",
        StationType: "Station",
      });
      const s = engine.getState();
      expect(s.location.docked).toBe(false);
      expect(s.location.station).toBe("");
    });

    it("StartJump sets jumping flag", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "StartJump",
        timestamp: "t",
        JumpType: "Hyperspace",
      });
      expect(engine.getState().location.jumping).toBe(true);
    });

    it("StartJump with Supercruise also sets inSupercruise", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "StartJump",
        timestamp: "t",
        JumpType: "Supercruise",
      });
      expect(engine.getState().location.jumping).toBe(true);
      expect(engine.getState().location.inSupercruise).toBe(true);
    });

    it("SupercruiseEntry sets inSupercruise", () => {
      const engine = new CommanderStateEngine();
      engine.update({ event: "SupercruiseEntry", timestamp: "t" });
      expect(engine.getState().location.inSupercruise).toBe(true);
    });

    it("SupercruiseExit clears inSupercruise and sets body", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "SupercruiseExit",
        timestamp: "t",
        StarSystem: "S",
        Body: "Earth",
        BodyID: 1,
        BodyType: "Planet",
      });
      const s = engine.getState();
      expect(s.location.inSupercruise).toBe(false);
      expect(s.location.body).toBe("Earth");
      expect(s.location.bodyID).toBe(1);
      expect(s.location.bodyType).toBe("Planet");
    });

    it("Touchdown sets onPlanet and coordinates", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Touchdown",
        timestamp: "t",
        Body: "Moon",
        Latitude: 10.5,
        Longitude: -20.3,
        OnPlanet: true,
      });
      const s = engine.getState();
      expect(s.location.onPlanet).toBe(true);
      expect(s.location.body).toBe("Moon");
      expect(s.location.latitude).toBe(10.5);
      expect(s.location.longitude).toBe(-20.3);
    });

    it("Liftoff clears onPlanet", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Touchdown",
        timestamp: "t",
        Body: "Moon",
        Latitude: 10,
        Longitude: 20,
      });
      engine.update({ event: "Liftoff", timestamp: "t" });
      expect(engine.getState().location.onPlanet).toBe(false);
    });
  });

  describe("ranks and progress", () => {
    it("Promotion sets rank", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Promotion",
        timestamp: "t",
        Combat: 2,
        Trade: 3,
      });
      const r = engine.getState().commander.ranks;
      expect(r.combat).toBe(2);
      expect(r.trade).toBe(3);
    });

    it("Progress sets progress values", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Progress",
        timestamp: "t",
        Combat: 50,
        Explore: 75,
      });
      const p = engine.getState().commander.progress;
      expect(p.combat).toBe(50);
      expect(p.explore).toBe(75);
    });

    it("Rank sets rank values", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Rank",
        timestamp: "t",
        Empire: 5,
        Federation: 8,
      });
      const r = engine.getState().commander.ranks;
      expect(r.empire).toBe(5);
      expect(r.federation).toBe(8);
    });
  });

  describe("materials", () => {
    it("MaterialCollected adds to inventory", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MaterialCollected",
        timestamp: "t",
        Category: "Raw",
        Name: "Iron",
        Count: 5,
      });
      expect(engine.getState().materials.raw).toContainEqual({
        name: "Iron",
        count: 5,
      });
    });

    it("MaterialCollected defaults count to 1", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MaterialCollected",
        timestamp: "t",
        Category: "Manufactured",
        Name: "Exquisite Focus Crystals",
      });
      expect(engine.getState().materials.manufactured).toContainEqual({
        name: "Exquisite Focus Crystals",
        count: 1,
      });
    });

    it("MaterialCollected accumulates counts", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MaterialCollected",
        timestamp: "t",
        Category: "Raw",
        Name: "Nickel",
        Count: 3,
      });
      engine.update({
        event: "MaterialCollected",
        timestamp: "t",
        Category: "Raw",
        Name: "Nickel",
        Count: 2,
      });
      expect(engine.getState().materials.raw).toContainEqual({
        name: "Nickel",
        count: 5,
      });
    });

    it("MaterialDiscarded removes from inventory", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MaterialCollected",
        timestamp: "t",
        Category: "Encoded",
        Name: "Atypical Encryption Archives",
        Count: 10,
      });
      engine.update({
        event: "MaterialDiscarded",
        timestamp: "t",
        Category: "Encoded",
        Name: "Atypical Encryption Archives",
        Count: 7,
      });
      expect(engine.getState().materials.encoded).toContainEqual({
        name: "Atypical Encryption Archives",
        count: 3,
      });
    });

    it("MaterialDiscarded removes entry when count reaches zero", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MaterialCollected",
        timestamp: "t",
        Category: "Raw",
        Name: "Sulphur",
        Count: 5,
      });
      engine.update({
        event: "MaterialDiscarded",
        timestamp: "t",
        Category: "Raw",
        Name: "Sulphur",
        Count: 5,
      });
      expect(engine.getState().materials.raw).toHaveLength(0);
    });

    it("MaterialTrade trades materials", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MaterialCollected",
        timestamp: "t",
        Category: "Raw",
        Name: "Iron",
        Count: 10,
      });
      engine.update({
        event: "MaterialTrade",
        timestamp: "t",
        Traded: { Material: "Iron", Category: "Raw", Quantity: 5 },
        Received: { Material: "Nickel", Category: "Raw", Quantity: 3 },
      });
      const s = engine.getState();
      expect(s.materials.raw).toContainEqual({ name: "Iron", count: 5 });
      expect(s.materials.raw).toContainEqual({ name: "Nickel", count: 3 });
    });

    it("Synthesis consumes materials", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MaterialCollected",
        timestamp: "t",
        Category: "Manufactured",
        Name: "Mechanical Scrap",
        Count: 10,
      });
      engine.update({
        event: "Synthesis",
        timestamp: "t",
        Name: "Ammo Basic",
        Materials: [
          { Name: "Mechanical Scrap", Count: 5, Category: "Manufactured" },
        ] as any,
      });
      expect(engine.getState().materials.manufactured).toContainEqual({
        name: "Mechanical Scrap",
        count: 5,
      });
    });

    it("EngineerCraft consumes ingredients", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MaterialCollected",
        timestamp: "t",
        Category: "Raw",
        Name: "Iron",
        Count: 10,
      });
      engine.update({
        event: "EngineerCraft",
        timestamp: "t",
        Engineer: "Felicity Farseer",
        Blueprint: "FSD Range",
        Level: 1,
        Ingredients: [{ Name: "Iron", Quantity: 3 }],
      });
      expect(engine.getState().materials.raw).toContainEqual({
        name: "Iron",
        count: 7,
      });
    });

    it("Materials event replaces material lists", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Materials",
        timestamp: "t",
        Raw: [
          { Name: "Iron", Count: 10 },
          { Name: "Nickel", Count: 5 },
        ],
        Manufactured: [{ Name: "Steel", Count: 3 }],
      } as any);
      const s = engine.getState();
      expect(s.materials.raw).toContainEqual({ name: "Iron", count: 10 });
      expect(s.materials.raw).toContainEqual({ name: "Nickel", count: 5 });
      expect(s.materials.manufactured).toContainEqual({
        name: "Steel",
        count: 3,
      });
    });

    it("ShipLocker sets on-foot materials", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "ShipLocker",
        timestamp: "t",
        Items: [{ Name: "Health Pack", Count: 2 }],
        Components: [{ Name: "Weapon Component", Count: 5 }],
      } as any);
      const s = engine.getState();
      expect(s.materials.items).toContainEqual({
        name: "Health Pack",
        count: 2,
      });
      expect(s.materials.components).toContainEqual({
        name: "Weapon Component",
        count: 5,
      });
    });
  });

  describe("modules", () => {
    it("ModuleInfo sets ship modules", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "ModuleInfo",
        timestamp: "t",
        Modules: [
          {
            Slot: "Slot01",
            Item: "TestModule",
            Priority: 1,
            Health: 100,
            Value: 5000,
          },
        ],
      } as any);
      expect(engine.getState().ship.modules).toContainEqual({
        slot: "Slot01",
        item: "TestModule",
        priority: 1,
        health: 100,
        value: 5000,
        engineering: null,
      });
    });

    it("ModuleInfo preserves engineering info", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "ModuleInfo",
        timestamp: "t",
        Modules: [
          {
            Slot: "Slot02",
            Item: "EngineeredModule",
            Priority: 2,
            Engineering: {
              Engineer: "Felicity Farseer",
              BlueprintName: "FSD Range",
              Level: 5,
              Quality: 1.0,
              ExperimentalEffect: "Mass Manager",
            },
          },
        ],
      } as any);
      const mod = engine.getState().ship.modules[0];
      expect(mod.engineering).toBeTruthy();
      expect(mod.engineering!.engineer).toBe("Felicity Farseer");
      expect(mod.engineering!.blueprintName).toBe("FSD Range");
      expect(mod.engineering!.level).toBe(5);
      expect(mod.engineering!.experimentalEffect).toBe("Mass Manager");
    });
  });

  describe("missions", () => {
    it("MissionAccepted adds mission", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MissionAccepted",
        timestamp: "t",
        MissionID: 1,
        Name: "Mission_Courier",
        Faction: "Federation",
        Reward: 50000,
        DestinationSystem: "Sol",
        DestinationStation: "Li Qing Jao",
      });
      expect(engine.getState().missions).toHaveLength(1);
      expect(engine.getState().missions[0].name).toBe("Mission_Courier");
      expect(engine.getState().missions[0].reward).toBe(50000);
    });

    it("MissionCompleted removes mission", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MissionAccepted",
        timestamp: "t",
        MissionID: 1,
        Name: "Test",
        Faction: "F",
      });
      engine.update({
        event: "MissionCompleted",
        timestamp: "t",
        MissionID: 1,
        Name: "Test",
        Faction: "F",
      });
      expect(engine.getState().missions).toHaveLength(0);
    });

    it("MissionFailed marks mission as failed", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MissionAccepted",
        timestamp: "t",
        MissionID: 1,
        Name: "Test",
        Faction: "F",
      });
      engine.update({
        event: "MissionFailed",
        timestamp: "t",
        MissionID: 1,
        Name: "Test",
        Faction: "F",
      });
      expect(engine.getState().missions[0].failed).toBe(true);
    });

    it("MissionAbandoned removes mission", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MissionAccepted",
        timestamp: "t",
        MissionID: 1,
        Name: "Test",
        Faction: "F",
      });
      engine.update({
        event: "MissionAbandoned",
        timestamp: "t",
        MissionID: 1,
        Name: "Test",
        Faction: "F",
      });
      expect(engine.getState().missions).toHaveLength(0);
    });

    it("MissionRedirected updates destination", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "MissionAccepted",
        timestamp: "t",
        MissionID: 1,
        Name: "Test",
        Faction: "F",
        DestinationSystem: "Sol",
      });
      engine.update({
        event: "MissionRedirected",
        timestamp: "t",
        MissionID: 1,
        Name: "Test",
        NewDestinationSystem: "Alpha Centauri",
        NewDestinationStation: "New Station",
      });
      const m = engine.getState().missions[0];
      expect(m.destinationSystem).toBe("Alpha Centauri");
      expect(m.destinationStation).toBe("New Station");
    });
  });

  describe("nav route", () => {
    it("NavRoute sets route waypoints", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "NavRoute",
        timestamp: "t",
        Route: [
          { StarSystem: "Sol", SystemAddress: 1, StarPos: [0, 0, 0] },
          {
            StarSystem: "Alpha Centauri",
            SystemAddress: 2,
            StarPos: [1, 2, 3],
          },
        ],
      });
      expect(engine.getState().navRoute).toHaveLength(2);
      expect(engine.getState().navRoute[0].starSystem).toBe("Sol");
    });

    it("NavRouteClear empties route", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "NavRoute",
        timestamp: "t",
        Route: [{ StarSystem: "Sol", SystemAddress: 1, StarPos: [0, 0, 0] }],
      });
      engine.update({ event: "NavRouteClear", timestamp: "t" });
      expect(engine.getState().navRoute).toHaveLength(0);
    });
  });

  describe("fleet carrier", () => {
    it("CarrierBuy initializes carrier", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "CarrierBuy",
        timestamp: "t",
        CarrierID: 12345,
        Price: 5000000000,
        Callsign: "V1C-T0R",
      });
      expect(engine.getState().carrier).toBeTruthy();
      expect(engine.getState().carrier!.id).toBe("12345");
      expect(engine.getState().carrier!.callsign).toBe("V1C-T0R");
    });

    it("CarrierStats updates carrier details", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "CarrierStats",
        timestamp: "t",
        CarrierID: 1,
        Callsign: "XYZ-01",
        Name: "Home One",
        FuelLevel: 500,
        JumpRangeCurr: 250,
        JumpRangeMax: 500,
        DockingAccess: "all",
      });
      const c = engine.getState().carrier!;
      expect(c.callsign).toBe("XYZ-01");
      expect(c.name).toBe("Home One");
      expect(c.fuelLevel).toBe(500);
      expect(c.jumpRangeCurr).toBe(250);
      expect(c.jumpRangeMax).toBe(500);
      expect(c.dockingAccess).toBe("all");
    });

    it("CarrierNameChange updates name", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "CarrierBuy",
        timestamp: "t",
        Price: 0,
        Callsign: "TST",
      });
      engine.update({
        event: "CarrierNameChange",
        timestamp: "t",
        Name: "New Name",
      });
      expect(engine.getState().carrier!.name).toBe("New Name");
    });
  });

  describe("sequence of events", () => {
    it("tracks a full play session", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "LoadGame",
        timestamp: "t",
        Commander: "Alex",
        FID: "F42",
        Ship: "Python",
        ShipID: 10,
        ShipName: "Hauler",
        ShipIdent: "PY-1",
        FuelLevel: 80,
        FuelCapacity: 100,
        Credits: 1000000,
        Loan: 0,
        GameMode: "Open",
        Odyssey: true,
      });
      engine.update({
        event: "Location",
        timestamp: "t",
        StarSystem: "LHS 3447",
        SystemAddress: 100,
        StarPos: [-10, 5, 0],
        Docked: true,
        StationName: "Baker Hub",
        StationType: "Orbis",
      });
      engine.update({
        event: "Undocked",
        timestamp: "t",
        StationName: "Baker Hub",
        StationType: "Orbis",
      });
      engine.update({
        event: "StartJump",
        timestamp: "t",
        JumpType: "Hyperspace",
      });
      engine.update({
        event: "FSDJump",
        timestamp: "t",
        StarSystem: "Sol",
        SystemAddress: 200,
        StarPos: [0, 0, 0],
        JumpDist: 10.5,
        FuelLevel: 70,
      });
      engine.update({ event: "SupercruiseEntry", timestamp: "t" });
      engine.update({
        event: "SupercruiseExit",
        timestamp: "t",
        StarSystem: "Sol",
        Body: "Earth",
        BodyID: 7,
        BodyType: "Planet",
      });
      engine.update({
        event: "Touchdown",
        timestamp: "t",
        Body: "Earth",
        Latitude: 12.34,
        Longitude: 56.78,
        OnPlanet: true,
      });
      engine.update({
        event: "Docked",
        timestamp: "t",
        StationName: "Li Qing Jao",
        StationType: "Coriolis",
        StarSystem: "Sol",
      });

      const s = engine.getState();
      expect(s.commander.name).toBe("Alex");
      expect(s.location.system).toBe("Sol");
      expect(s.location.docked).toBe(true);
      expect(s.location.station).toBe("Li Qing Jao");
      expect(s.location.onPlanet).toBe(false);
      expect(s.ship.fuelLevel).toBe(70);
    });
  });

  describe("squadron tracking", () => {
    it("SquadronStartup stores squadron info", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "SquadronStartup",
        timestamp: "t",
        SquadronName: "Dark Echo",
        SquadronRank: "12",
        SquadronAlignedPower: "Aisling Duval",
        SquadronHomeSystem: "Cubeo",
        SquadronFaction: "Dark Echo Corp",
        SquadronPowerplayState: "Preparation",
        SquadronID: 12345,
        CurrentRating: 3,
        Rating: [
          { Name: "R1", Rank: 1 },
          { Name: "R2", Rank: 2 },
        ],
      });
      const s = engine.getState().squadron;
      expect(s.name).toBe("Dark Echo");
      expect(s.rank).toBe("12");
      expect(s.alignedPower).toBe("Aisling Duval");
      expect(s.homeSystem).toBe("Cubeo");
      expect(s.factionName).toBe("Dark Echo Corp");
      expect(s.id).toBe(12345);
      expect(s.currentRating).toBe(3);
      expect(s.ratings).toHaveLength(2);
    });

    it("SquadronStartup uses defaults for missing fields", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "SquadronStartup",
        timestamp: "t",
      });
      const s = engine.getState().squadron;
      expect(s.name).toBe("");
      expect(s.rank).toBe("");
      expect(s.id).toBe(0);
      expect(s.ratings).toHaveLength(0);
    });

    it("JoinedSquadron sets squadron name", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "JoinedSquadron",
        timestamp: "t",
        SquadronName: "New Squad",
      });
      expect(engine.getState().squadron.name).toBe("New Squad");
    });

    it("LeftSquadron clears squadron state", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "SquadronStartup",
        timestamp: "t",
        SquadronName: "Test Squad",
        SquadronRank: "5",
        SquadronID: 99,
      });
      expect(engine.getState().squadron.name).toBe("Test Squad");
      engine.update({
        event: "LeftSquadron",
        timestamp: "t",
        SquadronName: "Test Squad",
      });
      const s = engine.getState().squadron;
      expect(s.name).toBe("");
      expect(s.rank).toBe("");
      expect(s.id).toBe(0);
    });

    it("DisbandedSquadron clears squadron state", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "SquadronStartup",
        timestamp: "t",
        SquadronName: "Squad",
        SquadronID: 1,
      });
      engine.update({
        event: "DisbandedSquadron",
        timestamp: "t",
        SquadronName: "Squad",
      });
      expect(engine.getState().squadron.name).toBe("");
    });

    it("KickedFromSquadron clears squadron state", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "SquadronStartup",
        timestamp: "t",
        SquadronName: "Squad",
        SquadronID: 1,
      });
      engine.update({
        event: "KickedFromSquadron",
        timestamp: "t",
        SquadronName: "Squad",
      });
      expect(engine.getState().squadron.name).toBe("");
    });

    it("SquadronPromotion updates rank", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "SquadronStartup",
        timestamp: "t",
        SquadronName: "Squad",
        SquadronRank: "1",
      });
      engine.update({
        event: "SquadronPromotion",
        timestamp: "t",
        SquadronName: "Squad",
        OldRank: 1,
        NewRank: 2,
      });
      expect(engine.getState().squadron.rank).toBe("2");
    });

    it("SquadronDemotion updates rank", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "SquadronStartup",
        timestamp: "t",
        SquadronName: "Squad",
        SquadronRank: "5",
      });
      engine.update({
        event: "SquadronDemotion",
        timestamp: "t",
        SquadronName: "Squad",
        OldRank: 5,
        NewRank: 3,
      });
      expect(engine.getState().squadron.rank).toBe("3");
    });

    it("SquadronCreated sets name", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "SquadronCreated",
        timestamp: "t",
        SquadronName: "Brand New Squad",
      });
      expect(engine.getState().squadron.name).toBe("Brand New Squad");
    });
  });

  describe("BGS faction/conflict tracking", () => {
    it("FSDJump stores factions and conflicts", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "FSDJump",
        timestamp: "t",
        StarSystem: "Sol",
        SystemAddress: 1,
        StarPos: [0, 0, 0],
        JumpDist: 0,
        Factions: [
          {
            Name: "Fed",
            FactionState: "Boom",
            Influence: 0.6,
            Allegiance: "Federation",
            Government: "Democracy",
          },
          {
            Name: "Indie",
            FactionState: "None",
            Influence: 0.4,
            Allegiance: "Independent",
            Government: "Corporate",
          },
        ],
        Conflicts: [
          {
            WarType: "election",
            Status: "active",
            Faction1: { Name: "Fed", Stake: "Stake1", WonDays: 2 },
            Faction2: { Name: "Indie", Stake: "Stake2", WonDays: 1 },
          },
        ],
      });
      const l = engine.getState().location;
      expect(l.factions).toHaveLength(2);
      expect(l.factions[0].name).toBe("Fed");
      expect(l.factions[0].influence).toBe(0.6);
      expect(l.factions[0].factionState).toBe("Boom");
      expect(l.conflicts).toHaveLength(1);
      expect(l.conflicts[0].warType).toBe("election");
      expect(l.conflicts[0].faction1.name).toBe("Fed");
      expect(l.conflicts[0].faction2.wonDays).toBe(1);
    });

    it("Location stores factions and conflicts", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Location",
        timestamp: "t",
        StarSystem: "Achernar",
        SystemAddress: 2,
        StarPos: [10, 0, 0],
        Docked: true,
        Factions: [
          {
            Name: "Empire",
            FactionState: "Expansion",
            Influence: 0.7,
            Allegiance: "Empire",
            Government: "Patronage",
          },
        ],
      });
      expect(engine.getState().location.factions).toHaveLength(1);
      expect(engine.getState().location.factions[0].name).toBe("Empire");
    });

    it("Docked stores factions with state timelines", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "Docked",
        timestamp: "t",
        StationName: "Port",
        StationType: "Station",
        StarSystem: "Sol",
        Factions: [
          {
            Name: "Fed",
            FactionState: "Boom",
            Influence: 0.5,
            Allegiance: "Federation",
            Government: "Democracy",
            ActiveStates: [{ State: "Boom", Trend: 1 }],
            PendingStates: [{ State: "Expansion", Trend: 0 }],
          },
        ],
      });
      const f = engine.getState().location.factions[0];
      expect(f.activeStates).toHaveLength(1);
      expect(f.activeStates![0].state).toBe("Boom");
      expect(f.pendingStates![0].state).toBe("Expansion");
    });

    it("no factions is handled gracefully", () => {
      const engine = new CommanderStateEngine();
      engine.update({
        event: "FSDJump",
        timestamp: "t",
        StarSystem: "Sol",
        StarPos: [0, 0, 0],
        JumpDist: 0,
      });
      expect(engine.getState().location.factions).toHaveLength(0);
      expect(engine.getState().location.conflicts).toHaveLength(0);
    });
  });
});
