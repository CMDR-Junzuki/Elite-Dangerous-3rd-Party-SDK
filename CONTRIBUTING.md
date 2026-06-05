# Contributing to Elite Dangerous SDK

## Development Setup

### Prerequisites
- **Node.js** >= 18
- **Python** >= 3.10
- **.NET SDK** >= 8.0 (for C# port)

### TypeScript
```bash
git clone <repo>
cd elite-dangerous-sdk
npm install
npm run build
npm test
```

### Python
```bash
pip install -e python/
cd python && pytest
```

### C#
```bash
cd dotnet
dotnet restore
dotnet build
```

## Project Structure

See [AGENTS.md](./AGENTS.md) for a detailed project layout. In short:

- **TypeScript** — 11 packages in `core/packages/` as an npm workspace
- **Python** — All-in-one package in `python/elite_dangerous_sdk/`
- **C#** — All-in-one project in `dotnet/EliteDangerousSdk/`
- **Data** — EDCD/FDevIDs CSVs and EDCD/coriolis-data JSONs live in `specs/data/`
- **Schemas** — JSON Schema files in `specs/` serve as the single source of truth

## Workflow

### Adding a New Feature

1. **TypeScript first** — implement in the appropriate `core/packages/<pkg>/` package
2. **Add tests** — vitest tests in `__tests__/` within the package directory
3. **Export** — add exports in the package's `index.ts`
4. **Python port** — add to `python/elite_dangerous_sdk/<file>.py` and export in `__init__.py`
5. **C# port** — add to `dotnet/EliteDangerousSdk/<Namespace>/<File>.cs`
6. **Python tests** — add to `python/tests/`
7. **Regenerate docs** — run `npx tsx scripts/generate-docs.ts`
8. **Run all tests** — `npm test` from root, then `cd python && pytest`

### Code Style

- TypeScript: strict mode, `NodeNext` module, `.ts` extension in imports
- Python: `snake_case` functions, `PascalCase` classes, type hints required
- C#: `PascalCase` methods, `Task<T>` for async, file-per-class
- No comments on code unless the intent is non-obvious
- No placeholder data or "Unknown" fallback strings — return `""` / `[]` / raw input

### Data Integrity

All game data must come from verified sources:

| Data | Source |
|------|--------|
| Ship/module stats | EDCD/coriolis-data |
| FDev IDs | EDCD/FDevIDs CSVs |
| Exobiology values | EDMC-BioScan rulesets |
| Engineer data | Elite wiki |
| Fleet carrier fuel/costs | Frontier forums, Fandom wiki |
| Powerplay 2.0 ranks | Fandom wiki |

No invented, approximated, or observed-only values. If you cannot source it, leave it unimplemented.

### Stat Calculator

Formulas must **exactly reproduce** [EDCD/coriolis-web Calculations.js](https://github.com/EDCD/coriolis-web/blob/develop/src/Components/ShipTemplate/Calculations.js). No simplifications, no rating tables, no hardcoded multipliers. Engineering modifier math:

- **rof**: blueprint features use fire-interval change; convert via `1/(1+mod)-1` before multiplying
- **Specials**: experimental effects apply against the already-engineered stat, not original
- **Shieldboost/hullboost**: compound formula `(1+result)*(1+mod)-1` for both grades and experimental effects

### Testing

- Every package must have tests
- TypeScript: vitest, `npm test` in package directory
- Python: pytest, `cd python && pytest`
- C#: xUnit, `dotnet test` (requires .NET SDK)
- Tests must pass before any PR is submitted

## Pull Request Process

1. Ensure all TS and Python tests pass
2. Ensure C# builds successfully
3. If adding game data, include source citations
4. If adding formulas, reference the source implementation
5. Update AGENTS.md if adding new packages or changing conventions
6. Regenerate docs with `npx tsx scripts/generate-docs.ts`

## Questions

Open an issue or reach out on the Elite Dangerous 3rd party dev Discord.
