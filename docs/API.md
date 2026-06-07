# Elite Dangerous SDK API Reference

## @elite-dangerous-sdk/companion

### generateCodeVerifier

File: `core\packages\companion\src\auth.ts`

Required User-Agent format per Frontier: EDCD-<AppName>-<version>

### FrontierTokenResponse

File: `core\packages\companion\src\auth.ts`

Required User-Agent format per Frontier: EDCD-<AppName>-<version>

### FrontierAuthConfig

File: `core\packages\companion\src\auth.ts`

Required User-Agent format per Frontier: EDCD-<AppName>-<version>

### StoredTokens

File: `core\packages\companion\src\auth.ts`

Required User-Agent format per Frontier: EDCD-<AppName>-<version>

### FrontierAuth

File: `core\packages\companion\src\auth.ts`

Required User-Agent format per Frontier: EDCD-<AppName>-<version>

### GalaxyType

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### CapClientOptions

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### CapShipResponse

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### CapProfileResponse

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### CapMarketResponse

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### CapShipyardResponse

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### CapJournalResponse

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### CapFleetCarrierResponse

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### CapCommunityGoal

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### CompanionClient

File: `core\packages\companion\src\client.ts`

CAPI endpoints: - /profile          -> Commander profile (ships, cargo, location) - /market           -> Station commodity market - /shipyard         -> Station shipyard + outfitting - /fleetcarrier     -> Fleet carrier info - /journal          -> Journal log lines - /communitygoals   -> Active community goals - /visitedstars     -> Visited stars cache download

### Flags

File: `core\packages\companion\src\flags.ts`

Status.json Flags (Flags field) - bitflag definitions These match the constants used in EDMarketConnector and the game client

### Flags2

File: `core\packages\companion\src\flags.ts`

### GuiFocus

File: `core\packages\companion\src\flags.ts`

### LegalStatus

File: `core\packages\companion\src\flags.ts`

### ModuleFlag

File: `core\packages\companion\src\flags.ts`

## @elite-dangerous-sdk/data

### colonizationCosts

File: `core\packages\data\src\colonization-costs.ts`

### getColonizationCosts

File: `core\packages\data\src\colonization-costs.ts`

Get cargo costs for a given build type display name (e.g. "Coriolis Starport").

### getTotalHaul

File: `core\packages\data\src\colonization-costs.ts`

Get the total haul tonnage for a given build type.

### siteTypes

File: `core\packages\data\src\colonization-sites.ts`

### getSiteType

File: `core\packages\data\src\colonization-sites.ts`

### primaryPortsT1

File: `core\packages\data\src\colonization-sites.ts`

### primaryPortsT2

File: `core\packages\data\src\colonization-sites.ts`

### primaryPortsT3

File: `core\packages\data\src\colonization-sites.ts`

### mapSitePads

File: `core\packages\data\src\colonization-sites.ts`

### Economy

File: `core\packages\data\src\colonization-types.ts`

### ConcreteEconomy

File: `core\packages\data\src\colonization-types.ts`

### EconomyMap

File: `core\packages\data\src\colonization-types.ts`

### BuildClass

File: `core\packages\data\src\colonization-types.ts`

### PadSize

File: `core\packages\data\src\colonization-types.ts`

### PreReq

File: `core\packages\data\src\colonization-types.ts`

### SysEffects

File: `core\packages\data\src\colonization-types.ts`

### SYS_EFFECT_KEYS

File: `core\packages\data\src\colonization-types.ts`

### SiteType

File: `core\packages\data\src\colonization-types.ts`

### ReserveLevel

File: `core\packages\data\src\colonization-types.ts`

### BuildStatus

File: `core\packages\data\src\colonization-types.ts`

### SysUnlocks

File: `core\packages\data\src\colonization-types.ts`

### STELLAR_REMNANTS

File: `core\packages\data\src\colonization-types.ts`

### getModuleByEdId

File: `core\packages\data\src\lookups.ts`

### getShipByEdId

File: `core\packages\data\src\lookups.ts`

### getCommodityBySymbol

File: `core\packages\data\src\lookups.ts`

### getEngineerByEdId

File: `core\packages\data\src\lookups.ts`

### SuitType

File: `core\packages\data\src\on-foot-engineering.ts`

### WeaponManufacturer

File: `core\packages\data\src\on-foot-engineering.ts`

### WeaponCategory

File: `core\packages\data\src\on-foot-engineering.ts`

### WeaponSize

File: `core\packages\data\src\on-foot-engineering.ts`

### FireMode

File: `core\packages\data\src\on-foot-engineering.ts`

### SuitBaseStats

File: `core\packages\data\src\on-foot-engineering.ts`

### WeaponBaseStats

File: `core\packages\data\src\on-foot-engineering.ts`

### UpgradeMaterialCost

File: `core\packages\data\src\on-foot-engineering.ts`

### OnFootModification

File: `core\packages\data\src\on-foot-engineering.ts`

### OnFootPlannedUpgrade

File: `core\packages\data\src\on-foot-engineering.ts`

### OnFootPlannedMaterial

File: `core\packages\data\src\on-foot-engineering.ts`

### OnFootPlan

File: `core\packages\data\src\on-foot-engineering.ts`

### SUIT_BASE_STATS

File: `core\packages\data\src\on-foot-engineering.ts`

### WEAPON_BASE_STATS

File: `core\packages\data\src\on-foot-engineering.ts`

### SUIT_UPGRADE_COSTS

File: `core\packages\data\src\on-foot-engineering.ts`

### WEAPON_UPGRADE_COSTS

File: `core\packages\data\src\on-foot-engineering.ts`

### ON_FOOT_MODIFICATIONS

File: `core\packages\data\src\on-foot-engineering.ts`

### getUpgradeCost

File: `core\packages\data\src\on-foot-engineering.ts`

### getModificationDetails

File: `core\packages\data\src\on-foot-engineering.ts`

### getAvailableModifications

File: `core\packages\data\src\on-foot-engineering.ts`

### planOnFootEngineering

File: `core\packages\data\src\on-foot-engineering.ts`

### resolveModule

File: `core\packages\data\src\resolver.ts`

### resolveShip

File: `core\packages\data\src\resolver.ts`

### resolveShipByName

File: `core\packages\data\src\resolver.ts`

### resolveCommodity

File: `core\packages\data\src\resolver.ts`

### resolveEngineer

File: `core\packages\data\src\resolver.ts`

### resolveEngineerByName

File: `core\packages\data\src\resolver.ts`

### resolveMaterial

File: `core\packages\data\src\resolver.ts`

### resolveMaterialBySymbol

File: `core\packages\data\src\resolver.ts`

### resolveMicroresource

File: `core\packages\data\src\resolver.ts`

### resolveMicroresourceBySymbol

File: `core\packages\data\src\resolver.ts`

### resolveOutfitting

File: `core\packages\data\src\resolver.ts`

### resolveShipyard

File: `core\packages\data\src\resolver.ts`

## @elite-dangerous-sdk/eddn

### UPLOAD_URL

File: `core\packages\eddn\src\client.ts`

EDDN (Elite Dangerous Data Network) Client  EDDN is a ZeroMQ service that allows players to share game data.  Sending:   POST https://eddn.edcd.io:4430/upload/   Port 4430, HTTPS required  Receiving:   tcp://eddn.edcd.io:9500   Subscribe to '' (empty topic) to receive everything   Messages are zlib-decompressed JSON  Docs: https://github.com/EDCD/EDDN/blob/live/docs/Developers.md

