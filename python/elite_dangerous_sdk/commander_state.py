"""Commander State Engine — tracks ship, location, materials, missions from journal events."""

from dataclasses import dataclass, field, asdict
from typing import Any, Optional


@dataclass
class FactionStateInfo:
    name: str = ""
    faction_state: str = ""
    influence: float = 0.0
    allegiance: str = ""
    government: str = ""
    happiness: Optional[str] = None
    my_reputation: Optional[float] = None
    squadron_faction: Optional[bool] = None
    active_states: Optional[list[dict]] = None
    pending_states: Optional[list[dict]] = None
    recovering_states: Optional[list[dict]] = None


@dataclass
class ConflictInfo:
    war_type: str = ""
    status: str = ""
    faction1: Optional[dict] = None
    faction2: Optional[dict] = None


@dataclass
class SquadronState:
    name: str = ""
    rank: str = ""
    aligned_power: str = ""
    home_system: str = ""
    faction_name: str = ""
    powerplay_state: str = ""
    id: int = 0
    current_rating: int = 0
    ratings: list = field(default_factory=list)


@dataclass
class MaterialEntry:
    name: str = ""
    count: int = 0


@dataclass
class MissionState:
    missionID: int = 0
    name: str = ""
    faction: str = ""
    expiry: str = ""
    reward: int = 0
    destinationSystem: str = ""
    destinationStation: str = ""
    passengerMission: bool = False
    wing: bool = False
    failed: bool = False


@dataclass
class ShipModuleState:
    slot: str = ""
    item: str = ""
    priority: int = 0
    health: float = 100.0
    value: int = 0
    engineering: Optional[dict] = None


@dataclass
class FleetEntry:
    ship: str = ""
    shipID: int = 0
    shipName: str = ""
    shipIdent: str = ""


@dataclass
class NavRouteEntry:
    starSystem: str = ""
    systemAddress: int = 0
    starPos: tuple = (0.0, 0.0, 0.0)


@dataclass
class CarrierState:
    id: str = ""
    callsign: str = ""
    name: str = ""
    fuelLevel: float = 0.0
    jumpRangeCurr: float = 0.0
    jumpRangeMax: float = 0.0
    dockingAccess: str = ""


@dataclass
class CommanderState:
    @dataclass
    class _Ranks:
        combat: int = 0
        trade: int = 0
        explore: int = 0
        cqc: int = 0
        empire: int = 0
        federation: int = 0
        soldier: int = 0
        exobiologist: int = 0

    @dataclass
    class _Progress:
        combat: float = 0.0
        trade: float = 0.0
        explore: float = 0.0
        cqc: float = 0.0
        empire: float = 0.0
        federation: float = 0.0
        soldier: float = 0.0
        exobiologist: float = 0.0

    @dataclass
    class _Commander:
        name: str = ""
        fid: str = ""
        credits: int = 0
        loan: int = 0
        ranks: "_Ranks" = field(default_factory=lambda: CommanderState._Ranks())
        progress: "_Progress" = field(default_factory=lambda: CommanderState._Progress())

    @dataclass
    class _Location:
        system: str = ""
        systemAddress: int = 0
        starPos: tuple = (0.0, 0.0, 0.0)
        body: str = ""
        bodyType: str = ""
        bodyID: int = 0
        station: str = ""
        stationType: str = ""
        marketID: int = 0
        docked: bool = False
        latitude: float = 0.0
        longitude: float = 0.0
        altitude: float = 0.0
        heading: float = 0.0
        planetRadius: float = 0.0
        onPlanet: bool = False
        inSupercruise: bool = False
        jumping: bool = False
        systemAllegiance: str = ""
        systemEconomy: str = ""
        systemGovernment: str = ""
        systemSecurity: str = ""
        population: int = 0
        powerplayState: str = ""
        powers: list = field(default_factory=list)
        factions: list = field(default_factory=list)
        conflicts: list = field(default_factory=list)

    @dataclass
    class _Ship:
        current: str = ""
        shipID: int = 0
        name: str = ""
        ident: str = ""
        fuelLevel: float = 0.0
        fuelCapacity: float = 0.0
        hullHealth: float = 100.0
        unladenMass: float = 0.0
        maxJumpRange: float = 0.0
        modules: list = field(default_factory=list)

    @dataclass
    class _Materials:
        raw: list = field(default_factory=list)
        manufactured: list = field(default_factory=list)
        encoded: list = field(default_factory=list)
        items: list = field(default_factory=list)
        components: list = field(default_factory=list)
        consumables: list = field(default_factory=list)
        data: list = field(default_factory=list)

    @dataclass
    class _Flags:
        odyssey: bool = False
        horizons: bool = False
        gameMode: str = ""
        group: str = ""

    commander: _Commander = field(default_factory=_Commander)
    location: _Location = field(default_factory=_Location)
    ship: _Ship = field(default_factory=_Ship)
    fleet: list = field(default_factory=list)
    materials: _Materials = field(default_factory=_Materials)
    missions: list = field(default_factory=list)
    carrier: Optional[CarrierState] = None
    navRoute: list = field(default_factory=list)
    flags: _Flags = field(default_factory=_Flags)
    squadron: SquadronState = field(default_factory=SquadronState)


