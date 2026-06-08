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

  // === Auto-Send Convenience Methods ===
  // Each builds an event and immediately sends it (matching Python InaraClient pattern)

  async addCommanderAsync(commanderName: string, frontierId?: string): Promise<InaraResponse> {
    return this.sendEvents([this.addCommander(commanderName, frontierId)]);
  }

  async getCommanderProfileAsync(): Promise<InaraResponse> {
    return this.sendEvents([this.getCommanderProfile()]);
  }

  async setCommanderShipAsync(ship: {
    shipType: string;
    shipGameID: number;
    shipName?: string;
    shipIdent?: string;
    shipRole?: string;
  }): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderShip(ship)]);
  }

  async setCommanderShipLoadoutAsync(
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
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderShipLoadout(shipId, modules)]);
  }

  async addCommanderTravelFSDJumpAsync(
    systemName: string,
    systemCoords?: [number, number, number],
    date?: string,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderTravelFSDJump(systemName, systemCoords, date)]);
  }

  async addCommanderTravelDockAsync(
    stationName: string,
    systemName: string,
    date?: string,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderTravelDock(stationName, systemName, date)]);
  }

  async addCommanderTravelCarrierJumpAsync(
    systemName: string,
    systemCoords?: [number, number, number],
    date?: string,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderTravelCarrierJump(systemName, systemCoords, date)]);
  }

  async setCommanderTravelLocationAsync(
    systemName: string,
    systemCoords?: [number, number, number],
    date?: string,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderTravelLocation(systemName, systemCoords, date)]);
  }

  async setCommanderRankAsync(rankData: {
    combat?: number;
    trade?: number;
    explore?: number;
    cqc?: number;
    federation?: number;
    empire?: number;
    power?: number;
  }): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderRank(rankData)]);
  }

  async setCommanderCreditsAsync(
    credits: number,
    loan?: number,
    assets?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderCredits(credits, loan, assets)]);
  }

  async setCommanderInventoryAsync(inventory: {
    cargo?: Array<{ name: string; count: number }>;
    materials?: Array<{ name: string; count: number }>;
    components?: Array<{ name: string; count: number }>;
    data?: Array<{ name: string; count: number }>;
  }): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderInventory(inventory)]);
  }

  async setCommanderCommunityGoalProgressAsync(
    goalId: number,
    contribution: number,
    percentile?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderCommunityGoalProgress(goalId, contribution, percentile)]);
  }

  async setCommunityGoalAsync(cg: {
    name: string;
    systemName: string;
    stationName: string;
    goalObjective: string;
    goalExpiry: string;
    totalContributions?: number;
  }): Promise<InaraResponse> {
    return this.sendEvents([this.setCommunityGoal(cg)]);
  }

  async addCommanderFriendAsync(
    commanderName: string,
    gamePlatform?: "pc" | "xbox" | "ps4",
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderFriend(commanderName, gamePlatform)]);
  }

  async delCommanderFriendAsync(
    commanderName: string,
    gamePlatform?: "pc" | "xbox" | "ps4",
  ): Promise<InaraResponse> {
    return this.sendEvents([this.delCommanderFriend(commanderName, gamePlatform)]);
  }

  async addCommanderPermitAsync(starsystemName: string): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderPermit(starsystemName)]);
  }

  async setCommanderGameStatisticsAsync(
    statistics: Record<string, Record<string, number>>,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderGameStatistics(statistics)]);
  }

  async setCommanderRankEngineerAsync(
    engineerName: string,
    rankStage?: string,
    rankValue?: number,
  ): Promise<InaraResponse>;
  async setCommanderRankEngineerAsync(
    items: Array<{
      engineerName: string;
      rankStage?: string;
      rankValue?: number;
    }>,
  ): Promise<InaraResponse>;
  async setCommanderRankEngineerAsync(
    engineerNameOrItems:
      | string
      | Array<{
          engineerName: string;
          rankStage?: string;
          rankValue?: number;
        }>,
    rankStage?: string,
    rankValue?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([(this.setCommanderRankEngineer as any)(engineerNameOrItems, rankStage, rankValue)]);
  }

  async setCommanderRankPilotAsync(
    rankName: string,
    rankValue?: number,
    rankProgress?: number,
  ): Promise<InaraResponse>;
  async setCommanderRankPilotAsync(
    items: Array<{
      rankName: string;
      rankValue?: number;
      rankProgress?: number;
    }>,
  ): Promise<InaraResponse>;
  async setCommanderRankPilotAsync(
    rankNameOrItems:
      | string
      | Array<{
          rankName: string;
          rankValue?: number;
          rankProgress?: number;
        }>,
    rankValue?: number,
    rankProgress?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([(this.setCommanderRankPilot as any)(rankNameOrItems, rankValue, rankProgress)]);
  }

  async setCommanderRankPowerAsync(
    powerName: string,
    rankValue: number,
    meritsValue?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderRankPower(powerName, rankValue, meritsValue)]);
  }

  async setCommanderReputationMajorFactionAsync(
    majorfactionName: string,
    majorfactionReputation: number,
  ): Promise<InaraResponse>;
  async setCommanderReputationMajorFactionAsync(
    items: Array<{
      majorfactionName: string;
      majorfactionReputation: number;
    }>,
  ): Promise<InaraResponse>;
  async setCommanderReputationMajorFactionAsync(
    majorfactionNameOrItems:
      | string
      | Array<{
          majorfactionName: string;
          majorfactionReputation: number;
        }>,
    majorfactionReputation?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([(this.setCommanderReputationMajorFaction as any)(majorfactionNameOrItems, majorfactionReputation)]);
  }

  async setCommanderReputationMinorFactionAsync(
    minorfactionName: string,
    minorfactionReputation: number,
  ): Promise<InaraResponse>;
  async setCommanderReputationMinorFactionAsync(
    items: Array<{
      minorfactionName: string;
      minorfactionReputation: number;
    }>,
  ): Promise<InaraResponse>;
  async setCommanderReputationMinorFactionAsync(
    minorfactionNameOrItems:
      | string
      | Array<{
          minorfactionName: string;
          minorfactionReputation: number;
        }>,
    minorfactionReputation?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([(this.setCommanderReputationMinorFaction as any)(minorfactionNameOrItems, minorfactionReputation)]);
  }

  async addCommanderInventoryItemAsync(
    itemName: string,
    itemCount: number,
    itemType: string,
    itemLocation?: string,
    isStolen?: boolean,
    missionGameID?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderInventoryItem(itemName, itemCount, itemType, itemLocation, isStolen, missionGameID)]);
  }

  async delCommanderInventoryItemAsync(
    itemName: string,
    itemCount: number,
    itemType: string,
    itemLocation?: string,
    isStolen?: boolean,
    missionGameID?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.delCommanderInventoryItem(itemName, itemCount, itemType, itemLocation, isStolen, missionGameID)]);
  }

  async resetCommanderInventoryAsync(itemType: string, itemLocation?: string): Promise<InaraResponse>;
  async resetCommanderInventoryAsync(
    items: Array<{ itemType: string; itemLocation?: string }>,
  ): Promise<InaraResponse>;
  async resetCommanderInventoryAsync(
    itemTypeOrItems:
      | string
      | Array<{ itemType: string; itemLocation?: string }>,
    itemLocation?: string,
  ): Promise<InaraResponse> {
    return this.sendEvents([(this.resetCommanderInventory as any)(itemTypeOrItems, itemLocation)]);
  }

  async setCommanderInventoryItemAsync(
    itemName: string,
    itemCount: number,
    itemType: string,
    itemLocation?: string,
    isStolen?: boolean,
    missionGameID?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderInventoryItem(itemName, itemCount, itemType, itemLocation, isStolen, missionGameID)]);
  }

  async addCommanderInventoryCargoItemAsync(
    itemName: string,
    itemCount: number,
    isStolen?: boolean,
    missionGameID?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderInventoryCargoItem(itemName, itemCount, isStolen, missionGameID)]);
  }

  async addCommanderInventoryMaterialsItemAsync(
    itemName: string,
    itemCount: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderInventoryMaterialsItem(itemName, itemCount)]);
  }

  async delCommanderInventoryCargoItemAsync(
    itemName: string,
    itemCount: number,
    isStolen?: boolean,
    missionGameID?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.delCommanderInventoryCargoItem(itemName, itemCount, isStolen, missionGameID)]);
  }

  async delCommanderInventoryMaterialsItemAsync(
    itemName: string,
    itemCount: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.delCommanderInventoryMaterialsItem(itemName, itemCount)]);
  }

  async setCommanderInventoryCargoAsync(
    items: Array<{
      itemName: string;
      itemCount: number;
      isStolen?: boolean;
      missionGameID?: number;
    }>,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderInventoryCargo(items)]);
  }

  async setCommanderInventoryCargoItemAsync(
    itemName: string,
    itemCount: number,
    isStolen?: boolean,
    missionGameID?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderInventoryCargoItem(itemName, itemCount, isStolen, missionGameID)]);
  }

  async setCommanderInventoryMaterialsAsync(
    items: Array<{ itemName: string; itemCount: number }>,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderInventoryMaterials(items)]);
  }

  async setCommanderInventoryMaterialsItemAsync(
    itemName: string,
    itemCount: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderInventoryMaterialsItem(itemName, itemCount)]);
  }

  async setCommanderStorageModulesAsync(
    modules: Array<{
      itemName: string;
      itemValue: number;
      isHot?: boolean;
      starsystemName?: string;
      stationName?: string;
      marketID?: number;
      engineering?: Record<string, unknown>;
    }>,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderStorageModules(modules)]);
  }

  async addCommanderShipAsync(shipType: string, shipGameID: number): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderShip(shipType, shipGameID)]);
  }

  async delCommanderShipAsync(shipType: string, shipGameID: number): Promise<InaraResponse> {
    return this.sendEvents([this.delCommanderShip(shipType, shipGameID)]);
  }

  async setCommanderShipTransferAsync(
    shipType: string,
    shipGameID: number,
    starsystemName: string,
    stationName: string,
    marketID?: number,
    transferTime?: number,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderShipTransfer(shipType, shipGameID, starsystemName, stationName, marketID, transferTime)]);
  }

  async delCommanderSuitLoadoutAsync(loadoutGameID: number): Promise<InaraResponse> {
    return this.sendEvents([this.delCommanderSuitLoadout(loadoutGameID)]);
  }

  async setCommanderSuitLoadoutAsync(data: {
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
  }): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderSuitLoadout(data)]);
  }

  async updateCommanderSuitLoadoutAsync(data: {
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
  }): Promise<InaraResponse> {
    return this.sendEvents([this.updateCommanderSuitLoadout(data)]);
  }

  async addCommanderTravelLandAsync(starsystemName: string, bodyName: string): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderTravelLand(starsystemName, bodyName)]);
  }

  async addCommanderMissionAsync(
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
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderMission(missionName, missionGameID, additionalData)]);
  }

  async setCommanderMissionAbandonedAsync(missionGameID: number): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderMissionAbandoned(missionGameID)]);
  }

  async setCommanderMissionCompletedAsync(
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
  ): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderMissionCompleted(missionGameID, additionalData)]);
  }

  async setCommanderMissionFailedAsync(missionGameID: number): Promise<InaraResponse> {
    return this.sendEvents([this.setCommanderMissionFailed(missionGameID)]);
  }

  async addCommanderCombatDeathAsync(
    starsystemName: string,
    opponentName?: string,
    isPlayer?: boolean,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderCombatDeath(starsystemName, opponentName, isPlayer)]);
  }

  async addCommanderCombatInterdictedAsync(
    starsystemName: string,
    opponentName: string,
    isPlayer: boolean,
    isSubmit?: boolean,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderCombatInterdicted(starsystemName, opponentName, isPlayer, isSubmit)]);
  }

  async addCommanderCombatInterdictionAsync(
    starsystemName: string,
    opponentName: string,
    isPlayer: boolean,
    isSuccess?: boolean,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderCombatInterdiction(starsystemName, opponentName, isPlayer, isSuccess)]);
  }

  async addCommanderCombatInterdictionEscapeAsync(
    starsystemName: string,
    opponentName: string,
    isPlayer: boolean,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderCombatInterdictionEscape(starsystemName, opponentName, isPlayer)]);
  }

  async addCommanderCombatKillAsync(
    starsystemName: string,
    opponentName?: string,
    opponentShipType?: string,
    isPlayer?: boolean,
  ): Promise<InaraResponse> {
    return this.sendEvents([this.addCommanderCombatKill(starsystemName, opponentName, opponentShipType, isPlayer)]);
  }

  async getCommunityGoalsRecentAsync(starsystemName?: string): Promise<InaraResponse> {
    return this.sendEvents([this.getCommunityGoalsRecent(starsystemName)]);
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
