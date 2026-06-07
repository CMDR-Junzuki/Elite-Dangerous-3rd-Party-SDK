using Xunit;
using EliteDangerousSdk.Planner;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Tests;

public class RouteOptimizerTests
{
    private static StationMarket MakeStation(string name, string system) => new()
    {
        Station = new TradeStation { Name = name, System = system },
        Supplies = new List<TradeCommodity>(),
        Demands = new List<TradeCommodity>(),
    };

    private static readonly StationMarket StationA = new()
    {
        Station = new TradeStation { Name = "A", System = "Sys1" },
        Supplies = new()
        {
            new() { Symbol = "Gold", Name = "Gold", Category = "Metals", BuyPrice = 10000, Stock = 1000 },
            new() { Symbol = "Silver", Name = "Silver", Category = "Metals", BuyPrice = 5000, Stock = 1000 },
        },
        Demands = new()
        {
            new() { Symbol = "Platinum", Name = "Platinum", Category = "Metals", SellPrice = 30000, Demand = 100 },
            new() { Symbol = "Palladium", Name = "Palladium", Category = "Metals", SellPrice = 20000, Demand = 100 },
        },
    };

    private static readonly StationMarket StationB = new()
    {
        Station = new TradeStation { Name = "B", System = "Sys2" },
        Supplies = new()
        {
            new() { Symbol = "Platinum", Name = "Platinum", Category = "Metals", BuyPrice = 25000, Stock = 500 },
            new() { Symbol = "Palladium", Name = "Palladium", Category = "Metals", BuyPrice = 15000, Stock = 500 },
        },
        Demands = new()
        {
            new() { Symbol = "Gold", Name = "Gold", Category = "Metals", SellPrice = 18000, Demand = 200 },
            new() { Symbol = "Silver", Name = "Silver", Category = "Metals", SellPrice = 9000, Demand = 200 },
        },
    };

    private static readonly StationMarket StationC = new()
    {
        Station = new TradeStation { Name = "C", System = "Sys3" },
        Supplies = new()
        {
            new() { Symbol = "Computers", Name = "Computers", Category = "Technology", BuyPrice = 500, Stock = 1000 },
        },
        Demands = new()
        {
            new() { Symbol = "Gold", Name = "Gold", Category = "Metals", SellPrice = 17000, Demand = 100 },
        },
    };

    private static readonly List<StationMarket> Stations = new() { StationA, StationB, StationC };

    public class ComputeSingleHopRoutes
    {
        [Fact]
        public void FindsProfitableRoutes()
        {
            var routes = RouteOptimizer.ComputeSingleHopRoutes(Stations, 100);
            Assert.NotEmpty(routes);
            var goldRoute = routes.First(r => r.Commodity.Symbol == "Gold");
            Assert.Equal(8000, goldRoute.ProfitPerUnit);
            Assert.Equal(8000 * 100, goldRoute.TotalProfit);
        }

        [Fact]
        public void FindsMultipleCommodityRoutes()
        {
            var routes = RouteOptimizer.ComputeSingleHopRoutes(Stations, 100);
            var abRoutes = routes.Where(r => r.Source.Name == "A" && r.Destination.Name == "B").ToList();
            Assert.True(abRoutes.Count >= 2);
        }

        [Fact]
        public void SkipsSameStation()
        {
            var routes = RouteOptimizer.ComputeSingleHopRoutes(Stations, 100);
            var same = routes.Where(r => r.Source.Name == r.Destination.Name).ToList();
            Assert.Empty(same);
        }

        [Fact]
        public void ReturnsEmptyForSingleStation()
        {
            var routes = RouteOptimizer.ComputeSingleHopRoutes(new() { StationA }, 100);
            Assert.Empty(routes);
        }
    }

    public class FindRoundTrips
    {
        [Fact]
        public void FindsRoundTrips()
        {
            var trips = RouteOptimizer.FindRoundTrips(Stations, 100);
            var aToB = trips.Where(t => t.Hops[0].Source.Name == "A").ToList();
            Assert.NotEmpty(aToB);
            Assert.True(aToB[0].RoundTrip);
            Assert.Equal(2, aToB[0].Hops.Count);
        }

        [Fact]
        public void RoundTripProfitIsSum()
        {
            var trips = RouteOptimizer.FindRoundTrips(Stations, 100);
            foreach (var t in trips)
            {
                var sum = t.Hops.Sum(h => h.TotalProfit);
                Assert.Equal(sum, t.TotalProfit);
            }
        }

        [Fact]
        public void ReturnsEmptyForIncompatible()
        {
            var trips = RouteOptimizer.FindRoundTrips(new() { StationA }, 100);
            Assert.Empty(trips);
        }

        [Fact]
        public void RespectsTopN()
        {
            var trips = RouteOptimizer.FindRoundTrips(Stations, 100, null, 1);
            Assert.True(trips.Count <= 1);
        }
    }

    public class FindMultiHopRoutes
    {
        [Fact]
        public void Finds2HopLoops()
        {
            var routes = RouteOptimizer.FindMultiHopRoutes(Stations, 2, 100);
            Assert.NotEmpty(routes);
            foreach (var r in routes)
                Assert.True(r.Hops.Count <= 2);
        }

        [Fact]
        public void NonEmptyFor1Hop()
        {
            var routes = RouteOptimizer.FindMultiHopRoutes(Stations, 1, 100);
            Assert.NotEmpty(routes);
            Assert.False(routes[0].RoundTrip);
        }
    }

    public class SuggestMaterialFarming
    {
        [Fact]
        public void RawSuggestions()
        {
            var suggestions = RouteOptimizer.SuggestMaterialFarming("raw", 2);
            Assert.NotEmpty(suggestions);
            Assert.NotEmpty(suggestions[0].Activity);
            Assert.NotEmpty(suggestions[0].Description);
        }

        [Fact]
        public void ManufacturedSuggestions()
        {
            Assert.NotEmpty(RouteOptimizer.SuggestMaterialFarming("manufactured", 3));
        }

        [Fact]
        public void EncodedSuggestions()
        {
            Assert.NotEmpty(RouteOptimizer.SuggestMaterialFarming("encoded", 1));
        }

        [Fact]
        public void UnknownCategory()
        {
            Assert.Empty(RouteOptimizer.SuggestMaterialFarming("unknown", 1));
        }

        [Fact]
        public void HighGradeSuggestions()
        {
            var g5 = RouteOptimizer.SuggestMaterialFarming("raw", 5);
            var g1 = RouteOptimizer.SuggestMaterialFarming("raw", 1);
            Assert.True(g5.Count > g1.Count);
        }
    }
}
