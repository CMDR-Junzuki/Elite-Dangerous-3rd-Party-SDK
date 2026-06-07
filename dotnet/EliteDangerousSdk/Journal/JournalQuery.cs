#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;

namespace EliteDangerousSdk.Journal;

public class JournalQuery
{
    private List<Dictionary<string, object?>> _results;

    public JournalQuery(IEnumerable<Dictionary<string, object?>> events)
    {
        _results = events.ToList();
    }

    public JournalQuery Where(string field, object? value, string op = "=")
    {
        _results = _results.Where(e =>
        {
            var actual = e.GetValueOrDefault(field);
            return op switch
            {
                "=" => Equals(actual, value),
                "!=" => !Equals(actual, value),
                ">" => actual is IComparable ac && value is IComparable vc && ac.CompareTo(vc) > 0,
                ">=" => actual is IComparable ac && value is IComparable vc && ac.CompareTo(vc) >= 0,
                "<" => actual is IComparable ac && value is IComparable vc && ac.CompareTo(vc) < 0,
                "<=" => actual is IComparable ac && value is IComparable vc && ac.CompareTo(vc) <= 0,
                _ => true,
            };
        }).ToList();
        return this;
    }

    public JournalQuery Where(Func<Dictionary<string, object?>, bool> predicate)
    {
        _results = _results.Where(predicate).ToList();
        return this;
    }

    public JournalQuery Between(string start, string end)
    {
        _results = _results
            .Where(e => string.Compare(e.GetValueOrDefault("timestamp") as string, start, StringComparison.Ordinal) >= 0
                     && string.Compare(e.GetValueOrDefault("timestamp") as string, end, StringComparison.Ordinal) <= 0)
            .ToList();
        return this;
    }

    public List<T?> Select<T>(string field)
    {
        return _results.Select(e => (T?)e.GetValueOrDefault(field)).ToList();
    }

    public int Count() => _results.Count;

    public Dictionary<string, object?>? First() => _results.Count > 0 ? _results[0] : null;

    public Dictionary<string, object?>? Last() => _results.Count > 0 ? _results[^1] : null;

    public void ForEach(Action<Dictionary<string, object?>> action)
    {
        foreach (var e in _results) action(e);
    }

    public List<Dictionary<string, object?>> ToList() => new(_results);
}

public static class JournalQueryExtensions
{
    public static JournalQuery Query(this IEnumerable<Dictionary<string, object?>> events)
        => new JournalQuery(events);

    public static int CountWhere(this IEnumerable<Dictionary<string, object?>> events, string eventType)
        => events.Count(e => Equals(e.GetValueOrDefault("event"), eventType));

    public static List<Dictionary<string, object?>> FilterWhere(this IEnumerable<Dictionary<string, object?>> events, string eventType)
        => events.Where(e => Equals(e.GetValueOrDefault("event"), eventType)).ToList();

    public static Dictionary<string, int> CountByType(this IEnumerable<Dictionary<string, object?>> events)
    {
        var counts = new Dictionary<string, int>();
        foreach (var e in events)
        {
            var et = e.GetValueOrDefault("event") as string ?? "";
            counts[et] = counts.GetValueOrDefault(et) + 1;
        }
        return counts;
    }
}
