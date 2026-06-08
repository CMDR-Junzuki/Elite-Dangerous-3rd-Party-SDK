// Auto-generated from FDevIDs
export interface ExplorationRank {
  number: number;
  name: string;
}

export const explorationRanks: ExplorationRank[] = [
  { number: 0, name: 'Aimless' },
  { number: 1, name: 'Mostly Aimless' },
  { number: 2, name: 'Scout' },
  { number: 3, name: 'Surveyor' },
  { number: 4, name: 'Explorer' },
  { number: 5, name: 'Pathfinder' },
  { number: 6, name: 'Ranger' },
  { number: 7, name: 'Pioneer' },
  { number: 8, name: 'Elite' },
  { number: 9, name: 'Elite I' },
  { number: 10, name: 'Elite II' },
  { number: 11, name: 'Elite III' },
  { number: 12, name: 'Elite IV' },
  { number: 13, name: 'Elite V' },
];

export const explorationRanksByRank = new Map<number, ExplorationRank>(
  explorationRanks.map(r => [r.number, r])
);

export const explorationRankNames: string[] = explorationRanks.map(r => r.name);

