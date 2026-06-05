"""Tests for EDDN client."""

from unittest.mock import patch, MagicMock

from elite_dangerous_sdk.eddn import (
    EDDNClient, EDDNReceiver, UPLOAD_URL, RELAY_URL,
    EDDN_SCHEMAS,
    validate_approach_settlement_message,
    validate_backpack_message,
    validate_blackmarket_message,
    validate_carrier_jump_message,
    validate_code_entry_message,
    validate_commodity_message,
    validate_dispatch_message,
    validate_eddn,
    validate_fc_materials_journal_message,
    validate_fc_materials_message,
    validate_fsd_jump_message,
    validate_fss_discovered_message,
    validate_journal_message,
    validate_location_message,
    validate_nav_route_clear_message,
    validate_nav_route_message,
    validate_outfitting_message,
    validate_saa_signals_found_message,
    validate_scan_message,
    validate_ship_locker_message,
    validate_shipyard_message,
)


def test_upload_url():
    assert UPLOAD_URL == "https://eddn.edcd.io:4430/upload/"


def test_relay_url():
    assert RELAY_URL == "tcp://eddn.edcd.io:9500"


def test_client_init():
    client = EDDNClient("TestApp", "1.0.0", "test123")
    assert client.software_name == "TestApp"
    assert client.software_version == "1.0.0"
    assert client.uploader_id == "test123"


def test_client_init_default_uploader():
    client = EDDNClient("TestApp", "1.0.0")
    assert client.uploader_id == "unknown"


@patch("httpx.post")
def test_send_success(mock_post):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_post.return_value = mock_resp

    client = EDDNClient("TestApp", "1.0.0")
    client.send("test/1", {"test": "data"})
    assert mock_post.called


@patch("httpx.post")
def test_send_400_error(mock_post):
    mock_resp = MagicMock()
    mock_resp.status_code = 400
    mock_resp.text = "bad request"
    mock_post.return_value = mock_resp

    client = EDDNClient("TestApp", "1.0.0")
    import pytest
    with pytest.raises(ValueError, match="validation failed"):
        client.send("test/1", {"test": "data"})


@patch("httpx.post")
def test_send_426_error(mock_post):
    mock_resp = MagicMock()
    mock_resp.status_code = 426
    mock_resp.text = "upgrade required"
    mock_post.return_value = mock_resp

    client = EDDNClient("TestApp", "1.0.0")
    import pytest
    with pytest.raises(RuntimeError, match="schema outdated"):
        client.send("test/1", {"test": "data"})


@patch("httpx.post")
def test_send_413_error(mock_post):
    mock_resp = MagicMock()
    mock_resp.status_code = 413
    mock_resp.text = "too large"
    mock_post.return_value = mock_resp

    client = EDDNClient("TestApp", "1.0.0")
    import pytest
    with pytest.raises(RuntimeError, match="too large"):
        client.send("test/1", {"test": "data"})


@patch.object(EDDNClient, "send")
def test_send_commodity(mock_send):
    client = EDDNClient("TestApp", "1.0.0")
    client.send_commodity("Sol", "Station", 12345, [{"name": "Gold"}])
    mock_send.assert_called_once()


@patch.object(EDDNClient, "send")
def test_send_shipyard(mock_send):
    client = EDDNClient("TestApp", "1.0.0")
    client.send_shipyard("Sol", "Station", 12345, ["SideWinder"])
    mock_send.assert_called_once()


@patch.object(EDDNClient, "send")
def test_send_outfitting(mock_send):
    client = EDDNClient("TestApp", "1.0.0")
    client.send_outfitting("Sol", "Station", 12345, ["Module"])
    mock_send.assert_called_once()


def test_receiver_init():
    receiver = EDDNReceiver()
    assert receiver.relay_url == "tcp://eddn.edcd.io:9500"


def test_receiver_init_custom_url():
    receiver = EDDNReceiver("tcp://custom:9500")
    assert receiver.relay_url == "tcp://custom:9500"


def test_eddn_schemas_count():
    assert len(EDDN_SCHEMAS) == 22


def test_eddn_schemas_has_commodity():
    assert "COMMODITY" in EDDN_SCHEMAS


