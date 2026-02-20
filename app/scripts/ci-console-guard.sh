#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATTERN='console\.(log|warn|error|info|debug)\('

cd "$ROOT_DIR"

if rg -n \
  "$PATTERN" \
  src/app/api \
  src/lib \
  --glob '!src/lib/analytics/**' \
  --glob '!src/lib/courses/**' \
  --glob '!src/lib/data/**' \
  --glob '!src/lib/devlab/**' \
  --glob '!src/lib/env.ts' \
  --glob '!src/lib/playground/**' \
  --glob '!src/lib/workbench/**' \
  --glob '!src/lib/workspace/**'
then
  echo "Console guard failed: remove console.* from protected server paths." >&2
  exit 1
fi

echo "Console guard passed."
