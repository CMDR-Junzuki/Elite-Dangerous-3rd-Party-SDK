"""
Frontier Companion API (CAPI) client with oAuth2 PKCE authentication.

Endpoints:
  Live:   https://companion.orerve.net
  Legacy: https://legacy-companion.orerve.net

Auth: https://auth.frontierstore.net
Docs: https://github.com/EDCD/FDevIDs/blob/master/Frontier%20API
"""

import base64
import hashlib
import os
import secrets
import time
import urllib.parse
from dataclasses import dataclass
from typing import Any

AUTH_BASE = "https://auth.frontierstore.net"
LIVE_HOST = "https://companion.orerve.net"
LEGACY_HOST = "https://legacy-companion.orerve.net"


@dataclass
class FrontierTokens:
    access_token: str
    refresh_token: str
    expires_at: float  # epoch seconds


def _base64_url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def generate_code_verifier() -> str:
    """Generate a code verifier for PKCE."""
    return _base64_url_encode(os.urandom(64))


def generate_code_challenge(verifier: str) -> str:
    """Generate SHA256 code challenge from verifier."""
    digest = hashlib.sha256(verifier.encode()).digest()
    return _base64_url_encode(digest)


class FrontierAuth:
    """oAuth2 PKCE authentication for Frontier CAPI."""

    def __init__(
        self,
        client_id: str,
        redirect_uri: str,
        app_name: str,
        app_version: str,
        scope: str = "auth capi",
        audience: str = "frontier",
    ):
        self.client_id = client_id
        self.redirect_uri = redirect_uri
        self.scope = scope
        self.audience = audience
        self._user_agent = f"EDCD-{app_name}-{app_version}"
        self._tokens: FrontierTokens | None = None

    @property
    def user_agent(self) -> str:
        return self._user_agent

    def build_auth_url(self, code_challenge: str, state: str) -> str:
        """Build the authorization URL for the user to visit."""
        params = {
            "audience": self.audience,
            "scope": self.scope,
            "response_type": "code",
            "client_id": self.client_id,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
            "state": state,
            "redirect_uri": self.redirect_uri,
        }
        return f"{AUTH_BASE}/auth?{urllib.parse.urlencode(params)}"

    def exchange_code(
        self, code: str, code_verifier: str, state: str, expected_state: str
    ) -> FrontierTokens:
        """Exchange authorization code for tokens."""
        if state != expected_state:
            raise ValueError("State mismatch - possible CSRF attack")

        import httpx

        data = {
            "redirect_uri": self.redirect_uri,
            "code": code,
            "grant_type": "authorization_code",
            "code_verifier": code_verifier,
            "client_id": self.client_id,
        }

        resp = httpx.post(
            f"{AUTH_BASE}/token",
            data=data,
            headers={"User-Agent": self._user_agent},
        )
        resp.raise_for_status()
        result = resp.json()

        self._tokens = FrontierTokens(
            access_token=result["access_token"],
            refresh_token=result["refresh_token"],
            expires_at=time.time() + result["expires_in"],
        )
        return self._tokens

    def refresh_tokens(self) -> FrontierTokens:
        """Refresh access token using refresh token."""
        if not self._tokens:
            raise ValueError("Not authenticated")

        import httpx

        data = {
            "grant_type": "refresh_token",
            "client_id": self.client_id,
            "refresh_token": self._tokens.refresh_token,
        }

        resp = httpx.post(
            f"{AUTH_BASE}/token",
            data=data,
            headers={"User-Agent": self._user_agent},
        )

        if resp.status_code != 200:
            self._tokens = None
            resp.raise_for_status()

        result = resp.json()
        self._tokens = FrontierTokens(
            access_token=result["access_token"],
            refresh_token=result["refresh_token"],
            expires_at=time.time() + result["expires_in"],
        )
        return self._tokens

    def get_valid_token(self) -> str:
        """Get a valid access token, refreshing if necessary."""
        if not self._tokens:
            raise ValueError("Not authenticated")

        # Refresh if expired or within 5 minutes
        if time.time() > self._tokens.expires_at - 300:
            self.refresh_tokens()

        return self._tokens.access_token

    @property
    def tokens(self) -> FrontierTokens | None:
        return self._tokens

    @tokens.setter
    def tokens(self, value: FrontierTokens | None):
        self._tokens = value


class CompanionClient:
    """Client for Frontier Companion API (CAPI) endpoints."""

    def __init__(self, auth: FrontierAuth, galaxy: str = "live"):
        self.auth = auth
        self.host = LIVE_HOST if galaxy == "live" else LEGACY_HOST

    def _request(self, path: str) -> Any:
        import httpx

        token = self.auth.get_valid_token()
        url = f"{self.host}{path}"

        resp = httpx.get(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "User-Agent": self.auth.user_agent,
            },
        )

        if resp.status_code == 422:
            self.auth.refresh_tokens()
            return self._request(path)

        resp.raise_for_status()
        return resp.json()

    def _request_binary(self, path: str, retries: int = 5) -> bytes:
        import httpx

        token = self.auth.get_valid_token()
        url = f"{self.host}{path}"

        resp = httpx.get(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "User-Agent": self.auth.user_agent,
            },
        )

        if resp.status_code == 422:
            self.auth.refresh_tokens()
            return self._request_binary(path, retries)

        if resp.status_code == 102:
            if retries > 0:
                time.sleep(10)
                return self._request_binary(path, retries - 1)
            resp.raise_for_status()

        resp.raise_for_status()
        return resp.content

    def get_visited_stars(self) -> bytes:
        """Get visited stars data (zip file)."""
        return self._request_binary("/visitedstars")

    def get_profile(self) -> dict[str, Any]:
        """Get commander profile."""
        return self._request("/profile")

    def get_market(self) -> dict[str, Any]:
        """Get station market data."""
        return self._request("/market")

    def get_shipyard(self) -> dict[str, Any]:
        """Get station shipyard and outfitting."""
        return self._request("/shipyard")

    def get_fleet_carrier(self) -> dict[str, Any]:
        """Get fleet carrier information."""
        return self._request("/fleetcarrier")

    def get_journal(self, year: int | None = None, month: int | None = None, day: int | None = None) -> dict[str, Any]:
        """Get journal entries."""
        path = "/journal"
        if year:
            path += f"/{year}"
            if month:
                path += f"/{month}"
                if day:
                    path += f"/{day}"
        return self._request(path)

    def get_community_goals(self) -> dict[str, Any]:
        """Get active community goals."""
        return self._request("/communitygoals")

    def get_profile_ships(self) -> list[dict[str, Any] | None]:
        """Get profile with ships converted from sparse object to list."""
        from .utils import listify
        profile = self.get_profile()
        return listify(profile.get("ships", {}))

    def is_docked(self) -> bool:
        """Check if commander is currently docked."""
        try:
            profile = self.get_profile()
            return profile.get("commander", {}).get("docked", False)
        except Exception:
            return False
