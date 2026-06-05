using System.Text.Json;

namespace EliteDangerousSdk.Journal;

public record JournalPosition(string File, long Offset, int Line);

public record JournalOptions
{
    public string? Directory { get; init; }
    public JournalPosition? Position { get; init; }

    public static JournalOptions StartFromBeginning() => new() { Position = new JournalPosition("", 0, 0) };
    public static JournalOptions Default() => new();
}

public class JournalReader
{
    private readonly string _directory;
    private JournalPosition? _position;

    public JournalReader(JournalOptions? options = null)
    {
        _directory = options?.Directory ?? GetDefaultJournalDir();

        if (options?.Position is { File: "", Offset: 0 })
        {
            _position = null;
        }
        else
        {
            _position = options?.Position;
            if (_position == null)
            {
                var files = ListJournalFiles(_directory);
                if (files.Count > 0)
                {
                    var lastFile = files[^1];
                    _position = new JournalPosition(lastFile, new FileInfo(lastFile).Length, 0);
                }
            }
        }
    }

    public string Directory => _directory;
    public JournalPosition? Position { get => _position; set => _position = value; }

    public static string GetDefaultJournalDir()
    {
        var envDir = Environment.GetEnvironmentVariable("ED_JOURNAL_DIR");
        if (!string.IsNullOrEmpty(envDir)) return envDir;

        if (OperatingSystem.IsWindows())
        {
            return Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                "Saved Games", "Frontier Developments", "Elite Dangerous"
            );
        }
        var home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
        return Path.Combine(
            home, ".local/share/Steam/steamapps/compatdata/359320/pfx/drive_c/users/steamuser",
            "Saved Games", "Frontier Developments", "Elite Dangerous"
        );
    }

    public static List<string> ListJournalFiles(string directory)
    {
        if (!System.IO.Directory.Exists(directory)) return [];

        return System.IO.Directory.GetFiles(directory, "Journal.*.log")
            .Where(f => System.Text.RegularExpressions.Regex.IsMatch(
                Path.GetFileName(f), @"^Journal\.\d{4}-\d{2}-\d{2}T\d{6}_\d{2}\.log$"))
            .OrderBy(f => f)
            .ToList();
    }

    public IEnumerable<Dictionary<string, object?>> ReadEvents()
    {
        if (_position is { File: "", Offset: 0 })
        {
            _position = null;
        }

        var files = ListJournalFiles(_directory);
        int startIndex = 0;

        if (_position != null)
        {
            var idx = files.FindIndex(f => f == _position.File);
            if (idx >= 0) startIndex = idx;
        }

        foreach (var file in files.Skip(startIndex))
        {
            using var stream = File.OpenRead(file);
            if (_position != null && file == _position.File)
            {
                stream.Seek(_position.Offset, SeekOrigin.Begin);
            }

            using var reader = new StreamReader(stream);
            string? line;
            while ((line = reader.ReadLine()) != null)
            {
                line = line.Trim();
                if (string.IsNullOrEmpty(line)) continue;

                Dictionary<string, object?>? event_ = null;
                try
                {
                    event_ = Parser.ParseLine(line);
                }
                catch { }

                if (event_ != null)
                {
                    _position = new JournalPosition(file, stream.Position, 0);
                    yield return event_;
                }
            }
        }

        _position = null;
    }

    private Dictionary<string, object?>? ReadJsonFile(string filename)
    {
        try
        {
            var content = File.ReadAllText(Path.Combine(_directory, filename));
            return JsonSerializer.Deserialize<Dictionary<string, object?>>(content);
        }
        catch
        {
            return null;
        }
    }

    public Dictionary<string, object?>? ReadStatus()
    {
        return ReadJsonFile("Status.json");
    }

    public Dictionary<string, object?>? ReadMarket()
    {
        return ReadJsonFile("Market.json");
    }

    public Dictionary<string, object?>? ReadOutfitting()
    {
        return ReadJsonFile("Outfitting.json");
    }

    public Dictionary<string, object?>? ReadShipyard()
    {
        return ReadJsonFile("Shipyard.json");
    }

    public Dictionary<string, object?>? ReadCargo()
    {
        return ReadJsonFile("Cargo.json");
    }
}
