import type {
  CarrierBuy,
  CarrierFinance,
  CarrierJump,
  CarrierNameChange,
  CarrierStats,
  Docked,
  EngineerCraft,
  FSDJump,
  JournalEvent,
  Liftoff,
  LoadGame,
  Location,
  MaterialCollected,
  MaterialDiscarded,
  MaterialTrade,
  MissionAbandoned,
  MissionAccepted,
  MissionCompleted,
  MissionFailed,
  MissionRedirected,
  ModuleInfo,
  NavRoute,
  NavRouteClear,
  Progress,
  Promotion,
  Rank,
  ShipLocker,
  SquadronStartup,
  StartJump,
  SupercruiseEntry,
  SupercruiseExit,
  Synthesis,
  Touchdown,
  Undocked,
} from "./types.js";

export interface MaterialEntry {
  name: string;
  count: number;
}

export interface MissionState {
  missionID: number;
  name: string;
  faction: string;
  expiry: string;
  reward: number;
  destinationSystem: string;
  destinationStation: string;
  passengerMission: boolean;
  wing: boolean;
  failed: boolean;
}

export interface ShipModuleState {
  slot: string;
  item: string;
  priority: number;
  health: number;
  value: number;
  engineering: {
    engineer: string;
    blueprintName: string;
    level: number;
    quality: number;
    experimentalEffect: string;
  } | null;
}

export interface FactionStateInfo {
  name: string;
  factionState: string;
  influence: number;
  allegiance: string;
  government: string;
  happiness?: string;
  myReputation?: number;
  squadronFaction?: boolean;
  activeStates?: { state: string; trend?: number }[];
  pendingStates?: { state: string; trend?: number }[];
  recoveringStates?: { state: string; trend?: number }[];
}

export interface ConflictInfo {
  warType: string;
  status: string;
  faction1: { name: string; stake: string; wonDays: number };
  faction2: { name: string; stake: string; wonDays: number };
}

export interface SquadronInfo {
  name: string;
  rank: string;
  alignedPower: string;
  homeSystem: string;
  factionName: string;
  powerplayState: string;
  id: number;
  currentRating: number;
  ratings: { name: string; rank: number }[];
}

export interface CommanderState {
  commander: {
    name: string;
    fid: string;
    credits: number;
    loan: number;
    ranks: {
      combat: number;
      trade: number;
      explore: number;
      cqc: number;
      empire: number;
      federation: number;
      soldier: number;
      exobiologist: number;
    };
    progress: {
      combat: number;
      trade: number;
      explore: number;
      cqc: number;
      empire: number;
      federation: number;
      soldier: number;
      exobiologist: number;
    };
  };
  location: {
    system: string;
    systemAddress: number;
    starPos: [number, number, number];
    body: string;
    bodyType: string;
    bodyID: number;
    station: string;
    stationType: string;
    marketID: number;
    docked: boolean;
    latitude: number;
    longitude: number;
    altitude: number;
    heading: number;
    planetRadius: number;
    onPlanet: boolean;
    inSupercruise: boolean;
    jumping: boolean;
    systemAllegiance: string;
    systemEconomy: string;
    systemGovernment: string;
    systemSecurity: string;
    population: number;
    powerplayState: string;
    powers: string[];
    factions: FactionStateInfo[];
    conflicts: ConflictInfo[];
  };
  ship: {
    current: string;
    shipID: number;
    name: string;
    ident: string;
    fuelLevel: number;
    fuelCapacity: number;
    hullHealth: number;
    unladenMass: number;
    maxJumpRange: number;
    modules: ShipModuleState[];
  };
  fleet: {
    ship: string;
    shipID: number;
    shipName: string;
    shipIdent: string;
  }[];
  materials: {
    raw: MaterialEntry[];
    manufactured: MaterialEntry[];
    encoded: MaterialEntry[];
    items: MaterialEntry[];
    components: MaterialEntry[];
    consumables: MaterialEntry[];
    data: MaterialEntry[];
  };
  missions: MissionState[];
  carrier: {
    id: string;
    callsign: string;
    name: string;
    fuelLevel: number;
    jumpRangeCurr: number;
    jumpRangeMax: number;
    dockingAccess: string;
  } | null;
  navRoute: {
    starSystem: string;
    systemAddress: number;
    starPos: [number, number, number];
  }[];
  flags: {
    odyssey: boolean;
    horizons: boolean;
    gameMode: string;
    group: string;
  };
  squadron: SquadronInfo;
}

