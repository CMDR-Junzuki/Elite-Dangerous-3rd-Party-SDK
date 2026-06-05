using System;
using System.Collections.Generic;
using System.Linq;
using EliteDangerousSdk.Data;

namespace EliteDangerousSdk.Planner
{
    public class EconomyMap : Dictionary<string, double>
    {
        public EconomyMap() : base() { }
    }

    public record EconAudit(Economy Inf, double Delta, string Reason, double Before, double After);

    public record Rev(int RevNum, string Name);

    public record NamedSave(string Name, int[] Saves);

    public record Pop(double Population, double Mpop);

    public record RawBod(string Name, int Num, double DistLS, int[] Parents, BodyType Type, string SubType, BodyFeature[] Features, double Radius, double Temp, double Gravity);

    public record RawSite(string Id, string BuildId, long MarketId, string Name, int BodyNum, string BuildType, string? Notes, BuildStatus Status);

    public record RawSys(int V, int Rev, string Name, string? Nickname, string? Notes, long Id64, string Architect, double[] Pos, ReserveLevel ReserveLevel, string? PrimaryPortId, RawBod[] Bodies, RawSite[] Sites, Dictionary<int, int[]> Slots, Rev[] Revs, NamedSave[]? SavedNames, Pop? Pop, bool? Open, int? IdxCalcLimit);

    public class BodyMap2
    {
        public string Name { get; set; } = "";
        public int Num { get; set; }
        public double DistLS { get; set; }
        public List<int> Parents { get; set; } = new();
        public BodyType Type { get; set; }
        public string SubType { get; set; } = "";
        public List<BodyFeature> Features { get; set; } = new();
        public double Radius { get; set; }
        public double Temp { get; set; }
        public double Gravity { get; set; }
        public SiteMap2? SurfacePrimary { get; set; }
        public SiteMap2? OrbitalPrimary { get; set; }
        public List<SiteMap2> Sites { get; set; } = new();
        public List<SiteMap2> Surface { get; set; } = new();
        public List<SiteMap2> Orbital { get; set; } = new();
    }

    public class SiteLinks2
    {
        public List<SiteMap2> StrongSites { get; set; } = new();
        public List<SiteMap2> WeakSites { get; set; } = new();
    }

    public class SiteMap2
    {
        public string Id { get; set; } = "";
        public string BuildId { get; set; } = "";
        public long MarketId { get; set; }
        public string Name { get; set; } = "";
        public int BodyNum { get; set; }
        public string BuildType { get; set; } = "";
        public string? Notes { get; set; }
        public BuildStatus Status { get; set; }
        public SiteTypeDef Type { get; set; } = null!;
        public BodyMap2? Body { get; set; }
        public SysMap2 Sys { get; set; } = null!;
        public EconomyMap? Economies { get; set; }
        public Economy? PrimaryEconomy { get; set; }
        public List<EconAudit>? EconomyAudit { get; set; }
        public List<Economy>? Intrinsic { get; set; }
        public HashSet<Economy>? BodyBuffed { get; set; }
        public HashSet<Economy>? SystemBuffed { get; set; }
        public SiteLinks2? Links { get; set; }
        public RawSite? Original { get; set; }
        public SiteMap2? ParentLink { get; set; }
        public (int Tier, int Count)? CalcNeeds { get; set; }
    }

    public class SysMap2
    {
        public int V { get; set; }
        public int Rev { get; set; }
        public string Name { get; set; } = "";
        public string? Nickname { get; set; }
        public string? Notes { get; set; }
        public long Id64 { get; set; }
        public string Architect { get; set; } = "";
        public double[] Pos { get; set; } = Array.Empty<double>();
        public ReserveLevel ReserveLevel { get; set; }
        public string? PrimaryPortId { get; set; }
        public List<BodyMap2> Bodies { get; set; } = new();
        public List<SiteMap2> Sites { get; set; } = new();
        public Dictionary<int, int[]> Slots { get; set; } = new();
        public List<Rev> Revs { get; set; } = new();
        public List<NamedSave>? SavedNames { get; set; }
        public Pop? Pop { get; set; }
        public bool? Open { get; set; }
        public int? IdxCalcLimit { get; set; }
        public Dictionary<string, BodyMap2> BodyMap { get; set; } = new();
        public List<SiteMap2> SiteMaps { get; set; } = new();
        public TierPoints TierPoints { get; set; } = new(0, 0);
        public Dictionary<string, double> Economies { get; set; } = new();
        public SysEffects SumEffects { get; set; } = new(0, 0, 0, 0, 0, 0, 0);
        public int SystemScore { get; set; }
        public Dictionary<string, bool> SysUnlocks { get; set; } = new();
        public int TaxCount { get; set; }
        public List<string> CalcIds { get; set; } = new();
    }

