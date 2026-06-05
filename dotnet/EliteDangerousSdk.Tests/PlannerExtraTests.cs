using System.Text.Json;
using Xunit;
using EliteDangerousSdk.Planner;

namespace EliteDangerousSdk.Tests;

public class MaterialsTests
{
    [Fact]
    public void CreateInventory_ReturnsEmpty()
    {
        var inv = Materials.CreateInventory();
        Assert.Empty(inv.Materials);
    }

    [Fact]
    public void MaterialCaps_AllGrades3000()
    {
        for (int g = 1; g <= 5; g++)
            Assert.Equal(3000, MaterialCaps.ByGrade[g]);
    }

    [Fact]
    public void UpdateInventory_AddsToExisting()
    {
        var inv = new MaterialInventory
        {
            Materials = new List<MaterialEntry>
            {
                new() { Name = "Nickel", Count = 100, MaxCapacity = 3000 },
            }
        };
        Materials.UpdateInventory(inv, "Nickel", 50);
        Assert.Equal(150, inv.Materials[0].Count);
    }

    [Fact]
    public void UpdateInventory_ClampsToMax()
    {
        var inv = new MaterialInventory
        {
            Materials = new List<MaterialEntry>
            {
                new() { Name = "Nickel", Count = 2990, MaxCapacity = 3000 },
            }
        };
        Materials.UpdateInventory(inv, "Nickel", 100);
        Assert.Equal(3000, inv.Materials[0].Count);
    }

    [Fact]
    public void UpdateInventory_ClampsToZero()
    {
        var inv = new MaterialInventory
        {
            Materials = new List<MaterialEntry>
            {
                new() { Name = "Nickel", Count = 10, MaxCapacity = 3000 },
            }
        };
        Materials.UpdateInventory(inv, "Nickel", -20);
        Assert.Equal(0, inv.Materials[0].Count);
    }

    [Fact]
    public void CanCraftBlueprint_ReturnsTrueWhenSufficient()
    {
        var inv = new MaterialInventory
        {
            Materials = new List<MaterialEntry>
            {
                new() { Name = "Nickel", Count = 10, MaxCapacity = 3000 },
            }
        };
        var reqs = new List<BlueprintRequirement>
        {
            new() { MaterialName = "Nickel", Quantity = 5 },
        };
        var (canCraft, missing) = Materials.CanCraftBlueprint(inv, reqs);
        Assert.True(canCraft);
        Assert.Empty(missing);
    }

    [Fact]
    public void CanCraftBlueprint_ReturnsFalseWhenInsufficient()
    {
        var inv = new MaterialInventory
        {
            Materials = new List<MaterialEntry>
            {
                new() { Name = "Nickel", Count = 3, MaxCapacity = 3000 },
            }
        };
        var reqs = new List<BlueprintRequirement>
        {
            new() { MaterialName = "Nickel", Quantity = 5 },
        };
        var (canCraft, missing) = Materials.CanCraftBlueprint(inv, reqs);
        Assert.False(canCraft);
        Assert.Single(missing);
    }
}

public class EngineersTests
{
    [Fact]
    public void GetAll_Returns38Engineers()
    {
        var engineers = Engineers.GetAll();
        Assert.Equal(38, engineers.Count);
    }

    [Fact]
    public void Find_ReturnsEngineerByName()
    {
        var eng = Engineers.Find("Felicity Farseer");
        Assert.NotNull(eng);
        Assert.Equal("Felicity Farseer", eng!.Name);
    }

    [Fact]
    public void Find_ReturnsNullForUnknown()
    {
        Assert.Null(Engineers.Find("Unknown Engineer"));
    }

    [Fact]
    public void GetUnlockRequirements_ReturnsReqs()
    {
        var reqs = Engineers.GetUnlockRequirements("Felicity Farseer");
        Assert.NotEmpty(reqs);
        Assert.Contains("Meta-Alloys", reqs[1]);
    }

    [Fact]
    public void GetUnlockRequirements_ReturnsEmptyForUnknown()
    {
        Assert.Empty(Engineers.GetUnlockRequirements("Nobody"));
    }

    [Fact]
    public void GetByType_Ship_Returns25()
    {
        var ship = Engineers.GetByType("ship");
        Assert.Equal(25, ship.Length);
        Assert.Contains("Felicity Farseer", ship);
        Assert.Contains("The Sarge", ship);
        Assert.DoesNotContain("Domino Green", ship);
    }

