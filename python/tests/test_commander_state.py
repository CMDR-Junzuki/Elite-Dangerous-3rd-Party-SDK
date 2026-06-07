"""Tests for CommanderStateEngine."""

from elite_dangerous_sdk.commander_state import CommanderStateEngine


def test_export_returns_deep_clone():
    engine = CommanderStateEngine()
    engine.update({"event": "LoadGame", "Commander": "Test", "FID": "F1", "Ship": "Sidewinder", "ShipID": 1, "Credits": 1000, "Loan": 0, "GameMode": "Open"})
    snapshot = engine.export()
    assert snapshot["commander"]["name"] == "Test"
    snapshot["commander"]["name"] = "Mutated"
    assert engine.get_state().commander.name == "Test"


def test_import_restores_state():
    engine = CommanderStateEngine()
    engine.update({"event": "LoadGame", "Commander": "Alpha", "FID": "F42", "Ship": "Python", "ShipID": 7, "Credits": 5000000, "Loan": 0, "GameMode": "Open"})
    engine.update({"event": "Location", "StarSystem": "Sol", "SystemAddress": 1, "StarPos": [0, 0, 0], "Docked": False})
    snapshot = engine.export()
    engine.update({"event": "FSDJump", "StarSystem": "Achernar", "SystemAddress": 2, "StarPos": [10, 0, 0], "JumpDist": 50, "FuelLevel": 30})
    assert engine.get_state().location.system == "Achernar"
    engine.import_(snapshot)
    assert engine.get_state().commander.name == "Alpha"
    assert engine.get_state().location.system == "Sol"


def test_import_empty_snapshot_resets():
    engine = CommanderStateEngine()
    engine.update({"event": "LoadGame", "Commander": "X", "FID": "X", "Ship": "S", "ShipID": 1, "Credits": 0, "Loan": 0, "GameMode": "Open"})
    engine.import_({
        "commander": {"name": "", "fid": "", "credits": 0, "loan": 0, "ranks": {}, "progress": {}},
        "location": {},
        "ship": {},
        "fleet": [],
        "materials": {},
        "missions": [],
        "carrier": None,
        "navRoute": [],
        "flags": {},
    })
    assert engine.get_state().commander.name == ""


def test_initial_state():
    engine = CommanderStateEngine()
    state = engine.get_state()
    assert state.commander.name == ""
    assert state.ship.current == ""
    assert state.location.system == ""
    assert state.missions == []
    assert state.carrier is None
    assert state.navRoute == []


def test_reset():
    engine = CommanderStateEngine()
    engine.update({"event": "LoadGame", "Commander": "Test", "FID": "F123", "Ship": "Sidewinder", "ShipID": 1, "Credits": 1000, "Loan": 0, "GameMode": "Open"})
    assert engine.get_state().commander.name == "Test"
    engine.reset()
    assert engine.get_state().commander.name == ""


def test_load_game():
    engine = CommanderStateEngine()
    engine.update({"event": "LoadGame", "Commander": "CMDR Python", "FID": "F42", "Ship": "Python", "ShipID": 7, "ShipName": "Void", "ShipIdent": "PY-1",
                    "FuelLevel": 50, "FuelCapacity": 100, "Credits": 5000000, "Loan": 0, "GameMode": "Open", "Group": "G", "Horizons": True, "Odyssey": True})
    s = engine.get_state()
    assert s.commander.name == "CMDR Python"
    assert s.commander.fid == "F42"
    assert s.commander.credits == 5000000
    assert s.ship.current == "Python"
    assert s.ship.name == "Void"
    assert s.ship.ident == "PY-1"
    assert s.ship.fuelLevel == 50
    assert s.ship.fuelCapacity == 100
    assert s.flags.odyssey is True
    assert s.flags.horizons is True
    assert s.flags.gameMode == "Open"
    assert s.flags.group == "G"


def test_location():
    engine = CommanderStateEngine()
    engine.update({"event": "Location", "StarSystem": "Sol", "SystemAddress": 1, "StarPos": [0, 0, 0], "Docked": True, "StationName": "Li Qing Jao", "StationType": "Orbis"})
    s = engine.get_state()
    assert s.location.system == "Sol"
    assert s.location.docked is True
    assert s.location.station == "Li Qing Jao"


def test_fsd_jump():
    engine = CommanderStateEngine()
    engine.update({"event": "Location", "StarSystem": "Sol", "StarPos": [0, 0, 0]})
    engine.update({"event": "FSDJump", "StarSystem": "Alpha Centauri", "SystemAddress": 2, "StarPos": [1, 2, 3], "JumpDist": 4.37, "FuelLevel": 75})
    s = engine.get_state()
    assert s.location.system == "Alpha Centauri"
    assert list(s.location.starPos) == [1, 2, 3]
    assert s.ship.fuelLevel == 75


def test_docked_undocked():
    engine = CommanderStateEngine()
    engine.update({"event": "Docked", "StationName": "Test", "StationType": "Station", "StarSystem": "S"})
    assert engine.get_state().location.docked is True
    engine.update({"event": "Undocked", "StationName": "Test", "StationType": "Station"})
    assert engine.get_state().location.docked is False
    assert engine.get_state().location.station == ""


