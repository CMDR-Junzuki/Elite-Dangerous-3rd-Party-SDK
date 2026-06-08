# Getting Started with Elite Dangerous SDK

Multi-language SDK (TypeScript, Python, C#) covering the Player Journal, Frontier CAPI, and community APIs (EDSM, Inara, EDDN, Spansh, EliteBGS).

## TypeScript

```bash
npm install @elite-dangerous-sdk/journal @elite-dangerous-sdk/edsm @elite-dangerous-sdk/inara
```

```typescript
import { JournalReader } from "@elite-dangerous-sdk/journal";
import { EDSMClient } from "@elite-dangerous-sdk/edsm";
import { InaraClient } from "@elite-dangerous-sdk/inara";

// Read journal events
const reader = new JournalReader({ position: JournalPosition.start() });
for (const event of reader) {
  console.log(event.event, event.timestamp);
}

// Query EDSM
const edsm = new EDSMClient();
const sol = await edsm.getSystem("Sol");
console.log(sol.coords);

// Inara API — use auto-send (single call) or builder pattern (batch)
const inara = new InaraClient({
  appName: "MyApp", appVersion: "1.0",
  isBeingDeveloped: true, APIkey: "key",
});
await inara.addCommanderTravelFSDJumpAsync("Sol", [0, 0, 0]); // auto-sends
// Or batch multiple events:
const events = [inara.getCommanderProfile(), inara.addCommander("Cmdr1")];
const res = await inara.sendEvents(events);
```

Full examples: `core/examples/`

## Python

```bash
pip install elite-dangerous-sdk
```

```python
from elite_dangerous_sdk.journal import Journal, get_journal_directory
from elite_dangerous_sdk.edsm import EDSMClient
from elite_dangerous_sdk.inara import InaraClient

# Read journal events
journal = Journal()
for event in journal:
    print(event.event, event.timestamp)

# Query EDSM
edsm = EDSMClient()
sol = edsm.get_system("Sol")
print(sol)

# Inara API — auto-send convenience
inara = InaraClient({
    "appName": "MyApp", "appVersion": "1.0",
    "isBeingDeveloped": True, "APIkey": "key",
})
inara.add_commander_travel_fsd_jump("Sol", (0, 0, 0))  # auto-sends
```

Full examples: `python/examples/`

## C#

```bash
dotnet add package EliteDangerousSdk
```

```csharp
using EliteDangerousSdk.Journal;
using EliteDangerousSdk.EDSM;
using EliteDangerousSdk.Inara;

// Read journal events
var reader = new JournalReader(JournalOptions.StartFromBeginning());
foreach (var ev in reader.ReadEvents())
    Console.WriteLine(ev["event"] + " " + ev["timestamp"]);

// Query EDSM
var edsm = new EDSMClient();
var sol = await edsm.GetSystemAsync("Sol");
Console.WriteLine(sol.Coords?.X + ", " + sol.Coords?.Y + ", " + sol.Coords?.Z);

// Inara API — auto-send (single call) or builder pattern (batch)
var inara = new InaraClient("MyApp", "1.0", "key", commanderName: "Cmdr1");
await inara.AddCommanderTravelFsdJumpAsync("Sol", [0, 0, 0]); // auto-sends
// Or batch:
var evts = new[] { inara.GetCommanderProfile(), inara.AddCommander("Cmdr2") };
var res = await inara.SendEventsAsync(evts.ToList());
```

Full examples: `dotnet/Examples/`

## Modules

| Package | Description |
|---------|-------------|
| journal | Read/watch player journal, parse events, commander state engine |
| companion | Frontier CAPI oAuth2 client (journal, fleet carrier, crew) |
| edsm | EDSM API (systems, bodies, stations, factions, market) |
| inara | Inara API (commander profile, travel log, ranks, credits, missions) — auto-send & batch modes |
| eddn | EDDN sender + ZMQ receiver with schema validation |
| spansh | Spansh API (search, routes, stations, nearest) |
| elitebgs | EliteBGS API (faction/system data with advanced filters) |
| stats | Ship stat calculator (based on EDCD/coriolis-web) |
| planner | Engineer, trade, FC, BGS, powerplay, exobio, thargoid, colonization planners |
| data | Embedded game data (FDevIDs, coriolis-data) |
| utils | Coordinate math, bitflags, listify helpers |
| ws-journal | WebSocket server streaming journal events |

## Next Steps

- Browse the [API Reference](API.md)
- Read the project README for architecture and conventions
