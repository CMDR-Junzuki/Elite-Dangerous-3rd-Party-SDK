from dataclasses import dataclass
from typing import List


@dataclass
class CarrierJump:
    from_system: str = ""
    to_system: str = ""
    distance_ly: float = 0.0
    fuel_cost: int = 0
    cooldown_minutes: int = 0


@dataclass
class CarrierCargo:
    pass


@dataclass
class CarrierFinance:
    balance: float = 0.0
    weekly_maintenance: float = 0.0
    reserve_balance: float = 0.0
    tax_rate: float = 0.0
    jumps_remaining: int = 0


SERVICE_COSTS = {
    "Universal Cartographics": 1850000,
    "Outfitting": 5000000,
    "Repair": 1500000,
    "Refuel": 1500000,
    "Rearm": 1500000,
    "Armoury": 1500000,
    "Shipyard": 6500000,
    "Vista Genomics": 1500000,
    "Bar": 1750000,
    "Concourse Bar": 1750000,
    "Pioneer Supplies": 5000000,
    "Redemption Office": 1850000,
    "Secure Warehouse": 2000000,
}


def calculate_jump_fuel_cost(distance_ly: float, laden_mass: float) -> int:
    total_mass = laden_mass + 25000
    return max(1, round(5 + distance_ly * total_mass / 200000))


def estimate_jump_time() -> dict:
    return {"charge_minutes": 15, "jump_duration": "< 1 minute", "cooldown_minutes": 5, "total_minutes": 21}


def calculate_weekly_maintenance(services: List[str]) -> int:
    base_cost = 5_000_000
    extras = 0
    for service in services:
        for key, cost in SERVICE_COSTS.items():
            if key.lower() in service.lower():
                extras += cost
                break
    return int(base_cost + extras)


def can_afford_maintenance(balance: float, weekly_maintenance: float) -> bool:
    return balance >= weekly_maintenance * 1.1
