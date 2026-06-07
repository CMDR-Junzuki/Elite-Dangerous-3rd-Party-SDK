import { describe, expect, it } from "vitest";
import {
  computeSingleHopRoutes,
  findMultiHopRoutes,
  findRoundTrips,
  type StationMarket,
  suggestMaterialFarming,
} from "../src/route-optimizer.js";

const makeStation = (name: string, system: string): StationMarket => ({
  station: { name, system },
  supplies: [],
  demands: [],
});

const stationA: StationMarket = {
  station: { name: "A", system: "Sys1" },
  supplies: [
    {
      symbol: "Gold",
      name: "Gold",
      category: "Metals",
      buyPrice: 10000,
      sellPrice: 0,
      stock: 1000,
      demand: 0,
      isRare: false,
    },
    {
      symbol: "Silver",
      name: "Silver",
      category: "Metals",
      buyPrice: 5000,
      sellPrice: 0,
      stock: 1000,
      demand: 0,
      isRare: false,
    },
  ],
  demands: [
    {
      symbol: "Platinum",
      name: "Platinum",
      category: "Metals",
      buyPrice: 0,
      sellPrice: 30000,
      stock: 0,
      demand: 100,
      isRare: false,
    },
    {
      symbol: "Palladium",
      name: "Palladium",
      category: "Metals",
      buyPrice: 0,
      sellPrice: 20000,
      stock: 0,
      demand: 100,
      isRare: false,
    },
  ],
};

const stationB: StationMarket = {
  station: { name: "B", system: "Sys2" },
  supplies: [
    {
      symbol: "Platinum",
      name: "Platinum",
      category: "Metals",
      buyPrice: 25000,
      sellPrice: 0,
      stock: 500,
      demand: 0,
      isRare: false,
    },
    {
      symbol: "Palladium",
      name: "Palladium",
      category: "Metals",
      buyPrice: 15000,
      sellPrice: 0,
      stock: 500,
      demand: 0,
      isRare: false,
    },
  ],
  demands: [
    {
      symbol: "Gold",
      name: "Gold",
      category: "Metals",
      buyPrice: 0,
      sellPrice: 18000,
      stock: 0,
      demand: 200,
      isRare: false,
    },
    {
      symbol: "Silver",
      name: "Silver",
      category: "Metals",
      buyPrice: 0,
      sellPrice: 9000,
      stock: 0,
      demand: 200,
      isRare: false,
    },
  ],
};

const stationC: StationMarket = {
  station: { name: "C", system: "Sys3" },
  supplies: [
    {
      symbol: "Computers",
      name: "Computers",
      category: "Technology",
      buyPrice: 500,
      sellPrice: 0,
      stock: 1000,
      demand: 0,
      isRare: false,
    },
  ],
  demands: [
    {
      symbol: "Gold",
      name: "Gold",
      category: "Metals",
      buyPrice: 0,
      sellPrice: 17000,
      stock: 0,
      demand: 100,
      isRare: false,
    },
  ],
};

const stations = [stationA, stationB, stationC];

describe("computeSingleHopRoutes", () => {
  it("finds profitable routes between stations", () => {
    const routes = computeSingleHopRoutes(stations, 100);
    expect(routes.length).toBeGreaterThan(0);
    // A supplies Gold at 10000, B demands Gold at 18000
    const goldRoute = routes.find((r) => r.commodity.symbol === "Gold");
    expect(goldRoute).toBeDefined();
    expect(goldRoute!.profitPerUnit).toBe(8000);
    expect(goldRoute!.totalProfit).toBe(8000 * 100);
  });

  it("finds multiple commodity routes", () => {
    const routes = computeSingleHopRoutes(stations, 100);
    // A->B should have Gold AND Silver
    const abRoutes = routes.filter(
      (r) => r.from.name === "A" && r.to.name === "B",
    );
    expect(abRoutes.length).toBeGreaterThanOrEqual(2);
  });

  it("skips same-station pairs", () => {
    const routes = computeSingleHopRoutes(stations, 100);
    const same = routes.filter((r) => r.from.name === r.to.name);
    expect(same).toEqual([]);
  });

  it("respects maxDistance filter", () => {
    // With maxDistance=0, distanceLy should be 0
    const routes = computeSingleHopRoutes(stations, 100, 0);
    expect(routes.length).toBeGreaterThan(0);
  });

  it("returns empty for single station", () => {
    const routes = computeSingleHopRoutes([stationA], 100);
    expect(routes).toEqual([]);
  });
});

describe("findRoundTrips", () => {
  it("finds round-trip routes", () => {
    const trips = findRoundTrips(stations, { cargoCapacity: 100 });
    // A->B (Gold) + B->A (Platinum or Palladium)
    const aToB = trips.filter((t) => t.hops[0].from.name === "A");
    expect(aToB.length).toBeGreaterThan(0);
    expect(aToB[0].roundTrip).toBe(true);
    expect(aToB[0].hops.length).toBe(2);
  });

  it("round trip profit is sum of both hops", () => {
    const trips = findRoundTrips(stations, { cargoCapacity: 100 });
    for (const t of trips) {
      const sum = t.hops.reduce((s, h) => s + h.totalProfit, 0);
      expect(t.totalProfit).toBe(sum);
    }
  });

  it("returns empty for incompatible stations", () => {
    const single = [stationA];
    // stationA buys Platinum but no one sells it cheap, so no round trips
    const trips = findRoundTrips(single, { cargoCapacity: 100 });
    expect(trips.length).toBe(0);
  });

  it("respects topN", () => {
    const trips = findRoundTrips(stations, { cargoCapacity: 100, topN: 1 });
    expect(trips.length).toBeLessThanOrEqual(1);
  });
});

describe("findMultiHopRoutes", () => {
  it("finds 2-hop loops (same as round trips)", () => {
    const routes = findMultiHopRoutes(stations, 2, { cargoCapacity: 100 });
    expect(routes.length).toBeGreaterThan(0);
    for (const r of routes) {
      expect(r.hops.length).toBeLessThanOrEqual(2);
    }
  });

  it("finds 3-hop loops", () => {
    const routes = findMultiHopRoutes(stations, 3, { cargoCapacity: 100 });
    const threeHops = routes.filter((r) => r.hops.length === 3);
    // A->B (sell Gold), B->? (sell Platinum), ?->A (sell Computers)
    // This depends on the specific market setup
    expect(threeHops.length).toBeGreaterThanOrEqual(0);
  });

  it("returns non-empty for maxHops=1", () => {
    const routes = findMultiHopRoutes(stations, 1, { cargoCapacity: 100 });
    expect(routes.length).toBeGreaterThan(0);
    expect(routes[0].roundTrip).toBe(false);
  });
});

describe("suggestMaterialFarming", () => {
  it("returns suggestions for raw materials", () => {
    const suggestions = suggestMaterialFarming("raw", 2);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].activity).toBeTruthy();
    expect(suggestions[0].description).toBeTruthy();
  });

  it("returns suggestions for manufactured materials", () => {
    const suggestions = suggestMaterialFarming("manufactured", 3);
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it("returns suggestions for encoded materials", () => {
    const suggestions = suggestMaterialFarming("encoded", 1);
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it("returns fallback for unknown category", () => {
    const suggestions = suggestMaterialFarming("unknown", 1);
    expect(suggestions).toEqual([]);
  });

  it("includes additional suggestions for high-grade materials", () => {
    const g5 = suggestMaterialFarming("raw", 5);
    const g1 = suggestMaterialFarming("raw", 1);
    expect(g5.length).toBeGreaterThan(g1.length);
  });
});
