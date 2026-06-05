/**
 * Example: Reading the player journal
 *
 * This shows how to read all journal events, watch for new ones,
 * and read companion files like Status.json.
 */

import {
  getJournalDirectory,
  Journal,
  readMarketFile,
  readStatusFile,
} from "@elite-dangerous-sdk/journal";

// === Read all existing events ===
async function _readAllEvents() {
  const journal = new Journal();

  console.log(`Reading from: ${journal.directory}`);

  for await (const event of journal) {
    switch (event.event) {
      case "FileHeader":
        console.log(
          `Session started: v${event.gameversion} (build ${event.build})`,
        );
        break;

      case "LoadGame":
        console.log(`Commander ${event.Commander} in ${event.Ship}`);
        break;

      case "FSDJump":
        console.log(`Jumped to ${event.StarSystem} (${event.JumpDist} ly)`);
        break;

      case "Docked":
        console.log(`Docked at ${event.StationName}`);
        break;

      case "Scan":
        console.log(`Scanned ${event.BodyName}`);
        break;

      case "Location":
        console.log(`Location: ${event.StarSystem}`);
        break;
    }
  }
}

// === Watch for live events ===
import { JournalWatcher } from "@elite-dangerous-sdk/journal";

async function _watchLive() {
  const dir = getJournalDirectory();
  const watcher = new JournalWatcher(dir);

  console.log("Watching for new journal events...");
  for await (const event of watcher.watchEvents()) {
    console.log(`[${event.event}] ${event.timestamp}`);
  }
}

// === Read companion files ===
async function _readCompanionFiles() {
  const dir = getJournalDirectory();

  const status = await readStatusFile(dir);
  if (status) {
    console.log(`Status: Flags=${status.Flags}, Cargo=${status.Cargo}`);
    console.log(
      `Fuel: ${status.Fuel.FuelMain}t / ${status.Fuel.FuelReservoir}t`,
    );
    console.log(
      `Pips: SYS=${status.Pips[0]} ENG=${status.Pips[1]} WEP=${status.Pips[2]}`,
    );
  }

  const market = await readMarketFile(dir);
  if (market) {
    console.log(`Market: ${market.StarSystem} / ${market.StationName}`);
    console.log(`${market.Items.length} commodities listed`);
  }
}

// === Resume from last position ===
import type { JournalPosition } from "@elite-dangerous-sdk/journal";

async function _resumeFromPosition(savedPosition: JournalPosition) {
  const journal = new Journal({
    position: savedPosition,
  });

  for await (const event of journal) {
    // Process only new events since last run
    console.log(`New event: ${event.event}`);
  }
}

// Run examples
// await readAllEvents();
// await watchLive();
// await readCompanionFiles();
