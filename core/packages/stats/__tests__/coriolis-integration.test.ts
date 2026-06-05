import {
  hardpointModules as allHp,
  internalModules as allInt,
  standardModules as allStd,
  type Bulkhead,
  getShipByEdId,
  ships,
} from "@elite-dangerous-sdk/data";
import { describe, expect, it } from "vitest";
import {
  calculateDistributor,
  calculateHull,
  calculateJumpRange,
  calculatePower,
  calculateShield,
  calculateSpeed,
  calculateTotalMass,
  calculateWeapons,
  type EquippedModule,
  type Loadout,
} from "../src";

const SIDEWINDER_EDID = 128049249;

function buildStockSidewinder(): Loadout {
  const ship = getShipByEdId(SIDEWINDER_EDID)!;
  const bulkhead: Bulkhead = ship.bulkheads[0];

  const findStandard = (edId: number) => allStd.find((m) => m.edID === edId)!;
  const findHardpoint = (edId: number) => allHp.find((m) => m.edID === edId)!;
  const findInternal = (edId: number) => allInt.find((m) => m.edID === edId)!;

  const standardModules: (EquippedModule | null)[] = [
    { module: findStandard(128064033), slotIndex: 0 }, // PP 2E
    { module: findStandard(128064068), slotIndex: 1 }, // Thrusters 2E
    { module: findStandard(128064103), slotIndex: 2 }, // FSD 2E
    { module: findStandard(128064138), slotIndex: 3 }, // LS 1E
    { module: findStandard(128064178), slotIndex: 4 }, // PD 1E
    { module: findStandard(128064218), slotIndex: 5 }, // Sensors 1E
    { module: findStandard(128064346), slotIndex: 6 }, // FT 1C
  ];

  const hardpointSlots: (EquippedModule | null)[] = [
    { module: findHardpoint(128049385), slotIndex: 0 }, // Pulse Laser Gimbal Small
    { module: findHardpoint(128049385), slotIndex: 1 },
    null,
    null,
  ];

  const internalSlots: (EquippedModule | null)[] = [
    { module: findInternal(128064263), slotIndex: 0 }, // SG 2E
    { module: findInternal(128064339), slotIndex: 1 }, // CR 2E
    null,
    null,
    null,
    null,
    { module: findInternal(128672317), slotIndex: 6 }, // PAS
  ];

  return {
    ship,
    bulkhead,
    standardModules,
    hardpointModules: hardpointSlots,
    internalModules: internalSlots,
    cargo: 0,
    fuel: 0.3,
    fuelCapacity: 2.3,
  };
}

