using Xunit;
using EliteDangerousSdk.Journal;
using System.Net.WebSockets;
using System.Text;

namespace EliteDangerousSdk.Tests;

public class JournalWebSocketServerTests : IDisposable
{
    private readonly string _tmpDir;

    public JournalWebSocketServerTests()
    {
        _tmpDir = Path.Combine(Path.GetTempPath(), "ed-ws-journal-tests-" + Guid.NewGuid().ToString("N"));
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
    public async Task Start_Stop()
    {
        var server = new JournalWebSocketServer(0, "127.0.0.1", _tmpDir);
        await server.StartAsync();
        Assert.True(server.IsRunning);
        Assert.Equal(0, server.ClientCount);
        await server.StopAsync();
        Assert.False(server.IsRunning);
    }

    [Fact]
    public async Task ClientConnectsAndReceivesEvents()
    {
        WriteJournal("Journal.2024-01-15T120000_01.log", new[] { @"{""event"":""Fileheader"",""timestamp"":""2024-01-15T12:00:00Z""}" });

        var server = new JournalWebSocketServer(0, "127.0.0.1", _tmpDir, pollIntervalMs: 100);
        await server.StartAsync();

        var ws = new ClientWebSocket();
        await ws.ConnectAsync(new Uri($"ws://127.0.0.1:{server.Port}/"), CancellationToken.None);
        await Task.Delay(200);
        Assert.Equal(1, server.ClientCount);

        WriteJournal("Journal.2024-01-15T130000_01.log", new[] { @"{""event"":""Location"",""timestamp"":""2024-01-15T13:00:00Z""}" });

        var buffer = new byte[4096];
        var receiveTask = ws.ReceiveAsync(buffer, CancellationToken.None);
        var timeoutTask = Task.Delay(3000);
        var completed = await Task.WhenAny(receiveTask, timeoutTask);
        Assert.Equal(receiveTask, completed);

        var result = await receiveTask;
        var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
        Assert.Contains("Location", message);

        await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
        await server.StopAsync();
    }

    [Fact]
    public async Task EventFilter()
    {
        var server = new JournalWebSocketServer(0, "127.0.0.1", _tmpDir, filter: new[] { "Location" }, pollIntervalMs: 100);
        await server.StartAsync();

        var ws = new ClientWebSocket();
        await ws.ConnectAsync(new Uri($"ws://127.0.0.1:{server.Port}/"), CancellationToken.None);
        await Task.Delay(300);

        // Write non-matching event (should be filtered out)
        WriteJournal("Journal.2024-01-15T120000_01.log", new[] { @"{""event"":""Fileheader""}" });
        await Task.Delay(500);

        // Verify client still connected — filter didn't crash server
        Assert.Equal(1, server.ClientCount);

        // Write matching event (should pass filter)
        WriteJournal("Journal.2024-01-15T130000_01.log", new[] { @"{""event"":""Location"",""timestamp"":""2024-01-15T13:00:00Z""}" });

        var buffer = new byte[4096];
        var receiveTask = ws.ReceiveAsync(buffer, CancellationToken.None);
        var timeoutTask = Task.Delay(5000);
        var completed = await Task.WhenAny(receiveTask, timeoutTask);

        Assert.True(completed == receiveTask, "Timed out waiting for Location event");

        var result = await receiveTask;
        var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
        Assert.Contains("Location", message);

        await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
        await server.StopAsync();
    }

    [Fact]
    public async Task ClientCount()
    {
        var server = new JournalWebSocketServer(0, "127.0.0.1", _tmpDir, pollIntervalMs: 100);
        await server.StartAsync();

        var ws1 = new ClientWebSocket();
        await ws1.ConnectAsync(new Uri($"ws://127.0.0.1:{server.Port}/"), CancellationToken.None);
        await Task.Delay(200);
        Assert.Equal(1, server.ClientCount);

        var ws2 = new ClientWebSocket();
        await ws2.ConnectAsync(new Uri($"ws://127.0.0.1:{server.Port}/"), CancellationToken.None);
        await Task.Delay(200);
        Assert.Equal(2, server.ClientCount);

        await ws1.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
        await Task.Delay(200);
        Assert.Equal(1, server.ClientCount);

        await ws2.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
        await Task.Delay(200);
        Assert.Equal(0, server.ClientCount);

        await server.StopAsync();
    }
}
