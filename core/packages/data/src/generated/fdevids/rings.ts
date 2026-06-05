// Auto-generated from FDevIDs
export interface Ring {
  id: string;
  name: string;
}

export const rings: Ring[] = [
  { id: "eRingClass_Icy", name: "Icy" },
  { id: "eRingClass_Metalic", name: "Metallic" },
  { id: "eRingClass_MetalRich", name: "Metal Rich" },
  { id: "eRingClass_Rocky", name: "Rocky" },
];

export const ringsById = new Map<string, Ring>(rings.map((r) => [r.id, r]));
