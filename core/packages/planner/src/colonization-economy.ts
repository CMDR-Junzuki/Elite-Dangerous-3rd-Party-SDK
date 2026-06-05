import type {
  BuildStatus,
  ConcreteEconomy,
  Economy,
  EconomyMap,
  ReserveLevel,
  SiteType,
} from "@elite-dangerous-sdk/data";
import {
  BodyFeature,
  BodyType,
  STELLAR_REMNANTS,
} from "@elite-dangerous-sdk/data";

export interface EconAudit {
  inf: Economy;
  delta: number;
  reason: string;
  before: number;
  after: number;
}

export interface BodyMap2 {
  name: string;
  num: number;
  distLS: number;
  parents: number[];
  type: BodyType;
  subType: string;
  features: BodyFeature[];
  radius: number;
  temp: number;
  gravity: number;
  surfacePrimary?: { type: { inf: Economy } };
  orbitalPrimary?: SiteMap2;
}

export interface SiteLinks2 {
  strongSites: SiteMap2[];
  weakSites: SiteMap2[];
}

export interface Rev {
  rev: number;
  name: string;
}

export interface NamedSave {
  name: string;
  saves: number[];
}

export interface Pop {
  pop: number;
  mpop: number;
}

export interface SysMap2 {
  v: number;
  rev: number;
  name: string;
  nickname?: string;
  notes?: string;
  id64: number;
  architect: string;
  pos: number[];
  reserveLevel: ReserveLevel;
  primaryPortId?: string;
  bodies: BodyMap2[];
  sites: SiteMap2[];
  slots: Record<number, number[]>;
  revs: Rev[];
  savedNames?: NamedSave[];
  pop?: Pop;
  open?: boolean;
  idxCalcLimit?: number;
}

export interface SiteMap2 {
  id: string;
  buildId: string;
  marketId: number;
  name: string;
  bodyNum: number;
  buildType: string;
  notes?: string;
  status: BuildStatus;
  type: SiteType;
  body?: BodyMap2;
  sys: SysMap2;
  economies?: EconomyMap;
  primaryEconomy?: Economy;
  economyAudit?: EconAudit[];
  intrinsic?: ConcreteEconomy[];
  bodyBuffed?: Set<ConcreteEconomy>;
  systemBuffed?: Set<ConcreteEconomy>;
  links?: SiteLinks2;
}

const useNewModel = true;

const matches = <T>(
  listRequired: T[],
  check: T | T[] | undefined,
  avoid?: T[],
) => {
  if (check) {
    const listCheck = Array.isArray(check) ? check : [check];
    return listRequired.some(
      (item) => listCheck.includes(item) && avoid?.includes(item) !== true,
    );
  }
  return false;
};

const adjust = (
  inf: Economy,
  delta: number,
  reason: string,
  map: EconomyMap,
  site: SiteMap2,
  source?: "body" | "sys",
) => {
  const key = inf as keyof EconomyMap;
  const before = map[key];
  let newValue = map[key] + delta;
  if (newValue <= 0) newValue = 0.1;
  map[key] = Math.round(newValue * 100) / 100;
  const after = map[key];
  site.economyAudit?.push({ inf, delta, reason, before, after });
  if (source === "body") {
    if (!site.bodyBuffed) site.bodyBuffed = new Set<ConcreteEconomy>();
    site.bodyBuffed.add(inf as ConcreteEconomy);
  }
  if (source === "sys") {
    if (!site.systemBuffed) site.systemBuffed = new Set<ConcreteEconomy>();
    site.systemBuffed.add(inf as ConcreteEconomy);
  }
};

const finishUp = (map: EconomyMap, site: SiteMap2) => {
  const primaryEconomy = (Object.keys(map) as ConcreteEconomy[]).sort(
    (a, b) => map[b] - map[a],
  )[0] as Economy;
  site.economies = map;
  site.primaryEconomy = primaryEconomy;
  return primaryEconomy;
};

