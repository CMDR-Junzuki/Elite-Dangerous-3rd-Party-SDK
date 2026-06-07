using System.Collections.Generic;
using System.Dynamic;
using Xunit;
using EliteDangerousSdk.Journal;

namespace EliteDangerousSdk.Tests;

public class CommanderStateTests
{
    private static dynamic MakeEvent(string eventType, Dictionary<string, object?>? extra = null)
    {
        dynamic e = new ExpandoObject();
        var d = (IDictionary<string, object?>)e;
        d["event"] = eventType;
        d["timestamp"] = "t";
        if (extra != null)
        {
            foreach (var kv in extra)
                d[kv.Key] = kv.Value;
        }
        return e;
    }

    private static dynamic MakeObj(Dictionary<string, object?> props)
    {
        dynamic e = new ExpandoObject();
        var d = (IDictionary<string, object?>)e;
        foreach (var kv in props)
            d[kv.Key] = kv.Value;
        return e;
    }

    [Fact]
    public void InitialState_IsEmpty()
    {
        var engine = new CommanderStateEngine();
        var s = engine.GetState();
        Assert.Equal("", s.Commander.Name);
        Assert.Equal("", s.Ship.Current);
        Assert.Equal("", s.Location.System);
        Assert.Empty(s.Missions);
        Assert.Null(s.Carrier);
        Assert.Empty(s.NavRoute);
    }

