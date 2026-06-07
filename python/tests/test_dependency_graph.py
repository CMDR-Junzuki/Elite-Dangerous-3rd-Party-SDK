import pytest
from elite_dangerous_sdk.planner.dependency_graph import (
    evaluate_build, trade_ratio, BuildEvaluation, MaterialRequirement,
)
from elite_dangerous_sdk.planner import (
    PlannedModification, create_inventory,
)


class TestEvaluateBuild:
    def test_empty(self):
        result = evaluate_build([])
        assert result.plan.materials == []
        assert result.requirements == []
        assert result.missing == []
        assert result.can_craft_all is True
        assert result.can_craft_with_trades is True
        assert result.total_materials_needed == 0
        assert result.total_missing == 0
        assert result.engineers == []

    def test_computes_requirements_fsd_g5(self):
        result = evaluate_build([
            PlannedModification(module_group="fsd", blueprint_name="FSD_LongRange", grade=5),
        ])
        assert len(result.requirements) > 0
        assert result.total_materials_needed > 0
        assert "Felicity Farseer" in result.engineers
        assert result.can_craft_all is False

    def test_sufficient_inventory(self):
        inv = create_inventory()
        for m in inv.materials:
            m.count = 9999
        result = evaluate_build([
            PlannedModification(module_group="fsd", blueprint_name="FSD_LongRange", grade=5),
        ], inv)
        assert result.can_craft_all is True
        assert result.missing == []
        assert result.total_missing == 0

    def test_partial_inventory(self):
        inv = create_inventory()
        for m in inv.materials:
            if m.name == "Arsenic":
                m.count = 1

        result = evaluate_build([
            PlannedModification(module_group="fsd", blueprint_name="FSD_LongRange", grade=5),
        ], inv)

        arsenic_req = next((r for r in result.requirements if r.name == "Arsenic"), None)
        assert arsenic_req is not None
        assert arsenic_req.available == 1
        assert arsenic_req.missing == arsenic_req.needed - 1

    def test_trade_up_options(self):
        inv = create_inventory()
        from elite_dangerous_sdk.data import material as mat_data
        # Build name->grade lookup for identifying G1 raw materials
        g1_raw_names = {
            m["name"]
            for m in mat_data
            if int(m.get("rarity", 1)) == 1 and m.get("type", "").lower() == "raw"
        }
        for m in inv.materials:
            if m.name in g1_raw_names:
                m.count = 3000

        result = evaluate_build([
            PlannedModification(module_group="fsd", blueprint_name="FSD_LongRange", grade=5),
        ], inv)

        assert len(result.missing) > 0
        for mm in result.missing:
            if mm.category == "raw":
                assert len(mm.trade_ups) > 0

    def test_trade_ups_cover_missing(self):
        inv = create_inventory()
        from elite_dangerous_sdk.data import material as mat_data
        g1_names = {
            m["name"]
            for m in mat_data
            if int(m.get("rarity", 1)) == 1
        }
        for m in inv.materials:
            if m.name in g1_names:
                m.count = 3000

        result = evaluate_build([
            PlannedModification(module_group="fsd", blueprint_name="FSD_LongRange", grade=5),
        ], inv)

        assert result.can_craft_all is False
        any_feasible = any(mm.can_trade_up for mm in result.missing)
        assert any_feasible is True


class TestTradeRatio:
    def test_same_grade(self):
        assert trade_ratio(1, 1) == 6
        assert trade_ratio(5, 5) == 6

    def test_one_grade_apart(self):
        assert trade_ratio(1, 2) == 6
        assert trade_ratio(4, 5) == 6

    def test_two_grades_apart(self):
        assert trade_ratio(1, 3) == 36
        assert trade_ratio(3, 1) == 36

    def test_three_grades_apart(self):
        assert trade_ratio(1, 4) == 216

    def test_four_grades_apart(self):
        assert trade_ratio(1, 5) == 1296
