namespace EliteDangerousSdk.EDDN;

using System.IO.Compression;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

public class EDDNReceiver : IAsyncDisposable
{
    private readonly string _relayUrl;
    private ClientWebSocket? _ws;
    private CancellationTokenSource? _cts;

    public EDDNReceiver(string? relayUrl = null)
    {
        _relayUrl = relayUrl ?? "wss://eddn.edcd.io:9502";
    }

    public bool IsRunning => _ws?.State == WebSocketState.Open;

    public async IAsyncEnumerable<JsonElement> ReceiveAsync()
    {
        _ws = new ClientWebSocket();
        _cts = new CancellationTokenSource();
        await _ws.ConnectAsync(new Uri(_relayUrl), _cts.Token);

        var buffer = new byte[1024 * 256];

        while (_ws.State == WebSocketState.Open)
        {
            var result = await _ws.ReceiveAsync(new ArraySegment<byte>(buffer), _cts.Token);
            if (result.MessageType == WebSocketMessageType.Close)
            {
                await _ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                yield break;
            }

            if (result.MessageType != WebSocketMessageType.Binary) continue;

            var message = TryDecompress(buffer, result.Count);
            if (message.HasValue)
            {
                yield return message.Value;
            }
        }
    }

    private static JsonElement? TryDecompress(byte[] buffer, int count)
    {
        try
        {
            using var compressed = new MemoryStream(buffer, 0, count);
            using var decompressed = new MemoryStream();
            using (var zlib = new ZLibStream(compressed, CompressionMode.Decompress))
            {
                zlib.CopyTo(decompressed);
            }
            var json = Encoding.UTF8.GetString(decompressed.ToArray());
            return JsonSerializer.Deserialize<JsonElement>(json);
        }
        catch
        {
            return null;
        }
    }

    public void Stop()
    {
        _cts?.Cancel();
    }

    public async ValueTask DisposeAsync()
    {
        Stop();
        if (_ws != null)
        {
            if (_ws.State == WebSocketState.Open)
                await _ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
            _ws.Dispose();
        }
        _cts?.Dispose();
    }
}
