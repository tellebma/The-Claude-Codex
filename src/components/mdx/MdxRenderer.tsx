import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "./MdxComponents";

interface MdxRendererProps {
  readonly source: string;
}

/**
 * Server-side MDX renderer.
 * Compiles and renders MDX content with all registered custom components.
 * This uses next-mdx-remote RSC (React Server Components) for SSG compatibility.
 */
export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <div className="mdx-content">
      <MDXRemote source={source} components={mdxComponents} />
    </div>
  );
}
