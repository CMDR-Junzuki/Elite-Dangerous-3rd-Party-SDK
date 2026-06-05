import type { JournalEvent } from "./types.js";

const _BIGINT_LIMIT = BigInt(Number.MAX_SAFE_INTEGER);

function isBigIntCandidate(value: number): boolean {
  return value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER;
}

export function parseLine(line: string): JournalEvent {
  // Handle BigInt-safe parsing by checking numbers during reviver
  const parsed = JSON.parse(line, (_key: string, value: unknown): unknown => {
    if (typeof value === "number" && !Number.isInteger(value)) {
      return value;
    }
    if (typeof value === "number" && isBigIntCandidate(value)) {
      return BigInt(value);
    }
    return value;
  });
  return parsed as JournalEvent;
}

export function parseWithBigInt(
  line: string,
): JournalEvent & { _bigint: true } {
  const event = parseLine(line) as JournalEvent & { _bigint: true };
  event._bigint = true;
  return event;
}

export function parseWithLossyIntegers(line: string): JournalEvent {
  return JSON.parse(line) as JournalEvent;
}

export function stringifyEvent(event: JournalEvent): string {
  return JSON.stringify(event, (_key: string, value: unknown): unknown => {
    if (typeof value === "bigint") {
      return Number(value);
    }
    return value;
  });
}

export function stringifyBigIntJSON(event: JournalEvent): string {
  return JSON.stringify(event, (_key: string, value: unknown): unknown => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
}

export function isEventType<T extends JournalEvent>(
  event: JournalEvent,
  type: string,
): event is T {
  return event.event === type;
}
