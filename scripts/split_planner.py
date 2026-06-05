"""Split planner.py into a planner/ package."""
import os
import re

planner_path = r"G:\Projects\Elite 3rd PArty SDK\python\elite_dangerous_sdk\planner.py"
pkg_dir = r"G:\Projects\Elite 3rd PArty SDK\python\elite_dangerous_sdk\planner"

with open(planner_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Line number boundaries of each section (0-indexed)
# Key events: class/def at top level that starts a new section
sections = {
    "materials": (0, 109),           # imports + MaterialEntry..can_craft_blueprint
    "engineers": (110, 256),         # EngineerInfo..estimate_engineer_progress
    "engineering_planner": (256, 386), # PlannedModification..get_engineers_for_blueprint
    "trade": (386, 442),             # TradeStation..filter_trade_routes
    "fleetcarrier": (442, 515),      # CarrierJump..can_afford_maintenance
    "powerplay": (515, 671),         # PowerplayState..PowerplayPowerData
    "thargoid": (671, 831),          # ThargoidWarState..get_war_state_name
    "colonization": (831, 927),      # ColonyState..parse_colonisation_construction_depot
    "colonization_economy": (927, 1762), # EconAudit..rest (tightly coupled system/economy)
}

imports = lines[0:13]  # The common imports at top
# Get the common typed dict definitions at ~927 that colonization_economy needs
typed_dicts = lines[927:1060]

# Write each module file
for name, (start, end) in sections.items():
    content = ""
    if name == "materials":
        content = "".join(lines[start:end])
    else:
        content = "".join(imports)
        # Insert from_data import for colonization_economy
        if name == "colonization_economy":
            content += "from .materials import MaterialEntry, MaterialInventory, BlueprintRequirement\n"
            content += "from .engineers import EngineerInfo\n"
            content += "from .engineering_planner import PlannedModification, MaterialCost, EngineerVisit, EngineeringPlan\n"
            content += "from .trade import TradeStation, TradeCommodity, TradeRoute\n"
            content += "from .fleetcarrier import CarrierJump, CarrierCargo, CarrierFinance\n"
            content += "from .powerplay import PowerplayState, ControlSystem, PowerplaySystemType, PowerplaySystem, PowerplayPowerData\n"
            content += "from .thargoid import ThargoidWarState, TitanInfo\n"
            content += "from .colonization import ColonyState, ConstructionResource, ConstructionSite, ColonySystem\n"
        content += "".join(lines[start:end])

    filepath = os.path.join(pkg_dir, f"{name}.py")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {filepath} ({len(lines[start:end])} lines)")

# __init__.py - re-export everything
init_lines = [
    "from .materials import *\n",
    "from .engineers import *\n",
    "from .engineering_planner import *\n",
    "from .trade import *\n",
    "from .fleetcarrier import *\n",
    "from .powerplay import *\n",
    "from .thargoid import *\n",
    "from .colonization import *\n",
    "from .colonization_economy import *\n",
]
init_path = os.path.join(pkg_dir, "__init__.py")
with open(init_path, "w", encoding="utf-8") as f:
    f.writelines(init_lines)
print(f"Created {init_path}")

# Now we need to update __init__.py of the package to import from planner package
# and update any code that imports from planner to import from planner package
print("\nDone. Now update elite_dangerous_sdk/__init__.py to import from planner package.")
