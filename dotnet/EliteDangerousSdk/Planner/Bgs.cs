using System.Text.Json.Serialization;

namespace EliteDangerousSdk.Planner
{
    public class StateEffect
    {
        public string InfluenceTrend { get; set; } = "neutral";
        public List<string> AffectedActivities { get; set; } = new();
        public string Description { get; set; } = "";
    }

    public class InfluenceEstimate
    {
        public double InfluenceDelta { get; set; }
        public string Confidence { get; set; } = "low";
        public string Breakdown { get; set; } = "";
    }

    public class ConflictAnalysisResult
    {
        public string? PredictedWinner { get; set; }
        public int Faction1WonDays { get; set; }
        public int Faction2WonDays { get; set; }
        public double Faction1Advantage { get; set; }
        public double Faction2Advantage { get; set; }
        public string Status { get; set; } = "";
        public string Analysis { get; set; } = "";
    }

    public class ExpansionTargetResult
    {
        public string System { get; set; } = "";
        public long Population { get; set; }
        public string Government { get; set; } = "";
        public string Economy { get; set; } = "";
        public int Score { get; set; }
        public List<string> Reasons { get; set; } = new();
    }

    public class RetreatRiskResult
    {
        public string RiskLevel { get; set; } = "none";
        public double Influence { get; set; }
        public bool InRetreatState { get; set; }
        public string Analysis { get; set; } = "";
    }
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

