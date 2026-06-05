export type SuitType = "dominator" | "maverick" | "artemis";
export type WeaponManufacturer = "kinematic" | "takada" | "manticore";
export type WeaponCategory = "kinetic" | "thermal" | "plasma" | "explosive";
export type WeaponSize = "primary" | "secondary";
export type FireMode = "automatic" | "semi-auto" | "burst";

export interface SuitBaseStats {
  suitType: SuitType;
  manufacturer: string;
  cost: number;
  shield: number;
  shieldRegen: number;
  battery: number;
  health: number;
  mass: number;
  emergencyAir: number;
  goodsCapacity: number;
  assetsCapacity: number;
  dataCapacity: number;
  weaponSlots: { primary: number; secondary: number };
  consumableSlots: {
    energyCell: number;
    eBreach: number;
    medkit: number;
    fragGrenade: number;
    shieldDisruptor: number;
    shieldProjector: number;
  };
  resistance: {
    kinetic: number;
    thermal: number;
    plasma: number;
    explosive: number;
  };
}

export interface WeaponBaseStats {
  name: string;
  manufacturer: WeaponManufacturer;
  category: WeaponCategory;
  size: WeaponSize;
  fireMode: FireMode;
  cost: number;
  dps: number;
  headshotMultiplier: number;
  effectiveRange: number;
  magazineSize: number;
  reserveAmmo: number;
  reloadTime: number;
  projectileSpeed: number;
}

export interface UpgradeMaterialCost {
  g2: Record<string, number>;
  g3: Record<string, number>;
  g4: Record<string, number>;
  g5: Record<string, number>;
}

export interface OnFootModification {
  name: string;
  type: "suit" | "weapon";
  engineers: string[];
  credits: number;
  materials: Record<string, number>;
  effects: Record<string, number>;
  description?: string;
  compatibleSuits?: SuitType[];
  compatibleManufacturers?: WeaponManufacturer[];
}

export interface OnFootPlannedUpgrade {
  type: "suit" | "weapon";
  name: string;
  currentGrade: number;
  targetGrade: number;
  modifications: string[];
}

export interface OnFootPlannedMaterial {
  material: string;
  quantity: number;
  source: "upgrade" | "modification";
}

export interface OnFootPlan {
  materials: OnFootPlannedMaterial[];
  materialTotal: Record<string, number>;
  totalCredits: number;
  engineers: string[];
}

export const SUIT_BASE_STATS: Record<SuitType, SuitBaseStats> = {
  dominator: {
    suitType: "dominator",
    manufacturer: "Manticore",
    cost: 150_000,
    shield: 15.0,
    shieldRegen: 1.1,
    battery: 10,
    health: 30,
    mass: 100,
    emergencyAir: 60,
    goodsCapacity: 10,
    assetsCapacity: 20,
    dataCapacity: 10,
    weaponSlots: { primary: 2, secondary: 1 },
    consumableSlots: {
      energyCell: 2,
      eBreach: 1,
      medkit: 2,
      fragGrenade: 3,
      shieldDisruptor: 3,
      shieldProjector: 2,
    },
    resistance: { kinetic: -0.5, thermal: 0.6, plasma: 0, explosive: 0 },
  },
  maverick: {
    suitType: "maverick",
    manufacturer: "Remlok",
    cost: 150_000,
    shield: 13.5,
    shieldRegen: 0.99,
    battery: 13.5,
    health: 30,
    mass: 100,
    emergencyAir: 60,
    goodsCapacity: 40,
    assetsCapacity: 60,
    dataCapacity: 20,
    weaponSlots: { primary: 1, secondary: 1 },
    consumableSlots: {
      energyCell: 2,
      eBreach: 2,
      medkit: 1,
      fragGrenade: 2,
      shieldDisruptor: 1,
      shieldProjector: 1,
    },
    resistance: { kinetic: -0.6, thermal: 0.5, plasma: -0.1, explosive: 0 },
  },
  artemis: {
    suitType: "artemis",
    manufacturer: "Supratech",
    cost: 150_000,
    shield: 12.0,
    shieldRegen: 0.88,
    battery: 17,
    health: 30,
    mass: 100,
    emergencyAir: 60,
    goodsCapacity: 20,
    assetsCapacity: 40,
    dataCapacity: 10,
    weaponSlots: { primary: 1, secondary: 1 },
    consumableSlots: {
      energyCell: 3,
      eBreach: 1,
      medkit: 1,
      fragGrenade: 1,
      shieldDisruptor: 1,
      shieldProjector: 1,
    },
    resistance: { kinetic: -0.7, thermal: 0.39, plasma: -0.2, explosive: 0 },
  },
};