    [Fact]
    public void GetByType_OnFoot_Returns13()
    {
        var foot = Engineers.GetByType("on-foot");
        Assert.Equal(13, foot.Length);
        Assert.Contains("Domino Green", foot);
        Assert.Contains("Yi Shen", foot);
        Assert.DoesNotContain("Felicity Farseer", foot);
    }

    [Fact]
    public void GetByType_Unknown_ReturnsEmpty()
    {
        Assert.Empty(Engineers.GetByType("flying"));
    }

    [Fact]
    public void EstimateProgress_ReturnsFields()
    {
        var (eng, grades, progress) = Engineers.EstimateProgress("Felicity Farseer", 3);
        Assert.Equal("Felicity Farseer", eng.Name);
        Assert.Equal(5, grades.Length);
        Assert.Equal("Grade 1", grades[0]);
        Assert.Equal("Grade 5", grades[4]);
        Assert.Equal(0.6, progress);
    }

    [Fact]
    public void EstimateProgress_UnknownEngineer_ReturnsPlaceholder()
    {
        var (eng, _, progress) = Engineers.EstimateProgress("Fake Engineer", 2);
        Assert.Equal("Fake Engineer", eng.Name);
        Assert.Equal(0, eng.Id);
        Assert.Equal(0.4, progress);
    }

    [Fact]
    public void EstimateProgress_MaxGrade_Returns1()
    {
        var (_, _, progress) = Engineers.EstimateProgress("Felicity Farseer", 5);
        Assert.Equal(1.0, progress);
    }

    [Fact]
    public void EstimateProgress_ZeroGrade_Returns0()
    {
        var (_, _, progress) = Engineers.EstimateProgress("Felicity Farseer", 0);
        Assert.Equal(0.0, progress);
    }
}

public class TradeTests
{
    [Fact]
    public void CalculateProfit_ComputesCorrectly()
    {
        var (perUnit, total) = Trade.CalculateProfit(100, 150, 50);
        Assert.Equal(50, perUnit);
        Assert.Equal(2500, total);
    }

    [Fact]
    public void RankByProfit_SortsDescending()
    {
        var routes = new List<TradeRoute>
        {
            new() { ProfitPerUnit = 50 },
            new() { ProfitPerUnit = 200 },
            new() { ProfitPerUnit = 100 },
        };
        var ranked = Trade.RankByProfit(routes);
        Assert.Equal(200, ranked[0].ProfitPerUnit);
        Assert.Equal(100, ranked[1].ProfitPerUnit);
        Assert.Equal(50, ranked[2].ProfitPerUnit);
    }

    [Fact]
    public void RankByProfit_RespectsTopN()
    {
        var routes = new List<TradeRoute>
        {
            new() { ProfitPerUnit = 50 },
            new() { ProfitPerUnit = 200 },
            new() { ProfitPerUnit = 100 },
        };
        var ranked = Trade.RankByProfit(routes, 2);
        Assert.Equal(2, ranked.Count);
    }
}

public class FleetCarrierTests
{
    [Theory]
    [InlineData(100, 10000, 23)]
    [InlineData(0, 10000, 5)]
    [InlineData(10, 50000, 9)]
    public void CalculateJumpFuelCost_ReturnsCorrect(double dist, double mass, int expected)
    {
        Assert.Equal(expected, FleetCarrier.CalculateJumpFuelCost(dist, mass));
    }

    [Fact]
    public void EstimateJumpTime_ReturnsFixedValues()
    {
        var (charge, duration, cooldown, total) = FleetCarrier.EstimateJumpTime();
        Assert.Equal(15, charge);
        Assert.Equal("< 1 minute", duration);
        Assert.Equal(5, cooldown);
        Assert.Equal(21, total);
    }

    [Fact]
    public void CalculateWeeklyMaintenance_BaseOnly()
    {
        Assert.Equal(5_000_000, FleetCarrier.CalculateWeeklyMaintenance(Array.Empty<string>()));
    }

    [Fact]
    public void CalculateWeeklyMaintenance_WithServices()
    {
        var cost = FleetCarrier.CalculateWeeklyMaintenance(new[] { "Repair", "Refuel" });
        Assert.Equal(8_000_000, cost);
    }

