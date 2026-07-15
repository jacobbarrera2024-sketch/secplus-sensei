#!/usr/bin/env bash
# Split secplus-sensei monorepo into standalone repositories.
# Run from repo root: bash scripts/split-into-repos.sh [output-dir]
#
# After this script, create GitHub repos and push (see docs/SPLIT_REPOS.md).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/../secplus-split}"
GH_USER="jacobbarrera2024-sketch"
PAGES_BASE="https://${GH_USER}.github.io"

echo "Source: $ROOT"
echo "Output: $OUT"
mkdir -p "$OUT"

copy_demo() {
  local name="$1"
  local src="$ROOT/$name"
  local dest="$OUT/$name"
  rm -rf "$dest"
  mkdir -p "$dest"
  cp -r "$src/." "$dest/"
  rm -rf "$dest/.github" 2>/dev/null || true
  mkdir -p "$dest/.github/workflows"
  cp "$ROOT/scripts/templates/deploy-pages.yml" "$dest/.github/workflows/deploy-pages.yml"
  touch "$dest/.nojekyll"
  printf '%s\n' 'node_modules/' '.DS_Store' > "$dest/.gitignore"
}

init_repo() {
  local dir="$1"
  local msg="$2"
  cd "$dir"
  git init -b main
  git add -A
  git commit -m "$msg"
  cd - >/dev/null
}

# --- secplus-ai-demo ---
copy_demo "ai-demo"
mv "$OUT/ai-demo" "$OUT/secplus-ai-demo"
DEMO_DIR="$OUT/secplus-ai-demo"
# Rename for clarity; folder name = future repo name

# --- quick-quote ---
copy_demo "quick-quote"

# --- sheet-dash ---
copy_demo "sheet-dash"

# --- portfolio (user pages repo) ---
PORT_DIR="$OUT/${GH_USER}.github.io"
rm -rf "$PORT_DIR"
mkdir -p "$PORT_DIR"
cp -r "$ROOT/website/." "$PORT_DIR/"
# Remove embedded demo copies — each demo is its own repo now
rm -rf "$PORT_DIR/ai-demo" "$PORT_DIR/quick-quote" "$PORT_DIR/sheet-dash"
mkdir -p "$PORT_DIR/.github/workflows"
cp "$ROOT/scripts/templates/deploy-pages.yml" "$PORT_DIR/.github/workflows/deploy-pages.yml"
touch "$PORT_DIR/.nojekyll"
printf '%s\n' 'node_modules/' '.DS_Store' > "$PORT_DIR/.gitignore"

# --- Update portfolio project links to sibling repo paths ---
INDEX="$PORT_DIR/index.html"
if [[ -f "$INDEX" ]]; then
  sed -i \
    -e 's|href="ai-demo/"|href="/secplus-ai-demo/"|g' \
    -e 's|src="ai-demo/|src="/secplus-ai-demo/|g' \
    -e 's|href="quick-quote/"|href="/quick-quote/"|g' \
    -e 's|src="quick-quote/|src="/quick-quote/|g' \
    -e 's|href="sheet-dash/"|href="/sheet-dash/"|g' \
    -e 's|src="sheet-dash/|src="/sheet-dash/|g' \
    "$INDEX"
  sed -i "s|https://${GH_USER}.github.io/secplus-sensei/|${PAGES_BASE}/|g" "$INDEX"
  sed -i "s|https://${GH_USER}.github.io/secplus-sensei/ai-demo/|${PAGES_BASE}/secplus-ai-demo/|g" "$INDEX"
  sed -i "s|https://${GH_USER}.github.io/secplus-sensei/quick-quote/|${PAGES_BASE}/quick-quote/|g" "$INDEX"
  sed -i "s|https://${GH_USER}.github.io/secplus-sensei/sheet-dash/|${PAGES_BASE}/sheet-dash/|g" "$INDEX"
fi

# Update sitemap for root portfolio
SITEMAP="$PORT_DIR/sitemap.xml"
if [[ -f "$SITEMAP" ]]; then
  cat > "$SITEMAP" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${PAGES_BASE}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${PAGES_BASE}/secplus-ai-demo/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${PAGES_BASE}/quick-quote/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${PAGES_BASE}/sheet-dash/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
EOF
fi

