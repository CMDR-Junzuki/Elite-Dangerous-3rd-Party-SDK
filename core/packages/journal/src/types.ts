export type ID = number | bigint;

export interface FileHeader {
  timestamp: string;
  event: "FileHeader";
  part: number;
  language?: string;
  gameversion?: string;
  build?: string;
  odyssey?: boolean;
}

export interface LoadGame {
  timestamp: string;
  event: "LoadGame";
  Commander: string;
  FID?: string;
  Ship: string;
  ShipID: number;
  ShipName?: string;
  ShipIdent?: string;
  FuelLevel?: number;
  FuelCapacity?: number;
  GameMode: string;
  Group?: string;
  Credits: number;
  Loan: number;
  Horizons?: boolean;
  Odyssey?: boolean;
  language?: string;
  gameversion?: string;
  build?: string;
}

export interface Location {
  timestamp: string;
  event: "Location";
  StarSystem: string;
  SystemAddress?: ID;
  StarPos: [number, number, number];
  Body?: string;
  BodyID?: number;
  BodyType?: string;
  Docked?: boolean;
  StationName?: string;
  StationType?: string;
  MarketID?: ID;
  Factions?: FactionState[];
  SystemAllegiance?: string;
  SystemEconomy?: string;
  SystemSecondEconomy?: string;
  SystemGovernment?: string;
  SystemSecurity?: string;
  Population?: number;
  PowerplayState?: string;
  Powers?: string[];
  Conflicts?: Conflict[];
  ThargoidWar?: ThargoidWarInfo;
  Taxoname?: string;
}

export interface FSDJump {
  timestamp: string;
  event: "FSDJump";
  StarSystem: string;
  SystemAddress?: ID;
  StarPos: [number, number, number];
  SystemAllegiance?: string;
  SystemEconomy?: string;
  SystemSecondEconomy?: string;
  SystemGovernment?: string;
  SystemSecurity?: string;
  Population?: number;
  PowerplayState?: string;
  Powers?: string[];
  JumpDist: number;
  FuelUsed?: number;
  FuelLevel?: number;
  BoostUsed?: number;
  Factions?: FactionState[];
  Conflicts?: Conflict[];
  ThargoidWar?: ThargoidWarInfo;
  Body?: string;
  BodyID?: number;
  BodyType?: string;
  Taxoname?: string;
}

export interface Docked {
  timestamp: string;
  event: "Docked";
  StationName: string;
  StationType: string;
  StarSystem: string;
  SystemAddress?: ID;
  MarketID?: ID;
  StationServices?: string[];
  StationEconomy?: string;
  StationEconomies?: StationEconomy[];
  StationAllegiance?: string;
  StationGovernment?: string;
  StationState?: string;
  LandingPads?: LandingPads;
  CockpitBreach?: boolean;
  Wanted?: boolean;
  ActiveFine?: boolean;
  DistFromStarLS?: number;
  PowerplayState?: string;
  Powers?: string[];
  Conflicts?: Conflict[];
  ThargoidWar?: ThargoidWarInfo;
  Factions?: FactionState[];
  Taxoname?: string;
}

export interface Undocked {
  timestamp: string;
  event: "Undocked";
  StationName: string;
  StationType: string;
  MarketID?: ID;
}

export interface Scan {
  timestamp: string;
  event: "Scan";
  BodyName: string;
  BodyID: number;
  DistanceFromArrivalLS: number;
  StarSystem: string;
  SystemAddress?: ID;
  StarPos?: [number, number, number];
  WasDiscovered?: boolean;
  WasMapped?: boolean;
  Parents?: ParentBody[];
  Rings?: Ring[];
  AtmosphereType?: string;
  AtmosphereComposition?: AtmosphereComposition[];
  Volcanism?: string;
  SurfaceGravity?: number;
  SurfaceTemperature?: number;
  SurfacePressure?: number;
  Landable?: boolean;
  TerraformingState?: string;
  PlanetClass?: string;
  Composition?: Composition;
  Materials?: Record<string, number>;
  Radius?: number;
  MassEM?: number;
  SemiMajorAxis?: number;
  Eccentricity?: number;
  OrbitalInclination?: number;
  Periapsis?: number;
  OrbitalPeriod?: number;
  RotationPeriod?: number;
  AxialTilt?: number;
  TidalLock?: boolean;
  StarType?: string;
  StellarMass?: number;
  StellarRadius?: number;
  AbsoluteMagnitude?: number;
  Age_MY?: number;
  Luminosity?: string;
  Subclass?: number;
  WasDiscoveredByName?: boolean;
  WasMappedByName?: boolean;
  ScanType?: string;
}

export interface SupercruiseEntry {
  timestamp: string;
  event: "SupercruiseEntry";
  StarSystem?: string;
  SystemAddress?: ID;
}

export interface SupercruiseExit {
  timestamp: string;
  event: "SupercruiseExit";
  StarSystem: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
  BodyType?: string;
}

export interface Touchdown {
  timestamp: string;
  event: "Touchdown";
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
  OnPlanet?: boolean;
  OnStation?: boolean;
  Latitude?: number;
  Longitude?: number;
  PlayerControlled?: boolean;
}

export interface Liftoff {
  timestamp: string;
  event: "Liftoff";
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
  OnPlanet?: boolean;
  OnStation?: boolean;
  Latitude?: number;
  Longitude?: number;
  PlayerControlled?: boolean;
}

export interface StartJump {
  timestamp: string;
  event: "StartJump";
  JumpType: "Hyperspace" | "Supercruise";
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
}

export interface FuelScoop {
  timestamp: string;
  event: "FuelScoop";
  Scooped: number;
  Total: number;
}

export interface MaterialCollected {
  timestamp: string;
  event: "MaterialCollected";
  Category: "Raw" | "Manufactured" | "Encoded";
  Name: string;
  Name_Localised?: string;
  Count?: number;
}

export interface MaterialDiscarded {
  timestamp: string;
  event: "MaterialDiscarded";
  Category: "Raw" | "Manufactured" | "Encoded";
  Name: string;
  Name_Localised?: string;
  Count: number;
}

export interface MaterialDiscovered {
  timestamp: string;
  event: "MaterialDiscovered";
  Category: "Raw" | "Manufactured" | "Encoded";
  Name: string;
  Name_Localised?: string;
  DiscoveryNumber?: number;
}

