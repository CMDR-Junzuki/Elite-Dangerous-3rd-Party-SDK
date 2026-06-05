// Auto-generated from FDevIDs
export interface EmpireRank {
  number: number;
  name: string;
}

export const empireRanks: EmpireRank[] = [
  { number: 0, name: "None" },
  { number: 1, name: "Outsider" },
  { number: 2, name: "Serf" },
  { number: 3, name: "Master" },
  { number: 4, name: "Squire" },
  { number: 5, name: "Knight" },
  { number: 6, name: "Lord" },
  { number: 7, name: "Baron" },
  { number: 8, name: "Viscount" },
  { number: 9, name: "Count" },
  { number: 10, name: "Earl" },
  { number: 11, name: "Marquis" },
  { number: 12, name: "Duke" },
  { number: 13, name: "Prince" },
  { number: 14, name: "King" },
];

export const empireRanksByRank = new Map<number, EmpireRank>(
  empireRanks.map((r) => [r.number, r]),
);

export const empireRankNames: string[] = empireRanks.map((r) => r.name);
