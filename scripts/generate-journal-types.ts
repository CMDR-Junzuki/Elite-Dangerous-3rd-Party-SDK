import * as fs from "node:fs";
import * as path from "node:path";

// ── Configuration ──────────────────────────────────────────────────────────────

const EVENTS_DIR = path.resolve("specs/journal/events");
const ROOT_SCHEMAS = [
  "Cargo.json",
  "Market.json",
  "Outfitting.json",
  "Shipyard.json",
  "Status.json",
].map((f) => path.resolve("specs/journal", f));

const PYTHON_OUT = path.resolve("python/elite_dangerous_sdk/journal_types.py");
const CSHARP_OUT = path.resolve(
  "dotnet/EliteDangerousSdk/Journal/EventTypes.cs",
);

const HARDCODED_SIMPLE = new Set([
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
  "FuelStatus",
  "DestinationStatus",
  "JournalPosition",
]);

const REF_TYPE_MAP: Record<string, string> = {
  "../types/FactionState.json": "FactionState",
  "../types/Conflict.json": "Conflict",
};

// field-name → hardcoded-type-name for inline objects
const FIELD_TYPE_MAP: Record<string, string> = {
  StationEconomies: "StationEconomy",
  LandingPads: "LandingPads",
  Rings: "Ring",
  Parents: "ParentBody",
  AtmosphereComposition: "AtmosphereComposition",
  Composition: "Composition",
};

// Words that end in 's' but are NOT plural -- never singularize
const NON_PLURAL_S = new Set([
  "StarPos",
  "Status",
  "Class",
  "Mass",
  "Axis",
  "Radius",
  "Atlas",
  "Canvas",
  "Bias",
  "alias",
  "Genus",
  "Luminosity",
]);

function singularize(name: string): string {
  if (NON_PLURAL_S.has(name)) return name;
  if (name.endsWith("ies") && name.length > 3) return `${name.slice(0, -3)}y`;
  if (name.endsWith("s") && !name.endsWith("ss") && name.length > 1)
    return name.slice(0, -1);
  return name;
}

function inlineTypeName(eventName: string, fieldName: string): string {
  if (FIELD_TYPE_MAP[fieldName]) return FIELD_TYPE_MAP[fieldName];
  if (HARDCODED_SIMPLE.has(fieldName)) return fieldName;
  const s = singularize(fieldName);
  if (HARDCODED_SIMPLE.has(s)) return s;
  return `${eventName}_${s}`;
}

// ── Schema types ──────────────────────────────────────────────────────────────

interface FieldDef {
  name: string;
  pyType: string;
  csType: string;
  required: boolean;
  isEventDisc: boolean;
  eventDefault: string | undefined;
}

interface InlineType {
  name: string;
  fields: FieldDef[];
}

