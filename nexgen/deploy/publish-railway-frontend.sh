#!/usr/bin/env bash
# Builds the NEXGEN frontend from this checkout and force-pushes it, with a thin Dockerfile on
# Twenty's official image, to the railway-deploy branch that Railway deploys from.
# Needs Docker with buildx and push access to origin. Run from any directory in the repo.
# Only valid while packages/twenty-server is unmodified; server changes need a full image build.
set -euo pipefail

repo=$(git rev-parse --show-toplevel)
cd "$repo"

commit=$(git rev-parse --short HEAD)
twenty_version=$(git describe --tags --abbrev=0 --match 'twenty/v*' | sed 's#^twenty/##')
image="nexgen-front:$commit"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

docker buildx build -f packages/twenty-docker/nexgen/Dockerfile \
  --target twenty-front-build -t "$image" --load .
container=$(docker create "$image")
docker cp "$container:/app/packages/twenty-front/build" "$work/front"
docker rm "$container" >/dev/null

sed "s#^ARG TWENTY_IMAGE=.*#ARG TWENTY_IMAGE=twentycrm/twenty:${twenty_version}#" \
  nexgen/deploy/railway/Dockerfile > "$work/Dockerfile"
cp nexgen/deploy/railway/README.md "$work/README.md"

git -C "$work" init -q -b railway-deploy
git -C "$work" add -A
git -C "$work" -c user.name="$(git config user.name)" -c user.email="$(git config user.email)" \
  commit -q -m "Deploy NEXGEN frontend from main@${commit} on Twenty ${twenty_version}"
git -C "$work" push --force "$(git remote get-url origin)" railway-deploy

echo "Published main@${commit} to railway-deploy (Twenty ${twenty_version})."
