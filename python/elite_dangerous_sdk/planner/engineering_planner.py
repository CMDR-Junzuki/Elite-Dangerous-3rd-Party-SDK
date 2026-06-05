from dataclasses import dataclass, field
from typing import Dict, List, Optional
from ..data import blueprints, specials, module_blueprint_map


@dataclass
class PlannedModification:
    module_group: str = ""
    blueprint_name: str = ""
    grade: int = 1
    experimental_effect: Optional[str] = None


@dataclass
class MaterialCost:
    material: str = ""
    quantity: int = 0
    grade: int = 0
    source: str = "blueprint"


@dataclass
class EngineerVisit:
    engineer: str = ""
    module_group: str = ""
    blueprint_name: str = ""
    grade: int = 0


@dataclass
class EngineeringPlan:
    materials: List[MaterialCost] = field(default_factory=list)
    material_total: Dict[str, int] = field(default_factory=dict)
    engineers: List[str] = field(default_factory=list)
    engineer_visits: List[EngineerVisit] = field(default_factory=list)


def _get_json_value(data, *keys):
    for key in keys:
        if isinstance(data, dict) and key in data:
            data = data[key]
        else:
            return None
    return data


def plan_engineering(modifications: List[PlannedModification]) -> EngineeringPlan:
    materials = []
    engineer_visits = []
    engineer_set = set()

    bp_data = blueprints if isinstance(blueprints, dict) else {}
    spec_data = specials if isinstance(specials, dict) else {}
    mod_bp_map = module_blueprint_map if isinstance(module_blueprint_map, dict) else {}

    for mod in modifications:
        grade_key = str(mod.grade)
        components = _get_json_value(bp_data, mod.blueprint_name, "grades", grade_key, "components")
        if isinstance(components, dict):
            for mat_name, qty in components.items():
                materials.append(MaterialCost(
                    material=mat_name,
                    quantity=qty,
                    grade=mod.grade,
                    source="blueprint",
                ))

        if mod.experimental_effect:
            exp_components = _get_json_value(spec_data, mod.experimental_effect, "components")
            if isinstance(exp_components, dict):
                for mat_name, qty in exp_components.items():
                    materials.append(MaterialCost(
                        material=mat_name,
                        quantity=qty,
                        grade=0,
                        source="experimental",
                    ))

        engineers_arr = _get_json_value(mod_bp_map, mod.module_group, "blueprints", mod.blueprint_name, "grades", grade_key, "engineers")
        if isinstance(engineers_arr, list):
            for eng in engineers_arr:
                if eng not in engineer_set:
                    engineer_set.add(eng)
                    engineer_visits.append(EngineerVisit(
                        engineer=eng,
                        module_group=mod.module_group,
                        blueprint_name=mod.blueprint_name,
                        grade=mod.grade,
                    ))

    material_total = {}
    for m in materials:
        material_total[m.material] = material_total.get(m.material, 0) + m.quantity

    return EngineeringPlan(
        materials=materials,
        material_total=material_total,
        engineers=sorted(engineer_set),
        engineer_visits=engineer_visits,
    )


def get_blueprint_components(blueprint_name: str, grade: int) -> List[MaterialCost]:
    result = []
    bp_data = blueprints if isinstance(blueprints, dict) else {}
    components = _get_json_value(bp_data, blueprint_name, "grades", str(grade), "components")
    if isinstance(components, dict):
        for mat_name, qty in components.items():
            result.append(MaterialCost(
                material=mat_name,
                quantity=qty,
                grade=grade,
                source="blueprint",
            ))
    return result


def get_experimental_effect_components(effect_name: str) -> List[MaterialCost]:
    result = []
    spec_data = specials if isinstance(specials, dict) else {}
    components = _get_json_value(spec_data, effect_name, "components")
    if isinstance(components, dict):
        for mat_name, qty in components.items():
            result.append(MaterialCost(
                material=mat_name,
                quantity=qty,
                grade=0,
                source="experimental",
            ))
    return result


def get_engineers_for_blueprint(module_group: str, blueprint_name: str, grade: int) -> List[str]:
    result = []
    mod_bp_map = module_blueprint_map if isinstance(module_blueprint_map, dict) else {}
    engineers_arr = _get_json_value(mod_bp_map, module_group, "blueprints", blueprint_name, "grades", str(grade), "engineers")
    if isinstance(engineers_arr, list):
        result = [str(e) for e in engineers_arr]
    return result