def test_touchdown_liftoff():
    engine = CommanderStateEngine()
    engine.update({"event": "Touchdown", "Body": "Moon", "Latitude": 10.5, "Longitude": -20.3})
    s = engine.get_state()
    assert s.location.onPlanet is True
    assert s.location.latitude == 10.5
    assert s.location.longitude == -20.3
    engine.update({"event": "Liftoff"})
    assert engine.get_state().location.onPlanet is False


def test_ranks():
    engine = CommanderStateEngine()
    engine.update({"event": "Promotion", "Combat": 2, "Trade": 3})
    r = engine.get_state().commander.ranks
    assert r.combat == 2
    assert r.trade == 3


def test_progress():
    engine = CommanderStateEngine()
    engine.update({"event": "Progress", "Combat": 50, "Explore": 75.5})
    p = engine.get_state().commander.progress
    assert p.combat == 50
    assert p.explore == 75.5


def test_rank():
    engine = CommanderStateEngine()
    engine.update({"event": "Rank", "Empire": 5, "Federation": 8})
    r = engine.get_state().commander.ranks
    assert r.empire == 5
    assert r.federation == 8


def test_material_collected():
    engine = CommanderStateEngine()
    engine.update({"event": "MaterialCollected", "Category": "Raw", "Name": "Iron", "Count": 5})
    assert engine.get_state().materials.raw[0].name == "Iron"
    assert engine.get_state().materials.raw[0].count == 5


def test_material_collected_default_count():
    engine = CommanderStateEngine()
    engine.update({"event": "MaterialCollected", "Category": "Manufactured", "Name": "Steel"})
    assert engine.get_state().materials.manufactured[0].count == 1


def test_material_collected_accumulates():
    engine = CommanderStateEngine()
    engine.update({"event": "MaterialCollected", "Category": "Raw", "Name": "Nickel", "Count": 3})
    engine.update({"event": "MaterialCollected", "Category": "Raw", "Name": "Nickel", "Count": 2})
    assert engine.get_state().materials.raw[0].count == 5


def test_material_discarded():
    engine = CommanderStateEngine()
    engine.update({"event": "MaterialCollected", "Category": "Encoded", "Name": "Atypical", "Count": 10})
    engine.update({"event": "MaterialDiscarded", "Category": "Encoded", "Name": "Atypical", "Count": 7})
    assert engine.get_state().materials.encoded[0].count == 3


def test_material_discarded_removes_at_zero():
    engine = CommanderStateEngine()
    engine.update({"event": "MaterialCollected", "Category": "Raw", "Name": "Sulphur", "Count": 5})
    engine.update({"event": "MaterialDiscarded", "Category": "Raw", "Name": "Sulphur", "Count": 5})
    assert engine.get_state().materials.raw == []


def test_material_trade():
    engine = CommanderStateEngine()
    engine.update({"event": "MaterialCollected", "Category": "Raw", "Name": "Iron", "Count": 10})
    engine.update({"event": "MaterialTrade", "Traded": {"Material": "Iron", "Category": "Raw", "Quantity": 5}, "Received": {"Material": "Nickel", "Category": "Raw", "Quantity": 3}})
    s = engine.get_state()
    assert s.materials.raw[0].count == 5  # Iron remaining
    assert s.materials.raw[1].count == 3  # Nickel


def test_synthesis():
    engine = CommanderStateEngine()
    engine.update({"event": "MaterialCollected", "Category": "Manufactured", "Name": "Scrap", "Count": 10})
    engine.update({"event": "Synthesis", "Name": "Ammo", "Materials": [{"Name": "Scrap", "Count": 5, "Category": "Manufactured"}]})
    assert engine.get_state().materials.manufactured[0].count == 5


def test_engineer_craft():
    engine = CommanderStateEngine()
    engine.update({"event": "MaterialCollected", "Category": "Raw", "Name": "Iron", "Count": 10})
    engine.update({"event": "EngineerCraft", "Engineer": "Felicity", "Blueprint": "FSD Range", "Level": 1, "Ingredients": [{"Name": "Iron", "Quantity": 3}]})
    assert engine.get_state().materials.raw[0].count == 7


def test_materials_snapshot():
    engine = CommanderStateEngine()
    engine.update({"event": "Materials", "Raw": [{"Name": "Iron", "Count": 10}, {"Name": "Nickel", "Count": 5}], "Manufactured": [{"Name": "Steel", "Count": 3}]})
    s = engine.get_state()
    assert len(s.materials.raw) == 2
    assert s.materials.manufactured[0].name == "Steel"


def test_ship_locker():
    engine = CommanderStateEngine()
    engine.update({"event": "ShipLocker", "Items": [{"Name": "Health Pack", "Count": 2}], "Components": [{"Name": "Component", "Count": 5}]})
    s = engine.get_state()
    assert s.materials.items[0].name == "Health Pack"
    assert s.materials.components[0].name == "Component"


