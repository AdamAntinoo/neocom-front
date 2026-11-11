#!/usr/bin/env bash
# Post-CI local Docker handoff (CICD-F-084). Not run on github-hosted runners.
# Usage: IMAGE_TAG=0.1.0-12.feature.abc12345 ./scripts/local-pull-ghcr-front.sh
set -euo pipefail

OWNER="${GHCR_OWNER:-adamantinoo}"
NAME="${ARTIFACT_NAME:-neocom-front}"
TAG="${IMAGE_TAG:?Set IMAGE_TAG to the GitVersion imageTag from CI}"
IMAGE="ghcr.io/${OWNER}/${NAME}:${TAG}"

if [[ -n "${GHCR_PULL_TOKEN:-}" ]]; then
  echo "$GHCR_PULL_TOKEN" | docker login ghcr.io -u "${GHCR_USER:-$USER}" --password-stdin
fi

docker pull "$IMAGE"
docker tag "$IMAGE" "${NAME}:${TAG}"
echo "Pulled ${IMAGE} → local ${NAME}:${TAG}"
echo "Run: docker run --rm -p 6001:6001 ${NAME}:${TAG}"
