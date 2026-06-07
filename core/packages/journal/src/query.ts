import type { JournalEvent } from "./types.js";

export class JournalQuery {
  private results: JournalEvent[];

  constructor(events: JournalEvent[]) {
    this.results = [...events];
  }

  where(field: string, value: unknown): JournalQuery;
  where(
    field: string,
    value: unknown,
    operator: "=" | "!=" | ">" | ">=" | "<" | "<=",
  ): JournalQuery;
  where(predicate: (event: JournalEvent) => boolean): JournalQuery;
  where(
    fieldOrPred: string | ((event: JournalEvent) => boolean),
    value?: unknown,
    operator: "=" | "!=" | ">" | ">=" | "<" | "<=" = "=",
  ): JournalQuery {
    if (typeof fieldOrPred === "function") {
      this.results = this.results.filter(fieldOrPred);
      return this;
    }
    this.results = this.results.filter((e) => {
      const actual = (e as Record<string, unknown>)[fieldOrPred];
      switch (operator) {
        case "=":
          return actual === value;
        case "!=":
          return actual !== value;
        case ">":
          return (
            typeof actual === "number" &&
            typeof value === "number" &&
            actual > value
          );
        case ">=":
          return (
            typeof actual === "number" &&
            typeof value === "number" &&
            actual >= value
          );
        case "<":
          return (
            typeof actual === "number" &&
            typeof value === "number" &&
            actual < value
          );
        case "<=":
          return (
            typeof actual === "number" &&
            typeof value === "number" &&
            actual <= value
          );
        default:
          return true;
      }
    });
    return this;
  }

  between(start: string, end: string): JournalQuery {
    this.results = this.results.filter(
      (e) => e.timestamp >= start && e.timestamp <= end,
    );
    return this;
  }

  select<T = unknown>(field: string): T[] {
    return this.results.map((e) => (e as Record<string, unknown>)[field] as T);
  }

  count(): number {
    return this.results.length;
  }

  first(): JournalEvent | undefined {
    return this.results[0];
  }

  last(): JournalEvent | undefined {
    return this.results[this.results.length - 1];
  }

  forEach(fn: (event: JournalEvent) => void): void {
    this.results.forEach(fn);
  }

  toArray(): JournalEvent[] {
    return [...this.results];
  }
}

export function query(events: JournalEvent[]): JournalQuery {
  return new JournalQuery(events);
}

export function countWhere(events: JournalEvent[], eventType: string): number {
  return events.filter((e) => e.event === eventType).length;
}

export function filterWhere<T extends JournalEvent = JournalEvent>(
  events: JournalEvent[],
  eventType: string,
): T[] {
  return events.filter((e) => e.event === eventType) as T[];
}

export function countByType(events: JournalEvent[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.event] = (counts[e.event] || 0) + 1;
  }
  return counts;
}
