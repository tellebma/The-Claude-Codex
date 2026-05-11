# EPIC : Integration Vercel Metrics (Web Analytics + Speed Insights + Observability) — 2026

> Source : demande PO interne, complement aux metriques Matomo existantes
> Date d'ouverture : 2026-05-09
> Date de mise a jour : 2026-05-09 (revision apres audit MCP Vercel : projet deja en prod)
> Effort estime : **22 SP** (11 stories sur 3 sprints, etait 26 SP / 12 stories avant audit)
> Pre-requis : EPIC SEO/GEO Mai 2026 termine
> Priorite : Backlog (post EPIC SEO/GEO)
> Origine : besoin de mesurer la perf reelle terrain (Web Vitals RUM) qui manque a Matomo et qui est aujourd'hui mesuree uniquement en lab via Lighthouse en CI

---

## ⚠️ Revision majeure 2026-05-09 (audit MCP Vercel)

Audit du projet via MCP Vercel revele que **le projet `the-claude-codex` (`prj_owfJ8wzwLBLSDbuGUsZK9kHvh42Q`) est deja en production sur Vercel**, contrairement a l'hypothese initiale "Docker Nginx production". Le domaine `claude-codex.fr` est servi par Vercel (verifie via `curl -I https://claude-codex.fr` qui retourne `server: Vercel` + `x-vercel-cache: HIT`). Auto-deploy GitHub fonctionne (20 deployments READY recents depuis develop).

**Consequences sur le scope** :

- Story **VM-1** : passe de "Creation projet Vercel + import du repo" a "Verification settings projet + activation Analytics/Speed Insights dans UI Vercel". Effort inchange (1 SP).
- Story **VM-2** : **SUPPRIMEE** (3 SP retires du total). Le mecanisme de routage trafic vers Vercel n'est plus a inventer : il existe deja. L'option B "double hosting" decrite plus bas est obsolete.
- Sections "Pre-requis techniques" et "Decision proposee : hosting double" sont conservees a titre historique (montrent le contexte de la decision initiale et l'erreur d'analyse) mais marquees obsoletes.

**Effort total** : 22 SP au lieu de 26 SP. 11 stories au lieu de 12. 3 sprints au lieu de 4.

---

## Contexte

### Pourquoi Vercel en plus de Matomo

Matomo cookieless tourne deja en production (cf. CLAUDE.md, `src/lib/analytics/matomo.ts`). Il couvre tres bien :

- pageview cookieless RGPD-friendly
- scroll depth (25/50/75/100 %)
- clics liens externes
- funnel configurator (start, step, complete)

Trois trous restent dans la couverture mesure :

1. **Pas de Web Vitals reels (RUM)** : aujourd'hui Lighthouse en CI = lab synthetique sur 1 device, 1 reseau. Aucune visibilite sur le LCP / INP / CLS reels mesures sur le terrain (mobile 4G en region, desktop fibre, etc.). Vercel Speed Insights remplit ce trou.
2. **Pas de breakdown demographique (countries, devices, OS, browsers) ni top referrers natif** : Matomo le fait mais l'UI est moins lisible que celle de Vercel Web Analytics.
3. **Pas de logs runtime / edge** : non applicable aujourd'hui (site 100 % SSG sans backend), mais utile a anticiper si des routes dynamiques apparaissent (auth, formulaires de feedback, search backend).

### Complementarite avec Matomo

| Dimension | Matomo (deja) | Vercel (cible) |
|-----------|---------------|----------------|
| Pageview | OK | OK (doublon assume) |
| Scroll depth | OK | Non couvert |
| External links | OK | Non couvert |
| Funnel custom (configurator) | OK | OK (custom events) |
| Demographie (country, device) | OK (UI legere) | OK (UI premium) |
| Web Vitals reels (LCP, INP, CLS, FCP, TTFB) | Non | OK (RUM) |
| Real Experience Score (P75) | Non | OK |
| Logs runtime / edge | Non | OK si hosting Vercel |
| Cout | gratuit (self-hosted) | gratuit Hobby <50k events/mois ou ~10 USD/mois Speed Insights Pro |

L'objectif n'est pas de remplacer Matomo. L'objectif est :

