from typing import Optional


def resolve_module(ed_id: int) -> Optional[dict]:
    try:
        from .coriolis import all_modules_by_edid
        return all_modules_by_edid.get(ed_id)
    except ImportError:
        return None


def resolve_ship(ed_id: int) -> Optional[dict]:
    try:
        from .coriolis import ships_by_edid
        return ships_by_edid.get(ed_id)
    except ImportError:
        return None


def resolve_ship_by_name(name: str) -> Optional[dict]:
    try:
        from .coriolis import ships_by_name
        lower = name.lower()
        for key, ship in ships_by_name.items():
            if key.lower() == lower:
                return ship
    except ImportError:
        pass
    return None


def resolve_commodity(symbol: str) -> Optional[dict]:
    try:
        from .fdevids import commodities_by_symbol
        exact = commodities_by_symbol.get(symbol)
        if exact:
            return exact
        lower = symbol.lower()
        for key, com in commodities_by_symbol.items():
            if key.lower() == lower:
                return com
    except ImportError:
        pass
    return None


def resolve_engineer(ed_id: int) -> Optional[dict]:
    try:
        from .fdevids import engineers
        for eng in engineers:
            eng_id = eng.get("id")
            if eng_id is not None and int(eng_id) == ed_id:
                return eng
    except ImportError:
        pass
    return None


def resolve_engineer_by_name(name: str) -> Optional[dict]:
    try:
        from .fdevids import engineers
        lower = name.lower()
        for eng in engineers:
            if eng.get("name", "").lower() == lower:
                return eng
    except ImportError:
        pass
    return None


def resolve_material(ed_id: int) -> Optional[dict]:
    try:
        from .fdevids import material_by_id
        return material_by_id.get(ed_id)
    except ImportError:
        return None


def resolve_material_by_symbol(symbol: str) -> Optional[dict]:
    try:
        from .fdevids import material_by_symbol
        exact = material_by_symbol.get(symbol)
        if exact:
            return exact
        lower = symbol.lower()
        for key, mat in material_by_symbol.items():
            if key.lower() == lower:
                return mat
    except ImportError:
        pass
    return None


def resolve_microresource(ed_id: int) -> Optional[dict]:
    try:
        from .fdevids import microresources_by_id
        return microresources_by_id.get(ed_id)
    except ImportError:
        return None


def resolve_microresource_by_symbol(symbol: str) -> Optional[dict]:
    try:
        from .fdevids import microresources_by_symbol
        return microresources_by_symbol.get(symbol)
    except ImportError:
        return None


def resolve_outfitting(ed_id: int) -> Optional[dict]:
    try:
        from .fdevids import outfitting_by_id
        return outfitting_by_id.get(ed_id)
    except ImportError:
        return None


def resolve_shipyard(ed_id: int) -> Optional[dict]:
    try:
        from .fdevids import shipyard_by_id
        return shipyard_by_id.get(ed_id)
    except ImportError:
        return None
