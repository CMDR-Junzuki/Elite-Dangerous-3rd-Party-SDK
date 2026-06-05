let nextId = 1;
function genId(): string {
  return `col-${nextId++}-${Date.now().toString(36)}`;
}

/** State of a colony system (mirrors ColonisationConstructionDepot event). */
export enum ColonyState {
  None = 0,
  Claimed = 1,
  BeaconPlaced = 2,
  PrimaryPortBuilding = 3,
  Active = 4,
  Failed = 5,
}

export const COLONY_STATE_NAMES: Record<ColonyState, string> = {
  [ColonyState.None]: "None",
  [ColonyState.Claimed]: "Claimed",
  [ColonyState.BeaconPlaced]: "Beacon Placed",
  [ColonyState.PrimaryPortBuilding]: "Primary Port Building",
  [ColonyState.Active]: "Active",
  [ColonyState.Failed]: "Failed",
};

/** A single resource required for a construction site. */
export interface ConstructionResource {
  name: string;
  nameLocalised: string;
  requiredAmount: number;
  providedAmount: number;
  payment: number;
}

/** A construction site (station/port being built). */
export interface ConstructionSite {
  id: string;
  marketId: number;
  primaryPort: boolean;
  constructionProgress: number;
  constructionComplete: boolean;
  constructionFailed: boolean;
  resourcesRequired: ConstructionResource[];
  type?: string;
  name?: string;
}

/** A colonised star system with one or more construction sites. */
export interface ColonySystem {
  systemName: string;
  architect: string;
  state: ColonyState;
  primaryPortId?: number;
  primaryPortType?: string;
  constructionSites: ConstructionSite[];
  claimedAt?: string;
  completedStructures: number;
  totalSlots: number;
}

/** Create a new ConstructionSite for tracking purposes. */
export function createConstructionSite(
  marketId: number,
  primaryPort: boolean,
): ConstructionSite {
  return {
    id: genId(),
    marketId,
    primaryPort,
    constructionProgress: 0,
    constructionComplete: false,
    constructionFailed: false,
    resourcesRequired: [],
  };
}

/** Calculate how much more of a resource is needed. Never negative. */
export function getResourceShortfall(resource: ConstructionResource): number {
  return Math.max(0, resource.requiredAmount - resource.providedAmount);
}

/** Calculate total construction progress as provided/required ratio. */
export function getTotalProgress(site: ConstructionSite): number {
  if (site.resourcesRequired.length === 0) return site.constructionProgress;
  const totalRequired = site.resourcesRequired.reduce(
    (s, r) => s + r.requiredAmount,
    0,
  );
  if (totalRequired === 0) return site.constructionProgress;
  const totalProvided = site.resourcesRequired.reduce(
    (s, r) => s + r.providedAmount,
    0,
  );
  return totalProvided / totalRequired;
}

/** Parse a ColonisationConstructionDepot journal event into a ConstructionSite. */
export function parseColonisationConstructionDepot(event: {
  MarketID: number;
  ConstructionProgress: number;
  ConstructionComplete: boolean;
  ConstructionFailed?: boolean;
  ResourcesRequired?: Array<{
    Name: string;
    Name_Localised?: string;
    RequiredAmount: number;
    ProvidedAmount: number;
    Payment: number;
  }>;
}): ConstructionSite {
  return {
    id: genId(),
    marketId: event.MarketID,
    primaryPort: false,
    constructionProgress: event.ConstructionProgress,
    constructionComplete: event.ConstructionComplete,
    constructionFailed: event.ConstructionFailed ?? false,
    resourcesRequired: (event.ResourcesRequired ?? []).map((r) => ({
      name: r.Name,
      nameLocalised: r.Name_Localised ?? r.Name,
      requiredAmount: r.RequiredAmount,
      providedAmount: r.ProvidedAmount,
      payment: r.Payment,
    })),
  };
}