- d'ajouter le RUM Web Vitals (Speed Insights) qui est le vrai trou de mesure
- d'ajouter Web Analytics en mode **read-only complement** (sanity check des chiffres Matomo, vue demographique premium)
- de poser les rails Observability pour le futur (si un jour le site n'est plus 100 % SSG)

### Refonte graphique RG2 : impact

La refonte premium en cours (`feat/refonte-premium-RG2-05`) modifie les composants UI mais ne touche ni au layout principal ni a `app/[locale]/layout.tsx`. L'integration des composants `<Analytics />` et `<SpeedInsights />` se fait dans le root layout, donc independante de la refonte. Aucun blocage.

---

## Pre-requis techniques

### Realite hosting (audit MCP Vercel 2026-05-09)

**Le projet est deja sur Vercel.** L'audit du projet via le MCP Vercel et la verification HTTP du domaine ont confirme :

| Verification | Resultat |
|--------------|----------|
| Projet Vercel `the-claude-codex` | ✅ existe (`prj_owfJ8wzwLBLSDbuGUsZK9kHvh42Q`, team `tellebma`) |
| Framework detecte | ✅ Next.js, Node 24.x, bundler turbopack |
| Auto-deploy GitHub | ✅ branche `develop`, 20 deployments READY recents |
| Domaine custom `claude-codex.fr` | ✅ enregistre dans le projet Vercel |
| Domaine `www.claude-codex.fr` | ✅ enregistre |
| `curl -I https://claude-codex.fr` | ✅ retourne `server: Vercel` + `x-vercel-cache: HIT` (HTTPS, redirect 308 vers `/fr/`) |
| Latest deployment | ✅ READY (commit cloture EPIC RG2 du 2026-05-09) |
| Bundler | ✅ turbopack |

**Conclusion** : Docker Nginx n'est plus utilise en production. Vercel sert le site depuis un certain temps (au moins depuis 2026-04-21 = date de creation du projet). Le `Dockerfile` et `docker-compose.yml` du repo sont conserves pour le dev local et l'option de fallback, mais ne sont plus le hosting de production.

### Section historique (analyse initiale obsolete avant audit)

Conservee pour traçabilite. La decision initiale "option B double hosting" reposait sur l'hypothese erronee "Docker = production". L'audit MCP a leve cette hypothese.

<details>
<summary>Detail des 3 options analysees initialement (cliquer pour deplier)</summary>

#### Option A : migration complete vers Vercel — DEJA REALISEE en pratique

| Pro | Con |
|-----|-----|
| Toutes les metriques Vercel disponibles | Perte du controle Docker (CSP custom, headers Nginx ad-hoc) |
| Build natif `output: 'export'` supporte | Vendor lock-in fort |
| HTTPS + CDN globaux gratuits | Cout potentiel a l'echelle (data transfer Pro) |
| Aliases automatiques | Necessite de migrer le DNS de `claude-codex.fr` (deja fait) |

#### Option B : double hosting Docker + Vercel mirror — OBSOLETE

Reposait sur l'hypothese "Docker en production". Audit MCP confirme que Docker n'est pas en prod. Cette option ne s'applique plus.

#### Option C : abandonner Vercel, rester Matomo + Lighthouse CI + outil RUM tiers — non retenue

Pertinent uniquement si on voulait migrer DEPUIS Vercel vers Docker. Pas le cas.

</details>

### Quoi reste-t-il a faire ?

Vercel sert deja le site, mais les SDK metrics ne sont pas integres :

| Element | Etat actuel | Story EPIC |
|---------|-------------|-----------|
| Package `@vercel/analytics` dans `package.json` | ❌ absent | VM-3 |
| Package `@vercel/speed-insights` dans `package.json` | ❌ absent | VM-5 |
| `<Analytics />` dans `src/app/[locale]/layout.tsx` | ❌ absent | VM-3 |
| `<SpeedInsights />` dans `src/app/[locale]/layout.tsx` | ❌ absent | VM-5 |
| Settings Vercel UI : Web Analytics ON | ❓ a verifier (story VM-1) | VM-1 |
| Settings Vercel UI : Speed Insights ON | ❓ a verifier (story VM-1) | VM-1 |
| Settings Vercel UI : Observability section | ❓ a verifier | VM-9 |

---

## Perimetre

### In scope

- **P1 — Web Analytics** : SDK `@vercel/analytics` + dashboard Vercel + 2 custom events strategiques (configurator complete, search dialog open)
- **P2 — Speed Insights** : SDK `@vercel/speed-insights` + dashboard Web Vitals reels + sample rate configurable
- **P3 — Observability** : activation de la section Observability dans le projet Vercel (gratuit Hobby), monitoring builds + edge requests, prep pour eventuel passage SSR futur
- **P4 — Documentation + cross-check** : `docs/analytics-tracking.md` mis a jour avec mapping Matomo/Vercel, dashboard Notion / Markdown qui croise les chiffres hebdo

### Out of scope

- Migration DNS de production vers Vercel (decision business separee)
- Custom dashboards externes (Grafana, Looker Studio) qui agregent Matomo + Vercel : peut etre traite dans un EPIC ulterieur si besoin pilotage multi-source
- Alerting automatise (Web Vitals regresse > 10 % => slack ping) : reporte a un EPIC "Quality observability" ulterieur
- Replacer Matomo par Vercel : Matomo reste source de verite engagement (scroll, links, configurator)

---

## Metriques cibles

### Web Vitals (uniques a Vercel, vrai gain)

| Metrique | Cible Google | Source actuelle | Source Vercel |
|----------|--------------|-----------------|---------------|
| LCP (Largest Contentful Paint) | <= 2,5 s | Lighthouse CI (lab) | Speed Insights (RUM P75/P90/P95/P99) |
| INP (Interaction to Next Paint) | <= 200 ms | Lighthouse CI (lab) | Speed Insights (RUM) |
| CLS (Cumulative Layout Shift) | <= 0,1 | Lighthouse CI (lab) | Speed Insights (RUM) |
| FCP (First Contentful Paint) | <= 1,8 s | Lighthouse CI (lab) | Speed Insights (RUM) |
| TTFB (Time to First Byte) | <= 800 ms | absent | Speed Insights (RUM) |
| FID (First Input Delay, deprecated) | <= 100 ms | Lighthouse CI (lab) | Speed Insights (RUM, pour memoire) |
| RES (Real Experience Score) | >= 90 (vert) | absent | Speed Insights (composite weighted) |

### Web Analytics (chevauche Matomo, complement UI)

| Metrique | Matomo | Vercel | Decision |
|----------|--------|--------|----------|
| Pageviews totaux | OK | OK | doublon assume, sanity check |
| Top pages | OK | OK | doublon assume |
| Top referrers | OK | OK | UI Vercel plus claire |
| Country breakdown | OK | OK | doublon |
| Device / OS / browser | OK | OK | doublon |
| Scroll depth 25/50/75/100 % | OK | NON | reste Matomo only |
| External link clicks | OK | NON | reste Matomo only |
| Configurator funnel (start, step, complete) | OK | NON | dupliquer cote Vercel via custom event ? cf. VM-5 |
| Search dialog open | NON | NON | nouveau custom event sur les 2 cotes (VM-6) |
| Bounce rate | NON | OK | nouveau, unique a Vercel |
| Custom event flag features | NON | OK | nouveau, requiert Pro Vercel |

### Observability (anticipation, peu de signal aujourd'hui en SSG)

Aujourd'hui le site est 100 % SSG : **aucune Vercel Function, aucun edge middleware, aucun runtime log**. La seule donnee Observability utile en SSG est :

- Edge Requests (compteur de requetes CDN)
- Build diagnostics (duree builds, warnings)
- Fast Data Transfer (bandwidth)

Le but de P3 est moins de collecter de la donnee aujourd'hui que de **valider que la stack est prete** quand le site evoluera (auth interne, formulaires, recherche backend).

---

## Backlog Stories

### Chantier P1 — Web Analytics (5 SP, etait 8 SP)

#### VM-1 : Verification settings projet Vercel + activation Analytics/Speed Insights/Observability (1 SP)

> En tant que **dev infra**, je veux verifier les settings du projet Vercel `the-claude-codex` deja existant et activer Web Analytics, Speed Insights et Observability dans l'UI Vercel, afin que les beacons emis par les SDK aient un dashboard pour les ingerer.

**Contexte** : projet Vercel **deja cree et en production** (cf. section "Pre-requis techniques"). Cette story est purement de la configuration UI, pas du code.

**Criteres d'acceptation** :
- [ ] Settings > Web Analytics : toggle ON, plan Hobby ou Pro (tracer le choix)
- [ ] Settings > Speed Insights : toggle ON, sample rate par defaut 100 % (sera ajuste en VM-6)
- [ ] Settings > Observability : section verifiee (pas d'action particuliere si SSG, mais documenter ce qui est tracke par defaut : Edge Requests, Build diagnostics, Fast Data Transfer)
- [ ] Variables d'env Matomo (`NEXT_PUBLIC_MATOMO_URL` + `NEXT_PUBLIC_MATOMO_SITE_ID`) presentes et identiques entre dev/preview/production : verifier que Matomo continue a tourner cote Vercel (pas de regression)
- [ ] Documenter dans `docs/infra/vercel-setup.md` (nouveau) les toggles actifs avec screenshots, le team Vercel, le projet ID, et le lien vers le dashboard

**Fichiers concernes** :
- aucun changement de code
- `docs/infra/vercel-setup.md` (nouveau)

---

#### VM-2 : ~~Decision hosting + mecanisme routage trafic vers Vercel~~ — SUPPRIMEE

**Story retiree** suite a l'audit MCP du 2026-05-09. Le projet etait deja en production sur Vercel (`claude-codex.fr` servi par Vercel, pas par Docker Nginx). La decision hosting est de fait deja prise (option A "migration complete vers Vercel"). Pas besoin de routage trafic, ni de double hosting.

**Effort retire** : 3 SP (passe de 26 SP total a 22 SP).

---

#### VM-3 : Integration `@vercel/analytics` dans le root layout (2 SP)

> En tant que **visiteur du site sur l'alias Vercel**, je veux que ma visite genere un beacon vers Vercel Web Analytics, afin que le dashboard Vercel reflete le trafic reel.

**Implementation** :
- Installer `@vercel/analytics` (latest, MIT, ~5 KB gzipped)
- Importer `<Analytics />` depuis `@vercel/analytics/next` dans `src/app/[locale]/layout.tsx`
- Activer le `mode="production"` explicite (next-intl + SSG peut avoir des soucis d'auto-detection de NODE_ENV)
- Ajouter `beforeSend` pour redacter les query params sensibles (token, key, secret) si le composant search en passe un jour

**Criteres d'acceptation** :
- [ ] `npm install @vercel/analytics` et package ajoute en dependency (pas devDep)
- [ ] `<Analytics mode="production" />` monte dans le root layout, **sous** le composant Matomo existant
- [ ] Build `npm run build` passe sans warning
- [ ] Apres deploiement sur l'alias Vercel : verification dans browser DevTools Network qu'un beacon part vers `/_vercel/insights/view`
- [ ] Apres 24h : pageviews visibles dans le dashboard Vercel Analytics
- [ ] Doublon Matomo confirme : compteur Matomo pageview du jour ~ compteur Vercel pageview du jour (tolerance +/- 10 %, biais bots)
- [ ] FR et EN testees toutes les deux

**Fichiers concernes** :
- `package.json` (dependency)
- `src/app/[locale]/layout.tsx` (montage du composant)

---

#### VM-4 : 2 custom events strategiques cote Vercel (2 SP)

> En tant que **PO**, je veux dupliquer 2 evenements business critiques cote Vercel (configurator complete + search dialog open) pour valider la fiabilite cross-tool, afin de pouvoir comparer les chiffres Matomo et Vercel sur 1 mois.

**Note** : les custom events Vercel necessitent **Pro plan** (gratuits sur Hobby pour Speed Insights mais pas Web Analytics). Cette story est conditionnee a la decision VM-2 sur le plan choisi. Si Hobby reste : cette story devient "documenter pourquoi on ne fait pas de custom events Vercel sur Hobby" (1 SP).

**Implementation Pro** :
- Ajouter `import { track } from '@vercel/analytics'` dans `src/components/configurator/ConfiguratorWizard.tsx` et `src/components/ui/SearchDialog.tsx`
- Appeler `track('configurator_complete')` et `track('search_open')` en parallele des appels `_paq.push(...)` Matomo existants
- Centraliser dans `src/lib/analytics/vercel.ts` pour eviter la dispersion

**Criteres d'acceptation** :
- [ ] Deux events visibles dans le dashboard Vercel Analytics (onglet Events)
- [ ] Cross-check : Matomo `configurator_complete` count = Vercel `configurator_complete` count (tolerance +/- 10 %)
- [ ] Aucune regression sur Matomo : les events Matomo continuent de partir
- [ ] Module helper `src/lib/analytics/vercel.ts` cree, signature `trackVercel.event(name, properties?)`
- [ ] Type-safe : un type `VercelEvent` enumere les noms valides

**Fichiers concernes** :
- `src/lib/analytics/vercel.ts` (nouveau)
- `src/components/configurator/ConfiguratorWizard.tsx`
- `src/components/ui/SearchDialog.tsx`

---

### Chantier P2 — Speed Insights (10 SP)

#### VM-5 : Integration `@vercel/speed-insights` dans le root layout (3 SP)

> En tant que **dev perf**, je veux collecter les Web Vitals reels (LCP, INP, CLS, FCP, TTFB) sur le trafic reel, afin de detecter les regressions perf qui n'apparaissent pas en lab Lighthouse.

**Implementation** :
- Installer `@vercel/speed-insights` (latest, MIT, ~3 KB gzipped)
- Importer `<SpeedInsights />` depuis `@vercel/speed-insights/next` dans `src/app/[locale]/layout.tsx`
- Configurer `sampleRate={1}` initialement (collecter 100 % des sessions, max 10k data points/mois sur Hobby) puis ajuster
- Activer `route` automatiquement via le wrapper Next.js (pas de config manuelle requise)

**Criteres d'acceptation** :
- [ ] `npm install @vercel/speed-insights` et package ajoute en dependency
- [ ] `<SpeedInsights sampleRate={1} />` monte dans root layout, juste en dessous de `<Analytics />`
- [ ] Build passe sans warning
- [ ] Apres deploiement Vercel : verifier dans DevTools que `/<unique-path>/script.js` est charge dans le `<head>`
- [ ] Apres 7 jours : dashboard Speed Insights Vercel affiche LCP, INP, CLS, FCP, TTFB pour les pages les plus visitees
- [ ] P75 LCP atteint la cible < 2,5 s sur la home FR et EN
- [ ] Score RES > 80 sur la home apres tuning initial

**Fichiers concernes** :
- `package.json`
- `src/app/[locale]/layout.tsx`

---

#### VM-6 : Sample rate configurable + monitoring quota (2 SP)

> En tant que **dev infra**, je veux pouvoir baisser le sample rate Speed Insights si on approche la limite Hobby (10k data points/mois), afin de ne pas casser la collecte au milieu du mois.

**Implementation** :
- Externaliser `sampleRate` en variable d'env `NEXT_PUBLIC_VERCEL_SI_SAMPLE_RATE` (default 1)
- Ajouter un check dans Vercel Spend Management (Pro) ou un rappel manuel hebdo (Hobby) du compteur de data points utilises
- Documenter le calcul de capacite : 6 data points max par visite x 5000 visites/mois = 30k > 10k => sample rate 0,3 minimum sur Hobby

**Criteres d'acceptation** :
- [ ] Variable d'env `NEXT_PUBLIC_VERCEL_SI_SAMPLE_RATE` lue dans le composant `<SpeedInsights>`
- [ ] Documentation dans `docs/analytics-tracking.md` du calcul + recommandation par plan
- [ ] Si Hobby : rappel calendaire mensuel pour verifier le quota
- [ ] Test : passer `sampleRate=0` et verifier que **aucun** beacon Speed Insights ne part (mais Web Analytics continue)

**Fichiers concernes** :
- `src/app/[locale]/layout.tsx` (lecture env)
- `docs/analytics-tracking.md`

---

#### VM-7 : `beforeSend` pour redaction sensitive data (2 SP)

> En tant que **DPO interne**, je veux que les URLs envoyees a Vercel ne contiennent jamais de query params potentiellement sensibles (search terms, tokens, ids), afin de respecter la minimisation des donnees RGPD.

**Implementation** :
- Implementer un helper `redactUrl(url: string): string` qui strippe les query params dans une allowlist stricte (ne garder que `locale`, `category` etc.)
- L'utiliser dans `<Analytics beforeSend={...}>` et `<SpeedInsights beforeSend={...}>` (function ou via global `window.webAnalyticsBeforeSend`)
- Tester avec une URL du configurator qui contient un preset (`/configurator/?preset=mcp`)

**Criteres d'acceptation** :
- [ ] Module `src/lib/analytics/redact.ts` cree
- [ ] Tests unitaires : 5 cas (URL clean, URL avec token, URL avec preset configurator, URL avec hash anchor, URL UTM)
- [ ] Couverture > 90 % sur ce module
- [ ] Verification manuelle : visiter `/configurator/?preset=mcp&token=abc&utm_source=test`, verifier dans DevTools Network que le beacon contient seulement `/configurator/?preset=mcp&utm_source=test` (token strippe, preset et UTM gardes)
- [ ] Documente dans `docs/analytics-tracking.md`

**Fichiers concernes** :
- `src/lib/analytics/redact.ts` (nouveau)
- `src/lib/analytics/redact.test.ts` (nouveau)
- `src/app/[locale]/layout.tsx`
- `docs/analytics-tracking.md`

---

#### VM-8 : Cross-check Web Vitals Lighthouse CI vs Speed Insights (3 SP)

> En tant que **dev perf**, je veux comparer les scores Lighthouse CI (lab) avec les scores Speed Insights (RUM) sur 5 pages cibles, afin de quantifier l'ecart lab/terrain et calibrer les seuils CI.

**Implementation** :
- Exporter manuellement les scores P75 Speed Insights (LCP, INP, CLS, FCP, TTFB) sur 5 pages : `/`, `/getting-started/`, `/mcp/`, `/configurator/`, `/content/security-best-practices/`
- Comparer avec les scores Lighthouse CI du meme deploy
- Documenter l'ecart dans `docs/perf-benchmarks-2026.md`
- Si l'ecart est > 30 % sur une page, ouvrir un ticket d'optim cible (LCP image, font preload, etc.)

**Criteres d'acceptation** :
- [ ] 5 pages mesurees en RUM (>= 100 sessions chacune sur 7 jours minimum)
- [ ] Tableau comparatif Lab vs RUM dans `docs/perf-benchmarks-2026.md`
- [ ] Au moins 2 quick wins identifies (font display swap, image lazy, preconnect, etc.)
- [ ] Plan d'action pour 2026-Q3 si gros ecart

**Fichiers concernes** :
- `docs/perf-benchmarks-2026.md` (nouveau)

---

### Chantier P3 — Observability (4 SP)

#### VM-9 : Activation Observability section + monitoring Edge Requests (1 SP)

> En tant que **dev infra**, je veux activer la section Observability dans le projet Vercel (gratuit Hobby), afin de monitorer les Edge Requests et les Build Diagnostics sans cout additionnel.

**Criteres d'acceptation** :
- [ ] Observability activee dans le dashboard Vercel (clic-bouton, pas de code)
- [ ] Verification : section "Vercel Functions" est vide (normal, on est en SSG pur)
- [ ] Section "Edge Requests" affiche les compteurs apres 24h
- [ ] Section "Build Diagnostics" affiche la duree des builds
- [ ] Capture d'ecran dans `docs/infra/vercel-observability.md` avec interpretation des 3 metriques utiles

**Fichiers concernes** : doc only (`docs/infra/vercel-observability.md`)

---

#### VM-10 : Test resilience build long sur Vercel + alerting (3 SP)

> En tant que **dev infra**, je veux savoir si un build qui depasse les limites Vercel Hobby (45 min, 8 GB RAM) cassera l'integration Vercel mirror, afin d'anticiper le passage Pro si necessaire.

**Implementation** :
- Mesurer la duree du build actuel sur Vercel (vs sur Docker local)
- Si > 10 min : auditer ce qui prend du temps (pre-build script `generate-llms-txt.ts`, MDX compilation, 200+ pages SSG)
- Documenter les seuils de warning dans `docs/infra/vercel-observability.md`
- Si Pro : configurer une alerte spend management a 75 % du budget mensuel

**Criteres d'acceptation** :
- [ ] Duree de build mesuree et documentee
- [ ] Comparaison Docker (CI GitHub Actions) vs Vercel : ecart documente
- [ ] Si > 10 min sur Vercel : 2 quick wins d'optim build identifies (cache, parallelisation MDX)
- [ ] Alerte spend / build duration configuree (Pro) ou rappel manuel (Hobby)

**Fichiers concernes** :
- `docs/infra/vercel-observability.md`

---

### Chantier P4 — Documentation et cross-tool dashboard (4 SP)

#### VM-11 : Doc `analytics-tracking.md` mise a jour avec mapping Matomo/Vercel (2 SP)

> En tant que **nouveau dev qui rejoint le projet**, je veux comprendre quelle metrique est tracee par quel outil et pourquoi, afin de ne pas redupliquer un tracking ou de pleurer un trou de mesure inexistant.

**Implementation** :
- Creer ou mettre a jour `docs/analytics-tracking.md` avec :
  - Section "Sources" : Matomo (cookieless, comportement), Vercel Analytics (demographie, business events), Vercel Speed Insights (Web Vitals RUM), Lighthouse CI (lab perf)
  - Tableau "Quelle metrique va ou" (cf. section "Metriques cibles" de cet EPIC)
  - Schema de flux : visiteur => beacon Matomo + beacon Vercel + Web Vitals beacon
  - Procedure de cross-check hebdo : qui regarde quoi quand

**Criteres d'acceptation** :
- [ ] Doc lisible en 5 min
- [ ] Tableau exhaustif des metriques cross-source
- [ ] Schema de flux (mermaid ou diagramme)
- [ ] Section "FAQ" : pourquoi on duplique pageviews Matomo et Vercel ?
- [ ] Lien depuis le `README.md` et le `CLAUDE.md` projet

**Fichiers concernes** :
- `docs/analytics-tracking.md` (nouveau ou mise a jour)
- `README.md` (lien)
- `CLAUDE.md` (lien dans section Analytics)

---

#### VM-12 : Rapport hebdo cross-tool Matomo + Vercel (2 SP)

> En tant que **PO**, je veux un rapport markdown hebdo qui agrege les metriques cles Matomo et Vercel (top pages, RES, LCP P75, top countries), afin de piloter les decisions perf et SEO sans switcher entre 3 dashboards.

**Implementation** :
- Etendre le script existant qui genere `raw/analytics/{date}/REPORT.md` (cf. `feedback_analytics_weekly_report` dans MEMORY) pour inclure une section "Vercel" avec :
  - Speed Insights : RES, P75 LCP/INP/CLS sur les 5 pages cibles
  - Web Analytics : top 5 pages, top 5 countries, bounce rate
- Si VM-2 retient option B (mirror) : ajouter un disclaimer "donnees Vercel = echantillon canary, pas representatif"
- Exposer les seuils d'alerte : LCP P75 > 3 s = rouge, RES < 80 = rouge

**Criteres d'acceptation** :
- [ ] Script Python ou Node qui appelle l'API Vercel (ou export CSV manuel si pas d'API Hobby) + l'API Matomo
- [ ] Rapport `REPORT.md` enrichi d'une section "## Vercel" structuree
- [ ] Workflow integre au cron hebdo existant
- [ ] Document procedure manuelle de fallback si l'API Vercel echoue
- [ ] Test : un rapport reel genere et commit dans le wiki-brain

**Fichiers concernes** :
- `scripts/weekly-report/fetch-vercel.ts` (nouveau)
- `scripts/weekly-report/build-report.ts` (mise a jour)
- `docs/analytics-tracking.md` (procedure)

---

## Priorisation MoSCoW

> Note : revision 2026-05-09. VM-2 supprimee (3 SP). MUST passe de 8 a 5 SP. Total EPIC : 22 SP / 11 stories.

### MUST HAVE (5 SP, Sprint 1) — Foundation Web Analytics

| ID | Story | SP |
|----|-------|----|
| VM-1 | Verification settings projet + activation Analytics/Speed Insights/Observability | 1 |
| VM-3 | Integration `@vercel/analytics` | 2 |
| VM-11 | Doc `analytics-tracking.md` | 2 |

### SHOULD HAVE (8 SP, Sprint 2) — Speed Insights complet

| ID | Story | SP |
|----|-------|----|
| VM-5 | Integration `@vercel/speed-insights` | 3 |
| VM-6 | Sample rate + monitoring quota | 2 |
| VM-7 | `beforeSend` redaction RGPD | 2 |
| VM-9 | Activation Observability section | 1 |

### COULD HAVE (8 SP, Sprint 3) — Approfondissement

| ID | Story | SP |
|----|-------|----|
| VM-4 | 2 custom events strategiques | 2 |
| VM-8 | Cross-check Lab vs RUM | 3 |
| VM-10 | Test build long + alerting | 3 |

### WON'T HAVE (2 SP, buffer) — Reporting

| ID | Story | SP |
|----|-------|----|
| VM-12 | Rapport hebdo cross-tool | 2 |

(WON'T = pas dans cet EPIC en mode strict, mais ajoute en buffer si les sprints 1-3 ont termine en avance)

---

## Sprint Planning

> Revision 2026-05-09 : VM-2 supprimee, Sprint 1 passe de 8 a 5 SP, total EPIC passe de 4 a 3 sprints + 1 buffer.

### Sprint 1 (3 jours) — Foundation — 5 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| VM-1 | Verification settings + activation Analytics/Speed Insights/Observability dans UI Vercel | 1 | ⬜ |
| VM-3 | `@vercel/analytics` integre | 2 | ⬜ |
| VM-11 | Doc analytics-tracking | 2 | ⬜ |

**Effort** : ~2 jours (config UI + ajout SDK + doc)
**Impact attendu** : premier dashboard Web Analytics rempli sous 7 jours sur le trafic reel claude-codex.fr (Vercel deja en prod)

### Sprint 2 (1 semaine) — Speed Insights — 8 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| VM-5 | `@vercel/speed-insights` integre | 3 | ⬜ |
| VM-6 | Sample rate + quota monitoring | 2 | ⬜ |
| VM-7 | beforeSend redaction RGPD | 2 | ⬜ |
| VM-9 | Observability section ON | 1 | ⬜ |

**Effort** : ~3 jours
**Impact attendu** : Web Vitals reels collectes, premier RES disponible J+7, conformite RGPD validee

### Sprint 3 (1 semaine) — Approfondissement — 8 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| VM-4 | Custom events strategiques | 2 | ⬜ |
| VM-8 | Cross-check Lab vs RUM | 3 | ⬜ |
| VM-10 | Build resilience + alerting | 3 | ⬜ |

**Effort** : ~3-4 jours
**Impact attendu** : confiance cross-tool, plan d'optim perf priorise sur les ecarts reels

### Buffer (0,5 semaine) — Reporting — 2 SP

| ID | Story | SP | Statut |
|----|-------|----|--------|
| VM-12 | Rapport hebdo cross-tool | 2 | ⬜ |

**Effort** : ~1-2 jours
**Impact attendu** : pilotage hebdo unifie, decision PO basee sur 1 seul rapport

---

## Definition of Done

Chaque story est "Done" quand :

- [ ] Code modifie sur une branche `feat/vercel-VM-X`
- [ ] `npm run lint && npm run type-check && npm run test` passent (couverture >= 80 %)
- [ ] Build Docker local OK : `docker build -t claude-code-guide .` reussit, taille image < 50 MB
- [ ] Build Vercel OK : verifier les logs Vercel apres push
- [ ] Validation manuelle Web Analytics + Speed Insights : beacons partent (DevTools Network)
- [ ] Cross-check Matomo : compteurs coherents (+/- 10 % apres 1 semaine)
- [ ] Doc `docs/analytics-tracking.md` mise a jour si la story touche au tracking
- [ ] PR cree sur `develop`, review humaine
- [ ] Cross-validation FR + EN sur les pages touchees
- [ ] Pas de regression Lighthouse CI (score Performance >= 90 sur les pages tests)

---

## KPIs de succes

| KPI | Avant (2026-05-09) | Cible (2026-07-01) |
|-----|-------------------:|-------------------:|
| Pages avec Web Vitals reels collectees | 0 | 50+ pages avec >= 100 sessions |
| Real Experience Score home FR | inconnu | >= 85 (vert) |
| Real Experience Score home EN | inconnu | >= 85 (vert) |
| LCP P75 home (mobile) | inconnu | <= 2,5 s |
| INP P75 home (mobile) | inconnu | <= 200 ms |
| CLS P75 home | inconnu | <= 0,1 |
| Pages avec un ecart Lab vs RUM > 30 % identifie | n/a | toutes documentees, 0 non identifie |
| Custom events Vercel coherents avec Matomo (configurator_complete) | n/a | ecart < 10 % sur 30 jours |
| Quota Speed Insights Hobby utilise (sample 100 %) | n/a | < 8000 / 10000 par mois (~80 %) |
| Doc analytics-tracking.md a jour | non | oui |
| Rapport hebdo cross-tool en place | non | oui (VM-12) |

---

## Risques et mitigations

| Risque | Prob. | Impact | Mitigation |
|--------|-------|--------|------------|
| Quota Speed Insights Hobby (10k/mois) depasse au milieu du mois => collecte coupee | Moyenne | Moyen | VM-6 : sample rate baisse a 0,3 si trafic > 5000 visites/mois. Surveillance hebdo via VM-12 |
| Custom events Vercel necessitent Pro (10 USD/mois minimum + per-event) => budget non valide | Moyenne | Faible | VM-4 conditionnee a la decision plan. Si Hobby : on documente la limite, pas de blocage |
| RGPD : Vercel collecte un hash IP + UA, considere "Privacy-friendly" mais pas explicitement validate par CNIL | Faible | Moyen | VM-7 redaction URL + verifier que `Vercel Privacy Policy` est conforme. Mentionner Vercel dans la page legale du site |
| Hosting Docker reste primaire => le SDK Vercel sur Docker n'envoie a rien, beacons perdus | Haute si option B mal cablee | Moyen | VM-2 trance le routage. Le code SDK n'est ajoute que sur l'alias Vercel ou avec une variable d'env qui le desactive sur Docker |
| Doublon avec Matomo source de confusion pour le PO | Moyenne | Faible | VM-11 doc mapping clair. Communication interne explicite : Matomo = source de verite engagement, Vercel = source de verite perf RUM |
| Build Vercel echoue sur `output: 'export'` + i18n trailingSlash + RSC payloads | Faible | Fort | VM-1 valide tot. Plan B : ajuster `next.config.mjs` pour build hybride si necessaire (tres improbable, output:export est natif Vercel) |
| Cout Vercel grimpe avec succes du site (data transfer Pro) | Faible aujourd'hui | Moyen futur | VM-10 alertes spend management. Reevaluation Q3 si trafic explose |
| Surcharge maintenance pour 2 outils (Matomo + Vercel) | Moyenne | Faible | Si apres 3 mois Vercel n'apporte rien que Matomo n'a deja, decision de couper Vercel et garder uniquement Speed Insights |

---

## Notes pour Sprint Review

- Apres Sprint 1, valider que le dashboard Vercel se remplit. Si pas de data apres 48h => debug avant de continuer Sprint 2
- Apres Sprint 2, premier RES dispo. Comparer aux scores Lighthouse CI : ecart attendu, mais documenter
- Apres Sprint 3, decision Pro vs Hobby tranchee definitivement avec donnees reelles de quota
- Le rapport hebdo (VM-12) sert de base pour la PO weekly. A chaque rapport : checker les 3 KPI rouges (RES, LCP P75, quota)
- Si le projet bascule un jour vers du SSR partiel (auth, formulaire backend) : ouvrir un EPIC suite "Vercel Functions Observability" qui exploitera enfin les sections aujourd'hui vides

---

## Hors-scope explicites

- **Migration DNS production vers Vercel** : decision business, EPIC distinct
- **Custom dashboards Grafana / Looker Studio** : peut interesser plus tard, hors scope
- **Alerting Slack automatise sur regression Web Vitals** : hors scope, possible suite logique
- **Replacement de Matomo par Vercel uniquement** : non, Matomo reste source de verite engagement (scroll, links, configurator)
- **Mesure A/B test perf** : hors scope, outil dedie (Vercel Edge Config + custom flags) si jamais besoin
