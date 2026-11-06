"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { UpdatedNote } from "@/components/UpdatedNote";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { PaperSize } from "@/lib/geometry";
import { localizedPath } from "@/lib/locale";
import {
  BUTTONS,
  EYES,
  formatLength,
  KEY_MM,
  MAN_PRESETS,
  manLayout,
  MARGIN_MM,
  OUTLINE,
  pathData,
  scaled,
  sizeProblem,
  SMILE,
  type ManLayout,
  type ManPreset,
  type Unit,
} from "@/lib/gingerbreadman";

// Gingerbread man template (English only, 2026-11-06): any height from 2 in to 6 ft. Small sizes fill
// one sheet with copies; big ones (doors, bulletin boards) are split across sheets at actual size.

type Status = { kind: "progress" | "success" | "error"; message: string } | null;

const STATUS_CLASS: Record<NonNullable<Status>["kind"], string> = {
  progress: "status-message is-progress",
  success: "status-message is-success",
  error: "status-message is-error",
};

const PAPERS: Array<{ value: PaperSize; label: string }> = [
  { value: "letter", label: "US Letter" },
  { value: "a4", label: "A4" },
];

function Man({ h, x, y, details }: { h: number; x: number; y: number; details: boolean }) {
  const r = 0.018 * h;
  return (
    <g>
      <path className="gb-piece" d={pathData(scaled(OUTLINE, h, x, y))} />
      {details ? (
        <g className="gm-detail">
          {EYES.map(([ex, ey], i) => (
            <circle key={`e${i}`} cx={x + ex * h} cy={y + ey * h} r={r} />
          ))}
          {BUTTONS.map(([bx, by], i) => (
            <circle key={`b${i}`} cx={x + bx * h} cy={y + by * h} r={r * 1.25} />
          ))}
          <path
            d={`M${x + (SMILE[0] - 0.059) * h} ${y + (SMILE[1] + 0.012) * h} Q${x + SMILE[0] * h} ${y + (SMILE[1] + 0.06) * h} ${x + (SMILE[0] + 0.059) * h} ${y + (SMILE[1] + 0.012) * h}`}
          />
        </g>
      ) : null}
    </g>
  );
}

