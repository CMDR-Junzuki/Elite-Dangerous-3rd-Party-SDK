using System.Collections.Concurrent;
using System.Runtime.CompilerServices;

namespace EliteDangerousSdk.Journal;

public class JournalWatcher : IDisposable
{
    private readonly string _directory;
    private CancellationTokenSource? _cts;
    private readonly ConcurrentDictionary<string, long> _positions = new();
    private readonly bool _warnOnUnknown;

    public JournalWatcher(string directory, bool warnOnUnknown = false)
    {
        _directory = directory;
        _warnOnUnknown = warnOnUnknown;
    }

    public async IAsyncEnumerable<Dictionary<string, object?>> WatchEventsAsync([EnumeratorCancellation] CancellationToken ct = default)
    {
        _cts = CancellationTokenSource.CreateLinkedTokenSource(ct);

        var files = JournalReader.ListJournalFiles(_directory);
        foreach (var f in files)
        {
            try { _positions.TryAdd(f, new FileInfo(f).Length); } catch { }
        }

        while (!_cts.IsCancellationRequested)
        {
            var currentFiles = JournalReader.ListJournalFiles(_directory);
            foreach (var file in currentFiles)
            {
                var prevSize = _positions.GetValueOrDefault(file, 0L);
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
                        Dictionary<string, object?>? ev = null;
                        try
                        {
                            ev = Parser.ParseLine(line);
                        }
                        catch { }
                        if (ev != null)
                        {
                            JournalReader.WarnIfUnknown(ev, _warnOnUnknown);
                            yield return ev;
                        }
                    }
                    _positions[file] = fs.Position;
                }
                else if (currentSize < prevSize)
                {
                    _positions[file] = currentSize;
                }
            }

            try { await Task.Delay(500, _cts.Token); } catch { break; }
        }
    }

    public void Stop()
    {
        _cts?.Cancel();
    }

    public void Dispose()
    {
        Stop();
        _cts?.Dispose();
    }
}
