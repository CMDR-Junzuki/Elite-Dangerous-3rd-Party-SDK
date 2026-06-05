/**
 * Inara API client for Elite Dangerous
 *
 * API docs: https://inara.cz/elite/inara-api-docs/
 * Dev guide: https://inara.cz/elite/inara-api-devguide/
 * Endpoint: POST https://inara.cz/inapi/v1/
 *
 * Rate limit: 2 requests per minute max
 */

export const INARA_ENDPOINT = "https://inara.cz/inapi/v1/";

export interface InaraHeader {
  appName: string;
  appVersion: string;
  isBeingDeveloped: boolean;
  APIkey: string;
  commanderName?: string;
  commanderFrontierID?: string;
}

export interface InaraEvent {
  eventName: string;
  eventTimestamp?: string;
  eventData?: Record<string, unknown> | unknown[];
}

export interface InaraRequest {
  header: InaraHeader;
  events: InaraEvent[];
}

export interface InaraEventResult {
  eventStatus: number;
  eventStatusText?: string;
  eventData?: unknown;
}

export interface InaraResponse {
  header: {
    eventStatus: number;
    eventStatusText?: string;
  };
  events: InaraEventResult[];
}

export class InaraClient {
  private header: InaraHeader;

  constructor(header: InaraHeader) {
    this.header = header;
  }

  async sendEvents(events: InaraEvent[]): Promise<InaraResponse> {
    // Inara rate limit: max 2 requests per minute
    const body: InaraRequest = {
      header: this.header,
      events,
    };

    const resp = await fetch(INARA_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      throw new Error(`Inara API error: ${resp.status} ${await resp.text()}`);
    }

    const data = (await resp.json()) as InaraResponse;

    if (data.header.eventStatus !== 200) {
      throw new Error(
        `Inara API error: ${data.header.eventStatusText ?? data.header.eventStatus}`,
      );
    }

    return data;
  }

  // === Event Builders ===

  addCommander(commanderName: string, frontierId?: string): InaraEvent {
    return {
      eventName: "addCommander",
      eventData: {
        commanderName,
        commanderFrontierID: frontierId,
        isMainCommander: true,
      },
    };
  }

  getCommanderProfile(): InaraEvent {
    return { eventName: "getCommanderProfile" };
  }

  setCommanderShip(ship: {
    shipType: string;
    shipGameID: number;
    shipName?: string;
    shipIdent?: string;
    shipRole?: string;
  }): InaraEvent {
    return {
      eventName: "setCommanderShip",
      eventData: {
        shipType: ship.shipType,
        shipGameID: ship.shipGameID,
        shipName: ship.shipName,
        shipIdent: ship.shipIdent,
        shipRole: ship.shipRole ?? "Multi-purpose",
      },
    };
  }

  setCommanderShipLoadout(
    shipId: number,
    modules: Array<{
      slotName: string;
      itemName: string;
      itemValue?: number;
      engineering?: Array<{
        engineerName?: string;
        blueprintName?: string;
        blueprintLevel?: number;
        experimentalEffect?: string;
      }>;
    }>,
  ): InaraEvent {
    return {
      eventName: "setCommanderShipLoadout",
      eventData: {
        shipGameID: shipId,
        modules,
      },
    };
  }

  addCommanderTravelFSDJump(
    systemName: string,
    systemCoords?: [number, number, number],
    date?: string,
  ): InaraEvent {
    return {
      eventName: "addCommanderTravelFSDJump",
      eventTimestamp: date,
      eventData: {
        starSystemName: systemName,
        ...(systemCoords && {
          starSystemX: systemCoords[0],
          starSystemY: systemCoords[1],
          starSystemZ: systemCoords[2],
        }),
      },
    };
  }

  addCommanderTravelDock(
    stationName: string,
    systemName: string,
    date?: string,
  ): InaraEvent {
    return {
      eventName: "addCommanderTravelDock",
      eventTimestamp: date,
      eventData: {
        starSystemName: systemName,
        stationName,
      },
    };
  }

