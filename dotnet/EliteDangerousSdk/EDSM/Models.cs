using System.Text.Json;
using System.Text.Json.Serialization;

namespace EliteDangerousSdk.EDSM;

public record Coords(
    [property: JsonPropertyName("x")] double X,
    [property: JsonPropertyName("y")] double Y,
    [property: JsonPropertyName("z")] double Z
);

public record DuplicateInfo(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name
);

public record RingInfo(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("mass")] double Mass,
    [property: JsonPropertyName("innerRadius")] double InnerRadius,
    [property: JsonPropertyName("outerRadius")] double OuterRadius
);

public record MarketItem(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("sellPrice")] int SellPrice,
    [property: JsonPropertyName("buyPrice")] int BuyPrice,
    [property: JsonPropertyName("stock")] int Stock,
    [property: JsonPropertyName("demand")] int Demand,
    [property: JsonPropertyName("stockBracket")] int StockBracket,
    [property: JsonPropertyName("demandBracket")] int DemandBracket
);

public record ShipyardItem(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("value")] long Value
);

public record OutfittingItem(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("buyPrice")] int BuyPrice
);

public record EstimateDetail(
    [property: JsonPropertyName("bodyName")] string BodyName,
    [property: JsonPropertyName("estimatedValue")] long EstimatedValue,
    [property: JsonPropertyName("mappedValue")] long MappedValue
);

public record FactionState(
    [property: JsonPropertyName("state")] string State,
    [property: JsonPropertyName("trend")] int? Trend = null
);

public record TimedCount(
    [property: JsonPropertyName("month")] long Month,
    [property: JsonPropertyName("count")] long Count
);

public record SystemResponse(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("coords")] Coords? Coords = null,
    [property: JsonPropertyName("requirePermit")] bool? RequirePermit = null,
    [property: JsonPropertyName("permitName")] string? PermitName = null,
    [property: JsonPropertyName("information")] JsonElement? Information = null,
    [property: JsonPropertyName("primaryStar")] string? PrimaryStar = null,
    [property: JsonPropertyName("hidden_at")] string? HiddenAt = null,
    [property: JsonPropertyName("mergedTo")] JsonElement? MergedTo = null,
    [property: JsonPropertyName("duplicates")] List<DuplicateInfo>? Duplicates = null
);

public record BodyInfo(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("subType")] string SubType,
    [property: JsonPropertyName("distanceToArrival")] double DistanceToArrival,
    [property: JsonPropertyName("isMainStar")] bool? IsMainStar = null,
    [property: JsonPropertyName("isScoopable")] bool? IsScoopable = null,
    [property: JsonPropertyName("age")] long? Age = null,
    [property: JsonPropertyName("luminosity")] string? Luminosity = null,
    [property: JsonPropertyName("absoluteMagnitude")] double? AbsoluteMagnitude = null,
    [property: JsonPropertyName("solarMasses")] double? SolarMasses = null,
    [property: JsonPropertyName("solarRadius")] double? SolarRadius = null,
    [property: JsonPropertyName("surfaceTemperature")] double? SurfaceTemperature = null,
    [property: JsonPropertyName("orbitalPeriod")] double? OrbitalPeriod = null,
    [property: JsonPropertyName("semiMajorAxis")] double? SemiMajorAxis = null,
    [property: JsonPropertyName("orbitalEccentricity")] double? OrbitalEccentricity = null,
    [property: JsonPropertyName("orbitalInclination")] double? OrbitalInclination = null,
    [property: JsonPropertyName("argOfPeriapsis")] double? ArgOfPeriapsis = null,
    [property: JsonPropertyName("rotationalPeriod")] double? RotationalPeriod = null,
    [property: JsonPropertyName("rotationalPeriodTidallyLocked")] bool? RotationalPeriodTidallyLocked = null,
    [property: JsonPropertyName("axialTilt")] double? AxialTilt = null,
    [property: JsonPropertyName("isLandable")] bool? IsLandable = null,
    [property: JsonPropertyName("gravity")] double? Gravity = null,
    [property: JsonPropertyName("earthMasses")] double? EarthMasses = null,
    [property: JsonPropertyName("radius")] double? Radius = null,
    [property: JsonPropertyName("volcanismType")] string? VolcanismType = null,
    [property: JsonPropertyName("atmosphereType")] string? AtmosphereType = null,
    [property: JsonPropertyName("terraformingState")] string? TerraformingState = null,
    [property: JsonPropertyName("rings")] List<RingInfo>? Rings = null,
    [property: JsonPropertyName("materials")] Dictionary<string, double>? Materials = null
);

public record StationInfo(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("distanceToArrival")] double DistanceToArrival,
    [property: JsonPropertyName("allegiance")] string? Allegiance = null,
    [property: JsonPropertyName("government")] string? Government = null,
    [property: JsonPropertyName("economy")] string? Economy = null,
    [property: JsonPropertyName("haveMarket")] bool? HaveMarket = null,
    [property: JsonPropertyName("haveShipyard")] bool? HaveShipyard = null,
    [property: JsonPropertyName("haveOutfitting")] bool? HaveOutfitting = null,
    [property: JsonPropertyName("otherServices")] List<string>? OtherServices = null,
    [property: JsonPropertyName("market")] MarketData? Market = null,
    [property: JsonPropertyName("shipyard")] ShipyardData? Shipyard = null,
    [property: JsonPropertyName("outfitting")] OutfittingData? Outfitting = null
);

public record MarketData(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("items")] List<MarketItem> Items
);

public record ShipyardData(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("ships")] List<ShipyardItem> Ships
);

public record OutfittingData(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("modules")] List<OutfittingItem> Modules
);

public record EstimatedValue(
    [property: JsonPropertyName("estimatedValue")] long Value,
    [property: JsonPropertyName("mappedValue")] long MappedValue,
    [property: JsonPropertyName("details")] List<EstimateDetail> Details
);

public record FactionInfo(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("allegiance")] string Allegiance,
    [property: JsonPropertyName("government")] string Government,
    [property: JsonPropertyName("influence")] double Influence,
    [property: JsonPropertyName("state")] string State,
    [property: JsonPropertyName("activeStates")] List<FactionState>? ActiveStates = null,
    [property: JsonPropertyName("pendingStates")] List<FactionState>? PendingStates = null
);

public record BodiesResponse(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("bodies")] List<BodyInfo> Bodies
);

public record StationsResponse(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("stations")] List<StationInfo> Stations
);

public record FactionsResponse(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("factions")] List<FactionInfo> Factions
);

public record TrafficResponse(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("traffic")] List<TimedCount> Traffic
);

public record DeathsResponse(
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("deaths")] List<TimedCount> Deaths
);

public record SphereSystemResult(
    [property: JsonPropertyName("distance")] double Distance,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("id")] long Id,
    [property: JsonPropertyName("coords")] Coords? Coords = null,
    [property: JsonPropertyName("requirePermit")] bool? RequirePermit = null,
    [property: JsonPropertyName("permitName")] string? PermitName = null,
    [property: JsonPropertyName("information")] JsonElement? Information = null,
    [property: JsonPropertyName("primaryStar")] string? PrimaryStar = null,
    [property: JsonPropertyName("hidden_at")] string? HiddenAt = null,
    [property: JsonPropertyName("mergedTo")] JsonElement? MergedTo = null,
    [property: JsonPropertyName("duplicates")] List<DuplicateInfo>? Duplicates = null
);
