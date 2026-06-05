import {
  blueprints as blueprintsData,
  moduleBlueprintMappings as bpMappings,
  specials as specialsData,
} from "@elite-dangerous-sdk/data";

export interface PlannedModification {
  moduleGroup: string;
  blueprintName: string;
  grade: number;
  experimentalEffect?: string;
}

export interface MaterialCost {
  material: string;
  quantity: number;
  grade: number;
  source: "blueprint" | "experimental";
}

export interface EngineerVisit {
  engineer: string;
  moduleGroup: string;
  blueprintName: string;
  grade: number;
}

export interface EngineeringPlan {
  materials: MaterialCost[];
  materialTotal: Record<string, number>;
  engineers: string[];
  engineerVisits: EngineerVisit[];
}

export function planEngineering(
  modifications: PlannedModification[],
): EngineeringPlan {
  const materials: MaterialCost[] = [];
  const engineerVisits: EngineerVisit[] = [];
  const engineerSet = new Set<string>();

  for (const mod of modifications) {
    const bp = (blueprintsData as Record<string, any>)[mod.blueprintName];
    const gradeKey = String(mod.grade);
    const gradeData = bp?.grades?.[gradeKey];

    if (gradeData?.components) {
      for (const [mat, qty] of Object.entries(
        gradeData.components as Record<string, number>,
      )) {
        materials.push({
          material: mat,
          quantity: qty,
          grade: mod.grade,
          source: "blueprint",
        });
      }
    }

    if (mod.experimentalEffect) {
      const special = (specialsData as Record<string, any>)[
        mod.experimentalEffect
      ];
      if (special?.components) {
        for (const [mat, qty] of Object.entries(
          special.components as Record<string, number>,
        )) {
          materials.push({
            material: mat,
            quantity: qty,
            grade: 0,
            source: "experimental",
          });
        }
      }
    }

    const mapping = (bpMappings as Record<string, any>)[mod.moduleGroup];
    const bpEntry = mapping?.blueprints?.[mod.blueprintName];
    const engineers = bpEntry?.grades?.[gradeKey]?.engineers as
      | string[]
      | undefined;

    if (engineers) {
      for (const eng of engineers) {
        engineerSet.add(eng);
        engineerVisits.push({
          engineer: eng,
          moduleGroup: mod.moduleGroup,
          blueprintName: mod.blueprintName,
          grade: mod.grade,
        });
      }
    }
  }

  const materialTotal: Record<string, number> = {};
  for (const m of materials) {
    materialTotal[m.material] = (materialTotal[m.material] ?? 0) + m.quantity;
  }

  return {
    materials,
    materialTotal,
    engineers: [...engineerSet].sort(),
    engineerVisits,
  };
}

export function getBlueprintComponents(
  blueprintName: string,
  grade: number,
): MaterialCost[] {
  const bp = (blueprintsData as Record<string, any>)[blueprintName];
  const gradeKey = String(grade);
  const gradeData = bp?.grades?.[gradeKey];
  if (!gradeData?.components) return [];

  return Object.entries(gradeData.components as Record<string, number>).map(
    ([material, quantity]) => ({
      material,
      quantity,
      grade,
      source: "blueprint" as const,
    }),
  );
}

export function getExperimentalEffectComponents(
  effectName: string,
): MaterialCost[] {
  const special = (specialsData as Record<string, any>)[effectName];
  if (!special?.components) return [];

  return Object.entries(special.components as Record<string, number>).map(
    ([material, quantity]) => ({
      material,
      quantity,
      grade: 0,
      source: "experimental" as const,
    }),
  );
}

export function getEngineersForBlueprint(
  moduleGroup: string,
  blueprintName: string,
  grade: number,
): string[] {
  const mapping = (bpMappings as Record<string, any>)[moduleGroup];
  const bpEntry = mapping?.blueprints?.[blueprintName];
  const engineers = bpEntry?.grades?.[String(grade)]?.engineers;
  return engineers ? [...engineers] : [];
}
