from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional, Tuple
from ..data import material


@dataclass
class MaterialEntry:
    name: str = ""
    ed_id: Optional[int] = None
    category: str = ""
    grade: int = 0
    count: int = 0
    max_capacity: int = 1000


@dataclass
class MaterialInventory:
    materials: List[MaterialEntry] = field(default_factory=list)
    timestamp: datetime = field(default_factory=datetime.utcnow)


@dataclass
class BlueprintRequirement:
    material_name: str = ""
    quantity: int = 0
    grade: int = 0


MATERIAL_CAPS: dict = {1: 3000, 2: 3000, 3: 3000, 4: 3000, 5: 3000}
MICRO_RESOURCE_CAPS: dict = {1: 3000, 2: 3000, 3: 3000, 4: 3000, 5: 3000}


def create_inventory() -> MaterialInventory:
    entries = []
    for m in material:
        entry = MaterialEntry(
            name=m.get("name", ""),
            ed_id=m.get("id"),
            category=m.get("category", ""),
            grade=m.get("grade", 0),
            max_capacity=3000,
        )
        entries.append(entry)
    return MaterialInventory(materials=entries)


def update_inventory(inv: MaterialInventory, material_name: str, change: int) -> MaterialInventory:
    for entry in inv.materials:
        if entry.name == material_name:
            entry.count = max(0, min(entry.max_capacity, entry.count + change))
            break
    inv.timestamp = datetime.utcnow()
    return inv


def can_craft_blueprint(inv: MaterialInventory, requirements: List[BlueprintRequirement]) -> Tuple[bool, List[Tuple[str, int, int]]]:
    missing = []
    can_craft = True
    for req in requirements:
        have = 0
        for entry in inv.materials:
            if entry.name == req.material_name:
                have = entry.count
                break
        if have < req.quantity:
            can_craft = False
            missing.append((req.material_name, have, req.quantity))
    return (can_craft, missing)
