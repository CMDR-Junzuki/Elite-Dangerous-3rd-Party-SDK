using Xunit;
using EliteDangerousSdk.Journal;

namespace EliteDangerousSdk.Tests;

public class JournalReaderTests : IDisposable
{
    private readonly string _tmpDir;

    public JournalReaderTests()
    {
        _tmpDir = Path.Combine(Path.GetTempPath(), "ed-journal-tests-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(_tmpDir);
    }

    public void Dispose()
    {
        if (Directory.Exists(_tmpDir))
            Directory.Delete(_tmpDir, true);
    }

    private string WriteJournal(string filename, string[] lines)
    {
        var path = Path.Combine(_tmpDir, filename);
        File.WriteAllText(path, string.Join("\n", lines) + "\n");
        return path;
    }

    [Fact]
    public void ListJournalFiles_ReturnsMatchingFiles()
    {
        WriteJournal("Journal.2024-01-15T120000_01.log", new[] { @"{""event"":""Fileheader""}" });
        WriteJournal("not_a_journal.txt", new[] { "ignore" });
        var files = JournalReader.ListJournalFiles(_tmpDir);
        Assert.Single(files);
        Assert.EndsWith("Journal.2024-01-15T120000_01.log", files[0]);
    }

    [Fact]
    public void ListJournalFiles_EmptyDir_ReturnsEmpty()
    {
        var emptyDir = Path.Combine(Path.GetTempPath(), "ed-empty-" + Guid.NewGuid().ToString("N"));
        try
        {
            Directory.CreateDirectory(emptyDir);
            Assert.Empty(JournalReader.ListJournalFiles(emptyDir));
        }
        finally
        {
            if (Directory.Exists(emptyDir)) Directory.Delete(emptyDir);
        }
    }

    [Fact]
    public void ReadEvents_ReadsSingleEvent()
    {
        WriteJournal("Journal.2024-01-15T120000_01.log", new[] { @"{""event"":""Fileheader"",""timestamp"":""2024-01-15T12:00:00Z""}" });
        var reader = new JournalReader(JournalOptions.StartFromBeginning() with { Directory = _tmpDir });
        var events = reader.ReadEvents().ToList();
        Assert.Single(events);
        Assert.Equal("Fileheader", events[0]["event"]?.ToString());
    }

    [Fact]
    public void ReadEvents_SkipsInvalidLines()
    {
        WriteJournal("Journal.2024-01-15T120000_01.log", new[]
        {
            @"{""event"":""Fileheader""}",
            @"not valid json",
            @"{""event"":""Location""}",
        });
        var reader = new JournalReader(JournalOptions.StartFromBeginning() with { Directory = _tmpDir });
        var events = reader.ReadEvents().ToList();
        Assert.Equal(2, events.Count);
    }

    [Fact]
    public void ReadEvents_TracksPosition()
    {
        WriteJournal("Journal.2024-01-15T120000_01.log", new[]
        {
            @"{""event"":""Fileheader""}",
            @"{""event"":""Location""}",
        });
        var reader = new JournalReader(JournalOptions.StartFromBeginning() with { Directory = _tmpDir });
        var events = reader.ReadEvents().ToList();
        Assert.Equal(2, events.Count);
        Assert.Null(reader.Position);
    }

    [Fact]
    public void ReadEvents_ResumeFromPosition()
    {
        var path = WriteJournal("Journal.2024-01-15T120000_01.log", new[]
        {
            @"{""event"":""Fileheader""}",
            @"{""event"":""Location""}",
        });
        var pos = new JournalPosition(path, 0, 0);
        var reader = new JournalReader(new JournalOptions { Directory = _tmpDir, Position = pos });
        var events = reader.ReadEvents().ToList();
        Assert.Equal(2, events.Count);
    }

    [Fact]
    public void ReadEvents_MultipleFiles()
    {
        WriteJournal("Journal.2024-01-15T120000_01.log", new[] { @"{""event"":""Fileheader""}" });
        WriteJournal("Journal.2024-01-15T130000_01.log", new[] { @"{""event"":""Location""}" });
        var reader = new JournalReader(JournalOptions.StartFromBeginning() with { Directory = _tmpDir });
        var events = reader.ReadEvents().ToList();
        Assert.Equal(2, events.Count);
        Assert.Equal("Location", events[1]["event"]?.ToString());
    }

    [Fact]
    public void ReadStatus_NonExistent_ReturnsNull()
    {
        var reader = new JournalReader(new JournalOptions { Directory = _tmpDir });
        Assert.Null(reader.ReadStatus());
    }

    [Fact]
    public void ReadStatus_ReturnsParsedJson()
    {
        var status = @"{""timestamp"":""2024-01-15T12:00:00Z"",""event"":""Status"",""Flags"":1}";
        File.WriteAllText(Path.Combine(_tmpDir, "Status.json"), status);
        var reader = new JournalReader(new JournalOptions { Directory = _tmpDir });
        var result = reader.ReadStatus();
        Assert.NotNull(result);
        Assert.Equal("Status", result!["event"]?.ToString());
    }

    [Fact]
    public void ReadMarket_NonExistent_ReturnsNull()
    {
        var reader = new JournalReader(new JournalOptions { Directory = _tmpDir });
        Assert.Null(reader.ReadMarket());
    }

    [Fact]
    public void ReadOutfitting_NonExistent_ReturnsNull()
    {
        var reader = new JournalReader(new JournalOptions { Directory = _tmpDir });
        Assert.Null(reader.ReadOutfitting());
    }

    [Fact]
    public void ReadShipyard_NonExistent_ReturnsNull()
    {
        var reader = new JournalReader(new JournalOptions { Directory = _tmpDir });
        Assert.Null(reader.ReadShipyard());
    }

    [Fact]
    public void ReadCargo_NonExistent_ReturnsNull()
    {
        var reader = new JournalReader(new JournalOptions { Directory = _tmpDir });
        Assert.Null(reader.ReadCargo());
    }

    [Fact]
    public void ReadCargo_ReturnsParsedJson()
    {
        var cargo = @"{""timestamp"":""2024-01-15T12:00:00Z"",""event"":""Cargo"",""Vessel"":""Ship"",""Count"":3}";
        File.WriteAllText(Path.Combine(_tmpDir, "Cargo.json"), cargo);
        var reader = new JournalReader(new JournalOptions { Directory = _tmpDir });
        var result = reader.ReadCargo();
        Assert.NotNull(result);
        Assert.Equal("Cargo", result!["event"]?.ToString());
        Assert.Equal("3", result["Count"]?.ToString());
    }

    [Fact]
    public void GetDefaultJournalDir_ReturnsNonEmpty()
    {
        var dir = JournalReader.GetDefaultJournalDir();
        Assert.False(string.IsNullOrEmpty(dir));
    }
}

public class ParserTests
{
    [Fact]
    public void ParseLine_ParsesValidJson()
    {
        var result = Parser.ParseLine(@"{""event"":""Fileheader"",""timestamp"":""2024-01-15T12:00:00Z"",""part"":1}");
        Assert.NotNull(result);
        Assert.Equal("Fileheader", result["event"]);
        Assert.Equal("2024-01-15T12:00:00Z", result["timestamp"]);
        Assert.Equal(1L, result["part"]);
    }

