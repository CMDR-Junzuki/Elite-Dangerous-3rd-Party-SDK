import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "../../../../");
const SPECS = path.join(ROOT, "specs/data/coriolis");
const OUT = path.join(ROOT, "core/packages/data/src/generated/coriolis");

function readJSON<T>(fp: string): T {
	return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

function mkdirp(fp: string) {
	fs.mkdirSync(fp, { recursive: true });
}

function toTS(val: unknown, indent = ""): string {
	if (val === null) return "null";
	if (val === undefined) return "undefined";
	const t = typeof val;
	if (t === "string") return JSON.stringify(val);
	if (t === "number" || t === "boolean") return String(val);
	if (Array.isArray(val)) {
		if (val.length === 0) return "[]";
		const items = val.map((v) => toTS(v, indent + "  "));
		return (
			"[\n" +
			indent +
			"  " +
			items.join(",\n" + indent + "  ") +
			"\n" +
			indent +
			"]"
		);
	}
	if (t === "object") {
		const obj = val as Record<string, unknown>;
		const keys = Object.keys(obj);
		if (keys.length === 0) return "{}";
		const entries = keys.map(
			(k) => `${JSON.stringify(k)}: ${toTS(obj[k], indent + "  ")}`,
		);
		return (
			"{\n" +
			indent +
			"  " +
			entries.join(",\n" + indent + "  ") +
			"\n" +
			indent +
			"}"
		);
	}
	return String(val);
}

function serializeArray(arr: unknown[], varName: string): string {
	return `export const ${varName} = ${toTS(arr)};`;
}

// Collect all unique property keys from an array of objects
function collectKeys<T extends Record<string, unknown>>(items: T[]): string[] {
	const set = new Set<string>();
	for (const item of items) {
		for (const key of Object.keys(item)) {
			set.add(key);
		}
	}
	return [...set].sort();
}

// Value type for interface generation from actual data
function valueType(v: unknown): string {
	if (v === null || v === undefined) return "unknown";
	const t = typeof v;
	if (t === "string") return "string";
	if (t === "number") return Number.isInteger(v) ? "number" : "number";
	if (t === "boolean") return "boolean";
	if (Array.isArray(v)) {
		if (v.length === 0) return "unknown[]";
		const elemTypes = new Set(v.map(valueType));
		const union = [...elemTypes].join(" | ");
		return `(${union})[]`;
	}
	if (t === "object") {
		const obj = v as Record<string, unknown>;
		const keys = Object.keys(obj);
		if (keys.length === 0) return "Record<string, unknown>";
		const fields = keys.map((k) => `${k}: ${valueType(obj[k])}`);
		return `{ ${fields.join("; ")} }`;
	}
	return "unknown";
}

function buildInterface(
	name: string,
	items: Record<string, unknown>[],
	baseFields?: string[],
): string {
	const keys = baseFields ?? collectKeys(items);
	const optional = new Set<string>();
	for (const key of keys) {
		for (const item of items) {
			if (item[key] === undefined || !(key in item)) {
				optional.add(key);
				break;
			}
		}
	}
	const lines: string[] = [`export interface ${name} {`];
	for (const key of keys) {
		if (key === "") continue;
		const present = items.filter((i) => key in i);
		if (present.length === 0) continue;
		const types = new Set(present.map((i) => valueType(i[key])));
		let tsType = [...types].join(" | ");
		if (tsType.includes("{") && tsType.includes("}")) {
			// Mixed object types - fallback
			tsType = "Record<string, unknown>";
		}
		const opt = optional.has(key) ? "?" : "";
		lines.push(`  ${key}${opt}: ${tsType};`);
	}
	lines.push("}");
	return lines.join("\n");
}

function generateShips() {
	const shipsDir = path.join(SPECS, "ships");
	const files = fs
		.readdirSync(shipsDir)
		.filter((f) => f.endsWith(".json") && f !== "package.json");

	const ships: Record<string, unknown>[] = [];
	let shipIdSet = "";

	for (const file of files) {
		const data = readJSON<Record<string, unknown>>(path.join(shipsDir, file));
		const id = Object.keys(data)[0];
		const shipData = data[id] as Record<string, unknown>;
		shipData["id"] = id;
		ships.push(shipData);
		shipIdSet += (shipIdSet ? "\n  | " : "") + `"${id}"`;
	}

	// Collect all property keys for ship properties
	const allProps: Record<string, unknown>[] = [];
	for (const s of ships) {
		const props = s["properties"] as Record<string, unknown> | undefined;
		if (props) allProps.push(props);
	}
	const propKeys = collectKeys(allProps);
	// Ensure certain keys are always present
	const requiredProps = [
		"name",
		"manufacturer",
		"class",
		"hullCost",
		"speed",
		"boost",
		"hullMass",
		"baseArmour",
		"hardness",
	];
	const propInterface = buildInterface("ShipProperties", allProps);
	const bulkheadKeys = [
		"id",
		"edID",
		"grp",
		"cost",
		"mass",
		"causres",
		"explres",
		"kinres",
		"thermres",
		"hullboost",
		"name",
		"eddbID",
	];

	// Build ships array
	const shipsArray = ships.map((s) => toTS(s, "  ")).join(",\n");

	// Build maps
	const byEdIdEntries = ships
		.map(
			(s) =>
				`  [${s["edID"] as number}, ships.find(s => s.id === ${JSON.stringify(s["id"])})!]`,
		)
		.join(",\n");
	const byNameEntries = ships
		.map(
			(s) =>
				`  [${JSON.stringify((s["properties"] as Record<string, unknown>)["name"])}, ships.find(s => s.id === ${JSON.stringify(s["id"])})!]`,
		)
		.join(",\n");

	const content = `// Auto-generated by generate-coriolis.ts

export interface Bulkhead {
  id: string;
  edID: number;
  grp: string;
  cost: number;
  mass: number;
  causres: number;
  explres: number;
  kinres: number;
  thermres: number;
  hullboost: number;
  name: string;
  eddbID?: number;
  [key: string]: unknown;
}

export interface ShipSlot {
  class: number;
  name?: string;
  eligible?: Record<string, number>;
}

export interface ShipSlots {
  standard: (number | ShipSlot)[];
  hardpoints: (number | ShipSlot)[];
  internal: (number | ShipSlot)[];
}

export interface ShipDefaults {
  standard: string[];
  hardpoints: (number | string)[];
  internal: (string | number)[];
}

${propInterface}

export interface Ship {
  id: string;
  edID: number;
  eddbID?: number;
  properties: ShipProperties;
  retailCost: number;
  bulkheads: Bulkhead[];
  slots: ShipSlots;
  defaults: ShipDefaults;
  [key: string]: unknown;
}

export type ShipId =${shipIdSet};

export const ships: Ship[] = [
${shipsArray}
];

export const shipsByEdId = new Map<number, Ship>([
${byEdIdEntries}
]);

export const shipsByName = new Map<string, Ship>([
${byNameEntries}
]);
`;
	writeFile("ships.ts", content);
}

function generateModules(category: "hardpoints" | "internal" | "standard") {
	const dir = path.join(SPECS, "modules", category);
	const files = fs
		.readdirSync(dir)
		.filter((f) => f.endsWith(".json") && f !== "package.json");

	const allVariants: Record<string, unknown>[] = [];

	for (const file of files) {
		const data = readJSON<Record<string, unknown>>(path.join(dir, file));
		const key = Object.keys(data)[0];
		const variants = data[key] as Record<string, unknown>[];
		for (const v of variants) {
			v["_group"] = key;
			allVariants.push(v);
		}
	}

	const keys = collectKeys(allVariants).filter((k) => k !== "_group");
	const fieldLines: string[] = [];
	const optional = new Set<string>();
	for (const key of keys) {
		const hasAll = allVariants.every((v) => key in v);
		const types = new Set(
			allVariants.filter((v) => key in v).map((v) => valueType(v[key])),
		);
		let tsType = [...types].join(" | ");
		if (tsType.includes("{") && tsType.includes("}")) {
			tsType = "Record<string, unknown>";
		}
		const opt = hasAll ? "" : "?";
		fieldLines.push(`  ${key}${opt}: ${tsType};`);
	}
	const variantInterface = `export interface ModuleVariant {\n${fieldLines.join("\n")}\n  [key: string]: unknown;\n}`;

	const varName = `${category === "hardpoints" ? "hardpoint" : category === "internal" ? "internal" : "standard"}Modules`;
	const mapName = `${varName}ByEdId`;
	const arr = toTS(allVariants, "  ");

	const mapEntries = allVariants
		.filter((v) => v["edID"] != null)
		.map(
			(v) =>
				`  [${v["edID"] as number}, ${varName}.find(m => m.edID === ${v["edID"] as number})!]`,
		)
		.join(",\n");

	const content = `// Auto-generated by generate-coriolis.ts

${variantInterface}

export const ${varName}: ModuleVariant[] = ${arr};

export const ${mapName} = new Map<number, ModuleVariant>([
${mapEntries}
]);
`;
	writeFile(
		`${category === "hardpoints" ? "hardpoint-modules" : category === "internal" ? "internal-modules" : "standard-modules"}.ts`,
		content,
	);
}

function generateModifications() {
	const modsDir = path.join(SPECS, "modifications");

	const blueprints = readJSON<Record<string, unknown>>(
		path.join(modsDir, "blueprints.json"),
	);
	const modifications = readJSON<Record<string, unknown>>(
		path.join(modsDir, "modifications.json"),
	);
	const modifierActions = readJSON<Record<string, unknown>>(
		path.join(modsDir, "modifierActions.json"),
	);
	const specials = readJSON<Record<string, unknown>>(
		path.join(modsDir, "specials.json"),
	);
	const modules = readJSON<Record<string, unknown>>(
		path.join(modsDir, "modules.json"),
	);

	const content = `// Auto-generated by generate-coriolis.ts

export interface Blueprint {
  fdname: string;
  name: string;
  id: number;
  modulename: string[];
  grades: Record<string, {
    components: Record<string, number>;
    features: Record<string, [number, number]>;
    uuid: string;
  }>;
  [key: string]: unknown;
}

export interface Modification {
  id: number;
  name: string;
  type: string;
  method: string;
  higherbetter?: boolean;
  hidden?: boolean;
  aggregated?: boolean;
  [key: string]: unknown;
}

export interface ModifierAction {
  [outfittingField: string]: string | number | Record<string, number>;
}

export interface Special {
  id: number;
  edname: string;
  name: string;
  description?: string;
  uuid?: string;
  components?: Record<string, number>;
  [key: string]: unknown;
}

export interface ModuleBlueprintMapping {
  blueprints: Record<string, {
    grades: Record<string, {
      engineers: string[];
    }>;
  }>;
  modifications: string[];
  [key: string]: unknown;
}

export const blueprints: Record<string, Blueprint> = ${toTS(blueprints, "  ")};

export const modifications: Record<string, Modification> = ${toTS(modifications, "  ")};

export const modifierActions: Record<string, ModifierAction> = ${toTS(modifierActions, "  ")};

export const specials: Record<string, Special> = ${toTS(specials, "  ")};

export const moduleBlueprintMappings: Record<string, ModuleBlueprintMapping> = ${toTS(modules, "  ")};
`;
	writeFile("modifications.ts", content);
}

function generateIndex() {
	const content = `// Auto-generated by generate-coriolis.ts
export * from './ships';
export { ModuleVariant as HardpointModule, hardpointModules, hardpointModulesByEdId } from './hardpoint-modules';
export { ModuleVariant as InternalModule, internalModules, internalModulesByEdId } from './internal-modules';
export { ModuleVariant as StandardModule, standardModules, standardModulesByEdId } from './standard-modules';
export * from './modifications';
`;
	writeFile("index.ts", content);
}

function writeFile(name: string, content: string) {
	mkdirp(OUT);
	const fp = path.join(OUT, name);
	fs.writeFileSync(fp, content.trimStart() + "\n");
	console.log(`  Wrote ${path.relative(ROOT, fp)}`);
}

console.log("Generating Coriolis data...");
generateShips();
generateModules("hardpoints");
generateModules("internal");
generateModules("standard");
generateModifications();
generateIndex();
console.log("Done.");
