import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JournalReplay } from "../src/JournalReplay.js";
import type { JournalEvent } from "../src/types";

function makeEvent(
  event: string,
  timestamp: string,
  extra?: Record<string, unknown>,
): JournalEvent {
  return { timestamp, event, ...extra } as unknown as JournalEvent;
}

const EVENTS_1S_APART: JournalEvent[] = [
  makeEvent("Fileheader", "2024-01-01T00:00:00Z", { part: 1 }),
  makeEvent("LoadGame", "2024-01-01T00:00:01Z", {
    Commander: "Test",
    Ship: "SideWinder",
    ShipID: 1,
  }),
  makeEvent("FSDJump", "2024-01-01T00:00:02Z", {
    StarSystem: "Sol",
    SystemAddress: 1n,
  }),
];

const EVENTS_SAME_TS: JournalEvent[] = [
  makeEvent("Fileheader", "2024-01-01T00:00:00Z", { part: 1 }),
  makeEvent("Docked", "2024-01-01T00:00:00Z", { StationName: "TEST" }),
];

describe("JournalReplay", () => {
  describe("loadEvents", () => {
    it("loads events from array", () => {
      const replay = new JournalReplay();
      replay.loadEvents(EVENTS_1S_APART);
      expect(replay.totalEvents).toBe(3);
    });

    it("applies filter on loadEvents", () => {
      const replay = new JournalReplay({ filter: ["FSDJump"] });
      replay.loadEvents(EVENTS_1S_APART);
      expect(replay.totalEvents).toBe(1);
      expect(replay.state).toBe("idle");
    });

    it("starts with no events", () => {
      const replay = new JournalReplay();
      expect(replay.totalEvents).toBe(0);
      expect(replay.currentIndex).toBe(0);
    });
  });

  describe("play", () => {
    it("plays all events and emits start/end", async () => {
      const replay = new JournalReplay({ speed: 100 });
      replay.loadEvents(EVENTS_1S_APART);

      const events: JournalEvent[] = [];
      const start = vi.fn();
      const end = vi.fn();

      replay.on("event", (e: JournalEvent) => events.push(e));
      replay.on("start", start);
      replay.on("end", end);

      await replay.play();

      expect(events).toHaveLength(3);
      expect(events[0].event).toBe("Fileheader");
      expect(events[1].event).toBe("LoadGame");
      expect(events[2].event).toBe("FSDJump");
      expect(start).toHaveBeenCalledOnce();
      expect(end).toHaveBeenCalledOnce();
      expect(replay.state).toBe("ended");
    });

    it("does nothing with no events", async () => {
      const replay = new JournalReplay();
      const end = vi.fn();
      replay.on("end", end);
      await replay.play();
      expect(end).not.toHaveBeenCalled();
    });
  });

  describe("pause / resume", () => {
    it("pauses and resumes playback", async () => {
      // Events 5 minutes apart at speed 1 => 300s delay between events
      const events_5m_apart: JournalEvent[] = [
        makeEvent("Fileheader", "2024-01-01T00:00:00Z", { part: 1 }),
        makeEvent("LoadGame", "2024-01-01T00:05:00Z", {
          Commander: "Test",
          Ship: "SideWinder",
          ShipID: 1,
        }),
        makeEvent("FSDJump", "2024-01-01T00:10:00Z", {
          StarSystem: "Sol",
          SystemAddress: 1n,
        }),
      ];

      const replay = new JournalReplay();
      replay.loadEvents(events_5m_apart);

      const events: JournalEvent[] = [];
      replay.on("event", (e: JournalEvent) => events.push(e));

      const pause = vi.fn();
      const resume = vi.fn();
      replay.on("pause", pause);
      replay.on("resume", resume);

      const playPromise = replay.play();
      await new Promise((r) => setTimeout(r, 50));

      // First event fires immediately
      expect(events.length).toBe(1);
      expect(replay.state).toBe("playing");

      replay.pause();
      expect(replay.state).toBe("paused");
      expect(pause).toHaveBeenCalledOnce();

      // No more events should fire while paused
      const countAfterPause = events.length;
      await new Promise((r) => setTimeout(r, 100));
      expect(events.length).toBe(countAfterPause);

      // Set speed high BEFORE resuming so the timer uses the new speed
      replay.speed = 100;
      replay.resume();
      expect(replay.state).toBe("playing");
      expect(resume).toHaveBeenCalledOnce();

      await playPromise;
      expect(events).toHaveLength(3);
    });

    it("resume on paused calls resumes playback", async () => {
      const events_5m_apart: JournalEvent[] = [
        makeEvent("Fileheader", "2024-01-01T00:00:00Z", { part: 1 }),
        makeEvent("LoadGame", "2024-01-01T00:05:00Z", {
          Commander: "Test",
          Ship: "SideWinder",
          ShipID: 1,
        }),
      ];

      const replay = new JournalReplay();
      replay.loadEvents(events_5m_apart);

      const playPromise = replay.play();
      await new Promise((r) => setTimeout(r, 10));
      replay.pause();

      // Set speed high before calling play() again (which will resume)
      replay.speed = 100;
      const playAgain = replay.play();
      await playAgain;
      // play() and playAgain should both resolve
      await expect(playPromise).resolves.toBeUndefined();
    });
  });

  describe("stop", () => {
    it("stops playback and resets to idle", async () => {
      const replay = new JournalReplay({ speed: 1 });
      replay.loadEvents(EVENTS_1S_APART);

      const stop = vi.fn();
      replay.on("stop", stop);

      const playPromise = replay.play();
      await new Promise((r) => setTimeout(r, 50));
      replay.stop();

      expect(replay.state).toBe("idle");
      expect(replay.currentIndex).toBe(0);
      expect(stop).toHaveBeenCalledOnce();
      await expect(playPromise).resolves.toBeUndefined();
    });

    it("does nothing if already idle", () => {
      const replay = new JournalReplay();
      replay.stop(); // should not throw
      expect(replay.state).toBe("idle");
    });
  });

  describe("seek", () => {
    it("seeks to a specific event index during idle", () => {
      const replay = new JournalReplay();
      replay.loadEvents(EVENTS_1S_APART);

      const seek = vi.fn();
      replay.on("seek", seek);

      replay.seek(1);
      expect(replay.currentIndex).toBe(1);
      expect(seek).toHaveBeenCalledWith(1);
    });

    it("clamps index to valid range", () => {
      const replay = new JournalReplay();
      replay.loadEvents(EVENTS_1S_APART);

      replay.seek(-5);
      expect(replay.currentIndex).toBe(0);

      replay.seek(999);
      expect(replay.currentIndex).toBe(2);
    });
  });

  describe("speed", () => {
    it("defaults to 1", () => {
      const replay = new JournalReplay();
      expect(replay.speed).toBe(1);
    });

    it("accepts custom speed", () => {
      const replay = new JournalReplay({ speed: 10 });
      expect(replay.speed).toBe(10);
    });

    it("clamps to minimum of 0.1", () => {
      const replay = new JournalReplay();
      replay.speed = -5;
      expect(replay.speed).toBe(0.1);
    });
  });

  describe("filter", () => {
    it("filters events during load", () => {
      const replay = new JournalReplay({ filter: ["FSDJump", "LoadGame"] });
      replay.loadEvents(EVENTS_1S_APART);
      expect(replay.totalEvents).toBe(2);
    });

    it("can set filter after construction", () => {
      const replay = new JournalReplay();
      replay.filter(["FSDJump"]);
      replay.loadEvents(EVENTS_1S_APART);
      expect(replay.totalEvents).toBe(1);
    });
  });

  describe("load (filesystem)", () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = mkdtempSync(join(tmpdir(), "journal-replay-test-"));
    });

    afterEach(() => {
      rmSync(tmpDir, { recursive: true, force: true });
    });

    it("loads events from a journal file", async () => {
      const filePath = join(tmpDir, "Journal.2024-01-01T000000_01.log");
      const lines = [
        '{"timestamp":"2024-01-01T00:00:00Z","event":"Fileheader","part":1}',
        '{"timestamp":"2024-01-01T00:00:01Z","event":"LoadGame","Commander":"Test","Ship":"SideWinder","ShipID":1}',
        '{"timestamp":"2024-01-01T00:00:02Z","event":"FSDJump","StarSystem":"Sol","SystemAddress":1}',
      ];
      writeFileSync(filePath, lines.join("\n") + "\n", "utf-8");

      const replay = new JournalReplay();
      await replay.load(filePath);
      expect(replay.totalEvents).toBe(3);
    });

    it("loads events from a journal directory", async () => {
      const file1 = join(tmpDir, "Journal.2024-01-01T000000_01.log");
      writeFileSync(
        file1,
        '{"timestamp":"2024-01-01T00:00:00Z","event":"Fileheader","part":1}\n',
        "utf-8",
      );

      const file2 = join(tmpDir, "Journal.2024-01-01T010000_01.log");
      writeFileSync(
        file2,
        '{"timestamp":"2024-01-01T01:00:00Z","event":"LoadGame","Commander":"Test","Ship":"SideWinder","ShipID":1}\n',
        "utf-8",
      );

      const replay = new JournalReplay();
      await replay.load(tmpDir);
      expect(replay.totalEvents).toBe(2);
    });
  });

  describe("delay calculation (timestamps)", () => {
    it("uses 100ms default for events with same timestamp", async () => {
      const replay = new JournalReplay({ speed: 100 });
      replay.loadEvents(EVENTS_SAME_TS);

      const events: JournalEvent[] = [];
      replay.on("event", (e: JournalEvent) => events.push(e));

      await replay.play();
      expect(events).toHaveLength(2);
    });
  });
});
