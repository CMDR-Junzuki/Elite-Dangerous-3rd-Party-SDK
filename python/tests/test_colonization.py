from elite_dangerous_sdk.planner import (
    ColonyState,
    COLONY_STATE_NAMES,
    ConstructionResource,
    create_construction_site,
    get_resource_shortfall,
    get_total_progress,
    parse_colonisation_construction_depot,
    apply_tax,
    get_pre_req_needed,
    has_pre_req2,
    predict_surface_slots,
)


def test_colony_state_enum():
    assert len(ColonyState) == 6
    assert ColonyState.NONE.value == 0
    assert ColonyState.ACTIVE.value == 4


def test_colony_state_names():
    assert COLONY_STATE_NAMES[ColonyState.NONE] == "None"
    assert COLONY_STATE_NAMES[ColonyState.ACTIVE] == "Active"


def test_create_construction_site():
    site = create_construction_site(1234, True)
    assert site.market_id == 1234
    assert site.primary_port is True
    assert site.construction_progress == 0.0


def test_get_resource_shortfall():
    r = ConstructionResource(
        name="$steel_name;", name_localised="Steel",
        required_amount=1000, provided_amount=300, payment=500,
    )
    assert get_resource_shortfall(r) == 700

    r2 = ConstructionResource(
        name="$steel_name;", name_localised="Steel",
        required_amount=1000, provided_amount=1200, payment=500,
    )
    assert get_resource_shortfall(r2) == 0


def test_get_total_progress():
    site = create_construction_site(1)
    assert get_total_progress(site) == 0.0

    site.resources_required = [
        ConstructionResource(name="$steel_name;", name_localised="Steel", required_amount=1000, provided_amount=500, payment=500),
        ConstructionResource(name="$titanium_name;", name_localised="Titanium", required_amount=500, provided_amount=500, payment=300),
    ]
    assert abs(get_total_progress(site) - 1000.0 / 1500.0) < 0.001


def test_parse_colonisation_construction_depot():
    site = parse_colonisation_construction_depot({
        "MarketID": 3956008962,
        "ConstructionProgress": 0.703,
        "ConstructionComplete": False,
        "ConstructionFailed": False,
        "ResourcesRequired": [
            {"Name": "$aluminium_name;", "Name_Localised": "Aluminium", "RequiredAmount": 491, "ProvidedAmount": 491, "Payment": 3239},
            {"Name": "$steel_name;", "Name_Localised": "Steel", "RequiredAmount": 1000, "ProvidedAmount": 300, "Payment": 5000},
        ],
    })
    assert site.market_id == 3956008962
    assert abs(site.construction_progress - 0.703) < 0.001
    assert site.construction_complete is False
    assert len(site.resources_required) == 2
    assert site.resources_required[0].name_localised == "Aluminium"
    assert site.resources_required[1].name_localised == "Steel"
    assert site.resources_required[1].required_amount == 1000
    assert site.resources_required[1].provided_amount == 300
    assert get_resource_shortfall(site.resources_required[1]) == 700


# --- apply_tax ---


def test_apply_tax_no_tax():
    assert apply_tax(2, 100, -1) == 100
    assert apply_tax(3, 100, -2) == 100
    assert apply_tax(2, 50, 0) == 50


def test_apply_tax_tier2():
    cost = apply_tax(2, 100, 1)
    assert cost == 175  # 100 + int(100 * 0.75 * 1)


def test_apply_tax_tier2_two():
    cost = apply_tax(2, 100, 2)
    assert cost == 250  # 100 + int(100 * 0.75 * 2)


def test_apply_tax_tier3():
    cost = apply_tax(3, 100, 1)
    assert cost == 200  # 100 + 100 * 1


def test_apply_tax_tier3_two():
    cost = apply_tax(3, 100, 2)
    assert cost == 300  # 100 + 100 * 2


# --- get_pre_req_needed ---


def test_get_pre_req_needed_satellite():
    assert get_pre_req_needed({"preReq": "satellite"}) == ["hermes", "angelia", "eirene"]


def test_get_pre_req_needed_comms():
    assert get_pre_req_needed({"preReq": "comms"}) == ["pistis", "soter", "aletheia"]


def test_get_pre_req_needed_installation_mil():
    result = get_pre_req_needed({"preReq": "installationMil"})
    assert result == ["vacuna", "alastor"]


def test_get_pre_req_needed_unknown():
    assert get_pre_req_needed({"preReq": ""}) == []
    assert get_pre_req_needed({}) == []


def test_get_pre_req_needed_all_keys():
    cases = {
        "satellite": ["hermes", "angelia", "eirene"],
        "comms": ["pistis", "soter", "aletheia"],
        "settlementAgr": ["consus", "picumnus", "annona", "ceres", "fornax"],
        "installationAgr": ["demeter"],
        "installationMil": ["vacuna", "alastor"],
        "outpostMining": ["euthenia", "phorcys"],
        "relay": ["enodia", "ichnaea"],
        "settlementBio": ["pheobe", "asteria", "caerus", "chronos"],
        "settlementTourist": ["aergia", "comus", "gelos", "fufluns"],
        "settlementMilitary": ["ioke", "bellona", "enyo", "polemos", "minerva"],
        "settlementExtraction": ["ourea", "mantus", "orcus", "aerecura", "erebus"],
    }
    for pre_req, expected in cases.items():
        assert get_pre_req_needed({"preReq": pre_req}) == expected, f"Failed for {pre_req}"


