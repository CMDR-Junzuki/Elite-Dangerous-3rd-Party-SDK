from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional

from .data.coriolis import modifications as _modifications
from .data.coriolis import modifier_actions as _modifier_actions
from .data.coriolis import blueprints as _blueprints
from .data.coriolis import module_blueprint_map as _bp_map

StatModType = str  # "percentage" | "numeric" | "object"
StatModMethod = str  # "multiplicative" | "additive" | "overwrite"


@dataclass
class GradeFeatures:
    components: dict[str, int] = field(default_factory=dict)
    features: dict[str, tuple[float, float]] = field(default_factory=dict)
    uuid: str = ""


@dataclass
class Blueprint:
    fdname: str = ""
    name: str = ""
    id: int = 0
    modulename: list[str] = field(default_factory=list)
    grades: dict[str, dict[str, Any]] = field(default_factory=dict)


BlueprintFeatures = dict[str, tuple[float, float]]


@dataclass
class StatMod:
    id: int
    name: str
    type: StatModType
    method: StatModMethod
    higherbetter: bool


@dataclass
class StatChange:
    original_value: float
    modified_value: float
    delta: float
    pct_change: float


@dataclass
class AppliedModification:
    blueprint_name: str
    fd_name: str
    grade: int
    special: Optional[str] = None
    changes: dict[str, StatChange] = field(default_factory=dict)


_mod_stats: dict[str, StatMod] = {}
for key, val in _modifications.items():
    _mod_stats[key] = StatMod(
        id=val.get("id", 0),
        name=val.get("name", key),
        type=val.get("type", "percentage"),
        method=val.get("method", "multiplicative"),
        higherbetter=val.get("higherbetter", True),
    )


def get_stat_mod(name: str) -> Optional[StatMod]:
    return _mod_stats.get(name)


def apply_blueprint_grade(
    base_stats: dict[str, float],
    features: BlueprintFeatures,
    grade: int,
    special_features: Optional[BlueprintFeatures] = None,
    roll_quality: Optional[float] = None,
) -> dict[str, float]:
    result = dict(base_stats)
    roll = roll_quality if roll_quality is not None else (grade - 1) / 4

    all_features = dict(features)
    if special_features:
        for key, val in special_features.items():
            if key in all_features:
                existing = all_features[key]
                all_features[key] = (existing[0] + val[0], existing[1] + val[1])
            else:
                all_features[key] = val

    for stat_name, (min_val, max_val) in all_features.items():
        raw_value = result.get(stat_name)
        if raw_value is None:
            continue

        stat_def = _mod_stats.get(stat_name)
        if stat_def is None:
            continue

        mod_value = min_val + (max_val - min_val) * roll

        effective_mod = (1 / (1 + mod_value) - 1) if stat_name == "rof" else mod_value

        if stat_def.method == "multiplicative":
            if stat_name in ("shieldboost", "hullboost"):
                result[stat_name] = (1 + raw_value) * (1 + effective_mod) - 1
            else:
                result[stat_name] = raw_value * (1 + effective_mod)
        elif stat_def.method == "additive":
            result[stat_name] = raw_value + effective_mod
        elif stat_def.method == "overwrite":
            result[stat_name] = effective_mod

    return result


def compute_engineering_changes(
    module_stats: dict[str, float],
    engineering: dict[str, Any],
) -> Optional[AppliedModification]:
    blueprint_name = engineering.get("blueprintName", "")
    if not blueprint_name:
        return None

    blueprint = _blueprints.get(blueprint_name)
    if blueprint is None:
        return AppliedModification(
            blueprint_name=blueprint_name,
            fd_name=blueprint_name,
            grade=engineering.get("grade", 1),
            changes={},
        )

    grade_key = str(engineering.get("grade", 1))
    grade_data = blueprint.get("grades", {}).get(grade_key)
    if grade_data is None:
        return AppliedModification(
            blueprint_name=blueprint.get("fdname", blueprint_name),
            fd_name=blueprint.get("fdname", blueprint_name),
            grade=int(grade_key),
            changes={},
        )

    grade_num = int(grade_key)
    features = grade_data.get("features", {})
    result = apply_blueprint_grade(module_stats, features, grade_num, None, 1)

    experimental = engineering.get("experimentalEffect")
    if experimental:
        special_mods = _modifier_actions.get(experimental)
        if special_mods and isinstance(special_mods, dict):
            for stat_name, raw_val in special_mods.items():
                if not isinstance(raw_val, (int, float)):
                    continue
                if stat_name not in result:
                    continue
                stat_def = _mod_stats.get(stat_name)
                if stat_def is None:
                    continue

                effective_val = (1 / (1 + raw_val) - 1) if stat_name == "rof" else raw_val

                if stat_def.method == "multiplicative":
                    if stat_name in ("shieldboost", "hullboost"):
                        result[stat_name] = (1 + result[stat_name]) * (1 + effective_val) - 1
                    else:
                        result[stat_name] = result[stat_name] * (1 + effective_val)
                elif stat_def.method == "additive":
                    result[stat_name] = result[stat_name] + effective_val
                elif stat_def.method == "overwrite":
                    result[stat_name] = effective_val

    changes: dict[str, StatChange] = {}
    for stat_name, mod_val in result.items():
        orig_val = module_stats.get(stat_name)
        if orig_val is None:
            continue
        delta = mod_val - orig_val
        changes[stat_name] = StatChange(
            original_value=orig_val,
            modified_value=mod_val,
            delta=delta,
            pct_change=delta / orig_val if orig_val != 0 else 0,
        )

    return AppliedModification(
        blueprint_name=blueprint.get("fdname", blueprint_name),
        fd_name=blueprint.get("fdname", blueprint_name),
        grade=grade_num,
        special=experimental,
        changes=changes,
    )


def get_available_blueprints(module_group: str) -> list[str]:
    mapping = _bp_map.get(module_group)
    if mapping is None:
        return []
    bps = mapping.get("blueprints", {})
    return list(bps.keys())
