import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import {
  getJournalDirectory,
  isEventType,
  Journal,
  JournalWatcher,
  listJournalFiles,
  parseLine,
  parseWithBigInt,
  parseWithLossyIntegers,
  readMarketFile,
  readStatusFile,
  stringifyBigIntJSON,
  stringifyEvent,
} from "../src";

const SAMPLE_DOCKED =
  '{"timestamp":"2024-01-01T00:00:00Z","event":"Docked","StationName":"TEST","StationType":"Coriolis","SystemName":"Sol","MarketID":123}';

const SAMPLE_LOCATION =
  '{"timestamp":"2024-01-01T00:00:00Z","event":"Location","System":"Sol","SystemAddress":12345678901234567}';

describe("journal", () => {
  describe("parseLine", () => {
    it("parses a docked event", () => {
      const ev = parseLine(SAMPLE_DOCKED);
      expect(ev.event).toBe("Docked");
      expect((ev as any).StationName).toBe("TEST");
    });

    it("handles BigInt for large SystemAddress", () => {
      const ev = parseLine(SAMPLE_LOCATION);
      expect(ev.event).toBe("Location");
      const addr = (ev as any).SystemAddress;
      expect(typeof addr).toBe("bigint");
      expect(addr > 0n).toBe(true);
    });
  });

  describe("parseWithLossyIntegers", () => {
    it("does not parse BigInt (lossy)", () => {
      const ev = parseWithLossyIntegers(SAMPLE_LOCATION);
      expect(typeof (ev as any).SystemAddress).toBe("number");
    });
  });

  describe("stringifyEvent", () => {
    it("converts bigint back to number", () => {
      const ev = parseLine(SAMPLE_LOCATION);
      const json = stringifyEvent(ev);
      const parsed = JSON.parse(json);
      expect(typeof parsed.SystemAddress).toBe("number");
    });
  });

  describe("stringifyBigIntJSON", () => {
    it("converts bigint to string", () => {
      const ev = parseLine(SAMPLE_LOCATION);
      const json = stringifyBigIntJSON(ev);
      const parsed = JSON.parse(json);
      expect(typeof parsed.SystemAddress).toBe("string");
      expect(parsed.SystemAddress.length).toBeGreaterThan(0);
    });
  });

  describe("isEventType", () => {
    it("type guard works", () => {
      const ev = parseLine(SAMPLE_DOCKED);
      expect(isEventType(ev, "Docked")).toBe(true);
      expect(isEventType(ev, "Location")).toBe(false);
    });
  });

  describe("parseWithBigInt", () => {
    it("returns event with _bigint flag", () => {
      const ev = parseWithBigInt(SAMPLE_DOCKED);
      expect(ev._bigint).toBe(true);
      expect(ev.event).toBe("Docked");
    });
  });

  describe("Journal", () => {
    it("can be instantiated with directory", () => {
      const journal = new Journal({
        directory:
          "C:\\Users\\Test\\Saved Games\\Frontier Developments\\Elite Dangerous",
      });
      expect(journal).toBeInstanceOf(Journal);
    });
  });

  describe("JournalWatcher", () => {
    it("can be instantiated", () => {
      const journal = new Journal({
        directory:
          "C:\\Users\\Test\\Saved Games\\Frontier Developments\\Elite Dangerous",
      });
      const watcher = new JournalWatcher(journal);
      expect(watcher).toBeInstanceOf(JournalWatcher);
    });
  });

  describe("file helpers", () => {
    it("getJournalDirectory returns a string", () => {
      const dir = getJournalDirectory();
      expect(typeof dir).toBe("string");
    });

    it("listJournalFiles returns an array", () => {
      expect(Array.isArray(listJournalFiles())).toBe(true);
    });

    it("readStatusFile returns null for missing file", async () => {
      await expect(readStatusFile("nonexistent.json")).resolves.toBeNull();
    });

    it("readMarketFile returns null for missing file", async () => {
      await expect(readMarketFile("nonexistent.json")).resolves.toBeNull();
    });
  });

  describe("schema coverage", () => {
    it("every schema file has a matching export in index.ts", () => {
      const testDir = path.dirname(fileURLToPath(import.meta.url));
      const schemaDir = path.resolve(
        testDir,
        "../../../../specs/journal/events",
      );
      const schemas = new Set(
        fs
          .readdirSync(schemaDir)
          .filter((f) => f.endsWith(".json"))
          .map((f) => f.replace(/\.json$/, "")),
      );

      const indexContent = fs.readFileSync(
        path.resolve(testDir, "../src/index.ts"),
        "utf-8",
      );

      schemas.forEach((s) => {
        expect(
          indexContent.includes(s) ||
            s === "Market" ||
            s === "Status" ||
            s === "FuelStatus",
        ).toBe(true);
      });
    });

    it("every schema file has a matching interface in types.ts", () => {
      const testDir = path.dirname(fileURLToPath(import.meta.url));
      const schemaDir = path.resolve(
        testDir,
        "../../../../specs/journal/events",
      );
      const schemas = new Set(
        fs
          .readdirSync(schemaDir)
          .filter((f) => f.endsWith(".json"))
          .map((f) => f.replace(/\.json$/, "")),
      );

      const typesContent = fs.readFileSync(
        path.resolve(testDir, "../src/types.ts"),
        "utf-8",
      );

      schemas.forEach((s) => {
        expect(
          typesContent.includes(`interface ${s}`) ||
            s === "Market" ||
            s === "Status" ||
            s === "FuelStatus",
        ).toBe(true);
      });
    });
  });
});
