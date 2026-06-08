using EliteDangerousSdk.Journal;

string? dirArg = args.Length > 0 ? args[0] : null;

// === Read all existing events ===
if (args.Contains("--watch"))
{
    await WatchLiveAsync(dirArg);
}
else if (args.Contains("--companion"))
{
    ReadCompanionFiles(dirArg);
}
else
{
    ReadAllEvents(dirArg);
}

// === Read all existing journal events ===
static void ReadAllEvents(string? directory)
{
    var reader = new JournalReader(new JournalOptions
    {
        Directory = directory,
        Position = JournalOptions.StartFromBeginning().Position,
    });

    Console.WriteLine($"Reading from: {reader.Directory}");

    foreach (var ev in reader.ReadEvents())
    {
        var eventName = ev.GetValueOrDefault("event")?.ToString();
        if (eventName == null) continue;

        switch (eventName)
        {
            case "FileHeader":
                Console.WriteLine($"Session started: v{ev.GetValueOrDefault("gameversion")} (build {ev.GetValueOrDefault("build")})");
                break;
            case "LoadGame":
                Console.WriteLine($"Commander {ev.GetValueOrDefault("Commander")} in {ev.GetValueOrDefault("Ship")}");
                break;
            case "FSDJump":
                Console.WriteLine($"Jumped to {ev.GetValueOrDefault("StarSystem")} ({ev.GetValueOrDefault("JumpDist")} ly)");
                break;
            case "Docked":
                Console.WriteLine($"Docked at {ev.GetValueOrDefault("StationName")}");
                break;
            case "Scan":
                Console.WriteLine($"Scanned {ev.GetValueOrDefault("BodyName")}");
                break;
            case "Location":
                Console.WriteLine($"Location: {ev.GetValueOrDefault("StarSystem")}");
                break;
        }
    }
}

// === Watch for live journal events ===
static async Task WatchLiveAsync(string? directory)
{
    var dir = directory ?? JournalReader.GetDefaultJournalDir();
    var watcher = new JournalWatcher(dir);

    Console.WriteLine($"Watching for new journal events in {dir}...");
    await foreach (var ev in watcher.WatchEventsAsync())
    {
        Console.WriteLine($"[{ev.GetValueOrDefault("event")}] {ev.GetValueOrDefault("timestamp")}");
    }
}

// === Read Status.json and Market.json companion files ===
static void ReadCompanionFiles(string? directory)
{
    var reader = new JournalReader(new JournalOptions { Directory = directory });

    var status = reader.ReadStatus();
    if (status != null)
    {
        Console.WriteLine($"Status: Flags={status["Flags"]}, Cargo={status["Cargo"]}");
        if (status.TryGetValue("Fuel", out var fuelObj) && fuelObj is Dictionary<string, object> fuel)
        {
            Console.WriteLine($"Fuel: {fuel["FuelMain"]}t / {fuel["FuelReservoir"]}t");
        }
        if (status.TryGetValue("Pips", out var pipsObj) && pipsObj is List<object> pips && pips.Count >= 3)
        {
            Console.WriteLine($"Pips: SYS={pips[0]} ENG={pips[1]} WEP={pips[2]}");
        }
    }

    var market = reader.ReadMarket();
    if (market != null)
    {
        Console.WriteLine($"Market: {market["StarSystem"]} / {market["StationName"]}");
        if (market.TryGetValue("Items", out var itemsObj) && itemsObj is List<object> items)
        {
            Console.WriteLine($"{items.Count} commodities listed");
        }
    }
}
