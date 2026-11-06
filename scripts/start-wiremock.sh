#!/usr/bin/env bash
# Start WireMock for front `dev` (stub root support/wiremock, host port 8080).
# Does not require neocom-back. Override with WIREMOCK_IMAGE / WIREMOCK_PORT / WIREMOCK_CONTAINER.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STUB_ROOT="${ROOT}/support/wiremock"
IMAGE="${WIREMOCK_IMAGE:-wiremock/wiremock:3.13.1}"
PORT="${WIREMOCK_PORT:-8080}"
CONTAINER="${WIREMOCK_CONTAINER:-neocom-front-wiremock}"

if [ ! -d "${STUB_ROOT}/mappings" ]; then
  echo "WireMock stub directory missing: ${STUB_ROOT}/mappings" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required to start WireMock (image ${IMAGE})." >&2
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -qx "${CONTAINER}"; then
  docker rm -f "${CONTAINER}" >/dev/null
fi

echo "Starting WireMock on http://localhost:${PORT} (stubs: support/wiremock)"
exec docker run --rm --name "${CONTAINER}" \
  -p "${PORT}:8080" \
  -v "${STUB_ROOT}:/home/wiremock" \
  "${IMAGE}"
