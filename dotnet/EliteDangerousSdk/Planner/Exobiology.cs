using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Planner
{
    public record SpeciesEntry(string Name, int Value);

    public record GenusEntry(string Name, List<SpeciesEntry> Species);

    public record BioSample(
        string Genus,
        string Species,
        string System,
        ulong? SystemAddress,
        int Body,
        string? BodyName,
        DateTime ScannedAt,
        string ScanType,
        int Value,
        int Bonus,
        bool FirstDiscovery
    );

    public static class GenusData
    {
        private static readonly List<GenusEntry> _data = new()
        {
            new("Aleoida", new()
            {
                new("Aleoida Arcus", 7252500),
                new("Aleoida Coronamus", 6284600),
                new("Aleoida Spica", 3385200),
                new("Aleoida Laminiae", 3385200),
                new("Aleoida Gravis", 12934900),
            }),
            new("Anemone", new()
            {
                new("Luteolum Anemone", 1499900),
                new("Croceum Anemone", 1499900),
                new("Puniceum Anemone", 1499900),
                new("Roseum Anemone", 1499900),
                new("Rubeum Bioluminescent Anemone", 1499900),
                new("Prasinum Bioluminescent Anemone", 1499900),
                new("Roseum Bioluminescent Anemone", 1499900),
                new("Blatteum Bioluminescent Anemone", 1499900),
            }),
            new("Bacterium", new()
            {
                new("Bacterium Aurasus", 1000000),
                new("Bacterium Bullaris", 2483600),
                new("Bacterium Cerbrum", 6284600),
                new("Bacterium Informem", 2483600),
                new("Bacterium Nebula", 1000000),
                new("Bacterium Omentilla", 2483600),
                new("Bacterium Pendentis", 3667600),
                new("Bacterium Profundi", 3667600),
                new("Bacterium Scopulum", 1000000),
                new("Bacterium Tela", 3667600),
                new("Bacterium Vesicula", 6284600),
                new("Bacterium Virali", 1000000),
                new("Bacterium Volu", 3667600),
            }),
            new("Brain Tree", new()
            {
                new("Roseum Brain Tree", 1593700),
                new("Gypseeum Brain Tree", 1593700),
                new("Ostrinum Brain Tree", 1593700),
                new("Viride Brain Tree", 1593700),
                new("Aureum Brain Tree", 1593700),
                new("Puniceum Brain Tree", 1593700),
                new("Lindigoticum Brain Tree", 1593700),
                new("Lividum Brain Tree", 1593700),
            }),
            new("Cactoida", new()
            {
                new("Cactoida Cortexum", 3667600),
                new("Cactoida Lapis", 2483600),
                new("Cactoida Vermis", 16202800),
                new("Cactoida Pullulanta", 3667600),
                new("Cactoida Peperatis", 2483600),
            }),
            new("Clypeus", new()
            {
                new("Clypeus Lacrimam", 8418000),
                new("Clypeus Margaritus", 11873200),
                new("Clypeus Speculumi", 16202800),
            }),
            new("Concha", new()
            {
                new("Concha Renibus", 4572400),
                new("Concha Aureolas", 7774700),
                new("Concha Labiata", 2352400),
                new("Concha Biconcavis", 16777215),
            }),
            new("Electricae", new()
            {
                new("Electricae Pluma", 6284600),
                new("Electricae Radialem", 6284600),
            }),
            new("Fonticulua", new()
            {
                new("Fonticulua Segmentatus", 19010800),
                new("Fonticulua Campestris", 1000000),
                new("Fonticulua Upupam", 5727600),
                new("Fonticulua Lapida", 3111000),
                new("Fonticulua Fluctus", 20000000),
                new("Fonticulua Digitos", 1804100),
            }),
            new("Frutexa", new()
            {
                new("Frutexa Flammasis", 3111000),
                new("Frutexa Metallicum", 3111000),
                new("Frutexa Collum", 14313700),
                new("Frutexa Acicularis", 5727600),
                new("Frutexa Sponsa", 5727600),
                new("Frutexa Fera", 5727600),
            }),
            new("Fumerola", new()
            {
                new("Fumerola Carbosis", 6284600),
                new("Fumerola Extremus", 16202800),
                new("Fumerola Nitris", 7500900),
                new("Fumerola Aquatis", 6284600),
            }),
            new("Fungoida", new()
            {
                new("Fungoida Setisis", 19010800),
                new("Fungoida Stabitis", 1810000),
                new("Fungoida Gelata", 6284600),
                new("Fungoida Pulvis", 7500900),
                new("Fungoida Horris", 3111000),
                new("Fungoida Bullarum", 16202800),
                new("Fungoida Palmatus", 5727600),
            }),
            new("Osseus", new()
            {
                new("Osseus Spiralis", 7500900),
                new("Osseus Discus", 1593700),
                new("Osseus Fractum", 1593700),
                new("Osseus Pellets", 7500900),
                new("Osseus Circum", 7500900),
                new("Osseus Cornibus", 3111000),
            }),
            new("Recepta", new()
            {
                new("Recepta Umbrux", 12934900),
                new("Recepta Deltahedronix", 16202800),
                new("Recepta Conditivus", 14313700),
            }),
            new("Shard", new()
            {
                new("Crystalline Shards", 1628800),
            }),
            new("Stratum", new()
            {
                new("Stratum Tectonicas", 19010800),
                new("Stratum Paleas", 3667600),
                new("Stratum Cucumisis", 1000000),
                new("Stratum Laminatum", 2483600),
                new("Stratum Arcanum", 1000000),
                new("Stratum Excutitus", 6284600),
                new("Stratum Frigidum", 14313700),
                new("Stratum Montaign", 1000000),
                new("Stratum Palpator", 1000000),
                new("Stratum Pavonis", 6284600),
                new("Stratum Terminator", 14313700),
            }),
            new("Tubers", new()
            {
                new("Roseum Sinuous Tubers", 1514500),
                new("Prasinum Sinuous Tubers", 1514500),
                new("Albidum Sinuous Tubers", 1514500),
                new("Caeruleum Sinuous Tubers", 1514500),
                new("Lindigoticum Sinuous Tubers", 1514500),
                new("Violaceum Sinuous Tubers", 1514500),
                new("Viride Sinuous Tubers", 1514500),
                new("Blatteum Sinuous Tubers", 1514500),
            }),
            new("Tubus", new()
            {
                new("Tubus Cavas", 2483600),
                new("Tubus Conifer", 6284600),
                new("Tubus Cultrorum", 6284600),
                new("Tubus Rosarium", 2483600),
                new("Tubus Sororibus", 16202800),
            }),
            new("Tussock", new()
            {
                new("Tussock Albata", 1000000),
                new("Tussock Capillaris", 1000000),
                new("Tussock Cultrato", 2483600),
                new("Tussock Ignati", 2483600),
                new("Tussock Obstituo", 3667600),
                new("Tussock Ornatus", 1000000),
                new("Tussock Pennata", 3667600),
                new("Tussock Pemetis", 2483600),
                new("Tussock Sescis", 7424600),
                new("Tussock Suculae", 7424600),
                new("Tussock Ventusa", 7424600),
                new("Tussock Viminati", 7424600),
            }),
        };

        public static List<GenusEntry> GetAll() => _data;

        public static GenusEntry? FindGenus(string name) =>
            _data.FirstOrDefault(g => g.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

        public static SpeciesEntry? FindSpecies(string genus, string species)
        {
            var g = FindGenus(genus);
            return g?.Species.FirstOrDefault(s => s.Name.Equals(species, StringComparison.OrdinalIgnoreCase));
        }

        public static int CalculateScanValue(string speciesName, bool isFirstDiscovery)
        {
            var species = _data.SelectMany(g => g.Species)
                .FirstOrDefault(s => s.Name.Equals(speciesName, StringComparison.OrdinalIgnoreCase));
            if (species == null) return 0;
            var total = species.Value;
            if (isFirstDiscovery) total += species.Value * 4;
            return total;
        }

        public static string[] GetSpeciesForGenus(string genus)
        {
            var g = FindGenus(genus);
            return g?.Species.Select(s => s.Name).ToArray() ?? Array.Empty<string>();
        }

        public static int GetSpeciesValue(string genus, string species)
        {
            var entry = FindSpecies(genus, species);
            return entry?.Value ?? 0;
        }
    }
}
