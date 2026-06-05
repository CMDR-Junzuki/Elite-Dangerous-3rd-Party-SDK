// Auto-generated from FDevIDs
export interface Crime {
  id: string;
}

export const crimes: Crime[] = [
  { id: "assault" },
  { id: "collidedAtSpeedInNoFireZone" },
  { id: "collidedAtSpeedInNoFireZone_hulldamage" },
  { id: "disobeyPolice" },
  { id: "dockingMajorBlockingAirlock" },
  { id: "dockingMajorBlockingLandingPad" },
  { id: "dockingMajorTresspass" },
  { id: "dockingMinorBlockingAirlock" },
  { id: "dockingMinorBlockingLandingPad" },
  { id: "dockingMinorTresspass" },
  { id: "dumpingDangerous" },
  { id: "dumpingNearStation" },
  { id: "fireInNoFireZone" },
  { id: "fireInStation" },
  { id: "illegalCargo" },
  { id: "interdiction" },
  { id: "murder" },
  { id: "onFoot_arcCutterUse" },
  { id: "onFoot_breakingAndEntering" },
  { id: "onFoot_carryingIllegalData" },
  { id: "onFoot_carryingIllegalGoods" },
  { id: "onFoot_carryingStolenGoods" },
  { id: "onFoot_damagingDefences" },
  { id: "onFoot_dataTransfer" },
  { id: "onFoot_detectionOfWeapon" },
  { id: "onFoot_eBreachUse" },
  { id: "onFoot_failureToSubmitToPolice" },
  { id: "onFoot_identityTheft" },
  { id: "onFoot_murder" },
  { id: "onFoot_overchargeIntent" },
  { id: "onfoot_overchargedPort" },
  { id: "onFoot_profileCloningIntent" },
  { id: "onFoot_propertyTheft" },
  { id: "onFoot_recklessEndangerment" },
  { id: "onFoot_theft" },
  { id: "onFoot_trespass" },
  { id: "passengerWanted" },
  { id: "piracy" },
  { id: "recklessWeaponsDischarge" },
  { id: "shuttleDestruction" },
];

export const crimesById = new Map<string, Crime>(crimes.map((r) => [r.id, r]));
