// Auto-generated from FDevIDs
export interface CqcRank {
  number: number;
  name: string;
}

export const cqcRanks: CqcRank[] = [
  { number: 0, name: "Helpless" },
  { number: 1, name: "Mostly Helpless" },
  { number: 2, name: "Amateur" },
  { number: 3, name: "Semi Professional" },
  { number: 4, name: "Professional" },
  { number: 5, name: "Champion" },
  { number: 6, name: "Hero" },
  { number: 7, name: "Legend" },
  { number: 8, name: "Elite" },
  { number: 9, name: "Elite I" },
  { number: 10, name: "Elite II" },
  { number: 11, name: "Elite III" },
  { number: 12, name: "Elite IV" },
  { number: 13, name: "Elite V" },
];

export const cqcRanksByRank = new Map<number, CqcRank>(
  cqcRanks.map((r) => [r.number, r]),
);

export const cqcRankNames: string[] = cqcRanks.map((r) => r.name);
