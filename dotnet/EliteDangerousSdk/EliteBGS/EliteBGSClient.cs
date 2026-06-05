using System.Collections;
using System.Net.Http.Json;
using System.Text.Json;
using System.Web;

namespace EliteDangerousSdk.EliteBGS;

public class EliteBGSClient
{
    private readonly HttpClient _http;
    private readonly double _minIntervalMs;
    private DateTime _lastRequest = DateTime.MinValue;

    public EliteBGSClient(int rpm = 20, string? baseUrl = null)
    {
        _http = new HttpClient { BaseAddress = new Uri(baseUrl ?? "https://elitebgs.app/api/ebgs/v5") };
        _minIntervalMs = 60_000.0 / rpm;
    }

    private async Task RateLimit()
    {
        var elapsed = (DateTime.UtcNow - _lastRequest).TotalMilliseconds;
        if (elapsed < _minIntervalMs)
            await Task.Delay((int)(_minIntervalMs - elapsed));
        _lastRequest = DateTime.UtcNow;
    }

    private static string GetQueryKey(string propName) => propName switch
    {
        "PrimaryEconomy" => "primaryEconomy",
        "SecondaryEconomy" => "secondaryEconomy",
        "ActiveState" => "activeState",
        "PendingState" => "pendingState",
        "RecoveringState" => "recoveringState",
        "ReferenceSystem" => "referenceSystem",
        "ReferenceDistance" => "referenceDistance",
        "BeginsWith" => "beginsWith",
        "FactionDetails" => "factionDetails",
        "SystemDetails" => "systemDetails",
        "InfluenceGT" => "influenceGT",
        "InfluenceLT" => "influenceLT",
        "TimeMin" => "timeMin",
        "TimeMax" => "timeMax",
        "EddbId" => "eddbId",
        "ReferenceSystemId" => "referenceSystemId",
        "ReferenceDistanceMin" => "referenceDistanceMin",
        "FactionAllegiance" => "factionAllegiance",
        "FactionGovernment" => "factionGovernment",
        "FactionControl" => "factionControl",
        "FactionHistory" => "factionHistory",
        "FilterSystemInHistory" => "filterSystemInHistory",
        "FactionId" => "factionId",
        var x => x[..1].ToLower() + x[1..],
    };

    private string BuildQuery<T>(T query) where T : class
    {
        var parts = new List<string>();
        foreach (var prop in typeof(T).GetProperties())
        {
            var val = prop.GetValue(query);
            if (val == null) continue;
            var key = GetQueryKey(prop.Name);

            if (val is IEnumerable enumerable and not string)
            {
                foreach (var item in enumerable)
                {
                    if (item != null)
                        parts.Add($"{key}={HttpUtility.UrlEncode(item.ToString() ?? "")}");
                }
            }
            else
            {
                var strVal = val is bool b ? b.ToString().ToLower() : val.ToString();
                if (strVal != null)
                    parts.Add($"{key}={HttpUtility.UrlEncode(strVal)}");
            }
        }
        return parts.Count > 0 ? "?" + string.Join("&", parts) : "";
    }

    private async Task<T> GetAsync<T>(string path, string? query = null)
    {
        await RateLimit();
        var url = path + (query ?? "");
        var resp = await _http.GetAsync(url);
        resp.EnsureSuccessStatusCode();
        return (await resp.Content.ReadFromJsonAsync<T>())!;
    }

    public Task<PaginatedResponse<EBGSSystem>> GetSystemsAsync(SystemsQuery? query = null)
        => GetAsync<PaginatedResponse<EBGSSystem>>("/systems", query != null ? BuildQuery(query) : null);

    public Task<PaginatedResponse<EBGSFaction>> GetFactionsAsync(FactionsQuery? query = null)
        => GetAsync<PaginatedResponse<EBGSFaction>>("/factions", query != null ? BuildQuery(query) : null);

    public Task<PaginatedResponse<EBGSStation>> GetStationsAsync(StationsQuery? query = null)
        => GetAsync<PaginatedResponse<EBGSStation>>("/stations", query != null ? BuildQuery(query) : null);

    public async Task<List<TickTime>> GetTicksAsync(TicksQuery? query = null)
    {
        var result = await GetAsync<List<TickTime>>("/ticks", query != null ? BuildQuery(query) : null);
        return result;
    }

    public Task<PaginatedResponse<EBGSSystem>> GetSystemByNameAsync(string name)
        => GetSystemsAsync(new SystemsQuery { Name = [name], Page = 1 });

    public Task<PaginatedResponse<EBGSFaction>> GetFactionByNameAsync(string name)
        => GetFactionsAsync(new FactionsQuery { Name = [name], Page = 1 });

    public Task<PaginatedResponse<EBGSStation>> GetStationsBySystemAsync(string systemName)
        => GetStationsAsync(new StationsQuery { System = [systemName] });

    public async Task<TickTime?> GetLatestTickAsync()
    {
        var ticks = await GetTicksAsync();
        return ticks.Count > 0 ? ticks[0] : null;
    }
}
