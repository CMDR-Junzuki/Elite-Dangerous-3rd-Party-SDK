// Auto-generated from FDevIDs
export interface FederationRank {
  number: number;
  name: string;
}

export const federationRanks: FederationRank[] = [
  { number: 0, name: 'None' },
  { number: 1, name: 'Recruit' },
  { number: 2, name: 'Cadet' },
  { number: 3, name: 'Midshipman' },
  { number: 4, name: 'Petty Officer' },
  { number: 5, name: 'Chief Petty Officer' },
  { number: 6, name: 'Warrant Officer' },
  { number: 7, name: 'Ensign' },
  { number: 8, name: 'Lieutenant' },
  { number: 9, name: 'Lt Commander' },
  { number: 10, name: 'Post Commander' },
  { number: 11, name: 'Post Captain' },
  { number: 12, name: 'Rear Admiral' },
  { number: 13, name: 'Vice Admiral' },
  { number: 14, name: 'Admiral' },
];

export const federationRanksByRank = new Map<number, FederationRank>(
  federationRanks.map(r => [r.number, r])
);

export const federationRankNames: string[] = federationRanks.map(r => r.name);

