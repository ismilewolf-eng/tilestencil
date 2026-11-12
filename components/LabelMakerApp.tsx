"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { FullListOffer, useListAccess } from "@/components/FullListOffer";
import { PatternRequest } from "@/components/PatternRequest";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { localizedPath } from "@/lib/locale";
import {
  estimateWidthAt1pt,
  fitFontPt,
  LABEL_FORMATS,
  LABEL_FREE,
  LABEL_MAX,
  LABEL_MAX_PT,
  LABEL_PAD_MM,
  labelFormat,
  labelPosition,
  LINE_SPACING,
  parseAddresses,
  parseCsv,
  perSheet,
  PT_MM,
  rowToLines,
  sheetCount,
  unprintable,
  type LabelFormat,
} from "@/lib/sheets";
import type { LabelFont } from "@/lib/sheets-pdf";

// Address labels from a pasted list (English only, 2026-11-12): no mail merge, no add-on, no sign-up.

type Status = { kind: "progress" | "success" | "error"; message: string } | null;

const STATUS_CLASS: Record<NonNullable<Status>["kind"], string> = {
  progress: "status-message is-progress",
  success: "status-message is-success",
  error: "status-message is-error",
};

const SAMPLE = `Maria Alvarez
418 Juniper Lane
Asheville, NC 28801

The Okafor Family
2260 Lakeview Drive, Apt 4B
Madison, WI 53703

Mr. and Mrs. Daniel Whitcombe
77 Old Mill Road
Concord, MA 01742`;

const FONTS: Array<{ value: LabelFont; label: string; css: string }> = [
  { value: "helvetica", label: "Plain", css: "Helvetica, Arial, sans-serif" },
  { value: "times", label: "Serif", css: "'Times New Roman', Times, serif" },
  { value: "courier", label: "Typewriter", css: "'Courier New', Courier, monospace" },
];

const SIZES: Array<{ value: keyof typeof LABEL_MAX_PT; label: string }> = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