const applySpecializedPort = (map: EconomyMap, site: SiteMap2) => {
  if (
    !site.type.fixed ||
    site.type.fixed === "none" ||
    site.type.fixed === "colony"
  ) {
    return;
  }
  if (site.type.orbital) {
    adjust(site.type.fixed, +1.0, "Specialised orbital economy", map, site);
  } else {
    adjust(site.type.fixed, +0.5, "Specialised surface economy", map, site);
  }
  if (useNewModel) {
    applyBuffs(map, site, false);
  }
};

export const applyBodyType = (map: EconomyMap, site: SiteMap2) => {
  if (site.type.inf !== "colony") {
    return;
  }
  const intrinsic = new Set<ConcreteEconomy>();

  switch (site.body?.type) {
    case BodyType.Un:
      break;
    case BodyType.BlackHole:
    case BodyType.NeutronStar:
    case BodyType.WhiteDwarf:
      adjust("hightech", +1, "Body type: BH/NS/WD", map, site);
      intrinsic.add("hightech");
      adjust("tourism", +1, "Body type: BH/NS/WD", map, site);
      intrinsic.add("tourism");
      break;
    case BodyType.Star:
      adjust("military", +1, "Body type: STAR", map, site);
      intrinsic.add("military");
      break;
    case BodyType.EarthLikeWorld:
      adjust("agriculture", +1, "Body type: ELW", map, site);
      intrinsic.add("agriculture");
      adjust("hightech", +1, "Body type: ELW", map, site);
      intrinsic.add("hightech");
      adjust("military", +1, "Body type: ELW", map, site);
      intrinsic.add("military");
      adjust("tourism", +1, "Body type: ELW", map, site);
      intrinsic.add("tourism");
      break;
    case BodyType.WaterWorld:
      adjust("agriculture", +1, "Body type: WW", map, site);
      intrinsic.add("agriculture");
      adjust("tourism", +1, "Body type: WW", map, site);
      intrinsic.add("tourism");
      break;
    case BodyType.AmmoniaWorld:
      adjust("hightech", +1, "Body type: AMMONIA", map, site);
      intrinsic.add("hightech");
      adjust("tourism", +1, "Body type: AMMONIA", map, site);
      intrinsic.add("tourism");
      break;
    case BodyType.GasGiant:
    case BodyType.WaterGiant:
      adjust("hightech", +1, "Body type: GG/WG", map, site);
      intrinsic.add("hightech");
      adjust("industrial", +1, "Body type: GG/WG", map, site);
      intrinsic.add("industrial");
      break;
    case BodyType.HighMetalContent:
    case BodyType.MetalRich:
      adjust("extraction", +1, "Body type: HMC", map, site);
      intrinsic.add("extraction");
      break;
    case BodyType.RockyIce:
      adjust("industrial", +1, "Body type: ROCKY-ICE", map, site);
      intrinsic.add("industrial");
      adjust("refinery", +1, "Body type: ROCKY-ICE", map, site);
      intrinsic.add("refinery");
      break;
    case BodyType.Rocky:
      adjust("refinery", +1, "Body type: ROCKY", map, site);
      intrinsic.add("refinery");
      break;
    case BodyType.Icy:
      adjust("industrial", +1, "Body type: ICY", map, site);
      intrinsic.add("industrial");
      break;
    case BodyType.AsteroidCluster:
      adjust("extraction", +1, "Body type: ASTEROID", map, site);
      intrinsic.add("extraction");
      break;
  }

  if (
    site.body &&
    matches([BodyType.Star, ...STELLAR_REMNANTS], site.body.type)
  ) {
    const hasAsteroids = site.sys.bodies.some(
      (b) =>
        b.type === BodyType.AsteroidCluster &&
        b.name.startsWith(site.body!.name),
    );
    if (hasAsteroids) {
      adjust("extraction", +1, "Star has: ASTEROIDs", map, site);
      intrinsic.add("extraction");
    }
  }

  if (site.body?.features.includes(BodyFeature.Rings)) {
    if (
      !matches([BodyType.HighMetalContent, BodyType.MetalRich], site.body.type)
    ) {
      adjust("extraction", +1, "Body has: RINGS", map, site, "body");
      intrinsic.add("extraction");
    }
  }

  if (site.body?.features.includes(BodyFeature.Bio)) {
    if (
      !matches([BodyType.EarthLikeWorld, BodyType.WaterWorld], site.body.type)
    ) {
      adjust("agriculture", +1, "Body has: BIO", map, site, "body");
      intrinsic.add("agriculture");
    }
    adjust("terraforming", +1, "Body has: BIO", map, site, "body");
    intrinsic.add("terraforming");
  }

  if (site.body?.features.includes(BodyFeature.Geo)) {
    if (
      !matches([BodyType.HighMetalContent, BodyType.MetalRich], site.body.type)
    ) {
      adjust("extraction", +1, "Body has: GEO", map, site, "body");
      intrinsic.add("extraction");
    }
    if (
      !matches(
        [
          BodyType.GasGiant,
          BodyType.WaterGiant,
          BodyType.RockyIce,
          BodyType.Icy,
        ],
        site.body.type,
      )
    ) {
      adjust("industrial", +1, "Body has: GEO", map, site, "body");
      intrinsic.add("industrial");
    }
  }

  site.intrinsic = Array.from(intrinsic);
};

