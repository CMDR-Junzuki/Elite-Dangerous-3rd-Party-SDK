using System;
using System.Collections.Generic;
using System.Linq;
using EliteDangerousSdk.Data;

namespace EliteDangerousSdk.Planner
{
    public record TierPoints(int Tier2, int Tier3);

    public record SiteTypeValidity(bool IsValid, string? Msg, string[]? Unlocks);

    public record SysSnapshot(string Architect, long Id64, int V, string Name, double[] Pos, TierPoints TierPoints, SysEffects SumEffects, RawSite[] Sites, Pop? Pop, bool Stale, int Score, bool? Fav);

    public record BodyInfo(BodyType Type, BodyFeature[] Features, double Temp, double Gravity, double Radius, string SubType);

    public record SysUnlockInfo(string Icon, string Title, string[] NeedTypes, string Needs);

    public static class ColonizationSystem
    {
        private static readonly BodyType[] StarsAndClusters = new[]
        {
            BodyType.BlackHole, BodyType.NeutronStar, BodyType.WhiteDwarf,
            BodyType.AsteroidCluster, BodyType.Star
        };

        private static readonly string[] SysEffectKeys = { "pop", "mpop", "sec", "tech", "wealth", "sol", "dev" };

        public static readonly Dictionary<string, SysUnlockInfo> MapSysUnlocks = new()
        {
            ["SettlementTourist"] = new SysUnlockInfo("Suitcase", "Tourist Settlements", new[] { "hermes", "angelia", "eirene" }, "A satellite"),
            ["InstallationTourist"] = new SysUnlockInfo("Cocktails", "Tourist Installations", new[] { "aergia", "comus", "gelos", "fufluns" }, "A tourist settlement"),
            ["InstallationScientific"] = new SysUnlockInfo("NetworkTower", "Scientific Installations", new[] { "pheobe", "asteria", "caerus", "chronos" }, "A bio settlement"),
            ["InstallationMilitary"] = new SysUnlockInfo("Shield", "Military Installations", new[] { "ioke", "bellona", "enyo", "polemos", "minerva" }, "A military settlement"),
            ["HubMilitary"] = new SysUnlockInfo("ReportHacked", "Military Hub", new[] { "vacuna", "alastor" }, "A military installation"),
            ["HubCivilian"] = new SysUnlockInfo("Home", "Civilian Hub", new[] { "consus", "picumnus", "annona", "ceres", "fornax" }, "An agricultural settlement"),
            ["HubExploration"] = new SysUnlockInfo("Camera", "Exploration Hub", new[] { "pistis", "soter", "aletheia" }, "A comms installation"),
            ["HubOutpost"] = new SysUnlockInfo("HardDriveGroup", "Outpost Hub", new[] { "demeter" }, "A space farm"),
            ["HubIndustrial"] = new SysUnlockInfo("Manufacturing", "Industrial Hub", new[] { "euthenia", "phorcys" }, "A mining/industrial installation"),
            ["HubExtraction"] = new SysUnlockInfo("Diamond", "Extraction Hub", new[] { "ourea", "mantus", "orcus", "aerecura", "erebus" }, "An extraction settlement"),
            ["ShipyardT1"] = new SysUnlockInfo("Airplane", "Shipyard at T1 surface ports", new[] { "eunostus", "molae", "tellus_i", "vacuna", "alastor" }, "An industrial hub or military installation"),
            ["OutfittingNonMilOutpost"] = new SysUnlockInfo("Dataflows", "Outfitting at non-Military Outposts", new[] { "janus", "vacuna", "alastor" }, "A high-tech hub or military installation"),
            ["OutfittingT1Surface"] = new SysUnlockInfo("FlowChart", "Outfitting at non-Industrial T1 surface ports", new[] { "janus", "vacuna", "alastor" }, "A high-tech hub or military installation"),
            ["VistaGenomics"] = new SysUnlockInfo("ClassroomLogo", "Vista Genomics at T1 Surface or T2 orbital ports", new[] { "asclepius", "eupraxia", "athena", "caelus" }, "A scientific hub or medical installation"),
            ["UniversalCartographics"] = new SysUnlockInfo("HomeGroup", "Universal Cartographics at T1 Surface or T2 orbital ports", new[] { "astraeus", "coeus", "dione", "dodona", "tellus_e" }, "An exploration hub or research installation"),
            ["MarketOutposts"] = new SysUnlockInfo("Shop", "Commodities at Pirate, Scientific or Military Outposts", new[] { "bacchus", "dionysus", "hedone", "opora", "pasithea", "io" }, "An outpost hub, tourist installation or space bar"),
            ["CrewLounge"] = new SysUnlockInfo("People", "Crew Lounge at non-Civilian T1 ports", new[] { "bacchus", "dionysus" }, "A space bar"),
        };

