import { afterEach, describe, expect, it, vi } from "vitest";
import { WebSocket } from "ws";

// We use a mock journal watcher to avoid file system dependency
vi.mock("@elite-dangerous-sdk/journal", () => {
  const mockEvents = [
    { event: "FileHeader", timestamp: "2024-01-01T00:00:00Z", part: 1 },
    {
      event: "LoadGame",
      timestamp: "2024-01-01T00:00:01Z",
      Commander: "Test",
      Ship: "Sidewinder",
    },
    {
      event: "FSDJump",
      timestamp: "2024-01-01T00:00:02Z",
      StarSystem: "Sol",
      JumpDist: 0,
    },
    {
      event: "Docked",
      timestamp: "2024-01-01T00:00:03Z",
      StationName: "Test Station",
    },
  ];

  class MockWatcher {
    private signal = new AbortController();
    async *watchEvents() {
      for (const ev of mockEvents) {
        if (this.signal.signal.aborted) break;
        // Small delay to let clients connect
        await new Promise((r) => setTimeout(r, 10));
        yield ev;
      }
    }
    stop() {
      this.signal.abort();
    }
  }

  return {
    JournalWatcher: MockWatcher,
    getJournalDirectory: () => "/mock/dir",
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("JournalWebSocketServer", () => {
  it("starts and stops without error", async () => {
    const { JournalWebSocketServer } = await import("../src/server.js");
    const server = new JournalWebSocketServer({ port: 0, host: "127.0.0.1" });
    await server.start();
    expect(server.isRunning).toBe(true);
    expect(server.port).toBeGreaterThan(0);
    server.stop();
    expect(server.isRunning).toBe(false);
  });

  it("accepts client connections and broadcasts events", async () => {
    const { JournalWebSocketServer } = await import("../src/server.js");
    const server = new JournalWebSocketServer({ port: 0, host: "127.0.0.1" });
    await server.start();

    const ws = new WebSocket(`ws://127.0.0.1:${server.port}`);
    const messages: string[] = [];

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("timeout")), 3000);
      ws.on("open", () => {
        // Give the async iterator time to yield events
        setTimeout(() => {
          clearTimeout(timer);
          resolve();
        }, 200);
      });
      ws.on("message", (data) => {
        messages.push(data.toString());
      });
    });

    expect(messages.length).toBeGreaterThanOrEqual(1);
    expect(messages.some((m) => m.includes("FileHeader"))).toBe(true);
    expect(messages.some((m) => m.includes("FSDJump"))).toBe(true);

    ws.close();
    server.stop();
  });

  it("filters events when filter is set", async () => {
    const { JournalWebSocketServer } = await import("../src/server.js");
    const server = new JournalWebSocketServer({
      port: 0,
      host: "127.0.0.1",
      filter: ["FSDJump"],
    });
    await server.start();

    const ws = new WebSocket(`ws://127.0.0.1:${server.port}`);
    const messages: string[] = [];

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("timeout")), 3000);
      ws.on("open", () => {
        setTimeout(() => {
          clearTimeout(timer);
          resolve();
        }, 200);
      });
      ws.on("message", (data) => {
        messages.push(data.toString());
      });
    });

    expect(messages.length).toBeGreaterThanOrEqual(1);
    for (const msg of messages) {
      const parsed = JSON.parse(msg);
      expect(parsed.event).toBe("FSDJump");
    }

    ws.close();
    server.stop();
  });

  it("reports client count correctly", async () => {
    const { JournalWebSocketServer } = await import("../src/server.js");
    const server = new JournalWebSocketServer({ port: 0, host: "127.0.0.1" });
    await server.start();
    expect(server.clientCount).toBe(0);

    const ws = new WebSocket(`ws://127.0.0.1:${server.port}`);
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("timeout")), 3000);
      ws.on("open", () => {
        clearTimeout(timer);
        expect(server.clientCount).toBe(1);
        resolve();
      });
    });

    ws.close();
    server.stop();
  });
});
