// Generated code – do not edit manually
#nullable enable
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace EliteDangerousSdk.Journal;

public record AfmuRepairs
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "AfmuRepairs";
    public bool? FullyRepaired { get; init; }
    public double? Health { get; init; }
    public string? Module { get; init; }
    public string? Module_Localised { get; init; }
}

public record AppliedToSquadron
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "AppliedToSquadron";
    public string? SquadronName { get; init; }
}

public record ApproachBody
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ApproachBody";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
}

public record ApproachSettlement
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ApproachSettlement";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public long? MarketID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? SystemAddress { get; init; }
}

public record Backpack_Data
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record Backpack_Item
{
    public long? Count { get; init; }
    public string? LocType { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? OwnerID { get; init; }
    public string? Type { get; init; }
}

public record Backpack_Component
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record Backpack_Consumable
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record Backpack
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Backpack";
    public List<Backpack_Component>? Components { get; init; }
    public List<Backpack_Consumable>? Consumables { get; init; }
    public List<Backpack_Data>? Data { get; init; }
    public List<Backpack_Item>? Items { get; init; }
}

public record BackpackChange_Removed
{
    public long? Count { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? OwnerID { get; init; }
    public string? Type { get; init; }
}

public record BackpackChange_Added
{
    public long? Count { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? OwnerID { get; init; }
    public string? Type { get; init; }
}

public record BackpackChange
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "BackpackChange";
    public List<BackpackChange_Added>? Added { get; init; }
    public List<BackpackChange_Removed>? Removed { get; init; }
    public long? Total { get; init; }
    public long? Type { get; init; }
}

public record BookTaxi
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "BookTaxi";
    public long? Cost { get; init; }
    public string? DestinationLocation { get; init; }
    public string? DestinationStation { get; init; }
    public string? DestinationSystem { get; init; }
}

public record Bounty_Reward
{
    public string? Faction { get; init; }
    public long? Legacy { get; init; }
    public long? Reward { get; init; }
    public string? VictimFaction { get; init; }
}

public record Bounty
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Bounty";
    public string? Faction { get; init; }
    public List<Bounty_Reward>? Rewards { get; init; }
    public long? SharedWithOthers { get; init; }
    public string? Target { get; init; }
    public string? Target_Localised { get; init; }
    public long? TotalReward { get; init; }
    public string? VictimFaction { get; init; }
}

public record BuyAmmo
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "BuyAmmo";
    public long? Cost { get; init; }
}

public record BuyDrones
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "BuyDrones";
    public long? BuyPrice { get; init; }
    public long? Count { get; init; }
    public long? TotalCost { get; init; }
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record BuyExplorationData
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "BuyExplorationData";
    public long? Cost { get; init; }
    public string? System { get; init; }
}

public record BuyMicroResources
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "BuyMicroResources";
    public string? Category { get; init; }
    public string? Category_Localised { get; init; }
    public long? Cost { get; init; }
    public long? Count { get; init; }
    public long? MarketID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record BuySuit
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "BuySuit";
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? Price { get; init; }
    public long? SuitID { get; init; }
    public List<string>? SuitMods { get; init; }
}

public record BuyTradeData
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "BuyTradeData";
    public long? Cost { get; init; }
    public string? System { get; init; }
}

public record BuyWeapon
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "BuyWeapon";
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? Price { get; init; }
    public long? WeaponID { get; init; }
}

public record CancelTaxi
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CancelTaxi";
    public long? Refund { get; init; }
}

public record CapShipBond
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CapShipBond";
    public long? Amount { get; init; }
    public string? AwardingFaction { get; init; }
    public string? AwardingFaction_Localised { get; init; }
    public bool? Fighter { get; init; }
    public bool? PlayerPilot { get; init; }
    public string? VictimFaction { get; init; }
    public string? VictimFaction_Localised { get; init; }
}

public record Cargo_Inventory
{
    public long? Count { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? Stolen { get; init; }
}

public record Cargo
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Cargo";
    public List<Cargo_Inventory> Inventory { get; init; }
    public string Vessel { get; init; }
}

public record CarrierBankTransfer
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierBankTransfer";
    public long? CarrierBalance { get; init; }
    public long? CarrierID { get; init; }
    public long? Deposit { get; init; }
    public long? PlayerBalance { get; init; }
    public long? Withdraw { get; init; }
}

public record CarrierBuy
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierBuy";
    public string? Callsign { get; init; }
    public long? CarrierID { get; init; }
    public string? Location { get; init; }
    public long? Price { get; init; }
    public long? SystemAddress { get; init; }
    public string? Variant { get; init; }
}

public record CarrierCrewService
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierCrewService";
    public long? CarrierID { get; init; }
    public string? CrewName { get; init; }
    public string? CrewRole { get; init; }
    public string? Operation { get; init; }
}

public record CarrierDeploy
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierDeploy";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public long? CarrierID { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
}

public record CarrierFinance
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierFinance";
    public long? AvailableBalance { get; init; }
    public long? CarrierID { get; init; }
    public long? ReserveBalance { get; init; }
    public long? ReservePercent { get; init; }
    public long? TaxRate { get; init; }
}

public record CarrierJump
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierJump";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
}

public record CarrierJumpRequest
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierJumpRequest";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public string? DepartureTime { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
}

public record CarrierModulePack
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierModulePack";
    public long? CarrierID { get; init; }
    public long? Cost { get; init; }
    public string? Operation { get; init; }
    public string? PackTheme { get; init; }
    public string? PackTheme_Localised { get; init; }
    public long? PackTier { get; init; }
}

public record CarrierNameChange
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierNameChange";
    public string? Callsign { get; init; }
    public long? CarrierID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record CarrierSell
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierSell";
    public string? Callsign { get; init; }
    public long? CarrierID { get; init; }
    public string? Location { get; init; }
    public long? Price { get; init; }
    public long? SystemAddress { get; init; }
}

public record CarrierShipPack
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierShipPack";
    public long? CarrierID { get; init; }
    public long? Cost { get; init; }
    public string? Operation { get; init; }
    public string? PackTheme { get; init; }
    public string? PackTheme_Localised { get; init; }
    public long? PackTier { get; init; }
}

public record CarrierStats_Pack
{
    public string? PackTheme { get; init; }
    public string? PackTheme_Localised { get; init; }
    public long? PackTier { get; init; }
}

public record CarrierStats
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierStats";
    public bool? AllowNotorious { get; init; }
    public string? Callsign { get; init; }
    public long? CarrierID { get; init; }
    public string? DockingAccess { get; init; }
    public bool? ExoBiology { get; init; }
    public double? FuelLevel { get; init; }
    public double? JumpRangeCurr { get; init; }
    public double? JumpRangeMax { get; init; }
    public bool? Market { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public bool? Outfitting { get; init; }
    public List<CarrierStats_Pack>? Pack { get; init; }
    public bool? PendingDecommision { get; init; }
    public bool? Rearm { get; init; }
    public bool? Refuel { get; init; }
    public bool? Repair { get; init; }
    public bool? Shipyard { get; init; }
    public string? SpaceAccess { get; init; }
    public string? Theme { get; init; }
    public bool? VoucherExploration { get; init; }
    public bool? VoucherMarket { get; init; }
    public bool? VoucherTrade { get; init; }
}

