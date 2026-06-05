import { describe, expect, it } from "vitest";
import { combineFlags, hasFlag, parseBitflags } from "../src/bitflags";
import { bearing, distance, midpoint, sphereSearch } from "../src/coordinates";
import { listify } from "../src/listify";

describe("listify", () => {
  it("converts sparse object to array", () => {
    const result = listify({ "0": "a", "2": "c" });
    expect(result).toEqual(["a", null, "c"]);
  });

  it("returns empty array for null/undefined", () => {
    expect(listify(null)).toEqual([]);
    expect(listify(undefined)).toEqual([]);
  });

  it("passes through regular arrays", () => {
    expect(listify(["a", "b"])).toEqual(["a", "b"]);
  });
});

describe("coordinates", () => {
  it("calculates distance", () => {
    const a = { x: 0, y: 0, z: 0 };
    const b = { x: 100, y: 0, z: 0 };
    expect(distance(a, b)).toBe(100);
  });

  it("calculates 3D distance", () => {
    const a = { x: 0, y: 0, z: 0 };
    const b = { x: 10, y: 10, z: 10 };
    expect(distance(a, b)).toBeCloseTo(17.32, 1);
  });

  it("filters sphere search", () => {
    const center = { x: 0, y: 0, z: 0 };
    const systems = [
      { x: 10, y: 0, z: 0 },
      { x: 100, y: 0, z: 0 },
      { x: 5, y: 5, z: 5 },
    ];
    const result = sphereSearch(center, 20, systems);
    expect(result).toHaveLength(2);
  });

  it("calculates midpoint", () => {
    const a = { x: 0, y: 0, z: 0 };
    const b = { x: 10, y: 20, z: 30 };
    const mid = midpoint(a, b);
    expect(mid.x).toBe(5);
    expect(mid.y).toBe(10);
    expect(mid.z).toBe(15);
  });

  it("calculates bearing", () => {
    const a = { x: 0, y: 0, z: 0 };
    const b = { x: 1, y: 0, z: 1 };
    const brg = bearing(a, b);
    expect(brg.azimuth).toBeCloseTo(45, 0);
    expect(brg.elevation).toBeCloseTo(0, 0);
  });
});

describe("bitflags", () => {
  const flags = { Docked: 1, Landed: 2, Supercruise: 16 };

  it("parses bitflags", () => {
    expect(parseBitflags(17, flags)).toEqual(["Docked", "Supercruise"]);
  });

  it("checks flag", () => {
    expect(hasFlag(17, 1)).toBe(true);
    expect(hasFlag(17, 2)).toBe(false);
  });

  it("combines flags", () => {
    expect(combineFlags(1, 2, 16)).toBe(19);
  });
});
