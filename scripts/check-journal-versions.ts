import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join, resolve } from "node:path";

const JOURNAL_REGEX = /^Journal\.\d{4}-\d{2}-\d{2}T\d{6}_\d{2}\.log$/;
const JOURNAL_DIRECTORY = "Saved Games/Frontier Developments/Elite Dangerous";

function getDefaultJournalDir(): string {
  const envDir = process.env.ED_JOURNAL_DIR;
  if (envDir) return resolve(envDir);
  if (platform() === "win32") return join(homedir(), JOURNAL_DIRECTORY);
  return join(
    homedir(),
    ".local/share/Steam/steamapps/compatdata/359320/pfx/drive_c/users/steamuser",
    JOURNAL_DIRECTORY,
  );
}

interface CheckResult {
  gameVersion: string;
  gameBuild: string;
  totalLines: number;
  totalEvents: number;
  uniqueObserved: string[];
  unknownEvents: string[];
  knownNotObserved: string[];
  schemaCount: number;
  timestamp: string;
}

function loadKnownEvents(specsDir: string): Set<string> {
  const eventsDir = join(specsDir, "journal", "events");
  if (!existsSync(eventsDir))
    throw new Error(`Events directory not found: ${eventsDir}`);
  return new Set(
    readdirSync(eventsDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, "")),
  );
}

function scanJournalDir(journalDir: string, known: Set<string>): CheckResult {
  if (!existsSync(journalDir))
    throw new Error(`Journal directory not found: ${journalDir}`);

  const files = readdirSync(journalDir)
    .filter((f) => JOURNAL_REGEX.test(f))
    .sort()
    .map((f) => join(journalDir, f));

  if (files.length === 0)
    throw new Error(`No journal files found in ${journalDir}`);

  let gameVersion = "unknown";
  let gameBuild = "unknown";
  const observed = new Set<string>();
  let totalLines = 0;
  let totalEvents = 0;

  for (const file of files) {
    const lines = readFileSync(file, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      totalLines++;
      try {
        const ev = JSON.parse(trimmed);
        if (ev.event) {
          observed.add(ev.event);
          totalEvents++;
          if (ev.event === "FileHeader") {
            if (ev.gameversion) gameVersion = ev.gameversion;
            if (ev.build) gameBuild = ev.build;
          }
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  const unknownEvents = [...observed].filter((e) => !known.has(e)).sort();
  const knownNotObserved = [...known].filter((e) => !observed.has(e)).sort();

  return {
    gameVersion,
    gameBuild,
    totalLines,
    totalEvents,
    uniqueObserved: [...observed].sort(),
    unknownEvents,
    knownNotObserved,
    schemaCount: known.size,
    timestamp: new Date().toISOString(),
  };
}

function getSpecsDir(): string {
  // Check if specs dir exists from CWD (project root when run via npx tsx)
  const fromCwd = resolve("specs");
  if (existsSync(fromCwd)) return fromCwd;
  // Fallback: resolve relative to script location
  const scriptDir = new URL(".", import.meta.url).pathname;
  const fromScript = resolve(scriptDir, "..", "specs");
  if (existsSync(fromScript)) return fromScript;
  throw new Error("Cannot find specs/ directory. Run from project root.");
}

function main(): void {
  const args = process.argv.slice(2);
  const jsonFlag = args.includes("--json");
  const dirArgs = args.filter((a) => a !== "--json");
  const journalDir = dirArgs[0] || getDefaultJournalDir();
  const specsDir = getSpecsDir();

  const known = loadKnownEvents(specsDir);

  console.log(`\n  Journal directory: ${journalDir}`);
  console.log(`  Known schemas: ${known.size}`);

  const result = scanJournalDir(journalDir, known);

  console.log(
    `  Game version: ${result.gameVersion} (build ${result.gameBuild})`,
  );
  console.log(`  Journal lines: ${result.totalLines}`);
  console.log(`  Events parsed: ${result.totalEvents}`);
  console.log(`  Unique events: ${result.uniqueObserved.length}`);
  console.log(`  Unknown events: ${result.unknownEvents.length}`);

  if (result.unknownEvents.length > 0) {
    console.warn(
      `\n  ⚠ UNKNOWN EVENTS DETECTED: ${result.unknownEvents.join(", ")}`,
    );
    console.warn(
      "  These events exist in your journal but have no matching schema.",
    );
    console.warn(
      "  Consider adding schemas for them to specs/journal/events/.",
    );
  } else {
    console.log(
      `\n  ✓ All ${result.uniqueObserved.length} observed events have matching schemas.`,
    );
  }

  if (result.knownNotObserved.length > 0) {
    console.log(
      `\n  Events in schemas but not observed in journal (${result.knownNotObserved.length}):`,
    );
    console.log(`    ${result.knownNotObserved.join(", ")}`);
  }

  // Write JSON report when --json flag is passed
  if (jsonFlag) {
    const reportPath = resolve("version-check-report.json");
    writeFileSync(reportPath, JSON.stringify(result, null, 2));
    console.log(`\n  Report written to ${reportPath}`);
  }
}

main();
