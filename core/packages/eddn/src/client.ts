/**
 * EDDN (Elite Dangerous Data Network) Client
 *
 * EDDN is a ZeroMQ service that allows players to share game data.
 *
 * Sending:
 *   POST https://eddn.edcd.io:4430/upload/
 *   Port 4430, HTTPS required
 *
 * Receiving:
 *   tcp://eddn.edcd.io:9500
 *   Subscribe to '' (empty topic) to receive everything
 *   Messages are zlib-decompressed JSON
 *
 * Docs: https://github.com/EDCD/EDDN/blob/live/docs/Developers.md
 */

export const UPLOAD_URL = "https://eddn.edcd.io:4430/upload/";
export const RELAY_URL = "tcp://eddn.edcd.io:9500";

export interface EDDNMessageHeader {
  uploaderID: string;
  gameversion: string;
  gamebuild: string;
  softwareName: string;
  softwareVersion: string;
}

export interface EDDNMessage {
  $schemaRef: string;
  header: EDDNMessageHeader;
  message: Record<string, unknown>;
}

export interface EDDNSenderConfig {
  softwareName: string;
  softwareVersion: string;
  uploaderID?: string;
}

export class EDDNClient {
  private config: EDDNSenderConfig;

  constructor(config: EDDNSenderConfig) {
    this.config = config;
  }

  /**
   * Send a message to EDDN
   */
  async send(
    schemaRef: string,
    message: Record<string, unknown>,
    gameversion?: string,
    gamebuild?: string,
    uploaderID?: string,
  ): Promise<void> {
    const body: EDDNMessage = {
      $schemaRef: schemaRef,
      header: {
        uploaderID: uploaderID ?? this.config.uploaderID ?? "unknown",
        gameversion: gameversion ?? "",
        gamebuild: gamebuild ?? "",
        softwareName: this.config.softwareName,
        softwareVersion: this.config.softwareVersion,
      },
      message,
    };

    const resp = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      if (resp.status === 400 && text.startsWith("FAIL:")) {
        throw new Error(`EDDN validation failed: ${text}`);
      }
      if (resp.status === 426) {
        throw new Error(
          `EDDN schema outdated: ${schemaRef}. Update your application.`,
        );
      }
      if (resp.status === 413) {
        throw new Error("EDDN message too large (max 1MB)");
      }
      throw new Error(`EDDN upload failed: ${resp.status} ${text}`);
    }
  }

  /**
   * Send a commodity/market message
   */
  async sendCommodity(
    message: {
      systemName: string;
      stationName: string;
      marketId: number;
      commodities: Array<{
        name: string;
        buyPrice: number;
        sellPrice: number;
        meanPrice: number;
        stockBracket: number;
        demandBracket: number;
        stock: number;
        demand: number;
      }>;
      horizons?: boolean;
      odyssey?: boolean;
    },
    gameversion?: string,
    gamebuild?: string,
  ): Promise<void> {
    return this.send(
      "https://eddn.edcd.io/schemas/commodity/3",
      message as unknown as Record<string, unknown>,
      gameversion,
      gamebuild,
    );
  }

  /**
   * Send a shipyard message
   */
  async sendShipyard(
    message: {
      systemName: string;
      stationName: string;
      marketId: number;
      ships: string[];
      horizons?: boolean;
      odyssey?: boolean;
    },
    gameversion?: string,
    gamebuild?: string,
  ): Promise<void> {
    return this.send(
      "https://eddn.edcd.io/schemas/shipyard/2",
      message as unknown as Record<string, unknown>,
      gameversion,
      gamebuild,
    );
  }

  /**
   * Send an outfitting message
   */
  async sendOutfitting(
    message: {
      systemName: string;
      stationName: string;
      marketId: number;
      modules: string[];
      horizons?: boolean;
      odyssey?: boolean;
    },
    gameversion?: string,
    gamebuild?: string,
  ): Promise<void> {
    return this.send(
      "https://eddn.edcd.io/schemas/outfitting/2",
      message as unknown as Record<string, unknown>,
      gameversion,
      gamebuild,
    );
  }

  /**
   * Send a fleet carrier message (CAPI source)
   */
  async sendFleetCarrier(
    message: {
      systemName: string;
      stationName: string;
      marketId: number;
      carrierCallsign: string;
      carrierDockingAccess: string;
      commodities?: Array<{
        name: string;
        buyPrice: number;
        sellPrice: number;
        meanPrice: number;
        stockBracket: number;
        demandBracket: number;
        stock: number;
        demand: number;
      }>;
    },
    gameversion?: string,
    gamebuild?: string,
  ): Promise<void> {
    return this.send(
      "https://eddn.edcd.io/schemas/fcmaterials_capi/1",
      message as unknown as Record<string, unknown>,
      gameversion,
      gamebuild,
    );
  }

  async sendJournal(
    message: Record<string, unknown>,
    gameversion?: string,
    gamebuild?: string,
  ): Promise<void> {
    return this.send(
      "https://eddn.edcd.io/schemas/journal/1",
      message,
      gameversion,
      gamebuild,
    );
  }

  async sendBlackmarket(
    message: {
      systemName: string;
      stationName: string;
      marketId: number;
      items: Array<{
        name: string;
        name_Localised?: string;
        category?: string;
        category_Localised?: string;
        id?: number;
        blackMarket?: number;
        meanPrice?: number;
        buyPrice?: number;
        stock?: number;
        stockBracket?: number;
        sellPrice?: number;
        demand?: number;
        demandBracket?: number;
        statusFlags?: string;
      }>;
    },
    gameversion?: string,
    gamebuild?: string,
  ): Promise<void> {
    return this.send(
      "https://eddn.edcd.io/schemas/blackmarket/1",
      message as unknown as Record<string, unknown>,
      gameversion,
      gamebuild,
    );
  }

  async sendNavRoute(
    message: {
      systemName: string;
      route: Array<{
        StarPos: [number, number, number];
        systemName: string;
        systemAddress: number;
      }>;
    },
    gameversion?: string,
    gamebuild?: string,
  ): Promise<void> {
    return this.send(
      "https://eddn.edcd.io/schemas/navroute/1",
      message as unknown as Record<string, unknown>,
      gameversion,
      gamebuild,
    );
  }

  async sendFcMaterialsJournal(
    message: {
      timestamp: string;
      event: string;
      CarrierName: string;
      CarrierID?: number;
      MarketID: number;
      Items: Array<{
        name: string;
        price?: number;
        stock?: number;
        demand?: number;
      }>;
    },
    gameversion?: string,
    gamebuild?: string,
  ): Promise<void> {
    return this.send(
      "https://eddn.edcd.io/schemas/fcmaterials_journal/1",
      message as unknown as Record<string, unknown>,
      gameversion,
      gamebuild,
    );
  }
}
