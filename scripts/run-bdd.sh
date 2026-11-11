#!/usr/bin/env bash
# Start WireMock + front app, then run Cypress BDD (CICD-F-043 / F-074).
# Usage: npm run test:bdd
# If servers are already up: BDD_EXTERNAL_SERVERS=1 npm run test:bdd
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WIREMOCK_CONTAINER="${WIREMOCK_CONTAINER:-neocom-front-wiremock-bdd}"
WIREMOCK_PORT="${WIREMOCK_PORT:-8080}"
WIREMOCK_IMAGE="${WIREMOCK_IMAGE:-wiremock/wiremock:3.13.1}"
# Use localhost (not 127.0.0.1) so Cypress origin matches Angular redirects / SSO redirectUri.
APP_URL="${CYPRESS_baseUrl:-http://localhost:6001}"
APP_READY="${APP_URL%/}/app/"
NG_PID=""

cleanup() {
  if [[ -n "${NG_PID}" ]] && kill -0 "${NG_PID}" 2>/dev/null; then
    kill "${NG_PID}" 2>/dev/null || true
    wait "${NG_PID}" 2>/dev/null || true
  fi
  if [[ "${BDD_EXTERNAL_SERVERS:-}" != "1" ]]; then
    docker rm -f "${WIREMOCK_CONTAINER}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

wait_http() {
  local url="$1"
  local seconds="${2:-120}"
  local i=0
  while (( i < seconds )); do
    if curl -sf -o /dev/null "$url"; then
      return 0
    fi
    sleep 1
    i=$((i + 1))
  done
  echo "Timed out waiting for ${url}" >&2
  return 1
}

if [[ "${BDD_EXTERNAL_SERVERS:-}" != "1" ]]; then
  if ! command -v docker >/dev/null 2>&1; then
    echo "docker is required to start WireMock for test:bdd" >&2
    exit 1
  fi

  docker rm -f "${WIREMOCK_CONTAINER}" >/dev/null 2>&1 || true
  echo "Starting WireMock on :${WIREMOCK_PORT}…"
  docker run -d --name "${WIREMOCK_CONTAINER}" \
    -p "${WIREMOCK_PORT}:8080" \
    -v "${ROOT}/support/wiremock:/home/wiremock" \
    "${WIREMOCK_IMAGE}" >/dev/null
  wait_http "http://localhost:${WIREMOCK_PORT}/__admin" 60

  if ! curl -sf -o /dev/null "${APP_READY}"; then
    echo "Starting ng serve on :6001…"
    NG_BUILD_SASS_EMBEDDED=0 bash scripts/with-neocom-node.sh ng serve --configuration development --host localhost --port 6001 >/tmp/neocom-front-bdd-ng.log 2>&1 &
    NG_PID=$!
    wait_http "${APP_READY}" 180
  else
    echo "App already responding at ${APP_READY} — reusing it"
  fi
else
  echo "BDD_EXTERNAL_SERVERS=1 — expecting WireMock + app already running"
  wait_http "${APP_READY}" 30
fi

export CYPRESS_baseUrl="${APP_URL}"
bash scripts/with-neocom-node.sh npx cypress run "$@"
