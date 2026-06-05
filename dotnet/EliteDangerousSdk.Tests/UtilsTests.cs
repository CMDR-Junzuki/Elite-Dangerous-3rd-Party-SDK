using Xunit;
using EliteDangerousSdk.Utils;

namespace EliteDangerousSdk.Tests;

public class CoordsTests
{
    [Fact]
    public void DistanceTo_ComputesCorrectly()
    {
        var a = new Coords(0, 0, 0);
        var b = new Coords(3, 4, 0);
        Assert.Equal(5, a.DistanceTo(b));
    }

    [Fact]
    public void Midpoint_ComputesCorrectly()
    {
        var a = new Coords(0, 0, 0);
        var b = new Coords(2, 4, 6);
        var m = Coords.Midpoint(a, b);
        Assert.Equal(1, m.X);
        Assert.Equal(2, m.Y);
        Assert.Equal(3, m.Z);
    }

    [Fact]
    public void BearingTo_ReturnsAzimuthAndElevation()
    {
        var a = new Coords(0, 0, 0);
        var b = new Coords(1, 0, 0);
        var (az, el) = a.BearingTo(b);
        Assert.Equal(90, az, 1);
        Assert.Equal(0, el, 1);
    }

    [Fact]
    public void ToString_FormatsCorrectly()
    {
        var c = new Coords(1.5, 2.5, 3.5);
        Assert.Equal("(1.50, 2.50, 3.50)", c.ToString());
    }
}

public class CoordinatesTests
{
    [Fact]
    public void Distance_DelegatesCorrectly()
    {
        var a = new Coords(0, 0, 0);
        var b = new Coords(3, 4, 12);
        Assert.Equal(13, Coordinates.Distance(a, b));
    }

    [Fact]
    public void SphereSearch_ReturnsSystemsWithinRadius()
    {
        var center = new Coords(0, 0, 0);
        var systems = new List<Coords>
        {
            new(1, 0, 0),
            new(10, 0, 0),
            new(-1, 0, 0),
        };
        var result = Coordinates.SphereSearch(center, 5, systems);
        Assert.Equal(2, result.Count);
        Assert.Contains(result, s => s.X == 1);
        Assert.Contains(result, s => s.X == -1);
    }
}

public class ListifyTests
{
    [Fact]
    public void Convert_NullInput_ReturnsEmptyList()
    {
        var result = Listify.Convert<string>(null);
        Assert.Empty(result);
    }

    [Fact]
    public void Convert_EmptyDict_ReturnsEmptyList()
    {
        var result = Listify.Convert<string>(new Dictionary<string, string>());
        Assert.Empty(result);
    }

    [Fact]
    public void Convert_SparseDict_ReturnsArrayWithCorrectPositions()
    {
        var dict = new Dictionary<string, string>
        {
            ["0"] = "a",
            ["2"] = "c",
        };
        var result = Listify.Convert<string>(dict);
        Assert.Equal(3, result.Count);
        Assert.Equal("a", result[0]);
        Assert.Null(result[1]);
        Assert.Equal("c", result[2]);
    }

    [Fact]
    public void FromObjectDict_NullInput_ReturnsEmptyList()
    {
        var result = Listify.FromObjectDict<string>(null);
        Assert.Empty(result);
    }

    [Fact]
    public void FromObjectDict_SparseDict_ReturnsArrayWithCorrectPositions()
    {
        var dict = new Dictionary<string, object>
        {
            ["0"] = "x",
            ["1"] = "y",
        };
        var result = Listify.FromObjectDict<string>(dict);
        Assert.Equal(2, result.Count);
        Assert.Equal("x", result[0]);
        Assert.Equal("y", result[1]);
    }
}

public class BitFlagsTests
{
    [Fact]
    public void Parse_ReturnsMatchingFlagNames()
    {
        var flags = new Dictionary<string, long>
        {
            ["Docked"] = 1,
            ["Landed"] = 2,
            ["Supercruise"] = 16,
        };
        var result = BitFlags.Parse(17, flags);
        Assert.Contains("Docked", result);
        Assert.Contains("Supercruise", result);
        Assert.DoesNotContain("Landed", result);
    }

    [Fact]
    public void HasFlag_ReturnsTrueWhenBitSet()
    {
        Assert.True(BitFlags.HasFlag(6, 2));
        Assert.False(BitFlags.HasFlag(6, 1));
    }

    [Fact]
    public void Combine_ReturnsBitwiseOr()
    {
        Assert.Equal(7, BitFlags.Combine(1, 2, 4));
    }
}

public class FlagsConstantsTests
{
    [Fact]
    public void Flags_Docked_IsBit0()
    {
        Assert.Equal(1L << 0, Flags.Docked);
    }

    [Fact]
    public void Flags2_OnFoot_IsBit0()
    {
        Assert.Equal(1L << 0, Flags2.OnFoot);
    }

    [Fact]
    public void GuiFocus_HasExpectedValues()
    {
        Assert.Equal(0, GuiFocus.NoFocus);
        Assert.Equal(6, GuiFocus.GalaxyMap);
        Assert.Equal(11, GuiFocus.Codex);
    }
}
