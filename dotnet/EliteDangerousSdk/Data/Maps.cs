using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace EliteDangerousSdk.Data
{
    public static class ShipNameMap
    {
        private static readonly Dictionary<string, string> _map = new(StringComparer.OrdinalIgnoreCase)
        {
            ["adder"] = "Adder",
            ["alliance_challenger"] = "Alliance Challenger",
            ["alliance_chieftain"] = "Alliance Chieftain",
            ["alliance_crusader"] = "Alliance Crusader",
            ["anaconda"] = "Anaconda",
            ["asp"] = "Asp Explorer",
            ["asp_scout"] = "Asp Scout",
            ["belugaLiner"] = "Beluga Liner",
            ["cobramkiii"] = "Cobra MkIII",
            ["cobramkiv"] = "Cobra MkIV",
            ["cobramkv"] = "Cobra MkV",
            ["diamondback"] = "Diamondback Scout",
            ["diamondbackxl"] = "Diamondback Explorer",
            ["dolphin"] = "Dolphin",
            ["eagle"] = "Eagle",
            ["empire_courier"] = "Imperial Courier",
            ["empire_eagle"] = "Imperial Eagle",
            ["empire_fighter"] = "Imperial Fighter",
            ["empire_trader"] = "Imperial Clipper",
            ["empire_capital_ship"] = "Imperial Cutter",
            ["federation_corvette"] = "Federal Corvette",
            ["federation_dropship"] = "Federal Dropship",
            ["federation_gunship"] = "Federal Gunship",
            ["federation_assault_ship"] = "Federal Assault Ship",
            ["federation_fighter"] = "Federation Fighter",
            ["ferdelance"] = "Fer-de-Lance",
            ["hauler"] = "Hauler",
            ["independant_trader"] = "Keelback",
            ["krait_mkii"] = "Krait MkII",
            ["krait_phantom"] = "Krait Phantom",
            ["mamba"] = "Mamba",
            ["orca"] = "Orca",
            ["panther"] = "Panther Clipper",
            ["python"] = "Python",
            ["python_nx"] = "Python NX",
            ["scout"] = "Taipan Fighter",
            ["sidewinder"] = "Sidewinder",
            ["testbuggy"] = "SRV Scarab",
            ["testbuggy2"] = "SRV Scorpion",
            ["type6"] = "Type-6 Transporter",
            ["type7"] = "Type-7 Transport",
            ["type8"] = "Type-8 Transport",
            ["type9"] = "Type-9 Heavy",
            ["typex"] = "Type-10 Defender",
            ["typex_3"] = "Type-10 Defender",
            ["viper"] = "Viper MkIII",
            ["viper_mkiv"] = "Viper MkIV",
            ["vulture"] = "Vulture",
            ["mandalay"] = "Mandalay",
            ["explorer_nx"] = "Explorer NX",
            ["kestrel"] = "Kestrel",
            ["type_10_defender"] = "Type-10 Defender",
            ["type_6_transporter"] = "Type-6 Transporter",
            ["type_7_transport"] = "Type-7 Transport",
            ["type_8_transport"] = "Type-8 Transport",
            ["type_9_heavy"] = "Type-9 Heavy",
            ["fer_de_lance"] = "Fer-de-Lance",
            ["asp_explorer"] = "Asp Explorer",
            ["panther_clipper"] = "Panther Clipper",
            ["diamondback_explorer"] = "Diamondback Explorer",
            ["diamondback_scout"] = "Diamondback Scout",
            ["cobra_mkiii"] = "Cobra MkIII",
            ["cobra_mkiv"] = "Cobra MkIV",
            ["cobra_mk_v"] = "Cobra MkV",
            ["beluga"] = "Beluga Liner",
            ["federal_assault_ship"] = "Federal Assault Ship",
            ["imperial_cutter"] = "Imperial Cutter",
            ["imperial_clipper"] = "Imperial Clipper",
            ["imperial_courier"] = "Imperial Courier",
            ["imperial_eagle"] = "Imperial Eagle",
            ["imperial_corsair"] = "Imperial Corsair",
        };

        public static string GetDisplayName(string shipId)
        {
            return _map.TryGetValue(shipId, out var name) ? name : shipId;
        }
    }

    public static class OutfittingMaps
    {
        public static readonly Dictionary<string, string> CategoryMap = new()
        {
            ["Weapon"] = "Hardpoint",
            ["Utility"] = "Utility",
            ["Armour"] = "Bulkhead",
            ["PowerPlant"] = "Power Plant",
            ["MainEngines"] = "Thrusters",
            ["FrameShiftDrive"] = "Frame Shift Drive",
            ["LifeSupport"] = "Life Support",
            ["PowerDistributor"] = "Power Distributor",
            ["Radar"] = "Sensors",
            ["FuelTank"] = "Fuel Tank",
            ["Standard"] = "Standard",
            ["Internal"] = "Internal",
        };

        public static readonly Dictionary<string, string> SlotNameMap = new()
        {
            ["Standard"] = "Standard",
            ["Hardpoint"] = "Hardpoint",
            ["Utility"] = "Utility",
            ["Internal"] = "Internal",
            ["Military"] = "Military",
            ["PlanetaryApproachSuite"] = "Planetary Approach Suite",
            ["VehicleHangar"] = "Vehicle Hangar",
            ["FighterHangar"] = "Fighter Hangar",
        };

        public static readonly Dictionary<string, string> WeaponMountMap = new()
        {
            ["Fixed"] = "Fixed",
            ["Gimbal"] = "Gimballed",
            ["Turret"] = "Turret",
        };
    }

    public static class EdshipyardSlotMap
    {
        public static readonly Dictionary<string, string> Map = new()
        {
            ["bh"] = "Bulkheads",
            ["hp"] = "Hardpoints",
            ["ut"] = "Utility",
            ["sg"] = "Shield Generator",
            ["pp"] = "Power Plant",
            ["th"] = "Thrusters",
            ["fsd"] = "Frame Shift Drive",
            ["ls"] = "Life Support",
            ["pd"] = "Power Distributor",
            ["sn"] = "Sensors",
            ["ft"] = "Fuel Tank",
            ["hr"] = "Hull Reinforcement",
            ["mrp"] = "Module Reinforcement",
            ["scb"] = "Shield Cell Bank",
            ["gsrp"] = "Guardian Shield Reinforcement",
            ["gmrp"] = "Guardian Module Reinforcement",
            ["ghrp"] = "Guardian Hull Reinforcement",
            ["afmu"] = "Auto Field-Maintenance Unit",
            ["fuel"] = "Fuel Scoop",
            ["pas"] = "Planetary Approach Suite",
            ["v1"] = "Vehicle Hangar",
            ["figh"] = "Fighter Hangar",
            ["dc"] = "Docking Computer",
            ["sax"] = "Supercruise Assist",
            ["detail"] = "Surface Scanner",
            ["cargo"] = "Cargo Rack",
            ["cr"] = "Cargo Rack",
            ["hbl"] = "Hatch Breaker Limpet",
            ["col"] = "Collector Limpet",
            ["pros"] = "Prospector Limpet",
            ["fsdi"] = "Frame Shift Drive Interdictor",
            ["fueltr"] = "Fuel Transfer Limpet",
            ["repr"] = "Repair Limpet",
            ["decon"] = "Decontamination Limpet",
            ["recon"] = "Recon Limpet",
            ["research"] = "Research Limpet",
            ["multi"] = "Multi Limpet",
            ["mahr"] = "Military Armour",
            ["ref"] = "Refinery",
            ["psg"] = "Prismatic Shield Generator",
            ["bsg"] = "Bi-Weave Shield Generator",
            ["pc"] = "Passenger Cabin",
            ["ews"] = "Experimental Weapon Stabilizer",
            ["gfsb"] = "Guardian FSD Booster",
        };
    }

    public static class ModuleDisplay
    {
        public static string GetDisplayName(long edId)
        {
            if (!DataProvider.AllModulesByEdId.TryGetValue(edId, out var module))
                return "";
            if (module.TryGetProperty("name", out var nameProp) && nameProp.ValueKind == System.Text.Json.JsonValueKind.String)
                return nameProp.GetString() ?? "";
            if (module.TryGetProperty("symbol", out var symProp) && symProp.ValueKind == System.Text.Json.JsonValueKind.String)
            {
                var parsed = ModuleSymbolParser.Parse(symProp.GetString() ?? "");
                return parsed.TryGetValue("name", out var n) ? n?.ToString() ?? "" : "";
            }
            return "";
        }
    }

    public static class ModuleSymbolParser
    {
        private static readonly Regex WeaponMountRe = new(@"^Hpt_([A-Za-z]+)_([A-Za-z]+)_([A-Za-z]+)_([A-Za-z]+)$");
        private static readonly Regex WeaponRe = new(@"^Hpt_([A-Za-z]+)_([A-Za-z]+)_([A-Za-z]+)$");
        private static readonly Regex InternalRe = new(@"^Int_([A-Za-z]+)_Size(\d+)_Class(\d+)$");
        private static readonly Regex StandardRe = new(@"^([A-Za-z]+)_Size(\d+)_Class(\d+)$");
        private static readonly Regex UtilityRe = new(@"^Hpt_([A-Za-z]+)_Size(\d+)_Class(\d+)$");

        private static string SplitCamel(string name)
        {
            return Regex.Replace(name, "([a-z])([A-Z])", "$1 $2");
        }

        public static Dictionary<string, object?> Parse(string symbol)
        {
            var result = new Dictionary<string, object?>
            {
                ["symbol"] = symbol,
                ["category"] = "",
                ["name"] = symbol
            };

            var m = InternalRe.Match(symbol);
            if (m.Success)
            {
                result["category"] = m.Groups[1].Value;
                result["name"] = SplitCamel(m.Groups[1].Value);
                result["class"] = int.Parse(m.Groups[2].Value);
                var rc = int.Parse(m.Groups[3].Value);
                result["rating"] = new[] { "E", "D", "C", "B", "A" }[Math.Clamp(rc - 1, 0, 4)];
                return result;
            }

            m = StandardRe.Match(symbol);
            if (m.Success)
            {
                result["category"] = m.Groups[1].Value;
                result["name"] = SplitCamel(m.Groups[1].Value);
                result["class"] = int.Parse(m.Groups[2].Value);
                var rc = int.Parse(m.Groups[3].Value);
                result["rating"] = new[] { "E", "D", "C", "B", "A" }[Math.Clamp(rc - 1, 0, 4)];
                return result;
            }

            m = WeaponMountRe.Match(symbol);
            if (m.Success)
            {
                result["category"] = SplitCamel(m.Groups[1].Value);
                result["name"] = SplitCamel(m.Groups[2].Value);
                OutfittingMaps.WeaponMountMap.TryGetValue(m.Groups[3].Value, out var mount);
                result["mount"] = mount ?? m.Groups[3].Value;
                var clsMap = new Dictionary<string, int> { ["Small"] = 1, ["Medium"] = 2, ["Large"] = 3, ["Huge"] = 4 };
                clsMap.TryGetValue(m.Groups[4].Value, out var cls);
                result["class"] = cls > 0 ? cls : null;
                return result;
            }

            m = WeaponRe.Match(symbol);
            if (m.Success)
            {
                result["category"] = SplitCamel(m.Groups[1].Value);
                result["name"] = SplitCamel(m.Groups[2].Value);
                var clsMap = new Dictionary<string, int> { ["Small"] = 1, ["Medium"] = 2, ["Large"] = 3, ["Huge"] = 4 };
                clsMap.TryGetValue(m.Groups[3].Value, out var cls);
                result["class"] = cls > 0 ? cls : null;
                return result;
            }

            m = UtilityRe.Match(symbol);
            if (m.Success)
            {
                result["category"] = SplitCamel(m.Groups[1].Value);
                result["name"] = SplitCamel(m.Groups[1].Value);
                result["class"] = int.Parse(m.Groups[2].Value);
                var rc = int.Parse(m.Groups[3].Value);
                result["rating"] = new[] { "E", "D", "C", "B", "A" }[Math.Clamp(rc - 1, 0, 4)];
                return result;
            }

            return result;
        }
    }
}
