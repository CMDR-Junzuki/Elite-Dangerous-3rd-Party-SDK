#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Generate next ID in the sequence (6X, 6Y, 6Z, 70, 71, ..., 7A, 7B, etc.)
function getNextId(currentId) {
  const firstChar = currentId.charAt(0);
  const secondChar = currentId.charAt(1);

  // Handle numeric second character
  if (secondChar >= '0' && secondChar <= '9') {
    if (secondChar === '9') {
      return firstChar + 'A';
    }
    return firstChar + String.fromCharCode(secondChar.charCodeAt(0) + 1);
  }

  // Handle alphabetic second character (uppercase)
  if (secondChar >= 'A' && secondChar <= 'Y') {
    return firstChar + String.fromCharCode(secondChar.charCodeAt(0) + 1);
  }

  // Handle Z -> increment first character and reset to 0
  if (secondChar === 'Z') {
    if (firstChar >= '0' && firstChar <= '8') {
      return String.fromCharCode(firstChar.charCodeAt(0) + 1) + '0';
    }
    if (firstChar === '9') {
      return 'A0';
    }
    if (firstChar >= 'A' && firstChar <= 'Y') {
      return String.fromCharCode(firstChar.charCodeAt(0) + 1) + '0';
    }
    if (firstChar === 'Z') {
      throw new Error('ID space exhausted!');
    }
  }

  throw new Error(`Invalid ID format: ${currentId}`);
}

function fixBulkheadIds() {
  const shipsDir = path.join(__dirname, 'ships');
  const shipFiles = fs.readdirSync(shipsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(shipsDir, f));

  // First pass: collect all used IDs and find duplicates
  const idUsage = {};
  const shipBulkheadData = {};

  shipFiles.forEach(filePath => {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const shipData = JSON.parse(content);
    const shipId = Object.keys(shipData)[0];
    const ship = shipData[shipId];

    if (!ship.bulkheads || !Array.isArray(ship.bulkheads)) {
      return;
    }

    shipBulkheadData[filename] = {
      path: filePath,
      shipData,
      shipId,
      bulkheads: ship.bulkheads
    };

    ship.bulkheads.forEach((b, idx) => {
      if (!idUsage[b.id]) {
        idUsage[b.id] = [];
      }
      idUsage[b.id].push({ filename, index: idx });
    });
  });

  // Find ships with duplicate IDs that need fixing
  const shipsToFix = new Set();
  Object.keys(idUsage).forEach(id => {
    if (idUsage[id].length > 1) {
      // Keep first ship with this ID, fix the rest
      idUsage[id].slice(1).forEach(usage => {
        shipsToFix.add(usage.filename);
      });
    }
  });

  console.log(`Found ${shipsToFix.size} ships with duplicate bulkhead IDs that need fixing:\n`);
  Array.from(shipsToFix).sort().forEach(ship => console.log(`  - ${ship}`));
  console.log('');

  // Start assigning new IDs from 6X
  let nextId = '6X';
  const allUsedIds = new Set(Object.keys(idUsage));

  // Second pass: fix duplicates
  let fixedCount = 0;
  Array.from(shipsToFix).sort().forEach(filename => {
    const data = shipBulkheadData[filename];
    if (!data) return;

    console.log(`\nFixing ${filename}...`);
    let modified = false;

    data.bulkheads.forEach((bulkhead, idx) => {
      // Check if this ID is a duplicate
      if (idUsage[bulkhead.id] && idUsage[bulkhead.id].length > 1) {
        // Check if this is NOT the first usage
        const isFirstUsage = idUsage[bulkhead.id][0].filename === filename &&
                            idUsage[bulkhead.id][0].index === idx;

        if (!isFirstUsage) {
          const oldId = bulkhead.id;

          // Find next unused ID
          while (allUsedIds.has(nextId)) {
            nextId = getNextId(nextId);
          }

          bulkhead.id = nextId;
          allUsedIds.add(nextId);
          console.log(`  Bulkhead ${idx}: ${oldId} -> ${nextId}`);
          modified = true;

          nextId = getNextId(nextId);
        }
      }
    });

    if (modified) {
      fs.writeFileSync(data.path, JSON.stringify(data.shipData, null, 2) + '\n', 'utf8');
      console.log(`  ✓ Updated ${filename}`);
      fixedCount++;
    }
  });

  console.log(`\n\nCompleted! Fixed ${fixedCount} ship files.`);
  console.log(`Next available ID: ${nextId}`);
}

fixBulkheadIds();