export const WEAPON_BASE_STATS: Record<string, WeaponBaseStats> = {
  "Karma C-44": {
    name: "Karma C-44",
    manufacturer: "kinematic",
    category: "kinetic",
    size: "primary",
    fireMode: "automatic",
    cost: 50_000,
    dps: 8.0,
    headshotMultiplier: 2.0,
    effectiveRange: 25,
    magazineSize: 60,
    reserveAmmo: 360,
    reloadTime: 2.5,
    projectileSpeed: 1,
  },
  "Karma AR-50": {
    name: "Karma AR-50",
    manufacturer: "kinematic",
    category: "kinetic",
    size: "primary",
    fireMode: "automatic",
    cost: 100_000,
    dps: 9.0,
    headshotMultiplier: 2.0,
    effectiveRange: 50,
    magazineSize: 40,
    reserveAmmo: 200,
    reloadTime: 2.5,
    projectileSpeed: 1,
  },
  "Karma P-15": {
    name: "Karma P-15",
    manufacturer: "kinematic",
    category: "kinetic",
    size: "secondary",
    fireMode: "semi-auto",
    cost: 75_000,
    dps: 13.8,
    headshotMultiplier: 2.0,
    effectiveRange: 25,
    magazineSize: 24,
    reserveAmmo: 240,
    reloadTime: 1.5,
    projectileSpeed: 1,
  },
  "Karma L-6": {
    name: "Karma L-6",
    manufacturer: "kinematic",
    category: "explosive",
    size: "primary",
    fireMode: "burst",
    cost: 175_000,
    dps: 44.4,
    headshotMultiplier: 1.0,
    effectiveRange: 300,
    magazineSize: 2,
    reserveAmmo: 8,
    reloadTime: 4.5,
    projectileSpeed: 0.6,
  },
  "TK Aphelion": {
    name: "TK Aphelion",
    manufacturer: "takada",
    category: "thermal",
    size: "primary",
    fireMode: "automatic",
    cost: 100_000,
    dps: 9.1,
    headshotMultiplier: 1.0,
    effectiveRange: 70,
    magazineSize: 25,
    reserveAmmo: 150,
    reloadTime: 2.5,
    projectileSpeed: 0,
  },
  "TK Eclipse": {
    name: "TK Eclipse",
    manufacturer: "takada",
    category: "thermal",
    size: "primary",
    fireMode: "automatic",
    cost: 50_000,
    dps: 9.0,
    headshotMultiplier: 1.0,
    effectiveRange: 25,
    magazineSize: 40,
    reserveAmmo: 280,
    reloadTime: 2.0,
    projectileSpeed: 0,
  },
  "TK Zenith": {
    name: "TK Zenith",
    manufacturer: "takada",
    category: "thermal",
    size: "secondary",
    fireMode: "burst",
    cost: 75_000,
    dps: 9.7,
    headshotMultiplier: 1.0,
    effectiveRange: 35,
    magazineSize: 18,
    reserveAmmo: 90,
    reloadTime: 1.5,
    projectileSpeed: 0,
  },
  "Manticore Executioner": {
    name: "Manticore Executioner",
    manufacturer: "manticore",
    category: "plasma",
    size: "primary",
    fireMode: "semi-auto",
    cost: 175_000,
    dps: 12.5,
    headshotMultiplier: 3.0,
    effectiveRange: 100,
    magazineSize: 3,
    reserveAmmo: 30,
    reloadTime: 3.0,
    projectileSpeed: 0.5,
  },
  "Manticore Intimidator": {
    name: "Manticore Intimidator",
    manufacturer: "manticore",
    category: "plasma",
    size: "primary",
    fireMode: "semi-auto",
    cost: 100_000,
    dps: 21.9,
    headshotMultiplier: 1.5,
    effectiveRange: 7,
    magazineSize: 2,
    reserveAmmo: 24,
    reloadTime: 3.0,
    projectileSpeed: 0.5,
  },
  "Manticore Oppressor": {
    name: "Manticore Oppressor",
    manufacturer: "manticore",
    category: "plasma",
    size: "primary",
    fireMode: "automatic",
    cost: 125_000,
    dps: 5.63,
    headshotMultiplier: 1.5,
    effectiveRange: 35,
    magazineSize: 50,
    reserveAmmo: 300,
    reloadTime: 2.5,
    projectileSpeed: 0.5,
  },
  "Manticore Tormentor": {
    name: "Manticore Tormentor",
    manufacturer: "manticore",
    category: "plasma",
    size: "secondary",
    fireMode: "semi-auto",
    cost: 50_000,
    dps: 12.75,
    headshotMultiplier: 2.0,
    effectiveRange: 15,
    magazineSize: 6,
    reserveAmmo: 72,
    reloadTime: 2.0,
    projectileSpeed: 0.5,
  },
};

