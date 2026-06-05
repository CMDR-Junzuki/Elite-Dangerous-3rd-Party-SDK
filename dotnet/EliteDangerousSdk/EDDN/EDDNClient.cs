namespace EliteDangerousSdk.EDDN;

using System.Collections;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.IO.Compression;

public class EDDNClient
{
    public const string UploadUrl = "https://eddn.edcd.io:4430/upload/";
    public const string RelayUrl = "tcp://eddn.edcd.io:9500";

    public static class Schemas
    {
        public const string Commodity = "https://eddn.edcd.io/schemas/commodity/3";
        public const string Shipyard = "https://eddn.edcd.io/schemas/shipyard/2";
        public const string Outfitting = "https://eddn.edcd.io/schemas/outfitting/2";
        public const string FcMaterialsCapi = "https://eddn.edcd.io/schemas/fcmaterials_capi/1";
        public const string Journal = "https://eddn.edcd.io/schemas/journal/1";
        public const string Blackmarket = "https://eddn.edcd.io/schemas/blackmarket/1";
        public const string ApproachSettlement = "https://eddn.edcd.io/schemas/approachsettlement/1";
        public const string NavRoute = "https://eddn.edcd.io/schemas/navroute/1";
        public const string NavRouteClear = "https://eddn.edcd.io/schemas/navrouteclear/1";
        public const string Scan = "https://eddn.edcd.io/schemas/scan/1";
        public const string CodeEntry = "https://eddn.edcd.io/schemas/codeentry/1";
        public const string FssDiscovered = "https://eddn.edcd.io/schemas/fssdiscovered/1";
        public const string SaaSignalsFound = "https://eddn.edcd.io/schemas/saasignalsfound/1";
        public const string FsdJump = "https://eddn.edcd.io/schemas/fsdjump/1";
        public const string Location = "https://eddn.edcd.io/schemas/location/2";
        public const string CarrierJump = "https://eddn.edcd.io/schemas/carrierjump/1";
        public const string Dispatch = "https://eddn.edcd.io/schemas/dispatch/1";
        public const string Backpack = "https://eddn.edcd.io/schemas/backpack/1";
        public const string ShipLocker = "https://eddn.edcd.io/schemas/shiplocker/1";
        public const string ShipyardBuy = "https://eddn.edcd.io/schemas/shipyard/2";
        public const string OutfittingBuy = "https://eddn.edcd.io/schemas/outfitting/2";
        public const string FcMaterialsJournal = "https://eddn.edcd.io/schemas/fcmaterials_journal/1";
    }

    private readonly HttpClient _http;
    private readonly string _softwareName;
    private readonly string _softwareVersion;
    private readonly string _uploaderId;

    public EDDNClient(string softwareName, string softwareVersion, string? uploaderId = null)
    {
        _http = new HttpClient();
        _softwareName = softwareName;
        _softwareVersion = softwareVersion;
        _uploaderId = uploaderId ?? "unknown";
    }

    public async Task SendAsync(string schemaRef, Dictionary<string, object> message,
        string? gameversion = null, string? gamebuild = null, string? uploaderID = null)
    {
        var body = new Dictionary<string, object>
        {
            ["$schemaRef"] = schemaRef,
            ["header"] = new Dictionary<string, object>
            {
                ["uploaderID"] = uploaderID ?? _uploaderId,
                ["gameversion"] = gameversion ?? "",
                ["gamebuild"] = gamebuild ?? "",
                ["softwareName"] = _softwareName,
                ["softwareVersion"] = _softwareVersion,
            },
            ["message"] = message,
        };

        var resp = await _http.PostAsJsonAsync(UploadUrl, body);

        if (resp.StatusCode == HttpStatusCode.BadRequest)
            throw new InvalidOperationException($"EDDN validation failed: {await resp.Content.ReadAsStringAsync()}");
        if (resp.StatusCode == HttpStatusCode.UpgradeRequired)
            throw new InvalidOperationException($"EDDN schema outdated: {schemaRef}");
        if (resp.StatusCode == HttpStatusCode.RequestEntityTooLarge)
            throw new InvalidOperationException("EDDN message too large (max 1MB)");

        resp.EnsureSuccessStatusCode();
    }

