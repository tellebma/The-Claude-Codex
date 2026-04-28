/* global React, ReactDOM */

const TWEAK_DEFAULTS_DARK = /*EDITMODE-BEGIN*/{
  "heroVariant": "split",
  "articlesLayout": "hero+2",
  "dark": true,
  "accent": "cyan"
}/*EDITMODE-END*/;

function App() {
  const tweaks = typeof useTweaks !== "undefined" ? useTweaks(TWEAK_DEFAULTS_DARK) : [TWEAK_DEFAULTS_DARK, () => {}];
  const [state, setState] = tweaks;

  React.useEffect(() => {
    document.body.classList.toggle("dark-mode", !!state.dark);
    document.body.dataset.accent = state.accent || "cyan";
  }, [state.dark, state.accent]);

  return (
    <>
      <Header dark={state.dark} onToggleDark={() => setState({ dark: !state.dark })}/>
      <Hero variant={state.heroVariant}/>
      <TrustBar/>
      <ArticlesSection layout={state.articlesLayout}/>
      <StatsBand/>
      <PossibilitiesSection/>
      <PathsSection/>
      <CtaFinal/>
      <Footer/>

      {typeof TweaksPanel !== "undefined" && (
        <TweaksPanel title="Tweaks">
          <TweakSection title="Hero">
            <TweakRadio
              label="Variante"
              value={state.heroVariant}
              options={[
                { value: "split",  label: "Split (terminal)" },
                { value: "xxl",    label: "Typo XXL + ticker" },
                { value: "inline", label: "Articles inline" },
              ]}
              onChange={(v) => setState({ heroVariant: v })}
            />
          </TweakSection>
          <TweakSection title="Articles">
            <TweakRadio
              label="Mise en page"
              value={state.articlesLayout}
              options={[
                { value: "hero+2", label: "À la une + 2" },
                { value: "grid3",  label: "Grille de 6" },
              ]}
              onChange={(v) => setState({ articlesLayout: v })}
            />
          </TweakSection>
          <TweakSection title="Apparence">
            <TweakToggle
              label="Mode sombre"
              value={state.dark}
              onChange={(v) => setState({ dark: v })}
            />
            <TweakRadio
              label="Accent"
              value={state.accent}
              options={[
                { value: "cyan",  label: "Cyan" },
                { value: "amber", label: "Amber" },
              ]}
              onChange={(v) => setState({ accent: v })}
            />
          </TweakSection>
        </TweaksPanel>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