    [Fact]
    public void CanAffordMaintenance_Requires10PercentBuffer()
    {
        Assert.True(FleetCarrier.CanAffordMaintenance(11_000_000, 10_000_000));
        Assert.False(FleetCarrier.CanAffordMaintenance(10_500_000, 10_000_000));
    }
}

public class ThargoidTests
{
    [Fact]
    public void TitanNames_HasAll8()
    {
        Assert.Equal(8, ThargoidData.TitanNames.Length);
        Assert.Contains("Taranis", ThargoidData.TitanNames);
        Assert.Contains("Cocijo", ThargoidData.TitanNames);
    }

    [Fact]
    public void GetTitanByName_ReturnsTitan()
    {
        var t = ThargoidData.GetTitanByName("Taranis");
        Assert.NotNull(t);
        Assert.Equal("Taranis", t!.Name);
        Assert.Equal("defeated", t.State);
    }

    [Fact]
    public void GetTitanByName_ReturnsNull()
    {
        Assert.Null(ThargoidData.GetTitanByName("Fakename"));
    }

    [Fact]
    public void GetTitanBySystem_ReturnsTitan()
    {
        var t = ThargoidData.GetTitanBySystem("HIP 20567");
        Assert.NotNull(t);
        Assert.Equal("Indra", t!.Name);
    }

    [Fact]
    public void GetTitanBySystem_ReturnsNull()
    {
        Assert.Null(ThargoidData.GetTitanBySystem("Unknown System"));
    }

    [Fact]
    public void GetAllTitans_Returns8()
    {
        Assert.Equal(8, ThargoidData.GetAllTitans().Count);
    }

    [Fact]
    public void GetDefeatedTitans_AllDefeated()
    {
        var defeated = ThargoidData.GetDefeatedTitans();
        Assert.All(defeated, t => Assert.Equal("defeated", t.State));
    }

    [Theory]
    [InlineData("Alert", ThargoidWarState.Alert)]
    [InlineData("Invasion", ThargoidWarState.Invasion)]
    [InlineData("Controlled", ThargoidWarState.Controlled)]
    [InlineData("Recovery", ThargoidWarState.Recovery)]
    [InlineData("Maelstrom", ThargoidWarState.Maelstrom)]
    [InlineData("", ThargoidWarState.None)]
    public void ParseThargoidWarState_Works(string input, ThargoidWarState expected)
    {
        Assert.Equal(expected, ThargoidData.ParseThargoidWarState(input));
    }

    [Fact]
    public void ParseThargoidWarState_Null_ReturnsNone()
    {
        Assert.Equal(ThargoidWarState.None, ThargoidData.ParseThargoidWarState(null));
    }

    [Fact]
    public void GetWarStateName_ReturnsNames()
    {
        Assert.Equal("Alert", ThargoidData.GetWarStateName(ThargoidWarState.Alert));
        Assert.Equal("None", ThargoidData.GetWarStateName(ThargoidWarState.None));
    }
}

public class ColonizationTests
{
    [Fact]
    public void CreateConstructionSite_GeneratesId()
    {
        var site = Colonization.CreateConstructionSite(12345);
        Assert.StartsWith("col-", site.Id);
        Assert.Equal(12345L, site.MarketId);
    }

    [Fact]
    public void GetResourceShortfall_ComputesCorrectly()
    {
        var r = new ConstructionResource { RequiredAmount = 100, ProvidedAmount = 60 };
        Assert.Equal(40, Colonization.GetResourceShortfall(r));
    }

    [Fact]
    public void GetResourceShortfall_NoNegatives()
    {
        var r = new ConstructionResource { RequiredAmount = 50, ProvidedAmount = 80 };
        Assert.Equal(0, Colonization.GetResourceShortfall(r));
    }

    [Fact]
    public void GetTotalProgress_CalculatesRatio()
    {
        var site = new ConstructionSite
        {
            ResourcesRequired = new List<ConstructionResource>
            {
                new() { RequiredAmount = 100, ProvidedAmount = 25 },
                new() { RequiredAmount = 100, ProvidedAmount = 75 },
            }
        };
        Assert.Equal(0.5, Colonization.GetTotalProgress(site));
    }

    [Fact]
    public void GetTotalProgress_NoResources_UsesDirectProgress()
    {
        var site = new ConstructionSite { ConstructionProgress = 0.75 };
        Assert.Equal(0.75, Colonization.GetTotalProgress(site));
    }

