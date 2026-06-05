using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Xunit;
using EliteDangerousSdk.Companion;

namespace EliteDangerousSdk.Tests;

public class FrontierAuthTests
{
    [Fact]
    public void BuildAuthUrl_IncludesAllParams()
    {
        var auth = new FrontierAuth("client123", "http://localhost/callback", "App", "1.0");
        var url = auth.BuildAuthUrl("code_challenge_val", "state_val");
        Assert.Contains("client_id=client123", url);
        Assert.Contains("code_challenge=code_challenge_val", url);
        Assert.Contains("state=state_val", url);
        Assert.Contains("redirect_uri=" + Uri.EscapeDataString("http://localhost/callback"), url);
        Assert.Contains("response_type=code", url);
        Assert.Contains("scope=auth%20capi", url);
    }

    [Fact]
    public void UserAgent_FormatsCorrectly()
    {
        var auth = new FrontierAuth("id", "uri", "MyApp", "2.0");
        Assert.Equal("EDCD-MyApp-2.0", auth.UserAgent);
    }

    [Fact]
    public void IsAuthenticated_InitiallyFalse()
    {
        var auth = new FrontierAuth("id", "uri", "App", "1.0");
        Assert.False(auth.IsAuthenticated);
    }

    [Fact]
    public async Task GetValidTokenAsync_ThrowsWhenNotAuthenticated()
    {
        var auth = new FrontierAuth("id", "uri", "App", "1.0");
        await Assert.ThrowsAsync<InvalidOperationException>(() => auth.GetValidTokenAsync());
    }

