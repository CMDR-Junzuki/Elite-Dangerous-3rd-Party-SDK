import { beforeEach, describe, expect, it, vi } from "vitest";
import { INARA_ENDPOINT, InaraClient } from "../src/client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeHeader() {
  return {
    appName: "TestApp",
    appVersion: "1.0.0",
    isBeingDeveloped: true,
    APIkey: "test-key",
    commanderName: "TestCmdr",
  };
}

beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      header: { eventStatus: 200, eventStatusText: "ok" },
      events: [{ eventStatus: 200 }],
    }),
  });
});

describe("InaraClient", () => {
  it("constructs with header", () => {
    const client = new InaraClient(makeHeader());
    expect(client).toBeInstanceOf(InaraClient);
  });

  it("sendEvents sends header + events as JSON body", async () => {
    const client = new InaraClient(makeHeader());
    await client.sendEvents([
      {
        eventName: "setCommanderProfile",
        eventData: { commanderName: "Test" },
      },
    ]);

    expect(mockFetch).toHaveBeenCalledWith(INARA_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: expect.any(String),
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.header.appName).toBe("TestApp");
    expect(body.header.APIkey).toBe("test-key");
    expect(body.events.length).toBe(1);
    expect(body.events[0].eventName).toBe("setCommanderProfile");
  });

  it("sendEvents handles multiple events", async () => {
    const client = new InaraClient(makeHeader());
    const events = [
      {
        eventName: "setCommanderProfile",
        eventData: { commanderName: "Test" },
      },
      { eventName: "addCommanderShip", eventData: { shipType: "Sidewinder" } },
      { eventName: "setCommanderTravel" },
    ];
    await client.sendEvents(events);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events.length).toBe(3);
  });

  it("returns parsed response", async () => {
    const client = new InaraClient(makeHeader());
    const response = await client.sendEvents([
      { eventName: "getCommanderProfile" },
    ]);

    expect(response.header.eventStatus).toBe(200);
    expect(response.events[0].eventStatus).toBe(200);
  });

  it("throws on HTTP error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "Too Many requests",
    });

    const client = new InaraClient(makeHeader());
    await expect(client.sendEvents([{ eventName: "test" }])).rejects.toThrow(
      "Inara",
    );
  });

  it("throws on non-200 eventStatus in header", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        header: { eventStatus: 400, eventStatusText: "Invalid API key" },
        events: [],
      }),
    });

    const client = new InaraClient(makeHeader());
    await expect(client.sendEvents([{ eventName: "test" }])).rejects.toThrow(
      "Invalid API key",
    );
  });
});

// ===== ENDPOINT CONSTANT =====

describe("INARA_ENDPOINT", () => {
  it("matches the expected URL", () => {
    expect(INARA_ENDPOINT).toBe("https://inara.cz/inapi/v1/");
  });
});

// ===== COMMANDER BASICS =====

describe("addCommander", () => {
  it("returns event with commanderName and isMainCommander", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommander("TestCmdr");
    expect(event.eventName).toBe("addCommander");
    expect(event.eventData?.commanderName).toBe("TestCmdr");
    expect(event.eventData?.isMainCommander).toBe(true);
  });

  it("includes frontier ID when provided", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommander("TestCmdr", "F1234");
    expect(event.eventData?.commanderFrontierID).toBe("F1234");
  });
});

describe("getCommanderProfile", () => {
  it("returns event with correct name and no eventData", () => {
    const client = new InaraClient(makeHeader());
    const event = client.getCommanderProfile();
    expect(event.eventName).toBe("getCommanderProfile");
    expect(event.eventData).toBeUndefined();
  });
});

describe("setCommanderShip", () => {
  it("returns event with ship data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderShip({
      shipType: "Sidewinder",
      shipGameID: 1,
      shipName: "Test Ship",
    });
    expect(event.eventName).toBe("setCommanderShip");
    expect(event.eventData?.shipType).toBe("Sidewinder");
    expect(event.eventData?.shipGameID).toBe(1);
    expect(event.eventData?.shipName).toBe("Test Ship");
  });

  it("defaults shipRole to Multi-purpose", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderShip({
      shipType: "Sidewinder",
      shipGameID: 1,
    });
    expect(event.eventData?.shipRole).toBe("Multi-purpose");
  });
});

