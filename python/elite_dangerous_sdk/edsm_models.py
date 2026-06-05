"""
EDSM API response type models.

Maps to the EDSM API JSON responses described at https://www.edsm.net/en/api-v1
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional

from .utils import Coords


@dataclass
class DuplicateInfo:
    id: int
    name: str


@dataclass
class SystemResponse:
    name: str
    id: int
    coords: Optional[Coords] = None
    requirePermit: Optional[bool] = None
    permitName: Optional[str] = None
    information: Optional[dict[str, Any]] = None  # JSON: dict or null
    primaryStar: Optional[str] = None
    hiddenAt: Optional[str] = None
    mergedTo: Optional[int] = None  # TS: number | string, simplified to int
    duplicates: Optional[list[DuplicateInfo]] = None


@dataclass
class BodyInfo:
    id: int
    name: str
    bodyId: int
    systemId: int
    type: Optional[str] = None  # "Star" | "Planet"
    subType: Optional[str] = None
    distanceToArrival: Optional[float] = None
    isLandable: Optional[bool] = None
    gravity: Optional[float] = None
    temperature: Optional[float] = None
    atmosphere: Optional[str] = None
    atmosphereType: Optional[str] = None
    volcanism: Optional[str] = None
    massEM: Optional[float] = None  # earth masses
    radius: Optional[float] = None
    surfacePressure: Optional[float] = None
    orbitalPeriod: Optional[float] = None
    semiMajorAxis: Optional[float] = None
    orbitalEccentricity: Optional[float] = None
    orbitalInclination: Optional[float] = None
    argOfPeriapsis: Optional[float] = None
    rotationalPeriod: Optional[float] = None
    axialTilt: Optional[float] = None
    materials: Optional[dict[str, float]] = None
    updateTime: Optional[str] = None  # ISO datetime or null


@dataclass
class MarketItem:
    name: str
    sellPrice: int
    buyPrice: int
    meanPrice: int
    stockBracket: int
    demandBracket: int
    stock: int
    demand: int
    statusFlags: Optional[str] = None


@dataclass
class MarketData:
    id: int
    name: str
    marketId: int
    items: Optional[list[MarketItem]] = None


@dataclass
class ShipyardData:
    id: int
    name: str
    shipyardId: Optional[int] = None
    ships: Optional[list[dict[str, Any]]] = None  # EDSM returns name list


@dataclass
class OutfittingData:
    id: int
    name: str
    outfittingId: Optional[int] = None
    modules: Optional[list[dict[str, Any]]] = None


@dataclass
class StationInfo:
    id: int
    name: str
    systemId: int
    type: Optional[str] = None
    marketId: Optional[int] = None
    distanceToArrival: Optional[float] = None
    allegiance: Optional[str] = None
    government: Optional[str] = None
    economy: Optional[str] = None
    secondEconomy: Optional[str] = None
    haveMarket: Optional[bool] = None
    haveShipyard: Optional[bool] = None
    haveOutfitting: Optional[bool] = None
    controllingFaction: Optional[dict[str, Any]] = None
    updateTime: Optional[str] = None  # ISO datetime or null
    otherServices: Optional[list[str]] = None


@dataclass
class EstimatedValue:
    value: Optional[float] = None
    minValue: Optional[float] = None
    maxValue: Optional[float] = None


@dataclass
class FactionInfo:
    name: str
    allegiance: Optional[str] = None
    government: Optional[str] = None
    influence: Optional[float] = None
    state: Optional[str] = None
    happiness: Optional[str] = None
    activeStates: Optional[list[dict[str, Any]]] = None
    pendingStates: Optional[list[dict[str, Any]]] = None
    recoveringStates: Optional[list[dict[str, Any]]] = None


@dataclass
class CommanderRanksResponse:
    ranks: Optional[dict[str, Any]] = None
    progress: Optional[dict[str, Any]] = None


@dataclass
class CommanderLogsResponse:
    logs: Optional[list[dict[str, Any]]] = None


@dataclass
class JournalSubmitResponse:
    message: Optional[str] = None