  addCommanderTravelCarrierJump(
    systemName: string,
    systemCoords?: [number, number, number],
    date?: string,
  ): InaraEvent {
    return {
      eventName: "addCommanderTravelCarrierJump",
      eventTimestamp: date,
      eventData: {
        starSystemName: systemName,
        ...(systemCoords && {
          starSystemX: systemCoords[0],
          starSystemY: systemCoords[1],
          starSystemZ: systemCoords[2],
        }),
      },
    };
  }

  setCommanderTravelLocation(
    systemName: string,
    systemCoords?: [number, number, number],
    date?: string,
  ): InaraEvent {
    return {
      eventName: "setCommanderTravelLocation",
      eventTimestamp: date,
      eventData: {
        starSystemName: systemName,
        ...(systemCoords && {
          starSystemX: systemCoords[0],
          starSystemY: systemCoords[1],
          starSystemZ: systemCoords[2],
        }),
      },
    };
  }

  setCommanderRank(rankData: {
    combat?: number;
    trade?: number;
    explore?: number;
    cqc?: number;
    federation?: number;
    empire?: number;
    power?: number;
  }): InaraEvent {
    return {
      eventName: "setCommanderRank",
      eventData: rankData,
    };
  }

  setCommanderCredits(
    credits: number,
    loan?: number,
    assets?: number,
  ): InaraEvent {
    return {
      eventName: "setCommanderCredits",
      eventData: {
        commanderCredits: credits,
        ...(loan !== undefined && { commanderLoan: loan }),
        ...(assets !== undefined && { commanderAssets: assets }),
      },
    };
  }

  setCommanderInventory(inventory: {
    cargo?: Array<{ name: string; count: number }>;
    materials?: Array<{ name: string; count: number }>;
    components?: Array<{ name: string; count: number }>;
    data?: Array<{ name: string; count: number }>;
  }): InaraEvent {
    return {
      eventName: "setCommanderInventory",
      eventData: inventory,
    };
  }

  setCommanderCommunityGoalProgress(
    goalId: number,
    contribution: number,
    percentile?: number,
  ): InaraEvent {
    return {
      eventName: "setCommanderCommunityGoalProgress",
      eventData: {
        communitygoalGameID: goalId,
        contribution,
        percentile,
      },
    };
  }

  setCommunityGoal(cg: {
    name: string;
    systemName: string;
    stationName: string;
    goalObjective: string;
    goalExpiry: string;
    totalContributions?: number;
  }): InaraEvent {
    return {
      eventName: "setCommunityGoal",
      eventData: {
        communitygoalName: cg.name,
        starSystemName: cg.systemName,
        stationName: cg.stationName,
        communitygoalObjective: cg.goalObjective,
        communitygoalExpiry: cg.goalExpiry,
        communitygoalTotalContributions: cg.totalContributions,
      },
    };
  }

  addCommanderFriend(
    commanderName: string,
    gamePlatform?: "pc" | "xbox" | "ps4",
  ): InaraEvent {
    return {
      eventName: "addCommanderFriend",
      eventData: {
        commanderName,
        ...(gamePlatform !== undefined && { gamePlatform }),
      },
    };
  }

  delCommanderFriend(
    commanderName: string,
    gamePlatform?: "pc" | "xbox" | "ps4",
  ): InaraEvent {
    return {
      eventName: "delCommanderFriend",
      eventData: {
        commanderName,
        ...(gamePlatform !== undefined && { gamePlatform }),
      },
    };
  }

  addCommanderPermit(starsystemName: string): InaraEvent {
    return {
      eventName: "addCommanderPermit",
      eventData: { starsystemName },
    };
  }

  setCommanderGameStatistics(
    statistics: Record<string, Record<string, number>>,
  ): InaraEvent {
    return {
      eventName: "setCommanderGameStatistics",
      eventData: statistics,
    };
  }