export interface MaterialTrade {
  timestamp: string;
  event: "MaterialTrade";
  MarketID?: ID;
  TraderType?: string;
  Traded: {
    Material: string;
    Material_Localised?: string;
    Category: string;
    Category_Localised?: string;
    Quantity: number;
  };
  Received: {
    Material: string;
    Material_Localised?: string;
    Category: string;
    Category_Localised?: string;
    Quantity: number;
  };
}

export interface EngineerCraft {
  timestamp: string;
  event: "EngineerCraft";
  Engineer: string;
  EngineerID?: number;
  Blueprint: string;
  BlueprintID?: number;
  Level: number;
  Quality?: number;
  ExperimentalEffect?: string;
  ExperimentalEffect_Localised?: string;
  Ingredients?: { Name: string; Name_Localised?: string; Quantity: number }[];
  Modifiers?: Modifier[];
}

export interface EngineerApply {
  timestamp: string;
  event: "EngineerApply";
  Engineer: string;
  Blueprint?: string;
  BlueprintID?: number;
  Level?: number;
}

export interface EngineerProgress {
  timestamp: string;
  event: "EngineerProgress";
  Engineers?: {
    Engineer: string;
    EngineerID?: number;
    Progress: "Unlocked" | "Invited" | "Known" | "AlreadyKnown";
    RankProgress?: number;
    Rank?: number;
  }[];
}

export interface Synthesis {
  timestamp: string;
  event: "Synthesis";
  Name: string;
  Name_Localised?: string;
  Materials?: { Name: string; Name_Localised?: string; Count: number }[];
}

export interface Bounty {
  timestamp: string;
  event: "Bounty";
  Target?: string;
  Target_Localised?: string;
  TotalReward?: number;
  VictimFaction?: string;
  SharedWithOthers?: number;
  Faction?: string;
  Rewards?: {
    Faction: string;
    Reward: number;
    VictimFaction?: string;
    Legacy?: number;
  }[];
}

export interface Promotion {
  timestamp: string;
  event: "Promotion";
  Combat?: number;
  Trade?: number;
  Explore?: number;
  CQC?: number;
  Empire?: number;
  Federation?: number;
  Soldier?: number;
  Exobiologist?: number;
}

export interface Progress {
  timestamp: string;
  event: "Progress";
  Combat?: number;
  Trade?: number;
  Explore?: number;
  CQC?: number;
  Empire?: number;
  Federation?: number;
  Soldier?: number;
  Exobiologist?: number;
}

export interface Rank {
  timestamp: string;
  event: "Rank";
  Combat?: number;
  Trade?: number;
  Explore?: number;
  CQC?: number;
  Empire?: number;
  Federation?: number;
  Soldier?: number;
  Exobiologist?: number;
}

export interface CommitCrime {
  timestamp: string;
  event: "CommitCrime";
  CrimeType?: string;
  Faction?: string;
  Fine?: number;
  Bounty?: number;
  Victim?: string;
  Victim_Localised?: string;
}

export interface RedeemVoucher {
  timestamp: string;
  event: "RedeemVoucher";
  Type: "bounty" | "combatbond" | "settlement" | "scannable" | "codewh";
  Amount: number;
  Factions?: { Faction: string; Amount: number }[];
}

export interface MissionAccepted {
  timestamp: string;
  event: "MissionAccepted";
  MissionID: number;
  Name: string;
  Name_Localised?: string;
  PassengerMission?: boolean;
  Expiry?: string;
  Influence?: string;
  Reputation?: string;
  Reward?: number;
  Commodity?: string;
  Commodity_Localised?: string;
  Count?: number;
  TargetFaction?: string;
  DestinationSystem?: string;
  DestinationStation?: string;
  Target?: string;
  Target_Localised?: string;
  TargetType?: string;
  TargetType_Localised?: string;
  KillCount?: number;
  Faction: string;
  Wing?: boolean;
  Donation?: string;
  Donated?: number;
  LocalisedName?: string;
  TargetCommodity?: string;
  TargetCommodity_Localised?: string;
  MinJumps?: number;
  PassengerCount?: number;
  PassengerVIPs?: boolean;
  PassengerWanted?: boolean;
  PassengerType?: string;
  InfluenceGain?: string;
  ReputationGain?: string;
  MaterialsRequired?: {
    Name: string;
    Name_Localised?: string;
    Category: string;
    Category_Localised?: string;
    Count: number;
  }[];
  CommodityReward?: { Name: string; Name_Localised?: string; Count: number }[];
}

export interface MissionCompleted {
  timestamp: string;
  event: "MissionCompleted";
  MissionID: number;
  Name: string;
  Name_Localised?: string;
  Faction: string;
  Commodity?: string;
  Commodity_Localised?: string;
  Count?: number;
  TargetFaction?: string;
  Reward?: number;
  Donation?: string;
  Donated?: number;
  PermitsAwarded?: { Permit: string }[];
  CommodityReward?: { Name: string; Name_Localised?: string; Count: number }[];
  MaterialsReward?: {
    Name: string;
    Name_Localised?: string;
    Category: string;
    Category_Localised?: string;
    Count: number;
  }[];
  FactionEffect?: {
    Faction: string;
    Effects?: { Effect: string; Effect_Localised?: string; Trend?: string }[];
    Influence?: { SystemAddress?: number; Trend?: string; Influence?: string };
    Reputation?: string;
    ReputationTrend?: string;
  }[];
  DestinationSystem?: string;
  DestinationStation?: string;
  KillCount?: number;
  RewardDetail?: string;
  RewardDetail_Localised?: string;
}

export interface MissionFailed {
  timestamp: string;
  event: "MissionFailed";
  MissionID: number;
  Name: string;
  Name_Localised?: string;
  Faction: string;
  Fine?: number;
}

export interface MissionAbandoned {
  timestamp: string;
  event: "MissionAbandoned";
  MissionID: number;
  Name: string;
  Name_Localised?: string;
  Fine?: number;
}

export interface MissionRedirected {
  timestamp: string;
  event: "MissionRedirected";
  MissionID: number;
  Name: string;
  Name_Localised?: string;
  NewDestinationStation?: string;
  NewDestinationSystem?: string;
  OldDestinationStation?: string;
  OldDestinationSystem?: string;
}

export interface CommunityGoal {
  timestamp: string;
  event: "CommunityGoal";
  CurrentGoals: {
    CGID: number;
    Title: string;
    Title_Localised?: string;
    SystemName: string;
    MarketName: string;
    Expiry: string;
    IsComplete: boolean;
    CurrentTotal: number;
    PlayerContribution: number;
    NumContributors: number;
    TopRankSize: number;
    TopTier?: {
      Name: string;
      Name_Localised?: string;
      Bonus: string;
      Bonus_Localised?: string;
    };
    TierReached?: string;
    PlayerPercentileBand?: number;
    Bonus?: number;
  }[];
}

