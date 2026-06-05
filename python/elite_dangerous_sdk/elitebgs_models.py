"""Typed response models for the EliteBGS API V5."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Generic, Optional, TypeVar

T = TypeVar("T")


@dataclass
class PaginatedResponse(Generic[T]):
    docs: list[T]
    total: Optional[int] = None
    page: Optional[int] = None
    pages: Optional[int] = None


@dataclass
class StateEntry:
    state: Optional[str] = None


@dataclass
class ConflictEntry:
    type: str
    status: str
    faction1: Optional[dict] = None
    faction2: Optional[dict] = None


@dataclass
class FactionPresence:
    systemName: Optional[str] = None
    systemId: Optional[str | int] = None
    state: Optional[str] = None
    status: Optional[str] = None
    activeStates: Optional[list[StateEntry]] = None
    pendingStates: Optional[list[StateEntry]] = None
    recoveringStates: Optional[list[StateEntry]] = None


@dataclass
class EBGSSystem:
    name: str
    id: Optional[str | int] = None
    edsmId: Optional[int] = None
    population: Optional[int] = None
    security: Optional[str] = None
    government: Optional[str] = None
    allegiance: Optional[str] = None
    primaryEconomy: Optional[str] = None
    controllingFaction: Optional[str] = None
    state: Optional[str] = None
    needsPermit: Optional[bool] = None
    factions: Optional[list[FactionPresence]] = None
    conflicts: Optional[list[ConflictEntry]] = None
    updatedAt: Optional[str] = None


@dataclass
class EBGSFaction:
    name: str
    id: Optional[str | int] = None
    edsmId: Optional[int] = None
    allegiance: Optional[str] = None
    government: Optional[str] = None
    homeSystem: Optional[str | dict] = None
    isPlayerFaction: Optional[bool] = None
    updatedAt: Optional[str] = None


@dataclass
class EBGSStation:
    name: str
    id: Optional[str | int] = None
    edsmId: Optional[int] = None
    system: Optional[str] = None
    marketId: Optional[int | str] = None
    type: Optional[str] = None
    government: Optional[str] = None
    allegiance: Optional[str] = None
    economy: Optional[str] = None
    controllingFaction: Optional[dict | FactionPresence] = None
    updatedAt: Optional[str] = None


@dataclass
class TickTime:
    time: str
    system: Optional[str] = None
    systemId: Optional[str | int] = None
