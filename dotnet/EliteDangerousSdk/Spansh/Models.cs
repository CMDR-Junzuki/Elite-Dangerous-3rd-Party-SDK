using System.Text.Json;
using System.Text.Json.Serialization;

namespace EliteDangerousSdk.Spansh;

public record SystemBody(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("id64")] long Id64,
    [property: JsonPropertyName("bodyId")] int BodyId,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("subType")] string SubType,
    [property: JsonPropertyName("distanceToArrival")] double DistanceToArrival,
    [property: JsonPropertyName("isLandable")] bool? IsLandable = null
);

public record StationBrief(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("market_id")] long MarketId,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("distanceToArrival")] double DistanceToArrival
);

public record SystemDetail(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("id64")] long Id64,
    [property: JsonPropertyName("x")] double X,
    [property: JsonPropertyName("y")] double Y,
    [property: JsonPropertyName("z")] double Z,
    [property: JsonPropertyName("population")] long? Population = null,
    [property: JsonPropertyName("allegiance")] string? Allegiance = null,
    [property: JsonPropertyName("government")] string? Government = null,
    [property: JsonPropertyName("economy")] string? Economy = null,
    [property: JsonPropertyName("security")] string? Security = null,
    [property: JsonPropertyName("controlling_minor_faction")] string? ControllingMinorFaction = null,
    [property: JsonPropertyName("bodies")] List<SystemBody>? Bodies = null,
    [property: JsonPropertyName("stations")] List<StationBrief>? Stations = null
);

public record CommodityItem(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("buyPrice")] double BuyPrice,
    [property: JsonPropertyName("sellPrice")] double SellPrice,
    [property: JsonPropertyName("meanPrice")] double MeanPrice,
    [property: JsonPropertyName("stock")] int Stock,
    [property: JsonPropertyName("demand")] int Demand,
    [property: JsonPropertyName("stockBracket")] int StockBracket,
    [property: JsonPropertyName("demandBracket")] int DemandBracket
);

public record StationDetail(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("market_id")] long MarketId,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("system_name")] string SystemName,
    [property: JsonPropertyName("system_id64")] long SystemId64,
    [property: JsonPropertyName("system_x")] double SystemX,
    [property: JsonPropertyName("system_y")] double SystemY,
    [property: JsonPropertyName("system_z")] double SystemZ,
    [property: JsonPropertyName("distanceToArrival")] double DistanceToArrival,
    [property: JsonPropertyName("allegiance")] string? Allegiance = null,
    [property: JsonPropertyName("government")] string? Government = null,
    [property: JsonPropertyName("economy")] string? Economy = null,
    [property: JsonPropertyName("services")] List<string>? Services = null,
    [property: JsonPropertyName("ships")] List<string>? Ships = null,
    [property: JsonPropertyName("modules")] List<string>? Modules = null,
    [property: JsonPropertyName("market")] List<CommodityItem>? Market = null
);

public record CommodityLocation(
    [property: JsonPropertyName("system_name")] string SystemName,
    [property: JsonPropertyName("station_name")] string StationName,
    [property: JsonPropertyName("station_type")] string StationType,
    [property: JsonPropertyName("buyPrice")] double BuyPrice,
    [property: JsonPropertyName("sellPrice")] double SellPrice,
    [property: JsonPropertyName("distance")] double Distance,
    [property: JsonPropertyName("stock")] int Stock,
    [property: JsonPropertyName("demand")] int Demand
);

public record RouteJump(
    [property: JsonPropertyName("system")] string System,
    [property: JsonPropertyName("system_id64")] long SystemId64,
    [property: JsonPropertyName("distance")] double Distance,
    [property: JsonPropertyName("jump")] int Jump,
    [property: JsonPropertyName("fuel_used")] double FuelUsed,
    [property: JsonPropertyName("neutron")] bool Neutron
);

public record RouteResult(
    [property: JsonPropertyName("jumps")] List<RouteJump> Jumps,
    [property: JsonPropertyName("distance")] double Distance,
    [property: JsonPropertyName("total_jumps")] int TotalJumps,
    [property: JsonPropertyName("total_distance")] double TotalDistance,
    [property: JsonPropertyName("efficiency")] double Efficiency,
    [property: JsonPropertyName("range")] double Range
);

public record NearestResult(
    [property: JsonPropertyName("system")] string System,
    [property: JsonPropertyName("distance")] double Distance,
    [property: JsonPropertyName("distance_from_reference")] double DistanceFromReference,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("system_id64")] long SystemId64,
    [property: JsonPropertyName("station")] string? Station,
    [property: JsonPropertyName("station_id64")] long? StationId64
);

public record SearchResponse(
    [property: JsonPropertyName("systems")] List<SystemDetail>? Systems = null,
    [property: JsonPropertyName("stations")] List<StationDetail>? Stations = null,
    [property: JsonPropertyName("bodies")] List<JsonElement>? Bodies = null
);

public record StationSearchResponse(
    [property: JsonPropertyName("count")] int Count,
    [property: JsonPropertyName("from")] int From,
    [property: JsonPropertyName("results")] List<StationDetail> Results,
    [property: JsonPropertyName("size")] int Size,
    [property: JsonPropertyName("search")] StationSearchRequest? Search = null,
    [property: JsonPropertyName("search_reference")] string? SearchReference = null
);

public class SearchFilter
{
    [JsonPropertyName("value")]
    public List<object> Value { get; init; } = new();
}

public class SortDirection
{
    [JsonPropertyName("direction")]
    public string Direction { get; init; } = "asc";
}

public record CoordsRef(
    [property: JsonPropertyName("x")] double X,
    [property: JsonPropertyName("y")] double Y,
    [property: JsonPropertyName("z")] double Z
);

public class StationSearchRequest
{
    [JsonPropertyName("filters")]
    public Dictionary<string, SearchFilter>? Filters { get; init; }
    [JsonPropertyName("sort")]
    public List<Dictionary<string, SortDirection>>? Sort { get; init; }
    [JsonPropertyName("size")]
    public int? Size { get; init; }
    [JsonPropertyName("page")]
    public int? Page { get; init; }
    [JsonPropertyName("reference_coords")]
    public CoordsRef? ReferenceCoords { get; init; }
    [JsonPropertyName("reference_system")]
    public string? ReferenceSystem { get; init; }
}

public class RouteRequest
{
    [JsonPropertyName("from")]
    public string From { get; init; } = "";
    [JsonPropertyName("to")]
    public string To { get; init; } = "";
    [JsonPropertyName("range")]
    public double? Range { get; init; }
    [JsonPropertyName("efficiency")]
    public double? Efficiency { get; init; }
}
