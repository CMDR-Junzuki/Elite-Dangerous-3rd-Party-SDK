import {
  calculateTradeProfit,
  type TradeCommodity,
  type TradeRoute,
  type TradeStation,
} from "./trade.js";

/**
 * A station with its full market data (what it buys and sells).
 */
export interface StationMarket {
  station: TradeStation;
  /** Commodities this station sells (buy at station, sell elsewhere) */
  supplies: TradeCommodity[];
  /** Commodities this station buys (buy elsewhere, sell here) */
  demands: TradeCommodity[];
}

/**
 * A multi-hop trade route (sequence of hops).
 */
export interface MultiHopRoute {
  hops: TradeRoute[];
  totalProfit: number;
  totalDistance: number;
  profitPerJump: number;
  profitPerLy: number;
  roundTrip: boolean;
}

/**
 * Options for route optimization.
 */
export interface RouteOptimizerOptions {
  maxDistance?: number;
  topN?: number;
  cargoCapacity?: number;
}

/**
 * Compute all profitable single-hop routes between station pairs.
 * A->B is profitable if A supplies a commodity that B demands at a higher price.
 */
export function computeSingleHopRoutes(
  stations: StationMarket[],
  cargoCapacity: number,
  maxDistance?: number,
): TradeRoute[] {
  const routes: TradeRoute[] = [];

  for (let i = 0; i < stations.length; i++) {
    for (let j = 0; j < stations.length; j++) {
      if (i === j) continue;

      const from = stations[i];
      const to = stations[j];

      const distanceLy = maxDistance ?? 0;

      for (const supply of from.supplies) {
        const demand = to.demands.find(
          (d) => d.symbol === supply.symbol && d.sellPrice > supply.buyPrice,
        );
        if (!demand) continue;

        const profit = calculateTradeProfit(
          supply.buyPrice,
          demand.sellPrice,
          cargoCapacity,
        );

        if (profit.perUnit <= 0) continue;

        routes.push({
          from: from.station,
          to: to.station,
          commodity: demand,
          profitPerUnit: profit.perUnit,
          totalProfit: profit.total,
          cargoCapacity,
          distanceLy,
          profitPerLy:
            distanceLy > 0 ? profit.total / distanceLy : profit.total,
        });
      }
    }
  }

  return routes;
}

/**
 * Find profitable round-trip trade routes (A->B->A with different commodities).
 */
export function findRoundTrips(
  stations: StationMarket[],
  options?: RouteOptimizerOptions,
): MultiHopRoute[] {
  const cap = options?.cargoCapacity ?? 100;
  const singleHops = computeSingleHopRoutes(
    stations,
    cap,
    options?.maxDistance,
  );
  const roundTrips: MultiHopRoute[] = [];

  for (let i = 0; i < singleHops.length; i++) {
    const outbound = singleHops[i];
    // Find a return hop from outbound.to back to outbound.from
    const returns = singleHops.filter(
      (h) =>
        h.from.name === outbound.to.name &&
        h.to.name === outbound.from.name &&
        h.commodity.symbol !== outbound.commodity.symbol,
    );

    for (const ret of returns) {
      const total = outbound.totalProfit + ret.totalProfit;
      const totalDist = outbound.distanceLy + ret.distanceLy;
      roundTrips.push({
        hops: [outbound, ret],
        totalProfit: total,
        totalDistance: totalDist,
        profitPerJump: total / 2,
        profitPerLy: totalDist > 0 ? total / totalDist : total,
        roundTrip: true,
      });
    }
  }

  roundTrips.sort((a, b) => b.totalProfit - a.totalProfit);
  return options?.topN ? roundTrips.slice(0, options.topN) : roundTrips;
}

/**
 * Find multi-hop trade routes up to maxHops hops.
 * For maxHops=2, equivalent to findRoundTrips.
 * For maxHops=3, finds A->B->C->A loops.
 */
