import type {
  BuildStatus,
  ReserveLevel,
  SiteType,
  SysEffects,
  SysUnlocks,
} from "@elite-dangerous-sdk/data";
import {
  BodyFeature,
  BodyType,
  getSiteType,
  STELLAR_REMNANTS,
} from "@elite-dangerous-sdk/data";
import type {
  BodyMap2 as EconBodyMap2,
  SiteMap2 as EconSiteMap2,
  SysMap2 as EconSysMap2,
  NamedSave,
  Pop,
  Rev,
} from "./colonization-economy.js";
import { calculateColonyEconomies2 } from "./colonization-economy.js";

export interface RawBod {
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
}

export interface RawSite {
  id: string;
  buildId: string;
  marketId: number;
  name: string;
  bodyNum: number;
  buildType: string;
  notes?: string;
  status: BuildStatus;
}

export interface RawSys {
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
  bodies: RawBod[];
  sites: RawSite[];
  slots: Record<number, number[]>;
  revs: Rev[];
  savedNames?: NamedSave[];
  pop?: Pop;
  open?: boolean;
  idxCalcLimit?: number;
}

export interface TierPoints {
  tier2: number;
  tier3: number;
}

interface BodyMap2 extends EconBodyMap2 {
  surfacePrimary?: SiteMap2;
  orbitalPrimary?: SiteMap2;
  sites: SiteMap2[];
  surface: SiteMap2[];
  orbital: SiteMap2[];
}

interface SiteMap2 extends EconSiteMap2 {
  original: RawSite;
  body?: BodyMap2;
  parentLink?: SiteMap2;
  calcNeeds?: { tier: number; count: number };
}

interface SysMap2 extends EconSysMap2 {
  bodies: BodyMap2[];
  sites: SiteMap2[];
  bodyMap: Record<string, BodyMap2>;
  siteMaps: SiteMap2[];
  tierPoints: TierPoints;
  economies: Record<string, number>;
  sumEffects: SysEffects;
  systemScore: number;
  sysUnlocks: Record<SysUnlocks, boolean>;
  taxCount: number;
  calcIds: string[];
}

export interface SiteTypeValidity {
  isValid: boolean;
  msg?: string;
  unlocks?: string[];
}

export interface SysSnapshot {
  architect: string;
  id64: number;
  v: number;
  name: string;
  pos: number[];
  tierPoints: TierPoints;
  sumEffects: SysEffects;
  sites: RawSite[];
  pop: Pop | undefined;
  stale: boolean;
  score: number;
  fav: boolean | undefined;
}

export const mapSysUnlocks: Record<
  SysUnlocks,
  { icon: string; title: string; needTypes: string[]; needs: string }
> = {
  SettlementTourist: {
    icon: "Suitcase",
    title: "Tourist Settlements",
    needTypes: ["hermes", "angelia", "eirene"],
    needs: "A satellite",
  },
  InstallationTourist: {
    icon: "Cocktails",
    title: "Tourist Installations",
    needTypes: ["aergia", "comus", "gelos", "fufluns"],
    needs: "A tourist settlement",
  },
  InstallationScientific: {
    icon: "NetworkTower",
    title: "Scientific Installations",
    needTypes: ["pheobe", "asteria", "caerus", "chronos"],
    needs: "A bio settlement",
  },
  InstallationMilitary: {
    icon: "Shield",
    title: "Military Installations",
    needTypes: ["ioke", "bellona", "enyo", "polemos", "minerva"],
    needs: "A military settlement",
  },
  HubMilitary: {
    icon: "ReportHacked",
    title: "Military Hub",
    needTypes: ["vacuna", "alastor"],
    needs: "A military installation",
  },
  HubCivilian: {
    icon: "Home",
    title: "Civilian Hub",
    needTypes: ["consus", "picumnus", "annona", "ceres", "fornax"],
    needs: "An agricultural settlement",
  },
  HubExploration: {
    icon: "Camera",
    title: "Exploration Hub",
    needTypes: ["pistis", "soter", "aletheia"],
    needs: "A comms installation",
  },
  HubOutpost: {
    icon: "HardDriveGroup",
    title: "Outpost Hub",
    needTypes: ["demeter"],
    needs: "A space farm",
  },
  HubIndustrial: {
    icon: "Manufacturing",
    title: "Industrial Hub",
    needTypes: ["euthenia", "phorcys"],
    needs: "A mining/industrial installation",
  },
  HubExtraction: {
    icon: "Diamond",
    title: "Extraction Hub",
    needTypes: ["ourea", "mantus", "orcus", "aerecura", "erebus"],
    needs: "An extraction settlement",
  },
  ShipyardT1: {
    icon: "Airplane",
    title: "Shipyard at T1 surface ports",
    needTypes: ["eunostus", "molae", "tellus_i", "vacuna", "alastor"],
    needs: "An industrial hub or military installation",
  },
  OutfittingNonMilOutpost: {
    icon: "Dataflows",
    title: "Outfitting at non-Military Outposts",
    needTypes: ["janus", "vacuna", "alastor"],
    needs: "A high-tech hub or military installation",
  },
  OutfittingT1Surface: {
    icon: "FlowChart",
    title: "Outfitting at non-Industrial T1 surface ports",
    needTypes: ["janus", "vacuna", "alastor"],
    needs: "A high-tech hub or military installation",
  },
  VistaGenomics: {
    icon: "ClassroomLogo",
    title: "Vista Genomics at T1 Surface or T2 orbital ports",
    needTypes: ["asclepius", "eupraxia", "athena", "caelus"],
    needs: "A scientific hub or medical installation",
  },
  UniversalCartographics: {
    icon: "HomeGroup",
    title: "Universal Cartographics at T1 Surface or T2 orbital ports",
    needTypes: ["astraeus", "coeus", "dione", "dodona", "tellus_e"],
    needs: "An exploration hub or research installation",
  },
  MarketOutposts: {
    icon: "Shop",
    title: "Commodities at Pirate, Scientific or Military Outposts",
    needTypes: ["bacchus", "dionysus", "hedone", "opora", "pasithea", "io"],
    needs: "An outpost hub, tourist installation or space bar",
  },
  CrewLounge: {
    icon: "People",
    title: "Crew Lounge at non-Civilian T1 ports",
    needTypes: ["bacchus", "dionysus"],
    needs: "A space bar",
  },
};

