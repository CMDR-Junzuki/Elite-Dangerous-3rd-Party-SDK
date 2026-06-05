from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Optional
import math


@dataclass
class EquippedModule:
    module: dict[str, Any]
    slot_index: int
    engineering: Optional[dict] = None


@dataclass
class Loadout:
    ship: dict[str, Any]
    bulkhead: dict[str, Any]
    standard_modules: list[Optional[EquippedModule]]
    hardpoint_modules: list[Optional[EquippedModule]]
    internal_modules: list[Optional[EquippedModule]]
    cargo: float = 0
    fuel: float = 0
    fuel_capacity: float = 0


def calculate_total_mass(loadout: Loadout) -> float:
    mass = loadout.ship.get("properties", {}).get("hullMass", 0)
    mass += loadout.bulkhead.get("mass", 0)
    for mods in [loadout.standard_modules, loadout.hardpoint_modules, loadout.internal_modules]:
        for m in mods:
            if m:
                mass += m.module.get("mass", 0)
    mass += loadout.cargo
    mass += loadout.fuel
    return mass


@dataclass
class JumpRangeResult:
    current: float
    max: float
    fuel_used: float
    mass: float


def _get_guardian_boost(loadout: Loadout) -> float:
    boost = 0.0
    for m in loadout.internal_modules:
        if m and m.module.get("grp") == "gfsb":
            boost += m.module.get("jumpboost", 0)
    return boost


def _calc_jump_range(mass: float, fsd: dict, fuel: float, reserve_fuel: float, guardian_boost: float) -> float:
    max_fuel = fsd.get("maxfuel", 0)
    fuel_used = min(fuel, max_fuel)
    base = math.pow(fuel_used / fsd.get("fuelmul", 1), 1.0 / fsd.get("fuelpower", 2)) * (fsd.get("optmass", 1) / (mass + reserve_fuel))
    return base + guardian_boost


def calculate_jump_range(loadout: Loadout) -> Optional[JumpRangeResult]:
    fsd = next((m for m in loadout.standard_modules if m and m.module.get("grp") == "fsd"), None)
    if not fsd:
        return None
    f = fsd.module
    if not f.get("maxfuel") or not f.get("optmass") or not f.get("fuelmul"):
        return None

    total_mass = calculate_total_mass(loadout)
    reserve_fuel = loadout.ship.get("properties", {}).get("reserveFuelCapacity", 0)
    guardian_boost = _get_guardian_boost(loadout)

    current_fuel = min(loadout.fuel, f["maxfuel"])
    current = _calc_jump_range(total_mass, f, current_fuel, reserve_fuel, guardian_boost)

    max_jump_fuel = min(f["maxfuel"], loadout.fuel)
    remaining_mass = max(0, loadout.fuel - max_jump_fuel)
    max_mass = total_mass - remaining_mass
    max_range = _calc_jump_range(max_mass, f, max_jump_fuel, reserve_fuel, guardian_boost)

    return JumpRangeResult(
        current=current,
        max=max(max_range, current),
        fuel_used=current_fuel,
        mass=total_mass,
    )


@dataclass
class ShieldResult:
    absolute_shield: float
    generator_strength: float
    boosters_strength: float
    shield_addition: float
    shield_multiplier: float
    shield_boosters: int
    kinetic: float
    thermal: float
    explosive: float


_SG_GROUPS = {"sg", "bsg", "psg"}


def _get_shield_multiplier(mass: float, sg: dict) -> float:
    min_mass = sg.get("minmass", 0)
    opt_mass = sg.get("optmass", 0)
    max_mass = sg.get("maxmass", 0)
    min_mul = sg.get("minmul", 0)
    opt_mul = sg.get("optmul", 1)
    max_mul = sg.get("maxmul", 1)

    if not opt_mass or mass <= 1:
        return opt_mul

    xnorm = min(1, (max_mass - mass) / (max_mass - min_mass))
    exponent = math.log((opt_mul - min_mul) / (max_mul - min_mul)) / math.log(min(1, (max_mass - opt_mass) / (max_mass - min_mass)))
    ynorm = math.pow(xnorm, exponent)
    return min_mul + ynorm * (max_mul - min_mul)


