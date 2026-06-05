from dataclasses import dataclass, field
from enum import IntEnum
from typing import Dict, List, Optional


class ColonyState(IntEnum):
    NONE = 0
    CLAIMED = 1
    BEACON_PLACED = 2
    PRIMARY_PORT_BUILDING = 3
    ACTIVE = 4
    FAILED = 5


COLONY_STATE_NAMES = {
    ColonyState.NONE: "None",
    ColonyState.CLAIMED: "Claimed",
    ColonyState.BEACON_PLACED: "Beacon Placed",
    ColonyState.PRIMARY_PORT_BUILDING: "Primary Port Building",
    ColonyState.ACTIVE: "Active",
    ColonyState.FAILED: "Failed",
}


@dataclass
class ConstructionResource:
    name: str = ""
    name_localised: str = ""
    required_amount: int = 0
    provided_amount: int = 0
    payment: int = 0


@dataclass
class ConstructionSite:
    id: str = ""
    market_id: int = 0
    primary_port: bool = False
    construction_progress: float = 0.0
    construction_complete: bool = False
    construction_failed: bool = False
    resources_required: List[ConstructionResource] = field(default_factory=list)


@dataclass
class ColonySystem:
    system_name: str = ""
    architect: str = ""
    state: ColonyState = ColonyState.NONE
    construction_sites: List[ConstructionSite] = field(default_factory=list)
    completed_structures: int = 0
    total_slots: int = 0


_next_id = 1


def _gen_id() -> str:
    global _next_id
    result = f"col-{_next_id}"
    _next_id += 1
    return result


def create_construction_site(market_id: int, primary_port: bool = False) -> ConstructionSite:
    return ConstructionSite(
        id=_gen_id(),
        market_id=market_id,
        primary_port=primary_port,
    )


def get_resource_shortfall(resource: ConstructionResource) -> int:
    return max(0, resource.required_amount - resource.provided_amount)


def get_total_progress(site: ConstructionSite) -> float:
    if not site.resources_required:
        return site.construction_progress
    total_required = sum(r.required_amount for r in site.resources_required)
    if total_required == 0:
        return site.construction_progress
    total_provided = sum(r.provided_amount for r in site.resources_required)
    return total_provided / total_required


def parse_colonisation_construction_depot(event: dict) -> ConstructionSite:
    resources = []
    for r in event.get("ResourcesRequired", []):
        name = r.get("Name", "") or ""
        name_localised = r.get("Name_Localised", name) or name
        resources.append(ConstructionResource(
            name=name,
            name_localised=name_localised,
            required_amount=r.get("RequiredAmount", 0),
            provided_amount=r.get("ProvidedAmount", 0),
            payment=r.get("Payment", 0),
        ))
    return ConstructionSite(
        id=_gen_id(),
        market_id=event.get("MarketID", 0),
        construction_progress=float(event.get("ConstructionProgress", 0.0)),
        construction_complete=bool(event.get("ConstructionComplete", False)),
        construction_failed=bool(event.get("ConstructionFailed", False)),
        resources_required=resources,
    )


# --- Tax, Pre-req, Surface slot prediction ---

PRE_REQ_MAP = {
    "satellite": ["hermes", "angelia", "eirene"],
    "comms": ["pistis", "soter", "aletheia"],
    "settlementAgr": ["consus", "picumnus", "annona", "ceres", "fornax"],
    "installationAgr": ["demeter"],
    "installationMil": ["vacuna", "alastor"],
    "outpostMining": ["euthenia", "phorcys"],
    "relay": ["enodia", "ichnaea"],
    "settlementBio": ["pheobe", "asteria", "caerus", "chronos"],
    "settlementTourist": ["aergia", "comus", "gelos", "fufluns"],
    "settlementMilitary": ["ioke", "bellona", "enyo", "polemos", "minerva"],
    "settlementExtraction": ["ourea", "mantus", "orcus", "aerecura", "erebus"],
}


def _get_build_type(build_type: str) -> str:
    return build_type.rsplit("_", 1)[0] if "_" in build_type else build_type


def apply_tax(tier: int, cost: int, tax_count: int) -> int:
    if tax_count <= 0 or tier <= 1:
        return cost
    if tier == 2:
        return cost + int(cost * 0.75 * tax_count)
    if tier == 3:
        return cost + cost * tax_count
    return cost


def get_pre_req_needed(site: dict) -> List[str]:
    pre_req = site.get("preReq", "")
    if not pre_req:
        return []
    return PRE_REQ_MAP.get(pre_req, [])


def has_pre_req2(site_maps: Optional[List[dict]], site: dict) -> bool:
    if site_maps is None:
        return True
    pre_req_needed = get_pre_req_needed(site)
    if not pre_req_needed:
        return False
    for sm in site_maps:
        build_type = _get_build_type(sm.get("buildType", ""))
        if build_type in pre_req_needed and sm.get("status") != "demolish":
            return True
    return False


def predict_surface_slots(body: dict) -> int:
    body_type = body.get("type", "")
    features = body.get("features", [])
    temp = body.get("temp", 300)
    gravity = body.get("gravity", 1.0)
    radius = body.get("radius", 5000)
    sub_type = body.get("subType", "")

    if body_type == "un":
        return -1

    if temp > 700 or gravity > 2.7:
        return 0

    if "landable" not in features:
        return 0

    if radius < 2000:
        slots = 1
    elif radius < 3000:
        slots = 2
    elif radius < 5000:
        slots = 3
    else:
        slots = 4

    if sub_type and "high metal content" in sub_type.lower():
        slots += 1
    if "terraformable" in features:
        slots += 1
    if "volcanism" in features:
        slots += 1
    if "geo" in features:
        slots += 1
    if "atmosphere" in features:
        slots += 2

    return min(slots, 7)


def sum_tier_points(slots_dict: Optional[Dict[int, int]]) -> int:
    if not slots_dict:
        return 0
    total = 0
    for tier, count in slots_dict.items():
        total += tier * count
    return total


def get_snapshot():
    return {}
