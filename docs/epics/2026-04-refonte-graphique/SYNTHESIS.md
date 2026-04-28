# Synthèse design (C0) — Refonte graphique Claude Codex

**Source** : handoff Claude Design `Redisgn Claude Codex-handoff.tar.gz` (livré 2026-04-26)
**Statut** : direction visuelle validée par l'utilisateur ("j'adore" x3 dans le chat)
**Document destiné aux agents DEV** pour exécution C1 → C5

---

## 1. Direction visuelle retenue

Continuité forte avec l'identité actuelle, pas une rupture : **mêmes paliers Tailwind brand (cyan) + accent (ambre)**, **mêmes fonts Plus Jakarta + JetBrains Mono**, **mêmes principes glass + glow**. La refonte est une **mise au carré et amplification** : tokens sémantiques systématiques, hiérarchie typo durcie, atmosphère plus premium en dark, composants éditoriaux nouveaux pour les articles.

**Ambiance** : éditorial premium, type Vercel × Linear × Stripe, avec une signature plus chaude grâce au gradient cyan→ambre. Hero split (texte + terminal animé) par défaut.

**Décisions validées par l'utilisateur dans le chat** :
- Hero variant retenue : **split** (texte gauche + terminal animé droite)
- Mise en page articles : **À la une + 2 petits**
- Dark mode : version approfondie dédiée (`#060912` plutôt que `#020617`), avec starfield et glows renforcés
- Accent par défaut : **cyan** (alternative ambre disponible)
- Article : layout 3 colonnes (share rail / body 720px / TOC sticky), hero éditorial avec pill catégorie pulsant, reading progress bar fine

---

## 2. Tokens à formaliser dans `src/app/globals.css`

### 2.1 Tier 1 — Primitives (déjà en place, à conserver tel quel)

Palettes brand 50→950, accent 50→950, slate 50→950, fonts. Pas de changement.

### 2.2 Tier 2 — Sémantiques applicatifs

À placer dans `:root` (light) et override dans `.dark` :

```css
:root {
  /* Foreground / background */
  --bg-page:        #ffffff;
  --bg-subtle:      #f8fafc;   /* slate-50 */
  --bg-elevated:    #ffffff;
  --fg-primary:     #0f172a;   /* slate-900 */
  --fg-secondary:   #475569;   /* slate-600 */
  --fg-muted:       #64748b;   /* slate-500 */
  --fg-on-brand:    #ffffff;
  --border-default: #e2e8f0;   /* slate-200 */
  --border-strong:  #cbd5e1;   /* slate-300 */

  /* Surfaces (for cards, modals) */
  --surface-card:        rgba(255,255,255,1);
  --surface-card-hover:  rgba(248,250,252,1);
  --surface-elevated:    rgba(255,255,255,1);

  /* Sémantiques */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error:   #ef4444;
  --color-info:    #06b6d4;
}

.dark {
  --bg-page:        #060912;   /* plus profond que #020617 */
  --bg-subtle:      #0a0e1a;
  --bg-elevated:    rgba(15,23,42,0.9);
  --fg-primary:     #f8fafc;   /* pas blanc pur, slate-50 */
  --fg-secondary:   #cbd5e1;   /* slate-300 */
  --fg-muted:       #94a3b8;   /* slate-400 */
  --border-default: rgba(51,65,85,0.5);
  --border-strong:  rgba(51,65,85,0.8);

  --surface-card:        rgba(15,23,42,0.7);   /* gradient appliqué via classe */
  --surface-card-hover:  rgba(15,23,42,0.85);
  --surface-elevated:    rgba(8,12,22,0.9);

  --color-success: #4ade80;
  --color-warning: #fbbf24;
  --color-error:   #f87171;
  --color-info:    #22d3ee;
}
```

### 2.3 Tier 3 — Tokens composants (atmosphère hero, terminal, gradients)

