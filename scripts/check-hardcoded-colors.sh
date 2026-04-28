#!/usr/bin/env bash
#
# RG-02 — Detection des valeurs de couleur codees en dur hors tokens.
#
# Sortie 0 : zero hex/rgba/hsl trouve hors src/app/globals.css.
# Sortie 1 : valeurs detectees, listees sur stdout.
#
# Le seul fichier autorise a contenir des hex est src/app/globals.css :
# c'est le registre central des tokens. Tout autre fichier source doit
# utiliser des classes Tailwind ou des variables CSS semantiques.
#
# Usage :
#   ./scripts/check-hardcoded-colors.sh
#   ./scripts/check-hardcoded-colors.sh --report  # ecrit aussi un rapport txt
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPORT_FILE=""
if [[ "${1:-}" == "--report" ]]; then
  REPORT_FILE="docs/epics/2026-04-refonte-graphique/baseline/hex-audit.txt"
  mkdir -p "$(dirname "$REPORT_FILE")"
fi

PATTERN='(#[0-9a-fA-F]{3,8}\b|rgba?\(|hsl\()'

# Inclure: tsx, ts, jsx, js, css, mdx
# Exclure: node_modules, .next, out, dist, coverage, .git, le fichier autorise (globals.css)
RESULTS=$(grep -rnE "$PATTERN" \
  --include="*.tsx" --include="*.ts" \
  --include="*.jsx" --include="*.js" \
  --include="*.css"  --include="*.mdx" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=out \
  --exclude-dir=dist \
  --exclude-dir=coverage \
  --exclude-dir=.git \
  src/ 2>/dev/null \
  | grep -v "^src/app/globals.css:" || true)

if [[ -n "$REPORT_FILE" ]]; then
  echo "$RESULTS" > "$REPORT_FILE"
  echo "Report ecrit: $REPORT_FILE ($(echo "$RESULTS" | grep -c . || echo 0) entrees)"
fi

if [[ -z "$RESULTS" ]]; then
  echo "OK — aucune couleur codee en dur hors src/app/globals.css"
  exit 0
fi

COUNT=$(echo "$RESULTS" | wc -l)
echo "KO — $COUNT valeur(s) de couleur codee(s) en dur detectee(s) :"
echo "$RESULTS"
exit 1
