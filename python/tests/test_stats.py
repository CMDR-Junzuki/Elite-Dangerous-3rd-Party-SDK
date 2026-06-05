"""Tests for ship stat calculator using stock Sidewinder loadout."""

from elite_dangerous_sdk.stats import (
    EquippedModule, Loadout,
    calculate_total_mass, calculate_jump_range, calculate_shield,
    calculate_distributor, calculate_power, calculate_speed,
    calculate_weapons, calculate_hull,
    capacitor_time, sys_recharge_rate, wep_recharge_rate, sys_resistance,
)


def _make_sidewinder() -> Loadout:
    ship = {
        "properties": {
            "hullMass": 25, "baseArmour": 60, "hardness": 20,
            "baseShieldStrength": 40, "speed": 220, "boost": 320,
            "pitch": 42, "roll": 110, "yaw": 16,
            "minthrust": 45.454, "boostEnergy": 7, "boostInt": 4,
            "heatCapacity": 140, "masslock": 6, "pipSpeed": 0.13636363636364,
            "crew": 1, "reserveFuelCapacity": 0.3,
            "name": "Sidewinder", "manufacturer": "Faulcon DeLacy", "class": 1,
            "hullCost": 4588,
        },
    }
    bulkhead = {"grp": "bh", "mass": 0, "hullboost": 0.8,
                "kinres": -0.2, "thermres": 0, "explres": -0.4}

    std = [
        EquippedModule(module={"grp": "pp", "mass": 2.5, "power": 0, "pgen": 6.4}, slot_index=0),
        EquippedModule(module={"grp": "th", "mass": 2.5, "power": 3.6,
                               "optmass": 80, "minmass": 0, "maxmass": 170,
                               "multiplier": 30, "integrity": 44, "boostMul": 1.5,
                               "optmul": 1}, slot_index=1),
        EquippedModule(module={"grp": "fsd", "mass": 2.5, "power": 0.39,
                               "optmass": 85, "fuelmul": 0.012, "fuelpower": 2.75, "maxfuel": 2.3}, slot_index=2),
        EquippedModule(module={"grp": "ls", "mass": 1.3, "power": 0.4}, slot_index=3),
        EquippedModule(module={"grp": "pd", "mass": 1.3, "power": 0.34,
                               "syscap": 8, "engcap": 8, "wepcap": 10,
                               "sysrate": 0.4, "engrate": 0.4, "weprate": 1.2}, slot_index=4),
        EquippedModule(module={"grp": "s", "mass": 1.3, "power": 0.2}, slot_index=5),
        EquippedModule(module={"grp": "ft", "mass": 0, "power": 0.1}, slot_index=6),
    ]

    hp = [
        EquippedModule(module={"grp": "weapon", "mass": 0, "power": 0.41,
                               "damage": 1.56, "range": 3000, "falloff": 400,
                               "shotspeed": 5000, "thermload": 0.42,
                               "distdraw": 0.18, "eps": 0.18, "hps": 4.17,
                               "ammo": 1, "jitter": 0, "piercing": 30,
                               "mount": "G", "rof": 3.03, "burst": 1,
                               "name": "Pulse Laser (Gimballed) S",
                               "edid": 128049385}, slot_index=0),
        EquippedModule(module={"grp": "weapon", "mass": 0, "power": 0.41,
                               "damage": 1.56, "range": 3000, "falloff": 400,
                               "shotspeed": 5000, "thermload": 0.42,
                               "distdraw": 0.18, "eps": 0.18, "hps": 4.17,
                               "ammo": 1, "jitter": 0, "piercing": 30,
                               "mount": "G", "rof": 3.03, "burst": 1,
                               "name": "Pulse Laser (Gimballed) S",
                               "edid": 128049385}, slot_index=1),
    ]

    internal = [
        EquippedModule(module={"grp": "sg", "mass": 2.5, "power": 0.2,
                               "shieldgen": True, "strength": 60, "rate": 8,
                               "brokenregen": 1, "efficiency": 0, "regen": 1,
                               "reinforcement": 12, "powerdraw": 0.2,
                               "optmass": 60, "minmass": 0, "maxmass": 150,
                               "optmul": 1, "minmul": 0.5, "maxmul": 1}, slot_index=0),
        EquippedModule(module={"grp": "cr", "mass": 0, "power": 0}, slot_index=1),
        EquippedModule(module={"grp": "pas", "mass": 0, "power": 0}, slot_index=6),
    ]

    return Loadout(
        ship=ship, bulkhead=bulkhead,
        standard_modules=std,
        hardpoint_modules=hp,
        internal_modules=internal,
        cargo=0, fuel=0.3, fuel_capacity=2.3,
    )


