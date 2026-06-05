using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Planner
{
    public class MaterialEntry
    {
        public string Name { get; set; } = "";
        public int? EdId { get; set; }
        public string Category { get; set; } = "";
        public int Grade { get; set; }
        public int Count { get; set; }
        public int MaxCapacity { get; set; } = 1000;
    }

    public class MaterialInventory
    {
        public List<MaterialEntry> Materials { get; set; } = new();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    public class BlueprintRequirement
    {
        public string MaterialName { get; set; } = "";
        public int Quantity { get; set; }
        public int Grade { get; set; }
    }

    public static class MaterialCaps
    {
        public static readonly Dictionary<int, int> ByGrade = new()
        {
            [1] = 3000, [2] = 3000, [3] = 3000, [4] = 3000, [5] = 3000,
        };
    }

    public static class Materials
    {
        public static MaterialInventory CreateInventory()
        {
            return new MaterialInventory
            {
                Materials = new List<MaterialEntry>(),
                Timestamp = DateTime.UtcNow,
            };
        }

        public static MaterialInventory UpdateInventory(MaterialInventory inv, string materialName, int change)
        {
            var entry = inv.Materials.FirstOrDefault(m => m.Name == materialName);
            if (entry != null)
            {
                entry.Count = Math.Max(0, Math.Min(entry.MaxCapacity, entry.Count + change));
            }
            inv.Timestamp = DateTime.UtcNow;
            return inv;
        }

        public static (bool canCraft, List<(string name, int have, int need)> missing) CanCraftBlueprint(
            MaterialInventory inv, List<BlueprintRequirement> requirements)
        {
            var missing = new List<(string, int, int)>();
            bool canCraft = true;
            foreach (var req in requirements)
            {
                var entry = inv.Materials.FirstOrDefault(m => m.Name == req.MaterialName);
                var have = entry?.Count ?? 0;
                if (have < req.Quantity)
                {
                    canCraft = false;
                    missing.Add((req.MaterialName, have, req.Quantity));
                }
            }
            return (canCraft, missing);
        }
    }
}
