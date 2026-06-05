# Generated code – do not edit manually
# pylint: disable=too-many-lines,missing-class-docstring
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional, Any


@dataclass
class AfmuRepairs:
    timestamp: str
    event: str = field(default="AfmuRepairs")
    FullyRepaired: Optional[bool] = None
    Health: Optional[float] = None
    Module: Optional[str] = None
    Module_Localised: Optional[str] = None

@dataclass
class AppliedToSquadron:
    timestamp: str
    event: str = field(default="AppliedToSquadron")
    SquadronName: Optional[str] = None

@dataclass
class ApproachBody:
    timestamp: str
    event: str = field(default="ApproachBody")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class ApproachSettlement:
    timestamp: str
    event: str = field(default="ApproachSettlement")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    MarketID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class Backpack_Data:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class Backpack_Item:
    Count: Optional[int] = None
    LocType: Optional[str] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    OwnerID: Optional[int] = None
    Type: Optional[str] = None

@dataclass
class Backpack_Component:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class Backpack_Consumable:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class Backpack:
    timestamp: str
    event: str = field(default="Backpack")
    Components: Optional[list[Backpack_Component]] = None
    Consumables: Optional[list[Backpack_Consumable]] = None
    Data: Optional[list[Backpack_Data]] = None
    Items: Optional[list[Backpack_Item]] = None

@dataclass
class BackpackChange_Removed:
    Count: Optional[int] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    OwnerID: Optional[int] = None
    Type: Optional[str] = None

@dataclass
class BackpackChange_Added:
    Count: Optional[int] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    OwnerID: Optional[int] = None
    Type: Optional[str] = None

@dataclass
class BackpackChange:
    timestamp: str
    event: str = field(default="BackpackChange")
    Added: Optional[list[BackpackChange_Added]] = None
    Removed: Optional[list[BackpackChange_Removed]] = None
    Total: Optional[int] = None
    Type: Optional[int] = None

@dataclass
class BookTaxi:
    timestamp: str
    event: str = field(default="BookTaxi")
    Cost: Optional[int] = None
    DestinationLocation: Optional[str] = None
    DestinationStation: Optional[str] = None
    DestinationSystem: Optional[str] = None

@dataclass
class Bounty_Reward:
    Faction: Optional[str] = None
    Legacy: Optional[int] = None
    Reward: Optional[int] = None
    VictimFaction: Optional[str] = None

@dataclass
class Bounty:
    timestamp: str
    event: str = field(default="Bounty")
    Faction: Optional[str] = None
    Rewards: Optional[list[Bounty_Reward]] = None
    SharedWithOthers: Optional[int] = None
    Target: Optional[str] = None
    Target_Localised: Optional[str] = None
    TotalReward: Optional[int] = None
    VictimFaction: Optional[str] = None

@dataclass
class BuyAmmo:
    timestamp: str
    event: str = field(default="BuyAmmo")
    Cost: Optional[int] = None

@dataclass
class BuyDrones:
    timestamp: str
    event: str = field(default="BuyDrones")
    BuyPrice: Optional[int] = None
    Count: Optional[int] = None
    TotalCost: Optional[int] = None
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class BuyExplorationData:
    timestamp: str
    event: str = field(default="BuyExplorationData")
    Cost: Optional[int] = None
    System: Optional[str] = None

@dataclass
class BuyMicroResources:
    timestamp: str
    event: str = field(default="BuyMicroResources")
    Category: Optional[str] = None
    Category_Localised: Optional[str] = None
    Cost: Optional[int] = None
    Count: Optional[int] = None
    MarketID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class BuySuit:
    timestamp: str
    event: str = field(default="BuySuit")
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Price: Optional[int] = None
    SuitID: Optional[int] = None
    SuitMods: Optional[list[str]] = None

@dataclass
class BuyTradeData:
    timestamp: str
    event: str = field(default="BuyTradeData")
    Cost: Optional[int] = None
    System: Optional[str] = None

@dataclass
class BuyWeapon:
    timestamp: str
    event: str = field(default="BuyWeapon")
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Price: Optional[int] = None
    WeaponID: Optional[int] = None

@dataclass
class CancelTaxi:
    timestamp: str
    event: str = field(default="CancelTaxi")
    Refund: Optional[int] = None

@dataclass
class CapShipBond:
    timestamp: str
    event: str = field(default="CapShipBond")
    Amount: Optional[int] = None
    AwardingFaction: Optional[str] = None
    AwardingFaction_Localised: Optional[str] = None
    Fighter: Optional[bool] = None
    PlayerPilot: Optional[bool] = None
    VictimFaction: Optional[str] = None
    VictimFaction_Localised: Optional[str] = None

@dataclass
class Cargo_Inventory:
    Count: Optional[int] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Stolen: Optional[int] = None

@dataclass
class Cargo:
    timestamp: str
    Inventory: list[Cargo_Inventory]
    Vessel: str
    event: str = field(default="Cargo")

@dataclass
class CarrierBankTransfer:
    timestamp: str
    event: str = field(default="CarrierBankTransfer")
    CarrierBalance: Optional[int] = None
    CarrierID: Optional[int] = None
    Deposit: Optional[int] = None
    PlayerBalance: Optional[int] = None
    Withdraw: Optional[int] = None

@dataclass
class CarrierBuy:
    timestamp: str
    event: str = field(default="CarrierBuy")
    Callsign: Optional[str] = None
    CarrierID: Optional[int] = None
    Location: Optional[str] = None
    Price: Optional[int] = None
    SystemAddress: Optional[int] = None
    Variant: Optional[str] = None

@dataclass
class CarrierCrewService:
    timestamp: str
    event: str = field(default="CarrierCrewService")
    CarrierID: Optional[int] = None
    CrewName: Optional[str] = None
    CrewRole: Optional[str] = None
    Operation: Optional[str] = None

@dataclass
class CarrierDeploy:
    timestamp: str
    event: str = field(default="CarrierDeploy")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    CarrierID: Optional[int] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class CarrierFinance:
    timestamp: str
    event: str = field(default="CarrierFinance")
    AvailableBalance: Optional[int] = None
    CarrierID: Optional[int] = None
    ReserveBalance: Optional[int] = None
    ReservePercent: Optional[int] = None
    TaxRate: Optional[int] = None

@dataclass
class CarrierJump:
    timestamp: str
    event: str = field(default="CarrierJump")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class CarrierJumpRequest:
    timestamp: str
    event: str = field(default="CarrierJumpRequest")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    DepartureTime: Optional[str] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class CarrierModulePack:
    timestamp: str
    event: str = field(default="CarrierModulePack")
    CarrierID: Optional[int] = None
    Cost: Optional[int] = None
    Operation: Optional[str] = None
    PackTheme: Optional[str] = None
    PackTheme_Localised: Optional[str] = None
    PackTier: Optional[int] = None

@dataclass
class CarrierNameChange:
    timestamp: str
    event: str = field(default="CarrierNameChange")
    Callsign: Optional[str] = None
    CarrierID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class CarrierSell:
    timestamp: str
    event: str = field(default="CarrierSell")
    Callsign: Optional[str] = None
    CarrierID: Optional[int] = None
    Location: Optional[str] = None
    Price: Optional[int] = None
    SystemAddress: Optional[int] = None

@dataclass
class CarrierShipPack:
    timestamp: str
    event: str = field(default="CarrierShipPack")
    CarrierID: Optional[int] = None
    Cost: Optional[int] = None
    Operation: Optional[str] = None
    PackTheme: Optional[str] = None
    PackTheme_Localised: Optional[str] = None
    PackTier: Optional[int] = None

@dataclass
class CarrierStats_Pack:
    PackTheme: Optional[str] = None
    PackTheme_Localised: Optional[str] = None
    PackTier: Optional[int] = None

