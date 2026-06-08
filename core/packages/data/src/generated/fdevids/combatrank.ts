// Auto-generated from FDevIDs
export interface CombatRank {
  number: number;
  name: string;
}

export const combatRanks: CombatRank[] = [
  { number: 0, name: 'Harmless' },
  { number: 1, name: 'MostlyHarmless' },
  { number: 2, name: 'Novice' },
  { number: 3, name: 'Competent' },
  { number: 4, name: 'Expert' },
  { number: 5, name: 'Master' },
  { number: 6, name: 'Dangerous' },
  { number: 7, name: 'Deadly' },
  { number: 8, name: 'Elite' },
  { number: 9, name: 'Elite I' },
  { number: 10, name: 'Elite II' },
  { number: 11, name: 'Elite III' },
  { number: 12, name: 'Elite IV' },
  { number: 13, name: 'Elite V' },
];

export const combatRanksByRank = new Map<number, CombatRank>(
  combatRanks.map(r => [r.number, r])
);

export const combatRankNames: string[] = combatRanks.map(r => r.name);

