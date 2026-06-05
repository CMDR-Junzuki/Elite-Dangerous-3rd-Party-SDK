namespace EliteDangerousSdk.Data;

public static class OnFootEngineeringData
{
    public static readonly Dictionary<string, SuitBaseStats> SuitBaseStats = new()
    {
        ["dominator"] = new SuitBaseStats
        {
            SuitType = "dominator", Manufacturer = "Manticore", Cost = 150_000,
            Shield = 15.0, ShieldRegen = 1.1, Battery = 10, Health = 30, Mass = 100,
            EmergencyAir = 60, GoodsCapacity = 10, AssetsCapacity = 20, DataCapacity = 10,
            WeaponSlots = new() { ["primary"] = 2, ["secondary"] = 1 },
            ConsumableSlots = new() { ["energyCell"] = 2, ["eBreach"] = 1, ["medkit"] = 2, ["fragGrenade"] = 3, ["shieldDisruptor"] = 3, ["shieldProjector"] = 2 },
            Resistance = new() { ["kinetic"] = -0.5, ["thermal"] = 0.6, ["plasma"] = 0, ["explosive"] = 0 },
        },
        ["maverick"] = new SuitBaseStats
        {
            SuitType = "maverick", Manufacturer = "Remlok", Cost = 150_000,
            Shield = 13.5, ShieldRegen = 0.99, Battery = 13.5, Health = 30, Mass = 100,
            EmergencyAir = 60, GoodsCapacity = 40, AssetsCapacity = 60, DataCapacity = 20,
            WeaponSlots = new() { ["primary"] = 1, ["secondary"] = 1 },
            ConsumableSlots = new() { ["energyCell"] = 2, ["eBreach"] = 2, ["medkit"] = 1, ["fragGrenade"] = 2, ["shieldDisruptor"] = 1, ["shieldProjector"] = 1 },
            Resistance = new() { ["kinetic"] = -0.6, ["thermal"] = 0.5, ["plasma"] = -0.1, ["explosive"] = 0 },
        },
        ["artemis"] = new SuitBaseStats
        {
            SuitType = "artemis", Manufacturer = "Supratech", Cost = 150_000,
            Shield = 12.0, ShieldRegen = 0.88, Battery = 17, Health = 30, Mass = 100,
            EmergencyAir = 60, GoodsCapacity = 20, AssetsCapacity = 40, DataCapacity = 10,
            WeaponSlots = new() { ["primary"] = 1, ["secondary"] = 1 },
            ConsumableSlots = new() { ["energyCell"] = 3, ["eBreach"] = 1, ["medkit"] = 1, ["fragGrenade"] = 1, ["shieldDisruptor"] = 1, ["shieldProjector"] = 1 },
            Resistance = new() { ["kinetic"] = -0.7, ["thermal"] = 0.39, ["plasma"] = -0.2, ["explosive"] = 0 },
        },
    };

