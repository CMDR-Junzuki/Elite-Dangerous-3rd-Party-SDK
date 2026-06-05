"""Tests for EDSM client."""

from unittest.mock import patch, MagicMock

from elite_dangerous_sdk.edsm import EDSMClient, BASE_URL


def test_base_url():
    assert BASE_URL == "https://www.edsm.net"


def test_instantiation():
    client = EDSMClient()
    assert client is not None


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_system(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"name": "Sol", "id": 1}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_system("Sol")
    assert result["name"] == "Sol"

    call_args = mock_httpx.return_value.get.call_args
    assert "/api-v1/system" in call_args[0][0]


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_system_with_coords(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"name": "Sol"}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    client.get_system("Sol", show_coords=False)

    call_kwargs = mock_httpx.return_value.get.call_args[1]
    assert call_kwargs["params"]["showCoordinates"] == 0


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_systems(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = [{"name": "Sol"}, {"name": "Alpha Centauri"}]
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_systems(["Sol", "Alpha Centauri"])
    assert len(result) == 2

    call_kwargs = mock_httpx.return_value.get.call_args[1]
    assert call_kwargs["params"]["systemName[0]"] == "Sol"


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_sphere_systems(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = [{"name": "Sol", "distance": 0}]
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_sphere_systems("Sol", 50)
    assert len(result) == 1


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_sphere_systems_caps_radius(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = []
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    client.get_sphere_systems("Sol", 999)

    call_kwargs = mock_httpx.return_value.get.call_args[1]
    assert call_kwargs["params"]["radius"] == 100


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_cube_systems(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = []
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    client.get_cube_systems("Sol", 100)

    call_kwargs = mock_httpx.return_value.get.call_args[1]
    assert call_kwargs["params"]["size"] == 100


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_system_bodies(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"id": 1, "name": "Sol", "bodies": []}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_system_bodies("Sol")
    assert "bodies" in result


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_system_stations(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"id": 1, "name": "Sol", "stations": []}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_system_stations("Sol")
    assert "stations" in result


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_system_estimated_value(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"estimatedValue": 5000000}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_system_estimated_value("Sol")
    assert result["estimatedValue"] == 5000000


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_system_factions(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"id": 1, "name": "Sol", "factions": []}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_system_factions("Sol")
    assert "factions" in result


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_station_market(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"market": []}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_station_market("Sol", "Murchison Station")
    assert "market" in result


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_station_shipyard(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"shipyard": []}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_station_shipyard("Sol", "Murchison Station")
    assert "shipyard" in result


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_station_outfitting(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"outfitting": []}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_station_outfitting("Sol", "Murchison Station")
    assert "outfitting" in result


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_system_traffic(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"traffic": []}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_system_traffic("Sol")
    assert "traffic" in result


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_get_system_deaths(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"deaths": []}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    result = client.get_system_deaths("Sol")
    assert "deaths" in result


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_api_key_and_commander_passed(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"name": "Sol"}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient(api_key="test-key", commander_name="TestCmdr")
    client.get_system("Sol")

    call_kwargs = mock_httpx.return_value.get.call_args[1]
    assert call_kwargs["params"]["apiKey"] == "test-key"
    assert call_kwargs["params"]["commanderName"] == "TestCmdr"


@patch("elite_dangerous_sdk.edsm.httpx.Client")
def test_http_error(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.side_effect = Exception("HTTP 429")
    mock_httpx.return_value.get.return_value = mock_resp

    client = EDSMClient()
    import pytest
    with pytest.raises(Exception, match="HTTP 429"):
        client.get_system("Sol")
