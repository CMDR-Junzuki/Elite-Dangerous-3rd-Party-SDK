"""Tests for engineering modifier calculator using real coriolis data."""

from elite_dangerous_sdk.engineering import (
    get_stat_mod, apply_blueprint_grade, compute_engineering_changes,
    get_available_blueprints, AppliedModification,
)


def test_get_stat_mod_damage():
    mod = get_stat_mod("damage")
    assert mod is not None
    assert mod.name == "damage"
    assert mod.higherbetter is True
    assert mod.type == "percentage"


def test_get_stat_mod_shieldboost():
    mod = get_stat_mod("shieldboost")
    assert mod is not None
    assert mod.higherbetter is True
    assert mod.method == "multiplicative"


def test_get_stat_mod_hullboost():
    mod = get_stat_mod("hullboost")
    assert mod is not None


def test_get_stat_mod_rof():
    mod = get_stat_mod("rof")
    assert mod is not None
    assert mod.higherbetter is False


def test_get_stat_mod_unknown():
    mod = get_stat_mod("FakeStat")
    assert mod is None


def test_get_available_blueprints_valid():
    bps = get_available_blueprints("pl")
    assert isinstance(bps, list)
    assert len(bps) > 0
    assert "Weapon_Overcharged" in bps


def test_get_available_blueprints_fsd():
    bps = get_available_blueprints("fsd")
    assert "FSD_LongRange" in bps


def test_get_available_blueprints_unknown():
    bps = get_available_blueprints("nonexistent")
    assert bps == []


def test_apply_blueprint_grade_additive():
    result = apply_blueprint_grade(
        base_stats={"damage": 10.0},
        features={"damage": (0.5, 1.0)},
        grade=1,
    )
    assert result["damage"] == 10.0 * (1 + 0.5)


def test_apply_blueprint_grade_max_roll():
    result = apply_blueprint_grade(
        base_stats={"damage": 10.0},
        features={"damage": (0.5, 1.0)},
        grade=5,
    )
    assert result["damage"] == 10.0 * (1 + 1.0)


def test_apply_blueprint_grade_rof_conversion():
    result = apply_blueprint_grade(
        base_stats={"rof": 2.0},
        features={"rof": (0, 0)},
        grade=1,
    )
    assert result["rof"] == 2.0


def test_apply_blueprint_grade_rof_with_change():
    result = apply_blueprint_grade(
        base_stats={"rof": 2.0},
        features={"rof": (-0.5, -0.5)},
        grade=1,
    )
    exp = 1 / (1 + (-0.5)) - 1
    assert result["rof"] == 2.0 * (1 + exp)


def test_apply_blueprint_grade_shieldboost_compound():
    result = apply_blueprint_grade(
        base_stats={"shieldboost": 0.0},
        features={"shieldboost": (0.2, 0.6)},
        grade=5,
    )
    assert result["shieldboost"] == (1 + 0.0) * (1 + 0.6) - 1


def test_apply_blueprint_grade_hullboost_compound():
    result = apply_blueprint_grade(
        base_stats={"hullboost": 0.5},
        features={"hullboost": (0.2, 0.4)},
        grade=5,
    )
    assert result["hullboost"] == (1 + 0.5) * (1 + 0.4) - 1


def test_apply_blueprint_grade_with_special():
    result = apply_blueprint_grade(
        base_stats={"damage": 10.0},
        features={"damage": (0.5, 1.0)},
        grade=5,
        special_features={"damage": (0.1, 0.2)},
    )
    assert result["damage"] == 10.0 * (1 + 1.0 + 0.2)


def test_apply_blueprint_grade_quality():
    result_low = apply_blueprint_grade(
        base_stats={"damage": 10.0},
        features={"damage": (0.0, 1.0)},
        grade=5,
        roll_quality=0.0,
    )
    result_high = apply_blueprint_grade(
        base_stats={"damage": 10.0},
        features={"damage": (0.0, 1.0)},
        grade=5,
        roll_quality=1.0,
    )
    assert result_low["damage"] < result_high["damage"]


def test_compute_engineering_changes_no_blueprint():
    result = compute_engineering_changes(
        {"damage": 10.0},
        {"blueprintName": "FakeBP", "grade": 1},
    )
    assert isinstance(result, AppliedModification)


def test_compute_engineering_changes_with_experimental():
    result = compute_engineering_changes(
        {"damage": 10.0},
        {
            "blueprintName": "FakeBP",
            "grade": 1,
            "experimentalEffect": "FakeSpecial",
        },
    )
    assert isinstance(result, AppliedModification)


def test_apply_blueprint_grade_missile_rof():
    result = apply_blueprint_grade(
        base_stats={"damage": 10.0, "rof": 1.5},
        features={"damage": (-0.1, -0.05), "rof": (-0.15, -0.10)},
        grade=5,
    )
    assert "damage" in result
    assert "rof" in result