export interface CommunityGoalJoin {
  timestamp: string;
  event: "CommunityGoalJoin";
  CGID: number;
  Name: string;
  Name_Localised?: string;
  SystemName: string;
  MarketName: string;
}

export interface CommunityGoalReward {
  timestamp: string;
  event: "CommunityGoalReward";
  CGID: number;
  Name: string;
  Name_Localised?: string;
  SystemName: string;
  MarketName: string;
  Reward: number;
  DetailReward?: number;
}

export interface CommunityGoalDiscard {
  timestamp: string;
  event: "CommunityGoalDiscard";
  CGID: number;
  Name: string;
  Name_Localised?: string;
  SystemName: string;
  MarketName: string;
}

export interface Screenshot {
  timestamp: string;
  event: "Screenshot";
  Filename: string;
  Width: number;
  Height: number;
  System?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
  Latitude?: number;
  Longitude?: number;
  Heading?: number;
  Altitude?: number;
}

export interface Music {
  timestamp: string;
  event: "Music";
  MusicTrack: string;
}

export interface SendText {
  timestamp: string;
  event: "SendText";
  To?: string;
  To_Localised?: string;
  Message: string;
  Sent?: boolean;
}

export interface ReceiveText {
  timestamp: string;
  event: "ReceiveText";
  From?: string;
  From_Localised?: string;
  Message: string;
  Message_Localised?: string;
  Channel?: string;
}

export interface LaunchFighter {
  timestamp: string;
  event: "LaunchFighter";
  Loadout: string;
  Loadout_Localised?: string;
  PlayerControlled: boolean;
}

export interface LaunchSRV {
  timestamp: string;
  event: "LaunchSRV";
  Loadout: string;
  Loadout_Localised?: string;
  PlayerControlled: boolean;
  ID?: number;
}

export interface DockFighter {
  timestamp: string;
  event: "DockFighter";
  ID?: number;
}

export interface DockSRV {
  timestamp: string;
  event: "DockSRV";
  ID?: number;
}

export interface FighterDestroyed {
  timestamp: string;
  event: "FighterDestroyed";
  ID?: number;
}

export interface SRVDestroyed {
  timestamp: string;
  event: "SRVDestroyed";
  ID?: number;
}

export interface HullDamage {
  timestamp: string;
  event: "HullDamage";
  Health?: number;
  PlayerPilot?: boolean;
  Fighter?: boolean;
}

export interface ShieldState {
  timestamp: string;
  event: "ShieldState";
  ShieldsUp: boolean;
}

export interface HeatWarning {
  timestamp: string;
  event: "HeatWarning";
}

export interface HeatDamage {
  timestamp: string;
  event: "HeatDamage";
}

export interface FuelStatus {
  FuelMain: number;
  FuelReservoir: number;
}

export interface SelfDestruct {
  timestamp: string;
  event: "SelfDestruct";
}

export interface Died {
  timestamp: string;
  event: "Died";
  KillerName?: string;
  KillerName_Localised?: string;
  KillerShip?: string;
  KillerRank?: string;
  Killers?: {
    Name: string;
    Name_Localised?: string;
    Ship: string;
    Rank: string;
  }[];
}

export interface Resurrect {
  timestamp: string;
  event: "Resurrect";
  Option: string;
  Cost: number;
  Bankrupt?: boolean;
}

export interface ApproachBody {
  timestamp: string;
  event: "ApproachBody";
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
}

export interface LeaveBody {
  timestamp: string;
  event: "LeaveBody";
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
}

export interface NavBeaconScan {
  timestamp: string;
  event: "NavBeaconScan";
  SystemAddress?: ID;
  NumBodies: number;
}

export interface FSSSignalDiscovered {
  timestamp: string;
  event: "FSSSignalDiscovered";
  SystemAddress?: ID;
  SignalName: string;
  SignalName_Localised?: string;
  USSType?: string;
  USSType_Localised?: string;
  SpawningState?: string;
  SpawningFaction?: string;
  ThargoidWar?: string;
}

export interface FSSBodySignals {
  timestamp: string;
  event: "FSSBodySignals";
  SystemAddress?: ID;
  BodyName: string;
  BodyID: number;
  Signals?: { Type: string; Type_Localised?: string; Count: number }[];
}

export interface SAASignalsFound {
  timestamp: string;
  event: "SAASignalsFound";
  SystemAddress?: ID;
  BodyName: string;
  BodyID: number;
  Signals?: { Type: string; Type_Localised?: string; Count: number }[];
  Genuses?: { Genus: string; Genus_Localised?: string }[];
}

export interface CodexEntry {
  timestamp: string;
  event: "CodexEntry";
  System?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
  Name: string;
  Name_Localised?: string;
  Category: string;
  Category_Localised?: string;
  SubCategory: string;
  SubCategory_Localised?: string;
  Region: string;
  Region_Localised?: string;
  NearestDestination?: string;
  NearestDestination_Localised?: string;
  VoucherAmount?: number;
  Latitude?: number;
  Longitude?: number;
}

export interface PlanetApproach {
  timestamp: string;
  event: "PlanetApproach";
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
}

export interface SAAscanComplete {
  timestamp: string;
  event: "SAAscanComplete";
  SystemAddress?: ID;
  BodyName: string;
  BodyID: number;
  ProbesUsed: number;
  EfficiencyTarget: number;
}

export interface DockingRequested {
  timestamp: string;
  event: "DockingRequested";
  StationName?: string;
  StationType?: string;
  MarketID?: ID;
  LandingPad?: number;
}

export interface DockingGranted {
  timestamp: string;
  event: "DockingGranted";
  StationName: string;
  StationType: string;
  MarketID?: ID;
  LandingPad: number;
}

export interface DockingDenied {
  timestamp: string;
  event: "DockingDenied";
  StationName: string;
  StationType?: string;
  MarketID?: ID;
  Reason: string;
}

export interface DockingCancelled {
  timestamp: string;
  event: "DockingCancelled";
  StationName: string;
  MarketID?: ID;
}

export interface DockingTimeout {
  timestamp: string;
  event: "DockingTimeout";
  StationName: string;
  MarketID?: ID;
}

export interface Undocking {
  timestamp: string;
  event: "Undocking";
  StationName?: string;
  MarketID?: ID;
}

