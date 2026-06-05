#!/bin/bash
# Build all TypeScript packages
set -e

echo "=== Building all packages ==="

for pkg in utils data journal companion edsm inara eddn spansh stats planner; do
  echo "Building @elite-dangerous-sdk/$pkg..."
  (cd "core/packages/$pkg" && npm run build 2>&1 | tail -1)
done

echo "=== Building CLI ==="
(cd cli && npm run build 2>&1 | tail -1)

echo "=== All builds complete ==="
