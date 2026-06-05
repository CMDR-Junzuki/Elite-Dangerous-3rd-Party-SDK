using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Utils
{
    public static class Listify
    {
        /// <summary>
        /// Convert CAPI sparse object arrays to proper arrays with null for gaps.
        /// </summary>
        public static List<T?> Convert<T>(Dictionary<string, T>? obj) where T : class
        {
            if (obj == null || obj.Count == 0)
                return new List<T?>();

            var keys = obj.Keys.Where(k => int.TryParse(k, out _)).Select(int.Parse).ToList();
            if (keys.Count == 0)
                return new List<T?>();

            var maxKey = keys.Max();
            var result = new List<T?>(new T?[maxKey + 1]);
            foreach (var key in keys)
            {
                result[key] = obj[key.ToString()];
            }
            return result;
        }

        /// <summary>
        /// Convert CAPI sparse arrays stored as object-typed dictionaries.
        /// </summary>
        public static List<T?> FromObjectDict<T>(Dictionary<string, object>? obj) where T : class
        {
            if (obj == null || obj.Count == 0)
                return new List<T?>();

            var keys = obj.Keys.Where(k => int.TryParse(k, out _)).Select(int.Parse).ToList();
            if (keys.Count == 0)
                return new List<T?>();

            var maxKey = keys.Max();
            var result = new List<T?>(new T?[maxKey + 1]);
            foreach (var key in keys)
            {
                result[key] = obj[key.ToString()] as T;
            }
            return result;
        }
    }

    public struct Coords
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Z { get; set; }

        public Coords(double x, double y, double z)
        {
            X = x; Y = y; Z = z;
        }

        public double DistanceTo(Coords other)
        {
            var dx = X - other.X;
            var dy = Y - other.Y;
            var dz = Z - other.Z;
            return Math.Sqrt(dx * dx + dy * dy + dz * dz);
        }

        public static Coords Midpoint(Coords a, Coords b)
        {
            return new Coords(
                (a.X + b.X) / 2,
                (a.Y + b.Y) / 2,
                (a.Z + b.Z) / 2
            );
        }

        public (double azimuth, double elevation) BearingTo(Coords other)
        {
            var dx = other.X - X;
            var dy = other.Y - Y;
            var dz = other.Z - Z;
            var horz = Math.Sqrt(dx * dx + dz * dz);
            return (
                azimuth: Math.Atan2(dx, dz) * (180.0 / Math.PI),
                elevation: Math.Atan2(dy, horz) * (180.0 / Math.PI)
            );
        }

        public override string ToString() => $"({X:F2}, {Y:F2}, {Z:F2})";
    }

    public static class Coordinates
    {
        public static double Distance(Coords a, Coords b) => a.DistanceTo(b);

        public static List<Coords> SphereSearch(Coords center, double radius, List<Coords> systems)
        {
            return systems.Where(s => center.DistanceTo(s) <= radius).ToList();
        }
    }

    public static class BitFlags
    {
        public static List<string> Parse(long value, Dictionary<string, long> flags)
        {
            return flags.Where(f => (value & f.Value) == f.Value).Select(f => f.Key).ToList();
        }

        public static bool HasFlag(long value, long flag) => (value & flag) == flag;

        public static long Combine(params long[] flags)
        {
            long result = 0;
            foreach (var f in flags) result |= f;
            return result;
        }
    }
}
