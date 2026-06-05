using System.Text.Json.Serialization;

namespace EliteDangerousSdk.Planner
{
    public static class BgsStates
    {
        public const string None = "None";
        public const string Boom = "Boom";
        public const string Bust = "Bust";
        public const string CivilUnrest = "CivilUnrest";
        public const string CivilWar = "CivilWar";
        public const string Conflict = "Conflict";
        public const string Election = "Election";
        public const string Expansion = "Expansion";
        public const string Famine = "Famine";
        public const string Investment = "Investment";
        public const string Lockdown = "Lockdown";
        public const string Outbreak = "Outbreak";
        public const string Retreat = "Retreat";
        public const string War = "War";
        public const string InfrastructureFailure = "InfrastructureFailure";
        public const string NaturalDisaster = "NaturalDisaster";
        public const string PirateAttack = "PirateAttack";
        public const string TerroristAttack = "TerroristAttack";
        public const string Blight = "Blight";
        public const string Drought = "Drought";
        public const string Flood = "Flood";
        public const string Plague = "Plague";
        public const string LabourDemand = "LabourDemand";
        public const string PublicHoliday = "PublicHoliday";
        public const string TechnologicalLeap = "TechnologicalLeap";
        public const string TradeAgreement = "TradeAgreement";
        public const string UnderRepair = "UnderRepair";
        public const string Colonisation = "Colonisation";
    }

    public class FactionPresence
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [JsonPropertyName("factionState")]
        public string FactionState { get; set; } = "";

        [JsonPropertyName("influence")]
        public double Influence { get; set; }

        [JsonPropertyName("allegiance")]
        public string Allegiance { get; set; } = "";

        [JsonPropertyName("government")]
        public string Government { get; set; } = "";

        [JsonPropertyName("activeStates")]
        public List<string>? ActiveStates { get; set; }

        [JsonPropertyName("pendingStates")]
        public List<string>? PendingStates { get; set; }

        [JsonPropertyName("recoveringStates")]
        public List<string>? RecoveringStates { get; set; }
    }

    public class SystemBgsData
    {
        [JsonPropertyName("system")]
        public string System { get; set; } = "";

        [JsonPropertyName("systemAddress")]
        public long? SystemAddress { get; set; }

        [JsonPropertyName("population")]
        public long Population { get; set; }

        [JsonPropertyName("allegiance")]
        public string Allegiance { get; set; } = "";

        [JsonPropertyName("government")]
        public string Government { get; set; } = "";

        [JsonPropertyName("security")]
        public string Security { get; set; } = "";

        [JsonPropertyName("economy")]
        public string Economy { get; set; } = "";

        [JsonPropertyName("secondEconomy")]
        public string? SecondEconomy { get; set; }

        [JsonPropertyName("factions")]
        public List<FactionPresence> Factions { get; set; } = new();

        [JsonPropertyName("conflicts")]
        public List<Conflict>? Conflicts { get; set; }
    }

    public class Conflict
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "";

        [JsonPropertyName("status")]
        public string Status { get; set; } = "";

        [JsonPropertyName("faction1")]
        public string Faction1 { get; set; } = "";

        [JsonPropertyName("faction2")]
        public string Faction2 { get; set; } = "";

        [JsonPropertyName("faction1WonDays")]
        public int? Faction1WonDays { get; set; }

        [JsonPropertyName("faction2WonDays")]
        public int? Faction2WonDays { get; set; }

        [JsonPropertyName("faction1Stake")]
        public string? Faction1Stake { get; set; }

        [JsonPropertyName("faction2Stake")]
        public string? Faction2Stake { get; set; }
    }

    public static class Bgs
    {
        private static readonly Dictionary<string, string> StateDescriptions = new()
        {
            ["None"] = "No active state",
            ["Boom"] = "Economic growth, increased trade profits",
            ["Bust"] = "Economic decline, reduced trade profits",
            ["CivilUnrest"] = "Increased bounties, decreased security",
            ["CivilWar"] = "Conflict between factions in same system",
            ["Conflict"] = "Active combat between factions",
            ["Election"] = "Peaceful competition for influence",
            ["Expansion"] = "Faction expanding to new systems",
            ["Famine"] = "Food shortages, decreased influence",
            ["Investment"] = "Increased investment in system development",
            ["Lockdown"] = "Increased security, reduced crime",
            ["Outbreak"] = "Health crisis, decreased influence",
            ["Retreat"] = "Faction losing presence in system",
            ["War"] = "Open warfare between factions",
            ["InfrastructureFailure"] = "Reduced station services",
            ["NaturalDisaster"] = "Damage from natural causes",
            ["PirateAttack"] = "Increased pirate activity",
            ["TerroristAttack"] = "Increased security responses",
            ["Colonisation"] = "New colony being established",
            ["TechnologicalLeap"] = "Advanced tech development",
            ["UnderRepair"] = "Recovering from damage",
        };

        public static string GetStateDescription(string state)
        {
            return StateDescriptions.TryGetValue(state, out var desc) ? desc : state;
        }

        public static bool IsPositiveState(string state)
        {
            return state switch
            {
                "Boom" => true,
                "Expansion" => true,
                "Investment" => true,
                "TechnologicalLeap" => true,
                "TradeAgreement" => true,
                "Colonisation" => true,
                "Election" => true,
                _ => false,
            };
        }

        public static bool IsNegativeState(string state)
        {
            return state switch
            {
                "Bust" => true,
                "CivilUnrest" => true,
                "Famine" => true,
                "Lockdown" => true,
                "Outbreak" => true,
                "Retreat" => true,
                "NaturalDisaster" => true,
                "PirateAttack" => true,
                "InfrastructureFailure" => true,
                _ => false,
            };
        }

        public static string? PredictConflictWinner(Conflict conflict, List<FactionPresence> factions)
        {
            var f1 = factions.Find(f => f.Name == conflict.Faction1);
            var f2 = factions.Find(f => f.Name == conflict.Faction2);
            if (f1 == null || f2 == null) return null;
            if (f1.Influence > f2.Influence) return f1.Name;
            if (f2.Influence > f1.Influence) return f2.Name;
            return null;
        }
    }
}
