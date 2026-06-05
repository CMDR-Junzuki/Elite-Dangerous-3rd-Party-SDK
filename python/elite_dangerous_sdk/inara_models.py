from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Optional


@dataclass
class InaraHeader:
    appName: str
    appVersion: str
    APIkey: str
    commanderName: str
    isDeveloped: bool


@dataclass
class InaraEvent:
    eventName: str
    eventTimestamp: Optional[str]
    eventData: Optional[dict[str, Any]]


@dataclass
class InaraRequest:
    header: InaraHeader
    events: list[InaraEvent]


@dataclass
class InaraEventResult:
    eventName: Optional[str]
    eventStatus: int
    eventCustomID: Optional[int] = None


@dataclass
class InaraResponse:
    header: InaraHeader
    events: list[InaraEventResult]
