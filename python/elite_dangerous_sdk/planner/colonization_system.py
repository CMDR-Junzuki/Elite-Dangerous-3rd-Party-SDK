"""Colonization system model - build system model, tier points, site validation."""

from dataclasses import dataclass, field
from copy import copy
from typing import Any, Dict, List, Optional, Tuple, Union
from ..data import STELLAR_REMNANTS, get_site_type
from .colonization_economy import (
    calculate_colony_economies2,
    BodyMap2,
    SiteMap2,
    SysMap2,
    TierPoints,
    SiteLinks2,
    Rev,
    NamedSave,
    Pop,
    SysEffects,
)


# --- Exported dataclasses ---


@dataclass
class RawBod:
    name: str = ""
    num: int = 0
    dist_ls: float = 0.0
    parents: List[int] = field(default_factory=list)
    type: str = "un"
    sub_type: str = ""
    features: List[str] = field(default_factory=list)
    radius: float = 0.0
    temp: float = 0.0
    gravity: float = 0.0


@dataclass
class RawSite:
    id: str = ""
    build_id: str = ""
    market_id: int = 0
    name: str = ""
    body_num: int = 0
    build_type: str = ""
    notes: Optional[str] = None
    status: str = "plan"


@dataclass
class RawSys:
    v: int = 0
    rev: int = 0
    name: str = ""
    nickname: Optional[str] = None
    notes: Optional[str] = None
    id64: int = 0
    architect: str = ""
    pos: List[float] = field(default_factory=list)
    reserve_level: str = "common"
    primary_port_id: Optional[str] = None
    bodies: List[RawBod] = field(default_factory=list)
    sites: List[RawSite] = field(default_factory=list)
    slots: Dict[int, List[int]] = field(default_factory=dict)
    revs: List[Rev] = field(default_factory=list)
    saved_names: Optional[List[NamedSave]] = None
    pop: Optional[Pop] = None
    open: Optional[bool] = None
    idx_calc_limit: Optional[int] = None


@dataclass
class SiteTypeValidity:
    is_valid: bool = True
    msg: Optional[str] = None
    unlocks: Optional[List[str]] = None


@dataclass
class SysSnapshot:
    architect: str = ""
    id64: int = 0
    v: int = 0
    name: str = ""
    pos: List[float] = field(default_factory=list)
    tier_points: TierPoints = field(default_factory=TierPoints)
    sum_effects: dict = field(default_factory=dict)
    sites: List[RawSite] = field(default_factory=list)
    pop: Optional[Pop] = None
    stale: bool = False
    score: int = 0
    fav: Optional[bool] = None


# --- Constants ---

