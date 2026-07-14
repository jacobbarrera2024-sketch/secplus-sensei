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
  # $Replacements MUST be an ordered collection (array of @{Find=;Replace=} or
  # [ordered]@{}), never a plain @{} hashtable — plain hashtables do not
  # preserve key order in PowerShell, which previously caused generic
  # patterns (e.g. bare domain without "https://") to run before more
  # specific ones and corrupt output (e.g. "https://https://...").
  param([string]$Path, $Replacements)
  if (-not (Test-Path $Path)) { return }
  $text = Get-Content $Path -Raw -Encoding UTF8
  if ($Replacements -is [System.Collections.Specialized.OrderedDictionary]) {
    foreach ($key in $Replacements.Keys) {
      $text = $text -replace [regex]::Escape($key), $Replacements[$key]
    }
  } else {
    foreach ($pair in $Replacements) {
      $text = $text -replace [regex]::Escape($pair.Find), $pair.Replace
    }
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
  # Order matters: full absolute-URL rewrites (longest/most specific) must
  # run before the shorter relative-href rewrites so nothing gets patched
  # twice or left half-converted.
  Patch-File $index @(
    @{ Find = 'github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/ai-demo'; Replace = "github.com/$GhUser/secplus-ai-demo/tree/main" }
    @{ Find = 'github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/quick-quote'; Replace = "github.com/$GhUser/quick-quote/tree/main" }
    @{ Find = 'github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/sheet-dash'; Replace = "github.com/$GhUser/sheet-dash/tree/main" }
    @{ Find = "https://$GhUser.github.io/secplus-sensei/ai-demo/"; Replace = "$PagesBase/secplus-ai-demo/" }
    @{ Find = "https://$GhUser.github.io/secplus-sensei/quick-quote/"; Replace = "$PagesBase/quick-quote/" }
    @{ Find = "https://$GhUser.github.io/secplus-sensei/sheet-dash/"; Replace = "$PagesBase/sheet-dash/" }
    @{ Find = "https://$GhUser.github.io/secplus-sensei/"; Replace = "$PagesBase/" }
    @{ Find = 'href="ai-demo/"'; Replace = "href=`"$PagesBase/secplus-ai-demo/`"" }
    @{ Find = 'src="ai-demo/'; Replace = "src=`"$PagesBase/secplus-ai-demo/" }
    @{ Find = 'href="quick-quote/"'; Replace = "href=`"$PagesBase/quick-quote/`"" }
    @{ Find = 'src="quick-quote/'; Replace = "src=`"$PagesBase/quick-quote/" }
    @{ Find = 'href="sheet-dash/"'; Replace = "href=`"$PagesBase/sheet-dash/`"" }
    @{ Find = 'src="sheet-dash/'; Replace = "src=`"$PagesBase/sheet-dash/" }
  )
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
Patch-File (Join-Path $PortDir "robots.txt") @(@{ Find = '/secplus-sensei/sitemap.xml'; Replace = '/sitemap.xml' })
Patch-File (Join-Path $PortDir "README.md") @(@{ Find = '/secplus-sensei/'; Replace = '/' })

function Patch-Demo {
  param([string]$Dir, [string]$Slug, [string]$RepoName)
  $live = "$PagesBase/$Slug/"
  # Order matters: specific repo/slug-tagged patterns must run before the
  # generic "secplus-sensei/tree/main" / "secplus-sensei/" catch-alls, or
  # the catch-all will fire first and leave a stray trailing path segment
  # (e.g. ".../quick-quote/tree/main/quick-quote") or a doubled protocol
  # (e.g. "https://https://...").
  Get-ChildItem $Dir -File | Where-Object { $_.Extension -in '.html', '.md' } | ForEach-Object {
    Patch-File $_.FullName @(
      @{ Find = "github.com/$GhUser/secplus-sensei/tree/main/$RepoName"; Replace = "github.com/$GhUser/$Slug/tree/main" }
      @{ Find = "https://$GhUser.github.io/secplus-sensei/$Slug/"; Replace = $live }
      @{ Find = "https://$GhUser.github.io/secplus-sensei/ai-demo/"; Replace = "$PagesBase/secplus-ai-demo/" }
      @{ Find = "https://$GhUser.github.io/secplus-sensei/quick-quote/"; Replace = "$PagesBase/quick-quote/" }
      @{ Find = "https://$GhUser.github.io/secplus-sensei/sheet-dash/"; Replace = "$PagesBase/sheet-dash/" }
      @{ Find = "https://$GhUser.github.io/secplus-sensei/"; Replace = "$PagesBase/" }
      @{ Find = "github.com/$GhUser/secplus-sensei/tree/main"; Replace = "github.com/$GhUser/$Slug/tree/main" }
      @{ Find = "cd secplus-sensei/$RepoName"; Replace = "cd $Slug" }
      @{ Find = "git clone https://github.com/$GhUser/secplus-sensei.git"; Replace = "git clone https://github.com/$GhUser/$Slug.git" }
    )
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
