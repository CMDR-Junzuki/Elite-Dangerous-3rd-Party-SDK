namespace EliteDangerousSdk.Spansh;

using System.Net.Http.Json;
using System.Text.Json;

public class SpanshClient
{
    private readonly HttpClient _http;

    public SpanshClient(string? baseUrl = null)
    {
        _http = new HttpClient { BaseAddress = new Uri(baseUrl ?? "https://spansh.co.uk") };
    }

    private async Task<T> GetAsync<T>(string path)
    {
        var resp = await _http.GetAsync(path);
        resp.EnsureSuccessStatusCode();
        return (await resp.Content.ReadFromJsonAsync<T>())!;
    }

    private async Task<T> PostAsync<T>(string path, object body)
    {
        var resp = await _http.PostAsJsonAsync(path, body);
        resp.EnsureSuccessStatusCode();
        return (await resp.Content.ReadFromJsonAsync<T>())!;
    }

    public Task<SystemDetail> GetSystemAsync(long systemId64)
        => GetAsync<SystemDetail>($"/api/system/{systemId64}");

    public Task<StationDetail> GetStationAsync(long marketId)
        => GetAsync<StationDetail>($"/api/station/{marketId}");

    public Task<JsonElement> GetBodyAsync(long bodyId64)
        => GetAsync<JsonElement>($"/api/body/{bodyId64}");

    public Task<SearchResponse> SearchAsync(string query)
        => GetAsync<SearchResponse>($"/api/search?q={Uri.EscapeDataString(query)}");

    public Task<List<string>> SearchSystemNamesAsync(string query)
        => GetAsync<List<string>>($"/api/systems/field_values/system_names?q={Uri.EscapeDataString(query)}");

    public Task<List<CommodityLocation>> GetCommodityLocationsAsync(string type, string referenceSystem, string commodity, int amount)
        => GetAsync<List<CommodityLocation>>($"/api/commodity/{type}/{Uri.EscapeDataString(referenceSystem)}/{Uri.EscapeDataString(commodity)}/{amount}");

    public Task<StationSearchResponse> SearchStationsAsync(StationSearchRequest request)
        => PostAsync<StationSearchResponse>("/api/stations/search", request);

    public Task<SystemDetail> DumpSystemAsync(long systemId64)
        => GetAsync<SystemDetail>($"/api/dump/{systemId64}");

    public Task<List<string>> SearchFactionsAsync(string query)
        => GetAsync<List<string>>($"/api/systems/field_values/minor_factions?q={Uri.EscapeDataString(query)}");

    public Task<List<string>> GetControllingFactionsAsync()
        => GetAsync<List<string>>("/api/systems/field_values/controlling_minor_faction");

    public Task<RouteResult> GetRouteAsync(RouteRequest request)
        => PostAsync<RouteResult>("/api/route", request);

    public Task<List<NearestResult>> GetNearestAsync(string system, string type)
        => GetAsync<List<NearestResult>>($"/api/nearest?system={Uri.EscapeDataString(system)}&type={Uri.EscapeDataString(type)}");
}
