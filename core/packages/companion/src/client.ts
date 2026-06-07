import { listify } from "@elite-dangerous-sdk/utils";
import type { FrontierAuth } from "./auth.js";

/**
 * CAPI endpoints:
 * - /profile          -> Commander profile (ships, cargo, location)
 * - /market           -> Station commodity market
 * - /shipyard         -> Station shipyard + outfitting
 * - /fleetcarrier     -> Fleet carrier info
 * - /journal          -> Journal log lines
 * - /communitygoals   -> Active community goals
 * - /visitedstars     -> Visited stars cache download
 */

export const LIVE_HOST = "https://companion.orerve.net";
export const LEGACY_HOST = "https://legacy-companion.orerve.net";

export type GalaxyType = "live" | "legacy";

export interface CapClientOptions {
  auth: FrontierAuth;
  galaxy?: GalaxyType;
}

export interface CapShipResponse {
  id: number;
  name: string;
  ship: string;
  shipID: number;
  value?: {
    hull: number;
    modules: number;
    total: number;
  };
  cockpit?: {
    name: string;
    female: boolean;
  };
  modules?: Record<string, Record<string, unknown>>;
}

export interface CapProfileResponse {
  commander?: {
    name: string;
    fid?: string;
    docked?: boolean;
    currentShipId?: number;
    credits?: number;
    debt?: number;
  };
  lastSystem?: {
    name: string;
    systemaddress?: number;
    x?: number;
    y?: number;
    z?: number;
  };
  lastStarport?: {
    name: string;
    marketId?: number;
  };
  ships?: Record<string, CapShipResponse>;
  shipsSRV?: Record<string, unknown>;
  fleetcarrier?: Record<string, unknown>;
}

export interface CapMarketResponse {
  market?: {
    id: number;
    name: string;
    items: Array<{
      id: number;
      name: string;
      buyPrice: number;
      sellPrice: number;
      meanPrice: number;
      stockBracket: number;
      demandBracket: number;
      stock: number;
      demand: number;
      statusFlags: string;
    }>;
  };
  lastSystem?: {
    name: string;
    systemaddress?: number;
  };
  lastStarport?: {
    name: string;
  };
}

export interface CapShipyardResponse {
  lastSystem?: {
    name: string;
    systemaddress?: number;
  };
  lastStarport?: {
    name: string;
  };
  ships?: Array<{
    id: number;
    name: string;
    basevalue: number;
  }>;
  modules?: Array<{
    id: number;
    name: string;
    buyPrice: number;
  }>;
}

export interface CapJournalResponse {
  entries?: string[];
}

export interface CapFleetCarrierResponse {
  id?: number;
  name?: string;
  currentBalance?: number;
  fuelLevel?: number;
  jumpRangeCurr?: number;
  jumpRangeMax?: number;
  pendingJump?: {
    systemName: string;
    systemAddress?: number;
    departureTime?: string;
  };
}

export interface CapCommunityGoal {
  id: number;
  name: string;
  systemName: string;
  stationName: string;
  objective: string;
  total: number;
  contributed: number;
  reward: string;
  expiry: string;
}

export class CompanionClient {
  private auth: FrontierAuth;
  private host: string;

  constructor(options: CapClientOptions) {
    this.auth = options.auth;
    this.host = options.galaxy === "legacy" ? LEGACY_HOST : LIVE_HOST;
  }

  private async request<T>(path: string): Promise<T> {
    const token = await this.auth.getValidToken();
    const url = `${this.host}${path}`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": this.auth.userAgent,
      },
    });

    if (resp.status === 422) {
      // Token expired, try refreshing
      await this.auth.refreshTokens();
      return this.request<T>(path);
    }

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`CAPI ${path} failed: ${resp.status} ${text}`);
    }

    return resp.json() as Promise<T>;
  }

  private async requestBinary(path: string, retries = 5): Promise<ArrayBuffer> {
    const token = await this.auth.getValidToken();
    const url = `${this.host}${path}`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": this.auth.userAgent,
      },
    });

    if (resp.status === 102) {
      if (retries <= 0) {
        throw new Error(
          `CAPI ${path} still processing after retries exhausted`,
        );
      }
      await new Promise((r) => setTimeout(r, 10000));
      return this.requestBinary(path, retries - 1);
    }

    if (resp.status === 422) {
      await this.auth.refreshTokens();
      return this.requestBinary(path, retries);
    }

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`CAPI ${path} failed: ${resp.status} ${text}`);
    }

    return resp.arrayBuffer();
  }

  async getVisitedStars(): Promise<ArrayBuffer> {
    return this.requestBinary("/visitedstars");
  }

  /**
   * Get commander profile including ships, cargo, location
   */
  async getProfile(): Promise<CapProfileResponse> {
    return this.request<CapProfileResponse>("/profile");
  }

  /**
   * Get market data from last docked station
   */
  async getMarket(): Promise<CapMarketResponse> {
    return this.request<CapMarketResponse>("/market");
  }

  /**
   * Get shipyard + outfitting from last docked station
   */
  async getShipyard(): Promise<CapShipyardResponse> {
    return this.request<CapShipyardResponse>("/shipyard");
  }

  /**
   * Get fleet carrier information
   */
  async getFleetCarrier(): Promise<CapFleetCarrierResponse> {
    return this.request<CapFleetCarrierResponse>("/fleetcarrier");
  }

  /**
   * Get journal entries
   */
  async getJournal(
    year?: number,
    month?: number,
    day?: number,
  ): Promise<CapJournalResponse> {
    let path = "/journal";
    if (year) {
      path += `/${year}`;
      if (month) path += `/${month}`;
      if (day) path += `/${day}`;
    }
    return this.request<CapJournalResponse>(path);
  }

  /**
   * Get active community goals
   */
  async getCommunityGoals(): Promise<{
    communitygoals?: CapCommunityGoal[];
  }> {
    return this.request<{
      communitygoals?: CapCommunityGoal[];
    }>("/communitygoals");
  }

  /**
   * Check if commander is docked (use before market/shipyard reads)
   */
  async isDocked(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return profile.commander?.docked ?? false;
    } catch {
      return false;
    }
  }

  /**
   * Get profile with ships converted from sparse object to array.
   * CAPI returns ships as {0: {...}, 2: {...}} instead of [{...}, null, {...}].
   */
  async getProfileShips(): Promise<(CapShipResponse | null)[]> {
    const profile = await this.getProfile();
    return listify(profile.ships);
  }
}