    [Fact]
    public void ParseColonisationConstructionDepot_ExtractsFields()
    {
        var ev = new Dictionary<string, object>
        {
            ["MarketID"] = (long)999,
            ["ConstructionProgress"] = 0.5,
            ["ConstructionComplete"] = false,
            ["ConstructionFailed"] = false,
            ["ResourcesRequired"] = new List<object>
            {
                new Dictionary<string, object>
                {
                    ["Name"] = "CMM Composite",
                    ["Name_Localised"] = "CMM Composite",
                    ["RequiredAmount"] = 100,
                    ["ProvidedAmount"] = 20,
                    ["Payment"] = 50000,
                },
            },
        };
        var site = Colonization.ParseColonisationConstructionDepot(ev);
        Assert.Equal(999L, site.MarketId);
        Assert.Equal(0.5, site.ConstructionProgress);
        Assert.Single(site.ResourcesRequired);
        Assert.Equal("CMM Composite", site.ResourcesRequired[0].Name);
        Assert.Equal(20, site.ResourcesRequired[0].ProvidedAmount);
    }

    [Fact]
    public void ColonyStateNames_ReturnsCorrectNames()
    {
        Assert.Equal("None", ColonyStateNames.GetName(ColonyState.None));
        Assert.Equal("Active", ColonyStateNames.GetName(ColonyState.Active));
        Assert.Equal("Failed", ColonyStateNames.GetName(ColonyState.Failed));
    }
}

public class ExobiologyTests
{
    [Fact]
    public void FindGenus_Known_ReturnsGenus()
    {
        var genus = GenusData.FindGenus("bacterium");
        Assert.NotNull(genus);
        Assert.Equal("Bacterium", genus!.Name);
    }

    [Fact]
    public void FindGenus_Unknown_ReturnsNull()
    {
        Assert.Null(GenusData.FindGenus("Nonexistentus"));
    }

    [Fact]
    public void FindSpecies_Known_ReturnsSpecies()
    {
        var species = GenusData.FindSpecies("stRatum", "stratum tectonicas");
        Assert.NotNull(species);
        Assert.Equal("Stratum Tectonicas", species!.Name);
        Assert.Equal(19010800, species.Value);
    }

    [Fact]
    public void FindSpecies_Unknown_ReturnsNull()
    {
        Assert.Null(GenusData.FindSpecies("Bacterium", "Fakeus Species"));
    }

    [Fact]
    public void CalculateScanValue_KnownSpecies_ReturnsValue()
    {
        var val = GenusData.CalculateScanValue("Stratum Tectonicas", false);
        Assert.Equal(19010800, val);
    }

    [Fact]
    public void CalculateScanValue_WithFirstDiscovery_Adds4xBonus()
    {
        var val = GenusData.CalculateScanValue("Stratum Tectonicas", true);
        Assert.Equal(95054000, val);
    }

    [Fact]
    public void CalculateScanValue_UnknownSpecies_ReturnsZero()
    {
        Assert.Equal(0, GenusData.CalculateScanValue("Fakeus Species", false));
    }

    [Fact]
    public void GetSpeciesForGenus_ReturnsAllSpecies()
    {
        var species = GenusData.GetSpeciesForGenus("Bacterium");
        Assert.Equal(13, species.Length);
        Assert.Contains("Bacterium Aurasus", species);
        Assert.Contains("Bacterium Volu", species);
    }

    [Fact]
    public void GetSpeciesValue_ReturnsCorrectValue()
    {
        var val = GenusData.GetSpeciesValue("Aleoida", "Aleoida Arcus");
        Assert.Equal(7252500, val);
    }

    [Fact]
    public void GetAllGenus_ReturnsAllGenera()
    {
        var all = GenusData.GetAll();
        Assert.Equal(19, all.Count);
    }
}

