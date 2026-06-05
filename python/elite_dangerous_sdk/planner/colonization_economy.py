from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
from ..data.colonization import (
    ECONOMIES, CONCRETE_ECONOMIES, BODY_TYPES, BODY_FEATURES,
    STELLAR_REMNANTS, RESERVE_LEVELS, SYS_UNLOCK_KEYS, SYS_EFFECT_KEYS,
    SysEffects, SiteType, site_types,
)


class EconomyMap(dict):
    pass


@dataclass
class EconAudit:
    inf: str
    delta: float
    reason: str
    before: float
    after: float


@dataclass
class TierPoints:
    tier2: int = 0
    tier3: int = 0


@dataclass
class Rev:
    rev_num: int = 0
    name: str = ""


@dataclass
class NamedSave:
    name: str = ""
    saves: List[int] = field(default_factory=list)


@dataclass
class Pop:
    population: float = 0.0
    mpop: float = 0.0


@dataclass
class BodyMap2:
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
    surface_primary: Optional["SiteMap2"] = None
    orbital_primary: Optional["SiteMap2"] = None
    sites: List["SiteMap2"] = field(default_factory=list)
    surface: List["SiteMap2"] = field(default_factory=list)
    orbital: List["SiteMap2"] = field(default_factory=list)


@dataclass
class SiteLinks2:
    strong_sites: List["SiteMap2"] = field(default_factory=list)
    weak_sites: List["SiteMap2"] = field(default_factory=list)


@dataclass
class SiteMap2:
    id: str = ""
    build_id: str = ""
    market_id: int = 0
    name: str = ""
    body_num: int = 0
    build_type: str = ""
    notes: Optional[str] = None
    status: str = "plan"
    type: SiteType = field(default_factory=lambda: {})
    body: Optional[BodyMap2] = None
    sys: Optional["SysMap2"] = None
    economies: Optional[EconomyMap] = None
    primary_economy: Optional[str] = None
    economy_audit: Optional[List[EconAudit]] = None
    intrinsic: Optional[List[str]] = None
    body_buffed: Optional[set] = None
    system_buffed: Optional[set] = None
    links: Optional[SiteLinks2] = None
    original: Optional[dict] = None
    parent_link: Optional["SiteMap2"] = None
    calc_needs: Optional[Tuple[int, int]] = None


@dataclass
class SysMap2:
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
    bodies: List[BodyMap2] = field(default_factory=list)
    sites: List[SiteMap2] = field(default_factory=list)
    slots: Dict[int, List[int]] = field(default_factory=dict)
    revs: List[Rev] = field(default_factory=list)
    saved_names: Optional[List[NamedSave]] = None
    pop: Optional[Pop] = None
    open: Optional[bool] = None
    idx_calc_limit: Optional[int] = None
    body_map: Dict[str, BodyMap2] = field(default_factory=dict)
    site_maps: List[SiteMap2] = field(default_factory=list)
    tier_points: TierPoints = field(default_factory=TierPoints)
    economies: Dict[str, float] = field(default_factory=dict)
    sum_effects: "SysEffects" = field(default_factory=lambda: SysEffects(pop=0, mpop=0, sec=0, tech=0, wealth=0, sol=0, dev=0))
    system_score: int = 0
    sys_unlocks: Dict[str, bool] = field(default_factory=dict)
    tax_count: int = 0
    calc_ids: List[str] = field(default_factory=list)


class SiteTypeValidity:
    pass


StellarAndStars = ["st", "bh", "ns", "wd"]
EarthLikeAndWater = ["elw", "ww"]
HighMetalAndMetalRich = ["hmc", "mrb"]
GasGiantWaterIce = ["gg", "wg", "ri", "ib"]
ElwAwWw = ["elw", "ww", "aw"]
ElwAw = ["elw", "aw"]
MajorPristine = ["major", "pristine"]
DepletedLow = ["depleted", "low"]
BioGeo = ["bio", "geo"]
BioTerraformable = ["bio", "terraformable"]


def _key(inf: str) -> str:
    return inf.lower()


def _init_key(map_: EconomyMap, key: str):
    if key not in map_:
        map_[key] = 0.0


