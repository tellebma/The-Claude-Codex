# [1.5.0](https://github.com/tellebma/The-Claude-Codex/compare/v1.4.0...v1.5.0) (2026-04-24)


### Bug Fixes

* **cd:** aligne Dockerfile sur Node 24, supprime npm runtime, fix permission Vercel ([#83](https://github.com/tellebma/The-Claude-Codex/issues/83)) ([e5713ba](https://github.com/tellebma/The-Claude-Codex/commit/e5713ba8b45929225c8b0029c4e445efbe1c9c88))
* **ci:** lot 1 — SHAs Sonar invalides + E2E describe mobile Playwright ([a5c2a71](https://github.com/tellebma/The-Claude-Codex/commit/a5c2a7105692f0de388c1c9d6214342b1c3f45ae))
* **ci:** retire à nouveau le job deploy-preview (régression PR [#66](https://github.com/tellebma/The-Claude-Codex/issues/66)) ([#69](https://github.com/tellebma/The-Claude-Codex/issues/69)) ([343f9da](https://github.com/tellebma/The-Claude-Codex/commit/343f9da773ba9fca62f1a8dd2fee7ef060ac0a27)), closes [#65](https://github.com/tellebma/The-Claude-Codex/issues/65) [#67](https://github.com/tellebma/The-Claude-Codex/issues/67) [#58](https://github.com/tellebma/The-Claude-Codex/issues/58) [#59](https://github.com/tellebma/The-Claude-Codex/issues/59) [#60](https://github.com/tellebma/The-Claude-Codex/issues/60)
* **ci:** SONAR_HOST_URL configuré en secret (pas variable) ([0a9a378](https://github.com/tellebma/The-Claude-Codex/commit/0a9a378ba2367029b411b1f683f1160e2ade73f3))
* **ci:** sync package-lock.json (@swc/helpers peer dep) ([#62](https://github.com/tellebma/The-Claude-Codex/issues/62)) ([7ac994f](https://github.com/tellebma/The-Claude-Codex/commit/7ac994f70abc786ac511cb2bfa0b7ad55e1fb608)), closes [#58](https://github.com/tellebma/The-Claude-Codex/issues/58) [#59](https://github.com/tellebma/The-Claude-Codex/issues/59) [#60](https://github.com/tellebma/The-Claude-Codex/issues/60)
* **e2e:** aligner les tests sur le build statique i18n servi en CI ([09d287d](https://github.com/tellebma/The-Claude-Codex/commit/09d287dc714aa2b0ddb6091b518d10f4f61f3d92))
* **e2e:** contourner le faux-hidden Playwright sur getByRole("dialog") + stabilité clear button ([acc021a](https://github.com/tellebma/The-Claude-Codex/commit/acc021ac8f2a8568897ddd5766ddfdf8882081dc))
* **e2e:** skip les règles a11y connues dette-design sur les pages MCP overview ([1b3f6eb](https://github.com/tellebma/The-Claude-Codex/commit/1b3f6eba1c229bf973c424d1c0fecf4b4b4544ee))
* **e2e:** supprimer les flakes Playwright liés aux animations + strict-mode ([bb2c4e0](https://github.com/tellebma/The-Claude-Codex/commit/bb2c4e032748a60643770b676fb6de28947b8e79))
* **quality:** corrections des 4 new issues Sonar scan 2026-04-22 ([bbbb659](https://github.com/tellebma/The-Claude-Codex/commit/bbbb659ddaffd6ad9901c54bccfef8ee29197174)), closes [Array#push](https://github.com/Array/issues/push)
* **quality:** Sonar — BLOCKER/CRITICAL + Readonly sweep + CPD exclusions ([22de610](https://github.com/tellebma/The-Claude-Codex/commit/22de6100fff4105add4c6cfde9340e4389df7efc))
* **quality:** Sonar batch 3 — ARIA, idioms, petits nettoyages ([e4b8198](https://github.com/tellebma/The-Claude-Codex/commit/e4b8198b7473fa4dbd11a27425013e04e93a0396))
* **quality:** Sonar batch 4 — derniers patterns ARIA & idiomes ([aae2a30](https://github.com/tellebma/The-Claude-Codex/commit/aae2a3026342038a32be528ca8cf9844dcce276e))
* **quality:** Sonar sweep — globalThis, semantic HTML, idioms, nested ternaries ([bc0224a](https://github.com/tellebma/The-Claude-Codex/commit/bc0224a2ff49477162d86030f33e17a2c970e45b)), closes [lucide-icons/lucide#670](https://github.com/lucide-icons/lucide/issues/670)
* **release:** debloquer la PR develop->main ([#58](https://github.com/tellebma/The-Claude-Codex/issues/58)) ([#72](https://github.com/tellebma/The-Claude-Codex/issues/72)) ([95c51c0](https://github.com/tellebma/The-Claude-Codex/commit/95c51c0381edbd8dd8622ddc4270ae84ddf748a5)), closes [62/#71](https://github.com/tellebma/The-Claude-Codex/issues/71) [#70](https://github.com/tellebma/The-Claude-Codex/issues/70)
* **security:** corriger 4 Dependabot HIGH (undici, vite, glob, flatted) ([#78](https://github.com/tellebma/The-Claude-Codex/issues/78)) ([be98d4f](https://github.com/tellebma/The-Claude-Codex/commit/be98d4fafba95ccdc6b728d6a19f6e558699710a)), closes [#6](https://github.com/tellebma/The-Claude-Codex/issues/6) [22/#23](https://github.com/tellebma/The-Claude-Codex/issues/23) [#1](https://github.com/tellebma/The-Claude-Codex/issues/1) [#12](https://github.com/tellebma/The-Claude-Codex/issues/12) [71/#72](https://github.com/tellebma/The-Claude-Codex/issues/72)
* **security:** corriger les 5 alertes CodeQL HIGH sur develop ([#77](https://github.com/tellebma/The-Claude-Codex/issues/77)) ([aa283a8](https://github.com/tellebma/The-Claude-Codex/commit/aa283a83178c16b0ab3da40d8b079c45e6b56bd2))


### Features

* **404:** page 404 avec toaster 3D self-hosted, suggestions URL et articles récents ([#59](https://github.com/tellebma/The-Claude-Codex/issues/59)) ([ca2cb1b](https://github.com/tellebma/The-Claude-Codex/commit/ca2cb1b6ea1823cdfa919043f00ad0ad1a9d277b))
* **a11y:** Sprint 3 UX/UI/A11y — max-width MDX + cohérence labels ([a71a0eb](https://github.com/tellebma/The-Claude-Codex/commit/a71a0eb36d557bd43432641da925c3a0a076ee3b))
* **a11y:** Sprint 4 US-11 polish — favicon.ico + CTA hero hover ([8553110](https://github.com/tellebma/The-Claude-Codex/commit/855311006d32d9f564a63e6d92a26c1397957864))
* **analytics:** MT21 automatisation hebdo GSC + Matomo + Discord ([#60](https://github.com/tellebma/The-Claude-Codex/issues/60)) ([51423cf](https://github.com/tellebma/The-Claude-Codex/commit/51423cf17a9a062b38d9f6d6719430d89ed6ce90))
* **ci:** commentaire sticky PR avec métriques Sonar + coverage ([#66](https://github.com/tellebma/The-Claude-Codex/issues/66)) ([4ac98e4](https://github.com/tellebma/The-Claude-Codex/commit/4ac98e4847c5aeff0e43cb5a2b06f41a7b4962ef))
* **ci:** gate Vercel deploy on CI success via Connect GitHub Actions ([#67](https://github.com/tellebma/The-Claude-Codex/issues/67)) ([83e03b9](https://github.com/tellebma/The-Claude-Codex/commit/83e03b9ad51e1513f56a9e13acba29917a466af2))
* **ci:** lot 1 — pipeline CI/CD structuré avec coverage gate, SonarQube et E2E sharding ([a1e95d6](https://github.com/tellebma/The-Claude-Codex/commit/a1e95d64b4de46b4dd08d57f2e2b123d02767234))
* **ci:** lot 2 — Lighthouse CI, Lychee, axe-core et validateur SEO/IA ([276dfe5](https://github.com/tellebma/The-Claude-Codex/commit/276dfe50f2c7843ba3c02809d6facfa79d023ac7))
* **ci:** lot 3 — sécurité minimale crédible (gitleaks, npm audit, CodeQL, Trivy) ([3e74a60](https://github.com/tellebma/The-Claude-Codex/commit/3e74a60040f68888ca6fdf7d2f737d69a3011a41))
* **ci:** lot 4 — gate du déploiement Vercel preview derrière la CI ([91628b7](https://github.com/tellebma/The-Claude-Codex/commit/91628b70228c76fe3b9e7f62641bd3b0ae629515))
* **content:** refresh SEO de l'article vs-copilot (MT3) ([#64](https://github.com/tellebma/The-Claude-Codex/issues/64)) ([95c53f1](https://github.com/tellebma/The-Claude-Codex/commit/95c53f1f9881d62dd7a1c99d24d09df63573769c))
* **deps:** bump Next 14 -> 16 (React 19) ([#79](https://github.com/tellebma/The-Claude-Codex/issues/79)) ([7474929](https://github.com/tellebma/The-Claude-Codex/commit/747492974df3f05002fe3edd2d238167690ac2b1)), closes [#3](https://github.com/tellebma/The-Claude-Codex/issues/3) [#25](https://github.com/tellebma/The-Claude-Codex/issues/25) [72/#78](https://github.com/tellebma/The-Claude-Codex/issues/78) [#3](https://github.com/tellebma/The-Claude-Codex/issues/3) [#25](https://github.com/tellebma/The-Claude-Codex/issues/25)
* **quality:** Sprint 24 Sonar — bugs utilisateur-visibles et filet de tests ([8a1a59b](https://github.com/tellebma/The-Claude-Codex/commit/8a1a59b7bf42556fe7e8a1f44a6f0c21e9773565))
* **quality:** Sprint 25 Sonar — refacto sécurisé et hardening a11y ([1b95653](https://github.com/tellebma/The-Claude-Codex/commit/1b95653cb5b877c16bfa7110c89a7240acb62c66))
* **quality:** Sprint 26 Sonar — sweep TS modernisation + documentation ([8771291](https://github.com/tellebma/The-Claude-Codex/commit/87712914d0296f917b52be55b40eea946562741d))
* **search:** recherche live dans le contenu MDX avec snippets ([#63](https://github.com/tellebma/The-Claude-Codex/issues/63)) ([ae09df1](https://github.com/tellebma/The-Claude-Codex/commit/ae09df1742b0fb0e1884f4c92dfd35b79c81abf2))
* **search:** Spotlight-style UI + live search contract locked ([#70](https://github.com/tellebma/The-Claude-Codex/issues/70)) ([35627e2](https://github.com/tellebma/The-Claude-Codex/commit/35627e2e7a0dad59e5c99550476f6d018fe36a55))

# [1.4.0](https://github.com/tellebma/The-Claude-Codex/compare/v1.3.0...v1.4.0) (2026-04-22)


### Features

* **a11y:** Sprint 2 UX/UI/A11y — i18n completude et accents FR ([b9f8301](https://github.com/tellebma/The-Claude-Codex/commit/b9f8301cc15876c5e403af0d339494c97d7eae85))

# [1.3.0](https://github.com/tellebma/The-Claude-Codex/compare/v1.2.1...v1.3.0) (2026-04-22)


### Features

* **a11y:** Sprint 1 UX/UI/A11y — contrastes textuels WCAG AA ([2201041](https://github.com/tellebma/The-Claude-Codex/commit/22010410dcc9cc7c45ddafc0fc0d46f11b763520))

## [1.2.1](https://github.com/tellebma/The-Claude-Codex/compare/v1.2.0...v1.2.1) (2026-04-21)


### Bug Fixes

* **i18n:** add missing about namespace (used by /about page) ([2fbe67b](https://github.com/tellebma/The-Claude-Codex/commit/2fbe67bee47a04c1cf2f16530231866c4405d9bc))
* **i18n:** generate locale-prefixed hrefs on content and reference pages ([fa5b4a6](https://github.com/tellebma/The-Claude-Codex/commit/fa5b4a6d882b3fd378ec4a09868ed66ef6a36b39))
* **search:** iOS soft keyboard — prime-input pattern + inert scope fix ([b69a177](https://github.com/tellebma/The-Claude-Codex/commit/b69a177f69679a93184d750043936836b7bbab86)), closes [#13](https://github.com/tellebma/The-Claude-Codex/issues/13)
* **search:** raise iOS soft keyboard on mobile tap ([ad155c4](https://github.com/tellebma/The-Claude-Codex/commit/ad155c484cef79f56885b16000802d1a435ad044))
* **search:** repair mobile UX and add missing translation keys ([621360c](https://github.com/tellebma/The-Claude-Codex/commit/621360c13f14ad89e2de42b3740b70e5683920a3))

# [1.2.0](https://github.com/tellebma/The-Claude-Codex/compare/v1.1.3...v1.2.0) (2026-04-20)


### Features

* **analytics:** add Matomo tracking events for retention analysis ([#37](https://github.com/tellebma/The-Claude-Codex/issues/37)) ([097ac4f](https://github.com/tellebma/The-Claude-Codex/commit/097ac4fb8a92c059e6867b8b026f2295a3e6b7a5))
* **content:** add 2 SEO-driven articles (leaked API key, plan vs thinking) ([#43](https://github.com/tellebma/The-Claude-Codex/issues/43)) ([2942e00](https://github.com/tellebma/The-Claude-Codex/commit/2942e007745ba20d5558dac6f38a3fc235637336))
* **content:** add Claude Design vs Figma comparison article (FR + EN) ([#45](https://github.com/tellebma/The-Claude-Codex/issues/45)) ([c3eea72](https://github.com/tellebma/The-Claude-Codex/commit/c3eea721fc7ba4606858c7ae1c35954e9cd4886b))
* **content:** expand environment variables reference for SEO queries ([#44](https://github.com/tellebma/The-Claude-Codex/issues/44)) ([b06b0a3](https://github.com/tellebma/The-Claude-Codex/commit/b06b0a353d62df472f9e61abc7f117619dc2e219))
* **seo:** generate llms.txt and llms-full.txt for AI crawlers ([#39](https://github.com/tellebma/The-Claude-Codex/issues/39)) ([22a429c](https://github.com/tellebma/The-Claude-Codex/commit/22a429cb959d963698a98ee684decac88bbe7955))
* **ux:** implement smart 404 page with contextual suggestions ([#38](https://github.com/tellebma/The-Claude-Codex/issues/38)) ([b8c7f39](https://github.com/tellebma/The-Claude-Codex/commit/b8c7f390370fc66f7ad860d9207efa0a89a4b967))

## [1.1.3](https://github.com/tellebma/The-Claude-Codex/compare/v1.1.2...v1.1.3) (2026-04-20)


### Bug Fixes

* **i18n:** rename 4 EN slugs from French to English ([#35](https://github.com/tellebma/The-Claude-Codex/issues/35)) ([f6e2fd5](https://github.com/tellebma/The-Claude-Codex/commit/f6e2fd51e09c08209e597aebb37fac3a458e4955))

## [1.1.2](https://github.com/tellebma/The-Claude-Codex/compare/v1.1.1...v1.1.2) (2026-04-19)


### Bug Fixes

* **docker:** injecter les variables Matomo au build (SSG) ([3f7bd66](https://github.com/tellebma/The-Claude-Codex/commit/3f7bd6652ab0b9a970c7b2c65f31983d434e696f))

## [1.1.1](https://github.com/tellebma/The-Claude-Codex/compare/v1.1.0...v1.1.1) (2026-04-12)


### Bug Fixes

* **csp:** autoriser matomo.tellebma.fr dans Content-Security-Policy ([4d81871](https://github.com/tellebma/The-Claude-Codex/commit/4d81871e4b2b71849b000bd0a9396d4131c0ad8d))

# [1.1.0](https://github.com/tellebma/The-Claude-Codex/compare/v1.0.0...v1.1.0) (2026-04-12)


### Bug Fixes

* corriger tests après rebase (ThemeProvider type, MermaidDiagram message, deps) ([0469d5c](https://github.com/tellebma/The-Claude-Codex/commit/0469d5c90161840f7e5271e85401d2655689b36d))
* **seo:** canonical /fr/, trailing slashes, and optimized meta titles/descriptions ([17ce7ca](https://github.com/tellebma/The-Claude-Codex/commit/17ce7cad3700f1da533293384dbd0a895fdfc4c7))


### Features

* ajouter la page Ultraplan (FR + EN) ([6a9dcb3](https://github.com/tellebma/The-Claude-Codex/commit/6a9dcb38da46b217a6ff9fdde8d6ee1500473ad9))
* composant MermaidDiagram avec support dark/light et hand-drawn ([a675790](https://github.com/tellebma/The-Claude-Codex/commit/a67579013fe3736262ff8cd8e893e3bfaa2a7a0e))
* EPIC best practices Sprint 0 — 3 new pages, 3 enrichments, 1 component ([81092a8](https://github.com/tellebma/The-Claude-Codex/commit/81092a882122b83f73e7dc056d66e89e8746f751))
* EPIC best practices Sprint 1 — 1 new page, 4 enrichments, 1 component ([4b8c2e5](https://github.com/tellebma/The-Claude-Codex/commit/4b8c2e596ceaee82842df4f6df905bbe6395dd60))
* EPIC best practices Sprint 2 — 1 new page, 2 enrichments ([65a3b1e](https://github.com/tellebma/The-Claude-Codex/commit/65a3b1e0e3fa158b248c5b61a9c6aca21755584b))
* mise à jour contenu — modèles 4.6, 1M tokens, Voice Mode, Background Agents, MCP Elicitation ([d56a939](https://github.com/tellebma/The-Claude-Codex/commit/d56a93902aaf43dcfc3cdb95a2b91a7494eccecb))
* remplacer les diagrammes ASCII par des diagrammes Mermaid (FR + EN) ([580bb13](https://github.com/tellebma/The-Claude-Codex/commit/580bb1331cb43dd6234447071f4b7236c87e493c))

# 1.0.0 (2026-04-12)


### Bug Fixes

* **a11y:** US-10 liens externes sr-only, PathCard aria-label, Callout aside, Footer headings ([d154f60](https://github.com/tellebma/The-Claude-Codex/commit/d154f606d9c1390cbdfd8c76b415377083fc70a1))
* **a11y:** US-2 contrastes textuels WCAG AA 4.5:1 minimum ([12f6bf8](https://github.com/tellebma/The-Claude-Codex/commit/12f6bf83b2a63461fcb147f224ea0ec9774ee116))
* **a11y:** US-4 aria-haspopup=menu semantique precise ([758c40f](https://github.com/tellebma/The-Claude-Codex/commit/758c40ff6bb2aff1020ba4ecd193ef126622af4e))
* **a11y:** US-4 navigation header ARIA dropdown et focus management ([fafd0c5](https://github.com/tellebma/The-Claude-Codex/commit/fafd0c5ff2b56691e6dd81173467199de068751a))
* **a11y:** US-5 focus trap, aria-live et suggestions recherche ([c0843c7](https://github.com/tellebma/The-Claude-Codex/commit/c0843c79760d39f01fc03f44b9ae150b299709f4))
* **a11y:** VQO corrections — touch targets, inert backdrop, auto-scroll, aria-label, hover scope ([4e5e8e6](https://github.com/tellebma/The-Claude-Codex/commit/4e5e8e613bfd5185ec39a9ae40810462ebaad7dd))
* add findIndex guard and aria-hidden on decorative icons ([fff9772](https://github.com/tellebma/The-Claude-Codex/commit/fff97724cf418be73a782b0d0f24e35a5cd530d4))
* address code review findings from EPIC audit ([6375d3b](https://github.com/tellebma/The-Claude-Codex/commit/6375d3ba49baa19a350c2eab0b627b5910374c31))
* address code review issues from Batch 1 ([6095f9a](https://github.com/tellebma/The-Claude-Codex/commit/6095f9af9419f65312919a7975a7f074618070f2))
* CI pipeline fixes (Node 22, optional tests, 30% coverage, Docker port) ([6e2b4fc](https://github.com/tellebma/The-Claude-Codex/commit/6e2b4fc2d3289b92b3cc5be19cb8949f786139ea))
* CI uses Node 24 to match local dev environment ([3e6034a](https://github.com/tellebma/The-Claude-Codex/commit/3e6034af0c78b1c7a859137d1c778365c2a95788))
* correct WCAG AA accessibility issues (Epic 1) ([121960d](https://github.com/tellebma/The-Claude-Codex/commit/121960db4aa4f16b77176388fb1ae06341574615))
* corriger type-check CI et optimiser Dependabot ([4624fa7](https://github.com/tellebma/The-Claude-Codex/commit/4624fa7dee860f869d1171efa963d2c0a8d82cc3))
* Docker and Nginx i18n fixes (CSP, locale routing, Node 22) ([b6074b6](https://github.com/tellebma/The-Claude-Codex/commit/b6074b660b24b6e30e53afbc12dc177657aa87d4))
* enable trailingSlash for proper i18n hydration and clean up Nginx ([5fc9fad](https://github.com/tellebma/The-Claude-Codex/commit/5fc9fad209bd857f75da2a11f692482005e2ce68))
* guard getAdjacentPages against findIndex returning -1 in all slug pages ([6f1ee6e](https://github.com/tellebma/The-Claude-Codex/commit/6f1ee6ecaabc021eb9aa7aac477eafefd9030ba3))
* harden nginx security (headers inheritance, rate limiting, nginx 1.28) ([9182950](https://github.com/tellebma/The-Claude-Codex/commit/918295044c0c19b08acb203f9bb4afb7dfdb4902))
* **i18n:** US-6 pages hors i18n, accents et VideoEmbed traduit ([a56117e](https://github.com/tellebma/The-Claude-Codex/commit/a56117e0761258d29bde8267851f8e5ace6f4602))
* prevent index.mdx duplicate routes and fix header nav overflow ([0147ae5](https://github.com/tellebma/The-Claude-Codex/commit/0147ae54d27d2ff3df613c1926467c30d54fb5da))
* replace em dashes with natural French punctuation across all content ([ab53cd8](https://github.com/tellebma/The-Claude-Codex/commit/ab53cd8849127d2e7a30a37438b2f0802def9d17))
* replace unicode escape sequences with actual UTF-8 characters ([ff54f68](https://github.com/tellebma/The-Claude-Codex/commit/ff54f686256a938c6326667e0df1594340460b65))
* resolve i18n hydration with defineRouting, createNavigation, and http-server ([c60f5f4](https://github.com/tellebma/The-Claude-Codex/commit/c60f5f4259d51706901f111aaf0041e8d2935477))
* resolve nginx permission denied in read-only Docker container ([daff41d](https://github.com/tellebma/The-Claude-Codex/commit/daff41d4fc075c9f8131077377618a95304ea399))
* restore lost landing page features from merge (terminal animation, bento grid, scroll indicator) ([1b742e7](https://github.com/tellebma/The-Claude-Codex/commit/1b742e77a6621609b6404fec551a57416e3b0ce1))
* return 204 instead of 404 for RSC prefetch requests ([9a6e621](https://github.com/tellebma/The-Claude-Codex/commit/9a6e621c48151748fd2afa890026abff25196060))
* **style:** Correction image discord / graphQL ([b3b5c4a](https://github.com/tellebma/The-Claude-Codex/commit/b3b5c4a70bc4c1a3ef4efca0d14bdcc61588d55a))
* **test:** corriger les 12 tests cassés — mocks next-intl, nav items, search index ([78a6489](https://github.com/tellebma/The-Claude-Codex/commit/78a648944869b2c23d9b441bfd767f9d0827500d))
* **ui:** retirer max-w-3xl du contenu principal — trop restrictif avec sidebars ([06c498a](https://github.com/tellebma/The-Claude-Codex/commit/06c498a14163f777240dfe04db98be82ab0e4388))
* **ui:** US-1 apply --surface-card-hover on glass-card hover ([c9e5704](https://github.com/tellebma/The-Claude-Codex/commit/c9e5704686118e3a10928f463fdb226c0209fcbf))
* **ui:** US-1 hierarchie visuelle sections et cartes landing ([9d5e1da](https://github.com/tellebma/The-Claude-Codex/commit/9d5e1da60f429b8d5820a425eb84f1def59aa920))
* **ui:** US-7 coherence dark/light pages section getting-started et about ([6342365](https://github.com/tellebma/The-Claude-Codex/commit/63423656553ec34401c4496ed5ec634ab0df24de))
* **ui:** US-9 espacement vertical et responsive landing, footer, MDX ([4077aca](https://github.com/tellebma/The-Claude-Codex/commit/4077acab7141f5bacdb7c55be59a44fc4842f670))
* update Header test to match current navigation structure ([d693a9b](https://github.com/tellebma/The-Claude-Codex/commit/d693a9b4bc35baf4024010a36873ab60ae43e224))
* update Matomo site ID from 1 to 3 ([f879534](https://github.com/tellebma/The-Claude-Codex/commit/f879534112e89812b16aff6d888ee7eec0dc04ca))
* **ux:** sidebar h-full pour que sticky fonctionne dans le flex parent ([5533c9e](https://github.com/tellebma/The-Claude-Codex/commit/5533c9ea10c9a14df0d8a0a80911a0ef075d0d0e))
* **ux:** sidebar sommaire sticky scrollable avec max-h et overflow ([d449026](https://github.com/tellebma/The-Claude-Codex/commit/d449026fefbe0f63e5f29d6c0a438cb91e61430f))
* **ux:** US-11 polish — touch targets, reduced-motion, animation-delay ([427f63a](https://github.com/tellebma/The-Claude-Codex/commit/427f63aec80fcb958f3c40954e358f4a349104d7))
* **ux:** US-3 retirer fausses affordances interactives des cartes ([c84f4a4](https://github.com/tellebma/The-Claude-Codex/commit/c84f4a4f6290d5b568cfa61b3f0a65a39bccf0b7))


### Features

* add 10 downloadable skills and enrich Skills section (Epic 30) ([f628e59](https://github.com/tellebma/The-Claude-Codex/commit/f628e59b040c40e52c0ccb1f2e80efe336163209))
* add advanced section with hooks, headless mode and CI/CD docs (Epic 24) ([185cb1a](https://github.com/tellebma/The-Claude-Codex/commit/185cb1a81f1cc9e9f7893e41348e6192e8ce909d))
* add Agent SDK docs and enrich agents section (Epic 31) ([646867a](https://github.com/tellebma/The-Claude-Codex/commit/646867a92c1d7d434ba75ebf68f13bb1809e0431))
* add complete site with all pages and Docker setup ([f613793](https://github.com/tellebma/The-Claude-Codex/commit/f61379397303018fe6f833dbbe41d8cacd2ade10))
* add cookieless Matomo tracking script in layout (Epic 32) ([8892475](https://github.com/tellebma/The-Claude-Codex/commit/8892475246eb17836d7f984abd5bc0bdf9453ab5))
* add custom 404 page and fix footer (Epic 17) ([ee5393f](https://github.com/tellebma/The-Claude-Codex/commit/ee5393f36752bd1d46d15802a22c4a11edf30b55))
* add custom MCP creation tutorials in TypeScript and Python (Epic 25) ([71df565](https://github.com/tellebma/The-Claude-Codex/commit/71df565e8ac6dc701c505d88b416740d5005522f))
* add dangers, pitfalls and myths section — MCP security, costs, context (Epic 33) ([736b11f](https://github.com/tellebma/The-Claude-Codex/commit/736b11ff847fc9997badc7d80bc7517ca87798a5))
* add enterprise section with security, adoption, TCO and governance (Epic 27) ([63b6d62](https://github.com/tellebma/The-Claude-Codex/commit/63b6d62f061367f66b3eb69f047ccd08931c3528))
* add i18n infrastructure with next-intl v4 (EPIC-1) ([55c9a79](https://github.com/tellebma/The-Claude-Codex/commit/55c9a79049753bbd4157f17305f41d90f7772d94))
* add interactive TCO calculator component for enterprise section (Epic 27) ([484b4c7](https://github.com/tellebma/The-Claude-Codex/commit/484b4c7f998fe92b91a64b3f0fae6e1a3faa7852))
* add language switcher, locale-prefixed links and i18n navigation (EPIC-5) ([e0dafc6](https://github.com/tellebma/The-Claude-Codex/commit/e0dafc638982aa5b4b988fe0538cdf603a00a189))
* add limitations and comparisons section with honest assessments (Epic 29) ([3826adb](https://github.com/tellebma/The-Claude-Codex/commit/3826adb9455d2bbdf0e6c78e1cd4bdcc5bf2350b))
* add locale-aware structured data and SEO metadata (EPIC-3) ([b9e8a6a](https://github.com/tellebma/The-Claude-Codex/commit/b9e8a6aac9609d4ae609b6f6eecbce4440d94cb9))
* add MCP advanced protocol page and enrich best-of pages with limits (Epic 25) ([e1d3ffa](https://github.com/tellebma/The-Claude-Codex/commit/e1d3ffa497604dbc002da6703928d042bb274777))
* add MDX pipeline, content migration, and French accents (Epic 7) ([b2d6942](https://github.com/tellebma/The-Claude-Codex/commit/b2d6942a8009ab1efb52070919bcc5676faf8e32))
* add navigation infrastructure and multi-page architecture (Epic 3) ([e9b8542](https://github.com/tellebma/The-Claude-Codex/commit/e9b85422c98c27987aa0bcbe7d136eaf848ab96a))
* add non-developer use cases with business, stories and no-code guides (Epic 28) ([78d6ef6](https://github.com/tellebma/The-Claude-Codex/commit/78d6ef6a64c6864c05c54b049c2e62b5bc8dde6a))
* add persona-based learning paths for 5 user profiles (Epic 26) ([8715308](https://github.com/tellebma/The-Claude-Codex/commit/87153085597b9f02ec9fbe7ce9f61d805ee34381))
* add SEO infrastructure and complete metadata (Epic 5) ([d478e68](https://github.com/tellebma/The-Claude-Codex/commit/d478e68ba7d112a4ad6d666884dd0651f770c10a))
* add structured data schemas (Organization, FAQ, DefinedTermSet, Course, CollectionPage) ([21549e7](https://github.com/tellebma/The-Claude-Codex/commit/21549e772e706b682d37dd8b4444b34086f2142b))
* add Vision & Future section with 3 pages (Epic 16) ([6efc2ae](https://github.com/tellebma/The-Claude-Codex/commit/6efc2ae048364544b66264c5e049f29165939ab4))
* add visual content components and terminal screenshots (Epic 20) ([79a0e3e](https://github.com/tellebma/The-Claude-Codex/commit/79a0e3e7d3d5f6a26b95a7f4efe139843869e56d))
* ajouter page MCP Profiles (FR/EN) avec navigation et search index ([1aa194c](https://github.com/tellebma/The-Claude-Codex/commit/1aa194cdc996be0927d0d8452707d331154d49d9))
* ajouter semantic-release et afficher la version dans le footer ([673d2f0](https://github.com/tellebma/The-Claude-Codex/commit/673d2f0ece1ed331dba98641ca4f2ee10c092ac2))
* audit credibility and fix fictitious information across plugins/MCP/skills sections (Epic 19) ([00cdca6](https://github.com/tellebma/The-Claude-Codex/commit/00cdca6c100c310e74a636c3d1b661a79a1c5c6d))
* **ci:** ajouter mutation testing avec Stryker Mutator ([667696f](https://github.com/tellebma/The-Claude-Codex/commit/667696fb40df6a2d670777e598f0d5404e841b36))
* complete English translations and internationalize all overview pages (EPIC-5/6) ([0192477](https://github.com/tellebma/The-Claude-Codex/commit/0192477dba25e3edf26ab4f8f1e0bab5c3ab6504))
* complete EPICs 1, 3, 6 — clickable cards, lazy loading, FAQPage ([5d4ea92](https://github.com/tellebma/The-Claude-Codex/commit/5d4ea92f04fef20ded601539184f5cf2ba87595b))
* complete i18n for remaining UI components (EPIC-2 final) ([a15c548](https://github.com/tellebma/The-Claude-Codex/commit/a15c5484f87620795a3072a0bae86b295d088f57))
* complete prompting section overhaul with 4 new pages and 2 enriched (Epic 22) ([8ace87d](https://github.com/tellebma/The-Claude-Codex/commit/8ace87da38b77f2720315cdff8d4dbc55773faf0))
* create Agents section with 5 MDX pages + overview refonte (Epic 13) ([7bffc97](https://github.com/tellebma/The-Claude-Codex/commit/7bffc979f07d6d3797b68891d80262db98c3f4ec))
* create beginner pathway with prerequisites, glossary, FAQ and pricing (Epic 21) ([a291afc](https://github.com/tellebma/The-Claude-Codex/commit/a291afc98b0b806c04fbdf20c45574f45865314f))
* create Getting Started section with 4 MDX pages (Epic 9) ([ba9628a](https://github.com/tellebma/The-Claude-Codex/commit/ba9628a903de73f43ebfb34c9fdd3c167551d7ec))
* create interactive configurator wizard with 10 presets (Epic 15) ([ef0fafb](https://github.com/tellebma/The-Claude-Codex/commit/ef0fafb18bd7497f66b3649a60b74242fb71ceb0))
* create MCP section with 6 MDX pages + fix MDX rendering (Epic 10) ([f808b2d](https://github.com/tellebma/The-Claude-Codex/commit/f808b2d6314b01d85100897913148d65960bf239))
* create Plugins section with 5 MDX pages (Epic 11) ([e12da26](https://github.com/tellebma/The-Claude-Codex/commit/e12da26118290db5a8902009d36a76b35b61827b))
* create Skills section with 4 MDX pages (Epic 12) ([fed8ab8](https://github.com/tellebma/The-Claude-Codex/commit/fed8ab81500ff5602f50bc6e4d684d79d765561f))
* create technical reference section with cheatsheet, CLI, settings and env docs (Epic 23) ([4187b50](https://github.com/tellebma/The-Claude-Codex/commit/4187b50b5e58cab450086dba4f51781f5da04940))
* enrichir TCO, ajouter backlog configurateur et UX responsive ([d53dfc0](https://github.com/tellebma/The-Claude-Codex/commit/d53dfc0bee7f2bea40e95bb7ddd60142def13f55))
* EPIC 5 — UI components & animations (9 stories) ([f986cae](https://github.com/tellebma/The-Claude-Codex/commit/f986cae46a9e65e0b9e05105dd637df51eab9312))
* EPIC 7 — responsive & mobile (footer, nav, scroll indicator) ([c507a79](https://github.com/tellebma/The-Claude-Codex/commit/c507a79ce10ec4c5406135048de32a6036151b5e))
* EPIC 8 — content & SEO semantics (6 stories, EPIC 100% complete) ([50f1c44](https://github.com/tellebma/The-Claude-Codex/commit/50f1c44f2199d73fe3c13006533b85b838d52f6c))
* extract hardcoded UI strings to next-intl translations (EPIC-2) ([5da650f](https://github.com/tellebma/The-Claude-Codex/commit/5da650f8720c0e780c92b71c5571f601e065987d))
* fix content pages layout + add prompting section nav ([01d8db2](https://github.com/tellebma/The-Claude-Codex/commit/01d8db2629a65f8005f793698ebf2888b54dbc66))
* fix critical design system bugs (Epic 2) ([867bd5c](https://github.com/tellebma/The-Claude-Codex/commit/867bd5ca824c283da8e9dadb8cf3833642e75083))
* improve design system, contrast, focus states and hero line-height ([4d63db6](https://github.com/tellebma/The-Claude-Codex/commit/4d63db685d8797ce07a7f3b886e36e0ccaec6a95))
* improve light mode and polish design system (Epic 4) ([8b1727c](https://github.com/tellebma/The-Claude-Codex/commit/8b1727c0dde533b7f2e6b749bc8500a0828d1c8e))
* optimize performance and build (Epic 6) ([2ef33ae](https://github.com/tellebma/The-Claude-Codex/commit/2ef33ae6f0aa71ee6bae797cc633eb802d4ca9c8))
* optimize performance, add animations, fix Nginx headers (Epic 6) ([d743745](https://github.com/tellebma/The-Claude-Codex/commit/d743745849b6249398e206a0e3c75d0f364891cc))
* redesign landing page with configurator teaser and French accents (Epic 8) ([940a233](https://github.com/tellebma/The-Claude-Codex/commit/940a2337e744ddca1a85963d6a278732af70e44d))
* restructure MDX content for i18n and add English translations (EPIC-4) ([c62baca](https://github.com/tellebma/The-Claude-Codex/commit/c62baca2b10fe17f115e923e4a86806a802c527b))
* shorten SEO titles and add BreadcrumbList to glossary ([3a8f613](https://github.com/tellebma/The-Claude-Codex/commit/3a8f613dcb61c8a7005e216e70aacc7df1b7a1ba))
* **ux:** US-8 indicateur de progression parcours dans la sidebar ([5891509](https://github.com/tellebma/The-Claude-Codex/commit/5891509d478bcb6c2c149f5b5a5876bb3ec9fbc6))
* WCAG 2.1 AA accessibility improvements ([f501090](https://github.com/tellebma/The-Claude-Codex/commit/f501090582115b1df91c22a16f2c9daf92514298))