describe("setCommanderShipLoadout", () => {
  it("returns event with modules array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderShipLoadout(1, [
      { slotName: "Slot1", itemName: "Beam Laser" },
    ]);
    expect(event.eventName).toBe("setCommanderShipLoadout");
    expect(event.eventData?.shipGameID).toBe(1);
    expect(
      (event.eventData?.modules as Array<Record<string, unknown>>)[0].itemName,
    ).toBe("Beam Laser");
  });
});

// ===== TRAVEL =====

describe("addCommanderTravelFSDJump", () => {
  it("returns event with system name and coords", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderTravelFSDJump("Sol", [0, 0, 0]);
    expect(event.eventName).toBe("addCommanderTravelFSDJump");
    expect(event.eventData?.starSystemName).toBe("Sol");
    expect(event.eventData?.starSystemX).toBe(0);
    expect(event.eventData?.starSystemY).toBe(0);
    expect(event.eventData?.starSystemZ).toBe(0);
  });

  it("omits coords when not provided", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderTravelFSDJump("Sol");
    expect(event.eventData?.starSystemX).toBeUndefined();
    expect(event.eventData?.starSystemY).toBeUndefined();
    expect(event.eventData?.starSystemZ).toBeUndefined();
  });
});

describe("addCommanderTravelDock", () => {
  it("returns event with station and system name", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderTravelDock("Murchison Station", "Sol");
    expect(event.eventName).toBe("addCommanderTravelDock");
    expect(event.eventData?.stationName).toBe("Murchison Station");
    expect(event.eventData?.starSystemName).toBe("Sol");
  });
});

describe("addCommanderTravelCarrierJump", () => {
  it("returns event with system name", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderTravelCarrierJump("Colonia");
    expect(event.eventName).toBe("addCommanderTravelCarrierJump");
    expect(event.eventData?.starSystemName).toBe("Colonia");
  });
});

describe("setCommanderTravelLocation", () => {
  it("returns event with system name and coords", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderTravelLocation("Sol", [0, 0, 0]);
    expect(event.eventName).toBe("setCommanderTravelLocation");
    expect(event.eventData?.starSystemName).toBe("Sol");
    expect(event.eventData?.starSystemX).toBe(0);
  });
});

describe("addCommanderTravelLand", () => {
  it("returns event with system and body name", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderTravelLand("Sol", "Earth");
    expect(event.eventName).toBe("addCommanderTravelLand");
    expect(event.eventData?.starsystemName).toBe("Sol");
    expect(event.eventData?.starsystemBodyName).toBe("Earth");
  });
});

// ===== STATS / RANK / CREDITS =====

describe("setCommanderRank", () => {
  it("returns event with rank values", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderRank({ combat: 5, trade: 3 });
    expect(event.eventName).toBe("setCommanderRank");
    expect(event.eventData?.combat).toBe(5);
    expect(event.eventData?.trade).toBe(3);
  });
});

describe("setCommanderCredits", () => {
  it("returns event with credits and optional loan", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderCredits(1000000, 50000);
    expect(event.eventName).toBe("setCommanderCredits");
    expect(event.eventData?.commanderCredits).toBe(1000000);
    expect(event.eventData?.commanderLoan).toBe(50000);
  });

  it("omits loan when not provided", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderCredits(1000000);
    expect(event.eventData?.commanderLoan).toBeUndefined();
  });
});

describe("setCommanderInventory", () => {
  it("returns event with cargo array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderInventory({
      cargo: [{ name: "Gold", count: 10 }],
    });
    expect(event.eventName).toBe("setCommanderInventory");
    expect(event.eventData?.cargo).toEqual([{ name: "Gold", count: 10 }]);
  });
});

// ===== COMMUNITY GOALS =====

describe("setCommunityGoal", () => {
  it("returns event with goal data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommunityGoal({
      name: "Test CG",
      systemName: "Sol",
      stationName: "Mars High",
      goalObjective: "Deliver Items",
      goalExpiry: "2025-01-01T00:00:00Z",
    });
    expect(event.eventName).toBe("setCommunityGoal");
    expect(event.eventData?.communitygoalName).toBe("Test CG");
    expect(event.eventData?.starSystemName).toBe("Sol");
  });
});

