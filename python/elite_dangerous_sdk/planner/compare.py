from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional


@dataclass
class ShipComparisonRow:
    stat: str = ""
    values: list[Optional[Any]] = field(default_factory=list)


STAT_FIELDS = [
    ("Name", "name"),
    ("Manufacturer", "manufacturer"),
    ("Hull Mass (t)", "hullMass"),
    ("Base Armour", "baseArmour"),
    ("Base Shield", "baseShieldStrength"),
    ("Speed (m/s)", "speed"),
    ("Boost (m/s)", "boost"),
    ("Pitch Rate", "pitch"),
    ("Roll Rate", "roll"),
    ("Yaw Rate", "yaw"),
    ("Hardness", "hardness"),
    ("Mass Lock Factor", "masslock"),
    ("Heat Capacity", "heatCapacity"),
    ("Reserve Fuel (t)", "reserveFuelCapacity"),
    ("Crew", "crew"),
    ("Hull Cost (CR)", "hullCost"),
]

SLOT_TYPES = [
    ("Total Standard Slots", "standard"),
    ("Total Hardpoints", "hardpoints"),
    ("Total Internal Slots", "internal"),
]


def compare_ships(ships: list[dict[str, Any]]) -> list[ShipComparisonRow]:
    rows: list[ShipComparisonRow] = []

    for label, field in STAT_FIELDS:
        values = []
        for ship in ships:
            props = ship.get("properties", {})
            values.append(props.get(field))
        rows.append(ShipComparisonRow(stat=label, values=values))

    for label, slot_key in SLOT_TYPES:
        values = []
        for ship in ships:
            slots = ship.get("slots", {})
            slot_list = slots.get(slot_key, [])
            values.append(len(slot_list) if isinstance(slot_list, list) else 0)
        rows.append(ShipComparisonRow(stat=label, values=values))

    return rows


def format_comparison_table(
    rows: list[ShipComparisonRow],
    ship_names: list[str],
) -> str:
    header = "Stat | " + " | ".join(ship_names)
    separator = "--- | " + " | ".join("---" for _ in ship_names)

    body = []
    for row in rows:
        vals = " | ".join(str(v) if v is not None else "N/A" for v in row.values)
        body.append(f"{row.stat} | {vals}")

    return "\n".join([header, separator, *body])