export const SUIT_UPGRADE_COSTS: Record<SuitType, UpgradeMaterialCost> = {
  dominator: {
    g2: {
      "Suit Schematic": 1,
      "Health Monitor": 1,
      "Power Regulator": 1,
      "Manufacturing Instructions": 1,
      "Titanium Plating": 5,
      Graphene: 5,
    },
    g3: {
      "Suit Schematic": 5,
      "Health Monitor": 5,
      "Power Regulator": 5,
      "Manufacturing Instructions": 5,
      "Titanium Plating": 15,
      Graphene: 15,
    },
    g4: {
      "Suit Schematic": 10,
      "Health Monitor": 10,
      "Power Regulator": 10,
      "Manufacturing Instructions": 10,
      "Titanium Plating": 25,
      Graphene: 25,
    },
    g5: {
      "Suit Schematic": 15,
      "Health Monitor": 15,
      "Power Regulator": 15,
      "Manufacturing Instructions": 15,
      "Titanium Plating": 35,
      Graphene: 35,
    },
  },
  maverick: {
    g2: {
      "Suit Schematic": 1,
      "Health Monitor": 1,
      "Power Regulator": 1,
      "Manufacturing Instructions": 1,
      "Carbon Fibre Plating": 5,
      Graphene: 5,
    },
    g3: {
      "Suit Schematic": 5,
      "Health Monitor": 5,
      "Power Regulator": 5,
      "Manufacturing Instructions": 5,
      "Carbon Fibre Plating": 15,
      Graphene: 15,
    },
    g4: {
      "Suit Schematic": 10,
      "Health Monitor": 10,
      "Power Regulator": 10,
      "Manufacturing Instructions": 10,
      "Carbon Fibre Plating": 25,
      Graphene: 25,
    },
    g5: {
      "Suit Schematic": 15,
      "Health Monitor": 15,
      "Power Regulator": 15,
      "Manufacturing Instructions": 15,
      "Carbon Fibre Plating": 35,
      Graphene: 35,
    },
  },
  artemis: {
    g2: {
      "Suit Schematic": 1,
      "Health Monitor": 1,
      "Power Regulator": 1,
      "Manufacturing Instructions": 1,
      Aerogel: 5,
      Graphene: 5,
    },
    g3: {
      "Suit Schematic": 5,
      "Health Monitor": 5,
      "Power Regulator": 5,
      "Manufacturing Instructions": 5,
      Aerogel: 15,
      Graphene: 15,
    },
    g4: {
      "Suit Schematic": 10,
      "Health Monitor": 10,
      "Power Regulator": 10,
      "Manufacturing Instructions": 10,
      Aerogel: 25,
      Graphene: 25,
    },
    g5: {
      "Suit Schematic": 15,
      "Health Monitor": 15,
      "Power Regulator": 15,
      "Manufacturing Instructions": 15,
      Aerogel: 35,
      Graphene: 35,
    },
  },
};

