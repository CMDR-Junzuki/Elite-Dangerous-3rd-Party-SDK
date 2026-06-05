using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Planner
{
    public class EngineerInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Location { get; set; }
        public string? System { get; set; }
        public string? Station { get; set; }

        public string[]? UnlockRequirements { get; set; }
    }

    public static class Engineers
    {
        private static readonly Dictionary<string, string> EngineerTypes = new()
        {
            ["Felicity Farseer"] = "ship", ["Elvira Martuuk"] = "ship",
            ["The Dweller"] = "ship", ["Liz Ryder"] = "ship",
            ["Tod McQuinn"] = "ship", ["Selene Jean"] = "ship",
            ["Lei Cheung"] = "ship", ["Hera Tani"] = "ship",
            ["Juri Ishmaak"] = "ship", ["Colonel Bris Dekker"] = "ship",
            ["Didi Vatermann"] = "ship", ["Bill Turner"] = "ship",
            ["Broo Tarquin"] = "ship", ["Lori Jameson"] = "ship",
            ["Tiana Fortune"] = "ship", ["Marco Qwent"] = "ship",
            ["Ram Tah"] = "ship", ["Professor Palin"] = "ship",
            ["Chloe Sedesi"] = "ship", ["Zacariah Nemo"] = "ship",
            ["Petra Olmanova"] = "ship", ["Marsha Hicks"] = "ship",
            ["Mel Brandon"] = "ship", ["Etienne Dorn"] = "ship",
            ["The Sarge"] = "ship",
            ["Domino Green"] = "on-foot", ["Hero Ferrari"] = "on-foot",
            ["Jude Navarro"] = "on-foot", ["Kit Fowler"] = "on-foot",
            ["Oden Geiger"] = "on-foot", ["Terra Velasquez"] = "on-foot",
            ["Uma Laszlo"] = "on-foot", ["Wellington Beck"] = "on-foot",
            ["Yarden Bond"] = "on-foot", ["Baltanos"] = "on-foot",
            ["Eleanor Bresa"] = "on-foot", ["Rosa Dayette"] = "on-foot",
            ["Yi Shen"] = "on-foot",
        };

        private static readonly Dictionary<string, string[]> UnlockReqs = new()
        {
            ["Felicity Farseer"] = new[] { "Invite: Exploration rank Scout or higher", "Unlock: Meta-Alloys x1", "Deciat / 6 a / Farseer Inc" },
            ["Elvira Martuuk"] = new[] { "Invite: Travel 300 ly from start", "Unlock: Soontill Relics x3", "Khun / 5 / Long Sight Base" },
            ["The Dweller"] = new[] { "Invite: 5 Black Markets", "Unlock: Pay 500,000 CR", "Wyrd / A 2 / Black Hide" },
            ["Liz Ryder"] = new[] { "Invite: Cordial with Eurybia Blue Mafia + mission", "Unlock: Landmines x200", "Eurybia / Makalu / Demolition Unlimited" },
            ["Tod McQuinn"] = new[] { "Invite: 15 bounty vouchers", "Unlock: 100,000 CR bounty vouchers", "Wolf 397 / Trus Madi / Trophy Camp" },
            ["Selene Jean"] = new[] { "Invite: Mine 500 tons of ore", "Unlock: Painite x10", "Kuk / B 3 / Prospector's Rest" },
            ["Lei Cheung"] = new[] { "Invite: Trade with 50 markets", "Unlock: Gold x200", "Laksak / A 1 / Trader's Rest" },
            ["Hera Tani"] = new[] { "Invite: Imperial Navy Outsider+", "Unlock: Kamitra Cigars x50", "Kuwemaki / A 3 a / The Jet's Hole" },
            ["Juri Ishmaak"] = new[] { "Invite: 50 combat bonds", "Unlock: 100,000 CR combat bonds", "Giryak / 2 a / Pater's Memorial" },
            ["Colonel Bris Dekker"] = new[] { "Invite: Friendly with Federation", "Unlock: 1,000,000 CR combat bonds", "Sol / Iapetus / Dekker's Yard (permit)" },
            ["Didi Vatermann"] = new[] { "Invite: Trade rank Merchant+", "Unlock: Lavian Brandy x50", "Leesti / 1 a / Vatermann LLC" },
            ["Bill Turner"] = new[] { "Invite: Friendly with Alliance", "Unlock: Bromellite x50", "Alioth / 4 a / Turner Metallics Inc (permit)" },
            ["Broo Tarquin"] = new[] { "Invite: Combat rank Competent+", "Unlock: Fujin Tea x50", "Muang / 5 a / Broo's Legacy" },
            ["Lori Jameson"] = new[] { "Invite: Combat rank Dangerous+", "Unlock: Konnga Ale x25", "Shinrarta Dezhra / A 1 / Jameson Base (permit)" },
            ["Tiana Fortune"] = new[] { "Invite: Friendly with Empire", "Unlock: Decoded Emission Data x50", "Achenar / 4 a / Fortune's Loss (permit)" },
            ["Marco Qwent"] = new[] { "Invite: Ally with Sirius Corp", "Unlock: Modular Terminals x25", "Sirius / Lucifer / Qwent Research Base (permit)" },
            ["Ram Tah"] = new[] { "Invite: Explorer rank Surveyor+", "Unlock: Classified Scan Databanks x50", "Meene / AB 5 d / Phoenix Base" },
            ["Professor Palin"] = new[] { "Invite: Travel 5,000 ly", "Unlock: Sensor Fragments x25", "Arque / 4 e / Abel Laboratory" },
            ["Chloe Sedesi"] = new[] { "Invite: Travel 5,000 ly", "Unlock: Sensor Fragments x25", "Shenve / A 6 / Cinder Dock" },
            ["Zacariah Nemo"] = new[] { "Invite: Friendly with Party of Yoru", "Unlock: Xihe Biomorphic Companions x25", "Yoru / 4 / Nemo Cyber Party Base" },
            ["Petra Olmanova"] = new[] { "Invite: Combat rank Expert+", "Unlock: Progenitor Cells x200", "Asura / 1 a / Sanctuary" },
            ["Marsha Hicks"] = new[] { "Invite: Explorer rank Surveyor+", "Unlock: Osmium x10", "Tir / A 2 / The Watchtower" },
            ["Mel Brandon"] = new[] { "Invite: Friendly with Colonia Council", "Unlock: 100,000 CR bounty vouchers", "Luchtaine / A 1 c / The Brig" },
            ["Etienne Dorn"] = new[] { "Invite: Trade rank Dealer+", "Unlock: Occupied Escape Pods x25", "Los / A 2 b / Kraken's Retreat" },
            ["The Sarge"] = new[] { "Invite: Federal Navy Midshipman+", "Unlock: Aberrant Shield Pattern Analysis x50", "Beta-3 Tucani / 2 b a / The Beach" },
            ["Domino Green"] = new[] { "Invite: 100 ly in Apex shuttles", "Unlock: Push x5", "Orishis / 4 / The Jackrabbit" },
            ["Hero Ferrari"] = new[] { "Invite: 10 Conflict Zones", "Unlock: Settlement Defence Plans x5", "Siris / 5 c / Nevermore Terrace" },
            ["Jude Navarro"] = new[] { "Invite: 10 Restore missions", "Unlock: Genetic Repair Meds x5", "Aurai / 1 a / Marshall's Drift" },
            ["Kit Fowler"] = new[] { "Invite: Sell 5 Opinion Polls to bartenders", "Unlock: Surveillance Equipment x5", "Capoya / 2 / The Last Call" },
            ["Oden Geiger"] = new[] { "Invite: Sell 20 bio data to bartenders", "Unlock: None (referral suffices)", "Candiaei / 9 c / Ankh's Promise" },
            ["Terra Velasquez"] = new[] { "Invite: 6 Covert missions", "Unlock: Financial Projections x15", "Shou Xing / 1 / Rascal's Choice" },
            ["Uma Laszlo"] = new[] { "Invite: Unfriendly with Sirius Corp", "Unlock: None (referral suffices)", "Xuane / A 3 / Laszlo's Resolve" },
            ["Wellington Beck"] = new[] { "Invite: Sell 15 entertainment media", "Unlock: InSight Entertainment Suites x5", "Jolapa / 6 a / Beck Facility" },
            ["Yarden Bond"] = new[] { "Invite: Sell 5 Smear Campaign Plans", "Unlock: None (referral suffices)", "Bayan / 7 b / Salamander Bank" },
            ["Baltanos"] = new[] { "Invite: Friendly with Colonia Council", "Unlock: Faction Associates x10", "Deriso / 3 a / The Divine Apparatus" },
            ["Eleanor Bresa"] = new[] { "Invite: Visit 5 Colonia settlements", "Unlock: Digital Designs x10", "Desy / 7 a / Bresa Modifications" },
            ["Rosa Dayette"] = new[] { "Invite: Sell 10 recipes to Colonia bartenders", "Unlock: Manufacturing Instructions x10", "Kojeara / 4 b / Rosa's Shop" },
            ["Yi Shen"] = new[] { "Invite: All Baltanos/Eleanor/Rosa tasks", "Unlock: None (referral suffices)", "Einheriar / 1 a / Eidolon Hold" },
        };

        private static readonly string[] EngineerNames = new[]
        {
            "Felicity Farseer", "Elvira Martuuk", "The Dweller", "Liz Ryder",
            "Tod McQuinn", "Selene Jean", "Lei Cheung", "Hera Tani",
            "Juri Ishmaak", "Colonel Bris Dekker", "Didi Vatermann",
            "Bill Turner", "Broo Tarquin", "Lori Jameson", "Tiana Fortune",
            "Marco Qwent", "Ram Tah", "Professor Palin", "Chloe Sedesi",
            "Zacariah Nemo", "Petra Olmanova", "Marsha Hicks", "Mel Brandon",
            "Etienne Dorn", "The Sarge",
            "Domino Green", "Hero Ferrari", "Jude Navarro", "Kit Fowler",
            "Oden Geiger", "Terra Velasquez", "Uma Laszlo", "Wellington Beck",
            "Yarden Bond", "Baltanos", "Eleanor Bresa", "Rosa Dayette", "Yi Shen",
        };

        public static List<EngineerInfo> GetAll()
        {
            return EngineerNames.Select((name, i) => new EngineerInfo
            {
                Id = i + 1,
                Name = name,
                UnlockRequirements = UnlockReqs.GetValueOrDefault(name),
            }).ToList();
        }

        public static EngineerInfo? Find(string name)
        {
            return GetAll().FirstOrDefault(e =>
                e.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
        }

        public static string[] GetUnlockRequirements(string name)
        {
            return UnlockReqs.GetValueOrDefault(name, Array.Empty<string>());
        }

        public static string[] GetByType(string type)
        {
            return EngineerTypes
                .Where(kv => kv.Value == type)
                .Select(kv => kv.Key)
                .ToArray();
        }

        public static (EngineerInfo Engineer, string[] Grades, double Progress) EstimateProgress(string name, int currentGrade)
        {
            var eng = Find(name) ?? new EngineerInfo { Id = 0, Name = name };
            var grades = new[] { "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5" };
            return (eng, grades, currentGrade / 5.0);
        }
    }
}