def _diminishing_returns_shields(shield_mult: float, combined_mult: float) -> float:
    max_val = shield_mult * 0.7
    if combined_mult < max_val:
        return max_val / 2 + (max_val - max_val / 2) * (combined_mult / max_val)
    return combined_mult


def calculate_shield(loadout: Loadout) -> ShieldResult:
    base_shield = loadout.ship.get("properties", {}).get("baseShieldStrength", 0)
    hull_mass = loadout.ship.get("properties", {}).get("hullMass", 0)

    shield_gen = next(
        (m for m in loadout.internal_modules if m and m.module.get("grp") in _SG_GROUPS),
        None
    )

    shield_mult = 1
    generator_strength = 0.0
    sg_kin_dmg = 1.0
    sg_therm_dmg = 1.0
    sg_expl_dmg = 1.0

    if shield_gen:
        sg = shield_gen.module
        shield_mult = _get_shield_multiplier(hull_mass, sg)
        generator_strength = base_shield * shield_mult
        sg_kin_dmg = 1 - sg.get("kinres", 0)
        sg_therm_dmg = 1 - sg.get("thermres", 0)
        sg_expl_dmg = 1 - sg.get("explres", 0)

    total_boost = 1.0
    booster_kin_dmg = 1.0
    booster_therm_dmg = 1.0
    booster_expl_dmg = 1.0
    booster_count = 0

    for hp in loadout.hardpoint_modules:
        if hp and hp.module.get("grp") == "sb":
            sb = hp.module
            total_boost += sb.get("shieldboost", 0)
            booster_kin_dmg *= 1 - sb.get("kinres", 0)
            booster_therm_dmg *= 1 - sb.get("thermres", 0)
            booster_expl_dmg *= 1 - sb.get("explres", 0)
            booster_count += 1

    total_boost -= 1
    boosters_strength = generator_strength * total_boost

    shield_addition = 0.0
    for m in loadout.internal_modules:
        if m and m.module.get("grp") == "gsrp":
            shield_addition += m.module.get("shieldaddition", 0)

    absolute_shield = generator_strength + boosters_strength + shield_addition

    combined_kin_dmg = _diminishing_returns_shields(sg_kin_dmg, sg_kin_dmg * booster_kin_dmg)
    combined_therm_dmg = _diminishing_returns_shields(sg_therm_dmg, sg_therm_dmg * booster_therm_dmg)
    combined_expl_dmg = _diminishing_returns_shields(sg_expl_dmg, sg_expl_dmg * booster_expl_dmg)

    return ShieldResult(
        absolute_shield=absolute_shield,
        generator_strength=generator_strength,
        boosters_strength=boosters_strength,
        shield_addition=shield_addition,
        shield_multiplier=shield_mult,
        shield_boosters=booster_count,
        kinetic=1 - combined_kin_dmg,
        thermal=1 - combined_therm_dmg,
        explosive=1 - combined_expl_dmg,
    )


@dataclass
class DistributorResult:
    systems_capacity: float
    systems_recharge: float
    engines_capacity: float
    engines_recharge: float
    weapons_capacity: float
    weapons_recharge: float


def calculate_distributor(loadout: Loadout) -> DistributorResult:
    pd = next((m for m in loadout.standard_modules if m and m.module.get("grp") == "pd"), None)
    if not pd:
        return DistributorResult(0, 0, 0, 0, 0, 0)
    p = pd.module
    return DistributorResult(
        systems_capacity=p.get("syscap", 0),
        systems_recharge=p.get("sysrate", 0),
        engines_capacity=p.get("engcap", 0),
        engines_recharge=p.get("engrate", 0),
        weapons_capacity=p.get("wepcap", 0),
        weapons_recharge=p.get("weprate", 0),
    )


def capacitor_time(capacity: float, recharge: float, draw: float) -> dict:
    net = recharge - draw
    if net >= 0:
        return {"duration": float("inf"), "empty_to_full": capacity / recharge, "sustained": True}
    return {
        "duration": capacity / -net,
        "empty_to_full": capacity / recharge,
        "sustained": False,
    }


