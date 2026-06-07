using System.Reflection;
using System.Net;
using System.Text;
using Xunit;
using EliteDangerousSdk.EliteBGS;

namespace EliteDangerousSdk.Tests;

public class EliteBGSTests
{
    private static EliteBGSClient CreateClient(HttpClient http)
    {
        var client = new EliteBGSClient(1000);
        typeof(EliteBGSClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);
        return client;
    }

    private const string EmptyPage = """{"docs":[],"total":0,"limit":50,"page":1,"pages":0}""";

    [Fact]
    public async Task GetSystemsAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            Assert.Contains("/systems", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemsAsync();
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetFactionsAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            Assert.Contains("/factions", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetFactionsAsync();
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetStationsAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            Assert.Contains("/stations", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetStationsAsync();
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetTicksAsync_ReturnsResponse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            Assert.Contains("/ticks", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetTicksAsync();
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetSystemByNameAsync_UsesNameParam()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            Assert.Contains("name=Sol", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemByNameAsync("Sol");
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetFactionByNameAsync_UsesNameParam()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            Assert.Contains("name=Federation", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetFactionByNameAsync("Federation");
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetStationsBySystemAsync_UsesSystemParam()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            Assert.Contains("system=Sol", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetStationsBySystemAsync("Sol");
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetLatestTickAsync_ReturnsFirstTick()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(
                    """[{"_id":"abc","time":"2024-01-15T12:00:00Z","updated_at":"2024-01-15T12:00:00Z","__v":0}]""",
                    Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetLatestTickAsync();
        Assert.NotNull(result);
        Assert.Equal("2024-01-15T12:00:00Z", result.Time);
    }

    [Fact]
    public async Task GetLatestTickAsync_EmptyReturnsNull()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetLatestTickAsync();
        Assert.Null(result);
    }

    [Fact]
    public async Task GetStationsAsync_WithQuery_PassesParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            Assert.Contains("page=1", req.RequestUri!.ToString());
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetStationsAsync(new StationsQuery { Page = 1 });
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetSystemsAsync_WithNameFilter_PassesParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            var url = req.RequestUri!.ToString();
            Assert.Contains("name=Sol", url);
            Assert.Contains("allegiance=Federation", url);
            Assert.Contains("page=1", url);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemsAsync(new SystemsQuery
        {
            Name = ["Sol"],
            Allegiance = ["Federation"],
            Page = 1
        });
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetSystemsAsync_WithStateFilters_PassesParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            var url = req.RequestUri!.ToString();
            Assert.Contains("activeState=Boom", url);
            Assert.Contains("state=Civil+War", url);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemsAsync(new SystemsQuery
        {
            ActiveState = ["Boom"],
            State = ["Civil War"]
        });
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetSystemsAsync_WithSphereFilter_PassesParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            var url = req.RequestUri!.ToString();
            Assert.Contains("sphere=true", url);
            Assert.Contains("referenceSystem=Sol", url);
            Assert.Contains("referenceDistance=50", url);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemsAsync(new SystemsQuery
        {
            Sphere = true,
            ReferenceSystem = "Sol",
            ReferenceDistance = 50
        });
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetSystemsAsync_WithFactionFilters_PassesParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            var url = req.RequestUri!.ToString();
            Assert.Contains("faction=The+Fatherhood", url);
            Assert.Contains("factionId=fid1", url);
            Assert.Contains("factionControl=true", url);
            Assert.Contains("factionDetails=true", url);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetSystemsAsync(new SystemsQuery
        {
            Faction = ["The Fatherhood"],
            FactionId = ["fid1"],
            FactionControl = true,
            FactionDetails = true
        });
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetFactionsAsync_WithNameAndDetails_PassesParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            var url = req.RequestUri!.ToString();
            Assert.Contains("name=The+Fatherhood", url);
            Assert.Contains("systemDetails=true", url);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetFactionsAsync(new FactionsQuery
        {
            Name = ["The Fatherhood"],
            SystemDetails = true
        });
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetFactionsAsync_WithStateFilters_PassesParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            var url = req.RequestUri!.ToString();
            Assert.Contains("activeState=Boom", url);
            Assert.Contains("pendingState=Expansion", url);
            Assert.Contains("recoveringState=Civil+Liberty", url);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(EmptyPage, Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetFactionsAsync(new FactionsQuery
        {
            ActiveState = ["Boom"],
            PendingState = ["Expansion"],
            RecoveringState = ["Civil Liberty"]
        });
        Assert.Empty(result.Docs);
    }

    [Fact]
    public async Task GetTicksAsync_WithTimeRange_PassesParams()
    {
        var http = MockHttpMessageHandler.CreateClient("https://elitebgs.app/api/ebgs/v5", req =>
        {
            var url = req.RequestUri!.ToString();
            Assert.Contains("timeMin=1700000000000", url);
            Assert.Contains("timeMax=1700086400000", url);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("[]", Encoding.UTF8, "application/json")
            };
        });
        var client = CreateClient(http);
        var result = await client.GetTicksAsync(new TicksQuery
        {
            TimeMin = 1700000000000,
            TimeMax = 1700086400000
        });
        Assert.Empty(result);
    }
}
