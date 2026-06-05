export type InaraEventName =
  | "addCommander"
  | "getCommanderProfile"
  | "addCommanderFriend"
  | "delCommanderFriend"
  | "addCommanderPermit"
  | "setCommanderCredits"
  | "setCommanderGameStatistics"
  | "setCommanderRank"
  | "setCommanderRankEngineer"
  | "setCommanderRankPilot"
  | "setCommanderRankPower"
  | "setCommanderReputationMajorFaction"
  | "setCommanderReputationMinorFaction"
  | "addCommanderInventoryItem"
  | "delCommanderInventoryItem"
  | "resetCommanderInventory"
  | "setCommanderInventory"
  | "setCommanderInventoryItem"
  | "addCommanderInventoryCargoItem"
  | "addCommanderInventoryMaterialsItem"
  | "delCommanderInventoryCargoItem"
  | "delCommanderInventoryMaterialsItem"
  | "setCommanderInventoryCargo"
  | "setCommanderInventoryCargoItem"
  | "setCommanderInventoryMaterials"
  | "setCommanderInventoryMaterialsItem"
  | "setCommanderStorageModules"
  | "addCommanderShip"
  | "delCommanderShip"
  | "setCommanderShip"
  | "setCommanderShipLoadout"
  | "setCommanderShipTransfer"
  | "delCommanderSuitLoadout"
  | "setCommanderSuitLoadout"
  | "updateCommanderSuitLoadout"
  | "addCommanderTravelCarrierJump"
  | "addCommanderTravelDock"
  | "addCommanderTravelFSDJump"
  | "addCommanderTravelLand"
  | "setCommanderTravelLocation"
  | "addCommanderMission"
  | "setCommanderMissionAbandoned"
  | "setCommanderMissionCompleted"
  | "setCommanderMissionFailed"
  | "addCommanderCombatDeath"
  | "addCommanderCombatInterdicted"
  | "addCommanderCombatInterdiction"
  | "addCommanderCombatInterdictionEscape"
  | "addCommanderCombatKill"
  | "getCommunityGoalsRecent"
  | "setCommanderCommunityGoalProgress"
  | "setCommunityGoal";

export interface InaraFriendEvent {
  commanderName: string;
  gamePlatform?: "pc" | "xbox" | "ps4";
}

export interface InaraPermitEvent {
  starsystemName: string;
}

export interface InaraRankEngineerEvent {
  engineerName: string;
  rankStage?: string;
  rankValue?: number;
}

export interface InaraRankPilotEvent {
  rankName: string;
  rankValue?: number;
  rankProgress?: number;
}

export interface InaraRankPowerEvent {
  powerName: string;
  rankValue: number;
  meritsValue?: number;
}

export interface InaraReputationEvent {
  majorfactionName?: string;
  majorfactionReputation?: number;
  minorfactionName?: string;
  minorfactionReputation?: number;
}

export interface InaraInventoryItemEvent {
  itemName: string;
  itemCount: number;
  itemType: string;
  itemLocation?: string;
  isStolen?: boolean;
  missionGameID?: number;
}

export interface InaraCargoItemEvent {
  itemName: string;
  itemCount: number;
  isStolen?: boolean;
  missionGameID?: number;
}

export interface InaraMaterialEvent {
  itemName: string;
  itemCount: number;
}

export interface InaraShipEvent {
  shipType: string;
  shipGameID: number;
}

export interface InaraShipTransferEvent {
  shipType: string;
  shipGameID: number;
  starsystemName: string;
  stationName: string;
  marketID?: number;
  transferTime?: number;
}

export interface InaraMissionEvent {
  missionName: string;
  missionGameID: number;
  missionExpiry?: string;
  influenceGain?: string;
  reputationGain?: string;
  starsystemNameOrigin?: string;
  stationNameOrigin?: string;
  minorfactionNameOrigin?: string;
  starsystemNameTarget?: string;
  stationNameTarget?: string;
  minorfactionNameTarget?: string;
  commodityName?: string;
  commodityCount?: number;
  targetName?: string;
  targetType?: string;
  killCount?: number;
  passengerType?: string;
  passengerCount?: number;
  passengerIsVIP?: boolean;
  passengerIsWanted?: boolean;
}

export interface InaraCombatEvent {
  starsystemName: string;
  opponentName?: string;
  opponentShipType?: string;
  isPlayer?: boolean;
  isSubmit?: boolean;
  isSuccess?: boolean;
  combatResult?: string;
}

export interface InaraStorageModuleEvent {
  itemName: string;
  itemValue: number;
  isHot?: boolean;
  starsystemName?: string;
  stationName?: string;
  marketID?: number;
  engineering?: Record<string, unknown>;
}