export interface CarrierJump {
  timestamp: string;
  event: "CarrierJump";
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
}

export interface CarrierJumpRequest {
  timestamp: string;
  event: "CarrierJumpRequest";
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
  DepartureTime?: string;
}

export interface CarrierBuy {
  timestamp: string;
  event: "CarrierBuy";
  CarrierID?: number;
  Location?: string;
  SystemAddress?: ID;
  Price: number;
  Variant?: string;
  Callsign?: string;
}

export interface CarrierSell {
  timestamp: string;
  event: "CarrierSell";
  CarrierID?: number;
  Location?: string;
  SystemAddress?: ID;
  Price: number;
  Callsign?: string;
}

export interface CarrierStats {
  timestamp: string;
  event: "CarrierStats";
  CarrierID: number;
  Callsign: string;
  Name: string;
  Name_Localised?: string;
  DockingAccess?: string;
  AllowNotorious?: boolean;
  FuelLevel?: number;
  JumpRangeCurr?: number;
  JumpRangeMax?: number;
  PendingDecommision?: boolean;
  SpaceAccess?: string;
  Shipyard?: boolean;
  Outfitting?: boolean;
  Rearm?: boolean;
  Refuel?: boolean;
  Repair?: boolean;
  Market?: boolean;
  VoucherMarket?: boolean;
  ExoBiology?: boolean;
  VoucherExploration?: boolean;
  VoucherTrade?: boolean;
  Theme?: string;
  Pack?: {
    PackTheme: string;
    PackTheme_Localised?: string;
    PackTier: number;
  }[];
}

export interface CarrierFinance {
  timestamp: string;
  event: "CarrierFinance";
  CarrierID: number;
  ReserveBalance: number;
  AvailableBalance: number;
  ReservePercent: number;
  TaxRate: number;
}

export interface CarrierShipPack {
  timestamp: string;
  event: "CarrierShipPack";
  CarrierID?: number;
  Operation: "BuyPack" | "SellPack";
  PackTheme: string;
  PackTheme_Localised?: string;
  PackTier: number;
  Cost?: number;
}

export interface CarrierModulePack {
  timestamp: string;
  event: "CarrierModulePack";
  CarrierID?: number;
  Operation: "BuyPack" | "SellPack";
  PackTheme: string;
  PackTheme_Localised?: string;
  PackTier: number;
  Cost?: number;
}

export interface CarrierTradeOrder {
  timestamp: string;
  event: "CarrierTradeOrder";
  CarrierID?: number;
  BlackMarket?: boolean;
  Commodity?: string;
  Commodity_Localised?: string;
  PurchaseOrder?: number;
  SaleOrder?: number;
  CancelTrade?: boolean;
  Price?: number;
  Stock?: number;
}

export interface CarrierDeploy {
  timestamp: string;
  event: "CarrierDeploy";
  CarrierID?: number;
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
}

export interface CarrierNameChange {
  timestamp: string;
  event: "CarrierNameChange";
  CarrierID?: number;
  Callsign?: string;
  Name: string;
  Name_Localised?: string;
}

export interface CarrierCrewService {
  timestamp: string;
  event: "CarrierCrewService";
  CarrierID?: number;
  Operation: "Activate" | "Deactivate";
  CrewRole?: string;
  CrewName?: string;
}

export interface CarrierBankTransfer {
  timestamp: string;
  event: "CarrierBankTransfer";
  CarrierID?: number;
  Deposit?: number;
  Withdraw?: number;
  PlayerBalance?: number;
  CarrierBalance?: number;
}

export interface ShipTargeted {
  timestamp: string;
  event: "ShipTargeted";
  TargetLocked: boolean;
  Ship?: string;
  Ship_Localised?: string;
  ScanStage?: number;
  PilotName?: string;
  PilotName_Localised?: string;
  PilotRank?: string;
  ShieldHealth?: number;
  HullHealth?: number;
  Faction?: string;
  LegalStatus?: string;
  SquadronID?: number;
  Power?: string;
}

export interface CapShipBond {
  timestamp: string;
  event: "CapShipBond";
  AwardingFaction: string;
  AwardingFaction_Localised?: string;
  VictimFaction: string;
  VictimFaction_Localised?: string;
  Amount: number;
  PlayerPilot?: boolean;
  Fighter?: boolean;
}

export interface FactionKillBond {
  timestamp: string;
  event: "FactionKillBond";
  AwardingFaction: string;
  AwardingFaction_Localised?: string;
  VictimFaction: string;
  VictimFaction_Localised?: string;
  Amount: number;
}

export interface PVPKill {
  timestamp: string;
  event: "PVPKill";
  Victim: string;
  Victim_Localised?: string;
  CombatRank?: number;
}

export interface PayFines {
  timestamp: string;
  event: "PayFines";
  Amount: number;
  AllFines?: boolean;
  BrokerPercentage?: number;
}

export interface PayLegacyFines {
  timestamp: string;
  event: "PayLegacyFines";
  Amount: number;
  BrokerPercentage?: number;
}

export interface CollectItems {
  timestamp: string;
  event: "CollectItems";
  Name: string;
  Name_Localised?: string;
  Type?: string;
  OwnerID?: number;
  MissionID?: number;
  Stolen?: boolean;
}

export interface EjectCargo {
  timestamp: string;
  event: "EjectCargo";
  Type: string;
  Type_Localised?: string;
  Count: number;
  Abandoned?: boolean;
  MissionID?: number;
  Powerplay?: boolean;
}

export interface MiningRefined {
  timestamp: string;
  event: "MiningRefined";
  Type: string;
  Type_Localised?: string;
  Commodity_Localised?: string;
}

export interface ProspectedAsteroid {
  timestamp: string;
  event: "ProspectedAsteroid";
  Materials?: { Name: string; Name_Localised?: string; Proportion: number }[];
  Content: string;
  Content_Localised?: string;
  Remaining: number;
  MotherlodeMaterial?: string;
  MotherlodeMaterial_Localised?: string;
  MotherlodeProportion?: number;
}

export interface ReservoirReplenished {
  timestamp: string;
  event: "ReservoirReplenished";
  FuelMain: number;
  FuelReservoir: number;
}

export interface RefuelPartial {
  timestamp: string;
  event: "RefuelPartial";
  Cost: number;
  Amount: number;
}

export interface RefuelAll {
  timestamp: string;
  event: "RefuelAll";
  Cost: number;
  Amount: number;
}

export interface Repair {
  timestamp: string;
  event: "Repair";
  Item: string;
  Item_Localised?: string;
  Cost: number;
}

