namespace EliteDangerousSdk.EDSM;

using System.Net.Http.Json;
using System.Text.Json;

public class EDSMClient
{
    private readonly string? _apiKey;
    private readonly string? _commanderName;
    private readonly HttpClient _http;

    public EDSMClient(string? apiKey = null, string? commanderName = null)
    {
        _apiKey = apiKey;
        _commanderName = commanderName;
        _http = new HttpClient { BaseAddress = new Uri("https://www.edsm.net") };
    }

    private async Task<T> GetAsync<T>(string path, Dictionary<string, string>? extraParams = null)
    {
        var url = path;
        var query = new List<string>();
        if (_apiKey != null) query.Add($"apiKey={_apiKey}");
        if (_commanderName != null) query.Add($"commanderName={_commanderName}");
        if (extraParams != null)
            query.AddRange(extraParams.Select(kv => $"{kv.Key}={Uri.EscapeDataString(kv.Value)}"));
        if (query.Count > 0) url += "?" + string.Join("&", query);

        var resp = await _http.GetAsync(url);
        resp.EnsureSuccessStatusCode();
        return (await resp.Content.ReadFromJsonAsync<T>())!;
    }

    private static string Bool(int value) => value.ToString();

    public Task<SystemResponse> GetSystemAsync(
        string systemName,
        bool showPermit = false,
        bool showInformation = false,
        bool showPrimaryStar = false)
        => GetAsync<SystemResponse>("/api-v1/system", new()
        {
            { "systemName", systemName },
            { "showId", "1" },
            { "showCoordinates", "1" },
            { "showPermit", Bool(showPermit ? 1 : 0) },
            { "showInformation", Bool(showInformation ? 1 : 0) },
            { "showPrimaryStar", Bool(showPrimaryStar ? 1 : 0) }
        });

    public Task<List<SystemResponse>> GetSystemsAsync(string[] systemNames)
    {
        var p = new Dictionary<string, string> { { "showId", "1" }, { "showCoordinates", "1" } };
        for (int i = 0; i < systemNames.Length; i++)
            p[$"systemName[{i}]"] = systemNames[i];
        return GetAsync<List<SystemResponse>>("/api-v1/systems", p);
    }

    public Task<List<SphereSystemResult>> GetSphereSystemsAsync(
        string systemName, double radius,
        double? minRadius = null,
        bool showId = true, bool showCoordinates = true)
    {
        var p = new Dictionary<string, string>
        {
            { "systemName", systemName },
            { "radius", Math.Min(radius, 100).ToString() },
            { "minRadius", (minRadius ?? 0).ToString() },
            { "showId", Bool(showId ? 1 : 0) },
            { "showCoordinates", Bool(showCoordinates ? 1 : 0) }
        };
        return GetAsync<List<SphereSystemResult>>("/api-v1/sphere-systems", p);
    }

    public Task<List<SystemResponse>> GetCubeSystemsAsync(
        string systemName, double size,
        bool showId = true, bool showCoordinates = true)
        => GetAsync<List<SystemResponse>>("/api-v1/cube-systems", new()
        {
            { "systemName", systemName },
            { "size", Math.Min(size, 200).ToString() },
            { "showId", Bool(showId ? 1 : 0) },
            { "showCoordinates", Bool(showCoordinates ? 1 : 0) }
        });

    public Task<BodiesResponse> GetSystemBodiesAsync(string systemName, int? systemId = null)
        => GetAsync<BodiesResponse>("/api-system-v1/bodies", new()
        {
            { "systemName", systemName },
            { "systemId", (systemId ?? 0).ToString() }
        });

    public Task<EstimatedValue> GetSystemEstimatedValueAsync(string systemName, int? systemId = null)
        => GetAsync<EstimatedValue>("/api-system-v1/estimated-value", new()
        {
            { "systemName", systemName },
            { "systemId", (systemId ?? 0).ToString() }
        });