function SheetPreview({ layout, details, paperLabel }: { layout: ManLayout; details: boolean; paperLabel: string }) {
  const { paper } = layout;
  if (layout.kind === "grid") {
    return (
      <div className="gb-sheets gm-sheets-one">
        <figure className="gb-sheet">
          <svg viewBox={`0 0 ${paper.widthMm} ${paper.heightMm}`} role="img" aria-label={`One ${paperLabel} sheet with ${layout.copies.length} gingerbread men`}>
            <rect className="gb-paper" x={0} y={0} width={paper.widthMm} height={paper.heightMm} />
            {layout.copies.map(([x, y], i) => (
              <Man key={i} h={layout.heightMm} x={x} y={y} details={details} />
            ))}
            <rect className="gm-key" x={MARGIN_MM + 4} y={paper.heightMm - MARGIN_MM - KEY_MM + 6} width={25.4} height={25.4} />
          </svg>
        </figure>
      </div>
    );
  }
  // Too big for one sheet: the whole figure, with the printed sheets drawn over it in print order.
  const f = Math.max(10, layout.heightMm / 34);
  return (
    <div className="stocking-frame">
      <svg
        viewBox={`${-f * 0.6} ${-f * 0.6} ${layout.widthMm + f * 1.2} ${layout.heightMm + f * 1.2}`}
        role="img"
        aria-label={`The gingerbread man split across ${layout.tiles.length} ${paperLabel} sheets`}
      >
        <Man h={layout.heightMm} x={0} y={0} details={details} />
        {layout.tiles.map((tile, i) => (
          <g key={tile.index} className="stocking-sheet">
            <rect x={tile.xMm} y={tile.yMm} width={tile.widthMm} height={tile.heightMm} />
            <rect className="stocking-sheet-tag" x={tile.xMm + f * 0.35} y={tile.yMm + f * 0.35} width={f * 1.6} height={f * 1.6} rx={f * 0.3} />
            <text x={tile.xMm + f * 1.15} y={tile.yMm + f * 1.55} fontSize={f} textAnchor="middle">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function GingerbreadManApp({ children }: { children?: ReactNode }) {
  const [preset, setPreset] = useState<ManPreset>("cookie");
  const [unit, setUnit] = useState<Unit>("in");
  const [custom, setCustom] = useState("24");
  const [details, setDetails] = useState(true);
  const [paperSize, setPaperSize] = useState<PaperSize>("letter");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const presetInfo = MAN_PRESETS.find((p) => p.id === preset);
  const customMm = Number.parseFloat(custom) * (unit === "in" ? 25.4 : 10);
  const problem = preset === "custom" ? sizeProblem(customMm, unit) : null;
  const heightMm = presetInfo ? presetInfo.heightMm : problem ? MAN_PRESETS[0].heightMm : customMm;
  const layout = useMemo(() => manLayout(heightMm, paperSize), [heightMm, paperSize]);
  const paperLabel = paperSize === "letter" ? "US Letter" : "A4";
  const sheets = layout.kind === "grid" ? 1 : layout.tiles.length;
  const oneSheet = layout.kind === "grid";
  const label = presetInfo ? `${presetInfo.label} (${formatLength(heightMm, unit)} tall)` : `${formatLength(heightMm, unit)} tall`;

  function switchUnit(next: Unit) {
    if (next === unit) return;
    const mm = Number.parseFloat(custom) * (unit === "in" ? 25.4 : 10);
    setCustom(String(next === "in" ? Math.round((mm / 25.4) * 2) / 2 : Math.round(mm / 10)));
    setUnit(next);
  }

  async function download(): Promise<void> {
    if (problem) return;
    setBusy(true);
    setStatus({ kind: "progress", message: `Making the template on ${sheets} ${paperLabel} ${sheets === 1 ? "sheet" : "sheets"}…` });
    try {
      const { exportManPdf } = await import("@/lib/gingerbreadman-pdf");
      const count = await exportManPdf({ heightMm, details, paperSize, label });
      setStatus({ kind: "success", message: `Downloaded: ${count} ${count === 1 ? "sheet" : "sheets"}. Print at 100% (Actual Size) and check the 1 in square before cutting.` });
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be made in this browser. Reload the page and try again, or try another browser." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="site-shell" lang="en">
      <a className="skip-link" href="#workspace">
        Skip to the gingerbread man template
      </a>
      <SiteHeader locale="en" route="gingerbreadMan" />

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">FREE PRINTABLE TEMPLATE</p>
            <h1 id="page-title">Gingerbread man template</h1>
            <p className="intro-copy">
              Free printable gingerbread man template in any size, from a 4 inch cookie to a life-size figure for a classroom door. Small sizes fill a
              sheet; big ones print across several sheets at actual size. With or without the face and buttons. No sign-up.
            </p>
            <UpdatedNote locale="en" route="gingerbreadMan" />
          </div>
          <div className="privacy-note">
            <span className="privacy-lock" aria-hidden="true">✂</span>
            <div>
              <strong>Any size, true to scale</strong>
              <span>Every PDF has a 1 in square and a 5 cm bar to check the print.</span>
            </div>
          </div>
        </section>

        <div className="stocking-bench">
          <section className="grid-card stocking-preview" aria-labelledby="preview-heading">
            <div className="output-heading">
              <div>
                <p className="section-kicker">WHAT PRINTS</p>
                <h2 id="preview-heading">
                  {layout.kind === "grid"
                    ? `${layout.copies.length} on one ${paperLabel} sheet`
                    : `${sheets} ${paperLabel} sheets`}
                </h2>
              </div>
              <span className={oneSheet ? "page-badge gb-badge-ok" : "page-badge"}>
                {layout.kind === "grid" ? "No taping" : `${sheets} sheets to tape`}
              </span>
            </div>
            <SheetPreview layout={layout} details={details} paperLabel={paperLabel} />
            <p className="ts-fabric-note gm-size-note">
              {formatLength(heightMm, unit)} tall, {formatLength(layout.widthMm, unit)} wide.{" "}
              {oneSheet ? "Cut out as many as you need from the one sheet." : "Numbered boxes are the printed sheets, in taping order."}
            </p>
          </section>

          <section className="grid-card stocking-settings" aria-labelledby="settings-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">YOUR TEMPLATE</p>
                <h2 id="settings-heading">Size and paper</h2>
              </div>
            </div>

            <fieldset className="radio-fieldset stocking-field">
              <legend>Height</legend>
              <div className="segmented-control gm-sizes">
                {MAN_PRESETS.map((option) => (
                  <label key={option.id}>
                    <input type="radio" name="man-size" value={option.id} checked={preset === option.id} onChange={() => setPreset(option.id)} />
                    <span>
                      <b>{option.label}</b>
                      <small>{unit === "in" ? option.note : formatLength(option.heightMm, "cm")}</small>
                    </span>
                  </label>
                ))}
                <label>
                  <input type="radio" name="man-size" value="custom" checked={preset === "custom"} onChange={() => setPreset("custom")} />
                  <span>
                    <b>Custom</b>
                    <small>any size</small>
                  </span>
                </label>
              </div>
            </fieldset>

            {preset === "custom" ? (
              <div className="gb-custom">
                <label className="gb-input">
                  <span>Height</span>
                  <span className="gb-input-box">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={unit === "in" ? 0.5 : 1}
                      value={custom}
                      aria-invalid={problem ? true : undefined}
                      onChange={(event) => setCustom(event.target.value)}
                    />
                    <span aria-hidden="true">{unit}</span>
                  </span>
                </label>
                {problem ? (
                  <p className="status-message is-error" role="alert">
                    {problem} The preview shows the cookie size until then.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="gb-two">
              <fieldset className="radio-fieldset stocking-field">
                <legend>Paper in your printer</legend>
                <div className="segmented-control">
                  {PAPERS.map((option) => (
                    <label key={option.value}>
                      <input type="radio" name="man-paper" value={option.value} checked={paperSize === option.value} onChange={() => setPaperSize(option.value)} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="radio-fieldset stocking-field">
                <legend>Units</legend>
                <div className="segmented-control">
                  {(["in", "cm"] as Unit[]).map((u) => (
                    <label key={u}>
                      <input type="radio" name="man-unit" value={u} checked={unit === u} onChange={() => switchUnit(u)} />
                      <span>{u === "in" ? "Inches" : "cm"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <label className="gb-check">
              <input type="checkbox" checked={details} onChange={(event) => setDetails(event.target.checked)} />
              <span>Face and buttons</span>
            </label>

            <dl className="stocking-facts">
              <div>
                <dt>Sheets</dt>
                <dd>{sheets}</dd>
              </div>
              <div>
                <dt>Copies</dt>
                <dd>{layout.kind === "grid" ? layout.copies.length : 1}</dd>
              </div>
              <div>
                <dt>Width</dt>
                <dd>{formatLength(layout.widthMm, unit)}</dd>
              </div>
            </dl>

            <button className="primary-button export-button" type="button" onClick={() => void download()} disabled={busy || Boolean(problem)}>
              Download template PDF
            </button>
            {status ? (
              <p className={STATUS_CLASS[status.kind]} role={status.kind === "error" ? "alert" : "status"} aria-live="polite">
                {status.message}
              </p>
            ) : null}
            <p className="grid-note">Print at 100% (Actual Size), not &quot;Fit to page&quot;. For big sizes, trim each sheet on its corner marks and tape them in order.</p>
            <p className="stocking-cricut">
              Building a gingerbread house too? The <Link href={localizedPath("en", "gingerbreadHouse")}>gingerbread house template</Link> prints the
              walls and roof at any size.
            </p>
          </section>
        </div>

        {children}
      </main>

      <SiteFooter locale="en" />
    </div>
  );
}
