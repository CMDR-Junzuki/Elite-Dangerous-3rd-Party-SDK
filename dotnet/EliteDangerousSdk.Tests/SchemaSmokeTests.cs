using System.Text.Json;
using Xunit;

namespace EliteDangerousSdk.Tests;

public class SchemaSmokeTests
{
    [Fact]
    public void Parse_AfmuRepairs_ReturnsCorrectEvent()
    {
        var line = @"{""Health"":1.0,""FullyRepaired"":true,""Module_Localised"":""test"",""event"":""AfmuRepairs"",""timestamp"":""2024-01-01T00:00:00Z"",""Module"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("AfmuRepairs", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_AppliedToSquadron_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""SquadronName"":""test"",""event"":""AppliedToSquadron""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("AppliedToSquadron", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ApproachBody_ReturnsCorrectEvent()
    {
        var line = @"{""SystemAddress"":1,""BodyID"":1,""event"":""ApproachBody"",""timestamp"":""2024-01-01T00:00:00Z"",""System"":""test"",""Body"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ApproachBody", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ApproachSettlement_ReturnsCorrectEvent()
    {
        var line = @"{""Longitude"":1.0,""BodyID"":1,""Name_Localised"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""MarketID"":1,""event"":""ApproachSettlement"",""Name"":""test"",""SystemAddress"":1,""Body"":""test"",""Latitude"":1.0}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ApproachSettlement", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Backpack_ReturnsCorrectEvent()
    {
        var line = @"{""Data"":[{}],""Items"":[{}],""event"":""Backpack"",""timestamp"":""2024-01-01T00:00:00Z"",""Components"":[{}],""Consumables"":[{}]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Backpack", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_BackpackChange_ReturnsCorrectEvent()
    {
        var line = @"{""Removed"":[{}],""Total"":1,""Type"":1,""Added"":[{}],""event"":""BackpackChange"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("BackpackChange", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_BookTaxi_ReturnsCorrectEvent()
    {
        var line = @"{""Cost"":1,""DestinationLocation"":""test"",""event"":""BookTaxi"",""timestamp"":""2024-01-01T00:00:00Z"",""DestinationStation"":""test"",""DestinationSystem"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("BookTaxi", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Bounty_ReturnsCorrectEvent()
    {
        var line = @"{""TotalReward"":1,""Rewards"":[{}],""Target_Localised"":""test"",""VictimFaction"":""test"",""event"":""Bounty"",""timestamp"":""2024-01-01T00:00:00Z"",""Target"":""test"",""SharedWithOthers"":1,""Faction"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Bounty", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_BuyAmmo_ReturnsCorrectEvent()
    {
        var line = @"{""Cost"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""BuyAmmo""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("BuyAmmo", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_BuyDrones_ReturnsCorrectEvent()
    {
        var line = @"{""Count"":1,""Type"":""test"",""Type_Localised"":""test"",""event"":""BuyDrones"",""timestamp"":""2024-01-01T00:00:00Z"",""TotalCost"":1,""BuyPrice"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("BuyDrones", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_BuyExplorationData_ReturnsCorrectEvent()
    {
        var line = @"{""Cost"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""BuyExplorationData"",""System"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("BuyExplorationData", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_BuyMicroResources_ReturnsCorrectEvent()
    {
        var line = @"{""Name"":""test"",""Category"":""test"",""Count"":1,""Cost"":1,""MarketID"":1,""Category_Localised"":""test"",""event"":""BuyMicroResources"",""timestamp"":""2024-01-01T00:00:00Z"",""Name_Localised"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("BuyMicroResources", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_BuySuit_ReturnsCorrectEvent()
    {
        var line = @"{""Name"":""test"",""Price"":1,""Name_Localised"":""test"",""event"":""BuySuit"",""timestamp"":""2024-01-01T00:00:00Z"",""SuitID"":1,""SuitMods"":[""test""]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("BuySuit", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_BuyTradeData_ReturnsCorrectEvent()
    {
        var line = @"{""Cost"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""BuyTradeData"",""System"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("BuyTradeData", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_BuyWeapon_ReturnsCorrectEvent()
    {
        var line = @"{""Price"":1,""WeaponID"":1,""Name_Localised"":""test"",""event"":""BuyWeapon"",""Name"":""test"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("BuyWeapon", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CancelTaxi_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""CancelTaxi"",""Refund"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CancelTaxi", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CapShipBond_ReturnsCorrectEvent()
    {
        var line = @"{""Fighter"":true,""VictimFaction_Localised"":""test"",""AwardingFaction"":""test"",""PlayerPilot"":true,""VictimFaction"":""test"",""event"":""CapShipBond"",""timestamp"":""2024-01-01T00:00:00Z"",""AwardingFaction_Localised"":""test"",""Amount"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CapShipBond", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierBankTransfer_ReturnsCorrectEvent()
    {
        var line = @"{""CarrierBalance"":1,""PlayerBalance"":1,""CarrierID"":1,""event"":""CarrierBankTransfer"",""timestamp"":""2024-01-01T00:00:00Z"",""Withdraw"":1,""Deposit"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierBankTransfer", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierBuy_ReturnsCorrectEvent()
    {
        var line = @"{""Callsign"":""test"",""Price"":1,""CarrierID"":1,""Variant"":""test"",""event"":""CarrierBuy"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""Location"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierBuy", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierCrewService_ReturnsCorrectEvent()
    {
        var line = @"{""CrewName"":""test"",""CarrierID"":1,""event"":""CarrierCrewService"",""timestamp"":""2024-01-01T00:00:00Z"",""CrewRole"":""test"",""Operation"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierCrewService", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierDeploy_ReturnsCorrectEvent()
    {
        var line = @"{""BodyID"":1,""CarrierID"":1,""event"":""CarrierDeploy"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""Body"":""test"",""System"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierDeploy", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierFinance_ReturnsCorrectEvent()
    {
        var line = @"{""ReserveBalance"":1,""AvailableBalance"":1,""CarrierID"":1,""TaxRate"":1,""event"":""CarrierFinance"",""ReservePercent"":1,""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierFinance", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierJump_ReturnsCorrectEvent()
    {
        var line = @"{""SystemAddress"":1,""BodyID"":1,""event"":""CarrierJump"",""timestamp"":""2024-01-01T00:00:00Z"",""System"":""test"",""Body"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierJump", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierJumpRequest_ReturnsCorrectEvent()
    {
        var line = @"{""BodyID"":1,""event"":""CarrierJumpRequest"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""DepartureTime"":""test"",""Body"":""test"",""System"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierJumpRequest", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierModulePack_ReturnsCorrectEvent()
    {
        var line = @"{""CarrierID"":1,""Cost"":1,""Operation"":""test"",""PackTier"":1,""event"":""CarrierModulePack"",""timestamp"":""2024-01-01T00:00:00Z"",""PackTheme"":""test"",""PackTheme_Localised"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierModulePack", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierNameChange_ReturnsCorrectEvent()
    {
        var line = @"{""Callsign"":""test"",""Name"":""test"",""CarrierID"":1,""Name_Localised"":""test"",""event"":""CarrierNameChange"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierNameChange", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierSell_ReturnsCorrectEvent()
    {
        var line = @"{""Callsign"":""test"",""Price"":1,""CarrierID"":1,""event"":""CarrierSell"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""Location"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierSell", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierShipPack_ReturnsCorrectEvent()
    {
        var line = @"{""CarrierID"":1,""Cost"":1,""Operation"":""test"",""PackTier"":1,""event"":""CarrierShipPack"",""timestamp"":""2024-01-01T00:00:00Z"",""PackTheme"":""test"",""PackTheme_Localised"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierShipPack", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierStats_ReturnsCorrectEvent()
    {
        var line = @"{""AllowNotorious"":true,""Theme"":""test"",""Market"":true,""Shipyard"":true,""Callsign"":""test"",""Name"":""test"",""FuelLevel"":1.0,""PendingDecommision"":true,""JumpRangeCurr"":1.0,""Refuel"":true,""SpaceAccess"":""test"",""VoucherExploration"":true,""VoucherTrade"":true,""Rearm"":true,""DockingAccess"":""test"",""CarrierID"":1,""JumpRangeMax"":1.0,""timestamp"":""2024-01-01T00:00:00Z"",""Name_Localised"":""test"",""VoucherMarket"":true,""Outfitting"":true,""Pack"":[{}],""event"":""CarrierStats"",""ExoBiology"":true,""Repair"":true}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierStats", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CarrierTradeOrder_ReturnsCorrectEvent()
    {
        var line = @"{""PurchaseOrder"":1,""Price"":1,""CarrierID"":1,""Stock"":1,""Commodity_Localised"":""test"",""event"":""CarrierTradeOrder"",""timestamp"":""2024-01-01T00:00:00Z"",""CancelTrade"":true,""SaleOrder"":1,""BlackMarket"":true,""Commodity"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CarrierTradeOrder", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ChangeCrewAssignedRole_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""ChangeCrewAssignedRole"",""Role"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ChangeCrewAssignedRole", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CodexEntry_ReturnsCorrectEvent()
    {
        var line = @"{""Latitude"":1.0,""SystemAddress"":1,""Body"":""test"",""Name"":""test"",""NearestDestination"":""test"",""BodyID"":1,""Category_Localised"":""test"",""SubCategory_Localised"":""test"",""SubCategory"":""test"",""VoucherAmount"":1,""NearestDestination_Localised"":""test"",""Region_Localised"":""test"",""Longitude"":1.0,""Region"":""test"",""Category"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""Name_Localised"":""test"",""event"":""CodexEntry"",""System"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CodexEntry", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CollectItems_ReturnsCorrectEvent()
    {
        var line = @"{""MissionID"":1,""OwnerID"":1,""Type"":""test"",""Stolen"":true,""event"":""CollectItems"",""Name"":""test"",""Name_Localised"":""test"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CollectItems", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CollectMicroResources_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""Items"":[{}],""event"":""CollectMicroResources""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CollectMicroResources", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CommitCrime_ReturnsCorrectEvent()
    {
        var line = @"{""Victim"":""test"",""Bounty"":1,""CrimeType"":""test"",""event"":""CommitCrime"",""timestamp"":""2024-01-01T00:00:00Z"",""Fine"":1,""Faction"":""test"",""Victim_Localised"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CommitCrime", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CommunityGoal_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""CurrentGoals"":[{}],""event"":""CommunityGoal""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CommunityGoal", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CommunityGoalDiscard_ReturnsCorrectEvent()
    {
        var line = @"{""CGID"":1,""MarketName"":""test"",""Name_Localised"":""test"",""event"":""CommunityGoalDiscard"",""Name"":""test"",""SystemName"":""test"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CommunityGoalDiscard", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CommunityGoalJoin_ReturnsCorrectEvent()
    {
        var line = @"{""CGID"":1,""MarketName"":""test"",""Name_Localised"":""test"",""event"":""CommunityGoalJoin"",""Name"":""test"",""SystemName"":""test"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CommunityGoalJoin", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CommunityGoalReward_ReturnsCorrectEvent()
    {
        var line = @"{""DetailReward"":1,""MarketName"":""test"",""CGID"":1,""Name_Localised"":""test"",""event"":""CommunityGoalReward"",""Name"":""test"",""SystemName"":""test"",""Reward"":1,""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CommunityGoalReward", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Continued_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""Part"":1,""event"":""Continued""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Continued", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CreateSuitLoadout_ReturnsCorrectEvent()
    {
        var line = @"{""Modules"":[{}],""SuitName_Localised"":""test"",""event"":""CreateSuitLoadout"",""timestamp"":""2024-01-01T00:00:00Z"",""SuitName"":""test"",""SuitID"":1,""SuitMods"":[""test""],""LoadoutName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CreateSuitLoadout", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CrewFire_ReturnsCorrectEvent()
    {
        var line = @"{""CombatRank"":1,""timestamp"":""2024-01-01T00:00:00Z"",""Name"":""test"",""event"":""CrewFire""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CrewFire", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CrewHire_ReturnsCorrectEvent()
    {
        var line = @"{""Name"":""test"",""Cost"":1,""event"":""CrewHire"",""timestamp"":""2024-01-01T00:00:00Z"",""CombatRank"":1,""Faction"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CrewHire", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CrewLaunchFighter_ReturnsCorrectEvent()
    {
        var line = @"{""Loadout_Localised"":""test"",""ID"":1,""Crew"":""test"",""Loadout"":""test"",""event"":""CrewLaunchFighter"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CrewLaunchFighter", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CrewMemberJoins_ReturnsCorrectEvent()
    {
        var line = @"{""Telepresence"":true,""CombatRank"":1,""timestamp"":""2024-01-01T00:00:00Z"",""Crew"":""test"",""event"":""CrewMemberJoins""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CrewMemberJoins", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CrewMemberQuits_ReturnsCorrectEvent()
    {
        var line = @"{""Telepresence"":true,""timestamp"":""2024-01-01T00:00:00Z"",""Crew"":""test"",""event"":""CrewMemberQuits""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CrewMemberQuits", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CrewMemberRoleChange_ReturnsCorrectEvent()
    {
        var line = @"{""Telepresence"":true,""timestamp"":""2024-01-01T00:00:00Z"",""Crew"":""test"",""event"":""CrewMemberRoleChange"",""Role"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CrewMemberRoleChange", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_CrewRoleRepair_ReturnsCorrectEvent()
    {
        var line = @"{""CrewID"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""CrewRoleRepair""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("CrewRoleRepair", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DataScanned_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""Type"":""test"",""Type_Localised"":""test"",""event"":""DataScanned""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DataScanned", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DeleteSuitLoadout_ReturnsCorrectEvent()
    {
        var line = @"{""SuitName_Localised"":""test"",""event"":""DeleteSuitLoadout"",""timestamp"":""2024-01-01T00:00:00Z"",""SuitName"":""test"",""SuitID"":1,""LoadoutID"":1,""LoadoutName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DeleteSuitLoadout", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Died_ReturnsCorrectEvent()
    {
        var line = @"{""KillerRank"":""test"",""event"":""Died"",""timestamp"":""2024-01-01T00:00:00Z"",""KillerName_Localised"":""test"",""KillerShip"":""test"",""KillerName"":""test"",""Killers"":[{}]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Died", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DisbandedSquadron_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""SquadronName"":""test"",""event"":""DisbandedSquadron""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DisbandedSquadron", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Disembark_ReturnsCorrectEvent()
    {
        var line = @"{""SystemAddress"":1,""Body"":""test"",""Multicrew"":true,""SRV"":true,""BodyID"":1,""MarketID"":1,""OnPlanet"":true,""Taxi"":true,""StationType"":""test"",""OnStation"":true,""StarSystem"":""test"",""event"":""Disembark"",""StationName"":""test"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Disembark", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DockFighter_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""ID"":1,""event"":""DockFighter""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DockFighter", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DockSRV_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""ID"":1,""event"":""DockSRV""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DockSRV", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Docked_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""Docked"",""StationName"":""test"",""StationType"":""test"",""StarSystem"":""test"",""SystemAddress"":1,""MarketID"":1,""StationServices"":[""test""],""StationEconomy"":""test"",""StationEconomies"":[{}],""StationAllegiance"":""test"",""StationGovernment"":""test"",""StationState"":""test"",""LandingPads"":{},""CockpitBreach"":true,""Wanted"":true,""ActiveFine"":true,""DistFromStarLS"":1.0,""PowerplayState"":""test"",""Powers"":[""test""],""Taxoname"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Docked", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DockingCancelled_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""MarketID"":1,""StationName"":""test"",""event"":""DockingCancelled""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DockingCancelled", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DockingDenied_ReturnsCorrectEvent()
    {
        var line = @"{""MarketID"":1,""event"":""DockingDenied"",""timestamp"":""2024-01-01T00:00:00Z"",""StationType"":""test"",""Reason"":""test"",""StationName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DockingDenied", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DockingGranted_ReturnsCorrectEvent()
    {
        var line = @"{""MarketID"":1,""event"":""DockingGranted"",""timestamp"":""2024-01-01T00:00:00Z"",""StationType"":""test"",""LandingPad"":1,""StationName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DockingGranted", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DockingRequested_ReturnsCorrectEvent()
    {
        var line = @"{""MarketID"":1,""event"":""DockingRequested"",""timestamp"":""2024-01-01T00:00:00Z"",""StationType"":""test"",""LandingPad"":1,""StationName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DockingRequested", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DockingTimeout_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""MarketID"":1,""StationName"":""test"",""event"":""DockingTimeout""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DockingTimeout", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_DropShipDeploy_ReturnsCorrectEvent()
    {
        var line = @"{""SystemAddress"":1,""BodyID"":1,""OnStation"":true,""OnPlanet"":true,""MarketID"":1,""event"":""DropShipDeploy"",""timestamp"":""2024-01-01T00:00:00Z"",""StationType"":""test"",""Body"":""test"",""StarSystem"":""test"",""StationName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("DropShipDeploy", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_EjectCargo_ReturnsCorrectEvent()
    {
        var line = @"{""MissionID"":1,""Type"":""test"",""Count"":1,""event"":""EjectCargo"",""timestamp"":""2024-01-01T00:00:00Z"",""Powerplay"":true,""Type_Localised"":""test"",""Abandoned"":true}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("EjectCargo", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Embark_ReturnsCorrectEvent()
    {
        var line = @"{""SystemAddress"":1,""Body"":""test"",""Multicrew"":true,""SRV"":true,""BodyID"":1,""MarketID"":1,""OnPlanet"":true,""Taxi"":true,""StationType"":""test"",""OnStation"":true,""StarSystem"":""test"",""event"":""Embark"",""StationName"":""test"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Embark", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_EndCrewSession_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""EndCrewSession""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("EndCrewSession", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_EngineerApply_ReturnsCorrectEvent()
    {
        var line = @"{""Blueprint"":""test"",""BlueprintID"":1,""Engineer"":""test"",""Level"":1,""event"":""EngineerApply"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("EngineerApply", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_EngineerCraft_ReturnsCorrectEvent()
    {
        var line = @"{""ExperimentalEffect"":""test"",""Quality"":1.0,""Modifiers"":[{}],""Engineer"":""test"",""EngineerID"":1,""Level"":1,""event"":""EngineerCraft"",""timestamp"":""2024-01-01T00:00:00Z"",""Ingredients"":[{}],""BlueprintID"":1,""ExperimentalEffect_Localised"":""test"",""Blueprint"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("EngineerCraft", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_EngineerProgress_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""EngineerProgress"",""Engineers"":[{}]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("EngineerProgress", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_FCMaterials_ReturnsCorrectEvent()
    {
        var line = @"{""Data"":[{}],""Items"":[{}],""event"":""FCMaterials"",""timestamp"":""2024-01-01T00:00:00Z"",""Components"":[{}],""Consumables"":[{}]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("FCMaterials", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_FCMaterialsCAPI_ReturnsCorrectEvent()
    {
        var line = @"{""CarrierName_Localised"":""test"",""Data"":[{}],""Items"":[{}],""MarketID"":1,""event"":""FCMaterialsCAPI"",""timestamp"":""2024-01-01T00:00:00Z"",""Components"":[{}],""Consumables"":[{}],""CarrierName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("FCMaterialsCAPI", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_FSDJump_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""FSDJump"",""StarSystem"":""test"",""SystemAddress"":1,""StarPos"":[1.0],""SystemAllegiance"":""test"",""SystemEconomy"":""test"",""SystemSecondEconomy"":""test"",""SystemGovernment"":""test"",""SystemSecurity"":""test"",""Population"":1,""PowerplayState"":""test"",""Powers"":[""test""],""JumpDist"":1.0,""FuelUsed"":1.0,""FuelLevel"":1.0,""BoostUsed"":1.0,""Factions"":[""test""],""Conflicts"":[""test""],""Body"":""test"",""BodyID"":1,""Taxoname"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("FSDJump", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_FSSBodySignals_ReturnsCorrectEvent()
    {
        var line = @"{""BodyID"":1,""BodyName"":""test"",""event"":""FSSBodySignals"",""Signals"":[{}],""SystemAddress"":1,""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("FSSBodySignals", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_FSSSignalDiscovered_ReturnsCorrectEvent()
    {
        var line = @"{""USSType_Localised"":""test"",""SignalName_Localised"":""test"",""SpawningFaction"":""test"",""ThargoidWar"":""test"",""event"":""FSSSignalDiscovered"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""USSType"":""test"",""SpawningState"":""test"",""SignalName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("FSSSignalDiscovered", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_FactionKillBond_ReturnsCorrectEvent()
    {
        var line = @"{""VictimFaction_Localised"":""test"",""AwardingFaction"":""test"",""VictimFaction"":""test"",""event"":""FactionKillBond"",""timestamp"":""2024-01-01T00:00:00Z"",""AwardingFaction_Localised"":""test"",""Amount"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("FactionKillBond", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_FighterDestroyed_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""ID"":1,""event"":""FighterDestroyed""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("FighterDestroyed", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_FileHeader_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""FileHeader"",""part"":1,""language"":""test"",""gameversion"":""test"",""build"":""test"",""odyssey"":true}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("FileHeader", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_FuelScoop_ReturnsCorrectEvent()
    {
        var line = @"{""Total"":1.0,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""FuelScoop"",""Scooped"":1.0}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("FuelScoop", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_HeatDamage_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""HeatDamage""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("HeatDamage", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_HeatWarning_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""HeatWarning""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("HeatWarning", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_HullDamage_ReturnsCorrectEvent()
    {
        var line = @"{""PlayerPilot"":true,""timestamp"":""2024-01-01T00:00:00Z"",""Health"":1.0,""event"":""HullDamage"",""Fighter"":true}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("HullDamage", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_InvitedToSquadron_ReturnsCorrectEvent()
    {
        var line = @"{""InviterName_Localised"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""SquadronName"":""test"",""event"":""InvitedToSquadron"",""InviterName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("InvitedToSquadron", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_JoinACrew_ReturnsCorrectEvent()
    {
        var line = @"{""Captain_Localised"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""event"":""JoinACrew"",""Captain"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("JoinACrew", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_JoinedSquadron_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""SquadronName"":""test"",""event"":""JoinedSquadron""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("JoinedSquadron", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_KickCrewMember_ReturnsCorrectEvent()
    {
        var line = @"{""Telepresence"":true,""timestamp"":""2024-01-01T00:00:00Z"",""Crew"":""test"",""event"":""KickCrewMember""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("KickCrewMember", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_KickedFromSquadron_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""SquadronName"":""test"",""event"":""KickedFromSquadron""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("KickedFromSquadron", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_LaunchFighter_ReturnsCorrectEvent()
    {
        var line = @"{""Loadout"":""test"",""Loadout_Localised"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""PlayerControlled"":true,""event"":""LaunchFighter""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("LaunchFighter", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_LaunchSRV_ReturnsCorrectEvent()
    {
        var line = @"{""Loadout_Localised"":""test"",""ID"":1,""Loadout"":""test"",""event"":""LaunchSRV"",""timestamp"":""2024-01-01T00:00:00Z"",""PlayerControlled"":true}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("LaunchSRV", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_LeaveBody_ReturnsCorrectEvent()
    {
        var line = @"{""SystemAddress"":1,""BodyID"":1,""event"":""LeaveBody"",""timestamp"":""2024-01-01T00:00:00Z"",""System"":""test"",""Body"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("LeaveBody", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_LeftSquadron_ReturnsCorrectEvent()
    {
        var line = @"{""SquadronName"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""OldRank"":1,""event"":""LeftSquadron""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("LeftSquadron", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Liftoff_ReturnsCorrectEvent()
    {
        var line = @"{""BodyID"":1,""OnStation"":true,""OnPlanet"":true,""Latitude"":1.0,""event"":""Liftoff"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""PlayerControlled"":true,""Body"":""test"",""System"":""test"",""Longitude"":1.0}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Liftoff", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_LoadGame_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""LoadGame"",""Commander"":""test"",""FID"":""test"",""Ship"":""test"",""ShipID"":1,""ShipName"":""test"",""ShipIdent"":""test"",""FuelLevel"":1.0,""FuelCapacity"":1.0,""GameMode"":""test"",""Group"":""test"",""Credits"":1,""Loan"":1,""Horizons"":true,""Odyssey"":true,""language"":""test"",""gameversion"":""test"",""build"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("LoadGame", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Location_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""Location"",""StarSystem"":""test"",""SystemAddress"":1,""StarPos"":[1.0],""Body"":""test"",""BodyID"":1,""BodyType"":""test"",""Docked"":true,""StationName"":""test"",""StationType"":""test"",""MarketID"":1,""SystemAllegiance"":""test"",""SystemEconomy"":""test"",""SystemSecondEconomy"":""test"",""SystemGovernment"":""test"",""SystemSecurity"":""test"",""Population"":1,""PowerplayState"":""test"",""Powers"":[""test""]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Location", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MarketBuy_ReturnsCorrectEvent()
    {
        var line = @"{""Count"":1,""Type"":""test"",""TotalCost"":1,""MarketID"":1,""event"":""MarketBuy"",""timestamp"":""2024-01-01T00:00:00Z"",""Type_Localised"":""test"",""BuyPrice"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MarketBuy", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MarketSell_ReturnsCorrectEvent()
    {
        var line = @"{""IllegalGoods"":true,""TotalSale"":1,""Type"":""test"",""Type_Localised"":""test"",""AvgPricePaid"":1,""MarketID"":1,""event"":""MarketSell"",""timestamp"":""2024-01-01T00:00:00Z"",""Count"":1,""SellPrice"":1,""BlackMarket"":true,""Stolen"":true}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MarketSell", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MaterialCollected_ReturnsCorrectEvent()
    {
        var line = @"{""Name"":""test"",""Count"":1,""Category"":""test"",""Name_Localised"":""test"",""event"":""MaterialCollected"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MaterialCollected", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MaterialDiscarded_ReturnsCorrectEvent()
    {
        var line = @"{""Name"":""test"",""Count"":1,""Category"":""test"",""Name_Localised"":""test"",""event"":""MaterialDiscarded"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MaterialDiscarded", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MaterialDiscovered_ReturnsCorrectEvent()
    {
        var line = @"{""Name"":""test"",""Category"":""test"",""Name_Localised"":""test"",""event"":""MaterialDiscovered"",""timestamp"":""2024-01-01T00:00:00Z"",""DiscoveryNumber"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MaterialDiscovered", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MaterialTrade_ReturnsCorrectEvent()
    {
        var line = @"{""Traded"":{},""MarketID"":1,""event"":""MaterialTrade"",""timestamp"":""2024-01-01T00:00:00Z"",""TraderType"":""test"",""Received"":{}}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MaterialTrade", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MiningRefined_ReturnsCorrectEvent()
    {
        var line = @"{""Commodity_Localised"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""Type"":""test"",""Type_Localised"":""test"",""event"":""MiningRefined""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MiningRefined", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MissionAbandoned_ReturnsCorrectEvent()
    {
        var line = @"{""MissionID"":1,""Name_Localised"":""test"",""event"":""MissionAbandoned"",""Name"":""test"",""Fine"":1,""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MissionAbandoned", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MissionAccepted_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""Count"":1,""Reward"":1,""Target"":""test"",""TargetType_Localised"":""test"",""KillCount"":1,""DestinationStation"":""test"",""Expiry"":""test"",""CommodityReward"":[{}],""Wing"":true,""Commodity"":""test"",""PassengerType"":""test"",""MaterialsRequired"":[{}],""InfluenceGain"":""test"",""LocalisedName"":""test"",""ReputationGain"":""test"",""PassengerWanted"":true,""Influence"":""test"",""MissionID"":1,""Faction"":""test"",""TargetCommodity"":""test"",""Name_Localised"":""test"",""Commodity_Localised"":""test"",""Reputation"":""test"",""Donated"":1,""PassengerCount"":1,""TargetType"":""test"",""TargetFaction"":""test"",""Target_Localised"":""test"",""DestinationSystem"":""test"",""event"":""MissionAccepted"",""PassengerVIPs"":true,""Name"":""test"",""PassengerMission"":true,""TargetCommodity_Localised"":""test"",""Donation"":""test"",""MinJumps"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MissionAccepted", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MissionCompleted_ReturnsCorrectEvent()
    {
        var line = @"{""Donated"":1,""MaterialsReward"":[{}],""Commodity"":""test"",""Count"":1,""PermitsAwarded"":[{}],""TargetFaction"":""test"",""DestinationStation"":""test"",""Reward"":1,""RewardDetail_Localised"":""test"",""Name"":""test"",""Donation"":""test"",""RewardDetail"":""test"",""DestinationSystem"":""test"",""FactionEffect"":[{}],""Faction"":""test"",""Name_Localised"":""test"",""MissionID"":1,""KillCount"":1,""Commodity_Localised"":""test"",""event"":""MissionCompleted"",""CommodityReward"":[{}],""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MissionCompleted", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MissionFailed_ReturnsCorrectEvent()
    {
        var line = @"{""MissionID"":1,""Name"":""test"",""Name_Localised"":""test"",""event"":""MissionFailed"",""timestamp"":""2024-01-01T00:00:00Z"",""Fine"":1,""Faction"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MissionFailed", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_MissionRedirected_ReturnsCorrectEvent()
    {
        var line = @"{""MissionID"":1,""NewDestinationStation"":""test"",""NewDestinationSystem"":""test"",""Name_Localised"":""test"",""OldDestinationSystem"":""test"",""event"":""MissionRedirected"",""Name"":""test"",""OldDestinationStation"":""test"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("MissionRedirected", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ModuleInfo_ReturnsCorrectEvent()
    {
        var line = @"{""Modules"":[{}],""timestamp"":""2024-01-01T00:00:00Z"",""event"":""ModuleInfo""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ModuleInfo", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Music_ReturnsCorrectEvent()
    {
        var line = @"{""MusicTrack"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""event"":""Music""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Music", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_NavBeaconScan_ReturnsCorrectEvent()
    {
        var line = @"{""SystemAddress"":1,""timestamp"":""2024-01-01T00:00:00Z"",""NumBodies"":1,""event"":""NavBeaconScan""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("NavBeaconScan", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_NavRoute_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""NavRoute"",""Route"":[{}]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("NavRoute", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_NavRouteClear_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""NavRouteClear""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("NavRouteClear", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PVPKill_ReturnsCorrectEvent()
    {
        var line = @"{""Victim_Localised"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""CombatRank"":1,""event"":""PVPKill"",""Victim"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PVPKill", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PayFines_ReturnsCorrectEvent()
    {
        var line = @"{""Amount"":1,""timestamp"":""2024-01-01T00:00:00Z"",""AllFines"":true,""event"":""PayFines"",""BrokerPercentage"":1.0}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PayFines", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PayLegacyFines_ReturnsCorrectEvent()
    {
        var line = @"{""Amount"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""PayLegacyFines"",""BrokerPercentage"":1.0}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PayLegacyFines", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PlanetApproach_ReturnsCorrectEvent()
    {
        var line = @"{""Body"":""test"",""SystemAddress"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""PlanetApproach"",""BodyID"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PlanetApproach", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Powerplay_ReturnsCorrectEvent()
    {
        var line = @"{""TimePledged"":1,""Rank"":1,""Merits"":1,""Rating"":1,""Votes"":1,""event"":""Powerplay"",""timestamp"":""2024-01-01T00:00:00Z"",""Power"":""test"",""PowerplayState"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Powerplay", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PowerplayDefect_ReturnsCorrectEvent()
    {
        var line = @"{""ToPower"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""event"":""PowerplayDefect"",""FromPower"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PowerplayDefect", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PowerplayDeliver_ReturnsCorrectEvent()
    {
        var line = @"{""Type"":""test"",""Count"":1,""event"":""PowerplayDeliver"",""timestamp"":""2024-01-01T00:00:00Z"",""Power"":""test"",""Type_Localised"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PowerplayDeliver", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PowerplayFastTrack_ReturnsCorrectEvent()
    {
        var line = @"{""Amount"":1,""Power"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""event"":""PowerplayFastTrack"",""Cost"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PowerplayFastTrack", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PowerplayJoin_ReturnsCorrectEvent()
    {
        var line = @"{""Power"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""event"":""PowerplayJoin""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PowerplayJoin", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PowerplayLeave_ReturnsCorrectEvent()
    {
        var line = @"{""Power"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""event"":""PowerplayLeave""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PowerplayLeave", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PowerplaySalary_ReturnsCorrectEvent()
    {
        var line = @"{""Amount"":1,""Power"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""event"":""PowerplaySalary""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PowerplaySalary", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_PowerplayVote_ReturnsCorrectEvent()
    {
        var line = @"{""Vote"":1,""Vote_Weighting"":1.0,""Votes"":1,""event"":""PowerplayVote"",""timestamp"":""2024-01-01T00:00:00Z"",""Power"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("PowerplayVote", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Progress_ReturnsCorrectEvent()
    {
        var line = @"{""Soldier"":1.0,""Exobiologist"":1.0,""Trade"":1.0,""Federation"":1.0,""CQC"":1.0,""Combat"":1.0,""event"":""Progress"",""timestamp"":""2024-01-01T00:00:00Z"",""Explore"":1.0,""Empire"":1.0}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Progress", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Promotion_ReturnsCorrectEvent()
    {
        var line = @"{""Soldier"":1,""Exobiologist"":1,""Trade"":1,""Federation"":1,""CQC"":1,""Combat"":1,""event"":""Promotion"",""timestamp"":""2024-01-01T00:00:00Z"",""Explore"":1,""Empire"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Promotion", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ProspectedAsteroid_ReturnsCorrectEvent()
    {
        var line = @"{""MotherlodeProportion"":1.0,""Content_Localised"":""test"",""Content"":""test"",""Materials"":[{}],""event"":""ProspectedAsteroid"",""timestamp"":""2024-01-01T00:00:00Z"",""MotherlodeMaterial_Localised"":""test"",""Remaining"":1.0,""MotherlodeMaterial"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ProspectedAsteroid", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_QuitACrew_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""QuitACrew"",""Captain"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("QuitACrew", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Rank_ReturnsCorrectEvent()
    {
        var line = @"{""Soldier"":1,""Exobiologist"":1,""Trade"":1,""Federation"":1,""CQC"":1,""Combat"":1,""event"":""Rank"",""timestamp"":""2024-01-01T00:00:00Z"",""Explore"":1,""Empire"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Rank", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_RebootRepair_ReturnsCorrectEvent()
    {
        var line = @"{""Modules"":[{}],""timestamp"":""2024-01-01T00:00:00Z"",""event"":""RebootRepair""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("RebootRepair", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ReceiveText_ReturnsCorrectEvent()
    {
        var line = @"{""Message"":""test"",""Message_Localised"":""test"",""event"":""ReceiveText"",""timestamp"":""2024-01-01T00:00:00Z"",""Channel"":""test"",""From_Localised"":""test"",""From"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ReceiveText", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_RedeemVoucher_ReturnsCorrectEvent()
    {
        var line = @"{""Amount"":1,""timestamp"":""2024-01-01T00:00:00Z"",""Type"":""test"",""Factions"":[{}],""event"":""RedeemVoucher""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("RedeemVoucher", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_RefuelAll_ReturnsCorrectEvent()
    {
        var line = @"{""Amount"":1.0,""Cost"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""RefuelAll""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("RefuelAll", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_RefuelPartial_ReturnsCorrectEvent()
    {
        var line = @"{""Amount"":1.0,""Cost"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""RefuelPartial""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("RefuelPartial", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_RenameSuitLoadout_ReturnsCorrectEvent()
    {
        var line = @"{""PreviousLoadoutName"":""test"",""SuitName_Localised"":""test"",""event"":""RenameSuitLoadout"",""timestamp"":""2024-01-01T00:00:00Z"",""SuitName"":""test"",""SuitID"":1,""LoadoutID"":1,""LoadoutName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("RenameSuitLoadout", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Repair_ReturnsCorrectEvent()
    {
        var line = @"{""Cost"":1,""timestamp"":""2024-01-01T00:00:00Z"",""Item_Localised"":""test"",""Item"":""test"",""event"":""Repair""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Repair", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_RepairAll_ReturnsCorrectEvent()
    {
        var line = @"{""Cost"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""RepairAll""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("RepairAll", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ReservoirReplenished_ReturnsCorrectEvent()
    {
        var line = @"{""FuelReservoir"":1.0,""timestamp"":""2024-01-01T00:00:00Z"",""FuelMain"":1.0,""event"":""ReservoirReplenished""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ReservoirReplenished", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_RestockVehicle_ReturnsCorrectEvent()
    {
        var line = @"{""Loadout_Localised"":""test"",""Type"":""test"",""Cost"":1,""Loadout"":""test"",""event"":""RestockVehicle"",""Count"":1,""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("RestockVehicle", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Resurrect_ReturnsCorrectEvent()
    {
        var line = @"{""Cost"":1,""timestamp"":""2024-01-01T00:00:00Z"",""Bankrupt"":true,""Option"":""test"",""event"":""Resurrect""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Resurrect", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SAASignalsFound_ReturnsCorrectEvent()
    {
        var line = @"{""BodyID"":1,""BodyName"":""test"",""event"":""SAASignalsFound"",""Signals"":[{}],""SystemAddress"":1,""Genuses"":[{}],""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SAASignalsFound", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SAAscanComplete_ReturnsCorrectEvent()
    {
        var line = @"{""BodyID"":1,""EfficiencyTarget"":1,""BodyName"":""test"",""event"":""SAAscanComplete"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""ProbesUsed"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SAAscanComplete", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SRVDestroyed_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""ID"":1,""event"":""SRVDestroyed""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SRVDestroyed", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Scan_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""Scan"",""BodyName"":""test"",""BodyID"":1,""DistanceFromArrivalLS"":1.0,""StarSystem"":""test"",""SystemAddress"":1,""StarPos"":[1.0],""WasDiscovered"":true,""WasMapped"":true,""Parents"":[{}],""Rings"":[{}],""AtmosphereType"":""test"",""AtmosphereComposition"":[{}],""Volcanism"":""test"",""SurfaceGravity"":1.0,""SurfaceTemperature"":1.0,""SurfacePressure"":1.0,""Landable"":true,""TerraformingState"":""test"",""PlanetClass"":""test"",""Composition"":{},""Materials"":""test"",""Radius"":1.0,""MassEM"":1.0,""SemiMajorAxis"":1.0,""Eccentricity"":1.0,""OrbitalInclination"":1.0,""Periapsis"":1.0,""OrbitalPeriod"":1.0,""RotationPeriod"":1.0,""AxialTilt"":1.0,""TidalLock"":true,""StarType"":""test"",""StellarMass"":1.0,""StellarRadius"":1.0,""AbsoluteMagnitude"":1.0,""Age_MY"":1.0,""Luminosity"":""test"",""Subclass"":1,""WasDiscoveredByName"":true,""WasMappedByName"":true,""ScanType"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Scan", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ScanOrganic_ReturnsCorrectEvent()
    {
        var line = @"{""Latitude"":1.0,""SystemAddress"":1,""Body"":""test"",""Species"":""test"",""Variant"":""test"",""Longitude"":1.0,""Variant_Localised"":""test"",""Species_Localised"":""test"",""Genus_Localised"":""test"",""ScanType"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""Genus"":""test"",""event"":""ScanOrganic"",""System"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ScanOrganic", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Screenshot_ReturnsCorrectEvent()
    {
        var line = @"{""Latitude"":1.0,""SystemAddress"":1,""Body"":""test"",""Filename"":""test"",""Heading"":1.0,""BodyID"":1,""Longitude"":1.0,""Width"":1,""Height"":1,""timestamp"":""2024-01-01T00:00:00Z"",""Altitude"":1.0,""event"":""Screenshot"",""System"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Screenshot", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SelfDestruct_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""SelfDestruct""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SelfDestruct", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SellDrones_ReturnsCorrectEvent()
    {
        var line = @"{""Type"":""test"",""Count"":1,""event"":""SellDrones"",""TotalSale"":1,""SellPrice"":1,""Type_Localised"":""test"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SellDrones", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SellExplorationData_ReturnsCorrectEvent()
    {
        var line = @"{""Systems"":[{}],""Bonus"":1,""Discovered"":[{}],""BaseValue"":1,""event"":""SellExplorationData"",""timestamp"":""2024-01-01T00:00:00Z"",""TotalEarnings"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SellExplorationData", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SellOrganicData_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""MarketID"":1,""BioData"":[{}],""event"":""SellOrganicData""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SellOrganicData", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SellSuit_ReturnsCorrectEvent()
    {
        var line = @"{""Price"":1,""Name_Localised"":""test"",""event"":""SellSuit"",""Name"":""test"",""SuitID"":1,""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SellSuit", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SellWeapon_ReturnsCorrectEvent()
    {
        var line = @"{""Price"":1,""WeaponID"":1,""Name_Localised"":""test"",""event"":""SellWeapon"",""Name"":""test"",""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SellWeapon", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SendText_ReturnsCorrectEvent()
    {
        var line = @"{""Message"":""test"",""Sent"":true,""To_Localised"":""test"",""event"":""SendText"",""timestamp"":""2024-01-01T00:00:00Z"",""To"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SendText", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ShieldState_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""ShieldsUp"":true,""event"":""ShieldState""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ShieldState", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ShipLocker_ReturnsCorrectEvent()
    {
        var line = @"{""Data"":[{}],""Items"":[{}],""event"":""ShipLocker"",""timestamp"":""2024-01-01T00:00:00Z"",""Components"":[{}],""Consumables"":[{}]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ShipLocker", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ShipLockerMaterials_ReturnsCorrectEvent()
    {
        var line = @"{""Data"":[{}],""Items"":[{}],""event"":""ShipLockerMaterials"",""timestamp"":""2024-01-01T00:00:00Z"",""Components"":[{}],""Consumables"":[{}]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ShipLockerMaterials", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_ShipTargeted_ReturnsCorrectEvent()
    {
        var line = @"{""PilotName_Localised"":""test"",""Faction"":""test"",""TargetLocked"":true,""SquadronID"":1,""Ship"":""test"",""ScanStage"":1,""Ship_Localised"":""test"",""Power"":""test"",""PilotRank"":""test"",""LegalStatus"":""test"",""ShieldHealth"":1.0,""PilotName"":""test"",""event"":""ShipTargeted"",""HullHealth"":1.0,""timestamp"":""2024-01-01T00:00:00Z""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("ShipTargeted", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Shutdown_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""Shutdown""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Shutdown", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SquadronCreated_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""SquadronName"":""test"",""event"":""SquadronCreated""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SquadronCreated", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SquadronDemotion_ReturnsCorrectEvent()
    {
        var line = @"{""OldRank"":1,""SquadronName"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""NewRank"":1,""event"":""SquadronDemotion""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SquadronDemotion", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SquadronKicked_ReturnsCorrectEvent()
    {
        var line = @"{""SquadronName"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""PlayerName"":""test"",""event"":""SquadronKicked""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SquadronKicked", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SquadronPromotion_ReturnsCorrectEvent()
    {
        var line = @"{""OldRank"":1,""SquadronName"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""NewRank"":1,""event"":""SquadronPromotion""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SquadronPromotion", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SquadronStartup_ReturnsCorrectEvent()
    {
        var line = @"{""SquadronRank"":""test"",""SquadronFaction"":""test"",""SquadronPowerplayState"":""test"",""CurrentRating"":1,""Rating"":[{}],""SquadronAlignedPower"":""test"",""event"":""SquadronStartup"",""timestamp"":""2024-01-01T00:00:00Z"",""SquadronID"":1,""SquadronName"":""test"",""SquadronHomeSystem"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SquadronStartup", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_StartJump_ReturnsCorrectEvent()
    {
        var line = @"{""JumpType"":""test"",""BodyID"":1,""event"":""StartJump"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""Body"":""test"",""StarSystem"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("StartJump", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SupercruiseEntry_ReturnsCorrectEvent()
    {
        var line = @"{""SystemAddress"":1,""timestamp"":""2024-01-01T00:00:00Z"",""event"":""SupercruiseEntry"",""System"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SupercruiseEntry", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SupercruiseExit_ReturnsCorrectEvent()
    {
        var line = @"{""BodyID"":1,""BodyType"":""test"",""event"":""SupercruiseExit"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""Body"":""test"",""System"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SupercruiseExit", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_SwitchSuitLoadout_ReturnsCorrectEvent()
    {
        var line = @"{""Modules"":[{}],""SuitName_Localised"":""test"",""event"":""SwitchSuitLoadout"",""timestamp"":""2024-01-01T00:00:00Z"",""SuitName"":""test"",""SuitID"":1,""LoadoutID"":1,""LoadoutName"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("SwitchSuitLoadout", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Synthesis_ReturnsCorrectEvent()
    {
        var line = @"{""Materials"":[{}],""timestamp"":""2024-01-01T00:00:00Z"",""Name_Localised"":""test"",""Name"":""test"",""event"":""Synthesis""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Synthesis", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Touchdown_ReturnsCorrectEvent()
    {
        var line = @"{""BodyID"":1,""OnStation"":true,""OnPlanet"":true,""Latitude"":1.0,""event"":""Touchdown"",""timestamp"":""2024-01-01T00:00:00Z"",""SystemAddress"":1,""PlayerControlled"":true,""Body"":""test"",""System"":""test"",""Longitude"":1.0}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Touchdown", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_TradeMicroResources_ReturnsCorrectEvent()
    {
        var line = @"{""Offered"":[{}],""timestamp"":""2024-01-01T00:00:00Z"",""MarketID"":1,""event"":""TradeMicroResources"",""Received"":[{}]}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("TradeMicroResources", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_TransferMicroResources_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""Transfers"":[{}],""event"":""TransferMicroResources""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("TransferMicroResources", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Undocked_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""MarketID"":1,""StationName"":""test"",""event"":""Undocked"",""StationType"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Undocked", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_Undocking_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""MarketID"":1,""StationName"":""test"",""event"":""Undocking""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("Undocking", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_UpgradeSuit_ReturnsCorrectEvent()
    {
        var line = @"{""Name"":""test"",""Cost"":1,""Name_Localised"":""test"",""event"":""UpgradeSuit"",""timestamp"":""2024-01-01T00:00:00Z"",""SuitID"":1,""Class"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("UpgradeSuit", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_UpgradeWeapon_ReturnsCorrectEvent()
    {
        var line = @"{""Name"":""test"",""WeaponID"":1,""Cost"":1,""Name_Localised"":""test"",""event"":""UpgradeWeapon"",""timestamp"":""2024-01-01T00:00:00Z"",""Class"":1}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("UpgradeWeapon", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_UseConsumable_ReturnsCorrectEvent()
    {
        var line = @"{""Consumable_Localised"":""test"",""timestamp"":""2024-01-01T00:00:00Z"",""Consumable"":""test"",""event"":""UseConsumable"",""Type"":""test""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("UseConsumable", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_WingAdd_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""Other"":""test"",""event"":""WingAdd""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("WingAdd", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_WingInvite_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""Other"":""test"",""event"":""WingInvite""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("WingInvite", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_WingJoin_ReturnsCorrectEvent()
    {
        var line = @"{""Others"":[{}],""timestamp"":""2024-01-01T00:00:00Z"",""event"":""WingJoin""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("WingJoin", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }


    [Fact]
    public void Parse_WingLeave_ReturnsCorrectEvent()
    {
        var line = @"{""timestamp"":""2024-01-01T00:00:00Z"",""event"":""WingLeave""}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("WingLeave", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }

}