public record CarrierTradeOrder
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CarrierTradeOrder";
    public bool? BlackMarket { get; init; }
    public bool? CancelTrade { get; init; }
    public long? CarrierID { get; init; }
    public string? Commodity { get; init; }
    public string? Commodity_Localised { get; init; }
    public long? Price { get; init; }
    public long? PurchaseOrder { get; init; }
    public long? SaleOrder { get; init; }
    public long? Stock { get; init; }
}

public record ChangeCrewAssignedRole
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ChangeCrewAssignedRole";
    public string? Role { get; init; }
}

public record CodexEntry
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CodexEntry";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public string? Category { get; init; }
    public string? Category_Localised { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public string? NearestDestination { get; init; }
    public string? NearestDestination_Localised { get; init; }
    public string? Region { get; init; }
    public string? Region_Localised { get; init; }
    public string? SubCategory { get; init; }
    public string? SubCategory_Localised { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
    public long? VoucherAmount { get; init; }
}

public record CollectItems
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CollectItems";
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? OwnerID { get; init; }
    public bool? Stolen { get; init; }
    public string? Type { get; init; }
}

public record CollectMicroResources_Item
{
    public long? Count { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? OwnerID { get; init; }
    public string? Type { get; init; }
}

public record CollectMicroResources
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CollectMicroResources";
    public List<CollectMicroResources_Item>? Items { get; init; }
}

public record CommitCrime
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CommitCrime";
    public long? Bounty { get; init; }
    public string? CrimeType { get; init; }
    public string? Faction { get; init; }
    public long? Fine { get; init; }
    public string? Victim { get; init; }
    public string? Victim_Localised { get; init; }
}

public record CommunityGoal_TopTier
{
    public string? Bonus { get; init; }
    public string? Bonus_Localised { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record CommunityGoal_CurrentGoal
{
    public long? Bonus { get; init; }
    public long? CGID { get; init; }
    public long? CurrentTotal { get; init; }
    public string? Expiry { get; init; }
    public bool? IsComplete { get; init; }
    public string? MarketName { get; init; }
    public long? NumContributors { get; init; }
    public long? PlayerContribution { get; init; }
    public long? PlayerPercentileBand { get; init; }
    public string? SystemName { get; init; }
    public string? TierReached { get; init; }
    public string? Title { get; init; }
    public string? Title_Localised { get; init; }
    public long? TopRankSize { get; init; }
    public CommunityGoal_TopTier? TopTier { get; init; }
}

public record CommunityGoal
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CommunityGoal";
    public List<CommunityGoal_CurrentGoal>? CurrentGoals { get; init; }
}

public record CommunityGoalDiscard
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CommunityGoalDiscard";
    public long? CGID { get; init; }
    public string? MarketName { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public string? SystemName { get; init; }
}

public record CommunityGoalJoin
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CommunityGoalJoin";
    public long? CGID { get; init; }
    public string? MarketName { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public string? SystemName { get; init; }
}

public record CommunityGoalReward
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CommunityGoalReward";
    public long? CGID { get; init; }
    public long? DetailReward { get; init; }
    public string? MarketName { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? Reward { get; init; }
    public string? SystemName { get; init; }
}

public record Continued
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Continued";
    public long? Part { get; init; }
}

public record CreateSuitLoadout_Module
{
    public string? ModuleName { get; init; }
    public string? ModuleName_Localised { get; init; }
    public string? SlotName { get; init; }
    public long? SuitModuleID { get; init; }
}

public record CreateSuitLoadout
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CreateSuitLoadout";
    public string? LoadoutName { get; init; }
    public List<CreateSuitLoadout_Module>? Modules { get; init; }
    public long? SuitID { get; init; }
    public List<string>? SuitMods { get; init; }
    public string? SuitName { get; init; }
    public string? SuitName_Localised { get; init; }
}

public record CrewFire
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CrewFire";
    public long? CombatRank { get; init; }
    public string? Name { get; init; }
}

public record CrewHire
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CrewHire";
    public long? CombatRank { get; init; }
    public long? Cost { get; init; }
    public string? Faction { get; init; }
    public string? Name { get; init; }
}

public record CrewLaunchFighter
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CrewLaunchFighter";
    public string? Crew { get; init; }
    public long? ID { get; init; }
    public string? Loadout { get; init; }
    public string? Loadout_Localised { get; init; }
}

public record CrewMemberJoins
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CrewMemberJoins";
    public long? CombatRank { get; init; }
    public string? Crew { get; init; }
    public bool? Telepresence { get; init; }
}

public record CrewMemberQuits
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CrewMemberQuits";
    public string? Crew { get; init; }
    public bool? Telepresence { get; init; }
}

public record CrewMemberRoleChange
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CrewMemberRoleChange";
    public string? Crew { get; init; }
    public string? Role { get; init; }
    public bool? Telepresence { get; init; }
}

public record CrewRoleRepair
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "CrewRoleRepair";
    public long? CrewID { get; init; }
}

public record DataScanned
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DataScanned";
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record DeleteSuitLoadout
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DeleteSuitLoadout";
    public long? LoadoutID { get; init; }
    public string? LoadoutName { get; init; }
    public long? SuitID { get; init; }
    public string? SuitName { get; init; }
    public string? SuitName_Localised { get; init; }
}

public record Died_Killer
{
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public string? Rank { get; init; }
    public string? Ship { get; init; }
}

public record Died
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Died";
    public string? KillerName { get; init; }
    public string? KillerName_Localised { get; init; }
    public string? KillerRank { get; init; }
    public List<Died_Killer>? Killers { get; init; }
    public string? KillerShip { get; init; }
}

public record DisbandedSquadron
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DisbandedSquadron";
    public string? SquadronName { get; init; }
}

public record Disembark
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Disembark";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public long? MarketID { get; init; }
    public bool? Multicrew { get; init; }
    public bool? OnPlanet { get; init; }
    public bool? OnStation { get; init; }
    public bool? SRV { get; init; }
    public string? StarSystem { get; init; }
    public string? StationName { get; init; }
    public string? StationType { get; init; }
    public long? SystemAddress { get; init; }
    public bool? Taxi { get; init; }
}

