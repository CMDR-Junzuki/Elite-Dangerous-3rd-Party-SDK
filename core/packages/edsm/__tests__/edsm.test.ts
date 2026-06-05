import { beforeEach, describe, expect, it, vi } from "vitest";
import { EDSM_BASE, EDSMClient } from "../src/client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("EDSMClient", () => {
  it("constructs with default base URL", () => {
    const client = new EDSMClient();
    expect(client).toBeInstanceOf(EDSMClient);
  });

  it("constructs with apiKey", () => {
    const client = new EDSMClient({
      apiKey: "test-key",
      commanderName: "TestCmdr",
    });
    expect(client).toBeInstanceOf(EDSMClient);
  });

  it("getSystem builds correct URL", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ name: "Sol", id: 1 }),
    });

    const client = new EDSMClient();
    const result = await client.getSystem("Sol");

    expect(mockFetch).toHaveBeenCalledWith(
      `${EDSM_BASE}/api-v1/system?systemName=Sol&showId=1&showCoordinates=1`,
    );
    expect(result.name).toBe("Sol");
  });

  it("getSystem passes optional params", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ name: "Sol" }),
    });

    const client = new EDSMClient();
    await client.getSystem("Sol", { showPermit: true, showInformation: true });

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("showPermit=1");
    expect(url).toContain("showInformation=1");
  });

  it("getSystems builds URL with array params", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const client = new EDSMClient();
    await client.getSystems(["Sol", "Alpha Centauri"]);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("systemName%5B0%5D=Sol");
    expect(url).toContain("systemName%5B1%5D=Alpha+Centauri");
  });

  it("getSystemBodies fetches system bodies", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        name: "Sol",
        bodies: [{ id: 1, name: "Sol", type: "Star" }],
      }),
    });

    const client = new EDSMClient();
    const result = await client.getSystemBodies("Sol");

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/api-system-v1/bodies");
    expect(url).toContain("systemName=Sol");
    expect(result.bodies.length).toBe(1);
  });

  it("getSystemStations fetches stations for a system", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        name: "Sol",
        stations: [{ name: "Murchison Station", type: "Coriolis" }],
      }),
    });

    const client = new EDSMClient();
    const result = await client.getSystemStations("Sol");

    expect(result.stations.length).toBe(1);
    expect(result.stations[0].name).toBe("Murchison Station");
  });

  it("getSystemEstimatedValue fetches exploration value", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ estimatedValue: 5000000 }),
    });

    const client = new EDSMClient();
    const result = await client.getSystemEstimatedValue("Sol");

    expect(result.estimatedValue).toBe(5000000);
  });

  it("getSphereSystems builds URL with radius", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const client = new EDSMClient();
    await client.getSphereSystems("Sol", 50);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("radius=50");
    expect(url).toContain("systemName=Sol");
  });

  it("getSphereSystems caps radius at 100", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const client = new EDSMClient();
    await client.getSphereSystems("Sol", 999);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("radius=100");
  });

  it("getCubeSystems builds URL with size", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const client = new EDSMClient();
    await client.getCubeSystems("Sol", 100);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("size=100");
  });

  it("throws on HTTP error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "Rate limited",
    });

    const client = new EDSMClient();
    await expect(client.getSystem("Sol")).rejects.toThrow("EDSM");
  });

  it("getSystem respects boolOpts conversion", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ name: "Sol" }),
    });

    const client = new EDSMClient();
    await client.getSystem("Sol", { showId: false, showCoordinates: false });

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("showId=0");
    expect(url).toContain("showCoordinates=0");
  });
});
