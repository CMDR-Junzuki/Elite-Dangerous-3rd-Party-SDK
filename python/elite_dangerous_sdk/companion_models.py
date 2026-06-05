"""
Typed response models for Frontier Companion API (CAPI).
Maps to the JSON structure returned by /profile, /market, /shipyard, /fleetcarrier, /journal, /communitygoals.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass
class CapCommander:
    name: Optional[str] = None
    currentShipId: Optional[int | str] = None
    docked: Optional[bool] = None


@dataclass
class CapMarketCommodity:
    id: int = 0
    statusFlags: Optional[str] = None
    name: str = ""
    buyPrice: int = 0
    sellPrice: int = 0
    meanPrice: int = 0
    stock: int = 0
    stockBracket: Optional[int] = None
    demand: int = 0
    demandBracket: Optional[int] = None


@dataclass
class CapProfileResponse:
    commander: Optional[CapCommander] = None
    lastSystem: Optional[dict] = None
    lastStarport: Optional[dict] = None
    ships: Optional[dict] = None
    fleetCarrier: Optional[dict] = None
    communityGoals: Optional[list[dict]] = None


@dataclass
class CapShipResponse:
    shipId: Optional[int | str] = None
    shipName: Optional[str] = None
    shipIdent: Optional[str] = None
    shipType: Optional[str] = None
    starsystem: Optional[dict] = None
    modules: Optional[list[dict] | dict] = None
    paints: Optional[list[str]] = None
    load: Optional[list[dict] | list] = None
    defense: Optional[dict] = None
    cargo: Optional[dict] = None


@dataclass
class CapMarketResponse:
    systemName: Optional[str] = None
    stationName: Optional[str] = None
    marketId: Optional[int] = None
    commodities: Optional[list[CapMarketCommodity]] = None


@dataclass
class CapShipyardResponse:
    systemName: Optional[str] = None
    stationName: Optional[str] = None
    marketId: Optional[int] = None
    ships: Optional[list[dict]] = None


@dataclass
class CapFleetCarrierResponse:
    systemName: Optional[str] = None
    stationName: Optional[str] = None
    marketId: Optional[int] = None
    carrierCallsign: Optional[str] = None
    carrierDockingAccess: Optional[str] = None
    commodities: Optional[list[CapMarketCommodity]] = None


@dataclass
class CapJournalResponse:
    journal: Optional[list[dict]] = None


@dataclass
class CapCommunityGoal:
    communityGoalGameId: int = 0
    title: Optional[str] = None
    systemName: Optional[str] = None
    marketName: Optional[str] = None
    expiry: Optional[str] = None
    isComplete: Optional[bool] = None
    currentGlobal: Optional[float] = None
    currentTotal: Optional[int | float] = None
    playerContribution: Optional[float] = None
    playerPercentileBand: Optional[str] = None
    bonus: Optional[int | float] = None
    targetTotal: Optional[int | float] = None
    topTier: Optional[dict | str] = None
    topRankSize: Optional[int] = None