# --- Patch demo cross-links and canonical URLs in each repo ---
patch_demo_urls() {
  local dir="$1"
  local slug="$2"
  local repo_name="$3"
  local live="${PAGES_BASE}/${slug}/"
  find "$dir" -maxdepth 1 \( -name '*.html' -o -name '*.md' \) | while read -r f; do
    sed -i \
      -e "s|https://${GH_USER}.github.io/secplus-sensei/${slug}/|${live}|g" \
      -e "s|https://${GH_USER}.github.io/secplus-sensei/|${PAGES_BASE}/|g" \
      -e "s|github.com/${GH_USER}/secplus-sensei/tree/main/${repo_name}|github.com/${GH_USER}/${slug}/tree/main|g" \
      -e "s|github.com/${GH_USER}/secplus-sensei/tree/main|github.com/${GH_USER}/${slug}/tree/main|g" \
      -e "s|cd secplus-sensei/${repo_name}|cd ${slug}|g" \
      -e "s|git clone https://github.com/${GH_USER}/secplus-sensei.git|git clone https://github.com/${GH_USER}/${slug}.git|g" \
      "$f" 2>/dev/null || true
  done
  if [[ -f "$dir/index.html" ]]; then
    sed -i \
      -e "s|jacobbarrera2024-sketch.github.io/secplus-sensei/ai-demo/|${PAGES_BASE}/secplus-ai-demo/|g" \
      -e "s|jacobbarrera2024-sketch.github.io/secplus-sensei/quick-quote/|${PAGES_BASE}/quick-quote/|g" \
      -e "s|jacobbarrera2024-sketch.github.io/secplus-sensei/sheet-dash/|${PAGES_BASE}/sheet-dash/|g" \
      -e "s|jacobbarrera2024-sketch.github.io/secplus-sensei/|${PAGES_BASE}/|g" \
      -e "s|/ai-demo/|/secplus-ai-demo/|g" \
      "$dir/index.html"
  fi
}

patch_demo_urls "$OUT/secplus-ai-demo" "secplus-ai-demo" "ai-demo"
patch_demo_urls "$OUT/quick-quote" "quick-quote" "quick-quote"
patch_demo_urls "$OUT/sheet-dash" "sheet-dash" "sheet-dash"

# Fix portfolio source + meta links
if [[ -f "$PORT_DIR/index.html" ]]; then
  sed -i \
    -e "s|github.com/${GH_USER}/secplus-sensei/tree/main/ai-demo|github.com/${GH_USER}/secplus-ai-demo/tree/main|g" \
    -e "s|github.com/${GH_USER}/secplus-sensei/tree/main/quick-quote|github.com/${GH_USER}/quick-quote/tree/main|g" \
    -e "s|github.com/${GH_USER}/secplus-sensei/tree/main/sheet-dash|github.com/${GH_USER}/sheet-dash/tree/main|g" \
    "$PORT_DIR/index.html"
fi
if [[ -f "$PORT_DIR/robots.txt" ]]; then
  sed -i "s|/secplus-sensei/sitemap.xml|/sitemap.xml|g" "$PORT_DIR/robots.txt"
fi
if [[ -f "$PORT_DIR/README.md" ]]; then
  sed -i "s|/secplus-sensei/|/|g" "$PORT_DIR/README.md"
fi

# Portfolio thumb images — absolute URLs after split deploy
if [[ -f "$PORT_DIR/index.html" ]]; then
  sed -i "s|src=\"/secplus-ai-demo/assets/icon.png\"|src=\"${PAGES_BASE}/secplus-ai-demo/assets/icon.png\"|g" "$PORT_DIR/index.html"
  sed -i "s|src=\"/quick-quote/assets/icon.svg\"|src=\"${PAGES_BASE}/quick-quote/assets/icon.svg\"|g" "$PORT_DIR/index.html"
  sed -i "s|src=\"/sheet-dash/assets/icon.svg\"|src=\"${PAGES_BASE}/sheet-dash/assets/icon.svg\"|g" "$PORT_DIR/index.html"
  sed -i "s|href=\"/secplus-ai-demo/\"|href=\"${PAGES_BASE}/secplus-ai-demo/\"|g" "$PORT_DIR/index.html"
  sed -i "s|href=\"/quick-quote/\"|href=\"${PAGES_BASE}/quick-quote/\"|g" "$PORT_DIR/index.html"
  sed -i "s|href=\"/sheet-dash/\"|href=\"${PAGES_BASE}/sheet-dash/\"|g" "$PORT_DIR/index.html"
fi

# --- Init git repos ---
init_repo "$OUT/secplus-ai-demo" "Initial commit: SecPlus AI demo (split from monorepo)"
init_repo "$OUT/quick-quote" "Initial commit: QuickQuote (split from monorepo)"
init_repo "$OUT/sheet-dash" "Initial commit: SheetDash (split from monorepo)"
init_repo "$PORT_DIR" "Initial commit: Portfolio site (split from monorepo)"

echo ""
echo "Done. Standalone repos ready in: $OUT"
echo "  secplus-ai-demo/"
echo "  quick-quote/"
echo "  sheet-dash/"
echo "  ${GH_USER}.github.io/  (portfolio — deploys to ${PAGES_BASE}/)"
echo ""
echo "Next: see docs/SPLIT_REPOS.md for gh repo create + git push commands."
