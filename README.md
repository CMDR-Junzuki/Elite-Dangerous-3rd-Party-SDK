# Elite Dangerous SDK

> Build tools, dashboards, and apps for Elite Dangerous in **TypeScript**, **Python**, or **C#**.

## Features

| What | What you get |
|------|-------------|
| **📄 Player Journal** | Real-time reader + watcher, 170+ typed events, companion status files |
| **🔐 Companion API** | Full oAuth2 PKCE login, profile/shipyard/market/FC/journal endpoints |
| **🌌 EDSM** | System data, bodies, stations, factions, flight logs, estimated values |
| **📊 Inara** | Commander profiles, inventory, ships, travel, missions — 50+ events |
| **📡 EDDN** | Send + receive live game data (commodity/shipyard/outfitting/FC) |
| **🔍 Spansh** | System/station search, route planner, commodity locations |
| **⚔️ EliteBGS** | Systems, factions, stations, influence tracking, tick detection |
| **📦 Game Data** | Ship stats, modules, blueprints, FDevIDs — all embedded, no scraping |
| **🧮 Ship Stats** | Jump, shields, speed, weapons, distributor — matches Coriolis exactly |
| **🔧 Planners** | Engineering, trade routes, fleet carriers, powerplay 2.0, BGS, thargoid war, colonization, exobiology |

## Package Maturity

| Package | Status | Tests | Notes |
|---------|--------|-------|-------|
| journal | **Stable** | 48 | 170+ typed events, reader/watcher/parser |
| inara | **Stable** | 62 | 50+ events, full TS/Python/C# parity |
| eddn | **Stable** | 32 | 4 schemas, send + ZMQ receive |
| edsm | **Stable** | 19 | Full API coverage |
| data | **Stable** | 31 | Embedded FDevIDs + coriolis-data |
| utils | **Stable** | 6 | Coordinates, bitflags, listify |
| stats | **Stable** | 14 | Matches coriolis-web Calculations.js exactly |
| companion | **Stable** | 21 | oAuth2 PKCE, 6 endpoints, typed models |
| spansh | **Stable** | 15 | System/station search, route planner |
| elitebgs | **Stable** | 17 | Systems, factions, influence tracking, tick detection |
| ws-journal | **Stable** | 4 | WebSocket journal event streaming |
| planner | **Stable** | 115 | Engineering, trade, FC, powerplay, colonization, BGS, thargoid, exobiology, on-foot |

**Stable** — API is stable and tested. Breaking changes will be avoided and documented.  
**Beta** — Functional and tested. Minor API refinements may occur.  
**Experimental** — In development. API may change significantly without notice.

## Versioning

This project uses **semantic versioning** (MAJOR.MINOR.PATCH). All language packages share a single unified version.

- **MAJOR** — breaking API changes (renamed types, removed functions, changed signatures)
- **MINOR** — new features, new event types, new API endpoints (backward-compatible)
- **PATCH** — bug fixes, documentation, internal improvements (no API change)

Until 1.0.0, MINOR bumps may include breaking changes as the API stabilizes. After 1.0.0, breaking changes only occur on MAJOR bumps.

## Quick Start

```bash
# TypeScript
npm install && npm run build

# Python
pip install -e python/

# C#
dotnet restore dotnet && dotnet build dotnet
```

```python
# Read your journal in real-time (Python)
from elite_dangerous_sdk import JournalReader

reader = JournalReader()
for event in reader.read_events():
    if event["event"] == "FSDJump":
        print(f"Jumped to {event['StarSystem']}")
```

## Project Layout

```
elite-dangerous-sdk/
├── specs/             # ← single source of truth (JSON schemas + game data)
│   ├── journal/       #   178 event schemas
│   ├── companion/     #   CAPI endpoint schemas
│   ├── community/     #   EDSM, Inara, Spansh, EliteBGS schemas
│   └── data/          #   FDevIDs CSVs + coriolis-data JSONs
├── core/packages/     # TypeScript (12 packages, npm workspaces) — reference impl
├── python/            # Python port — mirrors TypeScript API
├── dotnet/            # C# .NET port — mirrors TypeScript API
├── docs/              # API reference
└── scripts/           # Codegen, build, test scripts
```

The `specs/` directory is the authoritative source. TypeScript is the reference implementation — all types and APIs are designed in TypeScript first, then ported to Python and C# with automated checks preventing drift.

## Data Sources

All game data is sourced from community-maintained repositories — no scraping, no guesswork:

- **[EDCD/FDevIDs](https://github.com/EDCD/FDevIDs)** — 27 CSV files: commodities, ships, modules, engineers, materials, all ranks, economies, governments, and more
- **[EDCD/coriolis-data](https://github.com/EDCD/coriolis-data)** — 47 ships, 43 hardpoint types, 30+ internal modules, all blueprints with every grade and experimental
- **Stat formulas** match [coriolis-web Calculations.js](https://github.com/EDCD/coriolis-web) exactly — no approximations

## Tests

| Language | Tests | Status |
|----------|-------|--------|
| TypeScript | 336 | ✅ |
| Python | 421 | ✅ |
| C# | 468 | ✅ |

## Resources

- [Journal Manual (PDF)](https://hosting.zaonce.net/community/journal/v32/Journal_Manual-v32.pdf)
- [Journal Docs](https://elite-journal.readthedocs.io/)
- [CAPI oAuth2 Notes](https://github.com/EDCD/FDevIDs/blob/master/Frontier%20API/FrontierDevelopments-oAuth2-notes.md)
- [EDSM API](https://www.edsm.net/en/api-v1)
- [Inara API](https://inara.cz/elite/inara-api-docs/)
- [EliteBGS API](https://elitebgs.app/ebgs/)
- [EDDN Developer Docs](https://github.com/EDCD/EDDN/blob/live/docs/Developers.md)

## License

MIT
