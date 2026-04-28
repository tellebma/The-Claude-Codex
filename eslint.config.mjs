// Flat config ESLint 9 pour Next.js 16.
// Remplace l'ancien `.eslintrc.json` qui etendait uniquement `next/core-web-vitals`.
// `eslint-config-next/core-web-vitals` exporte directement un `Linter.Config[]`
// (cf. node_modules/eslint-config-next/dist/core-web-vitals.js), il suffit donc
// de l'etaler tel quel dans le tableau exporte.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  ...nextCoreWebVitals,
  {
    // Ignores globaux (en plus de ceux fournis par eslint-config-next :
    // `.next/**`, `out/**`, `build/**`, `next-env.d.ts`).
    ignores: [
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      ".stryker-tmp/**",
      ".worktrees/**",
      "reports/**",
      "public/**",
      "docs/**",
    ],
  },
  {
    // Rule ajoutee par eslint-plugin-react-hooks recent (React 19) :
    // signale les setState dans un useEffect. Les cas d'usage legitimes
    // sont nombreux (sync de medias query, lecture DOM, integration
    // externe). On passe en warning pour ne pas bloquer la CI, les
    // veritables cas pathologiques seront trackes et fixes au cas par
    // cas dans des PRs dediees.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    // Tests : les composants mockes n'ont pas besoin de displayName, et
    // passer `children` comme prop est idiomatique quand on teste un
    // composant qui fait `React.Children.map` ou equivalent.
    files: ["__tests__/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "react/display-name": "off",
      "react/no-children-prop": "off",
    },
  },
];