public record Docked
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Docked";
    public long MarketID { get; init; }
    public string StarSystem { get; init; }
    public string StationName { get; init; }
    public string StationType { get; init; }
    public bool? ActiveFine { get; init; }
    public bool? CockpitBreach { get; init; }
    public double? DistFromStarLS { get; init; }
    public LandingPads? LandingPads { get; init; }
    public string? PowerplayState { get; init; }
    public List<string>? Powers { get; init; }
    public string? StationAllegiance { get; init; }
    public List<StationEconomy>? StationEconomies { get; init; }
    public string? StationEconomy { get; init; }
    public string? StationGovernment { get; init; }
    public List<string>? StationServices { get; init; }
    public string? StationState { get; init; }
    public long? SystemAddress { get; init; }
    public string? Taxoname { get; init; }
    public bool? Wanted { get; init; }
}

public record DockFighter
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DockFighter";
    public long? ID { get; init; }
}

public record DockingCancelled
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DockingCancelled";
    public long? MarketID { get; init; }
    public string? StationName { get; init; }
}

public record DockingDenied
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DockingDenied";
    public long? MarketID { get; init; }
    public string? Reason { get; init; }
    public string? StationName { get; init; }
    public string? StationType { get; init; }
}

public record DockingGranted
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DockingGranted";
    public long? LandingPad { get; init; }
    public long? MarketID { get; init; }
    public string? StationName { get; init; }
    public string? StationType { get; init; }
}

public record DockingRequested
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DockingRequested";
    public long? LandingPad { get; init; }
    public long? MarketID { get; init; }
    public string? StationName { get; init; }
    public string? StationType { get; init; }
}

public record DockingTimeout
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DockingTimeout";
    public long? MarketID { get; init; }
    public string? StationName { get; init; }
}

public record DockSRV
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DockSRV";
    public long? ID { get; init; }
}

public record DropShipDeploy
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "DropShipDeploy";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public long? MarketID { get; init; }
    public bool? OnPlanet { get; init; }
    public bool? OnStation { get; init; }
    public string? StarSystem { get; init; }
    public string? StationName { get; init; }
    public string? StationType { get; init; }
    public long? SystemAddress { get; init; }
}

public record EjectCargo
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "EjectCargo";
    public bool? Abandoned { get; init; }
    public long? Count { get; init; }
    public long? MissionID { get; init; }
    public bool? Powerplay { get; init; }
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record Embark
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Embark";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public long? MarketID { get; init; }
    public bool? Multicrew { get; init; }
    public bool? OnPlanet { get; init; }
    public bool? OnStation { get; init; }
    public bool? SRV { get; init; }
    public string? StarSystem { get; init; }
    public string? StationName { get; init; }
    public string? StationType { get; init; }
    public long? SystemAddress { get; init; }
    public bool? Taxi { get; init; }
}

public record EndCrewSession
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "EndCrewSession";
}

public record EngineerApply
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "EngineerApply";
    public string? Blueprint { get; init; }
    public long? BlueprintID { get; init; }
    public string? Engineer { get; init; }
    public long? Level { get; init; }
}

public record EngineerCraft_Ingredient
{
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? Quantity { get; init; }
}

public record EngineerCraft
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "EngineerCraft";
    public string? Blueprint { get; init; }
    public long? BlueprintID { get; init; }
    public string? Engineer { get; init; }
    public long? EngineerID { get; init; }
    public string? ExperimentalEffect { get; init; }
    public string? ExperimentalEffect_Localised { get; init; }
    public List<EngineerCraft_Ingredient>? Ingredients { get; init; }
    public long? Level { get; init; }
    public List<Modifier>? Modifiers { get; init; }
    public double? Quality { get; init; }
}

public record EngineerProgress_Engineer
{
    public string? Engineer { get; init; }
    public long? EngineerID { get; init; }
    public string? Progress { get; init; }
    public long? Rank { get; init; }
    public long? RankProgress { get; init; }
}

public record EngineerProgress
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "EngineerProgress";
    public List<EngineerProgress_Engineer>? Engineers { get; init; }
}

public record FactionKillBond
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "FactionKillBond";
    public long? Amount { get; init; }
    public string? AwardingFaction { get; init; }
    public string? AwardingFaction_Localised { get; init; }
    public string? VictimFaction { get; init; }
    public string? VictimFaction_Localised { get; init; }
}

public record FCMaterials_Data
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record FCMaterials_Item
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record FCMaterials_Component
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record FCMaterials_Consumable
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record FCMaterials
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "FCMaterials";
    public List<FCMaterials_Component>? Components { get; init; }
    public List<FCMaterials_Consumable>? Consumables { get; init; }
    public List<FCMaterials_Data>? Data { get; init; }
    public List<FCMaterials_Item>? Items { get; init; }
}

public record FCMaterialsCAPI_Data
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record FCMaterialsCAPI_Item
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record FCMaterialsCAPI_Component
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record FCMaterialsCAPI_Consumable
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record FCMaterialsCAPI
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "FCMaterialsCAPI";
    public string? CarrierName { get; init; }
    public string? CarrierName_Localised { get; init; }
    public List<FCMaterialsCAPI_Component>? Components { get; init; }
    public List<FCMaterialsCAPI_Consumable>? Consumables { get; init; }
    public List<FCMaterialsCAPI_Data>? Data { get; init; }
    public List<FCMaterialsCAPI_Item>? Items { get; init; }
    public long? MarketID { get; init; }
}

public record FighterDestroyed
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "FighterDestroyed";
    public long? ID { get; init; }
}

public record FileHeader
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "FileHeader";
    public long part { get; init; }
    public string? build { get; init; }
    public string? gameversion { get; init; }
    public string? language { get; init; }
    public bool? odyssey { get; init; }
}

public record FSDJump
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "FSDJump";
    public double JumpDist { get; init; }
    public List<double> StarPos { get; init; }
    public string StarSystem { get; init; }
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public double? BoostUsed { get; init; }
    public List<Conflict>? Conflicts { get; init; }
    public List<FactionState>? Factions { get; init; }
    public double? FuelLevel { get; init; }
    public double? FuelUsed { get; init; }
    public long? Population { get; init; }
    public string? PowerplayState { get; init; }
    public List<string>? Powers { get; init; }
    public long? SystemAddress { get; init; }
    public string? SystemAllegiance { get; init; }
    public string? SystemEconomy { get; init; }
    public string? SystemGovernment { get; init; }
    public string? SystemSecondEconomy { get; init; }
    public string? SystemSecurity { get; init; }
    public string? Taxoname { get; init; }
}

public record FSSBodySignals_Signal
{
    public long? Count { get; init; }
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record FSSBodySignals
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "FSSBodySignals";
    public long? BodyID { get; init; }
    public string? BodyName { get; init; }
    public List<FSSBodySignals_Signal>? Signals { get; init; }
    public long? SystemAddress { get; init; }
}

public record FSSSignalDiscovered
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "FSSSignalDiscovered";
    public string? SignalName { get; init; }
    public string? SignalName_Localised { get; init; }
    public string? SpawningFaction { get; init; }
    public string? SpawningState { get; init; }
    public long? SystemAddress { get; init; }
    public string? ThargoidWar { get; init; }
    public string? USSType { get; init; }
    public string? USSType_Localised { get; init; }
}

