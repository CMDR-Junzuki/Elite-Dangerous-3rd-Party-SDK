"""Tests for planner subsystems: materials, engineers, trade, fleet carrier, powerplay."""

from elite_dangerous_sdk.planner import (
    MaterialEntry, MaterialInventory, BlueprintRequirement,
    create_inventory, update_inventory, can_craft_blueprint,
    get_all_engineers, find_engineer, get_engineer_unlock_requirements,
    calculate_trade_profit, rank_trade_routes, filter_trade_routes,
    TradeRoute, TradeStation, TradeCommodity,
    calculate_jump_fuel_cost, estimate_jump_time,
    calculate_weekly_maintenance, can_afford_maintenance,
    MATERIAL_CAPS, MICRO_RESOURCE_CAPS,
    PowerplaySystemType, POWERPLAY_SYSTEM_TYPES,
)


def test_create_inventory():
    inv = create_inventory()
    assert isinstance(inv, MaterialInventory)
    assert len(inv.materials) > 50
    assert inv.materials[0].name == "Iron"
    assert inv.materials[0].max_capacity == 3000


def test_update_inventory():
    inv = create_inventory()
    updated = update_inventory(inv, "Iron", 10)
    iron = next(m for m in updated.materials if m.name == "Iron")
    assert iron.count == 10


def test_update_inventory_negative():
    inv = create_inventory()
    updated = update_inventory(inv, "Iron", -5)
    iron = next(m for m in updated.materials if m.name == "Iron")
    assert iron.count == 0


def test_update_inventory_unknown():
    inv = create_inventory()
    updated = update_inventory(inv, "UnknownMaterial", 5)
    assert len(updated.materials) == len(inv.materials)


def test_can_craft_blueprint_sufficient():
    inv = create_inventory()
    inv = update_inventory(inv, "Iron", 100)
    reqs = [BlueprintRequirement("Iron", 10, 1)]
    ok, missing = can_craft_blueprint(inv, reqs)
    assert ok is True
    assert missing == []


def test_can_craft_blueprint_insufficient():
    inv = create_inventory()
    reqs = [BlueprintRequirement("Iron", 10, 1)]
    ok, missing = can_craft_blueprint(inv, reqs)
    assert ok is False
    assert len(missing) > 0


def test_get_all_engineers():
    engs = get_all_engineers()
    assert len(engs) == 38


def test_find_engineer_by_name():
    felicity = find_engineer("Felicity Farseer")
    assert felicity is not None
    assert felicity.name == "Felicity Farseer"


def test_find_engineer_unknown():
    eng = find_engineer("Nonexistent Engineer")
    assert eng is None


def test_get_engineer_unlock_requirements():
    reqs = get_engineer_unlock_requirements("Felicity Farseer")
    assert len(reqs) > 0
    assert any("Meta-Alloys" in r for r in reqs)


def test_calculate_trade_profit():
    result = calculate_trade_profit(100, 500, 100)
    assert result["per_unit"] == 400
    assert result["total"] == 40000


def test_calculate_trade_profit_zero():
    result = calculate_trade_profit(500, 100, 100)
    assert result["per_unit"] == -400


def test_rank_trade_routes():
    routes = [
        TradeRoute(
            source=TradeStation("A", "Sys1"),
            destination=TradeStation("B", "Sys2"),
            commodity=TradeCommodity("gold", "Gold", "Metals", 100, 500, 1000, 500, False),
            profit_per_unit=400, total_profit=40000,
            cargo_capacity=100, distance_ly=10, profit_per_ly=4000,
        ),
        TradeRoute(
            source=TradeStation("C", "Sys3"),
            destination=TradeStation("D", "Sys4"),
            commodity=TradeCommodity("silver", "Silver", "Metals", 200, 400, 1000, 500, False),
            profit_per_unit=200, total_profit=20000,
            cargo_capacity=100, distance_ly=5, profit_per_ly=4000,
        ),
    ]
    ranked = rank_trade_routes(routes, top_n=1)
    assert len(ranked) == 1
    assert ranked[0].profit_per_unit == 400


def test_filter_trade_routes():
    routes = [
        TradeRoute(
            source=TradeStation("A", "Sys1"),
            destination=TradeStation("B", "Sys2"),
            commodity=TradeCommodity("gold", "Gold", "Metals", 100, 500, 1000, 500, False),
            profit_per_unit=400, total_profit=40000,
            cargo_capacity=100, distance_ly=10, profit_per_ly=4000,
        ),
        TradeRoute(
            source=TradeStation("C", "Sys3"),
            destination=TradeStation("D", "Sys4"),
            commodity=TradeCommodity("silver", "Silver", "Metals", 200, 400, 1000, 500, False),
            profit_per_unit=200, total_profit=20000,
            cargo_capacity=50, distance_ly=5, profit_per_ly=4000,
        ),
    ]
    filtered = filter_trade_routes(routes, min_profit_per_unit=300)
    assert len(filtered) == 1
    assert filtered[0].profit_per_unit == 400


def test_calculate_jump_fuel_cost():
    cost = calculate_jump_fuel_cost(10, 500)
    assert isinstance(cost, int)
    assert cost > 0


def test_estimate_jump_time():
    result = estimate_jump_time()
    assert "charge_minutes" in result
    assert "cooldown_minutes" in result
    assert "total_minutes" in result


def test_calculate_weekly_maintenance():
    cost = calculate_weekly_maintenance(["Refuel", "Repair"])
    assert isinstance(cost, int)
    assert cost > 0


def test_calculate_weekly_maintenance_empty():
    cost = calculate_weekly_maintenance([])
    assert cost == 5000000


def test_can_afford_maintenance_true():
    assert can_afford_maintenance(1000000, 50000) is True


def test_can_afford_maintenance_false():
    assert can_afford_maintenance(10000, 50000) is False


def test_material_caps():
    for grade in range(1, 6):
        assert MATERIAL_CAPS[grade] == 3000


def test_micro_resource_caps():
    for grade in range(1, 6):
        assert MICRO_RESOURCE_CAPS[grade] == 3000


def test_powerplay_system_type_enum():
    assert PowerplaySystemType.UNDEFINED == 0
    assert PowerplaySystemType.CONTROL == 1
    assert PowerplaySystemType.EXPLOITED == 2
    assert PowerplaySystemType.STRONGHOLD == 3
    assert PowerplaySystemType.FORTIFIED == 4
    assert PowerplaySystemType.PREPARATION == 5
    assert PowerplaySystemType.EXPANSION == 6
    assert PowerplaySystemType.CONTESTED == 7


def test_powerplay_system_types_constant():
    assert POWERPLAY_SYSTEM_TYPES[0] == "Undefined"
    assert POWERPLAY_SYSTEM_TYPES[1] == "Control"
    assert POWERPLAY_SYSTEM_TYPES[7] == "Contested"