export interface RepairAll {
  timestamp: string;
  event: "RepairAll";
  Cost: number;
}

export interface BuyAmmo {
  timestamp: string;
  event: "BuyAmmo";
  Cost: number;
}

export interface BuyDrones {
  timestamp: string;
  event: "BuyDrones";
  Type: string;
  Type_Localised?: string;
  Count: number;
  BuyPrice: number;
  TotalCost: number;
}

export interface SellDrones {
  timestamp: string;
  event: "SellDrones";
  Type: string;
  Type_Localised?: string;
  Count: number;
  SellPrice: number;
  TotalSale: number;
}

export interface BuyTradeData {
  timestamp: string;
  event: "BuyTradeData";
  System?: string;
  Cost: number;
}

export interface Market {
  timestamp: string;
  event: "Market";
  MarketID: ID;
  StationName: string;
  StationType: string;
  StarSystem: string;
  SystemAddress?: ID;
  CarrierDockingAccess?: string;
  Items: CommodityItem[];
}

export interface MarketBuy {
  timestamp: string;
  event: "MarketBuy";
  MarketID?: ID;
  Type: string;
  Type_Localised?: string;
  Count: number;
  BuyPrice: number;
  TotalCost: number;
}

export interface MarketSell {
  timestamp: string;
  event: "MarketSell";
  MarketID?: ID;
  Type: string;
  Type_Localised?: string;
  Count: number;
  SellPrice: number;
  TotalSale: number;
  AvgPricePaid?: number;
  Stolen?: boolean;
  IllegalGoods?: boolean;
  BlackMarket?: boolean;
}

export interface BuyExplorationData {
  timestamp: string;
  event: "BuyExplorationData";
  System?: string;
  Cost: number;
}

export interface SellExplorationData {
  timestamp: string;
  event: "SellExplorationData";
  Systems?: { Name: string; SystemAddress: ID }[];
  Discovered?: { SystemName: string; NumBodies: number }[];
  BaseValue: number;
  Bonus?: number;
  TotalEarnings: number;
}

export interface DataScanned {
  timestamp: string;
  event: "DataScanned";
  Type: string;
  Type_Localised?: string;
}

export interface AfmuRepairs {
  timestamp: string;
  event: "AfmuRepairs";
  Module: string;
  Module_Localised?: string;
  FullyRepaired?: boolean;
  Health?: number;
}

export interface RebootRepair {
  timestamp: string;
  event: "RebootRepair";
  Modules?: { Module: string; Module_Localised?: string; Slot: string }[];
}

export interface RestockVehicle {
  timestamp: string;
  event: "RestockVehicle";
  Type: string;
  Loadout: string;
  Loadout_Localised?: string;
  Cost: number;
  Count: number;
}

export interface Continued {
  timestamp: string;
  event: "Continued";
  Part: number;
}

export interface Shutdown {
  timestamp: string;
  event: "Shutdown";
}

export interface ModuleInfo {
  timestamp: string;
  event: "ModuleInfo";
  Modules: ModuleItem[];
}

export interface NavRoute {
  timestamp: string;
  event: "NavRoute";
  Route: {
    StarSystem: string;
    SystemAddress?: ID;
    StarPos: [number, number, number];
  }[];
}

export interface NavRouteClear {
  timestamp: string;
  event: "NavRouteClear";
}

export interface SquadronStartup {
  timestamp: string;
  event: "SquadronStartup";
  SquadronName?: string;
  SquadronRank?: string;
  SquadronAlignedPower?: string;
  SquadronHomeSystem?: string;
  SquadronFaction?: string;
  SquadronPowerplayState?: string;
  CurrentRating?: number;
  Rating?: { Name: string; Rank: number }[];
  SquadronID?: number;
}

export interface InvitedToSquadron {
  timestamp: string;
  event: "InvitedToSquadron";
  SquadronName: string;
  InviterName?: string;
  InviterName_Localised?: string;
}

export interface JoinedSquadron {
  timestamp: string;
  event: "JoinedSquadron";
  SquadronName: string;
}

export interface SquadronCreated {
  timestamp: string;
  event: "SquadronCreated";
  SquadronName: string;
}

export interface AppliedToSquadron {
  timestamp: string;
  event: "AppliedToSquadron";
  SquadronName: string;
}

export interface SquadronDemotion {
  timestamp: string;
  event: "SquadronDemotion";
  SquadronName: string;
  OldRank: number;
  NewRank: number;
}

export interface SquadronPromotion {
  timestamp: string;
  event: "SquadronPromotion";
  SquadronName: string;
  OldRank: number;
  NewRank: number;
}

export interface DisbandedSquadron {
  timestamp: string;
  event: "DisbandedSquadron";
  SquadronName: string;
}

export interface LeftSquadron {
  timestamp: string;
  event: "LeftSquadron";
  SquadronName: string;
  OldRank?: number;
}

export interface KickedFromSquadron {
  timestamp: string;
  event: "KickedFromSquadron";
  SquadronName: string;
}

export interface SquadronKicked {
  timestamp: string;
  event: "SquadronKicked";
  SquadronName: string;
  PlayerName?: string;
}

export interface QuitACrew {
  timestamp: string;
  event: "QuitACrew";
  Captain?: string;
}

export interface JoinACrew {
  timestamp: string;
  event: "JoinACrew";
  Captain: string;
  Captain_Localised?: string;
}

export interface ChangeCrewAssignedRole {
  timestamp: string;
  event: "ChangeCrewAssignedRole";
  Role: "Idle" | "FighterCon" | "FireCon" | "Turret";
}

export interface CrewHire {
  timestamp: string;
  event: "CrewHire";
  Name: string;
  Faction?: string;
  Cost: number;
  CombatRank: number;
}

export interface CrewFire {
  timestamp: string;
  event: "CrewFire";
  Name: string;
  CombatRank?: number;
}

export interface CrewLaunchFighter {
  timestamp: string;
  event: "CrewLaunchFighter";
  Crew: string;
  ID?: number;
  Loadout: string;
  Loadout_Localised?: string;
}

export interface CrewRoleRepair {
  timestamp: string;
  event: "CrewRoleRepair";
  CrewID?: number;
}

export interface CrewMemberJoins {
  timestamp: string;
  event: "CrewMemberJoins";
  Crew: string;
  CombatRank?: number;
  Telepresence?: boolean;
}

export interface CrewMemberQuits {
  timestamp: string;
  event: "CrewMemberQuits";
  Crew: string;
  Telepresence?: boolean;
}

