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
  if (!msg || Object.keys(msg).length === 0)
    errors.push("message must not be empty");
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
  if (!msg.items?.length)
    errors.push("items array is required and must not be empty");
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
  if (!msg.route?.length)
    errors.push("route array is required and must not be empty");
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

/**
 * Validate an approach settlement message.
 */
export function validateApproachSettlementMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (!msg.settlementName) errors.push("settlementName is required");
  if (!msg.SystemAddress) errors.push("SystemAddress is required");
  if (!msg.timestamp) errors.push("timestamp is required");
  return errors;
}

/**
 * Validate a nav route clear message.
 */
export function validateNavRouteClearMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (msg.route !== undefined && !Array.isArray(msg.route))
    errors.push("route must be an array");
  if (!msg.timestamp) errors.push("timestamp is required");
  return errors;
}

/**
 * Validate a scan/exploration message.
 */
export function validateScanMessage(msg: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (!msg.timestamp) errors.push("timestamp is required");
  if (!msg.BodyName && !msg.BodyID)
    errors.push("BodyName or BodyID is required");
  return errors;
}

/**
 * Validate a code entry message.
 */
export function validateCodeEntryMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (!msg.systemName) errors.push("systemName is required");
  if (!msg.timestamp) errors.push("timestamp is required");
  return errors;
}

/**
 * Validate an FSS discovered message.
 */
export function validateFssDiscoveredMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (!msg.systemName) errors.push("systemName is required");
  if (msg.bodies !== undefined && !Array.isArray(msg.bodies))
    errors.push("bodies must be an array");
  if (!msg.timestamp) errors.push("timestamp is required");
  return errors;
}

/**
 * Validate an SAA signals found message.
 */
export function validateSaaSignalsFoundMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (!msg.systemName) errors.push("systemName is required");
  if (!msg.bodyName) errors.push("bodyName is required");
  if (msg.signals !== undefined && !Array.isArray(msg.signals))
    errors.push("signals must be an array");
  if (!msg.timestamp) errors.push("timestamp is required");
  return errors;
}

/**
 * Validate an FSD jump message.
 */
export function validateFsdJumpMessage(msg: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (!msg.StarSystem) errors.push("StarSystem is required");
  if (!msg.SystemAddress) errors.push("SystemAddress is required");
  if (!msg.timestamp) errors.push("timestamp is required");
  return errors;
}

/**
 * Validate a location message.
 */
export function validateLocationMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (!msg.StarSystem) errors.push("StarSystem is required");
  if (!msg.SystemAddress) errors.push("SystemAddress is required");
  if (!msg.timestamp) errors.push("timestamp is required");
  return errors;
}

/**
 * Validate a carrier jump message.
 */
export function validateCarrierJumpMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (!msg.StarSystem) errors.push("StarSystem is required");
  if (!msg.SystemAddress) errors.push("SystemAddress is required");
  if (!msg.timestamp) errors.push("timestamp is required");
  return errors;
}

/**
 * Validate a dispatch message.
 */
export function validateDispatchMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (!msg.Text && !msg.Topics) errors.push("Text or Topics is required");
  if (!msg.timestamp) errors.push("timestamp is required");
  return errors;
}

/**
 * Validate a backpack message.
 */
export function validateBackpackMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (!msg.timestamp) errors.push("timestamp is required");
  if (msg.Items !== undefined && !Array.isArray(msg.Items))
    errors.push("Items must be an array");
  if (msg.Components !== undefined && !Array.isArray(msg.Components))
    errors.push("Components must be an array");
  if (msg.Consumables !== undefined && !Array.isArray(msg.Consumables))
    errors.push("Consumables must be an array");
  if (msg.Data !== undefined && !Array.isArray(msg.Data))
    errors.push("Data must be an array");
  return errors;
}

/**
 * Validate a ship locker message.
 */
export function validateShipLockerMessage(
  msg: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  if (!msg.timestamp) errors.push("timestamp is required");
  if (msg.Items !== undefined && !Array.isArray(msg.Items))
    errors.push("Items must be an array");
  if (msg.Components !== undefined && !Array.isArray(msg.Components))
    errors.push("Components must be an array");
  if (msg.Consumables !== undefined && !Array.isArray(msg.Consumables))
    errors.push("Consumables must be an array");
  if (msg.Data !== undefined && !Array.isArray(msg.Data))
    errors.push("Data must be an array");
  return errors;
}