function emptyState(): CommanderState {
  return {
    commander: {
      name: "",
      fid: "",
      credits: 0,
      loan: 0,
      ranks: {
        combat: 0,
        trade: 0,
        explore: 0,
        cqc: 0,
        empire: 0,
        federation: 0,
        soldier: 0,
        exobiologist: 0,
      },
      progress: {
        combat: 0,
        trade: 0,
        explore: 0,
        cqc: 0,
        empire: 0,
        federation: 0,
        soldier: 0,
        exobiologist: 0,
      },
    },
    location: {
      system: "",
      systemAddress: 0,
      starPos: [0, 0, 0],
      body: "",
      bodyType: "",
      bodyID: 0,
      station: "",
      stationType: "",
      marketID: 0,
      docked: false,
      latitude: 0,
      longitude: 0,
      altitude: 0,
      heading: 0,
      planetRadius: 0,
      onPlanet: false,
      inSupercruise: false,
      jumping: false,
      systemAllegiance: "",
      systemEconomy: "",
      systemGovernment: "",
      systemSecurity: "",
      population: 0,
      powerplayState: "",
      powers: [],
      factions: [],
      conflicts: [],
    },
    ship: {
      current: "",
      shipID: 0,
      name: "",
      ident: "",
      fuelLevel: 0,
      fuelCapacity: 0,
      hullHealth: 100,
      unladenMass: 0,
      maxJumpRange: 0,
      modules: [],
    },
    fleet: [],
    materials: {
      raw: [],
      manufactured: [],
      encoded: [],
      items: [],
      components: [],
      consumables: [],
      data: [],
    },
    missions: [],
    carrier: null,
    navRoute: [],
    flags: {
      odyssey: false,
      horizons: false,
      gameMode: "",
      group: "",
    },
    squadron: {
      name: "",
      rank: "",
      alignedPower: "",
      homeSystem: "",
      factionName: "",
      powerplayState: "",
      id: 0,
      currentRating: 0,
      ratings: [],
    },
  };
}

function materialIndex(arr: MaterialEntry[], name: string): number {
  return arr.findIndex((e) => e.name === name);
}

function upsertMaterial(
  arr: MaterialEntry[],
  name: string,
  delta: number,
): void {
  const idx = materialIndex(arr, name);
  if (idx >= 0) {
    const next = arr[idx].count + delta;
    if (next <= 0) {
      arr.splice(idx, 1);
    } else {
      arr[idx] = { name, count: next };
    }
  } else if (delta > 0) {
    arr.push({ name, count: delta });
  }
}

function setMaterial(arr: MaterialEntry[], name: string, count: number): void {
  const idx = materialIndex(arr, name);
  if (idx >= 0) {
    if (count <= 0) {
      arr.splice(idx, 1);
    } else {
      arr[idx] = { name, count };
    }
  } else if (count > 0) {
    arr.push({ name, count });
  }
}

function materialCategory(cat: string): keyof CommanderState["materials"] {
  const lc = cat.toLowerCase();
  if (lc === "raw" || lc === "manufactured" || lc === "encoded") return lc;
  return "raw";
}

export class CommanderStateEngine {
  private state: CommanderState;

  constructor() {
    this.state = emptyState();
  }

  getState(): CommanderState {
    return this.state;
  }

  reset(): void {
    this.state = emptyState();
  }

  export(): CommanderState {
    return JSON.parse(JSON.stringify(this.state));
  }

  import(snapshot: CommanderState): void {
    this.state = JSON.parse(JSON.stringify(snapshot));
  }