const starsAndClusters = [
  ...STELLAR_REMNANTS,
  BodyType.AsteroidCluster,
  BodyType.Star,
];

const getUnknownBody = (): BodyMap2 => {
  return {
    name: "",
    num: -1,
    distLS: -1,
    features: [BodyFeature.Landable],
    parents: [],
    subType: "",
    type: BodyType.Un,
    radius: -1,
    temp: -1,
    gravity: -1,
    sites: [],
    surface: [],
    orbital: [],
  };
};

const findSiblingSites = (
  bods: BodyMap2[],
  bodyMap: Record<string, BodyMap2>,
  body: BodyMap2,
  onlyOrbitals: boolean,
) => {
  if (!starsAndClusters.includes(body.type)) {
    return [...(onlyOrbitals ? body.orbital : body.sites)];
  }

  const parent =
    body.type !== BodyType.AsteroidCluster
      ? body
      : bods.find((b) => b.num === body.parents[0]);
  if (!parent) return [];

  const bodies = [
    parent,
    ...bods.filter(
      (b) => b.type === BodyType.AsteroidCluster && parent.num === b.parents[0],
    ),
  ];
  const siblingSites = bodies.flatMap((x) =>
    x.name in bodyMap
      ? onlyOrbitals
        ? bodyMap[x.name].orbital
        : bodyMap[x.name].sites
      : [],
  );
  return siblingSites;
};

const getBodyPrimaryPort = (
  sites: SiteMap2[],
  calcIds: string[],
): SiteMap2 | undefined => {
  if (sites.length === 0) return undefined;
  if (calcIds.length) {
    sites = sites.filter((s) => calcIds.includes(s.id));
  }

  const t3s = sites.filter(
    (s) =>
      s.type.tier === 3 &&
      (s.type.buildClass === "starport" || s.type.buildClass === "outpost"),
  );
  if (t3s.length > 0) return t3s[0];

  const t2s = sites.filter(
    (s) =>
      s.type.tier === 2 &&
      (s.type.buildClass === "starport" || s.type.buildClass === "outpost"),
  );
  if (t2s.length > 0) return t2s[0];

  const t1s = sites.filter(
    (s) =>
      s.type.tier === 1 &&
      (s.type.buildClass === "starport" || s.type.buildClass === "outpost"),
  );
  if (t1s.length > 0) return t1s[0];

  return undefined;
};