@dataclass
class CarrierStats:
    timestamp: str
    event: str = field(default="CarrierStats")
    AllowNotorious: Optional[bool] = None
    Callsign: Optional[str] = None
    CarrierID: Optional[int] = None
    DockingAccess: Optional[str] = None
    ExoBiology: Optional[bool] = None
    FuelLevel: Optional[float] = None
    JumpRangeCurr: Optional[float] = None
    JumpRangeMax: Optional[float] = None
    Market: Optional[bool] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Outfitting: Optional[bool] = None
    Pack: Optional[list[CarrierStats_Pack]] = None
    PendingDecommision: Optional[bool] = None
    Rearm: Optional[bool] = None
    Refuel: Optional[bool] = None
    Repair: Optional[bool] = None
    Shipyard: Optional[bool] = None
    SpaceAccess: Optional[str] = None
    Theme: Optional[str] = None
    VoucherExploration: Optional[bool] = None
    VoucherMarket: Optional[bool] = None
    VoucherTrade: Optional[bool] = None

@dataclass
class CarrierTradeOrder:
    timestamp: str
    event: str = field(default="CarrierTradeOrder")
    BlackMarket: Optional[bool] = None
    CancelTrade: Optional[bool] = None
    CarrierID: Optional[int] = None
    Commodity: Optional[str] = None
    Commodity_Localised: Optional[str] = None
    Price: Optional[int] = None
    PurchaseOrder: Optional[int] = None
    SaleOrder: Optional[int] = None
    Stock: Optional[int] = None

@dataclass
class ChangeCrewAssignedRole:
    timestamp: str
    event: str = field(default="ChangeCrewAssignedRole")
    Role: Optional[str] = None

@dataclass
class CodexEntry:
    timestamp: str
    event: str = field(default="CodexEntry")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    Category: Optional[str] = None
    Category_Localised: Optional[str] = None
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    NearestDestination: Optional[str] = None
    NearestDestination_Localised: Optional[str] = None
    Region: Optional[str] = None
    Region_Localised: Optional[str] = None
    SubCategory: Optional[str] = None
    SubCategory_Localised: Optional[str] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None
    VoucherAmount: Optional[int] = None

@dataclass
class CollectItems:
    timestamp: str
    event: str = field(default="CollectItems")
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    OwnerID: Optional[int] = None
    Stolen: Optional[bool] = None
    Type: Optional[str] = None

@dataclass
class CollectMicroResources_Item:
    Count: Optional[int] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    OwnerID: Optional[int] = None
    Type: Optional[str] = None

@dataclass
class CollectMicroResources:
    timestamp: str
    event: str = field(default="CollectMicroResources")
    Items: Optional[list[CollectMicroResources_Item]] = None

@dataclass
class CommitCrime:
    timestamp: str
    event: str = field(default="CommitCrime")
    Bounty: Optional[int] = None
    CrimeType: Optional[str] = None
    Faction: Optional[str] = None
    Fine: Optional[int] = None
    Victim: Optional[str] = None
    Victim_Localised: Optional[str] = None

@dataclass
class CommunityGoal_TopTier:
    Bonus: Optional[str] = None
    Bonus_Localised: Optional[str] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class CommunityGoal_CurrentGoal:
    Bonus: Optional[int] = None
    CGID: Optional[int] = None
    CurrentTotal: Optional[int] = None
    Expiry: Optional[str] = None
    IsComplete: Optional[bool] = None
    MarketName: Optional[str] = None
    NumContributors: Optional[int] = None
    PlayerContribution: Optional[int] = None
    PlayerPercentileBand: Optional[int] = None
    SystemName: Optional[str] = None
    TierReached: Optional[str] = None
    Title: Optional[str] = None
    Title_Localised: Optional[str] = None
    TopRankSize: Optional[int] = None
    TopTier: Optional[CommunityGoal_TopTier] = None

@dataclass
class CommunityGoal:
    timestamp: str
    event: str = field(default="CommunityGoal")
    CurrentGoals: Optional[list[CommunityGoal_CurrentGoal]] = None

@dataclass
class CommunityGoalDiscard:
    timestamp: str
    event: str = field(default="CommunityGoalDiscard")
    CGID: Optional[int] = None
    MarketName: Optional[str] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    SystemName: Optional[str] = None

@dataclass
class CommunityGoalJoin:
    timestamp: str
    event: str = field(default="CommunityGoalJoin")
    CGID: Optional[int] = None
    MarketName: Optional[str] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    SystemName: Optional[str] = None

@dataclass
class CommunityGoalReward:
    timestamp: str
    event: str = field(default="CommunityGoalReward")
    CGID: Optional[int] = None
    DetailReward: Optional[int] = None
    MarketName: Optional[str] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Reward: Optional[int] = None
    SystemName: Optional[str] = None

@dataclass
class Continued:
    timestamp: str
    event: str = field(default="Continued")
    Part: Optional[int] = None

@dataclass
class CreateSuitLoadout_Module:
    ModuleName: Optional[str] = None
    ModuleName_Localised: Optional[str] = None
    SlotName: Optional[str] = None
    SuitModuleID: Optional[int] = None

@dataclass
class CreateSuitLoadout:
    timestamp: str
    event: str = field(default="CreateSuitLoadout")
    LoadoutName: Optional[str] = None
    Modules: Optional[list[CreateSuitLoadout_Module]] = None
    SuitID: Optional[int] = None
    SuitMods: Optional[list[str]] = None
    SuitName: Optional[str] = None
    SuitName_Localised: Optional[str] = None

@dataclass
class CrewFire:
    timestamp: str
    event: str = field(default="CrewFire")
    CombatRank: Optional[int] = None
    Name: Optional[str] = None

@dataclass
class CrewHire:
    timestamp: str
    event: str = field(default="CrewHire")
    CombatRank: Optional[int] = None
    Cost: Optional[int] = None
    Faction: Optional[str] = None
    Name: Optional[str] = None

@dataclass
class CrewLaunchFighter:
    timestamp: str
    event: str = field(default="CrewLaunchFighter")
    Crew: Optional[str] = None
    ID: Optional[int] = None
    Loadout: Optional[str] = None
    Loadout_Localised: Optional[str] = None

@dataclass
class CrewMemberJoins:
    timestamp: str
    event: str = field(default="CrewMemberJoins")
    CombatRank: Optional[int] = None
    Crew: Optional[str] = None
    Telepresence: Optional[bool] = None

@dataclass
class CrewMemberQuits:
    timestamp: str
    event: str = field(default="CrewMemberQuits")
    Crew: Optional[str] = None
    Telepresence: Optional[bool] = None

@dataclass
class CrewMemberRoleChange:
    timestamp: str
    event: str = field(default="CrewMemberRoleChange")
    Crew: Optional[str] = None
    Role: Optional[str] = None
    Telepresence: Optional[bool] = None

@dataclass
class CrewRoleRepair:
    timestamp: str
    event: str = field(default="CrewRoleRepair")
    CrewID: Optional[int] = None

@dataclass
class DataScanned:
    timestamp: str
    event: str = field(default="DataScanned")
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class DeleteSuitLoadout:
    timestamp: str
    event: str = field(default="DeleteSuitLoadout")
    LoadoutID: Optional[int] = None
    LoadoutName: Optional[str] = None
    SuitID: Optional[int] = None
    SuitName: Optional[str] = None
    SuitName_Localised: Optional[str] = None

@dataclass
class Died_Killer:
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Rank: Optional[str] = None
    Ship: Optional[str] = None

@dataclass
class Died:
    timestamp: str
    event: str = field(default="Died")
    KillerName: Optional[str] = None
    KillerName_Localised: Optional[str] = None
    KillerRank: Optional[str] = None
    Killers: Optional[list[Died_Killer]] = None
    KillerShip: Optional[str] = None