    public static readonly Dictionary<string, WeaponBaseStats> WeaponBaseStats = new()
    {
        ["Karma C-44"] = new() { Name = "Karma C-44", Manufacturer = "kinematic", Category = "kinetic", Size = "primary", FireMode = "automatic", Cost = 50_000, Dps = 8.0, HeadshotMultiplier = 2.0, EffectiveRange = 25, MagazineSize = 60, ReserveAmmo = 360, ReloadTime = 2.5, ProjectileSpeed = 1 },
        ["Karma AR-50"] = new() { Name = "Karma AR-50", Manufacturer = "kinematic", Category = "kinetic", Size = "primary", FireMode = "automatic", Cost = 100_000, Dps = 9.0, HeadshotMultiplier = 2.0, EffectiveRange = 50, MagazineSize = 40, ReserveAmmo = 200, ReloadTime = 2.5, ProjectileSpeed = 1 },
        ["Karma P-15"] = new() { Name = "Karma P-15", Manufacturer = "kinematic", Category = "kinetic", Size = "secondary", FireMode = "semi-auto", Cost = 75_000, Dps = 13.8, HeadshotMultiplier = 2.0, EffectiveRange = 25, MagazineSize = 24, ReserveAmmo = 240, ReloadTime = 1.5, ProjectileSpeed = 1 },
        ["Karma L-6"] = new() { Name = "Karma L-6", Manufacturer = "kinematic", Category = "explosive", Size = "primary", FireMode = "burst", Cost = 175_000, Dps = 44.4, HeadshotMultiplier = 1.0, EffectiveRange = 300, MagazineSize = 2, ReserveAmmo = 8, ReloadTime = 4.5, ProjectileSpeed = 0.6 },
        ["TK Aphelion"] = new() { Name = "TK Aphelion", Manufacturer = "takada", Category = "thermal", Size = "primary", FireMode = "automatic", Cost = 100_000, Dps = 9.1, HeadshotMultiplier = 1.0, EffectiveRange = 70, MagazineSize = 25, ReserveAmmo = 150, ReloadTime = 2.5, ProjectileSpeed = 0 },
        ["TK Eclipse"] = new() { Name = "TK Eclipse", Manufacturer = "takada", Category = "thermal", Size = "primary", FireMode = "automatic", Cost = 50_000, Dps = 9.0, HeadshotMultiplier = 1.0, EffectiveRange = 25, MagazineSize = 40, ReserveAmmo = 280, ReloadTime = 2.0, ProjectileSpeed = 0 },
        ["TK Zenith"] = new() { Name = "TK Zenith", Manufacturer = "takada", Category = "thermal", Size = "secondary", FireMode = "burst", Cost = 75_000, Dps = 9.7, HeadshotMultiplier = 1.0, EffectiveRange = 35, MagazineSize = 18, ReserveAmmo = 90, ReloadTime = 1.5, ProjectileSpeed = 0 },
        ["Manticore Executioner"] = new() { Name = "Manticore Executioner", Manufacturer = "manticore", Category = "plasma", Size = "primary", FireMode = "semi-auto", Cost = 175_000, Dps = 12.5, HeadshotMultiplier = 3.0, EffectiveRange = 100, MagazineSize = 3, ReserveAmmo = 30, ReloadTime = 3.0, ProjectileSpeed = 0.5 },
        ["Manticore Intimidator"] = new() { Name = "Manticore Intimidator", Manufacturer = "manticore", Category = "plasma", Size = "primary", FireMode = "semi-auto", Cost = 100_000, Dps = 21.9, HeadshotMultiplier = 1.5, EffectiveRange = 7, MagazineSize = 2, ReserveAmmo = 24, ReloadTime = 3.0, ProjectileSpeed = 0.5 },
        ["Manticore Oppressor"] = new() { Name = "Manticore Oppressor", Manufacturer = "manticore", Category = "plasma", Size = "primary", FireMode = "automatic", Cost = 125_000, Dps = 5.63, HeadshotMultiplier = 1.5, EffectiveRange = 35, MagazineSize = 50, ReserveAmmo = 300, ReloadTime = 2.5, ProjectileSpeed = 0.5 },
        ["Manticore Tormentor"] = new() { Name = "Manticore Tormentor", Manufacturer = "manticore", Category = "plasma", Size = "secondary", FireMode = "semi-auto", Cost = 50_000, Dps = 12.75, HeadshotMultiplier = 2.0, EffectiveRange = 15, MagazineSize = 6, ReserveAmmo = 72, ReloadTime = 2.0, ProjectileSpeed = 0.5 },
    };