map_sys_unlocks: Dict[str, Dict[str, Any]] = {
    "settlement_tourist": {
        "icon": "Suitcase",
        "title": "Tourist Settlements",
        "need_types": ["hermes", "angelia", "eirene"],
        "needs": "A satellite",
    },
    "installation_tourist": {
        "icon": "Cocktails",
        "title": "Tourist Installations",
        "need_types": ["aergia", "comus", "gelos", "fufluns"],
        "needs": "A tourist settlement",
    },
    "installation_scientific": {
        "icon": "NetworkTower",
        "title": "Scientific Installations",
        "need_types": ["pheobe", "asteria", "caerus", "chronos"],
        "needs": "A bio settlement",
    },
    "installation_military": {
        "icon": "Shield",
        "title": "Military Installations",
        "need_types": ["ioke", "bellona", "enyo", "polemos", "minerva"],
        "needs": "A military settlement",
    },
    "hub_military": {
        "icon": "ReportHacked",
        "title": "Military Hub",
        "need_types": ["vacuna", "alastor"],
        "needs": "A military installation",
    },
    "hub_civilian": {
        "icon": "Home",
        "title": "Civilian Hub",
        "need_types": ["consus", "picumnus", "annona", "ceres", "fornax"],
        "needs": "An agricultural settlement",
    },
    "hub_exploration": {
        "icon": "Camera",
        "title": "Exploration Hub",
        "need_types": ["pistis", "soter", "aletheia"],
        "needs": "A comms installation",
    },
    "hub_outpost": {
        "icon": "HardDriveGroup",
        "title": "Outpost Hub",
        "need_types": ["demeter"],
        "needs": "A space farm",
    },
    "hub_industrial": {
        "icon": "Manufacturing",
        "title": "Industrial Hub",
        "need_types": ["euthenia", "phorcys"],
        "needs": "A mining/industrial installation",
    },
    "hub_extraction": {
        "icon": "Diamond",
        "title": "Extraction Hub",
        "need_types": ["ourea", "mantus", "orcus", "aerecura", "erebus"],
        "needs": "An extraction settlement",
    },
    "shipyard_t1": {
        "icon": "Airplane",
        "title": "Shipyard at T1 surface ports",
        "need_types": ["eunostus", "molae", "tellus_i", "vacuna", "alastor"],
        "needs": "An industrial hub or military installation",
    },
    "outfitting_non_mil_outpost": {
        "icon": "Dataflows",
        "title": "Outfitting at non-Military Outposts",
        "need_types": ["janus", "vacuna", "alastor"],
        "needs": "A high-tech hub or military installation",
    },
    "outfitting_t1_surface": {
        "icon": "FlowChart",
        "title": "Outfitting at non-Industrial T1 surface ports",
        "need_types": ["janus", "vacuna", "alastor"],
        "needs": "A high-tech hub or military installation",
    },
    "vista_genomics": {
        "icon": "ClassroomLogo",
        "title": "Vista Genomics at T1 Surface or T2 orbital ports",
        "need_types": ["asclepius", "eupraxia", "athena", "caelus"],
        "needs": "A scientific hub or medical installation",
    },
    "universal_cartographics": {
        "icon": "HomeGroup",
        "title": "Universal Cartographics at T1 Surface or T2 orbital ports",
        "need_types": ["astraeus", "coeus", "dione", "dodona", "tellus_e"],
        "needs": "An exploration hub or research installation",
    },
    "market_outposts": {
        "icon": "Shop",
        "title": "Commodities at Pirate, Scientific or Military Outposts",
        "need_types": ["bacchus", "dionysus", "hedone", "opora", "pasithea", "io"],
        "needs": "An outpost hub, tourist installation or space bar",
    },
    "crew_lounge": {
        "icon": "People",
        "title": "Crew Lounge at non-Civilian T1 ports",
        "need_types": ["bacchus", "dionysus"],
        "needs": "A space bar",
    },
}


_stars_and_clusters = STELLAR_REMNANTS + ["ac", "st"]


# --- Internal helpers ---


def _get_unknown_body() -> BodyMap2:
    return BodyMap2(
        name="",
        num=-1,
        dist_ls=-1,
        features=["landable"],
        parents=[],
        sub_type="",
        type="un",
        radius=-1,
        temp=-1,
        gravity=-1,
    )


def _find_sibling_sites(
    bods: List[BodyMap2],
    body_map: Dict[str, BodyMap2],
    body: BodyMap2,
    only_orbitals: bool,
) -> List[SiteMap2]:
    if body.type not in _stars_and_clusters:
        return list(body.orbital if only_orbitals else body.sites)

    parent = (
        body
        if body.type != "ac"
        else next((b for b in bods if b.num == body.parents[0]), None)
    )
    if not parent:
        return []

    bodies = [
        parent,
        *[
            b
            for b in bods
            if b.type == "ac" and len(b.parents) > 0 and parent.num == b.parents[0]
        ],
    ]
    sibling_sites: List[SiteMap2] = []
    for x in bodies:
        if x.name in body_map:
            bm = body_map[x.name]
            if only_orbitals:
                sibling_sites.extend(bm.orbital)
            else:
                sibling_sites.extend(bm.sites)
    return sibling_sites


