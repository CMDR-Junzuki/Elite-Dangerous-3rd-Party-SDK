import { shipsByName } from "./generated/coriolis/ships.js";
import { commoditiesBySymbol } from "./generated/fdevids/commodity.js";
import { engineers } from "./generated/fdevids/engineers.js";
import {
  materialsById,
  materialsBySymbol,
} from "./generated/fdevids/material.js";
import {
  microresourcesById,
  microresourcesBySymbol,
} from "./generated/fdevids/microresources.js";
import { outfittingsById } from "./generated/fdevids/outfitting.js";
import { shipyardsById } from "./generated/fdevids/shipyard.js";
import {
  getCommodityBySymbol,
  getEngineerByEdId,
  getModuleByEdId,
  getShipByEdId,
} from "./lookups.js";

export {
  getCommodityBySymbol,
  getEngineerByEdId,
  getModuleByEdId,
  getShipByEdId,
};

export function resolveModule(edId: number) {
  return getModuleByEdId(edId);
}

export function resolveShip(edId: number) {
  return getShipByEdId(edId);
}

export function resolveShipByName(name: string) {
  const lower = name.toLowerCase();
  for (const [key, ship] of shipsByName) {
    if (key.toLowerCase() === lower) return ship;
  }
  return null;
}

export function resolveCommodity(symbol: string) {
  const exact = getCommodityBySymbol(symbol);
  if (exact) return exact;
  const lower = symbol.toLowerCase();
  for (const [key, com] of commoditiesBySymbol) {
    if (key.toLowerCase() === lower) return com;
  }
  return null;
}

export function resolveEngineer(edId: number) {
  return getEngineerByEdId(edId);
}

export function resolveEngineerByName(name: string) {
  return (
    engineers.find((e) => e.name.toLowerCase() === name.toLowerCase()) ?? null
  );
}

export function resolveMaterial(edId: number) {
  return materialsById.get(edId) ?? null;
}

export function resolveMaterialBySymbol(symbol: string) {
  return materialsBySymbol.get(symbol) ?? null;
}

export function resolveMicroresource(edId: number) {
  return microresourcesById.get(edId) ?? null;
}

export function resolveMicroresourceBySymbol(symbol: string) {
  return microresourcesBySymbol.get(symbol) ?? null;
}

export function resolveOutfitting(edId: number) {
  return outfittingsById.get(edId) ?? null;
}

export function resolveShipyard(edId: number) {
  return shipyardsById.get(edId) ?? null;
}