export interface CrewMemberRoleChange {
  timestamp: string;
  event: "CrewMemberRoleChange";
  Crew: string;
  Role: "Idle" | "FighterCon" | "FireCon" | "Turret";
  Telepresence?: boolean;
}

export interface KickCrewMember {
  timestamp: string;
  event: "KickCrewMember";
  Crew: string;
  Telepresence?: boolean;
}

export interface EndCrewSession {
  timestamp: string;
  event: "EndCrewSession";
}

export interface WingJoin {
  timestamp: string;
  event: "WingJoin";
  Others?: { Name: string }[];
}

export interface WingLeave {
  timestamp: string;
  event: "WingLeave";
}

export interface WingAdd {
  timestamp: string;
  event: "WingAdd";
  Other: string;
}

export interface WingInvite {
  timestamp: string;
  event: "WingInvite";
  Other: string;
}

export interface Powerplay {
  timestamp: string;
  event: "Powerplay";
  Power: string;
  Rating: number;
  Merits: number;
  Votes: number;
  TimePledged: number;
  PowerplayState?: string;
  Rank?: number;
}

export interface PowerplayJoin {
  timestamp: string;
  event: "PowerplayJoin";
  Power: string;
}

export interface PowerplayLeave {
  timestamp: string;
  event: "PowerplayLeave";
  Power: string;
}

export interface PowerplayDefect {
  timestamp: string;
  event: "PowerplayDefect";
  FromPower: string;
  ToPower: string;
}

export interface PowerplaySalary {
  timestamp: string;
  event: "PowerplaySalary";
  Power: string;
  Amount: number;
}

export interface PowerplayVote {
  timestamp: string;
  event: "PowerplayVote";
  Power: string;
  Votes: number;
  Vote: number;
  Vote_Weighting?: number;
}

export interface PowerplayFastTrack {
  timestamp: string;
  event: "PowerplayFastTrack";
  Power: string;
  Cost: number;
  Amount: number;
}

export interface PowerplayDeliver {
  timestamp: string;
  event: "PowerplayDeliver";
  Power: string;
  Type: string;
  Type_Localised?: string;
  Count: number;
}

export interface ApproachSettlement {
  timestamp: string;
  event: "ApproachSettlement";
  Name?: string;
  Name_Localised?: string;
  MarketID?: ID;
  Body?: string;
  BodyID?: number;
  SystemAddress?: ID;
  Latitude?: number;
  Longitude?: number;
}

export interface ScanOrganic {
  timestamp: string;
  event: "ScanOrganic";
  ScanType: "Basic" | "Analyse" | "Sample";
  Genus: string;
  Genus_Localised?: string;
  Species: string;
  Species_Localised?: string;
  Variant?: string;
  Variant_Localised?: string;
  System: string;
  SystemAddress?: ID;
  Body: number;
  Latitude?: number;
  Longitude?: number;
}

export interface SellOrganicData {
  timestamp: string;
  event: "SellOrganicData";
  MarketID?: ID;
  BioData: {
    Genus: string;
    Genus_Localised?: string;
    Species: string;
    Species_Localised?: string;
    Variant?: string;
    Variant_Localised?: string;
    Bonus?: number;
    TotalBonus?: number;
    Value?: number;
    TotalValue?: number;
    Vendor?: string;
    Vendor_Localised?: string;
  }[];
}

export interface Backpack {
  timestamp: string;
  event: "Backpack";
  Items?: {
    Name: string;
    Name_Localised?: string;
    Count: number;
    OwnerID?: number;
    MissionID?: number;
    Type?: string;
    LocType?: string;
  }[];
  Components?: { Name: string; Name_Localised?: string; Count: number }[];
  Consumables?: { Name: string; Name_Localised?: string; Count: number }[];
  Data?: { Name: string; Name_Localised?: string; Count: number }[];
}

export interface BackpackChange {
  timestamp: string;
  event: "BackpackChange";
  Type: number;
  Total?: number;
  Added?: {
    Name: string;
    Name_Localised?: string;
    OwnerID?: number;
    MissionID?: number;
    Count: number;
    Type?: string;
  }[];
  Removed?: {
    Name: string;
    Name_Localised?: string;
    OwnerID?: number;
    MissionID?: number;
    Count: number;
    Type?: string;
  }[];
}

export interface ShipLocker {
  timestamp: string;
  event: "ShipLocker";
  Items?: {
    Name: string;
    Name_Localised?: string;
    Count: number;
    OwnerID?: number;
    MissionID?: number;
    Type?: string;
  }[];
  Components?: { Name: string; Name_Localised?: string; Count: number }[];
  Consumables?: { Name: string; Name_Localised?: string; Count: number }[];
  Data?: { Name: string; Name_Localised?: string; Count: number }[];
}

export interface ShipLockerMaterials {
  timestamp: string;
  event: "ShipLockerMaterials";
  Items?: { Name: string; Name_Localised?: string; Count: number }[];
  Components?: { Name: string; Name_Localised?: string; Count: number }[];
  Consumables?: { Name: string; Name_Localised?: string; Count: number }[];
  Data?: { Name: string; Name_Localised?: string; Count: number }[];
}

export interface FCMaterials {
  timestamp: string;
  event: "FCMaterials";
  Items?: { Name: string; Name_Localised?: string; Count: number }[];
  Components?: { Name: string; Name_Localised?: string; Count: number }[];
  Consumables?: { Name: string; Name_Localised?: string; Count: number }[];
  Data?: { Name: string; Name_Localised?: string; Count: number }[];
}

export interface FCMaterialsCAPI {
  timestamp: string;
  event: "FCMaterialsCAPI";
  MarketID?: ID;
  CarrierName?: string;
  CarrierName_Localised?: string;
  Items?: { Name: string; Name_Localised?: string; Count: number }[];
  Components?: { Name: string; Name_Localised?: string; Count: number }[];
  Consumables?: { Name: string; Name_Localised?: string; Count: number }[];
  Data?: { Name: string; Name_Localised?: string; Count: number }[];
}

export interface CollectMicroResources {
  timestamp: string;
  event: "CollectMicroResources";
  Items?: {
    Name: string;
    Name_Localised?: string;
    OwnerID?: number;
    MissionID?: number;
    Count: number;
    Type?: string;
  }[];
}

export interface UseConsumable {
  timestamp: string;
  event: "UseConsumable";
  Consumable: string;
  Consumable_Localised?: string;
  Type?: string;
}

