using System.Text.Json;
using System.Text.Json.Serialization;

namespace EliteDangerousSdk.Inara;

public record InaraResponseHeader(
    [property: JsonPropertyName("eventStatus")] int EventStatus,
    [property: JsonPropertyName("eventStatusText")] string? EventStatusText = null
);

public record InaraEventResult(
    [property: JsonPropertyName("eventStatus")] int EventStatus,
    [property: JsonPropertyName("eventStatusText")] string? EventStatusText = null,
    [property: JsonPropertyName("eventData")] JsonElement? EventData = null
);

public record InaraResponse(
    [property: JsonPropertyName("header")] InaraResponseHeader Header,
    [property: JsonPropertyName("events")] List<InaraEventResult> Events
);
