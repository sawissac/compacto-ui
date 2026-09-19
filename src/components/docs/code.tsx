"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * A copyable code line. No syntax highlighting: every snippet here is an
 * import statement or a shell command, and a highlighter would be a megabyte
 * of dependency to colour four tokens.
 *
 * `block` is for a multi-line paragraph of text (a prompt to paste into an
 * agent): wraps instead of scrolling, copy button pinned to the top corner.
 */
export function Code({
  children,
  block = false,
}: {
  children: string;
  block?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard is unavailable over plain http or without permission.
      // The text is selectable either way, so there is nothing to recover.
    }
  };

  return (
    <div
      className={cn(
        "group relative flex gap-2 rounded-md border border-app-border-mid bg-app-editor pr-1 pl-3",
        block ? "items-start pt-1" : "items-center",
      )}
    >
      <code
        className={cn(
          "min-w-0 flex-1 py-2.5 font-mono text-[12px] text-app-text",
          block
            ? "leading-relaxed whitespace-pre-wrap"
            : "overflow-x-auto whitespace-pre",
        )}
      >
        {children}
      </code>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className="shrink-0"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
}
