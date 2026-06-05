using Xunit;
using EliteDangerousSdk.Journal;

namespace EliteDangerousSdk.Tests;

public class JournalReplayTests : IDisposable
{
    private readonly string _tmpDir;

    public JournalReplayTests()
    {
        _tmpDir = Path.Combine(Path.GetTempPath(), "ed-replay-tests-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(_tmpDir);
    }

    public void Dispose()
    {
        if (Directory.Exists(_tmpDir))
            Directory.Delete(_tmpDir, true);
    }

    private static Dictionary<string, object?> MakeEvent(string event_, string timestamp, Dictionary<string, object?>? extra = null)
    {
        var dict = new Dictionary<string, object?>
        {
            ["timestamp"] = timestamp,
            ["event"] = event_
        };
        if (extra != null)
        {
            foreach (var kv in extra)
                dict[kv.Key] = kv.Value;
        }
        return dict;
    }

    private static readonly List<Dictionary<string, object?>> Events1SApart =
    [
        MakeEvent("Fileheader", "2024-01-01T00:00:00Z", new() { ["part"] = 1L }),
        MakeEvent("LoadGame", "2024-01-01T00:00:01Z", new() { ["Commander"] = "Test", ["Ship"] = "SideWinder", ["ShipID"] = 1L }),
        MakeEvent("FSDJump", "2024-01-01T00:00:02Z", new() { ["StarSystem"] = "Sol", ["SystemAddress"] = 1L }),
    ];

    private static readonly List<Dictionary<string, object?>> Events5MApart =
    [
        MakeEvent("Fileheader", "2024-01-01T00:00:00Z", new() { ["part"] = 1L }),
        MakeEvent("LoadGame", "2024-01-01T00:05:00Z", new() { ["Commander"] = "Test", ["Ship"] = "SideWinder", ["ShipID"] = 1L }),
        MakeEvent("FSDJump", "2024-01-01T00:10:00Z", new() { ["StarSystem"] = "Sol", ["SystemAddress"] = 1L }),
    ];

    [Fact]
    public void LoadEvents_LoadsFromArray()
    {
        var replay = new JournalReplay();
        replay.LoadEvents(Events1SApart);
        Assert.Equal(3, replay.TotalEvents);
        Assert.Equal(ReplayState.Idle, replay.State);
    }

    [Fact]
    public void LoadEvents_WithFilter()
    {
        var replay = new JournalReplay(new JournalReplayOptions { Filter = ["FSDJump"] });
        replay.LoadEvents(Events1SApart);
        Assert.Equal(1, replay.TotalEvents);
    }

    [Fact]
    public void Defaults()
    {
        var replay = new JournalReplay();
        Assert.Equal(0, replay.TotalEvents);
        Assert.Equal(0, replay.CurrentIndex);
        Assert.Equal(1.0, replay.Speed);
    }

    [Fact]
    public async Task Play_AllEvents()
    {
        var replay = new JournalReplay(new JournalReplayOptions { Speed = 100 });
        replay.LoadEvents(Events1SApart);

        var events = new List<Dictionary<string, object?>>();
        var startCalled = false;
        var endCalled = false;

        replay.EventReplayed += e => events.Add(e);
        replay.PlaybackStarted += () => startCalled = true;
        replay.PlaybackEnded += () => endCalled = true;

        await replay.PlayAsync();

        Assert.Equal(3, events.Count);
        Assert.Equal("Fileheader", events[0]["event"]);
        Assert.Equal("LoadGame", events[1]["event"]);
        Assert.Equal("FSDJump", events[2]["event"]);
        Assert.True(startCalled);
        Assert.True(endCalled);
        Assert.Equal(ReplayState.Ended, replay.State);
    }

    [Fact]
    public async Task Play_NoEvents()
    {
        var replay = new JournalReplay();
        var endCalled = false;
        replay.PlaybackEnded += () => endCalled = true;

        await replay.PlayAsync();
        Assert.False(endCalled);
    }

    [Fact]
    public async Task PauseAndResume()
    {
        var replay = new JournalReplay();
        replay.LoadEvents(Events5MApart);

        var events = new List<Dictionary<string, object?>>();
        var pauseCalled = false;
        var resumeCalled = false;

        replay.EventReplayed += e => events.Add(e);
        replay.PlaybackPaused += () => pauseCalled = true;
        replay.PlaybackResumed += () => resumeCalled = true;

        var playTask = replay.PlayAsync();
        await Task.Delay(50);

        Assert.Single(events);
        Assert.Equal(ReplayState.Playing, replay.State);

        replay.Pause();
        Assert.Equal(ReplayState.Paused, replay.State);
        Assert.True(pauseCalled);

        var countAfterPause = events.Count;
        await Task.Delay(100);
        Assert.Equal(countAfterPause, events.Count);

        replay.Speed = 100;
        replay.Resume();
        Assert.Equal(ReplayState.Playing, replay.State);
        Assert.True(resumeCalled);

        await playTask;
        Assert.Equal(3, events.Count);
    }

    [Fact]
    public async Task Stop_ResetsToIdle()
    {
        var replay = new JournalReplay();
        replay.LoadEvents(Events5MApart);

        var stopCalled = false;
        replay.PlaybackStopped += () => stopCalled = true;

        var playTask = replay.PlayAsync();
        await Task.Delay(50);

        replay.Stop();
        Assert.Equal(0, replay.CurrentIndex);
        Assert.True(stopCalled);
        await playTask;
    }

    [Fact]
    public void Seek_ToIndex()
    {
        var replay = new JournalReplay();
        replay.LoadEvents(Events1SApart);

        var seekIndex = -1;
        replay.Seeked += i => seekIndex = i;

        replay.Seek(1);
        Assert.Equal(1, replay.CurrentIndex);
        Assert.Equal(1, seekIndex);
    }

    [Fact]
    public void Seek_Clamps()
    {
        var replay = new JournalReplay();
        replay.LoadEvents(Events1SApart);

        replay.Seek(-5);
        Assert.Equal(0, replay.CurrentIndex);

        replay.Seek(999);
        Assert.Equal(2, replay.CurrentIndex);
    }

    [Fact]
    public void Speed_DefaultsToOne()
    {
        var replay = new JournalReplay();
        Assert.Equal(1.0, replay.Speed);
    }

    [Fact]
    public void Speed_ClampsMinimum()
    {
        var replay = new JournalReplay();
        replay.Speed = -5;
        Assert.Equal(0.1, replay.Speed);
    }

    [Fact]
    public async Task Filter_OnLoad()
    {
        var replay = new JournalReplay(new JournalReplayOptions { Filter = ["FSDJump", "LoadGame"] });
        replay.LoadEvents(Events1SApart);
        Assert.Equal(2, replay.TotalEvents);
    }

    [Fact]
    public async Task Load_FromFile()
    {
        var path = Path.Combine(_tmpDir, "Journal.2024-01-01T000000_01.log");
        await File.WriteAllTextAsync(path,
            "{\"timestamp\":\"2024-01-01T00:00:00Z\",\"event\":\"Fileheader\",\"part\":1}\n" +
            "{\"timestamp\":\"2024-01-01T00:00:01Z\",\"event\":\"LoadGame\",\"Commander\":\"Test\",\"Ship\":\"SideWinder\",\"ShipID\":1}\n");

        var replay = new JournalReplay();
        await replay.LoadAsync(path);
        Assert.Equal(2, replay.TotalEvents);
    }

    [Fact]
    public async Task Load_FromDirectory()
    {
        var file1 = Path.Combine(_tmpDir, "Journal.2024-01-01T000000_01.log");
        var file2 = Path.Combine(_tmpDir, "Journal.2024-01-01T010000_01.log");
        await File.WriteAllTextAsync(file1, "{\"timestamp\":\"2024-01-01T00:00:00Z\",\"event\":\"Fileheader\",\"part\":1}\n");
        await File.WriteAllTextAsync(file2, "{\"timestamp\":\"2024-01-01T01:00:00Z\",\"event\":\"LoadGame\",\"Commander\":\"Test\",\"Ship\":\"SideWinder\",\"ShipID\":1}\n");

        var replay = new JournalReplay();
        await replay.LoadAsync(_tmpDir);
        Assert.Equal(2, replay.TotalEvents);
    }

    [Fact]
    public async Task SameTimestamp_Events()
    {
        var events = new List<Dictionary<string, object?>>
        {
            MakeEvent("Fileheader", "2024-01-01T00:00:00Z", new() { ["part"] = 1L }),
            MakeEvent("Docked", "2024-01-01T00:00:00Z", new() { ["StationName"] = "TEST" }),
        };

        var replay = new JournalReplay(new JournalReplayOptions { Speed = 100 });
        replay.LoadEvents(events);

        var emitted = new List<Dictionary<string, object?>>();
        replay.EventReplayed += e => emitted.Add(e);

        await replay.PlayAsync();
        Assert.Equal(2, emitted.Count);
    }
}
