"""On-foot engineering for suits and weapons."""

from __future__ import annotations

from typing import Any, Optional

SUIT_BASE_STATS = {
    "dominator": {
        "suitType": "dominator",
        "manufacturer": "Manticore",
        "cost": 150_000,
        "shield": 15.0,
        "shieldRegen": 1.1,
        "battery": 10,
        "health": 30,
        "mass": 100,
        "emergencyAir": 60,
        "goodsCapacity": 10,
        "assetsCapacity": 20,
        "dataCapacity": 10,
        "weaponSlots": {"primary": 2, "secondary": 1},
        "consumableSlots": {
            "energyCell": 2, "eBreach": 1, "medkit": 2,
            "fragGrenade": 3, "shieldDisruptor": 3, "shieldProjector": 2,
        },
        "resistance": {"kinetic": -0.5, "thermal": 0.6, "plasma": 0, "explosive": 0},
    },
    "maverick": {
        "suitType": "maverick",
        "manufacturer": "Remlok",
        "cost": 150_000,
        "shield": 13.5,
        "shieldRegen": 0.99,
        "battery": 13.5,
        "health": 30,
        "mass": 100,
        "emergencyAir": 60,
        "goodsCapacity": 40,
        "assetsCapacity": 60,
        "dataCapacity": 20,
        "weaponSlots": {"primary": 1, "secondary": 1},
        "consumableSlots": {
            "energyCell": 2, "eBreach": 2, "medkit": 1,
            "fragGrenade": 2, "shieldDisruptor": 1, "shieldProjector": 1,
        },
        "resistance": {"kinetic": -0.6, "thermal": 0.5, "plasma": -0.1, "explosive": 0},
    },
    "artemis": {
        "suitType": "artemis",
        "manufacturer": "Supratech",
        "cost": 150_000,
        "shield": 12.0,
        "shieldRegen": 0.88,
        "battery": 17,
        "health": 30,
        "mass": 100,
        "emergencyAir": 60,
        "goodsCapacity": 20,
        "assetsCapacity": 40,
        "dataCapacity": 10,
        "weaponSlots": {"primary": 1, "secondary": 1},
        "consumableSlots": {
            "energyCell": 3, "eBreach": 1, "medkit": 1,
            "fragGrenade": 1, "shieldDisruptor": 1, "shieldProjector": 1,
        },
        "resistance": {"kinetic": -0.7, "thermal": 0.39, "plasma": -0.2, "explosive": 0},
    },
}

