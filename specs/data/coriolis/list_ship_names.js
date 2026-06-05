#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function listShipNames() {
  const shipsDir = path.join(__dirname, 'ships');
  const shipFiles = fs.readdirSync(shipsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(shipsDir, f));

  const ships = [];

  shipFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const shipData = JSON.parse(content);
    const shipId = Object.keys(shipData)[0];
    const ship = shipData[shipId];

    ships.push({
      id: shipId,
      name: ship.properties.name,
      file: path.basename(filePath)
    });
  });

  // Sort by display name
  ships.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  console.log('Ships sorted by display name:\n');
  ships.forEach((ship, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${ship.name.padEnd(30)} (${ship.id})`);
  });

  // Find specific ships
  console.log('\n\nSpecific ships:');
  const caspian = ships.find(s => s.id === 'explorer_nx');
  const corsair = ships.find(s => s.id === 'imperial_corsair');

  console.log(`\nCaspian Explorer: position ${ships.indexOf(caspian) + 1}`);
  console.log(`  Should be between: ${ships[ships.indexOf(caspian) - 1].name} and ${ships[ships.indexOf(caspian) + 1].name}`);

  console.log(`\nCorsair: position ${ships.indexOf(corsair) + 1}`);
  console.log(`  Should be between: ${ships[ships.indexOf(corsair) - 1].name} and ${ships[ships.indexOf(corsair) + 1].name}`);
}

listShipNames();
