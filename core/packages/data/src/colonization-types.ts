export type Economy =
  | "agriculture"
  | "service"
  | "extraction"
  | "hightech"
  | "industrial"
  | "military"
  | "none"
  | "tourism"
  | "refinery"
  | "colony"
  | "terraforming";

export type ConcreteEconomy = Exclude<Economy, "none" | "colony">;

export type EconomyMap = Record<ConcreteEconomy, number>;

export type BuildClass =
  | "starport"
  | "installation"
  | "outpost"
  | "settlement"
  | "hub"
  | "unknown";

export type PadSize = "none" | "small" | "medium" | "large";

export type PreReq =
  | "satellite"
  | "comms"
  | "settlementAgr"
  | "installationAgr"
  | "installationMil"
  | "outpostMining"
  | "relay"
  | "settlementBio"
  | "settlementTourist"
  | "settlementMilitary"
  | "settlementExtraction";

export interface SysEffects {
  pop?: number;
  mpop?: number;
  sec?: number;
  tech?: number;
  wealth?: number;
  sol?: number;
  dev?: number;
}

export const SYS_EFFECT_KEYS: (keyof SysEffects)[] = [
  "pop",
  "mpop",
  "sec",
  "tech",
  "wealth",
  "sol",
  "dev",
];

export interface SiteType {
  displayName: string;
  displayName2: string;
  subTypes: string[];
  altTypes?: string[];
  haul: number;
  buildClass: BuildClass;
  tier: number;
  padSize: PadSize;
  padMap?: Record<string, PadSize>;
  orbital: boolean;
  inf: Economy;
  fixed?: Economy;
  needs: { tier: number; count: number };
  gives: { tier: number; count: number };
  effects: SysEffects;
  preReq?: PreReq;
  unlocks?: string[];
  score?: number;
}

export type ReserveLevel = "depleted" | "low" | "common" | "major" | "pristine";

export enum BodyType {
  Un = "un",
  BlackHole = "bh",
  NeutronStar = "ns",
  WhiteDwarf = "wd",
  Star = "st",
  AmmoniaWorld = "aw",
  EarthLikeWorld = "elw",
  GasGiant = "gg",
  HighMetalContent = "hmc",
  Icy = "ib",
  MetalRich = "mrb",
  Rocky = "rb",
  RockyIce = "ri",
  WaterGiant = "wg",
  WaterWorld = "ww",
  AsteroidCluster = "ac",
  Barycentre = "bc",
}

export enum BodyFeature {
  Bio = "bio",
  Geo = "geo",
  Volcanism = "volcanism",
  Rings = "rings",
  Terraformable = "terraformable",
  Tidal = "tidal",
  Landable = "landable",
  Atmosphere = "atmosphere",
}

export type BuildStatus = "plan" | "build" | "complete" | "demolish";

export type SysUnlocks =
  | "SettlementTourist"
  | "InstallationTourist"
  | "InstallationScientific"
  | "InstallationMilitary"
  | "HubCivilian"
  | "HubMilitary"
  | "HubExploration"
  | "HubOutpost"
  | "HubIndustrial"
  | "HubExtraction"
  | "ShipyardT1"
  | "OutfittingNonMilOutpost"
  | "OutfittingT1Surface"
  | "VistaGenomics"
  | "UniversalCartographics"
  | "MarketOutposts"
  | "CrewLounge";

export const STELLAR_REMNANTS = [
  BodyType.BlackHole,
  BodyType.NeutronStar,
  BodyType.WhiteDwarf,
];
