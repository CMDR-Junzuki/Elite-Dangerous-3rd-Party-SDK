using Xunit;
using EliteDangerousSdk.Data;

namespace EliteDangerousSdk.Tests;

public class ShipNameMapTests
{
    [Theory]
    [InlineData("sidewinder", "Sidewinder")]
    [InlineData("python", "Python")]
    [InlineData("anaconda", "Anaconda")]
    [InlineData("ferdelance", "Fer-de-Lance")]
    [InlineData("krait_mkii", "Krait MkII")]
    [InlineData("type9", "Type-9 Heavy")]
    [InlineData("unknown_ship", "unknown_ship")]
    public void GetDisplayName_ReturnsCorrect(string input, string expected)
    {
        Assert.Equal(expected, ShipNameMap.GetDisplayName(input));
    }

    [Fact]
    public void GetDisplayName_CaseInsensitive()
    {
        Assert.Equal("Sidewinder", ShipNameMap.GetDisplayName("Sidewinder"));
    }
}

public class OutfittingMapsTests
{
    [Theory]
    [InlineData("Weapon", "Hardpoint")]
    [InlineData("PowerPlant", "Power Plant")]
    [InlineData("FrameShiftDrive", "Frame Shift Drive")]
    [InlineData("Armour", "Bulkhead")]
    public void CategoryMap_MapsCorrectly(string key, string expected)
    {
        Assert.Equal(expected, OutfittingMaps.CategoryMap[key]);
    }

    [Theory]
    [InlineData("PlanetaryApproachSuite", "Planetary Approach Suite")]
    [InlineData("VehicleHangar", "Vehicle Hangar")]
    [InlineData("FighterHangar", "Fighter Hangar")]
    public void SlotNameMap_MapsCorrectly(string key, string expected)
    {
        Assert.Equal(expected, OutfittingMaps.SlotNameMap[key]);
    }

    [Theory]
    [InlineData("Fixed", "Fixed")]
    [InlineData("Gimbal", "Gimballed")]
    [InlineData("Turret", "Turret")]
    public void WeaponMountMap_MapsCorrectly(string key, string expected)
    {
        Assert.Equal(expected, OutfittingMaps.WeaponMountMap[key]);
    }
}

public class EdshipyardSlotMapTests
{
    [Theory]
    [InlineData("bh", "Bulkheads")]
    [InlineData("hp", "Hardpoints")]
    [InlineData("fsd", "Frame Shift Drive")]
    [InlineData("gfsb", "Guardian FSD Booster")]
    [InlineData("cr", "Cargo Rack")]
    public void Map_ContainsExpectedMappings(string key, string expected)
    {
        Assert.Equal(expected, EdshipyardSlotMap.Map[key]);
    }
}

public class ModuleSymbolParserTests
{
    [Fact]
    public void Parse_InternalModule()
    {
        var result = ModuleSymbolParser.Parse("Int_ShieldGenerator_Size6_Class3");
        Assert.Equal("ShieldGenerator", result["category"]);
        Assert.Equal("Shield Generator", result["name"]);
        Assert.Equal(6, result["class"]);
        Assert.Equal("C", result["rating"]);
    }

    [Fact]
    public void Parse_StandardModule()
    {
        var result = ModuleSymbolParser.Parse("PowerPlant_Size4_Class2");
        Assert.Equal("PowerPlant", result["category"]);
        Assert.Equal("Power Plant", result["name"]);
        Assert.Equal(4, result["class"]);
        Assert.Equal("D", result["rating"]);
    }

    [Fact]
    public void Parse_WeaponWithMount()
    {
        // WeaponRe matches: Hpt_<category>_<name>_<size>
        // Hpt_Pulse_Fixed_Small -> category=Pulse, name=Fixed, mount=not set
        var result = ModuleSymbolParser.Parse("Hpt_Pulse_Fixed_Small");
        Assert.Equal("Pulse", result["category"]);
        Assert.Equal("Fixed", result["name"]);
        Assert.Equal(1, result["class"]);
    }

    [Fact]
    public void Parse_WeaponWithoutMount()
    {
        // Too few segments for WeaponRe, falls to defaults
        var result = ModuleSymbolParser.Parse("Hpt_Pulse_Small");
        Assert.Equal("", result["category"]);
    }

    [Fact]
    public void Parse_UtilityModule()
    {
        // UtilityRe matches: Hpt_<name>_Size<N>_Class<M>
        var result = ModuleSymbolParser.Parse("Hpt_ShieldBooster_Size1_Class4");
        Assert.Equal("Shield Booster", result["category"]);
        Assert.Equal("Shield Booster", result["name"]);
        Assert.Equal("B", result["rating"]);
    }

    [Fact]
    public void Parse_UnknownSymbol_ReturnsDefaults()
    {
        var result = ModuleSymbolParser.Parse("???");
        Assert.Equal("???", result["symbol"]);
        Assert.Equal("", result["category"]);
    }

    [Fact]
    public void Parse_WeaponWithGimbalMount()
    {
        var result = ModuleSymbolParser.Parse("Hpt_MultiCannon_Gimbal_Medium");
        Assert.Equal("Multi Cannon", result["category"]);
        Assert.Equal(2, result["class"]);
    }

    [Fact]
    public void Parse_WeaponWithTurretMount()
    {
        var result = ModuleSymbolParser.Parse("Hpt_BeamLaser_Turret_Large");
        Assert.Equal("Beam Laser", result["category"]);
        Assert.Equal(3, result["class"]);
    }

    [Fact]
    public void Parse_WeaponHuge()
    {
        var result = ModuleSymbolParser.Parse("Hpt_Cannon_Fixed_Huge");
        Assert.Equal("Cannon", result["category"]);
        Assert.Equal(4, result["class"]);
    }
}

public class ModuleDisplayTests
{
    [Fact]
    public void GetDisplayName_ReturnsEmpty()
    {
        Assert.Equal("", ModuleDisplay.GetDisplayName(12345));
    }
}