export const applyStrongLinks2 = (
  map: EconomyMap,
  strongSites: SiteMap2[],
  site: SiteMap2,
  calcIds: string[],
  subLink?: Economy | "*",
) => {
  for (const s of strongSites) {
    if (s.type.inf === "none") continue;
    if (!calcIds.includes(s.id)) continue;

    const infSize = s.type.tier === 1 ? 0.4 : s.type.tier === 2 ? 0.8 : 1.2;
    const prefix = subLink ? "sub-strong link" : "Strong link";

    if (s.type.inf !== "colony") {
      if (s.type.inf in map) {
        adjust(
          s.type.inf,
          infSize,
          `Apply ${prefix} from: ${s.name} (T${s.type.tier})`,
          map,
          site,
        );
        applyStrongLinkBoost(s.type.inf, map, site, prefix);
      }
      if (useNewModel && s.links?.strongSites && !subLink) {
        applyStrongLinks2(map, s.links.strongSites, site, calcIds, s.type.inf);
      }
      continue;
    }

    if (!s.primaryEconomy) {
      continue;
    }

    for (const e in s.economies) {
      const ee = e as keyof EconomyMap;
      const val = s.economies[ee];
      if (s.intrinsic?.includes(ee)) {
        if (useNewModel) {
          const linkSize =
            s.type.tier === 1 ? 0.4 : s.type.tier === 2 ? 0.8 : 1.2;
          adjust(
            ee,
            linkSize,
            `Apply colony ${prefix} from: ${s.name} (T${s.type.tier})`,
            map,
            site,
          );
        } else {
          adjust(
            ee,
            val,
            `Apply colony ${prefix} from: ${s.name} (T${s.type.tier})`,
            map,
            site,
          );
        }
        applyStrongLinkBoost(ee, map, site, `${prefix}s`);
      }
    }

    if (useNewModel && s.links?.strongSites && !subLink) {
      applyStrongLinks2(map, s.links.strongSites, site, calcIds, "*");
    }
  }
};