export interface CreateSuitLoadout {
  timestamp: string;
  event: "CreateSuitLoadout";
  SuitID?: number;
  SuitName?: string;
  SuitName_Localised?: string;
  LoadoutName?: string;
  SuitMods?: string[];
  Modules?: {
    SlotName: string;
    SuitModuleID?: number;
    ModuleName: string;
    ModuleName_Localised?: string;
  }[];
}

export interface DeleteSuitLoadout {
  timestamp: string;
  event: "DeleteSuitLoadout";
  SuitID?: number;
  SuitName?: string;
  SuitName_Localised?: string;
  LoadoutName?: string;
  LoadoutID?: number;
}

export interface RenameSuitLoadout {
  timestamp: string;
  event: "RenameSuitLoadout";
  SuitID?: number;
  SuitName?: string;
  SuitName_Localised?: string;
  LoadoutName?: string;
  LoadoutID?: number;
  PreviousLoadoutName?: string;
}

export interface SwitchSuitLoadout {
  timestamp: string;
  event: "SwitchSuitLoadout";
  SuitID?: number;
  SuitName?: string;
  SuitName_Localised?: string;
  LoadoutName?: string;
  LoadoutID?: number;
  Modules?: {
    SlotName: string;
    SuitModuleID?: number;
    ModuleName: string;
    ModuleName_Localised?: string;
  }[];
}

export interface UpgradeSuit {
  timestamp: string;
  event: "UpgradeSuit";
  Name: string;
  Name_Localised?: string;
  SuitID?: number;
  Class: number;
  Cost: number;
}

export interface UpgradeWeapon {
  timestamp: string;
  event: "UpgradeWeapon";
  Name: string;
  Name_Localised?: string;
  WeaponID?: number;
  Class: number;
  Cost: number;
}

export interface BuySuit {
  timestamp: string;
  event: "BuySuit";
  Name: string;
  Name_Localised?: string;
  SuitID?: number;
  Price: number;
  SuitMods?: string[];
}

export interface SellSuit {
  timestamp: string;
  event: "SellSuit";
  Name: string;
  Name_Localised?: string;
  SuitID?: number;
  Price: number;
}

export interface BuyWeapon {
  timestamp: string;
  event: "BuyWeapon";
  Name: string;
  Name_Localised?: string;
  WeaponID?: number;
  Price: number;
}

export interface SellWeapon {
  timestamp: string;
  event: "SellWeapon";
  Name: string;
  Name_Localised?: string;
  WeaponID?: number;
  Price: number;
}

export interface Disembark {
  timestamp: string;
  event: "Disembark";
  SRV?: boolean;
  Taxi?: boolean;
  Multicrew?: boolean;
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
  OnStation?: boolean;
  OnPlanet?: boolean;
  StationName?: string;
  StationType?: string;
  MarketID?: ID;
}

export interface Embark {
  timestamp: string;
  event: "Embark";
  SRV?: boolean;
  Taxi?: boolean;
  Multicrew?: boolean;
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
  OnStation?: boolean;
  OnPlanet?: boolean;
  StationName?: string;
  StationType?: string;
  MarketID?: ID;
}

export interface BookTaxi {
  timestamp: string;
  event: "BookTaxi";
  Cost: number;
  DestinationSystem: string;
  DestinationStation?: string;
  DestinationLocation?: string;
}

export interface CancelTaxi {
  timestamp: string;
  event: "CancelTaxi";
  Refund: number;
}

export interface DropShipDeploy {
  timestamp: string;
  event: "DropShipDeploy";
  StarSystem?: string;
  SystemAddress?: ID;
  Body?: string;
  BodyID?: number;
  OnStation?: boolean;
  OnPlanet?: boolean;
  StationName?: string;
  StationType?: string;
  MarketID?: ID;
}

export interface TradeMicroResources {
  timestamp: string;
  event: "TradeMicroResources";
  Offered?: { Name: string; Name_Localised?: string; Count: number }[];
  Received?: { Name: string; Name_Localised?: string; Count: number }[];
  MarketID?: ID;
}

export interface TransferMicroResources {
  timestamp: string;
  event: "TransferMicroResources";
  Transfers?: {
    Name: string;
    Name_Localised?: string;
    Count: number;
    Direction: "ToBackpack" | "ToShipLocker";
  }[];
}

export interface BuyMicroResources {
  timestamp: string;
  event: "BuyMicroResources";
  Name: string;
  Name_Localised?: string;
  Count: number;
  Cost: number;
  Category?: string;
  Category_Localised?: string;
  MarketID?: ID;
}

export interface Status {
  timestamp: string;
  event: "Status";
  Flags: number;
  Flags2?: number;
  Pips: [number, number, number];
  FireGroup: number;
  GuiFocus: number;
  Fuel: FuelStatus;
  Cargo: number;
  LegalState?: string;
  Latitude?: number;
  Longitude?: number;
  Heading?: number;
  Altitude?: number;
  BodyName?: string;
  PlanetRadius?: number;
  Balance?: number;
  Destination?: DestinationStatus;
}

export interface DestinationStatus {
  System: number;
  Body: number;
}

export interface StationEconomy {
  Name: string;
  Share: number;
}

export interface LandingPads {
  Small: number;
  Medium: number;
  Large: number;
}

export interface FactionState {
  Name: string;
  FactionState: string;
  Government: string;
  Influence: number;
  Allegiance: string;
  Happiness?: string;
  Happiness_Localised?: string;
  MyReputation?: number;
  SquadronFaction?: boolean;
  ActiveStates?: StateTimeline[];
  PendingStates?: StateTimeline[];
  RecoveringStates?: StateTimeline[];
}

export interface StateTimeline {
  State: string;
  Trend?: number;
}

export interface Conflict {
  WarType: string;
  Status: string;
  Faction1: ConflictFaction;
  Faction2: ConflictFaction;
}

export interface ConflictFaction {
  Name: string;
  Stake: string;
  WonDays: number;
}

export interface ThargoidWarInfo {
  WarType?: string;
  RemainingPorts?: number;
  SuccessReached?: boolean;
  EstimatedRemainingTime?: string;
}

export interface CommodityItem {
  Name: string;
  Name_Localised?: string;
  BuyPrice: number;
  SellPrice: number;
  MeanPrice: number;
  StockBracket: number;
  DemandBracket: number;
  Stock: number;
  Demand: number;
  StatusFlags: string;
}

export interface ParentBody {
  Star?: number;
  Planet?: number;
  Null?: number;
}

