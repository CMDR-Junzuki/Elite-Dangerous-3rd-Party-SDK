using Xunit;
using EliteDangerousSdk.Planner;

namespace EliteDangerousSdk.Tests;

public class PowerplayTests
{
    [Fact]
    public void HasAll13Powers()
    {
        Assert.Equal(13, Powerplay.Powers.Length);
        Assert.Contains("Aisling Duval", Powerplay.Powers);
        Assert.Contains("Nakato Kaine", Powerplay.Powers);
    }

    [Theory]
    [InlineData(1, 0)]
    [InlineData(2, 2000)]
    [InlineData(3, 5000)]
    [InlineData(4, 9000)]
    [InlineData(5, 15000)]
    [InlineData(6, 23000)]
    [InlineData(10, 55000)]
    [InlineData(100, 775000)]
    public void GetMeritsForRank_ReturnsCorrectThresholds(int rank, int expected)
    {
        Assert.Equal(expected, Powerplay.GetMeritsForRank(rank));
    }

    [Theory]
    [InlineData(0, 1, 2000)]
    [InlineData(2000, 2, 3000)]
    [InlineData(50000, 9, 5000)]
    [InlineData(775000, 100, 0)]
    public void MeritsToNextRank_ComputesCorrectly(int merits, int expectedRank, int expectedNeeded)
    {
        var (rank, needed) = Powerplay.MeritsToNextRank(merits);
        Assert.Equal(expectedRank, rank);
        Assert.Equal(expectedNeeded, needed);
    }

    [Theory]
    [InlineData("top_100_pct", 500000)]
    [InlineData("top_75_pct", 2500000)]
    [InlineData("top_50_pct", 5000000)]
    [InlineData("top_25_pct", 10000000)]
    [InlineData("top_10_pct", 50000000)]
    [InlineData("top_10", 100000000)]
    [InlineData("top_1", 1000000000)]
    public void GetSalary_ReturnsCorrectValues(string bracket, int expected)
    {
        Assert.Equal(expected, Powerplay.GetSalary(bracket));
    }

    [Fact]
    public void SalariesDictionary_MatchesGetSalary()
    {
        foreach (var (bracket, salary) in Powerplay.Salaries)
        {
            Assert.Equal(salary, Powerplay.GetSalary(bracket));
        }
    }

    [Theory]
    [InlineData(0, "top_100_pct")]
    [InlineData(100, "top_100_pct")]
    [InlineData(1000, "top_75_pct")]
    [InlineData(5000, "top_50_pct")]
    [InlineData(10000, "top_25_pct")]
    [InlineData(50000, "top_10_pct")]
    [InlineData(200000, "top_10")]
    [InlineData(500000, "top_1")]
    public void EstimateMeritsBracket_CoversAllTiers(int merits, string expected)
    {
        Assert.Equal(expected, Powerplay.EstimateMeritsBracket(merits));
    }

    [Fact]
    public void EstimateMeritsPerHour_ReturnsNonZero()
    {
        Assert.True(Powerplay.EstimateMeritsPerHour("mining") > 0);
        Assert.True(Powerplay.EstimateMeritsPerHour("combat_zone") > 0);
        Assert.Equal(3000, Powerplay.EstimateMeritsPerHour("unknown_activity"));
    }
}