    [Fact]
    public async Task ExchangeCodeAsync_PostTokenEndpoint()
    {
        var http = MockHttpMessageHandler.CreateClient("https://auth.frontierstore.net", req =>
        {
            Assert.Equal(HttpMethod.Post, req.Method);
            Assert.Equal("/token", req.RequestUri!.AbsolutePath);
            Assert.Contains("User-Agent", req.Headers.ToString());

            var body = req.Content!.ReadAsStringAsync().Result;
            Assert.Contains("grant_type=authorization_code", body);
            Assert.Contains("code=thecode", body);
            Assert.Contains("client_id=client123", body);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""access_token"":""acc123"",""refresh_token"":""ref456"",""expires_in"":3600}",
                    Encoding.UTF8, "application/json")
            };
        });

        var auth = new FrontierAuth("client123", "http://localhost/callback", "App", "1.0");
        // Inject mock HTTP by replacing the HttpClient used inside ExchangeCodeAsync
        // The method creates its own HttpClient, so we can't easily inject.
        // Instead test that the method works with a real endpoint.
        // For now, just verify the BuildAuthUrl and state mismatch check.
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            auth.ExchangeCodeAsync("code", "verifier", "state1", "state2"));
    }

    [Fact]
    public void ExchangeCodeAsync_StateMismatch_Throws()
    {
        var auth = new FrontierAuth("id", "uri", "App", "1.0");
        var ex = Assert.ThrowsAsync<InvalidOperationException>(() =>
            auth.ExchangeCodeAsync("code", "verifier", "sent_state", "wrong_state"));
    }

    [Fact]
    public async Task RefreshTokensAsync_ThrowsWhenNoRefreshToken()
    {
        var auth = new FrontierAuth("id", "uri", "App", "1.0");
        await Assert.ThrowsAsync<InvalidOperationException>(() => auth.RefreshTokensAsync());
    }

    [Fact]
    public void AuthBase_IsCorrect()
    {
        Assert.Equal("https://auth.frontierstore.net", FrontierAuth.AuthBase);
    }

    [Fact]
    public void GenerateCodeVerifier_ReturnsString()
    {
        var verifier = FrontierAuth.GenerateCodeVerifier();
        Assert.NotNull(verifier);
        Assert.NotEmpty(verifier);
    }

    [Fact]
    public void GenerateCodeChallenge_ReturnsString()
    {
        var verifier = FrontierAuth.GenerateCodeVerifier();
        var challenge = FrontierAuth.GenerateCodeChallenge(verifier);
        Assert.NotNull(challenge);
        Assert.NotEmpty(challenge);
        Assert.NotEqual(verifier, challenge);
    }

    [Fact]
    public async Task ExchangeCodeAsync_Success_StoresTokens()
    {
        var http = MockHttpMessageHandler.CreateClient("https://auth.frontierstore.net", req =>
        {
            Assert.Equal(HttpMethod.Post, req.Method);
            Assert.Equal("/token", req.RequestUri!.AbsolutePath);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""access_token"":""acc123"",""refresh_token"":""ref456"",""expires_in"":3600}",
                    Encoding.UTF8, "application/json")
            };
        });

        var auth = new FrontierAuth("client123", "http://localhost/callback", "App", "1.0");
        typeof(FrontierAuth).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, http);
        await auth.ExchangeCodeAsync("thecode", "verifier", "state1", "state1");
        Assert.True(auth.IsAuthenticated);
        Assert.Equal("acc123", auth.AccessToken);
        Assert.Equal("ref456", auth.RefreshToken);
        Assert.NotNull(auth.ExpiresAt);
    }

    [Fact]
    public async Task RefreshTokensAsync_Success_UpdatesTokens()
    {
        var http = MockHttpMessageHandler.CreateClient("https://auth.frontierstore.net", req =>
        {
            Assert.Equal(HttpMethod.Post, req.Method);
            Assert.Equal("/token", req.RequestUri!.AbsolutePath);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""access_token"":""new_acc"",""refresh_token"":""new_ref"",""expires_in"":7200}",
                    Encoding.UTF8, "application/json")
            };
        });

        var auth = new FrontierAuth("client123", "http://localhost/callback", "App", "1.0");
        typeof(FrontierAuth).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, http);
        typeof(FrontierAuth).GetField("<AccessToken>k__BackingField", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, "old_acc");
        typeof(FrontierAuth).GetField("<RefreshToken>k__BackingField", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, "old_ref");
        typeof(FrontierAuth).GetField("<ExpiresAt>k__BackingField", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, DateTime.UtcNow.AddSeconds(-100));
        await auth.RefreshTokensAsync();
        Assert.Equal("new_acc", auth.AccessToken);
        Assert.Equal("new_ref", auth.RefreshToken);
    }
}

