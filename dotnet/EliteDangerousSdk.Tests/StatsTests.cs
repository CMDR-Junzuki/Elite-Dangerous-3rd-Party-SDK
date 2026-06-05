using System.Reflection;
using System.Text.Json;
using Xunit;
using EliteDangerousSdk.Stats;

namespace EliteDangerousSdk.Tests;

public class EngineeringTests
{
    private static readonly Dictionary<string, object?> _savedModStats;

    static EngineeringTests()
    {
        var field = typeof(Engineering).GetField("_modStats", BindingFlags.NonPublic | BindingFlags.Static)!;
        var dict = (Dictionary<string, EliteDangerousSdk.Stats.StatMod>)field.GetValue(null)!;
        _savedModStats = new Dictionary<string, object?>();
        dict["damage"] = new EliteDangerousSdk.Stats.StatMod { Id = 1, Name = "Damage", Method = "multiplicative" };
        dict["thermload"] = new EliteDangerousSdk.Stats.StatMod { Id = 2, Name = "Thermal Load", Method = "additive", HigherBetter = false };
        dict["rof"] = new EliteDangerousSdk.Stats.StatMod { Id = 3, Name = "Rate of Fire", Method = "multiplicative" };
        dict["shieldboost"] = new EliteDangerousSdk.Stats.StatMod { Id = 4, Name = "Shield Boost", Method = "multiplicative" };
        dict["hullboost"] = new EliteDangerousSdk.Stats.StatMod { Id = 5, Name = "Hull Boost", Method = "multiplicative" };
        dict["maxmass"] = new EliteDangerousSdk.Stats.StatMod { Id = 6, Name = "Maximum Mass", Method = "overwrite" };
    }

    [Fact]
    public void ApplyBlueprintGrade_Multiplicative_Works()
    {
        var baseStats = new Dictionary<string, double> { ["damage"] = 10 };
        var features = new Dictionary<string, (double min, double max)>
        {
            ["damage"] = (0.5, 1.0),
        };
        var result = Engineering.ApplyBlueprintGrade(baseStats, features, 5, null, 1);
        Assert.Equal(20, result["damage"], 1); // 10 * (1 + 1.0)
    }

    [Fact]
    public void ApplyBlueprintGrade_Additive_Works()
    {
        var baseStats = new Dictionary<string, double> { ["thermload"] = 10 };
        var features = new Dictionary<string, (double min, double max)>
        {
            ["thermload"] = (-0.2, -0.5),
        };
        var result = Engineering.ApplyBlueprintGrade(baseStats, features, 5, null, 1);
        Assert.Equal(9.5, result["thermload"], 1);
    }

    [Fact]
    public void ApplyBlueprintGrade_RofConversion_Works()
    {
        var baseStats = new Dictionary<string, double> { ["rof"] = 2.0 };
        var features = new Dictionary<string, (double min, double max)>
        {
            ["rof"] = (0.2, 0.4),
        };
        var result = Engineering.ApplyBlueprintGrade(baseStats, features, 5, null, 1);
        Assert.Equal(1.4286, result["rof"], 3);
    }

    [Fact]
    public void ApplyBlueprintGrade_ShieldboostCompound_Works()
    {
        var baseStats = new Dictionary<string, double> { ["shieldboost"] = 0.1 };
        var features = new Dictionary<string, (double min, double max)>
        {
            ["shieldboost"] = (0.2, 0.4),
        };
        var result = Engineering.ApplyBlueprintGrade(baseStats, features, 5, null, 1);
        Assert.Equal(0.54, result["shieldboost"], 3);
    }

    [Fact]
    public void ApplyBlueprintGrade_HullboostCompound_Works()
    {
        var baseStats = new Dictionary<string, double> { ["hullboost"] = 0 };
        var features = new Dictionary<string, (double min, double max)>
        {
            ["hullboost"] = (0.5, 0.8),
        };
        var result = Engineering.ApplyBlueprintGrade(baseStats, features, 5, null, 1);
        Assert.Equal(0.8, result["hullboost"], 3);
    }

    [Fact]
    public void ApplyBlueprintGrade_Overwrite_Works()
    {
        var baseStats = new Dictionary<string, double> { ["maxmass"] = 100 };
        var features = new Dictionary<string, (double min, double max)>
        {
            ["maxmass"] = (50, 80),
        };
        var result = Engineering.ApplyBlueprintGrade(baseStats, features, 5, null, 1);
        Assert.Equal(80, result["maxmass"]);
    }

