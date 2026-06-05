"""
Spansh API Client for Elite Dangerous route planning and data search.

Endpoints:
  /api/system/<id64>      - System data
  /api/station/<market>   - Station data
  /api/search?q=<query>   - Quick search
  /api/commodity/<type>/<ref>/<item>/<amount> - Buy/sell locations
  /api/stations/search    - Station search (POST)
"""

from typing import Any

import httpx

BASE_URL = "https://spansh.co.uk"


class SpanshClient:
    """Client for the Spansh API."""

    def __init__(self):
        self._client = httpx.Client()

    def _get(self, path: str) -> Any:
        resp = self._client.get(f"{BASE_URL}{path}")
        resp.raise_for_status()
        return resp.json()

    def _post(self, path: str, data: dict[str, Any]) -> Any:
        resp = self._client.post(
            f"{BASE_URL}{path}",
            json=data,
            headers={"Content-Type": "application/json"},
        )
        resp.raise_for_status()
        return resp.json()

    def get_system(self, system_id64: int) -> dict[str, Any]:
        """Get system details by system address (id64)."""
        return self._get(f"/api/system/{system_id64}")

    def get_station(self, market_id: int) -> dict[str, Any]:
        """Get station details by market ID."""
        return self._get(f"/api/station/{market_id}")

    def get_body(self, body_id64: int) -> dict[str, Any]:
        """Get body details by body id64."""
        return self._get(f"/api/body/{body_id64}")

    def search(self, query: str) -> dict[str, Any]:
        """Quick search across systems, stations, and bodies."""
        return self._get(f"/api/search?q={query}")

    def search_system_names(self, query: str) -> list[str]:
        """System name autocomplete/type-ahead."""
        return self._get(f"/api/systems/field_values/system_names?q={query}")

    def get_commodity_locations(
        self, type_: str, reference_system: str, commodity: str, amount: int
    ) -> list[dict[str, Any]]:
        """Get buy/sell locations for a commodity."""
        return self._get(
            f"/api/commodity/{type_}/{reference_system}/{commodity}/{amount}"
        )

    def search_stations(self, filters: dict[str, Any]) -> dict[str, Any]:
        """Advanced station search."""
        return self._post("/api/stations/search", filters)

    def dump_system(self, system_id64: int) -> dict[str, Any]:
        """Get complete data dump for a system."""
        return self._get(f"/api/dump/{system_id64}")

    def search_factions(self, query: str) -> list[str]:
        """Faction autocomplete."""
        return self._get(f"/api/systems/field_values/minor_factions?q={query}")

    def get_controlling_factions(self) -> list[str]:
        """Get all controlling minor factions."""
        return self._get("/api/systems/field_values/controlling_minor_faction")

    def get_route(
        self,
        from_system: str,
        to_system: str,
        range_: float | None = None,
        efficiency: int | None = None,
    ) -> dict[str, Any]:
        """Plot a route between two systems (neutron-boosted or standard).

        Uses POST /api/route to support optional range and efficiency parameters.
        """
        body: dict[str, Any] = {"from": from_system, "to": to_system}
        if range_ is not None:
            body["range"] = range_
        if efficiency is not None:
            body["efficiency"] = efficiency
        return self._post("/api/route", body)

    def get_nearest(self, system: str, type_: str) -> list[dict[str, Any]]:
        """Find the nearest POI of a given type to a system."""
        from urllib.parse import quote

        return self._get(
            f"/api/nearest?system={quote(system)}&type={quote(type_)}"
        )
