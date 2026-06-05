import type { Loadout } from "./loadout.js";
import { calculateTotalMass } from "./loadout.js";

export interface SpeedResult {
  forwardSpeed: number;
  boostSpeed: number;
  pitchRate: number;
  rollRate: number;
  yawRate: number;
  speedsByPip: number[];
  pitchesByPip: number[];
  rollsByPip: number[];
  yawsByPip: number[];
}

function massCurveMultiplier(
  mass: number,
  minMass: number,
  optMass: number,
  maxMass: number,
  minMul: number,
  optMul: number,
  maxMul: number,
): number {
  const xnorm = Math.min(1, (maxMass - mass) / (maxMass - minMass));
  const exponent =
    Math.log((optMul - minMul) / (maxMul - minMul)) /
    Math.log(Math.min(1, (maxMass - optMass) / (maxMass - minMass)));
  const ynorm = xnorm ** exponent;
  return minMul + ynorm * (maxMul - minMul);
}

function calcSpeedForPip(
  speedMult: number,
  baseSpeed: number,
  minthrustPct: number,
  eng: number,
): number {
  const powerdistEngMul = eng / 4;
  return (
    speedMult *
    baseSpeed *
    (powerdistEngMul + minthrustPct * (1 - powerdistEngMul))
  );
}

function calcRotationForPip(
  rotMult: number,
  baseRot: number,
  pipSpeed: number,
  eng: number,
): number {
  return rotMult * baseRot * (1 - pipSpeed * (4 - eng));
}

export function calculateSpeed(loadout: Loadout): SpeedResult {
  const ship = loadout.ship.properties;
  const totalMass = calculateTotalMass(loadout);

  const thruster = loadout.standardModules.find(
    (m: any) => m?.module.grp === "th",
  );

  if (!thruster) {
    const speed = ship.speed;
    const boost = ship.boost;
    const pct = (ship.minthrust ?? 0) / 100;
    const pipSpeed = ship.pipSpeed ?? 0;
    const speeds: number[] = [];
    const pitches: number[] = [];
    const rolls: number[] = [];
    const yaws: number[] = [];
    for (let eng = 0; eng <= 4; eng++) {
      speeds.push(calcSpeedForPip(1, speed, pct, eng));
      pitches.push(calcRotationForPip(1, ship.pitch, pipSpeed, eng));
      rolls.push(calcRotationForPip(1, ship.roll, pipSpeed, eng));
      yaws.push(calcRotationForPip(1, ship.yaw, pipSpeed, eng));
    }
    return {
      forwardSpeed: speeds[4],
      boostSpeed: boost,
      pitchRate: pitches[4],
      rollRate: rolls[4],
      yawRate: yaws[4],
      speedsByPip: speeds,
      pitchesByPip: pitches,
      rollsByPip: rolls,
      yawsByPip: yaws,
    };
  }

  const t = thruster.module as any;
  const minMass = t.minmass!;
  const optMass = t.optmass!;
  const maxMass = t.maxmass!;

  const speedMinMul = t.minmulspeed ?? t.minmul ?? 0;
  const speedOptMul = t.optmulspeed ?? t.optmul ?? 1;
  const speedMaxMul = t.maxmulspeed ?? t.maxmul ?? 1;

  const rotMinMul = t.minmulrotation ?? t.minmul ?? 0;
  const rotOptMul = t.optmulrotation ?? t.optmul ?? 1;
  const rotMaxMul = t.maxmulrotation ?? t.maxmul ?? 1;

  const speedMult = massCurveMultiplier(
    totalMass,
    minMass,
    optMass,
    maxMass,
    speedMinMul,
    speedOptMul,
    speedMaxMul,
  );

  const rotMult = massCurveMultiplier(
    totalMass,
    minMass,
    optMass,
    maxMass,
    rotMinMul,
    rotOptMul,
    rotMaxMul,
  );

  const minthrustPct = (ship.minthrust ?? 0) / 100;
  const pipSpeed = ship.pipSpeed ?? 0;
  const boostFactor = ship.boost / ship.speed;

  const speeds: number[] = [];
  const pitches: number[] = [];
  const rolls: number[] = [];
  const yaws: number[] = [];

  for (let eng = 0; eng <= 4; eng++) {
    speeds.push(calcSpeedForPip(speedMult, ship.speed, minthrustPct, eng));
    pitches.push(calcRotationForPip(rotMult, ship.pitch, pipSpeed, eng));
    rolls.push(calcRotationForPip(rotMult, ship.roll, pipSpeed, eng));
    yaws.push(calcRotationForPip(rotMult, ship.yaw, pipSpeed, eng));
  }

  const boostSpeed = speedMult * ship.speed * boostFactor;

  return {
    forwardSpeed: speeds[4],
    boostSpeed,
    pitchRate: pitches[4],
    rollRate: rolls[4],
    yawRate: yaws[4],
    speedsByPip: speeds,
    pitchesByPip: pitches,
    rollsByPip: rolls,
    yawsByPip: yaws,
  };
}
