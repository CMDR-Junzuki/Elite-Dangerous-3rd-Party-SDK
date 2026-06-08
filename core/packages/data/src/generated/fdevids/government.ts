// Auto-generated from FDevIDs
export interface Government {
  id: string;
  name: string;
}

export const governments: Government[] = [
  { id: '$government_Anarchy;', name: 'Anarchy' },
  { id: '$government_Communism;', name: 'Communism' },
  { id: '$government_Confederacy;', name: 'Confederacy' },
  { id: '$government_Cooperative;', name: 'Cooperative' },
  { id: '$government_Corporate;', name: 'Corporate' },
  { id: '$government_Democracy;', name: 'Democracy' },
  { id: '$government_Dictatorship;', name: 'Dictatorship' },
  { id: '$government_Feudal;', name: 'Feudal' },
  { id: '$government_Imperial;', name: 'Imperial' },
  { id: '$government_None;', name: 'None' },
  { id: '$government_Patronage;', name: 'Patronage' },
  { id: '$government_PrisonColony;', name: 'Prison Colony' },
  { id: '$government_Theocracy;', name: 'Theocracy' },
  { id: '$government_Engineer;', name: 'Engineer' },
  { id: '$government_Carrier;', name: 'Private Ownership' },
  { id: '$government_Prison;', name: 'Prison' },
  { id: '$government_Megaconstruction;', name: 'Megaconstruction' },
];

export const governmentsById = new Map<string, Government>(
  governments.map(r => [r.id, r])
);

