import { cn } from "@/lib/utils";
import { useCallback, useMemo } from "react";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { CodeBlock } from "./CodeBlock";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const handleAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const href = event.currentTarget.getAttribute("href");

      if (!href) return;

      // Handle internal anchor links
      if (href.startsWith("#")) {
        event.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      // Handle external links - open in new tab
      else if (href.startsWith("http://") || href.startsWith("https://")) {
        event.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }
      // Handle mailto links - allow default behavior
      else if (href.startsWith("mailto:")) {
        return;
      }
      // Handle relative links - block and warn
      else {
        event.preventDefault();
        toast.warning("Relative links are not supported in the preview.");
      }
    },
    [],
  );

  const components = useMemo(
    () => ({
      a: ({ node, ...props }: any) => (
        <a {...props} onClick={handleAnchorClick} />
      ),
      code: CodeBlock,
      table: ({ node, ...props }: any) => (
        <div className="overflow-x-auto my-4">
          <table {...props} />
        </div>
      ),
    }),
    [handleAnchorClick],
  );

  return (
    <div
      className={cn(
        "prose prose-slate dark:prose-invert mx-auto",
        // Layout constraint
        "max-w-[70ch]",
        // Base text styling
        "prose-base md:prose-lg",
        // Headings - clear hierarchy
        "prose-headings:font-bold prose-headings:tracking-tight prose-headings:leading-tight",
        "prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8 prose-h1:border-b prose-h1:pb-2",
        "prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2",
        "prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-6",
        "prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4",
        "prose-h5:text-lg prose-h5:mb-2 prose-h5:mt-4",
        "prose-h6:text-base prose-h6:mb-2 prose-h6:mt-4 prose-h6:font-semibold",
        // Paragraphs
        "prose-p:leading-relaxed prose-p:mb-4",
        // Links
        "prose-a:text-primary prose-a:no-underline prose-a:font-medium prose-a:hover:underline",
        // Lists
        "prose-ul:my-4 prose-ol:my-4",
        "prose-li:my-1",
        // Code
        "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:p-4",
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:my-4",
        // Tables
        "prose-table:border-collapse prose-table:w-full",
        "prose-th:border prose-th:p-2 prose-th:bg-muted prose-th:font-semibold",
        "prose-td:border prose-td:p-2",
        // Images
        "prose-img:rounded-lg prose-img:shadow-md",
        // HR
        "prose-hr:my-8 prose-hr:border-border",
        // Strong/Em
        "prose-strong:font-bold prose-strong:text-foreground",
        "prose-em:italic",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={components}
      >
        {content}
      </Markdown>
    </div>
  );
}