    public static class ColonizationEconomy
    {
        private static bool UseNewModel => true;

        private static readonly BodyType[] StellarAndStars = new[]
        {
            BodyType.Star, BodyType.BlackHole, BodyType.NeutronStar, BodyType.WhiteDwarf
        };

        private static readonly BodyType[] EarthLikeAndWater = new[] { BodyType.EarthLikeWorld, BodyType.WaterWorld };

        private static readonly BodyType[] HighMetalAndMetalRich = new[] { BodyType.HighMetalContent, BodyType.MetalRich };

        private static readonly BodyType[] GasGiantWaterIce = new[] { BodyType.GasGiant, BodyType.WaterGiant, BodyType.RockyIce, BodyType.Icy };

        private static readonly BodyType[] ElwAwWw = new[] { BodyType.EarthLikeWorld, BodyType.WaterWorld, BodyType.AmmoniaWorld };

        private static readonly BodyType[] ElwAw = new[] { BodyType.EarthLikeWorld, BodyType.AmmoniaWorld };

        private static readonly ReserveLevel[] MajorPristine = new[] { ReserveLevel.Major, ReserveLevel.Pristine };

        private static readonly ReserveLevel[] DepletedLow = new[] { ReserveLevel.Depleted, ReserveLevel.Low };

        private static readonly BodyFeature[] BioGeo = new[] { BodyFeature.Bio, BodyFeature.Geo };

        private static readonly BodyFeature[] BioTerraformable = new[] { BodyFeature.Bio, BodyFeature.Terraformable };

        private static string Key(Economy e) => e.ToString().ToLowerInvariant();

        private static void InitKey(EconomyMap map, string key)
        {
            if (!map.ContainsKey(key)) map[key] = 0;
        }

        private static void Adjust(Economy inf, double delta, string reason, EconomyMap map, SiteMap2 site, string? source = null)
        {
            var key = Key(inf);
            InitKey(map, key);
            var before = map[key];
            var newValue = before + delta;
            if (newValue <= 0) newValue = 0.1;
            newValue = Math.Round(newValue * 100) / 100;
            map[key] = newValue;
            site.EconomyAudit?.Add(new EconAudit(inf, delta, reason, before, newValue));
            if (source == "body")
            {
                site.BodyBuffed ??= new HashSet<Economy>();
                site.BodyBuffed.Add(inf);
            }
            if (source == "sys")
            {
                site.SystemBuffed ??= new HashSet<Economy>();
                site.SystemBuffed.Add(inf);
            }
        }

        private static Economy FinishUp(EconomyMap map, SiteMap2 site)
        {
            var primaryKey = map.OrderByDescending(kv => kv.Value).First().Key;
            var primaryEconomy = Enum.Parse<Economy>(primaryKey, ignoreCase: true);
            site.Economies = map;
            site.PrimaryEconomy = primaryEconomy;
            return primaryEconomy;
        }

        private static void ApplySpecializedPort(EconomyMap map, SiteMap2 site)
        {
            if (site.Type.Fixed == null || site.Type.Fixed == Economy.None || site.Type.Fixed == Economy.Colony)
                return;
            if (site.Type.Orbital)
                Adjust(site.Type.Fixed.Value, 1.0, "Specialised orbital economy", map, site);
            else
                Adjust(site.Type.Fixed.Value, 0.5, "Specialised surface economy", map, site);
            if (UseNewModel)
                ApplyBuffs(map, site, false);
        }

