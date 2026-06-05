using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.Json;

namespace EliteDangerousSdk.Data
{
    public static class DataProvider
    {
        private static string? _dataPath;

        public static void Initialize(string dataPath)
        {
            _dataPath = dataPath;
            LoadAll();
        }

        public static string ResolveDataPath()
        {
            var baseDir = AppDomain.CurrentDomain.BaseDirectory;
            var path = Path.GetFullPath(Path.Combine(baseDir, "..", "..", "..", "..", "..", "specs", "data"));
            if (Directory.Exists(path)) return path;
            return baseDir;
        }

        public static List<JsonElement> Commodities { get; private set; } = new();
        public static Dictionary<long, JsonElement> CommoditiesById { get; private set; } = new();
        public static Dictionary<string, JsonElement> CommoditiesBySymbol { get; private set; } = new();

        public static List<JsonElement> Ships { get; private set; } = new();
        public static Dictionary<long, JsonElement> ShipsById { get; private set; } = new();

        public static List<JsonElement> Outfitting { get; private set; } = new();
        public static Dictionary<long, JsonElement> OutfittingById { get; private set; } = new();

        public static List<JsonElement> Engineers { get; private set; } = new();
        public static Dictionary<long, JsonElement> EngineersById { get; private set; } = new();

        public static List<JsonElement> Materials { get; private set; } = new();
        public static Dictionary<long, JsonElement> MaterialsById { get; private set; } = new();

        public static List<JsonElement> MicroResources { get; private set; } = new();
        public static Dictionary<long, JsonElement> MicroResourcesById { get; private set; } = new();

        public static List<JsonElement> Economies { get; private set; } = new();
        public static Dictionary<string, JsonElement> EconomiesById { get; private set; } = new();

        public static List<JsonElement> Governments { get; private set; } = new();
        public static Dictionary<string, JsonElement> GovernmentsById { get; private set; } = new();

        public static List<JsonElement> SystemAllegiances { get; private set; } = new();

        public static List<JsonElement> SecurityLevels { get; private set; } = new();

        public static List<JsonElement> FactionStates { get; private set; } = new();

        public static List<JsonElement> Factions { get; private set; } = new();
        public static Dictionary<string, JsonElement> FactionsById { get; private set; } = new();

        public static List<JsonElement> Happiness { get; private set; } = new();

        public static List<JsonElement> PassengerTypes { get; private set; } = new();

        public static List<JsonElement> RareCommodities { get; private set; } = new();
        public static Dictionary<long, JsonElement> RareCommoditiesById { get; private set; } = new();

        public static List<JsonElement> RingTypes { get; private set; } = new();

        public static List<JsonElement> CrimeTypes { get; private set; } = new();

        public static List<JsonElement> DockingDeniedReasons { get; private set; } = new();

        public static List<JsonElement> Bundles { get; private set; } = new();
        public static Dictionary<long, JsonElement> BundlesById { get; private set; } = new();

        public static List<JsonElement> SKUs { get; private set; } = new();

        public static List<JsonElement> TerraformingStates { get; private set; } = new();

        public static List<JsonElement> CombatRanks { get; private set; } = new();

        public static List<JsonElement> TradeRanks { get; private set; } = new();

        public static List<JsonElement> ExplorationRanks { get; private set; } = new();

        public static List<JsonElement> CQCRanks { get; private set; } = new();

        public static List<JsonElement> EmpireRanks { get; private set; } = new();

        public static List<JsonElement> FederationRanks { get; private set; } = new();

        public static Dictionary<string, JsonElement> CoriolisShips { get; private set; } = new();
        public static Dictionary<long, JsonElement> CoriolisShipsByEdId { get; private set; } = new();

        public static List<JsonElement> HardpointModules { get; private set; } = new();
        public static Dictionary<long, JsonElement> HardpointModulesByEdId { get; private set; } = new();

        public static List<JsonElement> InternalModules { get; private set; } = new();
        public static Dictionary<long, JsonElement> InternalModulesByEdId { get; private set; } = new();

        public static List<JsonElement> StandardModules { get; private set; } = new();
        public static Dictionary<long, JsonElement> StandardModulesByEdId { get; private set; } = new();

        public static Dictionary<long, JsonElement> AllModulesByEdId { get; private set; } = new();
        public static Dictionary<string, JsonElement> RareCommoditiesBySymbol { get; private set; } = new();
        public static Dictionary<string, JsonElement> FactionsByName { get; private set; } = new();

        public static JsonElement Blueprints { get; private set; }
        public static JsonElement Modifications { get; private set; }
        public static JsonElement ModifierActions { get; private set; }
        public static JsonElement Specials { get; private set; }
        public static JsonElement ModuleBlueprintMap { get; private set; }