        private static readonly Dictionary<string, StateEffect> StateEffects = new()
        {
            ["Boom"] = new() { InfluenceTrend = "positive", AffectedActivities = new() { "trade", "passenger_missions" }, Description = "Economic growth, increased trade profits" },
            ["Bust"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "trade" }, Description = "Economic decline, reduced trade profits" },
            ["CivilUnrest"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "bounty", "security" }, Description = "Increased bounties, decreased security" },
            ["CivilWar"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "conflict_zones" }, Description = "Conflict between factions in same system" },
            ["Election"] = new() { InfluenceTrend = "positive", AffectedActivities = new() { "missions" }, Description = "Peaceful competition for influence" },
            ["Expansion"] = new() { InfluenceTrend = "positive", AffectedActivities = new() { "trade", "exploration" }, Description = "Faction expanding to new systems" },
            ["Famine"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "trade", "missions" }, Description = "Food shortages, decreased influence" },
            ["Investment"] = new() { InfluenceTrend = "positive", AffectedActivities = new() { "trade", "exploration" }, Description = "Increased investment in system development" },
            ["Lockdown"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "crime", "black_market" }, Description = "Increased security, reduced crime" },
            ["Outbreak"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "trade", "missions" }, Description = "Health crisis, decreased influence" },
            ["Retreat"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "all" }, Description = "Faction losing presence in system" },
            ["War"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "conflict_zones" }, Description = "Open warfare between factions" },
            ["PirateAttack"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "security", "trade" }, Description = "Increased pirate activity" },
            ["InfrastructureFailure"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "station_services" }, Description = "Reduced station services" },
            ["NaturalDisaster"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "all" }, Description = "Damage from natural causes" },
            ["Blight"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "trade" }, Description = "Agricultural crisis" },
            ["Drought"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "trade" }, Description = "Water shortages" },
            ["Flood"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "trade", "stations" }, Description = "Widespread flooding" },
            ["Plague"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "all" }, Description = "Deadly disease outbreak" },
            ["LabourDemand"] = new() { InfluenceTrend = "positive", AffectedActivities = new() { "missions" }, Description = "Increased demand for workers" },
            ["PublicHoliday"] = new() { InfluenceTrend = "positive", AffectedActivities = new() { "trade", "passenger_missions" }, Description = "Celebration boosting local economy" },
            ["TechnologicalLeap"] = new() { InfluenceTrend = "positive", AffectedActivities = new() { "exploration", "missions" }, Description = "Advanced tech development" },
            ["TradeAgreement"] = new() { InfluenceTrend = "positive", AffectedActivities = new() { "trade" }, Description = "Increased trade opportunities" },
            ["TerroristAttack"] = new() { InfluenceTrend = "negative", AffectedActivities = new() { "security", "all" }, Description = "Increased security responses" },
            ["UnderRepair"] = new() { InfluenceTrend = "neutral", AffectedActivities = new() { "station_services" }, Description = "Recovering from damage" },
            ["Colonisation"] = new() { InfluenceTrend = "positive", AffectedActivities = new() { "trade", "missions" }, Description = "New colony being established" },
        };

        public static StateEffect FactionStateEffect(string state)
        {
            return StateEffects.TryGetValue(state, out var effect)
                ? effect
                : new StateEffect { InfluenceTrend = "neutral", AffectedActivities = new(), Description = state };
        }

        public static InfluenceEstimate InfluenceEffect(string action, Dictionary<string, double>? params_)
        {
            params_ ??= new();
            switch (action)
            {
                case "mission_completed":
                {
                    var reward = params_.GetValueOrDefault("reward", 0);
                    if (reward >= 4000000)
                        return new() { InfluenceDelta = 0.02, Confidence = "medium", Breakdown = "High-value mission (~4M+ CR): ~2.0% influence" };
                    if (reward >= 1000000)
                        return new() { InfluenceDelta = 0.01, Confidence = "medium", Breakdown = "Medium-value mission (~1M CR): ~1.0% influence" };
                    return new() { InfluenceDelta = 0.004, Confidence = "medium", Breakdown = "Standard mission: ~0.4% influence" };
                }
                case "bounty":
                {
                    var amount = params_.GetValueOrDefault("amount", 0);
                    var delta = Math.Min(amount / 1000000.0, 0.04);
                    return new() { InfluenceDelta = delta, Confidence = "low", Breakdown = $"Bounty voucher ({amount:N0} CR): ~{delta * 100:F1}% influence" };
                }
                case "bonds":
                {
                    var bondAmount = params_.GetValueOrDefault("amount", 0);
                    var bondDelta = Math.Min(bondAmount / 2000000.0, 0.03);
                    return new() { InfluenceDelta = bondDelta, Confidence = "low", Breakdown = $"Combat bonds ({bondAmount:N0} CR): ~{bondDelta * 100:F1}% influence" };
                }
                case "exploration":
                {
                    var systems = params_.GetValueOrDefault("systems", 1);
                    var firstDisc = params_.GetValueOrDefault("firstDiscoveries", 0);
                    var delta = Math.Min(systems * 0.002 + firstDisc * 0.008, 0.05);
                    return new() { InfluenceDelta = delta, Confidence = "low", Breakdown = $"Exploration data ({systems} systems, {firstDisc} first discoveries): ~{delta * 100:F1}% influence" };
                }
                case "trade":
                {
                    var profit = params_.GetValueOrDefault("profit", 0);
                    var tradeDelta = Math.Min(profit / 5000000.0, 0.03);
                    return new() { InfluenceDelta = tradeDelta, Confidence = "low", Breakdown = $"Trade profit ({profit:N0} CR): ~{tradeDelta * 100:F1}% influence" };
                }
                case "murder":
                {
                    var count = params_.GetValueOrDefault("count", 1);
                    return new() { InfluenceDelta = -(count * 0.002), Confidence = "low", Breakdown = $"Ship destroyed ({count}): ~-{count * 0.2:F1}% influence" };
                }
                default:
                    return new() { InfluenceDelta = 0, Confidence = "low", Breakdown = "Unknown action" };
            }
        }

        public static ConflictAnalysisResult? AnalyzeConflict(Conflict conflict, List<FactionPresence> factions)
        {
            var f1 = factions.Find(f => f.Name == conflict.Faction1);
            var f2 = factions.Find(f => f.Name == conflict.Faction2);
            if (f1 == null || f2 == null) return null;

            var f1Won = conflict.Faction1WonDays ?? 0;
            var f2Won = conflict.Faction2WonDays ?? 0;
            var pred = PredictConflictWinner(conflict, factions);
            var influenceGap = Math.Abs(f1.Influence - f2.Influence);

            var analysis = $"{conflict.Faction1} ({f1.Influence * 100:F1}%) vs {conflict.Faction2} ({f2.Influence * 100:F1}%) in a {conflict.Status} {conflict.Type}";
            if (f1Won > 0 || f2Won > 0)
                analysis += $" | Days won: {f1Won}-{f2Won}";
            if (pred != null)
            {
                analysis += $" | {pred} predicted to win";
                if (influenceGap > 0.05)
                    analysis += " (significant influence advantage)";
                else if (influenceGap > 0.02)
                    analysis += " (moderate influence advantage)";
                else
                    analysis += " (close contest)";
            }

            return new ConflictAnalysisResult
            {
                PredictedWinner = pred,
                Faction1WonDays = f1Won,
                Faction2WonDays = f2Won,
                Faction1Advantage = f1.Influence - f2.Influence,
                Faction2Advantage = f2.Influence - f1.Influence,
                Status = conflict.Status,
                Analysis = analysis,
            };
        }

        public static List<ExpansionTargetResult> ExpansionTargets(SystemBgsData currentSystem, List<SystemBgsData> nearbySystems, string factionName)
        {
            var results = new List<ExpansionTargetResult>();
            foreach (var sys in nearbySystems)
            {
                if (sys.System == currentSystem.System) continue;

                var existing = sys.Factions.Find(f => f.Name == factionName);
                if (existing != null) continue;

                var reasons = new List<string>();
                var score = 0;

                if (sys.Population > 1000000) { score += 30; reasons.Add("High population"); }
                else if (sys.Population > 100000) { score += 15; reasons.Add("Medium population"); }
                else { score += 5; }

                if (sys.Government == "Democracy" || sys.Government == "Confederacy")
                { score += 10; reasons.Add("Compatible government"); }

                if (sys.Economy == "Agriculture" || sys.Economy == "Extraction" || sys.Economy == "Refinery")
                { score += 10; reasons.Add("Primary economy"); }

                var nonNative = sys.Factions.FindAll(f => f.Allegiance != currentSystem.Allegiance);
                if (nonNative.Count > 0)
                {
                    var avgOpp = nonNative.Average(f => f.Influence);
                    if (avgOpp < 0.1) { score += 15; reasons.Add("Weak opposing factions present"); }
                }

                results.Add(new ExpansionTargetResult
                {
                    System = sys.System,
                    Population = sys.Population,
                    Government = sys.Government,
                    Economy = sys.Economy,
                    Score = score,
                    Reasons = reasons,
                });
            }
            results.Sort((a, b) => b.Score.CompareTo(a.Score));
            return results;
        }

        public static RetreatRiskResult RetreatRisk(FactionPresence factionPresence)
        {
            var inf = factionPresence.Influence;
            var inRetreat = factionPresence.FactionState == "Retreat";

            string riskLevel;
            if (inRetreat && inf < 0.025) riskLevel = "critical";
            else if (inRetreat && inf < 0.05) riskLevel = "high";
            else if (inRetreat) riskLevel = "medium";
            else if (inf < 0.01) riskLevel = "critical";
            else if (inf < 0.025) riskLevel = "high";
            else if (inf < 0.05) riskLevel = "medium";
            else if (inf < 0.075) riskLevel = "low";
            else riskLevel = "none";

            var analysis = $"{factionPresence.Name} at {inf * 100:F1}% influence";
            if (inRetreat) analysis += " and in Retreat state";
            analysis += $": {riskLevel} retreat risk";

            return new RetreatRiskResult
            {
                RiskLevel = riskLevel,
                Influence = inf,
                InRetreatState = inRetreat,
                Analysis = analysis,
            };
        }
    }
}