    [Fact]
    public void ParseLine_BigInt_ParsesCorrectly()
    {
        var result = Parser.ParseLine(@"{""MarketID"":1281610104848}");
        Assert.Equal(1281610104848L, result["MarketID"]);
    }

    [Fact]
    public void ParseWithBigInt_AddsMarker()
    {
        var result = Parser.ParseWithBigInt(@"{""event"":""Location""}");
        Assert.Equal(true, result["_bigint"]);
    }

    [Fact]
    public void ParseWithLossyIntegers_Works()
    {
        var result = Parser.ParseWithLossyIntegers(@"{""event"":""Status"",""Flags"":1}");
        Assert.NotNull(result);
        Assert.Equal("Status", result["event"]?.ToString());
    }

    [Fact]
    public void StringifyEvent_SerializesBack()
    {
        var parsed = Parser.ParseLine(@"{""event"":""Fileheader"",""part"":1}");
        var json = Parser.StringifyEvent(parsed);
        Assert.Contains("\"event\"", json);
        Assert.Contains("\"Fileheader\"", json);
    }

    [Fact]
    public void StringifyBigIntJSON_ConvertsLargeInts()
    {
        var parsed = Parser.ParseLine(@"{""MarketID"":9223372036854775807}");
        var json = Parser.StringifyBigIntJSON(parsed);
        Assert.Contains("\"9223372036854775807\"", json);
    }

