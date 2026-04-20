# EPIC : Retention & Harmonisation (Matomo-driven)

> Source : audit Matomo du 2026-04-20 sur claude-codex.fr (idSite=3)
> Periode analysee : mois en cours (28 visites, 86% bounce rate)
> Objectif : passer de 1,2 a 2,5 pages/visite et de 13s a 60s+ de temps moyen

---

## Contexte et constats

### Chiffres mois en cours
- 28 visites uniques, 34 pages vues
- 86% taux de rebond (critique)
- 13s temps moyen sur le site
- 1,2 actions par visite
- 78% du trafic va sur `/en/`, 22% sur `/fr/`

### Sources de trafic
- 64% Google SEO (mots-cles masques)
- 1 visite ChatGPT
- 0 social media
- 9 directs

### Ecarts FR/EN
| Metrique | /fr/ | /en/ |
|----------|------|------|
| Rebond | 60% | 95% |
| Temps moyen | 49s | 1s |
| Actions/visite | 2 | 1 |

### Bugs critiques identifies
1. **Slugs francais dans la version EN** : `/en/content/bonnes-pratiques-securite/`, `/en/content/mythes-claude-code/`, `/en/content/couts-reels-claude-code/`, `/en/mcp/securite-mcp/`
2. **Performance degradee** : `/en/content/bonnes-pratiques-securite/` charge en 6,76s
3. **Page `/en/plugins/best-security/`** : 3 entrees, 100% rebond
4. **Rétention inter-pages quasi nulle** : 1 seule visite sur 22 EN a cliqué vers une 2e page
5. **Aucun trafic social** : dependance 100% SEO

---

## Objectifs mesurables (OKR)

| KPI | Baseline (2026-04) | Cible (2026-05) | Cible (2026-06) |
|-----|---------------------|------------------|------------------|
| Taux de rebond global | 86% | 70% | 55% |
| Pages/visite | 1,2 | 1,8 | 2,5 |
| Temps moyen | 13s | 30s | 60s |
| Rebond /en/ | 95% | 75% | 60% |
| Trafic social mensuel | 0 | 5 visites | 20 visites |
| Pages indexees correctement EN | ~80/84 | 84/84 | 84/84 |

---

## Planification Sprints

| Sprint | Objectif | Duree | SP total |
|--------|----------|-------|----------|
| Sprint 1 | Corrections critiques (slugs EN, perf) | 1 semaine | 10 |
| Sprint 2 | Retention et CTA | 2 semaines | 18 |
| Sprint 3 | Harmonisation UX et analytics | 2 semaines | 16 |
| Sprint 4 | Acquisition et contenu | 3 semaines | 20 |

**Total** : 64 SP sur 8 semaines.

---

## Sprint 1 : Corrections critiques — Priorite P0

> Objectif : eliminer les bugs bloquants pour le SEO et l'UX EN.
> Sortie : tous les slugs EN en anglais, performance < 2s partout.

### MT1 — Renommer les slugs francais dans `/en/`

**En tant que** visiteur anglophone,
**Je veux** voir des URLs en anglais sur la version EN du site,
**Afin de** ne pas douter de la langue du contenu et garder confiance.

**Story Points** : 3

**Acceptance Criteria** :
- [ ] `content/en/bonnes-pratiques-securite.mdx` renomme en `content/en/security-best-practices.mdx`
- [ ] `content/en/mythes-claude-code.mdx` renomme en `content/en/claude-code-myths.mdx`
- [ ] `content/en/couts-reels-claude-code.mdx` renomme en `content/en/real-costs-claude-code.mdx`
- [ ] `content/en/mcp/securite-mcp.mdx` renomme en `content/en/mcp/mcp-security.mdx`
- [ ] Redirections 301 ajoutees dans `nginx.conf` (ancienne URL -> nouvelle URL)
- [ ] `lib/metadata.ts` et `lib/search-index.ts` mis a jour
- [ ] `sitemap.xml` regenere avec les nouvelles URLs
- [ ] Build OK (`npm run build`)
- [ ] Test sur `/en/content/security-best-practices/` : page rendue en anglais

### MT2 — Optimiser la performance de `/en/content/*`

**En tant que** visiteur,
**Je veux** que les pages chargent en moins de 2 secondes,
**Afin de** ne pas quitter le site avant meme l'avoir vu.

