using System.Runtime.CompilerServices;

namespace EliteDangerousSdk.Journal;

public record JournalStreamOptions
{
    public string? Directory { get; init; }
    public string From { get; init; } = "end";
    public string[]? Filter { get; init; }
    public int PollIntervalMs { get; init; } = 500;
    public bool WarnOnUnknown { get; init; }
}

public static class JournalStream
{
    public static async IAsyncEnumerable<Dictionary<string, object?>> CreateJournalStream(
        JournalStreamOptions? options = null,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        var dir = options?.Directory ?? JournalReader.GetDefaultJournalDir();
        var filterSet = options?.Filter is { Length: > 0 } ? new HashSet<string>(options.Filter) : null;
        var pollInterval = options?.PollIntervalMs ?? 500;
        var warnOnUnknown = options?.WarnOnUnknown ?? false;
        var trackedSizes = new Dictionary<string, long>();

        var files = JournalReader.ListJournalFiles(dir);

        // Phase 1: Catch-up
        if (options?.From != "end")
        {
            foreach (var file in files)
            {
                if (ct.IsCancellationRequested) yield break;
                var size = new FileInfo(file).Length;
                trackedSizes[file] = size;
                if (size <= 0) continue;

                using var stream = File.OpenRead(file);
                using var reader = new StreamReader(stream);
                string? line;
                while ((line = reader.ReadLine()) != null)
                {
                    if (ct.IsCancellationRequested) yield break;
                    line = line.Trim();
                    if (string.IsNullOrEmpty(line)) continue;
                    Dictionary<string, object?>? ev = null;
                    try
                    {
                        ev = Parser.ParseLine(line);
                    }
                    catch { }
                    if (ev != null && (filterSet == null || filterSet.Contains(ev.GetValueOrDefault("event") as string ?? "")))
                    {
                        JournalReader.WarnIfUnknown(ev, warnOnUnknown);
                        yield return ev;
                    }
                }
            }
        }
        else
        {
            foreach (var file in files)
            {
                try { trackedSizes[file] = new FileInfo(file).Length; }
                catch { }
            }
        }

        // Phase 2: Live polling
        while (!ct.IsCancellationRequested)
        {
            var currentFiles = JournalReader.ListJournalFiles(dir);
            foreach (var file in currentFiles)
            {
                if (ct.IsCancellationRequested) yield break;

                var prevSize = trackedSizes.GetValueOrDefault(file, 0L);
                long currentSize;
                try { currentSize = new FileInfo(file).Length; }
                catch { continue; }

                if (currentSize > prevSize)
                {
                    using var fs = File.OpenRead(file);
                    fs.Seek(prevSize, SeekOrigin.Begin);
                    using var sr = new StreamReader(fs);
                    string? line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        if (ct.IsCancellationRequested) yield break;
                        line = line.Trim();
                        if (string.IsNullOrEmpty(line)) continue;
                        Dictionary<string, object?>? ev = null;
                        try
                        {
                            ev = Parser.ParseLine(line);
                        }
                        catch { }
                        if (ev != null && (filterSet == null || filterSet.Contains(ev.GetValueOrDefault("event") as string ?? "")))
                        {
                            JournalReader.WarnIfUnknown(ev, warnOnUnknown);
                            yield return ev;
                        }
                    }
                    trackedSizes[file] = fs.Position;
                }
                else if (currentSize < prevSize)
                {
                    trackedSizes[file] = currentSize;
                }
            }

            try { await Task.Delay(pollInterval, ct); }
            catch (OperationCanceledException) { break; }
        }
    }
}