        public static void ApplyBodyType(EconomyMap map, SiteMap2 site)
        {
            if (site.Type.Inf != Economy.Colony)
                return;
            var intrinsic = new HashSet<Economy>();

            switch (site.Body?.Type)
            {
                case BodyType.Un:
                    break;
                case BodyType.BlackHole:
                case BodyType.NeutronStar:
                case BodyType.WhiteDwarf:
                    Adjust(Economy.HighTech, 1, "Body type: BH/NS/WD", map, site);
                    intrinsic.Add(Economy.HighTech);
                    Adjust(Economy.Tourism, 1, "Body type: BH/NS/WD", map, site);
                    intrinsic.Add(Economy.Tourism);
                    break;
                case BodyType.Star:
                    Adjust(Economy.Military, 1, "Body type: STAR", map, site);
                    intrinsic.Add(Economy.Military);
                    break;
                case BodyType.EarthLikeWorld:
                    Adjust(Economy.Agriculture, 1, "Body type: ELW", map, site);
                    intrinsic.Add(Economy.Agriculture);
                    Adjust(Economy.HighTech, 1, "Body type: ELW", map, site);
                    intrinsic.Add(Economy.HighTech);
                    Adjust(Economy.Military, 1, "Body type: ELW", map, site);
                    intrinsic.Add(Economy.Military);
                    Adjust(Economy.Tourism, 1, "Body type: ELW", map, site);
                    intrinsic.Add(Economy.Tourism);
                    break;
                case BodyType.WaterWorld:
                    Adjust(Economy.Agriculture, 1, "Body type: WW", map, site);
                    intrinsic.Add(Economy.Agriculture);
                    Adjust(Economy.Tourism, 1, "Body type: WW", map, site);
                    intrinsic.Add(Economy.Tourism);
                    break;
                case BodyType.AmmoniaWorld:
                    Adjust(Economy.HighTech, 1, "Body type: AMMONIA", map, site);
                    intrinsic.Add(Economy.HighTech);
                    Adjust(Economy.Tourism, 1, "Body type: AMMONIA", map, site);
                    intrinsic.Add(Economy.Tourism);
                    break;
                case BodyType.GasGiant:
                case BodyType.WaterGiant:
                    Adjust(Economy.HighTech, 1, "Body type: GG/WG", map, site);
                    intrinsic.Add(Economy.HighTech);
                    Adjust(Economy.Industrial, 1, "Body type: GG/WG", map, site);
                    intrinsic.Add(Economy.Industrial);
                    break;
                case BodyType.HighMetalContent:
                case BodyType.MetalRich:
                    Adjust(Economy.Extraction, 1, "Body type: HMC", map, site);
                    intrinsic.Add(Economy.Extraction);
                    break;
                case BodyType.RockyIce:
                    Adjust(Economy.Industrial, 1, "Body type: ROCKY-ICE", map, site);
                    intrinsic.Add(Economy.Industrial);
                    Adjust(Economy.Refinery, 1, "Body type: ROCKY-ICE", map, site);
                    intrinsic.Add(Economy.Refinery);
                    break;
                case BodyType.Rocky:
                    Adjust(Economy.Refinery, 1, "Body type: ROCKY", map, site);
                    intrinsic.Add(Economy.Refinery);
                    break;
                case BodyType.Icy:
                    Adjust(Economy.Industrial, 1, "Body type: ICY", map, site);
                    intrinsic.Add(Economy.Industrial);
                    break;
                case BodyType.AsteroidCluster:
                    Adjust(Economy.Extraction, 1, "Body type: ASTEROID", map, site);
                    intrinsic.Add(Economy.Extraction);
                    break;
            }

            if (site.Body != null && StellarAndStars.Contains(site.Body.Type))
            {
                var hasAsteroids = site.Sys.Bodies.Any(b => b.Type == BodyType.AsteroidCluster && b.Name.StartsWith(site.Body.Name));
                if (hasAsteroids)
                {
                    Adjust(Economy.Extraction, 1, "Star has: ASTEROIDs", map, site);
                    intrinsic.Add(Economy.Extraction);
                }
            }

            if (site.Body?.Features.Contains(BodyFeature.Rings) == true)
            {
                if (!HighMetalAndMetalRich.Contains(site.Body.Type))
                {
                    Adjust(Economy.Extraction, 1, "Body has: RINGS", map, site, "body");
                    intrinsic.Add(Economy.Extraction);
                }
            }

            if (site.Body?.Features.Contains(BodyFeature.Bio) == true)
            {
                if (!EarthLikeAndWater.Contains(site.Body.Type))
                {
                    Adjust(Economy.Agriculture, 1, "Body has: BIO", map, site, "body");
                    intrinsic.Add(Economy.Agriculture);
                }
                Adjust(Economy.Terraforming, 1, "Body has: BIO", map, site, "body");
                intrinsic.Add(Economy.Terraforming);
            }

            if (site.Body?.Features.Contains(BodyFeature.Geo) == true)
            {
                if (!HighMetalAndMetalRich.Contains(site.Body.Type))
                {
                    Adjust(Economy.Extraction, 1, "Body has: GEO", map, site, "body");
                    intrinsic.Add(Economy.Extraction);
                }
                if (!GasGiantWaterIce.Contains(site.Body.Type))
                {
                    Adjust(Economy.Industrial, 1, "Body has: GEO", map, site, "body");
                    intrinsic.Add(Economy.Industrial);
                }
            }

            site.Intrinsic = intrinsic.ToList();
        }

