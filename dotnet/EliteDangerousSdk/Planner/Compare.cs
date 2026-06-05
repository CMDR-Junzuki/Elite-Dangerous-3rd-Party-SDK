using System.Text.Json;

namespace EliteDangerousSdk.Planner
{
    public class ShipComparisonRow
    {
        public string Stat { get; set; } = "";
        public List<object?> Values { get; set; } = new();
    }

    public static class Compare
    {
        private static readonly (string label, string prop)[] StatFields =
        [
            ("Name", "name"),
            ("Manufacturer", "manufacturer"),
            ("Hull Mass (t)", "hullMass"),
            ("Base Armour", "baseArmour"),
            ("Base Shield", "baseShieldStrength"),
            ("Speed (m/s)", "speed"),
            ("Boost (m/s)", "boost"),
            ("Pitch Rate", "pitch"),
            ("Roll Rate", "roll"),
            ("Yaw Rate", "yaw"),
            ("Hardness", "hardness"),
            ("Mass Lock Factor", "masslock"),
            ("Heat Capacity", "heatCapacity"),
            ("Reserve Fuel (t)", "reserveFuelCapacity"),
            ("Crew", "crew"),
            ("Hull Cost (CR)", "hullCost"),
        ];

        private static readonly (string label, string slotKey)[] SlotTypes =
        [
            ("Total Standard Slots", "standard"),
            ("Total Hardpoints", "hardpoints"),
            ("Total Internal Slots", "internal"),
        ];

        public static List<ShipComparisonRow> CompareShips(List<JsonElement> ships)
        {
            var rows = new List<ShipComparisonRow>();

            foreach (var (label, prop) in StatFields)
            {
                var values = new List<object?>();
                foreach (var ship in ships)
                {
                    object? val = null;
                    if (ship.TryGetProperty("properties", out var props) &&
                        props.TryGetProperty(prop, out var propVal))
                    {
                        val = ExtractValue(propVal);
                    }
                    values.Add(val);
                }
                rows.Add(new ShipComparisonRow { Stat = label, Values = values });
            }

            foreach (var (label, slotKey) in SlotTypes)
            {
                var values = new List<object?>();
                foreach (var ship in ships)
                {
                    int? count = null;
                    if (ship.TryGetProperty("slots", out var slots) &&
                        slots.TryGetProperty(slotKey, out var slotArr) &&
                        slotArr.ValueKind == JsonValueKind.Array)
                    {
                        count = slotArr.GetArrayLength();
                    }
                    values.Add(count);
                }
                rows.Add(new ShipComparisonRow { Stat = label, Values = values });
            }

            return rows;
        }

        private static object? ExtractValue(JsonElement el)
        {
            return el.ValueKind switch
            {
                JsonValueKind.String => el.GetString(),
                JsonValueKind.Number => el.TryGetInt64(out var l) ? l : el.GetDouble(),
                JsonValueKind.True => true,
                JsonValueKind.False => false,
                _ => null,
            };
        }

        public static string FormatComparisonTable(List<ShipComparisonRow> rows, List<string> shipNames)
        {
            var header = "Stat | " + string.Join(" | ", shipNames);
            var separator = "--- | " + string.Join(" | ", shipNames.Select(_ => "---"));

            var body = rows.Select(row =>
            {
                var vals = row.Values.Select(v => v?.ToString() ?? "N/A");
                return row.Stat + " | " + string.Join(" | ", vals);
            });

            return string.Join("\n", new[] { header, separator }.Concat(body));
        }
    }
}