WEAPON_BASE_STATS = {
    "Karma C-44": {
        "name": "Karma C-44",
        "manufacturer": "kinematic",
        "category": "kinetic",
        "size": "primary",
        "fireMode": "automatic",
        "cost": 50_000,
        "dps": 8.0,
        "headshotMultiplier": 2.0,
        "effectiveRange": 25,
        "magazineSize": 60,
        "reserveAmmo": 360,
        "reloadTime": 2.5,
        "projectileSpeed": 1,
    },
    "Karma AR-50": {
        "name": "Karma AR-50",
        "manufacturer": "kinematic",
        "category": "kinetic",
        "size": "primary",
        "fireMode": "automatic",
        "cost": 100_000,
        "dps": 9.0,
        "headshotMultiplier": 2.0,
        "effectiveRange": 50,
        "magazineSize": 40,
        "reserveAmmo": 200,
        "reloadTime": 2.5,
        "projectileSpeed": 1,
    },
    "Karma P-15": {
        "name": "Karma P-15",
        "manufacturer": "kinematic",
        "category": "kinetic",
        "size": "secondary",
        "fireMode": "semi-auto",
        "cost": 75_000,
        "dps": 13.8,
        "headshotMultiplier": 2.0,
        "effectiveRange": 25,
        "magazineSize": 24,
        "reserveAmmo": 240,
        "reloadTime": 1.5,
        "projectileSpeed": 1,
    },
    "Karma L-6": {
        "name": "Karma L-6",
        "manufacturer": "kinematic",
        "category": "explosive",
        "size": "primary",
        "fireMode": "burst",
        "cost": 175_000,
        "dps": 44.4,
        "headshotMultiplier": 1.0,
        "effectiveRange": 300,
        "magazineSize": 2,
        "reserveAmmo": 8,
        "reloadTime": 4.5,
        "projectileSpeed": 0.6,
    },
    "TK Aphelion": {
        "name": "TK Aphelion",
        "manufacturer": "takada",
        "category": "thermal",
        "size": "primary",
        "fireMode": "automatic",
        "cost": 100_000,
        "dps": 9.1,
        "headshotMultiplier": 1.0,
        "effectiveRange": 70,
        "magazineSize": 25,
        "reserveAmmo": 150,
        "reloadTime": 2.5,
        "projectileSpeed": 0,
    },
    "TK Eclipse": {
        "name": "TK Eclipse",
        "manufacturer": "takada",
        "category": "thermal",
        "size": "primary",
        "fireMode": "automatic",
        "cost": 50_000,
        "dps": 9.0,
        "headshotMultiplier": 1.0,
        "effectiveRange": 25,
        "magazineSize": 40,
        "reserveAmmo": 280,
        "reloadTime": 2.0,
        "projectileSpeed": 0,
    },
    "TK Zenith": {
        "name": "TK Zenith",
        "manufacturer": "takada",
        "category": "thermal",
        "size": "secondary",
        "fireMode": "burst",
        "cost": 75_000,
        "dps": 9.7,
        "headshotMultiplier": 1.0,
        "effectiveRange": 35,
        "magazineSize": 18,
        "reserveAmmo": 90,
        "reloadTime": 1.5,
        "projectileSpeed": 0,
    },
    "Manticore Executioner": {
        "name": "Manticore Executioner",
        "manufacturer": "manticore",
        "category": "plasma",
        "size": "primary",
        "fireMode": "semi-auto",
        "cost": 175_000,
        "dps": 12.5,
        "headshotMultiplier": 3.0,
        "effectiveRange": 100,
        "magazineSize": 3,
        "reserveAmmo": 30,
        "reloadTime": 3.0,
        "projectileSpeed": 0.5,
    },
    "Manticore Intimidator": {
        "name": "Manticore Intimidator",
        "manufacturer": "manticore",
        "category": "plasma",
        "size": "primary",
        "fireMode": "semi-auto",
        "cost": 100_000,
        "dps": 21.9,
        "headshotMultiplier": 1.5,
        "effectiveRange": 7,
        "magazineSize": 2,
        "reserveAmmo": 24,
        "reloadTime": 3.0,
        "projectileSpeed": 0.5,
    },
    "Manticore Oppressor": {
        "name": "Manticore Oppressor",
        "manufacturer": "manticore",
        "category": "plasma",
        "size": "primary",
        "fireMode": "automatic",
        "cost": 125_000,
        "dps": 5.63,
        "headshotMultiplier": 1.5,
        "effectiveRange": 35,
        "magazineSize": 50,
        "reserveAmmo": 300,
        "reloadTime": 2.5,
        "projectileSpeed": 0.5,
    },
    "Manticore Tormentor": {
        "name": "Manticore Tormentor",
        "manufacturer": "manticore",
        "category": "plasma",
        "size": "secondary",
        "fireMode": "semi-auto",
        "cost": 50_000,
        "dps": 12.75,
        "headshotMultiplier": 2.0,
        "effectiveRange": 15,
        "magazineSize": 6,
        "reserveAmmo": 72,
        "reloadTime": 2.0,
        "projectileSpeed": 0.5,
    },
}