def sys_recharge_rate(sysrate: float, sys_pips: int) -> float:
    return sysrate * (sys_pips / 4) ** 1.1


def wep_recharge_rate(weprate: float, wep_pips: int) -> float:
    return weprate * (wep_pips / 4) ** 1.1


def sys_resistance(sys_pips: int) -> float:
    return sys_pips ** 0.85 * 0.6 / (4 ** 0.85)


@dataclass
class PowerResult:
    available: float
    used: float
    remaining: float
    pct_used: float


def calculate_power(loadout: Loadout) -> PowerResult:
    pp = next((m for m in loadout.standard_modules if m and m.module.get("grp") == "pp"), None)
    available = pp.module.get("pgen", 0) if pp else 0

    used = 0.0
    for mods in [loadout.standard_modules, loadout.hardpoint_modules, loadout.internal_modules]:
        for m in mods:
            if m:
                used += m.module.get("power", 0)

    return PowerResult(
        available=available,
        used=used,
        remaining=available - used,
        pct_used=(used / available * 100) if available > 0 else 0,
    )


@dataclass
class SpeedResult:
    forward_speed: float
    boost_speed: float
    pitch_rate: float
    roll_rate: float
    yaw_rate: float
    speeds_by_pip: list[float] = field(default_factory=list)
    pitches_by_pip: list[float] = field(default_factory=list)
    rolls_by_pip: list[float] = field(default_factory=list)
    yaws_by_pip: list[float] = field(default_factory=list)


def _mass_curve_multiplier(mass: float, min_mass: float, opt_mass: float, max_mass: float,
                           min_mul: float, opt_mul: float, max_mul: float) -> float:
    xnorm = min(1, (max_mass - mass) / (max_mass - min_mass))
    exponent = math.log((opt_mul - min_mul) / (max_mul - min_mul)) / math.log(min(1, (max_mass - opt_mass) / (max_mass - min_mass)))
    ynorm = xnorm ** exponent
    return min_mul + ynorm * (max_mul - min_mul)


def _calc_speed_for_pip(speed_mult: float, base_speed: float, minthrust_pct: float, eng: int) -> float:
    powerdist_eng_mul = eng / 4
    return speed_mult * base_speed * (powerdist_eng_mul + minthrust_pct * (1 - powerdist_eng_mul))


def _calc_rotation_for_pip(rot_mult: float, base_rot: float, pip_speed: float, eng: int) -> float:
    return rot_mult * base_rot * (1 - pip_speed * (4 - eng))


