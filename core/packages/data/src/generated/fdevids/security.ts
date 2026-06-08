// Auto-generated from FDevIDs
export interface Security {
  id: string;
  name: string;
}

export const securities: Security[] = [
  { id: '$GAlAXY_MAP_INFO_state_anarchy;', name: 'Anarchy' },
  { id: '$GALAXY_MAP_INFO_state_lawless;', name: 'Lawless' },
  { id: '$SYSTEM_SECURITY_high;', name: 'High' },
  { id: '$SYSTEM_SECURITY_low;', name: 'Low' },
  { id: '$SYSTEM_SECURITY_medium;', name: 'Medium' },
];

export const securitiesById = new Map<string, Security>(
  securities.map(r => [r.id, r])
);