```css
:root {
  /* Gradients signature */
  --gradient-brand:        linear-gradient(135deg, #06b6d4, #0891b2, #f59e0b);
  --gradient-brand-text:   linear-gradient(135deg, #06b6d4, #22d3ee, #f59e0b, #06b6d4);
  --gradient-card:         linear-gradient(135deg, rgba(6,182,212,0.10), rgba(245,158,11,0.05));

  /* Hero light */
  --hero-bg-light:
    radial-gradient(ellipse 55% 45% at 15% 0%,  rgba(6,182,212,0.22), transparent 60%),
    radial-gradient(ellipse 45% 55% at 90% 20%, rgba(245,158,11,0.16), transparent 60%),
    radial-gradient(ellipse 40% 40% at 50% 90%, rgba(124,58,237,0.10), transparent 60%),
    linear-gradient(180deg, #fbfdff 0%, #ffffff 70%);
  --hero-grid-line: rgba(15,23,42,0.055);
  --hero-grid-size: 56px;

  /* Hero pill (badge) */
  --hero-badge-border: rgba(6,182,212,0.25);
  --hero-badge-bg:     rgba(6,182,212,0.08);
  --hero-badge-text:   #0e7490;   /* brand-700 */

  /* Terminal */
  --terminal-bg:     rgba(15,23,42,0.96);
  --terminal-border: rgba(203,213,225,0.5);
  --terminal-glow:
    0 0 100px -20px rgba(6,182,212,0.45),
    0 40px 80px -30px rgba(15,23,42,0.35),
    0 0 0 1px rgba(51,65,85,0.3);

  /* Shadows */
  --shadow-xs:  0 1px 2px 0 rgba(15,23,42,0.04);
  --shadow-sm:  0 1px 3px 0 rgba(15,23,42,0.06), 0 1px 2px -1px rgba(15,23,42,0.05);
  --shadow-md:  0 6px 14px -4px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.05);
  --shadow-lg:  0 12px 28px -10px rgba(15,23,42,0.12), 0 8px 10px -6px rgba(15,23,42,0.06);
  --shadow-xl:  0 24px 48px -16px rgba(15,23,42,0.18);
  --shadow-2xl: 0 35px 60px -15px rgba(15,23,42,0.30);
  --glow-brand: 0 0 60px -12px rgba(6,182,212,0.25);
  --glow-amber: 0 0 60px -12px rgba(245,158,11,0.20);
}

.dark {
  --hero-bg-light:
    radial-gradient(ellipse 55% 45% at 12% -5%,  rgba(34,211,238,0.28), transparent 60%),
    radial-gradient(ellipse 50% 60% at 92% 18%,  rgba(245,158,11,0.18), transparent 60%),
    radial-gradient(ellipse 45% 50% at 50% 110%, rgba(124,58,237,0.18), transparent 60%),
    linear-gradient(180deg, #060912 0%, #0a0e1a 60%, #060912 100%);
  --hero-grid-line: rgba(34,211,238,0.08);

  --hero-badge-border: rgba(34,211,238,0.25);
  --hero-badge-bg:     rgba(34,211,238,0.10);
  --hero-badge-text:   #67e8f9;   /* brand-300 */

  --terminal-bg:     rgba(8,12,22,0.95);
  --terminal-border: rgba(34,211,238,0.15);
  --terminal-glow:
    0 0 120px -24px rgba(34,211,238,0.55),
    0 60px 100px -40px rgba(0,0,0,0.7),
    0 0 0 1px rgba(51,65,85,0.4);
}
```

### 2.4 Radii

```
--radius-xs:   4px
--radius-sm:   6px
--radius-md:   8px
--radius-lg:   12px
--radius-xl:   16px
--radius-2xl:  20px       /* cards principales */
--radius-full: 9999px     /* pills, avatars, dots */
```

Mapping :
- Badges et chips → `--radius-full`
- Inputs et boutons standards → `--radius-lg` (12px)
- Cards (Feature, Path, Audience, Article) → `--radius-2xl` (20px)
- CodeBlock, Callout, FAQ items, terminal → `14-16px` (radius-xl)
- Dots, avatars → `--radius-full`

### 2.5 Spacings

Reprise stricte de Tailwind :
```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

Conventions issues du CSS livré :
- Padding card : `--space-6` à `--space-8` (24-32px)
- Padding hero : `72-80px` vertical, `32px` horizontal
- Padding section : `96px 32px` (clamp possible)
- Espacement entre sections : `--space-12` mobile, `--space-20+` desktop
- Gap grille 3 colonnes : `--space-5` à `--space-6` (20-24px)
- Gap card item : `--space-3` (12px)

### 2.6 Échelle typographique

```css
--text-xs:   12px
--text-sm:   14px
--text-base: 16px
--text-lg:   18px
--text-xl:   20px
--text-2xl:  24px
--text-3xl:  30px
--text-4xl:  36px
--text-5xl:  48px
--text-6xl:  60px
--text-7xl:  72px

--leading-tight:   1.15
--leading-snug:    1.3
--leading-normal:  1.5
--leading-relaxed: 1.65

--tracking-tight:  -0.02em
--tracking-tighter:-0.025em
--tracking-tightest:-0.03em
--tracking-normal: 0
--tracking-wide:   0.05em
--tracking-wider:  0.08em

