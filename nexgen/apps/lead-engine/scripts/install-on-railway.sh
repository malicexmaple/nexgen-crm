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

WINDOWS_POWERSHELL=/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe
API_KEY_PATTERN='^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$'

# Terminals can wrap pasted text in invisible bracketed-paste markers, which the server rejects.
clean_api_key() {
  local key=${1//$'\e[200~'/}
  key=${key//$'\e[201~'/}
  printf '%s' "$key" | tr -cd 'A-Za-z0-9._-'
}

if ! twenty auth status --remote production >/dev/null 2>&1; then
  echo "Create an API key in the CRM (Settings -> Developers -> Create API key, role Admin) and copy it."
  read -rsp "Press Enter once the key is copied. " _
  echo
  api_key=""
  [ -x "$WINDOWS_POWERSHELL" ] && api_key=$(clean_api_key "$("$WINDOWS_POWERSHELL" -NoProfile -Command Get-Clipboard 2>/dev/null || true)")
  if ! [[ $api_key =~ $API_KEY_PATTERN ]]; then
    read -rsp "Could not read a key from the clipboard. Paste it here and press Enter: " pasted_key
    echo
    api_key=$(clean_api_key "$pasted_key")
  fi
  echo "Using a ${#api_key}-character key."
  printf '%s' "$api_key" | twenty auth login --with-token --url "$CRM_URL" --name production --no-input
fi

if twenty app apply --remote production --no-input; then
  echo "Lead engine updated."
else
  twenty app apply --create --remote production --no-input
  echo "Lead engine installed. Add your API keys in Settings -> Apps -> NEXGEN Lead Engine -> Variables."
fi