  update(event: JournalEvent): CommanderState {
    switch (event.event) {
      case "LoadGame":
        return this.handleLoadGame(event as LoadGame);
      case "Location":
        return this.handleLocation(event as Location);
      case "FSDJump":
        return this.handleFsdJump(event as FSDJump);
      case "Docked":
        return this.handleDocked(event as Docked);
      case "Undocked":
        return this.handleUndocked(event as Undocked);
      case "StartJump":
        return this.handleStartJump(event as StartJump);
      case "SupercruiseEntry":
        return this.handleSupercruiseEntry(event as SupercruiseEntry);
      case "SupercruiseExit":
        return this.handleSupercruiseExit(event as SupercruiseExit);
      case "ApproachBody":
        return this.handleApproachBody(
          event as JournalEvent & { Body?: string; BodyID?: number },
        );
      case "LeaveBody":
        return this.handleLeaveBody();
      case "Touchdown":
        return this.handleTouchdown(event as Touchdown);
      case "Liftoff":
        return this.handleLiftoff(event as Liftoff);
      case "Promotion":
        return this.handlePromotion(event as Promotion);
      case "Progress":
        return this.handleProgress(event as Progress);
      case "Rank":
        return this.handleRank(event as Rank);
      case "MaterialCollected":
        return this.handleMaterialCollected(event as MaterialCollected);
      case "MaterialDiscarded":
        return this.handleMaterialDiscarded(event as MaterialDiscarded);
      case "MaterialTrade":
        return this.handleMaterialTrade(event as MaterialTrade);
      case "Synthesis":
        return this.handleSynthesis(event as Synthesis);
      case "EngineerCraft":
        return this.handleEngineerCraft(event as EngineerCraft);
      case "ModuleInfo":
        return this.handleModuleInfo(event as ModuleInfo);
      case "NavRoute":
        return this.handleNavRoute(event as NavRoute);
      case "NavRouteClear":
        return this.handleNavRouteClear();
      case "MissionAccepted":
        return this.handleMissionAccepted(event as MissionAccepted);
      case "MissionCompleted":
        return this.handleMissionCompleted(event as MissionCompleted);
      case "MissionFailed":
        return this.handleMissionFailed(event as MissionFailed);
      case "MissionAbandoned":
        return this.handleMissionAbandoned(event as MissionAbandoned);
      case "MissionRedirected":
        return this.handleMissionRedirected(event as MissionRedirected);
      case "ShipLocker":
        return this.handleShipLocker(event as ShipLocker);
      case "ShipLockerMaterials":
        return this.handleShipLockerMaterials(event as ShipLocker);
      case "CarrierJump":
        return this.handleCarrierJump(event as CarrierJump);
      case "CarrierBuy":
        return this.handleCarrierBuy(event as CarrierBuy);
      case "CarrierStats":
        return this.handleCarrierStats(event as CarrierStats);
      case "CarrierNameChange":
        return this.handleCarrierNameChange(event as CarrierNameChange);
      case "CarrierFinance":
        return this.handleCarrierFinance(event as CarrierFinance);
      case "Materials":
        return this.handleMaterials(
          event as JournalEvent & {
            Raw?: { Name: string; Count: number }[];
            Manufactured?: { Name: string; Count: number }[];
            Encoded?: { Name: string; Count: number }[];
          },
        );
      case "SquadronStartup":
        return this.handleSquadronStartup(event as SquadronStartup);
      case "JoinedSquadron":
        return this.handleJoinedSquadron(
          event as JournalEvent & { SquadronName: string },
        );
      case "LeftSquadron":
      case "DisbandedSquadron":
      case "KickedFromSquadron":
        return this.handleLeftSquadron();
      case "SquadronCreated":
        return this.handleSquadronCreated(
          event as JournalEvent & { SquadronName: string },
        );
      case "SquadronDemotion":
        return this.handleSquadronDemotion(
          event as JournalEvent & { SquadronName: string; NewRank: number },
        );
      case "SquadronPromotion":
        return this.handleSquadronPromotion(
          event as JournalEvent & { SquadronName: string; NewRank: number },
        );
      default:
        return this.state;
    }
  }

  private handleLoadGame(e: LoadGame): CommanderState {
    this.state.commander.name = e.Commander;
    this.state.commander.fid = e.FID ?? "";
    this.state.commander.credits = e.Credits;
    this.state.commander.loan = e.Loan;
    this.state.ship.current = e.Ship;
    this.state.ship.shipID = e.ShipID;
    this.state.ship.name = e.ShipName ?? "";
    this.state.ship.ident = e.ShipIdent ?? "";
    this.state.ship.fuelLevel = e.FuelLevel ?? 0;
    this.state.ship.fuelCapacity = e.FuelCapacity ?? 0;
    this.state.flags.odyssey = e.Odyssey ?? false;
    this.state.flags.horizons = e.Horizons ?? false;
    this.state.flags.gameMode = e.GameMode;
    this.state.flags.group = e.Group ?? "";
    return this.state;
  }