describe("setCommanderCommunityGoalProgress", () => {
  it("returns event with progress data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderCommunityGoalProgress(42, 1000, 75.5);
    expect(event.eventName).toBe("setCommanderCommunityGoalProgress");
    expect(event.eventData?.communitygoalGameID).toBe(42);
    expect(event.eventData?.contribution).toBe(1000);
    expect(event.eventData?.percentile).toBe(75.5);
  });

  it("omits percentile when not provided", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderCommunityGoalProgress(42, 1000);
    expect(event.eventData?.percentile).toBeUndefined();
  });
});

describe("getCommunityGoalsRecent", () => {
  it("with system name returns event with starsystemName", () => {
    const client = new InaraClient(makeHeader());
    const event = client.getCommunityGoalsRecent("Sol");
    expect(event.eventName).toBe("getCommunityGoalsRecent");
    expect(event.eventData).toEqual({ starsystemName: "Sol" });
  });

  it("without system name returns event with empty array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.getCommunityGoalsRecent();
    expect(event.eventName).toBe("getCommunityGoalsRecent");
    expect(event.eventData).toEqual([]);
  });
});

// ===== FRIENDS =====

describe("addCommanderFriend", () => {
  it("returns event with friend name and platform", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderFriend("Friend1", "pc");
    expect(event.eventName).toBe("addCommanderFriend");
    expect(event.eventData?.commanderName).toBe("Friend1");
    expect(event.eventData?.gamePlatform).toBe("pc");
  });

  it("omits platform when not provided", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderFriend("Friend1");
    expect(event.eventData?.gamePlatform).toBeUndefined();
  });
});

describe("delCommanderFriend", () => {
  it("returns event with friend name", () => {
    const client = new InaraClient(makeHeader());
    const event = client.delCommanderFriend("Friend1");
    expect(event.eventName).toBe("delCommanderFriend");
    expect(event.eventData?.commanderName).toBe("Friend1");
  });
});

// ===== PERMITS / STATISTICS =====

describe("addCommanderPermit", () => {
  it("returns event with starsystemName", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderPermit("Sol");
    expect(event.eventName).toBe("addCommanderPermit");
    expect(event.eventData?.starsystemName).toBe("Sol");
  });
});

describe("setCommanderGameStatistics", () => {
  it("returns event with statistics data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderGameStatistics({
      combat: { bonds: 5 },
    });
    expect(event.eventName).toBe("setCommanderGameStatistics");
    expect(event.eventData?.combat).toEqual({ bonds: 5 });
  });
});

// ===== RANK & REPUTATION =====

describe("setCommanderRankEngineer", () => {
  it("single engineer returns event with engineer data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderRankEngineer(
      "Felicity Farseer",
      undefined,
      5,
    );
    expect(event.eventName).toBe("setCommanderRankEngineer");
    expect(event.eventData?.engineerName).toBe("Felicity Farseer");
    expect(event.eventData?.rankValue).toBe(5);
  });

  it("list of engineers returns event with array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderRankEngineer([
      { engineerName: "Felicity Farseer", rankValue: 5 },
    ]);
    expect(event.eventName).toBe("setCommanderRankEngineer");
    expect(Array.isArray(event.eventData)).toBe(true);
  });
});

describe("setCommanderRankPilot", () => {
  it("single rank returns event with rank data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderRankPilot("Combat", 5, 0.5);
    expect(event.eventName).toBe("setCommanderRankPilot");
    expect(event.eventData?.rankName).toBe("Combat");
    expect(event.eventData?.rankValue).toBe(5);
    expect(event.eventData?.rankProgress).toBe(0.5);
  });

  it("list of ranks returns event with array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderRankPilot([
      { rankName: "Combat", rankValue: 5 },
    ]);
    expect(event.eventName).toBe("setCommanderRankPilot");
    expect(Array.isArray(event.eventData)).toBe(true);
  });
});