def _get_body_primary_port(
    sites: List[SiteMap2],
    calc_ids: List[str],
) -> Optional[SiteMap2]:
    if not sites:
        return None
    if calc_ids:
        sites = [s for s in sites if s.id in calc_ids]

    for s in sites:
        if s.type.get("tier") == 3 and s.type.get("buildClass") in (
            "starport",
            "outpost",
        ):
            return s
    for s in sites:
        if s.type.get("tier") == 2 and s.type.get("buildClass") in (
            "starport",
            "outpost",
        ):
            return s
    for s in sites:
        if s.type.get("tier") == 1 and s.type.get("buildClass") in (
            "starport",
            "outpost",
        ):
            return s
    return None


def _calc_site_links(
    bods: List[BodyMap2],
    body_map: Dict[str, BodyMap2],
    body: BodyMap2,
    primary_site: SiteMap2,
    calc_ids: List[str],
) -> None:
    sibling_sites = _find_sibling_sites(bods, body_map, body, False)

    strong_sites: List[SiteMap2] = []
    for s in sibling_sites:
        if (
            s.parent_link
            or s.type.get("inf") == "none"
            or s is primary_site
            or s.id not in calc_ids
        ):
            continue
        if (
            not primary_site.type.get("orbital")
            and s.type.get("orbital")
            and s.type.get("buildClass") in ("outpost", "starport")
        ):
            continue
        if s.type.get("orbital") and not primary_site.type.get("orbital") and body.orbital_primary:
            continue
        s.parent_link = primary_site
        strong_sites.append(s)

    strong_sites.sort(key=lambda s: s.name)

    weak_sites: List[SiteMap2] = []
    for b in body_map.values():
        if b is body:
            continue
        for site in b.sites:
            if (
                site not in sibling_sites
                and site.type.get("inf") != "none"
                and site is not b.orbital_primary
                and site is not b.surface_primary
                and site.id in calc_ids
            ):
                weak_sites.append(site)

    if not primary_site.links and (strong_sites or weak_sites):
        primary_site.links = SiteLinks2(
            strong_sites=strong_sites, weak_sites=weak_sites
        )


def _calc_site_economies(site: SiteMap2, calc_ids: List[str]) -> None:
    if not site.links:
        return

    for s in site.links.strong_sites:
        inf = s.type.get("inf", "")
        if inf == "none":
            continue
        if inf == "colony":
            calculate_colony_economies2(s, calc_ids)

    for s in site.links.weak_sites:
        inf = s.type.get("inf", "")
        if inf == "none":
            continue
        if inf == "colony":
            calculate_colony_economies2(s, calc_ids)


def _calc_body_links(
    bods: List[BodyMap2],
    body_map: Dict[str, BodyMap2],
    body: BodyMap2,
    calc_ids: List[str],
) -> None:
    if not body.surface_primary and not body.orbital_primary:
        return

    if body.surface_primary:
        _calc_site_links(bods, body_map, body, body.surface_primary, calc_ids)
    if body.orbital_primary:
        _calc_site_links(bods, body_map, body, body.orbital_primary, calc_ids)

    for site in body.sites:
        _calc_site_economies(site, calc_ids)


