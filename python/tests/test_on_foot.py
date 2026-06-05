import pytest
from elite_dangerous_sdk.planner.on_foot_engineering import (
    SUIT_BASE_STATS, WEAPON_BASE_STATS, SUIT_UPGRADE_COSTS, WEAPON_UPGRADE_COSTS,
    ON_FOOT_MODIFICATIONS,
    get_upgrade_cost, get_modification_details, get_available_modifications,
    plan_on_foot_engineering,
)
from elite_dangerous_sdk.on_foot import (
    calculate_suit_stats, calculate_weapon_stats, calculate_effective_dps,
)


class TestSuitBaseStats:
    def test_has_all_three_suit_types(self):
        assert list(SUIT_BASE_STATS.keys()) == ["dominator", "maverick", "artemis"]

    def test_dominator_shield(self):
        assert SUIT_BASE_STATS["dominator"]["shield"] == 15.0

    def test_maverick_goods_capacity(self):
        assert SUIT_BASE_STATS["maverick"]["goodsCapacity"] == 40

    def test_artemis_battery(self):
        assert SUIT_BASE_STATS["artemis"]["battery"] == 17


class TestWeaponBaseStats:
    def test_has_11_weapons(self):
        assert len(WEAPON_BASE_STATS) == 11

    def test_karma_l6_stats(self):
        l6 = WEAPON_BASE_STATS["Karma L-6"]
        assert l6["dps"] == 44.4
        assert l6["magazineSize"] == 2
        assert l6["effectiveRange"] == 300

    def test_executioner_headshot(self):
        exec_ = WEAPON_BASE_STATS["Manticore Executioner"]
        assert exec_["headshotMultiplier"] == 3.0


class TestSuitUpgradeCosts:
    def test_has_costs_for_all_suits(self):
        assert list(SUIT_UPGRADE_COSTS.keys()) == ["dominator", "maverick", "artemis"]

    def test_dominator_g5_costs(self):
        g5 = SUIT_UPGRADE_COSTS["dominator"]["g5"]
        assert g5["Titanium Plating"] == 35
        assert g5["Suit Schematic"] == 15


class TestWeaponUpgradeCosts:
    def test_has_three_manufacturers(self):
        assert list(WEAPON_UPGRADE_COSTS.keys()) == ["kinematic", "takada", "manticore"]

    def test_kinematic_g5_costs(self):
        g5 = WEAPON_UPGRADE_COSTS["kinematic"]["g5"]
        assert g5["Tungsten Carbide"] == 12
        assert g5["Weapon Schematic"] == 5


class TestModifications:
    def test_has_25_modifications(self):
        assert len(ON_FOOT_MODIFICATIONS) == 25

    def test_has_14_suit_modifications(self):
        suit_mods = [m for m in ON_FOOT_MODIFICATIONS.values() if m["type"] == "suit"]
        assert len(suit_mods) == 14

    def test_has_11_weapon_modifications(self):
        weapon_mods = [m for m in ON_FOOT_MODIFICATIONS.values() if m["type"] == "weapon"]
        assert len(weapon_mods) == 11

    def test_each_mod_has_engineers(self):
        for name, mod in ON_FOOT_MODIFICATIONS.items():
            assert len(mod["engineers"]) >= 1, f"{name} has no engineers"

    def test_night_vision_requires_oden_geiger_and_yi_shen(self):
        nv = ON_FOOT_MODIFICATIONS["Night Vision"]
        assert "Oden Geiger" in nv["engineers"]
        assert "Yi Shen" in nv["engineers"]


class TestGetAvailableModifications:
    def test_returns_suit_mods_for_dominator(self):
        mods = get_available_modifications("suit", suit_type="dominator")
        assert len(mods) > 10

    def test_excludes_weapon_mods_in_suit_query(self):
        mods = get_available_modifications("suit")
        for m in mods:
            assert m["type"] == "suit"


class TestSuitStatsCalculator:
    def test_base_stats_with_no_mods(self):
        stats = calculate_suit_stats("dominator", [])
        assert stats["shield"] == 15.0
        assert stats["sprintDuration"] == 1

    def test_night_vision(self):
        stats = calculate_suit_stats("dominator", ["Night Vision"])
        assert stats["nightVision"] is True

    def test_improved_battery_capacity(self):
        stats = calculate_suit_stats("artemis", ["Improved Battery Capacity"])
        assert stats["battery"] == 17 * 1.5

    def test_damage_resistance(self):
        stats = calculate_suit_stats("dominator", ["Damage Resistance"])
        base_thermal = SUIT_BASE_STATS["dominator"]["resistance"]["thermal"]
        expected = 1 - (1 - base_thermal) * (1 - 0.1)
        assert abs(stats["resistance"]["thermal"] - expected) < 1e-5


class TestWeaponStatsCalculator:
    def test_unknown_weapon_returns_none(self):
        assert calculate_weapon_stats("Unknown", 1, []) is None

    def test_base_stats_at_grade_1(self):
        stats = calculate_weapon_stats("Karma C-44", 1, [])
        assert stats is not None
        assert abs(stats["dps"] - 8.0) < 0.1

    def test_dps_increases_with_grade(self):
        g1 = calculate_weapon_stats("Karma C-44", 1, [])
        g5 = calculate_weapon_stats("Karma C-44", 5, [])
        assert g5["dps"] > g1["dps"]

    def test_magazine_size_mod(self):
        stats = calculate_weapon_stats("Karma C-44", 1, ["Magazine Size"])
        assert stats["magazineSize"] == 90

    def test_greater_range_mod(self):
        stats = calculate_weapon_stats("Karma C-44", 1, ["Greater Range"])
        assert stats["effectiveRange"] == 25 * 1.5


class TestEffectiveDps:
    def test_calculates_effective_dps(self):
        stats = calculate_weapon_stats("Karma C-44", 1, [])
        dps = calculate_effective_dps(stats, 1.0, 0.0)
        assert abs(dps - stats["dps"]) < 0.01


class TestPlanner:
    def test_plan_suit_upgrade_materials(self):
        plan = plan_on_foot_engineering([
            {"type": "suit", "name": "dominator", "currentGrade": 1, "targetGrade": 5, "modifications": []},
        ])
        assert plan["materialTotal"]["Suit Schematic"] == 31
        assert plan["materialTotal"]["Manufacturing Instructions"] == 31
        assert plan["materialTotal"]["Titanium Plating"] == 80

    def test_plan_weapon_upgrade_materials(self):
        plan = plan_on_foot_engineering([
            {"type": "weapon", "name": "Karma C-44", "currentGrade": 1, "targetGrade": 5, "modifications": []},
        ])
        assert plan["materialTotal"]["Weapon Schematic"] == 12
        assert plan["materialTotal"]["Compression-Liquefied Gas"] == 12

    def test_plan_modification_materials_and_credits(self):
        plan = plan_on_foot_engineering([
            {"type": "suit", "name": "dominator", "currentGrade": 5, "targetGrade": 5, "modifications": ["Night Vision", "Faster Shield Regen"]},
        ])
        assert plan["totalCredits"] == 1_750_000
        assert "Oden Geiger" in plan["engineers"]
        assert "Kit Fowler" in plan["engineers"]

    def test_combine_upgrade_and_mod_materials(self):
        plan = plan_on_foot_engineering([
            {"type": "suit", "name": "dominator", "currentGrade": 1, "targetGrade": 5, "modifications": ["Night Vision"]},
        ])
        assert len(plan["materials"]) > 0
        assert "Oden Geiger" in plan["engineers"]