describe("setCommanderRankPower", () => {
  it("returns event with power data and optional merits", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderRankPower("Aisling Duval", 10, 500);
    expect(event.eventName).toBe("setCommanderRankPower");
    expect(event.eventData?.powerName).toBe("Aisling Duval");
    expect(event.eventData?.rankValue).toBe(10);
    expect(event.eventData?.meritsValue).toBe(500);
  });

  it("omits meritsValue when not provided", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderRankPower("Aisling Duval", 10);
    expect(event.eventData?.meritsValue).toBeUndefined();
  });
});

describe("setCommanderReputationMajorFaction", () => {
  it("single faction returns event with reputation", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderReputationMajorFaction("Federation", 85.5);
    expect(event.eventName).toBe("setCommanderReputationMajorFaction");
    expect(event.eventData?.majorfactionName).toBe("Federation");
    expect(event.eventData?.majorfactionReputation).toBe(85.5);
  });

  it("list of factions returns event with array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderReputationMajorFaction([
      { majorfactionName: "Fed", majorfactionReputation: 50 },
    ]);
    expect(event.eventName).toBe("setCommanderReputationMajorFaction");
    expect(Array.isArray(event.eventData)).toBe(true);
  });
});

describe("setCommanderReputationMinorFaction", () => {
  it("single faction returns event with reputation", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderReputationMinorFaction(
      "Crimson State",
      30.0,
    );
    expect(event.eventName).toBe("setCommanderReputationMinorFaction");
    expect(event.eventData?.minorfactionName).toBe("Crimson State");
  });

  it("list of factions returns event with array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderReputationMinorFaction([
      { minorfactionName: "CS", minorfactionReputation: 30 },
    ]);
    expect(event.eventName).toBe("setCommanderReputationMinorFaction");
    expect(Array.isArray(event.eventData)).toBe(true);
  });
});

// ===== INVENTORY =====

describe("addCommanderInventoryItem", () => {
  it("returns event with item data including optional isStolen", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderInventoryItem(
      "Gold",
      10,
      "Commodity",
      undefined,
      true,
    );
    expect(event.eventName).toBe("addCommanderInventoryItem");
    expect(event.eventData?.itemName).toBe("Gold");
    expect(event.eventData?.itemCount).toBe(10);
    expect(event.eventData?.itemType).toBe("Commodity");
    expect(event.eventData?.isStolen).toBe(true);
  });
});

describe("delCommanderInventoryItem", () => {
  it("returns event with item data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.delCommanderInventoryItem("Gold", 5, "Commodity");
    expect(event.eventName).toBe("delCommanderInventoryItem");
    expect(event.eventData?.itemName).toBe("Gold");
    expect(event.eventData?.itemCount).toBe(5);
  });
});

describe("resetCommanderInventory", () => {
  it("single call returns event with type and location", () => {
    const client = new InaraClient(makeHeader());
    const event = client.resetCommanderInventory("Materials", "Raw");
    expect(event.eventName).toBe("resetCommanderInventory");
    expect(event.eventData?.itemType).toBe("Materials");
    expect(event.eventData?.itemLocation).toBe("Raw");
  });

  it("list call returns event with array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.resetCommanderInventory([
      { itemType: "Materials", itemLocation: "Raw" },
    ]);
    expect(event.eventName).toBe("resetCommanderInventory");
    expect(Array.isArray(event.eventData)).toBe(true);
  });
});

describe("setCommanderInventoryItem", () => {
  it("returns event with item data including location", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderInventoryItem(
      "Gold",
      5,
      "Commodity",
      "Ship",
    );
    expect(event.eventName).toBe("setCommanderInventoryItem");
    expect(event.eventData?.itemLocation).toBe("Ship");
  });
});

describe("addCommanderInventoryCargoItem", () => {
  it("returns event with cargo item and isStolen", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderInventoryCargoItem("Gold", 10, false);
    expect(event.eventName).toBe("addCommanderInventoryCargoItem");
    expect(event.eventData?.isStolen).toBe(false);
  });
});

describe("addCommanderInventoryMaterialsItem", () => {
  it("returns event with material item", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderInventoryMaterialsItem("Iron", 50);
    expect(event.eventName).toBe("addCommanderInventoryMaterialsItem");
    expect(event.eventData?.itemName).toBe("Iron");
    expect(event.eventData?.itemCount).toBe(50);
  });
});

