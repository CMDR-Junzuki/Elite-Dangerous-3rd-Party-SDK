"""Tests for Spansh client."""

from unittest.mock import patch, MagicMock

from elite_dangerous_sdk.spansh import SpanshClient, BASE_URL


def test_base_url():
    assert BASE_URL == "https://spansh.co.uk"


def test_instantiation():
    client = SpanshClient()
    assert client is not None


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_get_system(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"system": {"name": "Sol", "id64": 1}}
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.get_system(1)
    assert result["system"]["name"] == "Sol"

    call_args = mock_httpx.return_value.get.call_args
    assert "/api/system/1" in call_args[0][0]


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_get_station(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"station": {"name": "Test", "market_id": 123}}
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.get_station(123)
    assert result["station"]["market_id"] == 123


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_get_body(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"body": {"name": "Earth"}}
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.get_body(123)
    assert result["body"]["name"] == "Earth"


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_search(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"systems": [], "stations": []}
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.search("Sol")
    assert "systems" in result


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_search_system_names(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = ["Sol", "Solati"]
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.search_system_names("Sol")
    assert len(result) == 2
    assert "Sol" in result


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_get_commodity_locations(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = []
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.get_commodity_locations("sell", "Sol", "Bertrandite", 10)
    assert result == []

    call_args = mock_httpx.return_value.get.call_args
    assert "/api/commodity/sell/Sol/Bertrandite/10" in call_args[0][0]


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_search_stations(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"results": [], "count": 0}
    mock_httpx.return_value.post.return_value = mock_resp

    client = SpanshClient()
    result = client.search_stations({"filters": {"economy": "High Tech"}})
    assert "results" in result

    call_args = mock_httpx.return_value.post.call_args
    assert "/api/stations/search" in call_args[0][0]
    assert call_args[1]["json"]["filters"]["economy"] == "High Tech"


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_dump_system(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"name": "Sol", "id64": 1}
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.dump_system(1)
    assert result["name"] == "Sol"
    assert result["id64"] == 1


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_search_factions(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = ["The Fatherhood", "Dark Echo"]
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.search_factions("The")
    assert len(result) == 2


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_get_controlling_factions(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = ["Federation", "Empire"]
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.get_controlling_factions()
    assert len(result) == 2
    assert "Federation" in result

    call_args = mock_httpx.return_value.get.call_args
    assert "controlling_minor_faction" in call_args[0][0]


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_get_route(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {
        "jumps": [{"system": "Sol", "system_id64": 1, "distance": 0, "jump": 1, "fuel_used": 0, "neutron": False}],
        "distance": 0, "total_jumps": 1, "total_distance": 0, "efficiency": 0, "range": 50,
    }
    mock_httpx.return_value.post.return_value = mock_resp

    client = SpanshClient()
    result = client.get_route("Sol", "Alpha Centauri", range_=50)
    assert result["total_jumps"] == 1

    call_args = mock_httpx.return_value.post.call_args
    assert "/api/route" in call_args[0][0]
    assert call_args[1]["json"]["from"] == "Sol"
    assert call_args[1]["json"]["to"] == "Alpha Centauri"


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_get_nearest(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.json.return_value = [
        {"system": "Sol", "station": "Daedalus", "distance": 0, "distance_from_reference": 0, "type": "material_trader", "system_id64": 1},
    ]
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    result = client.get_nearest("Sol", "material_trader")
    assert result[0]["station"] == "Daedalus"
    assert result[0]["type"] == "material_trader"

    call_args = mock_httpx.return_value.get.call_args
    assert "/api/nearest" in call_args[0][0]
    assert "system=Sol" in call_args[0][0]


@patch("elite_dangerous_sdk.spansh.httpx.Client")
def test_http_error(mock_httpx):
    mock_resp = MagicMock()
    mock_resp.raise_for_status.side_effect = Exception("HTTP 500")
    mock_httpx.return_value.get.return_value = mock_resp

    client = SpanshClient()
    import pytest
    with pytest.raises(Exception, match="HTTP 500"):
        client.get_system(1)