def _material_index(arr, name):
    for i, e in enumerate(arr):
        if e.name == name:
            return i
    return -1


def _upsert_material(arr, name, delta):
    idx = _material_index(arr, name)
    if idx >= 0:
        next_count = arr[idx].count + delta
        if next_count <= 0:
            arr.pop(idx)
        else:
            arr[idx] = MaterialEntry(name=name, count=next_count)
    elif delta > 0:
        arr.append(MaterialEntry(name=name, count=delta))


def _material_category(cat):
    lc = cat.lower()
    if lc in ("raw", "manufactured", "encoded"):
        return lc
    return "raw"


class CommanderStateEngine:
    def __init__(self):
        self._state = CommanderState()

    def get_state(self) -> CommanderState:
        return self._state

    def reset(self):
        self._state = CommanderState()

    def export(self) -> dict:
        return asdict(self._state)

    def import_(self, data: dict):
        def _mat_list(items: list) -> list:
            return [MaterialEntry(**m) for m in items]

        c = data.get("commander", {})
        l = data.get("location", {})
        s = data.get("ship", {})
        f = data.get("flags", {})
        m = data.get("materials", {})
        st = CommanderState()
        st.commander = CommanderState._Commander(
            name=c.get("name", ""),
            fid=c.get("fid", ""),
            credits=c.get("credits", 0),
            loan=c.get("loan", 0),
            ranks=CommanderState._Ranks(**c.get("ranks", {})),
            progress=CommanderState._Progress(**c.get("progress", {})),
        )
        st.location = CommanderState._Location(
            system=l.get("system", ""),
            systemAddress=l.get("systemAddress", 0),
            starPos=tuple(l.get("starPos", [0, 0, 0])),
            body=l.get("body", ""),
            bodyType=l.get("bodyType", ""),
            bodyID=l.get("bodyID", 0),
            station=l.get("station", ""),
            stationType=l.get("stationType", ""),
            marketID=l.get("marketID", 0),
            docked=l.get("docked", False),
            latitude=l.get("latitude", 0),
            longitude=l.get("longitude", 0),
            altitude=l.get("altitude", 0),
            heading=l.get("heading", 0),
            planetRadius=l.get("planetRadius", 0),
            onPlanet=l.get("onPlanet", False),
            inSupercruise=l.get("inSupercruise", False),
            jumping=l.get("jumping", False),
            systemAllegiance=l.get("systemAllegiance", ""),
            systemEconomy=l.get("systemEconomy", ""),
            systemGovernment=l.get("systemGovernment", ""),
            systemSecurity=l.get("systemSecurity", ""),
            population=l.get("population", 0),
            powerplayState=l.get("powerplayState", ""),
            powers=list(l.get("powers", [])),
            factions=[FactionStateInfo(**f) for f in l.get("factions", [])],
            conflicts=[ConflictInfo(**c) for c in l.get("conflicts", [])],
        )
        st.ship = CommanderState._Ship(
            current=s.get("current", ""),
            shipID=s.get("shipID", 0),
            name=s.get("name", ""),
            ident=s.get("ident", ""),
            fuelLevel=s.get("fuelLevel", 0),
            fuelCapacity=s.get("fuelCapacity", 0),
            hullHealth=s.get("hullHealth", 100),
            unladenMass=s.get("unladenMass", 0),
            maxJumpRange=s.get("maxJumpRange", 0),
            modules=[ShipModuleState(**mod) for mod in s.get("modules", [])],
        )
        st.fleet = [FleetEntry(**ship) for ship in data.get("fleet", [])]
        st.materials = CommanderState._Materials(
            raw=_mat_list(m.get("raw", [])),
            manufactured=_mat_list(m.get("manufactured", [])),
            encoded=_mat_list(m.get("encoded", [])),
            items=_mat_list(m.get("items", [])),
            components=_mat_list(m.get("components", [])),
            consumables=_mat_list(m.get("consumables", [])),
            data=_mat_list(m.get("data", [])),
        )
        st.missions = [MissionState(**ms) for ms in data.get("missions", [])]
        carrier_data = data.get("carrier")
        st.carrier = CarrierState(**carrier_data) if carrier_data else None
        st.navRoute = [NavRouteEntry(**r) for r in data.get("navRoute", [])]
        st.flags = CommanderState._Flags(
            odyssey=f.get("odyssey", False),
            horizons=f.get("horizons", False),
            gameMode=f.get("gameMode", ""),
            group=f.get("group", ""),
        )
        sq = data.get("squadron", {})
        st.squadron = SquadronState(
            name=sq.get("name", ""),
            rank=sq.get("rank", ""),
            aligned_power=sq.get("alignedPower", ""),
            home_system=sq.get("homeSystem", ""),
            faction_name=sq.get("factionName", ""),
            powerplay_state=sq.get("powerplayState", ""),
            id=sq.get("id", 0),
            current_rating=sq.get("currentRating", 0),
            ratings=list(sq.get("ratings", [])),
        )
        self._state = st

    def update(self, event: dict) -> CommanderState:
        event_type = event.get("event", "")
        handler = getattr(self, f"_handle_{event_type}", None)
        if handler:
            handler(event)
        return self._state

    def _handle_LoadGame(self, e: dict):
        self._state.commander.name = e.get("Commander", "")
        self._state.commander.fid = e.get("FID", "")
        self._state.commander.credits = e.get("Credits", 0)
        self._state.commander.loan = e.get("Loan", 0)
        self._state.ship.current = e.get("Ship", "")
        self._state.ship.shipID = e.get("ShipID", 0)
        self._state.ship.name = e.get("ShipName", "")
        self._state.ship.ident = e.get("ShipIdent", "")
        self._state.ship.fuelLevel = e.get("FuelLevel", 0)
        self._state.ship.fuelCapacity = e.get("FuelCapacity", 0)
        self._state.flags.odyssey = e.get("Odyssey", False)
        self._state.flags.horizons = e.get("Horizons", False)
        self._state.flags.gameMode = e.get("GameMode", "")
        self._state.flags.group = e.get("Group", "")

    def _set_location_fields(self, e: dict):
        self._state.location.system = e.get("StarSystem", "")
        self._state.location.systemAddress = int(e.get("SystemAddress", 0))
        pos = e.get("StarPos", [0, 0, 0])
        self._state.location.starPos = tuple(pos) if isinstance(pos, (list, tuple)) else (0, 0, 0)
        self._state.location.body = e.get("Body", "")
        self._state.location.bodyID = e.get("BodyID", 0)
        self._state.location.bodyType = e.get("BodyType", "")
        self._state.location.systemAllegiance = e.get("SystemAllegiance", "")
        self._state.location.systemEconomy = e.get("SystemEconomy", "")
        self._state.location.systemGovernment = e.get("SystemGovernment", "")
        self._state.location.systemSecurity = e.get("SystemSecurity", "")
        self._state.location.population = e.get("Population", 0)
        self._state.location.powerplayState = e.get("PowerplayState", "")
        self._state.location.powers = e.get("Powers", [])
        self._state.location.inSupercruise = False
        self._state.location.jumping = False
        self._state.location.factions = [
            FactionStateInfo(
                name=f.get("Name", ""),
                faction_state=f.get("FactionState", ""),
                influence=f.get("Influence", 0.0),
                allegiance=f.get("Allegiance", ""),
                government=f.get("Government", ""),
                happiness=f.get("Happiness"),
                my_reputation=f.get("MyReputation"),
                squadron_faction=f.get("SquadronFaction"),
                active_states=[{"state": s["State"], "trend": s.get("Trend")} for s in f.get("ActiveStates", [])] if f.get("ActiveStates") else None,
                pending_states=[{"state": s["State"], "trend": s.get("Trend")} for s in f.get("PendingStates", [])] if f.get("PendingStates") else None,
                recovering_states=[{"state": s["State"], "trend": s.get("Trend")} for s in f.get("RecoveringStates", [])] if f.get("RecoveringStates") else None,
            )
            for f in e.get("Factions", [])
        ]
        self._state.location.conflicts = [
            ConflictInfo(
                war_type=c.get("WarType", ""),
                status=c.get("Status", ""),
                faction1={"name": c["Faction1"]["Name"], "stake": c["Faction1"]["Stake"], "wonDays": c["Faction1"]["WonDays"]},
                faction2={"name": c["Faction2"]["Name"], "stake": c["Faction2"]["Stake"], "wonDays": c["Faction2"]["WonDays"]},
            )
            for c in e.get("Conflicts", [])
        ]

    def _handle_Location(self, e: dict):
        self._set_location_fields(e)
        self._state.location.docked = e.get("Docked", False)
        self._state.location.station = e.get("StationName", "")
        self._state.location.stationType = e.get("StationType", "")
        self._state.location.marketID = int(e.get("MarketID", 0))

    def _handle_FSDJump(self, e: dict):
        self._set_location_fields(e)
        fuel = e.get("FuelLevel")
        if fuel is not None:
            self._state.ship.fuelLevel = fuel

    def _handle_Docked(self, e: dict):
        self._set_location_fields(e)
        self._state.location.docked = True
        self._state.location.station = e.get("StationName", "")
        self._state.location.stationType = e.get("StationType", "")
        self._state.location.marketID = int(e.get("MarketID", 0))
        self._state.location.onPlanet = False

    def _handle_Undocked(self, e: dict):
        self._state.location.docked = False
        self._state.location.station = ""
        self._state.location.stationType = ""

    def _handle_StartJump(self, e: dict):
        self._state.location.jumping = True
        if e.get("JumpType") == "Supercruise":
            self._state.location.inSupercruise = True

    def _handle_SupercruiseEntry(self, e: dict):
        self._state.location.inSupercruise = True
        self._state.location.jumping = False

    def _handle_SupercruiseExit(self, e: dict):
        self._state.location.inSupercruise = False
        self._state.location.jumping = False
        self._state.location.body = e.get("Body", "")
        self._state.location.bodyID = e.get("BodyID", 0)
        self._state.location.bodyType = e.get("BodyType", "")

    def _handle_ApproachBody(self, e: dict):
        self._state.location.body = e.get("Body", "")
        self._state.location.bodyID = e.get("BodyID", 0)

    def _handle_LeaveBody(self, e: dict):
        self._state.location.body = ""
        self._state.location.bodyID = 0
        self._state.location.bodyType = ""

    def _handle_Touchdown(self, e: dict):
        self._state.location.onPlanet = True
        self._state.location.body = e.get("Body", self._state.location.body)
        self._state.location.latitude = e.get("Latitude", 0.0)
        self._state.location.longitude = e.get("Longitude", 0.0)

    def _handle_Liftoff(self, e: dict):
        self._state.location.onPlanet = False
        self._state.location.latitude = e.get("Latitude", 0.0)
        self._state.location.longitude = e.get("Longitude", 0.0)

    def _handle_Promotion(self, e: dict):
        r = self._state.commander.ranks
        if "Combat" in e: r.combat = e["Combat"]
        if "Trade" in e: r.trade = e["Trade"]
        if "Explore" in e: r.explore = e["Explore"]
        if "CQC" in e: r.cqc = e["CQC"]
        if "Empire" in e: r.empire = e["Empire"]
        if "Federation" in e: r.federation = e["Federation"]
        if "Soldier" in e: r.soldier = e["Soldier"]
        if "Exobiologist" in e: r.exobiologist = e["Exobiologist"]

    def _handle_Progress(self, e: dict):
        p = self._state.commander.progress
        if "Combat" in e: p.combat = e["Combat"]
        if "Trade" in e: p.trade = e["Trade"]
        if "Explore" in e: p.explore = e["Explore"]
        if "CQC" in e: p.cqc = e["CQC"]
        if "Empire" in e: p.empire = e["Empire"]
        if "Federation" in e: p.federation = e["Federation"]
        if "Soldier" in e: p.soldier = e["Soldier"]
        if "Exobiologist" in e: p.exobiologist = e["Exobiologist"]

    def _handle_Rank(self, e: dict):
        self._handle_Promotion(e)

    def _handle_MaterialCollected(self, e: dict):
        cat = _material_category(e.get("Category", ""))
        name = e.get("Name", "")
        count = e.get("Count", 1)
        arr = getattr(self._state.materials, cat)
        _upsert_material(arr, name, count)

    def _handle_MaterialDiscarded(self, e: dict):
        cat = _material_category(e.get("Category", ""))
        name = e.get("Name", "")
        count = e.get("Count", 1)
        arr = getattr(self._state.materials, cat)
        _upsert_material(arr, name, -count)

    def _handle_MaterialTrade(self, e: dict):
        traded = e.get("Traded", {})
        received = e.get("Received", {})
        from_cat = _material_category(traded.get("Category", ""))
        to_cat = _material_category(received.get("Category", ""))
        from_arr = getattr(self._state.materials, from_cat)
        to_arr = getattr(self._state.materials, to_cat)
        _upsert_material(from_arr, traded.get("Material", ""), -traded.get("Quantity", 0))
        _upsert_material(to_arr, received.get("Material", ""), received.get("Quantity", 0))

    def _handle_Synthesis(self, e: dict):
        mats = e.get("Materials", [])
        for ing in mats:
            cat = _material_category(ing.get("Category", "Manufactured"))
            arr = getattr(self._state.materials, cat)
            _upsert_material(arr, ing.get("Name", ""), -ing.get("Count", 0))

    def _handle_EngineerCraft(self, e: dict):
        ingredients = e.get("Ingredients", [])
        for ing in ingredients:
            cat = _material_category(ing.get("Category", "Raw"))
            arr = getattr(self._state.materials, cat)
            _upsert_material(arr, ing.get("Name", ""), -ing.get("Quantity", 0))

    def _handle_ModuleInfo(self, e: dict):
        modules = e.get("Modules", [])
        result = []
        for m in modules:
            eng = m.get("Engineering")
            result.append({
                "slot": m.get("Slot", ""),
                "item": m.get("Item", ""),
                "priority": m.get("Priority", 0),
                "health": m.get("Health", 100),
                "value": m.get("Value", 0),
                "engineering": None if not eng else {
                    "engineer": eng.get("Engineer", ""),
                    "blueprintName": eng.get("BlueprintName", ""),
                    "level": eng.get("Level", 0),
                    "quality": eng.get("Quality", 0),
                    "experimentalEffect": eng.get("ExperimentalEffect", ""),
                },
            })
        self._state.ship.modules = result

    def _handle_NavRoute(self, e: dict):
        route = e.get("Route", [])
        result = []
        for r in route:
            pos = r.get("StarPos", [0, 0, 0])
            result.append({
                "starSystem": r.get("StarSystem", ""),
                "systemAddress": int(r.get("SystemAddress", 0)),
                "starPos": tuple(pos) if isinstance(pos, (list, tuple)) else (0, 0, 0),
            })
        self._state.navRoute = result

    def _handle_NavRouteClear(self, e: dict):
        self._state.navRoute = []

    def _handle_MissionAccepted(self, e: dict):
        mission = MissionState(
            missionID=e.get("MissionID", 0),
            name=e.get("Name", ""),
            faction=e.get("Faction", ""),
            expiry=e.get("Expiry", ""),
            reward=e.get("Reward", 0),
            destinationSystem=e.get("DestinationSystem", ""),
            destinationStation=e.get("DestinationStation", ""),
            passengerMission=e.get("PassengerMission", False),
            wing=e.get("Wing", False),
            failed=False,
        )
        idx = next((i for i, m in enumerate(self._state.missions) if m.missionID == mission.missionID), -1)
        if idx >= 0:
            self._state.missions[idx] = mission
        else:
            self._state.missions.append(mission)

    def _handle_MissionCompleted(self, e: dict):
        mid = e.get("MissionID", 0)
        self._state.missions = [m for m in self._state.missions if m.missionID != mid]

    def _handle_MissionFailed(self, e: dict):
        mid = e.get("MissionID", 0)
        for m in self._state.missions:
            if m.missionID == mid:
                m.failed = True
                break

    def _handle_MissionAbandoned(self, e: dict):
        mid = e.get("MissionID", 0)
        self._state.missions = [m for m in self._state.missions if m.missionID != mid]

    def _handle_MissionRedirected(self, e: dict):
        mid = e.get("MissionID", 0)
        for m in self._state.missions:
            if m.missionID == mid:
                if "NewDestinationSystem" in e:
                    m.destinationSystem = e["NewDestinationSystem"]
                if "NewDestinationStation" in e:
                    m.destinationStation = e["NewDestinationStation"]
                break

    def _handle_ShipLocker(self, e: dict):
        items = e.get("Items")
        if items is not None:
            self._state.materials.items = [MaterialEntry(name=i.get("Name", ""), count=i.get("Count", 0)) for i in items if i.get("Name")]
        components = e.get("Components")
        if components is not None:
            self._state.materials.components = [MaterialEntry(name=c.get("Name", ""), count=c.get("Count", 0)) for c in components if c.get("Name")]
        consumables = e.get("Consumables")
        if consumables is not None:
            self._state.materials.consumables = [MaterialEntry(name=c.get("Name", ""), count=c.get("Count", 0)) for c in consumables if c.get("Name")]
        data = e.get("Data")
        if data is not None:
            self._state.materials.data = [MaterialEntry(name=d.get("Name", ""), count=d.get("Count", 0)) for d in data if d.get("Name")]

    def _handle_ShipLockerMaterials(self, e: dict):
        self._handle_ShipLocker(e)

    def _handle_Materials(self, e: dict):
        for cat_name, attr_name in [("Raw", "raw"), ("Manufactured", "manufactured"), ("Encoded", "encoded")]:
            items = e.get(cat_name)
            if items is not None:
                setattr(self._state.materials, attr_name, [MaterialEntry(name=i.get("Name", ""), count=i.get("Count", 0)) for i in items if i.get("Name")])

    def _handle_CarrierJump(self, e: dict):
        self._state.location.system = e.get("StarSystem", self._state.location.system)
        self._state.location.systemAddress = int(e.get("SystemAddress", 0))
        self._state.location.body = e.get("Body", "")
        self._state.location.bodyID = e.get("BodyID", 0)

    def _handle_CarrierBuy(self, e: dict):
        self._state.carrier = CarrierState(
            id=str(e.get("CarrierID", "")),
            callsign=e.get("Callsign", ""),
        )

    def _handle_CarrierStats(self, e: dict):
        if not self._state.carrier:
            self._state.carrier = CarrierState(id=str(e.get("CarrierID", "")))
        self._state.carrier.callsign = e.get("Callsign", "")
        self._state.carrier.name = e.get("Name", "")
        self._state.carrier.fuelLevel = e.get("FuelLevel", 0.0)
        self._state.carrier.jumpRangeCurr = e.get("JumpRangeCurr", 0.0)
        self._state.carrier.jumpRangeMax = e.get("JumpRangeMax", 0.0)
        self._state.carrier.dockingAccess = e.get("DockingAccess", "")

    def _handle_CarrierNameChange(self, e: dict):
        if self._state.carrier:
            self._state.carrier.name = e.get("Name", "")
            self._state.carrier.callsign = e.get("Callsign", self._state.carrier.callsign)

    def _handle_CarrierFinance(self, e: dict):
        if not self._state.carrier:
            self._state.carrier = CarrierState(id=str(e.get("CarrierID", "")))

    def _handle_SquadronStartup(self, e: dict):
        self._state.squadron = SquadronState(
            name=e.get("SquadronName", ""),
            rank=e.get("SquadronRank", ""),
            aligned_power=e.get("SquadronAlignedPower", ""),
            home_system=e.get("SquadronHomeSystem", ""),
            faction_name=e.get("SquadronFaction", ""),
            powerplay_state=e.get("SquadronPowerplayState", ""),
            id=e.get("SquadronID", 0),
            current_rating=e.get("CurrentRating", 0),
            ratings=list(e.get("Rating", [])),
        )

    def _handle_JoinedSquadron(self, e: dict):
        self._state.squadron.name = e.get("SquadronName", "")

    def _handle_LeftSquadron(self, e: dict):
        self._state.squadron = SquadronState()

    def _handle_DisbandedSquadron(self, e: dict):
        self._state.squadron = SquadronState()

    def _handle_KickedFromSquadron(self, e: dict):
        self._state.squadron = SquadronState()

    def _handle_SquadronCreated(self, e: dict):
        self._state.squadron.name = e.get("SquadronName", "")

    def _handle_SquadronDemotion(self, e: dict):
        self._state.squadron.rank = str(e.get("NewRank", ""))

    def _handle_SquadronPromotion(self, e: dict):
        self._state.squadron.rank = str(e.get("NewRank", ""))
