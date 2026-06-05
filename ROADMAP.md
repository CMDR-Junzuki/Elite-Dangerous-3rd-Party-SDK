# Elite Dangerous SDK — Roadmap

## What is this?

A toolkit (SDK) for building apps and tools for the game **Elite Dangerous**. It covers:
- Reading the game's journal files (your activity log)
- Logging into Frontier's servers (Companion API)
- Querying community websites: EDSM, Inara, Spansh, EliteBGS, EDDN
- Game data (ship stats, module stats, system IDs)
- Calculators (ship stats, engineering)
- Planners (trade routes, engineers, exobiology, fleet carriers, BGS, powerplay, thargoid war, colonization)

Available in **3 languages**: TypeScript (reference), Python, C# .NET

---

## What's Complete

### All 3 Languages (TS ✓ Python ✓ C# ✓)

| Feature | Details |
|---------|---------|
| **EDSM API** | Query systems, bodies, stations, factions, market data, estimated values |
| **Inara API** | All 50 events — commander profile, ship/inventory/travel/mission/combat |
| **Spansh API** | System/station/body lookup, commodity search, station search, **route plotting**, nearest POI |
| **EliteBGS API** | Systems, factions, stations, ticks with typed query filters |
| **EDDN Sender** | Send commodity/shipyard/outfitting/fleet carrier data to EDDN with schema validation |
| **Companion API** | Frontier oAuth2 login, profile/market/shipyard/fleet carrier/journal, `is_docked` |
| **Ship Stats** | Jump range, shield, distributor, power, speed, hull, weapons — **matches Coriolis exactly** |
| **Engineering** | Blueprint grades, experimental effects, shield/hull boost compounding |
| **Planners (all 9)** | Engineer, Trade, Fleet Carrier, BGS, Powerplay, Exobiology, Thargoid War, Materials, Compare + Colonization |
| **Journal Parser** | BigInt-safe JSON parsing with `parseLine`, `stringifyEvent`, `isEventType` |
| **Journal Watcher** | Auto-detect new journal files — TS uses chokidar, Python/C# use polling |
| **Journal Typed Events** | 134 strongly-typed event records + 19 shared types via codegen from 178 JSON Schemas |
| **WebSocket Server** | Stream journal events live to browser clients |
| **Utils** | Coordinate math (distance/bearing/midpoint), bitflags, listify |
| **Game Data** | Ships, modules, modifications, FDev IDs, outfitting/shipyard maps |
| **CI Pipeline** | Tests run on every push — Node 18/20/22, Python 3.10–3.13, .NET 8.0/9.0 |

---

## What's Left

### Minor gaps
- C# EDDN receiver uses WebSocket instead of ZeroMQ (both supported by EDDN, kept for zero-dependency)
- Inara tests: C# has 18 tests covering event builders; no HTTP error-handling tests (minor)
- Python `getSystem` lacks optional `showPermit`/`showInformation` param variants

---

## Build Commands

```
npm test              — TypeScript tests (228)
cd python && pytest   — Python tests (300)
dotnet test           — C# tests (344)
npm run build         — Build all TS packages
npm run lint          — Check code style (Biome)
```

**Test counts:** TS 228 | Python 300 | C# 344 | Total: 872

---

## Next Steps

The SDK is functionally complete across all 3 languages for all major features. Remaining work is polishing:

1. **Inara error-handling tests** — add HTTP error + API-level error tests to C# and Python
2. **Python EDSM optional params** — add `showPermit`/`showInformation` test variants
3. **Regenerate API docs** — run `npx tsx scripts/generate-docs.ts` to capture new exports
