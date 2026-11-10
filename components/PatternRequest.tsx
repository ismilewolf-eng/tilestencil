"use client";

import { useState } from "react";
import { REQUEST_MAX } from "@/lib/request-box";

type State = "idle" | "sending" | "sent" | "error";

/** One line, no sign-up: what pattern was this visitor hoping to find? */
export function PatternRequest() {
  const [text, setText] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<State>("idle");

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (text.trim().length < 3 || state === "sending") return;
    setState("sending");
    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, page: location.pathname, website: trap }),
      });
      setState(response.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <section className="request-box" aria-live="polite">
        <p className="request-box-thanks">Thanks. We read every request and build the ones people ask for most.</p>
      </section>
    );
  }

  return (
    <section className="request-box" aria-labelledby="request-box-title">
      <h2 id="request-box-title">Looking for a pattern we don&apos;t have?</h2>
      <form onSubmit={send}>
        <label className="request-box-label" htmlFor="request-box-text">
          Tell us in one line. No email needed.
        </label>
        <div className="request-box-row">
          <input
            id="request-box-text"
            type="text"
            value={text}
            maxLength={REQUEST_MAX}
            placeholder="e.g. a gingerbread girl, 10 in tall"
            onChange={(event) => setText(event.target.value)}
          />
          <input className="request-box-trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(event) => setTrap(event.target.value)} />
          <button type="submit" disabled={text.trim().length < 3 || state === "sending"}>
            {state === "sending" ? "Sending…" : "Send"}
          </button>
        </div>
        {state === "error" ? (
          <p className="request-box-error" role="alert">
            That did not send. Please try again in a moment.
          </p>
        ) : null}
      </form>
    </section>
  );
}
