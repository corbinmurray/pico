import { ErrorState } from "@/components/ErrorState";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { compressionService } from "@/lib/compression";
import { Button } from "@corbinmurray/ui-components";
import { Copy, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function Viewer() {
  const { content: encodedContent } = useParams<{ content: string }>();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!encodedContent) {
      setError("No content provided in URL");
      return;
    }

    try {
      const decompressed = compressionService.decompress(encodedContent);

      if (!decompressed) {
        setError("Failed to decompress content. The link may be corrupted.");
        return;
      }

      setMarkdown(decompressed);
    } catch (err) {
      console.error("Decompression error:", err);
      setError("Failed to load content. The link may be invalid or corrupted.");
    }
  }, [encodedContent]);

  const handleCopyRaw = () => {
    if (!markdown) return;

    navigator.clipboard
      .writeText(markdown)
      .then(() => {
        toast.success("Raw markdown copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy markdown");
      });
  };

  const handleRemix = () => {
    if (!markdown) return;
    navigate("/", { state: { content: markdown } });
  };

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">View Shared Content</h2>
        <ErrorState message={error} title="Unable to Load Content" />
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">View Shared Content</h2>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Shared Content</h2>
        <div className="flex gap-2">
          <Button onClick={handleRemix} variant="default">
            <Edit className="mr-2 h-4 w-4" />
            Remix
          </Button>
          <Button onClick={handleCopyRaw} variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy Raw
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-8 bg-card shadow-sm">
        <MarkdownPreview content={markdown} />
      </div>
    </div>
  );
}
