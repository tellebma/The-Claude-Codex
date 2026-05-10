/* global React */

// =========== Sample articles (replaceable data) ===========
const ARTICLES = [
{
  id: "a1",
  cat: "MCP",
  catColor: "#06b6d4",
  date: "22 avr. 2026",
  readTime: "8 min",
  title: "Construire un serveur MCP en TypeScript : du zéro au déploiement",
  desc: "Un tutoriel complet pour écrire votre premier serveur Model Context Protocol et l'intégrer à Claude Code, étape par étape.",
  author: "Marion Tellebma",
  role: "Mainteneur",
  avatar: "#06b6d4",
  glyph: "mcp",
  featured: true
},
{
  id: "a2",
  cat: "Skills",
  catColor: "#f59e0b",
  date: "18 avr. 2026",
  readTime: "6 min",
  title: "10 Skills essentiels pour transformer Claude en collaborateur senior",
  desc: "La sélection communautaire du mois : review de code, génération de tests, audit de sécurité et bien d'autres.",
  author: "Paul Dubois",
  role: "Contributeur",
  avatar: "#f59e0b"
},
{
  id: "a3",
  cat: "Prompting",
  catColor: "#7c3aed",
  date: "14 avr. 2026",
  readTime: "5 min",
  title: "CLAUDE.md : l'anatomie d'un fichier de contexte parfait",
  desc: "Structure, anti-patterns et exemples concrets tirés de projets open-source. Votre fichier CLAUDE.md en 20 lignes.",
  author: "Sarah Nakamura",
  role: "Éditrice",
  avatar: "#7c3aed"
},
{
  id: "a4",
  cat: "Agents",
  catColor: "#15803d",
  date: "09 avr. 2026",
  readTime: "12 min",
  title: "Orchestrer 5 agents autonomes avec des hooks personnalisés",
  desc: "Comment faire collaborer plusieurs agents Claude Code sur un même projet sans exploser votre facture API.",
  author: "Thomas Richard",
  role: "Community",
  avatar: "#15803d"
},
{
  id: "a5",
  cat: "Workflow",
  catColor: "#be123c",
  date: "02 avr. 2026",
  readTime: "7 min",
  title: "Git + Claude Code : le workflow PR-first qui double votre vitesse",
  desc: "Feature branches, conventional commits, revue par l'IA : le setup qui tourne dans 3 startups françaises.",
  author: "Élise Martin",
  role: "Contributrice",
  avatar: "#be123c"
},
{
  id: "a6",
  cat: "Actualité",
  catColor: "#1d4ed8",
  date: "28 mars 2026",
  readTime: "4 min",
  title: "Claude Code 0.5 : ce qui change vraiment pour votre quotidien",
  desc: "Analyse des nouveautés — memory persistante, sandbox amélioré et le retour du mode plan.",
  author: "Marion Tellebma",
  role: "Mainteneur",
  avatar: "#06b6d4"
}];


// =========== Hero variants ===========
const HERO_TERMINAL_LINES = [
{ t: "muted", c: "$ claude" },
{ t: "muted", c: "> Refactor ce service Python en async/await" },
{ t: "muted", c: "  et écris-moi les tests associés." },
{ t: "", c: " " },
{ t: "ok", c: "● Analyse du code existant...", prefix: "" },
{ t: "dim", c: "  → 3 fichiers, 412 lignes, 14 fonctions" },
{ t: "ok", c: "● Plan de refactor généré", prefix: "" },
{ t: "dim", c: "  → 7 étapes, impact estimé: faible" },
{ t: "cyan", c: "→ Application des changements...", prefix: "" },
{ t: "amber", c: "  edit  services/payment.py" },
{ t: "amber", c: "  edit  services/user.py" },
{ t: "amber", c: "  new   tests/test_payment.py" },
{ t: "ok", c: "● Tous les tests passent (32/32)", prefix: "" },
{ t: "bold", c: " ", prefix: "" }];


function useTypewriter(lines, speed = 22, lineDelay = 120) {
  const [rendered, setRendered] = React.useState([]);
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    let cancel = false;
    const run = async () => {
      const out = [];
      for (let i = 0; i < lines.length; i++) {
        if (cancel) return;
        const line = lines[i];
        const chars = line.c;
        for (let j = 0; j <= chars.length; j++) {
          if (cancel) return;
          out[i] = { ...line, c: chars.slice(0, j) };
          setRendered([...out]);
          await new Promise((r) => setTimeout(r, speed));
        }
        await new Promise((r) => setTimeout(r, lineDelay));
      }
      setDone(true);
    };
    run();
    return () => {cancel = true;};
  }, []);
  return { rendered, done };
}

