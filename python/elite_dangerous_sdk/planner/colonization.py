from dataclasses import dataclass, field
from enum import IntEnum
from typing import List


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
