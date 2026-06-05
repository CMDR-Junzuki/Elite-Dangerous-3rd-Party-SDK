using System.Reflection;
using System.Net;
using System.Text;
using System.Text.Json;
using Xunit;
using EliteDangerousSdk.Spansh;

namespace EliteDangerousSdk.Tests;

public class SpanshTests
{
    private static SpanshClient CreateClient(HttpClient http)
    {
        var client = new SpanshClient();
        typeof(SpanshClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);
        return client;
    }

    [Fact]
    public async Task GetSystemAsync_ById()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("/api/system/12345", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(@"{""name"":""Sol"",""id64"":12345,""x"":0,""y"":0,""z"":0}", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemAsync(12345);
        Assert.Equal("Sol", result.Name);
    }

    [Fact]
    public async Task GetStationAsync_ByMarketId()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("/api/station/999", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(@"{""name"":""Test"",""market_id"":999,""type"":""Station"",""system_name"":""Sol"",""system_id64"":1,""system_x"":0,""system_y"":0,""system_z"":0,""distanceToArrival"":0}", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetStationAsync(999);
        Assert.Equal(999, result.MarketId);
    }

    [Fact]
    public async Task GetBodyAsync_ById()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("/api/body/555", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(@"{""body_id64"":555}", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetBodyAsync(555);
        Assert.Equal(555, result.GetProperty("body_id64").GetInt64());
    }

    [Fact]
    public async Task SearchAsync_EncodesQuery()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("q=Sol", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{}", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.SearchAsync("Sol");
        Assert.Null(result.Systems);
    }

    [Fact]
    public async Task SearchSystemNamesAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("system_names", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.SearchSystemNamesAsync("Sol");
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetCommodityLocationsAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("/api/commodity/buy/Sol/Palladium/100", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetCommodityLocationsAsync("buy", "Sol", "Palladium", 100);
        Assert.Empty(result);
    }

    [Fact]
    public async Task SearchStationsAsync_PostRequest()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Equal(HttpMethod.Post, req.Method);
            Assert.Contains("/api/stations/search", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(@"{""count"":0,""from"":0,""results"":[],""search_reference"":"""",""size"":0}", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.SearchStationsAsync(new StationSearchRequest());
        Assert.Equal(0, result.Count);
    }

    [Fact]
    public async Task DumpSystemAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("/api/dump/12345", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(@"{""name"":""Sol"",""id64"":12345,""x"":0,""y"":0,""z"":0}", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.DumpSystemAsync(12345);
        Assert.Equal("Sol", result.Name);
    }

    [Fact]
    public async Task SearchFactionsAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("minor_factions", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.SearchFactionsAsync("fed");
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetRouteAsync_PostRequest()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Equal(HttpMethod.Post, req.Method);
            Assert.Contains("/api/route", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(@"{""jumps"":[],""distance"":0,""total_jumps"":287,""total_distance"":0,""efficiency"":0,""range"":0}", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetRouteAsync(new RouteRequest { From = "Sol", To = "Colonia", Range = 50 });
        Assert.Equal(287, result.TotalJumps);
    }

    [Fact]
    public async Task GetNearestAsync_BuildsQueryParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("/api/nearest", req.RequestUri!.ToString());
            Assert.Contains("system=Sol", req.RequestUri!.ToString());
            Assert.Contains("type=material_trader", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetNearestAsync("Sol", "material_trader");
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetControllingFactionsAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://spansh.co.uk", req =>
        {
            Assert.Contains("controlling_minor_faction", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetControllingFactionsAsync();
        Assert.Empty(result);
    }
}
