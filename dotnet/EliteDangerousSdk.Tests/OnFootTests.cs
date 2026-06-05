using Xunit;
using EliteDangerousSdk.Data;
using EliteDangerousSdk.Stats;

namespace EliteDangerousSdk.Tests;

public class OnFootDataTests
{
    [Fact]
    public void SuitBaseStats_HasAllThreeTypes()
    {
        Assert.Equal(3, OnFootEngineeringData.SuitBaseStats.Count);
        Assert.True(OnFootEngineeringData.SuitBaseStats.ContainsKey("dominator"));
        Assert.True(OnFootEngineeringData.SuitBaseStats.ContainsKey("maverick"));
        Assert.True(OnFootEngineeringData.SuitBaseStats.ContainsKey("artemis"));
    }

    [Fact]
    public void SuitBaseStats_DominatorShield()
    {
        Assert.Equal(15.0, OnFootEngineeringData.SuitBaseStats["dominator"].Shield);
    }

    [Fact]
    public void SuitBaseStats_MaverickGoodsCapacity()
    {
        Assert.Equal(40, OnFootEngineeringData.SuitBaseStats["maverick"].GoodsCapacity);
    }

    [Fact]
    public void SuitBaseStats_ArtemisBattery()
    {
        Assert.Equal(17, OnFootEngineeringData.SuitBaseStats["artemis"].Battery);
    }

    [Fact]
    public void WeaponBaseStats_Has11Weapons()
    {
        Assert.Equal(11, OnFootEngineeringData.WeaponBaseStats.Count);
    }

    [Fact]
    public void WeaponBaseStats_KarmaL6()
    {
        var l6 = OnFootEngineeringData.WeaponBaseStats["Karma L-6"];
        Assert.Equal(44.4, l6.Dps);
        Assert.Equal(2, l6.MagazineSize);
        Assert.Equal(300, l6.EffectiveRange);
    }

    [Fact]
    public void WeaponBaseStats_ExecutionerHeadshot()
    {
        var exec = OnFootEngineeringData.WeaponBaseStats["Manticore Executioner"];
        Assert.Equal(3.0, exec.HeadshotMultiplier);
    }

    [Fact]
    public void SuitUpgradeCosts_HasAllSuits()
    {
        Assert.Equal(3, OnFootEngineeringData.SuitUpgradeCosts.Count);
    }

    [Fact]
    public void SuitUpgradeCosts_DominatorG5()
    {
        var g5 = OnFootEngineeringData.SuitUpgradeCosts["dominator"]["g5"];
        Assert.Equal(35, g5["Titanium Plating"]);
        Assert.Equal(15, g5["Suit Schematic"]);
    }

    [Fact]
    public void WeaponUpgradeCosts_HasThreeManufacturers()
    {
        Assert.Equal(3, OnFootEngineeringData.WeaponUpgradeCosts.Count);
    }

    [Fact]
    public void WeaponUpgradeCosts_KinematicG5()
    {
        var g5 = OnFootEngineeringData.WeaponUpgradeCosts["kinematic"]["g5"];
        Assert.Equal(12, g5["Tungsten Carbide"]);
        Assert.Equal(5, g5["Weapon Schematic"]);
    }

    [Fact]
    public void Modifications_Has25()
    {
        Assert.Equal(25, OnFootEngineeringData.Modifications.Count);
    }

    [Fact]
    public void Modifications_Has14Suit()
    {
        var suitMods = OnFootEngineeringData.Modifications.Values.Where(m => m.Type == "suit").ToList();
        Assert.Equal(14, suitMods.Count);
    }

    [Fact]
    public void Modifications_Has11Weapon()
    {
        var weaponMods = OnFootEngineeringData.Modifications.Values.Where(m => m.Type == "weapon").ToList();
        Assert.Equal(11, weaponMods.Count);
    }

    [Fact]
    public void Modifications_EachHasEngineers()
    {
        foreach (var (name, mod) in OnFootEngineeringData.Modifications)
            Assert.True(mod.Engineers.Count >= 1, $"{name} has no engineers");
    }

    [Fact]
    public void Modifications_NightVision()
    {
        var nv = OnFootEngineeringData.Modifications["Night Vision"];
        Assert.Contains("Oden Geiger", nv.Engineers);
        Assert.Contains("Yi Shen", nv.Engineers);
    }

    [Fact]
    public void GetUpgradeCost_Suit()
    {
        var costs = OnFootEngineeringData.GetUpgradeCost("dominator", 1);
        Assert.Equal(1, costs["Suit Schematic"]);
    }

    [Fact]
    public void GetUpgradeCost_Weapon()
    {
        var costs = OnFootEngineeringData.GetUpgradeCost("Karma C-44", 4);
        Assert.Equal(5, costs["Weapon Schematic"]);
    }

    [Fact]
    public void GetAvailableModifications_Suit()
    {
        var mods = OnFootEngineeringData.GetAvailableModifications("suit", "dominator");
        Assert.True(mods.Count > 10);
    }

