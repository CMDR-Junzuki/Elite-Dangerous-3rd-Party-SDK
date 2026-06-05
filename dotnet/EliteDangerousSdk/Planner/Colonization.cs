using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Planner
{
    public enum ColonyState
    {
        None = 0,
        Claimed = 1,
        BeaconPlaced = 2,
        PrimaryPortBuilding = 3,
        Active = 4,
        Failed = 5,
    }

    public static class ColonyStateNames
    {
        public static string GetName(ColonyState state) => state switch
        {
            ColonyState.None => "None",
            ColonyState.Claimed => "Claimed",
            ColonyState.BeaconPlaced => "Beacon Placed",
            ColonyState.PrimaryPortBuilding => "Primary Port Building",
            ColonyState.Active => "Active",
            ColonyState.Failed => "Failed",
            _ => "",
        };
    }

    public class ConstructionResource
    {
        public string Name { get; set; } = "";
        public string NameLocalised { get; set; } = "";
        public int RequiredAmount { get; set; }
        public int ProvidedAmount { get; set; }
        public int Payment { get; set; }
    }

    public class ConstructionSite
    {
        public string Id { get; set; } = "";
        public long MarketId { get; set; }
        public bool PrimaryPort { get; set; }
        public double ConstructionProgress { get; set; }
        public bool ConstructionComplete { get; set; }
        public bool ConstructionFailed { get; set; }
        public List<ConstructionResource> ResourcesRequired { get; set; } = new();
    }

    public class ColonySystem
    {
        public string SystemName { get; set; } = "";
        public string Architect { get; set; } = "";
        public ColonyState State { get; set; } = ColonyState.None;
        public List<ConstructionSite> ConstructionSites { get; set; } = new();
        public int CompletedStructures { get; set; }
        public int TotalSlots { get; set; }
    }

    public static class Colonization
    {
        private static int _nextId = 1;
        private static string GenId() => $"col-{_nextId++}";

        public static ConstructionSite CreateConstructionSite(long marketId, bool primaryPort = false)
        {
            return new ConstructionSite
            {
                Id = GenId(),
                MarketId = marketId,
                PrimaryPort = primaryPort,
            };
        }

        public static int GetResourceShortfall(ConstructionResource resource) =>
            Math.Max(0, resource.RequiredAmount - resource.ProvidedAmount);

        public static double GetTotalProgress(ConstructionSite site)
        {
            if (site.ResourcesRequired.Count == 0) return site.ConstructionProgress;
            var totalRequired = site.ResourcesRequired.Sum(r => r.RequiredAmount);
            if (totalRequired == 0) return site.ConstructionProgress;
            var totalProvided = site.ResourcesRequired.Sum(r => r.ProvidedAmount);
            return (double)totalProvided / totalRequired;
        }

        public static ConstructionSite ParseColonisationConstructionDepot(Dictionary<string, object> event_)
        {
            var resources = new List<ConstructionResource>();
            if (event_.TryGetValue("ResourcesRequired", out var raw) && raw is List<object> rawList)
            {
                foreach (var item in rawList)
                {
                    if (item is Dictionary<string, object> r)
                    {
                        var name = r.GetValueOrDefault("Name", "")?.ToString() ?? "";
                        resources.Add(new ConstructionResource
                        {
                            Name = name,
                            NameLocalised = r.GetValueOrDefault("Name_Localised", name)?.ToString() ?? name,
                            RequiredAmount = Convert.ToInt32(r.GetValueOrDefault("RequiredAmount", 0)),
                            ProvidedAmount = Convert.ToInt32(r.GetValueOrDefault("ProvidedAmount", 0)),
                            Payment = Convert.ToInt32(r.GetValueOrDefault("Payment", 0)),
                        });
                    }
                }
            }
            return new ConstructionSite
            {
                Id = GenId(),
                MarketId = Convert.ToInt64(event_.GetValueOrDefault("MarketID", 0L)),
                ConstructionProgress = Convert.ToDouble(event_.GetValueOrDefault("ConstructionProgress", 0.0)),
                ConstructionComplete = Convert.ToBoolean(event_.GetValueOrDefault("ConstructionComplete", false)),
                ConstructionFailed = Convert.ToBoolean(event_.GetValueOrDefault("ConstructionFailed", false)),
                ResourcesRequired = resources,
            };
        }
    }
}
