"""
EDSM (Elite Dangerous Star Map) API Client.

API docs: https://www.edsm.net/en/api-v1
System API: https://www.edsm.net/en/api-system-v1
"""

from typing import Any

import httpx

BASE_URL = "https://www.edsm.net"


class EDSMClient:
    """Client for the EDSM API."""

    def __init__(self, api_key: str | None = None, commander_name: str | None = None):
        self.api_key = api_key
        self.commander_name = commander_name
        self._client = httpx.Client()

    def _get(self, path: str, params: dict[str, Any] | None = None) -> Any:
        if params is None:
            params = {}
        if self.api_key:
            params["apiKey"] = self.api_key
        if self.commander_name:
            params["commanderName"] = self.commander_name

        url = f"{BASE_URL}{path}"
        resp = self._client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()

    # === System API ===

    def get_system(self, system_name: str, show_coords: bool = True) -> dict[str, Any]:
        """Get information about a system."""
        return self._get("/api-v1/system", {
            "systemName": system_name,
            "showId": 1,
            "showCoordinates": 1 if show_coords else 0,
            "showPermit": 1,
        })

    def get_systems(self, system_names: list[str]) -> list[dict[str, Any]]:
        """Get information about multiple systems."""
        params = {"showId": 1, "showCoordinates": 1}
        for i, name in enumerate(system_names):
            params[f"systemName[{i}]"] = name
        return self._get("/api-v1/systems", params)

    def get_sphere_systems(
        self, system_name: str, radius: float, min_radius: float = 0
    ) -> list[dict[str, Any]]:
        """Get systems within a sphere radius."""
        return self._get("/api-v1/sphere-systems", {
            "systemName": system_name,
            "radius": min(radius, 100),
            "minRadius": min_radius,
            "showCoordinates": 1,
        })

    def get_cube_systems(self, system_name: str, size: float) -> list[dict[str, Any]]:
        """Get systems within a cube."""
        return self._get("/api-v1/cube-systems", {
            "systemName": system_name,
            "size": min(size, 200),
            "showCoordinates": 1,
        })

    # === System v1 (detailed) ===

    def get_system_bodies(self, system_name: str) -> dict[str, Any]:
        """Get celestial bodies in a system."""
        return self._get("/api-system-v1/bodies", {"systemName": system_name})

    def get_system_stations(self, system_name: str) -> dict[str, Any]:
        """Get stations in a system."""
        return self._get("/api-system-v1/stations", {"systemName": system_name})

    def get_system_factions(self, system_name: str) -> dict[str, Any]:
        """Get factions in a system."""
        return self._get("/api-system-v1/factions", {"systemName": system_name})

    def get_system_estimated_value(self, system_name: str) -> dict[str, Any]:
        """Get estimated scan value of a system."""
        return self._get("/api-system-v1/estimated-value", {"systemName": system_name})

    def get_station_market(self, system_name: str, station_name: str) -> dict[str, Any]:
        """Get market data for a station."""
        return self._get("/api-system-v1/stations/market", {
            "systemName": system_name,
            "stationName": station_name,
        })

    def get_station_shipyard(self, system_name: str, station_name: str) -> dict[str, Any]:
        """Get shipyard data for a station."""
        return self._get("/api-system-v1/stations/shipyard", {
            "systemName": system_name,
            "stationName": station_name,
        })

    def get_station_outfitting(self, system_name: str, station_name: str) -> dict[str, Any]:
        """Get outfitting data for a station."""
        return self._get("/api-system-v1/stations/outfitting", {
            "systemName": system_name,
            "stationName": station_name,
        })

    def get_system_traffic(self, system_name: str) -> dict[str, Any]:
        """Get traffic data for a system."""
        return self._get("/api-system-v1/traffic", {"systemName": system_name})

    def get_system_deaths(self, system_name: str) -> dict[str, Any]:
        """Get death data for a system."""
        return self._get("/api-system-v1/deaths", {"systemName": system_name})

    # === Commander API ===

    def get_commander_ranks(self) -> dict[str, Any]:
        """Get commander ranks."""
        return self._get("/api-commander-v1/get-ranks")

    # === Logs API ===

    def get_commander_logs(
        self,
        system_name: str | None = None,
        start_date_time: str | None = None,
        end_date_time: str | None = None,
        show_id: bool | None = None,
    ) -> dict[str, Any]:
        """Get commander journal logs."""
        params: dict[str, Any] = {}
        if system_name is not None:
            params["systemName"] = system_name
        if start_date_time is not None:
            params["startDateTime"] = start_date_time
        if end_date_time is not None:
            params["endDateTime"] = end_date_time
        if show_id is True:
            params["showId"] = 1
        return self._get("/api-logs-v1/get-logs", params)

    # === Journal API ===

    def _post(self, path: str, data: dict[str, str]) -> Any:
        if self.api_key:
            data["apiKey"] = self.api_key
        if self.commander_name:
            data["commanderName"] = self.commander_name
        url = f"{BASE_URL}{path}"
        resp = self._client.post(url, data=data)
        resp.raise_for_status()
        return resp.json()

    def submit_journal(
        self,
        from_software: str,
        from_software_version: str,
        message: str | list[str],
        from_game_version: str | None = None,
        from_game_build: str | None = None,
    ) -> Any:
        """Submit a journal entry."""
        data: dict[str, str] = {
            "fromSoftware": from_software,
            "fromSoftwareVersion": from_software_version,
            "message": "\n".join(message) if isinstance(message, list) else message,
        }
        if from_game_version is not None:
            data["fromGameVersion"] = from_game_version
        if from_game_build is not None:
            data["fromGameBuild"] = from_game_build
        return self._post("/api-journal-v1", data)

    def get_discard_events(self) -> list[str]:
        """Get discardable journal events."""
        return self._get("/api-journal-v1/discard")