    public Task<StationsResponse> GetSystemStationsAsync(string systemName, int? systemId = null)
        => GetAsync<StationsResponse>("/api-system-v1/stations", new()
        {
            { "systemName", systemName },
            { "systemId", (systemId ?? 0).ToString() }
        });

    public Task<FactionsResponse> GetSystemFactionsAsync(string systemName, int? systemId = null)
        => GetAsync<FactionsResponse>("/api-system-v1/factions", new()
        {
            { "systemName", systemName },
            { "systemId", (systemId ?? 0).ToString() }
        });

    public Task<MarketData> GetStationMarketAsync(string systemName, string stationName)
        => GetAsync<MarketData>("/api-system-v1/stations/market", new()
        {
            { "systemName", systemName },
            { "stationName", stationName }
        });

    public Task<ShipyardData> GetStationShipyardAsync(string systemName, string stationName)
        => GetAsync<ShipyardData>("/api-system-v1/stations/shipyard", new()
        {
            { "systemName", systemName },
            { "stationName", stationName }
        });

    public Task<OutfittingData> GetStationOutfittingAsync(string systemName, string stationName)
        => GetAsync<OutfittingData>("/api-system-v1/stations/outfitting", new()
        {
            { "systemName", systemName },
            { "stationName", stationName }
        });

    public Task<TrafficResponse> GetSystemTrafficAsync(string systemName, int? systemId = null)
        => GetAsync<TrafficResponse>("/api-system-v1/traffic", new()
        {
            { "systemName", systemName },
            { "systemId", (systemId ?? 0).ToString() }
        });

    public Task<DeathsResponse> GetSystemDeathsAsync(string systemName, int? systemId = null)
        => GetAsync<DeathsResponse>("/api-system-v1/deaths", new()
        {
            { "systemName", systemName },
            { "systemId", (systemId ?? 0).ToString() }
        });

    public Task<JsonElement> GetCommanderRanksAsync()
        => GetAsync<JsonElement>("/api-commander-v1/get-ranks");

    public Task<JsonElement> GetCommanderLogsAsync(
        string? systemName = null,
        string? startDateTime = null,
        string? endDateTime = null,
        bool? showId = null)
    {
        var p = new Dictionary<string, string>();
        if (systemName != null) p["systemName"] = systemName;
        if (startDateTime != null) p["startDateTime"] = startDateTime;
        if (endDateTime != null) p["endDateTime"] = endDateTime;
        if (showId != null) p["showId"] = Bool(showId.Value ? 1 : 0);
        return GetAsync<JsonElement>("/api-logs-v1/get-logs", p);
    }

    public Task<JsonElement> SubmitJournalAsync(
        string fromSoftware,
        string fromSoftwareVersion,
        string message,
        string? fromGameVersion = null,
        string? fromGameBuild = null)
        => PostAsync<JsonElement>("/api-journal-v1", new()
        {
            { "fromSoftware", fromSoftware },
            { "fromSoftwareVersion", fromSoftwareVersion },
            { "message", message },
            { "fromGameVersion", fromGameVersion ?? "" },
            { "fromGameBuild", fromGameBuild ?? "" }
        });

    public Task<List<string>> GetDiscardEventsAsync()
        => GetAsync<List<string>>("/api-journal-v1/discard");

    private async Task<T> PostAsync<T>(string path, Dictionary<string, string>? bodyParams = null)
    {
        var body = new Dictionary<string, string>();
        if (_apiKey != null) body["apiKey"] = _apiKey;
        if (_commanderName != null) body["commanderName"] = _commanderName;
        if (bodyParams != null)
            foreach (var kv in bodyParams)
                body[kv.Key] = kv.Value;

        var resp = await _http.PostAsync(path, new FormUrlEncodedContent(body));
        resp.EnsureSuccessStatusCode();
        return (await resp.Content.ReadFromJsonAsync<T>())!;
    }
}
