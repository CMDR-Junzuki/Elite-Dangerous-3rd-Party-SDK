// Auto-generated from FDevIDs
export interface Economy {
  id: string;
  name: string;
}

export const economies: Economy[] = [
  { id: "$economy_Agri;", name: "Agriculture" },
  { id: "$economy_Colony;", name: "Colony" },
  { id: "$economy_Extraction;", name: "Extraction" },
  { id: "$economy_HighTech;", name: "High Tech" },
  { id: "$economy_Industrial;", name: "Industrial" },
  { id: "$economy_Military;", name: "Military" },
  { id: "$economy_None;", name: "None" },
  { id: "$economy_Refinery;", name: "Refinery" },
  { id: "$economy_Service;", name: "Service" },
  { id: "$economy_Terraforming;", name: "Terraforming" },
  { id: "$economy_Tourism;", name: "Tourism" },
  { id: "$economy_Prison;", name: "Prison" },
  { id: "$economy_Damaged;", name: "Damaged" },
  { id: "$economy_Rescue;", name: "Rescue" },
  { id: "$economy_Repair;", name: "Repair" },
  { id: "$economy_Carrier;", name: "Private Enterprise" },
  { id: "$economy_Engineer;", name: "Engineering" },
];

export const economiesById = new Map<string, Economy>(
  economies.map((r) => [r.id, r]),
);
