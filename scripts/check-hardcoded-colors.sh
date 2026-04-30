#!/usr/bin/env bash
#
# RG-02 / RG-29 — Detection des valeurs de couleur codees en dur hors tokens.
#
# Sortie 0 : zero hex/rgba/hsl trouve hors registre de tokens et exemptions.
# Sortie 1 : valeurs detectees, listees sur stdout.
#
# Fichier de tokens autorise : src/app/globals.css (registre central, @theme).
#
# Fichiers exemptes (cas justifies) :
# - MermaidDiagram.tsx : Mermaid expose une API themeVariables qui exige des
#   hex pour styler les diagrammes (pas d'integration tokens possible).
# - AnimatedBeam.tsx, McpArchitectureDiagram.tsx, NotFoundClient.tsx,
#   InteractiveRobot.tsx : props SVG / radial-gradient qui necessitent
#   des couleurs litterales (alpha integre dans rgba, pas exprimable via
#   var(--color-*) sans color-mix() systematique).
# - PathCard.tsx, BorderBeam.tsx, AnimatedBeam.tsx : gradient SVG ou
#   props default values pour SVG/canvas.
# - InteractiveRobotScene.tsx : Three.js Three Fiber, props color des
#   lights/materials necessitent des hex (API Three).
# - TerminalScreenshot.tsx : commentaires WCAG documentant les contrastes.
# - design-system/page.tsx : showcase visuel des tokens, hex legitimes.
# Ces exemptions sont des cas externes (APIs tierces, SVG inline, doc) ou les
# tokens CSS ne sont pas adressables.
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

# Pattern : detection des hex purs (#xxx, #xxxxxx, #xxxxxxxx) en dehors des
# tokens. Les rgba()/hsl() ne sont pas pris en compte ici car ils sont
# souvent utilises legitimement dans des radial-gradient/linear-gradient
# avec alpha integre (effets visuels) qu'on ne peut pas exprimer simplement
# via var(--color-*) sans color-mix(). On accepte cette zone grise pour
# garder un check zero-tolerance sur les vrais hex hardcoded uniquement.
PATTERN='#[0-9a-fA-F]{3,8}\b'

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
  | grep -v "^src/app/globals.css:" \
  | grep -v "^src/components/ui/MermaidDiagram\.tsx:" \
  | grep -v "^src/components/ui/AnimatedBeam\.tsx:" \
  | grep -v "^src/components/ui/McpArchitectureDiagram\.tsx:" \
  | grep -v "^src/components/ui/InteractiveRobot\.tsx:" \
  | grep -v "^src/components/ui/InteractiveRobotScene\.tsx:" \
  | grep -v "^src/components/ui/PathCard\.tsx:" \
  | grep -v "^src/components/ui/BorderBeam\.tsx:" \
  | grep -v "^src/components/ui/TerminalScreenshot\.tsx:" \
  | grep -v "^src/components/not-found/NotFoundClient\.tsx:" \
  | grep -v "^src/app/\[locale\]/design-system/" \
  || true)

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