    public static bool ValidateCommodityMessage(Dictionary<string, object?> msg)
    {
        if (msg == null) return false;
        if (!msg.TryGetValue("systemName", out var sn) || sn is not string s || string.IsNullOrEmpty(s)) return false;
        if (!msg.TryGetValue("stationName", out var stn) || stn is not string st || string.IsNullOrEmpty(st)) return false;
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) return false;
        if (!msg.TryGetValue("commodities", out var com) || com is not IList list || list.Count == 0) return false;
        foreach (var c in list)
        {
            if (c is not Dictionary<string, object?> cd) return false;
            if (!cd.TryGetValue("name", out var n) || n is not string || string.IsNullOrEmpty(n as string)) return false;
            if (!cd.TryGetValue("buyPrice", out _)) return false;
            if (!cd.TryGetValue("sellPrice", out _)) return false;
        }
        return true;
    }

    public static bool ValidateShipyardMessage(Dictionary<string, object?> msg)
    {
        if (msg == null) return false;
        if (!msg.TryGetValue("systemName", out var sn) || sn is not string s || string.IsNullOrEmpty(s)) return false;
        if (!msg.TryGetValue("stationName", out var stn) || stn is not string st || string.IsNullOrEmpty(st)) return false;
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) return false;
        if (!msg.TryGetValue("ships", out var sh) || sh is not IList list || list.Count == 0) return false;
        return true;
    }

    public static bool ValidateOutfittingMessage(Dictionary<string, object?> msg)
    {
        if (msg == null) return false;
        if (!msg.TryGetValue("systemName", out var sn) || sn is not string s || string.IsNullOrEmpty(s)) return false;
        if (!msg.TryGetValue("stationName", out var stn) || stn is not string st || string.IsNullOrEmpty(st)) return false;
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) return false;
        if (!msg.TryGetValue("modules", out var mod) || mod is not IList list || list.Count == 0) return false;
        return true;
    }

    public static bool ValidateFcMaterialsMessage(Dictionary<string, object?> msg)
    {
        if (msg == null) return false;
        if (!msg.TryGetValue("systemName", out var sn) || sn is not string s || string.IsNullOrEmpty(s)) return false;
        if (!msg.TryGetValue("stationName", out var stn) || stn is not string st || string.IsNullOrEmpty(st)) return false;
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) return false;
        if (!msg.TryGetValue("carrierCallsign", out var cc) || cc is not string ccs || string.IsNullOrEmpty(ccs)) return false;
        if (!msg.TryGetValue("carrierDockingAccess", out var cda) || cda is not string cdas || string.IsNullOrEmpty(cdas)) return false;
        return true;
    }

    public static bool ValidateJournalMessage(Dictionary<string, object?> msg)
    {
        if (msg == null) return false;
        return msg.Count > 0;
    }

    public static bool ValidateBlackmarketMessage(Dictionary<string, object?> msg)
    {
        if (msg == null) return false;
        if (!msg.TryGetValue("systemName", out var sn) || sn is not string s || string.IsNullOrEmpty(s)) return false;
        if (!msg.TryGetValue("stationName", out var stn) || stn is not string st || string.IsNullOrEmpty(st)) return false;
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) return false;
        if (!msg.TryGetValue("items", out var it) || it is not IList list || list.Count == 0) return false;
        foreach (var i in list)
        {
            if (i is not Dictionary<string, object?> id) return false;
            if (!id.TryGetValue("name", out var n) || n is not string || string.IsNullOrEmpty(n as string)) return false;
        }
        return true;
    }

    public static bool ValidateNavRouteMessage(Dictionary<string, object?> msg)
    {
        if (msg == null) return false;
        if (!msg.TryGetValue("systemName", out var sn) || sn is not string s || string.IsNullOrEmpty(s)) return false;
        if (!msg.TryGetValue("route", out var rt) || rt is not IList list || list.Count == 0) return false;
        return true;
    }

    public static bool ValidateFcMaterialsJournalMessage(Dictionary<string, object?> msg)
    {
        if (msg == null) return false;
        if (!msg.TryGetValue("timestamp", out var ts) || ts is not string t || string.IsNullOrEmpty(t)) return false;
        if (!msg.TryGetValue("event", out var ev) || ev is not string e || string.IsNullOrEmpty(e)) return false;
        if (!msg.TryGetValue("CarrierName", out var cn) || cn is not string c || string.IsNullOrEmpty(c)) return false;
        if (!msg.TryGetValue("MarketID", out var mid) || mid == null) return false;
        if (!msg.TryGetValue("Items", out var it) || it is not IList list || list.Count == 0) return false;
        return true;
    }

    public async Task<bool> SendCommodityAsync(
        string systemName, string stationName, long marketId,
        List<Dictionary<string, object?>> commodities,
        string? gameversion = null, string? gamebuild = null,
        bool? horizons = null, bool? odyssey = null, string? uploaderId = null)
    {
        var message = new Dictionary<string, object>
        {
            ["systemName"] = systemName,
            ["stationName"] = stationName,
            ["marketId"] = marketId,
            ["commodities"] = commodities,
        };
        if (horizons.HasValue) message["horizons"] = horizons.Value;
        if (odyssey.HasValue) message["odyssey"] = odyssey.Value;

        try
        {
            await SendAsync(Schemas.Commodity, message, gameversion, gamebuild, uploaderId);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendShipyardAsync(
        string systemName, string stationName, long marketId,
        List<string> ships,
        string? gameversion = null, string? gamebuild = null,
        bool? horizons = null, bool? odyssey = null, string? uploaderId = null)
    {
        var message = new Dictionary<string, object>
        {
            ["systemName"] = systemName,
            ["stationName"] = stationName,
            ["marketId"] = marketId,
            ["ships"] = ships,
        };
        if (horizons.HasValue) message["horizons"] = horizons.Value;
        if (odyssey.HasValue) message["odyssey"] = odyssey.Value;

        try
        {
            await SendAsync(Schemas.Shipyard, message, gameversion, gamebuild, uploaderId);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendOutfittingAsync(
        string systemName, string stationName, long marketId,
        List<string> modules,
        string? gameversion = null, string? gamebuild = null,
        bool? horizons = null, bool? odyssey = null, string? uploaderId = null)
    {
        var message = new Dictionary<string, object>
        {
            ["systemName"] = systemName,
            ["stationName"] = stationName,
            ["marketId"] = marketId,
            ["modules"] = modules,
        };
        if (horizons.HasValue) message["horizons"] = horizons.Value;
        if (odyssey.HasValue) message["odyssey"] = odyssey.Value;

        try
        {
            await SendAsync(Schemas.Outfitting, message, gameversion, gamebuild, uploaderId);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendFleetCarrierAsync(
        string systemName, string stationName, long marketId,
        string carrierCallsign, string carrierDockingAccess,
        List<Dictionary<string, object?>> commodities,
        string? gameversion = null, string? gamebuild = null, string? uploaderId = null)
    {
        var message = new Dictionary<string, object>
        {
            ["systemName"] = systemName,
            ["stationName"] = stationName,
            ["marketId"] = marketId,
            ["carrierCallsign"] = carrierCallsign,
            ["carrierDockingAccess"] = carrierDockingAccess,
            ["commodities"] = commodities,
        };

        try
        {
            await SendAsync(Schemas.FcMaterialsCapi, message, gameversion, gamebuild, uploaderId);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendJournalAsync(
        Dictionary<string, object?> eventData,
        string? gameversion = null, string? gamebuild = null, string? uploaderId = null)
    {
        try
        {
            await SendAsync(Schemas.Journal, eventData!, gameversion, gamebuild, uploaderId);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendBlackmarketAsync(
        string systemName, string stationName, long marketId,
        List<Dictionary<string, object?>> items,
        string? gameversion = null, string? gamebuild = null, string? uploaderId = null)
    {
        var message = new Dictionary<string, object>
        {
            ["systemName"] = systemName,
            ["stationName"] = stationName,
            ["marketId"] = marketId,
            ["items"] = items,
        };
        try
        {
            await SendAsync(Schemas.Blackmarket, message, gameversion, gamebuild, uploaderId);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendNavRouteAsync(
        string systemName,
        List<Dictionary<string, object?>> route,
        string? gameversion = null, string? gamebuild = null, string? uploaderId = null)
    {
        var message = new Dictionary<string, object>
        {
            ["systemName"] = systemName,
            ["route"] = route,
        };
        try
        {
            await SendAsync(Schemas.NavRoute, message, gameversion, gamebuild, uploaderId);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendFcMaterialsJournalAsync(
        string timestamp, string eventName, string carrierName, long marketId,
        List<Dictionary<string, object?>> items,
        long? carrierId = null,
        string? gameversion = null, string? gamebuild = null, string? uploaderId = null)
    {
        var message = new Dictionary<string, object>
        {
            ["timestamp"] = timestamp,
            ["event"] = eventName,
            ["CarrierName"] = carrierName,
            ["MarketID"] = marketId,
            ["Items"] = items,
        };
        if (carrierId.HasValue) message["CarrierID"] = carrierId.Value;
        try
        {
            await SendAsync(Schemas.FcMaterialsJournal, message, gameversion, gamebuild, uploaderId);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
