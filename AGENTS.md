# AGENTS.md — AI Agent Guide

## Project Overview

Multi-language (TypeScript/Python/C#) Elite Dangerous SDK covering Player Journal, Frontier CAPI, community APIs (EDSM, Inara, EDDN, Spansh, EliteBGS), game data (FDevIDs, coriolis-data), stat calculator, and planner tools.

## Project Structure

```
elite-dangerous-sdk/
├── specs/                     # JSON Schema + game data (single source of truth)
│   ├── journal/events/        # 178 JSON Schema files for ~170 journal events
│   ├── companion/             # CAPI endpoint schemas
│   ├── community/             # EDSM, Inara, Spansh, EliteBGS schemas
│   └── data/fdevids/          # EDCD/FDevIDs CSVs + EDCD/coriolis-data JSONs
├── core/packages/             # TypeScript monorepo (12 packages, npm workspaces)
│   ├── journal/               # Journal reader/watcher/parser + 202 typed interfaces
│   ├── companion/             # oAuth2 PKCE + CAPI client
│   ├── edsm/                  # EDSM API
│   ├── inara/                 # Inara API
│   ├── eddn/                  # EDDN sender + ZMQ receiver
│   ├── spansh/                # Spansh API
│   ├── elitebgs/              # EliteBGS API
│   ├── data/                  # Embedded game data + codegen
│   ├── utils/                 # Coordinates, bitflags, listify
│   ├── stats/                 # Ship stat calculator
│   ├── planner/               # Engineer/trade/FC/BGS/powerplay/exobio/thargoid/colonization
│   └── ws-journal/            # WebSocket server streaming journal events to clients
├── core/examples/             # Usage examples (in workspace)
├── python/                    # Python port (all-in-one package)
│   ├── elite_dangerous_sdk/   # Python source
│   ├── examples/              # Usage examples (companion, journal, community APIs)
│   └── tests/
├── dotnet/                    # C# .NET port (all-in-one package)
│   ├── EliteDangerousSdk/
│   ├── EliteDangerousSdk.Tests/
│   └── Examples/              # Usage examples (companion auth)
├── docs/                      # API reference
└── scripts/                   # Codegen + doc generation
```

## Critical Rules

- **NO placeholder/invented data** — all game data must come from verified sources (EDCD/coriolis-data, official wiki, FDev forums, EDMC plugins)
- **NO "Unknown" fallback strings** — return `""` / `[]` / raw input instead
- **Stat formulas MUST match EDCD/coriolis-web Calculations.js exactly** — no approximations, no invented math
- **Python + C# parity is non-negotiable** — every type, function, and feature must exist in all 3 languages
- **Tests required before any component is complete** — TS, Python, and C# tests must all pass

## Build Commands

All from project root:

| Command | Description |
|---------|-------------|
| `npm install` | Install all TS workspace dependencies |
| `npm run build` | Build all TypeScript packages |
| `npm test` | Run all TS tests |
| `npm run typecheck` | TypeScript type-check all packages |
| `npm run lint` | Run Biome lint + format on all source |
| `cd python && pip install -e . && pytest` | Install & test Python |
| `dotnet restore dotnet/EliteDangerousSdk.Tests && dotnet build dotnet/EliteDangerousSdk.Tests --nologo` | Build C# |
| `dotnet test dotnet/EliteDangerousSdk.Tests --nologo` | Run C# tests |
| `npx tsx scripts/generate-docs.ts` | Regenerate API docs |
| `npx tsx scripts/xxx.ts` | Run any script |

Individual package commands (from `core/packages/<name>/`):
- `npm run build` — tsc build
- `npm test` — vitest run
- `npm run typecheck` — tsc --noEmit

## Package Dependencies (TypeScript)

```
data (no deps)
utils (no deps)
journal (no deps)
companion (data, utils)
edsm (utils)
inara (utils)
eddn (no deps)
spansh (utils)
elitebgs (utils)
stats (data)
planner (data)
ws-journal (journal)
```

## Adding a New Feature

1. Add TypeScript types to `core/packages/<pkg>/src/types.ts` or create new file
2. Implement the feature
3. Add vitest tests in `__tests__/`
4. Export from `index.ts`
5. Port to Python (`python/elite_dangerous_sdk/<file>.py`)
6. Port to C# (`dotnet/EliteDangerousSdk/<Namespace>/<File>.cs`)
7. Add Python tests in `python/tests/`
8. Add C# tests in `dotnet/EliteDangerousSdk.Tests/`
9. Update `scripts/generate-docs.ts` if adding doc-comments
10. Run all tests (TS, Python, C#)

## Porting Conventions

### Python
- File per module matching TS package name (e.g. `edsm.py`, `planner.py`)
- Function names: `snake_case` (e.g. `get_system`, `estimate_jumps`)
- Classes: `PascalCase` (e.g. `InaraClient`, `StatsCalculator`)
- Exports in `__init__.py`

### C#
- Namespace `EliteDangerousSdk.<Area>` (e.g. `EliteDangerousSdk.EDSM`)
- Class per logical unit, PascalCase methods
- Async methods return `Task<T>`
- File per class in `dotnet/EliteDangerousSdk/<Area>/`

## Engineering Modifier Critical Details

- `rof` conversion: blueprint mod values represent fire-interval change; convert via `1/(1+mod)-1` before applying multiplicatively
- Experimental effects apply against already-engineered result, not original base stat
- Shieldboost/hullboost special effects use compound formula `(1+result)*(1+mod)-1` in both grades AND experimental effects

## Verified Data Sources

| Data | Source |
|------|--------|
| Exobiology values | EDMC-BioScan rulesets (per-species 1M–20M CR) |
| Engineer data | Elite wiki (38 engineers: 25 ship + 13 on-foot) |
| Fleet carrier fuel | `round(5 + distance * (ladenMass + 25000) / 200000)` |
| Fleet carrier costs | Fandom wiki + Roguey.co.uk + PTN calculator |
| Powerplay 2.0 ranks | Fandom wiki (1–100, +8K merits/rank after rank 5) |
| Material caps | All 3000 unified (post-Update 14) |
| Ship/module stats | EDCD/coriolis-data |
| FDev IDs | EDCD/FDevIDs CSVs |

## Import Convention

TypeScript packages use `.js` extension in relative imports with `NodeNext` module resolution. This is the standard NodeNext convention — TypeScript resolves `./foo.js` to the `./foo.ts` source file during compilation. Vitest/tsx handle this automatically at runtime.

## Implemented Features (from ChatGPT proposals)

| Feature | TS | Python | C# |
|---------|----|--------|----|
| JournalReplay | ✅ | ✅ | ✅ |
| CommanderStateEngine | ✅ | ✅ | ✅ |
| EDDN Message Validation | ✅ | ✅ | ✅ |
| Saveable Commander Snapshots | ✅ | ✅ | ✅ |
| Event Query Engine | ✅ | ✅ | ✅ |
| Material & Engineering Dependency Graph | ✅ | ✅ | ✅ |
| Route Optimization APIs | ✅ | ✅ | ✅ |
| Canonical Elite ID Resolution | ✅ | ✅ | ✅ |
| Live Event Stream Layer | ✅ | ✅ | ✅ |
| Squadron & BGS Toolkit | ✅ | ✅ | ✅ |
| Package Maturity Promotions | ✅ | ✅ | ✅ |
| Planner API Lockdown | ✅ | ✅ | ✅ |

## Planned Features

| Priority | Feature | Description |
|----------|---------|-------------|
| High | Test Parity Gaps | ws-journal: add Python/C# tests (TS has 4). inara: bump TS tests to match Python (6 → 50+). companion: bump TS tests to match C# coverage. |
| High | CI/CD Pipeline | GitHub Actions for automated TS/Python/C# test runs on PR/merge. |
| High | Package Publishing | Automate publish to npm, PyPI, and NuGet on tagged releases. |
| Medium | User Guides | Tutorials and getting-started guides per language beyond the auto-generated API.md. |
| Medium | Examples Coverage | Comprehensive usage examples across all features in all 3 languages. |
| Low | Schema Validation Coverage | All 178 journal event schemas should have corresponding typed interfaces and validation tests (currently ~170 of 178 covered). |
| Low | Game Version Tracking | Mechanism to flag when new journal events appear in game updates (compare against known schema list). |