def _initialize_sys_map(
    sys: RawSys,
    use_incomplete: bool,
    idx_limit: int,
) -> SysMap2:
    site_maps: List[SiteMap2] = []
    system_score = 0

    if use_incomplete:
        calc_ids = [
            s.id
            for i, s in enumerate(sys.sites)
            if i < idx_limit and s.status != "demolish"
        ]
    else:
        calc_ids = [s.id for s in sys.sites if s.status == "complete"]

    if not sys.sites:
        sys.sites = []

    all_bodies: List[BodyMap2] = []
    for b in sys.bodies:
        body = BodyMap2(
            name=b.name,
            num=b.num,
            dist_ls=b.dist_ls,
            parents=list(b.parents),
            type=b.type,
            sub_type=b.sub_type,
            features=list(b.features),
            radius=b.radius,
            temp=b.temp,
            gravity=b.gravity,
        )
        all_bodies.append(body)

    body_map: Dict[str, BodyMap2] = {}
    for body in all_bodies:
        body_map[body.name] = body

    sys_map_obj = SysMap2(
        v=sys.v,
        rev=sys.rev,
        name=sys.name,
        nickname=sys.nickname,
        notes=sys.notes,
        id64=sys.id64,
        architect=sys.architect,
        pos=list(sys.pos),
        reserve_level=sys.reserve_level,
        primary_port_id=sys.primary_port_id,
        bodies=all_bodies,
        slots=sys.slots,
        revs=sys.revs,
        saved_names=sys.saved_names,
        pop=sys.pop,
        open=sys.open,
        idx_calc_limit=sys.idx_calc_limit,
    )

    for s in sys.sites:
        body_num = s.body_num
        raw_body = next(
            (b for b in all_bodies if b.num == body_num), _get_unknown_body()
        )
        body = body_map.get(raw_body.name, raw_body)
        if raw_body.name not in body_map:
            body_map[raw_body.name] = body

        site_type = get_site_type(s.build_type) or {}

        site = SiteMap2(
            id=s.id,
            build_id=s.build_id,
            market_id=s.market_id,
            name=s.name,
            body_num=s.body_num,
            build_type=s.build_type,
            notes=s.notes,
            status=s.status,
            original=s,
            sys=sys_map_obj,
            body=body,
            type=site_type,
        )
        site_maps.append(site)
        body.sites.append(site)

        if site.status != "demolish":
            if site_type.get("orbital", False):
                body.orbital.append(site)
            else:
                body.surface.append(site)

        if site.id in calc_ids:
            system_score += site_type.get("score", 0)

    sys_map_obj.bodies = all_bodies
    sys_map_obj.sites = site_maps
    sys_map_obj.site_maps = site_maps
    sys_map_obj.body_map = body_map
    sys_map_obj.calc_ids = calc_ids
    sys_map_obj.system_score = system_score

    return sys_map_obj


def _sum_system_effects(
    site_maps: List[SiteMap2],
    calc_ids: List[str],
    _buff_nerf: Optional[bool] = None,
) -> Dict[str, Any]:
    map_economies: Dict[str, int] = {}
    sum_effects: Dict[str, float] = {}

    for site in site_maps:
        if site.status == "demolish":
            continue
        if site.id not in calc_ids:
            continue

        if site.type.get("buildClass") in ("settlement", "outpost", "starport"):
            calculate_colony_economies2(site, calc_ids)

        inf = site.primary_economy or site.type.get("inf", "")

        if inf != "none":
            map_economies[inf] = map_economies.get(inf, 0) + 1

        for key in ("pop", "mpop", "sec", "tech", "wealth", "sol", "dev"):
            effect = site.type.get("effects", {}).get(key, 0)
            if effect == 0:
                continue
            sum_effects[key] = sum_effects.get(key, 0) + effect

    sorted_keys = sorted(
        map_economies.keys(),
        key=lambda k: (map_economies[k], k),
        reverse=True,
    )
    economies = {k: map_economies[k] for k in sorted_keys}

    for k in list(sum_effects.keys()):
        sum_effects[k] = round(sum_effects[k], 3)

    return {"economies": economies, "sum_effects": sum_effects}


# --- Exported functions ---


