import { engineers } from "@elite-dangerous-sdk/data";

export interface EngineerInfo {
  id: number;
  name: string;
  location?: string;
  system?: string;
  station?: string;
  requirements?: {
    name: string;
    rank: number;
    type: string;
  }[];
}

export interface EngineerBlueprint {
  engineerName: string;
  moduleGroup: string;
  blueprintName: string;
  fdName: string;
  grades: number[];
  modifications: string[];
}

export interface EngineerProgress {
  engineer: EngineerInfo;
  unlocked: boolean;
  invited: boolean;
  maxGrade: number;
  completedBlueprints: string[];
}

/** Known ship engineers with verified unlock data from the Elite Dangerous wiki */
export interface EngineerUnlockData {
  invite: string;
  unlock: string;
  system: string;
  station: string;
  type: "ship" | "on-foot";
  location?: string;
}

export const ENGINEER_UNLOCK_DATA: Record<string, EngineerUnlockData> = {
  "Felicity Farseer": {
    invite: "Exploration rank: Scout or higher",
    unlock: "Meta-Alloys ×1",
    system: "Deciat",
    station: "Farseer Inc",
    type: "ship",
    location: "Deciat 6 a",
  },
  "Elvira Martuuk": {
    invite: "Travel at least 300 ly from starting system",
    unlock: "Soontill Relics ×3",
    system: "Khun",
    station: "Long Sight Base",
    type: "ship",
    location: "Khun 5",
  },
  "The Dweller": {
    invite: "Deal in stolen or illicit goods at 5 Black Markets",
    unlock: "Pay 500,000 CR",
    system: "Wyrd",
    station: "Black Hide",
    type: "ship",
    location: "Wyrd A 2",
  },
  "Liz Ryder": {
    invite:
      "Cordial reputation with Eurybia Blue Mafia + complete mission from Chris & Silva's Paradise Hideout",
    unlock: "Landmines ×200",
    system: "Eurybia",
    station: "Demolition Unlimited",
    type: "ship",
    location: "Eurybia Makalu",
  },
  "Tod McQuinn": {
    invite: "Earn 15 bounty vouchers",
    unlock: "Bounty vouchers worth 100,000 CR",
    system: "Wolf 397",
    station: "Trophy Camp",
    type: "ship",
    location: "Wolf 397 Trus Madi",
  },
  "Selene Jean": {
    invite: "Mine at least 500 tons of ore",
    unlock: "Painite ×10",
    system: "Kuk",
    station: "Prospector's Rest",
    type: "ship",
    location: "Kuk B 3",
  },
  "Lei Cheung": {
    invite: "Trade with at least 50 markets",
    unlock: "Gold ×200",
    system: "Laksak",
    station: "Trader's Rest",
    type: "ship",
    location: "Laksak A 1",
  },
  "Hera Tani": {
    invite: "Imperial Navy rank: Outsider or higher",
    unlock: "Kamitra Cigars ×50",
    system: "Kuwemaki",
    station: "The Jet's Hole",
    type: "ship",
    location: "Kuwemaki A 3 a",
  },
  "Juri Ishmaak": {
    invite: "Earn at least 50 combat bonds",
    unlock: "Combat bonds worth 100,000 CR",
    system: "Giryak",
    station: "Pater's Memorial",
    type: "ship",
    location: "Giryak 2 a",
  },
  "Colonel Bris Dekker": {
    invite: "Friendly reputation with the Federation",
    unlock: "Combat bonds worth 1,000,000 CR",
    system: "Sol",
    station: "Dekker's Yard",
    type: "ship",
    location: "Sol Iapetus (permit required)",
  },
  "Didi Vatermann": {
    invite: "Trade rank: Merchant or higher",
    unlock: "Lavian Brandy ×50",
    system: "Leesti",
    station: "Vatermann LLC",
    type: "ship",
    location: "Leesti 1 a",
  },
  "Bill Turner": {
    invite: "Friendly reputation with the Alliance",
    unlock: "Bromellite ×50",
    system: "Alioth",
    station: "Turner Metallics Inc",
    type: "ship",
    location: "Alioth 4 a (permit required)",
  },
  "Broo Tarquin": {
    invite: "Combat rank: Competent or higher",
    unlock: "Fujin Tea ×50",
    system: "Muang",
    station: "Broo's Legacy",
    type: "ship",
    location: "Muang 5 a",
  },
  "Lori Jameson": {
    invite: "Combat rank: Dangerous or higher",
    unlock: "Konnga Ale ×25",
    system: "Shinrarta Dezhra",
    station: "Jameson Base",
    type: "ship",
    location: "Shinrarta Dezhra A 1 (permit required)",
  },
  "Tiana Fortune": {
    invite: "Friendly reputation with the Empire",
    unlock: "Decoded Emission Data ×50",
    system: "Achenar",
    station: "Fortune's Loss",
    type: "ship",
    location: "Achenar 4 a (permit required)",
  },
  "Marco Qwent": {
    invite: "Ally reputation with Sirius Corporation",
    unlock: "Modular Terminals ×25",
    system: "Sirius",
    station: "Qwent Research Base",
    type: "ship",
    location: "Sirius Lucifer (permit required)",
  },
  "Ram Tah": {
    invite: "Exploration rank: Surveyor or higher",
    unlock: "Classified Scan Databanks ×50",
    system: "Meene",
    station: "Phoenix Base",
    type: "ship",
    location: "Meene AB 5 d",
  },
  "Professor Palin": {
    invite: "Travel at least 5,000 ly from starting system",
    unlock: "Sensor Fragments ×25",
    system: "Arque",
    station: "Abel Laboratory",
    type: "ship",
    location: "Arque 4 e",
  },
  "Chloe Sedesi": {
    invite: "Travel at least 5,000 ly from starting system",
    unlock: "Sensor Fragments ×25",
    system: "Shenve",
    station: "Cinder Dock",
    type: "ship",
    location: "Shenve A 6",
  },
  "Zacariah Nemo": {
    invite: "Friendly reputation with Party of Yoru",
    unlock: "Xihe Biomorphic Companions ×25",
    system: "Yoru",
    station: "Nemo Cyber Party Base",
    type: "ship",
    location: "Yoru 4",
  },
  "Petra Olmanova": {
    invite: "Combat rank: Expert or higher",
    unlock: "Progenitor Cells ×200",
    system: "Asura",
    station: "Sanctuary",
    type: "ship",
    location: "Asura 1 a",
  },
  "Marsha Hicks": {
    invite: "Exploration rank: Surveyor or higher",
    unlock: "Osmium ×10",
    system: "Tir",
    station: "The Watchtower",
    type: "ship",
    location: "Tir A 2",
  },
  "Mel Brandon": {
    invite: "Friendly reputation with Colonia Council",
    unlock: "Bounty vouchers worth 100,000 CR",
    system: "Luchtaine",
    station: "The Brig",
    type: "ship",
    location: "Luchtaine A 1 c",
  },
  "Etienne Dorn": {
    invite: "Trade rank: Dealer or higher",
    unlock: "Occupied Escape Pods ×25",
    system: "Los",
    station: "Kraken's Retreat",
    type: "ship",
    location: "Los A 2 b",
  },
  "The Sarge": {
    invite: "Federal Navy rank: Midshipman or higher",
    unlock: "Aberrant Shield Pattern Analysis ×50",
    system: "Beta-3 Tucani",
    station: "The Beach",
    type: "ship",
    location: "Beta-3 Tucani 2 b a",
  },
  "Domino Green": {
    invite: "Travel 100 ly in Apex Interstellar Transport shuttles",
    unlock: "Push ×5",
    system: "Orishis",
    station: "The Jackrabbit",
    type: "on-foot",
    location: "Orishis 4",
  },
  "Hero Ferrari": {
    invite: "Complete 10 Conflict Zones",
    unlock: "Settlement Defence Plans ×5",
    system: "Siris",
    station: "Nevermore Terrace",
    type: "on-foot",
    location: "Siris 5 c",
  },
  "Jude Navarro": {
    invite: "Complete 10 Restore or Reactivation missions",
    unlock: "Genetic Repair Meds ×5",
    system: "Aurai",
    station: "Marshall's Drift",
    type: "on-foot",
    location: "Aurai 1 a",
  },
  "Kit Fowler": {
    invite: "Sell 5 Opinion Polls to Bartenders",
    unlock: "Surveillance Equipment ×5",
    system: "Capoya",
    station: "The Last Call",
    type: "on-foot",
    location: "Capoya 2",
  },
  "Oden Geiger": {
    invite:
      "Sell 20 Biological Samples, Employee Genetic Data, or Genetic Research to Bartenders",
    unlock: "None (referral task suffices)",
    system: "Candiaei",
    station: "Ankh's Promise",
    type: "on-foot",
    location: "Candiaei 9 c",
  },
  "Terra Velasquez": {
    invite: "Complete 6 Covert Heist or Covert Theft missions",
    unlock: "Financial Projections ×15",
    system: "Shou Xing",
    station: "Rascal's Choice",
    type: "on-foot",
    location: "Shou Xing 1",
  },
  "Uma Laszlo": {
    invite: "Unfriendly reputation with Sirius Corporation",
    unlock: "None (referral task suffices)",
    system: "Xuane",
    station: "Laszlo's Resolve",
    type: "on-foot",
    location: "Xuane A 3",
  },
  "Wellington Beck": {
    invite:
      "Sell 15 Classic Entertainment, Multimedia Entertainment, or Cat Media to Bartenders",
    unlock: "InSight Entertainment Suites ×5",
    system: "Jolapa",
    station: "Beck Facility",
    type: "on-foot",
    location: "Jolapa 6 a",
  },
  "Yarden Bond": {
    invite: "Sell 5 Smear Campaign Plans to Bartenders",
    unlock: "None (referral task suffices)",
    system: "Bayan",
    station: "Salamander Bank",
    type: "on-foot",
    location: "Bayan 7 b",
  },
  Baltanos: {
    invite: "Friendly reputation with Colonia Council",
    unlock: "Faction Associates ×10",
    system: "Deriso",
    station: "The Divine Apparatus",
    type: "on-foot",
    location: "Deriso 3 a",
  },
  "Eleanor Bresa": {
    invite: "Visit 5 Settlements in Colonia",
    unlock: "Digital Designs ×10",
    system: "Desy",
    station: "Bresa Modifications",
    type: "on-foot",
    location: "Desy 7 a",
  },
  "Rosa Dayette": {
    invite:
      "Sell 10 Culinary Recipes or Cocktail Recipes to Bartenders in Colonia",
    unlock: "Manufacturing Instructions ×10",
    system: "Kojeara",
    station: "Rosa's Shop",
    type: "on-foot",
    location: "Kojeara 4 b",
  },
  "Yi Shen": {
    invite:
      "Complete all referral tasks for Baltanos, Eleanor Bresa, and Rosa Dayette",
    unlock: "None (referral task suffices)",
    system: "Einheriar",
    station: "Eidolon Hold",
    type: "on-foot",
    location: "Einheriar 1 a",
  },
};

