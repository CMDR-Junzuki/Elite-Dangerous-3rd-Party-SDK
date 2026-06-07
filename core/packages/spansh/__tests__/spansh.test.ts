import { beforeEach, describe, expect, it, vi } from "vitest";
import { SPANSH_BASE, SpanshClient } from "../src/client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ system: { name: "Sol", id64: 1 } }),
  });
});

describe("SpanshClient", () => {
  it("constructs with default base", () => {
    const client = new SpanshClient();
    expect(client).toBeInstanceOf(SpanshClient);
  });

  it("accepts custom base URL", () => {
    const client = new SpanshClient("https://spansh.test");
    expect(client).toBeInstanceOf(SpanshClient);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ system: { name: "Sol", id64: 1 } }),
    });
    client.getSystem(1);
    expect(mockFetch).toHaveBeenCalledWith("https://spansh.test/api/system/1");
  });

  it("getSystem fetches by id64", async () => {
    const client = new SpanshClient();
    const result = await client.getSystem(1);

    expect(mockFetch).toHaveBeenCalledWith(`${SPANSH_BASE}/api/system/1`);
    expect(result.system.name).toBe("Sol");
  });

  it("getStation fetches by market_id", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ station: { name: "Test Station", market_id: 123 } }),
    });

    const client = new SpanshClient();
    const result = await client.getStation(123);

    expect(mockFetch).toHaveBeenCalledWith(`${SPANSH_BASE}/api/station/123`);
    expect(result.station.name).toBe("Test Station");
  });

  it("getBody fetches by body id64", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ body: { name: "Earth", id64: 123 } }),
    });

    const client = new SpanshClient();
    const result = await client.getBody(123);

    expect(mockFetch).toHaveBeenCalledWith(`${SPANSH_BASE}/api/body/123`);
    expect(result.body.name).toBe("Earth");
  });

  it("searchSystemNames sends query param", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ["Sol", "Solati"],
    });

    const client = new SpanshClient();
    const result = await client.searchSystemNames("Sol");

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/api/systems/field_values/system_names?q=Sol");
    expect(result.length).toBe(2);
  });

  it("getCommodityLocations builds correct URL", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const client = new SpanshClient();
    await client.getCommodityLocations("sell", "Sol", "Bertrandite", 10);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/api/commodity/sell/Sol/Bertrandite/10");
  });

  it("searchStations sends POST with filters", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [],
        count: 0,
        from: 0,
        search: {},
        search_reference: "",
        size: 0,
      }),
    });

    const client = new SpanshClient();
    await client.searchStations({
      filters: { economy: { value: ["High Tech"] } },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${SPANSH_BASE}/api/stations/search`,
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.filters.economy.value[0]).toBe("High Tech");
  });

  it("dumpSystem fetches dump endpoint", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ name: "Sol", id64: 1, x: 0, y: 0, z: 0 }),
    });

    const client = new SpanshClient();
    const result = await client.dumpSystem(1);

    expect(mockFetch).toHaveBeenCalledWith(`${SPANSH_BASE}/api/dump/1`);
    expect(result.name).toBe("Sol");
  });

  it("search returns systems/stations/bodies", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        systems: [{ name: "Sol", id64: 1, x: 0, y: 0, z: 0 }],
        stations: [],
        bodies: [],
      }),
    });

    const client = new SpanshClient();
    const result = await client.search("Sol");

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/api/search?q=Sol");
    expect(result.systems!).toHaveLength(1);
    expect(result.systems![0].name).toBe("Sol");
  });

  it("searchFactions returns faction names", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ["The Fatherhood", "Dark Echo"],
    });

    const client = new SpanshClient();
    const result = await client.searchFactions("The");

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("minor_factions");
    expect(result).toContain("The Fatherhood");
  });

  it("getControllingFactions returns factions", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ["Federation", "Empire"],
    });

    const client = new SpanshClient();
    const result = await client.getControllingFactions();

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("controlling_minor_faction");
    expect(result).toContain("Federation");
  });

  it("getRoute sends POST with from/to", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        jumps: [
          {
            system: "Sol",
            system_id64: 1,
            distance: 0,
            jump: 1,
            fuel_used: 0,
            neutron: false,
          },
        ],
        distance: 0,
        total_jumps: 1,
        total_distance: 0,
        efficiency: 0,
        range: 50,
      }),
    });

    const client = new SpanshClient();
    const result = await client.getRoute({
      from: "Sol",
      to: "Alpha Centauri",
      range: 50,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${SPANSH_BASE}/api/route`,
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.from).toBe("Sol");
    expect(body.to).toBe("Alpha Centauri");
    expect(result.total_jumps).toBe(1);
  });

  it("getNearest fetches POIs by type", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          system: "Sol",
          station: "Daedalus",
          distance: 0,
          distance_from_reference: 0,
          type: "material_trader",
          system_id64: 1,
        },
      ],
    });

    const client = new SpanshClient();
    const result = await client.getNearest("Sol", "material_trader");

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/api/nearest");
    expect(url).toContain("system=Sol");
    expect(url).toContain("type=material_trader");
    expect(result[0].station).toBe("Daedalus");
  });

  it("throws on HTTP error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Server error",
    });

    const client = new SpanshClient();
    await expect(client.getSystem(1)).rejects.toThrow("Spansh");
  });
});