        private static BodyMap2 GetUnknownBody()
        {
            return new BodyMap2
            {
                Name = "",
                Num = -1,
                DistLS = -1,
                Features = new List<BodyFeature> { BodyFeature.Landable },
                Parents = new List<int>(),
                SubType = "",
                Type = BodyType.Un,
                Radius = -1,
                Temp = -1,
                Gravity = -1,
            };
        }

        private static List<SiteMap2> FindSiblingSites(List<BodyMap2> bods, Dictionary<string, BodyMap2> bodyMap, BodyMap2 body, bool onlyOrbitals)
        {
            if (!StarsAndClusters.Contains(body.Type))
            {
                return new List<SiteMap2>(onlyOrbitals ? body.Orbital : body.Sites);
            }

            var parent = body.Type != BodyType.AsteroidCluster
                ? body
                : bods.Find(b => body.Parents.Count > 0 && b.Num == body.Parents[0]);
            if (parent == null) return new List<SiteMap2>();

            var bodies = new List<BodyMap2> { parent };
            bodies.AddRange(bods.Where(b =>
                b.Type == BodyType.AsteroidCluster &&
                b.Parents.Count > 0 &&
                b.Parents[0] == parent.Num));

            var siblingSites = bodies
                .Where(x => bodyMap.ContainsKey(x.Name))
                .SelectMany(x => onlyOrbitals ? bodyMap[x.Name].Orbital : bodyMap[x.Name].Sites)
                .ToList();
            return siblingSites;
        }

        private static SiteMap2? GetBodyPrimaryPort(List<SiteMap2> sites, List<string> calcIds)
        {
            if (sites.Count == 0) return null;
            if (calcIds.Count > 0)
                sites = sites.Where(s => calcIds.Contains(s.Id)).ToList();

            var t3s = sites.Where(s =>
                s.Type.Tier == 3 &&
                (s.Type.BuildClass == BuildClass.Starport || s.Type.BuildClass == BuildClass.Outpost)).ToList();
            if (t3s.Count > 0) return t3s[0];

            var t2s = sites.Where(s =>
                s.Type.Tier == 2 &&
                (s.Type.BuildClass == BuildClass.Starport || s.Type.BuildClass == BuildClass.Outpost)).ToList();
            if (t2s.Count > 0) return t2s[0];

            var t1s = sites.Where(s =>
                s.Type.Tier == 1 &&
                (s.Type.BuildClass == BuildClass.Starport || s.Type.BuildClass == BuildClass.Outpost)).ToList();
            if (t1s.Count > 0) return t1s[0];

            return null;
        }

