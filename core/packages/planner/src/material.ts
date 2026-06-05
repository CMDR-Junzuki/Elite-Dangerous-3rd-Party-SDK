import { materials, microresources } from "@elite-dangerous-sdk/data";

export interface MaterialEntry {
  name: string;
  edId?: number;
  category: "raw" | "manufactured" | "encoded" | "micro";
  grade: 1 | 2 | 3 | 4 | 5;
  count: number;
  maxCapacity: number;
}

export interface MaterialInventory {
  materials: MaterialEntry[];
  timestamp: Date;
}

export interface BlueprintRequirement {
  materialName: string;
  quantity: number;
  grade: number;
}

export interface BlueprintCost {
  blueprintName: string;
  fdName: string;
  grade: number;
  requirements: BlueprintRequirement[];
}

/** Category names for material types */
export const MATERIAL_CATEGORIES = ["raw", "manufactured", "encoded"] as const;

/** Max materials per grade (all unified to 3000 after Update 14) */
export const MATERIAL_CAPS: Record<number, number> = {
  1: 3000,
  2: 3000,
  3: 3000,
  4: 3000,
  5: 3000,
};

/** Micro-resource (Odyssey) caps (all unified to 3000 after Update 14) */
export const MICRO_RESOURCE_CAPS: Record<number, number> = {
  1: 3000,
  2: 3000,
  3: 3000,
  4: 3000,
  5: 3000,
};

/**
 * Create an empty material inventory.
 */
export function createInventory(): MaterialInventory {
  const mats: MaterialEntry[] = [];

  for (const mat of materials) {
    const type = (mat as any).type ?? "Manufactured";
    const cat = type.toLowerCase() as "raw" | "manufactured" | "encoded";
    const grade = (mat as any).rarity ?? 1;
    mats.push({
      name: mat.name,
      edId: mat.id,
      category: cat,
      grade: grade as any,
      count: 0,
      maxCapacity: MATERIAL_CAPS[grade] ?? 1000,
    });
  }

  for (const mr of microresources) {
    const grade = (mr as any).grade ?? 1;
    mats.push({
      name: mr.english_name,
      edId: mr.id,
      category: "micro",
      grade: grade as any,
      count: 0,
      maxCapacity: MICRO_RESOURCE_CAPS[grade] ?? 1000,
    });
  }

  return { materials: mats, timestamp: new Date() };
}

/**
 * Update inventory from a journal Material event (Materials or MaterialCollected/MaterialDiscarded).
 */
export function updateInventory(
  inventory: MaterialInventory,
  materialName: string,
  change: number,
): MaterialInventory {
  const entry = inventory.materials.find((m) => m.name === materialName);
  if (entry) {
    entry.count = Math.max(
      0,
      Math.min(entry.maxCapacity, entry.count + change),
    );
  }
  return { ...inventory, timestamp: new Date() };
}

/**
 * Check if the inventory has enough materials for a blueprint grade.
 */
export function canCraftBlueprint(
  inventory: MaterialInventory,
  requirements: BlueprintRequirement[],
): {
  canCraft: boolean;
  missing: { materialName: string; have: number; need: number }[];
} {
  const missing: { materialName: string; have: number; need: number }[] = [];
  let canCraft = true;

  for (const req of requirements) {
    const entry = inventory.materials.find((m) => m.name === req.materialName);
    const have = entry?.count ?? 0;
    if (have < req.quantity) {
      canCraft = false;
      missing.push({
        materialName: req.materialName,
        have,
        need: req.quantity,
      });
    }
  }

  return { canCraft, missing };
}
