// Flat config ESLint 9/10 pour Next.js 16.
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
      "reports/**",
      "public/**",
    ],
  },
];
