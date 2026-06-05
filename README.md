# Elite Dangerous SDK

A multi-language SDK for building Elite Dangerous 3rd party tools. Covers the player journal, Frontier Companion API (CAPI), all major community APIs (EDSM, Inara, EDDN, Spansh, EliteBGS), embedded game data (FDevIDs, coriolis-data), ship stats calculator, and game planner tools (engineering, trade routes, fleet carriers, powerplay 2.0, BGS, thargoid war, colonization, exobiology).

## Architecture

```
elite-dangerous-sdk/
├── specs/                     # Schemas + game data (single source of truth)
│   ├── journal/               # ~170 journal event schemas + companion file schemas
│   ├── companion/             # CAPI endpoint response schemas
│   ├── community/             # EDSM, Inara, Spansh, EliteBGS schemas
│   └── data/                  # Game data (FDevIDs, coriolis)
│       ├── fdevids/           # EDCD/FDevIDs CSV files
│       ├── coriolis/          # EDCD/coriolis-data JSON
│       └── json/              # CSVs converted to JSON
├── core/                      # TypeScript monorepo
│   ├── packages/
│   │   ├── journal/           # Journal reader, watcher, parser + typed events
│   │   ├── companion/         # CAPI oAuth2 client + endpoints
│   │   ├── edsm/              # Elite Dangerous Star Map API
│   │   ├── inara/             # Inara.cz API
│   │   ├── eddn/              # EDDN sender + ZMQ receiver
│   │   ├── spansh/            # Spansh route planner API
│   │   ├── elitebgs/          # EliteBGS API (systems, factions, stations, ticks)
│   │   ├── data/              # Game data: FDevIDs IDs, coriolis ship/module stats
│   │   ├── utils/             # Utility functions (coords, bitflags, listify)
│   │   ├── stats/             # Ship stat calculator (jump, shields, speed, weapons, etc.)
│   │   ├── planner/           # Planner tools (engineering, trade, FC, BGS, powerplay, thargoid, colonization)
│   │   └── ws-journal/        # WebSocket server streaming journal events to clients
│   └── examples/              # Example usage scripts
├── python/                    # Python port (all-in-one package)
│   ├── elite_dangerous_sdk/   # Python source
│   ├── examples/              # Usage examples (companion, journal, community APIs)
│   └── tests/
├── dotnet/                    # C# .NET port (all-in-one package)
│   ├── EliteDangerousSdk/
│   ├── EliteDangerousSdk.Tests/
│   └── Examples/              # Usage examples (companion auth)
├── docs/                      # API reference and usage guides
└── scripts/                   # Build, test, lint, codegen scripts
```

## Installation

**Note**: Packages are in development and not yet published to registries. Clone the repo and build locally:

### TypeScript
```bash
git clone <repo>
cd elite-dangerous-sdk
npm install
npm run build
```

### Python
```bash
pip install -e python/
```

### C#
```bash
cd dotnet
dotnet restore
dotnet build
```

## Packages

| Package | Language | Description |
|---------|----------|-------------|
| `@elite-dangerous-sdk/journal` | TypeScript | Journal reader, watcher, parser, typed events (170+) |
| `@elite-dangerous-sdk/companion` | TypeScript | Frontier CAPI oAuth2 + client |
| `@elite-dangerous-sdk/edsm` | TypeScript | EDSM API (systems, bodies, stations, factions) |
| `@elite-dangerous-sdk/inara` | TypeScript | Inara API (profiles, travel, ships, inventory) |
| `@elite-dangerous-sdk/eddn` | TypeScript | EDDN sender + ZMQ receiver |
| `@elite-dangerous-sdk/spansh` | TypeScript | Spansh API (systems, stations, commodities, search) |
| `@elite-dangerous-sdk/elitebgs` | TypeScript | EliteBGS API (BGS state, systems, factions, stations, ticks) |
| `@elite-dangerous-sdk/data` | TypeScript | Game data: FDevIDs IDs, ship stats, modules, modifications |
| `@elite-dangerous-sdk/utils` | TypeScript | Coordinates, distance, bitflags, CAPI sparse array helpers |
| `@elite-dangerous-sdk/stats` | TypeScript | Ship stat calculator (jump range, shields, speed, power, weapons, hull, distributor) |
| `@elite-dangerous-sdk/planner` | TypeScript | Planner (engineering, trade routes, FC tools, BGS, powerplay 2.0, thargoid war, colonization) |
| `@elite-dangerous-sdk/ws-journal` | TypeScript | WebSocket server streaming journal events to connected clients |
| `elite-dangerous-sdk` | Python | All-in-one Python package |
| `EliteDangerousSdk` | C# | All-in-one .NET NuGet package |

