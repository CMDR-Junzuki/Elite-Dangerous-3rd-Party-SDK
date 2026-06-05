from dataclasses import dataclass, field
from enum import IntEnum
from typing import List, Optional


@dataclass
class PowerplayState:
    power: str = ""
    rank: int = 0
    merits: int = 0
    merits_to_next_rank: int = 0
    weekly_allocation: int = 0
    voting_pledges: Optional[int] = None
    total_vouchers: Optional[int] = None


@dataclass
class ControlSystem:
    system: str = ""
    system_address: Optional[int] = None
    controlling_power: str = ""
    exploited_systems: Optional[List[str]] = None
    undermined: bool = False
    fortification_trigger: Optional[int] = None
    fortification_done: Optional[int] = None
    undermining_trigger: Optional[int] = None
    undermining_done: Optional[int] = None


POWERS = [
    "Aisling Duval", "Archon Delaine", "Arissa Lavigny-Duval",
    "Denton Patreus", "Edmund Mahon", "Felicia Winters",
    "Jerome Archer", "Li Yong-Rui", "Pranav Antal",
    "Yuri Grom", "Zachary Hudson", "Zemina Torval",
    "Nakato Kaine",
]

POWERPLAY_SALARIES = {
    "top_100_pct": 500000,
    "top_75_pct": 2500000,
    "top_50_pct": 5000000,
    "top_25_pct": 10000000,
    "top_10_pct": 50000000,
    "top_10": 100000000,
    "top_1": 1000000000,
}


def get_merits_for_rank(rank: int) -> int:
    if rank <= 1:
        return 0
    if rank == 2:
        return 2000
    if rank == 3:
        return 5000
    if rank == 4:
        return 9000
    if rank == 5:
        return 15000
    if rank >= 100:
        return 775000
    return 15000 + (rank - 5) * 8000


def merits_to_next_rank(current_merits: int) -> dict:
    rank = 1
    for r in range(100, 0, -1):
        if current_merits >= get_merits_for_rank(r):
            rank = r
            break
    if rank >= 100:
        return {"rank": 100, "merits_needed": 0}
    next_merits = get_merits_for_rank(rank + 1)
    return {"rank": rank, "merits_needed": next_merits - current_merits}


def get_powerplay_salary(bracket: str) -> int:
    return POWERPLAY_SALARIES.get(bracket, 0)


def estimate_merits_bracket(weekly_merits: int) -> str:
    if weekly_merits <= 0:
        return "top_100_pct"
    if weekly_merits >= 500000:
        return "top_1"
    if weekly_merits >= 200000:
        return "top_10"
    if weekly_merits >= 50000:
        return "top_10_pct"
    if weekly_merits >= 10000:
        return "top_25_pct"
    if weekly_merits >= 5000:
        return "top_50_pct"
    if weekly_merits >= 1000:
        return "top_75_pct"
    return "top_100_pct"


def estimate_merits_per_hour(activity: str) -> int:
    rates = {
        "mining": 30000,
        "combat_zone": 20000,
        "undermining": 15000,
        "fortification": 20000,
        "expansion": 18000,
        "bounty_hunting": 12000,
        "assignment": 5000,
        "trade": 3000,
        "voucher_turn_in": 10000,
    }
    return rates.get(activity.lower(), 3000)


class PowerplaySystemType(IntEnum):
    UNDEFINED = 0
    CONTROL = 1
    EXPLOITED = 2
    STRONGHOLD = 3
    FORTIFIED = 4
    PREPARATION = 5
    EXPANSION = 6
    CONTESTED = 7


POWERPLAY_SYSTEM_TYPES = {
    0: "Undefined",
    1: "Control",
    2: "Exploited",
    3: "Stronghold",
    4: "Fortified",
    5: "Preparation",
    6: "Expansion",
    7: "Contested",
}


@dataclass
class PowerplaySystem:
    name: str = ""
    system_address: Optional[int] = None
    power: str = ""
    type: PowerplaySystemType = PowerplaySystemType.UNDEFINED
    control_system: Optional[str] = None
    undermined: bool = False
    fortification_trigger: Optional[int] = None
    fortification_done: Optional[int] = None
    undermining_trigger: Optional[int] = None
    undermining_done: Optional[int] = None
    coords: Optional[List[float]] = None


@dataclass
class PowerplayPowerData:
    name: str = ""
    home_system: str = ""
    ethos: str = ""
    known_control_systems: List[str] = field(default_factory=list)