    public static readonly Dictionary<string, Dictionary<string, Dictionary<string, int>>> SuitUpgradeCosts = new()
    {
        ["dominator"] = new()
        {
            ["g2"] = new() { ["Suit Schematic"] = 1, ["Health Monitor"] = 1, ["Power Regulator"] = 1, ["Manufacturing Instructions"] = 1, ["Titanium Plating"] = 5, ["Graphene"] = 5 },
            ["g3"] = new() { ["Suit Schematic"] = 5, ["Health Monitor"] = 5, ["Power Regulator"] = 5, ["Manufacturing Instructions"] = 5, ["Titanium Plating"] = 15, ["Graphene"] = 15 },
            ["g4"] = new() { ["Suit Schematic"] = 10, ["Health Monitor"] = 10, ["Power Regulator"] = 10, ["Manufacturing Instructions"] = 10, ["Titanium Plating"] = 25, ["Graphene"] = 25 },
            ["g5"] = new() { ["Suit Schematic"] = 15, ["Health Monitor"] = 15, ["Power Regulator"] = 15, ["Manufacturing Instructions"] = 15, ["Titanium Plating"] = 35, ["Graphene"] = 35 },
        },
        ["maverick"] = new()
        {
            ["g2"] = new() { ["Suit Schematic"] = 1, ["Health Monitor"] = 1, ["Power Regulator"] = 1, ["Manufacturing Instructions"] = 1, ["Carbon Fibre Plating"] = 5, ["Graphene"] = 5 },
            ["g3"] = new() { ["Suit Schematic"] = 5, ["Health Monitor"] = 5, ["Power Regulator"] = 5, ["Manufacturing Instructions"] = 5, ["Carbon Fibre Plating"] = 15, ["Graphene"] = 15 },
            ["g4"] = new() { ["Suit Schematic"] = 10, ["Health Monitor"] = 10, ["Power Regulator"] = 10, ["Manufacturing Instructions"] = 10, ["Carbon Fibre Plating"] = 25, ["Graphene"] = 25 },
            ["g5"] = new() { ["Suit Schematic"] = 15, ["Health Monitor"] = 15, ["Power Regulator"] = 15, ["Manufacturing Instructions"] = 15, ["Carbon Fibre Plating"] = 35, ["Graphene"] = 35 },
        },
        ["artemis"] = new()
        {
            ["g2"] = new() { ["Suit Schematic"] = 1, ["Health Monitor"] = 1, ["Power Regulator"] = 1, ["Manufacturing Instructions"] = 1, ["Aerogel"] = 5, ["Graphene"] = 5 },
            ["g3"] = new() { ["Suit Schematic"] = 5, ["Health Monitor"] = 5, ["Power Regulator"] = 5, ["Manufacturing Instructions"] = 5, ["Aerogel"] = 15, ["Graphene"] = 15 },
            ["g4"] = new() { ["Suit Schematic"] = 10, ["Health Monitor"] = 10, ["Power Regulator"] = 10, ["Manufacturing Instructions"] = 10, ["Aerogel"] = 25, ["Graphene"] = 25 },
            ["g5"] = new() { ["Suit Schematic"] = 15, ["Health Monitor"] = 15, ["Power Regulator"] = 15, ["Manufacturing Instructions"] = 15, ["Aerogel"] = 35, ["Graphene"] = 35 },
        },
    };

    public static readonly Dictionary<string, Dictionary<string, Dictionary<string, int>>> WeaponUpgradeCosts = new()
    {
        ["kinematic"] = KinematicCosts(),
        ["takada"] = TakadaCosts(),
        ["manticore"] = ManticoreCosts(),
    };

    private static Dictionary<string, Dictionary<string, int>> KinematicCosts() => new()
    {
        ["g2"] = new() { ["Weapon Schematic"] = 1, ["Compression-Liquefied Gas"] = 1, ["Manufacturing Instructions"] = 1, ["Tungsten Carbide"] = 2, ["Weapon Component"] = 2 },
        ["g3"] = new() { ["Weapon Schematic"] = 2, ["Compression-Liquefied Gas"] = 2, ["Manufacturing Instructions"] = 2, ["Tungsten Carbide"] = 5, ["Weapon Component"] = 5 },
        ["g4"] = new() { ["Weapon Schematic"] = 4, ["Compression-Liquefied Gas"] = 4, ["Manufacturing Instructions"] = 4, ["Tungsten Carbide"] = 9, ["Weapon Component"] = 9 },
        ["g5"] = new() { ["Weapon Schematic"] = 5, ["Compression-Liquefied Gas"] = 5, ["Manufacturing Instructions"] = 5, ["Tungsten Carbide"] = 12, ["Weapon Component"] = 12 },
    };

