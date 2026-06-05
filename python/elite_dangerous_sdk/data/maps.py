"""
EDMarketConnector-style display name maps for CAPI data.
"""

import re
from typing import Optional

SHIP_NAME_MAP: dict[str, str] = {
    "adder": "Adder",
    "alliance_challenger": "Alliance Challenger",
    "alliance_chieftain": "Alliance Chieftain",
    "alliance_crusader": "Alliance Crusader",
    "anaconda": "Anaconda",
    "asp": "Asp Explorer",
    "asp_scout": "Asp Scout",
    "belugaLiner": "Beluga Liner",
    "cobramkiii": "Cobra MkIII",
    "cobramkiv": "Cobra MkIV",
    "cobramkv": "Cobra MkV",
    "diamondback": "Diamondback Scout",
    "diamondbackxl": "Diamondback Explorer",
    "dolphin": "Dolphin",
    "eagle": "Eagle",
    "empire_courier": "Imperial Courier",
    "empire_eagle": "Imperial Eagle",
    "empire_fighter": "Imperial Fighter",
    "empire_trader": "Imperial Clipper",
    "empire_capital_ship": "Imperial Cutter",
    "federation_corvette": "Federal Corvette",
    "federation_dropship": "Federal Dropship",
    "federation_gunship": "Federal Gunship",
    "federation_assault_ship": "Federal Assault Ship",
    "federation_fighter": "Federation Fighter",
    "ferdelance": "Fer-de-Lance",
    "hauler": "Hauler",
    "independant_trader": "Keelback",
    "krait_mkii": "Krait MkII",
    "krait_phantom": "Krait Phantom",
    "mamba": "Mamba",
    "orca": "Orca",
    "panther": "Panther Clipper",
    "python": "Python",
    "python_nx": "Python NX",
    "scout": "Taipan Fighter",
    "sidewinder": "Sidewinder",
    "testbuggy": "SRV Scarab",
    "testbuggy2": "SRV Scorpion",
    "type6": "Type-6 Transporter",
    "type7": "Type-7 Transport",
    "type8": "Type-8 Transport",
    "type9": "Type-9 Heavy",
    "typex": "Type-10 Defender",
    "typex_3": "Type-10 Defender",
    "viper": "Viper MkIII",
    "viper_mkiv": "Viper MkIV",
    "vulture": "Vulture",
    "mandalay": "Mandalay",
    "explorer_nx": "Explorer NX",
    "kestrel": "Kestrel",
    "federal_corvette": "Federal Corvette",
    "imperial_cutter": "Imperial Cutter",
    "imperial_clipper": "Imperial Clipper",
    "imperial_courier": "Imperial Courier",
    "imperial_eagle": "Imperial Eagle",
    "imperial_corsair": "Imperial Corsair",
    "federal_assault_ship": "Federal Assault Ship",
    "type_10_defender": "Type-10 Defender",
    "type_11_prospector": "Type-11 Prospector",
    "type_6_transporter": "Type-6 Transporter",
    "type_7_transport": "Type-7 Transport",
    "type_8_transport": "Type-8 Transport",
    "type_9_heavy": "Type-9 Heavy",
    "beluga": "Beluga Liner",
    "diamondback_explorer": "Diamondback Explorer",
    "diamondback_scout": "Diamondback Scout",
    "cobra_mkiii": "Cobra MkIII",
    "cobra_mkiv": "Cobra MkIV",
    "cobra_mk_v": "Cobra MkV",
    "fer_de_lance": "Fer-de-Lance",
    "asp_explorer": "Asp Explorer",
    "panther_clipper": "Panther Clipper",
}


def get_ship_display_name(ship_id: str) -> str:
    return SHIP_NAME_MAP.get(ship_id.lower(), ship_id)


COMPANION_CATEGORY_MAP: dict[str, str] = {
    "Weapon": "Hardpoint",
    "Utility": "Utility",
    "Armour": "Bulkhead",
    "PowerPlant": "Power Plant",
    "MainEngines": "Thrusters",
    "FrameShiftDrive": "Frame Shift Drive",
    "LifeSupport": "Life Support",
    "PowerDistributor": "Power Distributor",
    "Radar": "Sensors",
    "FuelTank": "Fuel Tank",
    "Standard": "Standard",
    "Internal": "Internal",
}

SLOT_NAME_MAP: dict[str, str] = {
    "Standard": "Standard",
    "Hardpoint": "Hardpoint",
    "Utility": "Utility",
    "Internal": "Internal",
    "Military": "Military",
    "PlanetaryApproachSuite": "Planetary Approach Suite",
    "VehicleHangar": "Vehicle Hangar",
    "FighterHangar": "Fighter Hangar",
}

WEAPON_MOUNT_MAP: dict[str, str] = {
    "Fixed": "Fixed",
    "Gimbal": "Gimballed",
    "Turret": "Turret",
}

