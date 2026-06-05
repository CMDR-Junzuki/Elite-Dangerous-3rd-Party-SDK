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
├── core/packages/     # TypeScript (12 packages, npm workspaces)
├── python/            # Python port (all-in-one package)
├── dotnet/            # C# .NET port (all-in-one package)
├── specs/             # JSON schemas + game data (single source of truth)
├── docs/              # API reference
└── scripts/           # Codegen, build, test scripts
```

## Data Sources

All game data is sourced from community-maintained repositories — no scraping, no guesswork:

- **[EDCD/FDevIDs](https://github.com/EDCD/FDevIDs)** — 27 CSV files: commodities, ships, modules, engineers, materials, all ranks, economies, governments, and more
- **[EDCD/coriolis-data](https://github.com/EDCD/coriolis-data)** — 47 ships, 43 hardpoint types, 30+ internal modules, all blueprints with every grade and experimental
- **Stat formulas** match [coriolis-web Calculations.js](https://github.com/EDCD/coriolis-web) exactly — no approximations

## Tests

| Language | Tests | Status |
|----------|-------|--------|
| TypeScript | 304 | ✅ |
| Python | 407 | ✅ |
| C# | 453 | ✅ |

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
