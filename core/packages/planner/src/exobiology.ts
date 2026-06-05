/**
 * Exobiology tracker for Odyssey biological data.
 * Species values from EDMC-BioScan (https://github.com/Silarn/EDMC-BioScan)
 * Per-species base values range from 1,000,000 to 20,000,000 CR.
 */

export interface SpeciesEntry {
  name: string;
  value: number;
}

export interface GenusEntry {
  name: string;
  species: SpeciesEntry[];
}

export interface BioSample {
  genus: string;
  species: string;
  system: string;
  systemAddress?: number;
  body: number;
  bodyName?: string;
  scannedAt: string;
  scanType: "Sample" | "Analyse" | "Discovered";
  value: number;
  bonus: number;
  firstDiscovery: boolean;
}

/** All known genera with per-species base values from EDMC-BioScan */
export const GENUS_DATA: GenusEntry[] = [
  {
    name: "Aleoida",
    species: [
      { name: "Aleoida Arcus", value: 7252500 },
      { name: "Aleoida Coronamus", value: 6284600 },
      { name: "Aleoida Spica", value: 3385200 },
      { name: "Aleoida Laminiae", value: 3385200 },
      { name: "Aleoida Gravis", value: 12934900 },
    ],
  },
  {
    name: "Anemone",
    species: [
      { name: "Luteolum Anemone", value: 1499900 },
      { name: "Croceum Anemone", value: 1499900 },
      { name: "Puniceum Anemone", value: 1499900 },
      { name: "Roseum Anemone", value: 1499900 },
      { name: "Rubeum Bioluminescent Anemone", value: 1499900 },
      { name: "Prasinum Bioluminescent Anemone", value: 1499900 },
      { name: "Roseum Bioluminescent Anemone", value: 1499900 },
      { name: "Blatteum Bioluminescent Anemone", value: 1499900 },
    ],
  },
  {
    name: "Bacterium",
    species: [
      { name: "Bacterium Aurasus", value: 1000000 },
      { name: "Bacterium Bullaris", value: 2483600 },
      { name: "Bacterium Cerbrum", value: 6284600 },
      { name: "Bacterium Informem", value: 2483600 },
      { name: "Bacterium Nebula", value: 1000000 },
      { name: "Bacterium Omentilla", value: 2483600 },
      { name: "Bacterium Pendentis", value: 3667600 },
      { name: "Bacterium Profundi", value: 3667600 },
      { name: "Bacterium Scopulum", value: 1000000 },
      { name: "Bacterium Tela", value: 3667600 },
      { name: "Bacterium Vesicula", value: 6284600 },
      { name: "Bacterium Virali", value: 1000000 },
      { name: "Bacterium Volu", value: 3667600 },
    ],
  },
  {
    name: "Brain Tree",
    species: [
      { name: "Roseum Brain Tree", value: 1593700 },
      { name: "Gypseeum Brain Tree", value: 1593700 },
      { name: "Ostrinum Brain Tree", value: 1593700 },
      { name: "Viride Brain Tree", value: 1593700 },
      { name: "Aureum Brain Tree", value: 1593700 },
      { name: "Puniceum Brain Tree", value: 1593700 },
      { name: "Lindigoticum Brain Tree", value: 1593700 },
      { name: "Lividum Brain Tree", value: 1593700 },
    ],
  },
  {
    name: "Cactoida",
    species: [
      { name: "Cactoida Cortexum", value: 3667600 },
      { name: "Cactoida Lapis", value: 2483600 },
      { name: "Cactoida Vermis", value: 16202800 },
      { name: "Cactoida Pullulanta", value: 3667600 },
      { name: "Cactoida Peperatis", value: 2483600 },
    ],
  },
  {
    name: "Clypeus",
    species: [
      { name: "Clypeus Lacrimam", value: 8418000 },
      { name: "Clypeus Margaritus", value: 11873200 },
      { name: "Clypeus Speculumi", value: 16202800 },
    ],
  },
  {
    name: "Concha",
    species: [
      { name: "Concha Renibus", value: 4572400 },
      { name: "Concha Aureolas", value: 7774700 },
      { name: "Concha Labiata", value: 2352400 },
      { name: "Concha Biconcavis", value: 16777215 },
    ],
  },
  {
    name: "Electricae",
    species: [
      { name: "Electricae Pluma", value: 6284600 },
      { name: "Electricae Radialem", value: 6284600 },
    ],
  },
  {
    name: "Fonticulua",
    species: [
      { name: "Fonticulua Segmentatus", value: 19010800 },
      { name: "Fonticulua Campestris", value: 1000000 },
      { name: "Fonticulua Upupam", value: 5727600 },
      { name: "Fonticulua Lapida", value: 3111000 },
      { name: "Fonticulua Fluctus", value: 20000000 },
      { name: "Fonticulua Digitos", value: 1804100 },
    ],
  },
  {
    name: "Frutexa",
    species: [
      { name: "Frutexa Flammasis", value: 3111000 },
      { name: "Frutexa Metallicum", value: 3111000 },
      { name: "Frutexa Collum", value: 14313700 },
      { name: "Frutexa Acicularis", value: 5727600 },
      { name: "Frutexa Sponsa", value: 5727600 },
      { name: "Frutexa Fera", value: 5727600 },
    ],
  },
  {
    name: "Fumerola",
    species: [
      { name: "Fumerola Carbosis", value: 6284600 },
      { name: "Fumerola Extremus", value: 16202800 },
      { name: "Fumerola Nitris", value: 7500900 },
      { name: "Fumerola Aquatis", value: 6284600 },
    ],
  },
  {
    name: "Fungoida",
    species: [
      { name: "Fungoida Setisis", value: 19010800 },
      { name: "Fungoida Stabitis", value: 1810000 },
      { name: "Fungoida Gelata", value: 6284600 },
      { name: "Fungoida Pulvis", value: 7500900 },
      { name: "Fungoida Horris", value: 3111000 },
      { name: "Fungoida Bullarum", value: 16202800 },
      { name: "Fungoida Palmatus", value: 5727600 },
    ],
  },
  {
    name: "Osseus",
    species: [
      { name: "Osseus Spiralis", value: 7500900 },
      { name: "Osseus Discus", value: 1593700 },
      { name: "Osseus Fractum", value: 1593700 },
      { name: "Osseus Pellets", value: 7500900 },
      { name: "Osseus Circum", value: 7500900 },
      { name: "Osseus Cornibus", value: 3111000 },
    ],
  },
  {
    name: "Recepta",
    species: [
      { name: "Recepta Umbrux", value: 12934900 },
      { name: "Recepta Deltahedronix", value: 16202800 },
      { name: "Recepta Conditivus", value: 14313700 },
    ],
  },
  {
    name: "Shard",
    species: [{ name: "Crystalline Shards", value: 1628800 }],
  },
  {
    name: "Stratum",
    species: [
      { name: "Stratum Tectonicas", value: 19010800 },
      { name: "Stratum Paleas", value: 3667600 },
      { name: "Stratum Cucumisis", value: 1000000 },
      { name: "Stratum Laminatum", value: 2483600 },
      { name: "Stratum Arcanum", value: 1000000 },
      { name: "Stratum Excutitus", value: 6284600 },
      { name: "Stratum Frigidum", value: 14313700 },
      { name: "Stratum Montaign", value: 1000000 },
      { name: "Stratum Palpator", value: 1000000 },
      { name: "Stratum Pavonis", value: 6284600 },
      { name: "Stratum Terminator", value: 14313700 },
    ],
  },
  {
    name: "Tubers",
    species: [
      { name: "Roseum Sinuous Tubers", value: 1514500 },
      { name: "Prasinum Sinuous Tubers", value: 1514500 },
      { name: "Albidum Sinuous Tubers", value: 1514500 },
      { name: "Caeruleum Sinuous Tubers", value: 1514500 },
      { name: "Lindigoticum Sinuous Tubers", value: 1514500 },
      { name: "Violaceum Sinuous Tubers", value: 1514500 },
      { name: "Viride Sinuous Tubers", value: 1514500 },
      { name: "Blatteum Sinuous Tubers", value: 1514500 },
    ],
  },
  {
    name: "Tubus",
    species: [
      { name: "Tubus Cavas", value: 2483600 },
      { name: "Tubus Conifer", value: 6284600 },
      { name: "Tubus Cultrorum", value: 6284600 },
      { name: "Tubus Rosarium", value: 2483600 },
      { name: "Tubus Sororibus", value: 16202800 },
    ],
  },
  {
    name: "Tussock",
    species: [
      { name: "Tussock Albata", value: 1000000 },
      { name: "Tussock Capillaris", value: 1000000 },
      { name: "Tussock Cultrato", value: 2483600 },
      { name: "Tussock Ignati", value: 2483600 },
      { name: "Tussock Obstituo", value: 3667600 },
      { name: "Tussock Ornatus", value: 1000000 },
      { name: "Tussock Pennata", value: 3667600 },
      { name: "Tussock Pemetis", value: 2483600 },
      { name: "Tussock Sescis", value: 7424600 },
      { name: "Tussock Suculae", value: 7424600 },
      { name: "Tussock Ventusa", value: 7424600 },
      { name: "Tussock Viminati", value: 7424600 },
    ],
  },
];

