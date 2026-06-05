/** Thargoid war state values from journal events (FSDJump/Location/Docked WarType field). */
export enum ThargoidWarState {
  None = 0,
  Alert = 20,
  Invasion = 30,
  Controlled = 40,
  Recovery = 50,
  Maelstrom = 70,
}

export const THARGOID_WAR_STATE_NAMES: Record<ThargoidWarState, string> = {
  [ThargoidWarState.None]: "None",
  [ThargoidWarState.Alert]: "Alert",
  [ThargoidWarState.Invasion]: "Invasion",
  [ThargoidWarState.Controlled]: "Controlled",
  [ThargoidWarState.Recovery]: "Recovery",
  [ThargoidWarState.Maelstrom]: "Maelstrom",
};

/** Union type of all 8 known Titan names. */
export type TitanName =
  | "Taranis"
  | "Indra"
  | "Leigong"
  | "Cocijo"
  | "Oya"
  | "Thor"
  | "Raijin"
  | "Hadad";

/** Information about a Titan (Thargoid Maelstrom). */
export interface TitanInfo {
  name: TitanName;
  systemName: string;
  systemAddress?: number;
  body: string;
  arrivalDistanceLs: number;
  coords?: [number, number, number];
  state: "active" | "defeated";
  defeatedDate?: string;
}

export const TITANS: Record<TitanName, TitanInfo> = {
  Taranis: {
    name: "Taranis",
    systemName: "Hyades Sector FB-N b7-6",
    body: "A 1",
    arrivalDistanceLs: 130,
    state: "defeated",
    defeatedDate: "3309-09-28",
  },
  Indra: {
    name: "Indra",
    systemName: "HIP 20567",
    body: "7",
    arrivalDistanceLs: 3330,
    state: "defeated",
    defeatedDate: "3309-10-05",
  },
  Leigong: {
    name: "Leigong",
    systemName: "HIP 8887",
    body: "A 4",
    arrivalDistanceLs: 2540,
    state: "defeated",
    defeatedDate: "3309-11-18",
  },
  Cocijo: {
    name: "Cocijo",
    systemName: "Col 285 Sector BA-P c6-18",
    body: "3",
    arrivalDistanceLs: 1300,
    state: "defeated",
    defeatedDate: "3310-12-18",
  },
  Oya: {
    name: "Oya",
    systemName: "Cephei Sector BV-Y b4",
    body: "B 1",
    arrivalDistanceLs: 5850,
    state: "defeated",
    defeatedDate: "3309-11-01",
  },
  Thor: {
    name: "Thor",
    systemName: "Col 285 Sector IG-O c6-5",
    body: "3",
    arrivalDistanceLs: 820,
    state: "defeated",
    defeatedDate: "3309-11-25",
  },
  Raijin: {
    name: "Raijin",
    systemName: "Pegasi Sector IH-U b3-3",
    body: "2",
    arrivalDistanceLs: 400,
    state: "defeated",
    defeatedDate: "3309-12-16",
  },
  Hadad: {
    name: "Hadad",
    systemName: "HIP 30377",
    body: "B 8",
    arrivalDistanceLs: 39230,
    state: "defeated",
    defeatedDate: "3309-12-30",
  },
};

export const TITAN_NAMES: TitanName[] = [
  "Taranis",
  "Indra",
  "Leigong",
  "Cocijo",
  "Oya",
  "Thor",
  "Raijin",
  "Hadad",
];

/** Look up a Titan by name. Returns undefined if not found. */
export function getTitanByName(name: string): TitanInfo | undefined {
  return TITANS[name as TitanName];
}

/** Look up a Titan by system name. Returns undefined if no Titan is in that system. */
export function getTitanBySystem(systemName: string): TitanInfo | undefined {
  for (const name of TITAN_NAMES) {
    if (TITANS[name].systemName === systemName) {
      return TITANS[name];
    }
  }
  return undefined;
}

/** Returns all 8 Titans. */
export function getAllTitans(): TitanInfo[] {
  return TITAN_NAMES.map((n) => TITANS[n]);
}

/** Returns only Titans that have been defeated. */
export function getDefeatedTitans(): TitanInfo[] {
  return getAllTitans().filter((t) => t.state === "defeated");
}

/** Parse a journal event's WarType field into a ThargoidWarState. Returns None for unknown/missing values. */
export function parseThargoidWarState(event: {
  WarType?: string;
}): ThargoidWarState {
  switch (event.WarType) {
    case "Alert":
      return ThargoidWarState.Alert;
    case "Invasion":
      return ThargoidWarState.Invasion;
    case "Controlled":
      return ThargoidWarState.Controlled;
    case "Recovery":
      return ThargoidWarState.Recovery;
    case "Maelstrom":
      return ThargoidWarState.Maelstrom;
    default:
      return ThargoidWarState.None;
  }
}