type MessageRecord = Record<string, unknown>;

/** Schema-to-validator dispatch map. */
const SCHEMA_VALIDATORS: Record<string, (msg: MessageRecord) => string[]> = {
  [EDDN_SCHEMAS.COMMODITY]: (m) =>
    validateCommodityMessage(
      m as Parameters<typeof validateCommodityMessage>[0],
    ),
  [EDDN_SCHEMAS.SHIPYARD]: (m) =>
    validateShipyardMessage(m as Parameters<typeof validateShipyardMessage>[0]),
  [EDDN_SCHEMAS.OUTFITTING]: (m) =>
    validateOutfittingMessage(
      m as Parameters<typeof validateOutfittingMessage>[0],
    ),
  [EDDN_SCHEMAS.FCMATERIALS_CAPI]: (m) =>
    validateFcMaterialsMessage(
      m as Parameters<typeof validateFcMaterialsMessage>[0],
    ),
  [EDDN_SCHEMAS.JOURNAL]: (m) => validateJournalMessage(m),
  [EDDN_SCHEMAS.BLACKMARKET]: (m) =>
    validateBlackmarketMessage(
      m as Parameters<typeof validateBlackmarketMessage>[0],
    ),
  [EDDN_SCHEMAS.NAVROUTE]: (m) =>
    validateNavRouteMessage(m as Parameters<typeof validateNavRouteMessage>[0]),
  [EDDN_SCHEMAS.FCMATERIALS_JOURNAL]: (m) =>
    validateFcMaterialsJournalMessage(
      m as Parameters<typeof validateFcMaterialsJournalMessage>[0],
    ),
  [EDDN_SCHEMAS.APPROACHSETTLEMENT]: validateApproachSettlementMessage,
  [EDDN_SCHEMAS.NAVROUTECLEAR]: validateNavRouteClearMessage,
  [EDDN_SCHEMAS.SCAN]: validateScanMessage,
  [EDDN_SCHEMAS.CODEENTRY]: validateCodeEntryMessage,
  [EDDN_SCHEMAS.FSSDISCOVERED]: validateFssDiscoveredMessage,
  [EDDN_SCHEMAS.SAASIGNSFOUND]: validateSaaSignalsFoundMessage,
  [EDDN_SCHEMAS.FSDJUMP]: validateFsdJumpMessage,
  [EDDN_SCHEMAS.LOCATION]: validateLocationMessage,
  [EDDN_SCHEMAS.CARRIERJUMP]: validateCarrierJumpMessage,
  [EDDN_SCHEMAS.DISPATCH]: validateDispatchMessage,
  [EDDN_SCHEMAS.BACKPACK]: validateBackpackMessage,
  [EDDN_SCHEMAS.SHIPLOCKER]: validateShipLockerMessage,
};

/**
 * Validates a raw EDDN message by inspecting its `$schemaRef` field.
 *
 * Accepts a full EDDN message object (with `$schemaRef`, `header`, `message`).
 * Returns an array of validation error strings (empty = valid).
 * Returns `["unknown schema: <ref>"]` if the schema ref is not recognized.
 */
export function validateEDDN(envelope: {
  $schemaRef?: string;
  header?: {
    uploaderID?: string;
    softwareName?: string;
    softwareVersion?: string;
  };
  message?: MessageRecord;
}): string[] {
  const errors: string[] = [];

  if (!envelope) return ["envelope is required"];

  if (!envelope.$schemaRef) errors.push("$schemaRef is required");
  if (!envelope.header) {
    errors.push("header is required");
  } else {
    if (!envelope.header.uploaderID)
      errors.push("header.uploaderID is required");
    if (!envelope.header.softwareName)
      errors.push("header.softwareName is required");
    if (!envelope.header.softwareVersion)
      errors.push("header.softwareVersion is required");
  }

  if (!envelope.message) {
    errors.push("message is required");
    return errors;
  }

  const schemaRef = envelope.$schemaRef;
  if (!schemaRef) return errors;

  const validator = SCHEMA_VALIDATORS[schemaRef];
  if (!validator) {
    errors.push(`unknown schema: ${schemaRef}`);
    return errors;
  }

  errors.push(...validator(envelope.message));
  return errors;
}
