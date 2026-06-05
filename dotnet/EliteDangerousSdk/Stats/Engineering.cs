using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using EliteDangerousSdk.Data;

namespace EliteDangerousSdk.Stats
{
    public class StatMod
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Type { get; set; } = "percentage";
        public string Method { get; set; } = "multiplicative";
        public bool HigherBetter { get; set; } = true;
    }

    public class StatChange
    {
        public double OriginalValue { get; set; }
        public double ModifiedValue { get; set; }
        public double Delta { get; set; }
        public double PctChange { get; set; }
    }

    public class AppliedModification
    {
        public string BlueprintName { get; set; } = "";
        public string FdName { get; set; } = "";
        public int Grade { get; set; }
        public string? Special { get; set; }
        public Dictionary<string, StatChange> Changes { get; set; } = new();
    }

    public static class Engineering
    {
        private static readonly Dictionary<string, StatMod> _modStats = new();

        static Engineering()
        {
            if (DataProvider.Modifications.ValueKind != JsonValueKind.Undefined)
            {
                foreach (var prop in DataProvider.Modifications.EnumerateObject())
                {
                    var val = prop.Value;
                    _modStats[prop.Name] = new StatMod
                    {
                        Id = val.GetProperty("id").GetInt32(),
                        Name = val.TryGetProperty("name", out var n) ? n.GetString() ?? prop.Name : prop.Name,
                        Type = val.TryGetProperty("type", out var t) ? t.GetString() ?? "percentage" : "percentage",
                        Method = val.TryGetProperty("method", out var m) ? m.GetString() ?? "multiplicative" : "multiplicative",
                        HigherBetter = !val.TryGetProperty("higherbetter", out var hb) || hb.GetBoolean(),
                    };
                }
            }
        }

        public static StatMod? GetStatMod(string name)
        {
            return _modStats.TryGetValue(name, out var sm) ? sm : null;
        }

        public static Dictionary<string, double> ApplyBlueprintGrade(
            Dictionary<string, double> baseStats,
            Dictionary<string, (double min, double max)> features,
            int grade,
            Dictionary<string, (double min, double max)>? specialFeatures = null,
            double? rollQuality = null)
        {
            var result = new Dictionary<string, double>(baseStats);
            double roll = rollQuality ?? (grade - 1) / 4.0;

            var allFeatures = new Dictionary<string, (double min, double max)>(features);
            if (specialFeatures != null)
            {
                foreach (var (key, val) in specialFeatures)
                {
                    if (allFeatures.TryGetValue(key, out var existing))
                    {
                        allFeatures[key] = (existing.min + val.min, existing.max + val.max);
                    }
                    else
                    {
                        allFeatures[key] = val;
                    }
                }
            }

            foreach (var (statName, (minVal, maxVal)) in allFeatures)
            {
                if (!result.TryGetValue(statName, out var rawValue)) continue;

                if (!_modStats.TryGetValue(statName, out var statDef)) continue;

                double modValue = minVal + (maxVal - minVal) * roll;
                double effectiveMod = statName == "rof" ? (1.0 / (1.0 + modValue) - 1.0) : modValue;

                switch (statDef.Method)
                {
                    case "multiplicative":
                        if (statName == "shieldboost" || statName == "hullboost")
                            result[statName] = (1.0 + rawValue) * (1.0 + effectiveMod) - 1.0;
                        else
                            result[statName] = rawValue * (1.0 + effectiveMod);
                        break;
                    case "additive":
                        result[statName] = rawValue + effectiveMod;
                        break;
                    case "overwrite":
                        result[statName] = effectiveMod;
                        break;
                }
            }

            return result;
        }

        private static Dictionary<string, (double min, double max)> ParseFeatures(JsonElement featuresEl)
        {
            var features = new Dictionary<string, (double min, double max)>();
            foreach (var f in featuresEl.EnumerateObject())
            {
                var arr = f.Value;
                if (arr.ValueKind == JsonValueKind.Array && arr.GetArrayLength() == 2)
                {
                    features[f.Name] = (arr[0].GetDouble(), arr[1].GetDouble());
                }
            }
            return features;
        }

        private static Dictionary<string, double> ParseStatsFromJson(Dictionary<string, double>? existing, JsonElement el)
        {
            var stats = existing ?? new Dictionary<string, double>();
            foreach (var p in el.EnumerateObject())
            {
                if (p.Value.ValueKind == JsonValueKind.Number)
                    stats[p.Name] = p.Value.GetDouble();
            }
            return stats;
        }

        public static AppliedModification ComputeEngineeringChanges(
            Dictionary<string, double> moduleStats,
            JsonElement engineering)
        {
            var bpName = engineering.TryGetProperty("blueprintName", out var bn) ? bn.GetString() ?? "" : "";
            var gradeVal = engineering.TryGetProperty("grade", out var gEl) ? gEl.GetInt32() : 1;

            if (string.IsNullOrEmpty(bpName))
            {
                return new AppliedModification
                {
                    BlueprintName = bpName,
                    FdName = bpName,
                    Grade = gradeVal,
                };
            }

            JsonElement blueprint;
            if (DataProvider.Blueprints.ValueKind == JsonValueKind.Undefined ||
                !DataProvider.Blueprints.TryGetProperty(bpName, out blueprint))
            {
                return new AppliedModification
                {
                    BlueprintName = bpName,
                    FdName = bpName,
                    Grade = gradeVal,
                };
            }

            var gradeKey = (engineering.TryGetProperty("grade", out var gradeEl) ? gradeEl.GetInt32() : 1).ToString();
            JsonElement gradeData;
            if (!blueprint.TryGetProperty("grades", out var gradesEl) ||
                !gradesEl.TryGetProperty(gradeKey, out gradeData))
            {
                var fdName = blueprint.TryGetProperty("fdname", out var fn) ? fn.GetString() ?? bpName : bpName;
                return new AppliedModification
                {
                    BlueprintName = fdName,
                    FdName = fdName,
                    Grade = int.Parse(gradeKey),
                };
            }

            int gradeNum = int.Parse(gradeKey);
            var features = ParseFeatures(gradeData.GetProperty("features"));
            var result = ApplyBlueprintGrade(moduleStats, features, gradeNum, null, 1);

            if (engineering.TryGetProperty("experimentalEffect", out var expEl))
            {
                var expName = expEl.GetString();
                if (!string.IsNullOrEmpty(expName) &&
                    DataProvider.ModifierActions.ValueKind != JsonValueKind.Undefined &&
                    DataProvider.ModifierActions.TryGetProperty(expName, out var specialMods))
                {
                    foreach (var sm in specialMods.EnumerateObject())
                    {
                        if (sm.Value.ValueKind != JsonValueKind.Number) continue;
                        if (!result.ContainsKey(sm.Name)) continue;
                        if (!_modStats.TryGetValue(sm.Name, out var statDef)) continue;

                        double rawVal = sm.Value.GetDouble();
                        double effectiveVal = sm.Name == "rof" ? (1.0 / (1.0 + rawVal) - 1.0) : rawVal;

                        switch (statDef.Method)
                        {
                            case "multiplicative":
                                if (sm.Name == "shieldboost" || sm.Name == "hullboost")
                                    result[sm.Name] = (1.0 + result[sm.Name]) * (1.0 + effectiveVal) - 1.0;
                                else
                                    result[sm.Name] = result[sm.Name] * (1.0 + effectiveVal);
                                break;
                            case "additive":
                                result[sm.Name] = result[sm.Name] + effectiveVal;
                                break;
                            case "overwrite":
                                result[sm.Name] = effectiveVal;
                                break;
                        }
                    }
                }
            }

            var changes = new Dictionary<string, StatChange>();
            foreach (var (statName, modVal) in result)
            {
                if (!moduleStats.TryGetValue(statName, out var origVal)) continue;
                double delta = modVal - origVal;
                changes[statName] = new StatChange
                {
                    OriginalValue = origVal,
                    ModifiedValue = modVal,
                    Delta = delta,
                    PctChange = origVal != 0 ? delta / origVal : 0,
                };
            }

            var resultFdName = blueprint.TryGetProperty("fdname", out var fn1) ? fn1.GetString() ?? bpName : bpName;
            return new AppliedModification
            {
                BlueprintName = resultFdName,
                FdName = resultFdName,
                Grade = gradeNum,
                Special = engineering.TryGetProperty("experimentalEffect", out var exp) ? exp.GetString() : null,
                Changes = changes,
            };
        }

        public static List<string> GetAvailableBlueprints(string moduleGroup)
        {
            if (DataProvider.ModuleBlueprintMap.ValueKind == JsonValueKind.Undefined ||
                !DataProvider.ModuleBlueprintMap.TryGetProperty(moduleGroup, out var mapping))
            {
                return new List<string>();
            }
            if (!mapping.TryGetProperty("blueprints", out var bps))
            {
                return new List<string>();
            }
            return bps.EnumerateObject().Select(p => p.Name).ToList();
        }
    }
}