function HeroTerminal() {
  const { rendered, done } = useTypewriter(HERO_TERMINAL_LINES, 14, 90);
  return (
    <div className="lp-terminal">
      <div className="lp-terminal-bar">
        <span className="cc-dot cc-dot-r" />
        <span className="cc-dot cc-dot-y" />
        <span className="cc-dot cc-dot-g" />
        <span className="lp-terminal-label">
          <span className="lp-pulse" /> ~/the-claude-codex — claude
        </span>
      </div>
      <div className="lp-terminal-body">
        {rendered.map((l, i) =>
        <div key={i} className="lp-row">
            <span className={l.t}>{l.c || "\u00a0"}</span>
            {!done && i === rendered.length - 1 && <span className="lp-cursor" />}
          </div>
        )}
      </div>
    </div>);

}

function HeroSplit() {
  return (
    <div className="lp-hero-inner lp-hero-split">
      <div className="lp-hero-left">
        <span className="lp-hero-pill">
          <span className="lp-pill-dot"><Icon name="sparkles" size={11} /></span>
          v1.3.0 · nouveau parcours <strong style={{ fontWeight: 600 }}>Agents</strong> publié
        </span>
        <h1 className="lp-hero-title">
          <span className="lp-stack">Maîtrisez</span>
          <span className="lp-stack">Claude Code</span>
          <span className="lp-stack cc-text-gradient">en partant de zéro !</span>
        </h1>
        <p className="lp-hero-sub">Le guide claude code écrit par vous pour vous


        </p>
        <div className="lp-hero-cta">
          <button className="cc-btn-primary">
            Commencer le guide <Icon name="arrow-right" size={16} />
          </button>
          <button className="cc-btn-secondary">
            <Icon name="book-open" size={16} /> Lire les articles
          </button>
        </div>
        <div className="lp-hero-meta">
          <span className="lp-meta-item">
            <Icon name="file-text" size={16} />
            <span><strong>84</strong> articles</span>
          </span>
          <span className="lp-meta-sep" />
          <span className="lp-meta-item">
            <Icon name="users" size={16} />
            <span><strong>42</strong> contributeurs</span>
          </span>
          <span className="lp-meta-sep" />
          <span className="lp-meta-item">
            <Icon name="git-branch" size={16} />
            <span><strong>2 k</strong> ⭐ sur GitHub</span>
          </span>
        </div>
      </div>
      <div className="lp-hero-right">
        <HeroTerminal />
        <div className="lp-chip-orbit lp-chip-a">
          <span className="lp-chip-ic" style={{ background: "linear-gradient(135deg,#06b6d4,#0891b2)" }}>
            <Icon name="puzzle" size={13} />
          </span>
          12 MCP officiels
        </div>
        <div className="lp-chip-orbit lp-chip-b">
          <span className="lp-chip-ic" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
            <Icon name="sparkles" size={13} />
          </span>
          Skills prêts à l'emploi
        </div>
        <div className="lp-chip-orbit lp-chip-c">
          <span className="lp-chip-ic" style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)" }}>
            <Icon name="layers" size={13} />
          </span>
          Parcours guidés
        </div>
      </div>
    </div>);

}

function HeroXXL() {
  return (
    <>
      <div className="lp-hero-inner lp-hero-xxl">
        <span className="lp-hero-pill">
          <span className="lp-pill-dot"><Icon name="sparkles" size={11} /></span>
          84 articles · 42 contributeurs · open-source
        </span>
        <h1 className="lp-hero-title">
          <span className="lp-stack">Tout pour maîtriser</span>
          <span className="lp-stack cc-text-gradient">Claude Code.</span>
        </h1>
        <p className="lp-hero-sub">
          La référence francophone — articles, parcours, configurateur.
          Créée par et pour ceux qui codent avec l'IA.
        </p>
        <div className="lp-hero-cta">
          <button className="cc-btn-primary">
            Commencer le guide <Icon name="arrow-right" size={16} />
          </button>
          <button className="cc-btn-secondary">
            <Icon name="book-open" size={16} /> Voir les articles
          </button>
        </div>
      </div>
      <div className="lp-hero-xxl-ticker">
        <div className="lp-ticker-track">
          {[...Array(2)].flatMap((_, k) =>
          ARTICLES.concat(ARTICLES.slice(0, 3)).map((a, i) =>
          <span key={k + "-" + i} className="lp-ticker-item">
                <span className="lp-dot" />
                <span style={{ color: a.catColor, fontWeight: 600 }}>{a.cat}</span>
                <span>{a.title}</span>
              </span>
          )
          )}
        </div>
      </div>
    </>);

}