  setCommanderRankEngineer(
    engineerName: string,
    rankStage?: string,
    rankValue?: number,
  ): InaraEvent;
  setCommanderRankEngineer(
    items: Array<{
      engineerName: string;
      rankStage?: string;
      rankValue?: number;
    }>,
  ): InaraEvent;
  setCommanderRankEngineer(
    engineerNameOrItems:
      | string
      | Array<{
          engineerName: string;
          rankStage?: string;
          rankValue?: number;
        }>,
    rankStage?: string,
    rankValue?: number,
  ): InaraEvent {
    if (typeof engineerNameOrItems === "string") {
      return {
        eventName: "setCommanderRankEngineer",
        eventData: {
          engineerName: engineerNameOrItems,
          ...(rankStage !== undefined && { rankStage }),
          ...(rankValue !== undefined && { rankValue }),
        },
      };
    }
    return {
      eventName: "setCommanderRankEngineer",
      eventData: engineerNameOrItems,
    };
  }

  setCommanderRankPilot(
    rankName: string,
    rankValue?: number,
    rankProgress?: number,
  ): InaraEvent;
  setCommanderRankPilot(
    items: Array<{
      rankName: string;
      rankValue?: number;
      rankProgress?: number;
    }>,
  ): InaraEvent;
  setCommanderRankPilot(
    rankNameOrItems:
      | string
      | Array<{
          rankName: string;
          rankValue?: number;
          rankProgress?: number;
        }>,
    rankValue?: number,
    rankProgress?: number,
  ): InaraEvent {
    if (typeof rankNameOrItems === "string") {
      return {
        eventName: "setCommanderRankPilot",
        eventData: {
          rankName: rankNameOrItems,
          ...(rankValue !== undefined && { rankValue }),
          ...(rankProgress !== undefined && { rankProgress }),
        },
      };
    }
    return {
      eventName: "setCommanderRankPilot",
      eventData: rankNameOrItems,
    };
  }

  setCommanderRankPower(
    powerName: string,
    rankValue: number,
    meritsValue?: number,
  ): InaraEvent {
    return {
      eventName: "setCommanderRankPower",
      eventData: {
        powerName,
        rankValue,
        ...(meritsValue !== undefined && { meritsValue }),
      },
    };
  }

  setCommanderReputationMajorFaction(
    majorfactionName: string,
    majorfactionReputation: number,
  ): InaraEvent;
  setCommanderReputationMajorFaction(
    items: Array<{
      majorfactionName: string;
      majorfactionReputation: number;
    }>,
  ): InaraEvent;
  setCommanderReputationMajorFaction(
    majorfactionNameOrItems:
      | string
      | Array<{
          majorfactionName: string;
          majorfactionReputation: number;
        }>,
    majorfactionReputation?: number,
  ): InaraEvent {
    if (typeof majorfactionNameOrItems === "string") {
      return {
        eventName: "setCommanderReputationMajorFaction",
        eventData: {
          majorfactionName: majorfactionNameOrItems,
          majorfactionReputation: majorfactionReputation!,
        },
      };
    }
    return {
      eventName: "setCommanderReputationMajorFaction",
      eventData: majorfactionNameOrItems,
    };
  }

  setCommanderReputationMinorFaction(
    minorfactionName: string,
    minorfactionReputation: number,
  ): InaraEvent;
  setCommanderReputationMinorFaction(
    items: Array<{
      minorfactionName: string;
      minorfactionReputation: number;
    }>,
  ): InaraEvent;
  setCommanderReputationMinorFaction(
    minorfactionNameOrItems:
      | string
      | Array<{
          minorfactionName: string;
          minorfactionReputation: number;
        }>,
    minorfactionReputation?: number,
  ): InaraEvent {
    if (typeof minorfactionNameOrItems === "string") {
      return {
        eventName: "setCommanderReputationMinorFaction",
        eventData: {
          minorfactionName: minorfactionNameOrItems,
          minorfactionReputation: minorfactionReputation!,
        },
      };
    }
    return {
      eventName: "setCommanderReputationMinorFaction",
      eventData: minorfactionNameOrItems,
    };
  }

