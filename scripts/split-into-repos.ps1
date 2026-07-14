# Split secplus-sensei monorepo into standalone repositories (Windows PowerShell)
# Run from repo root: powershell -ExecutionPolicy Bypass -File scripts/split-into-repos.ps1

param(
  [string]$Out = (Join-Path (Split-Path $PSScriptRoot -Parent | Split-Path -Parent) "secplus-split")
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$GhUser = "jacobbarrera2024-sketch"
$PagesBase = "https://$GhUser.github.io"
$DeployYml = Join-Path $PSScriptRoot "templates/deploy-pages.yml"

Write-Host "Source: $Root"
Write-Host "Output: $Out"
New-Item -ItemType Directory -Force -Path $Out | Out-Null

function Copy-Demo {
  param([string]$Name, [string]$DestName = $Name)
  $src = Join-Path $Root $Name
  $dest = Join-Path $Out $DestName
  if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
  Copy-Item -Recurse $src $dest
  $gh = Join-Path $dest ".github"
  if (Test-Path $gh) { Remove-Item -Recurse -Force $gh }
  $wf = Join-Path $dest ".github/workflows"
  New-Item -ItemType Directory -Force -Path $wf | Out-Null
  Copy-Item $DeployYml (Join-Path $wf "deploy-pages.yml")
  New-Item -ItemType File -Force -Path (Join-Path $dest ".nojekyll") | Out-Null
  Set-Content -Path (Join-Path $dest ".gitignore") -Value "node_modules/`n.DS_Store`n"
}

function Patch-File {
  param([string]$Path, [hashtable]$Replacements)
  if (-not (Test-Path $Path)) { return }
  $text = Get-Content $Path -Raw -Encoding UTF8
  foreach ($key in $Replacements.Keys) {
    $text = $text -replace [regex]::Escape($key), $Replacements[$key]
  }
  Set-Content -Path $Path -Value $text -Encoding UTF8 -NoNewline
}

function Init-Repo {
  param([string]$Dir, [string]$Message)
  Push-Location $Dir
  git init -b main
  git add -A
  git commit -m $Message
  Pop-Location
}

Copy-Demo "ai-demo" "secplus-ai-demo"
Copy-Demo "quick-quote"
Copy-Demo "sheet-dash"

$PortDir = Join-Path $Out "$GhUser.github.io"
if (Test-Path $PortDir) { Remove-Item -Recurse -Force $PortDir }
Copy-Item -Recurse (Join-Path $Root "website") $PortDir
foreach ($d in @("ai-demo", "quick-quote", "sheet-dash")) {
  $p = Join-Path $PortDir $d
  if (Test-Path $p) { Remove-Item -Recurse -Force $p }
}
$wf = Join-Path $PortDir ".github/workflows"
New-Item -ItemType Directory -Force -Path $wf | Out-Null
Copy-Item $DeployYml (Join-Path $wf "deploy-pages.yml")
New-Item -ItemType File -Force -Path (Join-Path $PortDir ".nojekyll") | Out-Null
Set-Content -Path (Join-Path $PortDir ".gitignore") -Value "node_modules/`n.DS_Store`n"

$index = Join-Path $PortDir "index.html"
if (Test-Path $index) {
  Patch-File $index @{
    'href="ai-demo/"' = 'href="/secplus-ai-demo/"'
    'src="ai-demo/' = 'src="/secplus-ai-demo/'
    'href="quick-quote/"' = 'href="/quick-quote/"'
    'src="quick-quote/' = 'src="/quick-quote/'
    'href="sheet-dash/"' = 'href="/sheet-dash/"'
    'src="sheet-dash/' = 'src="/sheet-dash/'
    "https://$GhUser.github.io/secplus-sensei/ai-demo/" = "$PagesBase/secplus-ai-demo/"
    "https://$GhUser.github.io/secplus-sensei/quick-quote/" = "$PagesBase/quick-quote/"
    "https://$GhUser.github.io/secplus-sensei/sheet-dash/" = "$PagesBase/sheet-dash/"
    "https://$GhUser.github.io/secplus-sensei/" = "$PagesBase/"
    'github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/ai-demo' = "github.com/$GhUser/secplus-ai-demo/tree/main"
    'github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/quick-quote' = "github.com/$GhUser/quick-quote/tree/main"
    'github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/sheet-dash' = "github.com/$GhUser/sheet-dash/tree/main"
    'src="/secplus-ai-demo/assets/icon.png"' = "src=`"$PagesBase/secplus-ai-demo/assets/icon.png`""
    'src="/quick-quote/assets/icon.svg"' = "src=`"$PagesBase/quick-quote/assets/icon.svg`""
    'src="/sheet-dash/assets/icon.svg"' = "src=`"$PagesBase/sheet-dash/assets/icon.svg`""
    'href="/secplus-ai-demo/"' = "href=`"$PagesBase/secplus-ai-demo/`""
    'href="/quick-quote/"' = "href=`"$PagesBase/quick-quote/`""
    'href="/sheet-dash/"' = "href=`"$PagesBase/sheet-dash/`""
  }
}

$sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>$PagesBase/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>$PagesBase/secplus-ai-demo/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>$PagesBase/quick-quote/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>$PagesBase/sheet-dash/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
"@
Set-Content -Path (Join-Path $PortDir "sitemap.xml") -Value $sitemap -Encoding UTF8
Patch-File (Join-Path $PortDir "robots.txt") @{ '/secplus-sensei/sitemap.xml' = '/sitemap.xml' }
Patch-File (Join-Path $PortDir "README.md") @{ '/secplus-sensei/' = '/' }

function Patch-Demo {
  param([string]$Dir, [string]$Slug, [string]$RepoName)
  $live = "$PagesBase/$Slug/"
  Get-ChildItem $Dir -File | Where-Object { $_.Extension -in '.html', '.md' } | ForEach-Object {
    Patch-File $_.FullName @{
      "https://$GhUser.github.io/secplus-sensei/$Slug/" = $live
      "https://$GhUser.github.io/secplus-sensei/" = "$PagesBase/"
      "github.com/$GhUser/secplus-sensei/tree/main/$RepoName" = "github.com/$GhUser/$Slug/tree/main"
      "github.com/$GhUser/secplus-sensei/tree/main" = "github.com/$GhUser/$Slug/tree/main"
      "cd secplus-sensei/$RepoName" = "cd $Slug"
      "git clone https://github.com/$GhUser/secplus-sensei.git" = "git clone https://github.com/$GhUser/$Slug.git"
      'jacobbarrera2024-sketch.github.io/secplus-sensei/ai-demo/' = "$PagesBase/secplus-ai-demo/"
      'jacobbarrera2024-sketch.github.io/secplus-sensei/quick-quote/' = "$PagesBase/quick-quote/"
      'jacobbarrera2024-sketch.github.io/secplus-sensei/sheet-dash/' = "$PagesBase/sheet-dash/"
      'jacobbarrera2024-sketch.github.io/secplus-sensei/' = "$PagesBase/"
      '/ai-demo/' = '/secplus-ai-demo/'
    }
  }
}

Patch-Demo (Join-Path $Out "secplus-ai-demo") "secplus-ai-demo" "ai-demo"
Patch-Demo (Join-Path $Out "quick-quote") "quick-quote" "quick-quote"
Patch-Demo (Join-Path $Out "sheet-dash") "sheet-dash" "sheet-dash"

Init-Repo (Join-Path $Out "secplus-ai-demo") "Initial commit: SecPlus AI demo (split from monorepo)"
Init-Repo (Join-Path $Out "quick-quote") "Initial commit: QuickQuote (split from monorepo)"
Init-Repo (Join-Path $Out "sheet-dash") "Initial commit: SheetDash (split from monorepo)"
Init-Repo $PortDir "Initial commit: Portfolio site (split from monorepo)"

Write-Host ""
Write-Host "Done. Standalone repos ready in: $Out"
Write-Host "Next: powershell -ExecutionPolicy Bypass -File scripts/push-split-repos.ps1"
