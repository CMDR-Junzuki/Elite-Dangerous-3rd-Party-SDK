using System.Text.Json.Serialization;

namespace EliteDangerousSdk.EliteBGS;

public record PaginatedResponse<T>(
    [property: JsonPropertyName("docs")] List<T> Docs,
    [property: JsonPropertyName("total")] int Total,
    [property: JsonPropertyName("limit")] int Limit,
    [property: JsonPropertyName("page")] int Page,
    [property: JsonPropertyName("pages")] int Pages
);

public record TickTime(
    [property: JsonPropertyName("_id")] string Id,
    [property: JsonPropertyName("time")] string Time,
    [property: JsonPropertyName("updated_at")] string UpdatedAt,
    [property: JsonPropertyName("__v")] int V
);

public record StateEntry(
    [property: JsonPropertyName("state")] string State,
    [property: JsonPropertyName("state_lower")] string StateLower
);

public record ConflictFaction(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("name_lower")] string NameLower,
    [property: JsonPropertyName("stake")] string Stake,
    [property: JsonPropertyName("stake_lower")] string StakeLower,
    [property: JsonPropertyName("days_won")] int DaysWon
);

public record ConflictEntry(
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("faction1")] ConflictFaction Faction1,
    [property: JsonPropertyName("faction2")] ConflictFaction Faction2,
    [property: JsonPropertyName("conflict_type")] string ConflictType
);

public record FactionPresence(
    [property: JsonPropertyName("system_name")] string SystemName,
    [property: JsonPropertyName("system_name_lower")] string SystemNameLower,
    [property: JsonPropertyName("system_id")] string SystemId,
    [property: JsonPropertyName("influence")] double Influence,
    [property: JsonPropertyName("state")] string State,
    [property: JsonPropertyName("state_lower")] string StateLower,
    [property: JsonPropertyName("active_states")] List<StateEntry> ActiveStates,
    [property: JsonPropertyName("pending_states")] List<StateEntry> PendingStates,
    [property: JsonPropertyName("recovering_states")] List<StateEntry> RecoveringStates,
    [property: JsonPropertyName("updated_at")] string UpdatedAt,
    [property: JsonPropertyName("happiness")] string? Happiness = null,
    [property: JsonPropertyName("happiness_lower")] string? HappinessLower = null
);

