// Auto-generated from FDevIDs
export interface TerraformingState {
  id: string;
  name: string;
}

export const terraformingStates: TerraformingState[] = [
  { id: "Terraformable", name: "Terraformable" },
  { id: "Terraformed", name: "Terraformed" },
  { id: "Terraforming", name: "Terraforming" },
];

export const terraformingStatesById = new Map<string, TerraformingState>(
  terraformingStates.map((r) => [r.id, r]),
);