function kinematicWeaponCosts(
  prefix: "g2" | "g3" | "g4" | "g5",
): Record<string, number> {
  const map: Record<string, Record<string, number>> = {
    g2: {
      "Weapon Schematic": 1,
      "Compression-Liquefied Gas": 1,
      "Manufacturing Instructions": 1,
      "Tungsten Carbide": 2,
      "Weapon Component": 2,
    },
    g3: {
      "Weapon Schematic": 2,
      "Compression-Liquefied Gas": 2,
      "Manufacturing Instructions": 2,
      "Tungsten Carbide": 5,
      "Weapon Component": 5,
    },
    g4: {
      "Weapon Schematic": 4,
      "Compression-Liquefied Gas": 4,
      "Manufacturing Instructions": 4,
      "Tungsten Carbide": 9,
      "Weapon Component": 9,
    },
    g5: {
      "Weapon Schematic": 5,
      "Compression-Liquefied Gas": 5,
      "Manufacturing Instructions": 5,
      "Tungsten Carbide": 12,
      "Weapon Component": 12,
    },
  };
  return map[prefix];
}
function takadaWeaponCosts(
  prefix: "g2" | "g3" | "g4" | "g5",
): Record<string, number> {
  const map: Record<string, Record<string, number>> = {
    g2: {
      "Weapon Schematic": 1,
      "Ionised Gas": 1,
      "Manufacturing Instructions": 1,
      Microelectrode: 2,
      "Optical Fibre": 2,
    },
    g3: {
      "Weapon Schematic": 2,
      "Ionised Gas": 2,
      "Manufacturing Instructions": 2,
      Microelectrode: 5,
      "Optical Fibre": 5,
    },
    g4: {
      "Weapon Schematic": 4,
      "Ionised Gas": 4,
      "Manufacturing Instructions": 4,
      Microelectrode: 9,
      "Optical Fibre": 9,
    },
    g5: {
      "Weapon Schematic": 5,
      "Ionised Gas": 5,
      "Manufacturing Instructions": 5,
      Microelectrode: 12,
      "Optical Fibre": 12,
    },
  };
  return map[prefix];
}
function manticoreWeaponCosts(
  prefix: "g2" | "g3" | "g4" | "g5",
): Record<string, number> {
  const map: Record<string, Record<string, number>> = {
    g2: {
      "Weapon Schematic": 1,
      "Ionised Gas": 1,
      "Manufacturing Instructions": 1,
      "Chemical Superbase": 2,
      Microelectrode: 2,
    },
    g3: {
      "Weapon Schematic": 2,
      "Ionised Gas": 2,
      "Manufacturing Instructions": 2,
      "Chemical Superbase": 5,
      Microelectrode: 5,
    },
    g4: {
      "Weapon Schematic": 4,
      "Ionised Gas": 4,
      "Manufacturing Instructions": 4,
      "Chemical Superbase": 9,
      Microelectrode: 9,
    },
    g5: {
      "Weapon Schematic": 5,
      "Ionised Gas": 5,
      "Manufacturing Instructions": 5,
      "Chemical Superbase": 12,
      Microelectrode: 12,
    },
  };
  return map[prefix];
}

export const WEAPON_UPGRADE_COSTS: Record<
  WeaponManufacturer,
  UpgradeMaterialCost
