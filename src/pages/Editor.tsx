import { MarkdownPreview } from "@/components/MarkdownPreview";
import { compressionService } from "@/lib/compression";
import { storageService } from "@/lib/storage";
import type { LayoutMode } from "@/lib/types";
import { Button, Textarea } from "@corbinmurray/ui-components";
import {
  AlertTriangle,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Share2,
  WrapText,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const MAX_SAFE_LENGTH = 10000;

export function Editor() {
  const location = useLocation();
  const [markdown, setMarkdown] = useState("");
  const [isWarningLength, setIsWarningLength] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("split");
  const [wordWrap, setWordWrap] = useState<boolean>(() => {
    return storageService.getWordWrap() ?? true;
  });

  useEffect(() => {
    const remixContent = location.state?.content;
    if (remixContent) {
      const existingDraft = storageService.getDraft();
      if (existingDraft && existingDraft !== remixContent) {
        const shouldOverwrite = window.confirm(
          "You have an existing draft. Do you want to replace it with the remixed content?",
        );
        if (shouldOverwrite) {
          setMarkdown(remixContent);
          storageService.saveDraft(remixContent);
        } else {
          setMarkdown(existingDraft);
        }
      } else {
        setMarkdown(remixContent);
        storageService.saveDraft(remixContent);
      }
    } else {
      const savedDraft = storageService.getDraft();
      if (savedDraft) {
        setMarkdown(savedDraft);
      }
    }
  }, [location.state]);

  useEffect(() => {
    setIsWarningLength(markdown.length > MAX_SAFE_LENGTH);
  }, [markdown]);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdown(value);
    storageService.saveDraft(value);
  }, []);

  const handleShare = useCallback(() => {
    if (!markdown.trim()) {
      toast.error("Cannot share empty content");
      return;
    }

    try {
      const compressed = compressionService.compress(markdown);
      const shareUrl = `${window.location.origin}${window.location.pathname}#/view/${compressed}`;

      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy link");
        });
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to generate share link");
    }
  }, [markdown]);

  const handleWordWrapToggle = useCallback(() => {
    setWordWrap((prev) => {
      const newValue = !prev;
      storageService.setWordWrap(newValue);
      return newValue;
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Create & Share</h2>
        <Button onClick={handleShare} disabled={!markdown.trim()}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {isWarningLength && (
        <div className="flex items-center gap-2 p-3 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p>
            Content is {markdown.length} characters. URLs may become unreliable
            above {MAX_SAFE_LENGTH} characters.
          </p>
        </div>
      )}

      <div
        className={`grid gap-4 ${
          layoutMode === "split" ? "lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {(layoutMode === "split" || layoutMode === "editor") && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Editor</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWordWrapToggle}
                  title={wordWrap ? "Disable word wrap" : "Enable word wrap"}
                  aria-pressed={wordWrap}
                  className={wordWrap ? "bg-accent" : ""}
                >
                  <WrapText className="h-4 w-4" />
                  <span className="sr-only">
                    {wordWrap ? "Disable word wrap" : "Enable word wrap"}
                  </span>
                </Button>
                {layoutMode === "editor" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLayoutMode("split")}
                    title="Expand Viewer"
                    className="hidden lg:flex"
                  >
                    <PanelRightOpen className="h-4 w-4" />
                    <span className="sr-only">Expand Viewer</span>
                  </Button>
                )}
                {layoutMode === "split" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLayoutMode("viewer")}
                    title="Collapse Editor"
                    className="hidden lg:flex"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                    <span className="sr-only">Collapse Editor</span>
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => handleMarkdownChange(e.target.value)}
              placeholder="Type your markdown here..."
              className={`min-h-125 font-mono ring-1 ring-zinc-900/30 ${
                wordWrap
                  ? "whitespace-pre-wrap"
                  : "whitespace-pre overflow-x-auto"
              }`}
            />
          </div>
        )}

        {(layoutMode === "split" || layoutMode === "viewer") && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="flex gap-2">
                {layoutMode === "viewer" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLayoutMode("split")}
                    title="Expand Editor"
                    className="hidden lg:flex"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                    <span className="sr-only">Expand Editor</span>
                  </Button>
                )}
                {layoutMode === "split" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLayoutMode("editor")}
                    title="Collapse Viewer"
                    className="hidden lg:flex"
                  >
                    <PanelRightClose className="h-4 w-4" />
                    <span className="sr-only">Collapse Viewer</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="rounded-md border p-4 min-h-125 bg-card ring-1 ring-zinc-900/30">
              <MarkdownPreview content={markdown} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
