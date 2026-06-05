import { beforeEach, describe, expect, it, vi } from "vitest";
import { ELITEBGS_BASE, EliteBGSClient } from "../src";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function mockResponse(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("elitebgs", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("ELITEBGS_BASE is correct", () => {
    expect(ELITEBGS_BASE).toBe("https://elitebgs.app/api/ebgs/v5");
  });

  describe("EliteBGSClient", () => {
    it("can be instantiated", () => {
      const client = new EliteBGSClient();
      expect(client).toBeInstanceOf(EliteBGSClient);
    });

    it("getSystems builds URL correctly", async () => {
      mockFetch.mockResolvedValue(
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 }),
      );
      const client = new EliteBGSClient();
      await client.getSystems({ name: "Sol", page: 1 });
      expect(mockFetch).toHaveBeenCalledWith(
        `${ELITEBGS_BASE}/systems?name=Sol&page=1`,
      );
    });

    it("getSystems handles array params", async () => {
      mockFetch.mockResolvedValue(
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 }),
      );
      const client = new EliteBGSClient();
      await client.getSystems({ faction: ["The Fatherhood", "Dark Echo"] });
      expect(mockFetch).toHaveBeenCalledWith(
        `${ELITEBGS_BASE}/systems?faction=The%20Fatherhood&faction=Dark%20Echo`,
      );
    });

    it("getFactions builds URL correctly", async () => {
      mockFetch.mockResolvedValue(
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 }),
      );
      const client = new EliteBGSClient();
      await client.getFactions({ name: "The Fatherhood", systemDetails: true });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("systemDetails=true");
      expect(url).toContain("name=The%20Fatherhood");
    });

    it("getFactions with state filter", async () => {
      mockFetch.mockResolvedValue(
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 }),
      );
      const client = new EliteBGSClient();
      await client.getFactions({
        activeState: "Boom",
        allegiance: "Federation",
      });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("activeState=Boom");
      expect(url).toContain("allegiance=Federation");
    });

    it("getStations builds URL correctly", async () => {
      mockFetch.mockResolvedValue(
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 }),
      );
      const client = new EliteBGSClient();
      await client.getStations({ system: "Sol", type: "Coriolis" });
      expect(mockFetch).toHaveBeenCalledWith(
        `${ELITEBGS_BASE}/stations?system=Sol&type=Coriolis`,
      );
    });

    it("getTicks builds URL correctly", async () => {
      mockFetch.mockResolvedValue(mockResponse([]));
      const client = new EliteBGSClient();
      await client.getTicks();
      expect(mockFetch).toHaveBeenCalledWith(`${ELITEBGS_BASE}/ticks`);
    });

    it("getTicks with time params", async () => {
      mockFetch.mockResolvedValue(mockResponse([]));
      const client = new EliteBGSClient();
      await client.getTicks({ timeMin: 1700000000000, timeMax: 1700086400000 });
      expect(mockFetch).toHaveBeenCalledWith(
        `${ELITEBGS_BASE}/ticks?timeMin=1700000000000&timeMax=1700086400000`,
      );
    });

    it("getSystemByName calls getSystems with name", async () => {
      mockFetch.mockResolvedValue(
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 }),
      );
      const client = new EliteBGSClient();
      await client.getSystemByName("Sol");
      expect(mockFetch).toHaveBeenCalledWith(
        `${ELITEBGS_BASE}/systems?name=Sol&page=1`,
      );
    });

    it("getFactionByName calls getFactions with name", async () => {
      mockFetch.mockResolvedValue(
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 }),
      );
      const client = new EliteBGSClient();
      await client.getFactionByName("The Fatherhood");
      expect(mockFetch).toHaveBeenCalledWith(
        `${ELITEBGS_BASE}/factions?name=The%20Fatherhood&page=1`,
      );
    });

    it("getStationsBySystem calls getStations with system", async () => {
      mockFetch.mockResolvedValue(
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 }),
      );
      const client = new EliteBGSClient();
      await client.getStationsBySystem("Sol");
      expect(mockFetch).toHaveBeenCalledWith(
        `${ELITEBGS_BASE}/stations?system=Sol`,
      );
    });

    it("getLatestTick returns first tick", async () => {
      const ticks = [
        {
          _id: "1",
          time: "2024-01-01T12:00:00Z",
          updated_at: "2024-01-01T12:00:00Z",
          __v: 0,
        },
      ];
      mockFetch.mockResolvedValue(mockResponse(ticks));
      const client = new EliteBGSClient();
      const result = await client.getLatestTick();
      expect(result).toEqual(ticks[0]);
    });

    it("getLatestTick returns undefined on empty", async () => {
      mockFetch.mockResolvedValue(mockResponse([]));
      const client = new EliteBGSClient();
      const result = await client.getLatestTick();
      expect(result).toBeUndefined();
    });

    it("handles errors from API", async () => {
      mockFetch.mockResolvedValue(new Response("Not Found", { status: 404 }));
      const client = new EliteBGSClient();
      await expect(client.getSystems({ name: "DoesNotExist" })).rejects.toThrow(
        "EliteBGS",
      );
    });

    it("respects rate limit", async () => {
      const resp = () =>
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 });
      mockFetch.mockImplementation(() => resp());
      const client = new EliteBGSClient(undefined, 600);
      const t0 = Date.now();
      await client.getSystems({ name: "Sol" });
      await client.getSystems({ name: "Sirius" });
      const elapsed = Date.now() - t0;
      expect(elapsed).toBeGreaterThanOrEqual(90);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("ignores null/undefined params", async () => {
      mockFetch.mockResolvedValue(
        mockResponse({ docs: [], total: 0, page: 1, pages: 1, limit: 10 }),
      );
      const client = new EliteBGSClient();
      await client.getSystems({ name: undefined as unknown as string });
      expect(mockFetch).toHaveBeenCalledWith(`${ELITEBGS_BASE}/systems`);
    });
  });
});
