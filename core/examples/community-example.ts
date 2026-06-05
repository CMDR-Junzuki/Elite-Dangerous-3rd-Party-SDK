/**
 * Example: Community API Clients
 *
 * Demonstrates EDSM, Inara, EDDN, and Spansh API usage.
 */

// === EDSM: Star system data ===
import { EDSMClient } from "@elite-dangerous-sdk/edsm";

const edsm = new EDSMClient();

async function _exploreSystem() {
  // Get system info
  const sol = await edsm.getSystem("Sol");
  console.log(`Sol ID: ${sol.id}`);
  console.log(`Coords: ${sol.coords?.x}, ${sol.coords?.y}, ${sol.coords?.z}`);

  // Get bodies in system
  const bodies = await edsm.getSystemBodies("Sol");
  console.log(`Bodies in Sol: ${bodies.bodies.length}`);
  for (const body of bodies.bodies.slice(0, 5)) {
    console.log(`  ${body.name} (${body.type}: ${body.subType})`);
  }

  // Get stations
  const stations = await edsm.getSystemStations("Sol");
  console.log(`Stations: ${stations.stations.length}`);

  // Get nearby systems (within 20 ly)
  const nearby = await edsm.getSphereSystems("Sol", 20);
  console.log(`Systems within 20 ly of Sol: ${nearby.length}`);

  // Get station market
  const market = await edsm.getStationMarket("Sol", "Li Qing Jao");
  console.log(`Market: ${market.items.length} items`);

  // Get factions
  const factions = await edsm.getSystemFactions("Sol");
  for (const faction of factions.factions) {
    console.log(`  ${faction.name}: ${faction.influence}% influence`);
  }
}

// === Inara: Commander profile update ===
import { InaraClient } from "@elite-dangerous-sdk/inara";

async function _updateInara() {
  const inara = new InaraClient({
    appName: "MyEliteTool",
    appVersion: "1.0.0",
    isBeingDeveloped: true, // Set false for production
    APIkey: "your-inara-api-key",
  });

  // Get commander profile
  const profile = await inara.sendEvents([inara.getCommanderProfile()]);
  console.log("Profile response:", profile);

  // Update travel
  const _travelResult = await inara.sendEvents([
    inara.addCommanderTravelFSDJump("Sol", [0, 0, 0]),
    inara.addCommanderTravelDock("Li Qing Jao", "Sol"),
  ]);

  // Update ship
  const _shipResult = await inara.sendEvents([
    inara.setCommanderShip({
      shipType: "Krait_MkII",
      shipGameID: 1,
      shipName: "Maverick",
      shipIdent: "KR-01",
    }),
  ]);

  // Update credits
  const _creditsResult = await inara.sendEvents([
    inara.setCommanderCredits(1000000000, 0),
  ]);

  // Update ranks
  const _rankResult = await inara.sendEvents([
    inara.setCommanderRank({
      combat: 5,
      trade: 8,
      explore: 10,
      federation: 8,
      empire: 6,
    }),
  ]);
}

// === EDDN: Share market data ===
import { EDDNClient } from "@elite-dangerous-sdk/eddn";

async function _shareData() {
  const eddn = new EDDNClient({
    softwareName: "MyEliteTool",
    softwareVersion: "1.0.0",
  });

  // Send commodity market data
  await eddn.sendCommodity(
    {
      systemName: "Sol",
      stationName: "Li Qing Jao",
      marketId: 128000000,
      commodities: [
        {
          name: "Hydrogen Fuel",
          buyPrice: 120,
          sellPrice: 140,
          meanPrice: 130,
          stockBracket: 2,
          demandBracket: 2,
          stock: 50000,
          demand: 0,
        },
        {
          name: "Gold",
          buyPrice: 9000,
          sellPrice: 9500,
          meanPrice: 9300,
          stockBracket: 1,
          demandBracket: 2,
          stock: 150,
          demand: 200,
        },
      ],
      horizons: true,
      odyssey: true,
    },
    "4.0.0.1451",
    "r286916/r0",
  );

  // Send shipyard data
  await eddn.sendShipyard(
    {
      systemName: "Sol",
      stationName: "Li Qing Jao",
      marketId: 128000000,
      ships: ["Krait_MkII", "Python", "Anaconda", "Type-9"],
      horizons: true,
      odyssey: true,
    },
    "4.0.0.1451",
    "r286916/r0",
  );
}

// === Spansh: Route planning and search ===
import { SpanshClient } from "@elite-dangerous-sdk/spansh";

const spansh = new SpanshClient();

async function _searchAndPlan() {
  // Search for systems
  const searchResults = await spansh.search("Sol");
  console.log("Search results:", searchResults);

  // Type-ahead system names
  const names = await spansh.searchSystemNames("Sag A");
  console.log("Matching systems:", names);

  // Get system by id64
  const system = await spansh.getSystem(10477373803);
  console.log(`System: ${system.name} (${system.x}, ${system.y}, ${system.z})`);

  // Find where to buy/sell commodities
  const platinumBuyers = await spansh.getCommodityLocations(
    "sell",
    "Sol",
    "Platinum",
    100,
  );
  console.log(
    `Best places to sell Platinum near Sol: ${platinumBuyers.length}`,
  );

  // Advanced station search (find material traders)
  const traders = await spansh.searchStations({
    filters: {
      services: { value: ["Material Trader"] },
    },
    sort: [{ distance: { direction: "asc" } }],
    size: 5,
    page: 0,
    reference_coords: { x: 0, y: 0, z: 0 },
  });
  console.log(`Material traders found: ${traders.count}`);
  for (const result of traders.results) {
    console.log(`  ${result.name} @ ${result.system_name}`);
  }
}