        public static void ApplyStrongLinks2(EconomyMap map, List<SiteMap2> strongSites, SiteMap2 site, List<string> calcIds, Economy? subLink = null)
        {
            foreach (var s in strongSites)
            {
                if (s.Type.Inf == Economy.None) continue;
                if (!calcIds.Contains(s.Id)) continue;

                var infSize = s.Type.Tier == 1 ? 0.4 : s.Type.Tier == 2 ? 0.8 : 1.2;
                var prefix = subLink.HasValue ? "sub-strong link" : "Strong link";

                if (s.Type.Inf != Economy.Colony)
                {
                    var sInf = s.Type.Inf;
                    if (map.ContainsKey(Key(sInf)))
                    {
                        Adjust(sInf, infSize, $"Apply {prefix} from: {s.Name} (T{s.Type.Tier})", map, site);
                        ApplyStrongLinkBoost(sInf, map, site, prefix);
                    }
                    if (UseNewModel && s.Links?.StrongSites != null && !subLink.HasValue)
                    {
                        ApplyStrongLinks2(map, s.Links.StrongSites, site, calcIds, sInf);
                    }
                    continue;
                }

                if (s.PrimaryEconomy == null)
                    continue;

                foreach (var kvp in s.Economies!)
                {
                    var ee = Enum.Parse<Economy>(kvp.Key, ignoreCase: true);
                    var val = kvp.Value;
                    if (s.Intrinsic?.Contains(ee) == true)
                    {
                        if (UseNewModel)
                        {
                            var linkSize = s.Type.Tier == 1 ? 0.4 : s.Type.Tier == 2 ? 0.8 : 1.2;
                            Adjust(ee, linkSize, $"Apply colony {prefix} from: {s.Name} (T{s.Type.Tier})", map, site);
                        }
                        else
                        {
                            Adjust(ee, val, $"Apply colony {prefix} from: {s.Name} (T{s.Type.Tier})", map, site);
                        }
                        ApplyStrongLinkBoost(ee, map, site, $"{prefix}s");
                    }
                }

                if (UseNewModel && s.Links?.StrongSites != null && !subLink.HasValue)
                {
                    ApplyStrongLinks2(map, s.Links.StrongSites, site, calcIds, Economy.Colony);
                }
            }
        }

