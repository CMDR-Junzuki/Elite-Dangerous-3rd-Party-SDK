using Xunit;
using EliteDangerousSdk.Journal;
using System.Collections.Generic;

namespace EliteDangerousSdk.Tests;

public class QueryTests
{
    private readonly List<Dictionary<string, object?>> _events = new()
    {
        new() { ["event"] = "FSDJump", ["timestamp"] = "2026-01-01T00:00:00Z", ["StarSystem"] = "Sol", ["JumpDist"] = 4.37 },
        new() { ["event"] = "FSDJump", ["timestamp"] = "2026-01-01T01:00:00Z", ["StarSystem"] = "Alpha Centauri", ["JumpDist"] = 4.37 },
        new() { ["event"] = "Scan", ["timestamp"] = "2026-01-01T02:00:00Z", ["BodyName"] = "Earth" },
        new() { ["event"] = "Docked", ["timestamp"] = "2026-01-02T00:00:00Z", ["StationName"] = "Li Qing Jao" },
        new() { ["event"] = "FSDJump", ["timestamp"] = "2026-01-03T00:00:00Z", ["StarSystem"] = "Barnard's Star", ["JumpDist"] = 5.95 },
    };

    [Fact]
    public void Count_All()
    {
        Assert.Equal(5, new JournalQuery(_events).Count());
    }

    [Fact]
    public void Filter_By_Event()
    {
        Assert.Equal(3, new JournalQuery(_events).Where("event", "FSDJump").Count());
    }

    [Fact]
    public void Chain_Filters()
    {
        Assert.Equal(1, new JournalQuery(_events).Where("event", "FSDJump").Where("StarSystem", "Sol").Count());
    }

    [Fact]
    public void Predicate_Function()
    {
        Assert.Equal(1, new JournalQuery(_events).Where(e => (string?)e["event"] == "Scan").Count());
    }

    [Fact]
    public void Greater_Than()
    {
        Assert.Equal(1, new JournalQuery(_events).Where("event", "FSDJump").Where("JumpDist", 5.0, ">").Count());
    }

    [Fact]
    public void Between_Timestamps()
    {
        Assert.Equal(3, new JournalQuery(_events).Between("2026-01-01T00:00:00Z", "2026-01-01T23:59:59Z").Count());
    }

    [Fact]
    public void Select_Field()
    {
        var systems = new JournalQuery(_events).Where("event", "FSDJump").Select<string>("StarSystem");
        Assert.Equal(["Sol", "Alpha Centauri", "Barnard's Star"], systems);
    }

    [Fact]
    public void First_And_Last()
    {
        var q = new JournalQuery(_events).Where("event", "FSDJump");
        Assert.Equal("Sol", (string?)q.First()!["StarSystem"]);
        Assert.Equal("Barnard's Star", (string?)q.Last()!["StarSystem"]);
    }

    [Fact]
    public void ToList_Returns_Copy()
    {
        var q = new JournalQuery(_events);
        var list = q.ToList();
        Assert.Equal(5, list.Count);
        list.Add(new());
        Assert.Equal(5, q.Count());
    }

    [Fact]
    public void ForEach_Iterates()
    {
        var names = new List<string?>();
        new JournalQuery(_events).Where("event", "FSDJump").ForEach(e => names.Add((string?)e["StarSystem"]));
        Assert.Equal(["Sol", "Alpha Centauri", "Barnard's Star"], names);
    }

    [Fact]
    public void CountWhere_Extension()
    {
        Assert.Equal(3, _events.CountWhere("FSDJump"));
        Assert.Equal(1, _events.CountWhere("Scan"));
    }

    [Fact]
    public void FilterWhere_Extension()
    {
        var jumps = _events.FilterWhere("FSDJump");
        Assert.Equal(3, jumps.Count);
        Assert.Equal("Sol", (string?)jumps[0]["StarSystem"]);
    }

    [Fact]
    public void CountByType_Extension()
    {
        var counts = _events.CountByType();
        Assert.Equal(3, counts["FSDJump"]);
        Assert.Equal(1, counts["Scan"]);
        Assert.Equal(1, counts["Docked"]);
    }
}