describe("Coriolis Integration", () => {
  describe("Stock Sidewinder", () => {
    const loadout = buildStockSidewinder();
    const ship = loadout.ship;

    it("calculates total mass correctly", () => {
      const mass = calculateTotalMass(loadout);
      // hull(25) + modules(11.4 + 4 + 2.5) + fuel(0.3) = 43.2
      const expected =
        25 + (2.5 + 2.5 + 2.5 + 1.3 + 1.3 + 1.3 + 0) + 4 + (2.5 + 0) + 0.3;
      expect(mass).toBeCloseTo(expected, 3);
    });

    it("calculates jump range", () => {
      const result = calculateJumpRange(loadout);
      expect(result).not.toBeNull();
      expect(result!.current).toBeGreaterThan(0);
      expect(result!.max).toBeGreaterThanOrEqual(result!.current);
      expect(result!.mass).toBeGreaterThan(0);
      const fsd = loadout.standardModules[2]!.module as any;
      const expectedCurrent =
        ((0.3 / fsd.fuelmul!) ** (1 / fsd.fuelpower!) * fsd.optmass!) /
        (result!.mass + ship.properties.reserveFuelCapacity);
      expect(result!.current).toBeCloseTo(expectedCurrent, 3);
    });

    it("calculates shield values", () => {
      const shield = calculateShield(loadout);
      expect(shield.absoluteShield).toBeGreaterThan(0);
      expect(shield.generatorStrength).toBeGreaterThan(0);
      expect(typeof shield.kinetic).toBe("number");
      expect(typeof shield.thermal).toBe("number");
      expect(typeof shield.explosive).toBe("number");
    });

    it("calculates distributor values", () => {
      const dist = calculateDistributor(loadout);
      expect(dist.systemsCapacity).toBe(8);
      expect(dist.enginesCapacity).toBe(8);
      expect(dist.weaponsCapacity).toBe(10);
      expect(dist.systemsRecharge).toBe(0.4);
      expect(dist.enginesRecharge).toBe(0.4);
      expect(dist.weaponsRecharge).toBe(1.2);
    });

    it("calculates power budget", () => {
      const power = calculatePower(loadout);
      expect(power.available).toBe(6.4);
      expect(power.used).toBeGreaterThan(0);
      expect(power.remaining).toBeCloseTo(power.available - power.used, 5);
      expect(power.pctUsed).toBeGreaterThan(0);
      expect(power.pctUsed).toBeLessThan(100);
    });

    it("calculates speed", () => {
      const speed = calculateSpeed(loadout);
      expect(speed.forwardSpeed).toBeGreaterThan(0);
      expect(speed.boostSpeed).toBeGreaterThan(speed.forwardSpeed);
      expect(speed.pitchRate).toBeGreaterThan(0);
      expect(speed.rollRate).toBeGreaterThan(0);
      expect(speed.yawRate).toBeGreaterThan(0);
      expect(speed.speedsByPip).toHaveLength(5);
      expect(speed.pitchesByPip).toHaveLength(5);
    });

    it("calculates weapon stats", () => {
      const weapons = calculateWeapons(loadout);
      expect(weapons.weapons).toHaveLength(2);
      expect(weapons.totalDps).toBeGreaterThan(0);
      expect(weapons.totalSdps).toBeGreaterThan(0);
      for (const w of weapons.weapons) {
        expect(w.name).toContain("Pulse");
        expect(w.damage).toBe(1.56);
        expect(w.rof).toBeGreaterThan(0);
        expect(w.dps).toBeGreaterThan(0);
        expect(w.range).toBe(3000);
        expect(w.mount).toBe("G");
      }
    });

    it("calculates hull stats", () => {
      const hull = calculateHull(loadout);
      expect(hull.hullHealth).toBeGreaterThan(0);
      expect(hull.armourHardness).toBe(20);
      expect(hull.effectiveHull).toBeGreaterThan(0);
      expect(typeof hull.kineticResistance).toBe("number");
      expect(typeof hull.thermalResistance).toBe("number");
      expect(typeof hull.explosiveResistance).toBe("number");
    });

    it("produces no NaN or Infinity values", () => {
      const checks = [
        calculateTotalMass(loadout),
        calculateJumpRange(loadout)?.current,
        calculateJumpRange(loadout)?.max,
        calculateShield(loadout).absoluteShield,
        calculateDistributor(loadout).systemsCapacity,
        calculatePower(loadout).available,
        calculateSpeed(loadout).forwardSpeed,
        calculateWeapons(loadout).totalDps,
        calculateHull(loadout).hullHealth,
      ];
      for (const val of checks) {
        expect(Number.isFinite(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("Default loadout resolution", () => {
    it("all ships can build a loadout from defaults", () => {
      for (const ship of ships) {
        const bulkhead: Bulkhead = ship.bulkheads[0];
        const std = ship.defaults.standard.map((id, i) => {
          if (typeof id !== "string" || id === "" || id === "0") return null;
          const classMatch = parseInt(id[0], 10);
          const ratingMatch = id[1];
          const groupMap: string[] = ["pp", "t", "fsd", "ls", "pd", "s", "ft"];
          const grp = groupMap[i] || "";
          const found = allStd.find(
            (m) =>
              m.grp === grp &&
              m.class === classMatch &&
              m.rating === ratingMatch,
          );
          if (!found) return null;
          return { module: found, slotIndex: i } as EquippedModule;
        });

        const hp = ship.defaults.hardpoints.map((id, i) => {
          if (!id || id === "0" || id === "") return null;
          const nid = Number(id);
          const found = allHp.find((m) => Number(m.id) === nid);
          if (!found) return null;
          return { module: found, slotIndex: i } as EquippedModule;
        });

        const int = ship.defaults.internal.map((id, i) => {
          if (!id || id === "0" || id === "") return null;
          const found = allInt.find((m) => m.id === String(id));
          if (!found) return null;
          return { module: found, slotIndex: i } as EquippedModule;
        });

        const loadout: Loadout = {
          ship,
          bulkhead,
          standardModules: std,
          hardpointModules: hp,
          internalModules: int,
          cargo: 0,
          fuel: ship.properties.reserveFuelCapacity ?? 0.3,
          fuelCapacity: ship.properties.reserveFuelCapacity ?? 0.3,
        };

        const mass = calculateTotalMass(loadout);
        expect(mass).toBeGreaterThan(ship.properties.hullMass);
        const jump = calculateJumpRange(loadout);
        if (jump !== null) {
          expect(jump.current).toBeGreaterThan(0);
        }
        expect(calculatePower(loadout).available).toBeGreaterThan(0);
        expect(calculateSpeed(loadout).forwardSpeed).toBeGreaterThan(0);
        expect(calculateHull(loadout).hullHealth).toBeGreaterThan(0);
        expect(calculateShield(loadout).absoluteShield).toBeGreaterThan(0);
      }
    });
  });
});
