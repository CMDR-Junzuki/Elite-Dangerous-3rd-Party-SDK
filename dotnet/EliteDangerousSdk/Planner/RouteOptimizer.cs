using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Planner
{
    public class StationMarket
    {
        public TradeStation Station { get; set; } = new();
        public List<TradeCommodity> Supplies { get; set; } = new();
        public List<TradeCommodity> Demands { get; set; } = new();
    }

    public class MultiHopRoute
    {
        public List<TradeRoute> Hops { get; set; } = new();
        public double TotalProfit { get; set; }
        public double TotalDistance { get; set; }
        public double ProfitPerJump { get; set; }
        public double ProfitPerLy { get; set; }
        public bool RoundTrip { get; set; }
    }

    public class RouteOptimizerOptions
    {
        public double? MaxDistance { get; set; }
        public int? TopN { get; set; }
        public double? CargoCapacity { get; set; }
    }

    public static class RouteOptimizer
    {
        public static List<TradeRoute> ComputeSingleHopRoutes(
            List<StationMarket> stations,
            double cargoCapacity,
            double? maxDistance = null)
        {
            var routes = new List<TradeRoute>();
            var dist = maxDistance ?? 0;

            for (int i = 0; i < stations.Count; i++)
            {
                for (int j = 0; j < stations.Count; j++)
                {
                    if (i == j) continue;

                    var from = stations[i];
                    var to = stations[j];

                    foreach (var supply in from.Supplies)
                    {
                        var demand = to.Demands.FirstOrDefault(
                            d => d.Symbol == supply.Symbol && d.SellPrice > supply.BuyPrice);
                        if (demand == null) continue;

                        var profit = Trade.CalculateProfit(supply.BuyPrice, demand.SellPrice, cargoCapacity);

                        if (profit.perUnit <= 0) continue;

                        routes.Add(new TradeRoute
                        {
                            Source = from.Station,
                            Destination = to.Station,
                            Commodity = demand,
                            ProfitPerUnit = profit.perUnit,
                            TotalProfit = profit.total,
                            CargoCapacity = cargoCapacity,
                            DistanceLy = dist,
                            ProfitPerLy = dist > 0 ? profit.total / dist : profit.total,
                        });
                    }
                }
            }

            return routes;
        }

        private static Dictionary<string, List<TradeRoute>> BuildAdjacency(List<TradeRoute> routes)
        {
            var adj = new Dictionary<string, List<TradeRoute>>();
            foreach (var h in routes)
            {
                if (!adj.ContainsKey(h.Source.Name))
                    adj[h.Source.Name] = new List<TradeRoute>();
                adj[h.Source.Name].Add(h);
            }
            return adj;
        }

        public static List<MultiHopRoute> FindRoundTrips(
            List<StationMarket> stations,
            double? cargoCapacity = null,
            double? maxDistance = null,
            int? topN = null)
        {
            var cap = cargoCapacity ?? 100;
            var singleHops = ComputeSingleHopRoutes(stations, cap, maxDistance);
            var roundTrips = new List<MultiHopRoute>();

            foreach (var outbound in singleHops)
            {
                var returns = singleHops.Where(h =>
                    h.Source.Name == outbound.Destination.Name &&
                    h.Destination.Name == outbound.Source.Name &&
                    h.Commodity.Symbol != outbound.Commodity.Symbol).ToList();

                foreach (var ret in returns)
                {
                    var total = outbound.TotalProfit + ret.TotalProfit;
                    var totalDist = outbound.DistanceLy + ret.DistanceLy;
                    roundTrips.Add(new MultiHopRoute
                    {
                        Hops = new List<TradeRoute> { outbound, ret },
                        TotalProfit = total,
                        TotalDistance = totalDist,
                        ProfitPerJump = total / 2,
                        ProfitPerLy = totalDist > 0 ? total / totalDist : total,
                        RoundTrip = true,
                    });
                }
            }

            roundTrips.Sort((a, b) => b.TotalProfit.CompareTo(a.TotalProfit));
            return topN.HasValue ? roundTrips.Take(topN.Value).ToList() : roundTrips;
        }

        public static List<MultiHopRoute> FindMultiHopRoutes(
            List<StationMarket> stations,
            int maxHops,
            double? cargoCapacity = null,
            double? maxDistance = null,
            int? topN = null)
        {
            var cap = cargoCapacity ?? 100;
            var singleHops = ComputeSingleHopRoutes(stations, cap, maxDistance);

            if (maxHops <= 1)
            {
                return singleHops.Select(h => new MultiHopRoute
                {
                    Hops = new List<TradeRoute> { h },
                    TotalProfit = h.TotalProfit,
                    TotalDistance = h.DistanceLy,
                    ProfitPerJump = h.TotalProfit,
                    ProfitPerLy = h.ProfitPerLy,
                    RoundTrip = false,
                }).ToList();
            }

            var adj = BuildAdjacency(singleHops);
            var results = new List<MultiHopRoute>();

            foreach (var start in singleHops)
            {
                var stack = new Stack<(List<TradeRoute> path, HashSet<string> visited)>();
                stack.Push((new List<TradeRoute> { start }, new HashSet<string> { start.Source.Name }));

                while (stack.Count > 0)
                {
                    var (path, visited) = stack.Pop();
                    var last = path[path.Count - 1];

                    if (path.Count >= 2 && last.Destination.Name == start.Source.Name)
                    {
                        var total = path.Sum(h => h.TotalProfit);
                        var totalDist = path.Sum(h => h.DistanceLy);
                        results.Add(new MultiHopRoute
                        {
                            Hops = new List<TradeRoute>(path),
                            TotalProfit = total,
                            TotalDistance = totalDist,
                            ProfitPerJump = total / path.Count,
                            ProfitPerLy = totalDist > 0 ? total / totalDist : total,
                            RoundTrip = path.Count > 1,
                        });
                        continue;
                    }

                    if (path.Count >= maxHops) continue;

                    if (!adj.ContainsKey(last.Destination.Name)) continue;
                    foreach (var next in adj[last.Destination.Name])
                    {
                        if (visited.Contains(next.Destination.Name) && next.Destination.Name != start.Source.Name)
                            continue;
                        var newVisited = new HashSet<string>(visited) { next.Destination.Name };
                        var newPath = new List<TradeRoute>(path) { next };
                        stack.Push((newPath, newVisited));
                    }
                }
            }

            results.Sort((a, b) => b.TotalProfit.CompareTo(a.TotalProfit));
            return topN.HasValue ? results.Take(topN.Value).ToList() : results;
        }

        public static List<FarmingSuggestion> SuggestMaterialFarming(string category, int grade)
        {
            var suggestions = new Dictionary<string, List<FarmingSuggestion>>(StringComparer.OrdinalIgnoreCase)
            {
                ["raw"] = new()
                {
                    new() { Activity = "Surface prospecting", Description = "SRV prospecting on planetary surfaces" },
                    new() { Activity = "Mining", Description = "Laser mining in asteroid belts" },
                    new() { Activity = "Deep core mining", Description = "Core mining with seismic charges" },
                },
                ["manufactured"] = new()
                {
                    new() { Activity = "Combat", Description = "Destroying ships for manufactured materials" },
                    new() { Activity = "Signal sources", Description = "Encoded/combat signal sources" },
                    new() { Activity = "Fleet Carrier looting", Description = "Looting fleet carrier wrecks" },
                },
                ["encoded"] = new()
                {
                    new() { Activity = "Scanning ships", Description = "Scanning wakes and ships with data link scanner" },
                    new() { Activity = "Planetary settlements", Description = "Scanning data points at settlements" },
                    new() { Activity = "Signal sources", Description = "Encoded signal sources" },
                },
                ["micro"] = new()
                {
                    new() { Activity = "On-foot settlements", Description = "Looting containers at on-foot settlements" },
                    new() { Activity = "Mission rewards", Description = "On-foot mission rewards" },
                },
            };

            var catLower = category.ToLowerInvariant();
            var base_ = suggestions.TryGetValue(catLower, out var list)
                ? new List<FarmingSuggestion>(list)
                : new List<FarmingSuggestion>();

            if (grade >= 4)
            {
                base_.Add(new FarmingSuggestion
                {
                    Activity = grade >= 5 ? "Mission rewards (high-grade)" : "Mission rewards",
                    Description = grade >= 5
                        ? "High-grade mission rewards for Grade 5 materials"
                        : "Mission rewards for higher-grade materials",
                });
            }

            return base_;
        }
    }

    public class FarmingSuggestion
    {
        public string Activity { get; set; } = "";
        public string Description { get; set; } = "";
    }
}