function HeroInline() {
  const [featured, ...rest] = ARTICLES;
  const shown = [featured, ...rest].slice(0, 4);
  return (
    <div className="lp-hero-inner lp-hero-inline">
      <div className="lp-hero-left">
        <span className="lp-hero-pill">
          <span className="lp-pill-dot"><Icon name="sparkles" size={11} /></span>
          Nouveau cette semaine · 3 articles
        </span>
        <h1 className="lp-hero-title">
          <span className="lp-stack">La référence</span>
          <span className="lp-stack cc-text-gradient">Claude Code</span>
          <span className="lp-stack">se met à jour chaque semaine.</span>
        </h1>
        <p className="lp-hero-sub">
          Guides, parcours et articles fraîchement publiés par la communauté francophone.
          Le tout, gratuit et sans tracking.
        </p>
        <div className="lp-hero-cta">
          <button className="cc-btn-primary">
            Commencer le guide <Icon name="arrow-right" size={16} />
          </button>
          <button className="cc-btn-secondary">
            <Icon name="rss" size={16} /> S'abonner au flux
          </button>
        </div>
      </div>
      <aside className="lp-inline-articles">
        <div className="lp-inline-articles-head">
          <span className="lp-live">
            <span className="lp-live-dot" /> Derniers articles
          </span>
          <a href="#articles" className="lp-inline-articles-link">
            Tout voir <Icon name="arrow-right" size={12} />
          </a>
        </div>
        {shown.map((a, i) =>
        <a key={a.id} href="#" className="lp-inline-article">
            <span className="lp-inline-article-num">{String(i + 1).padStart(2, "0")}</span>
            <div className="lp-inline-article-body">
              <div className="lp-inline-article-meta">
                <span className="lp-inline-article-cat" style={{ color: a.catColor }}>{a.cat}</span>
                <span>·</span>
                <span>{a.date}</span>
              </div>
              <h3 className="lp-inline-article-title">{a.title}</h3>
            </div>
          </a>
        )}
      </aside>
    </div>);

}

function Hero({ variant }) {
  return (
    <section className="lp-hero">
      <div className="lp-hero-bg" />
      <div className="lp-hero-grid" />
      {variant === "xxl" && <HeroXXL />}
      {variant === "inline" && <HeroInline />}
      {(!variant || variant === "split") && <HeroSplit />}
    </section>);

}

// =========== Trust bar ===========
function TrustBar() {
  return (
    <div className="lp-trust">
      <div className="lp-trust-inner">
        <span className="lp-trust-label">Intégrations couvertes</span>
        <div className="lp-trust-items">
          <span className="lp-trust-item"><Icon name="github" size={14} /> GitHub</span>
          <span className="lp-trust-item"><Icon name="slack" size={14} /> Slack</span>
          <span className="lp-trust-item"><Icon name="database" size={14} /> Postgres</span>
          <span className="lp-trust-item"><Icon name="figma" size={14} /> Figma</span>
          <span className="lp-trust-item"><Icon name="mail" size={14} /> Gmail</span>
          <span className="lp-trust-item"><Icon name="file-text" size={14} /> Notion</span>
          <span className="lp-trust-item"><Icon name="trello" size={14} /> Linear</span>
          <span className="lp-trust-item"><Icon name="terminal" size={14} /> Shell</span>
        </div>
      </div>
    </div>);

}

