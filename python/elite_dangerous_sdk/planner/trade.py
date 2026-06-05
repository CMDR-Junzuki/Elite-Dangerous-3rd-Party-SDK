from dataclasses import dataclass
from typing import List, Optional


@dataclass
class TradeStation:
    name: str = ""
    system: str = ""
    distance_from_star: Optional[float] = None


@dataclass
class TradeCommodity:
    symbol: str = ""
    name: str = ""
    category: str = ""
    buy_price: float = 0.0
    sell_price: float = 0.0
    stock: int = 0
    demand: int = 0
    is_rare: bool = False


@dataclass
class TradeRoute:
    source: TradeStation = None
    destination: TradeStation = None
    commodity: TradeCommodity = None
    profit_per_unit: float = 0.0
    total_profit: float = 0.0
    cargo_capacity: float = 0.0
    distance_ly: float = 0.0
    profit_per_ly: float = 0.0


def calculate_trade_profit(buy_price: float, sell_price: float, cargo_capacity: float) -> dict:
    per_unit = sell_price - buy_price
    return {"per_unit": per_unit, "total": per_unit * cargo_capacity}


def rank_trade_routes(routes: List[TradeRoute], top_n: Optional[int] = None) -> List[TradeRoute]:
    sorted_routes = sorted(routes, key=lambda r: r.profit_per_unit, reverse=True)
    if top_n is not None:
        return sorted_routes[:top_n]
    return sorted_routes


def filter_trade_routes(routes: List[TradeRoute], min_profit_per_unit: float = 0) -> List[TradeRoute]:
    return [r for r in routes if r.profit_per_unit >= min_profit_per_unit]
