from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from .utils import Coords


@dataclass
class StationBrief:
    name: str
    marketId: Optional[int] = None
    type: Optional[str] = None
    distanceToArrival: Optional[float] = None
    faction: Optional[str] = None
    government: Optional[str] = None
    allegiance: Optional[str] = None
    economy: Optional[str] = None
    haveMarket: Optional[bool] = None
    haveShipyard: Optional[bool] = None
    haveOutfitting: Optional[bool] = None


@dataclass
class SystemDetail:
    name: str
    id: int
    edsmId: Optional[int] = None
    coords: Optional[Coords] = None
    population: Optional[int] = None
    government: Optional[str] = None
    allegiance: Optional[str] = None
    security: Optional[str] = None
    primaryEconomy: Optional[str] = None
    needsPermit: Optional[bool] = None
    permitName: Optional[str] = None
    controllingFaction: Optional[str] = None
    reserveType: Optional[str] = None
    stations: Optional[list[StationBrief]] = None
    bodies: Optional[list[dict]] = None
    updatedAt: Optional[str] = None


@dataclass
class StationDetail(StationBrief):
    systemName: Optional[str] = None
    systemId: Optional[int] = None
    edsmSystemId: Optional[int] = None
    updatedAt: Optional[str] = None
    otherServices: Optional[list[str]] = None


@dataclass
class CommodityLocation:
    name: str
    buyPrice: int
    sellPrice: int
    meanPrice: int
    demand: int
    stock: int
    demandBracket: Optional[int] = None
    stockBracket: Optional[int] = None
    statusFlags: Optional[str] = None
    distanceToArrival: Optional[float] = None


@dataclass
class RouteJump:
    systemName: str
    distance: float
    systemAddress: Optional[int] = None
    coords: Optional[Coords] = None


@dataclass
class RouteResult:
    jumps: list[RouteJump]
    distance: float
    duration: float


@dataclass
class NearestResult:
    systemName: str
    distance: float
    coords: Optional[Coords] = None
    population: Optional[int] = None
    government: Optional[str] = None
    allegiance: Optional[str] = None
    primaryEconomy: Optional[str] = None
    security: Optional[str] = None
    needsPermit: Optional[bool] = None


@dataclass
class SearchResponse:
    total: int
    results: Optional[list[dict]] = None


@dataclass
class StationSearchResponse:
    total: int
    results: Optional[list[StationDetail]] = None