  private setLocationFields(e: Location | FSDJump | Docked): void {
    this.state.location.system = e.StarSystem ?? "";
    this.state.location.systemAddress = Number((e as any).SystemAddress ?? 0);
    this.state.location.starPos = (e as any).StarPos ?? [0, 0, 0];
    this.state.location.body = (e as any).Body ?? "";
    this.state.location.bodyID = (e as any).BodyID ?? 0;
    this.state.location.bodyType = (e as any).BodyType ?? "";
    this.state.location.systemAllegiance = (e as any).SystemAllegiance ?? "";
    this.state.location.systemEconomy = (e as any).SystemEconomy ?? "";
    this.state.location.systemGovernment = (e as any).SystemGovernment ?? "";
    this.state.location.systemSecurity = (e as any).SystemSecurity ?? "";
    this.state.location.population = (e as any).Population ?? 0;
    this.state.location.powerplayState = (e as any).PowerplayState ?? "";
    this.state.location.powers = (e as any).Powers ?? [];
    this.state.location.inSupercruise = false;
    this.state.location.jumping = false;
    this.state.location.factions = ((e as any).Factions ?? []).map(
      (f: any) => ({
        name: f.Name,
        factionState: f.FactionState,
        influence: f.Influence,
        allegiance: f.Allegiance,
        government: f.Government,
        happiness: f.Happiness,
        myReputation: f.MyReputation,
        squadronFaction: f.SquadronFaction,
        activeStates: f.ActiveStates?.map((s: any) => ({
          state: s.State,
          trend: s.Trend,
        })),
        pendingStates: f.PendingStates?.map((s: any) => ({
          state: s.State,
          trend: s.Trend,
        })),
        recoveringStates: f.RecoveringStates?.map((s: any) => ({
          state: s.State,
          trend: s.Trend,
        })),
      }),
    );
    this.state.location.conflicts = ((e as any).Conflicts ?? []).map(
      (c: any) => ({
        warType: c.WarType,
        status: c.Status,
        faction1: {
          name: c.Faction1.Name,
          stake: c.Faction1.Stake,
          wonDays: c.Faction1.WonDays,
        },
        faction2: {
          name: c.Faction2.Name,
          stake: c.Faction2.Stake,
          wonDays: c.Faction2.WonDays,
        },
      }),
    );
  }

  private handleLocation(e: Location): CommanderState {
    this.setLocationFields(e);
    this.state.location.docked = e.Docked ?? false;
    this.state.location.station = e.StationName ?? "";
    this.state.location.stationType = e.StationType ?? "";
    this.state.location.marketID = Number(e.MarketID ?? 0);
    return this.state;
  }

  private handleFsdJump(e: FSDJump): CommanderState {
    this.setLocationFields(e);
    this.state.ship.fuelLevel = e.FuelLevel ?? this.state.ship.fuelLevel;
    return this.state;
  }

  private handleDocked(e: Docked): CommanderState {
    this.setLocationFields(e);
    this.state.location.docked = true;
    this.state.location.station = e.StationName;
    this.state.location.stationType = e.StationType;
    this.state.location.marketID = Number(e.MarketID ?? 0);
    this.state.location.onPlanet = false;
    return this.state;
  }

  private handleUndocked(_e: Undocked): CommanderState {
    this.state.location.docked = false;
    this.state.location.station = "";
    this.state.location.stationType = "";
    return this.state;
  }

  private handleStartJump(e: StartJump): CommanderState {
    this.state.location.jumping = true;
    if (e.JumpType === "Supercruise") {
      this.state.location.inSupercruise = true;
    }
    return this.state;
  }

  private handleSupercruiseEntry(_e: SupercruiseEntry): CommanderState {
    this.state.location.inSupercruise = true;
    this.state.location.jumping = false;
    return this.state;
  }

  private handleSupercruiseExit(e: SupercruiseExit): CommanderState {
    this.state.location.inSupercruise = false;
    this.state.location.jumping = false;
    this.state.location.body = e.Body ?? "";
    this.state.location.bodyID = e.BodyID ?? 0;
    this.state.location.bodyType = e.BodyType ?? "";
    return this.state;
  }

  private handleApproachBody(
    e: JournalEvent & { Body?: string; BodyID?: number },
  ): CommanderState {
    this.state.location.body = e.Body ?? "";
    this.state.location.bodyID = e.BodyID ?? 0;
    return this.state;
  }

  private handleLeaveBody(): CommanderState {
    this.state.location.body = "";
    this.state.location.bodyID = 0;
    this.state.location.bodyType = "";
    return this.state;
  }

