#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using EliteDangerousSdk.Data;

namespace EliteDangerousSdk.Planner
{
    public class MaterialRequirement
    {
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public int Grade { get; set; }
        public int Needed { get; set; }
        public int Available { get; set; }
        public int Missing { get; set; }
    }

    public class TradeUpOption
    {
        public string FromMaterial { get; set; } = "";
        public string FromCategory { get; set; } = "";
        public int FromGrade { get; set; }
        public int FromQuantityNeeded { get; set; }
        public int Ratio { get; set; }
        public int AvailableInInventory { get; set; }
        public bool Feasible { get; set; }
    }

    public class MissingMaterial : MaterialRequirement
    {
        public List<TradeUpOption> TradeUps { get; set; } = new();
        public bool CanTradeUp { get; set; }
    }

    public class BuildEvaluation
    {
        public EngineeringPlan Plan { get; set; } = new();
        public MaterialInventory? Inventory { get; set; }
        public List<MaterialRequirement> Requirements { get; set; } = new();
        public List<MissingMaterial> Missing { get; set; } = new();
        public bool CanCraftAll { get; set; } = true;
        public bool CanCraftWithTrades { get; set; } = true;
        public int TotalMaterialsNeeded { get; set; }
        public int TotalMissing { get; set; }
        public List<string> Engineers { get; set; } = new();
    }

    public static class DependencyGraph
    {
        private static readonly Dictionary<string, (string category, int grade)> _materialMeta;

        static DependencyGraph()
        {
            _materialMeta = new Dictionary<string, (string, int)>();
            foreach (var m in DataProvider.Materials)
            {
                var name = GetStr(m, "name");
                if (string.IsNullOrEmpty(name)) continue;
                var type = GetStr(m, "type");
                var rarity = GetInt(m, "rarity");
                _materialMeta[name] = (type?.ToLowerInvariant() ?? "manufactured", rarity);
            }
        }

        private static string? GetStr(JsonElement el, string key) =>
            el.TryGetProperty(key, out var v) && v.ValueKind == JsonValueKind.String ? v.GetString() : null;

        private static int GetInt(JsonElement el, string key)
        {
            if (!el.TryGetProperty(key, out var v)) return 0;
            if (v.ValueKind == JsonValueKind.Number) return v.GetInt32();
            if (v.ValueKind == JsonValueKind.String && int.TryParse(v.GetString(), out var parsed)) return parsed;
            return 0;
        }

        private static (string category, int grade) GetMaterialInfo(string name, MaterialInventory? inventory)
        {
            if (_materialMeta.TryGetValue(name, out var known)) return known;
            if (inventory != null)
            {
                var entry = inventory.Materials.FirstOrDefault(m => m.Name == name);
                if (entry != null)
                {
                    var cat = _materialMeta.TryGetValue(entry.Name, out var k) ? k.category : "manufactured";
                    var grd = entry.Grade != 0 ? entry.Grade : (_materialMeta.TryGetValue(entry.Name, out var k2) ? k2.grade : 3);
                    return (cat, grd);
                }
            }
            return ("manufactured", 3);
        }

        public static int TradeRatio(int fromGrade, int toGrade)
        {
            int diff = Math.Abs(toGrade - fromGrade);
            return (int)Math.Pow(6, Math.Max(1, diff));
        }

        public static BuildEvaluation EvaluateBuild(
            List<PlannedModification> modifications,
            MaterialInventory? inventory = null)
        {
            var plan = EngineeringPlanner.PlanEngineering(modifications);
            var requirements = new List<MaterialRequirement>();
            var missing = new List<MissingMaterial>();
            bool canCraftAll = true;
            int totalNeeded = 0;
            int totalMissing = 0;

            foreach (var kv in plan.MaterialTotal)
            {
                var info = GetMaterialInfo(kv.Key, inventory);
                var available = inventory?.Materials.FirstOrDefault(m => m.Name == kv.Key)?.Count ?? 0;
                var missingQty = Math.Max(0, kv.Value - available);
                totalNeeded += kv.Value;

                var req = new MaterialRequirement
                {
                    Name = kv.Key,
                    Category = info.category,
                    Grade = info.grade,
                    Needed = kv.Value,
                    Available = available,
                    Missing = missingQty,
                };
                requirements.Add(req);

                if (missingQty > 0)
                {
                    canCraftAll = false;
                    totalMissing += missingQty;
                    var tradeUps = ComputeTradeUps(kv.Key, info.category, info.grade, missingQty, inventory);
                    missing.Add(new MissingMaterial
                    {
                        Name = req.Name,
                        Category = req.Category,
                        Grade = req.Grade,
                        Needed = req.Needed,
                        Available = req.Available,
                        Missing = req.Missing,
                        TradeUps = tradeUps,
                        CanTradeUp = tradeUps.Any(t => t.Feasible),
                    });
                }
            }

            return new BuildEvaluation
            {
                Plan = plan,
                Inventory = inventory,
                Requirements = requirements,
                Missing = missing,
                CanCraftAll = canCraftAll,
                CanCraftWithTrades = missing.All(m => m.CanTradeUp),
                TotalMaterialsNeeded = totalNeeded,
                TotalMissing = totalMissing,
                Engineers = plan.Engineers,
            };
        }

        private static List<TradeUpOption> ComputeTradeUps(
            string targetName,
            string targetCategory,
            int targetGrade,
            int missingQty,
            MaterialInventory? inventory)
        {
            if (inventory == null) return new List<TradeUpOption>();

            var options = new List<TradeUpOption>();

            foreach (var entry in inventory.Materials)
            {
                if (entry.Count <= 0) continue;
                var entryType = _materialMeta.TryGetValue(entry.Name, out var k) ? k.category : "manufactured";
                var entryGrade = entry.Grade != 0 ? entry.Grade : (_materialMeta.TryGetValue(entry.Name, out var k2) ? k2.grade : 0);

                if (entryType != targetCategory || entryGrade > targetGrade) continue;

                var ratio = TradeRatio(entryGrade, targetGrade);
                var fromQty = ratio * missingQty;

                options.Add(new TradeUpOption
                {
                    FromMaterial = entry.Name,
                    FromCategory = entryType,
                    FromGrade = entryGrade,
                    FromQuantityNeeded = fromQty,
                    Ratio = ratio,
                    AvailableInInventory = entry.Count,
                    Feasible = entry.Count >= fromQty,
                });
            }

            options.Sort((a, b) =>
            {
                if (a.Feasible != b.Feasible) return a.Feasible ? -1 : 1;
                return a.FromQuantityNeeded.CompareTo(b.FromQuantityNeeded);
            });

            return options;
        }
    }
}
