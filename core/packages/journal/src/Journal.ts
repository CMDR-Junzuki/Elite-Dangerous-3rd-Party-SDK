import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir, platform } from "node:os";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";

import { parseLine } from "./parser.js";
import type {
  JournalEvent,
  JournalOptions,
  JournalPosition,
  Market,
  Status,
} from "./types.js";
import { JOURNAL_DIRECTORY } from "./types.js";

const SCHEMA_EVENTS = loadKnownEvents();

function loadKnownEvents(): Set<string> {
  const eventsDir = resolve("specs/journal/events");
  if (!existsSync(eventsDir)) return new Set();
  return new Set(
    readdirSync(eventsDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, "")),
  );
}

function warnIfUnknown(event: JournalEvent, warnOnUnknown: boolean): void {
  if (!warnOnUnknown) return;
  if (SCHEMA_EVENTS.size === 0) return;
  if (event.event && !SCHEMA_EVENTS.has(event.event)) {
    console.warn(`[Journal] Unknown event type: "${event.event}"`);
  }
}

const JOURNAL_REGEX = /^Journal\.\d{4}-\d{2}-\d{2}T\d{6}_\d{2}\.log$/;

function getDefaultJournalDir(): string {
  const envDir = process.env.ED_JOURNAL_DIR;
  if (envDir) return resolve(envDir);

  if (platform() === "win32") {
    return join(homedir(), JOURNAL_DIRECTORY);
  }
  // Linux (Steam Proton)
  return join(
    homedir(),
    ".local/share/Steam/steamapps/compatdata/359320/pfx/drive_c/users/steamuser",
    JOURNAL_DIRECTORY,
  );
}

export function getJournalDirectory(custom?: string): string {
  return custom ? resolve(custom) : getDefaultJournalDir();
}

export function listJournalFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => JOURNAL_REGEX.test(f))
    .map((f) => join(dir, f))
    .sort();
}

export async function readStatusFile(dir: string): Promise<Status | null> {
  try {
    const content = await readFile(join(dir, "Status.json"), "utf-8");
    return JSON.parse(content) as Status;
  } catch {
    return null;
  }
}

export async function readMarketFile(dir: string): Promise<Market | null> {
  try {
    const content = await readFile(join(dir, "Market.json"), "utf-8");
    return JSON.parse(content) as Market;
  } catch {
    return null;
  }
}

export class Journal {
  private dir: string;
  private position: JournalPosition | null = null;
  private _watching = false;
  private _warnOnUnknown: boolean;

  constructor(options: JournalOptions = {}) {
    this.dir = getJournalDirectory(options.directory);
    this._warnOnUnknown = options.warnOnUnknown ?? false;

    if (options.position) {
      if (options.position === "start") {
        this.position = null;
      } else if (options.position === "end") {
        const files = listJournalFiles(this.dir);
        if (files.length > 0) {
          const lastFile = files[files.length - 1];
          this.position = {
            file: lastFile,
            offset: statSync(lastFile).size,
            line: 0,
          };
        }
      } else {
        this.position = options.position;
      }
    }
  }

  get directory(): string {
    return this.dir;
  }

  get watching(): boolean {
    return this._watching;
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<JournalEvent> {
    const files = listJournalFiles(this.dir);
    const startIndex = this.position ? files.indexOf(this.position!.file) : 0;

    for (let i = Math.max(0, startIndex); i < files.length; i++) {
      const file = files[i];
      const startOffset =
        this.position && file === this.position!.file
          ? this.position!.offset
          : 0;

      const stream = createReadStream(file, {
        start: startOffset,
        encoding: "utf-8",
      });

      const rl = createInterface({ input: stream, crlfDelay: Infinity });

      for await (const line of rl) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const event = parseLine(trimmed);
          warnIfUnknown(event, this._warnOnUnknown);
          this.position = {
            file,
            offset: stream.bytesRead + startOffset,
            line: 0,
          };
          yield event;
        } catch {
          // skip malformed lines
        }
      }
    }

    this.position = null;
  }
}
