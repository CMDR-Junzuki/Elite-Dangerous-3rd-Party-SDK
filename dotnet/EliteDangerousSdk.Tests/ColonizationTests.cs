using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using EliteDangerousSdk.Data;
using EliteDangerousSdk.Planner;

namespace EliteDangerousSdk.Tests;

public class ColonizationDataTests
{
    [Fact]
    public void SiteTypes_HasExpectedCount()
    {
        Assert.True(ColonizationData.SiteTypes.Count > 50);
    }

    [Fact]
    public void GetSiteType_Coriolis_ReturnsNonNull()
    {
        var site = ColonizationData.GetSiteType("coriolis");
        Assert.NotNull(site);
        Assert.Equal("Coriolis", site!.DisplayName);
        Assert.Equal("Coriolis Starport", site.DisplayName2);
        Assert.Equal(BuildClass.Starport, site.BuildClass);
        Assert.Equal(2, site.Tier);
        Assert.Equal(PadSize.Large, site.PadSize);
    }

    [Fact]
    public void GetSiteType_UnknownBogus_ReturnsNull()
    {
        Assert.Null(ColonizationData.GetSiteType("unknown_bogus"));
    }

    [Fact]
    public void ColonizationCosts_HasExpectedCount()
    {
        Assert.True(ColonizationData.ColonizationCosts.Count > 40);
    }

    [Fact]
    public void GetColonizationCosts_ExistingKey_ReturnsNonEmpty()
    {
        var costs = ColonizationData.GetColonizationCosts("coriolis");
        Assert.NotEmpty(costs);
        Assert.Contains(costs, c => c.Commodity == "steel");
    }

    [Fact]
    public void GetColonizationCosts_BogusKey_ReturnsEmpty()
    {
        Assert.Empty(ColonizationData.GetColonizationCosts("Bogus"));
    }

    [Fact]
    public void GetTotalHaul_ExistingKey_ReturnsPositive()
    {
        Assert.True(ColonizationData.GetTotalHaul("coriolis") > 0);
    }

    [Fact]
    public void GetTotalHaul_BogusKey_ReturnsZero()
    {
        Assert.Equal(0, ColonizationData.GetTotalHaul("Bogus"));
    }

    [Fact]
    public void PrimaryPortsT1_HasItems()
    {
        Assert.NotEmpty(ColonizationData.PrimaryPortsT1);
        Assert.Contains("plutus", ColonizationData.PrimaryPortsT1);
    }

    [Fact]
    public void PrimaryPortsT2_HasItems()
    {
        Assert.NotEmpty(ColonizationData.PrimaryPortsT2);
        Assert.Contains("no_truss", ColonizationData.PrimaryPortsT2);
    }

    [Fact]
    public void PrimaryPortsT3_HasItems()
    {
        Assert.NotEmpty(ColonizationData.PrimaryPortsT3);
        Assert.Contains("apollo", ColonizationData.PrimaryPortsT3);
    }

    [Fact]
    public void MapSitePads_HasExpectedCount()
    {
        Assert.True(ColonizationData.MapSitePads.Count > 40);
        Assert.True(ColonizationData.MapSitePads.All(kvp => kvp.Value.Length == 3));
    }

    [Fact]
    public void EconomyEnum_HasAllExpectedValues()
    {
        var values = Enum.GetValues<Economy>();
        Assert.Contains(Economy.Agriculture, values);
        Assert.Contains(Economy.Service, values);
        Assert.Contains(Economy.Extraction, values);
        Assert.Contains(Economy.HighTech, values);
        Assert.Contains(Economy.Industrial, values);
        Assert.Contains(Economy.Military, values);
        Assert.Contains(Economy.None, values);
        Assert.Contains(Economy.Tourism, values);
        Assert.Contains(Economy.Refinery, values);
        Assert.Contains(Economy.Colony, values);
        Assert.Contains(Economy.Terraforming, values);
        Assert.Equal(11, values.Length);
    }

