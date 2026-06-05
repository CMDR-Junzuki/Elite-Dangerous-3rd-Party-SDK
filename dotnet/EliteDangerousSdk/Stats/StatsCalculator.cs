using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace EliteDangerousSdk.Stats
{
    public class EquippedModule
    {
        public JsonElement Module { get; set; }
        public int SlotIndex { get; set; }
    }

    public class Loadout
    {
        public JsonElement Ship { get; set; }
        public JsonElement Bulkhead { get; set; }
        public List<EquippedModule?> StandardModules { get; set; } = new();
        public List<EquippedModule?> HardpointModules { get; set; } = new();
        public List<EquippedModule?> InternalModules { get; set; } = new();
        public double Cargo { get; set; }
        public double Fuel { get; set; }
        public double FuelCapacity { get; set; }

        public double CalculateTotalMass()
        {
            double mass = Ship.GetProperty("properties").GetProperty("hullMass").GetDouble();
            mass += Bulkhead.GetProperty("mass").GetDouble();
            foreach (var mods in new[] { StandardModules, HardpointModules, InternalModules })
                foreach (var m in mods)
                    if (m != null && m.Module.TryGetProperty("mass", out var massEl))
                        mass += massEl.GetDouble();
            mass += Cargo;
            mass += Fuel;
            return mass;
        }
    }

    public class JumpRangeResult
    {
        public double Current { get; set; }
        public double Max { get; set; }
        public double FuelUsed { get; set; }
        public double Mass { get; set; }
    }

    public static class JumpRange
    {
        private static double GetGuardianBoost(Loadout loadout)
        {
            double boost = 0;
            foreach (var m in loadout.InternalModules)
                if (m != null)
                {
                    var grp = m.Module.GetProperty("grp").GetString();
                    if (grp == "gfsb" && m.Module.TryGetProperty("jumpboost", out var jb))
                        boost += jb.GetDouble();
                }
            return boost;
        }

        private static double CalcJumpRange(double mass, JsonElement fsd, double fuel, double reserveFuel, double guardianBoost)
        {
            var maxFuel = fsd.GetProperty("maxfuel").GetDouble();
            var fuelUsed = Math.Min(fuel, maxFuel);
            var baseRange = Math.Pow(fuelUsed / fsd.GetProperty("fuelmul").GetDouble(), 1.0 / fsd.GetProperty("fuelpower").GetDouble())
                * (fsd.GetProperty("optmass").GetDouble() / (mass + reserveFuel));
            return baseRange + guardianBoost;
        }

        public static JumpRangeResult? Calculate(Loadout loadout)
        {
            var fsd = loadout.StandardModules.FirstOrDefault(m =>
                m != null && m.Module.GetProperty("grp").GetString() == "fsd");
            if (fsd == null) return null;

            var f = fsd.Module;
            if (!f.TryGetProperty("maxfuel", out _) || !f.TryGetProperty("optmass", out _) || !f.TryGetProperty("fuelmul", out _))
                return null;

            var totalMass = loadout.CalculateTotalMass();
            var reserveFuel = loadout.Ship.GetProperty("properties").TryGetProperty("reserveFuelCapacity", out var rfc)
                ? rfc.GetDouble() : 0;
            var guardianBoost = GetGuardianBoost(loadout);

            var maxFuel = f.GetProperty("maxfuel").GetDouble();
            var currentFuel = Math.Min(loadout.Fuel, maxFuel);
            var current = CalcJumpRange(totalMass, f, currentFuel, reserveFuel, guardianBoost);

            var maxJumpFuel = Math.Min(maxFuel, loadout.Fuel);
            var remainingMass = Math.Max(0, loadout.Fuel - maxJumpFuel);
            var maxMass = totalMass - remainingMass;
            var max = CalcJumpRange(maxMass, f, maxJumpFuel, reserveFuel, guardianBoost);

            return new JumpRangeResult
            {
                Current = current,
                Max = Math.Max(max, current),
                FuelUsed = currentFuel,
                Mass = totalMass
            };
        }
    }

    public class ShieldResult
    {
        public double AbsoluteShield { get; set; }
        public double GeneratorStrength { get; set; }
        public double BoostersStrength { get; set; }
        public double ShieldAddition { get; set; }
        public double ShieldMultiplier { get; set; }
        public int ShieldBoosters { get; set; }
        public double Kinetic { get; set; }
        public double Thermal { get; set; }
        public double Explosive { get; set; }
    }

    public static class Shield
    {
        private static readonly HashSet<string> SgGroups = new() { "sg", "bsg", "psg" };

        private static double GetShieldMultiplier(double mass, JsonElement sg)
        {
            var minMass = sg.GetProperty("minmass").GetDouble();
            var optMass = sg.GetProperty("optmass").GetDouble();
            var maxMass = sg.GetProperty("maxmass").GetDouble();
            var minMul = sg.GetProperty("minmul").GetDouble();
            var optMul = sg.GetProperty("optmul").GetDouble();
            var maxMul = sg.GetProperty("maxmul").GetDouble();

            if (mass <= 1) return optMul;
            var xnorm = Math.Min(1, (maxMass - mass) / (maxMass - minMass));
            var exponent = Math.Log((optMul - minMul) / (maxMul - minMul))
                / Math.Log(Math.Min(1, (maxMass - optMass) / (maxMass - minMass)));
            var ynorm = Math.Pow(xnorm, exponent);
            return minMul + ynorm * (maxMul - minMul);
        }

        private static double DiminishingReturnsShields(double shieldMult, double combinedMult)
        {
            var maxVal = shieldMult * 0.7;
            if (combinedMult < maxVal)
                return maxVal / 2 + (maxVal - maxVal / 2) * (combinedMult / maxVal);
            return combinedMult;
        }

        public static ShieldResult Calculate(Loadout loadout)
        {
            var shipProps = loadout.Ship.GetProperty("properties");
            var baseShield = shipProps.GetProperty("baseShieldStrength").GetDouble();
            var hullMass = shipProps.GetProperty("hullMass").GetDouble();

            var shieldGen = loadout.InternalModules.FirstOrDefault(m =>
                m != null && SgGroups.Contains(m.Module.GetProperty("grp").GetString() ?? ""));

            double shieldMult = 1, generatorStrength = 0;
            double sgKinDmg = 1, sgThermDmg = 1, sgExplDmg = 1;

            if (shieldGen != null)
            {
                var sg = shieldGen.Module;
                shieldMult = GetShieldMultiplier(hullMass, sg);
                generatorStrength = baseShield * shieldMult;
                sgKinDmg = 1 - (sg.TryGetProperty("kinres", out var kr) ? kr.GetDouble() : 0);
                sgThermDmg = 1 - (sg.TryGetProperty("thermres", out var tr) ? tr.GetDouble() : 0);
                sgExplDmg = 1 - (sg.TryGetProperty("explres", out var er) ? er.GetDouble() : 0);
            }

            double totalBoost = 1, boosterKinDmg = 1, boosterThermDmg = 1, boosterExplDmg = 1;
            int boosterCount = 0;

            foreach (var hp in loadout.HardpointModules)
            {
                if (hp != null && hp.Module.GetProperty("grp").GetString() == "sb")
                {
                    var sb = hp.Module;
                    totalBoost += sb.TryGetProperty("shieldboost", out var sbEl) ? sbEl.GetDouble() : 0;
                    boosterKinDmg *= 1 - (sb.TryGetProperty("kinres", out var kr) ? kr.GetDouble() : 0);
                    boosterThermDmg *= 1 - (sb.TryGetProperty("thermres", out var tr) ? tr.GetDouble() : 0);
                    boosterExplDmg *= 1 - (sb.TryGetProperty("explres", out var er) ? er.GetDouble() : 0);
                    boosterCount++;
                }
            }

            totalBoost -= 1;
            var boostersStrength = generatorStrength * totalBoost;

            double shieldAddition = 0;
            foreach (var m in loadout.InternalModules)
            {
                if (m != null && m.Module.GetProperty("grp").GetString() == "gsrp"
                    && m.Module.TryGetProperty("shieldaddition", out var sa))
                    shieldAddition += sa.GetDouble();
            }

            var absoluteShield = generatorStrength + boostersStrength + shieldAddition;

            var combinedKinDmg = DiminishingReturnsShields(sgKinDmg, sgKinDmg * boosterKinDmg);
            var combinedThermDmg = DiminishingReturnsShields(sgThermDmg, sgThermDmg * boosterThermDmg);
            var combinedExplDmg = DiminishingReturnsShields(sgExplDmg, sgExplDmg * boosterExplDmg);

            return new ShieldResult
            {
                AbsoluteShield = absoluteShield,
                GeneratorStrength = generatorStrength,
                BoostersStrength = boostersStrength,
                ShieldAddition = shieldAddition,
                ShieldMultiplier = shieldMult,
                ShieldBoosters = boosterCount,
                Kinetic = 1 - combinedKinDmg,
                Thermal = 1 - combinedThermDmg,
                Explosive = 1 - combinedExplDmg,
            };
        }
    }

    public class DistributorResult
    {
        public double SystemsCapacity { get; set; }
        public double SystemsRecharge { get; set; }
        public double EnginesCapacity { get; set; }
        public double EnginesRecharge { get; set; }
        public double WeaponsCapacity { get; set; }
        public double WeaponsRecharge { get; set; }
    }

    public static class Distributor
    {
        public static DistributorResult Calculate(Loadout loadout)
        {
            var pd = loadout.StandardModules.FirstOrDefault(m =>
                m != null && m.Module.GetProperty("grp").GetString() == "pd");
            if (pd == null) return new DistributorResult();

            var p = pd.Module;
            return new DistributorResult
            {
                SystemsCapacity = p.TryGetProperty("syscap", out var sc) ? sc.GetDouble() : 0,
                SystemsRecharge = p.TryGetProperty("sysrate", out var sr) ? sr.GetDouble() : 0,
                EnginesCapacity = p.TryGetProperty("engcap", out var ec) ? ec.GetDouble() : 0,
                EnginesRecharge = p.TryGetProperty("engrate", out var er) ? er.GetDouble() : 0,
                WeaponsCapacity = p.TryGetProperty("wepcap", out var wc) ? wc.GetDouble() : 0,
                WeaponsRecharge = p.TryGetProperty("weprate", out var wr) ? wr.GetDouble() : 0,
            };
        }

        public static double SysRechargeRate(double sysrate, double sysPips) =>
            sysrate * Math.Pow(sysPips / 4, 1.1);

        public static double WepRechargeRate(double weprate, double wepPips) =>
            weprate * Math.Pow(wepPips / 4, 1.1);

        public static double SysResistance(double sysPips) =>
            Math.Pow(sysPips, 0.85) * 0.6 / Math.Pow(4, 0.85);

        public static CapacitorTimeResult CapacitorTime(double capacity, double recharge, double draw)
        {
            var net = recharge - draw;
            if (net >= 0)
                return new CapacitorTimeResult { Duration = double.PositiveInfinity, EmptyToFull = capacity / recharge, Sustained = true };
            return new CapacitorTimeResult
            {
                Duration = capacity / -net,
                EmptyToFull = capacity / recharge,
                Sustained = false,
            };
        }
    }

    public class CapacitorTimeResult
    {
        public double Duration { get; set; }
        public double EmptyToFull { get; set; }
        public bool Sustained { get; set; }
    }

    public class PowerResult
    {
        public double Available { get; set; }
        public double Used { get; set; }
        public double Remaining { get; set; }
        public double PctUsed { get; set; }
    }

    public static class Power
    {
        public static PowerResult Calculate(Loadout loadout)
        {
            var pp = loadout.StandardModules.FirstOrDefault(m =>
                m != null && m.Module.GetProperty("grp").GetString() == "pp");

            double available = 0;
            if (pp != null)
                available = pp.Module.TryGetProperty("pgen", out var pg) ? pg.GetDouble() : 0;

            double used = 0;
            foreach (var mods in new[] { loadout.StandardModules, loadout.HardpointModules, loadout.InternalModules })
                foreach (var m in mods)
                    if (m != null && m.Module.TryGetProperty("power", out var pwr))
                        used += pwr.GetDouble();

            return new PowerResult
            {
                Available = available,
                Used = used,
                Remaining = available - used,
                PctUsed = available > 0 ? (used / available) * 100 : 0,
            };
        }
    }

    public class SpeedResult
    {
        public double ForwardSpeed { get; set; }
        public double BoostSpeed { get; set; }
        public double PitchRate { get; set; }
        public double RollRate { get; set; }
        public double YawRate { get; set; }
        public double[] SpeedsByPip { get; set; } = Array.Empty<double>();
        public double[] PitchesByPip { get; set; } = Array.Empty<double>();
        public double[] RollsByPip { get; set; } = Array.Empty<double>();
        public double[] YawsByPip { get; set; } = Array.Empty<double>();
    }

    public static class Speed
    {
        private static double MassCurveMultiplier(double mass, double minMass, double optMass, double maxMass,
            double minMul, double optMul, double maxMul)
        {
            var xnorm = Math.Min(1, (maxMass - mass) / (maxMass - minMass));
            var exponent = Math.Log((optMul - minMul) / (maxMul - minMul))
                / Math.Log(Math.Min(1, (maxMass - optMass) / (maxMass - minMass)));
            var ynorm = Math.Pow(xnorm, exponent);
            return minMul + ynorm * (maxMul - minMul);
        }

        private static double CalcSpeedForPip(double speedMult, double baseSpeed, double minthrustPct, int eng)
        {
            var powerdistEngMul = eng / 4.0;
            return speedMult * baseSpeed * (powerdistEngMul + minthrustPct * (1 - powerdistEngMul));
        }

        private static double CalcRotationForPip(double rotMult, double baseRot, double pipSpeed, int eng) =>
            rotMult * baseRot * (1 - pipSpeed * (4 - eng));

        public static SpeedResult Calculate(Loadout loadout)
        {
            var props = loadout.Ship.GetProperty("properties");
            var totalMass = loadout.CalculateTotalMass();

            var thruster = loadout.StandardModules.FirstOrDefault(m =>
                m != null && m.Module.GetProperty("grp").GetString() == "th");

            var baseSpeed = props.GetProperty("speed").GetDouble();
            var baseBoost = props.GetProperty("boost").GetDouble();
            var basePitch = props.GetProperty("pitch").GetDouble();
            var baseRoll = props.GetProperty("roll").GetDouble();
            var baseYaw = props.GetProperty("yaw").GetDouble();
            var minthrustPct = (props.TryGetProperty("minthrust", out var mt) ? mt.GetDouble() : 0) / 100;
            var pipSpeed = props.TryGetProperty("pipSpeed", out var ps) ? ps.GetDouble() : 0;

            if (thruster == null)
            {
                var speeds = Enumerable.Range(0, 5).Select(e => CalcSpeedForPip(1, baseSpeed, minthrustPct, e)).ToArray();
                var pitches = Enumerable.Range(0, 5).Select(e => CalcRotationForPip(1, basePitch, pipSpeed, e)).ToArray();
                var rolls = Enumerable.Range(0, 5).Select(e => CalcRotationForPip(1, baseRoll, pipSpeed, e)).ToArray();
                var yaws = Enumerable.Range(0, 5).Select(e => CalcRotationForPip(1, baseYaw, pipSpeed, e)).ToArray();
                return new SpeedResult
                {
                    ForwardSpeed = speeds[4], BoostSpeed = baseBoost,
                    PitchRate = pitches[4], RollRate = rolls[4], YawRate = yaws[4],
                    SpeedsByPip = speeds, PitchesByPip = pitches,
                    RollsByPip = rolls, YawsByPip = yaws,
                };
            }

            var t = thruster.Module;
            var minMass = t.GetProperty("minmass").GetDouble();
            var optMass = t.GetProperty("optmass").GetDouble();
            var maxMass = t.GetProperty("maxmass").GetDouble();

            var speedMinMul = t.TryGetProperty("minmulspeed", out var smin) ? smin.GetDouble()
                : (t.TryGetProperty("minmul", out var minm) ? minm.GetDouble() : 0);
            var speedOptMul = t.TryGetProperty("optmulspeed", out var sopt) ? sopt.GetDouble()
                : (t.TryGetProperty("optmul", out var optm) ? optm.GetDouble() : 1);
            var speedMaxMul = t.TryGetProperty("maxmulspeed", out var smax) ? smax.GetDouble()
                : (t.TryGetProperty("maxmul", out var maxm) ? maxm.GetDouble() : 1);

            var rotMinMul = t.TryGetProperty("minmulrotation", out var rmin) ? rmin.GetDouble()
                : (t.TryGetProperty("minmul", out var minm2) ? minm2.GetDouble() : 0);
            var rotOptMul = t.TryGetProperty("optmulrotation", out var ropt) ? ropt.GetDouble()
                : (t.TryGetProperty("optmul", out var optm2) ? optm2.GetDouble() : 1);
            var rotMaxMul = t.TryGetProperty("maxmulrotation", out var rmax) ? rmax.GetDouble()
                : (t.TryGetProperty("maxmul", out var maxm2) ? maxm2.GetDouble() : 1);

            var speedMult = MassCurveMultiplier(totalMass, minMass, optMass, maxMass, speedMinMul, speedOptMul, speedMaxMul);
            var rotMult = MassCurveMultiplier(totalMass, minMass, optMass, maxMass, rotMinMul, rotOptMul, rotMaxMul);

            var boostFactor = baseSpeed > 0 ? baseBoost / baseSpeed : 0;

            var speeds2 = Enumerable.Range(0, 5).Select(e => CalcSpeedForPip(speedMult, baseSpeed, minthrustPct, e)).ToArray();
            var pitches2 = Enumerable.Range(0, 5).Select(e => CalcRotationForPip(rotMult, basePitch, pipSpeed, e)).ToArray();
            var rolls2 = Enumerable.Range(0, 5).Select(e => CalcRotationForPip(rotMult, baseRoll, pipSpeed, e)).ToArray();
            var yaws2 = Enumerable.Range(0, 5).Select(e => CalcRotationForPip(rotMult, baseYaw, pipSpeed, e)).ToArray();

            var boostSpeed = speedMult * baseSpeed * boostFactor;

            return new SpeedResult
            {
                ForwardSpeed = speeds2[4], BoostSpeed = boostSpeed,
                PitchRate = pitches2[4], RollRate = rolls2[4], YawRate = yaws2[4],
                SpeedsByPip = speeds2, PitchesByPip = pitches2,
                RollsByPip = rolls2, YawsByPip = yaws2,
            };
        }
    }

    public class HullResult
    {
        public double HullHealth { get; set; }
        public double ArmourHardness { get; set; }
        public double EffectiveHull { get; set; }
        public double KineticResistance { get; set; }
        public double ThermalResistance { get; set; }
        public double ExplosiveResistance { get; set; }
        public double HullReinforcement { get; set; }
    }

    public static class Hull
    {
        private static readonly HashSet<string> HrpGroups = new() { "hr", "ghrp", "mahr" };

        private static double DiminishingReturnsArmour(double bulkheadDmg, List<double> hrpDmgs)
        {
            var maxVal = Math.Min(0.7, bulkheadDmg);
            foreach (var d in hrpDmgs) maxVal = Math.Min(maxVal, d);

            var combined = bulkheadDmg;
            foreach (var d in hrpDmgs) combined *= d;

            var diminished = maxVal > 0 ? 0.35 + (maxVal - 0.35) * (combined / maxVal) : combined;
            return diminished < 0.7 ? diminished : combined;
        }

        public static HullResult Calculate(Loadout loadout)
        {
            var props = loadout.Ship.GetProperty("properties");
            var bh = loadout.Bulkhead;

            var baseBulkheads = props.GetProperty("baseArmour").GetDouble()
                * (1 + (bh.TryGetProperty("hullboost", out var hb) ? hb.GetDouble() : 0));

            double hullReinforcement = 0;
            var hullExplDmgs = new List<double>();
            var hullKinDmgs = new List<double>();
            var hullThermDmgs = new List<double>();

            foreach (var m in loadout.InternalModules)
            {
                if (m != null && HrpGroups.Contains(m.Module.GetProperty("grp").GetString() ?? ""))
                {
                    var hrp = m.Module;
                    hullReinforcement += hrp.TryGetProperty("hullreinforcement", out var hr) ? hr.GetDouble() : 0;
                    hullExplDmgs.Add(1 - (hrp.TryGetProperty("explres", out var er) ? er.GetDouble() : 0));
                    hullKinDmgs.Add(1 - (hrp.TryGetProperty("kinres", out var kr) ? kr.GetDouble() : 0));
                    hullThermDmgs.Add(1 - (hrp.TryGetProperty("thermres", out var tr) ? tr.GetDouble() : 0));
                }
            }

            var hullHealth = baseBulkheads + hullReinforcement;
            var armourHardness = props.GetProperty("hardness").GetDouble();

            var bhExplDmg = 1 - (bh.TryGetProperty("explres", out var ber) ? ber.GetDouble() : 0);
            var bhKinDmg = 1 - (bh.TryGetProperty("kinres", out var bkr) ? bkr.GetDouble() : 0);
            var bhThermDmg = 1 - (bh.TryGetProperty("thermres", out var btr) ? btr.GetDouble() : 0);

            var combinedExplDmg = DiminishingReturnsArmour(bhExplDmg, hullExplDmgs);
            var combinedKinDmg = DiminishingReturnsArmour(bhKinDmg, hullKinDmgs);
            var combinedThermDmg = DiminishingReturnsArmour(bhThermDmg, hullThermDmgs);

            var avgResMult = (combinedExplDmg + combinedKinDmg + combinedThermDmg) / 3;
            var effectiveHull = avgResMult > 0 ? hullHealth / avgResMult : hullHealth;

            return new HullResult
            {
                HullHealth = hullHealth,
                ArmourHardness = armourHardness,
                EffectiveHull = effectiveHull,
                KineticResistance = 1 - combinedKinDmg,
                ThermalResistance = 1 - combinedThermDmg,
                ExplosiveResistance = 1 - combinedExplDmg,
                HullReinforcement = hullReinforcement,
            };
        }
    }

    public class WeaponStat
    {
        public string Name { get; set; } = "";
        public double Damage { get; set; }
        public double Dps { get; set; }
        public double Sdps { get; set; }
        public double? BurstDps { get; set; }
        public double Range { get; set; }
        public double Falloff { get; set; }
        public double ShotSpeed { get; set; }
        public double ThermalLoad { get; set; }
        public double DistributorDraw { get; set; }
        public double Eps { get; set; }
        public double Hps { get; set; }
        public double Ammo { get; set; }
        public double Jitter { get; set; }
        public double Piercing { get; set; }
        public string Mount { get; set; } = "";
        public double Rof { get; set; }
        public double SustainedFactor { get; set; }
    }

    public class WeaponStatsResult
    {
        public double TotalDps { get; set; }
        public double TotalSdps { get; set; }
        public List<WeaponStat> Weapons { get; set; } = new();
        public double ThermalLoad { get; set; }
        public double DistDraw { get; set; }
    }

    public static class Weapons
    {
        private static double CalcRof(JsonElement w)
        {
            var burst = w.TryGetProperty("burst", out var bEl) ? bEl.GetDouble() : 1;
            var burstRof = w.TryGetProperty("burstrof", out var brEl) ? brEl.GetDouble() : 1;
            double intRof;
            if (w.TryGetProperty("fireint", out var fiEl))
                intRof = 1.0 / fiEl.GetDouble();
            else
                intRof = w.TryGetProperty("rof", out var rEl) ? rEl.GetDouble() : 1;
            var charge = w.TryGetProperty("charge", out var cEl) ? cEl.GetDouble() : 0;
            return burst / ((burst - 1) / burstRof + 1.0 / intRof + charge);
        }

        private static double CalcSustainedFactor(JsonElement w, double rof)
        {
            if (w.TryGetProperty("clip", out var clipEl) && clipEl.GetDouble() > 0)
            {
                var clipSize = clipEl.GetDouble();
                var burst = w.TryGetProperty("burst", out var bEl) ? bEl.GetDouble() : 1;
                var burstRof = w.TryGetProperty("burstrof", out var brEl) ? brEl.GetDouble() : 1;
                var burstOverhead = (burst - 1) / burstRof;
                var reload = w.TryGetProperty("reload", out var rEl) ? rEl.GetDouble() : 0;
                var srof = clipSize / ((clipSize - burst) / rof + burstOverhead + reload);
                return srof / rof;
            }
            return 1;
        }

        public static WeaponStatsResult Calculate(Loadout loadout)
        {
            double totalDps = 0, totalSdps = 0, thermalLoad = 0, distDraw = 0;
            var weapons = new List<WeaponStat>();

            foreach (var hp in loadout.HardpointModules)
            {
                if (hp == null) continue;
                var w = hp.Module;
                if (!w.TryGetProperty("damage", out var dmgEl)) continue;
                var damage = dmgEl.GetDouble();
                var roundsPerShot = w.TryGetProperty("roundspershot", out var rps) ? rps.GetDouble() : 1;
                var damagePerShot = damage * roundsPerShot;

                var rof = CalcRof(w);
                var dps = damagePerShot * rof;
                var sustainedFactor = CalcSustainedFactor(w, rof);
                var sdps = dps * sustainedFactor;
                var eps = (w.TryGetProperty("distdraw", out var ddEl) ? ddEl.GetDouble() : 0) * rof;
                var hps = (w.TryGetProperty("thermload", out var tlEl) ? tlEl.GetDouble() : 0) * rof;

                double? burstDps = null;
                if (w.TryGetProperty("burst", out var bEl2) && bEl2.GetDouble() > 1
                    && w.TryGetProperty("burstrof", out var brEl2))
                    burstDps = damagePerShot * brEl2.GetDouble();

                var name = w.TryGetProperty("name", out var nEl) ? nEl.GetString() ??
                    w.GetProperty("symbol").GetString() ?? "" : "";
                var mount = w.TryGetProperty("mount", out var mEl) ? mEl.GetString() ?? "Fixed" : "Fixed";

                totalDps += dps;
                totalSdps += sdps;
                thermalLoad += w.TryGetProperty("thermload", out var tlEl2) ? tlEl2.GetDouble() : 0;
                distDraw += w.TryGetProperty("distdraw", out var ddEl2) ? ddEl2.GetDouble() : 0;

                weapons.Add(new WeaponStat
                {
                    Name = name, Damage = damage, Dps = dps, Sdps = sdps, BurstDps = burstDps,
                    Range = w.TryGetProperty("range", out var rEl) ? rEl.GetDouble() : 0,
                    Falloff = w.TryGetProperty("falloff", out var fEl) ? fEl.GetDouble() : 0,
                    ShotSpeed = w.TryGetProperty("shotspeed", out var ssEl) ? ssEl.GetDouble() : 0,
                    ThermalLoad = w.TryGetProperty("thermload", out var tlEl3) ? tlEl3.GetDouble() : 0,
                    DistributorDraw = w.TryGetProperty("distdraw", out var ddEl3) ? ddEl3.GetDouble() : 0,
                    Eps = eps, Hps = hps,
                    Ammo = w.TryGetProperty("ammo", out var aEl) ? aEl.GetDouble() : 0,
                    Jitter = w.TryGetProperty("jitter", out var jEl) ? jEl.GetDouble() : 0,
                    Piercing = w.TryGetProperty("piercing", out var pEl) ? pEl.GetDouble() : 0,
                    Mount = mount, Rof = rof, SustainedFactor = sustainedFactor,
                });
            }

            return new WeaponStatsResult
            {
                TotalDps = totalDps, TotalSdps = totalSdps,
                Weapons = weapons, ThermalLoad = thermalLoad, DistDraw = distDraw,
            };
        }
    }
}
