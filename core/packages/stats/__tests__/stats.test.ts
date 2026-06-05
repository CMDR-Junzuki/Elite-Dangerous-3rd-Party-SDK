import { describe, expect, it } from "vitest";

describe("stats package", () => {
  it("exports required functions", async () => {
    const mod = await import("../src/index");
    expect(mod.calculateTotalMass).toBeTypeOf("function");
    expect(mod.calculateJumpRange).toBeTypeOf("function");
    expect(mod.calculateShield).toBeTypeOf("function");
    expect(mod.calculateDistributor).toBeTypeOf("function");
    expect(mod.calculatePower).toBeTypeOf("function");
    expect(mod.calculateSpeed).toBeTypeOf("function");
    expect(mod.calculateWeapons).toBeTypeOf("function");
    expect(mod.calculateHull).toBeTypeOf("function");
  });
});
