"""Tests for Inara client."""

from unittest.mock import patch, MagicMock

from elite_dangerous_sdk.inara import InaraClient, INARA_ENDPOINT


def test_endpoint():
    assert INARA_ENDPOINT == "https://inara.cz/inapi/v1/"


def test_instantiation():
    client = InaraClient("TestApp", "1.0.0", "test-key")
    assert client is not None


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_send_events(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {
        "header": {"eventStatus": 200, "eventStatusText": "ok"},
        "events": [{"eventStatus": 200}],
    }
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key", commander_name="TestCmdr")
    result = client.send_events([
        {"eventName": "setCommanderProfile", "eventData": {"commanderName": "Test"}},
    ])

    assert result["header"]["eventStatus"] == 200

    call_args = mock_post.call_args
    assert call_args[0][0] == INARA_ENDPOINT
    assert call_args[1]["json"]["header"]["appName"] == "TestApp"
    assert call_args[1]["json"]["header"]["APIkey"] == "test-key"
    assert call_args[1]["json"]["events"][0]["eventName"] == "setCommanderProfile"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_send_events_multiple(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {
        "header": {"eventStatus": 200},
        "events": [{"eventStatus": 200}, {"eventStatus": 200}],
    }
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    result = client.send_events([
        {"eventName": "addCommander", "eventData": {"commanderName": "Test"}},
        {"eventName": "setCommanderShip", "eventData": {"shipType": "Sidewinder"}},
    ])
    assert len(result["events"]) == 2


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander("TestCmdr")

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommander"
    assert body["events"][0]["eventData"]["commanderName"] == "TestCmdr"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_get_commander_profile(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.get_commander_profile()

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "getCommanderProfile"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_ship(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_ship("Sidewinder", 1, "Sol", "Li Qing Jao", ship_name="Test Ship")

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventData"]["shipType"] == "Sidewinder"
    assert body["events"][0]["eventData"]["shipGameID"] == 1
    assert body["events"][0]["eventData"]["starsystemName"] == "Sol"
    assert body["events"][0]["eventData"]["stationName"] == "Li Qing Jao"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_travel_fsd_jump(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_travel_fsd_jump("Sol", coords=(0, 0, 0))

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderTravelFSDJump"
    assert body["events"][0]["eventData"]["starSystemX"] == 0


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_travel_dock(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_travel_dock("Murchison Station", "Sol")

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventData"]["stationName"] == "Murchison Station"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_rank(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_rank(combat=5, trade=3)

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventData"]["combat"] == 5
    assert body["events"][0]["eventData"]["trade"] == 3


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_credits(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_credits(1000000, loan=50000)

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventData"]["commanderCredits"] == 1000000
    assert body["events"][0]["eventData"]["commanderLoan"] == 50000


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_inventory(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_inventory(cargo=[{"name": "Gold", "count": 10}])

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventData"]["cargo"][0]["name"] == "Gold"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_community_goal(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_community_goal(name="Test CG", systemName="Sol")

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventData"]["name"] == "Test CG"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_ship_loadout(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_ship_loadout(1, [{"slotName": "Slot1", "itemName": "Beam Laser"}])

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventData"]["shipGameID"] == 1
    assert body["events"][0]["eventData"]["modules"][0]["itemName"] == "Beam Laser"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_travel_carrier_jump(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_travel_carrier_jump("Colonia")

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderTravelCarrierJump"
    assert body["events"][0]["eventData"]["starSystemName"] == "Colonia"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_travel_location(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_travel_location("Sol", coords=(0, 0, 0))

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderTravelLocation"
    assert body["events"][0]["eventData"]["starSystemX"] == 0


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_community_goal_progress(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_community_goal_progress(42, 1000, percentile=75.5)

    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventData"]["communitygoalGameID"] == 42
    assert body["events"][0]["eventData"]["contribution"] == 1000
    assert body["events"][0]["eventData"]["percentile"] == 75.5


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_http_error(mock_post):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.side_effect = Exception("HTTP 429")
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    import pytest
    with pytest.raises(Exception, match="HTTP 429"):
        client.send_events([{"eventName": "test"}])


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_api_error(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {
        "header": {"eventStatus": 400, "eventStatusText": "Invalid API key"},
        "events": [],
    }
    mock_post.return_value = mock_resp

    client = InaraClient("TestApp", "1.0.0", "test-key")
    import pytest
    with pytest.raises(Exception, match="Invalid API key"):
        client.send_events([{"eventName": "test"}])


def _mock_ok(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"header": {"eventStatus": 200}, "events": [{"eventStatus": 200}]}
    mock_post.return_value = mock_resp


# --- Friend events ---


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_friend(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_friend("Friend1", "pc")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderFriend"
    assert body["events"][0]["eventData"]["commanderName"] == "Friend1"
    assert body["events"][0]["eventData"]["gamePlatform"] == "pc"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_del_commander_friend(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.del_commander_friend("Friend1")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "delCommanderFriend"
    assert body["events"][0]["eventData"]["commanderName"] == "Friend1"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_permit(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_permit("Sol")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderPermit"
    assert body["events"][0]["eventData"]["starsystemName"] == "Sol"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_game_statistics(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_game_statistics({"combat": {"bonds": 5}})
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderGameStatistics"
    assert body["events"][0]["eventData"]["combat"]["bonds"] == 5


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_rank_engineer_single(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_rank_engineer({"engineerName": "Felicity Farseer", "rankValue": 5})
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderRankEngineer"
    assert body["events"][0]["eventData"]["engineerName"] == "Felicity Farseer"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_rank_engineer_list(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_rank_engineer([{"engineerName": "Felicity Farseer", "rankValue": 5}])
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderRankEngineer"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_rank_pilot_single(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_rank_pilot("Combat", 5, 0.5)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderRankPilot"
    assert body["events"][0]["eventData"]["rankName"] == "Combat"
    assert body["events"][0]["eventData"]["rankValue"] == 5
    assert body["events"][0]["eventData"]["rankProgress"] == 0.5


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_rank_pilot_list(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_rank_pilot([{"rankName": "Combat", "rankValue": 5}])
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderRankPilot"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_rank_power(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_rank_power("Aisling Duval", 10, merits_value=500)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderRankPower"
    assert body["events"][0]["eventData"]["powerName"] == "Aisling Duval"
    assert body["events"][0]["eventData"]["rankValue"] == 10
    assert body["events"][0]["eventData"]["meritsValue"] == 500


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_reputation_major_faction_single(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_reputation_major_faction("Federation", 85.5)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderReputationMajorFaction"
    assert body["events"][0]["eventData"]["majorfactionName"] == "Federation"
    assert body["events"][0]["eventData"]["majorfactionReputation"] == 85.5


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_reputation_major_faction_list(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_reputation_major_faction([{"majorfactionName": "Fed", "majorfactionReputation": 50}])
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderReputationMajorFaction"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_reputation_minor_faction_single(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_reputation_minor_faction("Crimson State", 30.0)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderReputationMinorFaction"
    assert body["events"][0]["eventData"]["minorfactionName"] == "Crimson State"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_reputation_minor_faction_list(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_reputation_minor_faction([{"minorfactionName": "CS", "minorfactionReputation": 30}])
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderReputationMinorFaction"


# --- Inventory events ---


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_inventory_item(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_inventory_item("Gold", 10, "Commodity", is_stolen=True)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderInventoryItem"
    assert body["events"][0]["eventData"]["itemName"] == "Gold"
    assert body["events"][0]["eventData"]["itemCount"] == 10
    assert body["events"][0]["eventData"]["itemType"] == "Commodity"
    assert body["events"][0]["eventData"]["isStolen"] is True


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_del_commander_inventory_item(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.del_commander_inventory_item("Gold", 5, "Commodity")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "delCommanderInventoryItem"
    assert body["events"][0]["eventData"]["itemName"] == "Gold"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_reset_commander_inventory_single(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.reset_commander_inventory("Materials", "Raw")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "resetCommanderInventory"
    assert body["events"][0]["eventData"]["itemType"] == "Materials"
    assert body["events"][0]["eventData"]["itemLocation"] == "Raw"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_reset_commander_inventory_list(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.reset_commander_inventory([{"itemType": "Materials", "itemLocation": "Raw"}])
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "resetCommanderInventory"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_inventory_item(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_inventory_item("Gold", 5, "Commodity", item_location="Ship")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderInventoryItem"
    assert body["events"][0]["eventData"]["itemLocation"] == "Ship"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_inventory_cargo_item(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_inventory_cargo_item("Gold", 10, is_stolen=False)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderInventoryCargoItem"
    assert body["events"][0]["eventData"]["isStolen"] is False


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_inventory_materials_item(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_inventory_materials_item("Iron", 50)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderInventoryMaterialsItem"
    assert body["events"][0]["eventData"]["itemName"] == "Iron"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_del_commander_inventory_cargo_item(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.del_commander_inventory_cargo_item("Gold", 5)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "delCommanderInventoryCargoItem"
    assert body["events"][0]["eventData"]["itemName"] == "Gold"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_del_commander_inventory_materials_item(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.del_commander_inventory_materials_item("Iron", 10)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "delCommanderInventoryMaterialsItem"
    assert body["events"][0]["eventData"]["itemCount"] == 10


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_inventory_cargo(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    items = [{"itemName": "Gold", "itemCount": 10}]
    client.set_commander_inventory_cargo(items)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderInventoryCargo"
    assert body["events"][0]["eventData"][0]["itemName"] == "Gold"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_inventory_cargo_item(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_inventory_cargo_item("Gold", 5, is_stolen=True)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderInventoryCargoItem"
    assert body["events"][0]["eventData"]["isStolen"] is True


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_inventory_materials(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_inventory_materials([{"itemName": "Iron", "itemCount": 50}])
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderInventoryMaterials"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_inventory_materials_item(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_inventory_materials_item("Nickel", 100)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderInventoryMaterialsItem"
    assert body["events"][0]["eventData"]["itemCount"] == 100


# --- Storage & Ship events ---


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_storage_modules(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_storage_modules([{"itemName": "Beam Laser", "itemValue": 50000}])
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderStorageModules"
    assert body["events"][0]["eventData"][0]["itemName"] == "Beam Laser"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_ship(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_ship("Sidewinder", 1)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderShip"
    assert body["events"][0]["eventData"]["shipType"] == "Sidewinder"
    assert body["events"][0]["eventData"]["shipGameID"] == 1


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_del_commander_ship(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.del_commander_ship("Sidewinder", 1)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "delCommanderShip"
    assert body["events"][0]["eventData"]["shipGameID"] == 1


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_ship_transfer(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_ship_transfer("Sidewinder", 1, "Sol", "Daedalus", market_id=12345, transfer_time=3600)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderShipTransfer"
    assert body["events"][0]["eventData"]["starsystemName"] == "Sol"
    assert body["events"][0]["eventData"]["marketID"] == 12345


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_del_commander_suit_loadout(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.del_commander_suit_loadout(4293000001)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "delCommanderSuitLoadout"
    assert body["events"][0]["eventData"]["loadoutGameID"] == 4293000001


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_suit_loadout(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_suit_loadout(
        loadoutGameID=4293000004,
        loadoutName="Scavenging",
        suitType="utilitysuit_class3",
        suitGameID=1700315870155528,
        suitMods=["suit_backpackcapacity"],
        suitLoadout=[{"slotName": "PrimaryWeapon1", "itemName": "wpn_m_sniper_plasma_charged"}],
    )
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderSuitLoadout"
    assert body["events"][0]["eventData"]["suitType"] == "utilitysuit_class3"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_update_commander_suit_loadout(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.update_commander_suit_loadout(loadoutGameID=4293000001, loadoutName="My loadout new name")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "updateCommanderSuitLoadout"
    assert body["events"][0]["eventData"]["loadoutName"] == "My loadout new name"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_travel_land(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_travel_land("Sol", "Earth")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderTravelLand"
    assert body["events"][0]["eventData"]["starsystemName"] == "Sol"
    assert body["events"][0]["eventData"]["starsystemBodyName"] == "Earth"


# --- Mission events ---


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_mission(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_mission("Mission1", 100, starsystemName="Sol")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderMission"
    assert body["events"][0]["eventData"]["missionName"] == "Mission1"
    assert body["events"][0]["eventData"]["missionGameID"] == 100
    assert body["events"][0]["eventData"]["starsystemName"] == "Sol"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_mission_abandoned(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_mission_abandoned(100)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderMissionAbandoned"
    assert body["events"][0]["eventData"]["missionGameID"] == 100


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_mission_completed(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_mission_completed(100)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderMissionCompleted"
    assert body["events"][0]["eventData"]["missionGameID"] == 100


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_set_commander_mission_failed(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.set_commander_mission_failed(100)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "setCommanderMissionFailed"
    assert body["events"][0]["eventData"]["missionGameID"] == 100


# --- Combat events ---


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_combat_death(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_combat_death("Sol", opponent_name="Cmdr X", is_player=True)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderCombatDeath"
    assert body["events"][0]["eventData"]["starsystemName"] == "Sol"
    assert body["events"][0]["eventData"]["opponentName"] == "Cmdr X"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_combat_interdicted(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_combat_interdicted("Sol", "Cmdr X", True, combat_result=True)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderCombatInterdicted"
    assert body["events"][0]["eventData"]["starsystemName"] == "Sol"
    assert body["events"][0]["eventData"]["isSubmit"] is True


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_combat_interdiction(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_combat_interdiction("Sol", "Cmdr X", True, combat_result=False)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderCombatInterdiction"
    assert body["events"][0]["eventData"]["isSuccess"] is False


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_combat_interdiction_escape(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_combat_interdiction_escape("Sol", "Cmdr X", True)
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderCombatInterdictionEscape"
    assert body["events"][0]["eventData"]["isPlayer"] is True


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_add_commander_combat_kill(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.add_commander_combat_kill("Sol", opponent_ship_type="Federal Corvette")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "addCommanderCombatKill"
    assert body["events"][0]["eventData"]["opponentShipType"] == "Federal Corvette"


# --- Community goals ---


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_get_community_goals_recent_with_system(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.get_community_goals_recent("Sol")
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "getCommunityGoalsRecent"
    assert body["events"][0]["eventData"]["searchSystemName"] == "Sol"


@patch("elite_dangerous_sdk.inara.httpx.post")
def test_get_community_goals_recent_all(mock_post):
    _mock_ok(mock_post)
    client = InaraClient("TestApp", "1.0.0", "test-key")
    client.get_community_goals_recent()
    body = mock_post.call_args[1]["json"]
    assert body["events"][0]["eventName"] == "getCommunityGoalsRecent"
    assert body["events"][0]["eventData"] == []
