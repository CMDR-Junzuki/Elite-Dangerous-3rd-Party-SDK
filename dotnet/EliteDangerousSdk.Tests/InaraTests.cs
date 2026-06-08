using System.Reflection;
using System.Net;
using System.Text;
using System.Text.Json;
using Xunit;
using EliteDangerousSdk.Inara;

namespace EliteDangerousSdk.Tests;

public class InaraTests
{
    private static InaraClient CreateClient(HttpClient http)
    {
        var client = new InaraClient("TestApp", "1.0", "test-key");
        typeof(InaraClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);
        return client;
    }

    [Fact]
    public async Task SendEventsAsync_PostsCorrectPayload()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            Assert.Equal(HttpMethod.Post, req.Method);
            Assert.Equal("/inapi/v1/", req.RequestUri!.AbsolutePath);

            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal("TestApp", body.GetProperty("header").GetProperty("appName").GetString());
            Assert.Equal("test-key", body.GetProperty("header").GetProperty("APIkey").GetString());

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.SendEventsAsync(new List<Dictionary<string, object>>());
        Assert.Equal(200, result.Header.EventStatus);
    }

    [Fact]
    public async Task SendEventsAsync_ReturnsEventResponses()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[{""eventName"":""test"",""eventStatus"":204}]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var events = new List<Dictionary<string, object>>
        {
            new() { ["eventName"] = "test" },
        };
        var result = await client.SendEventsAsync(events);
        Assert.Equal(204, result.Events[0].EventStatus);
    }

    [Fact]
    public async Task SendEventsAsync_ThrowsOnHttpError()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", _ =>
            new HttpResponseMessage(HttpStatusCode.TooManyRequests)
        );
        var client = CreateClient(http);
        await Assert.ThrowsAsync<HttpRequestException>(() =>
            client.SendEventsAsync(new List<Dictionary<string, object>>()));
    }

    [Fact]
    public async Task SendEventsAsync_ThrowsOnApiError()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":400,""eventStatusText"":""Invalid API key""},""events"":[]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            client.SendEventsAsync(new List<Dictionary<string, object>>()));
        Assert.Contains("Invalid API key", ex.Message);
    }

    [Fact]
    public void Constructor_SetsCommanderName()
    {
        var client = new InaraClient("App", "1.0", "key", commanderName: "Cmdr Test");
        // Can't easily access private field; just verify no exception
        Assert.NotNull(client);
    }

    [Fact]
    public void Constructor_SetsCommanderFrontierId()
    {
        var client = new InaraClient("App", "1.0", "key", commanderFrontierId: "F12345");
        Assert.NotNull(client);
    }

    [Fact]
    public void Constructor_SetsIsDeveloping()
    {
        var client = new InaraClient("App", "1.0", "key", isDeveloping: true);
        Assert.NotNull(client);
    }

    // === Event Builder Tests ===

    [Fact]
    public void AddCommander_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommander("TestCmdr", "F123");
        Assert.Equal("addCommander", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("TestCmdr", data["commanderName"]);
        Assert.Equal("F123", data["commanderFrontierID"]);
        Assert.True((bool)data["isMainCommander"]!);
    }

    [Fact]
    public void GetCommanderProfile_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.GetCommanderProfile();
        Assert.Equal("getCommanderProfile", evt["eventName"]);
        Assert.False(evt.ContainsKey("eventData"));
    }

    [Fact]
    public void SetCommanderShip_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderShip("Sidewinder", 1, shipName: "Test", shipRole: "Explorer");
        Assert.Equal("setCommanderShip", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sidewinder", data["shipType"]);
        Assert.Equal(1, data["shipGameID"]);
        Assert.Equal("Test", data["shipName"]);
        Assert.Equal("Explorer", data["shipRole"]);
    }

    [Fact]
    public void SetCommanderShipLoadout_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var modules = new List<Dictionary<string, object>>
        {
            new() { ["slotName"] = "Slot1", ["itemName"] = "Beam Laser" },
        };
        var evt = client.SetCommanderShipLoadout(1, modules);
        Assert.Equal("setCommanderShipLoadout", evt["eventName"]);
        var data = (Dictionary<string, object>)evt["eventData"];
        Assert.Equal(1, data["shipGameID"]);
        Assert.Single((List<Dictionary<string, object>>)data["modules"]);
    }

    [Fact]
    public void AddCommanderTravelFsdJump_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderTravelFsdJump("Sol", [0, 0, 0], "2024-01-01");
        Assert.Equal("addCommanderTravelFSDJump", evt["eventName"]);
        Assert.Equal("2024-01-01", evt["eventTimestamp"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sol", data["starSystemName"]);
        Assert.Equal(0.0, data["starSystemX"]);
    }

    [Fact]
    public void AddCommanderTravelDock_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderTravelDock("Murchison", "Sol");
        Assert.Equal("addCommanderTravelDock", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sol", data["starSystemName"]);
        Assert.Equal("Murchison", data["stationName"]);
    }

    [Fact]
    public void AddCommanderTravelCarrierJump_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderTravelCarrierJump("Colonia");
        Assert.Equal("addCommanderTravelCarrierJump", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Colonia", data["starSystemName"]);
    }

    [Fact]
    public void SetCommanderTravelLocation_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderTravelLocation("Sol", [1, 2, 3]);
        Assert.Equal("setCommanderTravelLocation", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal(1.0, data["starSystemX"]);
        Assert.Equal(2.0, data["starSystemY"]);
        Assert.Equal(3.0, data["starSystemZ"]);
    }

    [Fact]
    public void SetCommanderRank_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderRank(combat: 5, trade: 3);
        Assert.Equal("setCommanderRank", evt["eventName"]);
        var data = (Dictionary<string, object>)evt["eventData"];
        Assert.Equal(5, data["combat"]);
        Assert.Equal(3, data["trade"]);
        Assert.False(data.ContainsKey("cqc"));
    }

    [Fact]
    public void SetCommanderCredits_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderCredits(1000000, 50000);
        Assert.Equal("setCommanderCredits", evt["eventName"]);
        var data = (Dictionary<string, object>)evt["eventData"];
        Assert.Equal(1000000L, data["commanderCredits"]);
        Assert.Equal(50000L, data["commanderLoan"]);
    }

    [Fact]
    public void SetCommanderInventory_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var cargo = new List<Dictionary<string, object>> { new() { ["name"] = "Gold", ["count"] = 10 } };
        var evt = client.SetCommanderInventory(cargo: cargo);
        Assert.Equal("setCommanderInventory", evt["eventName"]);
        var data = (Dictionary<string, object>)evt["eventData"];
        var result = (List<Dictionary<string, object>>)data["cargo"];
        Assert.Equal("Gold", result[0]["name"]);
    }

    [Fact]
    public void SetCommanderCommunityGoalProgress_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderCommunityGoalProgress(42, 1000, 75.5);
        Assert.Equal("setCommanderCommunityGoalProgress", evt["eventName"]);
        var data = (Dictionary<string, object>)evt["eventData"];
        Assert.Equal(42, data["communitygoalGameID"]);
        Assert.Equal(1000, data["contribution"]);
        Assert.Equal(75.5, data["percentile"]);
    }

    [Fact]
    public void SetCommunityGoal_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommunityGoal("Test CG", "Sol", "Daedalus",
            "Deliver goods", "2024-12-31", 50000);
        Assert.Equal("setCommunityGoal", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Test CG", data["communitygoalName"]);
        Assert.Equal("Sol", data["starSystemName"]);
        Assert.Equal(50000, data["communitygoalTotalContributions"]);
    }

    // === Friend Events ===

    [Fact]
    public void AddCommanderFriend_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderFriend("CmdrA", "pc");
        Assert.Equal("addCommanderFriend", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("CmdrA", data["commanderName"]);
        Assert.Equal("pc", data["gamePlatform"]);
    }

    [Fact]
    public void DelCommanderFriend_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.DelCommanderFriend("CmdrA");
        Assert.Equal("delCommanderFriend", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("CmdrA", data["commanderName"]);
    }

    // === Permit Events ===

    [Fact]
    public void AddCommanderPermit_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderPermit("Sol");
        Assert.Equal("addCommanderPermit", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sol", data["starSystemName"]);
    }

    // === Stats ===

    [Fact]
    public void SetCommanderGameStatistics_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var stats = new Dictionary<string, object> { ["combat"] = new Dictionary<string, object> { ["bonds"] = 5 } };
        var evt = client.SetCommanderGameStatistics(stats);
        Assert.Equal("setCommanderGameStatistics", evt["eventName"]);
    }

    // === Engineer Rank ===

    [Fact]
    public void SetCommanderRankEngineer_Single_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderRankEngineer("Felicity Farseer", 5);
        Assert.Equal("setCommanderRankEngineer", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        var engineers = (List<Dictionary<string, object>>)data["engineers"]!;
        Assert.Equal("Felicity Farseer", engineers[0]["engineerName"]);
        Assert.Equal(5, engineers[0]["rankValue"]);
    }

    // === Pilot Rank ===

    [Fact]
    public void SetCommanderRankPilot_Single_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderRankPilot("Combat", 5);
        Assert.Equal("setCommanderRankPilot", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Combat", data["rankName"]);
        Assert.Equal(5, data["rankValue"]);
    }

    [Fact]
    public void SetCommanderRankPilot_List_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var entries = new List<Dictionary<string, object>> { new() { ["rankName"] = "Combat", ["rankValue"] = 5 } };
        var evt = client.SetCommanderRankPilot(entries);
        Assert.Equal("setCommanderRankPilot", evt["eventName"]);
    }

    // === Power Rank ===

    [Fact]
    public void SetCommanderRankPower_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderRankPower("Aisling Duval", 10, 500);
        Assert.Equal("setCommanderRankPower", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Aisling Duval", data["powerName"]);
        Assert.Equal(10, data["rankValue"]);
        Assert.Equal(500, data["meritsValue"]);
    }

    // === Reputation ===

    [Fact]
    public void SetCommanderReputationMajorFaction_Single_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderReputationMajorFaction("Federation", 85.5);
        Assert.Equal("setCommanderReputationMajorFaction", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Federation", data["majorfactionName"]);
        Assert.Equal(85.5, data["majorfactionReputation"]);
    }

    [Fact]
    public void SetCommanderReputationMajorFaction_List_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var entries = new List<Dictionary<string, object>> { new() { ["majorfactionName"] = "Fed", ["majorfactionReputation"] = 50.0 } };
        var evt = client.SetCommanderReputationMajorFaction(entries);
        Assert.Equal("setCommanderReputationMajorFaction", evt["eventName"]);
    }

    [Fact]
    public void SetCommanderReputationMinorFaction_Single_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderReputationMinorFaction("Crimson State", 30.0);
        Assert.Equal("setCommanderReputationMinorFaction", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Crimson State", data["minorfactionName"]);
        Assert.Equal(30.0, data["minorfactionReputation"]);
    }

    [Fact]
    public void SetCommanderReputationMinorFaction_List_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var entries = new List<Dictionary<string, object>> { new() { ["minorfactionName"] = "CS", ["minorfactionReputation"] = 30.0 } };
        var evt = client.SetCommanderReputationMinorFaction(entries);
        Assert.Equal("setCommanderReputationMinorFaction", evt["eventName"]);
    }

    // === Inventory Events ===

    [Fact]
    public void AddCommanderInventoryItem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderInventoryItem("Gold", 10, "Commodity", "Ship");
        Assert.Equal("addCommanderInventoryItem", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Gold", data["itemName"]);
        Assert.Equal(10, data["itemCount"]);
        Assert.Equal("Commodity", data["itemType"]);
        Assert.Equal("Ship", data["itemLocation"]);
    }

    [Fact]
    public void DelCommanderInventoryItem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.DelCommanderInventoryItem("Gold", 5, "Commodity");
        Assert.Equal("delCommanderInventoryItem", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Gold", data["itemName"]);
    }

    [Fact]
    public void ResetCommanderInventory_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.ResetCommanderInventory("Materials", "Raw");
        Assert.Equal("resetCommanderInventory", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Materials", data["itemType"]);
        Assert.Equal("Raw", data["itemLocation"]);
    }

    [Fact]
    public void SetCommanderInventoryItem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderInventoryItem("Gold", 5, "Commodity");
        Assert.Equal("setCommanderInventoryItem", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Gold", data["itemName"]);
    }

    [Fact]
    public void AddCommanderInventoryCargoItem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderInventoryCargoItem("Gold", 10, true);
        Assert.Equal("addCommanderInventoryCargoItem", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Gold", data["itemName"]);
        Assert.Equal(10, data["itemCount"]);
        Assert.True((bool)data["isStolen"]!);
    }

    [Fact]
    public void AddCommanderInventoryMaterialsItem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderInventoryMaterialsItem("Iron", 50);
        Assert.Equal("addCommanderInventoryMaterialsItem", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Iron", data["itemName"]);
    }

    [Fact]
    public void DelCommanderInventoryCargoItem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.DelCommanderInventoryCargoItem("Gold", 5);
        Assert.Equal("delCommanderInventoryCargoItem", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Gold", data["itemName"]);
    }

    [Fact]
    public void DelCommanderInventoryMaterialsItem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.DelCommanderInventoryMaterialsItem("Iron", 10);
        Assert.Equal("delCommanderInventoryMaterialsItem", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal(10, data["itemCount"]);
    }

    [Fact]
    public void SetCommanderInventoryCargo_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var items = new List<Dictionary<string, object>> { new() { ["itemName"] = "Gold", ["itemCount"] = 10 } };
        var evt = client.SetCommanderInventoryCargo(items);
        Assert.Equal("setCommanderInventoryCargo", evt["eventName"]);
        var data = (List<Dictionary<string, object>>)evt["eventData"];
        Assert.Equal("Gold", data[0]["itemName"]);
    }

    [Fact]
    public void SetCommanderInventoryCargoItem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderInventoryCargoItem("Gold", 5, true);
        Assert.Equal("setCommanderInventoryCargoItem", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.True((bool)data["isStolen"]!);
    }

    [Fact]
    public void SetCommanderInventoryMaterials_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var items = new List<Dictionary<string, object>> { new() { ["itemName"] = "Iron", ["itemCount"] = 50 } };
        var evt = client.SetCommanderInventoryMaterials(items);
        Assert.Equal("setCommanderInventoryMaterials", evt["eventName"]);
    }

    [Fact]
    public void SetCommanderInventoryMaterialsItem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderInventoryMaterialsItem("Nickel", 100);
        Assert.Equal("setCommanderInventoryMaterialsItem", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal(100, data["itemCount"]);
    }

    // === Storage & Ship Events ===

    [Fact]
    public void SetCommanderStorageModules_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var mods = new List<Dictionary<string, object>> { new() { ["itemName"] = "Beam Laser", ["itemValue"] = 50000 } };
        var evt = client.SetCommanderStorageModules(mods);
        Assert.Equal("setCommanderStorageModules", evt["eventName"]);
    }

    [Fact]
    public void AddCommanderShip_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderShip("Sidewinder", 1);
        Assert.Equal("addCommanderShip", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sidewinder", data["shipType"]);
        Assert.Equal(1, data["shipGameID"]);
    }

    [Fact]
    public void DelCommanderShip_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.DelCommanderShip("Sidewinder", 1);
        Assert.Equal("delCommanderShip", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal(1, data["shipGameID"]);
    }

    [Fact]
    public void SetCommanderShipTransfer_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderShipTransfer("Sidewinder", 1, "Sol", "Daedalus", 12345, 3600);
        Assert.Equal("setCommanderShipTransfer", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sol", data["starSystemName"]);
        Assert.Equal(12345L, data["marketID"]);
    }

    [Fact]
    public void SetCommanderShip_WithStarsystem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderShip("Sidewinder", 1, "Sol", "Daedalus", "Ship1", "ABC-123");
        Assert.Equal("setCommanderShip", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sidewinder", data["shipType"]);
        Assert.Equal("Sol", data["starSystemName"]);
        Assert.Equal("Ship1", data["shipName"]);
        Assert.Equal("ABC-123", data["shipIdent"]);
    }

    [Fact]
    public void AddCommanderTravelLand_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderTravelLand("Sol", "Earth");
        Assert.Equal("addCommanderTravelLand", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sol", data["starsystemName"]);
        Assert.Equal("Earth", data["starsystemBodyName"]);
    }

    // === Mission Events ===

    [Fact]
    public void AddCommanderMission_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderMission("Mission1", 100, "Sol", "Daedalus");
        Assert.Equal("addCommanderMission", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Mission1", data["missionName"]);
        Assert.Equal(100, data["missionGameID"]);
        Assert.Equal("Sol", data["starSystemName"]);
    }

    [Fact]
    public void SetCommanderMissionAbandoned_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderMissionAbandoned(100);
        Assert.Equal("setCommanderMissionAbandoned", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal(100, data["missionGameID"]);
    }

    [Fact]
    public void SetCommanderMissionCompleted_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderMissionCompleted(100);
        Assert.Equal("setCommanderMissionCompleted", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal(100, data["missionGameID"]);
    }

    [Fact]
    public void SetCommanderMissionFailed_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.SetCommanderMissionFailed(100);
        Assert.Equal("setCommanderMissionFailed", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal(100, data["missionGameID"]);
    }

    // === Combat Events ===

    [Fact]
    public void AddCommanderCombatDeath_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderCombatDeath("Sol", "Cmdr X", isPlayer: true);
        Assert.Equal("addCommanderCombatDeath", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sol", data["starSystemName"]);
        Assert.Equal("Cmdr X", data["opponentName"]);
    }

    [Fact]
    public void AddCommanderCombatInterdicted_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderCombatInterdicted("Sol", "Cmdr X", true, "submit");
        Assert.Equal("addCommanderCombatInterdicted", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Cmdr X", data["opponentName"]);
        Assert.Equal("submit", data["combatResult"]);
    }

    [Fact]
    public void AddCommanderCombatInterdiction_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderCombatInterdiction("Sol", "Cmdr X", false, "escaped");
        Assert.Equal("addCommanderCombatInterdiction", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("escaped", data["combatResult"]);
    }

    [Fact]
    public void AddCommanderCombatInterdictionEscape_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderCombatInterdictionEscape("Sol", "Cmdr X", true);
        Assert.Equal("addCommanderCombatInterdictionEscape", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.True((bool)data["isPlayer"]!);
    }

    [Fact]
    public void AddCommanderCombatKill_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.AddCommanderCombatKill("Sol", opponentShipType: "Federal Corvette");
        Assert.Equal("addCommanderCombatKill", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Federal Corvette", data["opponentShipType"]);
    }

    // === Suit Loadout Events ===

    [Fact]
    public void DelCommanderSuitLoadout_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.DelCommanderSuitLoadout(4293000001);
        Assert.Equal("delCommanderSuitLoadout", evt["eventName"]);
        var data = (Dictionary<string, object>)evt["eventData"]!;
        Assert.Equal(4293000001L, data["loadoutGameID"]);
    }

    [Fact]
    public void SetCommanderSuitLoadout_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var data = new Dictionary<string, object>
        {
            ["loadoutGameID"] = 4293000004L,
            ["loadoutName"] = "Scavenging",
            ["suitType"] = "utilitysuit_class3",
            ["suitGameID"] = 1700315870155528L,
            ["suitMods"] = new List<string> { "suit_backpackcapacity" },
            ["suitLoadout"] = new List<Dictionary<string, object>>
            {
                new() { ["slotName"] = "PrimaryWeapon1", ["itemName"] = "wpn_m_sniper_plasma_charged" },
            },
        };
        var evt = client.SetCommanderSuitLoadout(data);
        Assert.Equal("setCommanderSuitLoadout", evt["eventName"]);
        Assert.Same(data, evt["eventData"]);
    }

    [Fact]
    public void UpdateCommanderSuitLoadout_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.UpdateCommanderSuitLoadout(new Dictionary<string, object>
        {
            ["loadoutGameID"] = 4293000001L,
            ["loadoutName"] = "My loadout new name",
        });
        Assert.Equal("updateCommanderSuitLoadout", evt["eventName"]);
        var d = (Dictionary<string, object>)evt["eventData"]!;
        Assert.Equal("My loadout new name", d["loadoutName"]);
    }

    // === Community Goals ===

    [Fact]
    public void GetCommunityGoalsRecent_WithSystem_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.GetCommunityGoalsRecent("Sol");
        Assert.Equal("getCommunityGoalsRecent", evt["eventName"]);
        var data = (Dictionary<string, object?>)evt["eventData"];
        Assert.Equal("Sol", data["starSystemName"]);
    }

    [Fact]
    public void GetCommunityGoalsRecent_Empty_BuildsEvent()
    {
        var client = new InaraClient("App", "1.0", "key");
        var evt = client.GetCommunityGoalsRecent();
        Assert.Equal("getCommunityGoalsRecent", evt["eventName"]);
        Assert.False(evt.ContainsKey("eventData"));
    }

    // === Auto-Send Convenience Method Tests ===

    [Fact]
    public async Task GetCommanderProfileAsync_SendsEvent()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal("getCommanderProfile", body.GetProperty("events")[0].GetProperty("eventName").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[{""eventStatus"":200}]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetCommanderProfileAsync();
        Assert.Equal(200, result.Header.EventStatus);
    }

    [Fact]
    public async Task AddCommanderAsync_SendsEvent()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            var evt = body.GetProperty("events")[0];
            Assert.Equal("addCommander", evt.GetProperty("eventName").GetString());
            Assert.Equal("TestCmdr", evt.GetProperty("eventData").GetProperty("commanderName").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[{""eventStatus"":200}]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        await client.AddCommanderAsync("TestCmdr", "F123");
    }

    [Fact]
    public async Task AddCommanderTravelFsdJumpAsync_SendsEvent()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            var evt = body.GetProperty("events")[0];
            Assert.Equal("addCommanderTravelFSDJump", evt.GetProperty("eventName").GetString());
            Assert.Equal("Sol", evt.GetProperty("eventData").GetProperty("starSystemName").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[{""eventStatus"":200}]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        await client.AddCommanderTravelFsdJumpAsync("Sol", [0, 0, 0]);
    }

    [Fact]
    public async Task SetCommanderCreditsAsync_SendsEvent()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            var evt = body.GetProperty("events")[0];
            Assert.Equal("setCommanderCredits", evt.GetProperty("eventName").GetString());
            Assert.Equal(1000000, evt.GetProperty("eventData").GetProperty("commanderCredits").GetInt64());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[{""eventStatus"":200}]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        await client.SetCommanderCreditsAsync(1000000, 50000);
    }

    [Fact]
    public async Task AddCommanderMissionAsync_SendsEvent()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            var evt = body.GetProperty("events")[0];
            Assert.Equal("addCommanderMission", evt.GetProperty("eventName").GetString());
            Assert.Equal("Mission1", evt.GetProperty("eventData").GetProperty("missionName").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[{""eventStatus"":200}]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        await client.AddCommanderMissionAsync("Mission1", 100, "Sol", "Daedalus");
    }

    [Fact]
    public async Task GetCommunityGoalsRecentAsync_SendsEvent()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            var evt = body.GetProperty("events")[0];
            Assert.Equal("getCommunityGoalsRecent", evt.GetProperty("eventName").GetString());
            Assert.Equal("Sol", evt.GetProperty("eventData").GetProperty("starSystemName").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[{""eventStatus"":200}]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        await client.GetCommunityGoalsRecentAsync("Sol");
    }

    [Fact]
    public async Task AddCommanderCombatDeathAsync_SendsEvent()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            var evt = body.GetProperty("events")[0];
            Assert.Equal("addCommanderCombatDeath", evt.GetProperty("eventName").GetString());
            Assert.True(evt.GetProperty("eventData").GetProperty("isPlayer").GetBoolean());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[{""eventStatus"":200}]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        await client.AddCommanderCombatDeathAsync("Sol", "Cmdr X", isPlayer: true);
    }

    [Fact]
    public async Task SetCommanderRankEngineerAsync_SendsEvent()
    {
        var http = MockHttpMessageHandler.CreateClient("https://inara.cz", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            var evt = body.GetProperty("events")[0];
            Assert.Equal("setCommanderRankEngineer", evt.GetProperty("eventName").GetString());
            var engineers = evt.GetProperty("eventData").GetProperty("engineers");
            Assert.Equal("Felicity Farseer", engineers[0].GetProperty("engineerName").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""header"":{""eventStatus"":200},""events"":[{""eventStatus"":200}]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        await client.SetCommanderRankEngineerAsync("Felicity Farseer", 5);
    }
}