        private static void LoadAll()
        {
            if (_dataPath == null) _dataPath = ResolveDataPath();
            LoadFdevIds();
            LoadCoriolis();
        }

        private static void LoadFdevIds()
        {
            if (_dataPath == null) return;
            var jsonDir = Path.Combine(_dataPath, "json");
            if (!Directory.Exists(jsonDir)) return;

            foreach (var f in Directory.GetFiles(jsonDir, "*.json"))
            {
                try
                {
                    var name = Path.GetFileNameWithoutExtension(f);
                    var json = File.ReadAllText(f);
                    var arr = JsonSerializer.Deserialize<List<JsonElement>>(json) ?? new();

                    switch (name.ToLowerInvariant())
                    {
                        case "commodity":
                            Commodities = arr;
                            foreach (var c in arr)
                            {
                                if (c.TryGetProperty("id", out var idEl) && idEl.TryGetInt64(out var id))
                                    CommoditiesById[id] = c;
                                if (c.TryGetProperty("symbol", out var symEl))
                                {
                                    var sym = symEl.GetString();
                                    if (sym != null) CommoditiesBySymbol[sym] = c;
                                }
                            }
                            break;

                        case "shipyard":
                            Ships = arr;
                            IndexById(arr, ShipsById);
                            break;

                        case "outfitting":
                            Outfitting = arr;
                            IndexById(arr, OutfittingById);
                            break;

                        case "engineers":
                            Engineers = arr;
                            IndexById(arr, EngineersById);
                            break;

                        case "material":
                            Materials = arr;
                            IndexById(arr, MaterialsById);
                            break;

                        case "microresources":
                            MicroResources = arr;
                            IndexById(arr, MicroResourcesById);
                            break;

                        case "economy":
                            Economies = arr;
                            IndexByStringId(arr, EconomiesById);
                            break;

                        case "government":
                            Governments = arr;
                            IndexByStringId(arr, GovernmentsById);
                            break;

                        case "systemallegiance":
                            SystemAllegiances = arr;
                            break;

                        case "security":
                            SecurityLevels = arr;
                            break;

                        case "factionstate":
                            FactionStates = arr;
                            break;

                        case "factionids":
                            Factions = arr;
                            IndexByStringId(arr, FactionsById);
                            IndexByProperty(arr, FactionsByName, "name");
                            break;

                        case "happiness":
                            Happiness = arr;
                            break;

                        case "passengers":
                            PassengerTypes = arr;
                            break;

                        case "rare_commodity":
                            RareCommodities = arr;
                            IndexById(arr, RareCommoditiesById);
                            IndexByProperty(arr, RareCommoditiesBySymbol, "symbol");
                            break;

                        case "rings":
                            RingTypes = arr;
                            break;

                        case "crimes":
                            CrimeTypes = arr;
                            break;

                        case "dockingdeniedreasons":
                            DockingDeniedReasons = arr;
                            break;

                        case "bundles":
                            Bundles = arr;
                            IndexById(arr, BundlesById);
                            break;

                        case "sku":
                            SKUs = arr;
                            break;

                        case "terraformingstate":
                            TerraformingStates = arr;
                            break;

                        case "combatrank":
                            CombatRanks = arr;
                            break;

                        case "traderank":
                            TradeRanks = arr;
                            break;

                        case "explorationrank":
                            ExplorationRanks = arr;
                            break;

                        case "cqcrank":
                            CQCRanks = arr;
                            break;

                        case "empirerank":
                            EmpireRanks = arr;
                            break;

                        case "federationrank":
                            FederationRanks = arr;
                            break;
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"DataProvider: Failed to load {f}: {ex.Message}");
                }
            }
        }

        private static void IndexById(List<JsonElement> items, Dictionary<long, JsonElement> target)
        {
            foreach (var item in items)
            {
                if (item.TryGetProperty("id", out var idEl) && idEl.TryGetInt64(out var id))
                    target[id] = item;
            }
        }

        private static void IndexByStringId(List<JsonElement> items, Dictionary<string, JsonElement> target)
        {
            foreach (var item in items)
            {
                if (item.TryGetProperty("id", out var idEl))
                {
                    var idStr = idEl.GetString();
                    if (idStr != null) target[idStr] = item;
                }
            }
        }

        private static void IndexByProperty(List<JsonElement> items, Dictionary<string, JsonElement> target, string propName)
        {
            foreach (var item in items)
            {
                if (item.TryGetProperty(propName, out var propEl))
                {
                    var val = propEl.GetString();
                    if (val != null) target[val] = item;
                }
            }
        }

