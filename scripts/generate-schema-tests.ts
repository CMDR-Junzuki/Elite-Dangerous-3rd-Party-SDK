import * as fs from "node:fs";
import * as path from "node:path";

const EVENTS_DIR = path.resolve("specs/journal/events");
const TS_OUT = path.resolve(
  "core/packages/journal/__tests__/schema-smoke.test.ts",
);
const PY_OUT = path.resolve("python/tests/test_schema_smoke.py");
const CSHARP_OUT = path.resolve(
  "dotnet/EliteDangerousSdk.Tests/SchemaSmokeTests.cs",
);

const HELPER_TYPES = new Set([
  "FuelStatus",
  "DestinationStatus",
  "FactionState",
  "StateTimeline",
  "Conflict",
  "ConflictFaction",
  "ThargoidWarInfo",
  "StationEconomy",
  "LandingPads",
  "CommodityItem",
  "ParentBody",
  "Ring",
  "AtmosphereComposition",
  "Composition",
  "Mission",
  "EngineeringMod",
  "Modifier",
  "ModuleItem",
  "ShipItem",
  "JournalPosition",
]);

const SKIP_EVENTS = new Set(["Market", "Status"]);

function randomValue(type: string, depth: number): string {
  if (depth > 2) return '""';
  switch (type) {
    case "string":
      return '"test"';
    case "integer":
      return "1";
    case "number":
      return "1.0";
    case "boolean":
      return "true";
    default:
      return '"test"';
  }
}

function generateSampleJson(
  schema: any,
  depth: number,
  eventName?: string,
): string {
  const props: string[] = [];
  const required = new Set(schema.required || []);

  for (const [key, val] of Object.entries(schema.properties || {})) {
    const prop = val as any;
    if (!required.has(key) && depth > 0) continue;

    if (key === "timestamp") {
      props.push(`"${key}":"2024-01-01T00:00:00Z"`);
    } else if (key === "event") {
      props.push(`"${key}":"${eventName || "Unknown"}"`);
    } else if (prop.type === "array") {
      if (prop.items?.type === "object" && prop.items?.properties) {
        props.push(
          `"${key}":[${generateSampleJson(prop.items, depth + 1, eventName)}]`,
        );
      } else {
        props.push(
          `"${key}":[${randomValue(prop.items?.type || "string", depth + 1)}]`,
        );
      }
    } else if (prop.type === "object" && prop.properties) {
      props.push(`"${key}":${generateSampleJson(prop, depth + 1, eventName)}`);
    } else {
      const val = randomValue(prop.type, depth + 1);
      props.push(`"${key}":${val}`);
    }
  }
  return `{${props.join(",")}}`;
}

function sanitizeEventName(name: string): string {
  return name.replace(/_/g, "");
}

function makeTsTest(events: { name: string; json: string }[]): string {
  const block = events
    .map((e) => {
      return `it("parses ${e.name}", () => {
  const line = '${e.json}';
  const ev = parseLine(line);
  expect(ev.event).toBe("${e.name}");
  expect(ev.timestamp).toBe("2024-01-01T00:00:00Z");
});`;
    })
    .join("\n\n  ");

  return `import { describe, expect, it } from "vitest";
import { parseLine } from "../src";

describe("schema smoke tests", () => {
  ${block}
});
`;
}

function makePythonTest(events: { name: string; json: string }[]): string {
  const block = events
    .map(
      (e) => `
def test_${e.name}_parses():
    line = '${e.json}'
    ev = parse_line(line)
    assert ev.get("event") == "${e.name}"
    assert ev.get("timestamp") == "2024-01-01T00:00:00Z"
`,
    )
    .join("\n");

  return `"""Auto-generated schema smoke tests."""
from elite_dangerous_sdk import parse_line

${block}
`;
}

function makeCsharpTest(events: { name: string; json: string }[]): string {
  const block = events
    .map(
      (e) => `
    [Fact]
    public void Parse_${e.name}_ReturnsCorrectEvent()
    {
        var line = @"${e.json.replace(/"/g, '""')}";
        var ev = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(line);
        Assert.Equal("${e.name}", ev["event"].GetString());
        Assert.Equal("2024-01-01T00:00:00Z", ev["timestamp"].GetString());
    }
`,
    )
    .join("\n");

  return `using System.Text.Json;
using Xunit;

namespace EliteDangerousSdk.Tests;

public class SchemaSmokeTests
{${block}
}
`;
}

function main() {
  const events: { name: string; json: string }[] = [];
  const files = fs
    .readdirSync(EVENTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  for (const file of files) {
    const name = path.basename(file, ".json");
    if (HELPER_TYPES.has(name) || SKIP_EVENTS.has(name)) continue;

    const schemaPath = path.join(EVENTS_DIR, file);
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    const sample = generateSampleJson(schema, 0, name);
    events.push({ name, json: sample });
  }

  console.log(
    `Generated ${events.length} sample events from ${files.length} schemas`,
  );

  fs.writeFileSync(TS_OUT, makeTsTest(events));
  console.log(`Wrote ${TS_OUT}`);

  fs.writeFileSync(PY_OUT, makePythonTest(events));
  console.log(`Wrote ${PY_OUT}`);

  // Fix JSON single-quote issue for C# — use "" string
  const csharpContent = makeCsharpTest(events).replace(/'/g, '"');
  fs.writeFileSync(CSHARP_OUT, csharpContent);
  console.log(`Wrote ${CSHARP_OUT}`);
}

main();