### RELAY_URL

File: `core\packages\eddn\src\client.ts`

EDDN (Elite Dangerous Data Network) Client  EDDN is a ZeroMQ service that allows players to share game data.  Sending:   POST https://eddn.edcd.io:4430/upload/   Port 4430, HTTPS required  Receiving:   tcp://eddn.edcd.io:9500   Subscribe to '' (empty topic) to receive everything   Messages are zlib-decompressed JSON  Docs: https://github.com/EDCD/EDDN/blob/live/docs/Developers.md

### EDDNMessageHeader

File: `core\packages\eddn\src\client.ts`

EDDN (Elite Dangerous Data Network) Client  EDDN is a ZeroMQ service that allows players to share game data.  Sending:   POST https://eddn.edcd.io:4430/upload/   Port 4430, HTTPS required  Receiving:   tcp://eddn.edcd.io:9500   Subscribe to '' (empty topic) to receive everything   Messages are zlib-decompressed JSON  Docs: https://github.com/EDCD/EDDN/blob/live/docs/Developers.md

### EDDNMessage

File: `core\packages\eddn\src\client.ts`

EDDN (Elite Dangerous Data Network) Client  EDDN is a ZeroMQ service that allows players to share game data.  Sending:   POST https://eddn.edcd.io:4430/upload/   Port 4430, HTTPS required  Receiving:   tcp://eddn.edcd.io:9500   Subscribe to '' (empty topic) to receive everything   Messages are zlib-decompressed JSON  Docs: https://github.com/EDCD/EDDN/blob/live/docs/Developers.md

### EDDNSenderConfig

File: `core\packages\eddn\src\client.ts`

EDDN (Elite Dangerous Data Network) Client  EDDN is a ZeroMQ service that allows players to share game data.  Sending:   POST https://eddn.edcd.io:4430/upload/   Port 4430, HTTPS required  Receiving:   tcp://eddn.edcd.io:9500   Subscribe to '' (empty topic) to receive everything   Messages are zlib-decompressed JSON  Docs: https://github.com/EDCD/EDDN/blob/live/docs/Developers.md

### EDDNClient

File: `core\packages\eddn\src\client.ts`

EDDN (Elite Dangerous Data Network) Client  EDDN is a ZeroMQ service that allows players to share game data.  Sending:   POST https://eddn.edcd.io:4430/upload/   Port 4430, HTTPS required  Receiving:   tcp://eddn.edcd.io:9500   Subscribe to '' (empty topic) to receive everything   Messages are zlib-decompressed JSON  Docs: https://github.com/EDCD/EDDN/blob/live/docs/Developers.md

### EDDNReceiverConfig

File: `core\packages\eddn\src\receiver.ts`

EDDN message receiver using ZeroMQ

### EDDNReceiver

File: `core\packages\eddn\src\receiver.ts`

EDDN message receiver using ZeroMQ

### EDDN_SCHEMAS

File: `core\packages\eddn\src\schemas.ts`

EDDN schema references and validation utilities. Official schema URLs from https://github.com/EDCD/EDDN/tree/live/schemas

### EddnSchemaRef

File: `core\packages\eddn\src\schemas.ts`

EDDN schema references and validation utilities. Official schema URLs from https://github.com/EDCD/EDDN/tree/live/schemas

### validateCommodityMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a commodity/market message before sending to EDDN. Returns array of validation error messages (empty = valid).

### validateShipyardMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a shipyard message before sending to EDDN.

### validateOutfittingMessage

File: `core\packages\eddn\src\schemas.ts`

Validate an outfitting message before sending to EDDN.

### validateFcMaterialsMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a fleet carrier materials message.

### validateJournalMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a fleet carrier materials message.

### validateBlackmarketMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a fleet carrier materials message.

### validateNavRouteMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a fleet carrier materials message.

### validateFcMaterialsJournalMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a fleet carrier materials message.

### validateApproachSettlementMessage

File: `core\packages\eddn\src\schemas.ts`

Validate an approach settlement message.

### validateNavRouteClearMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a nav route clear message.

### validateScanMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a scan/exploration message.

### validateCodeEntryMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a code entry message.

### validateFssDiscoveredMessage

File: `core\packages\eddn\src\schemas.ts`

Validate an FSS discovered message.

### validateSaaSignalsFoundMessage

File: `core\packages\eddn\src\schemas.ts`

Validate an SAA signals found message.

### validateFsdJumpMessage

File: `core\packages\eddn\src\schemas.ts`

Validate an FSD jump message.

### validateLocationMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a location message.

### validateCarrierJumpMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a carrier jump message.

### validateDispatchMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a dispatch message.

### validateBackpackMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a backpack message.

### validateShipLockerMessage

File: `core\packages\eddn\src\schemas.ts`

Validate a ship locker message.

### validateEDDN

File: `core\packages\eddn\src\schemas.ts`

Validates a raw EDDN message by inspecting its `$schemaRef` field.  Accepts a full EDDN message object (with `$schemaRef`, `header`, `message`). Returns an array of validation error strings (empty = valid). Returns `["unknown schema: <ref>"]` if the schema ref is not recognized.

## @elite-dangerous-sdk/edsm

### EDSM_BASE

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### EDSMConfig

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### SystemResponse

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### BodyInfo

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### StationInfo

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### MarketData

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### ShipyardData

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### OutfittingData

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### EstimatedValue

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### FactionInfo

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### CommanderRanksResponse

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### CommanderLogEntry

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### CommanderLogsResponse

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### SubmitJournalData

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### JournalSubmitResponse

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

### EDSMClient

File: `core\packages\edsm\src\client.ts`

EDSM (Elite Dangerous Star Map) API Client  API docs: https://www.edsm.net/en/api-v1 System API: https://www.edsm.net/en/api-system-v1 Community API: https://www.edsm.net/en/api-community-v1

## @elite-dangerous-sdk/elitebgs

### ELITEBGS_BASE

File: `core\packages\elitebgs\src\client.ts`

EliteBGS API V5 Client  API docs: https://elitebgs.app/ebgs/ Rate limit: 20 requests per minute (shared per IP) Base URL: https://elitebgs.app/api/ebgs/v5

### EliteBGSClient

File: `core\packages\elitebgs\src\client.ts`

EliteBGS API V5 Client  API docs: https://elitebgs.app/ebgs/ Rate limit: 20 requests per minute (shared per IP) Base URL: https://elitebgs.app/api/ebgs/v5

### PaginatedResponse

File: `core\packages\elitebgs\src\types.ts`

### TickTime

File: `core\packages\elitebgs\src\types.ts`

### FactionPresence

File: `core\packages\elitebgs\src\types.ts`

### StateEntry

File: `core\packages\elitebgs\src\types.ts`

### ConflictEntry

File: `core\packages\elitebgs\src\types.ts`

### EBGSSystem

File: `core\packages\elitebgs\src\types.ts`

### EBGSFaction

File: `core\packages\elitebgs\src\types.ts`

### EBGSStation

File: `core\packages\elitebgs\src\types.ts`

### SystemsQuery

File: `core\packages\elitebgs\src\types.ts`

### FactionsQuery

File: `core\packages\elitebgs\src\types.ts`

### StationsQuery

File: `core\packages\elitebgs\src\types.ts`

### TicksQuery

File: `core\packages\elitebgs\src\types.ts`

## @elite-dangerous-sdk/inara

