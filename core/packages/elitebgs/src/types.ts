/** Paginated response from EliteBGS V5 API */
export interface PaginatedResponse<T> {
  docs: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

/** BGS game tick */
export interface TickTime {
  _id: string;
  time: string;
  updated_at: string;
  __v: number;
}

/** A faction's presence in a specific system */
export interface FactionPresence {
  system_name: string;
  system_name_lower: string;
  system_id: string;
  influence: number;
  state: string;
  state_lower: string;
  happiness?: string;
  happiness_lower?: string;
  active_states: StateEntry[];
  pending_states: StateEntry[];
  recovering_states: StateEntry[];
  updated_at: string;
}

export interface StateEntry {
  state: string;
  state_lower: string;
}

/** Conflict entry within a system */
export interface ConflictEntry {
  status: string;
  faction1: {
    name: string;
    name_lower: string;
    stake: string;
    stake_lower: string;
    days_won: number;
  };
  faction2: {
    name: string;
    name_lower: string;
    stake: string;
    stake_lower: string;
    days_won: number;
  };
  conflict_type: string;
}

/** System data from EliteBGS */
export interface EBGSSystem {
  _id: string;
  eddb_id?: number;
  name: string;
  name_lower: string;
  x: number;
  y: number;
  z: number;
  population?: number;
  allegiance?: string;
  government?: string;
  state?: string;
  security?: string;
  primary_economy?: string;
  secondary_economy?: string;
  needs_permit?: boolean;
  controlling_minor_faction?: string;
  controlling_minor_faction_lower?: string;
  factions: FactionPresence[];
  conflicts: ConflictEntry[];
  updated_at: string;
}

/** Faction data from EliteBGS */
export interface EBGSFaction {
  _id: string;
  eddb_id?: number;
  name: string;
  name_lower: string;
  allegiance?: string;
  government?: string;
  updated_at: string;
  faction_presence: FactionPresence[];
}

/** Station data from EliteBGS */
export interface EBGSStation {
  _id: string;
  eddb_id?: number;
  name: string;
  name_lower: string;
  type?: string;
  system_name: string;
  system_name_lower: string;
  system_id: string;
  economy?: string;
  allegiance?: string;
  government?: string;
  state?: string;
  updated_at: string;
}

/** Query params for /systems */
export interface SystemsQuery {
  id?: string | string[];
  eddbId?: number | number[];
  name?: string | string[];
  allegiance?: string | string[];
  government?: string | string[];
  state?: string | string[];
  primaryEconomy?: string | string[];
  secondaryEconomy?: string | string[];
  faction?: string | string[];
  factionId?: string | string[];
  factionControl?: boolean;
  security?: string | string[];
  activeState?: string | string[];
  pendingState?: string | string[];
  recoveringState?: string | string[];
  influenceGT?: number;
  influenceLT?: number;
  factionAllegiance?: string | string[];
  factionGovernment?: string | string[];
  referenceSystem?: string;
  referenceSystemId?: string;
  referenceDistance?: number;
  referenceDistanceMin?: number;
  sphere?: boolean;
  beginsWith?: string;
  minimal?: boolean;
  factionDetails?: boolean;
  factionHistory?: boolean;
  timeMin?: number;
  timeMax?: number;
  count?: number;
  page?: number;
}

/** Query params for /factions */
export interface FactionsQuery {
  id?: string | string[];
  eddbId?: number | number[];
  name?: string | string[];
  allegiance?: string | string[];
  government?: string | string[];
  beginsWith?: string;
  system?: string | string[];
  systemId?: string | string[];
  filterSystemInHistory?: boolean;
  activeState?: string | string[];
  pendingState?: string | string[];
  recoveringState?: string | string[];
  influenceGT?: number;
  influenceLT?: number;
  minimal?: boolean;
  systemDetails?: boolean;
  timeMin?: number;
  timeMax?: number;
  count?: number;
  page?: number;
}

/** Query params for /stations */
export interface StationsQuery {
  id?: string | string[];
  eddbId?: number | number[];
  name?: string | string[];
  type?: string | string[];
  system?: string | string[];
  systemId?: string | string[];
  economy?: string | string[];
  allegiance?: string | string[];
  government?: string | string[];
  state?: string | string[];
  beginsWith?: string;
  timeMin?: number;
  timeMax?: number;
  count?: number;
  page?: number;
}

/** Query params for /ticks */
export interface TicksQuery {
  timeMin?: number;
  timeMax?: number;
}
