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

    private static string GetString(Dictionary<string, object?> msg, string key)
    {
        if (msg.TryGetValue(key, out var val) && val is string s)
            return s;
        return "";
    }

    public static string[] ValidateCommodityMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) { errors.Add("message is required"); return errors.ToArray(); }
        if (string.IsNullOrEmpty(GetString(msg, "systemName"))) errors.Add("systemName is required");
        if (string.IsNullOrEmpty(GetString(msg, "stationName"))) errors.Add("stationName is required");
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) errors.Add("marketId is required");
        if (msg.TryGetValue("commodities", out var com) && com is IList list && list.Count > 0)
        {
            foreach (var c in list)
            {
                if (c is Dictionary<string, object?> cd)
                {
                    if (string.IsNullOrEmpty(GetString(cd, "name"))) errors.Add("commodity.name is required");
                    if (!cd.TryGetValue("buyPrice", out _)) errors.Add("commodity.buyPrice is required");
                    if (!cd.TryGetValue("sellPrice", out _)) errors.Add("commodity.sellPrice is required");
                }
            }
        }
        else
        {
            errors.Add("commodities array is required");
        }
        return errors.ToArray();
    }

    public static string[] ValidateShipyardMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) { errors.Add("message is required"); return errors.ToArray(); }
        if (string.IsNullOrEmpty(GetString(msg, "systemName"))) errors.Add("systemName is required");
        if (string.IsNullOrEmpty(GetString(msg, "stationName"))) errors.Add("stationName is required");
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) errors.Add("marketId is required");
        if (!msg.TryGetValue("ships", out var sh) || sh is not IList list || list.Count == 0) errors.Add("ships array is required");
        return errors.ToArray();
    }

    public static string[] ValidateOutfittingMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) { errors.Add("message is required"); return errors.ToArray(); }
        if (string.IsNullOrEmpty(GetString(msg, "systemName"))) errors.Add("systemName is required");
        if (string.IsNullOrEmpty(GetString(msg, "stationName"))) errors.Add("stationName is required");
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) errors.Add("marketId is required");
        if (!msg.TryGetValue("modules", out var mod) || mod is not IList list || list.Count == 0) errors.Add("modules array is required");
        return errors.ToArray();
    }

    public static string[] ValidateFcMaterialsMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) { errors.Add("message is required"); return errors.ToArray(); }
        if (string.IsNullOrEmpty(GetString(msg, "systemName"))) errors.Add("systemName is required");
        if (string.IsNullOrEmpty(GetString(msg, "stationName"))) errors.Add("stationName is required");
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) errors.Add("marketId is required");
        if (string.IsNullOrEmpty(GetString(msg, "carrierCallsign"))) errors.Add("carrierCallsign is required");
        if (string.IsNullOrEmpty(GetString(msg, "carrierDockingAccess"))) errors.Add("carrierDockingAccess is required");
        return errors.ToArray();
    }

    public static string[] ValidateJournalMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) { errors.Add("message is required"); return errors.ToArray(); }
        if (msg.Count == 0) errors.Add("message must not be empty");
        return errors.ToArray();
    }

    public static string[] ValidateBlackmarketMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) { errors.Add("message is required"); return errors.ToArray(); }
        if (string.IsNullOrEmpty(GetString(msg, "systemName"))) errors.Add("systemName is required");
        if (string.IsNullOrEmpty(GetString(msg, "stationName"))) errors.Add("stationName is required");
        if (!msg.TryGetValue("marketId", out var mid) || mid == null) errors.Add("marketId is required");
        if (msg.TryGetValue("items", out var it) && it is IList list && list.Count > 0)
        {
            foreach (var i in list)
            {
                if (i is Dictionary<string, object?> id && string.IsNullOrEmpty(GetString(id, "name")))
                    errors.Add("item.name is required");
            }
        }
        else
        {
            errors.Add("items array is required");
        }
        return errors.ToArray();
    }

    public static string[] ValidateNavRouteMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) { errors.Add("message is required"); return errors.ToArray(); }
        if (string.IsNullOrEmpty(GetString(msg, "systemName"))) errors.Add("systemName is required");
        if (!msg.TryGetValue("route", out var rt) || rt is not IList list || list.Count == 0) errors.Add("route array is required");
        return errors.ToArray();
    }

    public static string[] ValidateFcMaterialsJournalMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) { errors.Add("message is required"); return errors.ToArray(); }
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        if (string.IsNullOrEmpty(GetString(msg, "event"))) errors.Add("event is required");
        if (string.IsNullOrEmpty(GetString(msg, "CarrierName"))) errors.Add("CarrierName is required");
        if (!msg.TryGetValue("MarketID", out var mid) || mid == null) errors.Add("MarketID is required");
        if (!msg.TryGetValue("Items", out var it) || it is not IList list || list.Count == 0) errors.Add("Items array is required");
        return errors.ToArray();
    }

    public static string[] ValidateApproachSettlementMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "settlementName"))) errors.Add("settlementName is required");
        if (!msg.TryGetValue("SystemAddress", out _)) errors.Add("SystemAddress is required");
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        return errors.ToArray();
    }

    public static string[] ValidateNavRouteClearMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (msg.TryGetValue("route", out var r) && r is not IList) errors.Add("route must be an array");
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        return errors.ToArray();
    }

    public static string[] ValidateScanMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        if (string.IsNullOrEmpty(GetString(msg, "BodyName")) && !msg.TryGetValue("BodyID", out _)) errors.Add("BodyName or BodyID is required");
        return errors.ToArray();
    }

    public static string[] ValidateCodeEntryMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "systemName"))) errors.Add("systemName is required");
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        return errors.ToArray();
    }

    public static string[] ValidateFssDiscoveredMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "systemName"))) errors.Add("systemName is required");
        if (msg.TryGetValue("bodies", out var b) && b is not IList) errors.Add("bodies must be an array");
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        return errors.ToArray();
    }

    public static string[] ValidateSaaSignalsFoundMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "systemName"))) errors.Add("systemName is required");
        if (string.IsNullOrEmpty(GetString(msg, "bodyName"))) errors.Add("bodyName is required");
        if (msg.TryGetValue("signals", out var s) && s is not IList) errors.Add("signals must be an array");
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        return errors.ToArray();
    }

    public static string[] ValidateFsdJumpMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "StarSystem"))) errors.Add("StarSystem is required");
        if (!msg.TryGetValue("SystemAddress", out _)) errors.Add("SystemAddress is required");
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        return errors.ToArray();
    }

    public static string[] ValidateLocationMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "StarSystem"))) errors.Add("StarSystem is required");
        if (!msg.TryGetValue("SystemAddress", out _)) errors.Add("SystemAddress is required");
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        return errors.ToArray();
    }

    public static string[] ValidateCarrierJumpMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "StarSystem"))) errors.Add("StarSystem is required");
        if (!msg.TryGetValue("SystemAddress", out _)) errors.Add("SystemAddress is required");
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        return errors.ToArray();
    }

    public static string[] ValidateDispatchMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "Text")) && !msg.TryGetValue("Topics", out _)) errors.Add("Text or Topics is required");
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        return errors.ToArray();
    }

    public static string[] ValidateBackpackMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        if (msg.TryGetValue("Items", out var it) && it is not IList) errors.Add("Items must be an array");
        if (msg.TryGetValue("Components", out var co) && co is not IList) errors.Add("Components must be an array");
        if (msg.TryGetValue("Consumables", out var cn) && cn is not IList) errors.Add("Consumables must be an array");
        if (msg.TryGetValue("Data", out var da) && da is not IList) errors.Add("Data must be an array");
        return errors.ToArray();
    }

    public static string[] ValidateShipLockerMessage(Dictionary<string, object?> msg)
    {
        var errors = new List<string>();
        if (msg == null) return ["message is required"];
        if (string.IsNullOrEmpty(GetString(msg, "timestamp"))) errors.Add("timestamp is required");
        if (msg.TryGetValue("Items", out var it) && it is not IList) errors.Add("Items must be an array");
        if (msg.TryGetValue("Components", out var co) && co is not IList) errors.Add("Components must be an array");
        if (msg.TryGetValue("Consumables", out var cn) && cn is not IList) errors.Add("Consumables must be an array");
        if (msg.TryGetValue("Data", out var da) && da is not IList) errors.Add("Data must be an array");
        return errors.ToArray();
    }

    private static readonly Dictionary<string, Func<Dictionary<string, object?>, string[]>> _validators = new()
    {
        [Schemas.Commodity] = ValidateCommodityMessage,
        [Schemas.Shipyard] = ValidateShipyardMessage,
        [Schemas.Outfitting] = ValidateOutfittingMessage,
        [Schemas.FcMaterialsCapi] = ValidateFcMaterialsMessage,
        [Schemas.Journal] = ValidateJournalMessage,
        [Schemas.Blackmarket] = ValidateBlackmarketMessage,
        [Schemas.NavRoute] = ValidateNavRouteMessage,
        [Schemas.FcMaterialsJournal] = ValidateFcMaterialsJournalMessage,
        [Schemas.ApproachSettlement] = ValidateApproachSettlementMessage,
        [Schemas.NavRouteClear] = ValidateNavRouteClearMessage,
        [Schemas.Scan] = ValidateScanMessage,
        [Schemas.CodeEntry] = ValidateCodeEntryMessage,
        [Schemas.FssDiscovered] = ValidateFssDiscoveredMessage,
        [Schemas.SaaSignalsFound] = ValidateSaaSignalsFoundMessage,
        [Schemas.FsdJump] = ValidateFsdJumpMessage,
        [Schemas.Location] = ValidateLocationMessage,
        [Schemas.CarrierJump] = ValidateCarrierJumpMessage,
        [Schemas.Dispatch] = ValidateDispatchMessage,
        [Schemas.Backpack] = ValidateBackpackMessage,
        [Schemas.ShipLocker] = ValidateShipLockerMessage,
    };

    public static string[] ValidateEDDN(Dictionary<string, object?> envelope)
    {
        var errors = new List<string>();
        if (envelope == null) return ["envelope is required"];

        envelope.TryGetValue("$schemaRef", out var sr);
        var schemaRef = sr as string;
        if (string.IsNullOrEmpty(schemaRef))
            errors.Add("$schemaRef is required");

        if (envelope.TryGetValue("header", out var h) && h is Dictionary<string, object?> header)
        {
            if (string.IsNullOrEmpty(GetString(header, "uploaderID"))) errors.Add("header.uploaderID is required");
            if (string.IsNullOrEmpty(GetString(header, "softwareName"))) errors.Add("header.softwareName is required");
            if (string.IsNullOrEmpty(GetString(header, "softwareVersion"))) errors.Add("header.softwareVersion is required");
        }
        else
        {
            errors.Add("header is required");
        }

        if (!envelope.TryGetValue("message", out var m) || m is not Dictionary<string, object?> message)
        {
            errors.Add("message is required");
            return errors.ToArray();
        }

        if (string.IsNullOrEmpty(schemaRef))
            return errors.ToArray();

        if (!_validators.TryGetValue(schemaRef, out var validator))
        {
            errors.Add($"unknown schema: {schemaRef}");
            return errors.ToArray();
        }

        errors.AddRange(validator(message));
        return errors.ToArray();
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