describe("delCommanderInventoryCargoItem", () => {
  it("returns event with cargo item", () => {
    const client = new InaraClient(makeHeader());
    const event = client.delCommanderInventoryCargoItem("Gold", 5);
    expect(event.eventName).toBe("delCommanderInventoryCargoItem");
    expect(event.eventData?.itemName).toBe("Gold");
  });
});

describe("delCommanderInventoryMaterialsItem", () => {
  it("returns event with material item", () => {
    const client = new InaraClient(makeHeader());
    const event = client.delCommanderInventoryMaterialsItem("Iron", 10);
    expect(event.eventName).toBe("delCommanderInventoryMaterialsItem");
    expect(event.eventData?.itemCount).toBe(10);
  });
});

describe("setCommanderInventoryCargo", () => {
  it("returns event with cargo array", () => {
    const client = new InaraClient(makeHeader());
    const items = [{ itemName: "Gold", itemCount: 10 }];
    const event = client.setCommanderInventoryCargo(items);
    expect(event.eventName).toBe("setCommanderInventoryCargo");
    expect(Array.isArray(event.eventData)).toBe(true);
    expect(
      (event.eventData as Array<Record<string, unknown>>)[0].itemName,
    ).toBe("Gold");
  });
});

describe("setCommanderInventoryCargoItem", () => {
  it("returns event with cargo item and isStolen", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderInventoryCargoItem("Gold", 5, true);
    expect(event.eventName).toBe("setCommanderInventoryCargoItem");
    expect(event.eventData?.isStolen).toBe(true);
  });
});

describe("setCommanderInventoryMaterials", () => {
  it("returns event with materials array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderInventoryMaterials([
      { itemName: "Iron", itemCount: 50 },
    ]);
    expect(event.eventName).toBe("setCommanderInventoryMaterials");
    expect(Array.isArray(event.eventData)).toBe(true);
  });
});

describe("setCommanderInventoryMaterialsItem", () => {
  it("returns event with material item", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderInventoryMaterialsItem("Nickel", 100);
    expect(event.eventName).toBe("setCommanderInventoryMaterialsItem");
    expect(event.eventData?.itemCount).toBe(100);
  });
});

// ===== STORAGE / SHIPS =====

describe("setCommanderStorageModules", () => {
  it("returns event with modules array", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderStorageModules([
      { itemName: "Beam Laser", itemValue: 50000 },
    ]);
    expect(event.eventName).toBe("setCommanderStorageModules");
    expect(Array.isArray(event.eventData)).toBe(true);
    expect(
      (event.eventData as Array<Record<string, unknown>>)[0].itemName,
    ).toBe("Beam Laser");
  });
});

describe("addCommanderShip", () => {
  it("returns event with ship type and game ID", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderShip("Sidewinder", 1);
    expect(event.eventName).toBe("addCommanderShip");
    expect(event.eventData?.shipType).toBe("Sidewinder");
    expect(event.eventData?.shipGameID).toBe(1);
  });
});

describe("delCommanderShip", () => {
  it("returns event with ship game ID", () => {
    const client = new InaraClient(makeHeader());
    const event = client.delCommanderShip("Sidewinder", 1);
    expect(event.eventName).toBe("delCommanderShip");
    expect(event.eventData?.shipGameID).toBe(1);
  });
});

describe("setCommanderShipTransfer", () => {
  it("returns event with transfer data including optional fields", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderShipTransfer(
      "Sidewinder",
      1,
      "Sol",
      "Daedalus",
      12345,
      3600,
    );
    expect(event.eventName).toBe("setCommanderShipTransfer");
    expect(event.eventData?.starsystemName).toBe("Sol");
    expect(event.eventData?.marketID).toBe(12345);
    expect(event.eventData?.transferTime).toBe(3600);
  });

  it("omits optional fields when not provided", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderShipTransfer(
      "Sidewinder",
      1,
      "Sol",
      "Daedalus",
    );
    expect(event.eventData?.marketID).toBeUndefined();
    expect(event.eventData?.transferTime).toBeUndefined();
  });
});

