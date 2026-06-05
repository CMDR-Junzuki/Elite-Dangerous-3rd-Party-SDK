/**
 * Spansh API Client for Elite Dangerous
 *
 * Endpoints:
 *   GET  /api/system/<id64>                  - System data
 *   GET  /api/station/<market_id>            - Station data
 *   GET  /api/body/<body_id64>               - Body data
 *   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead
 *   GET  /api/search?q=<query>               - Quick search
 *   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations
 *   POST /api/stations/search                - Station search with filters
 *
 *
 * Route planning:
 *   POST /api/route                        - Plot route between systems
 *   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type
 *
 * Community docs: https://github.com/EDCD/EDDI/issues/2327
 * Route docs: https://spansh.co.uk/api/route
 */

export const SPANSH_BASE = "https://spansh.co.uk";

export interface SystemDetail {
  name: string;
  id64: number;
  x: number;
  y: number;
  z: number;
  population?: number;
  allegiance?: string;
  government?: string;
  economy?: string;
  security?: string;
  controlling_minor_faction?: string;
  bodies?: Array<{
    name: string;
    id64: number;
    bodyId: number;
    type: string;
    subType: string;
    distanceToArrival: number;
    isLandable?: boolean;
  }>;
  stations?: Array<{
    name: string;
    market_id: number;
    type: string;
    distanceToArrival: number;
  }>;
}

export interface StationDetail {
  name: string;
  market_id: number;
  type: string;
  system_name: string;
  system_id64: number;
  system_x: number;
  system_y: number;
  system_z: number;
  distanceToArrival: number;
  allegiance?: string;
  government?: string;
  economy?: string;
  services?: string[];
  ships?: string[];
  modules?: string[];
  market?: Array<{
    name: string;
    buyPrice: number;
    sellPrice: number;
    meanPrice: number;
    stock: number;
    demand: number;
    stockBracket: number;
    demandBracket: number;
  }>;
}

export interface StationSearchRequest {
  filters?: Record<string, { value: unknown[] }>;
  sort?: Array<Record<string, { direction: "asc" | "desc" }>>;
  size?: number;
  page?: number;
  reference_coords?: { x: number; y: number; z: number };
  reference_system?: string;
}

export interface StationSearchResponse {
  count: number;
  from: number;
  results: StationDetail[];
  search: StationSearchRequest;
  search_reference: string;
  size: number;
}

export interface CommodityLocation {
  system_name: string;
  station_name: string;
  station_type: string;
  buyPrice: number;
  sellPrice: number;
  distance: number;
  stock: number;
  demand: number;
}

export interface RouteRequest {
  from: string;
  to: string;
  range?: number;
  efficiency?: number;
}

export interface RouteJump {
  system: string;
  system_id64: number;
  distance: number;
  jump: number;
  fuel_used: number;
  neutron: boolean;
}

export interface RouteResult {
  jumps: RouteJump[];
  distance: number;
  total_jumps: number;
  total_distance: number;
  efficiency: number;
  range: number;
}

export interface NearestResult {
  system: string;
  station?: string;
  distance: number;
  distance_from_reference: number;
  type: string;
  system_id64: number;
  station_id64?: number;
}

export class SpanshClient {
  private base: string;

  constructor(base?: string) {
    this.base = base ?? SPANSH_BASE;
  }

  private async get<T>(path: string): Promise<T> {
    const url = `${this.base}${path}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Spansh ${path}: ${resp.status} ${await resp.text()}`);
    }
    return resp.json() as Promise<T>;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const url = `${this.base}${path}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      throw new Error(`Spansh ${path}: ${resp.status} ${await resp.text()}`);
    }
    return resp.json() as Promise<T>;
  }

  /**
   * Get system details by system address (id64)
   */
  async getSystem(systemId64: number): Promise<SystemDetail> {
    return this.get<SystemDetail>(`/api/system/${systemId64}`);
  }

  /**
   * Get station details by market ID
   */
  async getStation(marketId: number): Promise<StationDetail> {
    return this.get<StationDetail>(`/api/station/${marketId}`);
  }

  /**
   * Get body details by body id64
   * Body id64 = (bodyId << 55) + systemAddress
   */
  async getBody(bodyId64: number): Promise<Record<string, unknown>> {
    return this.get<Record<string, unknown>>(`/api/body/${bodyId64}`);
  }

  /**
   * Quick search across systems, stations, and bodies
   */
  async search(query: string): Promise<{
    systems?: SystemDetail[];
    stations?: StationDetail[];
    bodies?: Record<string, unknown>[];
  }> {
    return this.get(`/api/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Type-ahead for system names
   */
  async searchSystemNames(query: string): Promise<string[]> {
    const resp = await this.get<string[]>(
      `/api/systems/field_values/system_names?q=${encodeURIComponent(query)}`,
    );
    return resp;
  }

  /**
   * Get commodity buy/sell locations
   */
  async getCommodityLocations(
    type: "buy" | "sell",
    referenceSystem: string,
    commodity: string,
    amount: number,
  ): Promise<CommodityLocation[]> {
    return this.get<CommodityLocation[]>(
      `/api/commodity/${type}/${encodeURIComponent(referenceSystem)}/${encodeURIComponent(commodity)}/${amount}`,
    );
  }

  /**
   * Advanced station search with filters
   */
  async searchStations(
    request: StationSearchRequest,
  ): Promise<StationSearchResponse> {
    return this.post<StationSearchResponse>("/api/stations/search", request);
  }

  /**
   * Get all data for a system via the dump endpoint
   */
  async dumpSystem(systemId64: number): Promise<SystemDetail> {
    return this.get<SystemDetail>(`/api/dump/${systemId64}`);
  }

  /**
   * Get faction autocomplete values
   */
  async searchFactions(query: string): Promise<string[]> {
    return this.get<string[]>(
      `/api/systems/field_values/minor_factions?q=${encodeURIComponent(query)}`,
    );
  }

  /**
   * Get all controlling minor factions
   */
  async getControllingFactions(): Promise<string[]> {
    return this.get<string[]>(
      "/api/systems/field_values/controlling_minor_faction",
    );
  }

  /**
   * Plot a route between two systems (neutron-boosted or standard)
   */
  async getRoute(request: RouteRequest): Promise<RouteResult> {
    return this.post<RouteResult>("/api/route", request);
  }

  /**
   * Find the nearest POI of a given type to a system
   */
  async getNearest(system: string, type: string): Promise<NearestResult[]> {
    return this.get<NearestResult[]>(
      `/api/nearest?system=${encodeURIComponent(system)}&type=${encodeURIComponent(type)}`,
    );
  }
}