        public static void ApplyStrongLinkBoost(Economy inf, EconomyMap map, SiteMap2 site, string reason)
        {
            var reserveLevel = site.Sys.ReserveLevel;

            switch (inf)
            {
                default:
                    return;
                case Economy.Agriculture:
                    if (site.Body?.Type is BodyType.EarthLikeWorld or BodyType.WaterWorld || site.Body?.Features.Contains(BodyFeature.Bio) == true)
                    {
                        Adjust(inf, 0.4, $"+ {reason} boost: Body is ELW/WW or has BIO", map, site, "body");
                    }
                    if (site.Body?.Type == BodyType.Icy || BodyIsTidalToStar(site.Sys, site.Body))
                    {
                        Adjust(inf, -0.4, $"- {reason} boost: Body is ICY or has TIDAL", map, site, "body");
                    }
                    break;
                case Economy.Extraction:
                    if (MajorPristine.Contains(reserveLevel))
                    {
                        Adjust(inf, 0.4, $"+ {reason} boost: System reserveLevel is MAJOR or PRISTINE", map, site, "sys");
                    }
                    else if (DepletedLow.Contains(reserveLevel))
                    {
                        Adjust(inf, -0.4, $"- {reason} boost: System reserveLevel is LOW or DEPLETED", map, site, "sys");
                    }
                    if (site.Body?.Features.Contains(BodyFeature.Volcanism) == true)
                    {
                        Adjust(inf, 0.4, $"+ {reason} boost: Body has VOLCANISM", map, site, "body");
                    }
                    return;
                case Economy.HighTech:
                    if (ElwAwWw.Contains(site.Body?.Type ?? BodyType.Un) || site.Body?.Features.Any(f => f is BodyFeature.Bio or BodyFeature.Geo) == true)
                    {
                        Adjust(inf, 0.4, $"+ {reason} boost: Body is AW/ELW/WW or has BIO/GEO", map, site, "body");
                    }
                    return;
                case Economy.Industrial:
                case Economy.Refinery:
                    if (MajorPristine.Contains(reserveLevel))
                    {
                        Adjust(inf, 0.4, $"+ {reason} boost: System reserveLevel is MAJOR or PRISTINE", map, site, "sys");
                    }
                    else if (DepletedLow.Contains(reserveLevel))
                    {
                        Adjust(inf, -0.4, $"- {reason} boost: System reserveLevel is LOW or DEPLETED", map, site, "sys");
                    }
                    return;
                case Economy.Tourism:
                    if (ElwAwWw.Contains(site.Body?.Type ?? BodyType.Un) || site.Body?.Features.Any(f => f is BodyFeature.Bio or BodyFeature.Geo) == true)
                    {
                        Adjust(inf, 0.4, $"+ {reason} boost: Body is AW/ELW/WW or has BIO/GEO", map, site, "body");
                    }
                    if (site.Sys.Bodies.Any(b => ColonizationData.StellarRemnants.Contains(b.Type)))
                    {
                        Adjust(inf, 0.4, $"+ {reason} boost: System has BH/NS/WD", map, site, "sys");
                    }
                    return;
            }
        }