def build_system_model2(
    sys: RawSys,
    use_incomplete: bool,
    buff_nerf: Optional[bool] = None,
) -> SysMap2:
    idx_limit = sys.idx_calc_limit if sys.idx_calc_limit is not None else len(sys.sites)

    sys.primary_port_id = sys.sites[0].id if sys.sites else None

    sys_copy = RawSys(
        v=sys.v,
        rev=sys.rev,
        name=sys.name,
        nickname=sys.nickname,
        notes=sys.notes,
        id64=sys.id64,
        architect=sys.architect,
        pos=list(sys.pos),
        reserve_level=sys.reserve_level,
        primary_port_id=sys.primary_port_id,
        bodies=list(sys.bodies),
        slots=dict(sys.slots),
        revs=list(sys.revs),
        saved_names=list(sys.saved_names) if sys.saved_names else None,
        pop=sys.pop,
        open=sys.open,
        idx_calc_limit=sys.idx_calc_limit,
        sites=[copy(s) for s in sys.sites],
    )

    sys_map = _initialize_sys_map(sys_copy, use_incomplete, idx_limit)

    all_bodies = list(sys_map.body_map.values())
    for body in all_bodies:
        body.surface_primary = _get_body_primary_port(body.surface, sys_map.calc_ids)
        sibling_sites = _find_sibling_sites(
            sys_map.bodies,
            sys_map.body_map,
            body,
            body.surface_primary is not None,
        )
        body.orbital_primary = _get_body_primary_port(
            sibling_sites, sys_map.calc_ids
        )

    for body in all_bodies:
        _calc_body_links(sys_map.bodies, sys_map.body_map, body, sys_map.calc_ids)

    tier_points_result = sum_tier_points(
        sys_map.site_maps, sys_map.calc_ids, not use_incomplete
    )
    economies_sum_effects = _sum_system_effects(
        sys_map.site_maps, sys_map.calc_ids, buff_nerf
    )

    sys_unlocks: Dict[str, bool] = {}
    for key, unlock_info in map_sys_unlocks.items():
        unlocked = any(
            sys_map.calc_ids is not None
            and s.id in sys_map.calc_ids
            and any(s.build_type.startswith(n) for n in unlock_info["need_types"])
            for s in sys_map.sites
        )
        sys_unlocks[key] = unlocked

    sys_map.economies = economies_sum_effects["economies"]
    sys_map.sum_effects = economies_sum_effects["sum_effects"]
    sys_map.tier_points = tier_points_result["tier_points"]
    sys_map.tax_count = tier_points_result["tax_count"]
    sys_map.sys_unlocks = sys_unlocks

    return sys_map


def sum_tier_points(
    site_maps: List[SiteMap2],
    calc_ids: List[str],
    inc_build_started: Optional[bool] = None,
) -> Dict[str, Any]:
    tier_points = TierPoints(tier2=0, tier3=0)
    primary_port_id = site_maps[0].id if site_maps else None
    tax_count = -2

    for site in site_maps:
        if site.status == "demolish":
            continue
        if inc_build_started:
            if site.status == "plan":
                continue
        elif site.id not in calc_ids:
            continue

        if (
            site.id != primary_port_id
            and site.type.get("needs", {}).get("count", 0) > 0
            and site.type.get("needs", {}).get("tier", 0) > 1
        ):
            need_count = site.type["needs"]["count"]
            if site.type.get("buildClass") == "starport" and site.type.get("tier", 0) > 1:
                tax_count += 1
                need_count = apply_tax(site.type["needs"]["tier"], need_count, tax_count)
            tier_name = "tier2" if site.type["needs"]["tier"] == 2 else "tier3"
            setattr(tier_points, tier_name, getattr(tier_points, tier_name) - need_count)
            site.calc_needs = (site.type["needs"]["tier"], need_count)

        if site.id not in calc_ids:
            continue

        if site.type.get("gives", {}).get("count", 0) > 0 and site.type.get("gives", {}).get("tier", 0) > 1:
            tier_name = "tier2" if site.type["gives"]["tier"] == 2 else "tier3"
            setattr(tier_points, tier_name, getattr(tier_points, tier_name) + site.type["gives"]["count"])

    return {"tier_points": tier_points, "tax_count": tax_count}


def apply_tax(tier: int, cost: int, tax_count: int) -> int:
    if tax_count > 0:
        if tier == 3:
            cost = cost + cost * tax_count
        else:
            cost = cost + int(cost * 0.75 * tax_count)
    return cost


