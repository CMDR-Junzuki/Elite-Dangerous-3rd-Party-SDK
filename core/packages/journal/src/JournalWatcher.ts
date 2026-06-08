import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";
import { watch } from "chokidar";

import { parseLine } from "./parser.js";
import type { JournalEvent } from "./types.js";

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
    console.warn(`[JournalWatcher] Unknown event type: "${event.event}"`);
  }
}

export class JournalWatcher {
  private dir: string;
  private watcher: ReturnType<typeof watch> | null = null;
  private knownFiles: Set<string> = new Set();
  private fileSizes: Map<string, number> = new Map();
  private abortController = new AbortController();
  private _warnOnUnknown: boolean;

  constructor(dir: string, warnOnUnknown = false) {
    this.dir = dir;
    this._warnOnUnknown = warnOnUnknown;
  }

  async *watchEvents(): AsyncIterableIterator<JournalEvent> {
    const fileQueue: string[] = [];

    this.watcher = watch(join(this.dir, "Journal.*.log"), {
      persistent: true,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
      },
    });

    const _streamComplete = new AbortController();
    const newFile = new AbortController();

    this.watcher.on("add", (filePath) => {
      if (!this.knownFiles.has(filePath)) {
        this.knownFiles.add(filePath);
        try {
          const _size = statSync(filePath).size;
          this.fileSizes.set(filePath, 0);
          fileQueue.push(filePath);
          newFile.signal;
        } catch {
          // ignore
        }
      }
    });

    this.watcher.on("change", (filePath) => {
      const prevSize = this.fileSizes.get(filePath) ?? 0;
      try {
        const newSize = statSync(filePath).size;
        if (newSize > prevSize) {
          this.fileSizes.set(filePath, newSize);
          fileQueue.push(filePath);
          newFile.signal;
        }
      } catch {
        // ignore
      }
    });

    try {
      while (!this.abortController.signal.aborted) {
        while (fileQueue.length > 0) {
          const filePath = fileQueue.shift()!;
          const startOffset = this.fileSizes.get(filePath) ?? 0;
          const bytesRead = 0;

          try {
            const stream = createReadStream(filePath, {
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
                yield event;
              } catch {
                // skip malformed
              }
            }

            this.fileSizes.set(filePath, startOffset + bytesRead);
          } catch {
            // file might have been deleted
          }
        }

        // Wait for new files or changes
        await new Promise<void>((resolve) => {
          const onSignal = () => resolve();
          const timeout = setTimeout(resolve, 1000);
          this.abortController.signal.addEventListener("abort", onSignal, {
            once: true,
          });
          const _orig = newFile.signal.addEventListener;
          // We use a simple polling approach instead
          if (this.abortController.signal.aborted) {
            clearTimeout(timeout);
            resolve();
          }
        });
      }
    } finally {
      this.stop();
    }
  }

  stop(): void {
    this.abortController.abort();
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}