**Story Points** : 3

**Acceptance Criteria** :
- [ ] Audit Lighthouse sur les 3 pages `/en/content/*` avant/apres
- [ ] Toutes les images converties en WebP avec `loading="lazy"`
- [ ] Bundle JS de la page MDX inspecte (pas de dependance lourde inutile)
- [ ] Temps de chargement reseau < 1s, LCP < 2s
- [ ] Re-tester avec Matomo apres 48h de trafic

### MT3 — Enrichir `/en/plugins/best-security/` pour casser le 100% bounce

**En tant que** visiteur qui arrive sur cette page via Google,
**Je veux** trouver du contenu actionnable et des liens vers des ressources connexes,
**Afin de** continuer ma navigation sur le site.

**Story Points** : 4

**Acceptance Criteria** :
- [ ] Page relue et enrichie : au minimum 5 plugins detailles avec usage concret
- [ ] Section "Related" en bas avec 3-5 liens internes (skills, MCP, agents securite)
- [ ] CTA visuel "Try the Configurator" integre dans la page
- [ ] TOC visible en latéral sur desktop, sticky
- [ ] Verification que la version `/fr/plugins/best-security/` suit le meme pattern

**Sprint 1 Total** : 3 stories · 10 SP

---

## Sprint 2 : Retention et CTA — Priorite P1

> Objectif : ajouter les mécanismes de rétention inter-pages.
> Sortie : chaque page a un CTA contextuel et une progression visible.

### MT4 — Composant `NextSteps` systematique

**En tant que** visiteur qui finit de lire une page,
**Je veux** voir 3 suggestions contextuelles de lecture suivante,
**Afin de** continuer a explorer le site sans revenir au menu.

**Story Points** : 5

**Acceptance Criteria** :
- [ ] Composant `<NextSteps>` cree dans `components/ui/NextSteps.tsx`
- [ ] Affichage : 3 cartes avec titre, description courte, icone, hover effect
- [ ] Integre dans toutes les pages MDX de `/agents/`, `/mcp/`, `/skills/`, `/prompting/` (FR + EN)
- [ ] Configuration declarative via frontmatter MDX : `nextSteps: [slug1, slug2, slug3]`
- [ ] Fallback automatique : si `nextSteps` absent, proposer 3 pages de la meme section
- [ ] Tracking Matomo : event `click_next_step` avec label = slug cible

### MT5 — TOC sticky visible des mobile

**En tant que** visiteur mobile,
**Je veux** voir la table des matieres des le scroll,
**Afin de** percevoir la profondeur du contenu avant de rebondir.

**Story Points** : 3

**Acceptance Criteria** :
- [ ] TOC accessible sur mobile via bouton flottant en bas a droite
- [ ] Desktop : sticky a droite des scroll > 200px
- [ ] Liens cliquables avec smooth scroll
- [ ] Indicateur visuel de la section en cours
- [ ] Test A11y : navigation clavier OK, aria-label corrects

### MT6 — Barre de progression de lecture

**En tant que** lecteur,
**Je veux** voir ma progression dans l'article,
**Afin de** rester engage et finir la lecture.

**Story Points** : 2

**Acceptance Criteria** :
- [ ] Barre fine (3px) en haut de page, couleur brand-500
- [ ] Progression basee sur scroll position / height totale
- [ ] Performant : pas de layout shift, utiliser `requestAnimationFrame`
- [ ] Active uniquement sur les pages de contenu (pas la home, pas le configurateur)

### MT7 — Promouvoir le configurateur (seule page a 4 actions/visite)

**En tant que** visiteur,
**Je veux** decouvrir le configurateur rapidement,
**Afin d'** utiliser la feature qui a la meilleure retention du site.

**Story Points** : 3

**Acceptance Criteria** :
- [ ] Lien "Configurateur" ajoute dans le header (desktop + mobile)
- [ ] Carte visuelle du configurateur ajoutee en section "Hero" de la home
- [ ] Carte configurateur ajoutee en bas de chaque page overview de section
- [ ] Tracking Matomo : event `click_configurator` avec source (home, header, section)

### MT8 — Newsletter footer

**En tant que** visiteur interesse,
**Je veux** pouvoir m'abonner a une newsletter,
**Afin de** recevoir les nouveautes sans dependre de Google.