@dataclass
class DisbandedSquadron:
    timestamp: str
    event: str = field(default="DisbandedSquadron")
    SquadronName: Optional[str] = None

@dataclass
class Disembark:
    timestamp: str
    event: str = field(default="Disembark")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    MarketID: Optional[int] = None
    Multicrew: Optional[bool] = None
    OnPlanet: Optional[bool] = None
    OnStation: Optional[bool] = None
    SRV: Optional[bool] = None
    StarSystem: Optional[str] = None
    StationName: Optional[str] = None
    StationType: Optional[str] = None
    SystemAddress: Optional[int] = None
    Taxi: Optional[bool] = None

@dataclass
class Docked:
    timestamp: str
    MarketID: int
    StarSystem: str
    StationName: str
    StationType: str
    event: str = field(default="Docked")
    ActiveFine: Optional[bool] = None
    CockpitBreach: Optional[bool] = None
    DistFromStarLS: Optional[float] = None
    LandingPads: Optional[LandingPads] = None
    PowerplayState: Optional[str] = None
    Powers: Optional[list[str]] = None
    StationAllegiance: Optional[str] = None
    StationEconomies: Optional[list[StationEconomy]] = None
    StationEconomy: Optional[str] = None
    StationGovernment: Optional[str] = None
    StationServices: Optional[list[str]] = None
    StationState: Optional[str] = None
    SystemAddress: Optional[int] = None
    Taxoname: Optional[str] = None
    Wanted: Optional[bool] = None

@dataclass
class DockFighter:
    timestamp: str
    event: str = field(default="DockFighter")
    ID: Optional[int] = None

@dataclass
class DockingCancelled:
    timestamp: str
    event: str = field(default="DockingCancelled")
    MarketID: Optional[int] = None
    StationName: Optional[str] = None

@dataclass
class DockingDenied:
    timestamp: str
    event: str = field(default="DockingDenied")
    MarketID: Optional[int] = None
    Reason: Optional[str] = None
    StationName: Optional[str] = None
    StationType: Optional[str] = None

@dataclass
class DockingGranted:
    timestamp: str
    event: str = field(default="DockingGranted")
    LandingPad: Optional[int] = None
    MarketID: Optional[int] = None
    StationName: Optional[str] = None
    StationType: Optional[str] = None

@dataclass
class DockingRequested:
    timestamp: str
    event: str = field(default="DockingRequested")
    LandingPad: Optional[int] = None
    MarketID: Optional[int] = None
    StationName: Optional[str] = None
    StationType: Optional[str] = None

@dataclass
class DockingTimeout:
    timestamp: str
    event: str = field(default="DockingTimeout")
    MarketID: Optional[int] = None
    StationName: Optional[str] = None

@dataclass
class DockSRV:
    timestamp: str
    event: str = field(default="DockSRV")
    ID: Optional[int] = None

@dataclass
class DropShipDeploy:
    timestamp: str
    event: str = field(default="DropShipDeploy")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    MarketID: Optional[int] = None
    OnPlanet: Optional[bool] = None
    OnStation: Optional[bool] = None
    StarSystem: Optional[str] = None
    StationName: Optional[str] = None
    StationType: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class EjectCargo:
    timestamp: str
    event: str = field(default="EjectCargo")
    Abandoned: Optional[bool] = None
    Count: Optional[int] = None
    MissionID: Optional[int] = None
    Powerplay: Optional[bool] = None
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class Embark:
    timestamp: str
    event: str = field(default="Embark")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    MarketID: Optional[int] = None
    Multicrew: Optional[bool] = None
    OnPlanet: Optional[bool] = None
    OnStation: Optional[bool] = None
    SRV: Optional[bool] = None
    StarSystem: Optional[str] = None
    StationName: Optional[str] = None
    StationType: Optional[str] = None
    SystemAddress: Optional[int] = None
    Taxi: Optional[bool] = None

@dataclass
class EndCrewSession:
    timestamp: str
    event: str = field(default="EndCrewSession")

@dataclass
class EngineerApply:
    timestamp: str
    event: str = field(default="EngineerApply")
    Blueprint: Optional[str] = None
    BlueprintID: Optional[int] = None
    Engineer: Optional[str] = None
    Level: Optional[int] = None

@dataclass
class EngineerCraft_Ingredient:
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Quantity: Optional[int] = None

@dataclass
class EngineerCraft:
    timestamp: str
    event: str = field(default="EngineerCraft")
    Blueprint: Optional[str] = None
    BlueprintID: Optional[int] = None
    Engineer: Optional[str] = None
    EngineerID: Optional[int] = None
    ExperimentalEffect: Optional[str] = None
    ExperimentalEffect_Localised: Optional[str] = None
    Ingredients: Optional[list[EngineerCraft_Ingredient]] = None
    Level: Optional[int] = None
    Modifiers: Optional[list[Modifier]] = None
    Quality: Optional[float] = None

@dataclass
class EngineerProgress_Engineer:
    Engineer: Optional[str] = None
    EngineerID: Optional[int] = None
    Progress: Optional[str] = None
    Rank: Optional[int] = None
    RankProgress: Optional[int] = None

@dataclass
class EngineerProgress:
    timestamp: str
    event: str = field(default="EngineerProgress")
    Engineers: Optional[list[EngineerProgress_Engineer]] = None

@dataclass
class FactionKillBond:
    timestamp: str
    event: str = field(default="FactionKillBond")
    Amount: Optional[int] = None
    AwardingFaction: Optional[str] = None
    AwardingFaction_Localised: Optional[str] = None
    VictimFaction: Optional[str] = None
    VictimFaction_Localised: Optional[str] = None

@dataclass
class FCMaterials_Data:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class FCMaterials_Item:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class FCMaterials_Component:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class FCMaterials_Consumable:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class FCMaterials:
    timestamp: str
    event: str = field(default="FCMaterials")
    Components: Optional[list[FCMaterials_Component]] = None
    Consumables: Optional[list[FCMaterials_Consumable]] = None
    Data: Optional[list[FCMaterials_Data]] = None
    Items: Optional[list[FCMaterials_Item]] = None

@dataclass
class FCMaterialsCAPI_Data:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class FCMaterialsCAPI_Item:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class FCMaterialsCAPI_Component:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class FCMaterialsCAPI_Consumable:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class FCMaterialsCAPI:
    timestamp: str
    event: str = field(default="FCMaterialsCAPI")
    CarrierName: Optional[str] = None
    CarrierName_Localised: Optional[str] = None
    Components: Optional[list[FCMaterialsCAPI_Component]] = None
    Consumables: Optional[list[FCMaterialsCAPI_Consumable]] = None
    Data: Optional[list[FCMaterialsCAPI_Data]] = None
    Items: Optional[list[FCMaterialsCAPI_Item]] = None
    MarketID: Optional[int] = None

@dataclass
class FighterDestroyed:
    timestamp: str
    event: str = field(default="FighterDestroyed")
    ID: Optional[int] = None

@dataclass
class FileHeader:
    timestamp: str
    part: int
    event: str = field(default="FileHeader")
    build: Optional[str] = None
    gameversion: Optional[str] = None
    language: Optional[str] = None
    odyssey: Optional[bool] = None

@dataclass
class FSDJump:
    timestamp: str
    JumpDist: float
    StarPos: list[float]
    StarSystem: str
    event: str = field(default="FSDJump")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    BoostUsed: Optional[float] = None
    Conflicts: Optional[list[Conflict]] = None
    Factions: Optional[list[FactionState]] = None
    FuelLevel: Optional[float] = None
    FuelUsed: Optional[float] = None
    Population: Optional[int] = None
    PowerplayState: Optional[str] = None
    Powers: Optional[list[str]] = None
    SystemAddress: Optional[int] = None
    SystemAllegiance: Optional[str] = None
    SystemEconomy: Optional[str] = None
    SystemGovernment: Optional[str] = None
    SystemSecondEconomy: Optional[str] = None
    SystemSecurity: Optional[str] = None
    Taxoname: Optional[str] = None

