import type { ModuleEngineering } from "./loadout.js";

export type StatModType = "percentage" | "numeric" | "object";
export type StatModMethod = "multiplicative" | "additive" | "overwrite";

export interface StatMod {
  id: number;
  name: string;
  type: StatModType;
  method: StatModMethod;
  higherbetter: boolean;
}

export type BlueprintFeatures = Record<string, [number, number]>;

export interface AppliedModification {
  blueprintName: string;
  fdName: string;
  grade: number;
  special?: string;
  changes: Record<
    string,
    {
      originalValue: number;
      modifiedValue: number;
      delta: number;
      pctChange: number;
    }
  >;
}

export interface GradeFeatures {
  components: Record<string, number>;
  features: BlueprintFeatures;
  uuid: string;
}

export interface Blueprint {
  fdname: string;
  name: string;
  id: number;
  modulename: string[];
  grades: Record<string, GradeFeatures>;
}

import {
  blueprints as blueprintsData,
  moduleBlueprintMappings as bpMappings,
  modifications as modificationsData,
  modifierActions as modifierActionsData,
} from "@elite-dangerous-sdk/data";

const modStats = new Map<string, StatMod>();
for (const [key, val] of Object.entries(modificationsData)) {
  modStats.set(key, {
    id: val.id as number,
    name: val.name as string,
    type: val.type as StatModType,
    method: val.method as StatModMethod,
    higherbetter: (val.higherbetter ?? true) as boolean,
  });
}

export function getStatMod(name: string): StatMod | undefined {
  return modStats.get(name);
}

export function applyBlueprintGrade(
  baseStats: Record<string, number>,
  features: BlueprintFeatures,
  grade: number,
  specialFeatures?: BlueprintFeatures,
  rollQuality?: number,
): Record<string, number> {
  const result = { ...baseStats };
  const roll = rollQuality ?? (grade - 1) / 4;

  const allFeatures = { ...features };
  if (specialFeatures) {
    for (const [key, val] of Object.entries(specialFeatures)) {
      if (allFeatures[key]) {
        const existing = allFeatures[key];
        allFeatures[key] = [existing[0] + val[0], existing[1] + val[1]];
      } else {
        allFeatures[key] = val;
      }
    }
  }

  for (const [statName, [minVal, maxVal]] of Object.entries(allFeatures)) {
    const rawValue = result[statName];
    if (rawValue === undefined) continue;

    const statDef = modStats.get(statName);
    if (!statDef) continue;

    const modValue = minVal + (maxVal - minVal) * roll;

    const effectiveModValue =
      statName === "rof" ? 1 / (1 + modValue) - 1 : modValue;

    switch (statDef.method) {
      case "multiplicative":
        if (statName === "shieldboost" || statName === "hullboost") {
          result[statName] = (1 + rawValue) * (1 + effectiveModValue) - 1;
        } else {
          result[statName] = rawValue * (1 + effectiveModValue);
        }
        break;
      case "additive":
        result[statName] = rawValue + effectiveModValue;
        break;
      case "overwrite":
        result[statName] = effectiveModValue;
        break;
    }
  }

  return result;
}

export function computeEngineeringChanges(
  moduleStats: Record<string, number>,
  engineering: ModuleEngineering,
): AppliedModification | null {
  const blueprint = blueprintsData[engineering.blueprintName] as
    | Blueprint
    | undefined;
  if (!blueprint)
    return {
      blueprintName: engineering.blueprintName,
      fdName: engineering.blueprintName,
      grade: engineering.grade,
      changes: {},
    };

  const gradeKey = String(engineering.grade);
  const gradeData = blueprint.grades[gradeKey] as GradeFeatures | undefined;
  if (!gradeData)
    return {
      blueprintName: blueprint.fdname,
      fdName: blueprint.fdname,
      grade: engineering.grade,
      changes: {},
    };

  const changes: Record<
    string,
    {
      originalValue: number;
      modifiedValue: number;
      delta: number;
      pctChange: number;
    }
  > = {};

  const result = applyBlueprintGrade(
    moduleStats,
    gradeData.features,
    engineering.grade,
    undefined,
    1,
  );

  if (engineering.experimentalEffect) {
    const specialMods = modifierActionsData[engineering.experimentalEffect] as
      | Record<string, unknown>
      | undefined;
    if (specialMods) {
      for (const [statName, rawVal] of Object.entries(specialMods)) {
        const val = rawVal as number;
        if (typeof val !== "number") continue;
        if (result[statName] === undefined) continue;

        const statDef = modStats.get(statName);
        if (!statDef) continue;

        const effectiveVal = statName === "rof" ? 1 / (1 + val) - 1 : val;

        switch (statDef.method) {
          case "multiplicative":
            if (statName === "shieldboost" || statName === "hullboost") {
              result[statName] =
                (1 + result[statName]) * (1 + effectiveVal) - 1;
            } else {
              result[statName] = result[statName] * (1 + effectiveVal);
            }
            break;
          case "additive":
            result[statName] = result[statName] + effectiveVal;
            break;
          case "overwrite":
            result[statName] = effectiveVal;
            break;
        }
      }
    }
  }

  for (const [statName, modVal] of Object.entries(result)) {
    const origVal = moduleStats[statName];
    if (origVal === undefined) continue;
    const delta = modVal - origVal;
    changes[statName] = {
      originalValue: origVal,
      modifiedValue: modVal,
      delta,
      pctChange: origVal !== 0 ? delta / origVal : 0,
    };
  }

  return {
    blueprintName: blueprint.fdname,
    fdName: blueprint.fdname,
    grade: engineering.grade,
    special: engineering.experimentalEffect,
    changes,
  };
}

export function getAvailableBlueprints(moduleGroup: string): string[] {
  const mapping = bpMappings[moduleGroup] as
    | { blueprints?: Record<string, unknown> }
    | undefined;
  if (!mapping?.blueprints) return [];
  return Object.keys(mapping.blueprints);
}
