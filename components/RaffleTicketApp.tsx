"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { FullListOffer, useListAccess } from "@/components/FullListOffer";
import { PatternRequest } from "@/components/PatternRequest";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { localizedPath } from "@/lib/locale";
import { TICKET_FREE, ticketLayout, ticketNumber, ticketPosition, ticketProblem, TICKETS_PER_SHEET, type TicketSpec } from "@/lib/sheets";

// Numbered raffle tickets with a tear-off stub (English only, 2026-11-12): eight to a sheet.

type Status = { kind: "progress" | "success" | "error"; message: string } | null;

const STATUS_CLASS: Record<NonNullable<Status>["kind"], string> = {
  progress: "status-message is-progress",
  success: "status-message is-success",
  error: "status-message is-error",
};

const STUB_OPTIONS = ["Name", "Phone", "Email", "Address"];

function SheetPreview({ spec, paper }: { spec: TicketSpec; paper: "letter" | "a4" }) {
  const L = ticketLayout(paper);
  const shown = Math.min(spec.count, TICKETS_PER_SHEET);
  const fields = spec.stubFields.slice(0, 4);
  return (
    <div className="gb-sheets gm-sheets-one">
      <figure className="gb-sheet">
        <svg viewBox={`0 0 ${L.pageW} ${L.pageH}`} role="img" aria-label={`First sheet: tickets ${ticketNumber(spec, 0)} to ${ticketNumber(spec, shown - 1)}`}>
          <rect className="gb-paper" x={0} y={0} width={L.pageW} height={L.pageH} />
          {Array.from({ length: shown }, (_, i) => {
            const { x, y } = ticketPosition(L, i);
            const number = `No. ${ticketNumber(spec, i)}`;
            const bx = x + L.stubW;
            const cx = bx + (L.ticketW - L.stubW) / 2;
            const gap = fields.length ? Math.min(13, (L.ticketH - 18) / fields.length) : 0;
            return (
              <g key={i}>
                <rect className="rt-cut" x={x} y={y} width={L.ticketW} height={L.ticketH} />
                <line className="rt-tear" x1={bx} y1={y + 2} x2={bx} y2={y + L.ticketH - 2} />
                <text className="rt-num" x={x + 4} y={y + 8} fontSize={3.6}>
                  {number}
                </text>
                {fields.map((field, n) => (
                  <g key={field}>
                    <text className="rt-field" x={x + 4} y={y + 17 + n * gap} fontSize={2.4}>
                      {field}
                    </text>
                    <line className="rt-rule" x1={x + 4} y1={y + 14 + (n + 1) * gap - 2.5} x2={bx - 4} y2={y + 14 + (n + 1) * gap - 2.5} />
                  </g>
                ))}
                <text className="rt-title" x={cx} y={y + L.ticketH * 0.3} fontSize={Math.min(5.6, ((L.ticketW - L.stubW - 8) / Math.max(8, (spec.title || "Raffle Ticket").length)) * 1.75)} textAnchor="middle">
                  {spec.title || "Raffle Ticket"}
                </text>
                {[spec.line2, spec.line3].filter(Boolean).map((line, n) => (
                  <text key={n} className="rt-line" x={cx} y={y + L.ticketH * 0.3 + 7 + n * 5.2} fontSize={Math.min(3.2, ((L.ticketW - L.stubW - 8) / Math.max(10, line.length)) * 1.9)} textAnchor="middle">
                    {line}
                  </text>
                ))}
                <text className="rt-num" x={x + L.ticketW - 4} y={y + L.ticketH - 5} fontSize={3.6} textAnchor="end">
                  {number}
                </text>
                {spec.price ? (
                  <text className="rt-line" x={bx + 4} y={y + L.ticketH - 5} fontSize={3.2}>
                    {spec.price}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </figure>
    </div>
  );
}

export function RaffleTicketApp({ children }: { children?: ReactNode }) {
  const [title, setTitle] = useState("Spring Fundraiser Raffle");
  const [line2, setLine2] = useState("Grand prize: weekend cabin stay");
  const [line3, setLine3] = useState("Drawing May 16 · Lincoln School gym");
  const [price, setPrice] = useState("$5 each");
  const [prefix, setPrefix] = useState("");
  const [startText, setStartText] = useState("1");
  const [countText, setCountText] = useState("200");
  const [stubFields, setStubFields] = useState<string[]>(["Name", "Phone"]);
  const [paper, setPaper] = useState<"letter" | "a4">("letter");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);
  const access = useListAccess("raffle-tickets");

  const start = Number(startText);
  const count = Number(countText);
  const problem = ticketProblem({ start, count });
  const spec: TicketSpec = { title: title.trim(), line2: line2.trim(), line3: line3.trim(), price: price.trim(), prefix: prefix.trim().slice(0, 4), start: problem ? 1 : start, count: problem ? 8 : count, stubFields };
  const limited = !access.unlimited && spec.count > TICKET_FREE;
  const sheets = Math.ceil(spec.count / TICKETS_PER_SHEET);
  const paperLabel = paper === "letter" ? "US Letter" : "A4";

  async function download(all: boolean): Promise<void> {
    if (problem) return;
    const out = { ...spec, count: !all && limited ? TICKET_FREE : spec.count };
    setBusy(true);
    setStatus({ kind: "progress", message: "Making the PDF…" });
    try {
      const { exportTicketsPdf } = await import("@/lib/sheets-pdf");
      const made = await exportTicketsPdf(out, paper);
      setStatus({
        kind: "success",
        message: `Downloaded: tickets ${ticketNumber(out, 0)} to ${ticketNumber(out, out.count - 1)} on ${made} ${made === 1 ? "sheet" : "sheets"}. Print on card stock at 100% and cut on the dashed lines.`,
      });
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be made in this browser. Reload the page and try again, or try another browser." });
    } finally {
      setBusy(false);
    }
  }

  const toggleField = (field: string) => setStubFields((current) => (current.includes(field) ? current.filter((f) => f !== field) : STUB_OPTIONS.filter((f) => f === field || current.includes(f))));

  return (
    <div className="site-shell" lang="en">
      <a className="skip-link" href="#workspace">
        Skip to the raffle ticket maker
      </a>
      <SiteHeader locale="en" route="raffleTickets" />

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">FREE PRINTABLE TEMPLATE</p>
            <h1 id="page-title">Numbered raffle ticket template</h1>
            <p className="intro-copy">
              Type your event details and how many tickets you need. Each ticket gets its own number, printed on both the ticket and its tear-off stub,
              eight to a sheet. Download the PDF, print, cut. No Word mail merge, no sign-up.
            </p>
          </div>
          <div className="privacy-note">
            <span className="privacy-lock" aria-hidden="true">#</span>
            <div>
              <strong>Numbered in order, no gaps</strong>
              <span>Start from any number, so a second batch carries on where the first stopped.</span>
            </div>
          </div>
        </section>

        <div className="stocking-bench">
          <section className="grid-card stocking-preview" aria-labelledby="preview-heading">
            <div className="output-heading">
              <div>
                <p className="section-kicker">WHAT PRINTS</p>
                <h2 id="preview-heading">
                  {spec.count.toLocaleString("en-US")} tickets on {sheets} {paperLabel} {sheets === 1 ? "sheet" : "sheets"}
                </h2>
              </div>
              <span className="page-badge">8 per sheet</span>
            </div>
            <SheetPreview spec={spec} paper={paper} />
            <p className="ts-fabric-note gm-size-note">
              Sheet 1 of {sheets}. Dashed lines are cuts; the dotted line is where the stub tears off. Fold and crease it, or run a perforating wheel
              along it.
            </p>
          </section>

          <section className="grid-card stocking-settings" aria-labelledby="settings-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">YOUR TICKETS</p>
                <h2 id="settings-heading">Event and numbering</h2>
              </div>
            </div>

            <label className="list-field" htmlFor="rt-title">
              <span>Event or raffle name</span>
            </label>
            <input id="rt-title" className="list-input" type="text" maxLength={60} value={title} onChange={(event) => setTitle(event.target.value)} />
            <label className="list-field" htmlFor="rt-line2">
              <span>Prize or details</span>
            </label>
            <input id="rt-line2" className="list-input" type="text" maxLength={70} value={line2} onChange={(event) => setLine2(event.target.value)} />
            <label className="list-field" htmlFor="rt-line3">
              <span>Date and place of the drawing</span>
            </label>
            <input id="rt-line3" className="list-input" type="text" maxLength={70} value={line3} onChange={(event) => setLine3(event.target.value)} />

            <div className="list-advanced-grid">
              <label className="gb-input">
                <span>How many tickets</span>
                <span className="gb-input-box">
                  <input type="number" inputMode="numeric" min={1} step={1} value={countText} aria-invalid={problem ? true : undefined} onChange={(event) => setCountText(event.target.value)} />
                </span>
              </label>
              <label className="gb-input">
                <span>First number</span>
                <span className="gb-input-box">
                  <input type="number" inputMode="numeric" min={0} step={1} value={startText} aria-invalid={problem ? true : undefined} onChange={(event) => setStartText(event.target.value)} />
                </span>
              </label>
              <label className="gb-input">
                <span>Price text</span>
                <span className="gb-input-box">
                  <input type="text" maxLength={24} value={price} onChange={(event) => setPrice(event.target.value)} />
                </span>
              </label>
              <label className="gb-input">
                <span>Letters before the number</span>
                <span className="gb-input-box">
                  <input type="text" maxLength={4} placeholder="e.g. A" value={prefix} onChange={(event) => setPrefix(event.target.value)} />
                </span>
              </label>
            </div>
            {problem ? (
              <p className="status-message is-error" role="alert">
                {problem}
              </p>
            ) : null}

            <fieldset className="radio-fieldset stocking-field">
              <legend>Lines on the stub for the buyer</legend>
              <div className="list-checks">
                {STUB_OPTIONS.map((field) => (
                  <label className="gb-check" key={field}>
                    <input type="checkbox" checked={stubFields.includes(field)} onChange={() => toggleField(field)} />
                    <span>{field}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="radio-fieldset stocking-field">
              <legend>Paper in your printer</legend>
              <div className="segmented-control">
                {(["letter", "a4"] as const).map((value) => (
                  <label key={value}>
                    <input type="radio" name="rt-paper" value={value} checked={paper === value} onChange={() => setPaper(value)} />
                    <span>{value === "letter" ? "US Letter" : "A4"}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <dl className="stocking-facts">
              <div>
                <dt>Tickets</dt>
                <dd>{spec.count.toLocaleString("en-US")}</dd>
              </div>
              <div>
                <dt>Sheets</dt>
                <dd>{sheets}</dd>
              </div>
              <div>
                <dt>Numbers</dt>
                <dd>
                  {ticketNumber(spec, 0)}–{ticketNumber(spec, spec.count - 1)}
                </dd>
              </div>
            </dl>

            <button className="primary-button export-button" type="button" onClick={() => void download(false)} disabled={busy || Boolean(problem)}>
              {limited ? `Download first ${TICKET_FREE} tickets (free)` : "Download tickets PDF"}
            </button>
            {status ? (
              <p className={STATUS_CLASS[status.kind]} role={status.kind === "error" ? "alert" : "status"} aria-live="polite">
                {status.message}
              </p>
            ) : null}
            <FullListOffer access={access} total={spec.count} free={TICKET_FREE} noun="tickets" onPaid={() => void download(true)} />
            <p className="grid-note">
              Print at 100% (Actual Size) on card stock or heavy paper. Stack the sheets and cut them together with a paper trimmer to save time.
            </p>
            <p className="stocking-cricut">
              Mailing invitations or thank-you notes? The <Link href={localizedPath("en", "addressLabels")}>address label template</Link> turns a list
              into ready-to-print label sheets.
            </p>
          </section>
        </div>

        {children}
        <PatternRequest />
      </main>

      <SiteFooter locale="en" />
    </div>
  );
}