### INARA_ENDPOINT

File: `core\packages\inara\src\client.ts`

Inara API client for Elite Dangerous  API docs: https://inara.cz/elite/inara-api-docs/ Dev guide: https://inara.cz/elite/inara-api-devguide/ Endpoint: POST https://inara.cz/inapi/v1/  Rate limit: 2 requests per minute max

### InaraHeader

File: `core\packages\inara\src\client.ts`

Inara API client for Elite Dangerous  API docs: https://inara.cz/elite/inara-api-docs/ Dev guide: https://inara.cz/elite/inara-api-devguide/ Endpoint: POST https://inara.cz/inapi/v1/  Rate limit: 2 requests per minute max

### InaraEvent

File: `core\packages\inara\src\client.ts`

Inara API client for Elite Dangerous  API docs: https://inara.cz/elite/inara-api-docs/ Dev guide: https://inara.cz/elite/inara-api-devguide/ Endpoint: POST https://inara.cz/inapi/v1/  Rate limit: 2 requests per minute max

### InaraRequest

File: `core\packages\inara\src\client.ts`

Inara API client for Elite Dangerous  API docs: https://inara.cz/elite/inara-api-docs/ Dev guide: https://inara.cz/elite/inara-api-devguide/ Endpoint: POST https://inara.cz/inapi/v1/  Rate limit: 2 requests per minute max

### InaraEventResult

File: `core\packages\inara\src\client.ts`

Inara API client for Elite Dangerous  API docs: https://inara.cz/elite/inara-api-docs/ Dev guide: https://inara.cz/elite/inara-api-devguide/ Endpoint: POST https://inara.cz/inapi/v1/  Rate limit: 2 requests per minute max

### InaraResponse

File: `core\packages\inara\src\client.ts`

Inara API client for Elite Dangerous  API docs: https://inara.cz/elite/inara-api-docs/ Dev guide: https://inara.cz/elite/inara-api-devguide/ Endpoint: POST https://inara.cz/inapi/v1/  Rate limit: 2 requests per minute max

### InaraClient

File: `core\packages\inara\src\client.ts`

Inara API client for Elite Dangerous  API docs: https://inara.cz/elite/inara-api-docs/ Dev guide: https://inara.cz/elite/inara-api-devguide/ Endpoint: POST https://inara.cz/inapi/v1/  Rate limit: 2 requests per minute max

### InaraEventName

File: `core\packages\inara\src\types.ts`

### InaraFriendEvent

File: `core\packages\inara\src\types.ts`

### InaraPermitEvent

File: `core\packages\inara\src\types.ts`

### InaraRankEngineerEvent

File: `core\packages\inara\src\types.ts`

### InaraRankPilotEvent

File: `core\packages\inara\src\types.ts`

### InaraRankPowerEvent

File: `core\packages\inara\src\types.ts`

### InaraReputationEvent

File: `core\packages\inara\src\types.ts`

### InaraInventoryItemEvent

File: `core\packages\inara\src\types.ts`

### InaraCargoItemEvent

File: `core\packages\inara\src\types.ts`

### InaraMaterialEvent

File: `core\packages\inara\src\types.ts`

### InaraShipEvent

File: `core\packages\inara\src\types.ts`

### InaraShipTransferEvent

File: `core\packages\inara\src\types.ts`

### InaraMissionEvent

File: `core\packages\inara\src\types.ts`

### InaraCombatEvent

File: `core\packages\inara\src\types.ts`

### InaraStorageModuleEvent

File: `core\packages\inara\src\types.ts`

## @elite-dangerous-sdk/journal

### MaterialEntry

File: `core\packages\journal\src\commander-state.ts`

### MissionState

File: `core\packages\journal\src\commander-state.ts`

### ShipModuleState

File: `core\packages\journal\src\commander-state.ts`

### FactionStateInfo

File: `core\packages\journal\src\commander-state.ts`

### ConflictInfo

File: `core\packages\journal\src\commander-state.ts`

### SquadronInfo

File: `core\packages\journal\src\commander-state.ts`

### CommanderState

File: `core\packages\journal\src\commander-state.ts`

### CommanderStateEngine

File: `core\packages\journal\src\commander-state.ts`

### JournalStreamOptions

File: `core\packages\journal\src\journal-stream.ts`

### JournalStream

File: `core\packages\journal\src\journal-stream.ts`

### createJournalStream

File: `core\packages\journal\src\journal-stream.ts`

### getJournalDirectory

File: `core\packages\journal\src\Journal.ts`

### listJournalFiles

File: `core\packages\journal\src\Journal.ts`

### Journal

File: `core\packages\journal\src\Journal.ts`

### JournalReplayOptions

File: `core\packages\journal\src\JournalReplay.ts`

### ReplayState

File: `core\packages\journal\src\JournalReplay.ts`

### JournalReplay

File: `core\packages\journal\src\JournalReplay.ts`

### JournalWatcher

File: `core\packages\journal\src\JournalWatcher.ts`

### parseLine

File: `core\packages\journal\src\parser.ts`

### parseWithBigInt

File: `core\packages\journal\src\parser.ts`

### parseWithLossyIntegers

File: `core\packages\journal\src\parser.ts`

### stringifyEvent

File: `core\packages\journal\src\parser.ts`

### stringifyBigIntJSON

File: `core\packages\journal\src\parser.ts`

### isEventType

File: `core\packages\journal\src\parser.ts`

### JournalQuery

File: `core\packages\journal\src\query.ts`

### query

File: `core\packages\journal\src\query.ts`

### countWhere

File: `core\packages\journal\src\query.ts`

### filterWhere

File: `core\packages\journal\src\query.ts`

### countByType

File: `core\packages\journal\src\query.ts`

### ID

File: `core\packages\journal\src\types.ts`

### FileHeader

File: `core\packages\journal\src\types.ts`

### LoadGame

File: `core\packages\journal\src\types.ts`

### Location

File: `core\packages\journal\src\types.ts`

### FSDJump

File: `core\packages\journal\src\types.ts`

### Docked

File: `core\packages\journal\src\types.ts`

### Undocked

File: `core\packages\journal\src\types.ts`

### Scan

File: `core\packages\journal\src\types.ts`

### SupercruiseEntry

File: `core\packages\journal\src\types.ts`

### SupercruiseExit

File: `core\packages\journal\src\types.ts`

### Touchdown

File: `core\packages\journal\src\types.ts`

### Liftoff

File: `core\packages\journal\src\types.ts`

### StartJump

File: `core\packages\journal\src\types.ts`

### FuelScoop

File: `core\packages\journal\src\types.ts`

### MaterialCollected

File: `core\packages\journal\src\types.ts`

### MaterialDiscarded

File: `core\packages\journal\src\types.ts`

### MaterialDiscovered

File: `core\packages\journal\src\types.ts`

### MaterialTrade

File: `core\packages\journal\src\types.ts`

### EngineerCraft

File: `core\packages\journal\src\types.ts`

### EngineerApply

File: `core\packages\journal\src\types.ts`

### EngineerProgress

File: `core\packages\journal\src\types.ts`

### Synthesis

File: `core\packages\journal\src\types.ts`

### Bounty

File: `core\packages\journal\src\types.ts`

### Promotion

File: `core\packages\journal\src\types.ts`

### Progress

File: `core\packages\journal\src\types.ts`

### Rank

File: `core\packages\journal\src\types.ts`

### CommitCrime