SUIT_UPGRADE_COSTS = {
    "dominator": {
        "g2": {"Suit Schematic": 1, "Health Monitor": 1, "Power Regulator": 1, "Manufacturing Instructions": 1, "Titanium Plating": 5, "Graphene": 5},
        "g3": {"Suit Schematic": 5, "Health Monitor": 5, "Power Regulator": 5, "Manufacturing Instructions": 5, "Titanium Plating": 15, "Graphene": 15},
        "g4": {"Suit Schematic": 10, "Health Monitor": 10, "Power Regulator": 10, "Manufacturing Instructions": 10, "Titanium Plating": 25, "Graphene": 25},
        "g5": {"Suit Schematic": 15, "Health Monitor": 15, "Power Regulator": 15, "Manufacturing Instructions": 15, "Titanium Plating": 35, "Graphene": 35},
    },
    "maverick": {
        "g2": {"Suit Schematic": 1, "Health Monitor": 1, "Power Regulator": 1, "Manufacturing Instructions": 1, "Carbon Fibre Plating": 5, "Graphene": 5},
        "g3": {"Suit Schematic": 5, "Health Monitor": 5, "Power Regulator": 5, "Manufacturing Instructions": 5, "Carbon Fibre Plating": 15, "Graphene": 15},
        "g4": {"Suit Schematic": 10, "Health Monitor": 10, "Power Regulator": 10, "Manufacturing Instructions": 10, "Carbon Fibre Plating": 25, "Graphene": 25},
        "g5": {"Suit Schematic": 15, "Health Monitor": 15, "Power Regulator": 15, "Manufacturing Instructions": 15, "Carbon Fibre Plating": 35, "Graphene": 35},
    },
    "artemis": {
        "g2": {"Suit Schematic": 1, "Health Monitor": 1, "Power Regulator": 1, "Manufacturing Instructions": 1, "Aerogel": 5, "Graphene": 5},
        "g3": {"Suit Schematic": 5, "Health Monitor": 5, "Power Regulator": 5, "Manufacturing Instructions": 5, "Aerogel": 15, "Graphene": 15},
        "g4": {"Suit Schematic": 10, "Health Monitor": 10, "Power Regulator": 10, "Manufacturing Instructions": 10, "Aerogel": 25, "Graphene": 25},
        "g5": {"Suit Schematic": 15, "Health Monitor": 15, "Power Regulator": 15, "Manufacturing Instructions": 15, "Aerogel": 35, "Graphene": 35},
    },
}


def _kinematic_weapon_costs(prefix: str) -> dict[str, int]:
    _map = {
        "g2": {"Weapon Schematic": 1, "Compression-Liquefied Gas": 1, "Manufacturing Instructions": 1, "Tungsten Carbide": 2, "Weapon Component": 2},
        "g3": {"Weapon Schematic": 2, "Compression-Liquefied Gas": 2, "Manufacturing Instructions": 2, "Tungsten Carbide": 5, "Weapon Component": 5},
        "g4": {"Weapon Schematic": 4, "Compression-Liquefied Gas": 4, "Manufacturing Instructions": 4, "Tungsten Carbide": 9, "Weapon Component": 9},
        "g5": {"Weapon Schematic": 5, "Compression-Liquefied Gas": 5, "Manufacturing Instructions": 5, "Tungsten Carbide": 12, "Weapon Component": 12},
    }
    return dict(_map[prefix])


def _takada_weapon_costs(prefix: str) -> dict[str, int]:
    _map = {
        "g2": {"Weapon Schematic": 1, "Ionised Gas": 1, "Manufacturing Instructions": 1, "Microelectrode": 2, "Optical Fibre": 2},
        "g3": {"Weapon Schematic": 2, "Ionised Gas": 2, "Manufacturing Instructions": 2, "Microelectrode": 5, "Optical Fibre": 5},
        "g4": {"Weapon Schematic": 4, "Ionised Gas": 4, "Manufacturing Instructions": 4, "Microelectrode": 9, "Optical Fibre": 9},
        "g5": {"Weapon Schematic": 5, "Ionised Gas": 5, "Manufacturing Instructions": 5, "Microelectrode": 12, "Optical Fibre": 12},
    }
    return dict(_map[prefix])


