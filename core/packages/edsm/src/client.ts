/**
 * EDSM (Elite Dangerous Star Map) API Client
 *
 * API docs: https://www.edsm.net/en/api-v1
 * System API: https://www.edsm.net/en/api-system-v1
 * Community API: https://www.edsm.net/en/api-community-v1
 */

export const EDSM_BASE = "https://www.edsm.net";

export interface EDSMConfig {
  apiKey?: string;
  commanderName?: string;
}

export interface SystemResponse {
  name: string;
  id: number;
  coords?: { x: number; y: number; z: number };
  requirePermit?: boolean;
  permitName?: string;
  information?: Record<string, unknown>;
  primaryStar?: string;
  hidden_at?: string;
  mergedTo?: number | string;
  duplicates?: Array<{ id: number; name: string }>;
}

export interface BodyInfo {
  id: number;
  name: string;
  type: "Star" | "Planet";
  subType: string;
  distanceToArrival: number;
  isMainStar?: boolean;
  isScoopable?: boolean;
  age?: number;
  luminosity?: string;
  absoluteMagnitude?: number;
  solarMasses?: number;
  solarRadius?: number;
  surfaceTemperature?: number;
  orbitalPeriod?: number;
  semiMajorAxis?: number;
  orbitalEccentricity?: number | null;
  orbitalInclination?: number;
  argOfPeriapsis?: number;
  rotationalPeriod?: number;
  rotationalPeriodTidallyLocked?: boolean;
  axialTilt?: number;
  isLandable?: boolean;
  gravity?: number;
  earthMasses?: number;
  radius?: number;
  volcanismType?: string;
  atmosphereType?: string;
  terraformingState?: string;
  rings?: Array<{
    name: string;
    type: string;
    mass: number;
    innerRadius: number;
    outerRadius: number;
  }>;
  materials?: Record<string, number>;
}

export interface StationInfo {
  id: number;
  name: string;
  type: string;
  distanceToArrival: number;
  allegiance?: string;
  government?: string;
  economy?: string;
  haveMarket?: boolean;
  haveShipyard?: boolean;
  haveOutfitting?: boolean;
  otherServices?: string[];
  market?: MarketData;
  shipyard?: ShipyardData;
  outfitting?: OutfittingData;
}

export interface MarketData {
  id: number;
  name: string;
  items: Array<{
    name: string;
    sellPrice: number;
    buyPrice: number;
    stock: number;
    demand: number;
    stockBracket: number;
    demandBracket: number;
  }>;
}

export interface ShipyardData {
  id: number;
  name: string;
  ships: Array<{
    name: string;
    value: number;
  }>;
}

export interface OutfittingData {
  id: number;
  name: string;
  modules: Array<{
    name: string;
    buyPrice: number;
  }>;
}

export interface EstimatedValue {
  estimatedValue: number;
  mappedValue: number;
  details: Array<{
    bodyName: string;
    estimatedValue: number;
    mappedValue: number;
  }>;
}

export interface FactionInfo {
  id: number;
  name: string;
  allegiance: string;
  government: string;
  influence: number;
  state: string;
  activeStates?: Array<{ state: string; trend?: number }>;
  pendingStates?: Array<{ state: string; trend?: number }>;
}

export interface CommanderRanksResponse {
  msgnum: number;
  msg: string;
  ranks: Record<string, number>;
  progress: Record<string, number>;
  ranksVerbose: Record<string, { rank: number; rankName: string }>;
}

export interface CommanderLogEntry {
  shipId: number;
  system: string;
  systemId: number;
  date: string;
}

export interface CommanderLogsResponse {
  msgnum: number;
  msg: string;
  startDateTime: string;
  endDateTime: string;
  logs: CommanderLogEntry[];
}

export interface SubmitJournalData {
  fromSoftware: string;
  fromSoftwareVersion: string;
  message: string | string[];
  fromGameVersion?: string;
  fromGameBuild?: string;
}

export interface JournalSubmitResponse {
  msgnum: number;
  msg: string;
}

export class EDSMClient {
  private config: EDSMConfig;

  constructor(config: EDSMConfig = {}) {
    this.config = config;
  }

  private async get<T>(
    path: string,
    params: Record<string, string | number> = {},
  ): Promise<T> {
    const url = new URL(path, EDSM_BASE);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
    if (this.config.apiKey) {
      url.searchParams.set("apiKey", this.config.apiKey);
    }
    if (this.config.commanderName) {
      url.searchParams.set("commanderName", this.config.commanderName);
    }

    const resp = await fetch(url.toString());
    if (!resp.ok) {
      throw new Error(`EDSM ${path}: ${resp.status} ${await resp.text()}`);
    }
    return resp.json() as Promise<T>;
  }