@dataclass
class FSSBodySignals_Signal:
    Count: Optional[int] = None
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class FSSBodySignals:
    timestamp: str
    event: str = field(default="FSSBodySignals")
    BodyID: Optional[int] = None
    BodyName: Optional[str] = None
    Signals: Optional[list[FSSBodySignals_Signal]] = None
    SystemAddress: Optional[int] = None

@dataclass
class FSSSignalDiscovered:
    timestamp: str
    event: str = field(default="FSSSignalDiscovered")
    SignalName: Optional[str] = None
    SignalName_Localised: Optional[str] = None
    SpawningFaction: Optional[str] = None
    SpawningState: Optional[str] = None
    SystemAddress: Optional[int] = None
    ThargoidWar: Optional[str] = None
    USSType: Optional[str] = None
    USSType_Localised: Optional[str] = None

@dataclass
class FuelScoop:
    timestamp: str
    event: str = field(default="FuelScoop")
    Scooped: Optional[float] = None
    Total: Optional[float] = None

@dataclass
class HeatDamage:
    timestamp: str
    event: str = field(default="HeatDamage")

@dataclass
class HeatWarning:
    timestamp: str
    event: str = field(default="HeatWarning")

@dataclass
class HullDamage:
    timestamp: str
    event: str = field(default="HullDamage")
    Fighter: Optional[bool] = None
    Health: Optional[float] = None
    PlayerPilot: Optional[bool] = None

@dataclass
class InvitedToSquadron:
    timestamp: str
    event: str = field(default="InvitedToSquadron")
    InviterName: Optional[str] = None
    InviterName_Localised: Optional[str] = None
    SquadronName: Optional[str] = None

@dataclass
class JoinACrew:
    timestamp: str
    event: str = field(default="JoinACrew")
    Captain: Optional[str] = None
    Captain_Localised: Optional[str] = None

@dataclass
class JoinedSquadron:
    timestamp: str
    event: str = field(default="JoinedSquadron")
    SquadronName: Optional[str] = None

@dataclass
class KickCrewMember:
    timestamp: str
    event: str = field(default="KickCrewMember")
    Crew: Optional[str] = None
    Telepresence: Optional[bool] = None

@dataclass
class KickedFromSquadron:
    timestamp: str
    event: str = field(default="KickedFromSquadron")
    SquadronName: Optional[str] = None

@dataclass
class LaunchFighter:
    timestamp: str
    event: str = field(default="LaunchFighter")
    Loadout: Optional[str] = None
    Loadout_Localised: Optional[str] = None
    PlayerControlled: Optional[bool] = None

@dataclass
class LaunchSRV:
    timestamp: str
    event: str = field(default="LaunchSRV")
    ID: Optional[int] = None
    Loadout: Optional[str] = None
    Loadout_Localised: Optional[str] = None
    PlayerControlled: Optional[bool] = None

@dataclass
class LeaveBody:
    timestamp: str
    event: str = field(default="LeaveBody")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class LeftSquadron:
    timestamp: str
    event: str = field(default="LeftSquadron")
    OldRank: Optional[int] = None
    SquadronName: Optional[str] = None

@dataclass
class Liftoff:
    timestamp: str
    event: str = field(default="Liftoff")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    OnPlanet: Optional[bool] = None
    OnStation: Optional[bool] = None
    PlayerControlled: Optional[bool] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class LoadGame:
    timestamp: str
    Commander: str
    Credits: int
    GameMode: str
    Loan: int
    Ship: str
    ShipID: int
    event: str = field(default="LoadGame")
    build: Optional[str] = None
    FID: Optional[str] = None
    FuelCapacity: Optional[float] = None
    FuelLevel: Optional[float] = None
    gameversion: Optional[str] = None
    Group: Optional[str] = None
    Horizons: Optional[bool] = None
    language: Optional[str] = None
    Odyssey: Optional[bool] = None
    ShipIdent: Optional[str] = None
    ShipName: Optional[str] = None

@dataclass
class Location:
    timestamp: str
    StarPos: list[float]
    StarSystem: str
    event: str = field(default="Location")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    BodyType: Optional[str] = None
    Docked: Optional[bool] = None
    MarketID: Optional[int] = None
    Population: Optional[int] = None
    PowerplayState: Optional[str] = None
    Powers: Optional[list[str]] = None
    StationName: Optional[str] = None
    StationType: Optional[str] = None
    SystemAddress: Optional[int] = None
    SystemAllegiance: Optional[str] = None
    SystemEconomy: Optional[str] = None
    SystemGovernment: Optional[str] = None
    SystemSecondEconomy: Optional[str] = None
    SystemSecurity: Optional[str] = None

@dataclass
class Market_Item:
    BuyPrice: Optional[int] = None
    Demand: Optional[int] = None
    DemandBracket: Optional[int] = None
    MeanPrice: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    SellPrice: Optional[int] = None
    StatusFlags: Optional[str] = None
    Stock: Optional[int] = None
    StockBracket: Optional[int] = None

@dataclass
class Market:
    timestamp: str
    Items: list[Market_Item]
    MarketID: int
    StarSystem: str
    StationName: str
    StationType: str
    event: str = field(default="Market")
    CarrierDockingAccess: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class MarketBuy:
    timestamp: str
    event: str = field(default="MarketBuy")
    BuyPrice: Optional[int] = None
    Count: Optional[int] = None
    MarketID: Optional[int] = None
    TotalCost: Optional[int] = None
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class MarketSell:
    timestamp: str
    event: str = field(default="MarketSell")
    AvgPricePaid: Optional[int] = None
    BlackMarket: Optional[bool] = None
    Count: Optional[int] = None
    IllegalGoods: Optional[bool] = None
    MarketID: Optional[int] = None
    SellPrice: Optional[int] = None
    Stolen: Optional[bool] = None
    TotalSale: Optional[int] = None
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class MaterialCollected:
    timestamp: str
    event: str = field(default="MaterialCollected")
    Category: Optional[str] = None
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class MaterialDiscarded:
    timestamp: str
    event: str = field(default="MaterialDiscarded")
    Category: Optional[str] = None
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class MaterialDiscovered:
    timestamp: str
    event: str = field(default="MaterialDiscovered")
    Category: Optional[str] = None
    DiscoveryNumber: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class MaterialTrade_Traded:
    Category: Optional[str] = None
    Category_Localised: Optional[str] = None
    Material: Optional[str] = None
    Material_Localised: Optional[str] = None
    Quantity: Optional[int] = None

@dataclass
class MaterialTrade_Received:
    Category: Optional[str] = None
    Category_Localised: Optional[str] = None
    Material: Optional[str] = None
    Material_Localised: Optional[str] = None
    Quantity: Optional[int] = None

@dataclass
class MaterialTrade:
    timestamp: str
    event: str = field(default="MaterialTrade")
    MarketID: Optional[int] = None
    Received: Optional[MaterialTrade_Received] = None
    Traded: Optional[MaterialTrade_Traded] = None
    TraderType: Optional[str] = None