        public static void ApplyBuffs(EconomyMap map, SiteMap2 site, bool isSettlement)
        {
            var reserveLevel = site.Sys.ReserveLevel;

            var reserveSensitiveEconomies = new[] { "industrial", "extraction", "refinery" };
            foreach (var key in reserveSensitiveEconomies)
            {
                if (map.GetValueOrDefault(key, 0) > 0)
                {
                    if (MajorPristine.Contains(reserveLevel))
                    {
                        var econ = Enum.Parse<Economy>(key, ignoreCase: true);
                        Adjust(econ, 0.4, "Buff: reserveLevel MAJOR or PRISTINE", map, site, "sys");
                    }
                    else if (DepletedLow.Contains(reserveLevel) && !isSettlement)
                    {
                        var econ = Enum.Parse<Economy>(key, ignoreCase: true);
                        Adjust(econ, -0.4, "Buff: reserveLevel LOW or DEPLETED", map, site, "sys");
                    }
                }
            }

            if (map.GetValueOrDefault(Key(Economy.Agriculture), 0) > 0)
            {
                var buffed = false;
                if (site.Body?.Features.Any(f => f is BodyFeature.Bio or BodyFeature.Terraformable) == true)
                {
                    Adjust(Economy.Agriculture, 0.4, "Buff: body has BIO or TERRAFORMABLE", map, site, "body");
                    buffed = true;
                }
                else if (site.Body?.Type is BodyType.EarthLikeWorld or BodyType.WaterWorld)
                {
                    Adjust(Economy.Agriculture, 0.4, "Buff: body is ELW or WW", map, site, "body");
                }
                if ((site.Body?.Type == BodyType.Icy || BodyIsTidalToStar(site.Sys, site.Body)) && (!isSettlement || buffed))
                {
                    Adjust(Economy.Agriculture, -0.4, "Buff: body is ICY or has TIDAL", map, site, "body");
                }
            }

            if (map.GetValueOrDefault(Key(Economy.HighTech), 0) > 0)
            {
                if (isSettlement)
                {
                    if (site.Body?.Features.Contains(BodyFeature.Bio) == true)
                    {
                        Adjust(Economy.HighTech, 0.4, "Buff: body has BIO", map, site, "body");
                    }
                    if (site.Body?.Features.Contains(BodyFeature.Geo) == true)
                    {
                        Adjust(Economy.HighTech, 0.4, "Buff: body has GEO", map, site, "body");
                    }
                    if (ElwAw.Contains(site.Body?.Type ?? BodyType.Un))
                    {
                        Adjust(Economy.HighTech, 0.4, "Buff: body is ELW or AW", map, site, "body");
                    }
                }
                else
                {
                    if (site.Body?.Features.Any(f => f is BodyFeature.Bio or BodyFeature.Geo) == true)
                    {
                        Adjust(Economy.HighTech, 0.4, "Buff: body has BIO or GEO", map, site, "body");
                    }
                    else if (ElwAw.Contains(site.Body?.Type ?? BodyType.Un))
                    {
                        Adjust(Economy.HighTech, 0.4, "Buff: body is ELW or AW", map, site, "body");
                    }
                }
            }

            if (map.GetValueOrDefault(Key(Economy.Extraction), 0) > 0)
            {
                if (site.Body?.Features.Contains(BodyFeature.Volcanism) == true)
                {
                    Adjust(Economy.Extraction, 0.4, "Buff: body has VOLCANISM", map, site, "body");
                }
            }

            if (map.GetValueOrDefault(Key(Economy.Tourism), 0) > 0)
            {
                if (site.Sys.Bodies.Any(b => b.Type == BodyType.BlackHole))
                {
                    Adjust(Economy.Tourism, 0.4, "Buff: system has a Black Hole", map, site, "sys");
                }
                if (site.Sys.Bodies.Any(b => b.Type == BodyType.NeutronStar))
                {
                    Adjust(Economy.Tourism, 0.4, "Buff: system has a Neutron Star", map, site, "sys");
                }
                if (site.Sys.Bodies.Any(b => b.Type == BodyType.WhiteDwarf))
                {
                    Adjust(Economy.Tourism, 0.4, "Buff: system has a White Dwarf", map, site, "sys");
                }
                if (site.BodyBuffed?.Contains(Economy.Tourism) != true)
                {
                    if (site.Body?.Features.Any(f => f is BodyFeature.Bio or BodyFeature.Geo) == true)
                    {
                        Adjust(Economy.Tourism, 0.4, "Buff: body has BIO or GEO", map, site, "body");
                    }
                    else if (ElwAwWw.Contains(site.Body?.Type ?? BodyType.Un))
                    {
                        Adjust(Economy.Tourism, 0.4, "Buff: body is ELW or WW or AW", map, site, "body");
                    }
                }
            }
        }

        private static void ApplyWeakLinks(EconomyMap map, SiteMap2 site, List<string> calcIds)
        {
            if (site.Links?.WeakSites == null) return;
            foreach (var s in site.Links.WeakSites)
            {
                if (!calcIds.Contains(s.Id)) continue;
                var inf = s.Type.Inf;
                if (inf == Economy.None) continue;
                if (inf == Economy.Colony)
                {
                    if (s.PrimaryEconomy == null) continue;
                    foreach (var intrinsicInf in s.Intrinsic ?? new List<Economy>())
                    {
                        Adjust(intrinsicInf, 0.05, $"Apply weak link from: {s.Name} (intrinsic)", map, site);
                    }
                    continue;
                }
                if (map.ContainsKey(Key(inf)))
                {
                    Adjust(inf, 0.05, $"Apply weak link from: {s.Name}", map, site);
                }
            }
        }