public record FuelScoop
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "FuelScoop";
    public double? Scooped { get; init; }
    public double? Total { get; init; }
}

public record HeatDamage
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "HeatDamage";
}

public record HeatWarning
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "HeatWarning";
}

public record HullDamage
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "HullDamage";
    public bool? Fighter { get; init; }
    public double? Health { get; init; }
    public bool? PlayerPilot { get; init; }
}

public record InvitedToSquadron
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "InvitedToSquadron";
    public string? InviterName { get; init; }
    public string? InviterName_Localised { get; init; }
    public string? SquadronName { get; init; }
}

public record JoinACrew
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "JoinACrew";
    public string? Captain { get; init; }
    public string? Captain_Localised { get; init; }
}

public record JoinedSquadron
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "JoinedSquadron";
    public string? SquadronName { get; init; }
}

public record KickCrewMember
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "KickCrewMember";
    public string? Crew { get; init; }
    public bool? Telepresence { get; init; }
}

public record KickedFromSquadron
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "KickedFromSquadron";
    public string? SquadronName { get; init; }
}

public record LaunchFighter
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "LaunchFighter";
    public string? Loadout { get; init; }
    public string? Loadout_Localised { get; init; }
    public bool? PlayerControlled { get; init; }
}

public record LaunchSRV
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "LaunchSRV";
    public long? ID { get; init; }
    public string? Loadout { get; init; }
    public string? Loadout_Localised { get; init; }
    public bool? PlayerControlled { get; init; }
}

public record LeaveBody
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "LeaveBody";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
}

public record LeftSquadron
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "LeftSquadron";
    public long? OldRank { get; init; }
    public string? SquadronName { get; init; }
}

public record Liftoff
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Liftoff";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public bool? OnPlanet { get; init; }
    public bool? OnStation { get; init; }
    public bool? PlayerControlled { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
}

public record LoadGame
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "LoadGame";
    public string Commander { get; init; }
    public long Credits { get; init; }
    public string GameMode { get; init; }
    public long Loan { get; init; }
    public string Ship { get; init; }
    public long ShipID { get; init; }
    public string? build { get; init; }
    public string? FID { get; init; }
    public double? FuelCapacity { get; init; }
    public double? FuelLevel { get; init; }
    public string? gameversion { get; init; }
    public string? Group { get; init; }
    public bool? Horizons { get; init; }
    public string? language { get; init; }
    public bool? Odyssey { get; init; }
    public string? ShipIdent { get; init; }
    public string? ShipName { get; init; }
}

public record Location
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Location";
    public List<double> StarPos { get; init; }
    public string StarSystem { get; init; }
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public string? BodyType { get; init; }
    public bool? Docked { get; init; }
    public long? MarketID { get; init; }
    public long? Population { get; init; }
    public string? PowerplayState { get; init; }
    public List<string>? Powers { get; init; }
    public string? StationName { get; init; }
    public string? StationType { get; init; }
    public long? SystemAddress { get; init; }
    public string? SystemAllegiance { get; init; }
    public string? SystemEconomy { get; init; }
    public string? SystemGovernment { get; init; }
    public string? SystemSecondEconomy { get; init; }
    public string? SystemSecurity { get; init; }
}

public record Market_Item
{
    public long? BuyPrice { get; init; }
    public long? Demand { get; init; }
    public long? DemandBracket { get; init; }
    public long? MeanPrice { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? SellPrice { get; init; }
    public string? StatusFlags { get; init; }
    public long? Stock { get; init; }
    public long? StockBracket { get; init; }
}

public record Market
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Market";
    public List<Market_Item> Items { get; init; }
    public long MarketID { get; init; }
    public string StarSystem { get; init; }
    public string StationName { get; init; }
    public string StationType { get; init; }
    public string? CarrierDockingAccess { get; init; }
    public long? SystemAddress { get; init; }
}

public record MarketBuy
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MarketBuy";
    public long? BuyPrice { get; init; }
    public long? Count { get; init; }
    public long? MarketID { get; init; }
    public long? TotalCost { get; init; }
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record MarketSell
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MarketSell";
    public long? AvgPricePaid { get; init; }
    public bool? BlackMarket { get; init; }
    public long? Count { get; init; }
    public bool? IllegalGoods { get; init; }
    public long? MarketID { get; init; }
    public long? SellPrice { get; init; }
    public bool? Stolen { get; init; }
    public long? TotalSale { get; init; }
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record MaterialCollected
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MaterialCollected";
    public string? Category { get; init; }
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record MaterialDiscarded
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MaterialDiscarded";
    public string? Category { get; init; }
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record MaterialDiscovered
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MaterialDiscovered";
    public string? Category { get; init; }
    public long? DiscoveryNumber { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record MaterialTrade_Traded
{
    public string? Category { get; init; }
    public string? Category_Localised { get; init; }
    public string? Material { get; init; }
    public string? Material_Localised { get; init; }
    public long? Quantity { get; init; }
}

public record MaterialTrade_Received
{
    public string? Category { get; init; }
    public string? Category_Localised { get; init; }
    public string? Material { get; init; }
    public string? Material_Localised { get; init; }
    public long? Quantity { get; init; }
}

public record MaterialTrade
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MaterialTrade";
    public long? MarketID { get; init; }
    public MaterialTrade_Received? Received { get; init; }
    public MaterialTrade_Traded? Traded { get; init; }
    public string? TraderType { get; init; }
}