def test_total_mass():
    loadout = _make_sidewinder()
    mass = calculate_total_mass(loadout)
    expected = 25 + (2.5+2.5+2.5+1.3+1.3+1.3+0) + 0 + (2.5+0) + 0.3
    assert abs(mass - expected) < 0.01


def test_jump_range():
    loadout = _make_sidewinder()
    result = calculate_jump_range(loadout)
    assert result is not None
    assert result.current > 0
    assert result.max >= result.current
    assert result.mass > 0

    fsd = loadout.standard_modules[2].module
    expected = (0.3 / fsd["fuelmul"]) ** (1 / fsd["fuelpower"]) * fsd["optmass"] / (result.mass + 0.3)
    assert abs(result.current - expected) < 0.1


def test_shield():
    loadout = _make_sidewinder()
    shield = calculate_shield(loadout)
    assert shield.absolute_shield > 0
    assert shield.generator_strength > 0
    assert isinstance(shield.kinetic, (int, float))
    assert isinstance(shield.thermal, (int, float))
    assert isinstance(shield.explosive, (int, float))


def test_distributor():
    loadout = _make_sidewinder()
    dist = calculate_distributor(loadout)
    assert dist.systems_capacity == 8
    assert dist.engines_capacity == 8
    assert dist.weapons_capacity == 10
    assert dist.systems_recharge == 0.4
    assert dist.engines_recharge == 0.4
    assert dist.weapons_recharge == 1.2


def test_power():
    loadout = _make_sidewinder()
    power = calculate_power(loadout)
    assert power.available == 6.4
    assert power.used > 0
    assert abs(power.remaining - (power.available - power.used)) < 0.001
    assert 0 < power.pct_used < 100


def test_speed():
    loadout = _make_sidewinder()
    speed = calculate_speed(loadout)
    assert speed.forward_speed > 0
    assert speed.boost_speed > speed.forward_speed
    assert speed.pitch_rate > 0
    assert speed.roll_rate > 0
    assert speed.yaw_rate > 0
    assert len(speed.speeds_by_pip) == 5
    assert len(speed.pitches_by_pip) == 5


def test_weapons():
    loadout = _make_sidewinder()
    weapons = calculate_weapons(loadout)
    assert len(weapons.weapons) == 2
    assert weapons.total_dps > 0
    assert weapons.total_sdps > 0
    for w in weapons.weapons:
        assert "Pulse" in w.name
        assert abs(w.damage - 1.56) < 0.01
        assert w.rof > 0
        assert w.dps > 0
        assert w.range == 3000
        assert w.mount == "G"


def test_hull():
    loadout = _make_sidewinder()
    hull = calculate_hull(loadout)
    assert hull.hull_health > 0
    assert hull.armour_hardness == 20
    assert hull.effective_hull > 0
    assert isinstance(hull.kinetic_resistance, (int, float))
    assert isinstance(hull.thermal_resistance, (int, float))
    assert isinstance(hull.explosive_resistance, (int, float))


def test_no_nan_or_infinity():
    loadout = _make_sidewinder()
    import math
    checks = [
        calculate_total_mass(loadout),
        calculate_jump_range(loadout).current,
        calculate_jump_range(loadout).max,
        calculate_shield(loadout).absolute_shield,
        calculate_distributor(loadout).systems_capacity,
        calculate_power(loadout).available,
        calculate_speed(loadout).forward_speed,
        calculate_weapons(loadout).total_dps,
        calculate_hull(loadout).hull_health,
    ]
    for val in checks:
        assert math.isfinite(val)
        assert val >= 0


def test_capacitor_time_net_positive():
    result = capacitor_time(10, 1, 0.5)
    assert result["duration"] == float("inf")
    assert result["sustained"] is True
    assert result["empty_to_full"] == 10.0


def test_capacitor_time_net_negative():
    result = capacitor_time(10, 1, 2)
    assert result["duration"] > 0
    assert result["sustained"] is False


def test_sys_recharge_rate_formula():
    assert sys_recharge_rate(1.0, 4) == 1.0 * (4 / 4) ** 1.1


def test_wep_recharge_rate_formula():
    rate = wep_recharge_rate(1.2, 4)
    assert rate == 1.2 * (4 / 4) ** 1.1


def test_sys_resistance_formula():
    res = sys_resistance(4)
    assert res == 4 ** 0.85 * 0.6 / (4 ** 0.85)
    assert res == 0.6
