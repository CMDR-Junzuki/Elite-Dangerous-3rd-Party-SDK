import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createJournalStream } from "../src";

const EVENT1 =
  '{"timestamp":"2024-01-01T00:00:00Z","event":"Docked","StationName":"A","MarketID":1}\n';
const EVENT2 =
  '{"timestamp":"2024-01-01T00:01:00Z","event":"Location","System":"Sol","SystemAddress":1}\n';
const EVENT3 =
  '{"timestamp":"2024-01-01T00:02:00Z","event":"Scan","BodyName":"Earth","BodyID":1}\n';

function createTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "journal-stream-test-"));
  mkdirSync(dir, { recursive: true });
  return dir;
}

function writeJournalFile(dir: string, name: string, lines: string[]): string {
  const path = join(dir, name);
  writeFileSync(path, lines.join(""), "utf-8");
  return path;
}

describe("createJournalStream", () => {
  let tmpDir: string;

  afterEach(() => {
    if (tmpDir) {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("reads existing events with from:'start'", async () => {
    tmpDir = createTempDir();
    writeJournalFile(tmpDir, "Journal.2024-01-01T000000_01.log", [
      EVENT1,
      EVENT2,
    ]);

    const events: any[] = [];
    const stream = createJournalStream({ directory: tmpDir, from: "start" });
    for await (const event of stream) {
      events.push(event);
      if (events.length === 2) stream.stop();
    }
    expect(events).toHaveLength(2);
    expect(events[0].event).toBe("Docked");
    expect(events[1].event).toBe("Location");
  });

  it("emits no events with from:'end'", async () => {
    tmpDir = createTempDir();
    writeJournalFile(tmpDir, "Journal.2024-01-01T000000_01.log", [
      EVENT1,
      EVENT2,
    ]);

    const events: any[] = [];
    const stream = createJournalStream({ directory: tmpDir, from: "end" });
    stream.stop();
    for await (const event of stream) {
      events.push(event);
    }
    expect(events).toHaveLength(0);
  });

  it("filters events by type", async () => {
    tmpDir = createTempDir();
    writeJournalFile(tmpDir, "Journal.2024-01-01T000000_01.log", [
      EVENT1,
      EVENT2,
      EVENT3,
    ]);

    const events: any[] = [];
    const stream = createJournalStream({
      directory: tmpDir,
      from: "start",
      filter: ["Docked", "Scan"],
    });
    for await (const event of stream) {
      events.push(event);
      if (events.length === 2) stream.stop();
    }
    expect(events).toHaveLength(2);
    expect(events[0].event).toBe("Docked");
    expect(events[1].event).toBe("Scan");
  });

  it("reads across multiple journal files", async () => {
    tmpDir = createTempDir();
    writeJournalFile(tmpDir, "Journal.2024-01-01T000000_01.log", [EVENT1]);
    writeJournalFile(tmpDir, "Journal.2024-01-01T010000_01.log", [EVENT2]);

    const events: any[] = [];
    const stream = createJournalStream({ directory: tmpDir, from: "start" });
    for await (const event of stream) {
      events.push(event);
      if (events.length === 2) stream.stop();
    }
    expect(events).toHaveLength(2);
  });
});
