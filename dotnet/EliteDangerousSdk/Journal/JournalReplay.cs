using System.Text.Json;

namespace EliteDangerousSdk.Journal;

public enum ReplayState
{
    Idle,
    Playing,
    Paused,
    Ended
}

public record JournalReplayOptions
{
    public double Speed { get; init; } = 1.0;
    public HashSet<string>? Filter { get; init; }
}

public class JournalReplay : IDisposable
{
    private List<Dictionary<string, object?>> _events = [];
    private int _currentIndex;
    private double _speed;
    private HashSet<string>? _filter;
    private ReplayState _state = ReplayState.Idle;
    private Timer? _timer;
    private CancellationTokenSource? _cts;
    private TaskCompletionSource? _playTcs;
    private bool _disposed;

    public JournalReplay(JournalReplayOptions? options = null)
    {
        _speed = Math.Max(0.1, options?.Speed ?? 1.0);
        _filter = options?.Filter;
    }

    public event Action<Dictionary<string, object?>>? EventReplayed;
    public event Action? PlaybackStarted;
    public event Action? PlaybackEnded;
    public event Action? PlaybackPaused;
    public event Action? PlaybackResumed;
    public event Action? PlaybackStopped;
    public event Action<int>? Seeked;

    public double Speed
    {
        get => _speed;
        set => _speed = Math.Max(0.1, value);
    }

    public int CurrentIndex => _currentIndex;
    public int TotalEvents => _events.Count;
    public ReplayState State => _state;

    public void LoadEvents(IEnumerable<Dictionary<string, object?>> events)
    {
        if (_filter != null)
            _events = events.Where(e => e.TryGetValue("event", out var ev) && ev is string s && _filter.Contains(s)).ToList();
        else
            _events = [.. events];
    }

    public async Task LoadAsync(string fileOrDir)
    {
        _events.Clear();

        if (Directory.Exists(fileOrDir))
        {
            var files = JournalReader.ListJournalFiles(fileOrDir);
            foreach (var file in files)
            {
                await LoadFileAsync(file);
            }
        }
        else if (File.Exists(fileOrDir))
        {
            await LoadFileAsync(fileOrDir);
        }
    }

    private async Task LoadFileAsync(string path)
    {
        var lines = await File.ReadAllLinesAsync(path);
        foreach (var line in lines)
        {
            var trimmed = line.Trim();
            if (string.IsNullOrEmpty(trimmed)) continue;

            try
            {
                var ev = Parser.ParseLine(trimmed);
                if (_filter == null || (ev.TryGetValue("event", out var val) && val is string s && _filter.Contains(s)))
                {
                    _events.Add(ev);
                }
            }
            catch
            {
                // skip malformed lines
            }
        }
    }

    public Task PlayAsync()
    {
        if (_events.Count == 0) return Task.CompletedTask;
        if (_state == ReplayState.Paused)
        {
            Resume();
            return _playTcs?.Task ?? Task.CompletedTask;
        }

        _state = ReplayState.Playing;
        _currentIndex = 0;
        _cts = new CancellationTokenSource();
        _playTcs = new TaskCompletionSource();

        PlaybackStarted?.Invoke();

        ScheduleNext();

        return _playTcs.Task;
    }

    private void ScheduleNext()
    {
        if (_state != ReplayState.Playing) return;

        if (_currentIndex >= _events.Count)
        {
            Finalize_();
            return;
        }

        var ev = _events[_currentIndex];
        EventReplayed?.Invoke(ev);
        _currentIndex++;

        if (_currentIndex >= _events.Count)
        {
            Finalize_();
            return;
        }

        var delayMs = GetDelayMs();
        _timer = new Timer(_ => ScheduleNext(), null, delayMs, Timeout.Infinite);
    }

    private void Finalize_()
    {
        _state = ReplayState.Ended;
        PlaybackEnded?.Invoke();
        _playTcs?.TrySetResult();
    }

    private int GetDelayMs()
    {
        var from = _events[_currentIndex - 1];
        var to = _events[_currentIndex];

        var fromTs = ParseTimestamp(from);
        var toTs = ParseTimestamp(to);

        if (fromTs == null || toTs == null || toTs <= fromTs)
            return 100;

        var delta = (toTs.Value - fromTs.Value).TotalMilliseconds;
        return (int)Math.Max(10, Math.Min(10000, delta / _speed));
    }

    private static DateTimeOffset? ParseTimestamp(Dictionary<string, object?> ev)
    {
        if (!ev.TryGetValue("timestamp", out var val) || val is not string s)
            return null;
        if (DateTimeOffset.TryParse(s, out var dto))
            return dto;
        return null;
    }

    public void Pause()
    {
        if (_state != ReplayState.Playing) return;
        _state = ReplayState.Paused;
        _timer?.Dispose();
        _timer = null;
        PlaybackPaused?.Invoke();
    }

    public void Resume()
    {
        if (_state != ReplayState.Paused) return;
        _state = ReplayState.Playing;
        PlaybackResumed?.Invoke();
        ScheduleNext();
    }

    public void Stop()
    {
        _timer?.Dispose();
        _timer = null;

        if (_state is ReplayState.Playing or ReplayState.Paused)
        {
            _state = ReplayState.Idle;
            _currentIndex = 0;
            _cts?.Cancel();
            PlaybackStopped?.Invoke();
            _playTcs?.TrySetResult();
        }
    }

    public void Seek(int index)
    {
        if (_events.Count == 0) return;
        if (index < 0) index = 0;
        if (index >= _events.Count) index = _events.Count - 1;

        _currentIndex = index;
        if (_timer != null)
        {
            _timer.Dispose();
            _timer = null;
            if (_state == ReplayState.Playing)
                ScheduleNext();
        }
        Seeked?.Invoke(index);
    }

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        _timer?.Dispose();
        _cts?.Cancel();
        _cts?.Dispose();
        GC.SuppressFinalize(this);
    }
}