def _manticore_weapon_costs(prefix: str) -> dict[str, int]:
    _map = {
        "g2": {"Weapon Schematic": 1, "Ionised Gas": 1, "Manufacturing Instructions": 1, "Chemical Superbase": 2, "Microelectrode": 2},
        "g3": {"Weapon Schematic": 2, "Ionised Gas": 2, "Manufacturing Instructions": 2, "Chemical Superbase": 5, "Microelectrode": 5},
        "g4": {"Weapon Schematic": 4, "Ionised Gas": 4, "Manufacturing Instructions": 4, "Chemical Superbase": 9, "Microelectrode": 9},
        "g5": {"Weapon Schematic": 5, "Ionised Gas": 5, "Manufacturing Instructions": 5, "Chemical Superbase": 12, "Microelectrode": 12},
    }
    return dict(_map[prefix])


WEAPON_UPGRADE_COSTS = {
    "kinematic": {
        "g2": _kinematic_weapon_costs("g2"),
        "g3": _kinematic_weapon_costs("g3"),
        "g4": _kinematic_weapon_costs("g4"),
        "g5": _kinematic_weapon_costs("g5"),
    },
    "takada": {
        "g2": _takada_weapon_costs("g2"),
        "g3": _takada_weapon_costs("g3"),
        "g4": _takada_weapon_costs("g4"),
        "g5": _takada_weapon_costs("g5"),
    },
    "manticore": {
        "g2": _manticore_weapon_costs("g2"),
        "g3": _manticore_weapon_costs("g3"),
        "g4": _manticore_weapon_costs("g4"),
        "g5": _manticore_weapon_costs("g5"),
    },
}

