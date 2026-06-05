"""Tests for Companion CAPI client."""

import time
from unittest.mock import patch, MagicMock

from elite_dangerous_sdk.companion import (
    AUTH_BASE, LIVE_HOST, LEGACY_HOST,
    FrontierAuth, FrontierTokens, CompanionClient,
    generate_code_verifier, generate_code_challenge,
)


def test_constants():
    assert AUTH_BASE == "https://auth.frontierstore.net"
    assert LIVE_HOST == "https://companion.orerve.net"
    assert LEGACY_HOST == "https://legacy-companion.orerve.net"


def test_generate_code_verifier():
    verifier = generate_code_verifier()
    assert isinstance(verifier, str)
    assert len(verifier) > 20


def test_generate_code_challenge():
    verifier = generate_code_verifier()
    challenge = generate_code_challenge(verifier)
    assert isinstance(challenge, str)
    assert challenge != verifier


def test_frontier_auth_user_agent():
    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0.0")
    assert auth.user_agent == "EDCD-TestApp-1.0.0"


def test_build_auth_url():
    auth = FrontierAuth("client123", "http://localhost/callback", "TestApp", "1.0")
    url = auth.build_auth_url("challenge123", "state456")
    assert AUTH_BASE in url
    assert "client_id=client123" in url
    assert "code_challenge=challenge123" in url
    assert "state=state456" in url
    assert "redirect_uri=http%3A%2F%2Flocalhost%2Fcallback" in url


@patch("httpx.post")
def test_exchange_code(mock_post):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {
        "access_token": "access123",
        "refresh_token": "refresh123",
        "expires_in": 3600,
    }
    mock_post.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    tokens = auth.exchange_code("authcode", "verifier123", "state123", "state123")

    assert tokens.access_token == "access123"
    assert tokens.refresh_token == "refresh123"
    assert auth.tokens.access_token == "access123"

    call_data = mock_post.call_args[1]["data"]
    assert call_data["code"] == "authcode"
    assert call_data["code_verifier"] == "verifier123"


@patch("httpx.post")
def test_exchange_code_state_mismatch(mock_post):
    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    import pytest
    with pytest.raises(ValueError, match="State mismatch"):
        auth.exchange_code("code", "verifier", "wrong_state", "expected_state")
    mock_post.assert_not_called()


@patch("httpx.post")
def test_refresh_tokens(mock_post):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "access_token": "new_access",
        "refresh_token": "new_refresh",
        "expires_in": 3600,
    }
    mock_post.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("old_access", "old_refresh", time.time() + 3600)
    tokens = auth.refresh_tokens()

    assert tokens.access_token == "new_access"
    assert tokens.refresh_token == "new_refresh"

    call_data = mock_post.call_args[1]["data"]
    assert call_data["grant_type"] == "refresh_token"


@patch("httpx.post")
def test_refresh_tokens_not_authenticated(mock_post):
    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    import pytest
    with pytest.raises(ValueError, match="Not authenticated"):
        auth.refresh_tokens()
    mock_post.assert_not_called()


@patch("httpx.post")
def test_get_valid_token_no_tokens(mock_post):
    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    import pytest
    with pytest.raises(ValueError, match="Not authenticated"):
        auth.get_valid_token()


@patch("httpx.post")
def test_get_valid_token_refreshes_if_expired(mock_post):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "access_token": "refreshed_access",
        "refresh_token": "refreshed_refresh",
        "expires_in": 3600,
    }
    mock_post.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("old_access", "old_refresh", time.time() - 1)
    token = auth.get_valid_token()
    assert token == "refreshed_access"


@patch("httpx.get")
@patch("httpx.post")
def test_companion_client_get_profile(mock_post, mock_get):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"commander": {"name": "TestCmdr"}}
    mock_get.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("access", "refresh", time.time() + 3600)
    client = CompanionClient(auth)
    profile = client.get_profile()

    assert profile["commander"]["name"] == "TestCmdr"
    call_headers = mock_get.call_args[1]["headers"]
    assert "Bearer access" in call_headers["Authorization"]


@patch("httpx.get")
@patch("httpx.post")
def test_companion_client_get_market(mock_post, mock_get):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"market": []}
    mock_get.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("access", "refresh", time.time() + 3600)
    client = CompanionClient(auth)
    market = client.get_market()
    assert "market" in market


@patch("httpx.get")
@patch("httpx.post")
def test_companion_client_get_shipyard(mock_post, mock_get):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"shipyard": []}
    mock_get.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("access", "refresh", time.time() + 3600)
    client = CompanionClient(auth)
    result = client.get_shipyard()
    assert "shipyard" in result


@patch("httpx.get")
@patch("httpx.post")
def test_companion_client_get_fleet_carrier(mock_post, mock_get):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"carrier": {}}
    mock_get.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("access", "refresh", time.time() + 3600)
    client = CompanionClient(auth)
    result = client.get_fleet_carrier()
    assert "carrier" in result


@patch("httpx.get")
@patch("httpx.post")
def test_companion_client_get_journal(mock_post, mock_get):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"events": []}
    mock_get.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("access", "refresh", time.time() + 3600)
    client = CompanionClient(auth)
    result = client.get_journal(2024, 1, 15)
    assert "events" in result

    call_args = mock_get.call_args[0][0]
    assert "/journal/2024/1/15" in call_args


@patch("httpx.get")
@patch("httpx.post")
def test_companion_client_get_community_goals(mock_post, mock_get):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"goals": []}
    mock_get.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("access", "refresh", time.time() + 3600)
    client = CompanionClient(auth)
    result = client.get_community_goals()
    assert "goals" in result


@patch("httpx.get")
@patch("httpx.post")
def test_companion_client_legacy_galaxy(mock_post, mock_get):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {}
    mock_get.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("access", "refresh", time.time() + 3600)
    client = CompanionClient(auth, galaxy="legacy")
    client.get_profile()

    call_args = mock_get.call_args[0][0]
    assert LEGACY_HOST in call_args


@patch("httpx.get")
@patch("httpx.post")
def test_companion_client_is_docked_true(mock_post, mock_get):
    mock_resp = MagicMock()
    mock_resp.json.return_value = {"commander": {"docked": True}}
    mock_get.return_value = mock_resp

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("access", "refresh", time.time() + 3600)
    client = CompanionClient(auth)
    assert client.is_docked() is True


@patch("httpx.get")
@patch("httpx.post")
def test_companion_client_is_docked_false_on_error(mock_post, mock_get):
    mock_get.side_effect = Exception("Network error")

    auth = FrontierAuth("client123", "http://localhost", "TestApp", "1.0")
    auth.tokens = FrontierTokens("access", "refresh", time.time() + 3600)
    client = CompanionClient(auth)
    assert client.is_docked() is False