> = {
  kinematic: {
    g2: kinematicWeaponCosts("g2"),
    g3: kinematicWeaponCosts("g3"),
    g4: kinematicWeaponCosts("g4"),
    g5: kinematicWeaponCosts("g5"),
  },
  takada: {
    g2: takadaWeaponCosts("g2"),
    g3: takadaWeaponCosts("g3"),
    g4: takadaWeaponCosts("g4"),
    g5: takadaWeaponCosts("g5"),
  },
  manticore: {
    g2: manticoreWeaponCosts("g2"),
    g3: manticoreWeaponCosts("g3"),
    g4: manticoreWeaponCosts("g4"),
    g5: manticoreWeaponCosts("g5"),
  },
};

export const ON_FOOT_MODIFICATIONS: Record<string, OnFootModification> = {
  "Extra Backpack Capacity": {
    name: "Extra Backpack Capacity",
    type: "suit",
    engineers: ["Domino Green", "Rosa Dayette", "Wellington Beck"],
    credits: 750_000,
    materials: {
      "Epoxy Adhesive": 5,
      "Memory Chip": 3,
      "Weapon Inventory": 5,
      "Chemical Inventory": 5,
      "Digital Designs": 5,
    },
    effects: { backpackCapacity: 1 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Improved Battery Capacity": {
    name: "Improved Battery Capacity",
    type: "suit",
    engineers: ["Oden Geiger", "Rosa Dayette", "Wellington Beck"],
    credits: 750_000,
    materials: {
      "Reactor Output Review": 5,
      "Maintenance Logs": 8,
      "Ion Battery": 3,
      "Micro Supercapacitor": 5,
      "Electrical Wiring": 5,
    },
    effects: { battery: 0.5 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Improved Jump Assist": {
    name: "Improved Jump Assist",
    type: "suit",
    engineers: ["Hero Ferrari", "Yarden Bond", "Baltanos"],
    credits: 750_000,
    materials: {
      "G-Meds": 5,
      "Micro Thrusters": 3,
      Motor: 5,
      "Topographical Surveys": 5,
    },
    effects: { jumpAssist: 1 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Reduced Tool Battery Consumption": {
    name: "Reduced Tool Battery Consumption",
    type: "suit",
    engineers: ["Domino Green", "Rosa Dayette", "Wellington Beck"],
    credits: 500_000,
    materials: {
      "Electrical Fuse": 3,
      "Micro Transformer": 5,
      "Electrical Wiring": 8,
      "Reactor Output Review": 5,
    },
    effects: { toolEnergyDrain: -0.5 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Night Vision": {
    name: "Night Vision",
    type: "suit",
    engineers: ["Oden Geiger", "Yi Shen"],
    credits: 1_000_000,
    materials: {
      "Surveillance Equipment": 5,
      "Surveillance Logs": 3,
      "Radioactivity Data": 3,
      "NOC Data": 3,
      "Circuit Switch": 5,
    },
    effects: { nightVision: 1 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Faster Shield Regen": {
    name: "Faster Shield Regen",
    type: "suit",
    engineers: ["Kit Fowler", "Uma Laszlo", "Eleanor Bresa"],
    credits: 750_000,
    materials: {
      "Reactor Output Review": 5,
      "Ion Battery": 3,
      "Micro Transformer": 8,
      "Electrical Wiring": 8,
    },
    effects: { shieldRegen: 0.33 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Increased Air Reserves": {
    name: "Increased Air Reserves",
    type: "suit",
    engineers: ["Hero Ferrari", "Terra Velasquez", "Baltanos"],
    credits: 750_000,
    materials: {
      "Oxygenic Bacteria": 5,
      "PH Neutraliser": 8,
      "Pharmaceutical Patents": 3,
      "Air Quality Reports": 8,
    },
    effects: { emergencyAir: 300 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Increased Sprint Duration": {
    name: "Increased Sprint Duration",
    type: "suit",
    engineers: ["Hero Ferrari", "Terra Velasquez", "Baltanos"],
    credits: 750_000,
    materials: {
      "Oxygenic Bacteria": 5,
      "Chemical Catalyst": 8,
      "Troop Deployment Records": 3,
      "Gene Sequencing Data": 3,
      "Clinical Trial Records": 3,
    },
    effects: { sprintDuration: 1 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Enhanced Tracking": {
    name: "Enhanced Tracking",
    type: "suit",
    engineers: ["Domino Green", "Oden Geiger", "Rosa Dayette"],
    credits: 750_000,
    materials: {
      Transmitter: 3,
      "Circuit Board": 3,
      "Topographical Surveys": 5,
      "Stellar Activity Logs": 5,
      "Spectral Analysis Data": 5,
    },
    effects: { scanRange: 100, scanTime: -1 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Added Melee Damage": {
    name: "Added Melee Damage",
    type: "suit",
    engineers: ["Jude Navarro", "Kit Fowler", "Eleanor Bresa"],
    credits: 750_000,
    materials: {
      Epinephrine: 5,
      "Micro Thrusters": 8,
      "Combat Training Material": 5,
      "Combatant Performance": 5,
    },
    effects: { meleeDamage: 1.5 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Combat Movement Speed": {
    name: "Combat Movement Speed",
    type: "suit",
    engineers: ["Terra Velasquez", "Yarden Bond", "Baltanos"],
    credits: 750_000,
    materials: {
      "Evacuation Protocols": 5,
      "Genetic Research": 3,
      Epinephrine: 5,
      "PH Neutraliser": 8,
    },
    effects: { combatMovementSpeed: 0.1 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Damage Resistance": {
    name: "Damage Resistance",
    type: "suit",
    engineers: ["Jude Navarro", "Uma Laszlo", "Eleanor Bresa"],
    credits: 750_000,
    materials: {
      "Titanium Plating": 3,
      "Carbon Fibre Plating": 3,
      "Epoxy Adhesive": 8,
      "Weapon Inventory": 5,
      "Ballistics Data": 5,
    },
    effects: {
      kineticResistance: 0.1,
      thermalResistance: 0.1,
      plasmaResistance: 0.1,
      explosiveResistance: 0.1,
    },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Extra Ammo Capacity": {
    name: "Extra Ammo Capacity",
    type: "suit",
    engineers: ["Jude Navarro", "Kit Fowler", "Eleanor Bresa"],
    credits: 750_000,
    materials: {
      "Weapon Component": 3,
      "Recycling Logs": 8,
      "Weapon Test Data": 5,
      "Production Reports": 5,
    },
    effects: { ammoCapacity: 0.5 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Quieter Footsteps": {
    name: "Quieter Footsteps",
    type: "suit",
    engineers: ["Yarden Bond", "Yi Shen"],
    credits: 1_000_000,
    materials: {
      "Settlement Assault Plans": 2,
      "Tactical Plans": 5,
      "Patrol Routes": 5,
      "Micro Hydraulics": 3,
      "Viscoelastic Polymer": 8,
    },
    effects: { footstepNoise: -0.5 },
    compatibleSuits: ["dominator", "maverick", "artemis"],
  },
  "Audio Masking": {
    name: "Audio Masking",
    type: "weapon",
    engineers: ["Yarden Bond", "Yi Shen"],
    credits: 1_000_000,
    materials: {
      "Audio Logs": 3,
      "Patrol Routes": 5,
      Scrambler: 5,
      Transmitter: 8,
      "Circuit Board": 3,
    },
    effects: { audioMasking: 1 },
  },
  "Faster Handling": {
    name: "Faster Handling",
    type: "weapon",
    engineers: ["Hero Ferrari", "Yarden Bond", "Baltanos"],
    credits: 500_000,
    materials: {
      "Viscoelastic Polymer": 3,
      "Operational Manual": 5,
      "Combatant Performance": 5,
      "Combat Training Material": 5,
    },
    effects: { handlingSpeed: 0.3 },
  },
  "Greater Range": {
    name: "Greater Range",
    type: "weapon",
    engineers: ["Domino Green", "Rosa Dayette", "Wellington Beck"],
    credits: 500_000,
    materials: {},
    effects: { effectiveRange: 0.5 },
    compatibleManufacturers: ["kinematic", "takada", "manticore"],
  },
  "Headshot Damage": {
    name: "Headshot Damage",
    type: "weapon",
    engineers: ["Uma Laszlo", "Yi Shen"],
    credits: 500_000,
    materials: {},
    effects: { headshotMultiplier: 0.5 },
    compatibleManufacturers: ["kinematic", "takada", "manticore"],
  },
  "Improved Hip Fire Accuracy": {
    name: "Improved Hip Fire Accuracy",
    type: "weapon",
    engineers: ["Terra Velasquez", "Yarden Bond", "Baltanos"],
    credits: 500_000,
    materials: {},
    effects: { hipFireAccuracy: 0.15 },
    compatibleManufacturers: ["kinematic", "takada", "manticore"],
  },
  "Magazine Size": {
    name: "Magazine Size",
    type: "weapon",
    engineers: ["Jude Navarro", "Kit Fowler", "Eleanor Bresa"],
    credits: 750_000,
    materials: {
      "Weapon Component": 3,
      "Tungsten Carbide": 3,
      "Metal Coil": 5,
      "Weapon Test Data": 5,
      "Security Expenses": 3,
    },
    effects: { magazineSize: 0.5 },
  },
  "Noise Suppressor": {
    name: "Noise Suppressor",
    type: "weapon",
    engineers: ["Hero Ferrari", "Terra Velasquez", "Baltanos"],
    credits: 1_000_000,
    materials: {
      "Viscoelastic Polymer": 15,
      "Weapon Component": 5,
      "Atmospheric Data": 10,
      "Mining Analytics": 10,
    },
    effects: { noiseSuppressor: 1 },
  },
  "Reload Speed": {
    name: "Reload Speed",
    type: "weapon",
    engineers: ["Jude Navarro", "Uma Laszlo", "Eleanor Bresa"],
    credits: 500_000,
    materials: {
      "Micro Hydraulics": 5,
      Electromagnet: 5,
      "Operational Manual": 5,
      "Production Reports": 5,
      "Combat Training Material": 5,
    },
    effects: { reloadSpeed: 0.3 },
  },
  Scope: {
    name: "Scope",
    type: "weapon",
    engineers: ["Oden Geiger", "Rosa Dayette", "Wellington Beck"],
    credits: 500_000,
    materials: {
      "Spectral Analysis Data": 10,
      "Biometric Data": 5,
      "Optical Lens": 10,
      "Optical Fibre": 5,
    },
    effects: { scopeMagnification: 1 },
  },
  Stability: {
    name: "Stability",
    type: "weapon",
    engineers: ["Domino Green", "Oden Geiger", "Rosa Dayette"],
    credits: 500_000,
    materials: {
      "Viscoelastic Polymer": 5,
      "Micro Hydraulics": 5,
      "Mining Analytics": 5,
      "Risk Assessments": 8,
    },
    effects: { recoil: -0.7 },
  },
  "Stowed Reloading": {
    name: "Stowed Reloading",
    type: "weapon",
    engineers: ["Kit Fowler", "Uma Laszlo", "Eleanor Bresa"],
    credits: 1_000_000,
    materials: {
      "Digital Designs": 5,
      "Operational Manual": 5,
      "Production Schedule": 5,
      "Circuit Board": 3,
      "Encrypted Memory Chip": 8,
    },
    effects: { stowedReloading: 1 },
  },
};

export function getUpgradeCost(
  suitOrWeapon: string,
  currentGrade: number,
): Record<string, number> {
  if (suitOrWeapon in SUIT_UPGRADE_COSTS) {
    const costs = SUIT_UPGRADE_COSTS[suitOrWeapon as SuitType];
    const gradeKey = `g${currentGrade + 1}` as keyof UpgradeMaterialCost;
    return costs[gradeKey] ?? {};
  }
  const weapon = WEAPON_BASE_STATS[suitOrWeapon];
  if (weapon) {
    const costs = WEAPON_UPGRADE_COSTS[weapon.manufacturer];
    const gradeKey = `g${currentGrade + 1}` as keyof UpgradeMaterialCost;
    return costs[gradeKey] ?? {};
  }
  return {};
}

export function getModificationDetails(
  name: string,
): OnFootModification | undefined {
  return ON_FOOT_MODIFICATIONS[name];
}

export function getAvailableModifications(
  equipmentType: "suit" | "weapon",
  suitType?: SuitType,
  manufacturer?: WeaponManufacturer,
): OnFootModification[] {
  return Object.values(ON_FOOT_MODIFICATIONS).filter((m) => {
    if (m.type !== equipmentType) return false;
    if (suitType && m.compatibleSuits && !m.compatibleSuits.includes(suitType))
      return false;
    if (
      manufacturer &&
      m.compatibleManufacturers &&
      !m.compatibleManufacturers.includes(manufacturer)
    )
      return false;
    return true;
  });
}

export function planOnFootEngineering(
  upgrades: OnFootPlannedUpgrade[],
): OnFootPlan {
  const materials: OnFootPlannedMaterial[] = [];
  const engineerSet = new Set<string>();
  let totalCredits = 0;

  for (const upgrade of upgrades) {
    if (upgrade.targetGrade > upgrade.currentGrade) {
      if (upgrade.type === "suit") {
        const costs = SUIT_UPGRADE_COSTS[upgrade.name as SuitType];
        if (costs) {
          for (
            let g = upgrade.currentGrade + 1;
            g <= upgrade.targetGrade;
            g++
          ) {
            const gradeKey = `g${g}` as keyof UpgradeMaterialCost;
            const gradeCosts = costs[gradeKey];
            if (gradeCosts) {
              for (const [mat, qty] of Object.entries(gradeCosts)) {
                materials.push({
                  material: mat,
                  quantity: qty,
                  source: "upgrade",
                });
              }
            }
          }
        }
      } else {
        const weapon = WEAPON_BASE_STATS[upgrade.name];
        if (weapon) {
          const costs = WEAPON_UPGRADE_COSTS[weapon.manufacturer];
          if (costs) {
            for (
              let g = upgrade.currentGrade + 1;
              g <= upgrade.targetGrade;
              g++
            ) {
              const gradeKey = `g${g}` as keyof UpgradeMaterialCost;
              const gradeCosts = costs[gradeKey];
              if (gradeCosts) {
                for (const [mat, qty] of Object.entries(gradeCosts)) {
                  materials.push({
                    material: mat,
                    quantity: qty,
                    source: "upgrade",
                  });
                }
              }
            }
          }
        }
      }
    }

    for (const modName of upgrade.modifications) {
      const mod = ON_FOOT_MODIFICATIONS[modName];
      if (mod) {
        totalCredits += mod.credits;
        for (const eng of mod.engineers) engineerSet.add(eng);
        for (const [mat, qty] of Object.entries(mod.materials)) {
          materials.push({
            material: mat,
            quantity: qty,
            source: "modification",
          });
        }
      }
    }
  }

  const materialTotal: Record<string, number> = {};
  for (const m of materials) {
    materialTotal[m.material] = (materialTotal[m.material] ?? 0) + m.quantity;
  }

  return {
    materials,
    materialTotal,
    totalCredits,
    engineers: [...engineerSet].sort(),
  };
}

export { kinematicWeaponCosts, manticoreWeaponCosts, takadaWeaponCosts };