// =========== Articles section ===========
function ArticleGlyph({ kind = "mcp" }) {
  if (kind === "mcp") {
    return (
      <svg className="glyph" width="120" height="90" viewBox="0 0 120 90" fill="none">
        <circle cx="24" cy="24" r="14" stroke="#22d3ee" strokeWidth="1.5" fill="none" opacity="0.9" />
        <circle cx="96" cy="24" r="14" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.9" />
        <circle cx="60" cy="70" r="14" stroke="#c4b5fd" strokeWidth="1.5" fill="none" opacity="0.9" />
        <line x1="24" y1="24" x2="96" y2="24" stroke="white" strokeWidth="1" opacity="0.4" />
        <line x1="24" y1="24" x2="60" y2="70" stroke="white" strokeWidth="1" opacity="0.4" />
        <line x1="96" y1="24" x2="60" y2="70" stroke="white" strokeWidth="1" opacity="0.4" />
        <circle cx="60" cy="24" r="3" fill="#22d3ee" />
        <circle cx="42" cy="47" r="3" fill="#fbbf24" />
        <circle cx="78" cy="47" r="3" fill="#c4b5fd" />
      </svg>);

  }
  return null;
}

function ArticleHeroCard({ a }) {
  return (
    <article className="lp-article-hero">
      <div className="lp-article-hero-visual">
        <div className="lp-article-hero-cat">
          <span className="lp-dot-cat" /> À la une · {a.cat}
        </div>
        <ArticleGlyph kind="mcp" />
      </div>
      <div className="lp-article-hero-body">
        <div className="lp-article-hero-meta">
          <span>{a.date}</span>
          <span className="dot" />
          <span>{a.readTime} de lecture</span>
        </div>
        <h3 className="lp-article-hero-title">{a.title}</h3>
        <p className="lp-article-hero-desc">{a.desc}</p>
        <div className="lp-article-hero-foot">
          <div className="lp-author">
            <span className="lp-avatar" style={{ background: a.avatar }}>
              {a.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
            <div>
              <div className="lp-author-name">{a.author}</div>
              <div className="lp-author-role">{a.role}</div>
            </div>
          </div>
          <span className="lp-read-arrow">
            Lire l'article <Icon name="arrow-right" size={14} />
          </span>
        </div>
      </div>
    </article>);

}

function ArticleSmallCard({ a }) {
  return (
    <article
      className="lp-article-sm"
      style={{ "--accent-color": a.catColor }}>
      
      <div className="lp-article-sm-head">
        <span className="lp-article-sm-cat" style={{ color: a.catColor }}>
          <span className="sq" style={{ background: a.catColor }} /> {a.cat}
        </span>
        <span className="lp-article-sm-date">{a.date}</span>
      </div>
      <h3 className="lp-article-sm-title">{a.title}</h3>
      <p className="lp-article-sm-desc">{a.desc}</p>
      <div className="lp-article-sm-foot">
        <div className="lp-author">
          <span className="lp-avatar" style={{ background: a.avatar, width: 24, height: 24, fontSize: 10 }}>
            {a.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </span>
          <span className="lp-author-name" style={{ fontSize: 12 }}>{a.author}</span>
        </div>
        <span className="lp-read-time">
          <Icon name="clock" size={12} /> {a.readTime}
        </span>
      </div>
    </article>);

}

function ArticlesSection({ layout = "hero+2" }) {
  const [filter, setFilter] = React.useState("Tous");
  const cats = ["Tous", "MCP", "Skills", "Prompting", "Agents", "Workflow"];
  const filtered = filter === "Tous" ? ARTICLES : ARTICLES.filter((a) => a.cat === filter);
  const [featured, ...rest] = filtered;

  return (
    <section className="lp-articles" id="articles">
      <div className="lp-articles-inner">
        <div className="lp-articles-head">
          <div className="lp-articles-head-left">
            <div className="lp-articles-eyebrow">
              <span style={{
                display: "inline-block", width: 24, height: 2,
                background: "currentColor", borderRadius: 2, opacity: 0.6
              }} />
              <span>Journal</span>
            </div>
            <h2 className="lp-articles-title">
              Les derniers articles de <span className="cc-text-gradient">la communauté</span>
            </h2>
            <p className="lp-articles-desc">
              Retours d'expérience, tutoriels, analyses — mis à jour chaque semaine.
            </p>
          </div>
          <div className="lp-articles-actions">
            {cats.map((c) =>
            <button
              key={c}
              className={"lp-articles-filter" + (filter === c ? " is-active" : "")}
              onClick={() => setFilter(c)}>
              
                {c}
              </button>
            )}
          </div>
        </div>

        {layout === "grid3" ?
        <div className="lp-articles-grid-3">
            {filtered.slice(0, 6).map((a) => <ArticleSmallCard key={a.id} a={a} />)}
          </div> :

        <div className="lp-articles-grid">
            {featured && <ArticleHeroCard a={featured} />}
            <div className="lp-article-stack">
              {rest.slice(0, 2).map((a) => <ArticleSmallCard key={a.id} a={a} />)}
            </div>
          </div>
        }

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="cc-btn-secondary">
            Parcourir les {ARTICLES.length * 14} articles <Icon name="arrow-right" size={14} />
          </button>
        </div>
      </div>
    </section>);

}

// =========== Stats ===========
function StatsBand() {
  return (
    <section className="lp-stats">
      <div className="lp-stats-inner">
        <div className="lp-stat">
          <p className="lp-stat-value"><span className="lp-gradient-num">84</span></p>
          <p className="lp-stat-label">articles publiés</p>
        </div>
        <div className="lp-stat">
          <p className="lp-stat-value"><span className="lp-gradient-num">42</span></p>
          <p className="lp-stat-label">contributeurs</p>
        </div>
        <div className="lp-stat">
          <p className="lp-stat-value"><span className="lp-gradient-num">12</span></p>
          <p className="lp-stat-label">parcours guidés</p>
        </div>
        <div className="lp-stat">
          <p className="lp-stat-value"><span className="lp-gradient-num">0€</span></p>
          <p className="lp-stat-label">pour toujours · sans tracking</p>
        </div>
      </div>
    </section>);

}

// =========== Possibilities (existing Feature grid, simplified) ===========
function PossibilitiesSection() {
  return (
    <section className="cc-section cc-bg-soft">
      <div className="cc-section-head">
        <span className="cc-eyebrow-pill">Possibilités</span>
        <h2 className="cc-section-title">
          Bien plus qu'un <span className="cc-text-gradient">assistant code</span>
        </h2>
        <p className="cc-section-desc">
          Claude Code transforme votre manière de travailler. Découvrez ce qu'il peut faire, dès aujourd'hui.
        </p>
      </div>
      <div className="cc-feature-grid" style={{ maxWidth: 1240 }}>
        <FeatureCard icon="globe" title="Créer un site web" desc="Landing page, e-commerce, app full-stack — génère, structure et déploie." g="teal" />
        <FeatureCard icon="puzzle" title="Connecter vos outils" desc="Via MCP : Gmail, Slack, GitHub, bases de données, à portée de prompt." g="purple" />
        <FeatureCard icon="rocket" title="Déployer en prod" desc="Docker, CI/CD, monitoring — Claude gère votre infra de A à Z." g="green" />
        <FeatureCard icon="zap" title="Automatiser le répétitif" desc="Scripts, agents autonomes, jobs récurrents — l'IA prend le relais." g="rose" />
        <FeatureCard icon="file-text" title="Générer des documents" desc="Rapports, présentations, doc technique — structure vos contenus." g="amber" />
        <FeatureCard icon="palette" title="Designer des interfaces" desc="Brief, screenshot ou Figma — l'UI moderne, directement en code." g="blue" />
      </div>
    </section>);

}
function FeatureCard({ icon, title, desc, g }) {
  return (
    <div className="cc-feature-card cc-card" data-interactive>
      <div className={"cc-feature-icon ic-" + g}><Icon name={icon} size={22} /></div>
      <h3 className="cc-feature-title">{title}</h3>
      <p className="cc-feature-desc">{desc}</p>
    </div>);

}

// =========== Paths ===========
function PathsSection() {
  return (
    <section className="cc-section" style={{ background: "#ffffff" }}>
      <div className="cc-section-head">
        <span className="cc-eyebrow-pill">Parcours</span>
        <h2 className="cc-section-title">
          Choisissez votre <span className="cc-text-gradient">chemin</span>
        </h2>
        <p className="cc-section-desc">
          Trois parcours guidés, du premier prompt à la maîtrise complète.
        </p>
      </div>
      <div className="cc-paths-grid" style={{ maxWidth: 1240 }}>
        <PathCard color="teal" icon="sprout" level="Débutant" title="Premiers pas"
        desc="Installez Claude Code et créez votre premier projet en moins d'une heure."
        items={["Qu'est-ce que Claude Code ?", "Installation pas à pas", "Votre premier projet", "Les bonnes pratiques"]} />
        <PathCard color="amber" icon="zap" level="Intermédiaire" title="Maîtriser le prompting"
        desc="Formulez des demandes précises, gérez le contexte, évitez les pièges."
        items={["L'art de la directive", "Templates de prompts", "CLAUDE.md avancé", "Skills personnalisés"]} />
        <PathCard color="purple" icon="layers" level="Avancé" title="Architecte IA"
        desc="Agents autonomes, orchestration MCP, et déploiement en production."
        items={["MCP avancés et customs", "Agents et orchestration", "Hooks et automatisations", "Monitoring & sécurité"]} />
      </div>
    </section>);

}
function PathCard({ color, icon, level, title, desc, items }) {
  return (
    <div className={"cc-path-card cc-card path-" + color}>
      <div className={"cc-path-icon ic-" + color}><Icon name={icon} size={22} /></div>
      <span className="cc-path-level">{level}</span>
      <h3 className="cc-path-title">{title}</h3>
      <p className="cc-path-desc">{desc}</p>
      <ul className="cc-path-items">
        {items.map((it, i) =>
        <li key={i}><Icon name="check" size={14} stroke={2.5} /><span>{it}</span></li>
        )}
      </ul>
      <button className="cc-path-cta">
        Commencer ce parcours <Icon name="arrow-right" size={14} />
      </button>
    </div>);

}

// =========== CTA final ===========
function CtaFinal() {
  return (
    <section className="lp-cta-final">
      <div className="lp-cta-inner">
        <span className="lp-cta-badge">
          <Icon name="heart" size={14} /> Open-source · MIT + CC BY-NC-SA
        </span>
        <h2 className="lp-cta-title">
          Prêt à coder avec <span className="cc-text-gradient">Claude Code ?</span>
        </h2>
        <p className="lp-cta-sub">
          Rejoignez 42 contributeurs et des milliers de lecteurs.
          Zéro paywall, zéro tracking, juste du savoir partagé.
        </p>
        <div className="lp-hero-cta" style={{ justifyContent: "center" }}>
          <button className="cc-btn-primary">
            Commencer le guide <Icon name="arrow-right" size={16} />
          </button>
          <button className="cc-btn-secondary">
            <Icon name="git-branch" size={16} /> Contribuer sur GitHub
          </button>
        </div>
      </div>
    </section>);

}

// =========== Footer (compact) ===========
function Footer() {
  return (
    <footer className="cc-footer">
      <div className="cc-footer-inner">
        <div className="cc-footer-grid">
          <div className="cc-footer-brand">
            <a className="cc-brand" href="#"><Logo size="sm" /><span className="cc-wordmark">The Claude <span className="cc-text-gradient">Codex</span></span></a>
            <p className="cc-footer-tag">
              Le guide de référence gratuit pour maîtriser Claude Code. Créé par la communauté, pour la communauté.
              Pas de paywall, pas de tracking, juste du savoir partagé.
            </p>
          </div>
          <FooterCol title="Guides" items={["Démarrer", "MCP", "Skills", "Prompting", "Agents", "Entreprise"]} />
          <FooterCol title="Articles" items={["Derniers publiés", "Par catégorie", "Contribuer", "Flux RSS", "Newsletter"]} />
          <FooterCol title="Ressources" items={["Configurateur", "Glossaire", "À propos", "GitHub", "License MIT"]} />
        </div>
        <div className="cc-footer-bottom">
          <p className="cc-footer-copy">© 2026 The Claude Codex · Projet open-source.</p>
          <div className="cc-footer-meta">
            <span className="cc-version">v1.3.0</span>
            <a className="cc-footer-link" href="#"><Icon name="git-branch" size={16} /> GitHub</a>
          </div>
        </div>
      </div>
    </footer>);

}
function FooterCol({ title, items }) {
  return (
    <div>
      <p className="cc-footer-h">{title}</p>
      <ul className="cc-footer-list">
        {items.map((it) => <li key={it}><a className="cc-footer-link" href="#">{it}</a></li>)}
      </ul>
    </div>);

}

Object.assign(window, {
  Hero, ArticlesSection, StatsBand, PossibilitiesSection, PathsSection, CtaFinal, Footer, TrustBar
});