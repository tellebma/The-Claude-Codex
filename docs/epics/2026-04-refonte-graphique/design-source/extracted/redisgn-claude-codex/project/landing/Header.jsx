/* global React */

// ---------- Lucide helper ----------
function Icon({ name, size = 16, stroke = 2, style = {} }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = "";
      const el = document.createElement("i");
      el.setAttribute("data-lucide", name);
      ref.current.appendChild(el);
      window.lucide.createIcons({ attrs: { width: size, height: size, "stroke-width": stroke } });
    }
  }, [name, size, stroke]);
  return <span ref={ref} style={{ display: "inline-flex", lineHeight: 0, ...style }} aria-hidden="true" />;
}

// ---------- Logo ----------
function Logo({ size = "sm" }) {
  const dim = size === "sm" ? 32 : 36;
  const inner = size === "sm" ? 20 : 22;
  return (
    <div style={{
      width: dim, height: dim, borderRadius: 10,
      background: "linear-gradient(135deg,#06b6d4,#f59e0b)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }} aria-hidden="true">
      <svg viewBox="0 0 32 32" width={inner} height={inner} fill="none">
        <path d="M8 10L15 16L8 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 22H24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ---------- Header ----------
const NAV = [
  { key: "Démarrer", href: "#" },
  { key: "MCP", href: "#" },
  { key: "Skills", href: "#" },
  { key: "Prompting", href: "#" },
  { key: "Articles", href: "#articles" },
  { key: "Configurateur", href: "#" },
];

function Header({ dark, onToggleDark }) {
  return (
    <header className="cc-header">
      <nav className="cc-nav">
        <a className="cc-brand" href="#">
          <Logo size="sm" />
          <span className="cc-wordmark">The Claude <span className="cc-text-gradient">Codex</span></span>
        </a>
        <div className="cc-nav-links">
          {NAV.map(n => (
            <a key={n.key} href={n.href} className="cc-nav-link">{n.key}</a>
          ))}
          <button className="cc-nav-link cc-more">Plus <Icon name="chevron-down" size={14}/></button>
        </div>
        <div className="cc-nav-actions">
          <button className="cc-icon-btn" aria-label="Recherche"><Icon name="search" size={16}/></button>
          <button className="cc-icon-btn" aria-label="Langue"><span style={{fontSize:11,fontWeight:600}}>FR</span></button>
          <button className="cc-icon-btn" aria-label="Thème" onClick={onToggleDark}>
            <Icon name={dark ? "sun" : "moon"} size={16}/>
          </button>
        </div>
      </nav>
    </header>
  );
}

Object.assign(window, { Icon, Logo, Header });