--weight-regular:  400
--weight-medium:   500
--weight-semibold: 600
--weight-bold:     700
--weight-extrabold:800
```

**Rôles sémantiques** (à exposer comme classes utilities ou via composants `MdxComponents.tsx`) :

| Rôle | Taille (clamp) | Weight | Line-height | Tracking | Couleur |
|---|---|---|---|---|---|
| `cc-display-1` (hero landing) | `clamp(44px, 5.4vw, 76px)` | 800 | 1.02 | `-0.03em` | `--fg-primary` |
| `cc-display-2` (CTA final) | `clamp(40px, 5vw, 64px)` | 800 | 1.05 | `-0.03em` | `--fg-primary` |
| `cc-h1` (page title doc) | `clamp(36px, 5vw, 60px)` | 800 | 1.05 | `-0.03em` | `--fg-primary` |
| `cc-h1-doc` (article doc body title 44px) | `44px` fixe | 800 | 1.1 | `-0.025em` | `--fg-primary` |
| `cc-h2` (section title) | `clamp(30px, 4vw, 42px)` | 700 | 1.15 | `-0.02em` | `--fg-primary` |
| `cc-h2-article` (h2 dans body article) | `32px` | 700 | 1.2 | `-0.02em` | `--fg-primary` |
| `cc-h2-doc` (h2 dans doc shell) | `26px` | 700 | 1.2 | `-0.02em` | `--fg-primary` |
| `cc-h3` (sous-section) | `22px` | 700 | 1.3 | `-0.015em` | `--fg-primary` |
| `cc-h4` | `17-18px` | 600 | 1.4 | `0` | `--fg-primary` |
| `cc-lead` (intro paragraphe) | `19-21px` | 400 | 1.55-1.6 | `0` | `--fg-secondary` |
| `cc-body` (paragraphe doc/article) | `16-17px` | 400 | 1.7-1.75 | `0` | `--fg-primary` |
| `cc-body-sm` (sidebar, descriptions card) | `14-15px` | 400 | 1.55-1.65 | `0` | `--fg-secondary` |
| `cc-caption` (meta dates, kbd, badges) | `11-13px` | 500-600 | 1.4-1.5 | `0-0.05em` | `--fg-muted` |
| `cc-eyebrow` (overline section) | `11-12px` | 600 | 1.4 | `0.08em` UPPERCASE | `--brand-700` (light) / `--brand-300` (dark) |
| `cc-mono` (code inline + meta mono) | `0.88-0.9em` | 500 | 1.55 | `0` | varie |

### 2.7 Animations et motion

```css
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);
--duration-instant: 80ms;
--duration-fast:    150ms;
--duration-base:    300ms;
--duration-slow:    500ms;
--duration-slower:  700ms;
```

**Keyframes signature à conserver** :
- `cc-gradient-shimmer` : 4s ease-in-out infinite (pour `.text-gradient`)
- `lp-grid-fade` : 9s ease-in-out infinite (grille hero qui respire)
- `lp-pulse` : 1.6s ease-in-out infinite (dots pulsants : "live", catégories d'article)
- `lp-blink` : 1s step-end infinite (curseur terminal)
- `lp-float` : 7s ease-in-out infinite (chips qui flottent autour du terminal)
- `lp-ticker` : 32s linear infinite (ticker hero variante XXL)
- `cc-bounce` : 2s infinite (scroll indicator)

**Règle a11y** : toutes ces animations DOIVENT être désactivées sous `@media (prefers-reduced-motion: reduce)`.

---

## 3. Composants nouveaux ou redessinés (par chantier)

### C2 — Layout & navigation

**Header (`cc-header`)**
- Sticky top-0, z-50, max-width 1280, padding `14px 32px`, gap 32px
- `backdrop-filter: blur(12px)` + bg `rgba(255,255,255,0.78)` (light) / `rgba(6,9,18,0.72)` + `blur(18px) saturate(140%)` (dark)
- Border-bottom 1px `rgba(226,232,240,0.6)` (light) / `rgba(34,211,238,0.12)` (dark)
- Wordmark : font 17px, weight 700, letter-spacing -0.01em, gradient cyan→amber sur "Codex"
- Nav links : 14px / 500, padding `8px 12px`, radius 8px, état actif `bg rgba(6,182,212,0.08) + text brand-700`
- Icon buttons : 38x38, radius 10px, hover bg `rgba(241,245,249,0.8)`
- Fallback non-blur : `@supports not (backdrop-filter: blur())` → bg opaque `#fff` light / `#060912` dark

**Footer (`cc-footer`)**
- Toujours sombre (`#0f172a` light, `#04060d` dark) avec border-top cyan subtil en dark
- 4 colonnes (1.5fr / 1fr x 3), gap 48px, max-width 1280
- Wordmark blanc, tag muted (`#94a3b8`), liens 14px hover blanc/cyan-300 dark
- Bottom : separator cyan-tinted, copy 13px `#64748b`, version pill mono 11px sur `rgba(51,65,85,0.5)`

**Doc shell (`cc-doc-shell`) → SectionLayout**
- max-width 1280, padding `48px 32px 80px`, grid `240px 1fr`, gap 48px
- Sidebar sticky `top: 90px`, items 14px / 8px-12px padding, radius 8px
- État actif sidebar : border-left 2px brand-500 + bg `rgba(6,182,212,0.08)` + text brand-700 + weight 600
- Article : max-width 760px, breadcrumb 13px muted, doc-title 44px / 800 / -0.025em, lead 19px secondary
- Pager bas de page : flex space-between, border-top default, links 14px secondary hover brand-700

**Article shell (`art-shell`)**
- Layout 3 colonnes : share rail gauche / body centre 720px max / TOC droite 240px
- Body sticky offsets : `top: 96px`
- Mobile : `1100px` breakpoint → 1 colonne, share/TOC cachés