def _adjust(inf: str, delta: float, reason: str, map_: EconomyMap, site: SiteMap2, source: Optional[str] = None):
    k = _key(inf)
    _init_key(map_, k)
    before = map_[k]
    new_value = before + delta
    if new_value <= 0:
        new_value = 0.1
    new_value = round(new_value, 2)
    map_[k] = new_value
    if site.economy_audit is not None:
        site.economy_audit.append(EconAudit(inf=inf, delta=delta, reason=reason, before=before, after=new_value))
    if source == "body":
        if site.body_buffed is None:
            site.body_buffed = set()
        site.body_buffed.add(inf)
    if source == "sys":
        if site.system_buffed is None:
            site.system_buffed = set()
        site.system_buffed.add(inf)


def _finish_up(map_: EconomyMap, site: SiteMap2) -> str:
    primary_key = max(map_, key=lambda k: map_[k])
    site.economies = map_
    site.primary_economy = primary_key
    return primary_key


_use_new_model = True


def _apply_specialized_port(map_: EconomyMap, site: SiteMap2):
    fixed = site.type.get("fixed")
    if fixed is None or fixed == "none" or fixed == "colony":
        return
    if site.type.get("orbital", False):
        _adjust(fixed, 1.0, "Specialised orbital economy", map_, site)
    else:
        _adjust(fixed, 0.5, "Specialised surface economy", map_, site)
    if _use_new_model:
        apply_buffs(map_, site, False)


def apply_body_type(map_: EconomyMap, site: SiteMap2):
    if site.type.get("inf", "") != "colony":
        return
    intrinsic = set()
    body = site.body
    body_type = body.type if body else "un"

    if body_type in ("bh", "ns", "wd"):
        _adjust("hightech", 1.0, "Body type: BH/NS/WD", map_, site)
        intrinsic.add("hightech")
        _adjust("tourism", 1.0, "Body type: BH/NS/WD", map_, site)
        intrinsic.add("tourism")
    elif body_type == "st":
        _adjust("military", 1.0, "Body type: STAR", map_, site)
        intrinsic.add("military")
    elif body_type == "elw":
        _adjust("agriculture", 1.0, "Body type: ELW", map_, site)
        intrinsic.add("agriculture")
        _adjust("hightech", 1.0, "Body type: ELW", map_, site)
        intrinsic.add("hightech")
        _adjust("military", 1.0, "Body type: ELW", map_, site)
        intrinsic.add("military")
        _adjust("tourism", 1.0, "Body type: ELW", map_, site)
        intrinsic.add("tourism")
    elif body_type == "ww":
        _adjust("agriculture", 1.0, "Body type: WW", map_, site)
        intrinsic.add("agriculture")
        _adjust("tourism", 1.0, "Body type: WW", map_, site)
        intrinsic.add("tourism")
    elif body_type == "aw":
        _adjust("hightech", 1.0, "Body type: AMMONIA", map_, site)
        intrinsic.add("hightech")
        _adjust("tourism", 1.0, "Body type: AMMONIA", map_, site)
        intrinsic.add("tourism")
    elif body_type in ("gg", "wg"):
        _adjust("hightech", 1.0, "Body type: GG/WG", map_, site)
        intrinsic.add("hightech")
        _adjust("industrial", 1.0, "Body type: GG/WG", map_, site)
        intrinsic.add("industrial")
    elif body_type in ("hmc", "mrb"):
        _adjust("extraction", 1.0, "Body type: HMC", map_, site)
        intrinsic.add("extraction")
    elif body_type == "ri":
        _adjust("industrial", 1.0, "Body type: ROCKY-ICE", map_, site)
        intrinsic.add("industrial")
        _adjust("refinery", 1.0, "Body type: ROCKY-ICE", map_, site)
        intrinsic.add("refinery")
    elif body_type == "rb":
        _adjust("refinery", 1.0, "Body type: ROCKY", map_, site)
        intrinsic.add("refinery")
    elif body_type == "ib":
        _adjust("industrial", 1.0, "Body type: ICY", map_, site)
        intrinsic.add("industrial")
    elif body_type == "ac":
        _adjust("extraction", 1.0, "Body type: ASTEROID", map_, site)
        intrinsic.add("extraction")

    if body and body_type in StellarAndStars:
        has_asteroids = any(b.type == "ac" and b.name.startswith(body.name) for b in (site.sys.bodies if site.sys else []))
        if has_asteroids:
            _adjust("extraction", 1.0, "Star has: ASTEROIDs", map_, site)
            intrinsic.add("extraction")

    if body and "rings" in body.features:
        if body_type not in HighMetalAndMetalRich:
            _adjust("extraction", 1.0, "Body has: RINGS", map_, site, "body")
            intrinsic.add("extraction")

    if body and "bio" in body.features:
        if body_type not in EarthLikeAndWater:
            _adjust("agriculture", 1.0, "Body has: BIO", map_, site, "body")
            intrinsic.add("agriculture")
        _adjust("terraforming", 1.0, "Body has: BIO", map_, site, "body")
        intrinsic.add("terraforming")

    if body and "geo" in body.features:
        if body_type not in HighMetalAndMetalRich:
            _adjust("extraction", 1.0, "Body has: GEO", map_, site, "body")
            intrinsic.add("extraction")
        if body_type not in GasGiantWaterIce:
            _adjust("industrial", 1.0, "Body has: GEO", map_, site, "body")
            intrinsic.add("industrial")

    site.intrinsic = list(intrinsic)


