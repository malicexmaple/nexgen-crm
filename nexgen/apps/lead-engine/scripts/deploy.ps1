# Deploys the lead engine to the live CRM from the latest GitHub main. A deploy replaces
# whatever is live, so deploying an out-of-date copy would undo someone else's work.
# Usage (Windows PowerShell): powershell -ExecutionPolicy Bypass -File nexgen\apps\lead-engine\scripts\deploy.ps1 [-CheckOnly]
param([switch]$CheckOnly)

function Stop-Deploy([string]$message) {
  Write-Host $message -ForegroundColor Red
  exit 1
}

$repoRoot = (git -C $PSScriptRoot rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Stop-Deploy 'This script must stay inside the nexgen-crm folder.' }
$repoRoot = $repoRoot.Trim()

git -C $repoRoot fetch --quiet origin main 2>$null
if ($LASTEXITCODE -ne 0) { Stop-Deploy 'Could not reach GitHub. Check your internet connection and try again.' }

$branch = (git -C $repoRoot rev-parse --abbrev-ref HEAD).Trim()
if ($branch -ne 'main') { Stop-Deploy "You are on branch '$branch'. Deploy from main: git checkout main" }

$changes = @(git -C $repoRoot status --porcelain -- nexgen/apps/lead-engine)
if ($changes.Count -gt 0) {
  Stop-Deploy ("These lead engine changes are not on GitHub yet:`n" + ($changes -join "`n") + "`nCommit and push them, then deploy.")
}

$ahead = [int](git -C $repoRoot rev-list --count origin/main..HEAD)
if ($ahead -gt 0) { Stop-Deploy "$ahead commit(s) here are not on GitHub yet. Push them first: git push" }

$behind = [int](git -C $repoRoot rev-list --count HEAD..origin/main)
if ($behind -gt 0) {
  Write-Host "Getting $behind newer commit(s) from GitHub..."
  git -C $repoRoot pull --ff-only --quiet origin main
  if ($LASTEXITCODE -ne 0) { Stop-Deploy 'Could not update from GitHub. Run git pull and sort out any conflicts, then deploy.' }
}

$version = (git -C $repoRoot log -1 --format='%h %s (%an)').Trim()
if ($CheckOnly) {
  Write-Host "Ready to deploy: $version" -ForegroundColor Green
  exit 0
}

Write-Host "Deploying $version"
# WSL drops backslashes from arguments, so hand it the path with forward slashes.
$installScript = wsl -u root -- wslpath -a (($PSScriptRoot -replace '\\', '/') + '/install-on-railway.sh')
if (-not $installScript) { Stop-Deploy 'WSL is not set up. See "Installing on the live CRM" in the lead engine README.' }
wsl -u root -- bash $installScript.Trim()
exit $LASTEXITCODE
