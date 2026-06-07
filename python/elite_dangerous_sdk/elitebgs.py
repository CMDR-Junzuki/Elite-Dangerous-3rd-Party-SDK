"""
EliteBGS API V5 Client for Elite Dangerous BGS data.

API docs: https://elitebgs.app/ebgs/
Rate limit: 20 requests per minute (shared per IP)
Base URL: https://elitebgs.app/api/ebgs/v5
"""

from time import monotonic, sleep as _sleep
from typing import Any
from urllib.parse import urlencode

import httpx

BASE_URL = "https://elitebgs.app/api/ebgs/v5"


class EliteBGSClient:
    """Client for the EliteBGS API V5."""

    def __init__(self, base_url: str = BASE_URL, rpm: int = 20):
        self._base = base_url.rstrip("/")
        self._min_interval = 60.0 / rpm
        self._last_request = 0.0
        self._client = httpx.Client()

    def _rate_limit(self):
        now = monotonic()
        elapsed = now - self._last_request
        if elapsed < self._min_interval:
            _sleep(self._min_interval - elapsed)
        self._last_request = monotonic()

    def _get(self, path: str, params: dict[str, Any] | None = None) -> Any:
        self._rate_limit()
        url = f"{self._base}{path}"
        if params:
            filtered = {k: v for k, v in params.items() if v is not None}
            qs = urlencode(filtered, doseq=True)
            if qs:
                url = f"{url}?{qs}"
        resp = self._client.get(url)
        resp.raise_for_status()
        return resp.json()

    def get_systems(
        self,
        name: str | None = None,
        faction: str | list[str] | None = None,
        allegiance: str | None = None,
        government: str | None = None,
        state: str | None = None,
        primary_economy: str | None = None,
        secondary_economy: str | None = None,
        security: str | None = None,
        reference_system: str | None = None,
        reference_system_id: str | None = None,
        reference_distance: int | None = None,
        reference_distance_min: int | None = None,
        sphere: bool | None = None,
        begins_with: str | None = None,
        faction_details: bool | None = None,
        faction_history: bool | None = None,
        faction_id: str | list[str] | None = None,
        faction_control: bool | None = None,
        faction_allegiance: str | list[str] | None = None,
        faction_government: str | list[str] | None = None,
        influence_gt: float | None = None,
        influence_lt: float | None = None,
        active_state: str | None = None,
        pending_state: str | None = None,
        recovering_state: str | None = None,
        time_min: int | None = None,
        time_max: int | None = None,
        count: int | None = None,
        page: int | None = None,
        minimal: bool | None = None,
        **kwargs: Any,
    ) -> dict[str, Any]:
        """GET /systems — search systems with optional filters and history."""
        params = {
            "name": name,
            "faction": faction,
            "allegiance": allegiance,
            "government": government,
            "state": state,
            "primaryEconomy": primary_economy,
            "secondaryEconomy": secondary_economy,
            "security": security,
            "referenceSystem": reference_system,
            "referenceSystemId": reference_system_id,
            "referenceDistance": reference_distance,
            "referenceDistanceMin": reference_distance_min,
            "sphere": str(sphere).lower() if sphere is not None else None,
            "beginsWith": begins_with,
            "factionDetails": str(faction_details).lower() if faction_details is not None else None,
            "factionHistory": str(faction_history).lower() if faction_history is not None else None,
            "factionId": faction_id,
            "factionControl": str(faction_control).lower() if faction_control is not None else None,
            "factionAllegiance": faction_allegiance,
            "factionGovernment": faction_government,
            "influenceGT": influence_gt,
            "influenceLT": influence_lt,
            "activeState": active_state,
            "pendingState": pending_state,
            "recoveringState": recovering_state,
            "timeMin": time_min,
            "timeMax": time_max,
            "count": count,
            "page": page,
            "minimal": str(minimal).lower() if minimal is not None else None,
            **kwargs,
        }
        return self._get("/systems", params)

    def get_factions(
        self,
        name: str | None = None,
        system: str | None = None,
        system_id: str | list[str] | None = None,
        allegiance: str | None = None,
        government: str | None = None,
        active_state: str | None = None,
        pending_state: str | None = None,
        recovering_state: str | None = None,
        influence_gt: float | None = None,
        influence_lt: float | None = None,
        system_details: bool | None = None,
        filter_system_in_history: bool | None = None,
        begins_with: str | None = None,
        minimal: bool | None = None,
        time_min: int | None = None,
        time_max: int | None = None,
        count: int | None = None,
        page: int | None = None,
        **kwargs: Any,
    ) -> dict[str, Any]:
        """GET /factions — search factions with optional filters and history."""
        params = {
            "name": name,
            "system": system,
            "systemId": system_id,
            "allegiance": allegiance,
            "government": government,
            "activeState": active_state,
            "pendingState": pending_state,
            "recoveringState": recovering_state,
            "influenceGT": influence_gt,
            "influenceLT": influence_lt,
            "systemDetails": str(system_details).lower() if system_details is not None else None,
            "filterSystemInHistory": str(filter_system_in_history).lower() if filter_system_in_history is not None else None,
            "beginsWith": begins_with,
            "minimal": str(minimal).lower() if minimal is not None else None,
            "timeMin": time_min,
            "timeMax": time_max,
            "count": count,
            "page": page,
            **kwargs,
        }
        return self._get("/factions", params)

    def get_stations(
        self,
        name: str | None = None,
        system: str | None = None,
        type_: str | None = None,
        economy: str | None = None,
        allegiance: str | None = None,
        government: str | None = None,
        state: str | None = None,
        begins_with: str | None = None,
        time_min: int | None = None,
        time_max: int | None = None,
        count: int | None = None,
        page: int | None = None,
        **kwargs: Any,
    ) -> dict[str, Any]:
        """GET /stations — search stations with optional filters and history."""
        params = {
            "name": name,
            "system": system,
            "type": type_,
            "economy": economy,
            "allegiance": allegiance,
            "government": government,
            "state": state,
            "beginsWith": begins_with,
            "timeMin": time_min,
            "timeMax": time_max,
            "count": count,
            "page": page,
            **kwargs,
        }
        return self._get("/stations", params)

    def get_ticks(
        self,
        time_min: int | None = None,
        time_max: int | None = None,
    ) -> list[dict[str, Any]]:
        """GET /ticks — get BGS tick times."""
        params = {
            "timeMin": time_min,
            "timeMax": time_max,
        }
        return self._get("/ticks", params)

    def get_system_by_name(self, name: str) -> dict[str, Any]:
        """Convenience: get system by exact name."""
        return self.get_systems(name=name, page=1)

    def get_faction_by_name(self, name: str) -> dict[str, Any]:
        """Convenience: get faction by exact name."""
        return self.get_factions(name=name, page=1)

    def get_stations_by_system(self, system_name: str) -> dict[str, Any]:
        """Convenience: get stations in a system."""
        return self.get_stations(system=system_name)

    def get_latest_tick(self) -> dict[str, Any] | None:
        """Convenience: get the most recent BGS tick."""
        ticks = self.get_ticks()
        return ticks[0] if ticks else None
