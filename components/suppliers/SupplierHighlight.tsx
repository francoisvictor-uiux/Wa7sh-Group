"use client";

import * as React from "react";

/**
 * Highlight — wraps every occurrence of `query` inside `text` with a soft
 * tinted span. Case-insensitive, accent-insensitive enough for the small
 * set of operational searches we need (Arabic + Latin).
 */
export function Highlight({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const q = query.trim();
  if (!q) return <span className={className}>{text}</span>;

  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < text.length) {
    const idx = lower.indexOf(needle, i);
    if (idx === -1) {
      out.push(<React.Fragment key={key++}>{text.slice(i)}</React.Fragment>);
      break;
    }
    if (idx > i) out.push(<React.Fragment key={key++}>{text.slice(i, idx)}</React.Fragment>);
    out.push(
      <mark
        key={key++}
        className="bg-brand-primary/20 text-text-primary rounded-[3px] px-0.5 -mx-0.5"
      >
        {text.slice(idx, idx + needle.length)}
      </mark>
    );
    i = idx + needle.length;
  }

  return <span className={className}>{out}</span>;
}