  addCommanderInventoryItem(
    itemName: string,
    itemCount: number,
    itemType: string,
    itemLocation?: string,
    isStolen?: boolean,
    missionGameID?: number,
  ): InaraEvent {
    return {
      eventName: "addCommanderInventoryItem",
      eventData: {
        itemName,
        itemCount,
        itemType,
        ...(itemLocation !== undefined && { itemLocation }),
        ...(isStolen !== undefined && { isStolen }),
        ...(missionGameID !== undefined && { missionGameID }),
      },
    };
  }

  delCommanderInventoryItem(
    itemName: string,
    itemCount: number,
    itemType: string,
    itemLocation?: string,
    isStolen?: boolean,
    missionGameID?: number,
  ): InaraEvent {
    return {
      eventName: "delCommanderInventoryItem",
      eventData: {
        itemName,
        itemCount,
        itemType,
        ...(itemLocation !== undefined && { itemLocation }),
        ...(isStolen !== undefined && { isStolen }),
        ...(missionGameID !== undefined && { missionGameID }),
      },
    };
  }

  resetCommanderInventory(itemType: string, itemLocation?: string): InaraEvent;
  resetCommanderInventory(
    items: Array<{ itemType: string; itemLocation?: string }>,
  ): InaraEvent;
  resetCommanderInventory(
    itemTypeOrItems:
      | string
      | Array<{ itemType: string; itemLocation?: string }>,
    itemLocation?: string,
  ): InaraEvent {
    if (typeof itemTypeOrItems === "string") {
      return {
        eventName: "resetCommanderInventory",
        eventData: {
          itemType: itemTypeOrItems,
          ...(itemLocation !== undefined && { itemLocation }),
        },
      };
    }
    return {
      eventName: "resetCommanderInventory",
      eventData: itemTypeOrItems,
    };
  }

  setCommanderInventoryItem(
    itemName: string,
    itemCount: number,
    itemType: string,
    itemLocation?: string,
    isStolen?: boolean,
    missionGameID?: number,
  ): InaraEvent {
    return {
      eventName: "setCommanderInventoryItem",
      eventData: {
        itemName,
        itemCount,
        itemType,
        ...(itemLocation !== undefined && { itemLocation }),
        ...(isStolen !== undefined && { isStolen }),
        ...(missionGameID !== undefined && { missionGameID }),
      },
    };
  }

  addCommanderInventoryCargoItem(
    itemName: string,
    itemCount: number,
    isStolen?: boolean,
    missionGameID?: number,
  ): InaraEvent {
    return {
      eventName: "addCommanderInventoryCargoItem",
      eventData: {
        itemName,
        itemCount,
        ...(isStolen !== undefined && { isStolen }),
        ...(missionGameID !== undefined && { missionGameID }),
      },
    };
  }

  addCommanderInventoryMaterialsItem(
    itemName: string,
    itemCount: number,
  ): InaraEvent {
    return {
      eventName: "addCommanderInventoryMaterialsItem",
      eventData: { itemName, itemCount },
    };
  }

  delCommanderInventoryCargoItem(
    itemName: string,
    itemCount: number,
    isStolen?: boolean,
    missionGameID?: number,
  ): InaraEvent {
    return {
      eventName: "delCommanderInventoryCargoItem",
      eventData: {
        itemName,
        itemCount,
        ...(isStolen !== undefined && { isStolen }),
        ...(missionGameID !== undefined && { missionGameID }),
      },
    };
  }

  delCommanderInventoryMaterialsItem(
    itemName: string,
    itemCount: number,
  ): InaraEvent {
    return {
      eventName: "delCommanderInventoryMaterialsItem",
      eventData: { itemName, itemCount },
    };
  }