    [Fact]
    public void Reset_ClearsState()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("LoadGame", new() { ["Commander"] = "Test", ["Ship"] = "Sidewinder", ["ShipID"] = 1, ["Credits"] = 1000L, ["Loan"] = 0L, ["GameMode"] = "Open" }));
        Assert.Equal("Test", engine.GetState().Commander.Name);
        engine.Reset();
        Assert.Equal("", engine.GetState().Commander.Name);
    }

    [Fact]
    public void LoadGame_SetsCommanderAndShip()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("LoadGame", new()
        {
            ["Commander"] = "CMDR Test", ["FID"] = "F12345", ["Ship"] = "Krait_MkII", ["ShipID"] = 42,
            ["ShipName"] = "Void Walker", ["ShipIdent"] = "KT-1", ["FuelLevel"] = 50.0, ["FuelCapacity"] = 100.0,
            ["Credits"] = 5000000L, ["Loan"] = 0L, ["GameMode"] = "Open", ["Group"] = "G",
            ["Horizons"] = true, ["Odyssey"] = true
        }));
        var s = engine.GetState();
        Assert.Equal("CMDR Test", s.Commander.Name);
        Assert.Equal("F12345", s.Commander.Fid);
        Assert.Equal(5000000, s.Commander.Credits);
        Assert.Equal("Krait_MkII", s.Ship.Current);
        Assert.Equal("Void Walker", s.Ship.Name);
        Assert.Equal(50, s.Ship.FuelLevel);
        Assert.True(s.Flags.Odyssey);
        Assert.Equal("Open", s.Flags.GameMode);
    }

    [Fact]
    public void Location_SetsSystem()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("Location", new()
        {
            ["StarSystem"] = "Sol", ["SystemAddress"] = 1L, ["StarPos"] = new double[] { 0, 0, 0 },
            ["Docked"] = true, ["StationName"] = "Li Qing Jao", ["StationType"] = "Orbis"
        }));
        var s = engine.GetState();
        Assert.Equal("Sol", s.Location.System);
        Assert.True(s.Location.Docked);
    }

    [Fact]
    public void FSDJump_UpdatesSystem()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("FSDJump", new()
        {
            ["StarSystem"] = "Alpha Centauri", ["StarPos"] = new double[] { 1, 2, 3 },
            ["JumpDist"] = 4.37, ["FuelLevel"] = 75.0
        }));
        Assert.Equal("Alpha Centauri", engine.GetState().Location.System);
        Assert.Equal(75, engine.GetState().Ship.FuelLevel);
    }

    [Fact]
    public void DockedUndocked()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("Docked", new() { ["StationName"] = "Test", ["StationType"] = "Station", ["StarSystem"] = "S" }));
        Assert.True(engine.GetState().Location.Docked);
        engine.Update(MakeEvent("Undocked", new()));
        Assert.False(engine.GetState().Location.Docked);
    }

    [Fact]
    public void Promotion_SetsRanks()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("Promotion", new() { ["Combat"] = 2, ["Trade"] = 3 }));
        var r = engine.GetState().Commander.Ranks;
        Assert.Equal(2, r.Combat);
        Assert.Equal(3, r.Trade);
    }

    [Fact]
    public void Progress_SetsProgress()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("Progress", new() { ["Combat"] = 50.0, ["Explore"] = 75.5 }));
        var p = engine.GetState().Commander.Progress;
        Assert.Equal(50, p.Combat);
        Assert.Equal(75.5, p.Explore);
    }

    [Fact]
    public void MaterialCollected_AddsToInventory()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("MaterialCollected", new() { ["Category"] = "Raw", ["Name"] = "Iron", ["Count"] = 5 }));
        Assert.Contains(engine.GetState().Materials.Raw, m => m is { Name: "Iron", Count: 5 });
    }

    [Fact]
    public void MaterialCollected_Accumulates()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("MaterialCollected", new() { ["Category"] = "Raw", ["Name"] = "Nickel", ["Count"] = 3 }));
        engine.Update(MakeEvent("MaterialCollected", new() { ["Category"] = "Raw", ["Name"] = "Nickel", ["Count"] = 2 }));
        Assert.Contains(engine.GetState().Materials.Raw, m => m is { Name: "Nickel", Count: 5 });
    }

    [Fact]
    public void MaterialDiscarded_RemovesAtZero()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("MaterialCollected", new() { ["Category"] = "Raw", ["Name"] = "Sulphur", ["Count"] = 5 }));
        engine.Update(MakeEvent("MaterialDiscarded", new() { ["Category"] = "Raw", ["Name"] = "Sulphur", ["Count"] = 5 }));
        Assert.Empty(engine.GetState().Materials.Raw);
    }

    [Fact]
    public void MaterialTrade_TradesMaterials()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("MaterialCollected", new() { ["Category"] = "Raw", ["Name"] = "Iron", ["Count"] = 10 }));
        var traded = MakeObj(new() { ["Material"] = "Iron", ["Category"] = "Raw", ["Quantity"] = 5 });
        var received = MakeObj(new() { ["Material"] = "Nickel", ["Category"] = "Raw", ["Quantity"] = 3 });
        engine.Update(MakeEvent("MaterialTrade", new() { ["Traded"] = traded, ["Received"] = received }));
        var s = engine.GetState();
        Assert.Contains(s.Materials.Raw, m => m is { Name: "Iron", Count: 5 });
        Assert.Contains(s.Materials.Raw, m => m is { Name: "Nickel", Count: 3 });
    }

    [Fact]
    public void Synthesis_ConsumesMaterials()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("MaterialCollected", new() { ["Category"] = "Manufactured", ["Name"] = "Scrap", ["Count"] = 10 }));
        var ing = MakeObj(new() { ["Name"] = "Scrap", ["Count"] = 5, ["Category"] = "Manufactured" });
        engine.Update(MakeEvent("Synthesis", new() { ["Name"] = "Ammo", ["Materials"] = new List<dynamic> { ing } }));
        Assert.Contains(engine.GetState().Materials.Manufactured, m => m is { Name: "Scrap", Count: 5 });
    }

    [Fact]
    public void EngineerCraft_ConsumesIngredients()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("MaterialCollected", new() { ["Category"] = "Raw", ["Name"] = "Iron", ["Count"] = 10 }));
        var ing = MakeObj(new() { ["Name"] = "Iron", ["Quantity"] = 3, ["Category"] = "Raw" });
        engine.Update(MakeEvent("EngineerCraft", new()
        {
            ["Engineer"] = "Felicity", ["Blueprint"] = "FSD Range", ["Level"] = 1,
            ["Ingredients"] = new List<dynamic> { ing }
        }));
        Assert.Contains(engine.GetState().Materials.Raw, m => m is { Name: "Iron", Count: 7 });
    }

    [Fact]
    public void ModuleInfo_SetsModules()
    {
        var engine = new CommanderStateEngine();
        var mod = MakeObj(new() { ["Slot"] = "Slot01", ["Item"] = "TestModule", ["Priority"] = 1, ["Health"] = 100.0, ["Value"] = 5000 });
        engine.Update(MakeEvent("ModuleInfo", new() { ["Modules"] = new List<dynamic> { mod } }));
        Assert.Equal("TestModule", engine.GetState().Ship.Modules[0].Item);
    }

    [Fact]
    public void ModuleInfo_WithEngineering()
    {
        var engine = new CommanderStateEngine();
        var eng = MakeObj(new() { ["Engineer"] = "Felicity", ["BlueprintName"] = "FSD Range", ["Level"] = 5, ["Quality"] = 1.0, ["ExperimentalEffect"] = "Mass Manager" });
        var mod = MakeObj(new() { ["Slot"] = "S", ["Item"] = "M", ["Priority"] = 1, ["Engineering"] = eng });
        engine.Update(MakeEvent("ModuleInfo", new() { ["Modules"] = new List<dynamic> { mod } }));
        var e = engine.GetState().Ship.Modules[0].Engineering!;
        Assert.Equal("Felicity", e.Engineer);
        Assert.Equal(5, e.Level);
    }

    [Fact]
    public void MissionAccepted_AddsMission()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("MissionAccepted", new() { ["MissionID"] = 1, ["Name"] = "Courier", ["Faction"] = "Fed", ["Reward"] = 50000 }));
        Assert.Single(engine.GetState().Missions);
        Assert.Equal("Courier", engine.GetState().Missions[0].Name);
    }

    [Fact]
    public void MissionCompleted_RemovesMission()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("MissionAccepted", new() { ["MissionID"] = 1, ["Name"] = "Test", ["Faction"] = "F" }));
        engine.Update(MakeEvent("MissionCompleted", new() { ["MissionID"] = 1, ["Name"] = "Test", ["Faction"] = "F" }));
        Assert.Empty(engine.GetState().Missions);
    }

    [Fact]
    public void NavRoute_SetsRoute()
    {
        var engine = new CommanderStateEngine();
        var wp = MakeObj(new() { ["StarSystem"] = "Sol", ["SystemAddress"] = 1L, ["StarPos"] = new double[] { 0, 0, 0 } });
        engine.Update(MakeEvent("NavRoute", new() { ["Route"] = new List<dynamic> { wp } }));
        Assert.Single(engine.GetState().NavRoute);
        Assert.Equal("Sol", engine.GetState().NavRoute[0].StarSystem);
    }

    [Fact]
    public void NavRouteClear_EmptiesRoute()
    {
        var engine = new CommanderStateEngine();
        var wp = MakeObj(new() { ["StarSystem"] = "Sol", ["StarPos"] = new double[] { 0, 0, 0 } });
        engine.Update(MakeEvent("NavRoute", new() { ["Route"] = new List<dynamic> { wp } }));
        engine.Update(MakeEvent("NavRouteClear", new()));
        Assert.Empty(engine.GetState().NavRoute);
    }

    [Fact]
    public void CarrierBuy_SetsCarrier()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("CarrierBuy", new() { ["CarrierID"] = 12345L, ["Price"] = 5000000000L, ["Callsign"] = "V1C" }));
        Assert.NotNull(engine.GetState().Carrier);
        Assert.Equal("V1C", engine.GetState().Carrier!.Callsign);
    }

    [Fact]
    public void CarrierStats_UpdatesDetails()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("CarrierStats", new()
        {
            ["CarrierID"] = 1L, ["Callsign"] = "XYZ", ["Name"] = "Home One",
            ["FuelLevel"] = 500.0, ["JumpRangeCurr"] = 250.0, ["JumpRangeMax"] = 500.0, ["DockingAccess"] = "all"
        }));
        var c = engine.GetState().Carrier!;
        Assert.Equal("XYZ", c.Callsign);
        Assert.Equal("Home One", c.Name);
        Assert.Equal(500, c.FuelLevel);
    }

    [Fact]
    public void CarrierNameChange_UpdatesName()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("CarrierBuy", new() { ["CarrierID"] = 1L, ["Price"] = 0L, ["Callsign"] = "T" }));
        engine.Update(MakeEvent("CarrierNameChange", new() { ["Name"] = "New Name" }));
        Assert.Equal("New Name", engine.GetState().Carrier!.Name);
    }

    [Fact]
    public void FullSession_TracksState()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("LoadGame", new() { ["Commander"] = "Alex", ["Ship"] = "Python", ["ShipID"] = 10, ["Credits"] = 1000000L, ["Loan"] = 0L, ["GameMode"] = "Open", ["Odyssey"] = true }));
        engine.Update(MakeEvent("Location", new() { ["StarSystem"] = "LHS 3447", ["StarPos"] = new double[] { -10, 5, 0 }, ["Docked"] = true, ["StationName"] = "Baker Hub", ["StationType"] = "Orbis" }));
        engine.Update(MakeEvent("Undocked", new()));
        engine.Update(MakeEvent("StartJump", new() { ["JumpType"] = "Hyperspace" }));
        engine.Update(MakeEvent("FSDJump", new() { ["StarSystem"] = "Sol", ["StarPos"] = new double[] { 0, 0, 0 }, ["JumpDist"] = 10.5, ["FuelLevel"] = 70.0 }));
        engine.Update(MakeEvent("Docked", new() { ["StationName"] = "Li Qing Jao", ["StationType"] = "Coriolis", ["StarSystem"] = "Sol" }));
        var s = engine.GetState();
        Assert.Equal("Alex", s.Commander.Name);
        Assert.Equal("Sol", s.Location.System);
        Assert.True(s.Location.Docked);
    }

    [Fact]
    public void UnknownEvent_IsIgnored()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("UnknownEvent", new() { ["x"] = 1 }));
        Assert.Equal("", engine.GetState().Commander.Name);
    }

    [Fact]
    public void Export_ReturnsDeepClone()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("LoadGame", new() { ["Commander"] = "Test", ["FID"] = "F1", ["Ship"] = "Sidewinder", ["ShipID"] = 1, ["Credits"] = 1000L, ["Loan"] = 0L, ["GameMode"] = "Open" }));
        var snapshot = engine.Export();
        Assert.Equal("Test", snapshot.Commander.Name);
    }

    [Fact]
    public void ExportImport_RoundTrips()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("LoadGame", new() { ["Commander"] = "Alpha", ["FID"] = "F42", ["Ship"] = "Python", ["ShipID"] = 7, ["Credits"] = 5000000L, ["Loan"] = 0L, ["GameMode"] = "Open" }));
        engine.Update(MakeEvent("Location", new() { ["StarSystem"] = "Sol", ["SystemAddress"] = 1L, ["StarPos"] = new double[] { 0, 0, 0 }, ["Docked"] = false }));
        var snapshot = engine.Export();
        engine.Update(MakeEvent("FSDJump", new() { ["StarSystem"] = "Achernar", ["SystemAddress"] = 2L, ["StarPos"] = new double[] { 10, 0, 0 }, ["JumpDist"] = 50.0, ["FuelLevel"] = 30.0 }));
        engine.Import(snapshot);
        Assert.Equal("Alpha", engine.GetState().Commander.Name);
        Assert.Equal("Sol", engine.GetState().Location.System);
    }

    [Fact]
    public void Import_WithEmptyResetsState()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("LoadGame", new() { ["Commander"] = "X", ["FID"] = "X", ["Ship"] = "S", ["ShipID"] = 1, ["Credits"] = 0L, ["Loan"] = 0L, ["GameMode"] = "Open" }));
        engine.Import(new CommanderState(
            new CommanderInfo("", "", 0, 0, new Ranks(0, 0, 0, 0, 0, 0, 0, 0), new ProgressValues(0, 0, 0, 0, 0, 0, 0, 0)),
            new LocationState("", 0, new double[] { 0, 0, 0 }, "", "", 0, "", "", 0, false, 0, 0, 0, 0, 0, false, false, false, "", "", "", "", 0, "", Array.Empty<string>(),
                new List<FactionStateInfo>(), new List<ConflictInfo>()),
            new ShipState("", 0, "", "", 0, 0, 100, 0, 0, new List<ShipModuleState>()),
            new List<FleetEntry>(),
            new MaterialLists(new List<MaterialEntry>(), new List<MaterialEntry>(), new List<MaterialEntry>(), new List<MaterialEntry>(), new List<MaterialEntry>(), new List<MaterialEntry>(), new List<MaterialEntry>()),
            new List<MissionState>(), null, new List<NavRouteEntry>(),
            new FlagsState(false, false, "", ""),
            new SquadronState("", "", "", "", "", "", 0, 0, new List<Dictionary<string, object?>>())
        ));
        Assert.Equal("", engine.GetState().Commander.Name);
    }

    [Fact]
    public void SquadronStartup_StoresSquadronInfo()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("SquadronStartup", new()
        {
            ["SquadronName"] = "Dark Echo",
            ["SquadronRank"] = "12",
            ["SquadronAlignedPower"] = "Aisling Duval",
            ["SquadronHomeSystem"] = "Cubeo",
            ["SquadronFaction"] = "Dark Echo Corp",
            ["SquadronPowerplayState"] = "Preparation",
            ["SquadronID"] = 12345L,
            ["CurrentRating"] = 3,
            ["Rating"] = new List<Dictionary<string, object?>>
            {
                new() { ["Name"] = "R1", ["Rank"] = 1 },
                new() { ["Name"] = "R2", ["Rank"] = 2 },
            },
        }));
        var s = engine.GetState().Squadron;
        Assert.Equal("Dark Echo", s.Name);
        Assert.Equal("12", s.Rank);
        Assert.Equal("Aisling Duval", s.AlignedPower);
        Assert.Equal("Cubeo", s.HomeSystem);
        Assert.Equal("Dark Echo Corp", s.FactionName);
        Assert.Equal(12345, s.Id);
        Assert.Equal(3, s.CurrentRating);
        Assert.Equal(2, s.Ratings.Count);
    }

    [Fact]
    public void SquadronStartup_UsesDefaultsForMissingFields()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("SquadronStartup", new()));
        var s = engine.GetState().Squadron;
        Assert.Equal("", s.Name);
        Assert.Equal("", s.Rank);
        Assert.Equal(0, s.Id);
        Assert.Empty(s.Ratings);
    }

    [Fact]
    public void JoinedSquadron_SetsSquadronName()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("JoinedSquadron", new() { ["SquadronName"] = "New Squad" }));
        Assert.Equal("New Squad", engine.GetState().Squadron.Name);
    }

    [Fact]
    public void LeftSquadron_ClearsSquadronState()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("SquadronStartup", new()
        {
            ["SquadronName"] = "Test Squad",
            ["SquadronRank"] = "5",
            ["SquadronID"] = 99L,
        }));
        Assert.Equal("Test Squad", engine.GetState().Squadron.Name);
        engine.Update(MakeEvent("LeftSquadron", new() { ["SquadronName"] = "Test Squad" }));
        var s = engine.GetState().Squadron;
        Assert.Equal("", s.Name);
        Assert.Equal("", s.Rank);
        Assert.Equal(0, s.Id);
    }

    [Fact]
    public void DisbandedSquadron_ClearsSquadronState()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("SquadronStartup", new()
        {
            ["SquadronName"] = "Squad",
            ["SquadronID"] = 1L,
        }));
        engine.Update(MakeEvent("DisbandedSquadron", new() { ["SquadronName"] = "Squad" }));
        Assert.Equal("", engine.GetState().Squadron.Name);
    }

    [Fact]
    public void KickedFromSquadron_ClearsSquadronState()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("SquadronStartup", new()
        {
            ["SquadronName"] = "Squad",
            ["SquadronID"] = 1L,
        }));
        engine.Update(MakeEvent("KickedFromSquadron", new() { ["SquadronName"] = "Squad" }));
        Assert.Equal("", engine.GetState().Squadron.Name);
    }

    [Fact]
    public void SquadronPromotion_UpdatesRank()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("SquadronStartup", new()
        {
            ["SquadronName"] = "Squad",
            ["SquadronRank"] = "1",
        }));
        engine.Update(MakeEvent("SquadronPromotion", new()
        {
            ["SquadronName"] = "Squad",
            ["OldRank"] = 1,
            ["NewRank"] = 2,
        }));
        Assert.Equal("2", engine.GetState().Squadron.Rank);
    }

    [Fact]
    public void SquadronDemotion_UpdatesRank()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("SquadronStartup", new()
        {
            ["SquadronName"] = "Squad",
            ["SquadronRank"] = "5",
        }));
        engine.Update(MakeEvent("SquadronDemotion", new()
        {
            ["SquadronName"] = "Squad",
            ["OldRank"] = 5,
            ["NewRank"] = 3,
        }));
        Assert.Equal("3", engine.GetState().Squadron.Rank);
    }

    [Fact]
    public void SquadronCreated_SetsName()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("SquadronCreated", new() { ["SquadronName"] = "Brand New Squad" }));
        Assert.Equal("Brand New Squad", engine.GetState().Squadron.Name);
    }

    [Fact]
    public void FSDJump_StoresFactionsAndConflicts()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("FSDJump", new()
        {
            ["StarSystem"] = "Sol",
            ["SystemAddress"] = 1L,
            ["StarPos"] = new double[] { 0, 0, 0 },
            ["JumpDist"] = 0.0,
            ["Factions"] = new List<Dictionary<string, object?>>
            {
                new() { ["Name"] = "Fed", ["FactionState"] = "Boom", ["Influence"] = 0.6, ["Allegiance"] = "Federation", ["Government"] = "Democracy" },
                new() { ["Name"] = "Indie", ["FactionState"] = "None", ["Influence"] = 0.4, ["Allegiance"] = "Independent", ["Government"] = "Corporate" },
            },
            ["Conflicts"] = new List<Dictionary<string, object?>>
            {
                new() { ["WarType"] = "election", ["Status"] = "active", ["Faction1"] = new Dictionary<string, object?> { ["Name"] = "Fed", ["Stake"] = "Stake1", ["WonDays"] = 2 }, ["Faction2"] = new Dictionary<string, object?> { ["Name"] = "Indie", ["Stake"] = "Stake2", ["WonDays"] = 1 } },
            },
        }));
        var l = engine.GetState().Location;
        Assert.Equal(2, l.Factions.Count);
        Assert.Equal("Fed", l.Factions[0].Name);
        Assert.Equal(0.6, l.Factions[0].Influence);
        Assert.Equal("Boom", l.Factions[0].FactionState);
        Assert.Single(l.Conflicts);
        Assert.Equal("election", l.Conflicts[0].WarType);
        Assert.Equal("Fed", l.Conflicts[0].Faction1.Name);
        Assert.Equal(1, l.Conflicts[0].Faction2.WonDays);
    }

    [Fact]
    public void Location_StoresFactions()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("Location", new()
        {
            ["StarSystem"] = "Achernar",
            ["SystemAddress"] = 2L,
            ["StarPos"] = new double[] { 10, 0, 0 },
            ["Docked"] = true,
            ["Factions"] = new List<Dictionary<string, object?>>
            {
                new() { ["Name"] = "Empire", ["FactionState"] = "Expansion", ["Influence"] = 0.7, ["Allegiance"] = "Empire", ["Government"] = "Patronage" },
            },
        }));
        Assert.Single(engine.GetState().Location.Factions);
        Assert.Equal("Empire", engine.GetState().Location.Factions[0].Name);
    }

    [Fact]
    public void Docked_StoresFactionsWithStateTimelines()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("Docked", new()
        {
            ["StationName"] = "Port",
            ["StationType"] = "Station",
            ["StarSystem"] = "Sol",
            ["Factions"] = new List<Dictionary<string, object?>>
            {
                new()
                {
                    ["Name"] = "Fed",
                    ["FactionState"] = "Boom",
                    ["Influence"] = 0.5,
                    ["Allegiance"] = "Federation",
                    ["Government"] = "Democracy",
                    ["ActiveStates"] = new List<Dictionary<string, object?>>
                    {
                        new() { ["State"] = "Boom", ["Trend"] = 1 },
                    },
                    ["PendingStates"] = new List<Dictionary<string, object?>>
                    {
                        new() { ["State"] = "Expansion", ["Trend"] = 0 },
                    },
                },
            },
        }));
        var f = engine.GetState().Location.Factions[0];
        Assert.Single(f.ActiveStates!);
        Assert.Equal("Boom", f.ActiveStates![0]["State"]);
        Assert.Equal("Expansion", f.PendingStates![0]["State"]);
    }

    [Fact]
    public void NoFactions_HandledGracefully()
    {
        var engine = new CommanderStateEngine();
        engine.Update(MakeEvent("FSDJump", new()
        {
            ["StarSystem"] = "Sol",
            ["StarPos"] = new double[] { 0, 0, 0 },
            ["JumpDist"] = 0.0,
        }));
        Assert.Empty(engine.GetState().Location.Factions);
        Assert.Empty(engine.GetState().Location.Conflicts);
    }
}
