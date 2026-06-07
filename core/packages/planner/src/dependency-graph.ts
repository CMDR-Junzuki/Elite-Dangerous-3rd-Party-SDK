import { materials } from "@elite-dangerous-sdk/data";
import {
  type EngineeringPlan,
  type PlannedModification,
  planEngineering,
} from "./engineering-planner.js";
import { MATERIAL_CATEGORIES, type MaterialInventory } from "./material.js";

export interface MaterialRequirement {
  name: string;
  category: string;
  grade: number;
  needed: number;
  available: number;
  missing: number;
}

export interface TradeUpOption {
  fromMaterial: string;
  fromCategory: string;
  fromGrade: number;
  fromQuantityNeeded: number;
  ratio: number;
  availableInInventory: number;
  feasible: boolean;
}

export interface MissingMaterial extends MaterialRequirement {
  tradeUps: TradeUpOption[];
  canTradeUp: boolean;
}

export interface BuildEvaluation {
  plan: EngineeringPlan;
  inventory: MaterialInventory | null;
  requirements: MaterialRequirement[];
  missing: MissingMaterial[];
  canCraftAll: boolean;
  canCraftWithTrades: boolean;
  totalMaterialsNeeded: number;
  totalMissing: number;
  engineers: string[];
}

/** Map of material name -> { category, grade } */
function buildMaterialMeta(): Record<
  string,
  { category: string; grade: number }
> {
  const meta: Record<string, { category: string; grade: number }> = {};
  for (const m of materials) {
    meta[m.name] = {
      category: (m as any).type?.toLowerCase?.() ?? "raw",
      grade: (m as any).rarity ?? 1,
    };
  }
  return meta;
}

const materialMeta = buildMaterialMeta();

/** Get category and grade for a material name. Falls back to searching inventory. */
function getMaterialInfo(
  name: string,
  inventory?: MaterialInventory | null,
): { category: string; grade: number } {
  const known = materialMeta[name];
  if (known) return known;
  if (inventory) {
    const entry = inventory.materials.find((m) => m.name === name);
    if (entry) return { category: entry.category, grade: entry.grade };
  }
  return { category: "manufactured", grade: 3 };
}

/**
 * Compute material trader trade ratio:
 * For same-category: 6^max(1, gradeDiff) lower-grade units → 1 higher-grade unit
 * Same grade = 6:1, 1 apart = 6:1, 2 apart = 36:1, 3 apart = 216:1, 4 apart = 1296:1
 */
export function tradeRatio(fromGrade: number, toGrade: number): number {
  const diff = Math.abs(toGrade - fromGrade);
  return 6 ** Math.max(1, diff);
}

/**
 * Evaluate a planned build against an optional inventory.
 * Returns requirements, missing materials, and trade-up possibilities.
 */
export function evaluateBuild(
  modifications: PlannedModification[],
  inventory?: MaterialInventory | null,
): BuildEvaluation {
  const plan = planEngineering(modifications);
  const requirements: MaterialRequirement[] = [];
  const missing: MissingMaterial[] = [];
  let canCraftAll = true;
  let totalMaterialsNeeded = 0;
  let totalMissing = 0;

  for (const [matName, needed] of Object.entries(plan.materialTotal)) {
    const info = getMaterialInfo(matName, inventory);
    const entry = inventory?.materials.find((m) => m.name === matName);
    const available = entry?.count ?? 0;
    const missing_qty = Math.max(0, needed - available);
    totalMaterialsNeeded += needed;

    const req: MaterialRequirement = {
      name: matName,
      category: info.category,
      grade: info.grade,
      needed,
      available,
      missing: missing_qty,
    };
    requirements.push(req);

    if (missing_qty > 0) {
      canCraftAll = false;
      totalMissing += missing_qty;

      const tradeUps = computeTradeUps(
        matName,
        info.category,
        info.grade,
        missing_qty,
        inventory,
      );
      missing.push({
        ...req,
        tradeUps,
        canTradeUp: tradeUps.some((t) => t.feasible),
      });
    }
  }

  const canCraftWithTrades = missing.every((m) => m.canTradeUp);

  return {
    plan,
    inventory: inventory ?? null,
    requirements,
    missing,
    canCraftAll,
    canCraftWithTrades,
    totalMaterialsNeeded,
    totalMissing,
    engineers: plan.engineers,
  };
}

/**
 * Compute trade-up options for a missing material.
 * Finds lower-grade materials in the same category from inventory
 * that could be traded up to cover the gap.
 */
function computeTradeUps(
  targetName: string,
  targetCategory: string,
  targetGrade: number,
  missingQty: number,
  inventory?: MaterialInventory | null,
): TradeUpOption[] {
  if (!inventory) return [];

  const sameCategory = inventory.materials.filter(
    (m) =>
      m.category === targetCategory && m.grade <= targetGrade && m.count > 0,
  );

  const options: TradeUpOption[] = [];

  for (const source of sameCategory) {
    const ratio = tradeRatio(source.grade, targetGrade);
    const fromQty = ratio * missingQty;
    options.push({
      fromMaterial: source.name,
      fromCategory: source.category,
      fromGrade: source.grade,
      fromQuantityNeeded: fromQty,
      ratio,
      availableInInventory: source.count,
      feasible: source.count >= fromQty,
    });
  }

  options.sort((a, b) => {
    if (a.feasible !== b.feasible) return a.feasible ? -1 : 1;
    return a.fromQuantityNeeded - b.fromQuantityNeeded;
  });

  return options;
}
