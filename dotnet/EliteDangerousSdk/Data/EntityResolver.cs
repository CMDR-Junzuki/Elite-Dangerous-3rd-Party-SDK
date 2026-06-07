using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace EliteDangerousSdk.Data
{
    public static class EntityResolver
    {
        public static JsonElement? ResolveModule(long edId)
            => DataProvider.GetModuleByEdId(edId);

        public static JsonElement? ResolveShip(long edId)
            => DataProvider.GetShipByEdId(edId);

        public static JsonElement? ResolveShipByName(string name)
        {
            var lower = name.ToLowerInvariant();
            foreach (var kvp in DataProvider.CoriolisShipsByEdId)
            {
                var shipName = kvp.Value.GetProperty("properties").GetProperty("name").GetString();
                if (shipName != null && shipName.ToLowerInvariant() == lower)
                    return kvp.Value;
            }
            return null;
        }

        public static JsonElement? ResolveCommodity(string symbol)
        {
            if (DataProvider.CommoditiesBySymbol.TryGetValue(symbol, out var exact))
                return exact;
            var lower = symbol.ToLowerInvariant();
            foreach (var kvp in DataProvider.CommoditiesBySymbol)
            {
                if (kvp.Key.ToLowerInvariant() == lower)
                    return kvp.Value;
            }
            return null;
        }

        public static JsonElement? ResolveEngineer(long edId)
            => DataProvider.GetEngineerByEdId(edId);

        public static JsonElement? ResolveEngineerByName(string name)
        {
            var lower = name.ToLowerInvariant();
            foreach (var eng in DataProvider.Engineers)
            {
                var engName = eng.GetProperty("name").GetString();
                if (engName != null && engName.ToLowerInvariant() == lower)
                    return eng;
            }
            return null;
        }

        public static JsonElement? ResolveMaterial(long edId)
            => DataProvider.MaterialsById.TryGetValue(edId, out var m) ? m : null;

        public static JsonElement? ResolveMaterialBySymbol(string symbol)
        {
            foreach (var mat in DataProvider.Materials)
            {
                var sym = mat.GetProperty("symbol").GetString();
                if (string.Equals(sym, symbol, StringComparison.OrdinalIgnoreCase))
                    return mat;
            }
            return null;
        }

        public static JsonElement? ResolveMicroresource(long edId)
            => DataProvider.MicroResourcesById.TryGetValue(edId, out var m) ? m : null;

        public static JsonElement? ResolveMicroresourceBySymbol(string symbol)
        {
            foreach (var mr in DataProvider.MicroResources)
            {
                var sym = mr.GetProperty("symbol").GetString();
                if (string.Equals(sym, symbol, StringComparison.OrdinalIgnoreCase))
                    return mr;
            }
            return null;
        }

        public static JsonElement? ResolveOutfitting(long edId)
            => DataProvider.OutfittingById.TryGetValue(edId, out var o) ? o : null;

        public static JsonElement? ResolveShipyard(long edId)
            => DataProvider.ShipsById.TryGetValue(edId, out var s) ? s : null;
    }
}
