import * as fs from "fs";
import * as path from "path";

const scriptDir = __dirname;
const rootDir = path.resolve(scriptDir, "..", "..", "..");
const csvDir = path.resolve(rootDir, "..", "specs", "data", "fdevids");
const outputDir = path.resolve(
	rootDir,
	"packages",
	"data",
	"src",
	"generated",
	"fdevids",
);

interface ColumnDef {
	name: string;
	propName: string;
	type: string;
	nullable: boolean;
}

const TYPE_MAP: Record<string, { type: string; nullable: boolean }> = {
	id: { type: "number", nullable: false },
	symbol: { type: "string", nullable: false },
	name: { type: "string", nullable: false },
	category: { type: "string", nullable: false },
	mount: { type: "string", nullable: true },
	guidance: { type: "string", nullable: true },
	ship: { type: "string", nullable: true },
	class: { type: "number", nullable: true },
	rating: { type: "string", nullable: true },
	entitlement: { type: "string", nullable: true },
	system_address: { type: "number", nullable: true },
	market_id: { type: "number", nullable: true },
	number: { type: "number", nullable: false },
	rarity: { type: "number", nullable: false },
	type: { type: "string", nullable: false },
	label: { type: "string", nullable: false },
	rank: { type: "number", nullable: false },
	sku: { type: "string", nullable: false },
	requirement: { type: "string", nullable: false },
	fdname: { type: "string", nullable: false },
	"english name": { type: "string", nullable: false },
	"system allegiance": { type: "string", nullable: false },
};

const NULLABLE_COLUMNS = new Set([
	"mount",
	"guidance",
	"ship",
	"class",
	"rating",
	"entitlement",
	"system_address",
	"market_id",
]);

const INTERFACE_OVERRIDES: Record<string, string> = {
	dockingdeniedreason: "DockingDeniedReason",
	systemallegiance: "SystemAllegiance",
	factionstate: "FactionState",
	factionid: "FactionId",
	terraformingstate: "TerraformingState",
	combatrank: "CombatRank",
	cqcrank: "CqcRank",
	rare_commodity: "RareCommodity",
};

function singularize(word: string): string {
	const lower = word.toLowerCase();
	if (lower.endsWith("ies") && lower.length > 3) {
		return word.slice(0, -3) + "y";
	}
	if (lower.endsWith("ses") && lower.length > 3) {
		return word.slice(0, -2);
	}
	if (lower.endsWith("s") && !lower.endsWith("ss") && lower.length > 1) {
		return word.slice(0, -1);
	}
	return word;
}

