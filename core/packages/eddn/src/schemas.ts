/**
 * EDDN schema references and validation utilities.
 * Official schema URLs from https://github.com/EDCD/EDDN/tree/live/schemas
 */

export const EDDN_SCHEMAS = {
  COMMODITY: "https://eddn.edcd.io/schemas/commodity/3",
  SHIPYARD: "https://eddn.edcd.io/schemas/shipyard/2",
  OUTFITTING: "https://eddn.edcd.io/schemas/outfitting/2",
  FCMATERIALS_CAPI: "https://eddn.edcd.io/schemas/fcmaterials_capi/1",
  JOURNAL: "https://eddn.edcd.io/schemas/journal/1",
  BLACKMARKET: "https://eddn.edcd.io/schemas/blackmarket/1",
  APPROACHSETTLEMENT: "https://eddn.edcd.io/schemas/approachsettlement/1",
  NAVROUTE: "https://eddn.edcd.io/schemas/navroute/1",
  NAVROUTECLEAR: "https://eddn.edcd.io/schemas/navrouteclear/1",
  SCAN: "https://eddn.edcd.io/schemas/scan/1",
  CODEENTRY: "https://eddn.edcd.io/schemas/codeentry/1",
  FSSDISCOVERED: "https://eddn.edcd.io/schemas/fssdiscovered/1",
  SAASIGNSFOUND: "https://eddn.edcd.io/schemas/saasignalsfound/1",
  FSDJUMP: "https://eddn.edcd.io/schemas/fsdjump/1",
  LOCATION: "https://eddn.edcd.io/schemas/location/2",
  CARRIERJUMP: "https://eddn.edcd.io/schemas/carrierjump/1",
  DISPATCH: "https://eddn.edcd.io/schemas/dispatch/1",
  BACKPACK: "https://eddn.edcd.io/schemas/backpack/1",
  SHIPLOCKER: "https://eddn.edcd.io/schemas/shiplocker/1",
  SHIPYARD_BUY: "https://eddn.edcd.io/schemas/shipyard/2",
  OUTFITTING_BUY: "https://eddn.edcd.io/schemas/outfitting/2",
  FCMATERIALS_JOURNAL: "https://eddn.edcd.io/schemas/fcmaterials_journal/1",
} as const;

export type EddnSchemaRef = (typeof EDDN_SCHEMAS)[keyof typeof EDDN_SCHEMAS];

/**
 * Validate a commodity/market message before sending to EDDN.
 * Returns array of validation error messages (empty = valid).
 */
export function validateCommodityMessage(msg: {
  systemName: string;
  stationName: string;
  marketId: number;
  commodities: Array<Record<string, unknown>>;
}): string[] {
  const errors: string[] = [];
  if (!msg.systemName) errors.push("systemName is required");
  if (!msg.stationName) errors.push("stationName is required");
  if (!msg.marketId) errors.push("marketId is required");
  if (!msg.commodities?.length)
    errors.push("commodities array is required and must not be empty");
  for (const c of msg.commodities ?? []) {
    if (!c.name) errors.push("commodity.name is required for each commodity");
    if (c.buyPrice === undefined) errors.push("commodity.buyPrice is required");
    if (c.sellPrice === undefined)
      errors.push("commodity.sellPrice is required");
  }
  return errors;
}

/**
 * Validate a shipyard message before sending to EDDN.
 */
export function validateShipyardMessage(msg: {
  systemName: string;
  stationName: string;
  marketId: number;
  ships: string[];
}): string[] {
  const errors: string[] = [];
  if (!msg.systemName) errors.push("systemName is required");
  if (!msg.stationName) errors.push("stationName is required");
  if (!msg.marketId) errors.push("marketId is required");
  if (!msg.ships?.length) errors.push("ships array is required");
  return errors;
}

/**
 * Validate an outfitting message before sending to EDDN.
 */
export function validateOutfittingMessage(msg: {
  systemName: string;
  stationName: string;
  marketId: number;
  modules: string[];
}): string[] {
  const errors: string[] = [];
  if (!msg.systemName) errors.push("systemName is required");
  if (!msg.stationName) errors.push("stationName is required");
  if (!msg.marketId) errors.push("marketId is required");
  if (!msg.modules?.length) errors.push("modules array is required");
  return errors;
}

/**
 * Validate a fleet carrier materials message.
 */
export function validateFcMaterialsMessage(msg: {
  systemName: string;
  stationName: string;
  marketId: number;
  carrierCallsign: string;
  carrierDockingAccess: string;
}): string[] {
  const errors: string[] = [];
  if (!msg.systemName) errors.push("systemName is required");
  if (!msg.stationName) errors.push("stationName is required");
  if (!msg.marketId) errors.push("marketId is required");
  if (!msg.carrierCallsign) errors.push("carrierCallsign is required");
  if (!msg.carrierDockingAccess)
    errors.push("carrierDockingAccess is required");
  return errors;
}

export function validateJournalMessage(msg: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (!msg || Object.keys(msg).length === 0) errors.push("message must not be empty");
  return errors;
}

export function validateBlackmarketMessage(msg: {
  systemName: string;
  stationName: string;
  marketId: number;
  items: Array<Record<string, unknown>>;
}): string[] {
  const errors: string[] = [];
  if (!msg.systemName) errors.push("systemName is required");
  if (!msg.stationName) errors.push("stationName is required");
  if (!msg.marketId) errors.push("marketId is required");
  if (!msg.items?.length) errors.push("items array is required and must not be empty");
  for (const i of msg.items ?? []) {
    if (!i.name) errors.push("item.name is required for each item");
  }
  return errors;
}

export function validateNavRouteMessage(msg: {
  systemName: string;
  route: Array<Record<string, unknown>>;
}): string[] {
  const errors: string[] = [];
  if (!msg.systemName) errors.push("systemName is required");
  if (!msg.route?.length) errors.push("route array is required and must not be empty");
  return errors;
}

export function validateFcMaterialsJournalMessage(msg: {
  timestamp: string;
  event: string;
  CarrierName: string;
  MarketID: number;
  Items: Array<Record<string, unknown>>;
}): string[] {
  const errors: string[] = [];
  if (!msg.timestamp) errors.push("timestamp is required");
  if (!msg.event) errors.push("event is required");
  if (!msg.CarrierName) errors.push("CarrierName is required");
  if (!msg.MarketID) errors.push("MarketID is required");
  if (!msg.Items?.length) errors.push("Items array is required");
  return errors;
}