File: `core\packages\journal\src\types.ts`

### RedeemVoucher

File: `core\packages\journal\src\types.ts`

### MissionAccepted

File: `core\packages\journal\src\types.ts`

### MissionCompleted

File: `core\packages\journal\src\types.ts`

### MissionFailed

File: `core\packages\journal\src\types.ts`

### MissionAbandoned

File: `core\packages\journal\src\types.ts`

### MissionRedirected

File: `core\packages\journal\src\types.ts`

### CommunityGoal

File: `core\packages\journal\src\types.ts`

### CommunityGoalJoin

File: `core\packages\journal\src\types.ts`

### CommunityGoalReward

File: `core\packages\journal\src\types.ts`

### CommunityGoalDiscard

File: `core\packages\journal\src\types.ts`

### Screenshot

File: `core\packages\journal\src\types.ts`

### Music

File: `core\packages\journal\src\types.ts`

### SendText

File: `core\packages\journal\src\types.ts`

### ReceiveText

File: `core\packages\journal\src\types.ts`

### LaunchFighter

File: `core\packages\journal\src\types.ts`

### LaunchSRV

File: `core\packages\journal\src\types.ts`

### DockFighter

File: `core\packages\journal\src\types.ts`

### DockSRV

File: `core\packages\journal\src\types.ts`

### FighterDestroyed

File: `core\packages\journal\src\types.ts`

### SRVDestroyed

File: `core\packages\journal\src\types.ts`

### HullDamage

File: `core\packages\journal\src\types.ts`

### ShieldState

File: `core\packages\journal\src\types.ts`

### HeatWarning

File: `core\packages\journal\src\types.ts`

### HeatDamage

File: `core\packages\journal\src\types.ts`

### FuelStatus

File: `core\packages\journal\src\types.ts`

### SelfDestruct

File: `core\packages\journal\src\types.ts`

### Died

File: `core\packages\journal\src\types.ts`

### Resurrect

File: `core\packages\journal\src\types.ts`

### ApproachBody

File: `core\packages\journal\src\types.ts`

### LeaveBody

File: `core\packages\journal\src\types.ts`

### NavBeaconScan

File: `core\packages\journal\src\types.ts`

### FSSSignalDiscovered

File: `core\packages\journal\src\types.ts`

### FSSBodySignals

File: `core\packages\journal\src\types.ts`

### SAASignalsFound

File: `core\packages\journal\src\types.ts`

### CodexEntry

File: `core\packages\journal\src\types.ts`

### PlanetApproach

File: `core\packages\journal\src\types.ts`

### SAAscanComplete

File: `core\packages\journal\src\types.ts`

### DockingRequested

File: `core\packages\journal\src\types.ts`

### DockingGranted

File: `core\packages\journal\src\types.ts`

### DockingDenied

File: `core\packages\journal\src\types.ts`

### DockingCancelled

File: `core\packages\journal\src\types.ts`

### DockingTimeout

File: `core\packages\journal\src\types.ts`

### Undocking

File: `core\packages\journal\src\types.ts`

### CarrierJump

File: `core\packages\journal\src\types.ts`

### CarrierJumpRequest

File: `core\packages\journal\src\types.ts`

### CarrierBuy

File: `core\packages\journal\src\types.ts`

### CarrierSell

File: `core\packages\journal\src\types.ts`

### CarrierStats

File: `core\packages\journal\src\types.ts`

### CarrierFinance

File: `core\packages\journal\src\types.ts`

### CarrierShipPack

File: `core\packages\journal\src\types.ts`

### CarrierModulePack

File: `core\packages\journal\src\types.ts`

### CarrierTradeOrder

File: `core\packages\journal\src\types.ts`

### CarrierDeploy

File: `core\packages\journal\src\types.ts`

### CarrierNameChange

File: `core\packages\journal\src\types.ts`

### CarrierCrewService

File: `core\packages\journal\src\types.ts`

### CarrierBankTransfer

File: `core\packages\journal\src\types.ts`

### ShipTargeted

File: `core\packages\journal\src\types.ts`

### CapShipBond

File: `core\packages\journal\src\types.ts`

### FactionKillBond

File: `core\packages\journal\src\types.ts`

### PVPKill

File: `core\packages\journal\src\types.ts`

### PayFines

File: `core\packages\journal\src\types.ts`

### PayLegacyFines

File: `core\packages\journal\src\types.ts`

### CollectItems

File: `core\packages\journal\src\types.ts`

### EjectCargo

File: `core\packages\journal\src\types.ts`

### MiningRefined

File: `core\packages\journal\src\types.ts`

### ProspectedAsteroid

File: `core\packages\journal\src\types.ts`

### ReservoirReplenished

File: `core\packages\journal\src\types.ts`

### RefuelPartial

File: `core\packages\journal\src\types.ts`

### RefuelAll

File: `core\packages\journal\src\types.ts`

### Repair

File: `core\packages\journal\src\types.ts`

### RepairAll

File: `core\packages\journal\src\types.ts`

### BuyAmmo

File: `core\packages\journal\src\types.ts`

### BuyDrones

File: `core\packages\journal\src\types.ts`

### SellDrones

File: `core\packages\journal\src\types.ts`

### BuyTradeData

File: `core\packages\journal\src\types.ts`

### Market

File: `core\packages\journal\src\types.ts`

### MarketBuy

File: `core\packages\journal\src\types.ts`

### MarketSell

File: `core\packages\journal\src\types.ts`

### BuyExplorationData

File: `core\packages\journal\src\types.ts`

### SellExplorationData

File: `core\packages\journal\src\types.ts`

### DataScanned

File: `core\packages\journal\src\types.ts`

### AfmuRepairs

File: `core\packages\journal\src\types.ts`

### RebootRepair

File: `core\packages\journal\src\types.ts`

### RestockVehicle

File: `core\packages\journal\src\types.ts`

### Continued

File: `core\packages\journal\src\types.ts`

### Shutdown

File: `core\packages\journal\src\types.ts`

### ModuleInfo

File: `core\packages\journal\src\types.ts`

### NavRoute

File: `core\packages\journal\src\types.ts`

### NavRouteClear

File: `core\packages\journal\src\types.ts`

### SquadronStartup

File: `core\packages\journal\src\types.ts`

### InvitedToSquadron

File: `core\packages\journal\src\types.ts`

### JoinedSquadron

File: `core\packages\journal\src\types.ts`

### SquadronCreated

File: `core\packages\journal\src\types.ts`

### AppliedToSquadron

File: `core\packages\journal\src\types.ts`

### SquadronDemotion

File: `core\packages\journal\src\types.ts`

### SquadronPromotion

File: `core\packages\journal\src\types.ts`

### DisbandedSquadron

File: `core\packages\journal\src\types.ts`

### LeftSquadron

File: `core\packages\journal\src\types.ts`

### KickedFromSquadron

File: `core\packages\journal\src\types.ts`

### SquadronKicked

File: `core\packages\journal\src\types.ts`

### QuitACrew

File: `core\packages\journal\src\types.ts`

### JoinACrew

File: `core\packages\journal\src\types.ts`

### ChangeCrewAssignedRole

File: `core\packages\journal\src\types.ts`

### CrewHire

File: `core\packages\journal\src\types.ts`

### CrewFire

File: `core\packages\journal\src\types.ts`

### CrewLaunchFighter

File: `core\packages\journal\src\types.ts`

### CrewRoleRepair

