#!/usr/bin/env bash
# Create GitHub repos and push split output. Run AFTER split-into-repos.sh
# Requires: gh auth login (as jacobbarrera2024-sketch)

set -euo pipefail

SPLIT="${1:-../secplus-split}"
GH="jacobbarrera2024-sketch"

if ! command -v gh >/dev/null; then
  echo "Install GitHub CLI: https://cli.github.com/"
  exit 1
fi

push_repo() {
  local name="$1"
  local dir="$SPLIT/$name"
  if [[ ! -d "$dir/.git" ]]; then
    echo "Missing $dir — run scripts/split-into-repos.sh first"
    exit 1
  fi
  echo "=== $name ==="
  if gh repo view "$GH/$name" >/dev/null 2>&1; then
    echo "Repo exists, pushing..."
    cd "$dir"
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/$GH/$name.git"
    git push -u origin main
  else
    gh repo create "$GH/$name" --public --source="$dir" --remote=origin --push
  fi
  echo "Enable Pages: Settings → Pages → GitHub Actions"
  echo ""
}

push_repo "jacobbarrera2024-sketch.github.io"
push_repo "secplus-ai-demo"
push_repo "quick-quote"
push_repo "sheet-dash"

echo "Done. Portfolio: https://$GH.github.io/"
echo "Demos: /secplus-ai-demo/ /quick-quote/ /sheet-dash/"
