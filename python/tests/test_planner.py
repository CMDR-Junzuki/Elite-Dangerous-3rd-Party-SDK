from elite_dangerous_sdk.planner import (
    get_merits_for_rank, merits_to_next_rank, get_powerplay_salary,
    estimate_merits_bracket, estimate_merits_per_hour, POWERS,
    POWERPLAY_SALARIES,
    get_engineers_by_type, estimate_engineer_progress,
)


def test_powers_list():
    assert len(POWERS) == 13
    assert "Aisling Duval" in POWERS
    assert "Nakato Kaine" in POWERS


def test_merits_for_rank():
    assert get_merits_for_rank(1) == 0
    assert get_merits_for_rank(2) == 2000
    assert get_merits_for_rank(3) == 5000
    assert get_merits_for_rank(4) == 9000
    assert get_merits_for_rank(5) == 15000
    assert get_merits_for_rank(6) == 23000
    assert get_merits_for_rank(10) == 55000
    assert get_merits_for_rank(100) == 775000


def test_merits_to_next_rank():
    assert merits_to_next_rank(0) == {"rank": 1, "merits_needed": 2000}
    assert merits_to_next_rank(2000) == {"rank": 2, "merits_needed": 3000}
    assert merits_to_next_rank(50000) == {"rank": 9, "merits_needed": 5000}
    assert merits_to_next_rank(775000) == {"rank": 100, "merits_needed": 0}


def test_get_powerplay_salary():
    assert get_powerplay_salary("top_100_pct") == 500000
    assert get_powerplay_salary("top_75_pct") == 2500000
    assert get_powerplay_salary("top_50_pct") == 5000000
    assert get_powerplay_salary("top_25_pct") == 10000000
    assert get_powerplay_salary("top_10_pct") == 50000000
    assert get_powerplay_salary("top_10") == 100000000
    assert get_powerplay_salary("top_1") == 1000000000


def test_powerplay_salaries_match():
    for bracket, salary in POWERPLAY_SALARIES.items():
        assert get_powerplay_salary(bracket) == salary


def test_estimate_merits_bracket():
    assert estimate_merits_bracket(0) == "top_100_pct"
    assert estimate_merits_bracket(100) == "top_100_pct"
    assert estimate_merits_bracket(1000) == "top_75_pct"
    assert estimate_merits_bracket(5000) == "top_50_pct"
    assert estimate_merits_bracket(10000) == "top_25_pct"
    assert estimate_merits_bracket(50000) == "top_10_pct"
    assert estimate_merits_bracket(200000) == "top_10"
    assert estimate_merits_bracket(500000) == "top_1"


def test_estimate_merits_per_hour():
    assert estimate_merits_per_hour("mining") > 0
    assert estimate_merits_per_hour("combat_zone") > 0
    assert estimate_merits_per_hour("unknown_activity") == 3000


def test_get_engineers_by_type_ship_returns_25():
    engs = get_engineers_by_type("ship")
    assert len(engs) == 25
    assert "Felicity Farseer" in engs
    assert "The Sarge" in engs
    assert "Domino Green" not in engs


def test_get_engineers_by_type_on_foot_returns_13():
    engs = get_engineers_by_type("on-foot")
    assert len(engs) == 13
    assert "Domino Green" in engs
    assert "Yi Shen" in engs
    assert "Felicity Farseer" not in engs


def test_get_engineers_by_type_unknown_returns_empty():
    assert get_engineers_by_type("flying") == []


def test_estimate_engineer_progress_known():
    result = estimate_engineer_progress("Felicity Farseer", 3)
    assert result["engineer"].name == "Felicity Farseer"
    assert result["grades"] == ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"]
    assert result["progress"] == 0.6


def test_estimate_engineer_progress_unknown():
    result = estimate_engineer_progress("Fake Engineer", 2)
    assert result["engineer"].name == "Fake Engineer"
    assert result["engineer"].id == 0
    assert result["progress"] == 0.4


def test_estimate_engineer_progress_max_grade():
    result = estimate_engineer_progress("Felicity Farseer", 5)
    assert result["progress"] == 1.0
    assert result["grades"][0] == "Grade 1"


def test_estimate_engineer_progress_zero_grade():
    result = estimate_engineer_progress("Felicity Farseer", 0)
    assert result["progress"] == 0.0


from elite_dangerous_sdk.planner import (
    plan_engineering, PlannedModification, get_blueprint_components,
    get_experimental_effect_components, get_engineers_for_blueprint,
)


def test_plan_engineering_empty():
    plan = plan_engineering([])
    assert plan.materials == []
    assert plan.material_total == {}
    assert plan.engineers == []
    assert plan.engineer_visits == []


def test_plan_engineering_fsd_g5():
    plan = plan_engineering([
        PlannedModification(module_group="fsd", blueprint_name="FSD_LongRange", grade=5),
    ])
    assert len(plan.materials) > 0
    assert plan.material_total.get("Arsenic", 0) > 0
    assert plan.material_total.get("Chemical Manipulators", 0) > 0
    assert "Felicity Farseer" in plan.engineers
    assert "Elvira Martuuk" in plan.engineers


def test_plan_engineering_experimental():
    plan = plan_engineering([
        PlannedModification(
            module_group="fsd", blueprint_name="FSD_LongRange", grade=5,
            experimental_effect="special_fsd_heavy",
        ),
    ])
    exp_mats = [m for m in plan.materials if m.source == "experimental"]
    assert len(exp_mats) > 0
    assert plan.material_total.get("Eccentric Hyperspace Trajectories", 0) > 0


def test_plan_engineering_unknown_group():
    plan = plan_engineering([
        PlannedModification(module_group="nonexistent", blueprint_name="FSD_LongRange", grade=5),
    ])
    assert plan.engineers == []


def test_get_blueprint_components():
    comps = get_blueprint_components("FSD_LongRange", 5)
    assert len(comps) > 0
    for c in comps:
        assert c.source == "blueprint"
        assert c.grade == 5
        assert c.material
        assert c.quantity > 0


def test_get_blueprint_components_unknown():
    assert get_blueprint_components("Nonexistent_BP", 1) == []


def test_get_experimental_effect_components():
    comps = get_experimental_effect_components("special_fsd_heavy")
    if comps:
        for c in comps:
            assert c.source == "experimental"
            assert c.material


def test_get_experimental_effect_components_unknown():
    assert get_experimental_effect_components("special_nonexistent") == []


def test_get_engineers_for_blueprint():
    engs = get_engineers_for_blueprint("fsd", "FSD_LongRange", 5)
    assert "Felicity Farseer" in engs
    assert len(engs) >= 1


def test_get_engineers_for_blueprint_unknown():
    assert get_engineers_for_blueprint("nonexistent", "FSD_LongRange", 5) == []
