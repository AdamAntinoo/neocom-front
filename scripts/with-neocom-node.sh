#!/usr/bin/env bash
# Run a command with the nvm alias "neocom" (Node pinned in .nvmrc).
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "/usr/local/opt/nvm/nvm.sh"
elif [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
else
  echo "nvm.sh not found. Install nvm and create the neocom alias." >&2
  exit 1
fi

nvm use neocom >/dev/null
exec "$@"
