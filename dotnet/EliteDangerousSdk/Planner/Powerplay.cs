using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Planner
{
    public class PowerplayState
    {
        public string Power { get; set; } = "";
        public int Rank { get; set; }
        public int Merits { get; set; }
        public int MeritsToNextRank { get; set; }
        public int WeeklyAllocation { get; set; }
        public int? VotingPledges { get; set; }
        public int? TotalVouchers { get; set; }
    }

    public class ControlSystem
    {
        public string System { get; set; } = "";
        public ulong? SystemAddress { get; set; }
        public string ControllingPower { get; set; } = "";
        public List<string>? ExploitedSystems { get; set; }
        public bool Undermined { get; set; }
        public int? FortificationTrigger { get; set; }
        public int? FortificationDone { get; set; }
        public int? UnderminingTrigger { get; set; }
        public int? UnderminingDone { get; set; }
    }

    public static class Powerplay
    {
        public static readonly string[] Powers =
        {
            "Aisling Duval", "Archon Delaine", "Arissa Lavigny-Duval",
            "Denton Patreus", "Edmund Mahon", "Felicia Winters",
            "Jerome Archer", "Li Yong-Rui", "Pranav Antal",
            "Yuri Grom", "Zachary Hudson", "Zemina Torval",
            "Nakato Kaine",
        };

        public static readonly Dictionary<string, int> Salaries = new()
        {
            ["top_100_pct"] = 500000,
            ["top_75_pct"] = 2500000,
            ["top_50_pct"] = 5000000,
            ["top_25_pct"] = 10000000,
            ["top_10_pct"] = 50000000,
            ["top_10"] = 100000000,
            ["top_1"] = 1000000000,
        };

        public static int GetMeritsForRank(int rank)
        {
            if (rank <= 1) return 0;
            if (rank == 2) return 2000;
            if (rank == 3) return 5000;
            if (rank == 4) return 9000;
            if (rank == 5) return 15000;
            if (rank >= 100) return 775000;
            return 15000 + (rank - 5) * 8000;
        }

        public static (int rank, int meritsNeeded) MeritsToNextRank(int currentMerits)
        {
            int rank = 1;
            for (int r = 100; r >= 1; r--)
            {
                if (currentMerits >= GetMeritsForRank(r))
                {
                    rank = r;
                    break;
                }
            }
            if (rank >= 100) return (100, 0);
            var nextMerits = GetMeritsForRank(rank + 1);
            return (rank, nextMerits - currentMerits);
        }

        public static int GetSalary(string bracket)
        {
            return Salaries.TryGetValue(bracket, out var salary) ? salary : 0;
        }

        public static string EstimateMeritsBracket(int weeklyMerits)
        {
            if (weeklyMerits <= 0) return "top_100_pct";
            if (weeklyMerits >= 500000) return "top_1";
            if (weeklyMerits >= 200000) return "top_10";
            if (weeklyMerits >= 50000) return "top_10_pct";
            if (weeklyMerits >= 10000) return "top_25_pct";
            if (weeklyMerits >= 5000) return "top_50_pct";
            if (weeklyMerits >= 1000) return "top_75_pct";
            return "top_100_pct";
        }

        public static int EstimateMeritsPerHour(string activity)
        {
            var rates = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
            {
                ["mining"] = 30000,
                ["combat_zone"] = 20000,
                ["undermining"] = 15000,
                ["fortification"] = 20000,
                ["expansion"] = 18000,
                ["bounty_hunting"] = 12000,
                ["assignment"] = 5000,
                ["trade"] = 3000,
                ["voucher_turn_in"] = 10000,
            };
            return rates.TryGetValue(activity, out var rate) ? rate : 3000;
        }
    }

    public enum PowerplaySystemType
    {
        Undefined = 0,
        Control = 1,
        Exploited = 2,
        Stronghold = 3,
        Fortified = 4,
        Preparation = 5,
        Expansion = 6,
        Contested = 7,
    }

    public static class PowerplaySystemTypeNames
    {
        public static string GetName(PowerplaySystemType type) => type switch
        {
            PowerplaySystemType.Undefined => "Undefined",
            PowerplaySystemType.Control => "Control",
            PowerplaySystemType.Exploited => "Exploited",
            PowerplaySystemType.Stronghold => "Stronghold",
            PowerplaySystemType.Fortified => "Fortified",
            PowerplaySystemType.Preparation => "Preparation",
            PowerplaySystemType.Expansion => "Expansion",
            PowerplaySystemType.Contested => "Contested",
            _ => "",
        };
    }

    public class PowerplaySystem
    {
        public string Name { get; set; } = "";
        public long? SystemAddress { get; set; }
        public string Power { get; set; } = "";
        public PowerplaySystemType Type { get; set; } = PowerplaySystemType.Undefined;
        public string? ControlSystem { get; set; }
        public bool Undermined { get; set; }
        public int? FortificationTrigger { get; set; }
        public int? FortificationDone { get; set; }
        public int? UnderminingTrigger { get; set; }
        public int? UnderminingDone { get; set; }
        public double[]? Coords { get; set; }
    }

    public class PowerplayPowerData
    {
        public string Name { get; set; } = "";
        public string HomeSystem { get; set; } = "";
        public string Ethos { get; set; } = "";
        public List<string> KnownControlSystems { get; set; } = new();
    }
}
