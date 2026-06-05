"""
EDDN (Elite Dangerous Data Network) Client.

Sending:  POST https://eddn.edcd.io:4430/upload/
Receiving: tcp://eddn.edcd.io:9500 (ZeroMQ, zlib compressed)
"""

from typing import Any

import httpx

UPLOAD_URL = "https://eddn.edcd.io:4430/upload/"
RELAY_URL = "tcp://eddn.edcd.io:9500"

EDDN_SCHEMAS = {
    "COMMODITY": "https://eddn.edcd.io/schemas/commodity/3",
    "SHIPYARD": "https://eddn.edcd.io/schemas/shipyard/2",
    "OUTFITTING": "https://eddn.edcd.io/schemas/outfitting/2",
    "FCMATERIALS_CAPI": "https://eddn.edcd.io/schemas/fcmaterials_capi/1",
    "JOURNAL": "https://eddn.edcd.io/schemas/journal/1",
    "BLACKMARKET": "https://eddn.edcd.io/schemas/blackmarket/1",
    "APPROACHSETTLEMENT": "https://eddn.edcd.io/schemas/approachsettlement/1",
    "NAVROUTE": "https://eddn.edcd.io/schemas/navroute/1",
    "NAVROUTECLEAR": "https://eddn.edcd.io/schemas/navrouteclear/1",
    "SCAN": "https://eddn.edcd.io/schemas/scan/1",
    "CODEENTRY": "https://eddn.edcd.io/schemas/codeentry/1",
    "FSSDISCOVERED": "https://eddn.edcd.io/schemas/fssdiscovered/1",
    "SAASIGNSFOUND": "https://eddn.edcd.io/schemas/saasignalsfound/1",
    "FSDJUMP": "https://eddn.edcd.io/schemas/fsdjump/1",
    "LOCATION": "https://eddn.edcd.io/schemas/location/2",
    "CARRIERJUMP": "https://eddn.edcd.io/schemas/carrierjump/1",
    "DISPATCH": "https://eddn.edcd.io/schemas/dispatch/1",
    "BACKPACK": "https://eddn.edcd.io/schemas/backpack/1",
    "SHIPLOCKER": "https://eddn.edcd.io/schemas/shiplocker/1",
    "SHIPYARD_BUY": "https://eddn.edcd.io/schemas/shipyard/2",
    "OUTFITTING_BUY": "https://eddn.edcd.io/schemas/outfitting/2",
    "FCMATERIALS_JOURNAL": "https://eddn.edcd.io/schemas/fcmaterials_journal/1",
}


def validate_commodity_message(msg: dict) -> bool:
    if not msg.get("systemName"):
        return False
    if not msg.get("stationName"):
        return False
    if not msg.get("marketId"):
        return False
    commodities = msg.get("commodities")
    if not commodities or not isinstance(commodities, list):
        return False
    for c in commodities:
        if not c.get("name"):
            return False
        if "buyPrice" not in c:
            return False
        if "sellPrice" not in c:
            return False
    return True


def validate_shipyard_message(msg: dict) -> bool:
    if not msg.get("systemName"):
        return False
    if not msg.get("stationName"):
        return False
    if not msg.get("marketId"):
        return False
    ships = msg.get("ships")
    if not ships or not isinstance(ships, list):
        return False
    return True


def validate_outfitting_message(msg: dict) -> bool:
    if not msg.get("systemName"):
        return False
    if not msg.get("stationName"):
        return False
    if not msg.get("marketId"):
        return False
    modules = msg.get("modules")
    if not modules or not isinstance(modules, list):
        return False
    return True


def validate_fc_materials_message(msg: dict) -> bool:
    if not msg.get("systemName"):
        return False
    if not msg.get("stationName"):
        return False
    if not msg.get("marketId"):
        return False
    if not msg.get("carrierCallsign"):
        return False
    if not msg.get("carrierDockingAccess"):
        return False
    return True


def validate_journal_message(msg: dict) -> bool:
    if not msg or not isinstance(msg, dict):
        return False
    return True


def validate_blackmarket_message(msg: dict) -> bool:
    if not msg.get("systemName"):
        return False
    if not msg.get("stationName"):
        return False
    if not msg.get("marketId"):
        return False
    items = msg.get("items")
    if not items or not isinstance(items, list):
        return False
    for i in items:
        if not i.get("name"):
            return False
    return True


def validate_nav_route_message(msg: dict) -> bool:
    if not msg.get("systemName"):
        return False
    route = msg.get("route")
    if not route or not isinstance(route, list):
        return False
    return True


def validate_fc_materials_journal_message(msg: dict) -> bool:
    if not msg.get("timestamp"):
        return False
    if not msg.get("event"):
        return False
    if not msg.get("CarrierName"):
        return False
    if not msg.get("MarketID"):
        return False
    items = msg.get("Items")
    if not items or not isinstance(items, list):
        return False
    return True


