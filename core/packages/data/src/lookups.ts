import {
  type HardpointModule,
  hardpointModulesByEdId,
  type InternalModule,
  internalModulesByEdId,
  type StandardModule,
  standardModulesByEdId,
} from "./generated/coriolis";
import { shipsByEdId } from "./generated/coriolis/ships";
import { commoditiesBySymbol } from "./generated/fdevids/commodity";
import { engineers } from "./generated/fdevids/engineers";

type AnyModule = HardpointModule | InternalModule | StandardModule;

function mergeMaps<K, V>(...maps: Map<K, V>[]): Map<K, V> {
  const result = new Map<K, V>();
  for (const map of maps) {
    for (const [k, v] of map) {
      result.set(k, v);
    }
  }
  return result;
}

const allModulesByEdId = mergeMaps<number | null, AnyModule>(
  hardpointModulesByEdId as Map<number | null, AnyModule>,
  internalModulesByEdId as Map<number | null, AnyModule>,
  standardModulesByEdId as Map<number | null, AnyModule>,
);

export function getModuleByEdId(edId: number) {
  return allModulesByEdId.get(edId) ?? null;
}

export function getShipByEdId(edId: number) {
  return shipsByEdId.get(edId) ?? null;
}

export function getCommodityBySymbol(symbol: string) {
  return commoditiesBySymbol.get(symbol) ?? null;
}

export function getEngineerByEdId(edId: number) {
  return engineers.find((e) => e.id === edId) ?? null;
}
