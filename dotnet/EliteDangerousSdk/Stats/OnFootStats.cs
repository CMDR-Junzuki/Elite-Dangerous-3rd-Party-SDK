using EliteDangerousSdk.Planner;

namespace EliteDangerousSdk.Stats;

public class OnFootSuitStats
{
    public string SuitType { get; set; } = "";
    public double Shield { get; set; }
    public double ShieldRegen { get; set; }
    public double Battery { get; set; }
    public int Health { get; set; }
    public int EmergencyAir { get; set; }
    public double SprintDuration { get; set; } = 1;
    public double BackpackCapacity { get; set; } = 1;
    public double AmmoCapacity { get; set; } = 1;
    public double MeleeDamage { get; set; } = 1;
    public double CombatMovementSpeed { get; set; }
    public Dictionary<string, double> Resistance { get; set; } = new();
    public bool JumpAssist { get; set; }
    public bool NightVision { get; set; }
    public bool EnhancedTracking { get; set; }
    public bool QuieterFootsteps { get; set; }
    public bool ReducedToolDrain { get; set; }
}

public class OnFootWeaponStats
{
    public string Name { get; set; } = "";
    public string Manufacturer { get; set; } = "";
    public string Category { get; set; } = "";
    public string Size { get; set; } = "";
    public string FireMode { get; set; } = "";
    public int Grade { get; set; }
    public double Dps { get; set; }
    public double HeadshotMultiplier { get; set; }
    public double EffectiveRange { get; set; }
    public int MagazineSize { get; set; }
    public int ReserveAmmo { get; set; }
    public double ReloadTime { get; set; }
    public double HandlingSpeed { get; set; } = 1;
    public double Recoil { get; set; } = 1;
    public bool StowedReloading { get; set; }
    public bool AudioMasking { get; set; }
    public bool NoiseSuppressor { get; set; }
    public bool ScopeMagnification { get; set; }
    public double HipFireAccuracy { get; set; }
}

public static class OnFootStats
{
    private static readonly HashSet<string> ManticoreWeapons = new()
    {
        "Manticore Executioner", "Manticore Intimidator", "Manticore Oppressor", "Manticore Tormentor"
    };

    private static double GradeDpsMultiplier(string weaponName) =>
        ManticoreWeapons.Contains(weaponName) ? 2.86 : 1.6;

    public static OnFootSuitStats CalculateSuitStats(string suitType, List<string> modifications)
    {
        var baseStats = OnFootEngineeringData.SuitBaseStats[suitType];

        var result = new OnFootSuitStats
        {
            SuitType = suitType,
            Shield = baseStats.Shield,
            ShieldRegen = baseStats.ShieldRegen,
            Battery = baseStats.Battery,
            Health = baseStats.Health,
            EmergencyAir = baseStats.EmergencyAir,
            Resistance = new(baseStats.Resistance),
        };

        foreach (var modName in modifications)
        {
            if (!OnFootEngineeringData.Modifications.TryGetValue(modName, out var mod)) continue;
            if (mod.Type != "suit") continue;
            if (mod.CompatibleSuits != null && !mod.CompatibleSuits.Contains(suitType)) continue;

            foreach (var (stat, value) in mod.Effects)
            {
                switch (stat)
                {
                    case "backpackCapacity":
                        result.BackpackCapacity = 1 + value;
                        break;
                    case "battery":
                        result.Battery = baseStats.Battery * (1 + value);
                        break;
                    case "shieldRegen":
                        result.ShieldRegen = baseStats.ShieldRegen * (1 + value);
                        break;
                    case "emergencyAir":
                        result.EmergencyAir = (int)value;
                        break;
                    case "sprintDuration":
                        result.SprintDuration = 1 + value;
                        break;
                    case "meleeDamage":
                        result.MeleeDamage = 1 + value;
                        break;
                    case "ammoCapacity":
                        result.AmmoCapacity = 1 + value;
                        break;
                    case "combatMovementSpeed":
                        result.CombatMovementSpeed = value;
                        break;
                    case "jumpAssist":
                        result.JumpAssist = true;
                        break;
                    case "nightVision":
                        result.NightVision = true;
                        break;
                    case "scanRange":
                    case "scanTime":
                        result.EnhancedTracking = true;
                        break;
                    case "footstepNoise":
                        result.QuieterFootsteps = true;
                        break;
                    case "toolEnergyDrain":
                        result.ReducedToolDrain = true;
                        break;
                    case "kineticResistance":
                        result.Resistance["kinetic"] = 1 - (1 - baseStats.Resistance["kinetic"]) * (1 - value);
                        break;
                    case "thermalResistance":
                        result.Resistance["thermal"] = 1 - (1 - baseStats.Resistance["thermal"]) * (1 - value);
                        break;
                    case "plasmaResistance":
                        result.Resistance["plasma"] = 1 - (1 - baseStats.Resistance["plasma"]) * (1 - value);
                        break;
                    case "explosiveResistance":
                        result.Resistance["explosive"] = 1 - (1 - baseStats.Resistance["explosive"]) * (1 - value);
                        break;
                }
            }
        }

        return result;
    }

