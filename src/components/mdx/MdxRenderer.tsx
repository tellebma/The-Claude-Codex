import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./MdxComponents";

interface MdxRendererProps {
  readonly source: string;
}

/**
 * Server-side MDX renderer.
 * Compiles and renders MDX content with all registered custom components.
 * Uses remark-gfm for GitHub Flavored Markdown (tables, strikethrough, etc.).
 */
export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <div className="mdx-content">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