def apply_strong_links2(map_: EconomyMap, strong_sites: List[SiteMap2], site: SiteMap2, calc_ids: List[str], sub_link: Optional[str] = None):
    for s in strong_sites:
        if s.type.get("inf", "") == "none":
            continue
        if s.id not in calc_ids:
            continue

        inf_size = 0.4 if s.type.get("tier", 1) == 1 else (0.8 if s.type.get("tier", 1) == 2 else 1.2)
        prefix = "sub-strong link" if sub_link is not None else "Strong link"

        if s.type.get("inf", "") != "colony":
            s_inf = s.type.get("inf", "")
            if _key(s_inf) in {_key(k) for k in map_}:
                _adjust(s_inf, inf_size, f"Apply {prefix} from: {s.name} (T{s.type.get('tier', 1)})", map_, site)
                apply_strong_link_boost(s_inf, map_, site, prefix)
            if _use_new_model and s.links and s.links.strong_sites and sub_link is None:
                apply_strong_links2(map_, s.links.strong_sites, site, calc_ids, s_inf)
            continue

        if s.primary_economy is None:
            continue

        for k, val in (s.economies or {}).items():
            ee = k
            if s.intrinsic and ee in s.intrinsic:
                if _use_new_model:
                    link_size = 0.4 if s.type.get("tier", 1) == 1 else (0.8 if s.type.get("tier", 1) == 2 else 1.2)
                    _adjust(ee, link_size, f"Apply colony {prefix} from: {s.name} (T{s.type.get('tier', 1)})", map_, site)
                else:
                    _adjust(ee, val, f"Apply colony {prefix} from: {s.name} (T{s.type.get('tier', 1)})", map_, site)
                apply_strong_link_boost(ee, map_, site, f"{prefix}s")

        if _use_new_model and s.links and s.links.strong_sites and sub_link is None:
            apply_strong_links2(map_, s.links.strong_sites, site, calc_ids, "colony")