function mapSimpleType(
  prop: any,
  eventName: string,
  fieldName: string,
  allInline: InlineType[],
): { pyType: string; csType: string } {
  if (prop.$ref) {
    const t = REF_TYPE_MAP[prop.$ref] ?? "Any";
    return { pyType: t, csType: t };
  }
  if (!prop.type) {
    return { pyType: "str", csType: "string" };
  }

  const seen = new Set<string>(allInline.map((x) => x.name));
  function addUnique(nt: InlineType) {
    if (!seen.has(nt.name)) {
      seen.add(nt.name);
      allInline.push(nt);
    }
  }

  switch (prop.type) {
    case "string":
      return { pyType: "str", csType: "string" };
    case "integer":
      return { pyType: "int", csType: "long" };
    case "number":
      return { pyType: "float", csType: "double" };
    case "boolean":
      return { pyType: "bool", csType: "bool" };
    case "array": {
      if (!prop.items) return { pyType: "list[Any]", csType: "List<object>" };
      if (prop.items.$ref) {
        const t = REF_TYPE_MAP[prop.items.$ref] ?? "Any";
        return { pyType: `list[${t}]`, csType: `List<${t}>` };
      }
      if (prop.items.type === "object" && prop.items.properties) {
        // Guard: if the properties dict contains non-object values (malformed schema)
        // skip inline type generation and treat as list[Any].
        const propValues = Object.values(prop.items.properties);
        if (propValues.some((v: any) => typeof v !== "object" || v === null)) {
          return { pyType: "list[Any]", csType: "List<object>" };
        }
        const name = inlineTypeName(eventName, fieldName);
        if (HARDCODED_SIMPLE.has(name)) {
          return { pyType: `list[${name}]`, csType: `List<${name}>` };
        }
        const inner = parseFields(
          prop.items.properties,
          prop.items.required ?? [],
          eventName,
          allInline,
        );
        if (inner.length === 0) {
          return { pyType: "list[Any]", csType: "List<object>" };
        }
        addUnique({ name, fields: inner });
        return { pyType: `list[${name}]`, csType: `List<${name}>` };
      }
      if (prop.items.type === "array" && prop.items.items) {
        // nested arrays (rare) -- generate list[list[T]]
        const inner = mapSimpleType(
          prop.items,
          eventName,
          fieldName,
          allInline,
        );
        return {
          pyType: `list[${inner.pyType}]`,
          csType: `List<${inner.csType}>`,
        };
      }
      if (prop.items.type) {
        const inner = mapSimpleType(
          prop.items,
          eventName,
          fieldName,
          allInline,
        );
        return {
          pyType: `list[${inner.pyType}]`,
          csType: `List<${inner.csType}>`,
        };
      }
      return { pyType: "list[Any]", csType: "List<object>" };
    }
    case "object": {
      if (prop.properties) {
        const propValues = Object.values(prop.properties);
        if (propValues.some((v: any) => typeof v !== "object" || v === null)) {
          return {
            pyType: "dict[str, Any]",
            csType: "Dictionary<string, object>",
          };
        }
        const name = inlineTypeName(eventName, fieldName);
        if (HARDCODED_SIMPLE.has(name)) {
          return { pyType: name, csType: name };
        }
        const inner = parseFields(
          prop.properties,
          prop.required ?? [],
          eventName,
          allInline,
        );
        if (inner.length === 0) {
          return {
            pyType: "dict[str, Any]",
            csType: "Dictionary<string, object>",
          };
        }
        addUnique({ name, fields: inner });
        return { pyType: name, csType: name };
      }
      if (prop.additionalProperties) {
        const inner = mapSimpleType(
          prop.additionalProperties,
          eventName,
          fieldName,
          allInline,
        );
        return {
          pyType: `dict[str, ${inner.pyType}]`,
          csType: `Dictionary<string, ${inner.csType}>`,
        };
      }
      return { pyType: "dict[str, Any]", csType: "Dictionary<string, object>" };
    }
    default:
      return { pyType: "Any", csType: "object" };
  }
}

function parseFields(
  properties: Record<string, any>,
  required: string[],
  eventName: string,
  allInline: InlineType[],
): FieldDef[] {
  const reqSet = new Set(required);
  const fields: FieldDef[] = [];

  for (const [name, prop] of Object.entries(properties)) {
    if (typeof prop !== "object" || prop === null) continue;
    const isReq = reqSet.has(name);
    const isEventDisc = name === "event";
    let eventDefault: string | undefined;
    if (isEventDisc && prop.enum && prop.enum.length === 1) {
      eventDefault = prop.enum[0];
    }
    const mapped = mapSimpleType(prop, eventName, name, allInline);
    fields.push({
      name,
      pyType: mapped.pyType,
      csType: mapped.csType,
      required: isReq,
      isEventDisc,
      eventDefault,
    });
  }
  return fields;
}

// Python sort: no-default fields (timestamp + required non-event) first,
// then fields with defaults (event + optional).
function sortPyFields(fields: FieldDef[]): FieldDef[] {
  const noDef = fields.filter((f) => !f.isEventDisc && f.required);
  const hasDef = fields.filter((f) => f.isEventDisc || !f.required);

  noDef.sort((a, b) => {
    if (a.name === "timestamp") return -1;
    if (b.name === "timestamp") return 1;
    return a.name.localeCompare(b.name);
  });
  hasDef.sort((a, b) => {
    if (a.name === "event") return -1;
    if (b.name === "event") return 1;
    return a.name.localeCompare(b.name);
  });

  return [...noDef, ...hasDef];
}

