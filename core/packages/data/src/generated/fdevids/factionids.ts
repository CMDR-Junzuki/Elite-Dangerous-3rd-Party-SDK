// Auto-generated from FDevIDs
export interface FactionId {
  id: string;
  name: string;
}

export const factionIds: FactionId[] = [
  { id: '$faction_Alliance;', name: 'Alliance' },
  { id: '$faction_Empire;', name: 'Empire' },
  { id: '$faction_Federation;', name: 'Federation' },
  { id: '$faction_Independent;', name: 'Independent' },
  { id: '$faction_none;', name: 'None' },
  { id: '$faction_Pirate;', name: 'Pirate' },
  { id: '$faction_Thargoid;', name: 'Thargoid' },
  { id: '$faction_FrontlineSolutions;', name: 'Frontline Solutions' },
];

export const factionIdsById = new Map<string, FactionId>(
  factionIds.map(r => [r.id, r])
);