def apply_strong_link_boost(inf: str, map_: EconomyMap, site: SiteMap2, reason: str):
    reserve_level = site.sys.reserve_level if site.sys else "common"
    body = site.body

    if inf == "agriculture":
        if body and (body.type in EarthLikeAndWater or "bio" in body.features):
            _adjust(inf, 0.4, f"+ {reason} boost: Body is ELW/WW or has BIO", map_, site, "body")
        if body and (body.type == "ib" or body_is_tidal_to_star(site.sys, body)):
            _adjust(inf, -0.4, f"- {reason} boost: Body is ICY or has TIDAL", map_, site, "body")
    elif inf == "extraction":
        if reserve_level in MajorPristine:
            _adjust(inf, 0.4, f"+ {reason} boost: System reserveLevel is MAJOR or PRISTINE", map_, site, "sys")
        elif reserve_level in DepletedLow:
            _adjust(inf, -0.4, f"- {reason} boost: System reserveLevel is LOW or DEPLETED", map_, site, "sys")
        if body and "volcanism" in body.features:
            _adjust(inf, 0.4, f"+ {reason} boost: Body has VOLCANISM", map_, site, "body")
    elif inf == "hightech":
        if body and (body.type in ElwAwWw or any(f in body.features for f in BioGeo)):
            _adjust(inf, 0.4, f"+ {reason} boost: Body is AW/ELW/WW or has BIO/GEO", map_, site, "body")
    elif inf in ("industrial", "refinery"):
        if reserve_level in MajorPristine:
            _adjust(inf, 0.4, f"+ {reason} boost: System reserveLevel is MAJOR or PRISTINE", map_, site, "sys")
        elif reserve_level in DepletedLow:
            _adjust(inf, -0.4, f"- {reason} boost: System reserveLevel is LOW or DEPLETED", map_, site, "sys")
    elif inf == "tourism":
        if body and (body.type in ElwAwWw or any(f in body.features for f in BioGeo)):
            _adjust(inf, 0.4, f"+ {reason} boost: Body is AW/ELW/WW or has BIO/GEO", map_, site, "body")
        if site.sys and any(b.type in StellarAndStars for b in site.sys.bodies):
            _adjust(inf, 0.4, f"+ {reason} boost: System has BH/NS/WD", map_, site, "sys")


def apply_buffs(map_: EconomyMap, site: SiteMap2, is_settlement: bool):
    reserve_level = site.sys.reserve_level if site.sys else "common"
    body = site.body

    reserve_sensitive = ["industrial", "extraction", "refinery"]
    for key in reserve_sensitive:
        if map_.get(_key(key), 0) > 0:
            if reserve_level in MajorPristine:
                _adjust(key, 0.4, "Buff: reserveLevel MAJOR or PRISTINE", map_, site, "sys")
            elif reserve_level in DepletedLow and not is_settlement:
                _adjust(key, -0.4, "Buff: reserveLevel LOW or DEPLETED", map_, site, "sys")

    if map_.get(_key("agriculture"), 0) > 0:
        buffed = False
        if body and any(f in body.features for f in BioTerraformable):
            _adjust("agriculture", 0.4, "Buff: body has BIO or TERRAFORMABLE", map_, site, "body")
            buffed = True
        elif body and body.type in EarthLikeAndWater:
            _adjust("agriculture", 0.4, "Buff: body is ELW or WW", map_, site, "body")
        if body and (body.type == "ib" or body_is_tidal_to_star(site.sys, body)):
            if not is_settlement or buffed:
                _adjust("agriculture", -0.4, "Buff: body is ICY or has TIDAL", map_, site, "body")

    if map_.get(_key("hightech"), 0) > 0:
        if is_settlement:
            if body:
                if "bio" in body.features:
                    _adjust("hightech", 0.4, "Buff: body has BIO", map_, site, "body")
                if "geo" in body.features:
                    _adjust("hightech", 0.4, "Buff: body has GEO", map_, site, "body")
                if body.type in ElwAw:
                    _adjust("hightech", 0.4, "Buff: body is ELW or AW", map_, site, "body")
        else:
            if body and (any(f in body.features for f in BioGeo) or body.type in ElwAw):
                _adjust("hightech", 0.4, "Buff: body has BIO or GEO or is ELW/AW", map_, site, "body")

    if map_.get(_key("extraction"), 0) > 0:
        if body and "volcanism" in body.features:
            _adjust("extraction", 0.4, "Buff: body has VOLCANISM", map_, site, "body")

    if map_.get(_key("tourism"), 0) > 0:
        if site.sys:
            for bt in ["bh", "ns", "wd"]:
                if any(b.type == bt for b in site.sys.bodies):
                    _adjust("tourism", 0.4, f"Buff: system has a {bt.upper()}", map_, site, "sys")
        if site.body_buffed is None or "tourism" not in site.body_buffed:
            if body and (any(f in body.features for f in BioGeo) or body.type in ElwAwWw):
                _adjust("tourism", 0.4, "Buff: body has BIO/GEO or is ELW/WW/AW", map_, site, "body")