    public static OnFootWeaponStats? CalculateWeaponStats(string weaponName, int grade, List<string> modifications)
    {
        if (!OnFootEngineeringData.WeaponBaseStats.TryGetValue(weaponName, out var baseStats))
            return null;

        var multiplier = GradeDpsMultiplier(weaponName);
        var gradeFactor = 1 + (multiplier - 1) * ((grade - 1) / 4.0);

        var result = new OnFootWeaponStats
        {
            Name = baseStats.Name,
            Manufacturer = baseStats.Manufacturer,
            Category = baseStats.Category,
            Size = baseStats.Size,
            FireMode = baseStats.FireMode,
            Grade = grade,
            Dps = baseStats.Dps * gradeFactor,
            HeadshotMultiplier = baseStats.HeadshotMultiplier,
            EffectiveRange = baseStats.EffectiveRange,
            MagazineSize = baseStats.MagazineSize,
            ReserveAmmo = baseStats.ReserveAmmo,
            ReloadTime = baseStats.ReloadTime,
        };

        foreach (var modName in modifications)
        {
            if (!OnFootEngineeringData.Modifications.TryGetValue(modName, out var mod)) continue;
            if (mod.Type != "weapon") continue;

            foreach (var (stat, value) in mod.Effects)
            {
                switch (stat)
                {
                    case "effectiveRange":
                        result.EffectiveRange = baseStats.EffectiveRange * (1 + value);
                        break;
                    case "headshotMultiplier":
                        result.HeadshotMultiplier = baseStats.HeadshotMultiplier * (1 + value);
                        break;
                    case "magazineSize":
                        result.MagazineSize = (int)Math.Round(baseStats.MagazineSize * (1 + value));
                        break;
                    case "reloadSpeed":
                        result.ReloadTime = baseStats.ReloadTime / (1 + value);
                        break;
                    case "handlingSpeed":
                        result.HandlingSpeed = 1 + value;
                        break;
                    case "recoil":
                        result.Recoil = 1 + value;
                        break;
                    case "hipFireAccuracy":
                        result.HipFireAccuracy = value;
                        break;
                    case "stowedReloading":
                        result.StowedReloading = true;
                        break;
                    case "audioMasking":
                        result.AudioMasking = true;
                        break;
                    case "noiseSuppressor":
                        result.NoiseSuppressor = true;
                        break;
                    case "scopeMagnification":
                        result.ScopeMagnification = true;
                        break;
                }
            }
        }

        return result;
    }

    public static double CalculateEffectiveDps(OnFootWeaponStats weaponStats, double hitRate, double headshotRate)
    {
        var bodyDmg = weaponStats.Dps * hitRate * (1 - headshotRate);
        var headDmg = weaponStats.Dps * hitRate * headshotRate * weaponStats.HeadshotMultiplier;
        return bodyDmg + headDmg;
    }
}