**Sub-nav article (`art-subnav`)** — nouveau
- Border-bottom subtle, bg `rgba(248,250,252,0.5)` light / `rgba(8,12,22,0.5)` dark, padding `14px 32px`
- Breadcrumb à gauche : `current` weight 500
- Lang switcher à droite : pill blanc avec FR/EN, active bg brand-500 text white

**TOC (`art-toc`)** — refonte avec barre de progression
- Sticky, border-left 2px default, items 13px / padding 6px 12px
- Active : border-left 2px brand-500 + text brand-700 + weight 600
- Bloc progress en bas : padding 14, radius 12, bg `rgba(6,182,212,0.05)` border `rgba(6,182,212,0.15)`, barre `linear-gradient(90deg, brand-500, accent-500)`, num mono 11px

**Reading progress bar (`art-progress`)** — nouveau
- Position fixed top-0 left-0 right-0, height 3px, z-100
- Fill : `linear-gradient(90deg, #06b6d4, #f59e0b, #ef4444)`, transition width 80ms linear

**Share rail (`art-share-rail`)** — nouveau
- Sticky, padding `14px 10px`, bg white border default radius 14
- Boutons 36x36 transparent hover bg-subtle text brand-700
- Label vertical-rl rotate(180) 10px / 700 / 0.1em uppercase muted

### C3 — Composants documentation MDX

**Callout (`cc-callout`)** — refonte des bordures
- Padding `16px 18px`, border-left 4px (couleur sémantique), radius 12, margin `22px 0`
- Variants : `info` (cyan), `tip` (green), `warning` (amber)
- Titre 15px / 600, body 15px / 1.6 primary
- Icon flex-shrink-0 colorée selon variante (`#0e7490` info, `#15803d` tip, `#b45309` warning)
- Backgrounds très subtils : `rgba(X,Y,Z,0.05)`, border `rgba(X,Y,Z,0.6)`

