import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents, createLocaleMdxComponents } from "./MdxComponents";

interface MdxRendererProps {
  readonly source: string;
  readonly locale?: string;
}

/**
 * Server-side MDX renderer.
 * Compiles and renders MDX content with all registered custom components.
 * Uses remark-gfm for GitHub Flavored Markdown (tables, strikethrough, etc.).
 * When locale is provided, internal links in MDX content are auto-prefixed.
 */
export function MdxRenderer({ source, locale }: MdxRendererProps) {
  const components = locale
    ? createLocaleMdxComponents(locale)
    : mdxComponents;

  return (
    <div className="mdx-content mx-auto max-w-3xl">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