  private async post<T>(
    path: string,
    body: Record<string, string | number> = {},
  ): Promise<T> {
    const url = new URL(path, EDSM_BASE);
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    if (this.config.apiKey) {
      params.set("apiKey", this.config.apiKey);
    }
    if (this.config.commanderName) {
      params.set("commanderName", this.config.commanderName);
    }

    const resp = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!resp.ok) {
      throw new Error(`EDSM ${path}: ${resp.status} ${await resp.text()}`);
    }
    return resp.json() as Promise<T>;
  }

  // === System API v1 ===

  private static boolOpts(
    opts: Record<string, boolean | undefined>,
  ): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [k, v] of Object.entries(opts)) {
      if (v !== undefined) result[k] = v ? 1 : 0;
    }
    return result;
  }

  async getSystem(
    systemName: string,
    options?: {
      showId?: boolean;
      showCoordinates?: boolean;
      showPermit?: boolean;
      showInformation?: boolean;
      showPrimaryStar?: boolean;
    },
  ): Promise<SystemResponse> {
    return this.get<SystemResponse>("/api-v1/system", {
      systemName,
      showId: 1,
      showCoordinates: 1,
      ...EDSMClient.boolOpts(options ?? {}),
    });
  }

  async getSystems(
    systemNames: string[],
    options?: {
      showId?: boolean;
      showCoordinates?: boolean;
      showPermit?: boolean;
      showInformation?: boolean;
      showPrimaryStar?: boolean;
    },
  ): Promise<SystemResponse[]> {
    const params: Record<string, string | number> = {};
    systemNames.forEach((name, i) => {
      params[`systemName[${i}]`] = name;
    });
    return this.get<SystemResponse[]>("/api-v1/systems", {
      ...params,
      showId: 1,
      showCoordinates: 1,
      ...EDSMClient.boolOpts(options ?? {}),
    });
  }

  async getSphereSystems(
    systemName: string,
    radius: number,
    options?: {
      minRadius?: number;
      showId?: boolean;
      showCoordinates?: boolean;
    },
  ): Promise<Array<{ distance: number } & SystemResponse>> {
    const { minRadius, ...boolOpts } = options ?? {};
    return this.get("/api-v1/sphere-systems", {
      systemName,
      radius: Math.min(radius, 100),
      minRadius: minRadius ?? 0,
      showId: 1,
      showCoordinates: 1,
      ...EDSMClient.boolOpts(boolOpts),
    });
  }

  async getCubeSystems(
    systemName: string,
    size: number,
    options?: {
      showId?: boolean;
      showCoordinates?: boolean;
    },
  ): Promise<Array<SystemResponse>> {
    return this.get("/api-v1/cube-systems", {
      systemName,
      size: Math.min(size, 200),
      showId: 1,
      showCoordinates: 1,
      ...EDSMClient.boolOpts(options ?? {}),
    });
  }

  // === System v1 - Bodies ===

  async getSystemBodies(
    systemName: string,
    systemId?: number,
  ): Promise<{
    id: number;
    name: string;
    bodies: BodyInfo[];
  }> {
    return this.get("/api-system-v1/bodies", {
      systemName,
      systemId: systemId ?? 0,
    });
  }

  async getSystemEstimatedValue(
    systemName: string,
    systemId?: number,
  ): Promise<EstimatedValue> {
    return this.get("/api-system-v1/estimated-value", {
      systemName,
      systemId: systemId ?? 0,
    });
  }

  async getSystemStations(
    systemName: string,
    systemId?: number,
  ): Promise<{
    id: number;
    name: string;
    stations: StationInfo[];
  }> {
    return this.get("/api-system-v1/stations", {
      systemName,
      systemId: systemId ?? 0,
    });
  }

  async getSystemFactions(
    systemName: string,
    systemId?: number,
  ): Promise<{
    id: number;
    name: string;
    factions: FactionInfo[];
  }> {
    return this.get("/api-system-v1/factions", {
      systemName,
      systemId: systemId ?? 0,
    });
  }

  async getStationMarket(
    systemName: string,
    stationName: string,
  ): Promise<MarketData> {
    return this.get("/api-system-v1/stations/market", {
      systemName,
      stationName,
    });
  }

  async getStationShipyard(
    systemName: string,
    stationName: string,
  ): Promise<ShipyardData> {
    return this.get("/api-system-v1/stations/shipyard", {
      systemName,
      stationName,
    });
  }

  async getStationOutfitting(
    systemName: string,
    stationName: string,
  ): Promise<OutfittingData> {
    return this.get("/api-system-v1/stations/outfitting", {
      systemName,
      stationName,
    });
  }

  async getSystemTraffic(
    systemName: string,
    systemId?: number,
  ): Promise<{
    id: number;
    name: string;
    traffic: Array<{ month: number; count: number }>;
  }> {
    return this.get("/api-system-v1/traffic", {
      systemName,
      systemId: systemId ?? 0,
    });
  }

  async getSystemDeaths(
    systemName: string,
    systemId?: number,
  ): Promise<{
    id: number;
    name: string;
    deaths: Array<{ month: number; count: number }>;
  }> {
    return this.get("/api-system-v1/deaths", {
      systemName,
      systemId: systemId ?? 0,
    });
  }

  // === Community API v1 ===

  async getCommanderRanks(): Promise<CommanderRanksResponse> {
    return this.get<CommanderRanksResponse>("/api-commander-v1/get-ranks");
  }

  async getCommanderLogs(options?: {
    systemName?: string;
    startDateTime?: string;
    endDateTime?: string;
    showId?: boolean;
  }): Promise<CommanderLogsResponse> {
    return this.get<CommanderLogsResponse>("/api-logs-v1/get-logs", {
      ...(options?.showId !== undefined
        ? { showId: options.showId ? 1 : 0 }
        : {}),
    });
  }

  async submitJournal(data: SubmitJournalData): Promise<JournalSubmitResponse> {
    const body: Record<string, string | number> = {
      fromSoftware: data.fromSoftware,
      fromSoftwareVersion: data.fromSoftwareVersion,
    };
    if (data.fromGameVersion) body.fromGameVersion = data.fromGameVersion;
    if (data.fromGameBuild) body.fromGameBuild = data.fromGameBuild;
    if (Array.isArray(data.message)) {
      data.message.forEach((msg, i) => {
        body[`message[${i}]`] = msg;
      });
    } else {
      body.message = data.message;
    }
    return this.post<JournalSubmitResponse>("/api-journal-v1", body);
  }

  async getDiscardEvents(): Promise<string[]> {
    return this.get<string[]>("/api-journal-v1/discard");
  }
}