File: `core\packages\journal\src\types.ts`

### CrewMemberJoins

File: `core\packages\journal\src\types.ts`

### CrewMemberQuits

File: `core\packages\journal\src\types.ts`

### CrewMemberRoleChange

File: `core\packages\journal\src\types.ts`

### KickCrewMember

File: `core\packages\journal\src\types.ts`

### EndCrewSession

File: `core\packages\journal\src\types.ts`

### WingJoin

File: `core\packages\journal\src\types.ts`

### WingLeave

File: `core\packages\journal\src\types.ts`

### WingAdd

File: `core\packages\journal\src\types.ts`

### WingInvite

File: `core\packages\journal\src\types.ts`

### Powerplay

File: `core\packages\journal\src\types.ts`

### PowerplayJoin

File: `core\packages\journal\src\types.ts`

### PowerplayLeave

File: `core\packages\journal\src\types.ts`

### PowerplayDefect

File: `core\packages\journal\src\types.ts`

### PowerplaySalary

File: `core\packages\journal\src\types.ts`

### PowerplayVote

File: `core\packages\journal\src\types.ts`

### PowerplayFastTrack

File: `core\packages\journal\src\types.ts`

### PowerplayDeliver

File: `core\packages\journal\src\types.ts`

### ApproachSettlement

File: `core\packages\journal\src\types.ts`

### ScanOrganic

File: `core\packages\journal\src\types.ts`

### SellOrganicData

File: `core\packages\journal\src\types.ts`

### Backpack

File: `core\packages\journal\src\types.ts`

### BackpackChange

File: `core\packages\journal\src\types.ts`

### ShipLocker

File: `core\packages\journal\src\types.ts`

### ShipLockerMaterials

File: `core\packages\journal\src\types.ts`

### FCMaterials

File: `core\packages\journal\src\types.ts`

### FCMaterialsCAPI

File: `core\packages\journal\src\types.ts`

### CollectMicroResources

File: `core\packages\journal\src\types.ts`

### UseConsumable

File: `core\packages\journal\src\types.ts`

### CreateSuitLoadout

File: `core\packages\journal\src\types.ts`

### DeleteSuitLoadout

File: `core\packages\journal\src\types.ts`

### RenameSuitLoadout

File: `core\packages\journal\src\types.ts`

### SwitchSuitLoadout

File: `core\packages\journal\src\types.ts`

### UpgradeSuit

File: `core\packages\journal\src\types.ts`

### UpgradeWeapon

File: `core\packages\journal\src\types.ts`

### BuySuit

File: `core\packages\journal\src\types.ts`

### SellSuit

File: `core\packages\journal\src\types.ts`

### BuyWeapon

File: `core\packages\journal\src\types.ts`

### SellWeapon

File: `core\packages\journal\src\types.ts`

### Disembark

File: `core\packages\journal\src\types.ts`

### Embark

File: `core\packages\journal\src\types.ts`

### BookTaxi

File: `core\packages\journal\src\types.ts`

### CancelTaxi

File: `core\packages\journal\src\types.ts`

### DropShipDeploy

File: `core\packages\journal\src\types.ts`

### TradeMicroResources

File: `core\packages\journal\src\types.ts`

### TransferMicroResources

File: `core\packages\journal\src\types.ts`

### BuyMicroResources

File: `core\packages\journal\src\types.ts`

### Status

File: `core\packages\journal\src\types.ts`

### DestinationStatus

File: `core\packages\journal\src\types.ts`

### StationEconomy

File: `core\packages\journal\src\types.ts`

### LandingPads

File: `core\packages\journal\src\types.ts`

### FactionState

File: `core\packages\journal\src\types.ts`

### StateTimeline

File: `core\packages\journal\src\types.ts`

### Conflict

File: `core\packages\journal\src\types.ts`

### ConflictFaction

File: `core\packages\journal\src\types.ts`

### ThargoidWarInfo

File: `core\packages\journal\src\types.ts`

### CommodityItem

File: `core\packages\journal\src\types.ts`

### ParentBody

File: `core\packages\journal\src\types.ts`

### Ring

File: `core\packages\journal\src\types.ts`

### AtmosphereComposition

File: `core\packages\journal\src\types.ts`

### Composition

File: `core\packages\journal\src\types.ts`

### Mission

File: `core\packages\journal\src\types.ts`

### EngineeringMod

File: `core\packages\journal\src\types.ts`

### Modifier

File: `core\packages\journal\src\types.ts`

### ModuleItem

File: `core\packages\journal\src\types.ts`

### ShipItem

File: `core\packages\journal\src\types.ts`

### JournalEvent

File: `core\packages\journal\src\types.ts`

### JournalPosition

File: `core\packages\journal\src\types.ts`

### JournalOptions

File: `core\packages\journal\src\types.ts`

### JOURNAL_DIRECTORY

File: `core\packages\journal\src\types.ts`

## @elite-dangerous-sdk/planner

### FactionState

File: `core\packages\planner\src\bgs.ts`

Background Simulation (BGS) Tools. Tracks faction influence, states, conflicts, and system information.

### FactionPresence

File: `core\packages\planner\src\bgs.ts`

Background Simulation (BGS) Tools. Tracks faction influence, states, conflicts, and system information.

### SystemBgsData

File: `core\packages\planner\src\bgs.ts`

Background Simulation (BGS) Tools. Tracks faction influence, states, conflicts, and system information.

### Conflict

File: `core\packages\planner\src\bgs.ts`

Background Simulation (BGS) Tools. Tracks faction influence, states, conflicts, and system information.

### getStateDescription

File: `core\packages\planner\src\bgs.ts`

Get the state description for a faction state.

### isPositiveState

File: `core\packages\planner\src\bgs.ts`

Check if a state is positive for influence growth.

### isNegativeState

File: `core\packages\planner\src\bgs.ts`

Check if a state is negative for influence.

### predictConflictWinner

File: `core\packages\planner\src\bgs.ts`

Determine which faction would win a conflict based on influence.

### StateEffect

File: `core\packages\planner\src\bgs.ts`

Determine which faction would win a conflict based on influence.

### factionStateEffect

File: `core\packages\planner\src\bgs.ts`

Get the effect of a BGS state on influence and activities.

### InfluenceEstimate

File: `core\packages\planner\src\bgs.ts`

Get the effect of a BGS state on influence and activities.

### influenceEffect

File: `core\packages\planner\src\bgs.ts`

Estimate influence change from BGS actions. Based on observed community data points (Frontier does not publish exact formulas).

### ConflictAnalysis

File: `core\packages\planner\src\bgs.ts`

Estimate influence change from BGS actions. Based on observed community data points (Frontier does not publish exact formulas).

### analyzeConflict

File: `core\packages\planner\src\bgs.ts`

Analyze a conflict and provide detailed breakdown.

### ExpansionTarget

File: `core\packages\planner\src\bgs.ts`

Analyze a conflict and provide detailed breakdown.

### expansionTargets

File: `core\packages\planner\src\bgs.ts`

Evaluate nearby systems as potential expansion targets for a faction.

### RetreatRisk

File: `core\packages\planner\src\bgs.ts`

Evaluate nearby systems as potential expansion targets for a faction.

### retreatRisk

File: `core\packages\planner\src\bgs.ts`

Assess the retreat risk for a faction presence. Factions below 2.5% influence are at risk of retreating. Factions in Retreat state below 5% are at critical risk.

### EconAudit