/**
 * Find genus data by name (case-insensitive).
 */
export function findGenus(name: string): GenusEntry | undefined {
  return GENUS_DATA.find((g) => g.name.toLowerCase() === name.toLowerCase());
}

/**
 * Find species data within a genus.
 */
export function findSpecies(
  genus: string,
  species: string,
): SpeciesEntry | undefined {
  const genusData = findGenus(genus);
  if (!genusData) return undefined;
  return genusData.species.find(
    (s) => s.name.toLowerCase() === species.toLowerCase(),
  );
}

/**
 * Calculate the expected value of a scan for a given species.
 *
 * ACTUAL GAME MECHANICS (Odyssey):
 *   - Each species has its own base value (1M–20M CR, from EDMC-BioScan)
 *   - First Discovery = 4x bonus on top of base value (total 5x)
 *   - No separate "complete set" bonus exists in the game
 *   - Bonus is applied per-species per-body
 *
 * @param speciesName The full species name (e.g. "Stratum Tectonicas")
 * @param isFirstDiscovery Whether this is a first discovery on this body
 * @returns Total scan value
 */
export function calculateScanValue(
  speciesName: string,
  isFirstDiscovery: boolean,
): number {
  const species = GENUS_DATA.flatMap((g) => g.species).find(
    (s) => s.name.toLowerCase() === speciesName.toLowerCase(),
  );
  if (!species) return 0;

  let total = species.value;
  if (isFirstDiscovery) {
    total += species.value * 4; // 4x bonus for first discovery
  }
  return total;
}

/**
 * Get all species names for a genus.
 */
export function getSpeciesForGenus(genus: string): string[] {
  const data = findGenus(genus);
  return data?.species.map((s) => s.name) ?? [];
}

/**
 * Get the base value for a specific species.
 */
export function getSpeciesValue(genus: string, species: string): number {
  const entry = findSpecies(genus, species);
  return entry?.value ?? 0;
}