@dataclass
class MiningRefined:
    timestamp: str
    event: str = field(default="MiningRefined")
    Commodity_Localised: Optional[str] = None
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class MissionAbandoned:
    timestamp: str
    event: str = field(default="MissionAbandoned")
    Fine: Optional[int] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class MissionAccepted_CommodityReward:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class MissionAccepted_MaterialsRequired:
    Category: Optional[str] = None
    Category_Localised: Optional[str] = None
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class MissionAccepted:
    timestamp: str
    event: str = field(default="MissionAccepted")
    Commodity: Optional[str] = None
    Commodity_Localised: Optional[str] = None
    CommodityReward: Optional[list[MissionAccepted_CommodityReward]] = None
    Count: Optional[int] = None
    DestinationStation: Optional[str] = None
    DestinationSystem: Optional[str] = None
    Donated: Optional[int] = None
    Donation: Optional[str] = None
    Expiry: Optional[str] = None
    Faction: Optional[str] = None
    Influence: Optional[str] = None
    InfluenceGain: Optional[str] = None
    KillCount: Optional[int] = None
    LocalisedName: Optional[str] = None
    MaterialsRequired: Optional[list[MissionAccepted_MaterialsRequired]] = None
    MinJumps: Optional[int] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    PassengerCount: Optional[int] = None
    PassengerMission: Optional[bool] = None
    PassengerType: Optional[str] = None
    PassengerVIPs: Optional[bool] = None
    PassengerWanted: Optional[bool] = None
    Reputation: Optional[str] = None
    ReputationGain: Optional[str] = None
    Reward: Optional[int] = None
    Target: Optional[str] = None
    Target_Localised: Optional[str] = None
    TargetCommodity: Optional[str] = None
    TargetCommodity_Localised: Optional[str] = None
    TargetFaction: Optional[str] = None
    TargetType: Optional[str] = None
    TargetType_Localised: Optional[str] = None
    Wing: Optional[bool] = None

@dataclass
class MissionCompleted_MaterialsReward:
    Category: Optional[str] = None
    Category_Localised: Optional[str] = None
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class MissionCompleted_PermitsAwarded:
    Permit: Optional[str] = None

@dataclass
class MissionCompleted_Influence:
    Influence: Optional[str] = None
    SystemAddress: Optional[int] = None
    Trend: Optional[str] = None

@dataclass
class MissionCompleted_Effect:
    Effect: Optional[str] = None
    Effect_Localised: Optional[str] = None
    Trend: Optional[str] = None

@dataclass
class MissionCompleted_FactionEffect:
    Effects: Optional[list[MissionCompleted_Effect]] = None
    Faction: Optional[str] = None
    Influence: Optional[MissionCompleted_Influence] = None
    Reputation: Optional[str] = None
    ReputationTrend: Optional[str] = None

@dataclass
class MissionCompleted_CommodityReward:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class MissionCompleted:
    timestamp: str
    event: str = field(default="MissionCompleted")
    Commodity: Optional[str] = None
    Commodity_Localised: Optional[str] = None
    CommodityReward: Optional[list[MissionCompleted_CommodityReward]] = None
    Count: Optional[int] = None
    DestinationStation: Optional[str] = None
    DestinationSystem: Optional[str] = None
    Donated: Optional[int] = None
    Donation: Optional[str] = None
    Faction: Optional[str] = None
    FactionEffect: Optional[list[MissionCompleted_FactionEffect]] = None
    KillCount: Optional[int] = None
    MaterialsReward: Optional[list[MissionCompleted_MaterialsReward]] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    PermitsAwarded: Optional[list[MissionCompleted_PermitsAwarded]] = None
    Reward: Optional[int] = None
    RewardDetail: Optional[str] = None
    RewardDetail_Localised: Optional[str] = None
    TargetFaction: Optional[str] = None

@dataclass
class MissionFailed:
    timestamp: str
    event: str = field(default="MissionFailed")
    Faction: Optional[str] = None
    Fine: Optional[int] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class MissionRedirected:
    timestamp: str
    event: str = field(default="MissionRedirected")
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    NewDestinationStation: Optional[str] = None
    NewDestinationSystem: Optional[str] = None
    OldDestinationStation: Optional[str] = None
    OldDestinationSystem: Optional[str] = None

@dataclass
class ModuleInfo_Engineering:
    BlueprintID: Optional[int] = None
    BlueprintName: Optional[str] = None
    Engineer: Optional[str] = None
    ExperimentalEffect: Optional[str] = None
    ExperimentalEffect_Localised: Optional[str] = None
    Level: Optional[int] = None
    Modifiers: Optional[list[Modifier]] = None
    Quality: Optional[float] = None

@dataclass
class ModuleInfo_Module:
    AmmoClip: Optional[int] = None
    AmmoHopper: Optional[int] = None
    Engineering: Optional[ModuleInfo_Engineering] = None
    Health: Optional[float] = None
    Item: Optional[str] = None
    Item_Localised: Optional[str] = None
    On: Optional[bool] = None
    Priority: Optional[int] = None
    Slot: Optional[str] = None
    Value: Optional[int] = None

@dataclass
class ModuleInfo:
    timestamp: str
    event: str = field(default="ModuleInfo")
    Modules: Optional[list[ModuleInfo_Module]] = None

@dataclass
class Music:
    timestamp: str
    event: str = field(default="Music")
    MusicTrack: Optional[str] = None

@dataclass
class NavBeaconScan:
    timestamp: str
    event: str = field(default="NavBeaconScan")
    NumBodies: Optional[int] = None
    SystemAddress: Optional[int] = None

@dataclass
class NavRoute_Route:
    StarPos: Optional[list[Any]] = None
    StarSystem: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class NavRoute:
    timestamp: str
    event: str = field(default="NavRoute")
    Route: Optional[list[NavRoute_Route]] = None

@dataclass
class NavRouteClear:
    timestamp: str
    event: str = field(default="NavRouteClear")

@dataclass
class Outfitting_Item:
    BuyPrice: Optional[int] = None
    id: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class Outfitting:
    timestamp: str
    Items: list[Outfitting_Item]
    MarketID: int
    StarSystem: str
    StationName: str
    event: str = field(default="Outfitting")
    SystemAddress: Optional[int] = None

@dataclass
class PayFines:
    timestamp: str
    event: str = field(default="PayFines")
    AllFines: Optional[bool] = None
    Amount: Optional[int] = None
    BrokerPercentage: Optional[float] = None

@dataclass
class PayLegacyFines:
    timestamp: str
    event: str = field(default="PayLegacyFines")
    Amount: Optional[int] = None
    BrokerPercentage: Optional[float] = None

@dataclass
class PlanetApproach:
    timestamp: str
    event: str = field(default="PlanetApproach")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    SystemAddress: Optional[int] = None

@dataclass
class Powerplay:
    timestamp: str
    event: str = field(default="Powerplay")
    Merits: Optional[int] = None
    Power: Optional[str] = None
    PowerplayState: Optional[str] = None
    Rank: Optional[int] = None
    Rating: Optional[int] = None
    TimePledged: Optional[int] = None
    Votes: Optional[int] = None

@dataclass
class PowerplayDefect:
    timestamp: str
    event: str = field(default="PowerplayDefect")
    FromPower: Optional[str] = None
    ToPower: Optional[str] = None

@dataclass
class PowerplayDeliver:
    timestamp: str
    event: str = field(default="PowerplayDeliver")
    Count: Optional[int] = None
    Power: Optional[str] = None
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class PowerplayFastTrack:
    timestamp: str
    event: str = field(default="PowerplayFastTrack")
    Amount: Optional[int] = None
    Cost: Optional[int] = None
    Power: Optional[str] = None

@dataclass
class PowerplayJoin:
    timestamp: str
    event: str = field(default="PowerplayJoin")
    Power: Optional[str] = None

@dataclass
class PowerplayLeave:
    timestamp: str
    event: str = field(default="PowerplayLeave")
    Power: Optional[str] = None

@dataclass
class PowerplaySalary:
    timestamp: str
    event: str = field(default="PowerplaySalary")
    Amount: Optional[int] = None
    Power: Optional[str] = None

