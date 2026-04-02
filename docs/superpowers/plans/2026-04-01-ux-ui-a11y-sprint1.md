# EPIC UX/UI/A11y — Sprint 1 : Critiques visuels et contrastes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger les 5 problemes critiques de hierarchie visuelle, contraste WCAG AA et fausses affordances interactives sur la landing page et les composants partages.

**Architecture:** Corrections CSS et composants React ciblees. Pas de nouvelle page ni de nouveau composant. Les CSS variables existantes (`--surface-card`, `--surface-card-hover`) seront enfin appliquees dans `.glass-card`. Les contrastes textuels seront releves au minimum 4.5:1. Les styles interactifs seront conditionnes a la presence d'un `href`.

**Tech Stack:** Tailwind CSS, React (composants fonctionnels), Next.js 14 App Router

---

## Fichiers concernes

| Fichier | Action | Story |
|---------|--------|-------|
| `src/app/globals.css` | Modifier : glass-card, text-gradient fallback, CSS variables dark | US-1, US-2 |
| `src/app/[locale]/page.tsx` | Modifier : fonds de sections alternes | US-1 |
| `src/components/ui/FeatureCard.tsx` | Modifier : gradients icones opaques, styles hover conditionnels | US-1, US-3 |
| `src/components/ui/AudienceCard.tsx` | Modifier : fond opaque, retirer hover interactif | US-1, US-3 |
| `src/components/mdx/Card.tsx` | Modifier : fond opaque | US-1 |
| `src/components/mdx/MdxComponents.tsx` | Modifier : contrastes body MDX | US-2 |

---

## Task 1 : US-1 — Hierarchie visuelle sections/cartes landing (3 SP)

**Expert(s) : Expert Frontend CSS + Expert UX/UI Designer**

**Files:**
- Modify: `src/app/globals.css:11-12,33-39,113-114`
- Modify: `src/app/[locale]/page.tsx:172-173,242-243,349-350`
- Modify: `src/components/ui/FeatureCard.tsx:13-18`
- Modify: `src/components/ui/AudienceCard.tsx:11-12`
- Modify: `src/components/mdx/Card.tsx:10-11`

### Step 1.1 : CSS variables dark mode — fonds opaques

- [ ] Dans `src/app/globals.css`, changer les CSS variables dark pour des fonds opaques :

```css
/* .dark (L33-39) */
--surface-card: rgba(30, 41, 59, 1);        /* etait 0.5 */
--surface-card-hover: rgba(30, 41, 59, 1);  /* etait 0.8 */
```

### Step 1.2 : glass-card utilise les CSS variables

- [ ] Dans `src/app/globals.css`, modifier `.glass-card` (L113-114) :

```css
.glass-card {
  @apply backdrop-blur-lg border rounded-2xl shadow-sm;
  background-color: var(--surface-card);
  border-color: theme('colors.slate.200');
  --tw-shadow-color: theme('colors.slate.200/50%');
}
.dark .glass-card {
  background-color: var(--surface-card);
  border-color: theme('colors.slate.700/40%');
  --tw-shadow: none;
}
```

### Step 1.3 : Fonds de sections alternes sur la landing

- [ ] Dans `src/app/[locale]/page.tsx` :

**Section "Features" (L173)** : ajouter un fond neutre
```tsx
<section className="bg-white py-20 dark:bg-slate-950 sm:py-28">
```

**Section "Audience" (L243)** : fond plus visible
```tsx
<section className="bg-slate-50 py-20 dark:bg-slate-900 sm:py-28">
```

**Section "Parcours" (L289)** : fond blanc explicite
```tsx
<section className="bg-white py-20 dark:bg-slate-950 sm:py-28">
```

**Section "Configurateur" (L350)** : fond plus visible
```tsx
<section className="bg-slate-50 py-20 dark:bg-slate-900 sm:py-28">
```

### Step 1.4 : Gradients icones FeatureCard opaques

- [ ] Dans `src/components/ui/FeatureCard.tsx`, remplacer les gradients (L13-18) :

```typescript
const gradients = {
  teal: "from-brand-100 to-brand-50",
  amber: "from-accent-100 to-accent-50",
  purple: "from-violet-100 to-violet-50",
  green: "from-emerald-100 to-emerald-50",
};
```

### Step 1.5 : AudienceCard fond opaque

- [ ] Dans `src/components/ui/AudienceCard.tsx` (L11), remplacer le fond et la bordure :

```tsx
<div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
```

Aussi remplacer le gradient icone (L12) :
```tsx
<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-accent-50">
```

### Step 1.6 : MDX Card fond opaque

- [ ] Dans `src/components/mdx/Card.tsx`, modifier les styles de variante (L10-16) :

```typescript
const variantStyles = {
  default:
    "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800",
  accent:
    "border-brand-500/30 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-950",
  highlight:
    "border-accent-500/30 bg-accent-50 dark:border-accent-500/20 dark:bg-accent-950",
};
```

### Step 1.7 : Verification et commit

- [ ] Lancer `npm run lint && npm run type-check && npm run build`
- [ ] Commit :

```bash
git add src/app/globals.css src/app/\[locale\]/page.tsx src/components/ui/FeatureCard.tsx src/components/ui/AudienceCard.tsx src/components/mdx/Card.tsx
git commit -m "fix(ui): US-1 hierarchie visuelle sections et cartes landing"
```