def calculate_speed(loadout: Loadout) -> SpeedResult:
    ship_props = loadout.ship.get("properties", {})
    total_mass = calculate_total_mass(loadout)

    thruster = next((m for m in loadout.standard_modules if m and m.module.get("grp") == "th"), None)

    base_speed = ship_props.get("speed", 0)
    base_boost = ship_props.get("boost", 0)
    base_pitch = ship_props.get("pitch", 0)
    base_roll = ship_props.get("roll", 0)
    base_yaw = ship_props.get("yaw", 0)
    minthrust_pct = (ship_props.get("minthrust", 0) or 0) / 100
    pip_speed = ship_props.get("pipSpeed", 0)

    if not thruster:
        speeds = [_calc_speed_for_pip(1, base_speed, minthrust_pct, e) for e in range(5)]
        pitches = [_calc_rotation_for_pip(1, base_pitch, pip_speed, e) for e in range(5)]
        rolls = [_calc_rotation_for_pip(1, base_roll, pip_speed, e) for e in range(5)]
        yaws = [_calc_rotation_for_pip(1, base_yaw, pip_speed, e) for e in range(5)]
        return SpeedResult(
            forward_speed=speeds[4], boost_speed=base_boost,
            pitch_rate=pitches[4], roll_rate=rolls[4], yaw_rate=yaws[4],
            speeds_by_pip=speeds, pitches_by_pip=pitches,
            rolls_by_pip=rolls, yaws_by_pip=yaws,
        )

    t = thruster.module
    min_mass = t.get("minmass", 0)
    opt_mass = t.get("optmass", 0)
    max_mass = t.get("maxmass", 0)

    speed_min_mul = t.get("minmulspeed") or t.get("minmul", 0)
    speed_opt_mul = t.get("optmulspeed") or t.get("optmul", 1)
    speed_max_mul = t.get("maxmulspeed") or t.get("maxmul", 1)

    rot_min_mul = t.get("minmulrotation") or t.get("minmul", 0)
    rot_opt_mul = t.get("optmulrotation") or t.get("optmul", 1)
    rot_max_mul = t.get("maxmulrotation") or t.get("maxmul", 1)

    speed_mult = _mass_curve_multiplier(total_mass, min_mass, opt_mass, max_mass,
                                        speed_min_mul, speed_opt_mul, speed_max_mul)
    rot_mult = _mass_curve_multiplier(total_mass, min_mass, opt_mass, max_mass,
                                      rot_min_mul, rot_opt_mul, rot_max_mul)

    boost_factor = base_boost / base_speed if base_speed else 0

    speeds = [_calc_speed_for_pip(speed_mult, base_speed, minthrust_pct, e) for e in range(5)]
    pitches = [_calc_rotation_for_pip(rot_mult, base_pitch, pip_speed, e) for e in range(5)]
    rolls = [_calc_rotation_for_pip(rot_mult, base_roll, pip_speed, e) for e in range(5)]
    yaws = [_calc_rotation_for_pip(rot_mult, base_yaw, pip_speed, e) for e in range(5)]

    boost_speed = speed_mult * base_speed * boost_factor

    return SpeedResult(
        forward_speed=speeds[4], boost_speed=boost_speed,
        pitch_rate=pitches[4], roll_rate=rolls[4], yaw_rate=yaws[4],
        speeds_by_pip=speeds, pitches_by_pip=pitches,
        rolls_by_pip=rolls, yaws_by_pip=yaws,
    )


@dataclass
class WeaponStat:
    name: str
    damage: float
    dps: float
    sdps: float
    burst_dps: Optional[float]
    range: float
    falloff: float
    shot_speed: float
    thermal_load: float
    distributor_draw: float
    eps: float
    hps: float
    ammo: float
    jitter: float
    piercing: float
    mount: str
    rof: float
    sustained_factor: float


@dataclass
class WeaponStatsResult:
    total_dps: float
    total_sdps: float
    weapons: list[WeaponStat]
    thermal_load: float
    dist_draw: float


def _calc_rof(w: dict) -> float:
    burst = w.get("burst", 1)
    burst_rof = w.get("burstrof", 1)
    fireint = w.get("fireint")
    int_rof = 1.0 / fireint if fireint is not None else w.get("rof", 1)
    charge = w.get("charge", 0)
    return burst / ((burst - 1) / burst_rof + 1.0 / int_rof + charge)


def _calc_sustained_factor(w: dict, rof: float) -> float:
    clip_size = w.get("clip")
    if clip_size is not None and clip_size > 0:
        burst = w.get("burst", 1)
        burst_rof = w.get("burstrof", 1)
        burst_overhead = (burst - 1) / burst_rof
        reload = w.get("reload", 0)
        srof = clip_size / ((clip_size - burst) / rof + burst_overhead + reload)
        return srof / rof
    return 1.0