// ===== SUIT LOADOUT =====

describe("delCommanderSuitLoadout", () => {
  it("returns event with loadoutGameID", () => {
    const client = new InaraClient(makeHeader());
    const event = client.delCommanderSuitLoadout(4293000001);
    expect(event.eventName).toBe("delCommanderSuitLoadout");
    expect(event.eventData?.loadoutGameID).toBe(4293000001);
  });
});

describe("setCommanderSuitLoadout", () => {
  it("returns event with suit loadout data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderSuitLoadout({
      loadoutGameID: 4293000004,
      loadoutName: "Scavenging",
      suitType: "utilitysuit_class3",
      suitGameID: 1700315870155528,
      suitMods: ["suit_backpackcapacity"],
      suitLoadout: [
        {
          slotName: "PrimaryWeapon1",
          itemName: "wpn_m_sniper_plasma_charged",
          itemClass: 1,
          itemGameID: 1,
        },
      ],
    });
    expect(event.eventName).toBe("setCommanderSuitLoadout");
    expect(event.eventData?.suitType).toBe("utilitysuit_class3");
  });
});

describe("updateCommanderSuitLoadout", () => {
  it("returns event with updated loadout name", () => {
    const client = new InaraClient(makeHeader());
    const event = client.updateCommanderSuitLoadout({
      loadoutGameID: 4293000001,
      loadoutName: "My loadout new name",
    });
    expect(event.eventName).toBe("updateCommanderSuitLoadout");
    expect(event.eventData?.loadoutName).toBe("My loadout new name");
  });
});

// ===== MISSIONS =====

describe("addCommanderMission", () => {
  it("returns event with mission data and optional extras", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderMission("Mission1", 100, {
      starsystemNameTarget: "Sol",
    });
    expect(event.eventName).toBe("addCommanderMission");
    expect(event.eventData?.missionName).toBe("Mission1");
    expect(event.eventData?.missionGameID).toBe(100);
    expect(event.eventData?.starsystemNameTarget).toBe("Sol");
  });
});

describe("setCommanderMissionAbandoned", () => {
  it("returns event with missionGameID", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderMissionAbandoned(100);
    expect(event.eventName).toBe("setCommanderMissionAbandoned");
    expect(event.eventData?.missionGameID).toBe(100);
  });
});

describe("setCommanderMissionCompleted", () => {
  it("returns event with missionGameID", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderMissionCompleted(100);
    expect(event.eventName).toBe("setCommanderMissionCompleted");
    expect(event.eventData?.missionGameID).toBe(100);
  });
});

describe("setCommanderMissionFailed", () => {
  it("returns event with missionGameID", () => {
    const client = new InaraClient(makeHeader());
    const event = client.setCommanderMissionFailed(100);
    expect(event.eventName).toBe("setCommanderMissionFailed");
    expect(event.eventData?.missionGameID).toBe(100);
  });
});

// ===== COMBAT =====

describe("addCommanderCombatDeath", () => {
  it("returns event with death data including optional fields", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderCombatDeath("Sol", "Cmdr X", true);
    expect(event.eventName).toBe("addCommanderCombatDeath");
    expect(event.eventData?.starsystemName).toBe("Sol");
    expect(event.eventData?.opponentName).toBe("Cmdr X");
    expect(event.eventData?.isPlayer).toBe(true);
  });

  it("omits optional fields when not provided", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderCombatDeath("Sol");
    expect(event.eventData?.opponentName).toBeUndefined();
    expect(event.eventData?.isPlayer).toBeUndefined();
  });
});

describe("addCommanderCombatInterdicted", () => {
  it("returns event with interdicted data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderCombatInterdicted(
      "Sol",
      "Cmdr X",
      true,
      true,
    );
    expect(event.eventName).toBe("addCommanderCombatInterdicted");
    expect(event.eventData?.starsystemName).toBe("Sol");
    expect(event.eventData?.isSubmit).toBe(true);
  });
});

describe("addCommanderCombatInterdiction", () => {
  it("returns event with interdiction data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderCombatInterdiction(
      "Sol",
      "Cmdr X",
      true,
      false,
    );
    expect(event.eventName).toBe("addCommanderCombatInterdiction");
    expect(event.eventData?.isSuccess).toBe(false);
  });
});

