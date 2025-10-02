"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

type Props = {
  url: string;
  title: string;
};

function resolveUrl(url: string) {
  if (typeof window === "undefined") return url;
  if (url.startsWith("http")) return url;
  return `${window.location.origin}${url}`;
}

export default function ShareMenu({ url, title }: Props) {
  const fullUrl = resolveUrl(url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 size={16} />
          <span className="text-sm">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopy}>
          <LinkIcon size={14} className="mr-2" /> Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              fullUrl,
            )}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            X (Twitter)
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              fullUrl,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              fullUrl,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
