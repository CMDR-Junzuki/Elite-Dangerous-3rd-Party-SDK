"""Tests for embedded game data (coriolis, fdevids, maps)."""

from elite_dangerous_sdk.data import coriolis, fdevids, maps


def test_coriolis_ships_count():
    assert len(coriolis.ships) >= 38


def test_coriolis_ships_contains_sidewinder():
    s = coriolis.ships_by_name.get("Sidewinder")
    assert s is not None
    assert s["properties"]["hullMass"] == 25


def test_coriolis_ships_sidewinder_edid():
    s = coriolis.ships_by_name.get("Sidewinder")
    assert s["edID"] == 128049249


def test_coriolis_ships_anaconda_hardpoints():
    s = coriolis.ships_by_name.get("Anaconda")
    assert s is not None
    assert len(s["slots"]["hardpoints"]) >= 8
    assert s["slots"]["hardpoints"][0] >= 4


def test_coriolis_each_ship_required_fields():
    for name, ship in coriolis.ships_by_name.items():
        assert ship.get("edID") is not None
        assert ship["properties"]["name"]
        assert ship["properties"]["hullMass"] > 0


def test_coriolis_ships_by_edid_populated():
    assert len(coriolis.ships_by_edid) >= 38


def test_coriolis_standard_modules_pp():
    pp = [m for m in coriolis.standard_modules if m.get("grp") == "pp"]
    assert len(pp) >= 8


def test_coriolis_standard_modules_fsd():
    fsd = [m for m in coriolis.standard_modules if m.get("grp") == "fsd"]
    assert len(fsd) >= 8


def test_coriolis_hardpoint_modules_weapons():
    weapons = [m for m in coriolis.hardpoint_modules if m.get("grp") in ("mc", "pl")]
    assert len(weapons) >= 4


def test_coriolis_all_module_maps_populated():
    assert len(coriolis.standard_modules_by_edid) > 0
    assert len(coriolis.hardpoint_modules_by_edid) > 0
    assert len(coriolis.internal_modules_by_edid) > 0


def test_coriolis_all_modules_count():
    assert len(coriolis.all_modules) > 0


def test_coriolis_blueprints_populated():
    assert len(coriolis.blueprints) > 0
    assert "FSD_LongRange" in coriolis.blueprints


def test_coriolis_modifications_populated():
    assert len(coriolis.modifications) > 0
    assert "damage" in coriolis.modifications


def test_fdevids_commodities():
    assert len(fdevids.commodities) >= 100
    bertrandite = fdevids.commodities_by_symbol.get("Bertrandite")
    assert bertrandite is not None
    assert bertrandite["category"] == "Minerals"


def test_fdevids_sidewinder():
    found = [s for s in fdevids.shipyard if s["symbol"] == "SideWinder"]
    assert len(found) == 1
    assert found[0]["name"] == "Sidewinder"


def test_fdevids_shipyard_count():
    assert len(fdevids.shipyard) >= 38


def test_fdevids_outfitting_populated():
    assert len(fdevids.outfitting) > 0
    assert any(o.get("category") == "standard" for o in fdevids.outfitting)


def test_fdevids_engineers():
    assert len(fdevids.engineers) >= 38
    felicity = fdevids.engineers_by_id.get(300100)
    assert felicity is not None
    assert felicity["name"] == "Felicity Farseer"


def test_fdevids_materials():
    assert len(fdevids.material) >= 50
    assert any(m["type"] == "Raw" for m in fdevids.material)
    assert any(m["type"] == "Manufactured" for m in fdevids.material)
    assert any(m["type"] == "Encoded" for m in fdevids.material)


def test_fdevids_ranks():
    assert len(fdevids.combatrank) >= 9
    assert len(fdevids.traderank) >= 9
    assert len(fdevids.explorationrank) >= 9
    assert len(fdevids.empererank) >= 15
    assert len(fdevids.federationrank) >= 15
    assert len(fdevids.cqcrank) >= 9


def test_fdevids_economy():
    assert len(fdevids.economy) > 0
    assert any(e["name"] == "Agriculture" for e in fdevids.economy)


def test_fdevids_government():
    assert len(fdevids.government) > 0
    assert any(g["name"] == "Democracy" for g in fdevids.government)


def test_fdevids_allegiance():
    assert len(fdevids.systemallegiance) > 0
    first = fdevids.systemallegiance[0]
    key = next(k for k in first if "allegiance" in k.lower() and "system" in k.lower())
    names = [a[key] for a in fdevids.systemallegiance]
    assert "Federation" in names
    assert "Empire" in names


def test_fdevids_security():
    assert len(fdevids.security) > 0
    assert any(s["name"] == "High" for s in fdevids.security)


def test_maps_ship_name_map():
    assert len(maps.SHIP_NAME_MAP) > 0


def test_maps_get_ship_display_name():
    name = maps.get_ship_display_name("SideWinder")
    assert name == "Sidewinder"


def test_maps_get_module_by_ed_id():
    m = maps.get_module_by_ed_id(128064128)
    assert m is not None
    assert m.get("grp") == "fsd"


def test_maps_get_module_display_name():
    name = maps.get_module_display_name("Int_Hyperdrive_Size2_Class1")
    assert name is not None


def test_maps_parse_module_symbol():
    result = maps.parse_module_symbol("Int_Hyperdrive_Size2_Class1")
    assert result is not None
    assert result["class"] == 2
    assert result["rating"] == "E"
    assert "name" in result


def test_maps_slot_name_map():
    assert len(maps.SLOT_NAME_MAP) > 0


def test_maps_weapon_mount_map():
    assert len(maps.WEAPON_MOUNT_MAP) > 0