ON_FOOT_MODIFICATIONS: dict[str, dict[str, Any]] = {
    "Extra Backpack Capacity": {
        "name": "Extra Backpack Capacity",
        "type": "suit",
        "engineers": ["Domino Green", "Rosa Dayette", "Wellington Beck"],
        "credits": 750_000,
        "materials": {"Epoxy Adhesive": 5, "Memory Chip": 3, "Weapon Inventory": 5, "Chemical Inventory": 5, "Digital Designs": 5},
        "effects": {"backpackCapacity": 1},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Improved Battery Capacity": {
        "name": "Improved Battery Capacity",
        "type": "suit",
        "engineers": ["Oden Geiger", "Rosa Dayette", "Wellington Beck"],
        "credits": 750_000,
        "materials": {"Reactor Output Review": 5, "Maintenance Logs": 8, "Ion Battery": 3, "Micro Supercapacitor": 5, "Electrical Wiring": 5},
        "effects": {"battery": 0.5},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Improved Jump Assist": {
        "name": "Improved Jump Assist",
        "type": "suit",
        "engineers": ["Hero Ferrari", "Yarden Bond", "Baltanos"],
        "credits": 750_000,
        "materials": {"G-Meds": 5, "Micro Thrusters": 3, "Motor": 5, "Topographical Surveys": 5},
        "effects": {"jumpAssist": 1},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Reduced Tool Battery Consumption": {
        "name": "Reduced Tool Battery Consumption",
        "type": "suit",
        "engineers": ["Domino Green", "Rosa Dayette", "Wellington Beck"],
        "credits": 500_000,
        "materials": {"Electrical Fuse": 3, "Micro Transformer": 5, "Electrical Wiring": 8, "Reactor Output Review": 5},
        "effects": {"toolEnergyDrain": -0.5},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Night Vision": {
        "name": "Night Vision",
        "type": "suit",
        "engineers": ["Oden Geiger", "Yi Shen"],
        "credits": 1_000_000,
        "materials": {"Surveillance Equipment": 5, "Surveillance Logs": 3, "Radioactivity Data": 3, "NOC Data": 3, "Circuit Switch": 5},
        "effects": {"nightVision": 1},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Faster Shield Regen": {
        "name": "Faster Shield Regen",
        "type": "suit",
        "engineers": ["Kit Fowler", "Uma Laszlo", "Eleanor Bresa"],
        "credits": 750_000,
        "materials": {"Reactor Output Review": 5, "Ion Battery": 3, "Micro Transformer": 8, "Electrical Wiring": 8},
        "effects": {"shieldRegen": 0.33},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Increased Air Reserves": {
        "name": "Increased Air Reserves",
        "type": "suit",
        "engineers": ["Hero Ferrari", "Terra Velasquez", "Baltanos"],
        "credits": 750_000,
        "materials": {"Oxygenic Bacteria": 5, "PH Neutraliser": 8, "Pharmaceutical Patents": 3, "Air Quality Reports": 8},
        "effects": {"emergencyAir": 300},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Increased Sprint Duration": {
        "name": "Increased Sprint Duration",
        "type": "suit",
        "engineers": ["Hero Ferrari", "Terra Velasquez", "Baltanos"],
        "credits": 750_000,
        "materials": {"Oxygenic Bacteria": 5, "Chemical Catalyst": 8, "Troop Deployment Records": 3, "Gene Sequencing Data": 3, "Clinical Trial Records": 3},
        "effects": {"sprintDuration": 1},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Enhanced Tracking": {
        "name": "Enhanced Tracking",
        "type": "suit",
        "engineers": ["Domino Green", "Oden Geiger", "Rosa Dayette"],
        "credits": 750_000,
        "materials": {"Transmitter": 3, "Circuit Board": 3, "Topographical Surveys": 5, "Stellar Activity Logs": 5, "Spectral Analysis Data": 5},
        "effects": {"scanRange": 100, "scanTime": -1},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Added Melee Damage": {
        "name": "Added Melee Damage",
        "type": "suit",
        "engineers": ["Jude Navarro", "Kit Fowler", "Eleanor Bresa"],
        "credits": 750_000,
        "materials": {"Epinephrine": 5, "Micro Thrusters": 8, "Combat Training Material": 5, "Combatant Performance": 5},
        "effects": {"meleeDamage": 1.5},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Combat Movement Speed": {
        "name": "Combat Movement Speed",
        "type": "suit",
        "engineers": ["Terra Velasquez", "Yarden Bond", "Baltanos"],
        "credits": 750_000,
        "materials": {"Evacuation Protocols": 5, "Genetic Research": 3, "Epinephrine": 5, "PH Neutraliser": 8},
        "effects": {"combatMovementSpeed": 0.1},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Damage Resistance": {
        "name": "Damage Resistance",
        "type": "suit",
        "engineers": ["Jude Navarro", "Uma Laszlo", "Eleanor Bresa"],
        "credits": 750_000,
        "materials": {"Titanium Plating": 3, "Carbon Fibre Plating": 3, "Epoxy Adhesive": 8, "Weapon Inventory": 5, "Ballistics Data": 5},
        "effects": {"kineticResistance": 0.1, "thermalResistance": 0.1, "plasmaResistance": 0.1, "explosiveResistance": 0.1},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Extra Ammo Capacity": {
        "name": "Extra Ammo Capacity",
        "type": "suit",
        "engineers": ["Jude Navarro", "Kit Fowler", "Eleanor Bresa"],
        "credits": 750_000,
        "materials": {"Weapon Component": 3, "Recycling Logs": 8, "Weapon Test Data": 5, "Production Reports": 5},
        "effects": {"ammoCapacity": 0.5},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Quieter Footsteps": {
        "name": "Quieter Footsteps",
        "type": "suit",
        "engineers": ["Yarden Bond", "Yi Shen"],
        "credits": 1_000_000,
        "materials": {"Settlement Assault Plans": 2, "Tactical Plans": 5, "Patrol Routes": 5, "Micro Hydraulics": 3, "Viscoelastic Polymer": 8},
        "effects": {"footstepNoise": -0.5},
        "compatibleSuits": ["dominator", "maverick", "artemis"],
    },
    "Audio Masking": {
        "name": "Audio Masking",
        "type": "weapon",
        "engineers": ["Yarden Bond", "Yi Shen"],
        "credits": 1_000_000,
        "materials": {"Audio Logs": 3, "Patrol Routes": 5, "Scrambler": 5, "Transmitter": 8, "Circuit Board": 3},
        "effects": {"audioMasking": 1},
    },
    "Faster Handling": {
        "name": "Faster Handling",
        "type": "weapon",
        "engineers": ["Hero Ferrari", "Yarden Bond", "Baltanos"],
        "credits": 500_000,
        "materials": {"Viscoelastic Polymer": 3, "Operational Manual": 5, "Combatant Performance": 5, "Combat Training Material": 5},
        "effects": {"handlingSpeed": 0.3},
    },
    "Greater Range": {
        "name": "Greater Range",
        "type": "weapon",
        "engineers": ["Domino Green", "Rosa Dayette", "Wellington Beck"],
        "credits": 500_000,
        "materials": {},
        "effects": {"effectiveRange": 0.5},
        "compatibleManufacturers": ["kinematic", "takada", "manticore"],
    },
    "Headshot Damage": {
        "name": "Headshot Damage",
        "type": "weapon",
        "engineers": ["Uma Laszlo", "Yi Shen"],
        "credits": 500_000,
        "materials": {},
        "effects": {"headshotMultiplier": 0.5},
        "compatibleManufacturers": ["kinematic", "takada", "manticore"],
    },
    "Improved Hip Fire Accuracy": {
        "name": "Improved Hip Fire Accuracy",
        "type": "weapon",
        "engineers": ["Terra Velasquez", "Yarden Bond", "Baltanos"],
        "credits": 500_000,
        "materials": {},
        "effects": {"hipFireAccuracy": 0.15},
        "compatibleManufacturers": ["kinematic", "takada", "manticore"],
    },
    "Magazine Size": {
        "name": "Magazine Size",
        "type": "weapon",
        "engineers": ["Jude Navarro", "Kit Fowler", "Eleanor Bresa"],
        "credits": 750_000,
        "materials": {"Weapon Component": 3, "Tungsten Carbide": 3, "Metal Coil": 5, "Weapon Test Data": 5, "Security Expenses": 3},
        "effects": {"magazineSize": 0.5},
    },
    "Noise Suppressor": {
        "name": "Noise Suppressor",
        "type": "weapon",
        "engineers": ["Hero Ferrari", "Terra Velasquez", "Baltanos"],
        "credits": 1_000_000,
        "materials": {"Viscoelastic Polymer": 15, "Weapon Component": 5, "Atmospheric Data": 10, "Mining Analytics": 10},
        "effects": {"noiseSuppressor": 1},
    },
    "Reload Speed": {
        "name": "Reload Speed",
        "type": "weapon",
        "engineers": ["Jude Navarro", "Uma Laszlo", "Eleanor Bresa"],
        "credits": 500_000,
        "materials": {"Micro Hydraulics": 5, "Electromagnet": 5, "Operational Manual": 5, "Production Reports": 5, "Combat Training Material": 5},
        "effects": {"reloadSpeed": 0.3},
    },
    "Scope": {
        "name": "Scope",
        "type": "weapon",
        "engineers": ["Oden Geiger", "Rosa Dayette", "Wellington Beck"],
        "credits": 500_000,
        "materials": {"Spectral Analysis Data": 10, "Biometric Data": 5, "Optical Lens": 10, "Optical Fibre": 5},
        "effects": {"scopeMagnification": 1},
    },
    "Stability": {
        "name": "Stability",
        "type": "weapon",
        "engineers": ["Domino Green", "Oden Geiger", "Rosa Dayette"],
        "credits": 500_000,
        "materials": {"Viscoelastic Polymer": 5, "Micro Hydraulics": 5, "Mining Analytics": 5, "Risk Assessments": 8},
        "effects": {"recoil": -0.7},
    },
    "Stowed Reloading": {
        "name": "Stowed Reloading",
        "type": "weapon",
        "engineers": ["Kit Fowler", "Uma Laszlo", "Eleanor Bresa"],
        "credits": 1_000_000,
        "materials": {"Digital Designs": 5, "Operational Manual": 5, "Production Schedule": 5, "Circuit Board": 3, "Encrypted Memory Chip": 8},
        "effects": {"stowedReloading": 1},
    },
}