        private static void LoadCoriolis()
        {
            if (_dataPath == null) return;

            try { LoadCoriolisShips(); }
            catch (Exception ex) { Debug.WriteLine($"DataProvider: Failed to load Coriolis ships: {ex.Message}"); }

            try { LoadCoriolisModules(); }
            catch (Exception ex) { Debug.WriteLine($"DataProvider: Failed to load Coriolis modules: {ex.Message}"); }

            try { LoadCoriolisModifications(); }
            catch (Exception ex) { Debug.WriteLine($"DataProvider: Failed to load Coriolis modifications: {ex.Message}"); }
        }

        private static void LoadCoriolisShips()
        {
            var shipsDir = Path.Combine(_dataPath!, "coriolis", "ships");
            if (!Directory.Exists(shipsDir)) return;

            foreach (var f in Directory.GetFiles(shipsDir, "*.json"))
            {
                try
                {
                    var json = File.ReadAllText(f);
                    var ship = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);
                    if (ship == null) continue;

                    foreach (var kv in ship)
                    {
                        CoriolisShips[kv.Key] = kv.Value;
                        if (kv.Value.TryGetProperty("edID", out var edIdEl) && edIdEl.TryGetInt64(out var edId))
                            CoriolisShipsByEdId[edId] = kv.Value;
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"DataProvider: Failed to load ship {f}: {ex.Message}");
                }
            }
        }

        private static void LoadCoriolisModules()
        {
            var modulesDir = Path.Combine(_dataPath!, "coriolis", "modules");
            if (!Directory.Exists(modulesDir)) return;

            LoadModuleDir(Path.Combine(modulesDir, "hardpoints"), HardpointModules, HardpointModulesByEdId);
            LoadModuleDir(Path.Combine(modulesDir, "internal"), InternalModules, InternalModulesByEdId);
            LoadModuleDir(Path.Combine(modulesDir, "standard"), StandardModules, StandardModulesByEdId);

            AllModulesByEdId = new Dictionary<long, JsonElement>();
            foreach (var kv in HardpointModulesByEdId) AllModulesByEdId[kv.Key] = kv.Value;
            foreach (var kv in InternalModulesByEdId) AllModulesByEdId[kv.Key] = kv.Value;
            foreach (var kv in StandardModulesByEdId) AllModulesByEdId[kv.Key] = kv.Value;
        }

        private static void LoadModuleDir(string dir, List<JsonElement> list, Dictionary<long, JsonElement> byId)
        {
            if (!Directory.Exists(dir)) return;

            foreach (var f in Directory.GetFiles(dir, "*.json"))
            {
                try
                {
                    var json = File.ReadAllText(f);
                    var doc = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);
                    if (doc == null) continue;

                    foreach (var kv in doc)
                    {
                        if (kv.Value.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var item in kv.Value.EnumerateArray())
                            {
                                list.Add(item);
                                if (item.TryGetProperty("edID", out var idEl) && idEl.TryGetInt64(out var id))
                                    byId[id] = item;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"DataProvider: Failed to load modules from {f}: {ex.Message}");
                }
            }
        }

        private static void LoadCoriolisModifications()
        {
            var modDir = Path.Combine(_dataPath!, "coriolis", "modifications");
            if (!Directory.Exists(modDir)) return;

            Blueprints = LoadJsonElement(Path.Combine(modDir, "blueprints.json"));
            Modifications = LoadJsonElement(Path.Combine(modDir, "modifications.json"));
            ModifierActions = LoadJsonElement(Path.Combine(modDir, "modifierActions.json"));
            Specials = LoadJsonElement(Path.Combine(modDir, "specials.json"));
            ModuleBlueprintMap = LoadJsonElement(Path.Combine(modDir, "modules.json"));
        }

        private static JsonElement LoadJsonElement(string path)
        {
            try
            {
                if (File.Exists(path))
                    return JsonSerializer.Deserialize<JsonElement>(File.ReadAllText(path));
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"DataProvider: Failed to load JSON from {path}: {ex.Message}");
            }
            return default;
        }

        /// <summary>Get module data by edId, or null if not found.</summary>
        public static JsonElement? GetModuleByEdId(long edId)
            => AllModulesByEdId.TryGetValue(edId, out var m) ? m : null;

        /// <summary>Get ship data by edId, or null if not found.</summary>
        public static JsonElement? GetShipByEdId(long edId)
            => CoriolisShipsByEdId.TryGetValue(edId, out var s) ? s : null;

        /// <summary>Get commodity data by symbol, or null if not found.</summary>
        public static JsonElement? GetCommodityBySymbol(string symbol)
            => CommoditiesBySymbol.TryGetValue(symbol, out var c) ? c : null;

        /// <summary>Get engineer data by edId, or null if not found.</summary>
        public static JsonElement? GetEngineerByEdId(long edId)
            => EngineersById.TryGetValue(edId, out var e) ? e : null;
    }
}
