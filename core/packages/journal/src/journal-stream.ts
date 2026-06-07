import { createReadStream, statSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { getJournalDirectory, listJournalFiles } from "./Journal.js";
import { parseLine } from "./parser.js";
import type { JournalEvent } from "./types.js";

export interface JournalStreamOptions {
  directory?: string;
  from?: "start" | "end";
  filter?: string | string[];
  pollInterval?: number;
}

export interface JournalStream {
  [Symbol.asyncIterator](): AsyncIterableIterator<JournalEvent>;
  stop(): void;
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

async function* readFileEvents(
  file: string,
  startOffset: number,
  _endOffset: number,
  filterSet: Set<string> | null,
  signal: AbortSignal,
): AsyncIterableIterator<JournalEvent> {
  const stream = createReadStream(file, {
    start: startOffset,
    encoding: "utf-8",
  });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  for await (const line of rl) {
    if (signal.aborted) return;
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const event = parseLine(trimmed);
      if (!filterSet || filterSet.has(event.event)) yield event;
    } catch {
      // skip malformed
    }
  }
}

export function createJournalStream(
  options: JournalStreamOptions = {},
): JournalStream {
  const dir = getJournalDirectory(options.directory);
  const filterSet = options.filter
    ? new Set(Array.isArray(options.filter) ? options.filter : [options.filter])
    : null;
  const pollInterval = options.pollInterval ?? 500;
  const abortController = new AbortController();
  const trackedSizes = new Map<string, number>();

  const stream: JournalStream = {
    async *[Symbol.asyncIterator]() {
      const currentFiles = listJournalFiles(dir);

      if (options.from !== "end") {
        for (const file of currentFiles) {
          if (abortController.signal.aborted) return;
          const size = statSync(file).size;
          trackedSizes.set(file, size);
          if (size <= 0) continue;
          yield* readFileEvents(
            file,
            0,
            size,
            filterSet,
            abortController.signal,
          );
        }
      } else {
        for (const file of currentFiles) {
          try {
            trackedSizes.set(file, statSync(file).size);
          } catch {
            // file vanished
          }
        }
      }

      while (!abortController.signal.aborted) {
        const files = listJournalFiles(dir);
        for (const file of files) {
          if (abortController.signal.aborted) return;

          const prevSize = trackedSizes.get(file) ?? 0;
          let currentSize: number;
          try {
            currentSize = statSync(file).size;
          } catch {
            continue;
          }

          if (currentSize > prevSize) {
            yield* readFileEvents(
              file,
              prevSize,
              currentSize,
              filterSet,
              abortController.signal,
            );
            trackedSizes.set(file, currentSize);
          } else if (currentSize < prevSize) {
            trackedSizes.set(file, currentSize);
          }
        }

        await sleep(pollInterval, abortController.signal);
      }
    },

    stop() {
      abortController.abort();
    },
  };

  return stream;
}