    [Fact]
    public void ApplyBlueprintGrade_SpecialFeaturesMerge_Works()
    {
        var baseStats = new Dictionary<string, double> { ["damage"] = 10, ["thermload"] = 5 };
        var features = new Dictionary<string, (double min, double max)>
        {
            ["damage"] = (0.5, 1.0),
        };
        var specials = new Dictionary<string, (double min, double max)>
        {
            ["thermload"] = (0.1, 0.2),
        };
        var result = Engineering.ApplyBlueprintGrade(baseStats, features, 5, specials, 1);
        Assert.Equal(20, result["damage"], 1);
        Assert.Equal(5.2, result["thermload"], 1);
    }

    [Fact]
    public void ApplyBlueprintGrade_RollQuality_UsesMidForGrade3()
    {
        var baseStats = new Dictionary<string, double> { ["damage"] = 10 };
        var features = new Dictionary<string, (double min, double max)>
        {
            ["damage"] = (0.5, 1.0),
        };
        var result = Engineering.ApplyBlueprintGrade(baseStats, features, 3, null, null);
        Assert.Equal(17.5, result["damage"], 1);
    }
}

public class LoadoutTests
{
    private static JsonElement Json(string json) => JsonDocument.Parse(json).RootElement;

    [Fact]
    public void CalculateTotalMass_IncludesAllComponents()
    {
        var ship = Json(@"{""properties"":{""hullMass"":50}}");
        var bulkhead = Json(@"{""mass"":10}");
        var loadout = new Loadout
        {
            Ship = ship,
            Bulkhead = bulkhead,
            StandardModules = new List<EquippedModule?>(),
            HardpointModules = new List<EquippedModule?>(),
            InternalModules = new List<EquippedModule?>(),
            Cargo = 5,
            Fuel = 3,
        };
        Assert.Equal(68, loadout.CalculateTotalMass());
    }

    [Fact]
    public void CalculateTotalMass_IncludesModuleMasses()
    {
        var ship = Json(@"{""properties"":{""hullMass"":50}}");
        var bulkhead = Json(@"{""mass"":10}");
        var loadout = new Loadout
        {
            Ship = ship,
            Bulkhead = bulkhead,
            StandardModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""mass"":5,""grp"":""pp""}") },
            },
            HardpointModules = new List<EquippedModule?>(),
            InternalModules = new List<EquippedModule?>(),
        };
        Assert.Equal(65, loadout.CalculateTotalMass());
    }
}

public class JumpRangeTests
{
    private static JsonElement Json(string json) => JsonDocument.Parse(json).RootElement;

    private static Loadout MakeLoadout()
    {
        var ship = Json(@"{""properties"":{""hullMass"":50,""reserveFuelCapacity"":1}}");
        var bulkhead = Json(@"{""mass"":10}");
        var fsd = Json(@"{""grp"":""fsd"",""mass"":5,""maxfuel"":5,""fuelmul"":100,""fuelpower"":2,""optmass"":1000}");
        return new Loadout
        {
            Ship = ship,
            Bulkhead = bulkhead,
            StandardModules = new List<EquippedModule?>
            {
                new() { Module = fsd },
            },
            HardpointModules = new List<EquippedModule?>(),
            InternalModules = new List<EquippedModule?>(),
            Fuel = 5,
            FuelCapacity = 5,
        };
    }

    [Fact]
    public void Calculate_ReturnsResult()
    {
        var result = JumpRange.Calculate(MakeLoadout());
        Assert.NotNull(result);
        Assert.True(result!.Current > 0);
        Assert.True(result.Max > 0);
    }

    [Fact]
    public void Calculate_NoFsd_ReturnsNull()
    {
        var loadout = new Loadout
        {
            Ship = Json(@"{""properties"":{""hullMass"":50}}"),
            Bulkhead = Json(@"{""mass"":10}"),
        };
        Assert.Null(JumpRange.Calculate(loadout));
    }

    [Fact]
    public void Calculate_GuardianBoostAddsDirectly()
    {
        var loadout = MakeLoadout();
        loadout.InternalModules = new List<EquippedModule?>
        {
            new() { Module = Json(@"{""grp"":""gfsb"",""jumpboost"":10}") },
        };
        var nongf = JumpRange.Calculate(MakeLoadout())!;
        var withgf = JumpRange.Calculate(loadout)!;
        Assert.Equal(nongf.Current + 10, withgf.Current, 1);
    }
}

public class ShieldTests
{
    private static JsonElement Json(string json) => JsonDocument.Parse(json).RootElement;

