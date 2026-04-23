import { evaluate } from "@mdx-js/mdx";
import * as jsxRuntime from "react/jsx-runtime";
import * as devJsxRuntime from "react/jsx-dev-runtime";
import remarkGfm from "remark-gfm";
import { mdxComponents, createLocaleMdxComponents } from "./MdxComponents";

interface MdxRendererProps {
  readonly source: string;
  readonly locale?: string;
}

// On importe les deux runtimes statiquement pour permettre le tree-shake de
// Next. En dev on pointe `jsx`/`jsxs` sur `jsxDEV` (qui gere les warnings
// dev-only), en prod on utilise les vraies versions optimisees.
const runtime =
  process.env.NODE_ENV === "development"
    ? {
        Fragment: devJsxRuntime.Fragment,
        jsx: devJsxRuntime.jsxDEV,
        jsxs: devJsxRuntime.jsxDEV,
        jsxDEV: devJsxRuntime.jsxDEV,
      }
    : {
        Fragment: jsxRuntime.Fragment,
        jsx: jsxRuntime.jsx,
        jsxs: jsxRuntime.jsxs,
      };

/**
 * Server-side MDX renderer.
 *
 * Compile le MDX via `@mdx-js/mdx`'s `evaluate` en passant le jsx-runtime
 * de l'hote. Evite le crash "React Element from an older version" que
 * `next-mdx-remote/rsc` provoquait sous Next 16 + React 19 (deux copies
 * de React dans le meme arbre RSC). Avec `evaluate`, le composant MDX
 * compile n'importe plus React lui-meme, il appelle les fonctions
 * injectees.
 *
 * Reutilise `mdxComponents` / `createLocaleMdxComponents` pour les
 * composants custom (Callout, CodeBlock, Steps, Tabs, Card) et les
 * overrides HTML (titres, listes, code, liens auto-prefixes par locale).
 */
export async function MdxRenderer({ source, locale }: MdxRendererProps) {
  const components = locale
    ? createLocaleMdxComponents(locale)
    : mdxComponents;

  const { default: MdxContent } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    useMDXComponents: () => components,
  });

  return (
    <div className="mdx-content mx-auto max-w-3xl">
      <MdxContent components={components} />
    </div>
  );
}