  setCommanderInventoryCargo(
    items: Array<{
      itemName: string;
      itemCount: number;
      isStolen?: boolean;
      missionGameID?: number;
    }>,
  ): InaraEvent {
    return {
      eventName: "setCommanderInventoryCargo",
      eventData: items,
    };
  }

  setCommanderInventoryCargoItem(
    itemName: string,
    itemCount: number,
    isStolen?: boolean,
    missionGameID?: number,
  ): InaraEvent {
    return {
      eventName: "setCommanderInventoryCargoItem",
      eventData: {
        itemName,
        itemCount,
        ...(isStolen !== undefined && { isStolen }),
        ...(missionGameID !== undefined && { missionGameID }),
      },
    };
  }

  setCommanderInventoryMaterials(
    items: Array<{ itemName: string; itemCount: number }>,
  ): InaraEvent {
    return {
      eventName: "setCommanderInventoryMaterials",
      eventData: items,
    };
  }

  setCommanderInventoryMaterialsItem(
    itemName: string,
    itemCount: number,
  ): InaraEvent {
    return {
      eventName: "setCommanderInventoryMaterialsItem",
      eventData: { itemName, itemCount },
    };
  }

  setCommanderStorageModules(
    modules: Array<{
      itemName: string;
      itemValue: number;
      isHot?: boolean;
      starsystemName?: string;
      stationName?: string;
      marketID?: number;
      engineering?: Record<string, unknown>;
    }>,
  ): InaraEvent {
    return {
      eventName: "setCommanderStorageModules",
      eventData: modules,
    };
  }

  addCommanderShip(shipType: string, shipGameID: number): InaraEvent {
    return {
      eventName: "addCommanderShip",
      eventData: { shipType, shipGameID },
    };
  }

  delCommanderShip(shipType: string, shipGameID: number): InaraEvent {
    return {
      eventName: "delCommanderShip",
      eventData: { shipType, shipGameID },
    };
  }

  setCommanderShipTransfer(
    shipType: string,
    shipGameID: number,
    starsystemName: string,
    stationName: string,
    marketID?: number,
    transferTime?: number,
  ): InaraEvent {
    return {
      eventName: "setCommanderShipTransfer",
      eventData: {
        shipType,
        shipGameID,
        starsystemName,
        stationName,
        ...(marketID !== undefined && { marketID }),
        ...(transferTime !== undefined && { transferTime }),
      },
    };
  }

  delCommanderSuitLoadout(loadoutGameID: number): InaraEvent {
    return {
      eventName: "delCommanderSuitLoadout",
      eventData: { loadoutGameID },
    };
  }

  setCommanderSuitLoadout(data: {
    loadoutGameID: number;
    loadoutName?: string;
    suitGameID?: number;
    suitType?: string;
    suitMods?: string[];
    suitLoadout?: Array<{
      slotName: string;
      itemName: string;
      itemClass: number;
      itemGameID: number;
      engineering?: Array<{ blueprintName: string }>;
    }>;
  }): InaraEvent {
    return {
      eventName: "setCommanderSuitLoadout",
      eventData: data,
    };
  }

  updateCommanderSuitLoadout(data: {
    loadoutGameID: number;
    loadoutName?: string;
    suitGameID?: number;
    suitType?: string;
    suitMods?: string[];
    suitLoadout?: Array<{
      slotName: string;
      itemName: string;
      itemClass: number;
      itemGameID: number;
      engineering?: Array<{ blueprintName: string }>;
    }>;
  }): InaraEvent {
    return {
      eventName: "updateCommanderSuitLoadout",
      eventData: data,
    };
  }

  addCommanderTravelLand(starsystemName: string, bodyName: string): InaraEvent {
    return {
      eventName: "addCommanderTravelLand",
      eventData: {
        starsystemName,
        starsystemBodyName: bodyName,
      },
    };
  }

