import { Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "bash", filename }: CodeBlockProps) {
  return (
    <div className="group my-4 overflow-hidden rounded-xl border border-slate-200/50 bg-slate-950 dark:border-slate-700/50">
      {filename && (
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
          <span className="text-xs text-slate-400">{filename}</span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className="text-slate-300">{code}</code>
        </pre>
      </div>
    </div>
  );
}
