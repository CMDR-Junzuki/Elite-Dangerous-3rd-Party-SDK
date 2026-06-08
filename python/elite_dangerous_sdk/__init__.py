"""
Elite Dangerous 3rd Party SDK - Python Package
"""

__version__ = "0.1.0"

from .journal import (
    JournalReader, JournalOptions, list_journal_files,
    parse_line, parse_with_bigint, parse_with_lossy_integers,
    stringify_event, stringify_bigint_json, is_event_type,
)
from .journal_watcher import JournalWatcher
from .journal_stream import create_journal_stream
from .journal_replay import JournalReplay
from .commander_state import (
    CommanderStateEngine, CommanderState, MaterialEntry, MissionState,
    ShipModuleState, FleetEntry, NavRouteEntry, CarrierState,
)
from .query import (
    JournalQuery, query, count_where, filter_where, count_by_type,
)
from .journal_types import (
    FileHeader, LoadGame, Location, FSDJump, Docked, Undocked,
    Scan, SupercruiseEntry, SupercruiseExit, Touchdown, Liftoff,
    StartJump, FuelScoop, MaterialCollected, MaterialDiscarded,
    MaterialDiscovered, MaterialTrade, EngineerCraft, EngineerApply,
    EngineerProgress, Synthesis, Bounty, Promotion, Progress, Rank,
    CommitCrime, RedeemVoucher, MissionAccepted, MissionCompleted,
    MissionFailed, MissionAbandoned, MissionRedirected, CommunityGoal,
    CommunityGoalJoin, CommunityGoalReward, CommunityGoalDiscard,
    Screenshot, Music, SendText, ReceiveText, LaunchFighter, LaunchSRV,
    DockFighter, DockSRV, FighterDestroyed, SRVDestroyed, HullDamage,
    ShieldState, HeatWarning, HeatDamage, SelfDestruct, Died, Resurrect,
    ApproachBody, LeaveBody, NavBeaconScan, FSSSignalDiscovered,
    FSSBodySignals, SAASignalsFound, CodexEntry, PlanetApproach,
    SAAscanComplete, DockingRequested, DockingGranted, DockingDenied,
    DockingCancelled, DockingTimeout, Undocking, CarrierJump,
    CarrierJumpRequest, CarrierBuy, CarrierSell, CarrierStats,
    CarrierFinance, CarrierShipPack, CarrierModulePack, CarrierTradeOrder,
    CarrierDeploy, CarrierNameChange, CarrierCrewService,
    CarrierBankTransfer, ShipTargeted, CapShipBond, FactionKillBond,
    PVPKill, PayFines, PayLegacyFines, CollectItems, EjectCargo,
    MiningRefined, ProspectedAsteroid, ReservoirReplenished, RefuelPartial,
    RefuelAll, Repair, RepairAll, BuyAmmo, BuyDrones, SellDrones,
    BuyTradeData, Market, MarketBuy, MarketSell, BuyExplorationData,
    SellExplorationData, DataScanned, AfmuRepairs, RebootRepair,
    RestockVehicle, Continued, Shutdown, ModuleInfo, NavRoute,
    NavRouteClear, SquadronStartup, InvitedToSquadron, JoinedSquadron,
    SquadronCreated, AppliedToSquadron, SquadronDemotion,
    SquadronPromotion, DisbandedSquadron, LeftSquadron,
    KickedFromSquadron, SquadronKicked, QuitACrew, JoinACrew,
    ChangeCrewAssignedRole, CrewHire, CrewFire, CrewLaunchFighter,
    CrewRoleRepair, CrewMemberJoins, CrewMemberQuits,
    CrewMemberRoleChange, KickCrewMember, EndCrewSession,
    WingJoin, WingLeave, WingAdd, WingInvite, Powerplay, PowerplayJoin,
    PowerplayLeave, PowerplayDefect, PowerplaySalary, PowerplayVote,
    PowerplayFastTrack, PowerplayDeliver, ApproachSettlement, ScanOrganic,
    SellOrganicData, Backpack, BackpackChange, ShipLocker,
    ShipLockerMaterials, FCMaterials, FCMaterialsCAPI,
    CollectMicroResources, UseConsumable, CreateSuitLoadout,
    DeleteSuitLoadout, RenameSuitLoadout, SwitchSuitLoadout, UpgradeSuit,
    UpgradeWeapon, BuySuit, SellSuit, BuyWeapon, SellWeapon, Disembark,
    Embark, BookTaxi, CancelTaxi, DropShipDeploy, TradeMicroResources,
    TransferMicroResources, BuyMicroResources, Status,
    StationEconomy, LandingPads, FactionState, StateTimeline,
    Conflict, ConflictFaction, ThargoidWarInfo, CommodityItem,
    ParentBody, Ring, AtmosphereComposition, Composition,
    EngineeringMod, Modifier, ModuleItem, ShipItem, FuelStatus,
    FuelStatusEvent, DestinationStatus, JournalPosition,
)
from .ws_journal import JournalWebSocketServer
from .companion import CompanionClient
from .edsm import EDSMClient
from .inara import InaraClient
from .eddn import (
    EDDNClient, EDDNReceiver, EDDN_SCHEMAS,
    validate_approach_settlement_message, validate_backpack_message,
    validate_blackmarket_message, validate_carrier_jump_message,
    validate_code_entry_message, validate_commodity_message,
    validate_dispatch_message, validate_eddn,
    validate_fc_materials_journal_message, validate_fc_materials_message,
    validate_fsd_jump_message, validate_fss_discovered_message,
    validate_journal_message, validate_location_message,
    validate_nav_route_clear_message, validate_nav_route_message,
    validate_outfitting_message, validate_saa_signals_found_message,
    validate_scan_message, validate_ship_locker_message,
    validate_shipyard_message,
)
from .spansh import SpanshClient
from .elitebgs import EliteBGSClient
from .elitebgs_models import (
    PaginatedResponse, StateEntry, ConflictEntry, FactionPresence,
    EBGSSystem, EBGSFaction, EBGSStation, TickTime,
)