  private handleTouchdown(e: Touchdown): CommanderState {
    this.state.location.onPlanet = true;
    this.state.location.body = e.Body ?? this.state.location.body;
    this.state.location.latitude = e.Latitude ?? 0;
    this.state.location.longitude = e.Longitude ?? 0;
    return this.state;
  }

  private handleLiftoff(e: Liftoff): CommanderState {
    this.state.location.onPlanet = false;
    this.state.location.latitude = e.Latitude ?? 0;
    this.state.location.longitude = e.Longitude ?? 0;
    return this.state;
  }

  private handlePromotion(e: Promotion): CommanderState {
    const r = this.state.commander.ranks;
    if (e.Combat !== undefined) r.combat = e.Combat;
    if (e.Trade !== undefined) r.trade = e.Trade;
    if (e.Explore !== undefined) r.explore = e.Explore;
    if (e.CQC !== undefined) r.cqc = e.CQC;
    if (e.Empire !== undefined) r.empire = e.Empire;
    if (e.Federation !== undefined) r.federation = e.Federation;
    if (e.Soldier !== undefined) r.soldier = e.Soldier;
    if (e.Exobiologist !== undefined) r.exobiologist = e.Exobiologist;
    return this.state;
  }

  private handleProgress(e: Progress): CommanderState {
    const p = this.state.commander.progress;
    if (e.Combat !== undefined) p.combat = e.Combat;
    if (e.Trade !== undefined) p.trade = e.Trade;
    if (e.Explore !== undefined) p.explore = e.Explore;
    if (e.CQC !== undefined) p.cqc = e.CQC;
    if (e.Empire !== undefined) p.empire = e.Empire;
    if (e.Federation !== undefined) p.federation = e.Federation;
    if (e.Soldier !== undefined) p.soldier = e.Soldier;
    if (e.Exobiologist !== undefined) p.exobiologist = e.Exobiologist;
    return this.state;
  }

  private handleRank(e: Rank): CommanderState {
    const r = this.state.commander.ranks;
    if (e.Combat !== undefined) r.combat = e.Combat;
    if (e.Trade !== undefined) r.trade = e.Trade;
    if (e.Explore !== undefined) r.explore = e.Explore;
    if (e.CQC !== undefined) r.cqc = e.CQC;
    if (e.Empire !== undefined) r.empire = e.Empire;
    if (e.Federation !== undefined) r.federation = e.Federation;
    if (e.Soldier !== undefined) r.soldier = e.Soldier;
    if (e.Exobiologist !== undefined) r.exobiologist = e.Exobiologist;
    return this.state;
  }

  private handleMaterialCollected(e: MaterialCollected): CommanderState {
    const cat = materialCategory(e.Category);
    upsertMaterial(this.state.materials[cat], e.Name, e.Count ?? 1);
    return this.state;
  }

  private handleMaterialDiscarded(e: MaterialDiscarded): CommanderState {
    const cat = materialCategory(e.Category);
    upsertMaterial(this.state.materials[cat], e.Name, -e.Count);
    return this.state;
  }

  private handleMaterialTrade(e: MaterialTrade): CommanderState {
    const fromCat = materialCategory(e.Traded.Category);
    const toCat = materialCategory(e.Received.Category);
    upsertMaterial(
      this.state.materials[fromCat],
      e.Traded.Material,
      -e.Traded.Quantity,
    );
    upsertMaterial(
      this.state.materials[toCat],
      e.Received.Material,
      e.Received.Quantity,
    );
    return this.state;
  }

  private handleSynthesis(e: Synthesis): CommanderState {
    const mats = (e as any).Materials as
      | { Name: string; Count: number; Category?: string }[]
      | undefined;
    if (!mats) return this.state;
    for (const ing of mats) {
      const cat = ing.Category
        ? materialCategory(ing.Category)
        : "manufactured";
      upsertMaterial(this.state.materials[cat], ing.Name, -ing.Count);
    }
    return this.state;
  }

  private handleEngineerCraft(e: EngineerCraft): CommanderState {
    if (!e.Ingredients) return this.state;
    for (const ing of e.Ingredients) {
      const cat = materialCategory((ing as any).Category ?? "Raw");
      upsertMaterial(this.state.materials[cat], ing.Name, -ing.Quantity);
    }
    return this.state;
  }

