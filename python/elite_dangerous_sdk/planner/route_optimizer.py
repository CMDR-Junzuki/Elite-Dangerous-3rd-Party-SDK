from dataclasses import dataclass, field
from typing import List, Optional, Dict
from .trade import TradeStation, TradeCommodity, TradeRoute, calculate_trade_profit


@dataclass
class StationMarket:
    station: TradeStation = field(default_factory=TradeStation)
    supplies: List[TradeCommodity] = field(default_factory=list)
    demands: List[TradeCommodity] = field(default_factory=list)


@dataclass
class MultiHopRoute:
    hops: List[TradeRoute] = field(default_factory=list)
    total_profit: float = 0.0
    total_distance: float = 0.0
    profit_per_jump: float = 0.0
    profit_per_ly: float = 0.0
    round_trip: bool = False


def compute_single_hop_routes(
    stations: List[StationMarket],
    cargo_capacity: float,
    max_distance: Optional[float] = None,
) -> List[TradeRoute]:
    """Compute all profitable single-hop routes between station pairs."""
    routes: List[TradeRoute] = []

    for i in range(len(stations)):
        for j in range(len(stations)):
            if i == j:
                continue

            from_station = stations[i]
            to_station = stations[j]
            distance_ly = max_distance or 0

            for supply in from_station.supplies:
                demand = next(
                    (
                        d
                        for d in to_station.demands
                        if d.symbol == supply.symbol and d.sell_price > supply.buy_price
                    ),
                    None,
                )
                if not demand:
                    continue

                profit = calculate_trade_profit(
                    supply.buy_price, demand.sell_price, cargo_capacity
                )

                if profit["per_unit"] <= 0:
                    continue

                routes.append(
                    TradeRoute(
                        source=from_station.station,
                        destination=to_station.station,
                        commodity=demand,
                        profit_per_unit=profit["per_unit"],
                        total_profit=profit["total"],
                        cargo_capacity=cargo_capacity,
                        distance_ly=distance_ly,
                        profit_per_ly=profit["total"] / distance_ly if distance_ly > 0 else profit["total"],
                    )
                )

    return routes


def _build_adjacency(
    routes: List[TradeRoute],
) -> Dict[str, List[TradeRoute]]:
    adj: Dict[str, List[TradeRoute]] = {}
    for h in routes:
        key = h.source.name
        if key not in adj:
            adj[key] = []
        adj[key].append(h)
    return adj


def find_round_trips(
    stations: List[StationMarket],
    cargo_capacity: Optional[float] = None,
    max_distance: Optional[float] = None,
    top_n: Optional[int] = None,
) -> List[MultiHopRoute]:
    """Find profitable round-trip trade routes (A->B->A with different commodities)."""
    cap = cargo_capacity or 100
    single_hops = compute_single_hop_routes(stations, cap, max_distance)
    round_trips: List[MultiHopRoute] = []

    for outbound in single_hops:
        returns = [
            h
            for h in single_hops
            if h.source.name == outbound.destination.name
            and h.destination.name == outbound.source.name
            and h.commodity.symbol != outbound.commodity.symbol
        ]

        for ret in returns:
            total = outbound.total_profit + ret.total_profit
            total_dist = outbound.distance_ly + ret.distance_ly
            round_trips.append(
                MultiHopRoute(
                    hops=[outbound, ret],
                    total_profit=total,
                    total_distance=total_dist,
                    profit_per_jump=total / 2,
                    profit_per_ly=total / total_dist if total_dist > 0 else total,
                    round_trip=True,
                )
            )

    round_trips.sort(key=lambda r: r.total_profit, reverse=True)
    return round_trips[:top_n] if top_n is not None else round_trips


def find_multi_hop_routes(
    stations: List[StationMarket],
    max_hops: int,
    cargo_capacity: Optional[float] = None,
    max_distance: Optional[float] = None,
    top_n: Optional[int] = None,
) -> List[MultiHopRoute]:
    """Find multi-hop trade routes up to max_hops hops."""
    cap = cargo_capacity or 100
    single_hops = compute_single_hop_routes(stations, cap, max_distance)

    if max_hops <= 1:
        return [
            MultiHopRoute(
                hops=[h],
                total_profit=h.total_profit,
                total_distance=h.distance_ly,
                profit_per_jump=h.total_profit,
                profit_per_ly=h.profit_per_ly,
                round_trip=False,
            )
            for h in single_hops
        ]

    adj = _build_adjacency(single_hops)
    results: List[MultiHopRoute] = []

    for start in single_hops:
        stack = [{"path": [start], "visited": {start.source.name}}]

        while stack:
            item = stack.pop()
            path = item["path"]
            visited = item["visited"]
            last = path[-1]

            if len(path) >= 2 and last.destination.name == start.source.name:
                total = sum(h.total_profit for h in path)
                total_dist = sum(h.distance_ly for h in path)
                results.append(
                    MultiHopRoute(
                        hops=list(path),
                        total_profit=total,
                        total_distance=total_dist,
                        profit_per_jump=total / len(path),
                        profit_per_ly=total / total_dist if total_dist > 0 else total,
                        round_trip=len(path) > 1,
                    )
                )
                continue

            if len(path) >= max_hops:
                continue

            next_routes = adj.get(last.destination.name, [])
            for nxt in next_routes:
                if nxt.destination.name in visited and nxt.destination.name != start.source.name:
                    continue
                new_visited = set(visited)
                new_visited.add(nxt.destination.name)
                stack.append({"path": list(path) + [nxt], "visited": new_visited})

    results.sort(key=lambda r: r.total_profit, reverse=True)
    return results[:top_n] if top_n is not None else results


def suggest_material_farming(
    category: str,
    grade: int,
) -> List[dict]:
    """Suggest material farming activities based on material category and grade."""
    suggestions: dict[str, list[dict]] = {
        "raw": [
            {"activity": "Surface prospecting", "description": "SRV prospecting on planetary surfaces"},
            {"activity": "Mining", "description": "Laser mining in asteroid belts"},
            {"activity": "Deep core mining", "description": "Core mining with seismic charges"},
        ],
        "manufactured": [
            {"activity": "Combat", "description": "Destroying ships for manufactured materials"},
            {"activity": "Signal sources", "description": "Encoded/combat signal sources"},
            {"activity": "Fleet Carrier looting", "description": "Looting fleet carrier wrecks"},
        ],
        "encoded": [
            {"activity": "Scanning ships", "description": "Scanning wakes and ships with data link scanner"},
            {"activity": "Planetary settlements", "description": "Scanning data points at settlements"},
            {"activity": "Signal sources", "description": "Encoded signal sources"},
        ],
        "micro": [
            {"activity": "On-foot settlements", "description": "Looting containers at on-foot settlements"},
            {"activity": "Mission rewards", "description": "On-foot mission rewards"},
        ],
    }

    cat_lower = category.lower()
    base = list(suggestions.get(cat_lower, []))

    if grade >= 4:
        base.append({
            "activity": "Mission rewards (high-grade)" if grade >= 5 else "Mission rewards",
            "description": "High-grade mission rewards for Grade 5 materials"
            if grade >= 5
            else "Mission rewards for higher-grade materials",
        })

    return base
