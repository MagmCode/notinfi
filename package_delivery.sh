#!/usr/bin/env bash
set -euo pipefail

TAR_PATH=${1:-artifact_dev/notinfi-dev.tar}
OUTNAME=${2:-srd-front-delivery-$(date +%Y%m%d_%H%M).zip}

echo "Creating delivery package..."

if [ ! -f "$TAR_PATH" ]; then
  echo "Tar file not found at '$TAR_PATH'. Download the artifact from GitHub Actions and place it here, or pass the path as first argument." >&2
  exit 1
fi

FILES=(
  "$TAR_PATH"
  docker-compose.yml
  Dockerfile.dev
  Dockerfile.prod
  README_docker.md
  .dockerignore
)

existing=()
for f in "${FILES[@]}"; do
  if [ -e "$f" ]; then
    existing+=("$f")
  fi
done

if [ ${#existing[@]} -eq 0 ]; then
  echo "No files found to include in the package." >&2
  exit 1
fi

echo "Files to include:"
for f in "${existing[@]}"; do
  echo " - $f"
done

if [ -f "$OUTNAME" ]; then
  rm -f "$OUTNAME"
fi

zip -r "$OUTNAME" "${existing[@]}"

echo "Package created: $OUTNAME"
echo "Deliver this ZIP to the target team; they can run 'docker load -i artifact_dev/notinfi-dev.tar' and then 'docker compose -f docker-compose.yml up -d --no-build'"
