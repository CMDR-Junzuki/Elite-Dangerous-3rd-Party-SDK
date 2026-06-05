import type { Loadout } from "./loadout.js";

export interface DistributorResult {
  systemsCapacity: number;
  systemsRecharge: number;
  enginesCapacity: number;
  enginesRecharge: number;
  weaponsCapacity: number;
  weaponsRecharge: number;
}

export function calculateDistributor(loadout: Loadout): DistributorResult {
  const pd = loadout.standardModules.find((m: any) => m?.module.grp === "pd");
  if (!pd) {
    return {
      systemsCapacity: 0,
      systemsRecharge: 0,
      enginesCapacity: 0,
      enginesRecharge: 0,
      weaponsCapacity: 0,
      weaponsRecharge: 0,
    };
  }

  const p = pd.module as any;
  return {
    systemsCapacity: p.syscap ?? 0,
    systemsRecharge: p.sysrate ?? 0,
    enginesCapacity: p.engcap ?? 0,
    enginesRecharge: p.engrate ?? 0,
    weaponsCapacity: p.wepcap ?? 0,
    weaponsRecharge: p.weprate ?? 0,
  };
}

export function sysRechargeRate(
  _syscap: number,
  sysrate: number,
  sysPips: number,
): number {
  return sysrate * (sysPips / 4) ** 1.1;
}

export function wepRechargeRate(weprate: number, wepPips: number): number {
  return weprate * (wepPips / 4) ** 1.1;
}

export function sysResistance(sysPips: number): number {
  return (sysPips ** 0.85 * 0.6) / 4 ** 0.85;
}

export function capacitorTime(
  capacity: number,
  recharge: number,
  draw: number,
): { duration: number; emptyToFull: number; sustained: boolean } {
  const net = recharge - draw;
  if (net >= 0) {
    return {
      duration: Infinity,
      emptyToFull: capacity / recharge,
      sustained: true,
    };
  }
  return {
    duration: capacity / -net,
    emptyToFull: capacity / recharge,
    sustained: false,
  };
}
