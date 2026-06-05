import { commoditiesBySymbol } from "@elite-dangerous-sdk/data";

export interface TradeStation {
  name: string;
  system: string;
  distanceFromStar?: number;
}

export interface TradeCommodity {
  symbol: string;
  name: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  demand: number;
  isRare: boolean;
}

export interface TradeRoute {
  from: TradeStation;
  to: TradeStation;
  commodity: TradeCommodity;
  profitPerUnit: number;
  totalProfit: number;
  cargoCapacity: number;
  distanceLy: number;
  profitPerLy: number;
}

export interface TradeRouteFilter {
  minProfitPerUnit?: number;
  maxDistance?: number;
  minCargo?: number;
  categories?: string[];
}

/**
 * Calculate profit for a potential trade route.
 */
export function calculateTradeProfit(
  buyPrice: number,
  sellPrice: number,
  cargoCapacity: number,
): { perUnit: number; total: number } {
  const perUnit = sellPrice - buyPrice;
  return {
    perUnit,
    total: perUnit * cargoCapacity,
  };
}

/**
 * Rank trade routes by profitability.
 */
export function rankTradeRoutes(
  routes: TradeRoute[],
  topN?: number,
): TradeRoute[] {
  const sorted = [...routes].sort((a, b) => b.profitPerUnit - a.profitPerUnit);
  return topN ? sorted.slice(0, topN) : sorted;
}

/**
 * Filter trade routes by criteria.
 */
export function filterTradeRoutes(
  routes: TradeRoute[],
  filter: TradeRouteFilter,
): TradeRoute[] {
  return routes.filter((r) => {
    if (filter.minProfitPerUnit && r.profitPerUnit < filter.minProfitPerUnit)
      return false;
    if (filter.maxDistance && r.distanceLy > filter.maxDistance) return false;
    if (filter.minCargo && r.cargoCapacity < filter.minCargo) return false;
    if (filter.categories && !filter.categories.includes(r.commodity.category))
      return false;
    return true;
  });
}

/**
 * Classify a commodity's trade type.
 */
export function getCommodityType(symbol: string): string {
  const commodity = commoditiesBySymbol.get(symbol);
  if (!commodity) return symbol;

  // Categorize by category
  const category = (commodity as any).category ?? "";
  const categoryNames: Record<string, string> = {
    Metals: "Metal",
    Minerals: "Mineral",
    Foods: "Food",
    Textiles: "Textile",
    Waste: "Waste",
    Chemicals: "Chemical",
    Machinery: "Machinery",
    Technology: "Technology",
    Weapons: "Weapon",
    Slaves: "Slave",
    "Legal Drugs": "Drug",
    Narcotics: "Narcotic",
  };

  return categoryNames[category] ?? category;
}
