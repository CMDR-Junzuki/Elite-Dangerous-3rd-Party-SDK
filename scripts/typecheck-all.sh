#!/bin/bash
# Type-check all TypeScript packages
set -e

echo "=== Type-checking all packages ==="

for pkg in utils data journal companion edsm inara eddn spansh stats planner; do
  echo "Checking @elite-dangerous-sdk/$pkg..."
  (cd "core/packages/$pkg" && npx tsc --noEmit 2>&1 | tail -3)
done

echo "=== Lint complete ==="