const calcSiteLinks = (
  bods: BodyMap2[],
  bodyMap: Record<string, BodyMap2>,
  body: BodyMap2,
  primarySite: SiteMap2,
  calcIds: string[],
) => {
  const siblingSites = findSiblingSites(bods, bodyMap, body, false);

  const strongSites = siblingSites
    .filter((s) => {
      if (
        s.parentLink ||
        s.type.inf === "none" ||
        s === primarySite ||
        !calcIds.includes(s.id)
      )
        return false;
      if (
        !primarySite.type.orbital &&
        s.type.orbital &&
        (s.type.buildClass === "outpost" || s.type.buildClass === "starport")
      )
        return false;
      if (s.type.orbital && !primarySite.type.orbital && body.orbitalPrimary)
        return false;
      s.parentLink = primarySite;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const weakSites = Object.values(bodyMap)
    .filter((b) => b !== body)
    .flatMap((b) => b.sites)
    .filter(
      (s) =>
        !siblingSites.includes(s) &&
        s.type.inf !== "none" &&
        s !== s.body?.orbitalPrimary &&
        s !== s.body?.surfacePrimary &&
        calcIds.includes(s.id),
    );

  if (!primarySite.links && (strongSites.length > 0 || weakSites.length > 0)) {
    primarySite.links = { strongSites, weakSites };
  }
};

const calcSiteEconomies = (site: SiteMap2, calcIds: string[]) => {
  if (!site.links) return;

  for (const s of site.links.strongSites) {
    const inf = s.type.inf;
    if (inf === "none") continue;
    if (inf === "colony") {
      calculateColonyEconomies2(s, calcIds);
    }
  }

  for (const s of site.links.weakSites) {
    const inf = s.type.inf;
    if (inf === "none") continue;
    if (inf === "colony") {
      calculateColonyEconomies2(s, calcIds);
    }
  }
};

const calcBodyLinks = (
  bods: BodyMap2[],
  bodyMap: Record<string, BodyMap2>,
  body: BodyMap2,
  calcIds: string[],
) => {
  if (!body.surfacePrimary && !body.orbitalPrimary) return;

  if (body.surfacePrimary) {
    calcSiteLinks(bods, bodyMap, body, body.surfacePrimary, calcIds);
  }
  if (body.orbitalPrimary) {
    calcSiteLinks(bods, bodyMap, body, body.orbitalPrimary, calcIds);
  }

  for (const site of body.sites) {
    calcSiteEconomies(site, calcIds);
  }
};

const initializeSysMap = (
  sys: RawSys,
  useIncomplete: boolean,
  idxLimit: number,
) => {
  const siteMaps: SiteMap2[] = [];
  let systemScore = 0;

  const calcIds = useIncomplete
    ? sys.sites
        .filter((s, i) => i < idxLimit && s.status !== "demolish")
        .map((s) => s.id)
    : sys.sites.filter((s) => s.status === "complete").map((s) => s.id);

  if (!sys.sites) {
    sys.sites = [];
  }

  const allBodies: BodyMap2[] = sys.bodies.map((b) => ({
    ...b,
    sites: [],
    surface: [],
    orbital: [],
  }));
  const bodyMap: Record<string, BodyMap2> = {};
  for (const body of allBodies) {
    bodyMap[body.name] = body;
  }

  for (const s of sys.sites) {
    const bodyNum = s.bodyNum ?? -1;
    const rawBody =
      allBodies.find((b) => b.num === bodyNum) ?? getUnknownBody();
    let body = bodyMap[rawBody.name];
    if (!body) {
      body = rawBody;
      bodyMap[rawBody.name] = body;
    }

    const site: SiteMap2 = {
      ...s,
      original: s,
      sys: sys as unknown as SysMap2,
      body: body as BodyMap2,
      type: getSiteType(s.buildType)!,
    };
    siteMaps.push(site);
    body.sites.push(site);

    if (site.status !== "demolish") {
      if (site.type.orbital) {
        body.orbital.push(site);
      } else {
        body.surface.push(site);
      }
    }

    if (calcIds.includes(site.id)) {
      systemScore += site.type.score ?? 0;
    }
  }

  return {
    ...sys,
    bodies: allBodies,
    sites: siteMaps,
    siteMaps,
    bodyMap,
    calcIds,
    systemScore,
  } as SysMap2;
};

const sumSystemEffects = (
  siteMaps: SiteMap2[],
  calcIds: string[],
  _buffNerf?: boolean,
) => {
  const mapEconomies: Record<string, number> = {};
  const sumEffects: SysEffects = {};

  for (const site of siteMaps) {
    if (site.status === "demolish") continue;
    if (!calcIds.includes(site.id)) continue;

    if (["settlement", "outpost", "starport"].includes(site.type.buildClass)) {
      calculateColonyEconomies2(site, calcIds);
    }
    const inf = site.primaryEconomy ?? site.type.inf;

    if (inf !== "none") {
      mapEconomies[inf] = (mapEconomies[inf] ?? 0) + 1;
    }

    for (const key of [
      "pop",
      "mpop",
      "sec",
      "tech",
      "wealth",
      "sol",
      "dev",
    ] as (keyof SysEffects)[]) {
      const effect = site.type.effects[key] ?? 0;
      if (effect === 0) continue;
      sumEffects[key] = (sumEffects[key] ?? 0) + effect;
    }
  }

  const sorted = Object.keys(mapEconomies).sort((a, b) => {
    if (mapEconomies[b] === mapEconomies[a]) return b.localeCompare(a);
    return mapEconomies[b] - mapEconomies[a];
  });

  const economies: Record<string, number> = {};
  for (const key of sorted) {
    economies[key] = mapEconomies[key];
  }

  for (const k in sumEffects) {
    const v = sumEffects[k as keyof SysEffects]!;
    sumEffects[k as keyof SysEffects] = parseFloat((v * 1000).toFixed()) / 1000;
  }

  return { economies, sumEffects };
};

export const buildSystemModel2 = (
  sys: RawSys,
  useIncomplete: boolean,
  buffNerf?: boolean,
): SysMap2 => {
  const idxLimit = sys.idxCalcLimit ?? sys.sites.length;

  sys.primaryPortId = sys.sites?.length > 0 ? sys.sites[0].id : undefined;
  sys = { ...sys };
  sys.sites = sys.sites.map((s) => {
    return { ...s };
  });

  const sysMap = initializeSysMap(sys, useIncomplete, idxLimit);

  const allBodies = Object.values(sysMap.bodyMap);
  for (const body of allBodies) {
    body.surfacePrimary = getBodyPrimaryPort(body.surface, sysMap.calcIds);
    const siblingSites = findSiblingSites(
      sysMap.bodies,
      sysMap.bodyMap,
      body,
      !!body.surfacePrimary,
    );
    body.orbitalPrimary = getBodyPrimaryPort(siblingSites, sysMap.calcIds);
  }

  for (const body of allBodies) {
    calcBodyLinks(sysMap.bodies, sysMap.bodyMap, body, sysMap.calcIds);
  }

  const { tierPoints, taxCount } = sumTierPoints(
    sysMap.siteMaps,
    sysMap.calcIds,
    !useIncomplete,
  );
  const economiesSumEffects = sumSystemEffects(
    sysMap.siteMaps,
    sysMap.calcIds,
    buffNerf,
  );

  const sysUnlocks = {} as Record<SysUnlocks, boolean>;
  for (const key of Object.keys(mapSysUnlocks) as SysUnlocks[]) {
    const unlocked = sysMap.sites.some(
      (s) =>
        sysMap.calcIds.includes(s.id) &&
        mapSysUnlocks[key].needTypes.some((n) => s.buildType?.startsWith(n)),
    );
    sysUnlocks[key] = unlocked;
  }

  const finalMap = Object.assign(sys, {
    ...sysMap,
    ...economiesSumEffects,
    tierPoints,
    taxCount,
    sysUnlocks,
  });

  return finalMap as SysMap2;
};

export const sumTierPoints = (
  siteMaps: SiteMap2[],
  calcIds: string[],
  incBuildStarted?: boolean,
) => {
  const tierPoints: TierPoints = { tier2: 0, tier3: 0 };
  const primaryPortId = siteMaps?.[0]?.id;
  let taxCount = -2;

  for (const site of siteMaps) {
    if (site.status === "demolish") continue;
    if (incBuildStarted) {
      if (site.status === "plan") continue;
    } else if (!calcIds.includes(site.id)) continue;

    if (
      site.id !== primaryPortId &&
      site.type.needs.count > 0 &&
      site.type.needs.tier > 1
    ) {
      let needCount = site.type.needs.count;
      if (site.type.buildClass === "starport" && site.type.tier > 1) {
        taxCount++;
        needCount = applyTax(site.type.needs.tier, needCount, taxCount);
      }
      const tierName = site.type.needs.tier === 2 ? "tier2" : "tier3";
      tierPoints[tierName] -= needCount;
      site.calcNeeds = { tier: site.type.needs.tier, count: needCount };
    }

    if (!calcIds.includes(site.id)) continue;

    if (site.type.gives.count > 0 && site.type.gives.tier > 1) {
      const tierName = site.type.gives.tier === 2 ? "tier2" : "tier3";
      tierPoints[tierName] += site.type.gives.count;
    }
  }

  return { tierPoints, taxCount };
};

export const applyTax = (tier: number, cost: number, taxCount: number) => {
  if (taxCount > 0) {
    if (tier === 3) {
      cost += cost * taxCount;
    } else {
      cost += Math.trunc(cost * 0.75 * taxCount);
    }
  }
  return cost;
};

export const getPreReqNeeded = (type: SiteType): string[] => {
  switch (type.preReq) {
    case "satellite":
      return ["hermes", "angelia", "eirene"];
    case "comms":
      return ["pistis", "soter", "aletheia"];
    case "settlementAgr":
      return ["consus", "picumnus", "annona", "ceres", "fornax"];
    case "installationAgr":
      return ["demeter"];
    case "installationMil":
      return ["vacuna", "alastor"];
    case "outpostMining":
      return ["euthenia", "phorcys"];
    case "relay":
      return ["enodia", "ichnaea"];
    case "settlementBio":
      return ["pheobe", "asteria", "caerus", "chronos"];
    case "settlementTourist":
      return ["aergia", "comus", "gelos", "fufluns"];
    case "settlementMilitary":
      return ["ioke", "bellona", "enyo", "polemos", "minerva"];
    case "settlementExtraction":
      return ["ourea", "mantus", "orcus", "aerecura", "erebus"];
    default:
      return [];
  }
};

export const hasPreReq2 = (
  siteMaps: SiteMap2[] | undefined,
  type: SiteType,
) => {
  if (!siteMaps) return true;
  const neededBuildTypes = getPreReqNeeded(type);
  return siteMaps.some(
    (s) =>
      s.status !== "demolish" &&
      neededBuildTypes.some((n) => s.buildType?.startsWith(n)),
  );
};

export const isTypeValid2 = (
  sysMap: SysMap2 | undefined,
  type: SiteType | undefined,
  priorType: SiteType | undefined,
): SiteTypeValidity => {
  if (!type) return { isValid: true };

  if (sysMap) {
    let neededT2 = sysMap.tierPoints.tier2;
    let neededT3 = sysMap.tierPoints.tier3;
    if (priorType) {
      if (priorType.needs.tier === 2) neededT2 += priorType.needs.count;
      if (priorType.needs.tier === 3) neededT3 += priorType.needs.count;
    }

    if (type.needs.tier === 2 && neededT2 < type.needs.count) {
      return { isValid: false, msg: "Not enough Tier 2 points" };
    }
    if (type.needs.tier === 3 && neededT3 < type.needs.count) {
      return { isValid: false, msg: "Not enough Tier 3 points" };
    }
  }

  if (type.preReq) {
    const isValid = hasPreReq2(sysMap?.siteMaps, type);
    return {
      isValid,
      msg: isValid ? undefined : `Requires ${type.preReq}`,
      unlocks: type.unlocks,
    };
  }

  if (type.unlocks) {
    return { isValid: true, unlocks: type.unlocks };
  }

  return { isValid: true };
};

export const predictSurfaceSlots = (body: {
  type: BodyType;
  features: BodyFeature[];
  temp: number;
  gravity: number;
  radius: number;
  subType: string;
}): number => {
  if (body.type === BodyType.Un) return -1;

  const features = new Set(body.features);
  if (
    body.temp > 700 ||
    body.gravity > 2.7 ||
    !features.has(BodyFeature.Landable)
  )
    return 0;

  let predictedSlots =
    body.radius < 1500
      ? 1
      : body.radius < 3750
        ? 2
        : body.radius < 6000
          ? 3
          : 4;

  if (body.subType === "High metal content world") predictedSlots++;
  if (features.has(BodyFeature.Terraformable)) predictedSlots++;
  if (features.has(BodyFeature.Volcanism) || features.has(BodyFeature.Geo))
    predictedSlots++;
  if (features.has(BodyFeature.Atmosphere)) predictedSlots += 2;

  return Math.min(predictedSlots, 7);
};

export const getSnapshot = (newSys: RawSys, isFav: boolean | undefined) => {
  const snapshotFull = buildSystemModel2(newSys, false, true);
  const snapshot: SysSnapshot = {
    architect: newSys.architect,
    id64: newSys.id64,
    v: newSys.v,
    name: newSys.name,
    pos: newSys.pos,
    tierPoints: snapshotFull.tierPoints,
    sumEffects: snapshotFull.sumEffects,
    sites: newSys.sites,
    pop: newSys.pop,
    stale: false,
    score: snapshotFull.systemScore ?? -1,
    fav: isFav,
  };
  return snapshot;
};
