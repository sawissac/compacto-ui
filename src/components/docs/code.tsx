"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import * as React from "react";

/**
 * A copyable code line. No syntax highlighting: every snippet here is an
 * import statement or a shell command, and a highlighter would be a megabyte
 * of dependency to colour four tokens.
 */
export function Code({ children }: { children: string }) {
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
    <div className="group relative flex items-center gap-2 rounded-md border border-app-border-mid bg-app-editor pr-1 pl-3">
      <code className="min-w-0 flex-1 overflow-x-auto py-2.5 font-mono text-[12px] whitespace-pre text-app-text">
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