def get_pre_req_needed(type_: dict) -> List[str]:
    pre_req = type_.get("preReq", "")
    if not pre_req:
        return []
    _map = {
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
    return _map.get(pre_req, [])


def has_pre_req2(
    site_maps: Optional[List],
    type_: dict,
) -> bool:
    if site_maps is None:
        return True
    needed_build_types = get_pre_req_needed(type_)
    if not needed_build_types:
        return False
    for sm in site_maps:
        if isinstance(sm, dict):
            build_type = sm.get("buildType", "")
            status = sm.get("status", "")
        else:
            build_type = getattr(sm, "build_type", "")
            status = getattr(sm, "status", "")
        if status != "demolish" and any(
            build_type.startswith(n) for n in needed_build_types
        ):
            return True
    return False


def is_type_valid2(
    sys_map: Optional[SysMap2],
    type_: Optional[dict],
    prior_type: Optional[dict] = None,
) -> SiteTypeValidity:
    if type_ is None:
        return SiteTypeValidity(is_valid=True)

    if sys_map is not None:
        needed_t2 = sys_map.tier_points.tier2
        needed_t3 = sys_map.tier_points.tier3
        if prior_type is not None:
            if prior_type.get("needs", {}).get("tier") == 2:
                needed_t2 += prior_type["needs"]["count"]
            if prior_type.get("needs", {}).get("tier") == 3:
                needed_t3 += prior_type["needs"]["count"]

        if type_.get("needs", {}).get("tier") == 2 and needed_t2 < type_["needs"]["count"]:
            return SiteTypeValidity(is_valid=False, msg="Not enough Tier 2 points")
        if type_.get("needs", {}).get("tier") == 3 and needed_t3 < type_["needs"]["count"]:
            return SiteTypeValidity(is_valid=False, msg="Not enough Tier 3 points")

    if type_.get("preReq"):
        is_valid = has_pre_req2(
            sys_map.site_maps if sys_map else None, type_
        )
        return SiteTypeValidity(
            is_valid=is_valid,
            msg=None if is_valid else f"Requires {type_['preReq']}",
            unlocks=type_.get("unlocks"),
        )

    if type_.get("unlocks"):
        return SiteTypeValidity(is_valid=True, unlocks=type_["unlocks"])

    return SiteTypeValidity(is_valid=True)


def predict_surface_slots(body: dict) -> int:
    body_type = body.get("type", "")
    features = body.get("features", [])
    temp = body.get("temp", 300)
    gravity = body.get("gravity", 1.0)
    radius = body.get("radius", 5000)
    sub_type = body.get("subType", "")

    if body_type == "un":
        return -1

    if temp > 700 or gravity > 2.7 or "landable" not in features:
        return 0

    if radius < 1500:
        predicted = 1
    elif radius < 3750:
        predicted = 2
    elif radius < 6000:
        predicted = 3
    else:
        predicted = 4

    if sub_type and "high metal content" in sub_type.lower():
        predicted += 1
    if "terraformable" in features:
        predicted += 1
    if "volcanism" in features:
        predicted += 1
    if "geo" in features:
        predicted += 1
    if "atmosphere" in features:
        predicted += 2

    return min(predicted, 7)


def get_snapshot(new_sys: RawSys, is_fav: Optional[bool] = None) -> SysSnapshot:
    snapshot_full = build_system_model2(new_sys, False, True)
    snapshot = SysSnapshot(
        architect=new_sys.architect,
        id64=new_sys.id64,
        v=new_sys.v,
        name=new_sys.name,
        pos=list(new_sys.pos),
        tier_points=TierPoints(
            tier2=snapshot_full.tier_points.tier2,
            tier3=snapshot_full.tier_points.tier3,
        ),
        sum_effects=dict(snapshot_full.sum_effects),
        sites=list(new_sys.sites),
        pop=new_sys.pop,
        stale=False,
        score=snapshot_full.system_score if snapshot_full.system_score != 0 else -1,
        fav=is_fav,
    )
    return snapshot
