"""Tests for EDDN client."""

from unittest.mock import patch, MagicMock

from elite_dangerous_sdk.eddn import (
    EDDNClient, EDDNReceiver, UPLOAD_URL, RELAY_URL,
    EDDN_SCHEMAS,
    validate_blackmarket_message,
    validate_commodity_message,
    validate_fc_materials_journal_message,
    validate_fc_materials_message,
    validate_journal_message,
    validate_nav_route_message,
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
    assert validate_commodity_message(msg) is True


def test_validate_commodity_missing_field():
    msg = {
        "systemName": "",
        "stationName": "Station",
        "marketId": 12345,
        "commodities": [{"name": "Gold", "buyPrice": 100, "sellPrice": 200}],
    }
    assert validate_commodity_message(msg) is False


def test_validate_fc_materials_valid():
    msg = {
        "systemName": "Sol",
        "stationName": "Station",
        "marketId": 12345,
        "carrierCallsign": "ABC-123",
        "carrierDockingAccess": "All",
    }
    assert validate_fc_materials_message(msg) is True


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
    assert validate_journal_message({"event": "FSDJump"}) is True


def test_validate_journal_invalid():
    assert validate_journal_message({}) is False


def test_validate_blackmarket_valid():
    msg = {
        "systemName": "Sol",
        "stationName": "Station",
        "marketId": 1,
        "items": [{"name": "Gold"}],
    }
    assert validate_blackmarket_message(msg) is True


def test_validate_blackmarket_invalid():
    assert validate_blackmarket_message({}) is False


def test_validate_nav_route_valid():
    msg = {
        "systemName": "Sol",
        "route": [{"StarPos": [0, 0, 0], "systemName": "Sol", "systemAddress": 1}],
    }
    assert validate_nav_route_message(msg) is True


def test_validate_nav_route_invalid():
    assert validate_nav_route_message({}) is False


def test_validate_fc_materials_journal_valid():
    msg = {
        "timestamp": "2024-01-01T00:00:00Z",
        "event": "FCMaterials",
        "CarrierName": "ABC-01",
        "MarketID": 1,
        "Items": [{"name": "Tritium"}],
    }
    assert validate_fc_materials_journal_message(msg) is True


def test_validate_fc_materials_journal_invalid():
    assert validate_fc_materials_journal_message({}) is False


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
