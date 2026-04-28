/* global React, ReactDOM */

const ART_TWEAKS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "cyan"
}/*EDITMODE-END*/;

function ArticleApp() {
  const tweaks = typeof useTweaks !== "undefined" ? useTweaks(ART_TWEAKS) : [ART_TWEAKS, () => {}];
  const [state, setState] = tweaks;

  React.useEffect(() => {
    document.body.classList.toggle("dark-mode", !!state.dark);
    document.body.dataset.accent = state.accent || "cyan";
  }, [state.dark, state.accent]);

  return (
    <>
      <Header dark={state.dark} onToggleDark={() => setState({ dark: !state.dark })}/>
      <ArticlePage/>
      <Footer/>

      {typeof TweaksPanel !== "undefined" && (
        <TweaksPanel title="Tweaks">
          <TweakSection title="Apparence">
            <TweakToggle label="Mode sombre" value={state.dark} onChange={(v) => setState({ dark: v })}/>
            <TweakRadio
              label="Accent"
              value={state.accent}
              options={[{ value: "cyan", label: "Cyan" }, { value: "amber", label: "Amber" }]}
              onChange={(v) => setState({ accent: v })}
            />
          </TweakSection>
        </TweaksPanel>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ArticleApp/>);
