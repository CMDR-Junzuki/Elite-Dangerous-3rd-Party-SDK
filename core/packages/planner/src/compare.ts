import type { Ship } from "@elite-dangerous-sdk/data";

export interface ShipComparisonRow {
  stat: string;
  values: (string | number | boolean | undefined)[];
}

export function compareShips(ships: Ship[]): ShipComparisonRow[] {
  const rows: ShipComparisonRow[] = [];

  const statFields: [string, keyof Ship["properties"]][] = [
    ["Name", "name"],
    ["Manufacturer", "manufacturer"],
    ["Hull Mass (t)", "hullMass"],
    ["Base Armour", "baseArmour"],
    ["Base Shield", "baseShieldStrength"],
    ["Speed (m/s)", "speed"],
    ["Boost (m/s)", "boost"],
    ["Pitch Rate", "pitch"],
    ["Roll Rate", "roll"],
    ["Yaw Rate", "yaw"],
    ["Hardness", "hardness"],
    ["Mass Lock Factor", "masslock"],
    ["Heat Capacity", "heatCapacity"],
    ["Reserve Fuel (t)", "reserveFuelCapacity"],
    ["Crew", "crew"],
    ["Hull Cost (CR)", "hullCost"],
  ];

  for (const [label, field] of statFields) {
    rows.push({
      stat: label,
      values: ships.map((s) => s.properties[field]),
    });
  }

  rows.push({
    stat: "Total Standard Slots",
    values: ships.map((s) => s.slots.standard.length),
  });

  rows.push({
    stat: "Total Hardpoints",
    values: ships.map((s) => s.slots.hardpoints.length),
  });

  rows.push({
    stat: "Total Internal Slots",
    values: ships.map((s) => s.slots.internal.length),
  });

  return rows;
}

export function formatComparisonTable(
  rows: ShipComparisonRow[],
  shipNames: string[],
): string {
  const header = ["Stat", ...shipNames].join(" | ");
  const separator = ["---", ...shipNames.map(() => "---")].join(" | ");

  const body = rows.map((row) => {
    return [row.stat, ...row.values.map((v) => String(v ?? "N/A"))].join(" | ");
  });

  return [header, separator, ...body].join("\n");
}
