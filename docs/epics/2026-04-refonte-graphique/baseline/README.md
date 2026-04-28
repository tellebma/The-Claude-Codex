# Baseline — Refonte graphique

Capture initiale avant migration vers tokens. Couvre RG-02.

## Contenu

- `hex-audit.txt` : sortie brute du grep des hex/rgba/hsl sur `src/`. Inclut `globals.css` (volontairement, c'est le registre des primitives).
- `README.md` : ce fichier.
- `lighthouse-*.json` : à produire manuellement quand l'environnement local est dispo (cf. plus bas).

## Synthèse hex-audit (2026-04-27)

- **202** occurrences de couleurs codées en dur sur **30** fichiers
- **72** dans `src/app/globals.css` (légitimes — registre central)
- **130** hors globals.css → cible de migration C2/C3/C4

### Top fichiers à migrer

| Fichier | Occurrences | Chantier |
|---|---|---|
| `MermaidDiagram.tsx` | 47 | C5 |
| `TerminalScreenshot.tsx` | 11 | C2/C4 |
| `InteractiveRobotScene.tsx` | 6 | C5 |
| `app/[locale]/future/page.tsx` | 6 | C5 |
| `app/[locale]/{skills,prompting,plugins,mcp,agents,advanced}/page.tsx` | 4 ×6 | C2/C3/C4 |
| `PathCard.tsx`, `McpArchitectureDiagram.tsx`, `BorderBeam.tsx` | 3 ×3 | C4 |

Le total hors `globals.css` chute mécaniquement à mesure que les composants migrent vers les tokens sémantiques C1.

## Script CI

`scripts/check-hardcoded-colors.sh` exit code 1 si des hex sont trouvés hors `globals.css`. Intégrer dans la CI une fois la migration C2+C3+C4 terminée (un seuil progressif peut être posé entre temps).

```bash
./scripts/check-hardcoded-colors.sh           # juste exit code
./scripts/check-hardcoded-colors.sh --report  # regenere baseline/hex-audit.txt
```

## Lighthouse baseline

À capturer en local quand l'environnement est dispo (Chrome + lighthouse CLI). Routes cibles :

- `/fr/`
- `/fr/getting-started/`
- `/fr/mcp/`
- `/fr/prompting/`
- `/fr/configurator/`

```bash
npm run build
npx serve out -l 3000 &
for route in "" "getting-started/" "mcp/" "prompting/" "configurator/"; do
  npx lighthouse "http://localhost:3000/fr/${route}" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json \
    --output-path="docs/epics/2026-04-refonte-graphique/baseline/lighthouse-fr-${route//\//-}.json" \
    --chrome-flags="--headless"
done
```

Action manuelle (l'agent ne peut pas piloter Chrome ici sans environnement Lighthouse installé). À noter : le projet a déjà un Lighthouse CI pipeline via GitHub Actions ; les scores live sont dispo dans les runs CI récents et serviront de référence.