    [Fact]
    public void Calculate_NoShieldGen_ReturnsBaseValues()
    {
        var ship = Json(@"{""properties"":{""baseShieldStrength"":100,""hullMass"":50}}");
        var loadout = new Loadout
        {
            Ship = ship,
            Bulkhead = Json(@"{""mass"":10}"),
        };
        var result = Shield.Calculate(loadout);
        Assert.Equal(0, result.GeneratorStrength);
        Assert.Equal(0, result.ShieldBoosters);
    }

    [Fact]
    public void Calculate_WithShieldGen_ComputesStrength()
    {
        var ship = Json(@"{""properties"":{""baseShieldStrength"":100,""hullMass"":50}}");
        var loadout = new Loadout
        {
            Ship = ship,
            Bulkhead = Json(@"{""mass"":10}"),
            InternalModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""grp"":""sg"",""minmass"":0,""optmass"":100,""maxmass"":500,""minmul"":0.5,""optmul"":1.5,""maxmul"":2.5}") },
            },
        };
        var result = Shield.Calculate(loadout);
        Assert.True(result.GeneratorStrength > 0);
    }

    [Fact]
    public void Calculate_WithShieldBoosters_ComputesStrength()
    {
        var ship = Json(@"{""properties"":{""baseShieldStrength"":100,""hullMass"":50}}");
        var loadout = new Loadout
        {
            Ship = ship,
            Bulkhead = Json(@"{""mass"":10}"),
            InternalModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""grp"":""sg"",""minmass"":0,""optmass"":100,""maxmass"":500,""minmul"":0.5,""optmul"":1.5,""maxmul"":2.5}") },
            },
            HardpointModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""grp"":""sb"",""shieldboost"":0.2,""kinres"":0,""thermres"":0,""explres"":0}") },
            },
        };
        var result = Shield.Calculate(loadout);
        Assert.Equal(1, result.ShieldBoosters);
        Assert.True(result.BoostersStrength > 0);
    }

    [Fact]
    public void Calculate_GuardianShieldReinforcement_Adds()
    {
        var ship = Json(@"{""properties"":{""baseShieldStrength"":100,""hullMass"":50}}");
        var loadout = new Loadout
        {
            Ship = ship,
            Bulkhead = Json(@"{""mass"":10}"),
            InternalModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""grp"":""gsrp"",""shieldaddition"":50}") },
            },
        };
        var result = Shield.Calculate(loadout);
        Assert.Equal(50, result.ShieldAddition);
    }
}

public class DistributorTests
{
    private static JsonElement Json(string json) => JsonDocument.Parse(json).RootElement;

    [Fact]
    public void Calculate_NoDistributor_ReturnsEmpty()
    {
        var result = Distributor.Calculate(new Loadout());
        Assert.Equal(0, result.SystemsCapacity);
    }

    [Fact]
    public void Calculate_WithDistributor_ReturnsStats()
    {
        var loadout = new Loadout
        {
            StandardModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""grp"":""pd"",""syscap"":10,""sysrate"":2,""engcap"":8,""engrate"":1.5,""wepcap"":12,""weprate"":3}") },
            },
        };
        var result = Distributor.Calculate(loadout);
        Assert.Equal(10, result.SystemsCapacity);
        Assert.Equal(2, result.SystemsRecharge);
        Assert.Equal(12, result.WeaponsCapacity);
    }

    [Fact]
    public void SysRechargeRate_ComputesCorrectly()
    {
        var rate = Distributor.SysRechargeRate(2, 4);
        Assert.True(rate > 0);
    }

    [Fact]
    public void CapacitorTime_Sustained()
    {
        var result = Distributor.CapacitorTime(100, 10, 5);
        Assert.True(result.Sustained);
    }

    [Fact]
    public void CapacitorTime_NotSustained()
    {
        var result = Distributor.CapacitorTime(100, 5, 10);
        Assert.False(result.Sustained);
        Assert.True(result.Duration > 0);
    }
}

public class PowerTests
{
    private static JsonElement Json(string json) => JsonDocument.Parse(json).RootElement;

    [Fact]
    public void Calculate_NoPowerPlant_ReturnsZero()
    {
        var result = Power.Calculate(new Loadout());
        Assert.Equal(0, result.Available);
    }

    [Fact]
    public void Calculate_WithPowerPlant_ReturnsStats()
    {
        var loadout = new Loadout
        {
            StandardModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""grp"":""pp"",""pgen"":20}") },
            },
        };
        var result = Power.Calculate(loadout);
        Assert.Equal(20, result.Available);
    }
}

public class SpeedTests
{
    private static JsonElement Json(string json) => JsonDocument.Parse(json).RootElement;