def calculate_weapons(loadout: Loadout) -> WeaponStatsResult:
    total_dps = 0.0
    total_sdps = 0.0
    thermal_load = 0.0
    dist_draw = 0.0
    weapons: list[WeaponStat] = []

    for hp in loadout.hardpoint_modules:
        if not hp:
            continue
        w = hp.module
        if not w.get("damage"):
            continue

        rof = _calc_rof(w)
        damage_per_shot = w["damage"] * w.get("roundspershot", 1)
        dps = damage_per_shot * rof
        sustained_factor = _calc_sustained_factor(w, rof)
        sdps = dps * sustained_factor
        eps = w.get("distdraw", 0) * rof
        hps = w.get("thermload", 0) * rof

        burst_dps = None
        if w.get("burst", 1) > 1 and w.get("burstrof"):
            burst_dps = damage_per_shot * w["burstrof"]

        total_dps += dps
        total_sdps += sdps
        thermal_load += w.get("thermload", 0)
        dist_draw += w.get("distdraw", 0)

        weapons.append(WeaponStat(
            name=w.get("name") or w.get("symbol", ""),
            damage=w["damage"],
            dps=dps,
            sdps=sdps,
            burst_dps=burst_dps,
            range=w.get("range", 0),
            falloff=w.get("falloff", 0),
            shot_speed=w.get("shotspeed", 0),
            thermal_load=w.get("thermload", 0),
            distributor_draw=w.get("distdraw", 0),
            eps=eps,
            hps=hps,
            ammo=w.get("ammo", 0),
            jitter=w.get("jitter", 0),
            piercing=w.get("piercing", 0),
            mount=w.get("mount", "Fixed"),
            rof=rof,
            sustained_factor=sustained_factor,
        ))

    return WeaponStatsResult(
        total_dps=total_dps,
        total_sdps=total_sdps,
        weapons=weapons,
        thermal_load=thermal_load,
        dist_draw=dist_draw,
    )


@dataclass
class HullResult:
    hull_health: float
    armour_hardness: float
    effective_hull: float
    kinetic_resistance: float
    thermal_resistance: float
    explosive_resistance: float
    hull_reinforcement: float


_HRP_GROUPS = {"hr", "ghrp", "mahr"}


def _diminishing_returns_armour(bulkhead_dmg: float, *hrp_dmgs: float) -> float:
    max_val = min(0.7, bulkhead_dmg, *hrp_dmgs) if hrp_dmgs else min(0.7, bulkhead_dmg)
    combined = bulkhead_dmg
    for d in hrp_dmgs:
        combined *= d
    diminished = 0.35 + (max_val - 0.35) * (combined / max_val) if max_val > 0 else combined
    if diminished < 0.7:
        return diminished
    return combined


def calculate_hull(loadout: Loadout) -> HullResult:
    ship_props = loadout.ship.get("properties", {})
    bh = loadout.bulkhead

    base_bulkheads = ship_props.get("baseArmour", 0) * (1 + bh.get("hullboost", 0))
    hull_reinforcement = 0.0
    hull_expl_dmgs: list[float] = []
    hull_kin_dmgs: list[float] = []
    hull_therm_dmgs: list[float] = []

    for m in loadout.internal_modules:
        if m and m.module.get("grp") in _HRP_GROUPS:
            hrp = m.module
            hull_reinforcement += hrp.get("hullreinforcement", 0)
            hull_expl_dmgs.append(1 - hrp.get("explres", 0))
            hull_kin_dmgs.append(1 - hrp.get("kinres", 0))
            hull_therm_dmgs.append(1 - hrp.get("thermres", 0))

    hull_health = base_bulkheads + hull_reinforcement
    armour_hardness = ship_props.get("hardness", 0)

    bh_expl_dmg = 1 - bh.get("explres", 0)
    bh_kin_dmg = 1 - bh.get("kinres", 0)
    bh_therm_dmg = 1 - bh.get("thermres", 0)

    combined_expl_dmg = _diminishing_returns_armour(bh_expl_dmg, *hull_expl_dmgs)
    combined_kin_dmg = _diminishing_returns_armour(bh_kin_dmg, *hull_kin_dmgs)
    combined_therm_dmg = _diminishing_returns_armour(bh_therm_dmg, *hull_therm_dmgs)

    avg_res_mult = (combined_expl_dmg + combined_kin_dmg + combined_therm_dmg) / 3
    effective_hull = hull_health / avg_res_mult if avg_res_mult > 0 else hull_health

    return HullResult(
        hull_health=hull_health,
        armour_hardness=armour_hardness,
        effective_hull=effective_hull,
        kinetic_resistance=1 - combined_kin_dmg,
        thermal_resistance=1 - combined_therm_dmg,
        explosive_resistance=1 - combined_expl_dmg,
        hull_reinforcement=hull_reinforcement,
    )
