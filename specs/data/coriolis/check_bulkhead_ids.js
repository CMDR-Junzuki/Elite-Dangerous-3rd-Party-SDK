#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkBulkheadIds() {
  const shipsDir = path.join(__dirname, 'ships');
  const shipFiles = fs.readdirSync(shipsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(shipsDir, f));

  const idUsage = {}; // Track which ships use which IDs
  const shipBulkheads = {}; // Store all bulkhead IDs per ship

  shipFiles.forEach(filePath => {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const shipData = JSON.parse(content);
    const shipId = Object.keys(shipData)[0];
    const ship = shipData[shipId];

    if (!ship.bulkheads || !Array.isArray(ship.bulkheads)) {
      return;
    }

    const bulkheadIds = ship.bulkheads.map(b => b.id);
    shipBulkheads[filename] = bulkheadIds;

    bulkheadIds.forEach(id => {
      if (!idUsage[id]) {
        idUsage[id] = [];
      }
      idUsage[id].push(filename);
    });
  });

  // Find duplicates
  console.log('Duplicate bulkhead IDs:\n');
  let hasDuplicates = false;

  Object.keys(idUsage).sort().forEach(id => {
    if (idUsage[id].length > 1) {
      hasDuplicates = true;
      console.log(`ID "${id}" used by ${idUsage[id].length} ships:`);
      idUsage[id].forEach(ship => console.log(`  - ${ship}`));
      console.log('');
    }
  });

  if (!hasDuplicates) {
    console.log('No duplicate bulkhead IDs found!');
  }

  // Show all IDs for reference
  console.log('\n\nAll ships and their bulkhead IDs:\n');
  Object.keys(shipBulkheads).sort().forEach(ship => {
    console.log(`${ship}: ${shipBulkheads[ship].join(', ')}`);
  });
}

checkBulkheadIds();
