using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Planner
{
    public class TradeStation
    {
        public string Name { get; set; } = "";
        public string System { get; set; } = "";
        public double? DistanceFromStar { get; set; }
    }

    public class TradeCommodity
    {
        public string Symbol { get; set; } = "";
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public double BuyPrice { get; set; }
        public double SellPrice { get; set; }
        public int Stock { get; set; }
        public int Demand { get; set; }
        public bool IsRare { get; set; }
    }

    public class TradeRoute
    {
        public TradeStation Source { get; set; } = new();
        public TradeStation Destination { get; set; } = new();
        public TradeCommodity Commodity { get; set; } = new();
        public double ProfitPerUnit { get; set; }
        public double TotalProfit { get; set; }
        public double CargoCapacity { get; set; }
        public double DistanceLy { get; set; }
        public double ProfitPerLy { get; set; }
    }

    public static class Trade
    {
        public static (double perUnit, double total) CalculateProfit(double buyPrice, double sellPrice, double cargoCapacity)
        {
            var perUnit = sellPrice - buyPrice;
            return (perUnit, perUnit * cargoCapacity);
        }

        public static List<TradeRoute> RankByProfit(List<TradeRoute> routes, int? topN = null)
        {
            var sorted = routes.OrderByDescending(r => r.ProfitPerUnit).ToList();
            return topN.HasValue ? sorted.Take(topN.Value).ToList() : sorted;
        }
    }
}
