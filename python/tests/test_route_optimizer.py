from elite_dangerous_sdk.planner import (
    StationMarket, TradeStation, TradeCommodity,
    compute_single_hop_routes, find_round_trips, find_multi_hop_routes,
    suggest_material_farming,
)


def make_station(name: str, system: str) -> StationMarket:
    return StationMarket(
        station=TradeStation(name=name, system=system),
        supplies=[],
        demands=[],
    )


station_a = StationMarket(
    station=TradeStation(name="A", system="Sys1"),
    supplies=[
        TradeCommodity(symbol="Gold", name="Gold", category="Metals", buy_price=10000, stock=1000),
        TradeCommodity(symbol="Silver", name="Silver", category="Metals", buy_price=5000, stock=1000),
    ],
    demands=[
        TradeCommodity(symbol="Platinum", name="Platinum", category="Metals", sell_price=30000, demand=100),
        TradeCommodity(symbol="Palladium", name="Palladium", category="Metals", sell_price=20000, demand=100),
    ],
)

station_b = StationMarket(
    station=TradeStation(name="B", system="Sys2"),
    supplies=[
        TradeCommodity(symbol="Platinum", name="Platinum", category="Metals", buy_price=25000, stock=500),
        TradeCommodity(symbol="Palladium", name="Palladium", category="Metals", buy_price=15000, stock=500),
    ],
    demands=[
        TradeCommodity(symbol="Gold", name="Gold", category="Metals", sell_price=18000, demand=200),
        TradeCommodity(symbol="Silver", name="Silver", category="Metals", sell_price=9000, demand=200),
    ],
)

station_c = StationMarket(
    station=TradeStation(name="C", system="Sys3"),
    supplies=[
        TradeCommodity(symbol="Computers", name="Computers", category="Technology", buy_price=500, stock=1000),
    ],
    demands=[
        TradeCommodity(symbol="Gold", name="Gold", category="Metals", sell_price=17000, demand=100),
    ],
)

stations = [station_a, station_b, station_c]


class TestComputeSingleHopRoutes:
    def test_finds_profitable_routes(self):
        routes = compute_single_hop_routes(stations, 100)
        assert len(routes) > 0
        gold_route = next(r for r in routes if r.commodity.symbol == "Gold")
        assert gold_route.profit_per_unit == 8000
        assert gold_route.total_profit == 8000 * 100

    def test_finds_multiple_commodity_routes(self):
        routes = compute_single_hop_routes(stations, 100)
        ab_routes = [r for r in routes if r.source.name == "A" and r.destination.name == "B"]
        assert len(ab_routes) >= 2

    def test_skips_same_station(self):
        routes = compute_single_hop_routes(stations, 100)
        same = [r for r in routes if r.source.name == r.destination.name]
        assert same == []

    def test_returns_empty_for_single_station(self):
        routes = compute_single_hop_routes([station_a], 100)
        assert routes == []


class TestFindRoundTrips:
    def test_finds_round_trips(self):
        trips = find_round_trips(stations, cargo_capacity=100)
        a_to_b = [t for t in trips if t.hops[0].source.name == "A"]
        assert len(a_to_b) > 0
        assert a_to_b[0].round_trip is True
        assert len(a_to_b[0].hops) == 2

    def test_round_trip_profit_is_sum(self):
        trips = find_round_trips(stations, cargo_capacity=100)
        for t in trips:
            s = sum(h.total_profit for h in t.hops)
            assert t.total_profit == s

    def test_returns_empty_for_incompatible(self):
        trips = find_round_trips([station_a], cargo_capacity=100)
        assert len(trips) == 0

    def test_respects_top_n(self):
        trips = find_round_trips(stations, cargo_capacity=100, top_n=1)
        assert len(trips) <= 1


class TestFindMultiHopRoutes:
    def test_finds_2_hop_loops(self):
        routes = find_multi_hop_routes(stations, 2, cargo_capacity=100)
        assert len(routes) > 0
        for r in routes:
            assert len(r.hops) <= 2

    def test_non_empty_for_1_hop(self):
        routes = find_multi_hop_routes(stations, 1, cargo_capacity=100)
        assert len(routes) > 0
        assert routes[0].round_trip is False


class TestSuggestMaterialFarming:
    def test_raw_suggestions(self):
        suggestions = suggest_material_farming("raw", 2)
        assert len(suggestions) > 0
        assert suggestions[0]["activity"]
        assert suggestions[0]["description"]

    def test_manufactured_suggestions(self):
        assert len(suggest_material_farming("manufactured", 3)) > 0

    def test_encoded_suggestions(self):
        assert len(suggest_material_farming("encoded", 1)) > 0

    def test_unknown_category(self):
        assert suggest_material_farming("unknown", 1) == []

    def test_high_grade_suggestions(self):
        g5 = suggest_material_farming("raw", 5)
        g1 = suggest_material_farming("raw", 1)
        assert len(g5) > len(g1)
