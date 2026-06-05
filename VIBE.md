# Elite Dangerous SDK — For Vibe Coders

This is a toolkit for building tools and websites for Elite Dangerous. You don't need to be a programmer to use it — just tell an AI what you want to build and point it at this project.

## What's inside?

Everything you'd need to make an Elite Dangerous companion app, website, or tool:

- **Read your game journal** — the file Elite Dangerous writes to your hard drive every time you jump, dock, shoot, scoop, land, scan, or sneeze
- **Connect to Frontier's servers** (CAPI) — log in with your Elite account and pull your profile, ships, market data, fleet carrier info
- **Talk to community APIs** — EDSM (the galaxy map), Inara (your commander profile), Spansh (route planner), EliteBGS (faction politics), EDDN (live data from all commanders)
- **Game data** — ship stats, module stats, commodity prices, engineer blueprints, material requirements — all built-in, no scraping
- **Calculators** — work out jump range, shield strength, speed, weapon DPS for any ship build
- **Planners** — engineering material grind, trade routes, fleet carrier costs, powerplay merits, BGS influence, colonization resources, exobiology values, thargoid war tracking

## What can you build?

| You want to... | This SDK handles |
|---|---|
| Track your credits, ships, and rank as you play | Reading the journal in real-time |
| Build a dashboard showing your fleet with stats | Ship stat calculator + CAPI profile |
| Find the best trade route for profit | Trade route planner + Spansh commodity search |
| Plan engineering mats for your Corvette | Engineering planner with material totals |
| See where thargoids are attacking | Thargoid war state from journal |
| Calculate how much a fleet carrier jump costs | `round(5 + distance * (ladenMass + 25000) / 200000)` |
| Figure out which exobiology species to scan | Per-species values 1M–20M CR |
| Upload your data to EDSM/Inara automatically | Journal reader + API clients |
| Build a colonization economy calculator | Surface slot predictions, tier audits, tax math |
| Show BGS influence for your squadron | Faction/station data + tick detection |

## Quick Start (pick your flavor)

### Python (easiest for vibe coding)

```bash
pip install -e python/
```

Then tell your AI:

> "Read my Elite journal and tell me my total exploration credits this session"

Or:

> "Build a website where I can see my ships with their jump ranges"

The SDK handles all the Elite-specific stuff. Your AI just needs to wire it up.

### TypeScript (good for websites)

```bash
npm install
npm run build
```

Works great with React, Vue, or any web framework.

### C# (Windows desktop apps)

```bash
cd dotnet
dotnet restore
dotnet build
```

For WPF, WinForms, or game overlays.

## How it works

**Player Journal**: Elite Dangerous writes a log file to `%USERPROFILE%\Saved Games\Frontier Developments\Elite Dangerous\`. This SDK reads it — forward, backward, or watching for new entries in real-time. About 170 different event types, all parsed for you.

**Community APIs**: The SDK talks to EDSM (galaxy data), Inara (commander profiles), Spansh (route searching), EliteBGS (faction politics), and EDDN (the community data network). You just call a function.

**Game Data**: Ship specs, module stats, engineer blueprints, material costs — all the numbers from the game files. No manual data entry, no stale wikis.

## Project layout (for telling your AI)

```
elite-dangerous-sdk/
├── core/packages/           # TypeScript source (12 packages)
│   ├── journal/             # Reading your game journal
│   ├── companion/           # Frontier server login + data
│   ├── edsm/                # EDSM galaxy API
│   ├── inara/               # Inara commander API
│   ├── eddn/                # EDDN data sharing
│   ├── spansh/              # Spansh route API
│   ├── elitebgs/            # BGS faction API
│   ├── data/                # Ship/module/commodity data
│   ├── stats/               # Ship stat calculator
│   └── planner/             # All planner tools
├── python/                  # Python version (same stuff)
│   ├── elite_dangerous_sdk/
│   └── examples/
├── dotnet/                  # C# version (same stuff)
│   ├── EliteDangerousSdk/
│   └── Examples/
├── specs/                   # Game data files (don't touch)
└── docs/                    # API reference
```

## Tips for vibe coding

1. **Start with Python** — it's the simplest to set up and has examples you can point your AI at
2. **Tell your AI to check the examples folder** — `python/examples/` has working code for journal reading, CAPI login, and community API calls
3. **Don't worry about types** — Python doesn't need them, and the SDK handles all the messy parsing
4. **If you're building a website** — use TypeScript; it'll work better with React/etc
5. **Game journal is your best friend** — you get live data without any login or API keys

## Data sources (so you know it's legit)

All game data comes from the Elite Dangerous community:
- [EDCD/FDevIDs](https://github.com/EDCD/FDevIDs) — official game IDs maintained by the community
- [EDCD/coriolis-data](https://github.com/EDCD/coriolis-data) — ship and module stats
- [EDSM](https://www.edsm.net) — galaxy data API
- [Inara](https://inara.cz) — commander profile API
- [Official Journal Manual](https://hosting.zaonce.net/community/journal/v32/Journal_Manual-v32.pdf)
- [Elite Dangerous Wiki](https://elite-dangerous.fandom.com/)

## License

MIT — do whatever you want with it, including commercial projects.
