"""
SDK utility functions: listify, coordinates, bitflags
"""

import math
from typing import Any, Optional


def listify(obj: Optional[dict[str, Any] | list]) -> list:
    if not obj:
        return []
    if isinstance(obj, list):
        return obj

    keys = [int(k) for k in obj.keys() if k.isdigit()]
    if not keys:
        return []

    max_key = max(keys)
    result: list = [None] * (max_key + 1)
    for key in keys:
        result[key] = obj[str(key)]
    return result


class Coords:
    def __init__(self, x: float, y: float, z: float):
        self.x = x
        self.y = y
        self.z = z

    def __repr__(self) -> str:
        return f"Coords({self.x:.2f}, {self.y:.2f}, {self.z:.2f})"


def distance(a: Coords, b: Coords) -> float:
    dx = a.x - b.x
    dy = a.y - b.y
    dz = a.z - b.z
    return math.sqrt(dx * dx + dy * dy + dz * dz)


def sphere_search(center: Coords, radius: float, systems: list[Coords]) -> list[Coords]:
    return [s for s in systems if distance(center, s) <= radius]


def midpoint(a: Coords, b: Coords) -> Coords:
    return Coords(
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
        (a.z + b.z) / 2,
    )


def bearing(a: Coords, b: Coords) -> dict[str, float]:
    dx = b.x - a.x
    dy = b.y - a.y
    dz = b.z - a.z
    horz = math.sqrt(dx * dx + dz * dz)
    return {
        "azimuth": math.atan2(dx, dz) * (180 / math.pi),
        "elevation": math.atan2(dy, horz) * (180 / math.pi),
    }


def parse_bitflags(value: int, flags: dict[str, int]) -> list[str]:
    return [name for name, bit in flags.items() if value & bit]


def has_flag(value: int, flag: int) -> bool:
    return (value & flag) == flag


def combine_flags(*flags: int) -> int:
    result = 0
    for f in flags:
        result |= f
    return result