public record MiningRefined
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MiningRefined";
    public string? Commodity_Localised { get; init; }
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record MissionAbandoned
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MissionAbandoned";
    public long? Fine { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record MissionAccepted_CommodityReward
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record MissionAccepted_MaterialsRequired
{
    public string? Category { get; init; }
    public string? Category_Localised { get; init; }
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record MissionAccepted
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MissionAccepted";
    public string? Commodity { get; init; }
    public string? Commodity_Localised { get; init; }
    public List<MissionAccepted_CommodityReward>? CommodityReward { get; init; }
    public long? Count { get; init; }
    public string? DestinationStation { get; init; }
    public string? DestinationSystem { get; init; }
    public long? Donated { get; init; }
    public string? Donation { get; init; }
    public string? Expiry { get; init; }
    public string? Faction { get; init; }
    public string? Influence { get; init; }
    public string? InfluenceGain { get; init; }
    public long? KillCount { get; init; }
    public string? LocalisedName { get; init; }
    public List<MissionAccepted_MaterialsRequired>? MaterialsRequired { get; init; }
    public long? MinJumps { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? PassengerCount { get; init; }
    public bool? PassengerMission { get; init; }
    public string? PassengerType { get; init; }
    public bool? PassengerVIPs { get; init; }
    public bool? PassengerWanted { get; init; }
    public string? Reputation { get; init; }
    public string? ReputationGain { get; init; }
    public long? Reward { get; init; }
    public string? Target { get; init; }
    public string? Target_Localised { get; init; }
    public string? TargetCommodity { get; init; }
    public string? TargetCommodity_Localised { get; init; }
    public string? TargetFaction { get; init; }
    public string? TargetType { get; init; }
    public string? TargetType_Localised { get; init; }
    public bool? Wing { get; init; }
}

public record MissionCompleted_MaterialsReward
{
    public string? Category { get; init; }
    public string? Category_Localised { get; init; }
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record MissionCompleted_PermitsAwarded
{
    public string? Permit { get; init; }
}

public record MissionCompleted_Influence
{
    public string? Influence { get; init; }
    public long? SystemAddress { get; init; }
    public string? Trend { get; init; }
}

public record MissionCompleted_Effect
{
    public string? Effect { get; init; }
    public string? Effect_Localised { get; init; }
    public string? Trend { get; init; }
}

public record MissionCompleted_FactionEffect
{
    public List<MissionCompleted_Effect>? Effects { get; init; }
    public string? Faction { get; init; }
    public MissionCompleted_Influence? Influence { get; init; }
    public string? Reputation { get; init; }
    public string? ReputationTrend { get; init; }
}

public record MissionCompleted_CommodityReward
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record MissionCompleted
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MissionCompleted";
    public string? Commodity { get; init; }
    public string? Commodity_Localised { get; init; }
    public List<MissionCompleted_CommodityReward>? CommodityReward { get; init; }
    public long? Count { get; init; }
    public string? DestinationStation { get; init; }
    public string? DestinationSystem { get; init; }
    public long? Donated { get; init; }
    public string? Donation { get; init; }
    public string? Faction { get; init; }
    public List<MissionCompleted_FactionEffect>? FactionEffect { get; init; }
    public long? KillCount { get; init; }
    public List<MissionCompleted_MaterialsReward>? MaterialsReward { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public List<MissionCompleted_PermitsAwarded>? PermitsAwarded { get; init; }
    public long? Reward { get; init; }
    public string? RewardDetail { get; init; }
    public string? RewardDetail_Localised { get; init; }
    public string? TargetFaction { get; init; }
}

public record MissionFailed
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MissionFailed";
    public string? Faction { get; init; }
    public long? Fine { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record MissionRedirected
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "MissionRedirected";
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public string? NewDestinationStation { get; init; }
    public string? NewDestinationSystem { get; init; }
    public string? OldDestinationStation { get; init; }
    public string? OldDestinationSystem { get; init; }
}

public record ModuleInfo_Engineering
{
    public long? BlueprintID { get; init; }
    public string? BlueprintName { get; init; }
    public string? Engineer { get; init; }
    public string? ExperimentalEffect { get; init; }
    public string? ExperimentalEffect_Localised { get; init; }
    public long? Level { get; init; }
    public List<Modifier>? Modifiers { get; init; }
    public double? Quality { get; init; }
}

public record ModuleInfo_Module
{
    public long? AmmoClip { get; init; }
    public long? AmmoHopper { get; init; }
    public ModuleInfo_Engineering? Engineering { get; init; }
    public double? Health { get; init; }
    public string? Item { get; init; }
    public string? Item_Localised { get; init; }
    public bool? On { get; init; }
    public long? Priority { get; init; }
    public string? Slot { get; init; }
    public long? Value { get; init; }
}

public record ModuleInfo
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ModuleInfo";
    public List<ModuleInfo_Module>? Modules { get; init; }
}

public record Music
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Music";
    public string? MusicTrack { get; init; }
}

public record NavBeaconScan
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "NavBeaconScan";
    public long? NumBodies { get; init; }
    public long? SystemAddress { get; init; }
}

public record NavRoute_Route
{
    public List<object>? StarPos { get; init; }
    public string? StarSystem { get; init; }
    public long? SystemAddress { get; init; }
}

public record NavRoute
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "NavRoute";
    public List<NavRoute_Route>? Route { get; init; }
}

public record NavRouteClear
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "NavRouteClear";
}

public record Outfitting_Item
{
    public long? BuyPrice { get; init; }
    public long? id { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record Outfitting
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Outfitting";
    public List<Outfitting_Item> Items { get; init; }
    public long MarketID { get; init; }
    public string StarSystem { get; init; }
    public string StationName { get; init; }
    public long? SystemAddress { get; init; }
}

public record PayFines
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PayFines";
    public bool? AllFines { get; init; }
    public long? Amount { get; init; }
    public double? BrokerPercentage { get; init; }
}

public record PayLegacyFines
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PayLegacyFines";
    public long? Amount { get; init; }
    public double? BrokerPercentage { get; init; }
}

public record PlanetApproach
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PlanetApproach";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public long? SystemAddress { get; init; }
}

public record Powerplay
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Powerplay";
    public long? Merits { get; init; }
    public string? Power { get; init; }
    public string? PowerplayState { get; init; }
    public long? Rank { get; init; }
    public long? Rating { get; init; }
    public long? TimePledged { get; init; }
    public long? Votes { get; init; }
}

public record PowerplayDefect
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PowerplayDefect";
    public string? FromPower { get; init; }
    public string? ToPower { get; init; }
}

public record PowerplayDeliver
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PowerplayDeliver";
    public long? Count { get; init; }
    public string? Power { get; init; }
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record PowerplayFastTrack
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PowerplayFastTrack";
    public long? Amount { get; init; }
    public long? Cost { get; init; }
    public string? Power { get; init; }
}

public record PowerplayJoin
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PowerplayJoin";
    public string? Power { get; init; }
}

public record PowerplayLeave
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PowerplayLeave";
    public string? Power { get; init; }
}

public record PowerplaySalary
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PowerplaySalary";
    public long? Amount { get; init; }
    public string? Power { get; init; }
}

public record PowerplayVote
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PowerplayVote";
    public string? Power { get; init; }
    public long? Vote { get; init; }
    public double? Vote_Weighting { get; init; }
    public long? Votes { get; init; }
}

public record Progress
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Progress";
    public double? Combat { get; init; }
    public double? CQC { get; init; }
    public double? Empire { get; init; }
    public double? Exobiologist { get; init; }
    public double? Explore { get; init; }
    public double? Federation { get; init; }
    public double? Soldier { get; init; }
    public double? Trade { get; init; }
}

public record Promotion
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Promotion";
    public long? Combat { get; init; }
    public long? CQC { get; init; }
    public long? Empire { get; init; }
    public long? Exobiologist { get; init; }
    public long? Explore { get; init; }
    public long? Federation { get; init; }
    public long? Soldier { get; init; }
    public long? Trade { get; init; }
}

public record ProspectedAsteroid_Material
{
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public double? Proportion { get; init; }
}