export function findMultiHopRoutes(
  stations: StationMarket[],
  maxHops: number,
  options?: RouteOptimizerOptions,
): MultiHopRoute[] {
  const cap = options?.cargoCapacity ?? 100;
  const singleHops = computeSingleHopRoutes(
    stations,
    cap,
    options?.maxDistance,
  );

  if (maxHops <= 1) {
    return singleHops.map((h) => ({
      hops: [h],
      totalProfit: h.totalProfit,
      totalDistance: h.distanceLy,
      profitPerJump: h.totalProfit,
      profitPerLy: h.profitPerLy,
      roundTrip: false,
    }));
  }

  // Build adjacency: station name -> outgoing routes
  const adj = new Map<string, TradeRoute[]>();
  for (const h of singleHops) {
    const key = h.from.name;
    if (!adj.has(key)) adj.set(key, []);
    adj.get(key)!.push(h);
  }

  const results: MultiHopRoute[] = [];

  for (const start of singleHops) {
    // DFS to build multi-hop routes that return to origin
    const stack: { path: TradeRoute[]; visited: Set<string> }[] = [
      { path: [start], visited: new Set([start.from.name]) },
    ];

    while (stack.length > 0) {
      const { path, visited } = stack.pop()!;
      const last = path[path.length - 1];

      if (path.length >= 2 && last.to.name === start.from.name) {
        // Closed loop!
        const total = path.reduce((s, h) => s + h.totalProfit, 0);
        const totalDist = path.reduce((s, h) => s + h.distanceLy, 0);
        results.push({
          hops: [...path],
          totalProfit: total,
          totalDistance: totalDist,
          profitPerJump: total / path.length,
          profitPerLy: totalDist > 0 ? total / totalDist : total,
          roundTrip: path.length > 1,
        });
        continue;
      }

      if (path.length >= maxHops) continue;

      const nextRoutes = adj.get(last.to.name) || [];
      for (const next of nextRoutes) {
        if (visited.has(next.to.name) && next.to.name !== start.from.name)
          continue;
        const newVisited = new Set(visited);
        newVisited.add(next.to.name);
        stack.push({ path: [...path, next], visited: newVisited });
      }
    }
  }

  results.sort((a, b) => b.totalProfit - a.totalProfit);
  return options?.topN ? results.slice(0, options.topN) : results;
}

/**
 * Suggest material farming activities based on material category and grade.
 * Returns a list of known activity sources for the given material.
 */
export function suggestMaterialFarming(
  category: string,
  grade: number,
): { activity: string; description: string }[] {
  const suggestions: Record<
    string,
    { activity: string; description: string }[]
  > = {
    raw: [
      {
        activity: "Surface prospecting",
        description: "SRV prospecting on planetary surfaces",
      },
      { activity: "Mining", description: "Laser mining in asteroid belts" },
      {
        activity: "Deep core mining",
        description: "Core mining with seismic charges",
      },
    ],
    manufactured: [
      {
        activity: "Combat",
        description: "Destroying ships for manufactured materials",
      },
      {
        activity: "Signal sources",
        description: "Encoded/combat signal sources",
      },
      {
        activity: "Fleet Carrier looting",
        description: "Looting fleet carrier wrecks",
      },
    ],
    encoded: [
      {
        activity: "Scanning ships",
        description: "Scanning wakes and ships with data link scanner",
      },
      {
        activity: "Planetary settlements",
        description: "Scanning data points at settlements",
      },
      { activity: "Signal sources", description: "Encoded signal sources" },
    ],
    micro: [
      {
        activity: "On-foot settlements",
        description: "Looting containers at on-foot settlements",
      },
      { activity: "Mission rewards", description: "On-foot mission rewards" },
    ],
  };

  const catLower = category.toLowerCase();
  const base = suggestions[catLower] ?? [];

  // Higher grade materials may have more specific suggestions
  if (grade >= 4) {
    base.push({
      activity: grade >= 5 ? "Mission rewards (high-grade)" : "Mission rewards",
      description:
        grade >= 5
          ? "High-grade mission rewards for Grade 5 materials"
          : "Mission rewards for higher-grade materials",
    });
  }

  return base;
}