  private handleModuleInfo(e: ModuleInfo): CommanderState {
    this.state.ship.modules = e.Modules.map((m) => ({
      slot: m.Slot,
      item: m.Item,
      priority: m.Priority,
      health: m.Health ?? 100,
      value: m.Value ?? 0,
      engineering: m.Engineering
        ? {
            engineer: m.Engineering.Engineer,
            blueprintName: m.Engineering.BlueprintName,
            level: m.Engineering.Level,
            quality: m.Engineering.Quality,
            experimentalEffect: m.Engineering.ExperimentalEffect ?? "",
          }
        : null,
    }));
    return this.state;
  }

  private handleNavRoute(e: NavRoute): CommanderState {
    this.state.navRoute = e.Route.map((r) => ({
      starSystem: r.StarSystem,
      systemAddress: Number(r.SystemAddress ?? 0),
      starPos: r.StarPos,
    }));
    return this.state;
  }

  private handleNavRouteClear(): CommanderState {
    this.state.navRoute = [];
    return this.state;
  }

  private handleMissionAccepted(e: MissionAccepted): CommanderState {
    const mission: MissionState = {
      missionID: e.MissionID,
      name: e.Name,
      faction: e.Faction,
      expiry: e.Expiry ?? "",
      reward: e.Reward ?? 0,
      destinationSystem: e.DestinationSystem ?? "",
      destinationStation: e.DestinationStation ?? "",
      passengerMission: e.PassengerMission ?? false,
      wing: e.Wing ?? false,
      failed: false,
    };
    const idx = this.state.missions.findIndex(
      (m) => m.missionID === e.MissionID,
    );
    if (idx >= 0) {
      this.state.missions[idx] = mission;
    } else {
      this.state.missions.push(mission);
    }
    return this.state;
  }

  private handleMissionCompleted(e: MissionCompleted): CommanderState {
    const idx = this.state.missions.findIndex(
      (m) => m.missionID === e.MissionID,
    );
    if (idx >= 0) {
      this.state.missions.splice(idx, 1);
    }
    return this.state;
  }

  private handleMissionFailed(e: MissionFailed): CommanderState {
    const idx = this.state.missions.findIndex(
      (m) => m.missionID === e.MissionID,
    );
    if (idx >= 0) {
      this.state.missions[idx].failed = true;
    }
    return this.state;
  }

  private handleMissionAbandoned(e: MissionAbandoned): CommanderState {
    const idx = this.state.missions.findIndex(
      (m) => m.missionID === e.MissionID,
    );
    if (idx >= 0) {
      this.state.missions.splice(idx, 1);
    }
    return this.state;
  }

  private handleMissionRedirected(e: MissionRedirected): CommanderState {
    const idx = this.state.missions.findIndex(
      (m) => m.missionID === e.MissionID,
    );
    if (idx >= 0) {
      if (e.NewDestinationSystem)
        this.state.missions[idx].destinationSystem = e.NewDestinationSystem;
      if (e.NewDestinationStation)
        this.state.missions[idx].destinationStation = e.NewDestinationStation;
    }
    return this.state;
  }

  private handleShipLocker(e: ShipLocker): CommanderState {
    if (e.Items) {
      this.state.materials.items = (e.Items as any[])
        .map((i: any) => ({ name: i.Name ?? "", count: i.Count ?? 0 }))
        .filter((i: MaterialEntry) => i.name);
    }
    if (e.Components) {
      this.state.materials.components = (e.Components as any[])
        .map((c: any) => ({ name: c.Name ?? "", count: c.Count ?? 0 }))
        .filter((c: MaterialEntry) => c.name);
    }
    if (e.Consumables) {
      this.state.materials.consumables = (e.Consumables as any[])
        .map((c: any) => ({ name: c.Name ?? "", count: c.Count ?? 0 }))
        .filter((c: MaterialEntry) => c.name);
    }
    if (e.Data) {
      this.state.materials.data = (e.Data as any[])
        .map((d: any) => ({ name: d.Name ?? "", count: d.Count ?? 0 }))
        .filter((d: MaterialEntry) => d.name);
    }
    return this.state;
  }

  private handleShipLockerMaterials(e: ShipLocker): CommanderState {
    return this.handleShipLocker(e);
  }