public class BgsTests
{
    [Fact]
    public void GetStateDescription_KnownState_ReturnsDescription()
    {
        var desc = Bgs.GetStateDescription("Boom");
        Assert.NotEmpty(desc);
        Assert.Contains("economic", desc, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void GetStateDescription_UnknownState_ReturnsInput()
    {
        Assert.Equal("SomeUnknownState", Bgs.GetStateDescription("SomeUnknownState"));
    }

    [Fact]
    public void IsPositiveState_ReturnsTrueForBoom()
    {
        Assert.True(Bgs.IsPositiveState("Boom"));
    }

    [Fact]
    public void IsPositiveState_ReturnsFalseForBust()
    {
        Assert.False(Bgs.IsPositiveState("Bust"));
    }

    [Fact]
    public void IsNegativeState_ReturnsTrueForBust()
    {
        Assert.True(Bgs.IsNegativeState("Bust"));
    }

    [Fact]
    public void IsNegativeState_ReturnsFalseForBoom()
    {
        Assert.False(Bgs.IsNegativeState("Boom"));
    }

    [Fact]
    public void PredictConflictWinner_HigherInfluenceWins()
    {
        var conflict = new Conflict
        {
            Faction1 = "Faction A",
            Faction2 = "Faction B",
        };
        var factions = new List<FactionPresence>
        {
            new() { Name = "Faction A", Influence = 0.6 },
            new() { Name = "Faction B", Influence = 0.4 },
        };
        Assert.Equal("Faction A", Bgs.PredictConflictWinner(conflict, factions));
    }

    [Fact]
    public void PredictConflictWinner_EqualInfluence_ReturnsNull()
    {
        var conflict = new Conflict
        {
            Faction1 = "Faction A",
            Faction2 = "Faction B",
        };
        var factions = new List<FactionPresence>
        {
            new() { Name = "Faction A", Influence = 0.5 },
            new() { Name = "Faction B", Influence = 0.5 },
        };
        Assert.Null(Bgs.PredictConflictWinner(conflict, factions));
    }

    [Fact]
    public void PredictConflictWinner_MissingFaction_ReturnsNull()
    {
        var conflict = new Conflict
        {
            Faction1 = "Faction A",
            Faction2 = "Faction B",
        };
        var factions = new List<FactionPresence>
        {
            new() { Name = "Faction A", Influence = 0.6 },
        };
        Assert.Null(Bgs.PredictConflictWinner(conflict, factions));
    }

    [Fact]
    public void BgsStates_ConstantsMatchExpectedValues()
    {
        Assert.Equal("None", BgsStates.None);
        Assert.Equal("Boom", BgsStates.Boom);
        Assert.Equal("Bust", BgsStates.Bust);
        Assert.Equal("War", BgsStates.War);
        Assert.Equal("Colonisation", BgsStates.Colonisation);
    }
}

public class CompareTests
{
    [Fact]
    public void CompareShips_WithTwoShips_ReturnsRows()
    {
        var ship1Json = @"{
  ""id"": ""ship_a"",
  ""properties"": {
    ""name"": ""Ship A"",
    ""manufacturer"": ""Maker A"",
    ""hullMass"": 100,
    ""baseArmour"": 200,
    ""baseShieldStrength"": 150,
    ""speed"": 250,
    ""boost"": 350,
    ""pitch"": 40,
    ""roll"": 100,
    ""yaw"": 20,
    ""hardness"": 50,
    ""masslock"": 12,
    ""heatCapacity"": 300,
    ""reserveFuelCapacity"": 0.6,
    ""crew"": 2,
    ""hullCost"": 100000
  },
  ""slots"": {
    ""standard"": [1, 2, 3],
    ""hardpoints"": [2, 1],
    ""internal"": [3, 2, 1]
  }
}";
        var ship2Json = @"{
  ""id"": ""ship_b"",
  ""properties"": {
    ""name"": ""Ship B"",
    ""manufacturer"": ""Maker B"",
    ""hullMass"": 200,
    ""baseArmour"": 300,
    ""baseShieldStrength"": 250,
    ""speed"": 200,
    ""boost"": 280,
    ""pitch"": 30,
    ""roll"": 80,
    ""yaw"": 15,
    ""hardness"": 60,
    ""masslock"": 15,
    ""heatCapacity"": 400,
    ""reserveFuelCapacity"": 0.8,
    ""crew"": 3,
    ""hullCost"": 500000
  },
  ""slots"": {
    ""standard"": [4, 3, 2, 1],
    ""hardpoints"": [3, 2, 1],
    ""internal"": [5, 4, 3, 2]
  }
}";

        var ship1 = JsonSerializer.Deserialize<JsonElement>(ship1Json);
        var ship2 = JsonSerializer.Deserialize<JsonElement>(ship2Json);
        var ships = new List<JsonElement> { ship1, ship2 };

        var rows = Compare.CompareShips(ships);

        var nameRow = rows.Find(r => r.Stat == "Name");
        Assert.NotNull(nameRow);
        Assert.Equal("Ship A", nameRow!.Values[0]?.ToString());
        Assert.Equal("Ship B", nameRow!.Values[1]?.ToString());

        var speedRow = rows.Find(r => r.Stat == "Speed (m/s)");
        Assert.NotNull(speedRow);
        Assert.Equal("250", speedRow!.Values[0]?.ToString());
        Assert.Equal("200", speedRow!.Values[1]?.ToString());

        var slotsRow = rows.Find(r => r.Stat == "Total Standard Slots");
        Assert.NotNull(slotsRow);
        Assert.Equal(3, Convert.ToInt32(slotsRow!.Values[0]));
        Assert.Equal(4, Convert.ToInt32(slotsRow!.Values[1]));

        var hardpointsRow = rows.Find(r => r.Stat == "Total Hardpoints");
        Assert.NotNull(hardpointsRow);
        Assert.Equal(2, Convert.ToInt32(hardpointsRow!.Values[0]));
        Assert.Equal(3, Convert.ToInt32(hardpointsRow!.Values[1]));

        var internalRow = rows.Find(r => r.Stat == "Total Internal Slots");
        Assert.NotNull(internalRow);
        Assert.Equal(3, Convert.ToInt32(internalRow!.Values[0]));
        Assert.Equal(4, Convert.ToInt32(internalRow!.Values[1]));
    }