public record EBGSSystem(
    [property: JsonPropertyName("_id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("name_lower")] string NameLower,
    [property: JsonPropertyName("x")] double X,
    [property: JsonPropertyName("y")] double Y,
    [property: JsonPropertyName("z")] double Z,
    [property: JsonPropertyName("factions")] List<FactionPresence> Factions,
    [property: JsonPropertyName("conflicts")] List<ConflictEntry> Conflicts,
    [property: JsonPropertyName("updated_at")] string UpdatedAt,
    [property: JsonPropertyName("eddb_id")] int? EddbId = null,
    [property: JsonPropertyName("population")] long? Population = null,
    [property: JsonPropertyName("allegiance")] string? Allegiance = null,
    [property: JsonPropertyName("government")] string? Government = null,
    [property: JsonPropertyName("state")] string? State = null,
    [property: JsonPropertyName("security")] string? Security = null,
    [property: JsonPropertyName("primary_economy")] string? PrimaryEconomy = null,
    [property: JsonPropertyName("secondary_economy")] string? SecondaryEconomy = null,
    [property: JsonPropertyName("needs_permit")] bool? NeedsPermit = null,
    [property: JsonPropertyName("controlling_minor_faction")] string? ControllingMinorFaction = null,
    [property: JsonPropertyName("controlling_minor_faction_lower")] string? ControllingMinorFactionLower = null
);

public record EBGSFaction(
    [property: JsonPropertyName("_id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("name_lower")] string NameLower,
    [property: JsonPropertyName("updated_at")] string UpdatedAt,
    [property: JsonPropertyName("faction_presence")] List<FactionPresence> FactionPresence,
    [property: JsonPropertyName("eddb_id")] int? EddbId = null,
    [property: JsonPropertyName("allegiance")] string? Allegiance = null,
    [property: JsonPropertyName("government")] string? Government = null
);

public record EBGSStation(
    [property: JsonPropertyName("_id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("name_lower")] string NameLower,
    [property: JsonPropertyName("system_name")] string SystemName,
    [property: JsonPropertyName("system_name_lower")] string SystemNameLower,
    [property: JsonPropertyName("system_id")] string SystemId,
    [property: JsonPropertyName("updated_at")] string UpdatedAt,
    [property: JsonPropertyName("eddb_id")] int? EddbId = null,
    [property: JsonPropertyName("type")] string? Type = null,
    [property: JsonPropertyName("economy")] string? Economy = null,
    [property: JsonPropertyName("allegiance")] string? Allegiance = null,
    [property: JsonPropertyName("government")] string? Government = null,
    [property: JsonPropertyName("state")] string? State = null
);

public class SystemsQuery
{
    [JsonPropertyName("id")] public string[]? Id { get; set; }
    [JsonPropertyName("eddbId")] public int[]? EddbId { get; set; }
    [JsonPropertyName("name")] public string[]? Name { get; set; }
    [JsonPropertyName("allegiance")] public string[]? Allegiance { get; set; }
    [JsonPropertyName("government")] public string[]? Government { get; set; }
    [JsonPropertyName("state")] public string[]? State { get; set; }
    [JsonPropertyName("primaryEconomy")] public string[]? PrimaryEconomy { get; set; }
    [JsonPropertyName("secondaryEconomy")] public string[]? SecondaryEconomy { get; set; }
    [JsonPropertyName("faction")] public string[]? Faction { get; set; }
    [JsonPropertyName("factionId")] public string[]? FactionId { get; set; }
    [JsonPropertyName("factionControl")] public bool? FactionControl { get; set; }
    [JsonPropertyName("security")] public string[]? Security { get; set; }
    [JsonPropertyName("activeState")] public string[]? ActiveState { get; set; }
    [JsonPropertyName("pendingState")] public string[]? PendingState { get; set; }
    [JsonPropertyName("recoveringState")] public string[]? RecoveringState { get; set; }
    [JsonPropertyName("influenceGT")] public double? InfluenceGT { get; set; }
    [JsonPropertyName("influenceLT")] public double? InfluenceLT { get; set; }
    [JsonPropertyName("factionAllegiance")] public string[]? FactionAllegiance { get; set; }
    [JsonPropertyName("factionGovernment")] public string[]? FactionGovernment { get; set; }
    [JsonPropertyName("referenceSystem")] public string? ReferenceSystem { get; set; }
    [JsonPropertyName("referenceSystemId")] public string? ReferenceSystemId { get; set; }
    [JsonPropertyName("referenceDistance")] public double? ReferenceDistance { get; set; }
    [JsonPropertyName("referenceDistanceMin")] public double? ReferenceDistanceMin { get; set; }
    [JsonPropertyName("sphere")] public bool? Sphere { get; set; }
    [JsonPropertyName("beginsWith")] public string? BeginsWith { get; set; }
    [JsonPropertyName("minimal")] public bool? Minimal { get; set; }
    [JsonPropertyName("factionDetails")] public bool? FactionDetails { get; set; }
    [JsonPropertyName("factionHistory")] public bool? FactionHistory { get; set; }
    [JsonPropertyName("timeMin")] public long? TimeMin { get; set; }
    [JsonPropertyName("timeMax")] public long? TimeMax { get; set; }
    [JsonPropertyName("count")] public int? Count { get; set; }
    [JsonPropertyName("page")] public int? Page { get; set; }
}

public class FactionsQuery
{
    [JsonPropertyName("id")] public string[]? Id { get; set; }
    [JsonPropertyName("eddbId")] public int[]? EddbId { get; set; }
    [JsonPropertyName("name")] public string[]? Name { get; set; }
    [JsonPropertyName("allegiance")] public string[]? Allegiance { get; set; }
    [JsonPropertyName("government")] public string[]? Government { get; set; }
    [JsonPropertyName("beginsWith")] public string? BeginsWith { get; set; }
    [JsonPropertyName("system")] public string[]? System { get; set; }
    [JsonPropertyName("systemId")] public string[]? SystemId { get; set; }
    [JsonPropertyName("filterSystemInHistory")] public bool? FilterSystemInHistory { get; set; }
    [JsonPropertyName("activeState")] public string[]? ActiveState { get; set; }
    [JsonPropertyName("pendingState")] public string[]? PendingState { get; set; }
    [JsonPropertyName("recoveringState")] public string[]? RecoveringState { get; set; }
    [JsonPropertyName("influenceGT")] public double? InfluenceGT { get; set; }
    [JsonPropertyName("influenceLT")] public double? InfluenceLT { get; set; }
    [JsonPropertyName("minimal")] public bool? Minimal { get; set; }
    [JsonPropertyName("systemDetails")] public bool? SystemDetails { get; set; }
    [JsonPropertyName("timeMin")] public long? TimeMin { get; set; }
    [JsonPropertyName("timeMax")] public long? TimeMax { get; set; }
    [JsonPropertyName("count")] public int? Count { get; set; }
    [JsonPropertyName("page")] public int? Page { get; set; }
}

public class StationsQuery
{
    [JsonPropertyName("id")] public string[]? Id { get; set; }
    [JsonPropertyName("eddbId")] public int[]? EddbId { get; set; }
    [JsonPropertyName("name")] public string[]? Name { get; set; }
    [JsonPropertyName("type")] public string[]? Type { get; set; }
    [JsonPropertyName("system")] public string[]? System { get; set; }
    [JsonPropertyName("systemId")] public string[]? SystemId { get; set; }
    [JsonPropertyName("economy")] public string[]? Economy { get; set; }
    [JsonPropertyName("allegiance")] public string[]? Allegiance { get; set; }
    [JsonPropertyName("government")] public string[]? Government { get; set; }
    [JsonPropertyName("state")] public string[]? State { get; set; }
    [JsonPropertyName("beginsWith")] public string? BeginsWith { get; set; }
    [JsonPropertyName("timeMin")] public long? TimeMin { get; set; }
    [JsonPropertyName("timeMax")] public long? TimeMax { get; set; }
    [JsonPropertyName("count")] public int? Count { get; set; }
    [JsonPropertyName("page")] public int? Page { get; set; }
}

public class TicksQuery
{
    [JsonPropertyName("timeMin")] public long? TimeMin { get; set; }
    [JsonPropertyName("timeMax")] public long? TimeMax { get; set; }
}
