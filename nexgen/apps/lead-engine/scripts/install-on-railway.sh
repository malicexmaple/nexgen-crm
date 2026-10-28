#!/usr/bin/env bash
# Installs (or updates) the lead engine on the live CRM. Linux/macOS/WSL only.
# From Windows PowerShell:
#   wsl -u root -- bash /mnt/c/Users/R9AMD/nexgen-crm/nexgen/apps/lead-engine/scripts/install-on-railway.sh
set -euo pipefail

CRM_URL=${1:-https://nexgen-crm-6v08q1pa.up.railway.app}
cd "$(dirname "$0")/.."

# Prefer the Node 24 set up in WSL for this project; the app tooling needs Node 24.5+.
[ -x /opt/node24/bin/node ] && export PATH=/opt/node24/bin:$PATH
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 24 ? 0 : 1)' \
  || { echo "Node 24+ is required (found $(node --version))."; exit 1; }
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

command -v twenty >/dev/null || npm install -g twenty@2.51.3 --no-fund --no-audit
corepack yarn install

if ! twenty auth list 2>/dev/null | grep -q production; then
  echo "Create an API key in the CRM: Settings -> Developers -> API keys -> Create (role Admin)."
  read -rsp "Paste the API key for $CRM_URL: " api_key
  echo
  printf '%s' "$api_key" | twenty auth login --with-token --url "$CRM_URL" --name production --no-input
fi

if twenty app apply --remote production --no-input; then
  echo "Lead engine updated."
else
  twenty app apply --create --remote production --no-input
  echo "Lead engine installed. Add your API keys in Settings -> Apps -> NEXGEN Lead Engine -> Variables."
fi
