/* global React */

const ARTICLE = {
  cat: "Sécurité",
  title: "Clé API Anthropic fuitée ?",
  titleHL: "Plan d'action en 5 étapes",
  lead: "Votre clé API Anthropic sk-ant a fuité dans un commit, screenshot ou log ? Révoquez-la maintenant, faites la rotation, auditez les dégâts. Guide de récupération.",
  author: "Marion Tellebma",
  role: "Mainteneur · Sécurité",
  avatar: "#dc2626",
  publishedAt: "20 avril 2026",
  updatedAt: "23 avril 2026",
  readTime: "9 min",
};

const TOC = [
  { id: "checklist", label: "Checklist d'urgence" },
  { id: "origines", label: "D'où vient la fuite ?" },
  { id: "git", label: "Nettoyer l'historique Git" },
  { id: "audit", label: "Auditer l'impact" },
  { id: "prevention", label: "Prévention" },
  { id: "faq", label: "Questions fréquentes" },
  { id: "next", label: "Prochaines étapes" },
];

// =========== Reading progress ===========
function useReadingProgress() {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const scrolled = h.scrollTop || b.scrollTop;
      const max = (h.scrollHeight || b.scrollHeight) - h.clientHeight;
      setPct(max > 0 ? Math.min(100, (scrolled / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return pct;
}

// =========== Active TOC item ===========
function useActiveSection(ids) {
  const [active, setActive] = React.useState(ids[0]);
  React.useEffect(() => {
    const handler = () => {
      const offset = 120;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) current = id;
      }
      setActive(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids.join(",")]);
  return active;
}

// =========== Sub-components ===========
function Alert({ kind = "info", title, children, icon }) {
  const ic = icon || (kind === "urgent" ? "alert-octagon" : kind === "warning" ? "alert-triangle" : "info");
  return (
    <aside className={"art-alert is-" + kind}>
      <div className="art-alert-ic"><Icon name={ic} size={20}/></div>
      <div className="art-alert-body">
        {title && <p className="art-alert-title">{title}</p>}
        <div className="art-alert-text">{children}</div>
      </div>
    </aside>
  );
}

function CodeBlock({ filename, lang = "bash", children }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="art-codeblock">
      <div className="art-codeblock-bar">
        <span className="art-codeblock-bar-left">
          <Icon name="terminal" size={13}/>
          <span>{filename || "shell"}</span>
          <span className="lang">{lang}</span>
        </span>
        <button className="art-codeblock-copy" onClick={() => { setCopied(true); setTimeout(()=>setCopied(false), 1500); }}>
          <Icon name={copied ? "check" : "clipboard"} size={12}/>
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <div className="art-step">
      <div className="art-step-num">{n}</div>
      <div className="art-step-body">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function FaqItem({ q, children, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={"art-faq-item" + (open ? " is-open" : "")}>
      <button className="art-faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span className="chevron"><Icon name="chevron-down" size={16}/></span>
      </button>
      {open && <div className="art-faq-a">{children}</div>}
    </div>
  );
}

// =========== Main page ===========
function ArticlePage() {
  const progress = useReadingProgress();
  const active = useActiveSection(TOC.map(t => t.id));

  return (
    <div className="art-page">
      <div className="art-progress"><div className="art-progress-fill" style={{ width: progress + "%" }}/></div>

      {/* Sub-nav */}
      <div className="art-subnav">
        <div className="art-subnav-inner">
          <nav className="art-crumbs">
            <a href="#">Accueil</a>
            <Icon name="chevron-right" size={12} style={{ opacity: 0.4 }}/>
            <a href="#">Contenus</a>
            <Icon name="chevron-right" size={12} style={{ opacity: 0.4 }}/>
            <span className="current">Fuite de clé API</span>
          </nav>
          <div className="art-lang">
            <a href="#" className="is-active">FR</a>
            <a href="#">EN</a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <header className="art-hero">
        <div className="art-hero-inner">
          <span className="art-cat-pill">
            <span className="dot"/> {ARTICLE.cat}
          </span>
          <h1 className="art-title">
            {ARTICLE.title}<br/>
            <span className="hl">{ARTICLE.titleHL}</span>
          </h1>
          <p className="art-lead">{ARTICLE.lead}</p>
          <div className="art-meta">
            <div className="art-meta-author">
              <span className="lp-avatar" style={{ background: ARTICLE.avatar }}>
                {ARTICLE.author.split(" ").map(n => n[0]).join("").slice(0,2)}
              </span>
              <div>
                <span className="name">{ARTICLE.author}</span>
                <span className="role">{ARTICLE.role}</span>
              </div>
            </div>
            <div className="art-meta-dates">
              <span className="art-meta-date">
                <Icon name="calendar" size={13}/> Publié {ARTICLE.publishedAt}
              </span>
              <span className="art-meta-date">
                <Icon name="refresh-cw" size={13}/> Mis à jour {ARTICLE.updatedAt}
              </span>
              <span className="art-meta-date">
                <Icon name="clock" size={13}/> {ARTICLE.readTime} de lecture
              </span>
            </div>
            <div className="art-meta-actions">
              <button className="art-icon-btn" aria-label="Partager"><Icon name="share-2" size={16}/></button>
              <button className="art-icon-btn" aria-label="Bookmark"><Icon name="bookmark" size={16}/></button>
              <button className="art-icon-btn" aria-label="Copier le lien"><Icon name="link" size={16}/></button>
            </div>
          </div>
        </div>
      </header>

      {/* Shell */}
      <div className="art-shell">

        {/* Left rail */}
        <aside className="art-spacer-left">
          <div className="art-share-rail">
            <span className="label">Partager</span>
            <button aria-label="X / Twitter"><Icon name="twitter" size={16}/></button>
            <button aria-label="LinkedIn"><Icon name="linkedin" size={16}/></button>
            <button aria-label="Hacker News"><Icon name="hash" size={16}/></button>
            <button aria-label="Copier le lien"><Icon name="link-2" size={16}/></button>
          </div>
        </aside>

        {/* Article body */}
        <article className="art-body">
          <Alert kind="urgent" title="Agissez dans les 5 prochaines minutes" icon="alert-octagon">
            Une clé API compromise peut être exploitée par des bots automatisés <strong>en quelques minutes</strong> après sa découverte. Chaque seconde compte. Allez directement à la checklist ci-dessous, lisez le reste ensuite.
          </Alert>

          <h2 id="checklist">La checklist d'urgence en 5 minutes</h2>
          <p>Faites ces étapes dans l'ordre, maintenant.</p>

          <Step n="1" title="Révoquer la clé compromise">
            <p>Allez sur <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">console.anthropic.com/settings/keys</a>, trouvez la clé compromise, et cliquez sur <strong>Revoke</strong>. La clé cesse de fonctionner immédiatement.</p>
            <p>Si vous n'êtes pas sûr de quelle clé a fuité, révoquez toutes celles dont vous ne pouvez pas tracer l'usage. Vous pourrez en générer de nouvelles juste après.</p>
          </Step>

          <Step n="2" title="Générer une nouvelle clé">
            <p>Sur la même page, cliquez sur <strong>Create Key</strong>. Donnez-lui un nom descriptif pour pouvoir l'identifier plus tard (par exemple : <code>prod-server-2026-04</code> ou <code>github-actions-deploy</code>).</p>
            <p>Copiez la nouvelle clé immédiatement, elle n'est affichée qu'une seule fois.</p>
          </Step>

          <Step n="3" title="Mettre à jour tous les environnements">
            <p>Remplacez l'ancienne clé partout où elle était utilisée :</p>
            <CodeBlock filename="rotate-key.sh" lang="bash">{`# Développement local
# Modifiez votre fichier .env ou exportez la variable
export ANTHROPIC_API_KEY="sk-ant-votre-nouvelle-cle"

# Vérifiez que l'ancienne clé n'est plus dans votre historique shell
grep -r "sk-ant-" ~/.bash_history ~/.zsh_history 2>/dev/null`}</CodeBlock>
            <p>Les endroits typiques à mettre à jour : <code>.env</code> local, secrets CI/CD (GitHub Actions, GitLab CI, CircleCI), plateformes d'hébergement (Vercel, Railway, Render, Heroku), Docker Compose, secrets Kubernetes, et tout fichier <code>.env.production</code> sur vos serveurs.</p>
          </Step>

          <Step n="4" title="Vérifier vos logs d'utilisation">
            <p>Sur <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">console.anthropic.com</a>, allez dans <strong>Usage</strong>. Regardez les dernières 24-48 heures :</p>
            <ul>
              <li>Le volume est-il cohérent avec votre usage habituel ?</li>
              <li>Des requêtes à des heures inhabituelles (par exemple 3h du matin dans votre fuseau) ?</li>
              <li>Un modèle que vous n'utilisez pas normalement ?</li>
            </ul>
            <p>Des pics inhabituels ou des patterns inconnus indiquent que quelqu'un d'autre a utilisé la clé.</p>
          </Step>

          <Step n="5" title="Contacter le support Anthropic si l'usage est suspect">
            <p>Si vous repérez des charges ou une utilisation qui ne vient pas de vous, contactez le support Anthropic sur <a href="https://support.anthropic.com" target="_blank" rel="noopener noreferrer">support.anthropic.com</a> avec :</p>
            <ul>
              <li>L'identifiant de la clé (pas sa valeur)</li>
              <li>La fenêtre temporelle de l'activité suspecte</li>
              <li>Une description courte de ce que vous avez trouvé</li>
            </ul>
            <p>Anthropic examine les cas d'usage frauduleux. Il n'y a pas de politique de remboursement automatique garantie, mais ils enquêtent et ont aidé des utilisateurs dans des cas de fraude documentés.</p>
          </Step>

          <div className="art-divider"/>

          <h2 id="origines">D'où vient la fuite ?</h2>
          <p>Une fois l'urgence gérée, identifiez la source. Voici les vecteurs les plus fréquents.</p>

          <h3>Commité dans Git (la cause la plus courante)</h3>
          <p>Quelqu'un a ajouté un fichier <code>.env</code>, codé la clé en dur dans un fichier de config, ou l'a laissée dans un script de test. Même si vous supprimez le fichier ou modifiez le commit, <strong>la clé est toujours dans l'historique Git</strong>. Quiconque clone le repo ou l'a déjà cloné a accès à tout l'historique.</p>
          <p>Le programme <a href="https://docs.github.com/fr/code-security/secret-scanning/about-secret-scanning" target="_blank" rel="noopener noreferrer">Secret Scanning de GitHub</a> détecte automatiquement les patterns <code>sk-ant-</code> dans les dépôts publics et notifie Anthropic. Pour les dépôts privés, ce filet de sécurité n'existe pas sans configuration explicite.</p>

          <h3>Screenshot partagé dans un chat ou sur les réseaux</h3>
          <p>Une capture d'écran de votre terminal ou IDE montrant la clé, partagée sur Slack, Discord, Twitter, ou n'importe quelle plateforme publique. Les screenshots sont indexés. Des bots OCR les scannent en permanence.</p>

          <h3>Log d'erreur non censuré</h3>
          <p>Une application qui logue les headers complets des requêtes ou les variables d'environnement lors d'un crash. Si ces logs arrivent dans Sentry, Datadog, Papertrail, ou n'importe quel agrégateur de logs, la clé est exposée à tous ceux qui ont accès aux logs.</p>

          <h3>Image Docker publique</h3>
          <p>Une image Docker construite avec la clé intégrée dans une couche. Même si vous la supprimez dans une couche ultérieure, l'historique Docker conserve chaque couche intermédiaire. <code>docker history votre-image:tag</code> la révèle.</p>

          <h3>Fichier <code>.env</code> poussé par accident</h3>
          <p>L'erreur classique : <code>.env</code> n'est pas dans <code>.gitignore</code>, quelqu'un fait <code>git add .</code>, et la clé part avec tout le reste.</p>

          <div className="art-divider"/>

          <h2 id="git">Nettoyer l'historique Git</h2>
          <p>Si la clé a été committée dans Git, supprimer l'occurrence dans un nouveau commit ne suffit pas. Il faut réécrire l'historique.</p>

          <Alert kind="warning" title="Le force-push réécrit l'historique partagé">
            Ces opérations réécrivent l'historique Git. Si d'autres personnes ont cloné le dépôt, elles devront re-cloner ou réinitialiser leur copie locale après votre force-push. <strong>Prévenez votre équipe</strong> avant de le faire sur un dépôt partagé.
          </Alert>

          <h3>Option 1 : git-filter-repo (recommandé)</h3>
          <p><code>git-filter-repo</code> est l'outil recommandé actuellement pour ce type d'opération. Il est plus rapide et plus sûr que l'ancien <code>git filter-branch</code>.</p>
          <CodeBlock filename="filter-repo.sh" lang="bash">{`# Installer git-filter-repo
pip install git-filter-repo
# ou : brew install git-filter-repo

# Remplacer toutes les occurrences de la clé fuitée par un placeholder
# Remplacez VOTRE_CLE_FUITEE par la valeur réelle de la clé
git filter-repo --replace-text <(echo "sk-ant-VOTRE_CLE_FUITEE==>CLE_API_SUPPRIMEE")

# Force-push toutes les branches vers le remote
git push origin --force --all
git push origin --force --tags`}</CodeBlock>

          <h3>Option 2 : BFG Repo-Cleaner</h3>
          <p>BFG est une alternative plus simple pour supprimer des patterns de texte spécifiques.</p>
          <CodeBlock filename="bfg.sh" lang="bash">{`# Télécharger BFG depuis https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text secrets.txt votre-repo.git

# secrets.txt doit contenir la clé fuitée sur une seule ligne :
# sk-ant-VOTRE_CLE_FUITEE

cd votre-repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all`}</CodeBlock>

          <h3>Après le force-push</h3>
          <CodeBlock filename="verify.sh" lang="bash">{`# Prévenez les collaborateurs de re-cloner
# Sur GitHub/GitLab, allez dans Settings > Danger Zone
# et pensez à faire tourner les deploy keys du dépôt aussi

# Vérifiez que la clé n'apparaît plus dans l'historique
git log --all -p | grep "sk-ant-" || echo "Propre"`}</CodeBlock>

          <Alert kind="info" title="Vues en cache sur GitHub">
            Même après un force-push, GitHub peut cacher l'ancienne vue de commit pendant quelques heures. Utilisez le support GitHub pour demander une invalidation immédiate du cache si la clé était dans un repo public.
          </Alert>

          <div className="art-divider"/>

          <h2 id="audit">Auditer l'impact</h2>
          <p>Vous avez révoqué la clé et nettoyé le repo. Évaluez maintenant les dégâts.</p>

          <h3>Ce qu'il faut chercher dans les logs d'utilisation</h3>
          <CodeBlock filename="patterns.txt" lang="text">{`Patterns normaux à comparer :
- Volume de requêtes habituel par heure
- Modèles que vous utilisez réellement (claude-3-5-sonnet, haiku, etc.)
- Votre ratio habituel tokens input/output
- Requêtes venant de vos plages IP habituelles`}</CodeBlock>
          <p>Signaux d'alarme dans le dashboard d'utilisation Anthropic :</p>
          <ul>
            <li>Requêtes vers des modèles que vous n'avez jamais utilisés</li>
            <li>Consommation de tokens 10x ou plus au-dessus de votre baseline</li>
            <li>Activité pendant des heures où votre système est normalement inactif</li>
            <li>Pics soudains suivis d'une activité normale (test du bot, puis arrêt)</li>
          </ul>

          <h3>Vérifier l'exposition secondaire</h3>
          <p>La clé a peut-être été utilisée pour sonder votre compte ou récupérer d'autres informations. Si d'autres secrets se trouvaient dans le même fichier ou le même commit, traitez-les tous comme compromis et faites-les tourner aussi.</p>

          <div className="art-divider"/>

          <h2 id="prevention">Prévention : ne plus jamais subir ça</h2>
          <p>Une clé qui fuite est le symptôme d'un processus manquant. Voici ce qu'il faut mettre en place.</p>

          <h3>Les bases</h3>
          <CodeBlock filename="setup.sh" lang="bash">{`# Ajouter .env au .gitignore avant de le créer
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore

# Créer un .env.example avec de fausses valeurs comme documentation
cp .env .env.example
sed -i 's/sk-ant-.*/sk-ant-VOTRE_CLE_ICI/g' .env.example`}</CodeBlock>

          <h3>Scan en pre-commit avec git-secrets ou trufflehog</h3>
          <CodeBlock filename="git-secrets.sh" lang="bash">{`# Installer git-secrets (originaire d'AWS, fonctionne pour tout pattern)
brew install git-secrets

# Ajouter le pattern Anthropic
git secrets --add "sk-ant-[a-zA-Z0-9\\-_]{20,}"

# Installer le hook dans votre repo
git secrets --install

# Désormais tout commit contenant sk-ant-... sera bloqué`}</CodeBlock>

          <h3>Stocker les secrets dans le CI/CD, pas dans le code</h3>
          <CodeBlock filename=".github/workflows/deploy.yml" lang="yaml">{`# Référencer le secret, jamais le coder en dur
- name: Lancer l'intégration Claude
  env:
    ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
  run: node mon-script.js`}</CodeBlock>

          <h3>Utiliser un gestionnaire de secrets en production</h3>
          <p>Pour les équipes, un gestionnaire de secrets centralisé élimine complètement les fichiers <code>.env</code> de la production :</p>
          <div className="art-table-wrap">
            <table className="art-table">
              <thead>
                <tr><th>Outil</th><th>Idéal pour</th></tr>
              </thead>
              <tbody>
                <tr><td><a href="https://www.doppler.com" target="_blank" rel="noopener noreferrer">Doppler</a></td><td>Petites et moyennes équipes, synchronisation multi-environnement</td></tr>
                <tr><td><a href="https://www.vaultproject.io" target="_blank" rel="noopener noreferrer">HashiCorp Vault</a></td><td>Auto-hébergé, politiques d'accès complexes</td></tr>
                <tr><td><a href="https://aws.amazon.com/secrets-manager/" target="_blank" rel="noopener noreferrer">AWS Secrets Manager</a></td><td>Stacks AWS-native</td></tr>
                <tr><td><a href="https://developer.1password.com/docs/cli/" target="_blank" rel="noopener noreferrer">1Password CLI (op)</a></td><td>Équipes déjà sur 1Password</td></tr>
              </tbody>
            </table>
          </div>

          <div className="art-divider"/>

          <h2 id="faq">Questions fréquentes</h2>
          <div className="art-faq">
            <FaqItem q="Est-ce qu'Anthropic rembourse les coûts frauduleux ?" defaultOpen>
              Anthropic n'a pas de politique de remboursement automatique publiée pour les clés compromises. Cependant, l'équipe support examine les cas où les clés ont visiblement été volées et utilisées frauduleusement. Vos chances s'améliorent si vous pouvez montrer : quand la clé a été créée, quand elle a fuité, et des preuves claires que l'usage n'était pas le vôtre.
            </FaqItem>
            <FaqItem q="Combien de temps Google garde-t-il une clé indexée ?">
              Si la clé est apparue sur une page publique (commit GitHub, site de paste, screenshot), Google peut la cacher pendant des jours à des semaines. Vous pouvez demander la suppression via l'outil <em>Remove Outdated Content</em> de Google une fois que la page source a disparu.
            </FaqItem>
            <FaqItem q="Comment savoir si un bot a déjà utilisé ma clé ?">
              Regardez le dashboard d'utilisation Anthropic pour la période entre la création de la clé et sa révocation. Les bots font généralement beaucoup de petites requêtes rapidement (test de la clé), puis s'arrêtent ou lancent des workloads lourds. Si votre usage montre une activité que vous ne pouvez pas attribuer à votre propre code, considérez que la clé a été utilisée.
            </FaqItem>
            <FaqItem q="Ma clé a fuité dans un repo privé. Suis-je en sécurité ?">
              Moins exposé qu'avec un repo public, mais pas en sécurité pour autant. Toute personne ayant accès en lecture au repo détient la clé. Cela inclut les collaborateurs actuels et passés, les systèmes CI/CD, et quiconque l'a cloné. Faites tourner la clé et nettoyez l'historique dans tous les cas.
            </FaqItem>
          </div>

          {/* Next steps */}
          <div className="art-next" id="next">
            <p className="art-next-h"><Icon name="arrow-up-right" size={14}/> Prochaines étapes</p>
            <h3 className="art-next-title">Créez l'habitude avant l'incident</h3>
            <p style={{ color: "inherit", margin: "0 0 14px", fontSize: 15 }}>
              Le meilleur moment pour configurer <code>.gitignore</code>, les hooks pre-commit et les secrets CI était avant que ça n'arrive. Le deuxième meilleur moment, c'est maintenant.
            </p>
            <ul className="art-next-list">
              <li>
                <Icon name="settings" size={16}/>
                <a href="#">
                  <span>Variables d'environnement : référence complète</span>
                  <span className="desc">Configurer correctement ANTHROPIC_API_KEY dans tous les environnements</span>
                </a>
              </li>
              <li>
                <Icon name="shield" size={16}/>
                <a href="#">
                  <span>Bonnes pratiques de sécurité Claude Code</span>
                  <span className="desc">Guide de sécurité plus large pour vos configurations</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Pager */}
          <nav className="art-pager">
            <a href="#" className="prev">
              <p className="art-pager-label"><Icon name="arrow-left" size={12}/> Précédent</p>
              <p className="art-pager-title">Sécurité Claude Code : bonnes pratiques et checklist</p>
            </a>
            <a href="#" className="next">
              <p className="art-pager-label" style={{ justifyContent: "flex-end" }}>Suivant <Icon name="arrow-right" size={12}/></p>
              <p className="art-pager-title">Claude Design vs Figma : qui va gagner la guerre du design IA en 2026 ?</p>
            </a>
          </nav>
        </article>

        {/* TOC right */}
        <aside className="art-toc">
          <p className="art-toc-h">Sommaire</p>
          <ul className="art-toc-list">
            {TOC.map(t => (
              <li key={t.id}>
                <a href={"#" + t.id} className={active === t.id ? "is-active" : ""}>{t.label}</a>
              </li>
            ))}
          </ul>
          <div className="art-toc-progress">
            <p className="art-toc-progress-h">Progression</p>
            <div className="art-toc-bar">
              <div className="art-toc-fill" style={{ width: progress + "%" }}/>
            </div>
            <p className="art-toc-progress-num">{Math.round(progress)} % lus · {ARTICLE.readTime}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { ArticlePage });