File: `core\packages\planner\src\colonization-economy.ts`

### BodyMap2

File: `core\packages\planner\src\colonization-economy.ts`

### SiteLinks2

File: `core\packages\planner\src\colonization-economy.ts`

### Rev

File: `core\packages\planner\src\colonization-economy.ts`

### NamedSave

File: `core\packages\planner\src\colonization-economy.ts`

### Pop

File: `core\packages\planner\src\colonization-economy.ts`

### SysMap2

File: `core\packages\planner\src\colonization-economy.ts`

### SiteMap2

File: `core\packages\planner\src\colonization-economy.ts`

### applyBodyType

File: `core\packages\planner\src\colonization-economy.ts`

### applyStrongLinks2

File: `core\packages\planner\src\colonization-economy.ts`

### applyStrongLinkBoost

File: `core\packages\planner\src\colonization-economy.ts`

### applyBuffs

File: `core\packages\planner\src\colonization-economy.ts`

### calculateColonyEconomies2

File: `core\packages\planner\src\colonization-economy.ts`

### bodyIsTidalToStar

File: `core\packages\planner\src\colonization-economy.ts`

### RawBod

File: `core\packages\planner\src\colonization-system.ts`

### RawSite

File: `core\packages\planner\src\colonization-system.ts`

### RawSys

File: `core\packages\planner\src\colonization-system.ts`

### TierPoints

File: `core\packages\planner\src\colonization-system.ts`

### SiteTypeValidity

File: `core\packages\planner\src\colonization-system.ts`

### SysSnapshot

File: `core\packages\planner\src\colonization-system.ts`

### mapSysUnlocks

File: `core\packages\planner\src\colonization-system.ts`

### buildSystemModel2

File: `core\packages\planner\src\colonization-system.ts`

### sumTierPoints

File: `core\packages\planner\src\colonization-system.ts`

### applyTax

File: `core\packages\planner\src\colonization-system.ts`

### getPreReqNeeded

File: `core\packages\planner\src\colonization-system.ts`

### hasPreReq2

File: `core\packages\planner\src\colonization-system.ts`

### isTypeValid2

File: `core\packages\planner\src\colonization-system.ts`

### predictSurfaceSlots

File: `core\packages\planner\src\colonization-system.ts`

### getSnapshot

File: `core\packages\planner\src\colonization-system.ts`

### COLONY_STATE_NAMES

File: `core\packages\planner\src\colonization.ts`

### ConstructionResource

File: `core\packages\planner\src\colonization.ts`

### ConstructionSite

File: `core\packages\planner\src\colonization.ts`

### ColonySystem

File: `core\packages\planner\src\colonization.ts`

### createConstructionSite

File: `core\packages\planner\src\colonization.ts`

### getResourceShortfall

File: `core\packages\planner\src\colonization.ts`

### getTotalProgress

File: `core\packages\planner\src\colonization.ts`

### parseColonisationConstructionDepot

File: `core\packages\planner\src\colonization.ts`

### ShipComparisonRow

File: `core\packages\planner\src\compare.ts`

### compareShips

File: `core\packages\planner\src\compare.ts`

### formatComparisonTable

File: `core\packages\planner\src\compare.ts`

### MaterialRequirement

File: `core\packages\planner\src\dependency-graph.ts`

### TradeUpOption

File: `core\packages\planner\src\dependency-graph.ts`

### MissingMaterial

File: `core\packages\planner\src\dependency-graph.ts`

### BuildEvaluation

File: `core\packages\planner\src\dependency-graph.ts`

### tradeRatio

File: `core\packages\planner\src\dependency-graph.ts`

Compute material trader trade ratio: For same-category: 6^max(1, gradeDiff) lower-grade units → 1 higher-grade unit Same grade = 6:1, 1 apart = 6:1, 2 apart = 36:1, 3 apart = 216:1, 4 apart = 1296:1

### evaluateBuild

File: `core\packages\planner\src\dependency-graph.ts`

Evaluate a planned build against an optional inventory. Returns requirements, missing materials, and trade-up possibilities.

### EngineerInfo

File: `core\packages\planner\src\engineer.ts`

### EngineerBlueprint

File: `core\packages\planner\src\engineer.ts`

### EngineerProgress

File: `core\packages\planner\src\engineer.ts`

### EngineerUnlockData

File: `core\packages\planner\src\engineer.ts`

### ENGINEER_UNLOCK_DATA

File: `core\packages\planner\src\engineer.ts`

### getAllEngineers

File: `core\packages\planner\src\engineer.ts`

### findEngineer

File: `core\packages\planner\src\engineer.ts`

Find an engineer by name.

### getEngineerUnlockDetails

File: `core\packages\planner\src\engineer.ts`

Look up unlock requirements for any engineer. Returns the verified data from the Elite Dangerous wiki.

### getEngineerUnlockRequirements

File: `core\packages\planner\src\engineer.ts`

Get unlock requirements as formatted strings for display.

### getEngineersByType

File: `core\packages\planner\src\engineer.ts`

Get all engineers of a specific type.

### estimateEngineerProgress

File: `core\packages\planner\src\engineer.ts`

### PlannedModification

File: `core\packages\planner\src\engineering-planner.ts`

### MaterialCost

File: `core\packages\planner\src\engineering-planner.ts`

### EngineerVisit

File: `core\packages\planner\src\engineering-planner.ts`

### EngineeringPlan

File: `core\packages\planner\src\engineering-planner.ts`

### planEngineering

File: `core\packages\planner\src\engineering-planner.ts`

### getBlueprintComponents

File: `core\packages\planner\src\engineering-planner.ts`

### getExperimentalEffectComponents

File: `core\packages\planner\src\engineering-planner.ts`

### getEngineersForBlueprint

File: `core\packages\planner\src\engineering-planner.ts`

### SpeciesEntry

File: `core\packages\planner\src\exobiology.ts`

