#!/usr/bin/env bash
# Run a command with the nvm alias "neocom" when available (local .nvmrc pin).
# On CI (actions/setup-node), fall back to whatever `node` is already on PATH.
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

load_nvm() {
  if [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "/usr/local/opt/nvm/nvm.sh"
    return 0
  fi
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh"
    return 0
  fi
  return 1
}

if load_nvm && nvm use neocom >/dev/null 2>&1; then
  exec "$@"
fi

if command -v node >/dev/null 2>&1; then
  echo "with-neocom-node: nvm alias neocom unavailable — using PATH node ($(node -v))" >&2
  exec "$@"
fi

echo "with-neocom-node: nvm alias neocom not installed and no node on PATH." >&2
echo "Install nvm + 'nvm install' from .nvmrc, or use actions/setup-node in CI." >&2
exit 1