    [Fact]
    public void IsEventType_ReturnsTrue()
    {
        var parsed = Parser.ParseLine(@"{""event"":""Fileheader""}");
        Assert.True(Parser.IsEventType(parsed, "Fileheader"));
    }

    [Fact]
    public void IsEventType_ReturnsFalse()
    {
        var parsed = Parser.ParseLine(@"{""event"":""Fileheader""}");
        Assert.False(Parser.IsEventType(parsed, "Location"));
    }

    [Fact]
    public void ElementToObject_ConvertsNestedObjects()
    {
        var result = Parser.ParseLine(@"{""obj"":{""a"":1,""b"":""two""},""arr"":[1,2,3]}");
        var obj = Assert.IsType<Dictionary<string, object?>>(result["obj"]);
        Assert.Equal(1L, obj["a"]);
        Assert.Equal("two", obj["b"]);
        var arr = Assert.IsType<List<object?>>(result["arr"]);
        Assert.Equal(3, arr.Count);
    }

    [Fact]
    public void ParseLine_BoolAndNull()
    {
        var result = Parser.ParseLine(@"{""active"":true,""present"":false,""empty"":null}");
        Assert.Equal(true, result["active"]);
        Assert.Equal(false, result["present"]);
        Assert.Null(result["empty"]);
    }
}

public class JournalWatcherTests
{
    [Fact]
    public void JournalWatcher_Instantiate()
    {
        var watcher = new JournalWatcher(Path.GetTempPath());
        Assert.NotNull(watcher);
        watcher.Dispose();
    }

    [Fact]
    public void JournalWatcher_HasStop()
    {
        var watcher = new JournalWatcher(Path.GetTempPath());
        watcher.Stop();
        Assert.NotNull(watcher);
        watcher.Dispose();
    }
}

public class TypedEventTests
{
    [Fact]
    public void FileHeader_Creation()
    {
        var fh = new FileHeader { timestamp = "2024-01-15T12:00:00Z", part = 1 };
        Assert.Equal("2024-01-15T12:00:00Z", fh.timestamp);
        Assert.Equal(1, fh.part);
        Assert.Equal("FileHeader", fh.@event);
        Assert.Null(fh.build);
    }

    [Fact]
    public void Docked_Creation()
    {
        var docked = new Docked { timestamp = "2024-01-15T12:00:00Z", MarketID = 128666431, StarSystem = "Sol", StationName = "Dock", StationType = "Coriolis" };
        Assert.Equal("Dock", docked.StationName);
        Assert.Equal("Coriolis", docked.StationType);
        Assert.Equal("Sol", docked.StarSystem);
        Assert.Equal(128666431, docked.MarketID);
    }

    [Fact]
    public void FSDJump_Creation()
    {
        var fsd = new FSDJump { timestamp = "2024-01-15T12:00:00Z", StarSystem = "Sol", StarPos = new List<double> { 0.0, 0.0, 0.0 }, JumpDist = 10.5 };
        Assert.Equal("Sol", fsd.StarSystem);
        Assert.Equal(new List<double> { 0.0, 0.0, 0.0 }, fsd.StarPos);
        Assert.Equal(10.5, fsd.JumpDist);
    }

    [Fact]
    public void Scan_Creation()
    {
        var scan = new Scan { timestamp = "2024-01-15T12:00:00Z", BodyName = "Earth", BodyID = 1, DistanceFromArrivalLS = 100.0, StarSystem = "Sol" };
        Assert.Equal("Earth", scan.BodyName);
        Assert.Equal(1, scan.BodyID);
        Assert.Equal(100.0, scan.DistanceFromArrivalLS);
        Assert.Equal("Sol", scan.StarSystem);
    }