function toPascalCase(name: string): string {
	let spaced = name.replace(/[-_]/g, " ");
	spaced = spaced.replace(/([a-z])([A-Z])/g, "$1 $2");
	spaced = spaced.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
	const parts = spaced.split(/\s+/).filter((p) => p.length > 0);
	return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

function toCamelCase(name: string): string {
	const pascal = toPascalCase(name);
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function pluralize(name: string): string {
	const lower = name.toLowerCase();
	if (
		lower.endsWith("y") &&
		lower.length > 1 &&
		!"aeiou".includes(lower.charAt(lower.length - 2))
	) {
		return name.slice(0, -1) + "ies";
	}
	if (
		lower.endsWith("s") ||
		lower.endsWith("x") ||
		lower.endsWith("z") ||
		lower.endsWith("ch") ||
		lower.endsWith("sh")
	) {
		return name;
	}
	return name + "s";
}

function interfaceNameFromFile(filename: string): string {
	const base = path.basename(filename, ".csv");
	const singular = singularize(base);
	const lower = singular.toLowerCase();
	if (INTERFACE_OVERRIDES[lower]) {
		return INTERFACE_OVERRIDES[lower];
	}
	return toPascalCase(singular);
}

function formatValue(value: string, col: ColumnDef): string {
	if (col.nullable && value === "") {
		return "null";
	}
	if (col.type === "number") {
		if (value === "" || value === undefined || value === null) {
			return "null";
		}
		return parseInt(value, 10).toString();
	}
	const escaped = value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
	return `'${escaped}'`;
}

function splitLine(line: string): string[] {
	const result: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (ch === "," && !inQuotes) {
			result.push(current);
			current = "";
		} else {
			current += ch;
		}
	}
	result.push(current);
	return result;
}

function toPropName(header: string): string {
	return header
		.trim()
		.replace(/[\s-]+/g, "_")
		.replace(/[^a-zA-Z0-9_]/g, "")
		.toLowerCase();
}

function inferColumns(headerLine: string, dataLines: string[]): ColumnDef[] {
	const headers = headerLine.split(",").map((h) => h.trim());
	const allValues: string[][] = headers.map(() => []);

	for (const line of dataLines) {
		const parts = splitLine(line);
		for (let i = 0; i < headers.length; i++) {
			allValues[i].push(parts[i] !== undefined ? parts[i] : "");
		}
	}

	return headers.map((h, i) => {
		const rawName = h;
		const propName = toPropName(rawName);
		const values = allValues[i];

		let type = "string";
		let nullable = false;

		const lookupKey = propName;
		const typeInfo = TYPE_MAP[lookupKey];
		if (typeInfo) {
			type = typeInfo.type;
		} else {
			const headerLower = rawName.toLowerCase().trim();
			for (const [key, info] of Object.entries(TYPE_MAP)) {
				if (toPropName(key) === headerLower || toPropName(key) === propName) {
					type = info.type;
					break;
				}
			}
		}

		if (propName === "id") {
			const allNumeric =
				values.length > 0 && values.every((v) => v === "" || !isNaN(Number(v)));
			if (!allNumeric) {
				type = "string";
			}
		}

		if (NULLABLE_COLUMNS.has(propName)) {
			nullable = true;
		}

		const hasEmpty = values.some((v) => v === "");
		const formattedType = type;
		const formattedNullable =
			nullable && (hasEmpty || NULLABLE_COLUMNS.has(propName));

		return {
			name: rawName,
			propName,
			type: formattedType,
			nullable: formattedNullable,
		};
	});
}

function generateFile(filename: string): string {
	const filePath = path.join(csvDir, filename);
	const content = fs.readFileSync(filePath, "utf-8");
	const lines = content.split(/\r?\n/).filter((l) => l.trim() !== "");

	if (lines.length < 2) return "";

	const headerLine = lines[0];
	const dataLines = lines.slice(1).filter((l) => l.trim() !== "");

	const cols = inferColumns(headerLine, dataLines);
	const intName = interfaceNameFromFile(filename);
	const arrName = pluralize(toCamelCase(intName));

	const output: string[] = [];
	output.push(`export interface ${intName} {`);
	for (const col of cols) {
		const tsType = col.nullable ? `${col.type} | null` : col.type;
		output.push(`  ${col.propName}: ${tsType};`);
	}
	output.push("}");
	output.push("");

	const records: string[] = [];
	for (const line of dataLines) {
		const parts = splitLine(line);
		const fields: string[] = [];
		for (let i = 0; i < cols.length; i++) {
			const val = parts[i] !== undefined ? parts[i] : "";
			fields.push(formatValue(val, cols[i]));
		}
		records.push(
			`  { ${cols.map((c, i) => `${c.propName}: ${fields[i]}`).join(", ")} },`,
		);
	}

	output.push(`export const ${arrName}: ${intName}[] = [`);
	output.push(...records);
	output.push("];");
	output.push("");

	const idCol = cols.find((c) => c.propName === "id");
	const symbolCol = cols.find((c) => c.propName === "symbol");
	const numberCol = cols.find(
		(c) => c.propName === "number" && !cols.find((cc) => cc.propName === "id"),
	);
	const fdnameCol = cols.find((c) => c.propName === "fdname");
	const skuCol = cols.find((c) => c.propName === "sku");

	if (idCol && !numberCol) {
		const keyType = idCol.type;
		output.push(
			`export const ${arrName}ById = new Map<${keyType}, ${intName}>(`,
		);
		output.push(`  ${arrName}.map(r => [r.${idCol.propName}, r])`);
		output.push(");");
		output.push("");
	}

	if (symbolCol) {
		output.push(
			`export const ${arrName}BySymbol = new Map<string, ${intName}>(`,
		);
		output.push(`  ${arrName}.map(r => [r.${symbolCol.propName}, r])`);
		output.push(");");
		output.push("");
	}

	if (fdnameCol) {
		output.push(
			`export const ${arrName}ByFdname = new Map<string, ${intName}>(`,
		);
		output.push(`  ${arrName}.map(r => [r.fdname, r])`);
		output.push(");");
		output.push("");
	}

	if (numberCol) {
		const keyType = numberCol.type;
		const mapName = `${arrName}ByRank`;
		output.push(`export const ${mapName} = new Map<${keyType}, ${intName}>(`);
		output.push(`  ${arrName}.map(r => [r.${numberCol.propName}, r])`);
		output.push(");");
		output.push("");
	}

	if (skuCol && !idCol) {
		output.push(`export const ${arrName}BySku = new Map<string, ${intName}>(`);
		output.push(`  ${arrName}.map(r => [r.sku, r])`);
		output.push(");");
		output.push("");
	}

	const isRankFile =
		/(combatrank|traderank|explorationrank|cqcrank|empirerank|federationrank)/i.test(
			filename,
		);
	if (isRankFile && numberCol) {
		const nameCol = cols.find((c) => c.propName === "name");
		if (nameCol) {
			const namesArrName = toCamelCase(intName) + "Names";
			output.push(
				`export const ${namesArrName}: string[] = ${arrName}.map(r => r.name);`,
			);
			output.push("");
		}
	}

	return output.join("\n");
}

function main(): void {
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const files = fs
		.readdirSync(csvDir)
		.filter((f) => f.endsWith(".csv"))
		.sort((a, b) => a.localeCompare(b));

	const exportLines: string[] = [];
	const writtenFiles: string[] = [];

	for (const file of files) {
		const tsName = path.basename(file, ".csv") + ".ts";
		const code = generateFile(file);
		if (!code) continue;

		const outPath = path.join(outputDir, tsName);
		fs.writeFileSync(
			outPath,
			`// Auto-generated from FDevIDs\n${code}\n`,
			"utf-8",
		);
		writtenFiles.push(tsName);

		const modName = tsName.replace(/\.ts$/, "");
		exportLines.push(`export * from './${modName}';`);
	}

	const indexPath = path.join(outputDir, "index.ts");
	fs.writeFileSync(
		indexPath,
		`// Auto-generated from FDevIDs\n${exportLines.join("\n")}\n`,
		"utf-8",
	);

	console.log(`Generated ${writtenFiles.length} files in ${outputDir}`);
	for (const f of writtenFiles) {
		console.log(`  ${f}`);
	}
}

main();