    [Fact]
    public void FormatComparisonTable_ReturnsFormattedOutput()
    {
        var rows = new List<ShipComparisonRow>
        {
            new() { Stat = "Name", Values = new List<object?> { "Ship A", "Ship B" } },
            new() { Stat = "Speed (m/s)", Values = new List<object?> { 250L, 200L } },
            new() { Stat = "Total Hardpoints", Values = new List<object?> { 2, 3 } },
            new() { Stat = "Crew", Values = new List<object?> { 2, null } },
        };
        var shipNames = new List<string> { "Ship A", "Ship B" };

        var table = Compare.FormatComparisonTable(rows, shipNames);

        var lines = table.Split('\n');
        Assert.Equal(6, lines.Length);
        Assert.Contains("Stat | Ship A | Ship B", lines[0]);
        Assert.Contains("--- | --- | ---", lines[1]);
        Assert.Contains("Name | Ship A | Ship B", lines[2]);
        Assert.Contains("Speed (m/s) | 250 | 200", lines[3]);
        Assert.Contains("Total Hardpoints | 2 | 3", lines[4]);
        Assert.Contains("Crew | 2 | N/A", lines[5]);
    }

    [Fact]
    public void CompareShips_WithSingleShip_ReturnsCorrectRowCount()
    {
        var json = @"{
  ""id"": ""test"",
  ""properties"": {
    ""name"": ""Test Ship"",
    ""manufacturer"": ""Test"",
    ""hullMass"": 50,
    ""baseArmour"": 80,
    ""baseShieldStrength"": 60,
    ""speed"": 200,
    ""boost"": 300,
    ""pitch"": 35.5,
    ""roll"": 95,
    ""yaw"": 12,
    ""hardness"": 30,
    ""masslock"": 8,
    ""heatCapacity"": 150,
    ""reserveFuelCapacity"": 0.4,
    ""crew"": 1,
    ""hullCost"": 20000
  },
  ""slots"": {
    ""standard"": [2, 2],
    ""hardpoints"": [1, 1],
    ""internal"": [2, 1]
  }
}";
        var ship = JsonSerializer.Deserialize<JsonElement>(json);
        var rows = Compare.CompareShips(new List<JsonElement> { ship });

        Assert.Equal(19, rows.Count);