  private handleMaterials(
    e: JournalEvent & {
      Raw?: { Name: string; Count: number }[];
      Manufactured?: { Name: string; Count: number }[];
      Encoded?: { Name: string; Count: number }[];
    },
  ): CommanderState {
    if (e.Raw)
      this.state.materials.raw = e.Raw.filter((m) => m.Name).map((m) => ({
        name: m.Name,
        count: m.Count,
      }));
    if (e.Manufactured)
      this.state.materials.manufactured = e.Manufactured.filter(
        (m) => m.Name,
      ).map((m) => ({ name: m.Name, count: m.Count }));
    if (e.Encoded)
      this.state.materials.encoded = e.Encoded.filter((m) => m.Name).map(
        (m) => ({ name: m.Name, count: m.Count }),
      );
    return this.state;
  }

  private handleCarrierJump(e: CarrierJump): CommanderState {
    this.state.location.system = e.StarSystem ?? this.state.location.system;
    this.state.location.systemAddress = Number(e.SystemAddress ?? 0);
    this.state.location.body = e.Body ?? "";
    this.state.location.bodyID = e.BodyID ?? 0;
    return this.state;
  }

  private handleCarrierBuy(e: CarrierBuy): CommanderState {
    this.state.carrier = {
      id: String(e.CarrierID ?? ""),
      callsign: e.Callsign ?? "",
      name: "",
      fuelLevel: 0,
      jumpRangeCurr: 0,
      jumpRangeMax: 0,
      dockingAccess: "",
    };
    return this.state;
  }

  private handleCarrierStats(e: CarrierStats): CommanderState {
    if (!this.state.carrier) {
      this.state.carrier = {
        id: String(e.CarrierID),
        callsign: "",
        name: "",
        fuelLevel: 0,
        jumpRangeCurr: 0,
        jumpRangeMax: 0,
        dockingAccess: "",
      };
    }
    this.state.carrier.callsign = e.Callsign;
    this.state.carrier.name = e.Name;
    this.state.carrier.fuelLevel = e.FuelLevel ?? 0;
    this.state.carrier.jumpRangeCurr = e.JumpRangeCurr ?? 0;
    this.state.carrier.jumpRangeMax = e.JumpRangeMax ?? 0;
    this.state.carrier.dockingAccess = e.DockingAccess ?? "";
    return this.state;
  }

  private handleCarrierNameChange(e: CarrierNameChange): CommanderState {
    if (this.state.carrier) {
      this.state.carrier.name = e.Name;
      this.state.carrier.callsign = e.Callsign ?? this.state.carrier.callsign;
    }
    return this.state;
  }

  private handleCarrierFinance(e: CarrierFinance): CommanderState {
    if (!this.state.carrier) {
      this.state.carrier = {
        id: String(e.CarrierID),
        callsign: "",
        name: "",
        fuelLevel: 0,
        jumpRangeCurr: 0,
        jumpRangeMax: 0,
        dockingAccess: "",
      };
    }
    return this.state;
  }

  private handleSquadronStartup(e: SquadronStartup): CommanderState {
    this.state.squadron = {
      name: e.SquadronName ?? "",
      rank: e.SquadronRank ?? "",
      alignedPower: e.SquadronAlignedPower ?? "",
      homeSystem: e.SquadronHomeSystem ?? "",
      factionName: e.SquadronFaction ?? "",
      powerplayState: e.SquadronPowerplayState ?? "",
      id: e.SquadronID ?? 0,
      currentRating: e.CurrentRating ?? 0,
      ratings: (e.Rating ?? []).map((r) => ({
        name: r.Name,
        rank: r.Rank,
      })),
    };
    return this.state;
  }

  private handleJoinedSquadron(
    e: JournalEvent & { SquadronName: string },
  ): CommanderState {
    this.state.squadron.name = e.SquadronName;
    return this.state;
  }

  private handleLeftSquadron(): CommanderState {
    this.state.squadron = {
      name: "",
      rank: "",
      alignedPower: "",
      homeSystem: "",
      factionName: "",
      powerplayState: "",
      id: 0,
      currentRating: 0,
      ratings: [],
    };
    return this.state;
  }

  private handleSquadronCreated(
    e: JournalEvent & { SquadronName: string },
  ): CommanderState {
    this.state.squadron.name = e.SquadronName;
    return this.state;
  }

  private handleSquadronDemotion(
    e: JournalEvent & { SquadronName: string; NewRank: number },
  ): CommanderState {
    this.state.squadron.rank = String(e.NewRank);
    return this.state;
  }

  private handleSquadronPromotion(
    e: JournalEvent & { SquadronName: string; NewRank: number },
  ): CommanderState {
    this.state.squadron.rank = String(e.NewRank);
    return this.state;
  }
}
