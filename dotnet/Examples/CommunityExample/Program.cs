using EliteDangerousSdk.EDSM;
using EliteDangerousSdk.Inara;
using EliteDangerousSdk.EDDN;
using EliteDangerousSdk.Spansh;

// === EDSM ===
static async Task ExploreSystemAsync()
{
    var edsm = new EDSMClient();

    var sol = await edsm.GetSystemAsync("Sol");
    Console.WriteLine($"Sol ID: {sol.Id}");
    Console.WriteLine($"Coords: {sol.Coords?.X}, {sol.Coords?.Y}, {sol.Coords?.Z}");

    var bodies = await edsm.GetSystemBodiesAsync("Sol");
    Console.WriteLine($"Bodies in Sol: {bodies.Bodies?.Count ?? 0}");
    if (bodies.Bodies != null)
    {
        foreach (var body in bodies.Bodies.Take(5))
        {
            Console.WriteLine($"  {body.Name} ({body.Type}: {body.SubType})");
        }
    }

    var stations = await edsm.GetSystemStationsAsync("Sol");
    Console.WriteLine($"Stations: {stations.Stations?.Count ?? 0}");

    var nearby = await edsm.GetSphereSystemsAsync("Sol", 20);
    Console.WriteLine($"Systems within 20 ly of Sol: {nearby.Count}");

    var market = await edsm.GetStationMarketAsync("Sol", "Li Qing Jao");
    Console.WriteLine($"Market: {market.Items?.Count ?? 0} items");

    var factions = await edsm.GetSystemFactionsAsync("Sol");
    if (factions.Factions != null)
    {
        foreach (var faction in factions.Factions)
        {
            Console.WriteLine($"  {faction.Name}: {faction.Influence}% influence");
        }
    }
}

// === Inara ===
static async Task UpdateInaraAsync()
{
    var inara = new InaraClient(
        appName: "MyEliteTool",
        appVersion: "1.0.0",
        apiKey: "your-inara-api-key",
        isDeveloping: true
    );

    var profile = await inara.SendEventsAsync(new() { inara.GetCommanderProfile() });
    Console.WriteLine("Profile response: " + System.Text.Json.JsonSerializer.Serialize(profile));

    await inara.SendEventsAsync(new()
    {
        inara.AddCommanderTravelFsdJump("Sol", new[] { 0.0, 0.0, 0.0 }),
        inara.AddCommanderTravelDock("Li Qing Jao", "Sol"),
        new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderCredits",
            ["eventData"] = new Dictionary<string, object>
            {
                ["commanderCredits"] = 1_000_000_000,
                ["commanderCreditsInBank"] = 1_000_000_000,
            },
        },
        new Dictionary<string, object>
        {
            ["eventName"] = "setCommanderRank",
            ["eventData"] = new Dictionary<string, object>
            {
                ["rankCombat"] = 5,
                ["rankTrade"] = 8,
                ["rankExplore"] = 10,
            },
        },
    });
}

// === EDDN ===
static async Task ShareDataAsync()
{
    var eddn = new EDDNClient(
        softwareName: "MyEliteTool",
        softwareVersion: "1.0.0"
    );

    await eddn.SendCommodityAsync(
        "Sol", "Li Qing Jao", 128000000,
        new List<Dictionary<string, object?>>
        {
            new()
            {
                ["name"] = "Hydrogen Fuel",
                ["buyPrice"] = 120,
                ["sellPrice"] = 140,
                ["meanPrice"] = 130,
                ["stockBracket"] = 2,
                ["demandBracket"] = 2,
                ["stock"] = 50000,
                ["demand"] = 0,
            },
            new()
            {
                ["name"] = "Gold",
                ["buyPrice"] = 9000,
                ["sellPrice"] = 9500,
                ["meanPrice"] = 9300,
                ["stockBracket"] = 1,
                ["demandBracket"] = 2,
                ["stock"] = 150,
                ["demand"] = 200,
            },
        },
        "4.0.0.1451", "r286916/r0");

    await eddn.SendShipyardAsync(
        "Sol", "Li Qing Jao", 128000000,
        new List<string> { "Krait_MkII", "Python", "Anaconda", "Type-9" },
        "4.0.0.1451", "r286916/r0");
}

// === Spansh ===
static async Task SearchAndPlanAsync()
{
    var spansh = new SpanshClient();

    var searchResults = await spansh.SearchAsync("Sol");
    Console.WriteLine("Search results: " + System.Text.Json.JsonSerializer.Serialize(searchResults));

    var names = await spansh.SearchSystemNamesAsync("Sag A");
    Console.WriteLine("Matching systems: " + System.Text.Json.JsonSerializer.Serialize(names));

    var system = await spansh.GetSystemAsync(10477373803);
    Console.WriteLine($"System: {system.Name} ({system.X}, {system.Y}, {system.Z})");

    var buyers = await spansh.GetCommodityLocationsAsync("sell", "Sol", "Platinum", 100);
    Console.WriteLine($"Best places to sell Platinum near Sol: {buyers.Count}");

    var traders = await spansh.SearchStationsAsync(new StationSearchRequest
    {
        Filters = new()
        {
            ["services"] = new SearchFilter { Value = new() { "Material Trader" } },
        },
        Sort = new()
        {
            new() { ["distance"] = new SortDirection { Direction = "asc" } },
        },
        Size = 5,
        Page = 0,
        ReferenceCoords = new CoordsRef(0, 0, 0),
    });
    Console.WriteLine($"Material traders found: {traders.Count}");
    foreach (var station in traders.Results.Take(5))
    {
        Console.WriteLine($"  {station.Name} @ {station.SystemName}");
    }
}

// Main
string cmd = args.Length > 0 ? args[0] : "";

switch (cmd)
{
    case "edsm":
        await ExploreSystemAsync();
        break;
    case "inara":
        await UpdateInaraAsync();
        break;
    case "eddn":
        await ShareDataAsync();
        break;
    case "spansh":
        await SearchAndPlanAsync();
        break;
    default:
        Console.WriteLine("Usage: dotnet run [edsm|inara|eddn|spansh]");
        Console.WriteLine("  edsm   - Query EDSM for system data");
        Console.WriteLine("  inara  - Update Inara commander profile");
        Console.WriteLine("  eddn   - Share market data via EDDN");
        Console.WriteLine("  spansh - Search Spansh routes and stations");
        break;
}