export const applyStrongLinkBoost = (
  inf: Economy,
  map: EconomyMap,
  site: SiteMap2,
  reason: string,
) => {
  const reserveLevel = site.sys.reserveLevel ?? "pristine";

  switch (inf) {
    case "agriculture":
      if (
        matches(
          [BodyType.EarthLikeWorld, BodyType.WaterWorld],
          site.body?.type,
        ) ||
        matches([BodyFeature.Bio], site.body?.features)
      ) {
        adjust(
          inf,
          +0.4,
          `+ ${reason} boost: Body is ELW/WW or has BIO`,
          map,
          site,
          "body",
        );
      }
      if (
        matches([BodyType.Icy], site.body?.type) ||
        bodyIsTidalToStar(site.sys, site.body)
      ) {
        adjust(
          inf,
          -0.4,
          `- ${reason} boost: Body is ICY or has TIDAL`,
          map,
          site,
          "body",
        );
      }
      break;
    case "extraction":
      if (matches(["major", "pristine"], reserveLevel)) {
        adjust(
          inf,
          +0.4,
          `+ ${reason} boost: System reserveLevel is MAJOR or PRISTINE`,
          map,
          site,
          "sys",
        );
      } else if (matches(["depleted", "low"], reserveLevel)) {
        adjust(
          inf,
          -0.4,
          `- ${reason} boost: System reserveLevel is LOW or DEPLETED`,
          map,
          site,
          "sys",
        );
      }
      if (matches([BodyFeature.Volcanism], site.body?.features)) {
        adjust(
          inf,
          +0.4,
          `+ ${reason} boost: Body has VOLCANISM`,
          map,
          site,
          "body",
        );
      }
      return;
    case "hightech":
      if (
        matches(
          [BodyType.AmmoniaWorld, BodyType.EarthLikeWorld, BodyType.WaterWorld],
          site.body?.type,
        ) ||
        matches([BodyFeature.Bio, BodyFeature.Geo], site.body?.features)
      ) {
        adjust(
          inf,
          +0.4,
          `+ ${reason} boost: Body is AW/ELW/WW or has BIO/GEO`,
          map,
          site,
          "body",
        );
      }
      return;
    case "industrial":
    case "refinery":
      if (matches(["major", "pristine"], reserveLevel)) {
        adjust(
          inf,
          +0.4,
          `+ ${reason} boost: System reserveLevel is MAJOR or PRISTINE`,
          map,
          site,
          "sys",
        );
      } else if (matches(["depleted", "low"], reserveLevel)) {
        adjust(
          inf,
          -0.4,
          `- ${reason} boost: System reserveLevel is LOW or DEPLETED`,
          map,
          site,
          "sys",
        );
      }
      return;
    case "tourism":
      if (
        matches(
          [BodyType.AmmoniaWorld, BodyType.EarthLikeWorld, BodyType.WaterWorld],
          site.body?.type,
        ) ||
        matches([BodyFeature.Bio, BodyFeature.Geo], site.body?.features)
      ) {
        adjust(
          inf,
          +0.4,
          `+ ${reason} boost: Body is AW/ELW/WW or has BIO/GEO`,
          map,
          site,
          "body",
        );
      }
      if (site.sys.bodies.some((b) => STELLAR_REMNANTS.includes(b.type))) {
        adjust(
          inf,
          +0.4,
          `+ ${reason} boost: System has BH/NS/WD`,
          map,
          site,
          "sys",
        );
      }
      return;
    default:
      return;
  }
};