**Story Points** : 5

**Acceptance Criteria** :
- [ ] Formulaire email simple en footer (email + bouton)
- [ ] Backend : Brevo ou Buttondown (gratuit jusqu'a 500 abonnes)
- [ ] RGPD : checkbox de consentement, mention politique de confidentialite
- [ ] Page `/fr/newsletter/merci/` et `/en/newsletter/thanks/` apres soumission
- [ ] Tracking Matomo : goal "newsletter_subscribe"

**Sprint 2 Total** : 5 stories · 18 SP

---

## Sprint 3 : Harmonisation et analytics — Priorite P2

> Objectif : harmoniser l'experience et collecter des donnees plus fines.
> Sortie : trackers enrichis, personas rationalisees, hub de parcours.

### MT9 — Enrichir le tracking Matomo

**En tant que** PO du site,
**Je veux** des events detailles dans Matomo,
**Afin de** identifier les points d'abandon et de friction.

**Story Points** : 3

**Acceptance Criteria** :
- [ ] Events de scroll : 25%, 50%, 75%, 100% de lecture
- [ ] Events de clic sur liens externes (Claude, GitHub, npm)
- [ ] Events de clic sur composants interactifs (CodeBlock copy, Configurator step)
- [ ] Plugin Heatmaps & Session Recording active dans Matomo
- [ ] Dashboard Matomo dedie "Retention" configure

### MT10 — Harmoniser les personas

**En tant que** visiteur persona,
**Je veux** un contenu dense et concret,
**Afin de** trouver des reponses specifiques a mon role.

**Story Points** : 5

**Acceptance Criteria** :
- [ ] Audit des 5 personas : `student`, `developer`, `team-lead`, `non-dev`, `freelance`
- [ ] Chaque persona doit avoir au minimum : 3 cas d'usage concrets, 5 outils recommandes, 3 liens vers autres pages du site
- [ ] Si une persona n'a pas ce niveau, la supprimer ou la fusionner (decision PO)
- [ ] Verification sur `/en/personas/student/` qui etait a 100% rebond

### MT11 — Hub de parcours guides

**En tant que** debutant,
**Je veux** un parcours guide etape par etape,
**Afin de** ne pas me perdre dans la masse de documentation.

**Story Points** : 5

**Acceptance Criteria** :
- [ ] Nouvelle section `/fr/parcours/` et `/en/learning-paths/`
- [ ] 3 parcours crees :
  - "Debutant : de zero a ta premiere app" (5 etapes)
  - "Developpeur : maitriser les MCP et agents" (6 etapes)
  - "Expert : automatisations avancees" (5 etapes)
- [ ] Chaque parcours est une page avec timeline visuelle + liens vers les pages existantes
- [ ] Composant `<LearningPath>` reutilisable pour les 3 parcours

### MT12 — OpenGraph images dynamiques

**En tant que** createur de contenu,
**Je veux** que chaque page genere une image sociale unique,
**Afin que** le partage LinkedIn/X/Bluesky ait un rendu professionnel.

**Story Points** : 3

**Acceptance Criteria** :
- [ ] Script `scripts/generate-og-images.ts` qui utilise `@vercel/og` ou `satori`
- [ ] Template : titre de la page + logo Codex + gradient brand
- [ ] Images generees au build dans `public/og/{slug}.png`
- [ ] Meta `og:image` mise a jour par page via `lib/metadata.ts`

**Sprint 3 Total** : 4 stories · 16 SP

---

## Sprint 4 : Acquisition et contenu — Priorite P3

> Objectif : diversifier les sources de trafic.
> Sortie : indexe par les LLMs, 2 articles trending, backlinks.

### MT13 — Fichiers `llms.txt` et `llms-full.txt`

**En tant que** crawler IA (ChatGPT, Claude, Perplexity),
**Je veux** un fichier standard decrivant le site,
**Afin de** citer le site avec precision.

**Story Points** : 2

**Acceptance Criteria** :
- [ ] `/llms.txt` : index structure avec titre, description, liens principaux
- [ ] `/llms-full.txt` : compilation de tout le contenu MDX en markdown
- [ ] Generation automatique via script au build
- [ ] Ajout dans `robots.txt` (Allow)

### MT14 — Publier 2 articles trending

**En tant que** responsable contenu,
**Je veux** publier regulierement des articles d'actualite,
**Afin de** capter du trafic de decouverte.

**Story Points** : 5 (x2 articles)

**Acceptance Criteria** :
- [ ] Article 1 : "Opus 4.7 vs Sonnet 4.6 : quel modele pour Claude Code en 2026 ?"
- [ ] Article 2 : "Les 10 MCP indispensables en 2026"
- [ ] Chaque article : 1500-2000 mots, 3-5 captures d'écran, exemples de code
- [ ] Meta OG optimisees, schema.org Article
- [ ] Partage sur X, LinkedIn, HN (compte utilisateur)

### MT15 — Campagne backlinks

**En tant que** owner du site,
**Je veux** obtenir des backlinks qualifies,
**Afin d'** ameliorer mon autorite SEO.

**Story Points** : 3

**Acceptance Criteria** :
- [ ] Proposition de PR sur `awesome-claude-code` (GitHub)
- [ ] Article invite sur dev.to (reprise d'un contenu du site)
- [ ] Echange avec 3 newsletters francophones tech (Korben, BigPicture, Tech Insider)
- [ ] Suivi Matomo sur 30 jours des nouveaux referents

### MT16 — A/B test du Hero de la homepage

**En tant que** owner du site,
**Je veux** tester 2 variantes du Hero pour maximiser le clic vers le configurateur,
**Afin d'** augmenter la conversion sur la feature-cle.

**Story Points** : 5

**Acceptance Criteria** :
- [ ] Matomo A/B Testing plugin active
- [ ] Variante A : Hero actuel
- [ ] Variante B : Hero avec CTA Configurateur en premier plan
- [ ] Split 50/50, duree 2 semaines
- [ ] Decision : adopter la variante gagnante (CTR > +15%)

**Sprint 4 Total** : 4 stories · 20 SP

---

## Definition of Done (DoD)

Pour chaque story, les criteres suivants sont requis avant de marquer "Fait" :

- [ ] Code commit + push avec message conventionnel (`feat:`, `fix:`, `docs:`)
- [ ] Build Docker local OK : `docker build -t claude-code-guide .`
- [ ] Lint + type-check OK : `npm run lint && npm run type-check`
- [ ] Test manuel sur `/fr/` ET `/en/` (voir CLAUDE.md workflow)
- [ ] `lib/metadata.ts` mis a jour si ajout/modification de page
- [ ] `lib/search-index.ts` mis a jour si ajout/modification de page
- [ ] Frontmatter `dateModified` mis a jour sur les fichiers modifies
- [ ] Sitemap regenere si nouvelle URL
- [ ] Deploy en prod + verification visuelle

---

## Risques et dependances

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Renommer des slugs casse les liens externes existants | Haute | Eleve | Redirections 301 Nginx obligatoires |
| Les backlinks prennent du temps a etre referenees | Moyenne | Moyen | Sprint 4 en parallele, pas bloquant |
| Newsletter Brevo/Buttondown ne convient pas RGPD | Faible | Haut | Utiliser un provider EU : Sarbacane ou Mailjet |
| La page `/en/plugins/best-security/` arrive d'un lien spam | Moyenne | Faible | Analyser les headers referer via access.log Nginx |
| Baisse temporaire du trafic apres renommage | Haute | Moyen | Attendre 2 semaines pour re-evaluation stable |

---

## Metriques de suivi post-deploiement

Matomo rapports a consulter hebdomadairement :
- Taux de rebond par section (`/fr/`, `/en/`, `/agents/`, `/mcp/`, etc.)
- Pages d'entree top 10 avec temps moyen
- Parcours utilisateur (Users Flow)
- Sources referentes (nouveaux domaines en referer)
- Events `click_next_step`, `click_configurator`, `newsletter_subscribe`
- Vitesse des pages (Performance report)

---

## Annexes

### Donnees brutes Matomo (mois en cours)

- Visites uniques : 28
- Pages vues : 34
- Rebond : 86%
- Temps moyen : 13s
- Actions/visite : 1,2
- Desktop : 24 / Smartphone : 4
- Pays top 5 : US (6), FR (5), ES (3), DE (2), NL (2)
- Search engines : Google (18 visites)
- Social : 0
- AI referers : ChatGPT (1)

### Top pages d'entree
1. `/fr/` — 6 visites, 60% rebond, 49s
2. `/en/plugins/best-security/` — 3 visites, 100% rebond
3. `/en/agents/agent-sdk/` — 2 visites, 100% rebond
4. `/en/agents/what-are-agents/` — 2 visites, 100% rebond
5. `/en/content/bonnes-pratiques-securite/` — 2 visites, 100% rebond, 6,76s load
6. `/en/reference/voice-mode/` — 2 visites, 100% rebond

### Points positifs
- `/fr/configurator/` : 0% rebond, 55s, 4 actions
- Infrastructure perf OK (mediane ~1s)
- Site récemment lancé, marge de progression enorme

---

## Review Product Owner (2026-04-20)

### Verdict global

Plan globalement solide sur Sprint 1 et 2. En revanche, les Sprints 3 et 4 sont prematures vu le trafic (28 visites/mois). On cherche a optimiser une conversion qui n'a pas encore de volume. Tant que le rebond EN reste a 95%, harmoniser les personas ou faire un A/B test est du gold-plating. **Recommandation** : compresser le plan a 6 semaines, reporter Sprint 3 post-baseline stable.

Aussi, KPI cibles trop ambitieux : passer de 86% a 55% de rebond en 2 mois avec la meme base de trafic n'est pas realiste sans volume. Proposer plutot : rebond < 70% d'ici juin, pages/visite > 2,0.

### Sprint 1 — P0 — Validé

- MT1 Renommer slugs FR dans /en/ : OK. Bug critique, impact SEO direct. AC clairs et testables. **Ajouter un AC** : verifier dans GSC qu'aucune URL renommee n'est la source actuelle de trafic organique (eviter de tuer du jus SEO).
- MT2 Perf /en/content/* : OK mais **amender l'AC "mediane 1s"** : preciser P75 et P95 LCP, pas seulement la mediane. "Re-tester avec Matomo apres 48h" n'est pas un AC testable au merge, deplacer en metrique post-deploy.
- MT3 Enrichir best-security : OK, 4 SP justifies. **Amender** : d'abord investiguer pourquoi 100% de rebond (requete Google, intention utilisateur) via Search Console avant de re-ecrire a l'aveugle. Ajouter un AC "analyse de la requete Google source".

### Sprint 2 — P1 — Mostly OK, 1 a reporter

- MT4 NextSteps : OK, haute valeur. 5 SP realistes vu la portee (FR+EN, toutes sections, tracking). **Critique** : "Integre dans toutes les pages MDX" est trop large pour une sprint. Decouper en MT4a (composant + 1 section pilote /mcp/) et MT4b (rollout autres sections).
- MT5 TOC mobile : OK, 3 SP. AC clairs.
- MT6 Barre de progression : OK, 2 SP. Feature a faible coût, meme si impact retention modeste.
- MT7 Promouvoir configurateur : OK, prioritaire. Le configurateur est la seule page qui convertit (0% rebond, 4 actions), donc le mettre en avant est le meilleur ROI du plan. Passer MT7 **avant MT4** dans l'ordre d'execution.
- MT8 Newsletter footer : ❌ **Reporter au Sprint 5**. A 28 visites/mois et 0% conversion inbound non-SEO, viser 5 abonnes/mois pour une newsletter ingerable. Cout RGPD + maintenance d'un provider externe non justifie. Reprendre quand on a 200+ visites/mois. Le site est 100% SSG, donc Brevo/Buttondown ajoute une dependance client-side non triviale.

### Sprint 3 — P2 — A revoir en profondeur

- MT9 Tracking Matomo enrichi : ⚠️ **Amender** : garder les events scroll et clics externes (utile pour diagnostiquer le rebond), mais **supprimer Heatmaps & Session Recording**. Avec 28 visites/mois les heatmaps ne sont pas statistiquement exploitables. A reactiver a 300 visites/mois. Reduit la story de 3 a 2 SP.
- MT10 Harmoniser personas : ⚠️ **Amender** : 5 SP trop genereux. Decision binaire : soit les personas apportent du trafic organique (verifier dans GSC), soit on les supprime purement. Ne pas les "harmoniser" s'il n'y a pas de demande. Reformuler en "Audit + decision supprimer/garder" (2 SP).
- MT11 Hub parcours guides : ❌ **Reporter**. Creer 3 parcours avec timeline + composant custom = 5 SP minimum sous-estimes (plutot 8). Avant d'investir, valider que les debutants demandent ca (sondage auprès des 4 visiteurs FR engages, ou via Matomo event sur la home). Besoin non prouve par les donnees.
- MT12 OG images dynamiques : ❌ **Reporter**. 0 trafic social actuellement. Investir dans des OG images alors que personne ne partage, c'est de l'over-engineering. A debloquer quand MT15 (backlinks/social) commence a porter.

### Sprint 4 — P3 — Revoir les priorites

- MT13 llms.txt / llms-full.txt : ✅ **Remonter en P1/Sprint 2**. 2 SP pour se rendre citable par ChatGPT/Perplexity, c'est le meilleur ROI du plan vu qu'on a deja 1 visite ChatGPT en baseline. Action quick-win.
- MT14 Publier 2 articles trending : ✅ OK, remonter a Sprint 2 aussi. Le SEO est la seule source de trafic, donc produire du contenu frais est le plus direct pour augmenter la base. **Amender AC** : fixer un SLA de 2 articles/mois et non 2 one-shot.
- MT15 Campagne backlinks : ✅ OK, mais **amender** : 3 SP pour "echanger avec 3 newsletters" est optimiste (temps de reponse externes incontrolables). Reformuler en "envoyer 5 propositions, suivi mensuel". Ne pas bloquer sur les reponses.
- MT16 A/B test Hero : ❌ **Supprimer**. Avec 28 visites/mois, un split 50/50 donne 14 visites par variante sur 2 semaines : aucune significativite statistique possible (il faut 200+ conversions par variante). Matomo A/B ne sert a rien a cette echelle. Remplacer par un simple changement du Hero base sur l'intuition et mesurer le trend sur 4 semaines.

### 💡 Stories manquantes a ajouter

- **MT17 — GSC / Matomo mots-cles (3 SP, Sprint 1)** : 64% du trafic vient de Google mais les mots-cles sont masques dans Matomo. Brancher Google Search Console et exporter les top queries. Sans ca, on optimise a l'aveugle.
- **MT18 — Page 404 intelligente (2 SP, Sprint 2)** : avec les renommages MT1, anticiper les 404. Proposer une page 404 qui suggere 3 liens pertinents selon l'URL. Double usage : retention + filet de securite des renommages.
- **MT19 — Revue des pages d'entree 100% rebond (3 SP, Sprint 1)** : analyser chacune des 6 pages d'entree top pour comprendre l'intention (query Google, mismatch contenu). Sans ca, MT3 est un pari. Output : liste priorisee des contenus a reecrire.
- **MT20 — CTA final "feedback" sur chaque page (2 SP, Sprint 2)** : mini-widget thumbs up/down avec Matomo event. A 28 visites/mois on a besoin de signal qualitatif direct, pas de heatmaps.

### Ordre d'execution recommande

Sprint 1 (10 SP): MT1, MT2, MT17, MT19. Sprint 2 (15 SP): MT7, MT4a, MT13, MT14 (art 1), MT18, MT20. Sprint 3 (14 SP): MT3, MT4b, MT5, MT6, MT14 (art 2), MT15. Reste en backlog : MT8, MT9, MT10, MT11, MT12, MT16.

**Total resserre** : 39 SP sur 6 semaines, vs 64 SP sur 8 semaines. Gain de focus de 40% sur l'impact reel.

---

## Review Scrum Master (2026-04-20)

Orientation shipping, pas perfection. Le plan est solide sur le fond mais optimiste sur la vélocité et léger sur l'outillage. Voici les points qui piquent.

### 1. Vélocité : 64 SP sur 8 semaines pour un solo dev en parallèle

Non, ce n'est pas réaliste en l'état. Maxime a d'autres projets en cours, et la vélocité historique observée sur `STATUS.md` est de 65 SP livrés sur plusieurs sprints (Best Practices) avec un taux d'achèvement de 94%. Mais ces stories étaient majoritairement du contenu MDX, pas du dev produit (newsletter, A/B test, OG dynamiques). Ici, on a beaucoup plus de complexité technique, donc moins de SP/semaine utiles.

Règle de pouce solo dev temps partagé : compter 3-5 SP utiles par semaine, pas 8. Donc 8 semaines = 24 à 40 SP max. Le plan à 64 SP déborde de 60 à 170%. Recommandation : étaler sur 12-14 semaines, ou couper le Sprint 4 en réserve. Autrement, fin juin sera raté et la démotivation s'installera. La proposition du PO (39 SP sur 6 semaines) est plus saine mais reste tendue : viser **39 SP sur 8 semaines** est plus réaliste.

### 2. Story Points à recalibrer

Stories sous-estimées :
- **MT4 NextSteps à 5 SP** : insuffisant. Composant + intégration sur ~40 pages MDX FR/EN + tracking Matomo + fallback algorithmique = 8 SP minimum. Les passes de contenu sur toutes les pages sont toujours sous-estimées.
- **MT8 Newsletter à 5 SP** : ne couvre pas le setup provider, templates de confirmation, double opt-in, page RGPD, tests. Réaliste : 8 SP (le PO a raison de la reporter).
- **MT11 Learning paths à 5 SP** : 3 parcours de 5-6 étapes + composant custom + 2 langues + SEO + sidebar nav = 8 SP minimum.
- **MT14 2 articles à 5 SP total** : chaque article 1500-2000 mots avec captures + code = 3-5 SP par article. Réaliste : 8 SP total.
- **MT16 A/B test à 5 SP** : avec `output: 'export'` SSG, le split côté client via Matomo demande JS conditionnel + duplication composants. 5 SP OK mais techniquement risqué (voir §3).

Stories sur-estimées :
- **MT6 Progress bar à 2 SP** : correct, voire 1 SP.
- **MT15 Backlinks à 3 SP** : c'est du relationnel, pas du dev. C'est une tâche continue, pas une story. À sortir du backlog sprint et gérer en "ongoing" mensuel.

Total recalibré : ~78-82 SP, pas 64. L'écart budget/réalité atteint +30%.

### 3. Dépendances techniques non listées

- **MT1 → MT4/MT7/MT10** : tout composant qui pointe vers `/en/content/bonnes-pratiques-securite/` devra être mis à jour. Si MT1 n'est pas fait en premier, les `nextSteps` pointeront vers des slugs morts.
- **MT9 tracking → MT4/MT7/MT8/MT16** : toutes les stories avec events Matomo dépendent du setup MT9. À faire en Sprint 1, pas Sprint 3.
- **MT12 OG dynamiques → `output: 'export'`** : `@vercel/og` requiert un runtime Edge/Node, incompatible SSG pur. Il faudra `satori` en script de build. Bloquant si mal anticipé.
- **MT16 A/B test → SSG** : Matomo A/B en mode SSG = JS client uniquement, pas de split serveur. À valider par POC avant commit.
- **MT13 llms-full.txt** : script de build qui lit tout le MDX + génère plusieurs MB. Attention au temps de build Docker.
- **MT1 → MT18 (404 intelligente proposée par le PO)** : dépendance directe. MT18 doit être livré avec MT1, pas après.

### 4. Risques manquants

Le tableau couvre le SEO mais oublie :
- **Risque tech SSG vs features dynamiques** (A/B test, OG dynamiques, newsletter). Proba haute, impact moyen. Mitigation : POC technique d'une demi-journée avant de committer le sprint.
- **Risque hydration i18n** après renommage slugs : chemins en dur dans `search-index.ts` et navigation peuvent casser. Mitigation : grep exhaustif post-renommage + test E2E.
- **Risque burnout solo dev** : 8 semaines en parallèle d'autres projets, sans buffer. Proba haute, impact critique. Mitigation : buffer 30% minimum, réduire le scope.
- **Risque échantillon statistique** : 28 visites/mois ne valident rien (MT16 A/B test, évaluation OKR mensuels). Il faut ~500 visites/variante pour la significativité. Le PO l'a pointé, je confirme.
- **Risque Matomo self-hosted** : session recording consomme beaucoup de stockage. Vérifier la rétention avant MT9.
- **Risque GSC non branché** : sans MT17 (proposé par PO), toutes les stories SEO optimisent à l'aveugle.

### 5. Definition of Done : manques critiques

La DoD actuelle est orientée build + deploy manuel. Il manque :
- **Pas de tests automatisés** (Jest, Vitest, Playwright). Pour un site à 206 pages i18n, minimum 1 smoke test E2E par langue (home + 1 page section).
- **Pas de CI/CD** : build Docker local ne garantit pas la repro. Un GitHub Action `lint + type-check + build` sur PR est le minimum vital. À insérer en Sprint 1 (1 story de 2 SP).
- **Pas d'environnement de staging** : tout test en prod = risqué. Un deploy preview (branche = sous-domaine Docker) ou `staging.claude-codex.fr` suffit.
- **Pas de vérification Matomo post-deploy** : comment confirmer qu'un event se déclenche ? Ajouter "Verifier dans Matomo Debug Tracker" dans la DoD des stories à tracking.
- **Pas de rollback plan** pour les renommages : si MT1 casse le trafic, comment revenir vite ? Documenter un `git revert` + redeploy Docker en < 10 min.
- **Pas de critere de "Ready"** avant de démarrer une story : préciser qu'une story doit avoir ses AC validés par soi-même (self-review) avant de coder.

### 6. Stories à splitter

- **MT4 NextSteps** → (a) composant + tracking (3 SP), (b) intégration FR toutes sections (3 SP), (c) intégration EN (2 SP). Permet de livrer FR en Sprint 2 et EN plus tard. Aligne avec la suggestion PO (MT4a pilote /mcp/, MT4b rollout).
- **MT10 Harmoniser personas** → 1 story par persona (5 stories de 1-2 SP) ou bien la story d'audit/décision proposée par le PO (2 SP). Plus petit = livrable incrémental.
- **MT11 Learning paths** → (a) composant + parcours "Débutant" (5 SP, livrable seul), (b) parcours Dev (3 SP), (c) parcours Expert (3 SP).
- **MT14 Articles** → 1 story par article (MT14a, MT14b). Permet de décaler le 2e si retard.
- **MT9 Tracking** → (a) events critiques (scroll, clics externes, configurateur) 2 SP en Sprint 1, (b) heatmaps/session recording reportés post-baseline (à supprimer si PO d'accord).

### 7. Recommandations process pour un solo dev

- **Pas de daily scrum**, évidemment. Remplace par un kick-off hebdo le lundi (30 min) : relire le backlog, choisir 2-3 stories max pour la semaine, écrire dans `STATUS.md`.
- **Review/Retro : 20 min tous les 15 jours**. Demi-page dans `STATUS.md` : ce qui a shippé, ce qui a bloqué, une amélioration process concrète.
- **WIP limit = 1**. Jamais plus d'une story en cours. Termine avant de démarrer.
- **Shipping cadence** : déploie minimum 1 fois par semaine, même partiel. Matomo a besoin de 2 semaines de data pour évaluer l'impact, plus tu déploies tôt, plus tu mesures tôt.
- **CI minimale dès Sprint 1** (1 story de 2 SP à insérer, non listée actuellement) : GitHub Actions `lint + type-check + build` sur PR. ROI énorme sur les sprints suivants.
- **Time-box les stories** : si une story dépasse son SP x 1.5 en temps réel, stop et split. Ne pas s'acharner.
- **Auto-revue PR** : même solo, ouvrir une PR GitHub et s'auto-reviewer à H+24 avant merge. Détecte 80% des bugs à peu de coût. Respecte la règle "JAMAIS d'attribution Claude" (cf. MEMORY).
- **Sprint 4 = stretch goal**, pas un engagement. Annoncer explicitement dans le plan : "livré si capacité, sinon reporté".
- **Buffer 30%** : dans chaque sprint, réserver 30% du temps pour imprévus (bugs, reviews, doc, meeting). Sans ça, le plan explose dès la 3e semaine.

### TL;DR

Plan solide sur le fond, trop ambitieux sur la vélocité, légèreté critique sur CI/tests/staging. Actions prioritaires :
1. Recalibrer à ~40 SP sur 8 semaines (aligner avec le resserrage du PO mais allonger le calendrier).
2. Ajouter une story CI minimale en Sprint 1 (2 SP).
3. Splitter les 5 stories identifiées (MT4, MT9, MT10, MT11, MT14).
4. Remonter MT9 (tracking) en Sprint 1 car dépendance de 4 autres stories.
5. Retirer MT15 (backlinks) des sprints et gérer en ongoing mensuel.
6. Ajouter rollback plan à la DoD pour toute story impactant les URLs.
