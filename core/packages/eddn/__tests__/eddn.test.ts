import { describe, expect, it } from "vitest";
import {
  EDDN_SCHEMAS,
  EDDNClient,
  EDDNReceiver,
  RELAY_URL,
  UPLOAD_URL,
  validateApproachSettlementMessage,
  validateBackpackMessage,
  validateBlackmarketMessage,
  validateCarrierJumpMessage,
  validateCodeEntryMessage,
  validateCommodityMessage,
  validateDispatchMessage,
  validateEDDN,
  validateFcMaterialsJournalMessage,
  validateFcMaterialsMessage,
  validateFsdJumpMessage,
  validateFssDiscoveredMessage,
  validateJournalMessage,
  validateLocationMessage,
  validateNavRouteClearMessage,
  validateNavRouteMessage,
  validateOutfittingMessage,
  validateSaaSignalsFoundMessage,
  validateScanMessage,
  validateShipLockerMessage,
  validateShipyardMessage,
} from "../src";

describe("eddn", () => {
  it("UPLOAD_URL is correct", () => {
    expect(UPLOAD_URL).toBe("https://eddn.edcd.io:4430/upload/");
  });

  it("RELAY_URL is correct", () => {
    expect(RELAY_URL).toBe("tcp://eddn.edcd.io:9500");
  });

  describe("EDDN_SCHEMAS", () => {
    it("has common schema refs", () => {
      expect(EDDN_SCHEMAS.COMMODITY).toBe(
        "https://eddn.edcd.io/schemas/commodity/3",
      );
      expect(EDDN_SCHEMAS.SHIPYARD).toBe(
        "https://eddn.edcd.io/schemas/shipyard/2",
      );
      expect(EDDN_SCHEMAS.OUTFITTING).toBe(
        "https://eddn.edcd.io/schemas/outfitting/2",
      );
      expect(EDDN_SCHEMAS.JOURNAL).toBe(
        "https://eddn.edcd.io/schemas/journal/1",
      );
    });

    it("has FC materials schema", () => {
      expect(EDDN_SCHEMAS.FCMATERIALS_CAPI).toBe(
        "https://eddn.edcd.io/schemas/fcmaterials_capi/1",
      );
    });

    it("total schemas count is 22", () => {
      expect(Object.keys(EDDN_SCHEMAS).length).toBe(22);
    });
  });

  describe("validateCommodityMessage", () => {
    it("returns errors for empty message", () => {
      const errors = validateCommodityMessage({} as any);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("passes for valid message", () => {
      const errors = validateCommodityMessage({
        systemName: "Sol",
        stationName: "Earth",
        marketId: 123,
        commodities: [{ name: "Gold", buyPrice: 100, sellPrice: 200 }],
      });
      expect(errors).toHaveLength(0);
    });

    it("errors when commodity missing name", () => {
      const errors = validateCommodityMessage({
        systemName: "Sol",
        stationName: "Earth",
        marketId: 1,
        commodities: [{ buyPrice: 100, sellPrice: 200 }],
      });
      expect(errors.some((e: string) => e.includes("commodity.name"))).toBe(
        true,
      );
    });
  });

  describe("validateShipyardMessage", () => {
    it("returns errors for empty message", () => {
      expect(validateShipyardMessage({} as any).length).toBeGreaterThan(0);
    });

    it("passes for valid message", () => {
      expect(
        validateShipyardMessage({
          systemName: "Sol",
          stationName: "Earth",
          marketId: 1,
          ships: ["Sidewinder"],
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateOutfittingMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateOutfittingMessage({
          systemName: "Sol",
          stationName: "Earth",
          marketId: 1,
          modules: ["Hpt_PulseLaser_Fixed_Small"],
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateFcMaterialsMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateFcMaterialsMessage({
          systemName: "Sol",
          stationName: "FC Test",
          marketId: 1,
          carrierCallsign: "ABC-01",
          carrierDockingAccess: "all",
        }),
      ).toHaveLength(0);
    });
  });

  describe("EDDNClient", () => {
    it("can be instantiated", () => {
      const client = new EDDNClient({
        softwareName: "test",
        softwareVersion: "1.0",
      });
      expect(client).toBeInstanceOf(EDDNClient);
    });

    it("sendCommodity sends correct schema", async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody: any;
      globalThis.fetch = async (url: any, opts: any) => {
        capturedBody = JSON.parse(opts.body);
        return { ok: true } as Response;
      };
      try {
        const client = new EDDNClient({
          softwareName: "test",
          softwareVersion: "1.0",
        });
        await client.sendCommodity({
          systemName: "Sol",
          stationName: "Station",
          marketId: 1,
          commodities: [
            {
              name: "Gold",
              buyPrice: 100,
              sellPrice: 200,
              meanPrice: 150,
              stockBracket: 2,
              demandBracket: 0,
              stock: 1000,
              demand: 0,
            },
          ],
        });
        expect(capturedBody.$schemaRef).toBe(EDDN_SCHEMAS.COMMODITY);
        expect(capturedBody.header.softwareName).toBe("test");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("sendShipyard sends correct schema", async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody: any;
      globalThis.fetch = async (url: any, opts: any) => {
        capturedBody = JSON.parse(opts.body);
        return { ok: true } as Response;
      };
      try {
        const client = new EDDNClient({
          softwareName: "test",
          softwareVersion: "1.0",
        });
        await client.sendShipyard({
          systemName: "Sol",
          stationName: "Station",
          marketId: 1,
          ships: ["Sidewinder"],
        });
        expect(capturedBody.$schemaRef).toBe(EDDN_SCHEMAS.SHIPYARD);
        expect(capturedBody.header.softwareName).toBe("test");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("sendOutfitting sends correct schema", async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody: any;
      globalThis.fetch = async (url: any, opts: any) => {
        capturedBody = JSON.parse(opts.body);
        return { ok: true } as Response;
      };
      try {
        const client = new EDDNClient({
          softwareName: "test",
          softwareVersion: "1.0",
        });
        await client.sendOutfitting({
          systemName: "Sol",
          stationName: "Station",
          marketId: 1,
          modules: ["Hpt_PulseLaser_Fixed_Small"],
        });
        expect(capturedBody.$schemaRef).toBe(EDDN_SCHEMAS.OUTFITTING);
        expect(capturedBody.header.softwareName).toBe("test");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("sendFleetCarrier sends correct schema", async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody: any;
      globalThis.fetch = async (url: any, opts: any) => {
        capturedBody = JSON.parse(opts.body);
        return { ok: true } as Response;
      };
      try {
        const client = new EDDNClient({
          softwareName: "test",
          softwareVersion: "1.0",
        });
        await client.sendFleetCarrier({
          systemName: "Sol",
          stationName: "FC Test",
          marketId: 1,
          carrierCallsign: "ABC-01",
          carrierDockingAccess: "all",
        });
        expect(capturedBody.$schemaRef).toBe(EDDN_SCHEMAS.FCMATERIALS_CAPI);
        expect(capturedBody.header.softwareName).toBe("test");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("sendJournal sends correct schema", async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody: any;
      globalThis.fetch = async (url: any, opts: any) => {
        capturedBody = JSON.parse(opts.body);
        return { ok: true } as Response;
      };
      try {
        const client = new EDDNClient({
          softwareName: "test",
          softwareVersion: "1.0",
        });
        await client.sendJournal({ event: "FSDJump" });
        expect(capturedBody.$schemaRef).toBe(EDDN_SCHEMAS.JOURNAL);
        expect(capturedBody.header.softwareName).toBe("test");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("sendBlackmarket sends correct schema", async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody: any;
      globalThis.fetch = async (url: any, opts: any) => {
        capturedBody = JSON.parse(opts.body);
        return { ok: true } as Response;
      };
      try {
        const client = new EDDNClient({
          softwareName: "test",
          softwareVersion: "1.0",
        });
        await client.sendBlackmarket({
          systemName: "Sol",
          stationName: "Station",
          marketId: 1,
          items: [{ name: "Gold" }],
        });
        expect(capturedBody.$schemaRef).toBe(EDDN_SCHEMAS.BLACKMARKET);
        expect(capturedBody.header.softwareName).toBe("test");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("sendNavRoute sends correct schema", async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody: any;
      globalThis.fetch = async (url: any, opts: any) => {
        capturedBody = JSON.parse(opts.body);
        return { ok: true } as Response;
      };
      try {
        const client = new EDDNClient({
          softwareName: "test",
          softwareVersion: "1.0",
        });
        await client.sendNavRoute({
          systemName: "Sol",
          route: [{ StarPos: [0, 0, 0], systemName: "Sol", systemAddress: 1 }],
        });
        expect(capturedBody.$schemaRef).toBe(EDDN_SCHEMAS.NAVROUTE);
        expect(capturedBody.header.softwareName).toBe("test");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    it("sendFcMaterialsJournal sends correct schema", async () => {
      const originalFetch = globalThis.fetch;
      let capturedBody: any;
      globalThis.fetch = async (url: any, opts: any) => {
        capturedBody = JSON.parse(opts.body);
        return { ok: true } as Response;
      };
      try {
        const client = new EDDNClient({
          softwareName: "test",
          softwareVersion: "1.0",
        });
        await client.sendFcMaterialsJournal({
          timestamp: "2024-01-01T00:00:00Z",
          event: "FCMaterials",
          CarrierName: "ABC-01",
          MarketID: 1,
          Items: [{ name: "Tritium" }],
        });
        expect(capturedBody.$schemaRef).toBe(EDDN_SCHEMAS.FCMATERIALS_JOURNAL);
        expect(capturedBody.header.softwareName).toBe("test");
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });

  describe("EDDNReceiver", () => {
    it("can be instantiated", () => {
      const receiver = new EDDNReceiver({});
      expect(receiver).toBeInstanceOf(EDDNReceiver);
    });
  });

  describe("validateJournalMessage", () => {
    it("returns errors for empty message", () => {
      expect(validateJournalMessage({}).length).toBeGreaterThan(0);
    });
    it("passes for non-empty message", () => {
      expect(validateJournalMessage({ event: "FSDJump" })).toHaveLength(0);
    });
  });

  describe("validateBlackmarketMessage", () => {
    it("returns errors for empty message", () => {
      expect(validateBlackmarketMessage({} as any).length).toBeGreaterThan(0);
    });
    it("passes for valid message", () => {
      expect(
        validateBlackmarketMessage({
          systemName: "Sol",
          stationName: "Station",
          marketId: 1,
          items: [{ name: "Gold" }],
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateNavRouteMessage", () => {
    it("returns errors for empty message", () => {
      expect(validateNavRouteMessage({} as any).length).toBeGreaterThan(0);
    });
    it("passes for valid message", () => {
      expect(
        validateNavRouteMessage({
          systemName: "Sol",
          route: [{ StarPos: [0, 0, 0], systemName: "Sol", systemAddress: 1 }],
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateFcMaterialsJournalMessage", () => {
    it("returns errors for empty message", () => {
      expect(
        validateFcMaterialsJournalMessage({} as any).length,
      ).toBeGreaterThan(0);
    });
    it("passes for valid message", () => {
      expect(
        validateFcMaterialsJournalMessage({
          timestamp: "2024-01-01T00:00:00Z",
          event: "FCMaterials",
          CarrierName: "ABC-01",
          MarketID: 1,
          Items: [{ name: "Tritium" }],
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateApproachSettlementMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateApproachSettlementMessage({
          settlementName: "Lonely Haven",
          SystemAddress: 123,
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateScanMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateScanMessage({
          timestamp: "2024-01-01T00:00:00Z",
          BodyName: "Sol 1",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateFsdJumpMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateFsdJumpMessage({
          StarSystem: "Sol",
          SystemAddress: 123,
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateLocationMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateLocationMessage({
          StarSystem: "Sol",
          SystemAddress: 123,
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateCarrierJumpMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateCarrierJumpMessage({
          StarSystem: "Sol",
          SystemAddress: 123,
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateCodeEntryMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateCodeEntryMessage({
          systemName: "Sol",
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateFssDiscoveredMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateFssDiscoveredMessage({
          systemName: "Sol",
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateSaaSignalsFoundMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateSaaSignalsFoundMessage({
          systemName: "Sol",
          bodyName: "Sol 1",
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateDispatchMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateDispatchMessage({
          Text: "Hello",
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateBackpackMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateBackpackMessage({
          timestamp: "2024-01-01T00:00:00Z",
          Items: ["Item1"],
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateShipLockerMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateShipLockerMessage({
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateNavRouteClearMessage", () => {
    it("passes for valid message", () => {
      expect(
        validateNavRouteClearMessage({
          timestamp: "2024-01-01T00:00:00Z",
        }),
      ).toHaveLength(0);
    });
  });

  describe("validateEDDN", () => {
    it("returns errors for null envelope", () => {
      expect(validateEDDN(null as any)).toEqual(["envelope is required"]);
    });

    it("returns errors for missing $schemaRef", () => {
      const errs = validateEDDN({
        header: { uploaderID: "x", softwareName: "y", softwareVersion: "z" },
        message: { StarSystem: "Sol", SystemAddress: 1, timestamp: "t" },
      });
      expect(errs).toContain("$schemaRef is required");
    });

    it("returns errors for missing header fields", () => {
      const errs = validateEDDN({
        $schemaRef: EDDN_SCHEMAS.FSDJUMP,
        header: {} as any,
        message: { StarSystem: "Sol", SystemAddress: 1, timestamp: "t" },
      });
      expect(errs).toContain("header.uploaderID is required");
      expect(errs).toContain("header.softwareName is required");
      expect(errs).toContain("header.softwareVersion is required");
    });

    it("returns errors for unknown schema", () => {
      const errs = validateEDDN({
        $schemaRef: "https://unknown/schema",
        header: { uploaderID: "x", softwareName: "y", softwareVersion: "z" },
        message: { x: 1 },
      });
      expect(errs).toContain("unknown schema: https://unknown/schema");
    });

    it("validates a valid FSDJump envelope", () => {
      const errs = validateEDDN({
        $schemaRef: EDDN_SCHEMAS.FSDJUMP,
        header: {
          uploaderID: "me",
          softwareName: "test",
          softwareVersion: "1.0",
        },
        message: {
          StarSystem: "Sol",
          SystemAddress: 123,
          timestamp: "2024-01-01T00:00:00Z",
        },
      });
      expect(errs).toHaveLength(0);
    });

    it("validates a valid commodity envelope", () => {
      const errs = validateEDDN({
        $schemaRef: EDDN_SCHEMAS.COMMODITY,
        header: {
          uploaderID: "me",
          softwareName: "test",
          softwareVersion: "1.0",
        },
        message: {
          systemName: "Sol",
          stationName: "Station",
          marketId: 1,
          commodities: [{ name: "Gold", buyPrice: 100, sellPrice: 200 }],
        },
      });
      expect(errs).toHaveLength(0);
    });

    it("reports message-level errors through the envelope", () => {
      const errs = validateEDDN({
        $schemaRef: EDDN_SCHEMAS.COMMODITY,
        header: {
          uploaderID: "me",
          softwareName: "test",
          softwareVersion: "1.0",
        },
        message: {} as any,
      });
      expect(errs.length).toBeGreaterThan(0);
      expect(errs).toContain("systemName is required");
    });
  });
});
