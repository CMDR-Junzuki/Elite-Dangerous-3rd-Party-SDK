using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace EliteDangerousSdk.Journal;

public class JournalWebSocketServer : IAsyncDisposable
{
    private readonly string _host;
    private readonly string _directory;
    private readonly HashSet<string> _filter;
    private readonly int _pollIntervalMs;
    private HttpListener? _listener;
    private readonly ConcurrentDictionary<WebSocket, byte> _clients = new();
    private readonly List<Dictionary<string, object?>> _eventBuffer = [];
    private readonly object _bufferLock = new();
    private CancellationTokenSource? _cts;
    private Task? _acceptLoop;
    private Task? _watchLoop;
    private volatile bool _running;
    private int _port;

    public JournalWebSocketServer(
        int port = 8080,
        string host = "127.0.0.1",
        string? journalDir = null,
        IEnumerable<string>? filter = null,
        int pollIntervalMs = 500)
    {
        _port = port;
        _host = host;
        _directory = journalDir ?? JournalReader.GetDefaultJournalDir();
        _filter = filter != null ? new HashSet<string>(filter) : [];
        _pollIntervalMs = pollIntervalMs;
    }

    public int Port => _port;
    public int ClientCount => _clients.Count;
    public bool IsRunning => _running;

    public async Task StartAsync()
    {
        if (_running) return;

        if (_port == 0)
        {
            using var tcp = new TcpListener(IPAddress.Loopback, 0);
            tcp.Start();
            _port = ((IPEndPoint)tcp.LocalEndpoint).Port;
            tcp.Stop();
        }

        _cts = new CancellationTokenSource();
        _listener = new HttpListener();
        _listener.Prefixes.Add($"http://{_host}:{_port}/");
        _listener.Start();
        _running = true;

        _acceptLoop = AcceptConnectionsAsync();
        _watchLoop = WatchJournalAsync(_cts.Token);
    }

    public async Task StopAsync()
    {
        _running = false;
        _cts?.Cancel();

        foreach (var ws in _clients.Keys)
        {
            try
            {
                if (ws.State is WebSocketState.Open or WebSocketState.CloseReceived)
                    await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Server shutting down", CancellationToken.None);
            }
            catch { }
            ws.Dispose();
        }
        _clients.Clear();
        lock (_bufferLock) { _eventBuffer.Clear(); }

        if (_listener != null)
        {
            try { _listener.Stop(); } catch { }
            _listener.Close();
            _listener = null;
        }

        if (_acceptLoop != null)
        {
            try { await _acceptLoop; } catch { }
        }
        if (_watchLoop != null)
        {
            try { await _watchLoop; } catch { }
        }
    }

    private async Task AcceptConnectionsAsync()
    {
        try
        {
            while (_running && _listener != null && _listener.IsListening)
            {
                HttpListenerContext context;
                try
                {
                    context = await _listener.GetContextAsync();
                }
                catch (HttpListenerException) { break; }
                catch (ObjectDisposedException) { break; }

                if (!context.Request.IsWebSocketRequest)
                {
                    context.Response.StatusCode = 400;
                    context.Response.Close();
                    continue;
                }

                WebSocket ws;
                try
                {
                    ws = (await context.AcceptWebSocketAsync(null)).WebSocket;
                }
                catch (WebSocketException) { continue; }

                _clients.TryAdd(ws, 0);
                FlushBufferToClientAsync(ws);
                _ = ReceiveLoopAsync(ws);
            }
        }
        catch (OperationCanceledException) { }
    }

    private async Task ReceiveLoopAsync(WebSocket ws)
    {
        var buffer = new byte[1024];
        try
        {
            while (ws.State == WebSocketState.Open)
            {
                var result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), _cts?.Token ?? CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Close)
                    break;
            }
        }
        catch { }
        finally
        {
            _clients.TryRemove(ws, out _);
            try
            {
                if (ws.State is WebSocketState.Open or WebSocketState.CloseReceived)
                    await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
            }
            catch { }
            ws.Dispose();
        }
    }

    private async Task WatchJournalAsync(CancellationToken ct)
    {
        var seenSizes = new Dictionary<string, long>();

        foreach (var f in JournalReader.ListJournalFiles(_directory))
        {
            try { seenSizes[f] = new FileInfo(f).Length; } catch { }
        }

        while (!ct.IsCancellationRequested && _running)
        {
            try
            {
                var files = JournalReader.ListJournalFiles(_directory);
                foreach (var file in files)
                {
                    var prevSize = seenSizes.GetValueOrDefault(file, 0L);
                    long currentSize;
                    try { currentSize = new FileInfo(file).Length; } catch { continue; }

                    if (currentSize > prevSize)
                    {
                        using var fs = File.OpenRead(file);
                        fs.Seek(prevSize, SeekOrigin.Begin);
                        using var sr = new StreamReader(fs);
                        string? line;
                        while ((line = sr.ReadLine()) != null)
                        {
                            line = line.Trim();
                            if (string.IsNullOrEmpty(line)) continue;
                            try
                            {
                                var ev = JsonSerializer.Deserialize<Dictionary<string, object?>>(line);
                                if (ev != null && ShouldSend(ev))
                                    Broadcast(ev);
                            }
                            catch { }
                        }
                        seenSizes[file] = fs.Position;
                    }
                    else if (currentSize < prevSize)
                    {
                        seenSizes[file] = currentSize;
                    }
                }
            }
            catch { }

            try { await Task.Delay(_pollIntervalMs, ct); } catch { break; }
        }
    }

    private bool ShouldSend(Dictionary<string, object?> ev)
    {
        if (_filter.Count == 0) return true;
        if (!ev.TryGetValue("event", out var e) || e == null) return false;
        var eventName = e is System.Text.Json.JsonElement je ? je.GetString() : e.ToString();
        return eventName != null && _filter.Contains(eventName);
    }

    private void FlushBufferToClientAsync(WebSocket ws)
    {
        List<Dictionary<string, object?>> snapshot;
        lock (_bufferLock)
        {
            snapshot = [.. _eventBuffer];
            _eventBuffer.Clear();
        }
        if (snapshot.Count == 0) return;
        _ = Task.Run(async () =>
        {
            foreach (var data in snapshot)
            {
                if (ws.State != WebSocketState.Open) break;
                try
                {
                    var json = JsonSerializer.Serialize(data);
                    var bytes = Encoding.UTF8.GetBytes(json);
                    await ws.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None);
                }
                catch { break; }
            }
        });
    }

    public void Broadcast(Dictionary<string, object?> eventData)
    {
        if (_clients.IsEmpty)
        {
            lock (_bufferLock)
            {
                if (_eventBuffer.Count < 100)
                    _eventBuffer.Add(eventData);
            }
            return;
        }

        var json = JsonSerializer.Serialize(eventData);
        var bytes = Encoding.UTF8.GetBytes(json);
        var segment = new ArraySegment<byte>(bytes);

        foreach (var ws in _clients.Keys)
        {
            if (ws.State == WebSocketState.Open)
            {
                _ = SendAndRemoveOnFailureAsync(ws, segment);
            }
        }
    }

    private async Task SendAndRemoveOnFailureAsync(WebSocket ws, ArraySegment<byte> data)
    {
        try
        {
            await ws.SendAsync(data, WebSocketMessageType.Text, true, CancellationToken.None);
        }
        catch
        {
            _clients.TryRemove(ws, out _);
        }
    }

    public async ValueTask DisposeAsync()
    {
        await StopAsync();
        _cts?.Dispose();
    }
}
