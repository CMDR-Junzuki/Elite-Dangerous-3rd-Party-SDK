namespace EliteDangerousSdk.Companion;

using System.Text.Json.Serialization;

public record CapCommander(
    [property: JsonPropertyName("name")] string? Name,
    [property: JsonPropertyName("currentShipId")] object? CurrentShipId,
    [property: JsonPropertyName("docked")] bool? Docked
);

public record CapMarketCommodity(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("buyPrice")] int BuyPrice,
    [property: JsonPropertyName("sellPrice")] int SellPrice,
    [property: JsonPropertyName("meanPrice")] int MeanPrice,
    [property: JsonPropertyName("stock")] int Stock,
    [property: JsonPropertyName("demand")] int Demand,
    [property: JsonPropertyName("statusFlags")] string? StatusFlags = null,
    [property: JsonPropertyName("stockBracket")] int? StockBracket = null,
    [property: JsonPropertyName("demandBracket")] int? DemandBracket = null
);

public record CapProfileResponse(
    [property: JsonPropertyName("commander")] CapCommander? Commander,
    [property: JsonPropertyName("lastSystem")] System.Text.Json.JsonElement? LastSystem,
    [property: JsonPropertyName("lastStarport")] System.Text.Json.JsonElement? LastStarport,
    [property: JsonPropertyName("ships")] System.Text.Json.JsonElement? Ships,
    [property: JsonPropertyName("fleetCarrier")] System.Text.Json.JsonElement? FleetCarrier,
    [property: JsonPropertyName("communityGoals")] System.Text.Json.JsonElement? CommunityGoals
);

public record CapShipResponse(
    [property: JsonPropertyName("shipId")] object? ShipId,
    [property: JsonPropertyName("shipName")] string? ShipName,
    [property: JsonPropertyName("shipIdent")] string? ShipIdent,
    [property: JsonPropertyName("shipType")] string? ShipType,
    [property: JsonPropertyName("starsystem")] System.Text.Json.JsonElement? Starsystem,
    [property: JsonPropertyName("modules")] System.Text.Json.JsonElement? Modules,
    [property: JsonPropertyName("paints")] System.Text.Json.JsonElement? Paints,
    [property: JsonPropertyName("load")] System.Text.Json.JsonElement? Load,
    [property: JsonPropertyName("cargo")] System.Text.Json.JsonElement? Cargo,
    [property: JsonPropertyName("defense")] System.Text.Json.JsonElement? Defense
);

public record CapMarketResponse(
    [property: JsonPropertyName("systemName")] string? SystemName,
    [property: JsonPropertyName("stationName")] string? StationName,
    [property: JsonPropertyName("marketId")] long? MarketId,
    [property: JsonPropertyName("commodities")] System.Text.Json.JsonElement? Commodities
);

public record CapShipyardResponse(
    [property: JsonPropertyName("systemName")] string? SystemName,
    [property: JsonPropertyName("stationName")] string? StationName,
    [property: JsonPropertyName("marketId")] long? MarketId,
    [property: JsonPropertyName("ships")] System.Text.Json.JsonElement? Ships
);

public record CapFleetCarrierResponse(
    [property: JsonPropertyName("systemName")] string? SystemName,
    [property: JsonPropertyName("stationName")] string? StationName,
    [property: JsonPropertyName("marketId")] long? MarketId,
    [property: JsonPropertyName("carrierCallsign")] string? CarrierCallsign,
    [property: JsonPropertyName("carrierDockingAccess")] string? CarrierDockingAccess,
    [property: JsonPropertyName("commodities")] System.Text.Json.JsonElement? Commodities
);

public record CapJournalResponse(
    [property: JsonPropertyName("journal")] string[]? Journal
);

public record CapCommunityGoalsResponse(
    [property: JsonPropertyName("communitygoals")] CapCommunityGoal[]? CommunityGoals
);

public record CapCommunityGoal(
    [property: JsonPropertyName("communityGoalGameId")] int CommunityGoalGameId,
    [property: JsonPropertyName("title")] string? Title,
    [property: JsonPropertyName("systemName")] string? SystemName,
    [property: JsonPropertyName("marketName")] string? MarketName,
    [property: JsonPropertyName("expiry")] string? Expiry,
    [property: JsonPropertyName("isComplete")] bool? IsComplete,
    [property: JsonPropertyName("currentGlobal")] double? CurrentGlobal,
    [property: JsonPropertyName("currentTotal")] object? CurrentTotal,
    [property: JsonPropertyName("playerContribution")] double? PlayerContribution,
    [property: JsonPropertyName("playerPercentileBand")] string? PlayerPercentileBand,
    [property: JsonPropertyName("bonus")] object? Bonus,
    [property: JsonPropertyName("targetTotal")] object? TargetTotal,
    [property: JsonPropertyName("topTier")] System.Text.Json.JsonElement? TopTier,
    [property: JsonPropertyName("topRankSize")] int? TopRankSize
);
