from dataclasses import dataclass
from enum import IntEnum
from typing import List, Optional


class ThargoidWarState(IntEnum):
    NONE = 0
    ALERT = 20
    INVASION = 30
    CONTROLLED = 40
    RECOVERY = 50
    MAELSTROM = 70


THARGOID_WAR_STATE_NAMES = {
    ThargoidWarState.NONE: "None",
    ThargoidWarState.ALERT: "Alert",
    ThargoidWarState.INVASION: "Invasion",
    ThargoidWarState.CONTROLLED: "Controlled",
    ThargoidWarState.RECOVERY: "Recovery",
    ThargoidWarState.MAELSTROM: "Maelstrom",
}


@dataclass
class TitanInfo:
    name: str = ""
    system_name: str = ""
    system_address: Optional[int] = None
    body: str = ""
    arrival_distance_ls: int = 0
    state: str = "defeated"
    defeated_date: Optional[str] = None


TITAN_NAMES = [
    "Taranis", "Indra", "Leigong", "Cocijo",
    "Oya", "Thor", "Raijin", "Hadad",
]

TITANS = {
    "Taranis": {"name": "Taranis", "system_name": "Hyades Sector FB-N b7-6", "body": "A 1", "arrival_distance_ls": 130, "state": "defeated", "defeated_date": "3309-09-28"},
    "Indra": {"name": "Indra", "system_name": "HIP 20567", "body": "7", "arrival_distance_ls": 3330, "state": "defeated", "defeated_date": "3309-10-05"},
    "Leigong": {"name": "Leigong", "system_name": "HIP 8887", "body": "A 4", "arrival_distance_ls": 2540, "state": "defeated", "defeated_date": "3309-11-18"},
    "Cocijo": {"name": "Cocijo", "system_name": "Col 285 Sector BA-P c6-18", "body": "3", "arrival_distance_ls": 1300, "state": "defeated", "defeated_date": "3310-12-18"},
    "Oya": {"name": "Oya", "system_name": "Cephei Sector BV-Y b4", "body": "B 1", "arrival_distance_ls": 5850, "state": "defeated", "defeated_date": "3309-11-01"},
    "Thor": {"name": "Thor", "system_name": "Col 285 Sector IG-O c6-5", "body": "3", "arrival_distance_ls": 820, "state": "defeated", "defeated_date": "3309-11-25"},
    "Raijin": {"name": "Raijin", "system_name": "Pegasi Sector IH-U b3-3", "body": "2", "arrival_distance_ls": 400, "state": "defeated", "defeated_date": "3309-12-16"},
    "Hadad": {"name": "Hadad", "system_name": "HIP 30377", "body": "B 8", "arrival_distance_ls": 39230, "state": "defeated", "defeated_date": "3309-12-30"},
}


def get_titan_by_name(name: str) -> Optional[TitanInfo]:
    t = TITANS.get(name)
    if t is None:
        return None
    return TitanInfo(**t)


def get_titan_by_system(system_name: str) -> Optional[TitanInfo]:
    for t in TITANS.values():
        if t["system_name"] == system_name:
            return TitanInfo(**t)
    return None


def get_all_titans() -> List[TitanInfo]:
    return [TitanInfo(**t) for t in TITANS.values()]


def get_defeated_titans() -> List[TitanInfo]:
    return [TitanInfo(**t) for t in TITANS.values() if t["state"] == "defeated"]


def parse_thargoid_war_state(war_type: Optional[str]) -> ThargoidWarState:
    if war_type is None:
        return ThargoidWarState.NONE
    mapping = {
        "Alert": ThargoidWarState.ALERT,
        "Invasion": ThargoidWarState.INVASION,
        "Controlled": ThargoidWarState.CONTROLLED,
        "Recovery": ThargoidWarState.RECOVERY,
        "Maelstrom": ThargoidWarState.MAELSTROM,
    }
    return mapping.get(war_type, ThargoidWarState.NONE)
