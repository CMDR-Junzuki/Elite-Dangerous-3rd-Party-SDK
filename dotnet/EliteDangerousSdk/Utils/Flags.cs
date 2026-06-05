using System;

namespace EliteDangerousSdk.Utils
{
    public static class Flags
    {
        public const long Docked = 1L << 0;
        public const long Landed = 1L << 1;
        public const long LandingGearDown = 1L << 2;
        public const long ShieldsUp = 1L << 3;
        public const long Supercruise = 1L << 4;
        public const long FlightAssistOff = 1L << 5;
        public const long HardpointsDeployed = 1L << 6;
        public const long InWing = 1L << 7;
        public const long LightsOn = 1L << 8;
        public const long CargoScoopDeployed = 1L << 9;
        public const long SilentRunning = 1L << 10;
        public const long ScoopingFuel = 1L << 11;
        public const long SrvHandbrake = 1L << 12;
        public const long SrvTurret = 1L << 13;
        public const long SrvTurretRetracted = 1L << 14;
        public const long SrvDriveAssist = 1L << 15;
        public const long FsdMassLocked = 1L << 16;
        public const long FsdCharging = 1L << 17;
        public const long FsdCooldown = 1L << 18;
        public const long LowFuel = 1L << 19;
        public const long OverHeating = 1L << 20;
        public const long HasLatentMeteorite = 1L << 21;
        public const long IsInDangerousWeather = 1L << 22;
        public const long IsInNoFireZone = 1L << 23;
        public const long IsInNoFireZoneTrespass = 1L << 24;
        public const long IsInConflictZone = 1L << 25;
        public const long IsInWingNoFireZone = 1L << 26;
        public const long MasslockEngaged = 1L << 27;
        public const long FsdJumping = 1L << 28;
        public const long SrvUnderShip = 1L << 29;
    }

    public static class Flags2
    {
        public const long OnFoot = 1L << 0;
        public const long InTaxi = 1L << 1;
        public const long InMultiCrew = 1L << 2;
        public const long OnFootInStation = 1L << 3;
        public const long InCrewAssistedVehicle = 1L << 4;
        public const long InWeaponsView = 1L << 5;
        public const long InStationOrSettlement = 1L << 6;
        public const long InSocialZone = 1L << 7;
        public const long OnFootNoFireZone = 1L << 8;
        public const long OnFootNoFireZoneTrespass = 1L << 9;
        public const long OnFootUsingScanner = 1L << 10;
        public const long OnFootInConflictZone = 1L << 11;
        public const long InTaxiOrDropship = 1L << 12;
        public const long InMultiCrewVehicle = 1L << 13;
        public const long InMegaShipInstallation = 1L << 14;
        public const long InFighter = 1L << 15;
        public const long InDropship = 1L << 16;
        public const long InApex = 1L << 17;
        public const long OnMissionBoard = 1L << 18;
        public const long InCqc = 1L << 19;
    }

    public static class GuiFocus
    {
        public const int NoFocus = 0;
        public const int InternalPanel = 1;
        public const int ExternalPanel = 2;
        public const int CommsPanel = 3;
        public const int RolePanel = 4;
        public const int StationServices = 5;
        public const int GalaxyMap = 6;
        public const int SystemMap = 7;
        public const int Orrery = 8;
        public const int Fss = 9;
        public const int Saa = 10;
        public const int Codex = 11;
    }
}
