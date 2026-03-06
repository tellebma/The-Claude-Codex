# The Claude Codex

Le guide de reference gratuit pour maitriser Claude Code. Cree par la communaute, pour la communaute.

## A propos

The Claude Codex est un site web open-source qui rend accessible a tous les bonnes pratiques, outils et methodologies pour tirer le meilleur parti de Claude Code. Que vous soyez developpeur, entrepreneur, etudiant ou simplement curieux — ce guide est fait pour vous.

### Contenu du site

- **Premiers pas** — Installation et configuration de Claude Code
- **MCP (Model Context Protocol)** — Connectez Claude Code a vos outils favoris
- **Skills** — Enseignez de nouveaux talents a votre assistant IA
- **Prompting** — L'art de communiquer efficacement avec l'IA
- **Vision & Futur** — Les tendances et l'avenir de l'IA

## Stack technique

- **Framework** : Next.js 14 (App Router, Static Export)
- **Langage** : TypeScript (strict)
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **Theme** : next-themes (dark/light mode)
- **Serveur** : Nginx Alpine (Docker)

## Demarrage rapide

### Developpement local

```bash
# Cloner le projet
git clone <repo-url>
cd how_to_use_claude

# Installer les dependances
npm install

# Lancer le serveur de dev
npm run dev
```

Le site sera accessible sur `http://localhost:3000`.

### Docker

```bash
# Build de l'image
docker build -t claude-codex .

# Lancer le conteneur
docker run -p 8080:8080 claude-codex
```

Le site sera accessible sur `http://localhost:8080`.

### Docker Compose

```bash
# Build et lancement en une commande
docker compose up -d

# Arreter le conteneur
docker compose down
```

## Structure du projet

```
/src
  /app                    Pages et layouts (App Router)
    /getting-started      Guide d'installation
    /mcp                  Guide MCP
    /skills               Guide Skills
    /prompting            Guide Prompting
    /future               Vision et futur
    globals.css           Variables CSS et design system
    layout.tsx            Layout racine
    page.tsx              Landing page
  /components
    /layout               Header, Footer, ThemeToggle, ThemeProvider
    /ui                   Composants reutilisables (Callout, CodeBlock, etc.)
/nginx
  nginx.conf              Configuration Nginx avec headers de securite
/public                   Assets statiques
Dockerfile                Build multi-stage optimise
docker-compose.yml        Deploiement one-click
```

## Commandes

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de developpement (port 3000) |
| `npm run build` | Build de production (SSG) |
| `npm run lint` | Verification ESLint |
| `npm run type-check` | Verification TypeScript |
| `npm run docker:build` | Build image Docker (`tellebma/how_to_use_claude`) |
| `npm run docker:push` | Push vers Docker Hub |
| `npm run docker:release` | Build + Push en une commande |
| `docker compose up -d` | Deploiement production |

## Securite

Le site est deploye avec une configuration Nginx durcie incluant :
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options, X-Content-Type-Options
- Referrer-Policy, Permissions-Policy
- Conteneur en lecture seule, utilisateur non-root

## Contribuer

Les contributions sont les bienvenues. Pour contribuer :

1. Forkez le projet
2. Creez une branche (`git checkout -b feat/ma-feature`)
3. Committez vos changements (`git commit -m "feat: description"`)
4. Poussez la branche (`git push origin feat/ma-feature`)
5. Ouvrez une Pull Request

## Licence

Projet open-source.
