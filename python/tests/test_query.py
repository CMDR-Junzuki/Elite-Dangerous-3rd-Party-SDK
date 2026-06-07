import pytest
from elite_dangerous_sdk.query import (
    JournalQuery,
    query,
    count_where,
    filter_where,
    count_by_type,
)

EVENTS = [
    {"event": "FSDJump", "timestamp": "2026-01-01T00:00:00Z", "StarSystem": "Sol", "JumpDist": 4.37},
    {"event": "FSDJump", "timestamp": "2026-01-01T01:00:00Z", "StarSystem": "Alpha Centauri", "JumpDist": 4.37},
    {"event": "Scan", "timestamp": "2026-01-01T02:00:00Z", "BodyName": "Earth"},
    {"event": "Docked", "timestamp": "2026-01-02T00:00:00Z", "StationName": "Li Qing Jao"},
    {"event": "FSDJump", "timestamp": "2026-01-03T00:00:00Z", "StarSystem": "Barnard's Star", "JumpDist": 5.95},
]


class TestJournalQuery:
    def test_count_all(self):
        assert query(EVENTS).count() == 5

    def test_filter_by_event(self):
        assert query(EVENTS).where("event", "FSDJump").count() == 3

    def test_chain_filters(self):
        assert query(EVENTS).where("event", "FSDJump").where("StarSystem", "Sol").count() == 1

    def test_predicate_function(self):
        assert query(EVENTS).where(lambda e: e["event"] == "Scan").count() == 1

    def test_greater_than(self):
        assert query(EVENTS).where("event", "FSDJump").where("JumpDist", 5, ">").count() == 1

    def test_between(self):
        assert query(EVENTS).between("2026-01-01T00:00:00Z", "2026-01-01T23:59:59Z").count() == 3

    def test_select(self):
        systems = query(EVENTS).where("event", "FSDJump").select("StarSystem")
        assert systems == ["Sol", "Alpha Centauri", "Barnard's Star"]

    def test_first_last(self):
        assert query(EVENTS).where("event", "FSDJump").first()["StarSystem"] == "Sol"
        assert query(EVENTS).where("event", "FSDJump").last()["StarSystem"] == "Barnard's Star"

    def test_to_list_copy(self):
        q = query(EVENTS)
        lst = q.to_list()
        assert len(lst) == 5
        lst.append({"event": "test"})
        assert q.count() == 5

    def test_for_each(self):
        names = []
        query(EVENTS).where("event", "FSDJump").for_each(lambda e: names.append(e["StarSystem"]))
        assert names == ["Sol", "Alpha Centauri", "Barnard's Star"]

    def test_count_where(self):
        assert count_where(EVENTS, "FSDJump") == 3
        assert count_where(EVENTS, "Scan") == 1

    def test_filter_where(self):
        jumps = filter_where(EVENTS, "FSDJump")
        assert len(jumps) == 3
        assert jumps[0]["StarSystem"] == "Sol"

    def test_count_by_type(self):
        counts = count_by_type(EVENTS)
        assert counts["FSDJump"] == 3
        assert counts["Scan"] == 1
        assert counts["Docked"] == 1
