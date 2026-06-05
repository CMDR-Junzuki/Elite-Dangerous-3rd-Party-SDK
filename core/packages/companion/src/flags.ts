/**
 * Status.json Flags (Flags field) - bitflag definitions
 * These match the constants used in EDMarketConnector and the game client
 */
export const Flags = {
  Docked: 1 << 0,
  Landed: 1 << 1,
  LandingGearDown: 1 << 2,
  ShieldsUp: 1 << 3,
  Supercruise: 1 << 4,
  FlightAssistOff: 1 << 5,
  HardpointsDeployed: 1 << 6,
  InWing: 1 << 7,
  LightsOn: 1 << 8,
  CargoScoopDeployed: 1 << 9,
  SilentRunning: 1 << 10,
  ScoopingFuel: 1 << 11,
  SrvHandbrake: 1 << 12,
  SrvTurret: 1 << 13,
  SrvTurretRetracted: 1 << 14,
  SrvDriveAssist: 1 << 15,
  FsdMassLocked: 1 << 16,
  FsdCharging: 1 << 17,
  FsdCooldown: 1 << 18,
  LowFuel: 1 << 19,
  OverHeating: 1 << 20,
  HasLatentMeteorite: 1 << 21,
  IsInDangerousWeather: 1 << 22,
  IsInNoFireZone: 1 << 23,
  IsInNoFireZoneTrespass: 1 << 24,
  IsInConflictZone: 1 << 25,
  IsInWingNoFireZone: 1 << 26,
  MasslockEngaged: 1 << 27,
  FsdJumping: 1 << 28,
  SrvUnderShip: 1 << 29,
} as const;

/** Status.json Flags2 field */
export const Flags2 = {
  OnFoot: 1 << 0,
  InTaxi: 1 << 1,
  InMultiCrew: 1 << 2,
  OnFootInStation: 1 << 3,
  InCrewAssistedVehicle: 1 << 4,
  InWeaponsView: 1 << 5,
  InStationOrSettlement: 1 << 6,
  InSocialZone: 1 << 7,
  OnFootNoFireZone: 1 << 8,
  OnFootNoFireZoneTrespass: 1 << 9,
  OnFootUsingScanner: 1 << 10,
  OnFootInConflictZone: 1 << 11,
  InTaxiOrDropship: 1 << 12,
  InMultiCrewVehicle: 1 << 13,
  InMegaShipInstallation: 1 << 14,
  InFighter: 1 << 15,
  InDropship: 1 << 16,
  InApex: 1 << 17,
  OnMissionBoard: 1 << 18,
  InCqc: 1 << 19,
} as const;

/** Status.json GuiFocus field values */
export const GuiFocus = {
  NoFocus: 0,
  InternalPanel: 1,
  ExternalPanel: 2,
  CommsPanel: 3,
  RolePanel: 4,
  StationServices: 5,
  GalaxyMap: 6,
  SystemMap: 7,
  Orrery: 8,
  Fss: 9,
  Saa: 10,
  Codex: 11,
} as const;

/** Legal status values (from journal/LoadGame etc) */
export const LegalStatus = {
  Clean: "Clean",
  IllegalCargo: "IllegalCargo",
  Speeding: "Speeding",
  Wanted: "Wanted",
  Hostile: "Hostile",
  Enemy: "Enemy",
  Unknown: "Unknown",
  Hunted: "Hunted",
} as const;

/** Module info flags from outfitting/market responses */
export type ModuleFlag = "E" | "D" | "C" | "B" | "A";
