using System.Net;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Xunit;
using EliteDangerousSdk.EDDN;

namespace EliteDangerousSdk.Tests;

public class EddnClientTests
{
    [Fact]
    public async Task SendAsync_PostsToCorrectUrl()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            Assert.Equal("https://eddn.edcd.io:4430/upload/", req.RequestUri!.ToString());
            Assert.Equal(HttpMethod.Post, req.Method);

            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal("TestApp", body.GetProperty("header").GetProperty("softwareName").GetString());
            Assert.Equal("1.0", body.GetProperty("header").GetProperty("softwareVersion").GetString());

            return new HttpResponseMessage(HttpStatusCode.OK);
        });
        var client = new EDDNClient("TestApp", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        await client.SendAsync("test/schema/1", new Dictionary<string, object>
        {
            ["starPos"] = new List<double> { 0, 0, 0 },
        });
    }

    [Fact]
    public async Task SendAsync_WithGameVersion()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal("4.0", body.GetProperty("header").GetProperty("gameversion").GetString());
            Assert.Equal("123", body.GetProperty("header").GetProperty("gamebuild").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK);
        });
        var client = new EDDNClient("App", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        await client.SendAsync("test/schema/1", new Dictionary<string, object>(), "4.0", "123");
    }

    [Fact]
    public async Task SendAsync_ThrowsOnBadRequest()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = new StringContent("validation error")
            };
        });
        var client = new EDDNClient("App", "1.0", "test-uploader");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            client.SendAsync("test/schema/1", new Dictionary<string, object>()));
    }

    [Fact]
    public async Task SendAsync_ThrowsOnUpgradeRequired()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.UpgradeRequired);
        });
        var client = new EDDNClient("App", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            client.SendAsync("old/schema/1", new Dictionary<string, object>()));
    }

    [Fact]
    public void Constructor_UsesDefaultUploaderId()
    {
        var client = new EDDNClient("App", "1.0");
        Assert.NotNull(client);
    }

    [Fact]
    public void Schemas_HasAll22()
    {
        var fields = typeof(EDDNClient.Schemas)
            .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.DeclaredOnly);
        Assert.Equal(22, fields.Length);
    }

    [Fact]
    public void ValidateCommodity_Valid_ReturnsTrue()
    {
        var msg = new Dictionary<string, object?>
        {
            ["systemName"] = "Sol",
            ["stationName"] = "Station",
            ["marketId"] = 12345L,
            ["commodities"] = new List<Dictionary<string, object?>>
            {
                new() { ["name"] = "Coffee", ["buyPrice"] = 1000, ["sellPrice"] = 1200, ["meanPrice"] = 1100, ["stockBracket"] = 2, ["demandBracket"] = 0, ["stock"] = 50000, ["demand"] = 0 }
            }
        };
        Assert.True(EDDNClient.ValidateCommodityMessage(msg));
    }

    [Fact]
    public void ValidateCommodity_MissingField_ReturnsFalse()
    {
        var msg = new Dictionary<string, object?>
        {
            ["stationName"] = "Station",
            ["marketId"] = 12345L,
        };
        Assert.False(EDDNClient.ValidateCommodityMessage(msg));
    }

    [Fact]
    public async Task SendCommodityAsync_Success()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal(EDDNClient.Schemas.Commodity, body.GetProperty("$schemaRef").GetString());
            Assert.Equal("TestApp", body.GetProperty("header").GetProperty("softwareName").GetString());
            Assert.Equal("Sol", body.GetProperty("message").GetProperty("systemName").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK);
        });
        var client = new EDDNClient("TestApp", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        var result = await client.SendCommodityAsync(
            "Sol", "Station", 12345,
            new List<Dictionary<string, object?>>
            {
                new() { ["name"] = "Coffee", ["buyPrice"] = 1000, ["sellPrice"] = 1200, ["meanPrice"] = 1100, ["stockBracket"] = 2, ["demandBracket"] = 0, ["stock"] = 50000, ["demand"] = 0 }
            });
        Assert.True(result);
    }

    [Fact]
    public async Task SendCommodityAsync_Error_ReturnsFalse()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = new StringContent("FAIL: validation error")
            };
        });
        var client = new EDDNClient("App", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        var result = await client.SendCommodityAsync(
            "Sol", "Station", 12345,
            new List<Dictionary<string, object?>>
            {
                new() { ["name"] = "Tea", ["buyPrice"] = 500, ["sellPrice"] = 800, ["meanPrice"] = 700, ["stockBracket"] = 1, ["demandBracket"] = 2, ["stock"] = 1000, ["demand"] = 500 }
            });
        Assert.False(result);
    }

    [Fact]
    public async Task SendFleetCarrierAsync_Success()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal(EDDNClient.Schemas.FcMaterialsCapi, body.GetProperty("$schemaRef").GetString());
            Assert.Equal("FleetCarrier", body.GetProperty("message").GetProperty("carrierCallsign").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK);
        });
        var client = new EDDNClient("App", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        var result = await client.SendFleetCarrierAsync(
            "Sol", "FC Station", 99999, "FleetCarrier", "all",
            new List<Dictionary<string, object?>>
            {
                new() { ["name"] = "Tritium", ["buyPrice"] = 50000, ["sellPrice"] = 0, ["meanPrice"] = 40000, ["stockBracket"] = 3, ["demandBracket"] = 1, ["stock"] = 1000, ["demand"] = 100 }
            });
        Assert.True(result);
    }

    [Fact]
    public async Task SendAsync_413_Handled()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            return new HttpResponseMessage(HttpStatusCode.RequestEntityTooLarge);
        });
        var client = new EDDNClient("App", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            client.SendAsync("test/schema/1", new Dictionary<string, object>()));
        Assert.Contains("too large", ex.Message);
    }

    [Fact]
    public void ValidateJournal_Valid_ReturnsTrue()
    {
        var msg = new Dictionary<string, object?> { ["event"] = "FSDJump" };
        Assert.True(EDDNClient.ValidateJournalMessage(msg));
    }

    [Fact]
    public void ValidateJournal_Empty_ReturnsFalse()
    {
        Assert.False(EDDNClient.ValidateJournalMessage(new Dictionary<string, object?>()));
    }

    [Fact]
    public void ValidateBlackmarket_Valid_ReturnsTrue()
    {
        var msg = new Dictionary<string, object?>
        {
            ["systemName"] = "Sol",
            ["stationName"] = "Station",
            ["marketId"] = 1L,
            ["items"] = new List<Dictionary<string, object?>>
            {
                new() { ["name"] = "Gold" }
            }
        };
        Assert.True(EDDNClient.ValidateBlackmarketMessage(msg));
    }

    [Fact]
    public void ValidateBlackmarket_Missing_ReturnsFalse()
    {
        Assert.False(EDDNClient.ValidateBlackmarketMessage(new Dictionary<string, object?>()));
    }

    [Fact]
    public void ValidateNavRoute_Valid_ReturnsTrue()
    {
        var msg = new Dictionary<string, object?>
        {
            ["systemName"] = "Sol",
            ["route"] = new List<Dictionary<string, object?>>
            {
                new() { ["StarPos"] = new List<double> { 0, 0, 0 }, ["systemName"] = "Sol", ["systemAddress"] = 1L }
            }
        };
        Assert.True(EDDNClient.ValidateNavRouteMessage(msg));
    }

    [Fact]
    public void ValidateNavRoute_Missing_ReturnsFalse()
    {
        Assert.False(EDDNClient.ValidateNavRouteMessage(new Dictionary<string, object?>()));
    }

    [Fact]
    public void ValidateFcMaterialsJournal_Valid_ReturnsTrue()
    {
        var msg = new Dictionary<string, object?>
        {
            ["timestamp"] = "2024-01-01T00:00:00Z",
            ["event"] = "FCMaterials",
            ["CarrierName"] = "ABC-01",
            ["MarketID"] = 1L,
            ["Items"] = new List<Dictionary<string, object?>>
            {
                new() { ["name"] = "Tritium" }
            }
        };
        Assert.True(EDDNClient.ValidateFcMaterialsJournalMessage(msg));
    }

    [Fact]
    public void ValidateFcMaterialsJournal_Missing_ReturnsFalse()
    {
        Assert.False(EDDNClient.ValidateFcMaterialsJournalMessage(new Dictionary<string, object?>()));
    }

    [Fact]
    public async Task SendJournalAsync_Success()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal(EDDNClient.Schemas.Journal, body.GetProperty("$schemaRef").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK);
        });
        var client = new EDDNClient("App", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        var result = await client.SendJournalAsync(new Dictionary<string, object?> { ["event"] = "FSDJump" });
        Assert.True(result);
    }

    [Fact]
    public async Task SendBlackmarketAsync_Success()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal(EDDNClient.Schemas.Blackmarket, body.GetProperty("$schemaRef").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK);
        });
        var client = new EDDNClient("App", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        var result = await client.SendBlackmarketAsync("Sol", "Station", 1,
            new List<Dictionary<string, object?>> { new() { ["name"] = "Gold" } });
        Assert.True(result);
    }

    [Fact]
    public async Task SendNavRouteAsync_Success()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal(EDDNClient.Schemas.NavRoute, body.GetProperty("$schemaRef").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK);
        });
        var client = new EDDNClient("App", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        var result = await client.SendNavRouteAsync("Sol",
            new List<Dictionary<string, object?>> { new() { ["StarPos"] = new List<double> { 0, 0, 0 }, ["systemName"] = "Sol", ["systemAddress"] = 1L } });
        Assert.True(result);
    }

    [Fact]
    public async Task SendFcMaterialsJournalAsync_Success()
    {
        var http = MockHttpMessageHandler.CreateClient("https://eddn.edcd.io:4430", req =>
        {
            var body = JsonSerializer.Deserialize<JsonElement>(req.Content!.ReadAsStringAsync().Result);
            Assert.Equal(EDDNClient.Schemas.FcMaterialsJournal, body.GetProperty("$schemaRef").GetString());
            Assert.Equal("ABC-01", body.GetProperty("message").GetProperty("CarrierName").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK);
        });
        var client = new EDDNClient("App", "1.0");
        typeof(EDDNClient).GetField("_http", BindingFlags.NonPublic | BindingFlags.Instance)!
            .SetValue(client, http);

        var result = await client.SendFcMaterialsJournalAsync(
            "2024-01-01T00:00:00Z", "FCMaterials", "ABC-01", 1,
            new List<Dictionary<string, object?>> { new() { ["name"] = "Tritium" } });
        Assert.True(result);
    }
}
