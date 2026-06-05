import json
import os
from typing import Optional, Dict, List, Any

_data_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'specs', 'data', 'coriolis')

# Ships
ships: Dict[str, Any] = {}
ships_dir = os.path.join(_data_dir, "ships")
if os.path.isdir(ships_dir):
    for fname in os.listdir(ships_dir):
        if fname.endswith(".json") and fname != "index.js":
            with open(os.path.join(ships_dir, fname), encoding="utf-8") as f:
                data = json.load(f)
                ships.update(data)

ships_by_edid = {s.get("edID"): s for s in ships.values()}
ships_by_name = {s.get("properties", {}).get("name"): s for s in ships.values()}

# Hardpoint modules
hardpoint_modules: List[Dict[str, Any]] = []
hardpoints_dir = os.path.join(_data_dir, "modules", "hardpoints")
if os.path.isdir(hardpoints_dir):
    for fname in os.listdir(hardpoints_dir):
        if fname.endswith(".json"):
            with open(os.path.join(hardpoints_dir, fname), encoding="utf-8") as f:
                data = json.load(f)
            for group_key, variants in data.items():
                if isinstance(variants, list):
                    for v in variants:
                        v["_group"] = group_key
                    hardpoint_modules.extend(variants)

hardpoint_modules_by_edid = {m["edID"]: m for m in hardpoint_modules if m.get("edID")}

# Internal modules
internal_modules: List[Dict[str, Any]] = []
internal_dir = os.path.join(_data_dir, "modules", "internal")
if os.path.isdir(internal_dir):
    for fname in os.listdir(internal_dir):
        if fname.endswith(".json"):
            with open(os.path.join(internal_dir, fname), encoding="utf-8") as f:
                data = json.load(f)
            for group_key, variants in data.items():
                if isinstance(variants, list):
                    for v in variants:
                        v["_group"] = group_key
                    internal_modules.extend(variants)

internal_modules_by_edid = {m["edID"]: m for m in internal_modules if m.get("edID")}

# Standard modules
standard_modules: List[Dict[str, Any]] = []
standard_dir = os.path.join(_data_dir, "modules", "standard")
if os.path.isdir(standard_dir):
    for fname in os.listdir(standard_dir):
        if fname.endswith(".json"):
            with open(os.path.join(standard_dir, fname), encoding="utf-8") as f:
                data = json.load(f)
            for group_key, variants in data.items():
                if isinstance(variants, list):
                    for v in variants:
                        v["_group"] = group_key
                    standard_modules.extend(variants)

standard_modules_by_edid = {m["edID"]: m for m in standard_modules if m.get("edID")}

# All modules merged
all_modules = hardpoint_modules + internal_modules + standard_modules
all_modules_by_edid = {**hardpoint_modules_by_edid, **internal_modules_by_edid, **standard_modules_by_edid}

# Modifications
mod_dir = os.path.join(_data_dir, "modifications")

with open(os.path.join(mod_dir, "blueprints.json"), encoding="utf-8") as f:
    blueprints = json.load(f)
with open(os.path.join(mod_dir, "modifications.json"), encoding="utf-8") as f:
    modifications = json.load(f)
with open(os.path.join(mod_dir, "modifierActions.json"), encoding="utf-8") as f:
    modifier_actions = json.load(f)
with open(os.path.join(mod_dir, "specials.json"), encoding="utf-8") as f:
    specials = json.load(f)
with open(os.path.join(mod_dir, "modules.json"), encoding="utf-8") as f:
    module_blueprint_map = json.load(f)
