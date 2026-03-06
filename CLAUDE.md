# Claude Code Guide — Site web de référence

Site de documentation et guides pour démocratiser l'utilisation de Claude Code. Stack : Next.js 14 (App Router), TypeScript strict, Tailwind CSS, MDX pour le contenu. Déployé via Docker (Nginx Alpine).

## Commandes

- `npm run dev` : Serveur de dev (port 3000)
- `npm run build` : Build de production (SSG)
- `npm run lint` : ESLint + Prettier check
- `npm run type-check` : Vérification TypeScript
- `docker build -t claude-code-guide .` : Build de l'image Docker
- `docker compose up -d` : Lancement du site en production

## Architecture

```
/app                  → Pages et layouts (App Router)
/app/(landing)        → Landing page (page d'accueil)
/app/getting-started  → Guide d'installation
/app/mcp             → Pages MCP (explications, top MCP)
/app/skills          → Pages Skills (explications, top skills)
/app/prompting       → Guide de prompting et directives
/app/future          → Vision et tendances IA
/components/ui       → Composants réutilisables (cards, callouts, code-blocks, tabs)
/components/layout   → Header, Footer, Sidebar, Navigation
/content             → Fichiers MDX du contenu éditorial
/lib                 → Utilitaires et helpers
/public              → Assets statiques (images, icons, fonts)
/docker              → Dockerfile, nginx.conf, docker-compose.yml
```

## Style de code

- TypeScript strict, jamais de `any`
- Exports nommés uniquement, pas de default exports (sauf pages Next.js)
- Composants fonctionnels avec hooks, pas de classes React
- Tailwind utility classes uniquement, pas de CSS custom sauf variables globales dans `globals.css`
- Nommage des composants en PascalCase, des fichiers utilitaires en kebab-case
- Un composant par fichier

## Contenu & rédaction

- Tout le contenu éditorial est en fichiers MDX dans `/content`
- Ton : accessible, enthousiaste, jamais condescendant. On s'adresse à des débutants comme à des experts
- Utiliser des analogies concrètes pour chaque concept technique
- Chaque page a une intro claire, un corps structuré, et un "Prochaines étapes" en conclusion
- Les blocs de code doivent toujours avoir un langage spécifié pour le syntax highlighting
- Les callouts utilisent le composant `<Callout type="tip|warning|info">` 

## Design & UX

- Mobile-first, responsive sur tous les breakpoints
- Dark mode / Light mode via `next-themes`
- Palette : ne pas copier le violet Anthropic — créer une identité visuelle propre
- Animations subtiles au scroll (framer-motion), pas de surcharge
- Navigation latérale sticky sur les pages de documentation
- Score Lighthouse visé : > 90 sur les 4 métriques

## Docker & déploiement

- Dockerfile multi-stage : étape build (node:20-alpine) → étape serve (nginx:alpine)
- Nginx configuré avec headers de sécurité (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Le `docker-compose.yml` expose le port 8080 par défaut
- L'image finale doit être < 50 MB
- Ne JAMAIS inclure `node_modules` ou `.next/cache` dans l'image finale

## Règles importantes

- JAMAIS de secrets, clés API ou .env dans le repo
- Le site est 100% statique (SSG), pas de SSR ni d'API routes
- Pas de paywall, pas de tracking intrusif, pas de cookies tiers
- Les images doivent être en WebP avec lazy loading
- Chaque page doit avoir des méta-données SEO complètes (title, description, og:image)
- Accessibilité : respecter WCAG 2.1 AA minimum (aria-labels, focus visible, contrastes)

## Workflow de développement

1. Toujours créer une branche par feature (`feat/nom-feature`)
2. Lancer `npm run lint && npm run type-check` avant tout commit
3. Tester le build Docker localement avant de considérer une feature comme terminée
4. Committer souvent avec des messages conventionnels (feat:, fix:, docs:, chore:)

## Lors du compactage

Quand tu compactes, conserve toujours : la liste complète des fichiers modifiés, l'état d'avancement des pages (terminée/en cours/à faire), et les décisions d'architecture prises.