        public static Economy CalculateColonyEconomies2(SiteMap2 site, List<string> calcIds)
        {
            if (site.Economies != null && site.PrimaryEconomy.HasValue)
                return site.PrimaryEconomy.Value;

            site.EconomyAudit = new List<EconAudit>();
            var map = new EconomyMap
            {
                [Key(Economy.Agriculture)] = 0,
                [Key(Economy.Extraction)] = 0,
                [Key(Economy.HighTech)] = 0,
                [Key(Economy.Industrial)] = 0,
                [Key(Economy.Military)] = 0,
                [Key(Economy.Refinery)] = 0,
                [Key(Economy.Terraforming)] = 0,
                [Key(Economy.Tourism)] = 0,
                [Key(Economy.Service)] = 0,
            };

            switch (site.Type.BuildClass)
            {
                default:
                    return Economy.None;
                case BuildClass.Hub:
                case BuildClass.Installation:
                case BuildClass.Unknown:
                    return Economy.None;
                case BuildClass.Settlement:
                    Adjust(site.Type.Inf, 1.0, "Odyssey settlement fixed economy", map, site);
                    ApplyBuffs(map, site, true);
                    return FinishUp(map, site);
                case BuildClass.Outpost:
                case BuildClass.Starport:
                    break;
            }

            if (site.Type.Fixed.HasValue)
            {
                ApplySpecializedPort(map, site);
            }
            else
            {
                if (UseNewModel || !site.Type.Orbital || site.Body?.SurfacePrimary == null || site != site.Body?.OrbitalPrimary)
                {
                    ApplyBodyType(map, site);
                }
                if (UseNewModel)
                {
                    ApplyBuffs(map, site, false);
                }
            }

            if (site.Links != null)
            {
                ApplyStrongLinks2(map, site.Links.StrongSites, site, calcIds);
                if (!site.Type.Fixed.HasValue)
                {
                    if (!UseNewModel)
                    {
                        ApplyBuffs(map, site, false);
                    }
                }
                ApplyWeakLinks(map, site, calcIds);
            }

            return FinishUp(map, site);
        }

        public static bool BodyIsTidalToStar(SysMap2 sys, BodyMap2? body, List<int>? parents = null)
        {
            if (parents == null && body != null)
                parents = new List<int>(body.Parents);

            if (body?.Features.Contains(BodyFeature.Tidal) != true && body?.Type != BodyType.Barycentre)
                return false;

            if (parents == null || parents.Count == 0)
                return false;

            var parentNum = parents[0];
            var parentBody = sys.Bodies.Find(b => b.Num == parentNum);
            if (parentBody == null)
                return false;

            if (StellarAndStars.Contains(parentBody.Type))
                return true;

            if (parentBody.Type == BodyType.Barycentre)
            {
                var children = sys.Bodies.Where(b => b.Parents.Count > 0 && b.Parents[0] == parentBody.Num).ToList();
                if (children.Count > 1)
                {
                    var idx = children.FindIndex(b => b.Name == body!.Name);
                    if (idx < 2)
                    {
                        var other = idx == 0 ? children[1] : children[0];
                        if (StellarAndStars.Contains(other.Type))
                            return true;
                        var skipParentNum = parents.Count > 1 ? parents[1] : -1;
                        var skipParentBody = sys.Bodies.Find(b => b.Num == skipParentNum);
                        if (skipParentBody?.Type == BodyType.Star)
                            return true;
                    }
                    if (idx > 1 && StellarAndStars.Contains(children[0].Type) && StellarAndStars.Contains(children[1].Type))
                        return true;
                    return false;
                }
            }

            parents.RemoveAt(0);
            return BodyIsTidalToStar(sys, parentBody, parents);
        }
    }
}