def test_validate_commodity_valid():
    msg = {
        "systemName": "Sol",
        "stationName": "Station",
        "marketId": 12345,
        "commodities": [{"name": "Gold", "buyPrice": 100, "sellPrice": 200}],
    }
    assert validate_commodity_message(msg) == []


def test_validate_commodity_missing_field():
    msg = {
        "systemName": "",
        "stationName": "Station",
        "marketId": 12345,
        "commodities": [{"name": "Gold", "buyPrice": 100, "sellPrice": 200}],
    }
    assert len(validate_commodity_message(msg)) > 0


def test_validate_fc_materials_valid():
    msg = {
        "systemName": "Sol",
        "stationName": "Station",
        "marketId": 12345,
        "carrierCallsign": "ABC-123",
        "carrierDockingAccess": "All",
    }
    assert validate_fc_materials_message(msg) == []


@patch.object(EDDNClient, "send")
def test_send_fleet_carrier_success(mock_send):
    client = EDDNClient("TestApp", "1.0.0")
    client.send_fleet_carrier(
        "Sol", "Station", 12345, "ABC-123", "All", [{"name": "Gold"}]
    )
    mock_send.assert_called_once()


@patch("httpx.post")
def test_send_fleet_carrier_http_error(mock_post):
    mock_resp = MagicMock()
    mock_resp.status_code = 400
    mock_resp.text = "bad request"
    mock_post.return_value = mock_resp

    client = EDDNClient("TestApp", "1.0.0")
    import pytest
    with pytest.raises(ValueError, match="validation failed"):
        client.send_fleet_carrier(
            "Sol", "Station", 12345, "ABC-123", "All", [{"name": "Gold"}]
        )


def test_validate_journal_valid():
    assert validate_journal_message({"event": "FSDJump"}) == []


def test_validate_journal_invalid():
    assert len(validate_journal_message({})) > 0


def test_validate_blackmarket_valid():
    msg = {
        "systemName": "Sol",
        "stationName": "Station",
        "marketId": 1,
        "items": [{"name": "Gold"}],
    }
    assert validate_blackmarket_message(msg) == []


def test_validate_blackmarket_invalid():
    assert len(validate_blackmarket_message({})) > 0


def test_validate_nav_route_valid():
    msg = {
        "systemName": "Sol",
        "route": [{"StarPos": [0, 0, 0], "systemName": "Sol", "systemAddress": 1}],
    }
    assert validate_nav_route_message(msg) == []


def test_validate_nav_route_invalid():
    assert len(validate_nav_route_message({})) > 0


def test_validate_fc_materials_journal_valid():
    msg = {
        "timestamp": "2024-01-01T00:00:00Z",
        "event": "FCMaterials",
        "CarrierName": "ABC-01",
        "MarketID": 1,
        "Items": [{"name": "Tritium"}],
    }
    assert validate_fc_materials_journal_message(msg) == []


def test_validate_fc_materials_journal_invalid():
    assert len(validate_fc_materials_journal_message({})) > 0


@patch.object(EDDNClient, "send")
def test_send_journal(mock_send):
    client = EDDNClient("TestApp", "1.0.0")
    client.send_journal({"event": "FSDJump"})
    mock_send.assert_called_once()


@patch.object(EDDNClient, "send")
def test_send_blackmarket(mock_send):
    client = EDDNClient("TestApp", "1.0.0")
    client.send_blackmarket("Sol", "Station", 1, [{"name": "Gold"}])
    mock_send.assert_called_once()


@patch.object(EDDNClient, "send")
def test_send_nav_route(mock_send):
    client = EDDNClient("TestApp", "1.0.0")
    client.send_nav_route("Sol", [{"systemName": "Sol", "StarPos": [0, 0, 0], "systemAddress": 1}])
    mock_send.assert_called_once()


@patch.object(EDDNClient, "send")
def test_send_fc_materials_journal(mock_send):
    client = EDDNClient("TestApp", "1.0.0")
    client.send_fc_materials_journal(
        "2024-01-01T00:00:00Z", "FCMaterials", "ABC-01", 1,
        [{"name": "Tritium"}],
    )
    mock_send.assert_called_once()


