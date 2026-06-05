// Auto-generated from FDevIDs
export interface DockingDeniedReason {
  id: string;
}

export const dockingDeniedReasons: DockingDeniedReason[] = [
  { id: "ActiveFighter" },
  { id: "Distance" },
  { id: "Hostile" },
  { id: "NoSpace" },
  { id: "Offences" },
  { id: "TooLarge" },
  { id: "RestrictedAccess" },
];

export const dockingDeniedReasonsById = new Map<string, DockingDeniedReason>(
  dockingDeniedReasons.map((r) => [r.id, r]),
);