def get_upgrade_cost(suit_or_weapon: str, current_grade: int) -> dict[str, int]:
    if suit_or_weapon in SUIT_UPGRADE_COSTS:
        costs = SUIT_UPGRADE_COSTS[suit_or_weapon]
        grade_key = f"g{current_grade + 1}"
        return dict(costs.get(grade_key, {}))
    weapon = WEAPON_BASE_STATS.get(suit_or_weapon)
    if weapon:
        costs = WEAPON_UPGRADE_COSTS[weapon["manufacturer"]]
        grade_key = f"g{current_grade + 1}"
        return dict(costs.get(grade_key, {}))
    return {}


def get_modification_details(name: str) -> Optional[dict[str, Any]]:
    return ON_FOOT_MODIFICATIONS.get(name)


def get_available_modifications(
    equipment_type: str,
    suit_type: Optional[str] = None,
    manufacturer: Optional[str] = None,
) -> list[dict[str, Any]]:
    result = []
    for mod in ON_FOOT_MODIFICATIONS.values():
        if mod["type"] != equipment_type:
            continue
        if suit_type and "compatibleSuits" in mod and suit_type not in mod["compatibleSuits"]:
            continue
        if manufacturer and "compatibleManufacturers" in mod and manufacturer not in mod["compatibleManufacturers"]:
            continue
        result.append(mod)
    return result