from .edsm_models import (
    DuplicateInfo, SystemResponse, BodyInfo, StationInfo,
    MarketItem, MarketData, ShipyardData, OutfittingData,
    EstimatedValue, FactionInfo, CommanderRanksResponse,
    CommanderLogsResponse, JournalSubmitResponse,
)
from .inara_models import (
    InaraHeader, InaraEvent, InaraRequest, InaraEventResult, InaraResponse,
)
from .spansh_models import (
    StationBrief, SystemDetail, StationDetail,
    CommodityLocation, RouteJump, RouteResult,
    NearestResult, SearchResponse, StationSearchResponse,
)
from .companion_models import (
    CapCommander, CapMarketCommodity, CapProfileResponse,
    CapShipResponse, CapMarketResponse, CapShipyardResponse,
    CapFleetCarrierResponse, CapJournalResponse, CapCommunityGoal,
)
from .utils import listify, Coords, distance, sphere_search, midpoint, bearing, parse_bitflags, has_flag, combine_flags
from .flags import Flags, Flags2, GuiFocus, LegalStatus

# --- stats ---
from .stats import (
    EquippedModule, Loadout,
    JumpRangeResult, ShieldResult, DistributorResult, PowerResult, SpeedResult,
    WeaponStat, WeaponStatsResult, HullResult,
    calculate_total_mass, calculate_jump_range, calculate_shield,
    calculate_distributor, capacitor_time, sys_recharge_rate,
    wep_recharge_rate, sys_resistance, calculate_power,
    calculate_speed, calculate_weapons, calculate_hull,
)

# --- on-foot engineering ---
from .planner.on_foot_engineering import (
    SUIT_BASE_STATS, WEAPON_BASE_STATS, SUIT_UPGRADE_COSTS, WEAPON_UPGRADE_COSTS,
    ON_FOOT_MODIFICATIONS,
    get_upgrade_cost, get_modification_details, get_available_modifications,
    plan_on_foot_engineering,
)

# --- on-foot stats ---
from .on_foot import (
    calculate_suit_stats, calculate_weapon_stats, calculate_effective_dps,
)

# --- engineering ---
from .engineering import (
    StatModType, StatModMethod, BlueprintFeatures,
    StatMod, StatChange, AppliedModification, GradeFeatures, Blueprint,
    get_stat_mod, apply_blueprint_grade, compute_engineering_changes,
    get_available_blueprints,
)

# --- planner ---
from .planner import (
    MaterialEntry, MaterialInventory, BlueprintRequirement, EngineerInfo,
    TradeStation, TradeCommodity, TradeRoute,
    CarrierJump, CarrierCargo, CarrierFinance,
    PowerplayState, ControlSystem,
    PowerplaySystemType, PowerplaySystem, PowerplayPowerData,
    ThargoidWarState, TitanInfo, ColonyState,
    ConstructionResource, ConstructionSite, ColonySystem,
    EconAudit, TierPoints, SiteTypeValidity,
    PlannedModification, MaterialCost, EngineerVisit, EngineeringPlan,
    MATERIAL_CAPS, MICRO_RESOURCE_CAPS,
    POWERS, POWERPLAY_SALARIES, POWERPLAY_SYSTEM_TYPES,
    THARGOID_WAR_STATE_NAMES, TITAN_NAMES, TITANS, COLONY_STATE_NAMES,
    map_sys_unlocks,
    create_inventory, update_inventory, can_craft_blueprint,
    get_all_engineers, find_engineer, get_engineer_unlock_requirements,
    get_engineers_by_type, estimate_engineer_progress,
    plan_engineering, get_blueprint_components,
    get_experimental_effect_components, get_engineers_for_blueprint,
    calculate_trade_profit, rank_trade_routes, filter_trade_routes,
    calculate_jump_fuel_cost, estimate_jump_time,
    calculate_weekly_maintenance, can_afford_maintenance,
    get_merits_for_rank, merits_to_next_rank,
    get_powerplay_salary, estimate_merits_bracket, estimate_merits_per_hour,
    get_titan_by_name, get_titan_by_system, get_all_titans,
    get_defeated_titans, parse_thargoid_war_state,
    create_construction_site, get_resource_shortfall,
    get_total_progress, parse_colonisation_construction_depot,
    calculate_colony_economies2, apply_body_type, apply_strong_links2,
    apply_strong_link_boost, apply_buffs, body_is_tidal_to_star,
    build_system_model2, sum_tier_points, apply_tax,
    is_type_valid2, get_pre_req_needed, has_pre_req2,
    predict_surface_slots, get_snapshot,
)

# --- data maps ---
from .data.maps import (
    get_ship_display_name, parse_module_symbol,
    get_module_display_name, get_module_by_ed_id,
    get_ship_by_ed_id, get_commodity_by_symbol, get_engineer_by_ed_id,
    SHIP_NAME_MAP, COMPANION_CATEGORY_MAP,
    SLOT_NAME_MAP, WEAPON_MOUNT_MAP, EDSHIPYARD_SLOT_MAP,
)
