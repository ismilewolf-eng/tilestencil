import type { ReactNode } from "react";

/**
 * A direct answer to the question the page targets, placed first so search engines
 * and AI answers (ChatGPT, Perplexity) can quote it: what to do, what it costs, and
 * one concrete example, before the longer guide.
 */
export function QuickAnswer({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="quick-answer">
      <h2>{heading}</h2>
      {children}
    </div>
  );
}