def _apply_weak_links(map_: EconomyMap, site: SiteMap2, calc_ids: List[str]):
    if site.links is None or not site.links.weak_sites:
        return
    for s in site.links.weak_sites:
        if s.id not in calc_ids:
            continue
        inf = s.type.get("inf", "")
        if inf == "none":
            continue
        if inf == "colony":
            if s.primary_economy is None:
                continue
            for intrinsic_inf in (s.intrinsic or []):
                _adjust(intrinsic_inf, 0.05, f"Apply weak link from: {s.name} (intrinsic)", map_, site)
            continue
        if _key(inf) in {_key(k) for k in map_}:
            _adjust(inf, 0.05, f"Apply weak link from: {s.name}", map_, site)


def calculate_colony_economies2(site: SiteMap2, calc_ids: List[str]) -> str:
    if site.economies is not None and site.primary_economy is not None:
        return site.primary_economy

    site.economy_audit = []
    map_ = EconomyMap({
        _key("agriculture"): 0,
        _key("extraction"): 0,
        _key("hightech"): 0,
        _key("industrial"): 0,
        _key("military"): 0,
        _key("refinery"): 0,
        _key("terraforming"): 0,
        _key("tourism"): 0,
        _key("service"): 0,
    })

    build_class = site.type.get("buildClass", "")

    if build_class in ("hub", "installation", "unknown"):
        return "none"
    if build_class == "settlement":
        _adjust(site.type.get("inf", "none"), 1.0, "Odyssey settlement fixed economy", map_, site)
        apply_buffs(map_, site, True)
        return _finish_up(map_, site)
    if build_class not in ("outpost", "starport"):
        return "none"

    fixed = site.type.get("fixed")
    if fixed is not None:
        _apply_specialized_port(map_, site)
    else:
        if _use_new_model or not site.type.get("orbital", False) or site.body is None or site.body.surface_primary is None or site != site.body.orbital_primary:
            apply_body_type(map_, site)
        if _use_new_model:
            apply_buffs(map_, site, False)

    if site.links is not None:
        apply_strong_links2(map_, site.links.strong_sites, site, calc_ids)
        if not site.type.get("fixed"):
            if not _use_new_model:
                apply_buffs(map_, site, False)
        _apply_weak_links(map_, site, calc_ids)

    return _finish_up(map_, site)


def body_is_tidal_to_star(sys: Optional[SysMap2], body: Optional[BodyMap2], parents: Optional[List[int]] = None) -> bool:
    if parents is None and body is not None:
        parents = list(body.parents)

    if body is None:
        return False
    if "tidal" not in body.features and body.type != "bc":
        return False
    if not parents:
        return False

    parent_num = parents[0]
    parent_body = next((b for b in (sys.bodies if sys else []) if b.num == parent_num), None)
    if parent_body is None:
        return False

    if parent_body.type in StellarAndStars:
        return True

    if parent_body.type == "bc":
        children = [b for b in (sys.bodies if sys else []) if b.parents and len(b.parents) > 0 and b.parents[0] == parent_body.num]
        if len(children) > 1:
            idx = next((i for i, b in enumerate(children) if b.name == body.name), -1)
            if idx < 2:
                other = children[1] if idx == 0 else children[0]
                if other.type in StellarAndStars:
                    return True
                skip_parent_num = parents[1] if len(parents) > 1 else -1
                skip_parent_body = next((b for b in (sys.bodies if sys else []) if b.num == skip_parent_num), None)
                if skip_parent_body and skip_parent_body.type == "st":
                    return True
            if idx > 1 and children[0].type in StellarAndStars and children[1].type in StellarAndStars:
                return True
            return False

    parents.pop(0)
    return body_is_tidal_to_star(sys, parent_body, parents)


def build_system_model2():
    return {}


def is_type_valid2(build_type: str, site_maps: Optional[List[dict]], site: dict) -> bool:
    return has_pre_req2(site_maps, site)


def map_sys_unlocks(site_maps: List[dict], sys_unlocks: Dict[str, bool]) -> Dict[str, bool]:
    return sys_unlocks