    private static Dictionary<string, Dictionary<string, int>> TakadaCosts() => new()
    {
        ["g2"] = new() { ["Weapon Schematic"] = 1, ["Ionised Gas"] = 1, ["Manufacturing Instructions"] = 1, ["Microelectrode"] = 2, ["Optical Fibre"] = 2 },
        ["g3"] = new() { ["Weapon Schematic"] = 2, ["Ionised Gas"] = 2, ["Manufacturing Instructions"] = 2, ["Microelectrode"] = 5, ["Optical Fibre"] = 5 },
        ["g4"] = new() { ["Weapon Schematic"] = 4, ["Ionised Gas"] = 4, ["Manufacturing Instructions"] = 4, ["Microelectrode"] = 9, ["Optical Fibre"] = 9 },
        ["g5"] = new() { ["Weapon Schematic"] = 5, ["Ionised Gas"] = 5, ["Manufacturing Instructions"] = 5, ["Microelectrode"] = 12, ["Optical Fibre"] = 12 },
    };

    private static Dictionary<string, Dictionary<string, int>> ManticoreCosts() => new()
    {
        ["g2"] = new() { ["Weapon Schematic"] = 1, ["Ionised Gas"] = 1, ["Manufacturing Instructions"] = 1, ["Chemical Superbase"] = 2, ["Microelectrode"] = 2 },
        ["g3"] = new() { ["Weapon Schematic"] = 2, ["Ionised Gas"] = 2, ["Manufacturing Instructions"] = 2, ["Chemical Superbase"] = 5, ["Microelectrode"] = 5 },
        ["g4"] = new() { ["Weapon Schematic"] = 4, ["Ionised Gas"] = 4, ["Manufacturing Instructions"] = 4, ["Chemical Superbase"] = 9, ["Microelectrode"] = 9 },
        ["g5"] = new() { ["Weapon Schematic"] = 5, ["Ionised Gas"] = 5, ["Manufacturing Instructions"] = 5, ["Chemical Superbase"] = 12, ["Microelectrode"] = 12 },
    };