# --- has_pre_req2 ---


def test_has_pre_req2_none_sitemaps():
    assert has_pre_req2(None, {"preReq": "satellite"}) is True


def test_has_pre_req2_matching():
    sites = [
        {"status": "complete", "buildType": "hermes_1"},
    ]
    assert has_pre_req2(sites, {"preReq": "satellite"}) is True


def test_has_pre_req2_no_match():
    sites = [
        {"status": "complete", "buildType": "ioke_1"},
    ]
    assert has_pre_req2(sites, {"preReq": "satellite"}) is False


def test_has_pre_req2_demolish_ignored():
    sites = [
        {"status": "demolish", "buildType": "hermes_1"},
    ]
    assert has_pre_req2(sites, {"preReq": "satellite"}) is False


def test_has_pre_req2_no_prereq():
    assert has_pre_req2([{"status": "complete", "buildType": "foo"}], {}) is False


def test_has_pre_req2_multiple_sites():
    sites = [
        {"status": "plan", "buildType": "oak"},
        {"status": "complete", "buildType": "vacuna_base"},
    ]
    assert has_pre_req2(sites, {"preReq": "installationMil"}) is True


# --- predict_surface_slots ---


def test_predict_surface_slots_unknown():
    assert predict_surface_slots({"type": "un", "features": [], "temp": 300, "gravity": 1.0, "radius": 5000, "subType": ""}) == -1


def test_predict_surface_slots_too_hot():
    body = {"type": "hmc", "features": ["landable"], "temp": 701, "gravity": 1.0, "radius": 5000, "subType": ""}
    assert predict_surface_slots(body) == 0


def test_predict_surface_slots_too_high_gravity():
    body = {"type": "hmc", "features": ["landable"], "temp": 300, "gravity": 2.8, "radius": 5000, "subType": ""}
    assert predict_surface_slots(body) == 0


def test_predict_surface_slots_not_landable():
    body = {"type": "hmc", "features": [], "temp": 300, "gravity": 1.0, "radius": 5000, "subType": ""}
    assert predict_surface_slots(body) == 0


def test_predict_surface_slots_small_radius():
    body = {"type": "hmc", "features": ["landable"], "temp": 300, "gravity": 1.0, "radius": 1499, "subType": ""}
    assert predict_surface_slots(body) == 1


def test_predict_surface_slots_medium_radius():
    body = {"type": "hmc", "features": ["landable"], "temp": 300, "gravity": 1.0, "radius": 2000, "subType": ""}
    assert predict_surface_slots(body) == 2


def test_predict_surface_slots_large_radius():
    body = {"type": "hmc", "features": ["landable"], "temp": 300, "gravity": 1.0, "radius": 4000, "subType": ""}
    assert predict_surface_slots(body) == 3


def test_predict_surface_slots_huge_radius():
    body = {"type": "hmc", "features": ["landable"], "temp": 300, "gravity": 1.0, "radius": 6000, "subType": ""}
    assert predict_surface_slots(body) == 4


def test_predict_surface_slots_hmc_bonus():
    body = {"type": "hmc", "features": ["landable"], "temp": 300, "gravity": 1.0, "radius": 1000, "subType": "High metal content world"}
    assert predict_surface_slots(body) == 2  # 1 base + 1 HMC


def test_predict_surface_slots_terraformable():
    body = {"type": "hmc", "features": ["landable", "terraformable"], "temp": 300, "gravity": 1.0, "radius": 1000, "subType": ""}
    assert predict_surface_slots(body) == 2  # 1 base + 1 terraformable


def test_predict_surface_slots_volcanism():
    body = {"type": "hmc", "features": ["landable", "volcanism"], "temp": 300, "gravity": 1.0, "radius": 1000, "subType": ""}
    assert predict_surface_slots(body) == 2  # 1 base + 1 volcanism


def test_predict_surface_slots_geo():
    body = {"type": "hmc", "features": ["landable", "geo"], "temp": 300, "gravity": 1.0, "radius": 1000, "subType": ""}
    assert predict_surface_slots(body) == 2  # 1 base + 1 geo


def test_predict_surface_slots_atmosphere():
    body = {"type": "hmc", "features": ["landable", "atmosphere"], "temp": 300, "gravity": 1.0, "radius": 1000, "subType": ""}
    assert predict_surface_slots(body) == 3  # 1 base + 2 atmosphere


def test_predict_surface_slots_all_bonuses_capped():
    body = {
        "type": "hmc",
        "features": ["landable", "terraformable", "volcanism", "atmosphere"],
        "temp": 300, "gravity": 1.0, "radius": 6000,
        "subType": "High metal content world",
    }
    # 4 base + 1 HMC + 1 terraformable + 1 volcanism + 2 atmosphere = 9, capped to 7
    assert predict_surface_slots(body) == 7


def test_predict_surface_slots_edge_temp():
    body = {"type": "hmc", "features": ["landable"], "temp": 700, "gravity": 1.0, "radius": 5000, "subType": ""}
    assert predict_surface_slots(body) > 0  # 700 is not > 700


def test_predict_surface_slots_edge_gravity():
    body = {"type": "hmc", "features": ["landable"], "temp": 300, "gravity": 2.7, "radius": 5000, "subType": ""}
    assert predict_surface_slots(body) > 0  # 2.7 is not > 2.7