        private static void CalcSiteLinks(List<BodyMap2> bods, Dictionary<string, BodyMap2> bodyMap, BodyMap2 body, SiteMap2 primarySite, List<string> calcIds)
        {
            var siblingSites = FindSiblingSites(bods, bodyMap, body, false);

            var strongSites = siblingSites
                .Where(s =>
                {
                    if (s.ParentLink != null ||
                        s.Type.Inf == Economy.None ||
                        s == primarySite ||
                        !calcIds.Contains(s.Id))
                        return false;
                    if (!primarySite.Type.Orbital &&
                        s.Type.Orbital &&
                        (s.Type.BuildClass == BuildClass.Outpost || s.Type.BuildClass == BuildClass.Starport))
                        return false;
                    if (s.Type.Orbital && !primarySite.Type.Orbital && body.OrbitalPrimary != null)
                        return false;
                    s.ParentLink = primarySite;
                    return true;
                })
                .OrderBy(a => a.Name)
                .ToList();

            var weakSites = bodyMap.Values
                .Where(b => b != body)
                .SelectMany(b => b.Sites)
                .Where(s =>
                    !siblingSites.Contains(s) &&
                    s.Type.Inf != Economy.None &&
                    s != s.Body?.OrbitalPrimary &&
                    s != s.Body?.SurfacePrimary &&
                    calcIds.Contains(s.Id))
                .ToList();

            if (primarySite.Links == null && (strongSites.Count > 0 || weakSites.Count > 0))
            {
                primarySite.Links = new SiteLinks2 { StrongSites = strongSites, WeakSites = weakSites };
            }
        }

        private static void CalcSiteEconomies(SiteMap2 site, List<string> calcIds)
        {
            if (site.Links == null) return;

            foreach (var s in site.Links.StrongSites)
            {
                var inf = s.Type.Inf;
                if (inf == Economy.None) continue;
                if (inf == Economy.Colony)
                    ColonizationEconomy.CalculateColonyEconomies2(s, calcIds);
            }

            foreach (var s in site.Links.WeakSites)
            {
                var inf = s.Type.Inf;
                if (inf == Economy.None) continue;
                if (inf == Economy.Colony)
                    ColonizationEconomy.CalculateColonyEconomies2(s, calcIds);
            }
        }

        private static void CalcBodyLinks(List<BodyMap2> bods, Dictionary<string, BodyMap2> bodyMap, BodyMap2 body, List<string> calcIds)
        {
            if (body.SurfacePrimary == null && body.OrbitalPrimary == null) return;

            if (body.SurfacePrimary != null)
                CalcSiteLinks(bods, bodyMap, body, body.SurfacePrimary, calcIds);
            if (body.OrbitalPrimary != null)
                CalcSiteLinks(bods, bodyMap, body, body.OrbitalPrimary, calcIds);

            foreach (var site in body.Sites)
                CalcSiteEconomies(site, calcIds);
        }

        private static SysMap2 InitializeSysMap(RawSys sys, bool useIncomplete, int idxLimit)
        {
            var siteMaps = new List<SiteMap2>();
            var systemScore = 0;

            var calcIds = useIncomplete
                ? sys.Sites.Where((s, i) => i < idxLimit && s.Status != BuildStatus.Demolish).Select(s => s.Id).ToList()
                : sys.Sites.Where(s => s.Status == BuildStatus.Complete).Select(s => s.Id).ToList();

            var sitesList = sys.Sites?.ToList() ?? new List<RawSite>();

            var allBodies = (sys.Bodies ?? Array.Empty<RawBod>()).Select(b => new BodyMap2
            {
                Name = b.Name,
                Num = b.Num,
                DistLS = b.DistLS,
                Parents = b.Parents?.ToList() ?? new List<int>(),
                Type = b.Type,
                SubType = b.SubType,
                Features = b.Features?.ToList() ?? new List<BodyFeature>(),
                Radius = b.Radius,
                Temp = b.Temp,
                Gravity = b.Gravity,
            }).ToList();

            var bodyMap = new Dictionary<string, BodyMap2>();
            foreach (var body in allBodies)
                bodyMap[body.Name] = body;

            foreach (var s in sitesList)
            {
                var bodyNum = s.BodyNum >= 0 ? s.BodyNum : -1;
                var rawBody = allBodies.Find(b => b.Num == bodyNum) ?? GetUnknownBody();
                if (!bodyMap.ContainsKey(rawBody.Name))
                    bodyMap[rawBody.Name] = rawBody;
                var body = bodyMap[rawBody.Name];

                var siteType = ColonizationData.GetSiteType(s.BuildType);
                if (siteType == null) continue;

                var site = new SiteMap2
                {
                    Id = s.Id,
                    BuildId = s.BuildId,
                    MarketId = s.MarketId,
                    Name = s.Name,
                    BodyNum = s.BodyNum,
                    BuildType = s.BuildType,
                    Notes = s.Notes,
                    Status = s.Status,
                    Type = siteType,
                    Body = body,
                    Original = s,
                };

                siteMaps.Add(site);
                body.Sites.Add(site);

                if (site.Status != BuildStatus.Demolish)
                {
                    if (site.Type.Orbital)
                        body.Orbital.Add(site);
                    else
                        body.Surface.Add(site);
                }

                if (calcIds.Contains(site.Id))
                    systemScore += site.Type.Score ?? 0;
            }

            var sysMap = new SysMap2
            {
                V = sys.V,
                Rev = sys.Rev,
                Name = sys.Name,
                Nickname = sys.Nickname,
                Notes = sys.Notes,
                Id64 = sys.Id64,
                Architect = sys.Architect,
                Pos = sys.Pos,
                ReserveLevel = sys.ReserveLevel,
                PrimaryPortId = sys.PrimaryPortId,
                Bodies = allBodies,
                Sites = siteMaps,
                Slots = sys.Slots,
                Revs = sys.Revs?.ToList() ?? new List<Rev>(),
                SavedNames = sys.SavedNames?.ToList(),
                Pop = sys.Pop,
                Open = sys.Open,
                IdxCalcLimit = sys.IdxCalcLimit,
                BodyMap = bodyMap,
                SiteMaps = siteMaps,
                CalcIds = calcIds,
                SystemScore = systemScore,
            };

            foreach (var s in siteMaps)
                s.Sys = sysMap;

            return sysMap;
        }