function SheetPreview({
  format,
  labels,
  skip,
  size,
  align,
  fontCss,
}: {
  format: LabelFormat;
  labels: string[][];
  skip: number;
  size: keyof typeof LABEL_MAX_PT;
  align: "left" | "center";
  fontCss: string;
}) {
  const per = perSheet(format);
  const shown = labels.slice(0, Math.max(0, per - skip));
  const boxW = format.labelW - 2 * LABEL_PAD_MM;
  const boxH = format.labelH - 2 * Math.min(LABEL_PAD_MM, format.labelH * 0.12);
  return (
    <div className="gb-sheets gm-sheets-one">
      <figure className="gb-sheet">
        <svg viewBox={`0 0 ${format.pageW} ${format.pageH}`} role="img" aria-label={`First sheet: ${shown.length} of ${per} labels filled`}>
          <rect className="gb-paper" x={0} y={0} width={format.pageW} height={format.pageH} />
          {Array.from({ length: per }, (_, slot) => {
            const { x, y } = labelPosition(format, slot);
            return <rect key={slot} className={slot < skip ? "lbl-edge lbl-used" : "lbl-edge"} x={x} y={y} width={format.labelW} height={format.labelH} rx={1.5} />;
          })}
          {shown.map((lines, i) => {
            const { x, y } = labelPosition(format, i + skip);
            const pt = fitFontPt(lines, boxW, boxH, LABEL_MAX_PT[size], estimateWidthAt1pt);
            const step = pt * LINE_SPACING * PT_MM;
            const first = y + (format.labelH - lines.length * step) / 2 + pt * PT_MM * 0.82;
            return (
              <text key={i} className="lbl-text" fontSize={pt * PT_MM} fontFamily={fontCss} textAnchor={align === "center" ? "middle" : "start"}>
                {lines.map((line, n) => (
                  <tspan key={n} x={align === "center" ? x + format.labelW / 2 : x + LABEL_PAD_MM} y={first + n * step}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
        </svg>
      </figure>
    </div>
  );
}

export function LabelMakerApp({ children }: { children?: ReactNode }) {
  const [text, setText] = useState(SAMPLE);
  const [formatId, setFormatId] = useState("5160");
  const [font, setFont] = useState<LabelFont>("helvetica");
  const [size, setSize] = useState<keyof typeof LABEL_MAX_PT>("medium");
  const [align, setAlign] = useState<"left" | "center">("left");
  const [skipText, setSkipText] = useState("0");
  const [offsetX, setOffsetX] = useState("0");
  const [offsetY, setOffsetY] = useState("0");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);
  const access = useListAccess("address-labels");

  const format = labelFormat(formatId);
  const per = perSheet(format);
  const all = useMemo(() => parseAddresses(text).slice(0, LABEL_MAX), [text]);
  const skip = Math.min(per - 1, Math.max(0, Math.floor(Number(skipText) || 0)));
  const limited = !access.unlimited && all.length > LABEL_FREE;
  const bad = useMemo(() => unprintable(all), [all]);
  const isSample = text === SAMPLE;
  const fontCss = FONTS.find((f) => f.value === font)?.css ?? FONTS[0].css;
  const num = (value: string) => Math.max(-5, Math.min(5, Number(value) || 0));

  async function download(mode: "labels" | "all" | "test"): Promise<void> {
    const labels = mode === "labels" && limited ? all.slice(0, LABEL_FREE) : all;
    if (labels.length === 0) return;
    setBusy(true);
    setStatus({ kind: "progress", message: "Making the PDF…" });
    try {
      const { exportLabelsPdf } = await import("@/lib/sheets-pdf");
      const sheets = await exportLabelsPdf({
        format,
        labels: mode === "test" ? labels.slice(0, per - skip) : labels,
        font,
        size,
        align,
        skip,
        offsetX: num(offsetX),
        offsetY: num(offsetY),
        outlines: mode === "test",
      });
      setStatus({
        kind: "success",
        message:
          mode === "test"
            ? "Downloaded a test page with label outlines. Print it on plain paper at 100% and hold it against a label sheet to the light."
            : `Downloaded: ${labels.length} ${labels.length === 1 ? "label" : "labels"} on ${sheets} ${sheets === 1 ? "sheet" : "sheets"}. Print at 100% (Actual Size), not "Fit to page".`,
      });
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be made in this browser. Reload the page and try again, or try another browser." });
    } finally {
      setBusy(false);
    }
  }

  async function loadFile(file: File | undefined) {
    if (!file) return;
    try {
      const rows = parseCsv(await file.text());
      // Shown as one address per block so it can be checked and edited before printing.
      const header = rows.length > 1 && rows[0].every((c) => !/\d/.test(c)) && rows[0].some((c) => /name|address|street|city|zip|postal/i.test(c));
      setText((header ? rows.slice(1) : rows).map((row) => rowToLines(row).join("\n")).filter(Boolean).join("\n\n"));
      setStatus(null);
    } catch {
      setStatus({ kind: "error", message: "That file could not be read. Save the spreadsheet as CSV and try again, or copy the rows and paste them." });
    }
  }

  const sheets = sheetCount(format, all.length, skip);

  return (
    <div className="site-shell" lang="en">
      <a className="skip-link" href="#workspace">
        Skip to the address label maker
      </a>
      <SiteHeader locale="en" route="addressLabels" />

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">FREE LABEL TEMPLATE</p>
            <h1 id="page-title">Address label template</h1>
            <p className="intro-copy">
              Paste your addresses or copy the rows from a spreadsheet, pick your label sheet, and download a PDF that lines up with it. Works with
              Avery 5160, 8160, 5161, 5163, 5167 and A4 L7160 sheets. No mail merge, no add-on, no sign-up.
            </p>
          </div>
          <div className="privacy-note">
            <span className="privacy-lock" aria-hidden="true">✉</span>
            <div>
              <strong>Your addresses stay on your computer</strong>
              <span>The PDF is made in your browser. Nothing you paste is uploaded.</span>
            </div>
          </div>
        </section>

        <div className="stocking-bench">
          <section className="grid-card stocking-preview" aria-labelledby="preview-heading">
            <div className="output-heading">
              <div>
                <p className="section-kicker">WHAT PRINTS</p>
                <h2 id="preview-heading">
                  {all.length === 0 ? "No addresses yet" : `${all.length} ${all.length === 1 ? "label" : "labels"} on ${sheets} ${sheets === 1 ? "sheet" : "sheets"}`}
                </h2>
              </div>
              <span className="page-badge">{format.paper === "letter" ? "US Letter" : "A4"}</span>
            </div>
            <SheetPreview format={format} labels={all} skip={skip} size={size} align={align} fontCss={fontCss} />
            <p className="ts-fabric-note gm-size-note">
              {isSample ? "These are sample addresses. Replace them with your own list. " : ""}
              The preview shows sheet 1. Long lines shrink to fit their label.
            </p>
          </section>

          <section className="grid-card stocking-settings" aria-labelledby="settings-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">YOUR LABELS</p>
                <h2 id="settings-heading">Addresses and label sheet</h2>
              </div>
            </div>

            <label className="list-field" htmlFor="label-text">
              <span>Addresses</span>
              <small>Leave a blank line between addresses, or paste rows straight from Excel or Google Sheets.</small>
            </label>
            <textarea
              id="label-text"
              className="list-textarea"
              rows={9}
              spellCheck={false}
              value={text}
              onFocus={() => {
                if (isSample) setText("");
              }}
              onChange={(event) => setText(event.target.value)}
              placeholder={"Name\nStreet address\nCity, State ZIP\n\nNext name\n…"}
            />
            <label className="list-upload">
              <span>or open a CSV file</span>
              <input type="file" accept=".csv,text/csv,text/plain" onChange={(event) => void loadFile(event.target.files?.[0])} />
            </label>
            {bad.length > 0 ? (
              <p className="status-message is-error" role="alert">
                These characters cannot be printed and will come out wrong: {bad.slice(0, 12).join(" ")}. Use plain Latin letters for now.
              </p>
            ) : null}

            <label className="list-field" htmlFor="label-format">
              <span>Label sheet</span>
            </label>
            <select id="label-format" className="list-select" value={formatId} onChange={(event) => setFormatId(event.target.value)}>
              {LABEL_FORMATS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.fits.split(",")[0]} · {f.name}
                </option>
              ))}
            </select>
            <p className="list-fits">Fits {format.fits}, and other sheets with the same layout.</p>

            <div className="gb-two">
              <fieldset className="radio-fieldset stocking-field">
                <legend>Text size</legend>
                <div className="segmented-control">
                  {SIZES.map((option) => (
                    <label key={option.value}>
                      <input type="radio" name="label-size" value={option.value} checked={size === option.value} onChange={() => setSize(option.value)} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="radio-fieldset stocking-field">
                <legend>Align</legend>
                <div className="segmented-control">
                  {(["left", "center"] as const).map((value) => (
                    <label key={value}>
                      <input type="radio" name="label-align" value={value} checked={align === value} onChange={() => setAlign(value)} />
                      <span>{value === "left" ? "Left" : "Centered"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <fieldset className="radio-fieldset stocking-field">
              <legend>Lettering</legend>
              <div className="segmented-control">
                {FONTS.map((option) => (
                  <label key={option.value}>
                    <input type="radio" name="label-font" value={option.value} checked={font === option.value} onChange={() => setFont(option.value)} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <details className="list-advanced">
              <summary>Partly used sheet, or print slightly off?</summary>
              <div className="list-advanced-grid">
                <label className="gb-input">
                  <span>Labels already used on sheet 1</span>
                  <span className="gb-input-box">
                    <input type="number" inputMode="numeric" min={0} max={per - 1} step={1} value={skipText} onChange={(event) => setSkipText(event.target.value)} />
                  </span>
                </label>
                <label className="gb-input">
                  <span>Move right</span>
                  <span className="gb-input-box">
                    <input type="number" inputMode="decimal" min={-5} max={5} step={0.5} value={offsetX} onChange={(event) => setOffsetX(event.target.value)} />
                    <span aria-hidden="true">mm</span>
                  </span>
                </label>
                <label className="gb-input">
                  <span>Move down</span>
                  <span className="gb-input-box">
                    <input type="number" inputMode="decimal" min={-5} max={5} step={0.5} value={offsetY} onChange={(event) => setOffsetY(event.target.value)} />
                    <span aria-hidden="true">mm</span>
                  </span>
                </label>
              </div>
              <p className="list-fits">Use a negative number to move left or up. Print the test page first to see how far your printer is off.</p>
            </details>

            <dl className="stocking-facts">
              <div>
                <dt>Labels</dt>
                <dd>{all.length}</dd>
              </div>
              <div>
                <dt>Sheets</dt>
                <dd>{sheets}</dd>
              </div>
              <div>
                <dt>Per sheet</dt>
                <dd>{per}</dd>
              </div>
            </dl>

            <button className="primary-button export-button" type="button" onClick={() => void download("labels")} disabled={busy || all.length === 0}>
              {limited ? `Download first ${LABEL_FREE} labels (free)` : "Download labels PDF"}
            </button>
            <button className="secondary-button export-button stocking-outline-button" type="button" onClick={() => void download("test")} disabled={busy || all.length === 0}>
              Test page with label outlines
            </button>
            {status ? (
              <p className={STATUS_CLASS[status.kind]} role={status.kind === "error" ? "alert" : "status"} aria-live="polite">
                {status.message}
              </p>
            ) : null}
            <FullListOffer access={access} total={all.length} free={LABEL_FREE} noun="labels" onPaid={() => void download("all")} />
            <p className="grid-note">
              Print at 100% (Actual Size), not &quot;Fit to page&quot;. Run the test page on plain paper first so you do not waste a label sheet.
            </p>
            <p className="stocking-cricut">
              Running a raffle or fundraiser? The <Link href={localizedPath("en", "raffleTickets")}>raffle ticket template</Link> numbers every ticket for
              you.
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
