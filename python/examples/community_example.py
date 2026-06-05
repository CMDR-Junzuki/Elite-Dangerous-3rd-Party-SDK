"""
Example: Community API Clients

Demonstrates EDSM, Inara, EDDN, and Spansh API usage.
"""

from elite_dangerous_sdk.edsm import EDSMClient
from elite_dangerous_sdk.inara import InaraClient
from elite_dangerous_sdk.eddn import EDDNClient
from elite_dangerous_sdk.spansh import SpanshClient


# === EDSM: Star system data ===
edsm = EDSMClient()


def explore_system():
    sol = edsm.get_system("Sol")
    print(f"Sol ID: {sol.get('id')}")
    coords = sol.get("coords", {})
    print(f"Coords: {coords.get('x')}, {coords.get('y')}, {coords.get('z')}")

    bodies = edsm.get_system_bodies("Sol")
    print(f"Bodies in Sol: {len(bodies.get('bodies', []))}")
    for body in bodies.get("bodies", [])[:5]:
        print(f"  {body.get('name')} ({body.get('type')}: {body.get('subType')})")

    stations = edsm.get_system_stations("Sol")
    print(f"Stations: {len(stations.get('stations', []))}")

    nearby = edsm.get_sphere_systems("Sol", 20)
    print(f"Systems within 20 ly of Sol: {len(nearby)}")

    market = edsm.get_station_market("Sol", "Li Qing Jao")
    print(f"Market: {len(market.get('items', []))} items")

    factions = edsm.get_system_factions("Sol")
    for faction in factions.get("factions", []):
        print(f"  {faction.get('name')}: {faction.get('influence')}% influence")


# === Inara: Commander profile update ===
def update_inara():
    inara = InaraClient(
        app_name="MyEliteTool",
        app_version="1.0.0",
        api_key="your-inara-api-key",
        is_developing=True,
    )

    profile = inara.get_commander_profile()
    print("Profile response:", profile)

    inara.add_travel_fsd_jump("Sol", (0, 0, 0))
    inara.add_travel_dock("Li Qing Jao", "Sol")

    inara.set_commander_credits(1000000000, 0)

    inara.set_commander_rank(combat=5, trade=8, explore=10)


# === EDDN: Share market data ===
def share_data():
    eddn = EDDNClient(
        software_name="MyEliteTool",
        software_version="1.0.0",
    )

    eddn.send_commodity({
        "systemName": "Sol",
        "stationName": "Li Qing Jao",
        "marketId": 128000000,
        "commodities": [
            {
                "name": "Hydrogen Fuel",
                "buyPrice": 120,
                "sellPrice": 140,
                "meanPrice": 130,
                "stockBracket": 2,
                "demandBracket": 2,
                "stock": 50000,
                "demand": 0,
            },
            {
                "name": "Gold",
                "buyPrice": 9000,
                "sellPrice": 9500,
                "meanPrice": 9300,
                "stockBracket": 1,
                "demandBracket": 2,
                "stock": 150,
                "demand": 200,
            },
        ],
    }, "4.0.0.1451", "r286916/r0")

    eddn.send_shipyard({
        "systemName": "Sol",
        "stationName": "Li Qing Jao",
        "marketId": 128000000,
        "ships": ["Krait_MkII", "Python", "Anaconda", "Type-9"],
    }, "4.0.0.1451", "r286916/r0")


# === Spansh: Route planning and search ===
spansh = SpanshClient()


def search_and_plan():
    results = spansh.search("Sol")
    print("Search results:", results)

    names = spansh.search_system_names("Sag A")
    print("Matching systems:", names)

    system = spansh.get_system(10477373803)
    print(f"System: {system.get('name')} ({system.get('x')}, {system.get('y')}, {system.get('z')})")

    buyers = spansh.get_commodity_locations("sell", "Sol", "Platinum", 100)
    print(f"Best places to sell Platinum near Sol: {len(buyers)}")

    traders = spansh.search_stations({
        "filters": {
            "services": {"value": ["Material Trader"]},
        },
        "sort": [{"distance": {"direction": "asc"}}],
        "size": 5,
        "page": 0,
        "reference_coords": {"x": 0, "y": 0, "z": 0},
    })
    print(f"Material traders found: {traders.get('count')}")
    for result in traders.get("results", []):
        print(f"  {result.get('name')} @ {result.get('system_name')}")