def plan_on_foot_engineering(upgrades: list[dict[str, Any]]) -> dict[str, Any]:
    materials: list[dict[str, Any]] = []
    engineer_set: set[str] = set()
    total_credits = 0

    for upgrade in upgrades:
        if upgrade["targetGrade"] > upgrade["currentGrade"]:
            if upgrade["type"] == "suit":
                costs = SUIT_UPGRADE_COSTS.get(upgrade["name"])
                if costs:
                    for g in range(upgrade["currentGrade"] + 1, upgrade["targetGrade"] + 1):
                        grade_key = f"g{g}"
                        grade_costs = costs.get(grade_key, {})
                        for mat, qty in grade_costs.items():
                            materials.append({"material": mat, "quantity": qty, "source": "upgrade"})
            else:
                weapon = WEAPON_BASE_STATS.get(upgrade["name"])
                if weapon:
                    costs = WEAPON_UPGRADE_COSTS.get(weapon["manufacturer"])
                    if costs:
                        for g in range(upgrade["currentGrade"] + 1, upgrade["targetGrade"] + 1):
                            grade_key = f"g{g}"
                            grade_costs = costs.get(grade_key, {})
                            for mat, qty in grade_costs.items():
                                materials.append({"material": mat, "quantity": qty, "source": "upgrade"})

        for mod_name in upgrade.get("modifications", []):
            mod = ON_FOOT_MODIFICATIONS.get(mod_name)
            if mod:
                total_credits += mod["credits"]
                for eng in mod["engineers"]:
                    engineer_set.add(eng)
                for mat, qty in mod["materials"].items():
                    materials.append({"material": mat, "quantity": qty, "source": "modification"})

    material_total: dict[str, int] = {}
    for m in materials:
        material_total[m["material"]] = material_total.get(m["material"], 0) + m["quantity"]

    return {
        "materials": materials,
        "materialTotal": material_total,
        "totalCredits": total_credits,
        "engineers": sorted(engineer_set),
    }