    [Fact]
    public void GetAvailableModifications_ExcludesWeapon()
    {
        var mods = OnFootEngineeringData.GetAvailableModifications("suit");
        Assert.All(mods, m => Assert.Equal("suit", m.Type));
    }
}

public class OnFootStatsTests
{
    [Fact]
    public void CalculateSuitStats_NoMods()
    {
        var stats = OnFootStats.CalculateSuitStats("dominator", new());
        Assert.Equal(15.0, stats.Shield);
        Assert.Equal(1, stats.SprintDuration);
    }

    [Fact]
    public void CalculateSuitStats_NightVision()
    {
        var stats = OnFootStats.CalculateSuitStats("dominator", new() { "Night Vision" });
        Assert.True(stats.NightVision);
    }

    [Fact]
    public void CalculateSuitStats_ImprovedBattery()
    {
        var stats = OnFootStats.CalculateSuitStats("artemis", new() { "Improved Battery Capacity" });
        Assert.Equal(17 * 1.5, stats.Battery);
    }

    [Fact]
    public void CalculateSuitStats_DamageResistance()
    {
        var stats = OnFootStats.CalculateSuitStats("dominator", new() { "Damage Resistance" });
        var baseThermal = OnFootEngineeringData.SuitBaseStats["dominator"].Resistance["thermal"];
        var expected = 1 - (1 - baseThermal) * (1 - 0.1);
        Assert.Equal(expected, stats.Resistance["thermal"], 5);
    }

    [Fact]
    public void CalculateWeaponStats_UnknownReturnsNull()
    {
        Assert.Null(OnFootStats.CalculateWeaponStats("Unknown", 1, new()));
    }

    [Fact]
    public void CalculateWeaponStats_Grade1()
    {
        var stats = OnFootStats.CalculateWeaponStats("Karma C-44", 1, new());
        Assert.NotNull(stats);
        Assert.Equal(8.0, stats.Dps, 1);
    }

    [Fact]
    public void CalculateWeaponStats_DpsIncreasesWithGrade()
    {
        var g1 = OnFootStats.CalculateWeaponStats("Karma C-44", 1, new())!;
        var g5 = OnFootStats.CalculateWeaponStats("Karma C-44", 5, new())!;
        Assert.True(g5.Dps > g1.Dps);
    }

    [Fact]
    public void CalculateWeaponStats_MagazineSizeMod()
    {
        var stats = OnFootStats.CalculateWeaponStats("Karma C-44", 1, new() { "Magazine Size" })!;
        Assert.Equal(90, stats.MagazineSize);
    }

    [Fact]
    public void CalculateWeaponStats_GreaterRangeMod()
    {
        var stats = OnFootStats.CalculateWeaponStats("Karma C-44", 1, new() { "Greater Range" })!;
        Assert.Equal(25 * 1.5, stats.EffectiveRange);
    }

    [Fact]
    public void CalculateEffectiveDps()
    {
        var stats = OnFootStats.CalculateWeaponStats("Karma C-44", 1, new())!;
        var dps = OnFootStats.CalculateEffectiveDps(stats, 1.0, 0.0);
        Assert.Equal(stats.Dps, dps, 0.01);
    }
}

public class OnFootPlannerTests
{
    [Fact]
    public void Plan_SuitUpgrade()
    {
        var plan = OnFootEngineeringData.PlanOnFootEngineering(new()
        {
            new() { Type = "suit", Name = "dominator", CurrentGrade = 1, TargetGrade = 5, Modifications = new() }
        });
        Assert.Equal(31, plan.MaterialTotal["Suit Schematic"]);
        Assert.Equal(31, plan.MaterialTotal["Manufacturing Instructions"]);
        Assert.Equal(80, plan.MaterialTotal["Titanium Plating"]);
    }

    [Fact]
    public void Plan_WeaponUpgrade()
    {
        var plan = OnFootEngineeringData.PlanOnFootEngineering(new()
        {
            new() { Type = "weapon", Name = "Karma C-44", CurrentGrade = 1, TargetGrade = 5, Modifications = new() }
        });
        Assert.Equal(12, plan.MaterialTotal["Weapon Schematic"]);
        Assert.Equal(12, plan.MaterialTotal["Compression-Liquefied Gas"]);
    }

    [Fact]
    public void Plan_Modifications()
    {
        var plan = OnFootEngineeringData.PlanOnFootEngineering(new()
        {
            new() { Type = "suit", Name = "dominator", CurrentGrade = 5, TargetGrade = 5, Modifications = new() { "Night Vision", "Faster Shield Regen" } }
        });
        Assert.Equal(1_750_000, plan.TotalCredits);
        Assert.Contains("Oden Geiger", plan.Engineers);
        Assert.Contains("Kit Fowler", plan.Engineers);
    }

    [Fact]
    public void Plan_Combined()
    {
        var plan = OnFootEngineeringData.PlanOnFootEngineering(new()
        {
            new() { Type = "suit", Name = "dominator", CurrentGrade = 1, TargetGrade = 5, Modifications = new() { "Night Vision" } }
        });
        Assert.True(plan.Materials.Count > 0);
        Assert.Contains("Oden Geiger", plan.Engineers);
    }
}