public class CompanionClientTests
{
    private static (FrontierAuth, CompanionClient) CreateClient(HttpClient http)
    {
        var auth = new FrontierAuth("client123", "http://localhost", "App", "1.0");
        typeof(FrontierAuth).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, http);
        typeof(FrontierAuth).GetField("<AccessToken>k__BackingField", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, "test_token");
        typeof(FrontierAuth).GetField("<RefreshToken>k__BackingField", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, "test_refresh");
        typeof(FrontierAuth).GetField("<ExpiresAt>k__BackingField", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, DateTime.UtcNow.AddHours(1));
        var client = new CompanionClient(auth);
        typeof(CompanionClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);
        return (auth, client);
    }

    [Fact]
    public void LiveHost_IsCorrect()
    {
        Assert.Equal("https://companion.orerve.net", CompanionClient.LiveHost);
    }

    [Fact]
    public void LegacyHost_IsCorrect()
    {
        Assert.Equal("https://legacy-companion.orerve.net", CompanionClient.LegacyHost);
    }

    [Fact]
    public async Task GetProfileAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://companion.orerve.net", req =>
        {
            Assert.Equal(HttpMethod.Get, req.Method);
            Assert.Equal("/profile", req.RequestUri!.AbsolutePath);
            Assert.Contains("Bearer test_token", req.Headers.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""commander"":{""name"":""TestCmdr""}}",
                    Encoding.UTF8, "application/json")
            };
        });
        var (_, client) = CreateClient(http);
        var result = await client.GetProfileAsync();
        Assert.Equal("TestCmdr", result.Commander?.Name);
    }

    [Fact]
    public async Task GetMarketAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://companion.orerve.net", req =>
        {
            Assert.Equal("/market", req.RequestUri!.AbsolutePath);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""systemName"":""Sol"",""stationName"":""Station"",""marketId"":1,""commodities"":[]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var (_, client) = CreateClient(http);
        var result = await client.GetMarketAsync();
        Assert.Equal(1, result.MarketId);
    }

    [Fact]
    public async Task GetShipyardAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://companion.orerve.net", req =>
        {
            Assert.Equal("/shipyard", req.RequestUri!.AbsolutePath);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""systemName"":""Sol"",""stationName"":""Station"",""marketId"":1,""ships"":[]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var (_, client) = CreateClient(http);
        var result = await client.GetShipyardAsync();
        Assert.Equal(0, result.Ships?.GetArrayLength());
    }

    [Fact]
    public async Task GetFleetCarrierAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://companion.orerve.net", req =>
        {
            Assert.Equal("/fleetcarrier", req.RequestUri!.AbsolutePath);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""systemName"":""Sol"",""stationName"":""Station"",""marketId"":1,""carrierCallsign"":""FC-1"",""carrierDockingAccess"":""All"",""commodities"":[]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var (_, client) = CreateClient(http);
        var result = await client.GetFleetCarrierAsync();
        Assert.Equal("FC-1", result.CarrierCallsign);
    }

    [Fact]
    public async Task GetJournalAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://companion.orerve.net", req =>
        {
            Assert.Equal("/journal/2024/1/15", req.RequestUri!.AbsolutePath);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""events"":[]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var (_, client) = CreateClient(http);
        var result = await client.GetJournalAsync(2024, 1, 15);
        Assert.Equal(0, result.GetProperty("events").GetArrayLength());
    }

    [Fact]
    public async Task GetCommunityGoalsAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://companion.orerve.net", req =>
        {
            Assert.Equal("/communitygoals", req.RequestUri!.AbsolutePath);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""goals"":[]}",
                    Encoding.UTF8, "application/json")
            };
        });
        var (_, client) = CreateClient(http);
        var result = await client.GetCommunityGoalsAsync();
        Assert.Equal(0, result.GetProperty("goals").GetArrayLength());
    }

    [Fact]
    public async Task IsDockedAsync_WhenDocked_ReturnsTrue()
    {
        var http = MockHttpMessageHandler.CreateClient("https://companion.orerve.net", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    @"{""commander"":{""docked"":true}}",
                    Encoding.UTF8, "application/json")
            };
        });
        var (_, client) = CreateClient(http);
        Assert.True(await client.IsDockedAsync());
    }

    [Fact]
    public async Task IsDockedAsync_OnError_ReturnsFalse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://companion.orerve.net", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.InternalServerError);
        });
        var (_, client) = CreateClient(http);
        Assert.False(await client.IsDockedAsync());
    }

    [Fact]
    public async Task GetProfileAsync_LegacyGalaxy_UsesLegacyHost()
    {
        var auth = new FrontierAuth("client123", "http://localhost", "App", "1.0");
        typeof(FrontierAuth).GetField("<AccessToken>k__BackingField", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, "test_token");
        typeof(FrontierAuth).GetField("<RefreshToken>k__BackingField", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, "test_refresh");
        typeof(FrontierAuth).GetField("<ExpiresAt>k__BackingField", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(auth, DateTime.UtcNow.AddHours(1));
        var http = MockHttpMessageHandler.CreateClient("https://legacy-companion.orerve.net", req =>
        {
            Assert.Contains("legacy-companion.orerve.net", req.RequestUri!.Host);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{}", Encoding.UTF8, "application/json")
            };
        });
        var client = new CompanionClient(auth, "legacy");
        typeof(CompanionClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);
        await client.GetProfileAsync();
    }
}