EDSHIPYARD_SLOT_MAP: dict[str, str] = {
    "bh": "Bulkheads",
    "hp": "Hardpoints",
    "ut": "Utility",
    "sg": "Shield Generator",
    "pp": "Power Plant",
    "th": "Thrusters",
    "fsd": "Frame Shift Drive",
    "ls": "Life Support",
    "pd": "Power Distributor",
    "sn": "Sensors",
    "ft": "Fuel Tank",
    "hr": "Hull Reinforcement",
    "mrp": "Module Reinforcement",
    "scb": "Shield Cell Bank",
    "gsrp": "Guardian Shield Reinforcement",
    "gmrp": "Guardian Module Reinforcement",
    "ghrp": "Guardian Hull Reinforcement",
    "afmu": "Auto Field-Maintenance Unit",
    "fuel": "Fuel Scoop",
    "pas": "Planetary Approach Suite",
    "v1": "Vehicle Hangar",
    "figh": "Fighter Hangar",
    "dc": "Docking Computer",
    "sax": "Supercruise Assist",
    "detail": "Surface Scanner",
    "cargo": "Cargo Rack",
    "cr": "Cargo Rack",
    "hbl": "Hatch Breaker Limpet",
    "col": "Collector Limpet",
    "pros": "Prospector Limpet",
    "fsdi": "Frame Shift Drive Interdictor",
    "fueltr": "Fuel Transfer Limpet",
    "repr": "Repair Limpet",
    "decon": "Decontamination Limpet",
    "recon": "Recon Limpet",
    "research": "Research Limpet",
    "multi": "Multi Limpet",
    "mahr": "Military Armour",
    "ref": "Refinery",
    "psg": "Prismatic Shield Generator",
    "bsg": "Bi-Weave Shield Generator",
    "pc": "Passenger Cabin",
    "ews": "Experimental Weapon Stabilizer",
    "gfsb": "Guardian FSD Booster",
    "cargo_large": "Cargo Rack (Large)",
}


_WEAPON_RE = re.compile(r"^Hpt_([A-Za-z]+)_([A-Za-z]+)_([A-Za-z]+)$")
_WEAPON_MOUNT_RE = re.compile(r"^Hpt_([A-Za-z]+)_([A-Za-z]+)_([A-Za-z]+)_([A-Za-z]+)$")
_INTERNAL_RE = re.compile(r"^Int_([A-Za-z]+)_Size(\d+)_Class(\d+)$")
_UTILITY_RE = re.compile(r"^Hpt_([A-Za-z]+)_Size(\d+)_Class(\d+)$")
_STANDARD_RE = re.compile(r"^([A-Za-z]+)_Size(\d+)_Class(\d+)$")


def _split_camel(name: str) -> str:
    return re.sub(r"([a-z])([A-Z])", r"\1 \2", name).strip()


def parse_module_symbol(symbol: str) -> dict:
    result = {"symbol": symbol, "category": "", "name": symbol}

    m = _INTERNAL_RE.match(symbol)
    if m:
        result["category"] = m.group(1)
        result["name"] = _split_camel(m.group(1))
        result["class"] = int(m.group(2))
        rating_code = int(m.group(3))
        result["rating"] = ["E", "D", "C", "B", "A"][rating_code - 1]
        return result

    m = _STANDARD_RE.match(symbol)
    if m:
        result["category"] = m.group(1)
        result["name"] = _split_camel(m.group(1))
        result["class"] = int(m.group(2))
        rating_code = int(m.group(3))
        result["rating"] = ["E", "D", "C", "B", "A"][rating_code - 1]
        return result

    m = _WEAPON_MOUNT_RE.match(symbol)
    if m:
        result["category"] = _split_camel(m.group(1))
        result["name"] = _split_camel(m.group(2))
        result["mount"] = WEAPON_MOUNT_MAP.get(m.group(3), m.group(3))
        cls_map = {"Small": 1, "Medium": 2, "Large": 3, "Huge": 4}
        result["class"] = cls_map.get(m.group(4))
        return result

    m = _WEAPON_RE.match(symbol)
    if m:
        result["category"] = _split_camel(m.group(1))
        result["name"] = _split_camel(m.group(2))
        if m.group(3) in ("Small", "Medium", "Large", "Huge"):
            cls_map = {"Small": 1, "Medium": 2, "Large": 3, "Huge": 4}
            result["class"] = cls_map.get(m.group(3))
        return result

    m = _UTILITY_RE.match(symbol)
    if m:
        result["category"] = _split_camel(m.group(1))
        result["name"] = _split_camel(m.group(1))
        result["class"] = int(m.group(2))
        rating_code = int(m.group(3))
        result["rating"] = ["E", "D", "C", "B", "A"][rating_code - 1]
        return result

    return result


def get_module_display_name(ed_id: int) -> str:
    try:
        from .coriolis import all_modules_by_edid
        mod = all_modules_by_edid.get(ed_id)
        if mod is None:
            return ""
        symbol = mod.get("symbol", "")
        if not symbol:
            return ""
        parsed = parse_module_symbol(symbol)
        name = parsed.get("name", "")
        cls = parsed.get("class")
        rating = parsed.get("rating")
        parts = [name]
        if cls:
            parts.append(str(cls))
        if rating:
            parts.append(rating)
        return " ".join(parts)
    except ImportError:
        return ""


def get_module_by_ed_id(ed_id: int) -> Optional[dict]:
    try:
        from .coriolis import all_modules_by_edid
        return all_modules_by_edid.get(ed_id)
    except ImportError:
        return None


def get_ship_by_ed_id(ed_id: int) -> Optional[dict]:
    try:
        from .coriolis import ships_by_edid
        return ships_by_edid.get(ed_id)
    except ImportError:
        return None


def get_commodity_by_symbol(symbol: str) -> Optional[dict]:
    try:
        from .fdevids import commodities_by_symbol
        return commodities_by_symbol.get(symbol)
    except ImportError:
        return None


def get_engineer_by_ed_id(ed_id: int) -> Optional[dict]:
    try:
        from .fdevids import engineers
        for eng in engineers:
            if eng.get("id") == ed_id:
                return eng
    except ImportError:
        pass
    return None