public record ProspectedAsteroid
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ProspectedAsteroid";
    public string? Content { get; init; }
    public string? Content_Localised { get; init; }
    public List<ProspectedAsteroid_Material>? Materials { get; init; }
    public string? MotherlodeMaterial { get; init; }
    public string? MotherlodeMaterial_Localised { get; init; }
    public double? MotherlodeProportion { get; init; }
    public double? Remaining { get; init; }
}

public record PVPKill
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "PVPKill";
    public long? CombatRank { get; init; }
    public string? Victim { get; init; }
    public string? Victim_Localised { get; init; }
}

public record QuitACrew
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "QuitACrew";
    public string? Captain { get; init; }
}

public record Rank
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Rank";
    public long? Combat { get; init; }
    public long? CQC { get; init; }
    public long? Empire { get; init; }
    public long? Exobiologist { get; init; }
    public long? Explore { get; init; }
    public long? Federation { get; init; }
    public long? Soldier { get; init; }
    public long? Trade { get; init; }
}

public record RebootRepair_Module
{
    public string? Module { get; init; }
    public string? Module_Localised { get; init; }
    public string? Slot { get; init; }
}

public record RebootRepair
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "RebootRepair";
    public List<RebootRepair_Module>? Modules { get; init; }
}

public record ReceiveText
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ReceiveText";
    public string? Channel { get; init; }
    public string? From { get; init; }
    public string? From_Localised { get; init; }
    public string? Message { get; init; }
    public string? Message_Localised { get; init; }
}

public record RedeemVoucher_Faction
{
    public long? Amount { get; init; }
    public string? Faction { get; init; }
}

public record RedeemVoucher
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "RedeemVoucher";
    public long? Amount { get; init; }
    public List<RedeemVoucher_Faction>? Factions { get; init; }
    public string? Type { get; init; }
}

public record RefuelAll
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "RefuelAll";
    public double? Amount { get; init; }
    public long? Cost { get; init; }
}

public record RefuelPartial
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "RefuelPartial";
    public double? Amount { get; init; }
    public long? Cost { get; init; }
}

public record RenameSuitLoadout
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "RenameSuitLoadout";
    public long? LoadoutID { get; init; }
    public string? LoadoutName { get; init; }
    public string? PreviousLoadoutName { get; init; }
    public long? SuitID { get; init; }
    public string? SuitName { get; init; }
    public string? SuitName_Localised { get; init; }
}

public record Repair
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Repair";
    public long? Cost { get; init; }
    public string? Item { get; init; }
    public string? Item_Localised { get; init; }
}

public record RepairAll
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "RepairAll";
    public long? Cost { get; init; }
}

public record ReservoirReplenished
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ReservoirReplenished";
    public double? FuelMain { get; init; }
    public double? FuelReservoir { get; init; }
}

public record RestockVehicle
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "RestockVehicle";
    public long? Cost { get; init; }
    public long? Count { get; init; }
    public string? Loadout { get; init; }
    public string? Loadout_Localised { get; init; }
    public string? Type { get; init; }
}

public record Resurrect
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Resurrect";
    public bool? Bankrupt { get; init; }
    public long? Cost { get; init; }
    public string? Option { get; init; }
}

public record SAAscanComplete
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SAAscanComplete";
    public long? BodyID { get; init; }
    public string? BodyName { get; init; }
    public long? EfficiencyTarget { get; init; }
    public long? ProbesUsed { get; init; }
    public long? SystemAddress { get; init; }
}

public record SAASignalsFound_Signal
{
    public long? Count { get; init; }
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record SAASignalsFound_Genuse
{
    public string? Genus { get; init; }
    public string? Genus_Localised { get; init; }
}

public record SAASignalsFound
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SAASignalsFound";
    public long? BodyID { get; init; }
    public string? BodyName { get; init; }
    public List<SAASignalsFound_Genuse>? Genuses { get; init; }
    public List<SAASignalsFound_Signal>? Signals { get; init; }
    public long? SystemAddress { get; init; }
}

public record Scan
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Scan";
    public long BodyID { get; init; }
    public string BodyName { get; init; }
    public double DistanceFromArrivalLS { get; init; }
    public string StarSystem { get; init; }
    public double? AbsoluteMagnitude { get; init; }
    public double? Age_MY { get; init; }
    public List<AtmosphereComposition>? AtmosphereComposition { get; init; }
    public string? AtmosphereType { get; init; }
    public double? AxialTilt { get; init; }
    public Composition? Composition { get; init; }
    public double? Eccentricity { get; init; }
    public bool? Landable { get; init; }
    public string? Luminosity { get; init; }
    public double? MassEM { get; init; }
    public Dictionary<string, double>? Materials { get; init; }
    public double? OrbitalInclination { get; init; }
    public double? OrbitalPeriod { get; init; }
    public List<ParentBody>? Parents { get; init; }
    public double? Periapsis { get; init; }
    public string? PlanetClass { get; init; }
    public double? Radius { get; init; }
    public List<Ring>? Rings { get; init; }
    public double? RotationPeriod { get; init; }
    public string? ScanType { get; init; }
    public double? SemiMajorAxis { get; init; }
    public List<double>? StarPos { get; init; }
    public string? StarType { get; init; }
    public double? StellarMass { get; init; }
    public double? StellarRadius { get; init; }
    public long? Subclass { get; init; }
    public double? SurfaceGravity { get; init; }
    public double? SurfacePressure { get; init; }
    public double? SurfaceTemperature { get; init; }
    public long? SystemAddress { get; init; }
    public string? TerraformingState { get; init; }
    public bool? TidalLock { get; init; }
    public string? Volcanism { get; init; }
    public bool? WasDiscovered { get; init; }
    public bool? WasDiscoveredByName { get; init; }
    public bool? WasMapped { get; init; }
    public bool? WasMappedByName { get; init; }
}

public record ScanOrganic
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ScanOrganic";
    public string? Body { get; init; }
    public string? Genus { get; init; }
    public string? Genus_Localised { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? ScanType { get; init; }
    public string? Species { get; init; }
    public string? Species_Localised { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
    public string? Variant { get; init; }
    public string? Variant_Localised { get; init; }
}

public record Screenshot
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Screenshot";
    public double? Altitude { get; init; }
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public string? Filename { get; init; }
    public double? Heading { get; init; }
    public long? Height { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
    public long? Width { get; init; }
}

public record SelfDestruct
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SelfDestruct";
}

public record SellDrones
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SellDrones";
    public long? Count { get; init; }
    public long? SellPrice { get; init; }
    public long? TotalSale { get; init; }
    public string? Type { get; init; }
    public string? Type_Localised { get; init; }
}

public record SellExplorationData_System
{
    public string? Name { get; init; }
    public long? SystemAddress { get; init; }
}

public record SellExplorationData_Discovered
{
    public long? NumBodies { get; init; }
    public string? SystemName { get; init; }
}