**CodeBlock (`cc-codeblock`)** — toujours sombre, 2 variantes
- Variante landing/site : bg `#0f172a` border `rgba(51,65,85,0.5)` radius 14 shadow-md
- Variante article : bg `#0a0e1a` light / `#04060d` dark
- Head : padding `10px 16px`, border-bottom subtle, filename mono 12px `#cbd5e1`, lang pill mono 11px sur `rgba(51,65,85,0.5)` radius 4
- Body pre : padding `18px 20px`, mono 13.5px / 1.65 / `#e2e8f0`
- Copy button : absolute top-12 right-12, padding `6px 10px`, border `rgba(51,65,85,0.7)` bg `rgba(15,23,42,0.7)` text `#cbd5e1` radius 8 size 12 weight 500
- Token colors article : com `#64748b italic`, kw `#c4b5fd`, str `#fbbf24`, var `#67e8f9`, fn `#5eead4`
- **Note importante** : le CodeBlock reste toujours sombre même en light mode du site (choix design délibéré, ne pas tenter de l'inverser)

**Steps (`art-step`)** — nouveau pattern numéroté
- Grid `56px 1fr` gap 20, margin `32px 0`
- Badge num 56x56 radius 14, gradient `linear-gradient(135deg, brand-500, accent-500)` ou `linear-gradient(135deg, #ef4444, #f59e0b)` pour articles sécurité, color white, font mono 22px / 800
- Shadow `0 8px 20px -8px rgba(brand,0.5)`

**Tabs (`mdx/Tabs.tsx`)** — à refondre avec indicateur animé
- Pill ou underline, transition `gap` ou `transform` 300ms ease-out
- État actif : color brand-700 weight 600 + indicateur

**Card (`mdx/Card.tsx` + Feature/Audience/Path)**
- Base : bg `--surface-card`, border 1px `--border-default`, radius 20px (`--radius-2xl`), transition 300ms ease-out
- Hover (data-interactive) : `translateY(-3px)` + shadow-md + border `rgba(6,182,212,0.3)`
- Variants couleur (Path) : `border-top: 4px solid` cyan / amber / purple (#7c3aed)
- Dark hover : border `rgba(34,211,238,0.4)` + shadow `0 18px 40px -18px rgba(0,0,0,0.8) + 0 0 40px -18px rgba(34,211,238,0.3)` (ajout glow)

**FeatureCard (`cc-feature-card`)**
- Padding 28, icon 52x52 radius 14 mb-18 avec gradients par couleur (`ic-teal`, `ic-amber`, `ic-purple`, `ic-green`, `ic-rose`, `ic-blue`)
- Title 19px / 600, desc 15px / 1.55 secondary
- Variante "wide" : `grid-column: span 2`

**PathCard (`cc-path-card`)**
- Padding 32, border-top 4px (variant teal/amber/purple)
- Level overline 11px / 700 / 0.08em uppercase muted
- Title 22px / 700 / -0.01em
- Desc 15px / 1.55, items list checkmarks `#15803d` (light) / `#4ade80` (dark)
- CTA "→" : color brand-700 weight 600 14px, hover gap +4px

**AudienceCard (`cc-audience-card`)**
- Padding 26 flex gap 16
- Icon 44x44 gradient cyan→amber subtil radius 12 brand-700
- Title 16px / 600, desc 14px / 1.55 secondary

**Section heading (`cc-section-head`)**
- Eyebrow pill 12px / 600 / 0.08em uppercase brand-700 sur bg `rgba(6,182,212,0.08)` radius full padding `5px 12px`, mb 16
- Title clamp(30px, 4vw, 42px) / 700 / -0.02em / 1.15
- Desc 17px / 1.6 secondary
- Centré, max-width 760, mb 56

**Trust bar (`lp-trust`)** — nouveau
- Padding `28px 32px`, border-top + border-bottom default, bg `linear-gradient(180deg, #ffffff 0%, #fafcfe 100%)` light / `linear-gradient(180deg, #060912 0%, #080d18 100%)` dark
- Label 11px / 600 / 0.12em uppercase muted
- Items mono 13px secondary, icon muted

**FAQ (`art-faq` + `art-faq-item`)** — nouveau accordéon
- Items radius 14, border default, transition 300ms ease-out
- Question button : padding `18px 22px`, font 16px / 600 primary, chevron 28x28 radius 8 bg-subtle muted, rotate 180 si open
- État open : border `rgba(6,182,212,0.4)` + shadow `0 8px 24px -12px rgba(6,182,212,0.25)` + chevron bg brand-500 white
- Answer : padding `0 22px 20px`, 15px / 1.65 secondary, liens brand-700 border-bottom subtle

**Article alert (`art-alert`)** — variante avancée du Callout pour articles
- Padding `22px 24px`, radius 16, gap 16
- Variants `is-urgent` (rouge+amber gradient + glow), `is-info` (cyan), `is-warning` (amber)
- Icon 44x44 radius 12 colorée par variant
- Title 16px / 700 primary, text 15px / 1.6 primary

**Tables (`art-table`)** — refonte
- Wrap radius 14 border default overflow-hidden
- TH : padding `14px 18px` / 600 / 13px uppercase 0.03em muted bg-subtle
- TD : padding `14px 18px` border-bottom default, `tr:last-child` no border, `tr:hover td` bg `rgba(6,182,212,0.04)`

**Next steps card (`art-next`)** — nouveau composant fin d'article
- Margin-top 40, padding 28, radius 16
- Bg `linear-gradient(135deg, rgba(6,182,212,0.06), rgba(245,158,11,0.04))`, border `rgba(6,182,212,0.2)`
- H eyebrow 13px / 600 brand-700 0.05em uppercase
- Title 22px / 700 / -0.015em
- Items : flex padding 10/14 radius 10, hover bg-white border default, font 15px / 500 + desc 13px muted

**Pager (`art-pager`)** — refonte
- Grid 1fr 1fr gap 16 mt-64
- Each : padding 20/22, border default radius 14, bg white
- Hover : border brand-400, translate-y -2 + shadow-md
- Label 12px / 600 / 0.05em uppercase muted, title 16px / 600 / 1.35

### C4 — Landing & éditorial

**Hero variante "split" (`lp-hero-split`)**
- Padding `72px 32px`, max-width 1240, grid `1.05fr 1fr` gap 64 align-items center
- Pill avec dot dégradé interne 18x18 cyan→amber
- Title `clamp(44px, 5.4vw, 76px)` / 800 / 1.02 / -0.03em
- Sub 19px / 1.6 secondary max-width 560
- Meta border-top dashed default, items inline-flex gap 10 muted, strong 15px / 700 primary
- Terminal droite : radius 18, glow signature, label avec dot vert pulsant
- Chips orbitaux : 3 chips floating animation 7s avec offsets `top:-18 left:-28`, `top:36% right:-40`, `bottom:-22 left:14%`

**Hero variante "xxl"** (alternative)
- Centré, title `clamp(56px, 9vw, 140px)` / 0.95 / -0.045em
- Ticker bas avec animation linéaire 32s

**Hero variante "inline"** (alternative)
- Grid `1fr 420px`, articles inline panel à droite avec live indicator pulsant

**Article cards landing (`lp-article-hero` + `lp-article-sm`)**
- Hero card : visual 260px height avec radial gradients cyan/amber + grid pattern + glyph SVG bottom-right
- Cat pill absolute top-22 left-22 : bg `rgba(15,23,42,0.5)` blur(10px) border white-15, text white 11px / 600 / 0.06em uppercase
- Body : padding 28/32, meta mono muted, title 28px / 700 / -0.02em, desc 16px / 1.6 secondary
- Foot : auteur avatar 30x30 + nom 13/600 + role 12 muted, "Lire →" brand-700 13/600 hover gap+4
- Small card : padding 24, indicator top 3px gradient, hover translate-y -3 + shadow-md + border brand
- Filters pill : border default radius full padding `8px 14px`, active bg `rgba(6,182,212,0.08)` border `rgba(6,182,212,0.3)` text brand-700

**Stats band (`lp-stats`)** — nouveau
- Padding `56px 32px`, bg `#0f172a` (light) / `#0a0e1a` (dark) toujours sombre
- ::before radial gradients latéraux cyan + amber
- Grid 4 cols gap 32, value `clamp(36px, 4.5vw, 56px)` / 800 / -0.03em / tabular-nums white, gradient num cyan→amber sur certains chiffres
- Label mono 13px `#94a3b8`
- Border-left subtle entre stats

**CTA final (`lp-cta-final`)** — nouveau
- Padding `120px 32px` overflow hidden isolation isolate
- ::before radial brand 60% center + linear `#f8fafc → #ecfeff`
- ::after grid pattern brand-500 8% avec mask radial 60% center
- Title `clamp(40px, 5vw, 64px)` / 800 / -0.03em / 1.05
- Sub 19px / 1.6 secondary max-width 580
- Badge pill `rgba(6,182,212,0.1)` border `rgba(6,182,212,0.25)` text brand-700 13px / 600

### C5 — Pages spéciales

**Search dialog** : aligner sur `--surface-elevated`, avec keyboard hints en mono 11px sur fond muted radius 4. Active item : bg brand-50 text brand-700.

**Configurator wizard** : steps utilisent même badge gradient que `art-step`. Buttons primary = `cc-btn-primary` (gradient cyan→cyan-600 + shadow `0 10px 30px -8px rgba(6,182,212,0.4)`), secondary = `cc-btn-secondary` (border default + transparent).

**404** : conserver l'animation 3D mais aligner les textes avec `cc-h1` + `cc-lead` + boutons standardisés.

**Glossary** : termes en `cc-h3`, definitions en `cc-body`, anchor links brand-700 hover underline.

---

## 4. Boutons (CTA) — spec officielle

**Primary (`cc-btn-primary`)**
```css
display: inline-flex; align-items: center; gap: 8px;
padding: 15px 26px;     /* landing : 14px 28px ailleurs */
border-radius: var(--radius-lg);   /* 12px */
font-weight: 600; font-size: 15px;
border: none;
background: linear-gradient(135deg, #06b6d4, #0891b2);
color: white;
box-shadow: 0 10px 30px -8px rgba(6,182,212,0.4);
transition: transform var(--duration-base) var(--ease-out),
            box-shadow var(--duration-base) var(--ease-out);

/* Hover */
transform: translateY(-1px);
box-shadow: 0 14px 34px -8px rgba(6,182,212,0.5);

/* Active */
transform: translateY(0) scale(0.98);

/* Dark */
background: linear-gradient(135deg, #22d3ee, #06b6d4);
box-shadow: 0 12px 32px -8px rgba(34,211,238,0.55), 0 0 0 1px rgba(34,211,238,0.4) inset;
```

**Secondary (`cc-btn-secondary`)**
```css
padding: 14px 26px;
border-radius: var(--radius-lg);
border: 1px solid var(--border-default);
background: transparent;
color: var(--fg-primary);
font-weight: 600; font-size: 15px;

/* Hover */
border-color: var(--fg-muted);
background: var(--bg-subtle);

/* Dark */
border-color: rgba(51,65,85,0.8);
color: #e2e8f0;
background: rgba(15,23,42,0.4);

/* Dark hover */
background: rgba(34,211,238,0.08);
border-color: rgba(34,211,238,0.4);
color: #67e8f9;
```

**Variante accent ambre** (option utilisateur via `body[data-accent="amber"]`) :
```css
background: linear-gradient(135deg, #f59e0b, #d97706);
box-shadow: 0 10px 30px -8px rgba(245,158,11,0.4);
```

---

## 5. Compatibilité Tailwind v4 (`@theme`) du projet existant

Le projet utilise actuellement **Tailwind v4 inline dans `globals.css` via `@theme`** (cf. CLAUDE.md). La stratégie d'application :

1. **Garder les primitives** dans `@theme` (palettes brand/accent/slate, fonts, animations keyframes) → génère les utilities `bg-brand-500`, `text-slate-900`, etc.
2. **Ajouter les sémantiques** dans `:root` + `.dark` (variables CSS) → exposer comme utilities custom dans `@layer utilities` ou via `@theme` extension :
   ```css
   @theme {
     --color-bg-page: var(--bg-page);
     --color-fg-primary: var(--fg-primary);
     /* etc. */
   }
   ```
   Cela génère automatiquement les utilities `bg-bg-page text-fg-primary border-border-default`.
3. **Composants existants** continuent à fonctionner — la migration peut se faire incrémentalement composant par composant. Pas de big-bang.

**Règle pour les agents DEV** : à partir de C1 mergé, tout NOUVEAU markup doit utiliser les utilities sémantiques (`bg-bg-page`, `text-fg-primary`, etc.) ou les variables CSS directement (`background: var(--bg-page)`). Les classes `dark:bg-slate-900` ne doivent plus apparaître dans les composants refondus.

---

## 6. Mapping fichiers projet → composants design

| Fichier projet | Composant design source | CSS principal |
|---|---|---|
| `src/app/globals.css` | `colors_and_type.css` | tokens C1 |
| `src/components/layout/Header.tsx` | `landing/Header.jsx` + `.cc-header` | `site.css` |
| `src/components/layout/Footer.tsx` | `Footer` (in Sections.jsx) + `.cc-footer` | `site.css` |
| `src/components/layout/Logo.tsx` | `.cc-brand` + `.cc-wordmark` + `.cc-text-gradient` | `site.css` |
| `src/components/layout/SectionLayout.tsx` | `.cc-doc-shell` + `.cc-sidebar` + `.cc-doc-article` | `site.css` |
| `src/components/layout/SectionSidebar.tsx` | `.cc-sidebar` + `li.is-active` | `site.css` |
| `src/components/ui/Breadcrumb.tsx` | `.cc-breadcrumb` ou `.art-crumbs` | `site.css` / `article.css` |
| `src/components/ui/SectionHeading.tsx` | `.cc-section-head` + `.cc-eyebrow-pill` | `site.css` |
| `src/components/ui/FeatureCard.tsx` | `.cc-feature-card` + `.cc-feature-icon` (ic-*) | `site.css` |
| `src/components/ui/PathCard.tsx` | `.cc-path-card` (path-teal/amber/purple) | `site.css` |
| `src/components/ui/AudienceCard.tsx` | `.cc-audience-card` | `site.css` |
| `src/components/ui/Callout.tsx` | `.cc-callout` (info/tip/warning) | `site.css` |
| `src/components/ui/CodeBlock.tsx` | `.cc-codeblock` (head + body + copy) | `site.css` (+ `.art-codeblock` pour articles) |
| `src/components/mdx/Card.tsx` | `.cc-card` + `[data-interactive]` | `site.css` |
| `src/components/mdx/Steps.tsx` + `Step.tsx` | `.art-step` (badge num gradient) | `article.css` |
| `src/components/mdx/Tabs.tsx` | (à concevoir, base sur tokens) | — |
| `src/components/ui/HeroTerminal.tsx` | `.lp-terminal` + `.lp-terminal-bar/body` | `landing.css` |
| `src/components/ui/TableOfContents.tsx` | `.art-toc` + `.art-toc-progress` | `article.css` |
| `src/app/[locale]/page.tsx` (landing) | `App.jsx` + `Sections.jsx` | `landing.css` |
| `src/app/[locale]/{section}/[slug]/page.tsx` | `Article.jsx` + `AppArticle.jsx` | `article.css` |

**Composants nouveaux à créer** :
- `<TrustBar />` (pour landing) — `.lp-trust`
- `<StatsBand />` (pour landing) — `.lp-stats`
- `<CtaFinal />` (pour landing) — `.lp-cta-final`
- `<ReadingProgressBar />` (pour articles) — `.art-progress`
- `<ShareRail />` (pour articles) — `.art-share-rail`
- `<TocProgress />` (pour articles) — `.art-toc-progress`
- `<ArticleAlert variant="urgent|info|warning" />` — `.art-alert`
- `<ArticleStep n title>` (variante visuelle de Steps pour articles) — `.art-step`
- `<NextSteps title items />` (fin d'article) — `.art-next`
- `<Pager prev next />` (refonte) — `.art-pager`
- `<FaqItem q a />` (accordéon) — `.art-faq-item`
- `<ArticleTable />` (wrapper styled) — `.art-table-wrap`
- `<SubNav breadcrumb lang />` (sub-nav article) — `.art-subnav`

---

## 7. Décisions implicites de l'utilisateur (extraites du chat)

1. **CodeBlock toujours sombre** : pas d'inversion en light mode. Le design source confirme ce choix (`background: #0f172a` ou `#0a0e1a`).
2. **Cards en dark = gradient slate-800→slate-900** plutôt qu'aplat. Hover = border cyan-400 + glow cyan subtil.
3. **Footer toujours sombre**, même en light mode. Cohérent avec l'identité actuelle du site.
4. **Stats band toujours sombre** (chiffres clés sur fond `#0f172a`).
5. **Accent variable** (`data-accent="cyan|amber"`) — feature optionnelle, peut être différée à plus tard. Cyan par défaut.
6. **Variantes hero multiples** (split / xxl / inline) — pour le projet, démarrer avec **split** uniquement. Les autres peuvent être ajoutées ultérieurement.
7. **Layout articles "À la une + 2"** est la mise en page principale. Grille de 6 = alternative pour pages catégorie.

---

## 8. Risques techniques identifiés à l'analyse du source

| Risque | Détail | Mitigation |
|---|---|---|
| Conflit nom `cc-text-gradient` | Existe dans `colors_and_type.css` ET redéfini dans `site.css` (sans animation) | Garder la version animée comme défaut (4s shimmer) ; classe `.cc-text-gradient-static` pour version sans animation si besoin |
| `body.dark-mode` vs `.dark` | Le source utilise `body.dark-mode`, le projet utilise `.dark` (next-themes) | À l'implémentation, remplacer systématiquement `body.dark-mode` par `.dark` dans les sélecteurs |
| Couleurs hex en dur dans landing.css/article.css | Beaucoup de `#06b6d4`, `#22d3ee`, `#f59e0b` codés sans variable | Lors de la traduction en composants Tailwind, mapper vers `var(--color-brand-500)` etc. systématiquement |
| `prefers-reduced-motion` non géré dans le source | Animations `lp-pulse`, `lp-float`, `lp-grid-fade`, `lp-blink`, `lp-ticker`, `lp-bounce`, `cc-gradient-shimmer` | Wrapper global `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; } }` à appliquer dès C1 |
| Backdrop-filter non supporté Firefox < 103 | Header glass + chips dark | Fournir fallback opaque via `@supports not (backdrop-filter: blur())` |
| Article hero visual gradient pèse en LCP | `radial-gradient(...) + linear-gradient(...) + grid pattern` | Mesurer baseline LCP avant/après, optimiser si > 2.5s |

---

## 9. Decisions ouvertes pour l'utilisateur (à valider avant C2)

1. **Variantes hero** : on démarre avec `split` uniquement, ou on porte aussi `xxl` et `inline` ?
   - **Recommandation** : split uniquement pour C4. Les autres = backlog futur.
2. **Tweaks panel** (panneau bottom-right pour switcher dark/accent/variants) : portage prévu ?
   - **Recommandation** : non, le ThemeToggle existant suffit. Pas de pollution UI.
3. **Stats band** : quels chiffres afficher (placeholder dans le source : "10K+ devs", etc.) ?
   - **Action utilisateur requise** : fournir 4 KPIs réels (ex : nombre d'articles, sections, MCPs documentés, langues couvertes).
4. **Section "Articles récents" sur landing** : quelle source de données ?
   - **Recommandation** : exposer les 3 derniers articles MDX (par `dateModified`), filtrable par section. À implémenter en SSG via `lib/mdx.ts`.
5. **Color accent ambre** (`data-accent="amber"`) : on l'expose ou on la laisse de côté ?
   - **Recommandation** : laisser de côté pour C4. Ajouter en C5 si demandé.
6. **Variante Article de sécurité** (gradient rouge→amber pour titre/badges) : générique ou spécifique aux articles "sécurité" ?
   - **Recommandation** : générique → couleur déduite du frontmatter MDX (`category: "security|tutorial|reference"` → couleur d'accent variable). À cadrer via `lib/section-navigation.ts` ou un nouveau champ frontmatter `accentColor`.

---

## 10. Plan d'application C1 (immédiat)

L'agent DEV qui démarre C1 doit :

1. **Lire `src/app/globals.css`** dans son état actuel.
2. **Mapper les tokens existants** vers la spec section 2 ci-dessus (palettes Tier 1 inchangées, sémantiques Tier 2 à ajouter/réviser, composants Tier 3 à formaliser).
3. **Conserver la backward compatibility** : ne pas casser les classes utilities existantes utilisées dans les composants. Ajouter, ne pas remplacer brutalement.
4. **Ajouter le bloc `@media (prefers-reduced-motion: reduce)`** global dès maintenant.
5. **Ajouter le fallback `@supports not (backdrop-filter: blur())`** pour le header.
6. **Étendre `@theme` Tailwind** avec les nouveaux tokens sémantiques (cf. section 5) pour générer les utilities `bg-bg-page text-fg-primary border-border-default`.
7. **Créer un script `scripts/check-contrast.ts`** qui vérifie que toutes les paires `--fg-*` x `--bg-*` respectent WCAG AA (4.5:1 pour body, 3:1 pour large text).
8. **Créer la page interne `/design-system`** (route `[locale]/design-system/page.tsx`, `noindex`) qui rend tous les tokens en light + dark côte à côte pour audit visuel rapide.
9. **Ne pas toucher aux composants** dans cette PR : C1 est uniquement les tokens et la page d'audit. Les composants viennent dans C2/C3/C4.

**PR attendue** : `feat/refonte-graphique-RG-03-foundation-tokens` → `develop`.

---

## 11. Fichiers source à conserver comme référence

Tous les fichiers sont dans `docs/epics/2026-04-refonte-graphique/design-source/extracted/redisgn-claude-codex/` :

- `project/colors_and_type.css` — référence tokens (Tier 1/2/3)
- `project/site.css` — référence layout et composants UI shared
- `project/landing.css` — référence hero + cards landing + sections
- `project/landing-dark.css` — référence dark mode approfondi
- `project/article.css` — référence article shell + nouveaux composants doc
- `project/Landing Page.html` — rendu HTML statique (light)
- `project/Landing Page Dark.html` — rendu HTML statique (dark)
- `project/Article - Fuite cle API.html` — rendu HTML article complet
- `project/landing/{App,AppDark,Header,Sections}.jsx` — structure React landing
- `project/article/{AppArticle,Article}.jsx` — structure React article
- `chats/chat1.md` — conversation et décisions utilisateur

Les agents DEV peuvent ouvrir les `.html` localement pour voir le rendu à pixel, mais l'intention est exprimée par les CSS et cette synthèse.