        private static (Dictionary<string, double> Economies, SysEffects SumEffects) SumSystemEffects(List<SiteMap2> siteMaps, List<string> calcIds, bool? buffNerf = null)
        {
            var mapEconomies = new Dictionary<string, double>();
            int pop = 0, mpop = 0, sec = 0, tech = 0, wealth = 0, sol = 0, dev = 0;

            foreach (var site in siteMaps)
            {
                if (site.Status == BuildStatus.Demolish) continue;
                if (!calcIds.Contains(site.Id)) continue;

                if (site.Type.BuildClass is BuildClass.Settlement or BuildClass.Outpost or BuildClass.Starport)
                {
                    ColonizationEconomy.CalculateColonyEconomies2(site, calcIds);
                }

                var inf = site.PrimaryEconomy ?? site.Type.Inf;

                if (inf != Economy.None)
                {
                    var key = inf.ToString().ToLowerInvariant();
                    mapEconomies[key] = mapEconomies.GetValueOrDefault(key, 0) + 1;
                }

                pop += site.Type.Effects.Pop;
                mpop += site.Type.Effects.Mpop;
                sec += site.Type.Effects.Sec;
                tech += site.Type.Effects.Tech;
                wealth += site.Type.Effects.Wealth;
                sol += site.Type.Effects.Sol;
                dev += site.Type.Effects.Dev;
            }

            var sorted = mapEconomies.OrderByDescending(kv => kv.Value).ThenBy(kv => kv.Key).ToList();
            var economies = new Dictionary<string, double>();
            foreach (var kvp in sorted)
                economies[kvp.Key] = kvp.Value;

            var sumEffects = new SysEffects(pop, mpop, sec, tech, wealth, sol, dev);

            return (economies, sumEffects);
        }