export const applyBuffs = (
  map: EconomyMap,
  site: SiteMap2,
  isSettlement: boolean,
) => {
  const reserveLevel = site.sys.reserveLevel ?? "pristine";

  const reserveSensitiveEconomies: (keyof EconomyMap)[] = [
    "industrial",
    "extraction",
    "refinery",
  ];
  for (const key of reserveSensitiveEconomies) {
    if (map[key] > 0) {
      if (reserveLevel === "major" || reserveLevel === "pristine") {
        adjust(
          key,
          +0.4,
          "Buff: reserveLevel MAJOR or PRISTINE",
          map,
          site,
          "sys",
        );
      } else if (
        (reserveLevel === "low" || reserveLevel === "depleted") &&
        !isSettlement
      ) {
        adjust(
          key,
          -0.4,
          "Buff: reserveLevel LOW or DEPLETED",
          map,
          site,
          "sys",
        );
      }
    }
  }

  if (map.agriculture > 0) {
    let buffed = false;
    if (
      matches([BodyFeature.Bio, BodyFeature.Terraformable], site.body?.features)
    ) {
      adjust(
        "agriculture",
        +0.4,
        "Buff: body has BIO or TERRAFORMABLE",
        map,
        site,
        "body",
      );
      buffed = true;
    } else if (
      matches([BodyType.EarthLikeWorld, BodyType.WaterWorld], site.body?.type)
    ) {
      adjust("agriculture", +0.4, "Buff: body is ELW or WW", map, site, "body");
    }
    if (
      (matches([BodyType.Icy], site.body?.type) ||
        bodyIsTidalToStar(site.sys, site.body)) &&
      (!isSettlement || buffed)
    ) {
      adjust(
        "agriculture",
        -0.4,
        "Buff: body is ICY or has TIDAL",
        map,
        site,
        "body",
      );
    }
  }

  if (map.hightech > 0) {
    if (isSettlement) {
      if (matches([BodyFeature.Bio], site.body?.features)) {
        adjust("hightech", +0.4, "Buff: body has BIO", map, site, "body");
      }
      if (matches([BodyFeature.Geo], site.body?.features)) {
        adjust("hightech", +0.4, "Buff: body has GEO", map, site, "body");
      }
      if (
        matches(
          [BodyType.EarthLikeWorld, BodyType.AmmoniaWorld],
          site.body?.type,
        )
      ) {
        adjust("hightech", +0.4, "Buff: body is ELW or AW", map, site, "body");
      }
    } else {
      if (matches([BodyFeature.Bio, BodyFeature.Geo], site.body?.features)) {
        adjust(
          "hightech",
          +0.4,
          "Buff: body has BIO or GEO",
          map,
          site,
          "body",
        );
      } else if (
        matches(
          [BodyType.EarthLikeWorld, BodyType.AmmoniaWorld],
          site.body?.type,
        )
      ) {
        adjust("hightech", +0.4, "Buff: body is ELW or AW", map, site, "body");
      }
    }
  }

  if (map.extraction > 0) {
    if (matches([BodyFeature.Volcanism], site.body?.features)) {
      adjust("extraction", +0.4, "Buff: body has VOLCANISM", map, site, "body");
    }
  }

  if (map.tourism > 0) {
    if (site.sys.bodies.some((b) => b.type === BodyType.BlackHole)) {
      adjust(
        "tourism",
        +0.4,
        "Buff: system has a Black Hole",
        map,
        site,
        "sys",
      );
    }
    if (site.sys.bodies.some((b) => b.type === BodyType.NeutronStar)) {
      adjust(
        "tourism",
        +0.4,
        "Buff: system has a Neutron Star",
        map,
        site,
        "sys",
      );
    }
    if (site.sys.bodies.some((b) => b.type === BodyType.WhiteDwarf)) {
      adjust(
        "tourism",
        +0.4,
        "Buff: system has a White Dwarf",
        map,
        site,
        "sys",
      );
    }
    if (!site.bodyBuffed?.has("tourism")) {
      if (matches([BodyFeature.Bio, BodyFeature.Geo], site.body?.features)) {
        adjust("tourism", +0.4, "Buff: body has BIO or GEO", map, site, "body");
      } else if (
        matches(
          [BodyType.EarthLikeWorld, BodyType.WaterWorld, BodyType.AmmoniaWorld],
          site.body?.type,
        )
      ) {
        adjust(
          "tourism",
          +0.4,
          "Buff: body is ELW or WW or AW",
          map,
          site,
          "body",
        );
      }
    }
  }
};