export interface Ring {
  Name: string;
  RingClass: string;
  MassMT: number;
  InnerRad: number;
  OuterRad: number;
}

export interface AtmosphereComposition {
  Name: string;
  Percent: number;
}

export interface Composition {
  Ice?: number;
  Rock?: number;
  Metal?: number;
}

export interface Mission {
  timestamp: string;
  event: string;
  MissionID: ID;
  Name: string;
  PassengerMission?: boolean;
  Expiry?: string;
  Influence?: string;
  Reputation?: string;
  Reward?: number;
  Wing?: boolean;
  Failed?: boolean;
}

export interface EngineeringMod {
  Engineer: string;
  BlueprintName: string;
  BlueprintID: ID;
  Level: number;
  Quality: number;
  ExperimentalEffect?: string;
  ExperimentalEffect_Localised?: string;
  Modifiers?: Modifier[];
}

export interface Modifier {
  Label: string;
  Value?: number;
  OriginalValue?: number;
  LessIsGood?: boolean;
  ValueStr?: string;
}

export interface ModuleItem {
  Slot: string;
  Item: string;
  Item_Localised?: string;
  On?: boolean;
  Priority: number;
  Health?: number;
  Value?: number;
  Engineering?: EngineeringMod;
  AmmoClip?: number;
  AmmoHopper?: number;
}

export interface ShipItem {
  Ship: string;
  ShipID: number;
  ShipName: string;
  ShipIdent: string;
  Modules?: ModuleItem[];
  FuelCapacity?: {
    Main: number;
    Reserve: number;
  };
  CargoCapacity?: number;
  HullValue?: number;
  ModulesValue?: number;
  Rebuy?: number;
  Hot?: boolean;
  HullHealth?: number;
  UnladenMass?: number;
  MaxJumpRange?: number;
}

export type JournalEvent =
  | FileHeader
  | LoadGame
  | Location
  | FSDJump
  | Docked
  | Undocked
  | Scan
  | Market
  | Status
  | SupercruiseEntry
  | SupercruiseExit
  | Touchdown
  | Liftoff
  | StartJump
  | FuelScoop
  | MaterialCollected
  | MaterialDiscarded
  | MaterialDiscovered
  | MaterialTrade
  | EngineerCraft
  | EngineerApply
  | EngineerProgress
  | Synthesis
  | Bounty
  | Promotion
  | Progress
  | Rank
  | CommitCrime
  | RedeemVoucher
  | MissionAccepted
  | MissionCompleted
  | MissionFailed
  | MissionAbandoned
  | MissionRedirected
  | CommunityGoal
  | CommunityGoalJoin
  | CommunityGoalReward
  | CommunityGoalDiscard
  | Screenshot
  | Music
  | SendText
  | ReceiveText
  | LaunchFighter
  | LaunchSRV
  | DockFighter
  | DockSRV
  | FighterDestroyed
  | SRVDestroyed
  | HullDamage
  | ShieldState
  | HeatWarning
  | HeatDamage
  | SelfDestruct
  | Died
  | Resurrect
  | ApproachBody
  | LeaveBody
  | NavBeaconScan
  | FSSSignalDiscovered
  | FSSBodySignals
  | SAASignalsFound
  | CodexEntry
  | PlanetApproach
  | SAAscanComplete
  | DockingRequested
  | DockingGranted
  | DockingDenied
  | DockingCancelled
  | DockingTimeout
  | Undocking
  | CarrierJump
  | CarrierJumpRequest
  | CarrierBuy
  | CarrierSell
  | CarrierStats
  | CarrierFinance
  | CarrierShipPack
  | CarrierModulePack
  | CarrierTradeOrder
  | CarrierDeploy
  | CarrierNameChange
  | CarrierCrewService
  | CarrierBankTransfer
  | ShipTargeted
  | CapShipBond
  | FactionKillBond
  | PVPKill
  | PayFines
  | PayLegacyFines
  | CollectItems
  | EjectCargo
  | MiningRefined
  | ProspectedAsteroid
  | ReservoirReplenished
  | RefuelPartial
  | RefuelAll
  | Repair
  | RepairAll
  | BuyAmmo
  | BuyDrones
  | SellDrones
  | BuyTradeData
  | MarketBuy
  | MarketSell
  | BuyExplorationData
  | SellExplorationData
  | DataScanned
  | AfmuRepairs
  | RebootRepair
  | RestockVehicle
  | Continued
  | Shutdown
  | ModuleInfo
  | NavRoute
  | NavRouteClear
  | SquadronStartup
  | InvitedToSquadron
  | JoinedSquadron
  | SquadronCreated
  | AppliedToSquadron
  | SquadronDemotion
  | SquadronPromotion
  | DisbandedSquadron
  | LeftSquadron
  | KickedFromSquadron
  | SquadronKicked
  | QuitACrew
  | JoinACrew
  | ChangeCrewAssignedRole
  | CrewHire
  | CrewFire
  | CrewLaunchFighter
  | CrewRoleRepair
  | CrewMemberJoins
  | CrewMemberQuits
  | CrewMemberRoleChange
  | KickCrewMember
  | EndCrewSession
  | WingJoin
  | WingLeave
  | WingAdd
  | WingInvite
  | Powerplay
  | PowerplayJoin
  | PowerplayLeave
  | PowerplayDefect
  | PowerplaySalary
  | PowerplayVote
  | PowerplayFastTrack
  | PowerplayDeliver
  | ApproachSettlement
  | ScanOrganic
  | SellOrganicData
  | Backpack
  | BackpackChange
  | ShipLocker
  | ShipLockerMaterials
  | FCMaterials
  | FCMaterialsCAPI
  | CollectMicroResources
  | UseConsumable
  | CreateSuitLoadout
  | DeleteSuitLoadout
  | RenameSuitLoadout
  | SwitchSuitLoadout
  | UpgradeSuit
  | UpgradeWeapon
  | BuySuit
  | SellSuit
  | BuyWeapon
  | SellWeapon
  | Disembark
  | Embark
  | BookTaxi
  | CancelTaxi
  | DropShipDeploy
  | TradeMicroResources
  | TransferMicroResources
  | BuyMicroResources
  | { timestamp: string; event: string; [key: string]: unknown };

export interface JournalPosition {
  file: string;
  offset: number;
  line: number;
}

export interface JournalOptions {
  directory?: string;
  position?: "start" | "end" | JournalPosition;
  watch?: boolean;
}

export const JOURNAL_DIRECTORY =
  "Saved Games/Frontier Developments/Elite Dangerous";
