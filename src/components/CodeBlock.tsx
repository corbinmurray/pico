import { Check, Copy } from "lucide-react";
import { type ComponentPropsWithoutRef, useEffect, useState } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import powershell from "react-syntax-highlighter/dist/esm/languages/prism/powershell";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import {
  a11yDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
// Common Programming Languages
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import kotlin from "react-syntax-highlighter/dist/esm/languages/prism/kotlin";
import lua from "react-syntax-highlighter/dist/esm/languages/prism/lua";
import objectivec from "react-syntax-highlighter/dist/esm/languages/prism/objectivec";
import perl from "react-syntax-highlighter/dist/esm/languages/prism/perl";
import php from "react-syntax-highlighter/dist/esm/languages/prism/php";
import r from "react-syntax-highlighter/dist/esm/languages/prism/r";
import ruby from "react-syntax-highlighter/dist/esm/languages/prism/ruby";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
import scala from "react-syntax-highlighter/dist/esm/languages/prism/scala";
import swift from "react-syntax-highlighter/dist/esm/languages/prism/swift";
import vbnet from "react-syntax-highlighter/dist/esm/languages/prism/vbnet";
// Data and Config Formats
import { Button, cn } from "@corbinmurray/ui-components";
import diff from "react-syntax-highlighter/dist/esm/languages/prism/diff";
import docker from "react-syntax-highlighter/dist/esm/languages/prism/docker";
import ini from "react-syntax-highlighter/dist/esm/languages/prism/ini";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("c#", csharp); // Alias
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markup", markup);
SyntaxHighlighter.registerLanguage("html", markup);
SyntaxHighlighter.registerLanguage("xml", markup); // Alias for XML
SyntaxHighlighter.registerLanguage("powershell", powershell);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("typescript", typescript);

// Common Programming Languages
SyntaxHighlighter.registerLanguage("vbnet", vbnet);
SyntaxHighlighter.registerLanguage("vb", vbnet); // Alias
SyntaxHighlighter.registerLanguage("vb.net", vbnet); // Alias
SyntaxHighlighter.registerLanguage("visual-basic", vbnet); // Alias
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("c++", cpp); // Alias
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("objectivec", objectivec);
SyntaxHighlighter.registerLanguage("objective-c", objectivec); // Alias
SyntaxHighlighter.registerLanguage("r", r);
SyntaxHighlighter.registerLanguage("scala", scala);
SyntaxHighlighter.registerLanguage("perl", perl);
SyntaxHighlighter.registerLanguage("lua", lua);

// Data and Config Formats
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("yml", yaml); // Alias
SyntaxHighlighter.registerLanguage("ini", ini);
SyntaxHighlighter.registerLanguage("docker", docker);
SyntaxHighlighter.registerLanguage("dockerfile", docker); // Alias
SyntaxHighlighter.registerLanguage("diff", diff);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("md", markdown); // Alias

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const checkIsDark = () => root.classList.contains("dark");

    setIsDark(checkIsDark());

    const observer = new MutationObserver(() => {
      setIsDark(checkIsDark());
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

type CodeBlockProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
};

export function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const isDark = useIsDark();
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-([^\s]+)/.exec(className || "");
  const language = match ? match[1] : "text";
  const isMultiLine = String(children).includes("\n");

  const handleCopy = async () => {
    const text = String(children).replace(/\n$/, "");
    await navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!", { duration: 2000 });
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!inline && (match || isMultiLine)) {
    return (
      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
            "bg-background/50 hover:bg-background/80 backdrop-blur-sm",
            "hover:cursor-pointer",
          )}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <SyntaxHighlighter
          // @ts-expect-error - types mismatch for style prop
          style={isDark ? a11yDark : oneLight}
          language={language}
          PreTag="div"
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            textAlign: "right",
            marginLeft: 0,
          }}
          wrapLines={true}
          lineProps={{ style: { display: "flex" } }}
          customStyle={{
            padding: "0.5em 1em",
            margin: 0,
            fontSize: "0.875em",
            lineHeight: 1.4,
          }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}
