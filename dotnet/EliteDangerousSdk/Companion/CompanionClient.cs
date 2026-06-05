namespace EliteDangerousSdk.Companion;

using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

/// <summary>
/// Frontier oAuth2 authentication for the Companion API.
/// </summary>
public class FrontierAuth
{
    public const string AuthBase = "https://auth.frontierstore.net";

    private readonly string _clientId;
    private readonly string _redirectUri;
    private readonly string _userAgent;
    private readonly HttpClient _http;

    public FrontierAuth(string clientId, string redirectUri, string appName, string appVersion)
    {
        _clientId = clientId;
        _redirectUri = redirectUri;
        _userAgent = $"EDCD-{appName}-{appVersion}";
        _http = new HttpClient();
        _http.DefaultRequestHeaders.Add("User-Agent", _userAgent);
    }

    public string UserAgent => _userAgent;

    public static string GenerateCodeVerifier()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    public static string GenerateCodeChallenge(string verifier)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(verifier));
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    public string? AccessToken { get; private set; }
    public string? RefreshToken { get; private set; }
    public DateTime? ExpiresAt { get; private set; }
    public bool IsAuthenticated => AccessToken != null;

    /// <summary>
    /// Build the authorization URL for the user to visit.
    /// </summary>
    public string BuildAuthUrl(string codeChallenge, string state)
    {
        return $"https://auth.frontierstore.net/auth" +
               $"?audience=frontier" +
               $"&scope=auth%20capi" +
               $"&response_type=code" +
               $"&client_id={_clientId}" +
               $"&code_challenge={codeChallenge}" +
               $"&code_challenge_method=S256" +
               $"&state={state}" +
               $"&redirect_uri={Uri.EscapeDataString(_redirectUri)}";
    }

    /// <summary>
    /// Exchange authorization code for tokens.
    /// </summary>
    public async Task ExchangeCodeAsync(string code, string codeVerifier, string state, string expectedState)
    {
        if (state != expectedState)
            throw new InvalidOperationException("State mismatch - possible CSRF attack");

        var form = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("redirect_uri", _redirectUri),
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
            new KeyValuePair<string, string>("code_verifier", codeVerifier),
            new KeyValuePair<string, string>("client_id", _clientId),
        });

        var resp = await _http.PostAsync($"{AuthBase}/token", form);
        resp.EnsureSuccessStatusCode();

        var json = await resp.Content.ReadFromJsonAsync<JsonElement>();
        AccessToken = json.GetProperty("access_token").GetString();
        RefreshToken = json.GetProperty("refresh_token").GetString();
        var expiresIn = json.GetProperty("expires_in").GetInt32();
        ExpiresAt = DateTime.UtcNow.AddSeconds(expiresIn);
    }

    /// <summary>
    /// Refresh access token.
    /// </summary>
    public async Task RefreshTokensAsync()
    {
        if (string.IsNullOrEmpty(RefreshToken))
            throw new InvalidOperationException("No refresh token available");

        var form = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "refresh_token"),
            new KeyValuePair<string, string>("client_id", _clientId),
            new KeyValuePair<string, string>("refresh_token", RefreshToken),
        });

        var resp = await _http.PostAsync($"{AuthBase}/token", form);

        if (resp.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity)
        {
            AccessToken = null;
            RefreshToken = null;
            resp.EnsureSuccessStatusCode();
        }

        var json = await resp.Content.ReadFromJsonAsync<JsonElement>();
        AccessToken = json.GetProperty("access_token").GetString();
        RefreshToken = json.GetProperty("refresh_token").GetString();
        var expiresIn = json.GetProperty("expires_in").GetInt32();
        ExpiresAt = DateTime.UtcNow.AddSeconds(expiresIn);
    }

    /// <summary>
    /// Get a valid access token, refreshing if necessary.
    /// </summary>
    public async Task<string> GetValidTokenAsync()
    {
        if (string.IsNullOrEmpty(AccessToken))
            throw new InvalidOperationException("Not authenticated");

        // Refresh if expired or within 5 minutes
        if (ExpiresAt.HasValue && DateTime.UtcNow > ExpiresAt.Value.AddMinutes(-5))
        {
            await RefreshTokensAsync();
        }

        return AccessToken!;
    }
}

/// <summary>
/// Client for Frontier Companion API (CAPI).
/// </summary>
public class CompanionClient
{
    public const string LiveHost = "https://companion.orerve.net";
    public const string LegacyHost = "https://legacy-companion.orerve.net";

    private readonly FrontierAuth _auth;
    private readonly string _host;
    private readonly HttpClient _http;

    public CompanionClient(FrontierAuth auth, string galaxy = "live")
    {
        _auth = auth;
        _host = galaxy == "legacy" ? "https://legacy-companion.orerve.net" : "https://companion.orerve.net";
        _http = new HttpClient();
    }

    private async Task<T> RequestAsync<T>(string path)
    {
        var token = await _auth.GetValidTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_host}{path}");
        request.Headers.Add("Authorization", $"Bearer {token}");
        request.Headers.Add("User-Agent", _auth.UserAgent);

        var resp = await _http.SendAsync(request);

        if (resp.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity)
        {
            await _auth.RefreshTokensAsync();
            return await RequestAsync<T>(path);
        }

        resp.EnsureSuccessStatusCode();
        var json = await resp.Content.ReadFromJsonAsync<T>();
        return json!;
    }

    private async Task<byte[]> RequestBinaryAsync(string path, int retries = 5)
    {
        var token = await _auth.GetValidTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_host}{path}");
        request.Headers.Add("Authorization", $"Bearer {token}");
        request.Headers.Add("User-Agent", _auth.UserAgent);

        var resp = await _http.SendAsync(request);

        if (resp.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity)
        {
            await _auth.RefreshTokensAsync();
            return await RequestBinaryAsync(path, retries);
        }

        if (resp.StatusCode == (System.Net.HttpStatusCode)102)
        {
            if (retries > 0)
            {
                await Task.Delay(10000);
                return await RequestBinaryAsync(path, retries - 1);
            }
        }

        resp.EnsureSuccessStatusCode();
        return await resp.Content.ReadAsByteArrayAsync();
    }

    public Task<CapProfileResponse> GetProfileAsync() => RequestAsync<CapProfileResponse>("/profile");
    public Task<CapMarketResponse> GetMarketAsync() => RequestAsync<CapMarketResponse>("/market");
    public Task<CapShipyardResponse> GetShipyardAsync() => RequestAsync<CapShipyardResponse>("/shipyard");
    public Task<CapFleetCarrierResponse> GetFleetCarrierAsync() => RequestAsync<CapFleetCarrierResponse>("/fleetcarrier");
    public Task<JsonElement> GetJournalAsync(int? year = null, int? month = null, int? day = null)
    {
        var path = "/journal";
        if (year.HasValue)
        {
            path += $"/{year}";
            if (month.HasValue)
            {
                path += $"/{month}";
                if (day.HasValue)
                    path += $"/{day}";
            }
        }
        return RequestAsync<JsonElement>(path);
    }
    public Task<JsonElement> GetCommunityGoalsAsync() => RequestAsync<JsonElement>("/communitygoals");

    public async Task<bool> IsDockedAsync()
    {
        try
        {
            var profile = await GetProfileAsync();
            return profile.Commander?.Docked == true;
        }
        catch
        {
            return false;
        }
    }

    public Task<byte[]> GetVisitedStarsAsync() => RequestBinaryAsync("/visitedstars");
}
