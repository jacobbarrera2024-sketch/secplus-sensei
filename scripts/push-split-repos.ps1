# Create GitHub repos and push split output (Windows PowerShell)
# Run AFTER split-into-repos.ps1
# Requires: gh auth login

param(
  [string]$Split = (Join-Path (Split-Path $PSScriptRoot -Parent | Split-Path -Parent) "secplus-split")
)

$ErrorActionPreference = "Stop"
$Gh = "jacobbarrera2024-sketch"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "Install GitHub CLI: https://cli.github.com/"
}

function Push-Repo {
  param([string]$Name)
  $dir = Join-Path $Split $Name
  if (-not (Test-Path (Join-Path $dir ".git"))) {
    Write-Error "Missing $dir — run scripts/split-into-repos.ps1 first"
  }
  Write-Host "=== $Name ==="
  $exists = $false
  try { gh repo view "$Gh/$Name" 2>$null | Out-Null; $exists = $true } catch { $exists = $false }
  Push-Location $dir
  if ($exists) {
    Write-Host "Repo exists, pushing..."
    git remote remove origin 2>$null
    git remote add origin "https://github.com/$Gh/$Name.git"
    git push -u origin main
  } else {
    gh repo create "$Gh/$Name" --public --source="$dir" --remote=origin --push
  }
  Pop-Location
  Write-Host "Enable Pages: Settings -> Pages -> GitHub Actions"
  Write-Host ""
}

Push-Repo "jacobbarrera2024-sketch.github.io"
Push-Repo "secplus-ai-demo"
Push-Repo "quick-quote"
Push-Repo "sheet-dash"

Write-Host "Done. Portfolio: https://$Gh.github.io/"
