from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class SpeciesEntry:
    name: str = ""
    value: int = 0


@dataclass
class GenusEntry:
    name: str = ""
    species: list[SpeciesEntry] = field(default_factory=list)


@dataclass
class BioSample:
    genus: str = ""
    species: str = ""
    system: str = ""
    system_address: Optional[int] = None
    body: int = 0
    body_name: Optional[str] = None
    scanned_at: str = ""
    scan_type: str = ""
    value: int = 0
    bonus: int = 0
    first_discovery: bool = False


GENUS_DATA = [
    GenusEntry("Aleoida", [
        SpeciesEntry("Aleoida Arcus", 7252500),
        SpeciesEntry("Aleoida Coronamus", 6284600),
        SpeciesEntry("Aleoida Spica", 3385200),
        SpeciesEntry("Aleoida Laminiae", 3385200),
        SpeciesEntry("Aleoida Gravis", 12934900),
    ]),
    GenusEntry("Anemone", [
        SpeciesEntry("Luteolum Anemone", 1499900),
        SpeciesEntry("Croceum Anemone", 1499900),
        SpeciesEntry("Puniceum Anemone", 1499900),
        SpeciesEntry("Roseum Anemone", 1499900),
        SpeciesEntry("Rubeum Bioluminescent Anemone", 1499900),
        SpeciesEntry("Prasinum Bioluminescent Anemone", 1499900),
        SpeciesEntry("Roseum Bioluminescent Anemone", 1499900),
        SpeciesEntry("Blatteum Bioluminescent Anemone", 1499900),
    ]),
    GenusEntry("Bacterium", [
        SpeciesEntry("Bacterium Aurasus", 1000000),
        SpeciesEntry("Bacterium Bullaris", 2483600),
        SpeciesEntry("Bacterium Cerbrum", 6284600),
        SpeciesEntry("Bacterium Informem", 2483600),
        SpeciesEntry("Bacterium Nebula", 1000000),
        SpeciesEntry("Bacterium Omentilla", 2483600),
        SpeciesEntry("Bacterium Pendentis", 3667600),
        SpeciesEntry("Bacterium Profundi", 3667600),
        SpeciesEntry("Bacterium Scopulum", 1000000),
        SpeciesEntry("Bacterium Tela", 3667600),
        SpeciesEntry("Bacterium Vesicula", 6284600),
        SpeciesEntry("Bacterium Virali", 1000000),
        SpeciesEntry("Bacterium Volu", 3667600),
    ]),
    GenusEntry("Brain Tree", [
        SpeciesEntry("Roseum Brain Tree", 1593700),
        SpeciesEntry("Gypseeum Brain Tree", 1593700),
        SpeciesEntry("Ostrinum Brain Tree", 1593700),
        SpeciesEntry("Viride Brain Tree", 1593700),
        SpeciesEntry("Aureum Brain Tree", 1593700),
        SpeciesEntry("Puniceum Brain Tree", 1593700),
        SpeciesEntry("Lindigoticum Brain Tree", 1593700),
        SpeciesEntry("Lividum Brain Tree", 1593700),
    ]),
    GenusEntry("Cactoida", [
        SpeciesEntry("Cactoida Cortexum", 3667600),
        SpeciesEntry("Cactoida Lapis", 2483600),
        SpeciesEntry("Cactoida Vermis", 16202800),
        SpeciesEntry("Cactoida Pullulanta", 3667600),
        SpeciesEntry("Cactoida Peperatis", 2483600),
    ]),
    GenusEntry("Clypeus", [
        SpeciesEntry("Clypeus Lacrimam", 8418000),
        SpeciesEntry("Clypeus Margaritus", 11873200),
        SpeciesEntry("Clypeus Speculumi", 16202800),
    ]),
    GenusEntry("Concha", [
        SpeciesEntry("Concha Renibus", 4572400),
        SpeciesEntry("Concha Aureolas", 7774700),
        SpeciesEntry("Concha Labiata", 2352400),
        SpeciesEntry("Concha Biconcavis", 16777215),
    ]),
    GenusEntry("Electricae", [
        SpeciesEntry("Electricae Pluma", 6284600),
        SpeciesEntry("Electricae Radialem", 6284600),
    ]),
    GenusEntry("Fonticulua", [
        SpeciesEntry("Fonticulua Segmentatus", 19010800),
        SpeciesEntry("Fonticulua Campestris", 1000000),
        SpeciesEntry("Fonticulua Upupam", 5727600),
        SpeciesEntry("Fonticulua Lapida", 3111000),
        SpeciesEntry("Fonticulua Fluctus", 20000000),
        SpeciesEntry("Fonticulua Digitos", 1804100),
    ]),
    GenusEntry("Frutexa", [
        SpeciesEntry("Frutexa Flammasis", 3111000),
        SpeciesEntry("Frutexa Metallicum", 3111000),
        SpeciesEntry("Frutexa Collum", 14313700),
        SpeciesEntry("Frutexa Acicularis", 5727600),
        SpeciesEntry("Frutexa Sponsa", 5727600),
        SpeciesEntry("Frutexa Fera", 5727600),
    ]),
    GenusEntry("Fumerola", [
        SpeciesEntry("Fumerola Carbosis", 6284600),
        SpeciesEntry("Fumerola Extremus", 16202800),
        SpeciesEntry("Fumerola Nitris", 7500900),
        SpeciesEntry("Fumerola Aquatis", 6284600),
    ]),
    GenusEntry("Fungoida", [
        SpeciesEntry("Fungoida Setisis", 19010800),
        SpeciesEntry("Fungoida Stabitis", 1810000),
        SpeciesEntry("Fungoida Gelata", 6284600),
        SpeciesEntry("Fungoida Pulvis", 7500900),
        SpeciesEntry("Fungoida Horris", 3111000),
        SpeciesEntry("Fungoida Bullarum", 16202800),
        SpeciesEntry("Fungoida Palmatus", 5727600),
    ]),
    GenusEntry("Osseus", [
        SpeciesEntry("Osseus Spiralis", 7500900),
        SpeciesEntry("Osseus Discus", 1593700),
        SpeciesEntry("Osseus Fractum", 1593700),
        SpeciesEntry("Osseus Pellets", 7500900),
        SpeciesEntry("Osseus Circum", 7500900),
        SpeciesEntry("Osseus Cornibus", 3111000),
    ]),
    GenusEntry("Recepta", [
        SpeciesEntry("Recepta Umbrux", 12934900),
        SpeciesEntry("Recepta Deltahedronix", 16202800),
        SpeciesEntry("Recepta Conditivus", 14313700),
    ]),
    GenusEntry("Shard", [
        SpeciesEntry("Crystalline Shards", 1628800),
    ]),
    GenusEntry("Stratum", [
        SpeciesEntry("Stratum Tectonicas", 19010800),
        SpeciesEntry("Stratum Paleas", 3667600),
        SpeciesEntry("Stratum Cucumisis", 1000000),
        SpeciesEntry("Stratum Laminatum", 2483600),
        SpeciesEntry("Stratum Arcanum", 1000000),
        SpeciesEntry("Stratum Excutitus", 6284600),
        SpeciesEntry("Stratum Frigidum", 14313700),
        SpeciesEntry("Stratum Montaign", 1000000),
        SpeciesEntry("Stratum Palpator", 1000000),
        SpeciesEntry("Stratum Pavonis", 6284600),
        SpeciesEntry("Stratum Terminator", 14313700),
    ]),
    GenusEntry("Tubers", [
        SpeciesEntry("Roseum Sinuous Tubers", 1514500),
        SpeciesEntry("Prasinum Sinuous Tubers", 1514500),
        SpeciesEntry("Albidum Sinuous Tubers", 1514500),
        SpeciesEntry("Caeruleum Sinuous Tubers", 1514500),
        SpeciesEntry("Lindigoticum Sinuous Tubers", 1514500),
        SpeciesEntry("Violaceum Sinuous Tubers", 1514500),
        SpeciesEntry("Viride Sinuous Tubers", 1514500),
        SpeciesEntry("Blatteum Sinuous Tubers", 1514500),
    ]),
    GenusEntry("Tubus", [
        SpeciesEntry("Tubus Cavas", 2483600),
        SpeciesEntry("Tubus Conifer", 6284600),
        SpeciesEntry("Tubus Cultrorum", 6284600),
        SpeciesEntry("Tubus Rosarium", 2483600),
        SpeciesEntry("Tubus Sororibus", 16202800),
    ]),
    GenusEntry("Tussock", [
        SpeciesEntry("Tussock Albata", 1000000),
        SpeciesEntry("Tussock Capillaris", 1000000),
        SpeciesEntry("Tussock Cultrato", 2483600),
        SpeciesEntry("Tussock Ignati", 2483600),
        SpeciesEntry("Tussock Obstituo", 3667600),
        SpeciesEntry("Tussock Ornatus", 1000000),
        SpeciesEntry("Tussock Pennata", 3667600),
        SpeciesEntry("Tussock Pemetis", 2483600),
        SpeciesEntry("Tussock Sescis", 7424600),
        SpeciesEntry("Tussock Suculae", 7424600),
        SpeciesEntry("Tussock Ventusa", 7424600),
        SpeciesEntry("Tussock Viminati", 7424600),
    ]),
]


def find_genus(name: str) -> Optional[GenusEntry]:
    lower = name.lower()
    for g in GENUS_DATA:
        if g.name.lower() == lower:
            return g
    return None


def find_species(genus: str, species: str) -> Optional[SpeciesEntry]:
    g = find_genus(genus)
    if not g:
        return None
    lower = species.lower()
    for s in g.species:
        if s.name.lower() == lower:
            return s
    return None


def calculate_scan_value(species_name: str, is_first_discovery: bool) -> int:
    for g in GENUS_DATA:
        for s in g.species:
            if s.name.lower() == species_name.lower():
                total = s.value
                if is_first_discovery:
                    total += s.value * 4
                return total
    return 0


def get_species_for_genus(genus: str) -> list[str]:
    g = find_genus(genus)
    return [s.name for s in g.species] if g else []


def get_species_value(genus: str, species: str) -> int:
    entry = find_species(genus, species)
    return entry.value if entry else 0