---

## Task 2 : US-2 — Contrastes textuels WCAG AA (3 SP)

**Expert(s) : Expert Frontend CSS + Expert QA**

**Files:**
- Modify: `src/app/globals.css:95-107` (.text-gradient)
- Modify: `src/components/mdx/MdxComponents.tsx:88-118`

### Step 2.1 : Fallback .text-gradient

- [ ] Dans `src/app/globals.css`, ajouter un fallback color pour `.text-gradient` (L95-100) :

```css
.text-gradient {
  color: #0e7490; /* brand-700, fallback si clip-text non supporte — ratio 5.3:1 */
  @apply bg-clip-text text-transparent;
  background-image: linear-gradient(135deg, #06b6d4, #22d3ee, #f59e0b, #06b6d4);
  background-size: 200% auto;
  animation: gradient-shimmer 4s ease-in-out infinite;
}
```

### Step 2.2 : Contrastes body MDX

- [ ] Dans `src/components/mdx/MdxComponents.tsx`, relever les contrastes :

**p (L90)** : `text-slate-600` → `text-slate-700`, `dark:text-slate-300` → `dark:text-slate-200`
```tsx
<p className="my-4 leading-relaxed text-slate-700 dark:text-slate-200" {...props} />
```

**ul (L96)** : idem
```tsx
<ul className="my-4 list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200" {...props} />
```

**ol (L101)** : idem
```tsx
<ol className="my-4 list-decimal space-y-2 pl-6 text-slate-700 dark:text-slate-200" {...props} />
```

**blockquote (L117)** : `text-slate-500` → `text-slate-600`
```tsx
<blockquote className="my-6 border-l-4 border-brand-500/30 pl-4 italic text-slate-600 dark:text-slate-300" {...props} />
```

### Step 2.3 : text-slate-400 sur fond clair → text-slate-500

- [ ] Les occurrences de `text-slate-400` sur fond clair (texte informatif lisible) doivent passer a `text-slate-500`. **Contextes cibles (texte sur fond clair/blanc)** :

Fichiers avec `text-slate-400` sur fond clair a corriger :
- `src/components/ui/SectionHeading.tsx` : description utilise deja `text-slate-600` — OK
- `src/components/ui/FeatureCard.tsx` L47 : utilise `text-slate-600` — OK
- `src/app/[locale]/page.tsx` L376 : utilise `text-slate-600` — OK

**Note** : la majorite des `text-slate-400` sont soit sur fond sombre (terminal, cartes dark), soit sur des icones decoratives (`aria-hidden`), soit dans des composants dark-only. Aucune correction supplementaire n'est necessaire pour US-2 Sprint 1. Les `text-slate-400` sur fond sombre (pages section avec `bg-slate-950`) passent a ~5.9:1 — conformes WCAG AA.

### Step 2.4 : Verification et commit

- [ ] Lancer `npm run lint && npm run type-check && npm run build`
- [ ] Commit :

```bash
git add src/app/globals.css src/components/mdx/MdxComponents.tsx
git commit -m "fix(a11y): US-2 contrastes textuels WCAG AA 4.5:1 minimum"
```

---

## Task 3 : US-3 — Coherence styles interactifs cartes (2 SP)

**Expert(s) : Expert TypeScript/React + Expert UX/UI Designer**

**Files:**
- Modify: `src/components/ui/FeatureCard.tsx:27-65`
- Modify: `src/components/ui/AudienceCard.tsx:9-22`

### Step 3.1 : FeatureCard — styles hover conditionnels

- [ ] Dans `src/components/ui/FeatureCard.tsx`, scinder `sharedClassName` en base + interactive (L34) :

```typescript
export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = "teal",
  href,
}: FeatureCardProps) {
  const baseClassName = "glass-card group h-full p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950";

  const interactiveClassName = "hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] cursor-pointer";

  const content = (
    <>
      <div
        className={clsx(
          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
          gradients[gradient]
        )}
      >
        <Icon className={clsx("h-6 w-6", iconColors[gradient])} aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={clsx(baseClassName, interactiveClassName, "block")}>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClassName}>
      {content}
    </div>
  );
}
```

### Step 3.2 : AudienceCard — retirer les hover interactifs

- [ ] Dans `src/components/ui/AudienceCard.tsx` (L11), retirer `hover:border-brand-500/30 hover:shadow-md` et `transition-all duration-300` :

```tsx
<div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
```

(Note : le fond opaque a deja ete applique dans Task 1 Step 1.5. Ici on retire seulement les hover restants si Task 1 ne les a pas deja retires.)

### Step 3.3 : Verification et commit

- [ ] Lancer `npm run lint && npm run type-check && npm run build`
- [ ] Commit :

```bash
git add src/components/ui/FeatureCard.tsx src/components/ui/AudienceCard.tsx
git commit -m "fix(ux): US-3 retirer fausses affordances interactives des cartes"
```

---

## Task 4 : Finalisation Sprint 1

### Step 4.1 : Mise a jour STATUS.md

- [ ] Mettre a jour `docs/BACKLOG/STATUS.md` :
  - US-1, US-2, US-3 → `✅ Fait`
  - Sprint 1 : `3/3 stories · 8/8 SP · 100%`
  - Vue d'ensemble : recalculer progression

### Step 4.2 : Push

- [ ] `git push`