Exobiology tracker for Odyssey biological data. Species values from EDMC-BioScan (https://github.com/Silarn/EDMC-BioScan) Per-species base values range from 1,000,000 to 20,000,000 CR.

### GenusEntry

File: `core\packages\planner\src\exobiology.ts`

Exobiology tracker for Odyssey biological data. Species values from EDMC-BioScan (https://github.com/Silarn/EDMC-BioScan) Per-species base values range from 1,000,000 to 20,000,000 CR.

### BioSample

File: `core\packages\planner\src\exobiology.ts`

Exobiology tracker for Odyssey biological data. Species values from EDMC-BioScan (https://github.com/Silarn/EDMC-BioScan) Per-species base values range from 1,000,000 to 20,000,000 CR.

### GENUS_DATA

File: `core\packages\planner\src\exobiology.ts`

### findGenus

File: `core\packages\planner\src\exobiology.ts`

Find genus data by name (case-insensitive).

### findSpecies

File: `core\packages\planner\src\exobiology.ts`

Find species data within a genus.

### calculateScanValue

File: `core\packages\planner\src\exobiology.ts`

Calculate the expected value of a scan for a given species.  ACTUAL GAME MECHANICS (Odyssey):   - Each species has its own base value (1M–20M CR, from EDMC-BioScan)   - First Discovery = 4x bonus on top of base value (total 5x)   - No separate "complete set" bonus exists in the game   - Bonus is applied per-species per-body  @param speciesName The full species name (e.g. "Stratum Tectonicas") @param isFirstDiscovery Whether this is a first discovery on this body @returns Total scan value

### getSpeciesForGenus

File: `core\packages\planner\src\exobiology.ts`

Get all species names for a genus.

### getSpeciesValue

File: `core\packages\planner\src\exobiology.ts`

Get the base value for a specific species.

### CarrierJump

File: `core\packages\planner\src\fleetcarrier.ts`

### CarrierCargo

File: `core\packages\planner\src\fleetcarrier.ts`

### CarrierFinance

File: `core\packages\planner\src\fleetcarrier.ts`

### calculateJumpFuelCost

File: `core\packages\planner\src\fleetcarrier.ts`

Calculate carrier jump fuel cost. Verified formula from EDCD community and Frontier forums (https://forums.frontier.co.uk/threads/how-much-the-fleet-carrier-consumes-for-ly.563024/):   fuel = round(5 + distance_ly * (cargo_mass + fuel_mass + 25000) / 200000)  Where:   carrier_hull = 25,000t (constant)   cargo_mass = cargo hold usage (0-25,000t including installed services)   fuel_mass = tritium in fuel depot (0-1,000t)   Base fuel cost per jump = 5t   Maximum range per jump = 500 LY

### estimateJumpTime

File: `core\packages\planner\src\fleetcarrier.ts`

Estimate jump time including cooldown. Carrier jumps: ~15 min charge, instant jump, ~5 min cooldown = ~20 min total. Jump time does not depend on distance; all carrier jumps take the same time.

### calculateWeeklyMaintenance

File: `core\packages\planner\src\fleetcarrier.ts`

Calculate weekly carrier maintenance cost. Values are well-known community numbers:   Base upkeep: 5,000,000 CR/week   Services: 150,000 - 750,000 CR/week each

### canAffordMaintenance

File: `core\packages\planner\src\fleetcarrier.ts`

Determine if carrier can afford another week of maintenance.

### MaterialEntry

File: `core\packages\planner\src\material.ts`

### MaterialInventory

File: `core\packages\planner\src\material.ts`

### BlueprintRequirement

File: `core\packages\planner\src\material.ts`

### BlueprintCost

File: `core\packages\planner\src\material.ts`

### MATERIAL_CATEGORIES

File: `core\packages\planner\src\material.ts`

### MATERIAL_CAPS

File: `core\packages\planner\src\material.ts`

### MICRO_RESOURCE_CAPS

File: `core\packages\planner\src\material.ts`

### createInventory

File: `core\packages\planner\src\material.ts`

Create an empty material inventory.

### updateInventory

File: `core\packages\planner\src\material.ts`

Update inventory from a journal Material event (Materials or MaterialCollected/MaterialDiscarded).

### canCraftBlueprint

File: `core\packages\planner\src\material.ts`

Check if the inventory has enough materials for a blueprint grade.

### PowerName

File: `core\packages\planner\src\powerplay.ts`

Powerplay 2.0 tools for tracking standings, merits, and control systems. Ranks changed from 1-5 to 1-100 with Powerplay 2.0 (Update 18, 2024). Source: INARA Powerplay 2.0 guide, Elite Dangerous wiki.

### POWERS

File: `core\packages\planner\src\powerplay.ts`

Powerplay 2.0 tools for tracking standings, merits, and control systems. Ranks changed from 1-5 to 1-100 with Powerplay 2.0 (Update 18, 2024). Source: INARA Powerplay 2.0 guide, Elite Dangerous wiki.

### GalPower

File: `core\packages\planner\src\powerplay.ts`

Powerplay 2.0 tools for tracking standings, merits, and control systems. Ranks changed from 1-5 to 1-100 with Powerplay 2.0 (Update 18, 2024). Source: INARA Powerplay 2.0 guide, Elite Dangerous wiki.

### POWERPLAY_SYSTEM_TYPE_NAMES

File: `core\packages\planner\src\powerplay.ts`

### PowerplaySystem

File: `core\packages\planner\src\powerplay.ts`

### PowerplayPowerData

File: `core\packages\planner\src\powerplay.ts`

### PowerplayState

File: `core\packages\planner\src\powerplay.ts`

### ControlSystem

File: `core\packages\planner\src\powerplay.ts`

### getMeritsForRank

File: `core\packages\planner\src\powerplay.ts`

Merits required for each rank in Powerplay 2.0. Rank 1: 0 merits (complete initial 5 assignments) Rank 2: 2,000 merits Rank 3: 5,000 merits Rank 4: 9,000 merits Rank 5: 15,000 merits Ranks 6-99: previous rank + 8,000 merits Rank 100: 775,000 merits

### PowerplaySalaryBracket

File: `core\packages\planner\src\powerplay.ts`

Salary brackets for Powerplay 2.0. Salary is based on weekly merit percentile standing within a power, NOT on rank number. Every pledged commander who earns >= 1 merit qualifies.

### POWERPLAY_SALARIES

File: `core\packages\planner\src\powerplay.ts`

Salary for each bracket (weekly credits). Source: INARA Powerplay 2.0 guide.   top_100_pct:    500,000 CR (anyone who earned >= 1 merit)   top_75_pct:   2,500,000 CR   top_50_pct:   5,000,000 CR   top_25_pct:  10,000,000 CR   top_10_pct:  50,000,000 CR   top_10:     100,000,000 CR (exact rank position)   top_1:    1,000,000,000 CR (exact rank position)

### getPowerplaySalary

File: `core\packages\planner\src\powerplay.ts`

Salary for each bracket (weekly credits). Source: INARA Powerplay 2.0 guide.   top_100_pct:    500,000 CR (anyone who earned >= 1 merit)   top_75_pct:   2,500,000 CR   top_50_pct:   5,000,000 CR   top_25_pct:  10,000,000 CR   top_10_pct:  50,000,000 CR   top_10:     100,000,000 CR (exact rank position)   top_1:    1,000,000,000 CR (exact rank position)

### estimateMeritsBracket

File: `core\packages\planner\src\powerplay.ts`

Roughly estimate a salary bracket from weekly merit earnings.  **WARNING:** Actual Powerplay 2.0 salary brackets are determined by your percentile standing relative to other commanders in the same power, NOT by absolute merit count. The thresholds below are extremely coarse heuristics and WILL be wrong in many situations.  This function exists only as a rough guideline. For accurate bracket detection, query the Frontier CAPI or Inara API for your actual standing.

### meritsToNextRank

File: `core\packages\planner\src\powerplay.ts`

Calculate merits to next rank.

### estimateMeritsPerHour

File: `core\packages\planner\src\powerplay.ts`

Estimate merits earned per hour for a given activity (Powerplay 2.0). Powerplay 2.0 (Update 18) introduced 4x-20x merit multipliers, dramatically increasing rates vs Powerplay 1.0. Source: INARA Powerplay 2.0 guide, player reports.

### StationMarket

File: `core\packages\planner\src\route-optimizer.ts`

A station with its full market data (what it buys and sells).

### MultiHopRoute

File: `core\packages\planner\src\route-optimizer.ts`

A multi-hop trade route (sequence of hops).

### RouteOptimizerOptions

File: `core\packages\planner\src\route-optimizer.ts`

Options for route optimization.

### computeSingleHopRoutes

File: `core\packages\planner\src\route-optimizer.ts`

Compute all profitable single-hop routes between station pairs. A->B is profitable if A supplies a commodity that B demands at a higher price.

### findRoundTrips

File: `core\packages\planner\src\route-optimizer.ts`

Find profitable round-trip trade routes (A->B->A with different commodities).

### findMultiHopRoutes

File: `core\packages\planner\src\route-optimizer.ts`

Find multi-hop trade routes up to maxHops hops. For maxHops=2, equivalent to findRoundTrips. For maxHops=3, finds A->B->C->A loops.

### suggestMaterialFarming

File: `core\packages\planner\src\route-optimizer.ts`

Suggest material farming activities based on material category and grade. Returns a list of known activity sources for the given material.

### THARGOID_WAR_STATE_NAMES

File: `core\packages\planner\src\thargoid.ts`

### TitanName

File: `core\packages\planner\src\thargoid.ts`

### TitanInfo

File: `core\packages\planner\src\thargoid.ts`

### TITANS

File: `core\packages\planner\src\thargoid.ts`

### TITAN_NAMES

File: `core\packages\planner\src\thargoid.ts`

### getTitanByName

File: `core\packages\planner\src\thargoid.ts`

### getTitanBySystem

File: `core\packages\planner\src\thargoid.ts`

### getAllTitans

File: `core\packages\planner\src\thargoid.ts`

### getDefeatedTitans

File: `core\packages\planner\src\thargoid.ts`

### parseThargoidWarState

File: `core\packages\planner\src\thargoid.ts`

### TradeStation

File: `core\packages\planner\src\trade.ts`

### TradeCommodity

File: `core\packages\planner\src\trade.ts`

### TradeRoute

File: `core\packages\planner\src\trade.ts`

### TradeRouteFilter

File: `core\packages\planner\src\trade.ts`

### calculateTradeProfit

File: `core\packages\planner\src\trade.ts`

Calculate profit for a potential trade route.

### rankTradeRoutes

File: `core\packages\planner\src\trade.ts`

Rank trade routes by profitability.

### filterTradeRoutes

File: `core\packages\planner\src\trade.ts`

Filter trade routes by criteria.

### getCommodityType

File: `core\packages\planner\src\trade.ts`

Classify a commodity's trade type.

## @elite-dangerous-sdk/spansh

### SPANSH_BASE

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### SystemDetail

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### StationDetail

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### StationSearchRequest

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### StationSearchResponse

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### CommodityLocation

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### RouteRequest

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### RouteJump

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### RouteResult

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### NearestResult

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

### SpanshClient

File: `core\packages\spansh\src\client.ts`

Spansh API Client for Elite Dangerous  Endpoints:   GET  /api/system/<id64>                  - System data   GET  /api/station/<market_id>            - Station data   GET  /api/body/<body_id64>               - Body data   GET  /api/systems/field_values/system_names?q=<query>  - Type-ahead   GET  /api/search?q=<query>               - Quick search   GET  /api/commodity/sell/<ref>/<item>/<amount>  - Buy/sell locations   POST /api/stations/search                - Station search with filters   Route planning:   POST /api/route                        - Plot route between systems   GET  /api/nearest?system=<sys>&type=<type>  - Nearest POI of type  Community docs: https://github.com/EDCD/EDDI/issues/2327 Route docs: https://spansh.co.uk/api/route

## @elite-dangerous-sdk/stats

### DistributorResult

File: `core\packages\stats\src\distributor.ts`

### calculateDistributor

File: `core\packages\stats\src\distributor.ts`

### sysRechargeRate

File: `core\packages\stats\src\distributor.ts`

### wepRechargeRate

File: `core\packages\stats\src\distributor.ts`

### sysResistance

File: `core\packages\stats\src\distributor.ts`

### capacitorTime

File: `core\packages\stats\src\distributor.ts`

### StatModType

File: `core\packages\stats\src\engineering.ts`

### StatModMethod

File: `core\packages\stats\src\engineering.ts`

### StatMod

File: `core\packages\stats\src\engineering.ts`

### BlueprintFeatures

File: `core\packages\stats\src\engineering.ts`

### AppliedModification

File: `core\packages\stats\src\engineering.ts`

### GradeFeatures

File: `core\packages\stats\src\engineering.ts`

### Blueprint

File: `core\packages\stats\src\engineering.ts`

### getStatMod

File: `core\packages\stats\src\engineering.ts`

### applyBlueprintGrade

File: `core\packages\stats\src\engineering.ts`

### computeEngineeringChanges

File: `core\packages\stats\src\engineering.ts`

### getAvailableBlueprints

File: `core\packages\stats\src\engineering.ts`

### HullResult

File: `core\packages\stats\src\hull.ts`

### calculateHull

File: `core\packages\stats\src\hull.ts`

### JumpRangeResult

File: `core\packages\stats\src\jump.ts`

### calculateJumpRange

File: `core\packages\stats\src\jump.ts`

### EquippedModule

File: `core\packages\stats\src\loadout.ts`

### ModuleEngineering

File: `core\packages\stats\src\loadout.ts`

### Loadout

File: `core\packages\stats\src\loadout.ts`

### calculateTotalMass

File: `core\packages\stats\src\loadout.ts`

### SuitType

File: `core\packages\stats\src\on-foot.ts`

### WeaponManufacturer

File: `core\packages\stats\src\on-foot.ts`

### WeaponCategory

File: `core\packages\stats\src\on-foot.ts`

### WeaponSize

File: `core\packages\stats\src\on-foot.ts`

### FireMode

File: `core\packages\stats\src\on-foot.ts`

### ResistanceValues

File: `core\packages\stats\src\on-foot.ts`

### SuitStats

File: `core\packages\stats\src\on-foot.ts`

### WeaponStats

File: `core\packages\stats\src\on-foot.ts`

### calculateSuitStats

File: `core\packages\stats\src\on-foot.ts`

### calculateWeaponStats

File: `core\packages\stats\src\on-foot.ts`

### calculateEffectiveDps

File: `core\packages\stats\src\on-foot.ts`

### PowerResult

File: `core\packages\stats\src\power.ts`

### calculatePower

File: `core\packages\stats\src\power.ts`

### ShieldResult

File: `core\packages\stats\src\shield.ts`

### calculateShield

File: `core\packages\stats\src\shield.ts`

### SpeedResult

File: `core\packages\stats\src\speed.ts`

### calculateSpeed

File: `core\packages\stats\src\speed.ts`

### WeaponStat

File: `core\packages\stats\src\weapon.ts`

### WeaponStatsResult

File: `core\packages\stats\src\weapon.ts`

### calculateWeapons

File: `core\packages\stats\src\weapon.ts`

## @elite-dangerous-sdk/utils

### parseBitflags

File: `core\packages\utils\src\bitflags.ts`

### hasFlag

File: `core\packages\utils\src\bitflags.ts`

### combineFlags

File: `core\packages\utils\src\bitflags.ts`

### Coords

File: `core\packages\utils\src\coordinates.ts`

### distance

File: `core\packages\utils\src\coordinates.ts`

### sphereSearch

File: `core\packages\utils\src\coordinates.ts`

### midpoint

File: `core\packages\utils\src\coordinates.ts`

### bearing

File: `core\packages\utils\src\coordinates.ts`

### listify

File: `core\packages\utils\src\listify.ts`

Convert CAPI sparse object arrays to proper arrays with nulls for gaps. CAPI returns arrays as objects: {0: item0, 2: item2, ...}

## @elite-dangerous-sdk/ws-journal

### JournalWebSocketOptions

File: `core\packages\ws-journal\src\server.ts`

### JournalWebSocketServer

File: `core\packages\ws-journal\src\server.ts`