        public static SysMap2 BuildSystemModel2(RawSys sys, bool useIncomplete, bool? buffNerf = null)
        {
            var idxLimit = sys.IdxCalcLimit ?? sys.Sites?.Length ?? 0;

            sys = sys with
            {
                PrimaryPortId = sys.Sites?.Length > 0 ? sys.Sites[0].Id : null,
                Sites = (sys.Sites ?? Array.Empty<RawSite>()).Select(s => s with { }).ToArray(),
            };

            var sysMap = InitializeSysMap(sys, useIncomplete, idxLimit);

            var allBodies = sysMap.BodyMap.Values.ToList();
            foreach (var body in allBodies)
            {
                body.SurfacePrimary = GetBodyPrimaryPort(body.Surface, sysMap.CalcIds);
                var siblingSites = FindSiblingSites(sysMap.Bodies, sysMap.BodyMap, body, body.SurfacePrimary != null);
                body.OrbitalPrimary = GetBodyPrimaryPort(siblingSites, sysMap.CalcIds);
            }

            foreach (var body in allBodies)
            {
                CalcBodyLinks(sysMap.Bodies, sysMap.BodyMap, body, sysMap.CalcIds);
            }

            var tierPointsResult = SumTierPoints(sysMap.SiteMaps, sysMap.CalcIds, !useIncomplete);
            var (economies, sumEffects) = SumSystemEffects(sysMap.SiteMaps, sysMap.CalcIds, buffNerf);

            var sysUnlocks = new Dictionary<string, bool>();
            foreach (var kvp in MapSysUnlocks)
            {
                var unlocked = sysMap.Sites.Any(s =>
                    sysMap.CalcIds.Contains(s.Id) &&
                    kvp.Value.NeedTypes.Any(n => s.BuildType?.StartsWith(n) == true));
                sysUnlocks[kvp.Key] = unlocked;
            }

            sysMap.TierPoints = tierPointsResult.TierPoints;
            sysMap.TaxCount = tierPointsResult.TaxCount;
            sysMap.Economies = economies;
            sysMap.SumEffects = sumEffects;
            sysMap.SysUnlocks = sysUnlocks;

            return sysMap;
        }

        public static (TierPoints TierPoints, int TaxCount) SumTierPoints(List<SiteMap2> siteMaps, List<string> calcIds, bool incBuildStarted = false)
        {
            var tierPoints = new TierPoints(0, 0);
            var primaryPortId = siteMaps.Count > 0 ? siteMaps[0].Id : null;
            var taxCount = -2;

            foreach (var site in siteMaps)
            {
                if (site.Status == BuildStatus.Demolish) continue;
                if (incBuildStarted)
                {
                    if (site.Status == BuildStatus.Plan) continue;
                }
                else if (!calcIds.Contains(site.Id)) continue;

                if (site.Id != primaryPortId &&
                    site.Type.Needs.Count > 0 &&
                    site.Type.Needs.Tier > 1)
                {
                    var needCount = site.Type.Needs.Count;
                    if (site.Type.BuildClass == BuildClass.Starport && site.Type.Tier > 1)
                    {
                        taxCount++;
                        needCount = ApplyTax(site.Type.Needs.Tier, needCount, taxCount);
                    }
                    var tierName = site.Type.Needs.Tier == 2 ? "tier2" : "tier3";
                    if (tierName == "tier2")
                        tierPoints = tierPoints with { Tier2 = tierPoints.Tier2 - needCount };
                    else
                        tierPoints = tierPoints with { Tier3 = tierPoints.Tier3 - needCount };
                    site.CalcNeeds = (site.Type.Needs.Tier, needCount);
                }

                if (!calcIds.Contains(site.Id)) continue;

                if (site.Type.Gives.Count > 0 && site.Type.Gives.Tier > 1)
                {
                    if (site.Type.Gives.Tier == 2)
                        tierPoints = tierPoints with { Tier2 = tierPoints.Tier2 + site.Type.Gives.Count };
                    else
                        tierPoints = tierPoints with { Tier3 = tierPoints.Tier3 + site.Type.Gives.Count };
                }
            }

            return (tierPoints, taxCount);
        }

        public static int ApplyTax(int tier, int cost, int taxCount)
        {
            if (taxCount > 0)
            {
                if (tier == 3)
                    cost += cost * taxCount;
                else
                    cost += (int)Math.Truncate(cost * 0.75 * taxCount);
            }
            return cost;
        }

