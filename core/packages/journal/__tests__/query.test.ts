import { describe, expect, it } from "vitest";
import { countByType, countWhere, filterWhere, query } from "../src/query.js";

const events = [
  {
    event: "FSDJump",
    timestamp: "2026-01-01T00:00:00Z",
    StarSystem: "Sol",
    JumpDist: 4.37,
  },
  {
    event: "FSDJump",
    timestamp: "2026-01-01T01:00:00Z",
    StarSystem: "Alpha Centauri",
    JumpDist: 4.37,
  },
  { event: "Scan", timestamp: "2026-01-01T02:00:00Z", BodyName: "Earth" },
  {
    event: "Docked",
    timestamp: "2026-01-02T00:00:00Z",
    StationName: "Li Qing Jao",
  },
  {
    event: "FSDJump",
    timestamp: "2026-01-03T00:00:00Z",
    StarSystem: "Barnard's Star",
    JumpDist: 5.95,
  },
];

describe("query", () => {
  it("counts all events", () => {
    expect(query(events).count()).toBe(5);
  });

  it("filters by event type", () => {
    expect(query(events).where("event", "FSDJump").count()).toBe(3);
  });

  it("chains multiple filters", () => {
    expect(
      query(events)
        .where("event", "FSDJump")
        .where("StarSystem", "Sol")
        .count(),
    ).toBe(1);
  });

  it("supports > operator", () => {
    expect(
      query(events).where("event", "FSDJump").where("JumpDist", 5, ">").count(),
    ).toBe(1);
  });

  it("filters by timestamp between", () => {
    expect(
      query(events)
        .between("2026-01-01T00:00:00Z", "2026-01-01T23:59:59Z")
        .count(),
    ).toBe(3);
  });

  it("select extracts field values", () => {
    const systems = query(events)
      .where("event", "FSDJump")
      .select<string>("StarSystem");
    expect(systems).toEqual(["Sol", "Alpha Centauri", "Barnard's Star"]);
  });

  it("first and last", () => {
    expect(query(events).where("event", "FSDJump").first()?.StarSystem).toBe(
      "Sol",
    );
    expect(query(events).where("event", "FSDJump").last()?.StarSystem).toBe(
      "Barnard's Star",
    );
  });

  it("toArray returns a copy", () => {
    const arr = query(events).toArray();
    expect(arr).toHaveLength(5);
  });

  it("countWhere and filterWhere helpers", () => {
    expect(countWhere(events, "FSDJump")).toBe(3);
    expect(filterWhere(events, "FSDJump")).toHaveLength(3);
  });

  it("countByType returns counts map", () => {
    const counts = countByType(events);
    expect(counts.FSDJump).toBe(3);
  });
});
