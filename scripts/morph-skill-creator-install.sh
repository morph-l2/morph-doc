#!/usr/bin/env bash
# Shallow-install anthropics/skill-creator into vendor/skill-creator (gitignored).
# Upstream: https://github.com/anthropics/skills/tree/main/skills/skill-creator
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${ROOT}/vendor/skill-creator"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Cloning anthropics/skills (sparse: skills/skill-creator) …"
git clone --depth 1 --filter=blob:none --sparse https://github.com/anthropics/skills.git "$TMP/repo"
(
  cd "$TMP/repo"
  git sparse-checkout set skills/skill-creator
)

rm -rf "$DEST"
mkdir -p "$(dirname "$DEST")"
cp -R "$TMP/repo/skills/skill-creator" "$DEST"

VENV="${ROOT}/.local/skill-creator-venv"
echo "Creating skill-creator Python venv (PyYAML for quick_validate.py) …"
python3 -m venv "$VENV"
"${VENV}/bin/python3" -m pip install -q -r "${ROOT}/scripts/skill-creator-requirements.txt"

echo "Installed skill-creator at: $DEST"
echo "Export: export MORPH_SKILL_CREATOR_ROOT=\"$DEST\""
