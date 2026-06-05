from elite_dangerous_sdk.planner import (
    ThargoidWarState,
    THARGOID_WAR_STATE_NAMES,
    TITANS,
    TITAN_NAMES,
    get_titan_by_name,
    get_titan_by_system,
    get_all_titans,
    get_defeated_titans,
    parse_thargoid_war_state,
)


def test_thargoid_war_state_enum():
    assert len(ThargoidWarState) == 6
    assert ThargoidWarState.ALERT.value == 20
    assert ThargoidWarState.INVASION.value == 30
    assert ThargoidWarState.CONTROLLED.value == 40
    assert ThargoidWarState.RECOVERY.value == 50
    assert ThargoidWarState.MAELSTROM.value == 70


def test_thargoid_war_state_names():
    assert THARGOID_WAR_STATE_NAMES[ThargoidWarState.NONE] == "None"
    assert THARGOID_WAR_STATE_NAMES[ThargoidWarState.ALERT] == "Alert"
    assert THARGOID_WAR_STATE_NAMES[ThargoidWarState.INVASION] == "Invasion"


def test_titan_count():
    assert len(TITAN_NAMES) == 8
    for name in TITAN_NAMES:
        assert name in TITANS
        assert TITANS[name]["state"] == "defeated"


def test_get_titan_by_name():
    taranis = get_titan_by_name("Taranis")
    assert taranis is not None
    assert taranis.system_name == "Hyades Sector FB-N b7-6"
    assert get_titan_by_name("Unknown") is None


def test_get_titan_by_system():
    cocijo = get_titan_by_system("Col 285 Sector BA-P c6-18")
    assert cocijo is not None
    assert cocijo.name == "Cocijo"


def test_get_all_titans():
    assert len(get_all_titans()) == 8


def test_get_defeated_titans():
    assert len(get_defeated_titans()) == 8


def test_parse_thargoid_war_state():
    assert parse_thargoid_war_state(None) == ThargoidWarState.NONE
    assert parse_thargoid_war_state("Alert") == ThargoidWarState.ALERT
    assert parse_thargoid_war_state("Invasion") == ThargoidWarState.INVASION
    assert parse_thargoid_war_state("Controlled") == ThargoidWarState.CONTROLLED
    assert parse_thargoid_war_state("Recovery") == ThargoidWarState.RECOVERY
    assert parse_thargoid_war_state("Maelstrom") == ThargoidWarState.MAELSTROM
    assert parse_thargoid_war_state("Unknown") == ThargoidWarState.NONE
