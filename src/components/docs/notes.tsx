"use client";

import * as React from "react";

/**
 * Renders `backtick spans` in a note as inline code.
 *
 * The notes are written as plain strings so they can live in a serialisable
 * data module rather than JSX, which means backticks are the only markup they
 * get — and rendering them literally, as this did at first, makes the prose
 * look broken. Splitting on an odd/even index is enough: there is no nesting
 * to worry about and no other syntax to support.
 */
function withInlineCode(text: string): React.ReactNode[] {
  return text.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded-sm bg-app-hover px-1 py-0.5 font-mono text-[12px] text-app-bright"
      >
        {part}
      </code>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

/**
 * The things that are not obvious from the signature — a prop a component
 * throws without, an attribute a third party steals, a default worth knowing
 * the reason for.
 */
export function Notes({ notes }: { notes: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {notes.map((note) => (
        <li key={note} className="flex gap-2.5">
          <span
            aria-hidden
            className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-app-accent"
          />
          <span className="text-[13px] leading-relaxed text-app-text">
            {withInlineCode(note)}
          </span>
        </li>
      ))}
    </ul>
  );
}
