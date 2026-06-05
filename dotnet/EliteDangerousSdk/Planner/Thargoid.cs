using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Planner
{
    public enum ThargoidWarState
    {
        None = 0,
        Alert = 20,
        Invasion = 30,
        Controlled = 40,
        Recovery = 50,
        Maelstrom = 70,
    }

    public class TitanInfo
    {
        public string Name { get; set; } = "";
        public string SystemName { get; set; } = "";
        public long? SystemAddress { get; set; }
        public string Body { get; set; } = "";
        public int ArrivalDistanceLs { get; set; }
        public string State { get; set; } = "defeated";
        public string? DefeatedDate { get; set; }
    }

    public static class ThargoidData
    {
        public static readonly string[] TitanNames = {
            "Taranis", "Indra", "Leigong", "Cocijo",
            "Oya", "Thor", "Raijin", "Hadad",
        };

        public static readonly Dictionary<string, TitanInfo> Titans = new()
        {
            ["Taranis"] = new() { Name = "Taranis", SystemName = "Hyades Sector FB-N b7-6", Body = "A 1", ArrivalDistanceLs = 130, State = "defeated", DefeatedDate = "3309-09-28" },
            ["Indra"] = new() { Name = "Indra", SystemName = "HIP 20567", Body = "7", ArrivalDistanceLs = 3330, State = "defeated", DefeatedDate = "3309-10-05" },
            ["Leigong"] = new() { Name = "Leigong", SystemName = "HIP 8887", Body = "A 4", ArrivalDistanceLs = 2540, State = "defeated", DefeatedDate = "3309-11-18" },
            ["Cocijo"] = new() { Name = "Cocijo", SystemName = "Col 285 Sector BA-P c6-18", Body = "3", ArrivalDistanceLs = 1300, State = "defeated", DefeatedDate = "3310-12-18" },
            ["Oya"] = new() { Name = "Oya", SystemName = "Cephei Sector BV-Y b4", Body = "B 1", ArrivalDistanceLs = 5850, State = "defeated", DefeatedDate = "3309-11-01" },
            ["Thor"] = new() { Name = "Thor", SystemName = "Col 285 Sector IG-O c6-5", Body = "3", ArrivalDistanceLs = 820, State = "defeated", DefeatedDate = "3309-11-25" },
            ["Raijin"] = new() { Name = "Raijin", SystemName = "Pegasi Sector IH-U b3-3", Body = "2", ArrivalDistanceLs = 400, State = "defeated", DefeatedDate = "3309-12-16" },
            ["Hadad"] = new() { Name = "Hadad", SystemName = "HIP 30377", Body = "B 8", ArrivalDistanceLs = 39230, State = "defeated", DefeatedDate = "3309-12-30" },
        };

        public static TitanInfo? GetTitanByName(string name) =>
            Titans.TryGetValue(name, out var titan) ? titan : null;

        public static TitanInfo? GetTitanBySystem(string systemName)
        {
            foreach (var kv in Titans)
                if (kv.Value.SystemName == systemName) return kv.Value;
            return null;
        }

        public static List<TitanInfo> GetAllTitans() => TitanNames.Select(n => Titans[n]).ToList();

        public static List<TitanInfo> GetDefeatedTitans() => GetAllTitans().Where(t => t.State == "defeated").ToList();

        public static ThargoidWarState ParseThargoidWarState(string? warType) => warType switch
        {
            "Alert" => ThargoidWarState.Alert,
            "Invasion" => ThargoidWarState.Invasion,
            "Controlled" => ThargoidWarState.Controlled,
            "Recovery" => ThargoidWarState.Recovery,
            "Maelstrom" => ThargoidWarState.Maelstrom,
            _ => ThargoidWarState.None,
        };

        public static string GetWarStateName(ThargoidWarState state) => state switch
        {
            ThargoidWarState.None => "None",
            ThargoidWarState.Alert => "Alert",
            ThargoidWarState.Invasion => "Invasion",
            ThargoidWarState.Controlled => "Controlled",
            ThargoidWarState.Recovery => "Recovery",
            ThargoidWarState.Maelstrom => "Maelstrom",
            _ => "",
        };
    }
}