    [Fact]
    public void BodyTypeEnum_HasAllExpectedValues()
    {
        var values = Enum.GetValues<BodyType>();
        Assert.Contains(BodyType.Un, values);
        Assert.Contains(BodyType.BlackHole, values);
        Assert.Contains(BodyType.NeutronStar, values);
        Assert.Contains(BodyType.WhiteDwarf, values);
        Assert.Contains(BodyType.Star, values);
        Assert.Contains(BodyType.AmmoniaWorld, values);
        Assert.Contains(BodyType.EarthLikeWorld, values);
        Assert.Contains(BodyType.GasGiant, values);
        Assert.Contains(BodyType.HighMetalContent, values);
        Assert.Contains(BodyType.Icy, values);
        Assert.Contains(BodyType.MetalRich, values);
        Assert.Contains(BodyType.Rocky, values);
        Assert.Contains(BodyType.RockyIce, values);
        Assert.Contains(BodyType.WaterGiant, values);
        Assert.Contains(BodyType.WaterWorld, values);
        Assert.Contains(BodyType.AsteroidCluster, values);
        Assert.Contains(BodyType.Barycentre, values);
        Assert.Equal(17, values.Length);
    }
}

public class ColonizationTaxTests
{
    [Theory]
    [InlineData(2, 100, -1, 100)]
    [InlineData(3, 100, 1, 200)]
    [InlineData(2, 100, 2, 250)]
    public void ApplyTax_ComputesCorrectly(int tier, int cost, int taxCount, int expected)
    {
        Assert.Equal(expected, ColonizationSystem.ApplyTax(tier, cost, taxCount));
    }
}

public class ColonizationPreReqTests
{
    [Fact]
    public void GetPreReqNeeded_Satellite_ReturnsThreeNames()
    {
        var touristType = ColonizationData.SiteTypes.Find(st => st.PreReq == "satellite");
        Assert.NotNull(touristType);
        var result = ColonizationSystem.GetPreReqNeeded(touristType!);
        Assert.Equal(new[] { "hermes", "angelia", "eirene" }, result);
    }

    [Fact]
    public void GetPreReqNeeded_Comms_ReturnsThreeNames()
    {
        var commsType = ColonizationData.SiteTypes.Find(st => st.PreReq == "comms");
        Assert.NotNull(commsType);
        var result = ColonizationSystem.GetPreReqNeeded(commsType!);
        Assert.Equal(new[] { "pistis", "soter", "aletheia" }, result);
    }

    [Fact]
    public void GetPreReqNeeded_Unknown_ReturnsEmpty()
    {
        var unknownType = new SiteTypeDef("Test", "Test", new[] { "test" }, null, 0,
            BuildClass.Unknown, 0, PadSize.None, null, false, Economy.None, null,
            new TierCount(0, 0), new TierCount(0, 0), new SysEffects(0, 0, 0, 0, 0, 0, 0),
            "nonexistent", null, null);
        Assert.Empty(ColonizationSystem.GetPreReqNeeded(unknownType));
    }
}

public class ColonizationPredictSurfaceSlotsTests
{
    [Fact]
    public void PredictSurfaceSlots_NonLandableBody_ReturnsZero()
    {
        var body = new BodyInfo(BodyType.Rocky, Array.Empty<BodyFeature>(), 300, 1.0, 5000, "");
        Assert.Equal(0, ColonizationSystem.PredictSurfaceSlots(body));
    }

    [Fact]
    public void PredictSurfaceSlots_HotBody_ReturnsZero()
    {
        var body = new BodyInfo(BodyType.Rocky, new[] { BodyFeature.Landable }, 1000, 1.0, 5000, "");
        Assert.Equal(0, ColonizationSystem.PredictSurfaceSlots(body));
    }

    [Fact]
    public void PredictSurfaceSlots_ElwWithFeatures_ReturnsPositive()
    {
        var body = new BodyInfo(BodyType.EarthLikeWorld,
            new[] { BodyFeature.Landable, BodyFeature.Terraformable, BodyFeature.Atmosphere },
            300, 1.0, 5000, "");
        var predicted = ColonizationSystem.PredictSurfaceSlots(body);
        Assert.True(predicted > 0);
        Assert.True(predicted <= 7);
    }

