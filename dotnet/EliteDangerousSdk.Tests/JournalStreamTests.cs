using Xunit;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using EliteDangerousSdk.Journal;

namespace EliteDangerousSdk.Tests;

public class JournalStreamTests
{
    private const string Event1 = "{\"timestamp\":\"2024-01-01T00:00:00Z\",\"event\":\"Docked\",\"StationName\":\"A\",\"MarketID\":1}\n";
    private const string Event2 = "{\"timestamp\":\"2024-01-01T00:01:00Z\",\"event\":\"Location\",\"System\":\"Sol\",\"SystemAddress\":1}\n";
    private const string Event3 = "{\"timestamp\":\"2024-01-01T00:02:00Z\",\"event\":\"Scan\",\"BodyName\":\"Earth\",\"BodyID\":1}\n";

    private static string CreateTempDir()
    {
        var dir = Path.Combine(Path.GetTempPath(), "journal-stream-test-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(dir);
        return dir;
    }

    private static void WriteJournalFile(string dir, string name, string[] lines)
    {
        File.WriteAllText(Path.Combine(dir, name), string.Join("", lines));
    }

    [Fact]
    public async Task ReadsExistingEventsFromStart()
    {
        var tmpDir = CreateTempDir();
        try
        {
            WriteJournalFile(tmpDir, "Journal.2024-01-01T000000_01.log", [Event1, Event2]);

            var events = new List<Dictionary<string, object?>>();
            var cts = new CancellationTokenSource();
            var count = 0;

            await foreach (var ev in JournalStream.CreateJournalStream(
                new JournalStreamOptions { Directory = tmpDir, From = "start" }, cts.Token))
            {
                events.Add(ev);
                count++;
                if (count >= 2) cts.Cancel();
            }

            Assert.Equal(2, events.Count);
            Assert.Equal("Docked", events[0]["event"]);
            Assert.Equal("Location", events[1]["event"]);
        }
        finally
        {
            Directory.Delete(tmpDir, true);
        }
    }

    [Fact]
    public async Task SkipsExistingEventsFromEnd()
    {
        var tmpDir = CreateTempDir();
        try
        {
            WriteJournalFile(tmpDir, "Journal.2024-01-01T000000_01.log", [Event1, Event2]);

            var events = new List<Dictionary<string, object?>>();
            var cts = new CancellationTokenSource();
            cts.CancelAfter(200); // Stop after 200ms of polling with no events

            await foreach (var ev in JournalStream.CreateJournalStream(
                new JournalStreamOptions { Directory = tmpDir, From = "end" }, cts.Token))
            {
                events.Add(ev);
            }

            Assert.Empty(events);
        }
        finally
        {
            Directory.Delete(tmpDir, true);
        }
    }

    [Fact]
    public async Task FiltersEventsByType()
    {
        var tmpDir = CreateTempDir();
        try
        {
            WriteJournalFile(tmpDir, "Journal.2024-01-01T000000_01.log", [Event1, Event2, Event3]);

            var events = new List<Dictionary<string, object?>>();
            var cts = new CancellationTokenSource();
            var count = 0;

            await foreach (var ev in JournalStream.CreateJournalStream(
                new JournalStreamOptions
                {
                    Directory = tmpDir,
                    From = "start",
                    Filter = ["Docked", "Scan"]
                }, cts.Token))
            {
                events.Add(ev);
                count++;
                if (count >= 2) cts.Cancel();
            }

            Assert.Equal(2, events.Count);
            Assert.Equal("Docked", events[0]["event"]);
            Assert.Equal("Scan", events[1]["event"]);
        }
        finally
        {
            Directory.Delete(tmpDir, true);
        }
    }

    [Fact]
    public async Task ReadsAcrossMultipleFiles()
    {
        var tmpDir = CreateTempDir();
        try
        {
            WriteJournalFile(tmpDir, "Journal.2024-01-01T000000_01.log", [Event1]);
            WriteJournalFile(tmpDir, "Journal.2024-01-01T010000_01.log", [Event2]);

            var events = new List<Dictionary<string, object?>>();
            var cts = new CancellationTokenSource();
            var count = 0;

            await foreach (var ev in JournalStream.CreateJournalStream(
                new JournalStreamOptions { Directory = tmpDir, From = "start" }, cts.Token))
            {
                events.Add(ev);
                count++;
                if (count >= 2) cts.Cancel();
            }

            Assert.Equal(2, events.Count);
        }
        finally
        {
            Directory.Delete(tmpDir, true);
        }
    }
}