public record SellExplorationData
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SellExplorationData";
    public long? BaseValue { get; init; }
    public long? Bonus { get; init; }
    public List<SellExplorationData_Discovered>? Discovered { get; init; }
    public List<SellExplorationData_System>? Systems { get; init; }
    public long? TotalEarnings { get; init; }
}

public record SellOrganicData_BioData
{
    public long? Bonus { get; init; }
    public string? Genus { get; init; }
    public string? Genus_Localised { get; init; }
    public string? Species { get; init; }
    public string? Species_Localised { get; init; }
    public long? TotalBonus { get; init; }
    public long? TotalValue { get; init; }
    public long? Value { get; init; }
    public string? Variant { get; init; }
    public string? Variant_Localised { get; init; }
    public string? Vendor { get; init; }
    public string? Vendor_Localised { get; init; }
}

public record SellOrganicData
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SellOrganicData";
    public List<SellOrganicData_BioData>? BioData { get; init; }
    public long? MarketID { get; init; }
}

public record SellSuit
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SellSuit";
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? Price { get; init; }
    public long? SuitID { get; init; }
}

public record SellWeapon
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SellWeapon";
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? Price { get; init; }
    public long? WeaponID { get; init; }
}

public record SendText
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SendText";
    public string? Message { get; init; }
    public bool? Sent { get; init; }
    public string? To { get; init; }
    public string? To_Localised { get; init; }
}

public record ShieldState
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ShieldState";
    public bool? ShieldsUp { get; init; }
}

public record ShipLocker_Data
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record ShipLocker_Item
{
    public long? Count { get; init; }
    public long? MissionID { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? OwnerID { get; init; }
    public string? Type { get; init; }
}

public record ShipLocker_Component
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record ShipLocker_Consumable
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record ShipLocker
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ShipLocker";
    public List<ShipLocker_Component>? Components { get; init; }
    public List<ShipLocker_Consumable>? Consumables { get; init; }
    public List<ShipLocker_Data>? Data { get; init; }
    public List<ShipLocker_Item>? Items { get; init; }
}

public record ShipLockerMaterials_Data
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record ShipLockerMaterials_Item
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record ShipLockerMaterials_Component
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record ShipLockerMaterials_Consumable
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record ShipLockerMaterials
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ShipLockerMaterials";
    public List<ShipLockerMaterials_Component>? Components { get; init; }
    public List<ShipLockerMaterials_Consumable>? Consumables { get; init; }
    public List<ShipLockerMaterials_Data>? Data { get; init; }
    public List<ShipLockerMaterials_Item>? Items { get; init; }
}

public record ShipTargeted
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "ShipTargeted";
    public string? Faction { get; init; }
    public double? HullHealth { get; init; }
    public string? LegalStatus { get; init; }
    public string? PilotName { get; init; }
    public string? PilotName_Localised { get; init; }
    public string? PilotRank { get; init; }
    public string? Power { get; init; }
    public long? ScanStage { get; init; }
    public double? ShieldHealth { get; init; }
    public string? Ship { get; init; }
    public string? Ship_Localised { get; init; }
    public long? SquadronID { get; init; }
    public bool? TargetLocked { get; init; }
}

public record Shipyard_Ship
{
    public long? SellPrice { get; init; }
    public string? ShipType { get; init; }
    public string? ShipType_Localised { get; init; }
    public long? Value { get; init; }
}

public record Shipyard
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Shipyard";
    public long MarketID { get; init; }
    public List<Shipyard_Ship> Ships { get; init; }
    public string StarSystem { get; init; }
    public string StationName { get; init; }
    public long? SystemAddress { get; init; }
}

public record Shutdown
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Shutdown";
}

public record SquadronCreated
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SquadronCreated";
    public string? SquadronName { get; init; }
}

public record SquadronDemotion
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SquadronDemotion";
    public long? NewRank { get; init; }
    public long? OldRank { get; init; }
    public string? SquadronName { get; init; }
}

public record SquadronKicked
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SquadronKicked";
    public string? PlayerName { get; init; }
    public string? SquadronName { get; init; }
}

public record SquadronPromotion
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SquadronPromotion";
    public long? NewRank { get; init; }
    public long? OldRank { get; init; }
    public string? SquadronName { get; init; }
}

public record SquadronStartup_Rating
{
    public string? Name { get; init; }
    public long? Rank { get; init; }
}

public record SquadronStartup
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SquadronStartup";
    public long? CurrentRating { get; init; }
    public List<SquadronStartup_Rating>? Rating { get; init; }
    public string? SquadronAlignedPower { get; init; }
    public string? SquadronFaction { get; init; }
    public string? SquadronHomeSystem { get; init; }
    public long? SquadronID { get; init; }
    public string? SquadronName { get; init; }
    public string? SquadronPowerplayState { get; init; }
    public string? SquadronRank { get; init; }
}

public record SRVDestroyed
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SRVDestroyed";
    public long? ID { get; init; }
}

public record StartJump
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "StartJump";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public string? JumpType { get; init; }
    public string? StarSystem { get; init; }
    public long? SystemAddress { get; init; }
}

public record Status_Fuel
{
    public double FuelMain { get; init; }
    public double FuelReservoir { get; init; }
}

public record Status_Destination
{
    public long? Body { get; init; }
    public long? System { get; init; }
}

public record Status
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Status";
    public double Cargo { get; init; }
    public long FireGroup { get; init; }
    public long Flags { get; init; }
    public Status_Fuel Fuel { get; init; }
    public long GuiFocus { get; init; }
    public List<long> Pips { get; init; }
    public double? Altitude { get; init; }
    public long? Balance { get; init; }
    public string? BodyName { get; init; }
    public Status_Destination? Destination { get; init; }
    public long? Flags2 { get; init; }
    public double? Heading { get; init; }
    public double? Latitude { get; init; }
    public string? LegalState { get; init; }
    public double? Longitude { get; init; }
    public double? PlanetRadius { get; init; }
}

public record SupercruiseEntry
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SupercruiseEntry";
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
}

public record SupercruiseExit
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SupercruiseExit";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public string? BodyType { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
}

public record SwitchSuitLoadout_Module
{
    public string? ModuleName { get; init; }
    public string? ModuleName_Localised { get; init; }
    public string? SlotName { get; init; }
    public long? SuitModuleID { get; init; }
}

public record SwitchSuitLoadout
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "SwitchSuitLoadout";
    public long? LoadoutID { get; init; }
    public string? LoadoutName { get; init; }
    public List<SwitchSuitLoadout_Module>? Modules { get; init; }
    public long? SuitID { get; init; }
    public string? SuitName { get; init; }
    public string? SuitName_Localised { get; init; }
}

