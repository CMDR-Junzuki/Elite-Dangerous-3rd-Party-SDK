/**
 * EliteBGS API V5 Client
 *
 * API docs: https://elitebgs.app/ebgs/
 * Rate limit: 20 requests per minute (shared per IP)
 * Base URL: https://elitebgs.app/api/ebgs/v5
 */

import type {
  EBGSFaction,
  EBGSStation,
  EBGSSystem,
  FactionsQuery,
  PaginatedResponse,
  StationsQuery,
  SystemsQuery,
  TicksQuery,
  TickTime,
} from "./types.js";

export const ELITEBGS_BASE = "https://elitebgs.app/api/ebgs/v5";

export class EliteBGSClient {
  private base: string;
  private lastRequest: number = 0;
  private minIntervalMs: number;

  /**
   * @param base  Base URL (default: https://elitebgs.app/api/ebgs/v5)
   * @param rpm   Max requests per minute (default: 20)
   */
  constructor(base?: string, rpm: number = 20) {
    this.base = base ?? ELITEBGS_BASE;
    this.minIntervalMs = 60_000 / rpm;
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequest;
    if (elapsed < this.minIntervalMs) {
      await new Promise((r) => setTimeout(r, this.minIntervalMs - elapsed));
    }
    this.lastRequest = Date.now();
  }

  private buildQuery(params: Record<string, unknown>): string {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) {
          parts.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`,
          );
        }
      } else {
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
        );
      }
    }
    return parts.length ? `?${parts.join("&")}` : "";
  }

  private async get<T>(path: string): Promise<T> {
    const url = `${this.base}${path}`;
    await this.rateLimit();
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`EliteBGS ${path}: ${resp.status} ${await resp.text()}`);
    }
    return resp.json() as Promise<T>;
  }

  /** GET /systems — search systems with optional filters and history */
  async getSystems(
    query?: SystemsQuery,
  ): Promise<PaginatedResponse<EBGSSystem>> {
    return this.get<PaginatedResponse<EBGSSystem>>(
      `/systems${query ? this.buildQuery(query as Record<string, unknown>) : ""}`,
    );
  }

  /** GET /factions — search factions with optional filters and history */
  async getFactions(
    query?: FactionsQuery,
  ): Promise<PaginatedResponse<EBGSFaction>> {
    return this.get<PaginatedResponse<EBGSFaction>>(
      `/factions${query ? this.buildQuery(query as Record<string, unknown>) : ""}`,
    );
  }

  /** GET /stations — search stations with optional filters and history */
  async getStations(
    query?: StationsQuery,
  ): Promise<PaginatedResponse<EBGSStation>> {
    return this.get<PaginatedResponse<EBGSStation>>(
      `/stations${query ? this.buildQuery(query as Record<string, unknown>) : ""}`,
    );
  }

  /** GET /ticks — get BGS tick times */
  async getTicks(query?: TicksQuery): Promise<TickTime[]> {
    return this.get<TickTime[]>(
      `/ticks${query ? this.buildQuery(query as Record<string, unknown>) : ""}`,
    );
  }

  /** Convenience: get system by exact name (first page) */
  async getSystemByName(name: string): Promise<PaginatedResponse<EBGSSystem>> {
    return this.getSystems({ name, page: 1 });
  }

  /** Convenience: get faction by exact name (first page) */
  async getFactionByName(
    name: string,
  ): Promise<PaginatedResponse<EBGSFaction>> {
    return this.getFactions({ name, page: 1 });
  }

  /** Convenience: get stations in a system */
  async getStationsBySystem(
    systemName: string,
  ): Promise<PaginatedResponse<EBGSStation>> {
    return this.getStations({ system: systemName });
  }

  /** Convenience: get the most recent BGS tick */
  async getLatestTick(): Promise<TickTime | undefined> {
    const ticks = await this.getTicks();
    return ticks[0];
  }
}
