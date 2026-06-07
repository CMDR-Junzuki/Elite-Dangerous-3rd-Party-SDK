"""Journal Event Query Engine - LINQ-style queries over journal events."""
from typing import Any, Callable, Optional


class JournalQuery:
    def __init__(self, events: list[dict]):
        self._results = list(events)

    def where(self, field_or_pred, value: Any = None, operator: str = "="):
        if callable(field_or_pred):
            self._results = [e for e in self._results if field_or_pred(e)]
            return self
        field = field_or_pred

        def _match(e: dict) -> bool:
            actual = e.get(field)
            if operator == "=":
                return actual == value
            elif operator == "!=":
                return actual != value
            elif operator == ">":
                return isinstance(actual, (int, float)) and isinstance(value, (int, float)) and actual > value
            elif operator == ">=":
                return isinstance(actual, (int, float)) and isinstance(value, (int, float)) and actual >= value
            elif operator == "<":
                return isinstance(actual, (int, float)) and isinstance(value, (int, float)) and actual < value
            elif operator == "<=":
                return isinstance(actual, (int, float)) and isinstance(value, (int, float)) and actual <= value
            return True

        self._results = [e for e in self._results if _match(e)]
        return self

    def between(self, start: str, end: str):
        self._results = [e for e in self._results if start <= e.get("timestamp", "") <= end]
        return self

    def select(self, field: str) -> list:
        return [e.get(field) for e in self._results]

    def count(self) -> int:
        return len(self._results)

    def first(self) -> Optional[dict]:
        return self._results[0] if self._results else None

    def last(self) -> Optional[dict]:
        return self._results[-1] if self._results else None

    def for_each(self, fn: Callable[[dict], Any]):
        for e in self._results:
            fn(e)

    def to_list(self) -> list[dict]:
        return list(self._results)


def query(events: list[dict]) -> JournalQuery:
    return JournalQuery(events)


def count_where(events: list[dict], event_type: str) -> int:
    return sum(1 for e in events if e.get("event") == event_type)


def filter_where(events: list[dict], event_type: str) -> list[dict]:
    return [e for e in events if e.get("event") == event_type]


def count_by_type(events: list[dict]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for e in events:
        et = e.get("event", "")
        counts[et] = counts.get(et, 0) + 1
    return counts
