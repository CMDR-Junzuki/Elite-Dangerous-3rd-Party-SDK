#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Standard bulkhead names based on hullboost values
const STANDARD_BULKHEAD_NAMES = [
  'Lightweight Alloy',         // hullboost: 0.8
  'Reinforced Alloy',          // hullboost: 1.52
  'Military Grade Composite',  // hullboost: 2.5
  'Mirrored Surface Composite',// hullboost: 2.5 with specific resistances
  'Reactive Surface Composite' // hullboost: 2.5 with specific resistances
];

// Mk II Ablative bulkhead names for Caspian Explorer
const ABLATIVE_BULKHEAD_NAMES = [
  'Lightweight Alloy',
  'Mk II Ablative Lightweight',
  'Mk II Ablative Reinforced',
  'Mk II Ablative Military Grade',
  'Mk II Ablative Mirrored',
  'Mk II Ablative Reactive'
];

function getBulkheadName(bulkhead, index, shipId) {
  // Special handling for Caspian Explorer (explorer_nx)
  if (shipId === 'explorer_nx') {
    return ABLATIVE_BULKHEAD_NAMES[index] || `Unknown Bulkhead ${index}`;
  }

  // Standard bulkheads for all other ships
  const hullboost = bulkhead.hullboost;

  if (hullboost === 0.8) {
    return index === 0 ? 'Lightweight Alloy' : 'Lightweight Alloy';
  } else if (hullboost === 1.52) {
    return 'Reinforced Alloy';
  } else if (hullboost === 2.5) {
    // Distinguish between Military, Mirrored, and Reactive by resistances
    if (bulkhead.kinres === -0.75 && bulkhead.explres === -0.5) {
      return 'Mirrored Surface Composite';
    } else if (bulkhead.kinres === 0.25 && bulkhead.explres === 0.2) {
      return 'Reactive Surface Composite';
    } else {
      return 'Military Grade Composite';
    }
  }

  return STANDARD_BULKHEAD_NAMES[index] || `Unknown Bulkhead ${index}`;
}

function processShipFile(filePath) {
  console.log(`Processing ${path.basename(filePath)}...`);

  const content = fs.readFileSync(filePath, 'utf8');
  const shipData = JSON.parse(content);

  // Get the ship ID (key in the JSON object)
  const shipId = Object.keys(shipData)[0];
  const ship = shipData[shipId];

  if (!ship.bulkheads || !Array.isArray(ship.bulkheads)) {
    console.log(`  Skipping - no bulkheads array found`);
    return false;
  }

  let modified = false;

  ship.bulkheads.forEach((bulkhead, index) => {
    if (!bulkhead.name) {
      bulkhead.name = getBulkheadName(bulkhead, index, shipId);
      modified = true;
      console.log(`  Added name: "${bulkhead.name}" to bulkhead ${index}`);
    } else {
      console.log(`  Bulkhead ${index} already has name: "${bulkhead.name}"`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(shipData, null, 2) + '\n', 'utf8');
    console.log(`  ✓ Updated ${path.basename(filePath)}`);
    return true;
  } else {
    console.log(`  No changes needed`);
    return false;
  }
}

function main() {
  const shipsDir = path.join(__dirname, 'ships');

  if (!fs.existsSync(shipsDir)) {
    console.error(`Ships directory not found: ${shipsDir}`);
    process.exit(1);
  }

  const shipFiles = fs.readdirSync(shipsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(shipsDir, f));

  console.log(`Found ${shipFiles.length} ship files\n`);

  let updatedCount = 0;

  shipFiles.forEach(filePath => {
    if (processShipFile(filePath)) {
      updatedCount++;
    }
    console.log('');
  });

  console.log(`\nCompleted! Updated ${updatedCount} out of ${shipFiles.length} ship files.`);
}

main();