@dataclass
class PowerplayVote:
    timestamp: str
    event: str = field(default="PowerplayVote")
    Power: Optional[str] = None
    Vote: Optional[int] = None
    Vote_Weighting: Optional[float] = None
    Votes: Optional[int] = None

@dataclass
class Progress:
    timestamp: str
    event: str = field(default="Progress")
    Combat: Optional[float] = None
    CQC: Optional[float] = None
    Empire: Optional[float] = None
    Exobiologist: Optional[float] = None
    Explore: Optional[float] = None
    Federation: Optional[float] = None
    Soldier: Optional[float] = None
    Trade: Optional[float] = None

@dataclass
class Promotion:
    timestamp: str
    event: str = field(default="Promotion")
    Combat: Optional[int] = None
    CQC: Optional[int] = None
    Empire: Optional[int] = None
    Exobiologist: Optional[int] = None
    Explore: Optional[int] = None
    Federation: Optional[int] = None
    Soldier: Optional[int] = None
    Trade: Optional[int] = None

@dataclass
class ProspectedAsteroid_Material:
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Proportion: Optional[float] = None

@dataclass
class ProspectedAsteroid:
    timestamp: str
    event: str = field(default="ProspectedAsteroid")
    Content: Optional[str] = None
    Content_Localised: Optional[str] = None
    Materials: Optional[list[ProspectedAsteroid_Material]] = None
    MotherlodeMaterial: Optional[str] = None
    MotherlodeMaterial_Localised: Optional[str] = None
    MotherlodeProportion: Optional[float] = None
    Remaining: Optional[float] = None

@dataclass
class PVPKill:
    timestamp: str
    event: str = field(default="PVPKill")
    CombatRank: Optional[int] = None
    Victim: Optional[str] = None
    Victim_Localised: Optional[str] = None

@dataclass
class QuitACrew:
    timestamp: str
    event: str = field(default="QuitACrew")
    Captain: Optional[str] = None

@dataclass
class Rank:
    timestamp: str
    event: str = field(default="Rank")
    Combat: Optional[int] = None
    CQC: Optional[int] = None
    Empire: Optional[int] = None
    Exobiologist: Optional[int] = None
    Explore: Optional[int] = None
    Federation: Optional[int] = None
    Soldier: Optional[int] = None
    Trade: Optional[int] = None

@dataclass
class RebootRepair_Module:
    Module: Optional[str] = None
    Module_Localised: Optional[str] = None
    Slot: Optional[str] = None

@dataclass
class RebootRepair:
    timestamp: str
    event: str = field(default="RebootRepair")
    Modules: Optional[list[RebootRepair_Module]] = None

@dataclass
class ReceiveText:
    timestamp: str
    event: str = field(default="ReceiveText")
    Channel: Optional[str] = None
    From: Optional[str] = None
    From_Localised: Optional[str] = None
    Message: Optional[str] = None
    Message_Localised: Optional[str] = None

@dataclass
class RedeemVoucher_Faction:
    Amount: Optional[int] = None
    Faction: Optional[str] = None

@dataclass
class RedeemVoucher:
    timestamp: str
    event: str = field(default="RedeemVoucher")
    Amount: Optional[int] = None
    Factions: Optional[list[RedeemVoucher_Faction]] = None
    Type: Optional[str] = None

@dataclass
class RefuelAll:
    timestamp: str
    event: str = field(default="RefuelAll")
    Amount: Optional[float] = None
    Cost: Optional[int] = None

@dataclass
class RefuelPartial:
    timestamp: str
    event: str = field(default="RefuelPartial")
    Amount: Optional[float] = None
    Cost: Optional[int] = None

@dataclass
class RenameSuitLoadout:
    timestamp: str
    event: str = field(default="RenameSuitLoadout")
    LoadoutID: Optional[int] = None
    LoadoutName: Optional[str] = None
    PreviousLoadoutName: Optional[str] = None
    SuitID: Optional[int] = None
    SuitName: Optional[str] = None
    SuitName_Localised: Optional[str] = None

@dataclass
class Repair:
    timestamp: str
    event: str = field(default="Repair")
    Cost: Optional[int] = None
    Item: Optional[str] = None
    Item_Localised: Optional[str] = None

@dataclass
class RepairAll:
    timestamp: str
    event: str = field(default="RepairAll")
    Cost: Optional[int] = None

@dataclass
class ReservoirReplenished:
    timestamp: str
    event: str = field(default="ReservoirReplenished")
    FuelMain: Optional[float] = None
    FuelReservoir: Optional[float] = None

@dataclass
class RestockVehicle:
    timestamp: str
    event: str = field(default="RestockVehicle")
    Cost: Optional[int] = None
    Count: Optional[int] = None
    Loadout: Optional[str] = None
    Loadout_Localised: Optional[str] = None
    Type: Optional[str] = None

@dataclass
class Resurrect:
    timestamp: str
    event: str = field(default="Resurrect")
    Bankrupt: Optional[bool] = None
    Cost: Optional[int] = None
    Option: Optional[str] = None

@dataclass
class SAAscanComplete:
    timestamp: str
    event: str = field(default="SAAscanComplete")
    BodyID: Optional[int] = None
    BodyName: Optional[str] = None
    EfficiencyTarget: Optional[int] = None
    ProbesUsed: Optional[int] = None
    SystemAddress: Optional[int] = None

@dataclass
class SAASignalsFound_Signal:
    Count: Optional[int] = None
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class SAASignalsFound_Genuse:
    Genus: Optional[str] = None
    Genus_Localised: Optional[str] = None

@dataclass
class SAASignalsFound:
    timestamp: str
    event: str = field(default="SAASignalsFound")
    BodyID: Optional[int] = None
    BodyName: Optional[str] = None
    Genuses: Optional[list[SAASignalsFound_Genuse]] = None
    Signals: Optional[list[SAASignalsFound_Signal]] = None
    SystemAddress: Optional[int] = None

@dataclass
class Scan:
    timestamp: str
    BodyID: int
    BodyName: str
    DistanceFromArrivalLS: float
    StarSystem: str
    event: str = field(default="Scan")
    AbsoluteMagnitude: Optional[float] = None
    Age_MY: Optional[float] = None
    AtmosphereComposition: Optional[list[AtmosphereComposition]] = None
    AtmosphereType: Optional[str] = None
    AxialTilt: Optional[float] = None
    Composition: Optional[Composition] = None
    Eccentricity: Optional[float] = None
    Landable: Optional[bool] = None
    Luminosity: Optional[str] = None
    MassEM: Optional[float] = None
    Materials: Optional[dict[str, float]] = None
    OrbitalInclination: Optional[float] = None
    OrbitalPeriod: Optional[float] = None
    Parents: Optional[list[ParentBody]] = None
    Periapsis: Optional[float] = None
    PlanetClass: Optional[str] = None
    Radius: Optional[float] = None
    Rings: Optional[list[Ring]] = None
    RotationPeriod: Optional[float] = None
    ScanType: Optional[str] = None
    SemiMajorAxis: Optional[float] = None
    StarPos: Optional[list[float]] = None
    StarType: Optional[str] = None
    StellarMass: Optional[float] = None
    StellarRadius: Optional[float] = None
    Subclass: Optional[int] = None
    SurfaceGravity: Optional[float] = None
    SurfacePressure: Optional[float] = None
    SurfaceTemperature: Optional[float] = None
    SystemAddress: Optional[int] = None
    TerraformingState: Optional[str] = None
    TidalLock: Optional[bool] = None
    Volcanism: Optional[str] = None
    WasDiscovered: Optional[bool] = None
    WasDiscoveredByName: Optional[bool] = None
    WasMapped: Optional[bool] = None
    WasMappedByName: Optional[bool] = None