const applyWeakLinks = (map: EconomyMap, site: SiteMap2, calcIds: string[]) => {
  if (!site.links?.weakSites) return;
  for (const s of site.links.weakSites) {
    if (!calcIds.includes(s.id)) continue;
    const inf = s.type.inf;
    if (inf === "none") continue;
    if (inf === "colony") {
      if (!s.primaryEconomy) {
        continue;
      }
      for (const intrinsicInf of s.intrinsic ?? []) {
        adjust(
          intrinsicInf,
          +0.05,
          `Apply weak link from: ${s.name} (intrinsic)`,
          map,
          site,
        );
      }
      continue;
    }
    if (inf in map) {
      adjust(inf, +0.05, `Apply weak link from: ${s.name}`, map, site);
    }
  }
};

export const calculateColonyEconomies2 = (
  site: SiteMap2,
  calcIds: string[],
): Economy => {
  if (site.economies && site.primaryEconomy) {
    return site.primaryEconomy;
  }

  site.economyAudit = [];
  const map = {
    agriculture: 0,
    extraction: 0,
    hightech: 0,
    industrial: 0,
    military: 0,
    refinery: 0,
    terraforming: 0,
    tourism: 0,
    service: 0,
  } as EconomyMap;

  switch (site.type.buildClass) {
    case "hub":
    case "installation":
    case "unknown":
      return "none";
    case "settlement":
      adjust(
        site.type.inf,
        +1.0,
        "Odyssey settlement fixed economy",
        map,
        site,
      );
      applyBuffs(map, site, true);
      return finishUp(map, site);
    case "outpost":
    case "starport":
      break;
    default:
      return "none";
  }

  if (site.type.fixed) {
    applySpecializedPort(map, site);
  } else {
    if (
      useNewModel ||
      !site.type.orbital ||
      !site.body?.surfacePrimary ||
      site !== site.body?.orbitalPrimary
    ) {
      applyBodyType(map, site);
    }
    if (useNewModel) {
      applyBuffs(map, site, false);
    }
  }

  if (site.links) {
    applyStrongLinks2(map, site.links.strongSites, site, calcIds);
    if (!site.type.fixed) {
      if (!useNewModel) {
        applyBuffs(map, site, false);
      }
    }
    applyWeakLinks(map, site, calcIds);
  }

  return finishUp(map, site);
};

export const bodyIsTidalToStar = (
  sys: SysMap2,
  body: BodyMap2 | undefined,
  parents?: number[],
): boolean => {
  if (!parents) {
    parents = [...(body?.parents ?? [])];
  }
  if (
    !body?.features?.includes(BodyFeature.Tidal) &&
    body?.type !== BodyType.Barycentre
  ) {
    return false;
  }

  const parentNum = parents.shift();
  const parentBody = sys.bodies.find((b) => b.num === parentNum);
  if (!parentBody) {
    if (parentNum === 0) {
      return false;
    }
    return false;
  }

  if (matches([...STELLAR_REMNANTS, BodyType.Star], parentBody.type)) {
    return true;
  }

  if (parentBody.type === BodyType.Barycentre) {
    const children = sys.bodies.filter(
      (b) => parentBody && b.parents[0] === parentBody.num,
    );
    if (children.length > 1) {
      const idx = children.findIndex((b) => b.name === body!.name);
      if (idx < 2) {
        const other = idx === 0 ? children[1] : children[0];
        if (matches([...STELLAR_REMNANTS, BodyType.Star], other.type)) {
          return true;
        }
        const skipParentNum = parents[0];
        const skipParentBody = sys.bodies.find((b) => b.num === skipParentNum);
        if (skipParentBody?.type === BodyType.Star) {
          return true;
        }
      }
      if (
        idx > 1 &&
        matches([...STELLAR_REMNANTS, BodyType.Star], children[0].type) &&
        matches([...STELLAR_REMNANTS, BodyType.Star], children[1].type)
      ) {
        return true;
      }
      return false;
    }
  }

  return bodyIsTidalToStar(sys, parentBody, parents);
};