public record Synthesis_Material
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record Synthesis
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Synthesis";
    public List<Synthesis_Material>? Materials { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record Touchdown
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Touchdown";
    public string? Body { get; init; }
    public long? BodyID { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public bool? OnPlanet { get; init; }
    public bool? OnStation { get; init; }
    public bool? PlayerControlled { get; init; }
    public string? System { get; init; }
    public long? SystemAddress { get; init; }
}

public record TradeMicroResources_Offered
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record TradeMicroResources_Received
{
    public long? Count { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record TradeMicroResources
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "TradeMicroResources";
    public long? MarketID { get; init; }
    public List<TradeMicroResources_Offered>? Offered { get; init; }
    public List<TradeMicroResources_Received>? Received { get; init; }
}

public record TransferMicroResources_Transfer
{
    public long? Count { get; init; }
    public string? Direction { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
}

public record TransferMicroResources
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "TransferMicroResources";
    public List<TransferMicroResources_Transfer>? Transfers { get; init; }
}

public record Undocked
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Undocked";
    public long? MarketID { get; init; }
    public string? StationName { get; init; }
    public string? StationType { get; init; }
}

public record Undocking
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "Undocking";
    public long? MarketID { get; init; }
    public string? StationName { get; init; }
}

public record UpgradeSuit
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "UpgradeSuit";
    public long? Class { get; init; }
    public long? Cost { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? SuitID { get; init; }
}

public record UpgradeWeapon
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "UpgradeWeapon";
    public long? Class { get; init; }
    public long? Cost { get; init; }
    public string? Name { get; init; }
    public string? Name_Localised { get; init; }
    public long? WeaponID { get; init; }
}

public record UseConsumable
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "UseConsumable";
    public string? Consumable { get; init; }
    public string? Consumable_Localised { get; init; }
    public string? Type { get; init; }
}

public record WingAdd
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "WingAdd";
    public string? Other { get; init; }
}

public record WingInvite
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "WingInvite";
    public string? Other { get; init; }
}

public record WingJoin_Other
{
    public string? Name { get; init; }
}

public record WingJoin
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "WingJoin";
    public List<WingJoin_Other>? Others { get; init; }
}

public record WingLeave
{
    public string timestamp { get; init; }
    [JsonPropertyName("event")]
    public string @event { get; init; } = "WingLeave";
}

// ─┬─ Shared types (hardcoded from TS types.ts) ───────────────────────────

public record FactionState
{
    public string Name { get; init; }
    public string FactionStateValue { get; init; }
    public string Government { get; init; }
    public double Influence { get; init; }
    public string Allegiance { get; init; }
    public string? Happiness { get; init; }
    public string? Happiness_Localised { get; init; }
    public double? MyReputation { get; init; }
    public bool? SquadronFaction { get; init; }
    public List<StateTimeline>? ActiveStates { get; init; }
    public List<StateTimeline>? PendingStates { get; init; }
    public List<StateTimeline>? RecoveringStates { get; init; }
}

public record StateTimeline
{
    public string State { get; init; }
    public double? Trend { get; init; }
}

public record Conflict
{
    public string WarType { get; init; }
    public string Status { get; init; }
    public ConflictFaction Faction1 { get; init; }
    public ConflictFaction Faction2 { get; init; }
}

public record ConflictFaction
{
    public string Name { get; init; }
    public string Stake { get; init; }
    public long WonDays { get; init; }
}

public record ThargoidWarInfo
{
    public string? WarType { get; init; }
    public long? RemainingPorts { get; init; }
    public bool? SuccessReached { get; init; }
    public string? EstimatedRemainingTime { get; init; }
}

public record StationEconomy
{
    public string Name { get; init; }
    public double Share { get; init; }
}

public record LandingPads
{
    public long Small { get; init; }
    public long Medium { get; init; }
    public long Large { get; init; }
}

public record CommodityItem
{
    public string Name { get; init; }
    public string? Name_Localised { get; init; }
    public long BuyPrice { get; init; }
    public long SellPrice { get; init; }
    public long MeanPrice { get; init; }
    public long StockBracket { get; init; }
    public long DemandBracket { get; init; }
    public long Stock { get; init; }
    public long Demand { get; init; }
    public string StatusFlags { get; init; }
}

public record ParentBody
{
    public long? Star { get; init; }
    public long? Planet { get; init; }
    public long? Null { get; init; }
}

public record Ring
{
    public string Name { get; init; }
    public string RingClass { get; init; }
    public double MassMT { get; init; }
    public double InnerRad { get; init; }
    public double OuterRad { get; init; }
}

public record AtmosphereComposition
{
    public string Name { get; init; }
    public double Percent { get; init; }
}

public record Composition
{
    public double? Ice { get; init; }
    public double? Rock { get; init; }
    public double? Metal { get; init; }
}

public record Mission
{
    public string Timestamp { get; init; }
    public string Event { get; init; }
    public long MissionID { get; init; }
    public string Name { get; init; }
    public bool? PassengerMission { get; init; }
    public string? Expiry { get; init; }
    public string? Influence { get; init; }
    public string? Reputation { get; init; }
    public long? Reward { get; init; }
    public bool? Wing { get; init; }
    public bool? Failed { get; init; }
}

public record EngineeringMod
{
    public string Engineer { get; init; }
    public string BlueprintName { get; init; }
    public long BlueprintID { get; init; }
    public long Level { get; init; }
    public double Quality { get; init; }
    public string? ExperimentalEffect { get; init; }
    public string? ExperimentalEffect_Localised { get; init; }
    public List<Modifier>? Modifiers { get; init; }
}

public record Modifier
{
    public string Label { get; init; }
    public double? Value { get; init; }
    public double? OriginalValue { get; init; }
    public bool? LessIsGood { get; init; }
    public string? ValueStr { get; init; }
}

public record ModuleItem
{
    public string Slot { get; init; }
    public string Item { get; init; }
    public string? Item_Localised { get; init; }
    public bool On { get; init; }
    public long Priority { get; init; }
    public double? Health { get; init; }
    public long? Value { get; init; }
    public EngineeringMod? Engineering { get; init; }
    public long? AmmoClip { get; init; }
    public long? AmmoHopper { get; init; }
}

public record ShipItem
{
    public string Ship { get; init; }
    public long ShipID { get; init; }
    public string ShipName { get; init; }
    public string ShipIdent { get; init; }
    public List<ModuleItem>? Modules { get; init; }
    public Dictionary<string, double>? FuelCapacity { get; init; }
    public long? CargoCapacity { get; init; }
    public long? HullValue { get; init; }
    public long? ModulesValue { get; init; }
    public long? Rebuy { get; init; }
    public bool? Hot { get; init; }
    public double? HullHealth { get; init; }
    public double? UnladenMass { get; init; }
    public double? MaxJumpRange { get; init; }
}

public record FuelStatus
{
    public double FuelMain { get; init; }
    public double FuelReservoir { get; init; }
}

public record DestinationStatus
{
    public long System { get; init; }
    public long Body { get; init; }
}
