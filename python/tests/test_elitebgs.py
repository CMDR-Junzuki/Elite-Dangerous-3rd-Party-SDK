"""Tests for EliteBGS client."""

from unittest.mock import patch, MagicMock

from elite_dangerous_sdk.elitebgs import EliteBGSClient, BASE_URL


def test_base_url():
    assert BASE_URL == "https://elitebgs.app/api/ebgs/v5"


def test_instantiation():
    client = EliteBGSClient()
    assert client is not None


@patch("elite_dangerous_sdk.elitebgs.httpx.Client")
def test_get_systems(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"docs": [], "total": 0, "page": 1, "pages": 1, "limit": 10}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EliteBGSClient(rpm=60000)
    result = client.get_systems(name="Sol", page=1)
    assert result["page"] == 1


@patch("elite_dangerous_sdk.elitebgs.httpx.Client")
def test_get_factions(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"docs": [], "total": 0, "page": 1, "pages": 1, "limit": 10}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EliteBGSClient(rpm=60000)
    result = client.get_factions(name="The Fatherhood")
    assert result["page"] == 1


@patch("elite_dangerous_sdk.elitebgs.httpx.Client")
def test_get_stations(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"docs": [], "total": 0, "page": 1, "pages": 1, "limit": 10}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EliteBGSClient(rpm=60000)
    result = client.get_stations(system="Sol", type_="Coriolis")
    assert result["page"] == 1


@patch("elite_dangerous_sdk.elitebgs.httpx.Client")
def test_get_ticks(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = [{"_id": "1", "time": "2024-01-01T12:00:00Z", "updated_at": "2024-01-01T12:00:00Z", "__v": 0}]
    mock_httpx.return_value.get.return_value = mock_resp

    client = EliteBGSClient(rpm=60000)
    ticks = client.get_ticks()
    assert len(ticks) == 1
    assert ticks[0]["_id"] == "1"


@patch("elite_dangerous_sdk.elitebgs.httpx.Client")
def test_get_system_by_name(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"docs": [], "total": 0, "page": 1, "pages": 1, "limit": 10}
    mock_httpx.return_value.get.return_value = mock_resp

    client = EliteBGSClient(rpm=60000)
    client.get_system_by_name("Sol")
    # Verify the URL that was called
    call_url = mock_httpx.return_value.get.call_args[0][0]
    assert "name=Sol" in call_url
    assert "page=1" in call_url


@patch("elite_dangerous_sdk.elitebgs.httpx.Client")
def test_get_latest_tick(mock_httpx):
    tick = {"_id": "1", "time": "2024-01-01T12:00:00Z", "updated_at": "2024-01-01T12:00:00Z", "__v": 0}
    mock_resp = MagicMock()
    mock_resp.json.return_value = [tick]
    mock_httpx.return_value.get.return_value = mock_resp

    client = EliteBGSClient(rpm=60000)
    result = client.get_latest_tick()
    assert result == tick


@patch("elite_dangerous_sdk.elitebgs.httpx.Client")
def test_get_latest_tick_empty(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = []
    mock_httpx.return_value.get.return_value = mock_resp

    client = EliteBGSClient(rpm=60000)
    result = client.get_latest_tick()
    assert result is None