// C# sort: timestamp first, event second, then required before optional, alpha
function sortCsFields(fields: FieldDef[]): FieldDef[] {
  const copy = [...fields];
  copy.sort((a, b) => {
    if (a.name === "timestamp") return -1;
    if (b.name === "timestamp") return 1;
    if (a.name === "event") return -1;
    if (b.name === "event") return 1;
    if (a.required !== b.required) return a.required ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return copy;
}

// ── Python generation ─────────────────────────────────────────────────────────

function genPython(
  events: {
    eventName: string;
    fields: FieldDef[];
    nestedTypes: InlineType[];
  }[],
): string {
  const lines: string[] = [];
  lines.push("# Generated code \u2013 do not edit manually");
  lines.push("# pylint: disable=too-many-lines,missing-class-docstring");
  lines.push("from __future__ import annotations");
  lines.push("");
  lines.push("from dataclasses import dataclass, field");
  lines.push("from typing import Optional, Any");
  lines.push("");

  for (const ev of events) {
    for (const nt of ev.nestedTypes) {
      lines.push("");
      lines.push("@dataclass");
      lines.push(`class ${nt.name}:`);
      const nf = sortPyFields(nt.fields);
      for (const f of nf) {
        if (f.isEventDisc) {
          lines.push(
            `    ${f.name}: str = field(default="${f.eventDefault ?? ev.eventName}")`,
          );
        } else if (f.required) {
          lines.push(`    ${f.name}: ${f.pyType}`);
        } else {
          lines.push(`    ${f.name}: Optional[${f.pyType}] = None`);
        }
      }
    }

    lines.push("");
    lines.push("@dataclass");
    lines.push(`class ${ev.eventName}:`);
    const sf = sortPyFields(ev.fields);
    for (const f of sf) {
      if (f.isEventDisc) {
        lines.push(
          `    ${f.name}: str = field(default="${f.eventDefault ?? ev.eventName}")`,
        );
      } else if (f.name === "timestamp") {
        lines.push(`    ${f.name}: str`);
      } else if (f.required) {
        lines.push(`    ${f.name}: ${f.pyType}`);
      } else {
        lines.push(`    ${f.name}: Optional[${f.pyType}] = None`);
      }
    }
  }

  // ── Hardcoded shared types ────────────────────────────────────────────────
  lines.push("");
  lines.push("");
  lines.push(
    "# \u2500\u252c\u2500 Shared types (hardcoded from TS types.ts) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
  );
  lines.push("");

  const pyShared: Record<string, [string, string, boolean][]> = {
    FactionState: [
      ["Name", "str", true],
      ["FactionState", "str", true],
      ["Government", "str", true],
      ["Influence", "float", true],
      ["Allegiance", "str", true],
      ["Happiness", "str", false],
      ["Happiness_Localised", "str", false],
      ["MyReputation", "float", false],
      ["SquadronFaction", "bool", false],
      ["ActiveStates", "list[StateTimeline]", false],
      ["PendingStates", "list[StateTimeline]", false],
      ["RecoveringStates", "list[StateTimeline]", false],
    ],
    StateTimeline: [
      ["State", "str", true],
      ["Trend", "float", false],
    ],
    Conflict: [
      ["WarType", "str", true],
      ["Status", "str", true],
      ["Faction1", "ConflictFaction", true],
      ["Faction2", "ConflictFaction", true],
    ],
    ConflictFaction: [
      ["Name", "str", true],
      ["Stake", "str", true],
      ["WonDays", "int", true],
    ],
    ThargoidWarInfo: [
      ["WarType", "str", false],
      ["RemainingPorts", "int", false],
      ["SuccessReached", "bool", false],
      ["EstimatedRemainingTime", "str", false],
    ],
    StationEconomy: [
      ["Name", "str", true],
      ["Share", "float", true],
    ],
    LandingPads: [
      ["Small", "int", true],
      ["Medium", "int", true],
      ["Large", "int", true],
    ],
    CommodityItem: [
      ["Name", "str", true],
      ["Name_Localised", "str", false],
      ["BuyPrice", "int", true],
      ["SellPrice", "int", true],
      ["MeanPrice", "int", true],
      ["StockBracket", "int", true],
      ["DemandBracket", "int", true],
      ["Stock", "int", true],
      ["Demand", "int", true],
      ["StatusFlags", "str", true],
    ],
    ParentBody: [
      ["Star", "int", false],
      ["Planet", "int", false],
      ["Null", "int", false],
    ],
    Ring: [
      ["Name", "str", true],
      ["RingClass", "str", true],
      ["MassMT", "float", true],
      ["InnerRad", "float", true],
      ["OuterRad", "float", true],
    ],
    AtmosphereComposition: [
      ["Name", "str", true],
      ["Percent", "float", true],
    ],
    Composition: [
      ["Ice", "float", false],
      ["Rock", "float", false],
      ["Metal", "float", false],
    ],
    Mission: [
      ["timestamp", "str", true],
      ["event", "str", true],
      ["MissionID", "int", true],
      ["Name", "str", true],
      ["PassengerMission", "bool", false],
      ["Expiry", "str", false],
      ["Influence", "str", false],
      ["Reputation", "str", false],
      ["Reward", "int", false],
      ["Wing", "bool", false],
      ["Failed", "bool", false],
    ],
    EngineeringMod: [
      ["Engineer", "str", true],
      ["BlueprintName", "str", true],
      ["BlueprintID", "int", true],
      ["Level", "int", true],
      ["Quality", "float", true],
      ["ExperimentalEffect", "str", false],
      ["ExperimentalEffect_Localised", "str", false],
      ["Modifiers", "list[Modifier]", false],
    ],
    Modifier: [
      ["Label", "str", true],
      ["Value", "float", false],
      ["OriginalValue", "float", false],
      ["LessIsGood", "bool", false],
      ["ValueStr", "str", false],
    ],
    ModuleItem: [
      ["Slot", "str", true],
      ["Item", "str", true],
      ["Item_Localised", "str", false],
      ["On", "bool", true],
      ["Priority", "int", true],
      ["Health", "float", false],
      ["Value", "int", false],
      ["Engineering", "EngineeringMod", false],
      ["AmmoClip", "int", false],
      ["AmmoHopper", "int", false],
    ],
    ShipItem: [
      ["Ship", "str", true],
      ["ShipID", "int", true],
      ["ShipName", "str", true],
      ["ShipIdent", "str", true],
      ["Modules", "list[ModuleItem]", false],
      ["FuelCapacity", "dict[str, float]", false],
      ["CargoCapacity", "int", false],
      ["HullValue", "int", false],
      ["ModulesValue", "int", false],
      ["Rebuy", "int", false],
      ["Hot", "bool", false],
      ["HullHealth", "float", false],
      ["UnladenMass", "float", false],
      ["MaxJumpRange", "float", false],
    ],
    FuelStatus: [
      ["FuelMain", "float", true],
      ["FuelReservoir", "float", true],
    ],
    DestinationStatus: [
      ["System", "int", true],
      ["Body", "int", true],
    ],
    JournalPosition: [
      ["file", "str", true],
      ["offset", "int", true],
      ["line", "int", true],
    ],
  };

  for (const [name, sfields] of Object.entries(pyShared)) {
    lines.push("");
    lines.push("@dataclass");
    lines.push(`class ${name}:`);
    const noDef = sfields.filter(([fn, _, r]) => r && fn !== "event");
    const evFld = sfields.find(([fn]) => fn === "event");
    const withDef = sfields.filter(([fn, _, r]) => !r && fn !== "event");
    if (noDef.length === 0 && !evFld && withDef.length === 0) {
      lines.push("    pass");
      continue;
    }
    for (const [fn, ft] of noDef) lines.push(`    ${fn}: ${ft}`);
    if (evFld) lines.push(`    ${evFld[0]}: str = field(default="")`);
    for (const [fn, ft] of withDef)
      lines.push(`    ${fn}: Optional[${ft}] = None`);
  }

  return lines.join("\n");
}

// ── C# generation ──────────────────────────────────────────────────────────────

function genCSharp(
  events: {
    eventName: string;
    fields: FieldDef[];
    nestedTypes: InlineType[];
  }[],
): string {
  const lines: string[] = [];
  lines.push("// Generated code \u2013 do not edit manually");
  lines.push("#nullable enable");
  lines.push("using System.Collections.Generic;");
  lines.push("using System.Text.Json.Serialization;");
  lines.push("");
  lines.push("namespace EliteDangerousSdk.Journal;");
  lines.push("");

  for (const ev of events) {
    for (const nt of ev.nestedTypes) {
      lines.push(`public record ${nt.name}`);
      lines.push(`{`);
      for (const f of sortCsFields(nt.fields)) {
        const opt = f.required ? "" : "?";
        const pn = f.name === "event" ? "@event" : f.name;
        const dv = f.name === "event" ? ` = "${f.eventDefault ?? ""}"` : "";
        const sc = dv ? ";" : "";
        const attr =
          f.name === "event" ? `    [JsonPropertyName("event")]\n` : "";
        lines.push(
          `${attr}    public ${f.csType}${opt} ${pn} { get; init; }${dv}${sc}`,
        );
      }
      lines.push(`}`);
      lines.push("");
    }

    lines.push(`public record ${ev.eventName}`);
    lines.push(`{`);
    for (const f of sortCsFields(ev.fields)) {
      const opt = f.required ? "" : "?";
      const pn = f.name === "event" ? "@event" : f.name;
      const dv = f.isEventDisc ? ` = "${f.eventDefault ?? ev.eventName}"` : "";
      const sc = dv ? ";" : "";
      const attr =
        f.name === "event" ? `    [JsonPropertyName("event")]\n` : "";
      lines.push(
        `${attr}    public ${f.csType}${opt} ${pn} { get; init; }${dv}${sc}`,
      );
    }
    lines.push(`}`);
    lines.push("");
  }

  // ── Hardcoded shared types ────────────────────────────────────────────────
  lines.push(
    "// \u2500\u252c\u2500 Shared types (hardcoded from TS types.ts) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
  );
  lines.push("");

  // Use PascalCase property names. The FactionState record has a field named
  // FactionState -- we alias it to FactionStateValue in C# to avoid CS0542.
  const csShared: Record<string, [string, string, boolean][]> = {
    FactionState: [
      ["Name", "string", true],
      ["FactionStateValue", "string", true],
      ["Government", "string", true],
      ["Influence", "double", true],
      ["Allegiance", "string", true],
      ["Happiness", "string", false],
      ["Happiness_Localised", "string", false],
      ["MyReputation", "double", false],
      ["SquadronFaction", "bool", false],
      ["ActiveStates", "List<StateTimeline>", false],
      ["PendingStates", "List<StateTimeline>", false],
      ["RecoveringStates", "List<StateTimeline>", false],
    ],
    StateTimeline: [
      ["State", "string", true],
      ["Trend", "double", false],
    ],
    Conflict: [
      ["WarType", "string", true],
      ["Status", "string", true],
      ["Faction1", "ConflictFaction", true],
      ["Faction2", "ConflictFaction", true],
    ],
    ConflictFaction: [
      ["Name", "string", true],
      ["Stake", "string", true],
      ["WonDays", "long", true],
    ],
    ThargoidWarInfo: [
      ["WarType", "string", false],
      ["RemainingPorts", "long", false],
      ["SuccessReached", "bool", false],
      ["EstimatedRemainingTime", "string", false],
    ],
    StationEconomy: [
      ["Name", "string", true],
      ["Share", "double", true],
    ],
    LandingPads: [
      ["Small", "long", true],
      ["Medium", "long", true],
      ["Large", "long", true],
    ],
    CommodityItem: [
      ["Name", "string", true],
      ["Name_Localised", "string", false],
      ["BuyPrice", "long", true],
      ["SellPrice", "long", true],
      ["MeanPrice", "long", true],
      ["StockBracket", "long", true],
      ["DemandBracket", "long", true],
      ["Stock", "long", true],
      ["Demand", "long", true],
      ["StatusFlags", "string", true],
    ],
    ParentBody: [
      ["Star", "long", false],
      ["Planet", "long", false],
      ["Null", "long", false],
    ],
    Ring: [
      ["Name", "string", true],
      ["RingClass", "string", true],
      ["MassMT", "double", true],
      ["InnerRad", "double", true],
      ["OuterRad", "double", true],
    ],
    AtmosphereComposition: [
      ["Name", "string", true],
      ["Percent", "double", true],
    ],
    Composition: [
      ["Ice", "double", false],
      ["Rock", "double", false],
      ["Metal", "double", false],
    ],
    Mission: [
      ["Timestamp", "string", true],
      ["Event", "string", true],
      ["MissionID", "long", true],
      ["Name", "string", true],
      ["PassengerMission", "bool", false],
      ["Expiry", "string", false],
      ["Influence", "string", false],
      ["Reputation", "string", false],
      ["Reward", "long", false],
      ["Wing", "bool", false],
      ["Failed", "bool", false],
    ],
    EngineeringMod: [
      ["Engineer", "string", true],
      ["BlueprintName", "string", true],
      ["BlueprintID", "long", true],
      ["Level", "long", true],
      ["Quality", "double", true],
      ["ExperimentalEffect", "string", false],
      ["ExperimentalEffect_Localised", "string", false],
      ["Modifiers", "List<Modifier>", false],
    ],
    Modifier: [
      ["Label", "string", true],
      ["Value", "double", false],
      ["OriginalValue", "double", false],
      ["LessIsGood", "bool", false],
      ["ValueStr", "string", false],
    ],
    ModuleItem: [
      ["Slot", "string", true],
      ["Item", "string", true],
      ["Item_Localised", "string", false],
      ["On", "bool", true],
      ["Priority", "long", true],
      ["Health", "double", false],
      ["Value", "long", false],
      ["Engineering", "EngineeringMod", false],
      ["AmmoClip", "long", false],
      ["AmmoHopper", "long", false],
    ],
    ShipItem: [
      ["Ship", "string", true],
      ["ShipID", "long", true],
      ["ShipName", "string", true],
      ["ShipIdent", "string", true],
      ["Modules", "List<ModuleItem>", false],
      ["FuelCapacity", "Dictionary<string, double>", false],
      ["CargoCapacity", "long", false],
      ["HullValue", "long", false],
      ["ModulesValue", "long", false],
      ["Rebuy", "long", false],
      ["Hot", "bool", false],
      ["HullHealth", "double", false],
      ["UnladenMass", "double", false],
      ["MaxJumpRange", "double", false],
    ],
    FuelStatus: [
      ["FuelMain", "double", true],
      ["FuelReservoir", "double", true],
    ],
    DestinationStatus: [
      ["System", "long", true],
      ["Body", "long", true],
    ],
    // JournalPosition omitted — already defined in Journal/JournalReader.cs
  };

  for (const [name, sfields] of Object.entries(csShared)) {
    lines.push(`public record ${name}`);
    lines.push(`{`);
    if (sfields.length === 0) {
      lines.push("");
    }
    for (const [fn, ft, req] of sfields) {
      const opt = req ? "" : "?";
      lines.push(`    public ${ft}${opt} ${fn} { get; init; }`);
    }
    lines.push(`}`);
    lines.push("");
  }

  return lines.join("\n");
}

// Schema-generated event names that MUST be skipped because they collide with
// hardcoded shared types that have a different structure (e.g. FuelStatus).
const SKIP_SCHEMA_EVENTS = new Set(["FuelStatus"]);

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const eventFiles = fs
    .readdirSync(EVENTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(EVENTS_DIR, f));

  const allFiles = [
    ...eventFiles,
    ...ROOT_SCHEMAS.filter((f) => fs.existsSync(f)),
  ];
  const events: {
    eventName: string;
    fields: FieldDef[];
    nestedTypes: InlineType[];
  }[] = [];

  for (const file of allFiles) {
    const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
    const eventName = raw.title ?? path.basename(file, ".json");
    if (SKIP_SCHEMA_EVENTS.has(eventName)) {
      continue;
    }
    if (!raw.properties) {
      console.warn(`  \u26a0  ${path.basename(file)}: no properties, skipping`);
      continue;
    }
    const required = raw.required ?? [];
    const allInline: InlineType[] = [];
    const fields = parseFields(raw.properties, required, eventName, allInline);
    events.push({ eventName, fields, nestedTypes: allInline });
  }

  events.sort((a, b) => a.eventName.localeCompare(b.eventName));
  console.log(
    `Read ${allFiles.length} schema files, generated ${events.length} event types`,
  );

  // Python
  const pyOut = genPython(events);
  const pyDir = path.dirname(PYTHON_OUT);
  if (!fs.existsSync(pyDir)) fs.mkdirSync(pyDir, { recursive: true });
  fs.writeFileSync(PYTHON_OUT, pyOut, "utf-8");
  const pyBytes = Buffer.byteLength(pyOut, "utf-8");
  console.log(`  Python: ${PYTHON_OUT} (${pyBytes} bytes)`);

  // C#
  const csOut = genCSharp(events);
  const csDir = path.dirname(CSHARP_OUT);
  if (!fs.existsSync(csDir)) fs.mkdirSync(csDir, { recursive: true });
  fs.writeFileSync(CSHARP_OUT, csOut, "utf-8");
  const csBytes = Buffer.byteLength(csOut, "utf-8");
  console.log(`  C#:    ${CSHARP_OUT} (${csBytes} bytes)`);
}

main();