// Known engineer data (from FDevIDs)
export function getAllEngineers(): EngineerInfo[] {
  return engineers.map((e) => ({
    id: e.id ?? 0,
    name: e.name ?? "",
    location: (e as any).location,
    system: (e as any).system,
    station: (e as any).station,
    requirements: (e as any).requirements,
  }));
}

/**
 * Find an engineer by name.
 */
export function findEngineer(name: string): EngineerInfo | undefined {
  const e = engineers.find(
    (eng) => eng.name?.toLowerCase() === name.toLowerCase(),
  );
  if (!e) return undefined;
  return {
    id: e.id ?? 0,
    name: e.name ?? "",
  };
}

/**
 * Look up unlock requirements for any engineer.
 * Returns the verified data from the Elite Dangerous wiki.
 */
export function getEngineerUnlockDetails(
  name: string,
): EngineerUnlockData | undefined {
  return ENGINEER_UNLOCK_DATA[name];
}

/**
 * Get unlock requirements as formatted strings for display.
 */
export function getEngineerUnlockRequirements(name: string): string[] {
  const data = ENGINEER_UNLOCK_DATA[name];
  if (!data) return [];
  const reqs: string[] = [];
  if (data.invite) reqs.push(`Invite: ${data.invite}`);
  if (data.unlock && !data.unlock.startsWith("None")) {
    reqs.push(`Unlock: ${data.unlock}`);
  }
  reqs.push(`Location: ${data.system} / ${data.location} / ${data.station}`);
  return reqs;
}

/**
 * Get all engineers of a specific type.
 */
export function getEngineersByType(type: "ship" | "on-foot"): string[] {
  return Object.entries(ENGINEER_UNLOCK_DATA)
    .filter(([, v]) => v.type === type)
    .map(([k]) => k);
}

/** Estimate engineer progress based on known data */
export function estimateEngineerProgress(
  name: string,
  currentGrade: number,
): { engineer: EngineerInfo; grades: string[]; progress: number } {
  const eng = findEngineer(name);
  const grades = Array.from({ length: 5 }, (_, i) => `Grade ${i + 1}`);
  return {
    engineer: eng ?? { id: 0, name },
    grades,
    progress: currentGrade / 5,
  };
}