    [Fact]
    public void PredictSurfaceSlots_UnType_ReturnsNegativeOne()
    {
        var body = new BodyInfo(BodyType.Un, Array.Empty<BodyFeature>(), 300, 1.0, 5000, "");
        Assert.Equal(-1, ColonizationSystem.PredictSurfaceSlots(body));
    }

    [Fact]
    public void PredictSurfaceSlots_HighGravity_ReturnsZero()
    {
        var body = new BodyInfo(BodyType.Rocky, new[] { BodyFeature.Landable }, 300, 3.0, 5000, "");
        Assert.Equal(0, ColonizationSystem.PredictSurfaceSlots(body));
    }
}

public class ColonizationSystemModelTests
{
    [Fact]
    public void MapSysUnlocks_HasExpectedCount()
    {
        Assert.True(ColonizationSystem.MapSysUnlocks.Count >= 16);
        Assert.Contains("SettlementTourist", ColonizationSystem.MapSysUnlocks.Keys);
        Assert.Contains("VistaGenomics", ColonizationSystem.MapSysUnlocks.Keys);
    }

    [Fact]
    public void BuildSystemModel2_MinimalInput_ProducesValidOutput()
    {
        var rawSys = new RawSys(
            V: 1,
            Rev: 0,
            Name: "Test System",
            Nickname: null,
            Notes: null,
            Id64: 12345L,
            Architect: "CMDR Test",
            Pos: new double[] { 0, 0, 0 },
            ReserveLevel: ReserveLevel.Common,
            PrimaryPortId: null,
            Bodies: new RawBod[]
            {
                new RawBod("Test Body", 0, 100.0, Array.Empty<int>(), BodyType.EarthLikeWorld, "",
                    new[] { BodyFeature.Landable }, 5000, 300, 1.0),
            },
            Sites: new RawSite[]
            {
                new RawSite("site1", "build1", 12345L, "Test Station", 0, "coriolis", null, BuildStatus.Plan),
            },
            Slots: new Dictionary<int, int[]>(),
            Revs: Array.Empty<Rev>(),
            SavedNames: null,
            Pop: null,
            Open: null,
            IdxCalcLimit: null
        );

        var result = ColonizationSystem.BuildSystemModel2(rawSys, true);

        Assert.NotNull(result);
        Assert.Equal("Test System", result.Name);
        Assert.Single(result.Bodies);
        Assert.Single(result.Sites);
        Assert.Single(result.SiteMaps);
        Assert.Equal("Test Body", result.Bodies[0].Name);
        Assert.Equal(BodyType.EarthLikeWorld, result.Bodies[0].Type);
        Assert.Equal(ReserveLevel.Common, result.ReserveLevel);
    }

    [Fact]
    public void BuildSystemModel2_IgnoresDemolishSites()
    {
        var rawSys = new RawSys(
            V: 1,
            Rev: 0,
            Name: "Test System",
            Nickname: null,
            Notes: null,
            Id64: 12345L,
            Architect: "CMDR Test",
            Pos: new double[] { 0, 0, 0 },
            ReserveLevel: ReserveLevel.Common,
            PrimaryPortId: null,
            Bodies: new RawBod[]
            {
                new RawBod("Body A", 0, 100.0, Array.Empty<int>(), BodyType.Rocky, "",
                    new[] { BodyFeature.Landable }, 2000, 300, 0.5),
            },
            Sites: new RawSite[]
            {
                new RawSite("s1", "b1", 1L, "Site 1", 0, "coriolis", null, BuildStatus.Demolish),
                new RawSite("s2", "b2", 2L, "Site 2", 0, "asteroid", null, BuildStatus.Complete),
            },
            Slots: new Dictionary<int, int[]>(),
            Revs: Array.Empty<Rev>(),
            SavedNames: null,
            Pop: null,
            Open: null,
            IdxCalcLimit: null
        );

        var result = ColonizationSystem.BuildSystemModel2(rawSys, false);
        Assert.Equal(2, result.Sites.Count);
        Assert.Single(result.CalcIds);
        Assert.Equal("s2", result.CalcIds[0]);
    }
}
