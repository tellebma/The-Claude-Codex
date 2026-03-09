import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Tabs } from "@/components/mdx/Tabs";
import { Steps, Step } from "@/components/mdx/Steps";
import { Card } from "@/components/mdx/Card";

/**
 * Registry of custom components available in MDX files.
 * These components can be used directly in .mdx content
 * without importing them.
 *
 * Usage in MDX:
 *   <Callout type="tip" title="Astuce">Contenu ici</Callout>
 *   <CodeBlock code="..." language="bash" />
 *   <Card title="Titre">Contenu</Card>
 *   <Steps><Step title="..." stepNumber={1}>...</Step></Steps>
 */
export const mdxComponents: MDXComponents = {
  // Custom components
  Callout,
  CodeBlock,
  Tabs,
  Steps,
  Step,
  Card,

  // Override default HTML elements for consistent styling
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mb-4 mt-10 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mb-3 mt-8 text-xl font-semibold text-slate-900 dark:text-white"
      {...props}
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="mb-2 mt-6 text-lg font-semibold text-slate-900 dark:text-white"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="my-4 leading-relaxed text-slate-600 dark:text-slate-300"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="my-4 list-disc space-y-2 pl-6 text-slate-600 dark:text-slate-300"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="my-4 list-decimal space-y-2 pl-6 text-slate-600 dark:text-slate-300"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-brand-700 underline underline-offset-2 transition-colors hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 border-brand-500/30 pl-4 italic text-slate-500 dark:text-slate-400"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded bg-slate-200/50 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-700/50"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-relaxed"
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-8 border-slate-200 dark:border-slate-700" />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className="font-semibold text-slate-900 dark:text-white"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="w-full border-collapse text-sm"
        {...props}
      />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-slate-200 bg-slate-50 px-4 py-2 text-left font-semibold dark:border-slate-700 dark:bg-slate-800"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border border-slate-200 px-4 py-2 dark:border-slate-700"
      {...props}
    />
  ),
};