  addCommanderMission(
    missionName: string,
    missionGameID: number,
    additionalData?: Partial<{
      missionExpiry: string;
      influenceGain: string;
      reputationGain: string;
      starsystemNameOrigin: string;
      stationNameOrigin: string;
      minorfactionNameOrigin: string;
      starsystemNameTarget: string;
      stationNameTarget: string;
      minorfactionNameTarget: string;
      commodityName: string;
      commodityCount: number;
      targetName: string;
      targetType: string;
      killCount: number;
      passengerType: string;
      passengerCount: number;
      passengerIsVIP: boolean;
      passengerIsWanted: boolean;
    }>,
  ): InaraEvent {
    return {
      eventName: "addCommanderMission",
      eventData: {
        missionName,
        missionGameID,
        ...additionalData,
      },
    };
  }

  setCommanderMissionAbandoned(missionGameID: number): InaraEvent {
    return {
      eventName: "setCommanderMissionAbandoned",
      eventData: { missionGameID },
    };
  }

  setCommanderMissionCompleted(
    missionGameID: number,
    additionalData?: Partial<{
      donationCredits: number;
      rewardCredits: number;
      rewardPermits: Array<{ starsystemName: string }>;
      rewardCommodities: Array<{ itemName: string; itemCount: number }>;
      rewardMaterials: Array<{ itemName: string; itemCount: number }>;
      minorfactionEffects: Array<{
        minorfactionName: string;
        influenceGain?: string;
        reputationGain?: string;
      }>;
    }>,
  ): InaraEvent {
    return {
      eventName: "setCommanderMissionCompleted",
      eventData: {
        missionGameID,
        ...additionalData,
      },
    };
  }

  setCommanderMissionFailed(missionGameID: number): InaraEvent {
    return {
      eventName: "setCommanderMissionFailed",
      eventData: { missionGameID },
    };
  }

  addCommanderCombatDeath(
    starsystemName: string,
    opponentName?: string,
    isPlayer?: boolean,
  ): InaraEvent {
    return {
      eventName: "addCommanderCombatDeath",
      eventData: {
        starsystemName,
        ...(opponentName !== undefined && { opponentName }),
        ...(isPlayer !== undefined && { isPlayer }),
      },
    };
  }

  addCommanderCombatInterdicted(
    starsystemName: string,
    opponentName: string,
    isPlayer: boolean,
    isSubmit?: boolean,
  ): InaraEvent {
    return {
      eventName: "addCommanderCombatInterdicted",
      eventData: {
        starsystemName,
        opponentName,
        isPlayer,
        ...(isSubmit !== undefined && { isSubmit }),
      },
    };
  }

  addCommanderCombatInterdiction(
    starsystemName: string,
    opponentName: string,
    isPlayer: boolean,
    isSuccess?: boolean,
  ): InaraEvent {
    return {
      eventName: "addCommanderCombatInterdiction",
      eventData: {
        starsystemName,
        opponentName,
        isPlayer,
        ...(isSuccess !== undefined && { isSuccess }),
      },
    };
  }

  addCommanderCombatInterdictionEscape(
    starsystemName: string,
    opponentName: string,
    isPlayer: boolean,
  ): InaraEvent {
    return {
      eventName: "addCommanderCombatInterdictionEscape",
      eventData: {
        starsystemName,
        opponentName,
        isPlayer,
      },
    };
  }

  addCommanderCombatKill(
    starsystemName: string,
    opponentName?: string,
    opponentShipType?: string,
    isPlayer?: boolean,
  ): InaraEvent {
    return {
      eventName: "addCommanderCombatKill",
      eventData: {
        starsystemName,
        ...(opponentName !== undefined && { opponentName }),
        ...(opponentShipType !== undefined && { opponentShipType }),
        ...(isPlayer !== undefined && { isPlayer }),
      },
    };
  }

  getCommunityGoalsRecent(starsystemName?: string): InaraEvent {
    return {
      eventName: "getCommunityGoalsRecent",
      eventData: starsystemName ? { starsystemName } : [],
    };
  }
}