@dataclass
class ScanOrganic:
    timestamp: str
    event: str = field(default="ScanOrganic")
    Body: Optional[str] = None
    Genus: Optional[str] = None
    Genus_Localised: Optional[str] = None
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    ScanType: Optional[str] = None
    Species: Optional[str] = None
    Species_Localised: Optional[str] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None
    Variant: Optional[str] = None
    Variant_Localised: Optional[str] = None

@dataclass
class Screenshot:
    timestamp: str
    event: str = field(default="Screenshot")
    Altitude: Optional[float] = None
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    Filename: Optional[str] = None
    Heading: Optional[float] = None
    Height: Optional[int] = None
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None
    Width: Optional[int] = None

@dataclass
class SelfDestruct:
    timestamp: str
    event: str = field(default="SelfDestruct")

@dataclass
class SellDrones:
    timestamp: str
    event: str = field(default="SellDrones")
    Count: Optional[int] = None
    SellPrice: Optional[int] = None
    TotalSale: Optional[int] = None
    Type: Optional[str] = None
    Type_Localised: Optional[str] = None

@dataclass
class SellExplorationData_System:
    Name: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class SellExplorationData_Discovered:
    NumBodies: Optional[int] = None
    SystemName: Optional[str] = None

@dataclass
class SellExplorationData:
    timestamp: str
    event: str = field(default="SellExplorationData")
    BaseValue: Optional[int] = None
    Bonus: Optional[int] = None
    Discovered: Optional[list[SellExplorationData_Discovered]] = None
    Systems: Optional[list[SellExplorationData_System]] = None
    TotalEarnings: Optional[int] = None

@dataclass
class SellOrganicData_BioData:
    Bonus: Optional[int] = None
    Genus: Optional[str] = None
    Genus_Localised: Optional[str] = None
    Species: Optional[str] = None
    Species_Localised: Optional[str] = None
    TotalBonus: Optional[int] = None
    TotalValue: Optional[int] = None
    Value: Optional[int] = None
    Variant: Optional[str] = None
    Variant_Localised: Optional[str] = None
    Vendor: Optional[str] = None
    Vendor_Localised: Optional[str] = None

@dataclass
class SellOrganicData:
    timestamp: str
    event: str = field(default="SellOrganicData")
    BioData: Optional[list[SellOrganicData_BioData]] = None
    MarketID: Optional[int] = None

@dataclass
class SellSuit:
    timestamp: str
    event: str = field(default="SellSuit")
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Price: Optional[int] = None
    SuitID: Optional[int] = None

@dataclass
class SellWeapon:
    timestamp: str
    event: str = field(default="SellWeapon")
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    Price: Optional[int] = None
    WeaponID: Optional[int] = None

@dataclass
class SendText:
    timestamp: str
    event: str = field(default="SendText")
    Message: Optional[str] = None
    Sent: Optional[bool] = None
    To: Optional[str] = None
    To_Localised: Optional[str] = None

@dataclass
class ShieldState:
    timestamp: str
    event: str = field(default="ShieldState")
    ShieldsUp: Optional[bool] = None

@dataclass
class ShipLocker_Data:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class ShipLocker_Item:
    Count: Optional[int] = None
    MissionID: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    OwnerID: Optional[int] = None
    Type: Optional[str] = None

@dataclass
class ShipLocker_Component:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class ShipLocker_Consumable:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class ShipLocker:
    timestamp: str
    event: str = field(default="ShipLocker")
    Components: Optional[list[ShipLocker_Component]] = None
    Consumables: Optional[list[ShipLocker_Consumable]] = None
    Data: Optional[list[ShipLocker_Data]] = None
    Items: Optional[list[ShipLocker_Item]] = None

@dataclass
class ShipLockerMaterials_Data:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class ShipLockerMaterials_Item:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class ShipLockerMaterials_Component:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class ShipLockerMaterials_Consumable:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class ShipLockerMaterials:
    timestamp: str
    event: str = field(default="ShipLockerMaterials")
    Components: Optional[list[ShipLockerMaterials_Component]] = None
    Consumables: Optional[list[ShipLockerMaterials_Consumable]] = None
    Data: Optional[list[ShipLockerMaterials_Data]] = None
    Items: Optional[list[ShipLockerMaterials_Item]] = None

@dataclass
class ShipTargeted:
    timestamp: str
    event: str = field(default="ShipTargeted")
    Faction: Optional[str] = None
    HullHealth: Optional[float] = None
    LegalStatus: Optional[str] = None
    PilotName: Optional[str] = None
    PilotName_Localised: Optional[str] = None
    PilotRank: Optional[str] = None
    Power: Optional[str] = None
    ScanStage: Optional[int] = None
    ShieldHealth: Optional[float] = None
    Ship: Optional[str] = None
    Ship_Localised: Optional[str] = None
    SquadronID: Optional[int] = None
    TargetLocked: Optional[bool] = None

@dataclass
class Shipyard_Ship:
    SellPrice: Optional[int] = None
    ShipType: Optional[str] = None
    ShipType_Localised: Optional[str] = None
    Value: Optional[int] = None

@dataclass
class Shipyard:
    timestamp: str
    MarketID: int
    Ships: list[Shipyard_Ship]
    StarSystem: str
    StationName: str
    event: str = field(default="Shipyard")
    SystemAddress: Optional[int] = None

@dataclass
class Shutdown:
    timestamp: str
    event: str = field(default="Shutdown")

@dataclass
class SquadronCreated:
    timestamp: str
    event: str = field(default="SquadronCreated")
    SquadronName: Optional[str] = None

@dataclass
class SquadronDemotion:
    timestamp: str
    event: str = field(default="SquadronDemotion")
    NewRank: Optional[int] = None
    OldRank: Optional[int] = None
    SquadronName: Optional[str] = None

@dataclass
class SquadronKicked:
    timestamp: str
    event: str = field(default="SquadronKicked")
    PlayerName: Optional[str] = None
    SquadronName: Optional[str] = None

@dataclass
class SquadronPromotion:
    timestamp: str
    event: str = field(default="SquadronPromotion")
    NewRank: Optional[int] = None
    OldRank: Optional[int] = None
    SquadronName: Optional[str] = None

@dataclass
class SquadronStartup_Rating:
    Name: Optional[str] = None
    Rank: Optional[int] = None

@dataclass
class SquadronStartup:
    timestamp: str
    event: str = field(default="SquadronStartup")
    CurrentRating: Optional[int] = None
    Rating: Optional[list[SquadronStartup_Rating]] = None
    SquadronAlignedPower: Optional[str] = None
    SquadronFaction: Optional[str] = None
    SquadronHomeSystem: Optional[str] = None
    SquadronID: Optional[int] = None
    SquadronName: Optional[str] = None
    SquadronPowerplayState: Optional[str] = None
    SquadronRank: Optional[str] = None

@dataclass
class SRVDestroyed:
    timestamp: str
    event: str = field(default="SRVDestroyed")
    ID: Optional[int] = None

@dataclass
class StartJump:
    timestamp: str
    event: str = field(default="StartJump")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    JumpType: Optional[str] = None
    StarSystem: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class Status_Fuel:
    FuelMain: float
    FuelReservoir: float

@dataclass
class Status_Destination:
    Body: Optional[int] = None
    System: Optional[int] = None

@dataclass
class Status:
    timestamp: str
    Cargo: float
    FireGroup: int
    Flags: int
    Fuel: Status_Fuel
    GuiFocus: int
    Pips: list[int]
    event: str = field(default="Status")
    Altitude: Optional[float] = None
    Balance: Optional[int] = None
    BodyName: Optional[str] = None
    Destination: Optional[Status_Destination] = None
    Flags2: Optional[int] = None
    Heading: Optional[float] = None
    Latitude: Optional[float] = None
    LegalState: Optional[str] = None
    Longitude: Optional[float] = None
    PlanetRadius: Optional[float] = None