## Quick Start (TypeScript)

```typescript
import { Journal } from "@elite-dangerous-sdk/journal";

const journal = new Journal();
for await (const event of journal) {
    switch (event.event) {
        case "FSDJump":
            console.log(`Jumped to ${event.StarSystem}`);
            break;
        case "Docked":
            console.log(`Docked at ${event.StationName}`);
            break;
    }
}
```

## Quick Start (Python)

```python
from elite_dangerous_sdk import JournalReader

reader = JournalReader()
for event in reader.read_events():
    if event["event"] == "FSDJump":
        print(f"Jumped to {event['StarSystem']}")
    elif event["event"] == "Docked":
        print(f"Docked at {event['StationName']}")
```

## Quick Start (C#)

```csharp
using EliteDangerousSdk.Journal;

var reader = new JournalReader();
foreach (var ev in reader.ReadEvents())
{
    if (ev["event"]?.ToString() == "FSDJump")
        Console.WriteLine($"Jumped to {ev["StarSystem"]}");
}
```

## Data Sources

### Player Journal (Local Files)
- **Path**: `%USERPROFILE%\Saved Games\Frontier Developments\Elite Dangerous\`
- **Format**: JSON Lines (`Journal.YYYY-MM-DDTHHMMSS._.log`)
- **Companion files**: Status.json, Market.json, Outfitting.json, Shipyard.json, Cargo.json, Backpack.json, ShipLocker.json, FCMaterials.json, NavRoute.json
- **~170 event types** covering all gameplay: travel, combat, trade, exploration, engineering, Odyssey on-foot, fleet carriers, squadrons, powerplay, missions, and more

### Companion API (CAPI)
- **Auth**: oAuth2 with PKCE flow
- **Hosts**: `companion.orerve.net` (Live), `legacy-companion.orerve.net` (Legacy)
- **Endpoints**: `/profile`, `/market`, `/shipyard`, `/fleetcarrier`, `/journal`, `/communitygoals`, `/visitedstars`
- **Register**: [https://user.frontierstore.net/developer](https://user.frontierstore.net/developer)

### Community APIs

| API | Base URL | Purpose |
|-----|----------|---------|
| **EDSM** | `https://www.edsm.net` | System data, bodies, stations, factions, flight logs |
| **Inara** | `https://inara.cz/inapi/v1/` | Commander profiles, inventory, ships, community goals |
| **EDDN** | `https://eddn.edcd.io:4430/upload/` | Real-time data sharing network (ZeroMQ relay at port 9500) |
| **Spansh** | `https://spansh.co.uk` | System/station search, route planning, commodity locations |
| **EliteBGS** | `https://elitebgs.app/ebgs/` | BGS state history, system/faction/station data with influence tracking |

### Embedded Game Data

The SDK bundles curated game data from two community-maintained repositories:

| Source | Data |
|--------|------|
| **[EDCD/FDevIDs](https://github.com/EDCD/FDevIDs)** | 27 CSV files: commodities, ships, outfitting modules, engineers, materials, ranks (combat/trade/explore/CQC/empire/federation), economies, governments, allegiances, factions, passengers, crimes, and more |
| **[EDCD/coriolis-data](https://github.com/EDCD/coriolis-data)** | 47 ship definitions with hardpoints, internals, bulkheads; 43 hardpoint module types (weapons + utilities), 30+ internal modules (shield gen, AFMU, fuel scoop, limpets), 7 standard modules (FSD, PP, PD, thrusters, sensors, life support, fuel tank); engineering blueprints with stats, modifier actions, and experimental effects |

All data is accessible via typed APIs in TypeScript, Python, and C#.

**TypeScript:**
```typescript
import { commoditiesBySymbol, getShipByEdId, getModuleByEdId } from '@elite-dangerous-sdk/data';

const platinum = commoditiesBySymbol.get('Platinum');
const sidewinder = getShipByEdId(128049249);
const beamLaser = getModuleByEdId(128049428);
```

**Python:**
```python
from elite_dangerous_sdk.data import commodities_by_symbol, ships_by_edid, all_modules_by_edid

platinum = commodities_by_symbol['Platinum']
sidewinder = ships_by_edid[128049249]
beam_laser = all_modules_by_edid[128049428]
```

**C#:**
```csharp
using EliteDangerousSdk.Data;
DataProvider.Initialize(DataProvider.ResolveDataPath());

var platinum = DataProvider.CommoditiesBySymbol["Platinum"];
var sidewinder = DataProvider.CoriolisShipsByEdId[128049249];
var beamLaser = DataProvider.AllModulesByEdId[128049428];
```

## Features

### Player Journal
- **Reader + Watcher**: Read journal files (forward or streaming), watch for new events in real-time
- **170+ typed events**: All journal events from travel, combat, trade, exploration, engineering, exobiology, on-foot (Odyssey), fleet carriers, squadrons, powerplay, missions, and more
- **Companion status files**: Parse Market.json, Outfitting.json, Shipyard.json, Status.json, Cargo.json, Backpack.json, ShipLocker.json, FCMaterials.json, NavRoute.json
- **BigInt-safe parsing**: 64-bit IDs (`SystemAddress`, `MarketID`) handled correctly
- **Resumable position tracking**: Resume from any point (crash-resilient), with persisted checkpoint files
- **WebSocket streaming server**: Broadcast journal events to connected clients over WebSocket

### Frontier Companion API (CAPI)
- **Full oAuth2 PKCE flow**: Code verifier, challenge, state validation, token refresh
- **All endpoints**: Profile, market, shipyard, fleet carrier, journal, community goals, visited stars
- **Galaxy split**: Live vs Legacy galaxy support
- **Data staleness detection**: CAPI profile data validated against journal timestamps

### Community APIs

| API | Features |
|-----|----------|
| **EDSM** | System data (coords, allegiance, population), systems by sphere/cube, bodies, stations, factions, flight logs, estimated values, traffic, deaths, API key support |
| **Inara** | Commander profiles, inventory (materials/cargo/ships/modules), travel (docks/jumps/landings), community goals, missions, combat logs, permits, friends, engineer ranks, reputation, fleet carrier, statistics — 40+ API endpoints |
| **EDDN** | JSON Schema validation for commodity/shipyard/outfitting/fleet carrier messages, HTTP sender with retry/backoff, ZMQ receiver with schema filtering |
| **Spansh** | System/station/body search, route planning, nearest system, faction search, commodity location search, body/stations dumps, controlling factions |
| **EliteBGS** | Systems, factions, stations with influence tracking, tick detection |

### Embedded Game Data
- **FDevIDs**: 27 curated CSV files — commodities, ships, outfitting modules, engineers, materials, all ranks (combat/trade/explore/CQC/empire/federation), economies, governments, allegiances, factions, passengers, crimes, docking reasons, and more
- **Coriolis data**: 47 ship definitions with hardpoints/internals/bulkheads, 43 hardpoint module types, 30+ internal modules, 7 standard modules (FSD, PP, PD, thrusters, sensors, life support, fuel tank), engineering blueprints (all grades, all stats, all experimentals), modifications catalog
- **All data typed** and accessible via lookup APIs by ED ID, symbol, or name in all three languages

### Ship Stat Calculator
- **Jump range**: Mass-based formula with class/rating multipliers
- **Shields**: Optimal/strength/regen with boost/hull reinforcement compound formulas
- **Speed/boost**: Engine-based with mass factor and boosts
- **Power/heat**: Power plant output and heat efficiency
- **Distributor**: WEP/SYS/ENG recharge rates and capacitor capacity
- **Weapons**: Damage, DPS, DPE, distributor draw for fixed/gimballed/turreted
- **Hull**: Integrity with reinforcement and hull boost
- **Formulas match Coriolis** — all verified against EDCD/coriolis-web Calculations.js

### Ship Engineering
- **Blueprint system**: All blueprints with per-grade stats, roll quality, min/max bounds
- **Stat modifiers**: Damage, shield boost, hull boost, rate of fire (rof conversion), thermals, range, mass, power draw, distributor draw — 50+ stat types
- **Experimental effects**: All specials with compound formulas matching game
- **Mod calculations**: Additive, multiplicative, minimum, maximum, and special compound stacking
- **Planner**: Material requirements, engineer assignments, upgrade path planning

### On-Foot Engineering (Suits & Weapons)
- **Suit data**: Dominator/Maverick/Artemis base stats (shields, battery, health, air, resistances, slots), G1-G5 upgrade costs per suit type
- **Weapon data**: 11 weapons across 3 manufacturers (Kinematic, Takada, Manticore) — base DPS, headshot multiplier, range, magazine, reload, projectile speed
- **14 suit modifications**: Backpack capacity, battery, jump assist, shield regen, damage resistance, sprint, air reserves, melee, movement speed, night vision, enhanced tracking, quieter footsteps, reduced tool drain, extra ammo
- **11 weapon modifications**: Magazine size, reload speed, range, handling, stability, hip-fire accuracy, headshot damage, stowed reloading, audio masking, noise suppressor, scope
- **Weapon DPS calculator**: Manufacturer-specific grade scaling (1.6× Kinematic/Takada, 2.86× Manticore), effective DPS with hit rate and headshot rate
- **Engineer mapping**: All 13 on-foot engineers with their compatible modifications
- **Planner**: Material needs, credit costs, engineer assignments for full on-foot loadouts

### Planner Tools
- **Engineering planner**: Ship module material requirements, engineer assignment, experimental cost breakdown, material total aggregation
- **Trade routes**: Profit calculation, ranking with filters, starport/planetary settlement differentiation
- **Fleet carrier**: Jump fuel cost formula `round(5 + distance × (ladenMass + 25000) / 200000)`, weekly maintenance tiers, affordability checks
- **BGS**: Systems/factions/stations analysis, influence tracking
- **Powerplay 2.0**: All 11 powers, rank 1-100 merits (8K per rank after 5), salary schedules, merit bracket estimation, throughput estimation
- **Thargoid war**: Titan states (active/vulnerable/dying/defeated), invasion status, system titan lookup
- **Colonization**: Resource requirements, construction site creation, economy projections, site type validation, pre-requisite checks, tax calculations, surface slot predictions
- **Exobiology**: All 19 genera, 143 species with per-species values and first discovery bonuses
- **BGS colonization planner**: Colony economy calculation, tier point audits, strong link boost, body feature buffs

### Multi-Language
- **TypeScript** (monorepo, 12 packages): Reference implementation with full types
- **Python** (all-in-one package): Full feature parity, snake_case API
- **C# .NET** (all-in-one package): Full feature parity, PascalCase async API
- **Same data, same formulas, same tests** across all three languages
- **Code generation**: FDevIDs CSVs and Coriolis data auto-generated from schemas

## Resources

- [EDCD Community](https://github.com/EDCD) - Elite Dangerous Community Developers
- [FDevIDs](https://github.com/EDCD/FDevIDs) - Community-maintained game IDs
- [Journal Manual (Official PDF)](https://hosting.zaonce.net/community/journal/v32/Journal_Manual-v32.pdf)
- [Journal Docs (Community)](https://elite-journal.readthedocs.io/)
- [CAPI oAuth2 Notes](https://github.com/EDCD/FDevIDs/blob/master/Frontier%20API/FrontierDevelopments-oAuth2-notes.md)
- [EDDN Developer Docs](https://github.com/EDCD/EDDN/blob/live/docs/Developers.md)
- [EDSM API Docs](https://www.edsm.net/en/api-v1)
- [Inara API Docs](https://inara.cz/elite/inara-api-docs/)
- [EliteBGS API Docs](https://elitebgs.app/ebgs/)

## License

MIT
#   E l i t e - D a n g e r o u s - 3 r d - P a r t y - S D K  
 #   E l i t e - D a n g e r o u s - 3 r d - P a r t y - S D K  
 