        public static string[] GetPreReqNeeded(SiteTypeDef type)
        {
            switch (type.PreReq)
            {
                case "satellite":
                    return new[] { "hermes", "angelia", "eirene" };
                case "comms":
                    return new[] { "pistis", "soter", "aletheia" };
                case "settlementAgr":
                    return new[] { "consus", "picumnus", "annona", "ceres", "fornax" };
                case "installationAgr":
                    return new[] { "demeter" };
                case "installationMil":
                    return new[] { "vacuna", "alastor" };
                case "outpostMining":
                    return new[] { "euthenia", "phorcys" };
                case "relay":
                    return new[] { "enodia", "ichnaea" };
                case "settlementBio":
                    return new[] { "pheobe", "asteria", "caerus", "chronos" };
                case "settlementTourist":
                    return new[] { "aergia", "comus", "gelos", "fufluns" };
                case "settlementMilitary":
                    return new[] { "ioke", "bellona", "enyo", "polemos", "minerva" };
                case "settlementExtraction":
                    return new[] { "ourea", "mantus", "orcus", "aerecura", "erebus" };
                default:
                    return Array.Empty<string>();
            }
        }

        public static bool HasPreReq2(List<SiteMap2>? siteMaps, SiteTypeDef type)
        {
            if (siteMaps == null) return true;
            var neededBuildTypes = GetPreReqNeeded(type);
            return siteMaps.Any(s =>
                s.Status != BuildStatus.Demolish &&
                neededBuildTypes.Any(n => s.BuildType?.StartsWith(n) == true));
        }

        public static SiteTypeValidity IsTypeValid2(SysMap2? sysMap, SiteTypeDef? type, SiteTypeDef? priorType)
        {
            if (type == null) return new SiteTypeValidity(true, null, null);

            if (sysMap != null)
            {
                var neededT2 = sysMap.TierPoints.Tier2;
                var neededT3 = sysMap.TierPoints.Tier3;
                if (priorType != null)
                {
                    if (priorType.Needs.Tier == 2) neededT2 += priorType.Needs.Count;
                    if (priorType.Needs.Tier == 3) neededT3 += priorType.Needs.Count;
                }

                if (type.Needs.Tier == 2 && neededT2 < type.Needs.Count)
                    return new SiteTypeValidity(false, "Not enough Tier 2 points", null);
                if (type.Needs.Tier == 3 && neededT3 < type.Needs.Count)
                    return new SiteTypeValidity(false, "Not enough Tier 3 points", null);
            }

            if (type.PreReq != null)
            {
                var isValid = HasPreReq2(sysMap?.SiteMaps, type);
                return new SiteTypeValidity(
                    isValid,
                    isValid ? null : $"Requires {type.PreReq}",
                    type.Unlocks);
            }

            if (type.Unlocks != null)
                return new SiteTypeValidity(true, null, type.Unlocks);

            return new SiteTypeValidity(true, null, null);
        }

        public static int PredictSurfaceSlots(BodyInfo body)
        {
            if (body.Type == BodyType.Un) return -1;

            if (body.Temp > 700 || body.Gravity > 2.7 || !body.Features.Contains(BodyFeature.Landable))
                return 0;

            var predictedSlots = body.Radius < 1500 ? 1
                : body.Radius < 3750 ? 2
                : body.Radius < 6000 ? 3
                : 4;

            if (body.SubType == "High metal content world") predictedSlots++;
            if (body.Features.Contains(BodyFeature.Terraformable)) predictedSlots++;
            if (body.Features.Contains(BodyFeature.Volcanism) || body.Features.Contains(BodyFeature.Geo))
                predictedSlots++;
            if (body.Features.Contains(BodyFeature.Atmosphere)) predictedSlots += 2;

            return Math.Min(predictedSlots, 7);
        }

        public static SysSnapshot GetSnapshot(RawSys newSys, bool? isFav)
        {
            var snapshotFull = BuildSystemModel2(newSys, false, true);
            var snapshot = new SysSnapshot(
                Architect: newSys.Architect,
                Id64: newSys.Id64,
                V: newSys.V,
                Name: newSys.Name,
                Pos: newSys.Pos,
                TierPoints: snapshotFull.TierPoints,
                SumEffects: snapshotFull.SumEffects,
                Sites: newSys.Sites,
                Pop: newSys.Pop,
                Stale: false,
                Score: snapshotFull.SystemScore,
                Fav: isFav
            );
            return snapshot;
        }
    }
}
