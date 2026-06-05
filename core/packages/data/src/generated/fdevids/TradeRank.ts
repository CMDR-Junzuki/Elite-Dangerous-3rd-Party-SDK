// Auto-generated from FDevIDs
export interface TradeRank {
  number: number;
  name: string;
}

export const tradeRanks: TradeRank[] = [
  { number: 0, name: "Penniless" },
  { number: 1, name: "Mostly Penniless" },
  { number: 2, name: "Peddler" },
  { number: 3, name: "Dealer" },
  { number: 4, name: "Merchant" },
  { number: 5, name: "Broker" },
  { number: 6, name: "Entrepreneur" },
  { number: 7, name: "Tycoon" },
  { number: 8, name: "Elite" },
  { number: 9, name: "Elite I" },
  { number: 10, name: "Elite II" },
  { number: 11, name: "Elite III" },
  { number: 12, name: "Elite IV" },
  { number: 13, name: "Elite V" },
];

export const tradeRanksByRank = new Map<number, TradeRank>(
  tradeRanks.map((r) => [r.number, r]),
);

export const tradeRankNames: string[] = tradeRanks.map((r) => r.name);
