#!/bin/bash
# Test all TypeScript packages
set -e

echo "=== Testing all packages ==="

for pkg in utils data stats planner; do
  if [ -d "core/packages/$pkg/__tests__" ]; then
    echo "Testing @elite-dangerous-sdk/$pkg..."
    (cd "core/packages/$pkg" && npx vitest run 2>&1 | tail -5)
  fi
done

echo "=== Testing Python ==="
(cd python && python -m pytest tests/ -v 2>&1 | tail -10)

echo "=== All tests complete ==="