        Assert.Equal("Test Ship", rows[0].Values[0]?.ToString());
        Assert.Equal("Test", rows[1].Values[0]?.ToString());
        Assert.Equal(50, Convert.ToInt64(rows[2].Values[0]));
        Assert.Equal(35.5, Convert.ToDouble(rows[7].Values[0]));
        Assert.Equal(0.4, Convert.ToDouble(rows[13].Values[0]));
    }

    [Fact]
    public void CompareShips_MissingProperties_ReturnsNullValues()
    {
        var json = @"{
  ""id"": ""minimal""
}";
        var ship = JsonSerializer.Deserialize<JsonElement>(json);
        var rows = Compare.CompareShips(new List<JsonElement> { ship });

        Assert.Equal(19, rows.Count);

        foreach (var row in rows)
        {
            Assert.Null(row.Values[0]);
        }
    }

    public class EngineeringPlannerTests
    {
        static EngineeringPlannerTests()
        {
            var dataPath = EliteDangerousSdk.Data.DataProvider.ResolveDataPath();
            EliteDangerousSdk.Data.DataProvider.Initialize(dataPath);
        }

        [Fact]
        public void PlanEngineering_Empty_ReturnsEmptyPlan()
        {
            var plan = EngineeringPlanner.PlanEngineering(new List<PlannedModification>());
            Assert.Empty(plan.Materials);
            Assert.Empty(plan.MaterialTotal);
            Assert.Empty(plan.Engineers);
            Assert.Empty(plan.EngineerVisits);
        }

        [Fact]
        public void PlanEngineering_FSD_G5_Lookup()
        {
            var plan = EngineeringPlanner.PlanEngineering(new List<PlannedModification>
            {
                new() { ModuleGroup = "fsd", BlueprintName = "FSD_LongRange", Grade = 5 },
            });

            Assert.Contains(plan.MaterialTotal, kv => kv.Key == "Arsenic" && kv.Value > 0);
            Assert.Contains(plan.MaterialTotal, kv => kv.Key == "Chemical Manipulators" && kv.Value > 0);
            Assert.Contains(plan.Engineers, e => e == "Felicity Farseer");
            Assert.Contains(plan.Engineers, e => e == "Elvira Martuuk");
        }

        [Fact]
        public void PlanEngineering_WithExperimental()
        {
            var plan = EngineeringPlanner.PlanEngineering(new List<PlannedModification>
            {
                new()
                {
                    ModuleGroup = "fsd", BlueprintName = "FSD_LongRange", Grade = 5,
                    ExperimentalEffect = "special_fsd_heavy",
                },
            });

            var expMats = plan.Materials.Where(m => m.Source == "experimental").ToList();
            Assert.NotEmpty(expMats);
            Assert.Contains(plan.MaterialTotal, kv => kv.Key == "Atypical Disrupted Wake Echoes" && kv.Value > 0);
        }

        [Fact]
        public void PlanEngineering_UnknownGroup_ReturnsEmptyEngineers()
        {
            var plan = EngineeringPlanner.PlanEngineering(new List<PlannedModification>
            {
                new() { ModuleGroup = "nonexistent", BlueprintName = "FSD_LongRange", Grade = 5 },
            });

            Assert.Empty(plan.Engineers);
        }

        [Fact]
        public void GetBlueprintComponents_Known_ReturnsComponents()
        {
            var comps = EngineeringPlanner.GetBlueprintComponents("FSD_LongRange", 5);
            Assert.NotEmpty(comps);
            foreach (var c in comps)
            {
                Assert.Equal("blueprint", c.Source);
                Assert.Equal(5, c.Grade);
                Assert.NotNull(c.Material);
                Assert.True(c.Quantity > 0);
            }
        }

        [Fact]
        public void GetBlueprintComponents_Unknown_ReturnsEmpty()
        {
            var comps = EngineeringPlanner.GetBlueprintComponents("Nonexistent_BP", 1);
            Assert.Empty(comps);
        }

        [Fact]
        public void GetExperimentalEffectComponents_Known_ReturnsComponents()
        {
            var comps = EngineeringPlanner.GetExperimentalEffectComponents("special_fsd_heavy");
            Assert.NotEmpty(comps);
        }

        [Fact]
        public void GetExperimentalEffectComponents_Unknown_ReturnsEmpty()
        {
            var comps = EngineeringPlanner.GetExperimentalEffectComponents("special_nonexistent");
            Assert.Empty(comps);
        }

        [Fact]
        public void GetEngineersForBlueprint_Known_ReturnsEngineers()
        {
            var engs = EngineeringPlanner.GetEngineersForBlueprint("fsd", "FSD_LongRange", 5);
            Assert.Contains("Felicity Farseer", engs);
            Assert.Contains("Elvira Martuuk", engs);
        }

        [Fact]
        public void GetEngineersForBlueprint_Unknown_ReturnsEmpty()
        {
            var engs = EngineeringPlanner.GetEngineersForBlueprint("nonexistent", "FSD_LongRange", 5);
            Assert.Empty(engs);
        }
    }
}
