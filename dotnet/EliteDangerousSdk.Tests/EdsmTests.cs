using System.Reflection;
using System.Net;
using System.Text;
using System.Text.Json;
using Xunit;
using EliteDangerousSdk.EDSM;

namespace EliteDangerousSdk.Tests;

public class EdsmTests
{
    private static EDSMClient CreateClient(HttpClient http)
    {
        var client = new EDSMClient();
        typeof(EDSMClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);
        return client;
    }

    [Fact]
    public async Task GetSystemAsync_ReturnsParsedResponse()
    {
        var expected = JsonSerializer.Serialize(new { name = "Sol", id = 1 });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-v1/system", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(expected, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemAsync("Sol");
        Assert.Equal("Sol", result.Name);
        Assert.Equal(1, result.Id);
    }

    [Fact]
    public async Task GetSphereSystemsAsync_ClampsRadius()
    {
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("radius=100", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSphereSystemsAsync("Sol", 200);
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetSystemBodiesAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new { id = 1, name = "Sol", bodies = new object[] { } });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-system-v1/bodies", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemBodiesAsync("Sol");
        Assert.Equal("Sol", result.Name);
        Assert.Empty(result.Bodies);
    }

    [Fact]
    public async Task GetSystemStationsAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new { id = 1, name = "Sol", stations = new object[] { } });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-system-v1/stations", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemStationsAsync("Sol");
        Assert.Equal("Sol", result.Name);
        Assert.Empty(result.Stations);
    }

    [Fact]
    public async Task GetSystemFactionsAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new { id = 1, name = "Sol", factions = new object[] { } });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-system-v1/factions", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemFactionsAsync("Sol");
        Assert.Equal("Sol", result.Name);
        Assert.Empty(result.Factions);
    }

    [Fact]
    public async Task WithApiKey_AddsQueryParam()
    {
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("apiKey=test-key", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("""{"name":"","id":0}""", Encoding.UTF8, "application/json")
            };
        });
        var client = new EDSMClient("test-key", "cmdr");
        typeof(EDSMClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);
        var result = await client.GetSystemAsync("Sol");
        Assert.NotNull(result);
    }

    [Fact]
    public void BaseUrl_IsCorrect()
    {
        var client = new EDSMClient();
        var http = typeof(EDSMClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .GetValue(client) as HttpClient;
        Assert.Equal("https://www.edsm.net", http!.BaseAddress!.ToString().TrimEnd('/'));
    }

    [Fact]
    public void Construct_WithDefaults()
    {
        var client = new EDSMClient();
        Assert.NotNull(client);
    }

    [Fact]
    public void Construct_WithApiKey()
    {
        var client = new EDSMClient("test-key", "cmdr");
        Assert.NotNull(client);
    }

    [Fact]
    public async Task GetSystemAsync_WithOptionalParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            var url = req.RequestUri!.ToString();
            Assert.Contains("showPermit=1", url);
            Assert.Contains("showInformation=1", url);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("""{"name":"","id":0}""", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemAsync("Sol", showPermit: true, showInformation: true);
        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetSystemsAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new object[]
        {
            new { name = "Sol", id = 1L },
            new { name = "Alpha Centauri", id = 2L }
        });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-v1/systems", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemsAsync(new[] { "Sol", "Alpha Centauri" });
        Assert.Equal(2, result.Count);
        Assert.Equal("Sol", result[0].Name);
    }

    [Fact]
    public async Task GetSystemEstimatedValueAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new { estimatedValue = 5000000L, mappedValue = 0L, details = new object[] { } });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-system-v1/estimated-value", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemEstimatedValueAsync("Sol");
        Assert.Equal(5000000, result.Value);
    }

    [Fact]
    public async Task GetCubeSystemsAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new object[]
        {
            new { name = "Sol", id = 1L, distance = 0.0 }
        });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-v1/cube-systems", req.RequestUri!.ToString());
            Assert.Contains("size=50", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetCubeSystemsAsync("Sol", 50);
        Assert.Single(result);
        Assert.Equal("Sol", result[0].Name);
    }

    [Fact]
    public async Task GetStationMarketAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new { id = 1L, name = "Murchison Station", items = new object[] { } });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-system-v1/stations/market", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetStationMarketAsync("Sol", "Murchison Station");
        Assert.Equal("Murchison Station", result.Name);
        Assert.Empty(result.Items);
    }

    [Fact]
    public async Task GetStationShipyardAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new { id = 1L, name = "Murchison Station", ships = new object[] { } });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-system-v1/stations/shipyard", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetStationShipyardAsync("Sol", "Murchison Station");
        Assert.Equal("Murchison Station", result.Name);
        Assert.Empty(result.Ships);
    }

    [Fact]
    public async Task GetStationOutfittingAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new { id = 1L, name = "Murchison Station", modules = new object[] { } });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-system-v1/stations/outfitting", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetStationOutfittingAsync("Sol", "Murchison Station");
        Assert.Equal("Murchison Station", result.Name);
        Assert.Empty(result.Modules);
    }

    [Fact]
    public async Task GetSystemTrafficAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new { id = 1L, name = "Sol", traffic = new object[] { } });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-system-v1/traffic", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemTrafficAsync("Sol");
        Assert.Equal("Sol", result.Name);
        Assert.Empty(result.Traffic);
    }

    [Fact]
    public async Task GetSystemDeathsAsync_ReturnsResponse()
    {
        var json = JsonSerializer.Serialize(new { id = 1L, name = "Sol", deaths = new object[] { } });
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("/api-system-v1/deaths", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemDeathsAsync("Sol");
        Assert.Equal("Sol", result.Name);
        Assert.Empty(result.Deaths);
    }

    [Fact]
    public async Task HttpError_ThrowsException()
    {
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", _ =>
            new HttpResponseMessage(HttpStatusCode.TooManyRequests));
        var client = CreateClient(http);
        await Assert.ThrowsAsync<HttpRequestException>(() => client.GetSystemAsync("Sol"));
    }

    [Fact]
    public async Task GetCubeSystems_CapsSize()
    {
        var http = MockHttpMessageHandler.CreateClient("https://www.edsm.net", req =>
        {
            Assert.Contains("size=200", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetCubeSystemsAsync("Sol", 300);
        Assert.Empty(result);
    }
}