    private static Loadout BaseLoadout()
    {
        return new Loadout
        {
            Ship = Json(@"{""properties"":{""hullMass"":50,""speed"":250,""boost"":350,""pitch"":30,""roll"":120,""yaw"":45,""minthrust"":10,""pipSpeed"":0.5}}"),
            Bulkhead = Json(@"{""mass"":10}"),
        };
    }

    [Fact]
    public void Calculate_NoThrusters_UsesBase()
    {
        var result = Speed.Calculate(BaseLoadout());
        Assert.True(result.ForwardSpeed > 0);
        Assert.Equal(350, result.BoostSpeed);
    }

    [Fact]
    public void Calculate_WithThrusters_AppliesMassCurve()
    {
        var loadout = BaseLoadout();
        loadout.StandardModules = new List<EquippedModule?>
        {
            new() { Module = Json(@"{""grp"":""th"",""minmass"":0,""optmass"":100,""maxmass"":500,""minmul"":0.5,""optmul"":1,""maxmul"":1.2,""minmulspeed"":0.5,""optmulspeed"":1,""maxmulspeed"":1.2,""minmulrotation"":0.5,""optmulrotation"":1,""maxmulrotation"":1.2}") },
        };
        var result = Speed.Calculate(loadout);
        Assert.True(result.ForwardSpeed > 0);
        Assert.Equal(5, result.SpeedsByPip.Length);
    }
}

public class HullTests
{
    private static JsonElement Json(string json) => JsonDocument.Parse(json).RootElement;

    [Fact]
    public void Calculate_BasicLoadout_ReturnsHullHealth()
    {
        var ship = Json(@"{""properties"":{""baseArmour"":100,""hardness"":60}}");
        var loadout = new Loadout
        {
            Ship = ship,
            Bulkhead = Json(@"{""mass"":10,""hullboost"":0}"),
        };
        var result = Hull.Calculate(loadout);
        Assert.Equal(100, result.HullHealth);
        Assert.Equal(60, result.ArmourHardness);
    }

    [Fact]
    public void Calculate_WithBulkheadBoost_MultipliesArmour()
    {
        var ship = Json(@"{""properties"":{""baseArmour"":100,""hardness"":60}}");
        var loadout = new Loadout
        {
            Ship = ship,
            Bulkhead = Json(@"{""mass"":10,""hullboost"":0.5}"),
        };
        var result = Hull.Calculate(loadout);
        Assert.Equal(150, result.HullHealth);
    }

    [Fact]
    public void Calculate_WithHrp_AddsReinforcement()
    {
        var ship = Json(@"{""properties"":{""baseArmour"":100,""hardness"":60}}");
        var loadout = new Loadout
        {
            Ship = ship,
            Bulkhead = Json(@"{""mass"":10}"),
            InternalModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""grp"":""hr"",""hullreinforcement"":200}") },
            },
        };
        var result = Hull.Calculate(loadout);
        Assert.Equal(300, result.HullHealth);
    }
}

public class WeaponsTests
{
    private static JsonElement Json(string json) => JsonDocument.Parse(json).RootElement;

    [Fact]
    public void Calculate_NoWeapons_ReturnsEmpty()
    {
        var result = Weapons.Calculate(new Loadout());
        Assert.Empty(result.Weapons);
        Assert.Equal(0, result.TotalDps);
    }

    [Fact]
    public void Calculate_OneWeapon_ComputesStats()
    {
        var loadout = new Loadout
        {
            HardpointModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""grp"":""hp"",""damage"":10,""rof"":2,""symbol"":""Hpt_Pulse_Fixed_Small"",""name"":""Pulse Laser"",""mount"":""Fixed"",""range"":2000,""falloff"":1000}") },
            },
        };
        var result = Weapons.Calculate(loadout);
        Assert.Single(result.Weapons);
        Assert.Equal(20, result.TotalDps, 1);
        Assert.Equal("Pulse Laser", result.Weapons[0].Name);
    }

    [Fact]
    public void Calculate_BurstWeapon_ComputesBurstDps()
    {
        var loadout = new Loadout
        {
            HardpointModules = new List<EquippedModule?>
            {
                new() { Module = Json(@"{""grp"":""hp"",""damage"":5,""burst"":3,""burstrof"":10,""fireint"":0.5,""symbol"":""Hpt_MultiCannon_Fixed_Small"",""name"":""MC"",""mount"":""Fixed""}") },
            },
        };
        var result = Weapons.Calculate(loadout);
        Assert.Single(result.Weapons);
        Assert.True(result.Weapons[0].BurstDps > 0);
    }
}
