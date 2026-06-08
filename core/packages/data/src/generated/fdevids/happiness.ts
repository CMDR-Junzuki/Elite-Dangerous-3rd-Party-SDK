// Auto-generated from FDevIDs
export interface Happiness {
  id: string;
  name: string;
}

export const happiness: Happiness[] = [
  { id: '$Faction_HappinessBand1;', name: 'Elated' },
  { id: '$Faction_HappinessBand2;', name: 'Happy' },
  { id: '$Faction_HappinessBand3;', name: 'Discontented' },
  { id: '$Faction_HappinessBand4;', name: 'Unhappy' },
  { id: '$Faction_HappinessBand5;', name: 'Despondent' },
];

export const happinessById = new Map<string, Happiness>(
  happiness.map(r => [r.id, r])
);