class EDDNClient:
    """Client for sending data to EDDN."""

    def __init__(
        self,
        software_name: str,
        software_version: str,
        uploader_id: str = "unknown",
    ):
        self.software_name = software_name
        self.software_version = software_version
        self.uploader_id = uploader_id

    def send(
        self,
        schema_ref: str,
        message: dict[str, Any],
        gameversion: str = "",
        gamebuild: str = "",
    ):
        """Send a message to EDDN."""
        body = {
            "$schemaRef": schema_ref,
            "header": {
                "uploaderID": self.uploader_id,
                "gameversion": gameversion,
                "gamebuild": gamebuild,
                "softwareName": self.software_name,
                "softwareVersion": self.software_version,
            },
            "message": message,
        }

        resp = httpx.post(
            UPLOAD_URL,
            json=body,
            headers={"Content-Type": "application/json"},
        )

        if resp.status_code == 400:
            raise ValueError(f"EDDN validation failed: {resp.text}")
        if resp.status_code == 426:
            raise RuntimeError(f"EDDN schema outdated: {schema_ref}")
        if resp.status_code == 413:
            raise RuntimeError("EDDN message too large (max 1MB)")

        resp.raise_for_status()

    def send_commodity(
        self,
        system_name: str,
        station_name: str,
        market_id: int,
        commodities: list[dict[str, Any]],
        horizons: bool | None = None,
        odyssey: bool | None = None,
        gameversion: str = "",
        gamebuild: str = "",
    ):
        msg = {
            "systemName": system_name,
            "stationName": station_name,
            "marketId": market_id,
            "commodities": commodities,
        }
        if horizons is not None:
            msg["horizons"] = horizons
        if odyssey is not None:
            msg["odyssey"] = odyssey
        return self.send("https://eddn.edcd.io/schemas/commodity/3", msg, gameversion, gamebuild)

    def send_shipyard(
        self,
        system_name: str,
        station_name: str,
        market_id: int,
        ships: list[str],
        horizons: bool | None = None,
        odyssey: bool | None = None,
        gameversion: str = "",
        gamebuild: str = "",
    ):
        msg = {
            "systemName": system_name,
            "stationName": station_name,
            "marketId": market_id,
            "ships": ships,
        }
        if horizons is not None:
            msg["horizons"] = horizons
        if odyssey is not None:
            msg["odyssey"] = odyssey
        return self.send("https://eddn.edcd.io/schemas/shipyard/2", msg, gameversion, gamebuild)

    def send_outfitting(
        self,
        system_name: str,
        station_name: str,
        market_id: int,
        modules: list[str],
        horizons: bool | None = None,
        odyssey: bool | None = None,
        gameversion: str = "",
        gamebuild: str = "",
    ):
        msg = {
            "systemName": system_name,
            "stationName": station_name,
            "marketId": market_id,
            "modules": modules,
        }
        if horizons is not None:
            msg["horizons"] = horizons
        if odyssey is not None:
            msg["odyssey"] = odyssey
        return self.send("https://eddn.edcd.io/schemas/outfitting/2", msg, gameversion, gamebuild)

    def send_fleet_carrier(
        self,
        system_name: str,
        station_name: str,
        market_id: int,
        carrier_callsign: str,
        carrier_docking_access: str,
        commodities: list[dict],
        gameversion: str = "",
        gamebuild: str = "",
    ):
        msg = {
            "systemName": system_name,
            "stationName": station_name,
            "marketId": market_id,
            "carrierCallsign": carrier_callsign,
            "carrierDockingAccess": carrier_docking_access,
            "commodities": commodities,
        }
        return self.send(EDDN_SCHEMAS["FCMATERIALS_CAPI"], msg, gameversion, gamebuild)

    def send_journal(
        self,
        event: dict[str, Any],
        gameversion: str = "",
        gamebuild: str = "",
    ):
        """Send a journal event to EDDN."""
        return self.send(EDDN_SCHEMAS["JOURNAL"], event, gameversion, gamebuild)

    def send_blackmarket(
        self,
        system_name: str,
        station_name: str,
        market_id: int,
        items: list[dict[str, Any]],
        gameversion: str = "",
        gamebuild: str = "",
    ):
        """Send black market data to EDDN."""
        msg: dict[str, Any] = {
            "systemName": system_name,
            "stationName": station_name,
            "marketId": market_id,
            "items": items,
        }
        return self.send(EDDN_SCHEMAS["BLACKMARKET"], msg, gameversion, gamebuild)

    def send_nav_route(
        self,
        system_name: str,
        route: list[dict[str, Any]],
        gameversion: str = "",
        gamebuild: str = "",
    ):
        """Send navigation route to EDDN."""
        msg: dict[str, Any] = {
            "systemName": system_name,
            "route": route,
        }
        return self.send(EDDN_SCHEMAS["NAVROUTE"], msg, gameversion, gamebuild)

    def send_fc_materials_journal(
        self,
        timestamp: str,
        event: str,
        carrier_name: str,
        market_id: int,
        items: list[dict[str, Any]],
        carrier_id: int | None = None,
        gameversion: str = "",
        gamebuild: str = "",
    ):
        """Send fleet carrier materials from journal events to EDDN."""
        msg: dict[str, Any] = {
            "timestamp": timestamp,
            "event": event,
            "CarrierName": carrier_name,
            "MarketID": market_id,
            "Items": items,
        }
        if carrier_id is not None:
            msg["CarrierID"] = carrier_id
        return self.send(
            EDDN_SCHEMAS["FCMATERIALS_JOURNAL"], msg, gameversion, gamebuild
        )


class EDDNReceiver:
    """Receive data from EDDN via ZeroMQ."""

    def __init__(self, relay_url: str = RELAY_URL):
        self.relay_url = relay_url
        self._running = False

    def receive(self):
        """Yield EDDN messages (requires pyzmq)."""
        self._running = True
        try:
            import zmq
            import zlib

            ctx = zmq.Context()
            sock = ctx.socket(zmq.SUB)
            sock.connect(self.relay_url)
            sock.subscribe(b"")

            while self._running:
                try:
                    raw = sock.recv()
                    decompressed = zlib.decompress(raw)
                    yield decompressed
                except (zmq.ZMQError, zlib.error):
                    continue
        except ImportError:
            raise ImportError(
                "pyzmq is required for EDDN receiving. Install: pip install pyzmq"
            )

    def stop(self):
        self._running = False