    public static readonly Dictionary<string, OnFootModification> Modifications = new()
    {
        ["Extra Backpack Capacity"] = new() { Name = "Extra Backpack Capacity", Type = "suit", Engineers = ["Domino Green", "Rosa Dayette", "Wellington Beck"], Credits = 750_000, Materials = new() { ["Epoxy Adhesive"] = 5, ["Memory Chip"] = 3, ["Weapon Inventory"] = 5, ["Chemical Inventory"] = 5, ["Digital Designs"] = 5 }, Effects = new() { ["backpackCapacity"] = 1 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Improved Battery Capacity"] = new() { Name = "Improved Battery Capacity", Type = "suit", Engineers = ["Oden Geiger", "Rosa Dayette", "Wellington Beck"], Credits = 750_000, Materials = new() { ["Reactor Output Review"] = 5, ["Maintenance Logs"] = 8, ["Ion Battery"] = 3, ["Micro Supercapacitor"] = 5, ["Electrical Wiring"] = 5 }, Effects = new() { ["battery"] = 0.5 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Improved Jump Assist"] = new() { Name = "Improved Jump Assist", Type = "suit", Engineers = ["Hero Ferrari", "Yarden Bond", "Baltanos"], Credits = 750_000, Materials = new() { ["G-Meds"] = 5, ["Micro Thrusters"] = 3, ["Motor"] = 5, ["Topographical Surveys"] = 5 }, Effects = new() { ["jumpAssist"] = 1 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Reduced Tool Battery Consumption"] = new() { Name = "Reduced Tool Battery Consumption", Type = "suit", Engineers = ["Domino Green", "Rosa Dayette", "Wellington Beck"], Credits = 500_000, Materials = new() { ["Electrical Fuse"] = 3, ["Micro Transformer"] = 5, ["Electrical Wiring"] = 8, ["Reactor Output Review"] = 5 }, Effects = new() { ["toolEnergyDrain"] = -0.5 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Night Vision"] = new() { Name = "Night Vision", Type = "suit", Engineers = ["Oden Geiger", "Yi Shen"], Credits = 1_000_000, Materials = new() { ["Surveillance Equipment"] = 5, ["Surveillance Logs"] = 3, ["Radioactivity Data"] = 3, ["NOC Data"] = 3, ["Circuit Switch"] = 5 }, Effects = new() { ["nightVision"] = 1 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Faster Shield Regen"] = new() { Name = "Faster Shield Regen", Type = "suit", Engineers = ["Kit Fowler", "Uma Laszlo", "Eleanor Bresa"], Credits = 750_000, Materials = new() { ["Reactor Output Review"] = 5, ["Ion Battery"] = 3, ["Micro Transformer"] = 8, ["Electrical Wiring"] = 8 }, Effects = new() { ["shieldRegen"] = 0.33 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Increased Air Reserves"] = new() { Name = "Increased Air Reserves", Type = "suit", Engineers = ["Hero Ferrari", "Terra Velasquez", "Baltanos"], Credits = 750_000, Materials = new() { ["Oxygenic Bacteria"] = 5, ["PH Neutraliser"] = 8, ["Pharmaceutical Patents"] = 3, ["Air Quality Reports"] = 8 }, Effects = new() { ["emergencyAir"] = 300 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Increased Sprint Duration"] = new() { Name = "Increased Sprint Duration", Type = "suit", Engineers = ["Hero Ferrari", "Terra Velasquez", "Baltanos"], Credits = 750_000, Materials = new() { ["Oxygenic Bacteria"] = 5, ["Chemical Catalyst"] = 8, ["Troop Deployment Records"] = 3, ["Gene Sequencing Data"] = 3, ["Clinical Trial Records"] = 3 }, Effects = new() { ["sprintDuration"] = 1 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Enhanced Tracking"] = new() { Name = "Enhanced Tracking", Type = "suit", Engineers = ["Domino Green", "Oden Geiger", "Rosa Dayette"], Credits = 750_000, Materials = new() { ["Transmitter"] = 3, ["Circuit Board"] = 3, ["Topographical Surveys"] = 5, ["Stellar Activity Logs"] = 5, ["Spectral Analysis Data"] = 5 }, Effects = new() { ["scanRange"] = 100, ["scanTime"] = -1 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Added Melee Damage"] = new() { Name = "Added Melee Damage", Type = "suit", Engineers = ["Jude Navarro", "Kit Fowler", "Eleanor Bresa"], Credits = 750_000, Materials = new() { ["Epinephrine"] = 5, ["Micro Thrusters"] = 8, ["Combat Training Material"] = 5, ["Combatant Performance"] = 5 }, Effects = new() { ["meleeDamage"] = 1.5 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Combat Movement Speed"] = new() { Name = "Combat Movement Speed", Type = "suit", Engineers = ["Terra Velasquez", "Yarden Bond", "Baltanos"], Credits = 750_000, Materials = new() { ["Evacuation Protocols"] = 5, ["Genetic Research"] = 3, ["Epinephrine"] = 5, ["PH Neutraliser"] = 8 }, Effects = new() { ["combatMovementSpeed"] = 0.1 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Damage Resistance"] = new() { Name = "Damage Resistance", Type = "suit", Engineers = ["Jude Navarro", "Uma Laszlo", "Eleanor Bresa"], Credits = 750_000, Materials = new() { ["Titanium Plating"] = 3, ["Carbon Fibre Plating"] = 3, ["Epoxy Adhesive"] = 8, ["Weapon Inventory"] = 5, ["Ballistics Data"] = 5 }, Effects = new() { ["kineticResistance"] = 0.1, ["thermalResistance"] = 0.1, ["plasmaResistance"] = 0.1, ["explosiveResistance"] = 0.1 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Extra Ammo Capacity"] = new() { Name = "Extra Ammo Capacity", Type = "suit", Engineers = ["Jude Navarro", "Kit Fowler", "Eleanor Bresa"], Credits = 750_000, Materials = new() { ["Weapon Component"] = 3, ["Recycling Logs"] = 8, ["Weapon Test Data"] = 5, ["Production Reports"] = 5 }, Effects = new() { ["ammoCapacity"] = 0.5 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Quieter Footsteps"] = new() { Name = "Quieter Footsteps", Type = "suit", Engineers = ["Yarden Bond", "Yi Shen"], Credits = 1_000_000, Materials = new() { ["Settlement Assault Plans"] = 2, ["Tactical Plans"] = 5, ["Patrol Routes"] = 5, ["Micro Hydraulics"] = 3, ["Viscoelastic Polymer"] = 8 }, Effects = new() { ["footstepNoise"] = -0.5 }, CompatibleSuits = ["dominator", "maverick", "artemis"] },
        ["Audio Masking"] = new() { Name = "Audio Masking", Type = "weapon", Engineers = ["Yarden Bond", "Yi Shen"], Credits = 1_000_000, Materials = new() { ["Audio Logs"] = 3, ["Patrol Routes"] = 5, ["Scrambler"] = 5, ["Transmitter"] = 8, ["Circuit Board"] = 3 }, Effects = new() { ["audioMasking"] = 1 } },
        ["Faster Handling"] = new() { Name = "Faster Handling", Type = "weapon", Engineers = ["Hero Ferrari", "Yarden Bond", "Baltanos"], Credits = 500_000, Materials = new() { ["Viscoelastic Polymer"] = 3, ["Operational Manual"] = 5, ["Combatant Performance"] = 5, ["Combat Training Material"] = 5 }, Effects = new() { ["handlingSpeed"] = 0.3 } },
        ["Greater Range"] = new() { Name = "Greater Range", Type = "weapon", Engineers = ["Domino Green", "Rosa Dayette", "Wellington Beck"], Credits = 500_000, Materials = new(), Effects = new() { ["effectiveRange"] = 0.5 }, CompatibleManufacturers = ["kinematic", "takada", "manticore"] },
        ["Headshot Damage"] = new() { Name = "Headshot Damage", Type = "weapon", Engineers = ["Uma Laszlo", "Yi Shen"], Credits = 500_000, Materials = new(), Effects = new() { ["headshotMultiplier"] = 0.5 }, CompatibleManufacturers = ["kinematic", "takada", "manticore"] },
        ["Improved Hip Fire Accuracy"] = new() { Name = "Improved Hip Fire Accuracy", Type = "weapon", Engineers = ["Terra Velasquez", "Yarden Bond", "Baltanos"], Credits = 500_000, Materials = new(), Effects = new() { ["hipFireAccuracy"] = 0.15 }, CompatibleManufacturers = ["kinematic", "takada", "manticore"] },
        ["Magazine Size"] = new() { Name = "Magazine Size", Type = "weapon", Engineers = ["Jude Navarro", "Kit Fowler", "Eleanor Bresa"], Credits = 750_000, Materials = new() { ["Weapon Component"] = 3, ["Tungsten Carbide"] = 3, ["Metal Coil"] = 5, ["Weapon Test Data"] = 5, ["Security Expenses"] = 3 }, Effects = new() { ["magazineSize"] = 0.5 } },
        ["Noise Suppressor"] = new() { Name = "Noise Suppressor", Type = "weapon", Engineers = ["Hero Ferrari", "Terra Velasquez", "Baltanos"], Credits = 1_000_000, Materials = new() { ["Viscoelastic Polymer"] = 15, ["Weapon Component"] = 5, ["Atmospheric Data"] = 10, ["Mining Analytics"] = 10 }, Effects = new() { ["noiseSuppressor"] = 1 } },
        ["Reload Speed"] = new() { Name = "Reload Speed", Type = "weapon", Engineers = ["Jude Navarro", "Uma Laszlo", "Eleanor Bresa"], Credits = 500_000, Materials = new() { ["Micro Hydraulics"] = 5, ["Electromagnet"] = 5, ["Operational Manual"] = 5, ["Production Reports"] = 5, ["Combat Training Material"] = 5 }, Effects = new() { ["reloadSpeed"] = 0.3 } },
        ["Scope"] = new() { Name = "Scope", Type = "weapon", Engineers = ["Oden Geiger", "Rosa Dayette", "Wellington Beck"], Credits = 500_000, Materials = new() { ["Spectral Analysis Data"] = 10, ["Biometric Data"] = 5, ["Optical Lens"] = 10, ["Optical Fibre"] = 5 }, Effects = new() { ["scopeMagnification"] = 1 } },
        ["Stability"] = new() { Name = "Stability", Type = "weapon", Engineers = ["Domino Green", "Oden Geiger", "Rosa Dayette"], Credits = 500_000, Materials = new() { ["Viscoelastic Polymer"] = 5, ["Micro Hydraulics"] = 5, ["Mining Analytics"] = 5, ["Risk Assessments"] = 8 }, Effects = new() { ["recoil"] = -0.7 } },
        ["Stowed Reloading"] = new() { Name = "Stowed Reloading", Type = "weapon", Engineers = ["Kit Fowler", "Uma Laszlo", "Eleanor Bresa"], Credits = 1_000_000, Materials = new() { ["Digital Designs"] = 5, ["Operational Manual"] = 5, ["Production Schedule"] = 5, ["Circuit Board"] = 3, ["Encrypted Memory Chip"] = 8 }, Effects = new() { ["stowedReloading"] = 1 } },
    };

    public static Dictionary<string, int> GetUpgradeCost(string suitOrWeapon, int currentGrade)
    {
        if (SuitUpgradeCosts.TryGetValue(suitOrWeapon, out var suitCosts))
        {
            var gradeKey = $"g{currentGrade + 1}";
            return suitCosts.TryGetValue(gradeKey, out var costs) ? new(costs) : new();
        }
        if (WeaponBaseStats.TryGetValue(suitOrWeapon, out var weapon))
        {
            if (WeaponUpgradeCosts.TryGetValue(weapon.Manufacturer, out var mfgCosts))
            {
                var gradeKey = $"g{currentGrade + 1}";
                return mfgCosts.TryGetValue(gradeKey, out var costs) ? new(costs) : new();
            }
        }
        return new();
    }

    public static OnFootModification? GetModificationDetails(string name)
    {
        return Modifications.TryGetValue(name, out var mod) ? mod : null;
    }

    public static List<OnFootModification> GetAvailableModifications(
        string equipmentType,
        string? suitType = null,
        string? manufacturer = null)
    {
        return Modifications.Values.Where(m =>
            m.Type == equipmentType &&
            (suitType == null || m.CompatibleSuits == null || m.CompatibleSuits.Contains(suitType)) &&
            (manufacturer == null || m.CompatibleManufacturers == null || m.CompatibleManufacturers.Contains(manufacturer))
        ).ToList();
    }

    public static OnFootPlan PlanOnFootEngineering(List<OnFootPlannedUpgrade> upgrades)
    {
        var materials = new List<OnFootPlannedMaterial>();
        var engineerSet = new HashSet<string>();
        var totalCredits = 0;

        foreach (var upgrade in upgrades)
        {
            if (upgrade.TargetGrade > upgrade.CurrentGrade)
            {
                if (upgrade.Type == "suit")
                {
                    if (SuitUpgradeCosts.TryGetValue(upgrade.Name, out var costs))
                    {
                        for (int g = upgrade.CurrentGrade + 1; g <= upgrade.TargetGrade; g++)
                        {
                            var gradeKey = $"g{g}";
                            if (costs.TryGetValue(gradeKey, out var gradeCosts))
                            {
                                foreach (var (mat, qty) in gradeCosts)
                                    materials.Add(new() { Material = mat, Quantity = qty, Source = "upgrade" });
                            }
                        }
                    }
                }
                else
                {
                    if (WeaponBaseStats.TryGetValue(upgrade.Name, out var weapon))
                    {
                        if (WeaponUpgradeCosts.TryGetValue(weapon.Manufacturer, out var costs))
                        {
                            for (int g = upgrade.CurrentGrade + 1; g <= upgrade.TargetGrade; g++)
                            {
                                var gradeKey = $"g{g}";
                                if (costs.TryGetValue(gradeKey, out var gradeCosts))
                                {
                                    foreach (var (mat, qty) in gradeCosts)
                                        materials.Add(new() { Material = mat, Quantity = qty, Source = "upgrade" });
                                }
                            }
                        }
                    }
                }
            }

            foreach (var modName in upgrade.Modifications)
            {
                if (Modifications.TryGetValue(modName, out var mod))
                {
                    totalCredits += mod.Credits;
                    foreach (var eng in mod.Engineers) engineerSet.Add(eng);
                    foreach (var (mat, qty) in mod.Materials)
                        materials.Add(new() { Material = mat, Quantity = qty, Source = "modification" });
                }
            }
        }

        var materialTotal = new Dictionary<string, int>();
        foreach (var m in materials)
            materialTotal[m.Material] = materialTotal.GetValueOrDefault(m.Material) + m.Quantity;

        var engineers = engineerSet.ToList();
        engineers.Sort();

        return new OnFootPlan
        {
            Materials = materials,
            MaterialTotal = materialTotal,
            TotalCredits = totalCredits,
            Engineers = engineers,
        };
    }
}

public class SuitBaseStats
{
    public string SuitType { get; set; } = "";
    public string Manufacturer { get; set; } = "";
    public int Cost { get; set; }
    public double Shield { get; set; }
    public double ShieldRegen { get; set; }
    public double Battery { get; set; }
    public int Health { get; set; }
    public int Mass { get; set; }
    public int EmergencyAir { get; set; }
    public int GoodsCapacity { get; set; }
    public int AssetsCapacity { get; set; }
    public int DataCapacity { get; set; }
    public Dictionary<string, int> WeaponSlots { get; set; } = new();
    public Dictionary<string, int> ConsumableSlots { get; set; } = new();
    public Dictionary<string, double> Resistance { get; set; } = new();
}

public class WeaponBaseStats
{
    public string Name { get; set; } = "";
    public string Manufacturer { get; set; } = "";
    public string Category { get; set; } = "";
    public string Size { get; set; } = "";
    public string FireMode { get; set; } = "";
    public int Cost { get; set; }
    public double Dps { get; set; }
    public double HeadshotMultiplier { get; set; }
    public int EffectiveRange { get; set; }
    public int MagazineSize { get; set; }
    public int ReserveAmmo { get; set; }
    public double ReloadTime { get; set; }
    public double ProjectileSpeed { get; set; }
}

public class OnFootModification
{
    public string Name { get; set; } = "";
    public string Type { get; set; } = "";
    public List<string> Engineers { get; set; } = new();
    public int Credits { get; set; }
    public Dictionary<string, int> Materials { get; set; } = new();
    public Dictionary<string, double> Effects { get; set; } = new();
    public List<string>? CompatibleSuits { get; set; }
    public List<string>? CompatibleManufacturers { get; set; }
}

public class OnFootPlannedUpgrade
{
    public string Type { get; set; } = "";
    public string Name { get; set; } = "";
    public int CurrentGrade { get; set; }
    public int TargetGrade { get; set; }
    public List<string> Modifications { get; set; } = new();
}

public class OnFootPlannedMaterial
{
    public string Material { get; set; } = "";
    public int Quantity { get; set; }
    public string Source { get; set; } = "";
}

public class OnFootPlan
{
    public List<OnFootPlannedMaterial> Materials { get; set; } = new();
    public Dictionary<string, int> MaterialTotal { get; set; } = new();
    public int TotalCredits { get; set; }
    public List<string> Engineers { get; set; } = new();
}