describe("addCommanderCombatInterdictionEscape", () => {
  it("returns event with escape data", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderCombatInterdictionEscape(
      "Sol",
      "Cmdr X",
      true,
    );
    expect(event.eventName).toBe("addCommanderCombatInterdictionEscape");
    expect(event.eventData?.isPlayer).toBe(true);
  });
});

describe("addCommanderCombatKill", () => {
  it("returns event with kill data including optional ship type", () => {
    const client = new InaraClient(makeHeader());
    const event = client.addCommanderCombatKill(
      "Sol",
      undefined,
      "Federal Corvette",
    );
    expect(event.eventName).toBe("addCommanderCombatKill");
    expect(event.eventData?.opponentShipType).toBe("Federal Corvette");
  });
});

// ===== AUTO-SEND CONVENIENCE METHODS =====

describe("auto-send convenience methods", () => {
  it("getCommanderProfileAsync sends event and returns response", async () => {
    const client = new InaraClient(makeHeader());
    const response = await client.getCommanderProfileAsync();
    expect(response.header.eventStatus).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("getCommanderProfile");
  });

  it("addCommanderAsync sends event with params", async () => {
    const client = new InaraClient(makeHeader());
    await client.addCommanderAsync("TestCmdr", "F123");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("addCommander");
    expect(body.events[0].eventData.commanderName).toBe("TestCmdr");
  });

  it("addCommanderTravelFSDJumpAsync sends event with coords", async () => {
    const client = new InaraClient(makeHeader());
    await client.addCommanderTravelFSDJumpAsync("Sol", [0, 0, 0]);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("addCommanderTravelFSDJump");
    expect(body.events[0].eventData.starSystemName).toBe("Sol");
  });

  it("setCommanderCreditsAsync sends event", async () => {
    const client = new InaraClient(makeHeader());
    await client.setCommanderCreditsAsync(1000000, 50000);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("setCommanderCredits");
    expect(body.events[0].eventData.commanderCredits).toBe(1000000);
  });

  it("setCommanderRankEngineerAsync single works", async () => {
    const client = new InaraClient(makeHeader());
    await client.setCommanderRankEngineerAsync("Felicity Farseer", undefined, 5);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("setCommanderRankEngineer");
    expect(body.events[0].eventData.engineerName).toBe("Felicity Farseer");
  });

  it("setCommanderRankEngineerAsync list works", async () => {
    const client = new InaraClient(makeHeader());
    await client.setCommanderRankEngineerAsync([{ engineerName: "Felicity Farseer", rankValue: 5 }]);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("setCommanderRankEngineer");
    expect(Array.isArray(body.events[0].eventData)).toBe(true);
  });

  it("addCommanderMissionAsync sends event with additionalData", async () => {
    const client = new InaraClient(makeHeader());
    await client.addCommanderMissionAsync("Mission1", 100, { starsystemNameTarget: "Sol" });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("addCommanderMission");
    expect(body.events[0].eventData.starsystemNameTarget).toBe("Sol");
  });

  it("addCommanderCombatDeathAsync sends event", async () => {
    const client = new InaraClient(makeHeader());
    await client.addCommanderCombatDeathAsync("Sol", "Cmdr X", true);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("addCommanderCombatDeath");
    expect(body.events[0].eventData.isPlayer).toBe(true);
  });

  it("setCommanderSuitLoadoutAsync sends event", async () => {
    const client = new InaraClient(makeHeader());
    await client.setCommanderSuitLoadoutAsync({ loadoutGameID: 1, suitType: "utilitysuit_class3" });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("setCommanderSuitLoadout");
    expect(body.events[0].eventData.suitType).toBe("utilitysuit_class3");
  });

  it("getCommunityGoalsRecentAsync sends event", async () => {
    const client = new InaraClient(makeHeader());
    await client.getCommunityGoalsRecentAsync("Sol");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.events[0].eventName).toBe("getCommunityGoalsRecent");
    expect(body.events[0].eventData.starsystemName).toBe("Sol");
  });
});