    [Fact]
    public void EventDiscriminator_Defaults()
    {
        var fh = new FileHeader { timestamp = "x", part = 1 };
        Assert.Equal("FileHeader", fh.@event);
        var docked = new Docked { timestamp = "x", MarketID = 1, StarSystem = "x", StationName = "x", StationType = "x" };
        Assert.Equal("Docked", docked.@event);
        var fsd = new FSDJump { timestamp = "x", StarSystem = "x", StarPos = new List<double>(), JumpDist = 1.0 };
        Assert.Equal("FSDJump", fsd.@event);
    }

    [Fact]
    public void OptionalFields_DefaultToNull()
    {
        var fh = new FileHeader { timestamp = "x", part = 1 };
        Assert.Null(fh.build);
        Assert.Null(fh.gameversion);
        Assert.Null(fh.language);
        Assert.Null(fh.odyssey);
        var docked = new Docked { timestamp = "x", MarketID = 1, StarSystem = "x", StationName = "x", StationType = "x" };
        Assert.Null(docked.ActiveFine);
        Assert.Null(docked.CockpitBreach);
    }

    [Fact]
    public void SharedTypes_Creation()
    {
        var econ = new StationEconomy { Name = "Agriculture", Share = 0.5 };
        Assert.Equal("Agriculture", econ.Name);
        Assert.Equal(0.5, econ.Share);
        var faction = new FactionState { Name = "Fed", FactionStateValue = "None", Government = "Democracy", Influence = 0.5, Allegiance = "Federation" };
        Assert.Equal("Fed", faction.Name);
        Assert.Equal("Democracy", faction.Government);
        var conflict = new Conflict { WarType = "war", Status = "active", Faction1 = new ConflictFaction { Name = "A", Stake = "S1", WonDays = 1 }, Faction2 = new ConflictFaction { Name = "B", Stake = "S2", WonDays = 2 } };
        Assert.Equal("war", conflict.WarType);
        Assert.Equal("active", conflict.Status);
        Assert.Equal("A", conflict.Faction1.Name);
        Assert.Equal("B", conflict.Faction2.Name);
    }

    [Fact]
    public void Status_Creation()
    {
        var fuel = new Status_Fuel { FuelMain = 50.0, FuelReservoir = 25.0 };
        var status = new Status { timestamp = "2024-01-15T12:00:00Z", Flags = 1, Pips = new List<long> { 2, 4, 6 }, Fuel = fuel, Cargo = 0.0, FireGroup = 1, GuiFocus = 0 };
        Assert.Equal(1, status.Flags);
        Assert.Equal(new List<long> { 2, 4, 6 }, status.Pips);
        Assert.Equal(50.0, status.Fuel.FuelMain);
        Assert.Equal(25.0, status.Fuel.FuelReservoir);
    }

    [Fact]
    public void Location_Creation()
    {
        var loc = new Location { timestamp = "2024-01-15T12:00:00Z", StarSystem = "Sol", StarPos = new List<double> { 0.0, 0.0, 0.0 } };
        Assert.Equal("Sol", loc.StarSystem);
        Assert.Equal(new List<double> { 0.0, 0.0, 0.0 }, loc.StarPos);
        Assert.Null(loc.Body);
    }

    [Fact]
    public void Market_Creation()
    {
        var item = new Market_Item { Name = "Hydrogen", BuyPrice = 100, SellPrice = 120, MeanPrice = 110, StockBracket = 2, DemandBracket = 2, Stock = 1000, Demand = 100, StatusFlags = "OK" };
        var market = new Market { timestamp = "2024-01-15T12:00:00Z", MarketID = 128666431, StationName = "Station", StationType = "Coriolis", StarSystem = "Sol", Items = new List<Market_Item> { item } };
        Assert.Equal(128666431, market.MarketID);
        Assert.Equal("Station", market.StationName);
        Assert.Equal("Coriolis", market.StationType);
        Assert.Equal("Sol", market.StarSystem);
        Assert.Equal("Hydrogen", market.Items[0].Name);
    }
}
