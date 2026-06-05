"""
Status.json bitflag constants, matching EDMarketConnector and the game client.
"""


class Flags:
    DOCKED = 1 << 0
    LANDED = 1 << 1
    LANDING_GEAR_DOWN = 1 << 2
    SHIELDS_UP = 1 << 3
    SUPERCRUISE = 1 << 4
    FLIGHT_ASSIST_OFF = 1 << 5
    HARDPOINTS_DEPLOYED = 1 << 6
    IN_WING = 1 << 7
    LIGHTS_ON = 1 << 8
    CARGO_SCOOP_DEPLOYED = 1 << 9
    SILENT_RUNNING = 1 << 10
    SCOOPING_FUEL = 1 << 11
    SRV_HANDBRAKE = 1 << 12
    SRV_TURRET = 1 << 13
    SRV_TURRET_RETRACTED = 1 << 14
    SRV_DRIVE_ASSIST = 1 << 15
    FSD_MASS_LOCKED = 1 << 16
    FSD_CHARGING = 1 << 17
    FSD_COOLDOWN = 1 << 18
    LOW_FUEL = 1 << 19
    OVER_HEATING = 1 << 20
    HAS_LATENT_METEORITE = 1 << 21
    IS_IN_DANGEROUS_WEATHER = 1 << 22
    IS_IN_NO_FIRE_ZONE = 1 << 23
    IS_IN_NO_FIRE_ZONE_TRESPASS = 1 << 24
    IS_IN_CONFLICT_ZONE = 1 << 25
    IS_IN_WING_NO_FIRE_ZONE = 1 << 26
    MASSLOCK_ENGAGED = 1 << 27
    FSD_JUMPING = 1 << 28
    SRV_UNDER_SHIP = 1 << 29

    _ALL = {
        "Docked": DOCKED,
        "Landed": LANDED,
        "LandingGearDown": LANDING_GEAR_DOWN,
        "ShieldsUp": SHIELDS_UP,
        "Supercruise": SUPERCRUISE,
        "FlightAssistOff": FLIGHT_ASSIST_OFF,
        "HardpointsDeployed": HARDPOINTS_DEPLOYED,
        "InWing": IN_WING,
        "LightsOn": LIGHTS_ON,
        "CargoScoopDeployed": CARGO_SCOOP_DEPLOYED,
        "SilentRunning": SILENT_RUNNING,
        "ScoopingFuel": SCOOPING_FUEL,
        "SrvHandbrake": SRV_HANDBRAKE,
        "SrvTurret": SRV_TURRET,
        "SrvTurretRetracted": SRV_TURRET_RETRACTED,
        "SrvDriveAssist": SRV_DRIVE_ASSIST,
        "FsdMassLocked": FSD_MASS_LOCKED,
        "FsdCharging": FSD_CHARGING,
        "FsdCooldown": FSD_COOLDOWN,
        "LowFuel": LOW_FUEL,
        "OverHeating": OVER_HEATING,
        "HasLatentMeteorite": HAS_LATENT_METEORITE,
        "IsInDangerousWeather": IS_IN_DANGEROUS_WEATHER,
        "IsInNoFireZone": IS_IN_NO_FIRE_ZONE,
        "IsInNoFireZoneTrespass": IS_IN_NO_FIRE_ZONE_TRESPASS,
        "IsInConflictZone": IS_IN_CONFLICT_ZONE,
        "IsInWingNoFireZone": IS_IN_WING_NO_FIRE_ZONE,
        "MasslockEngaged": MASSLOCK_ENGAGED,
        "FsdJumping": FSD_JUMPING,
        "SrvUnderShip": SRV_UNDER_SHIP,
    }


class Flags2:
    ON_FOOT = 1 << 0
    IN_TAXI = 1 << 1
    IN_MULTI_CREW = 1 << 2
    ON_FOOT_IN_STATION = 1 << 3
    IN_CREW_ASSISTED_VEHICLE = 1 << 4
    IN_WEAPONS_VIEW = 1 << 5
    IN_STATION_OR_SETTLEMENT = 1 << 6
    IN_SOCIAL_ZONE = 1 << 7
    ON_FOOT_NO_FIRE_ZONE = 1 << 8
    ON_FOOT_NO_FIRE_ZONE_TRESPASS = 1 << 9
    ON_FOOT_USING_SCANNER = 1 << 10
    ON_FOOT_IN_CONFLICT_ZONE = 1 << 11
    IN_TAXI_OR_DROPSHIP = 1 << 12
    IN_MULTI_CREW_VEHICLE = 1 << 13
    IN_MEGA_SHIP_INSTALLATION = 1 << 14
    IN_FIGHTER = 1 << 15
    IN_DROPSHIP = 1 << 16
    IN_APEX = 1 << 17
    ON_MISSION_BOARD = 1 << 18
    IN_CQC = 1 << 19


class GuiFocus:
    NO_FOCUS = 0
    INTERNAL_PANEL = 1
    EXTERNAL_PANEL = 2
    COMMS_PANEL = 3
    ROLE_PANEL = 4
    STATION_SERVICES = 5
    GALAXY_MAP = 6
    SYSTEM_MAP = 7
    ORRERY = 8
    FSS = 9
    SAA = 10
    CODEX = 11


LegalStatus = {
    "Clean": "Clean",
    "IllegalCargo": "IllegalCargo",
    "Speeding": "Speeding",
    "Wanted": "Wanted",
    "Hostile": "Hostile",
    "Enemy": "Enemy",
    "Unknown": "Unknown",
    "Hunted": "Hunted",
}
