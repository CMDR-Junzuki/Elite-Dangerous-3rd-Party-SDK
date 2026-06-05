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
