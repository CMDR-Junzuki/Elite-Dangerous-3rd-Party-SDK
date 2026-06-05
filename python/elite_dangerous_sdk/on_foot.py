from __future__ import annotations

from typing import Any, Optional

from .planner.on_foot_engineering import SUIT_BASE_STATS, WEAPON_BASE_STATS, ON_FOOT_MODIFICATIONS


def _grade_dps_multiplier(weapon_name: str) -> float:
    manticore_weapons = {"Manticore Executioner", "Manticore Intimidator", "Manticore Oppressor", "Manticore Tormentor"}
    return 2.86 if weapon_name in manticore_weapons else 1.6


def calculate_suit_stats(
    suit_type: str,
    modifications: list[str],
) -> dict[str, Any]:
    base = SUIT_BASE_STATS[suit_type]

    result = {
        "suitType": suit_type,
        "shield": base["shield"],
        "shieldRegen": base["shieldRegen"],
        "battery": base["battery"],
        "health": base["health"],
        "emergencyAir": base["emergencyAir"],
        "sprintDuration": 1,
        "backpackCapacity": 1,
        "ammoCapacity": 1,
        "meleeDamage": 1,
        "combatMovementSpeed": 0,
        "resistance": dict(base["resistance"]),
        "jumpAssist": False,
        "nightVision": False,
        "enhancedTracking": False,
        "quieterFootsteps": False,
        "reducedToolDrain": False,
    }

    for mod_name in modifications:
        mod = ON_FOOT_MODIFICATIONS.get(mod_name)
        if not mod or mod["type"] != "suit":
            continue
        if "compatibleSuits" in mod and suit_type not in mod["compatibleSuits"]:
            continue

        for stat, value in mod["effects"].items():
            if stat == "backpackCapacity":
                result["backpackCapacity"] = 1 + value
            elif stat == "battery":
                result["battery"] = base["battery"] * (1 + value)
            elif stat == "shieldRegen":
                result["shieldRegen"] = base["shieldRegen"] * (1 + value)
            elif stat == "emergencyAir":
                result["emergencyAir"] = value
            elif stat == "sprintDuration":
                result["sprintDuration"] = 1 + value
            elif stat == "meleeDamage":
                result["meleeDamage"] = 1 + value
            elif stat == "ammoCapacity":
                result["ammoCapacity"] = 1 + value
            elif stat == "combatMovementSpeed":
                result["combatMovementSpeed"] = value
            elif stat == "jumpAssist":
                result["jumpAssist"] = True
            elif stat == "nightVision":
                result["nightVision"] = True
            elif stat in ("scanRange", "scanTime"):
                result["enhancedTracking"] = True
            elif stat == "footstepNoise":
                result["quieterFootsteps"] = True
            elif stat == "toolEnergyDrain":
                result["reducedToolDrain"] = True
            elif stat == "kineticResistance":
                result["resistance"]["kinetic"] = 1 - (1 - base["resistance"]["kinetic"]) * (1 - value)
            elif stat == "thermalResistance":
                result["resistance"]["thermal"] = 1 - (1 - base["resistance"]["thermal"]) * (1 - value)
            elif stat == "plasmaResistance":
                result["resistance"]["plasma"] = 1 - (1 - base["resistance"]["plasma"]) * (1 - value)
            elif stat == "explosiveResistance":
                result["resistance"]["explosive"] = 1 - (1 - base["resistance"]["explosive"]) * (1 - value)

    return result


def calculate_weapon_stats(
    weapon_name: str,
    grade: int,
    modifications: list[str],
) -> Optional[dict[str, Any]]:
    base = WEAPON_BASE_STATS.get(weapon_name)
    if not base:
        return None

    multiplier = _grade_dps_multiplier(weapon_name)
    grade_factor = 1 + (multiplier - 1) * ((grade - 1) / 4)

    result = {
        "name": base["name"],
        "manufacturer": base["manufacturer"],
        "category": base["category"],
        "size": base["size"],
        "fireMode": base["fireMode"],
        "grade": grade,
        "dps": base["dps"] * grade_factor,
        "headshotMultiplier": base["headshotMultiplier"],
        "effectiveRange": base["effectiveRange"],
        "magazineSize": base["magazineSize"],
        "reserveAmmo": base["reserveAmmo"],
        "reloadTime": base["reloadTime"],
        "handlingSpeed": 1,
        "recoil": 1,
        "stowedReloading": False,
        "audioMasking": False,
        "noiseSuppressor": False,
        "scopeMagnification": False,
        "hipFireAccuracy": 0,
    }

    for mod_name in modifications:
        mod = ON_FOOT_MODIFICATIONS.get(mod_name)
        if not mod or mod["type"] != "weapon":
            continue

        for stat, value in mod["effects"].items():
            if stat == "effectiveRange":
                result["effectiveRange"] = base["effectiveRange"] * (1 + value)
            elif stat == "headshotMultiplier":
                result["headshotMultiplier"] = base["headshotMultiplier"] * (1 + value)
            elif stat == "magazineSize":
                result["magazineSize"] = round(base["magazineSize"] * (1 + value))
            elif stat == "reloadSpeed":
                result["reloadTime"] = base["reloadTime"] / (1 + value)
            elif stat == "handlingSpeed":
                result["handlingSpeed"] = 1 + value
            elif stat == "recoil":
                result["recoil"] = 1 + value
            elif stat == "hipFireAccuracy":
                result["hipFireAccuracy"] = value
            elif stat == "stowedReloading":
                result["stowedReloading"] = True
            elif stat == "audioMasking":
                result["audioMasking"] = True
            elif stat == "noiseSuppressor":
                result["noiseSuppressor"] = True
            elif stat == "scopeMagnification":
                result["scopeMagnification"] = True

    return result


def calculate_effective_dps(
    weapon_stats: dict[str, Any],
    hit_rate: float,
    headshot_rate: float,
) -> float:
    body_dmg = weapon_stats["dps"] * hit_rate * (1 - headshot_rate)
    head_dmg = weapon_stats["dps"] * hit_rate * headshot_rate * weapon_stats["headshotMultiplier"]
    return body_dmg + head_dmg