def test_module_info():
    engine = CommanderStateEngine()
    engine.update({"event": "ModuleInfo", "Modules": [{"Slot": "Slot01", "Item": "TestModule", "Priority": 1, "Health": 100, "Value": 5000}]})
    assert engine.get_state().ship.modules[0]["item"] == "TestModule"


def test_module_info_with_engineering():
    engine = CommanderStateEngine()
    engine.update({"event": "ModuleInfo", "Modules": [{"Slot": "Slot01", "Item": "Mod", "Priority": 1, "Engineering": {"Engineer": "Felicity", "BlueprintName": "FSD Range", "Level": 5, "Quality": 1.0, "ExperimentalEffect": "Mass Manager"}}]})
    eng = engine.get_state().ship.modules[0]["engineering"]
    assert eng["engineer"] == "Felicity"
    assert eng["level"] == 5


def test_missions():
    engine = CommanderStateEngine()
    engine.update({"event": "MissionAccepted", "MissionID": 1, "Name": "Courier", "Faction": "Fed", "Reward": 50000, "DestinationSystem": "Sol"})
    assert len(engine.get_state().missions) == 1
    assert engine.get_state().missions[0].name == "Courier"

    engine.update({"event": "MissionCompleted", "MissionID": 1, "Name": "Courier", "Faction": "Fed"})
    assert len(engine.get_state().missions) == 0


def test_mission_failed():
    engine = CommanderStateEngine()
    engine.update({"event": "MissionAccepted", "MissionID": 1, "Name": "Test", "Faction": "F"})
    engine.update({"event": "MissionFailed", "MissionID": 1, "Name": "Test", "Faction": "F"})
    assert engine.get_state().missions[0].failed is True


def test_mission_redirected():
    engine = CommanderStateEngine()
    engine.update({"event": "MissionAccepted", "MissionID": 1, "Name": "Test", "Faction": "F", "DestinationSystem": "Sol"})
    engine.update({"event": "MissionRedirected", "MissionID": 1, "Name": "Test", "NewDestinationSystem": "Alpha Centauri"})
    assert engine.get_state().missions[0].destinationSystem == "Alpha Centauri"


def test_nav_route():
    engine = CommanderStateEngine()
    engine.update({"event": "NavRoute", "Route": [{"StarSystem": "Sol", "SystemAddress": 1, "StarPos": [0, 0, 0]}]})
    assert len(engine.get_state().navRoute) == 1
    assert engine.get_state().navRoute[0]["starSystem"] == "Sol"
    engine.update({"event": "NavRouteClear"})
    assert engine.get_state().navRoute == []


def test_carrier():
    engine = CommanderStateEngine()
    engine.update({"event": "CarrierBuy", "CarrierID": 123, "Price": 5000000000, "Callsign": "V1C"})
    assert engine.get_state().carrier.callsign == "V1C"

    engine.update({"event": "CarrierStats", "CarrierID": 123, "Callsign": "V1C-T0R", "Name": "Home", "FuelLevel": 500, "JumpRangeCurr": 250, "JumpRangeMax": 500, "DockingAccess": "all"})
    c = engine.get_state().carrier
    assert c.name == "Home"
    assert c.fuelLevel == 500

    engine.update({"event": "CarrierNameChange", "Name": "New Home"})
    assert engine.get_state().carrier.name == "New Home"


def test_full_session():
    engine = CommanderStateEngine()
    engine.update({"event": "LoadGame", "Commander": "Alex", "FID": "F42", "Ship": "Python", "ShipID": 10, "ShipName": "Hauler", "ShipIdent": "PY-1", "FuelLevel": 80, "FuelCapacity": 100, "Credits": 1000000, "Loan": 0, "GameMode": "Open", "Odyssey": True})
    engine.update({"event": "Location", "StarSystem": "LHS 3447", "SystemAddress": 100, "StarPos": [-10, 5, 0], "Docked": True, "StationName": "Baker Hub", "StationType": "Orbis"})
    engine.update({"event": "Undocked", "StationName": "Baker Hub", "StationType": "Orbis"})
    engine.update({"event": "StartJump", "JumpType": "Hyperspace"})
    engine.update({"event": "FSDJump", "StarSystem": "Sol", "SystemAddress": 200, "StarPos": [0, 0, 0], "JumpDist": 10.5, "FuelLevel": 70})
    engine.update({"event": "Touchdown", "Body": "Earth", "Latitude": 12.34, "Longitude": 56.78})
    engine.update({"event": "Docked", "StationName": "Li Qing Jao", "StationType": "Coriolis", "StarSystem": "Sol"})

    s = engine.get_state()
    assert s.commander.name == "Alex"
    assert s.location.system == "Sol"
    assert s.location.docked is True
    assert s.location.station == "Li Qing Jao"
    assert s.ship.fuelLevel == 70


def test_unknown_event():
    engine = CommanderStateEngine()
    state = engine.update({"event": "UnknownEvent", "SomeField": 123})
    assert state is engine.get_state()