@dataclass
class SupercruiseEntry:
    timestamp: str
    event: str = field(default="SupercruiseEntry")
    System: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class SupercruiseExit:
    timestamp: str
    event: str = field(default="SupercruiseExit")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    BodyType: Optional[str] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class SwitchSuitLoadout_Module:
    ModuleName: Optional[str] = None
    ModuleName_Localised: Optional[str] = None
    SlotName: Optional[str] = None
    SuitModuleID: Optional[int] = None

@dataclass
class SwitchSuitLoadout:
    timestamp: str
    event: str = field(default="SwitchSuitLoadout")
    LoadoutID: Optional[int] = None
    LoadoutName: Optional[str] = None
    Modules: Optional[list[SwitchSuitLoadout_Module]] = None
    SuitID: Optional[int] = None
    SuitName: Optional[str] = None
    SuitName_Localised: Optional[str] = None

@dataclass
class Synthesis_Material:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class Synthesis:
    timestamp: str
    event: str = field(default="Synthesis")
    Materials: Optional[list[Synthesis_Material]] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class Touchdown:
    timestamp: str
    event: str = field(default="Touchdown")
    Body: Optional[str] = None
    BodyID: Optional[int] = None
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None
    OnPlanet: Optional[bool] = None
    OnStation: Optional[bool] = None
    PlayerControlled: Optional[bool] = None
    System: Optional[str] = None
    SystemAddress: Optional[int] = None

@dataclass
class TradeMicroResources_Offered:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class TradeMicroResources_Received:
    Count: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class TradeMicroResources:
    timestamp: str
    event: str = field(default="TradeMicroResources")
    MarketID: Optional[int] = None
    Offered: Optional[list[TradeMicroResources_Offered]] = None
    Received: Optional[list[TradeMicroResources_Received]] = None

@dataclass
class TransferMicroResources_Transfer:
    Count: Optional[int] = None
    Direction: Optional[str] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None

@dataclass
class TransferMicroResources:
    timestamp: str
    event: str = field(default="TransferMicroResources")
    Transfers: Optional[list[TransferMicroResources_Transfer]] = None

@dataclass
class Undocked:
    timestamp: str
    event: str = field(default="Undocked")
    MarketID: Optional[int] = None
    StationName: Optional[str] = None
    StationType: Optional[str] = None

@dataclass
class Undocking:
    timestamp: str
    event: str = field(default="Undocking")
    MarketID: Optional[int] = None
    StationName: Optional[str] = None

@dataclass
class UpgradeSuit:
    timestamp: str
    event: str = field(default="UpgradeSuit")
    Class: Optional[int] = None
    Cost: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    SuitID: Optional[int] = None

@dataclass
class UpgradeWeapon:
    timestamp: str
    event: str = field(default="UpgradeWeapon")
    Class: Optional[int] = None
    Cost: Optional[int] = None
    Name: Optional[str] = None
    Name_Localised: Optional[str] = None
    WeaponID: Optional[int] = None

@dataclass
class UseConsumable:
    timestamp: str
    event: str = field(default="UseConsumable")
    Consumable: Optional[str] = None
    Consumable_Localised: Optional[str] = None
    Type: Optional[str] = None

@dataclass
class WingAdd:
    timestamp: str
    event: str = field(default="WingAdd")
    Other: Optional[str] = None

@dataclass
class WingInvite:
    timestamp: str
    event: str = field(default="WingInvite")
    Other: Optional[str] = None

@dataclass
class WingJoin_Other:
    Name: Optional[str] = None

@dataclass
class WingJoin:
    timestamp: str
    event: str = field(default="WingJoin")
    Others: Optional[list[WingJoin_Other]] = None

@dataclass
class WingLeave:
    timestamp: str
    event: str = field(default="WingLeave")


# ─┬─ Shared types (hardcoded from TS types.ts) ───────────────────────────


@dataclass
class FactionState:
    Name: str
    FactionState: str
    Government: str
    Influence: float
    Allegiance: str
    Happiness: Optional[str] = None
    Happiness_Localised: Optional[str] = None
    MyReputation: Optional[float] = None
    SquadronFaction: Optional[bool] = None
    ActiveStates: Optional[list[StateTimeline]] = None
    PendingStates: Optional[list[StateTimeline]] = None
    RecoveringStates: Optional[list[StateTimeline]] = None

@dataclass
class StateTimeline:
    State: str
    Trend: Optional[float] = None

@dataclass
class Conflict:
    WarType: str
    Status: str
    Faction1: ConflictFaction
    Faction2: ConflictFaction

@dataclass
class ConflictFaction:
    Name: str
    Stake: str
    WonDays: int

@dataclass
class ThargoidWarInfo:
    WarType: Optional[str] = None
    RemainingPorts: Optional[int] = None
    SuccessReached: Optional[bool] = None
    EstimatedRemainingTime: Optional[str] = None

@dataclass
class StationEconomy:
    Name: str
    Share: float

@dataclass
class LandingPads:
    Small: int
    Medium: int
    Large: int

@dataclass
class CommodityItem:
    Name: str
    BuyPrice: int
    SellPrice: int
    MeanPrice: int
    StockBracket: int
    DemandBracket: int
    Stock: int
    Demand: int
    StatusFlags: str
    Name_Localised: Optional[str] = None

@dataclass
class ParentBody:
    Star: Optional[int] = None
    Planet: Optional[int] = None
    Null: Optional[int] = None

@dataclass
class Ring:
    Name: str
    RingClass: str
    MassMT: float
    InnerRad: float
    OuterRad: float

@dataclass
class AtmosphereComposition:
    Name: str
    Percent: float

@dataclass
class Composition:
    Ice: Optional[float] = None
    Rock: Optional[float] = None
    Metal: Optional[float] = None

@dataclass
class Mission:
    timestamp: str
    MissionID: int
    Name: str
    event: str = field(default="")
    PassengerMission: Optional[bool] = None
    Expiry: Optional[str] = None
    Influence: Optional[str] = None
    Reputation: Optional[str] = None
    Reward: Optional[int] = None
    Wing: Optional[bool] = None
    Failed: Optional[bool] = None

@dataclass
class EngineeringMod:
    Engineer: str
    BlueprintName: str
    BlueprintID: int
    Level: int
    Quality: float
    ExperimentalEffect: Optional[str] = None
    ExperimentalEffect_Localised: Optional[str] = None
    Modifiers: Optional[list[Modifier]] = None

@dataclass
class Modifier:
    Label: str
    Value: Optional[float] = None
    OriginalValue: Optional[float] = None
    LessIsGood: Optional[bool] = None
    ValueStr: Optional[str] = None

@dataclass
class ModuleItem:
    Slot: str
    Item: str
    On: bool
    Priority: int
    Item_Localised: Optional[str] = None
    Health: Optional[float] = None
    Value: Optional[int] = None
    Engineering: Optional[EngineeringMod] = None
    AmmoClip: Optional[int] = None
    AmmoHopper: Optional[int] = None

@dataclass
class ShipItem:
    Ship: str
    ShipID: int
    ShipName: str
    ShipIdent: str
    Modules: Optional[list[ModuleItem]] = None
    FuelCapacity: Optional[dict[str, float]] = None
    CargoCapacity: Optional[int] = None
    HullValue: Optional[int] = None
    ModulesValue: Optional[int] = None
    Rebuy: Optional[int] = None
    Hot: Optional[bool] = None
    HullHealth: Optional[float] = None
    UnladenMass: Optional[float] = None
    MaxJumpRange: Optional[float] = None

@dataclass
class FuelStatus:
    FuelMain: float
    FuelReservoir: float

@dataclass
class DestinationStatus:
    System: int
    Body: int

@dataclass
class JournalPosition:
    file: str
    offset: int
    line: int