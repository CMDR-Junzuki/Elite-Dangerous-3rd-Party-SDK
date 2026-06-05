using System.Text.Json;
using System.Text.Json.Serialization;

namespace EliteDangerousSdk.Journal;

public static class Parser
{
    public static Dictionary<string, object?> ParseLine(string line)
    {
        var doc = JsonDocument.Parse(line);
        var dict = new Dictionary<string, object?>();
        foreach (var prop in doc.RootElement.EnumerateObject())
        {
            dict[prop.Name] = ElementToObject(prop.Value);
        }
        return dict;
    }

    private static object? ElementToObject(JsonElement el)
    {
        switch (el.ValueKind)
        {
            case JsonValueKind.String:
                return el.GetString();
            case JsonValueKind.Number:
                if (el.TryGetInt64(out long l))
                    return l;
                if (el.TryGetDouble(out double d))
                    return d;
                return el.GetRawText();
            case JsonValueKind.True:
                return true;
            case JsonValueKind.False:
                return false;
            case JsonValueKind.Object:
                var dict = new Dictionary<string, object?>();
                foreach (var prop in el.EnumerateObject())
                    dict[prop.Name] = ElementToObject(prop.Value);
                return dict;
            case JsonValueKind.Array:
                var list = new List<object?>();
                foreach (var item in el.EnumerateArray())
                    list.Add(ElementToObject(item));
                return list;
            case JsonValueKind.Null:
                return null;
            default:
                return null;
        }
    }

    public static Dictionary<string, object?> ParseWithBigInt(string line)
    {
        var result = ParseLine(line);
        result["_bigint"] = true;
        return result;
    }

    public static Dictionary<string, object?> ParseWithLossyIntegers(string line)
    {
        var result = JsonSerializer.Deserialize<Dictionary<string, object?>>(line, new JsonSerializerOptions
        {
            NumberHandling = JsonNumberHandling.AllowReadingFromString
        }) ?? new Dictionary<string, object?>();
        return result;
    }

    public static string StringifyEvent(Dictionary<string, object?> event_)
    {
        return JsonSerializer.Serialize(event_);
    }

    public static string StringifyBigIntJSON(Dictionary<string, object?> event_)
    {
        var options = new JsonSerializerOptions
        {
            Converters = { new BigIntConverter() }
        };
        return JsonSerializer.Serialize(event_, options);
    }

    public static bool IsEventType(Dictionary<string, object?> event_, string eventType)
    {
        return event_.TryGetValue("event", out var val) && val is string s && s == eventType;
    }
}

public class BigIntConverter : JsonConverter<object>
{
    public override object? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotSupportedException("BigIntConverter only supports writing");
    }

    public override void Write(Utf8JsonWriter writer, object value, JsonSerializerOptions options)
    {
        if (value is long l)
        {
            if (l > 9007199254740991L || l < -9007199254740991L)
                writer.WriteStringValue(l.ToString());
            else
                writer.WriteNumberValue(l);
            return;
        }
        var defaultOptions = new JsonSerializerOptions();
        JsonSerializer.Serialize(writer, value, value?.GetType() ?? typeof(object), defaultOptions);
    }
}
