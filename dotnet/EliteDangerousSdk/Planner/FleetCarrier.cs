using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Planner
{
    public class CarrierJump
    {
        public string FromSystem { get; set; } = "";
        public string ToSystem { get; set; } = "";
        public double DistanceLy { get; set; }
        public int FuelCost { get; set; }
        public int CooldownMinutes { get; set; }
    }

    public class CarrierFinance
    {
        public double Balance { get; set; }
        public double WeeklyMaintenance { get; set; }
        public double ReserveBalance { get; set; }
        public double TaxRate { get; set; }
        public int JumpsRemaining { get; set; }
    }

    public static class FleetCarrier
    {
        private static readonly Dictionary<string, int> ServiceCosts = new()
        {
            ["Universal Cartographics"] = 1850000,
            ["Outfitting"] = 5000000,
            ["Repair"] = 1500000,
            ["Refuel"] = 1500000,
            ["Rearm"] = 1500000,
            ["Armoury"] = 1500000,
            ["Shipyard"] = 6500000,
            ["Vista Genomics"] = 1500000,
            ["Bar"] = 1750000,
            ["Concourse Bar"] = 1750000,
            ["Pioneer Supplies"] = 5000000,
            ["Redemption Office"] = 1850000,
            ["Secure Warehouse"] = 2000000,
        };

        public static int CalculateJumpFuelCost(double distanceLy, double ladenMass)
        {
            var totalMass = ladenMass + 25000;
            return Math.Max(1, (int)Math.Round(5 + distanceLy * totalMass / 200000, MidpointRounding.AwayFromZero));
        }

        public static (int chargeMinutes, string jumpDuration, int cooldownMinutes, int totalMinutes) EstimateJumpTime()
        {
            return (15, "< 1 minute", 5, 21);
        }

        public static double CalculateWeeklyMaintenance(string[] services)
        {
            double baseCost = 5_000_000;
            double extras = 0;
            foreach (var service in services)
            {
                foreach (var kvp in ServiceCosts)
                {
                    if (service.Contains(kvp.Key, StringComparison.OrdinalIgnoreCase))
                    {
                        extras += kvp.Value;
                        break;
                    }
                }
            }
            return baseCost + extras;
        }

        public static bool CanAffordMaintenance(double balance, double weeklyMaintenance)
        {
            return balance >= weeklyMaintenance * 1.1;
        }
    }
}