def test_validate_approach_settlement():
    errors = validate_approach_settlement_message({
        "settlementName": "Lonely Haven",
        "SystemAddress": 123,
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_approach_settlement_missing():
    errors = validate_approach_settlement_message({})
    assert len(errors) > 0


def test_validate_scan():
    errors = validate_scan_message({
        "timestamp": "2024-01-01T00:00:00Z",
        "BodyName": "Sol 1",
    })
    assert errors == []


def test_validate_fsd_jump():
    errors = validate_fsd_jump_message({
        "StarSystem": "Sol",
        "SystemAddress": 123,
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_location():
    errors = validate_location_message({
        "StarSystem": "Sol",
        "SystemAddress": 123,
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_carrier_jump():
    errors = validate_carrier_jump_message({
        "StarSystem": "Sol",
        "SystemAddress": 123,
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_code_entry():
    errors = validate_code_entry_message({
        "systemName": "Sol",
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_fss_discovered():
    errors = validate_fss_discovered_message({
        "systemName": "Sol",
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_saa_signals_found():
    errors = validate_saa_signals_found_message({
        "systemName": "Sol",
        "bodyName": "Sol 1",
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_dispatch():
    errors = validate_dispatch_message({
        "Text": "Hello",
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_backpack():
    errors = validate_backpack_message({
        "timestamp": "2024-01-01T00:00:00Z",
        "Items": ["Item1"],
    })
    assert errors == []


def test_validate_ship_locker():
    errors = validate_ship_locker_message({
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_nav_route_clear():
    errors = validate_nav_route_clear_message({
        "timestamp": "2024-01-01T00:00:00Z",
    })
    assert errors == []


def test_validate_eddn_null():
    errors = validate_eddn(None)
    assert errors == ["envelope is required"]


def test_validate_eddn_missing_schema_ref():
    errors = validate_eddn({
        "header": {"uploaderID": "x", "softwareName": "y", "softwareVersion": "z"},
        "message": {"StarSystem": "Sol", "SystemAddress": 1, "timestamp": "t"},
    })
    assert "$schemaRef is required" in errors


def test_validate_eddn_missing_header_fields():
    errors = validate_eddn({
        "$schemaRef": EDDN_SCHEMAS["FSDJUMP"],
        "header": {},
        "message": {"StarSystem": "Sol", "SystemAddress": 1, "timestamp": "t"},
    })
    assert "header.uploaderID is required" in errors
    assert "header.softwareName is required" in errors
    assert "header.softwareVersion is required" in errors


def test_validate_eddn_unknown_schema():
    errors = validate_eddn({
        "$schemaRef": "https://unknown/schema",
        "header": {"uploaderID": "x", "softwareName": "y", "softwareVersion": "z"},
        "message": {"x": 1},
    })
    assert "unknown schema: https://unknown/schema" in errors


def test_validate_eddn_valid_fsd_jump():
    errors = validate_eddn({
        "$schemaRef": EDDN_SCHEMAS["FSDJUMP"],
        "header": {"uploaderID": "me", "softwareName": "test", "softwareVersion": "1.0"},
        "message": {"StarSystem": "Sol", "SystemAddress": 123, "timestamp": "2024-01-01T00:00:00Z"},
    })
    assert errors == []


def test_validate_eddn_valid_commodity():
    errors = validate_eddn({
        "$schemaRef": EDDN_SCHEMAS["COMMODITY"],
        "header": {"uploaderID": "me", "softwareName": "test", "softwareVersion": "1.0"},
        "message": {
            "systemName": "Sol", "stationName": "Station", "marketId": 1,
            "commodities": [{"name": "Gold", "buyPrice": 100, "sellPrice": 200}],
        },
    })
    assert errors == []


def test_validate_eddn_reports_message_errors():
    errors = validate_eddn({
        "$schemaRef": EDDN_SCHEMAS["COMMODITY"],
        "header": {"uploaderID": "me", "softwareName": "test", "softwareVersion": "1.0"},
        "message": {},
    })
    assert len(errors) > 0
    assert "systemName is required" in errors
