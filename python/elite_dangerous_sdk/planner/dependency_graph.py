from dataclasses import dataclass, field
from typing import Dict, List, Optional
from ..data import material
from .engineering_planner import (
    PlannedModification, EngineeringPlan, plan_engineering,
)
from .materials import MaterialInventory


@dataclass
class MaterialRequirement:
    name: str = ""
    category: str = ""
    grade: int = 0
    needed: int = 0
    available: int = 0
    missing: int = 0


@dataclass
class TradeUpOption:
    from_material: str = ""
    from_category: str = ""
    from_grade: int = 0
    from_quantity_needed: int = 0
    ratio: int = 0
    available_in_inventory: int = 0
    feasible: bool = False


@dataclass
class MissingMaterial(MaterialRequirement):
    trade_ups: List[TradeUpOption] = field(default_factory=list)
    can_trade_up: bool = False


@dataclass
class BuildEvaluation:
    plan: EngineeringPlan = field(default_factory=EngineeringPlan)
    inventory: Optional[MaterialInventory] = None
    requirements: List[MaterialRequirement] = field(default_factory=list)
    missing: List[MissingMaterial] = field(default_factory=list)
    can_craft_all: bool = True
    can_craft_with_trades: bool = True
    total_materials_needed: int = 0
    total_missing: int = 0
    engineers: List[str] = field(default_factory=list)


def _build_material_meta() -> Dict[str, dict]:
    meta = {}
    for m in material:
        meta[m.get("name", "")] = {
            "category": m.get("type", "Manufactured").lower(),
            "grade": int(m.get("rarity", 1)),
        }
    return meta


_material_meta = _build_material_meta()


def _get_material_info(name: str, inventory: Optional[MaterialInventory] = None) -> dict:
    known = _material_meta.get(name)
    if known:
        return known
    if inventory:
        for entry in inventory.materials:
            if entry.name == name:
                return {"category": _material_type_from_name(entry.name), "grade": entry.grade or _material_meta.get(entry.name, {}).get("grade", 3)}
    return {"category": "manufactured", "grade": 3}


def _material_type_from_name(name: str) -> str:
    known = _material_meta.get(name)
    if known:
        return known["category"]
    return "manufactured"


def trade_ratio(from_grade: int, to_grade: int) -> int:
    diff = abs(to_grade - from_grade)
    return 6 ** max(1, diff)


def evaluate_build(
    modifications: List[PlannedModification],
    inventory: Optional[MaterialInventory] = None,
) -> BuildEvaluation:
    plan = plan_engineering(modifications)
    requirements: List[MaterialRequirement] = []
    missing: List[MissingMaterial] = []
    can_craft_all = True
    total_materials_needed = 0
    total_missing = 0

    for mat_name, needed in plan.material_total.items():
        info = _get_material_info(mat_name, inventory)
        available = 0
        if inventory:
            for entry in inventory.materials:
                if entry.name == mat_name:
                    available = entry.count
                    break
        missing_qty = max(0, needed - available)
        total_materials_needed += needed

        req = MaterialRequirement(
            name=mat_name,
            category=info["category"],
            grade=info["grade"],
            needed=needed,
            available=available,
            missing=missing_qty,
        )
        requirements.append(req)

        if missing_qty > 0:
            can_craft_all = False
            total_missing += missing_qty
            trade_ups = _compute_trade_ups(mat_name, info["category"], info["grade"], missing_qty, inventory)
            missing.append(MissingMaterial(
                name=req.name,
                category=req.category,
                grade=req.grade,
                needed=req.needed,
                available=req.available,
                missing=req.missing,
                trade_ups=trade_ups,
                can_trade_up=any(t.feasible for t in trade_ups),
            ))

    can_craft_with_trades = all(m.can_trade_up for m in missing)

    return BuildEvaluation(
        plan=plan,
        inventory=inventory,
        requirements=requirements,
        missing=missing,
        can_craft_all=can_craft_all,
        can_craft_with_trades=can_craft_with_trades,
        total_materials_needed=total_materials_needed,
        total_missing=total_missing,
        engineers=plan.engineers,
    )


def _compute_trade_ups(
    target_name: str,
    target_category: str,
    target_grade: int,
    missing_qty: int,
    inventory: Optional[MaterialInventory] = None,
) -> List[TradeUpOption]:
    if not inventory:
        return []

    options = []
    for entry in inventory.materials:
        entry_type = _material_type_from_name(entry.name)
        entry_grade = entry.grade or _material_meta.get(entry.name, {}).get("grade", 0)
        if entry_type == target_category and entry_grade <= target_grade and entry.count > 0:
            ratio = trade_ratio(entry_grade, target_grade)
            from_qty = ratio * missing_qty
            options.append(TradeUpOption(
                from_material=entry.name,
                from_category=entry_type,
                from_grade=entry_grade,
                from_quantity_needed=from_qty,
                ratio=ratio,
                available_in_inventory=entry.count,
                feasible=entry.count >= from_qty,
            ))

    options.sort(key=lambda o: (not o.feasible, o.from_quantity_needed))
    return options
