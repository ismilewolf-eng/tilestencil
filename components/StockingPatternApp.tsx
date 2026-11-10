"use client";

import type { ReactNode } from "react";
import { UpdatedNote } from "@/components/UpdatedNote";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { PaperSize } from "@/lib/geometry";
import { localizedPath } from "@/lib/locale";
import { pathData, patternPlan, STOCKING_SIZES, stockingPattern, usedTiles, type StockingSize } from "@/lib/stocking";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

// Christmas stocking sewing pattern (English only, 2026-10-27): three sizes drawn as vectors,
// printed at actual size across home-printer sheets. Nothing is uploaded; the PDF is made here.

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

export function StockingPatternApp({ children }: { children?: ReactNode }) {
  const [size, setSize] = useState<StockingSize>("medium");
  const [paperSize, setPaperSize] = useState<PaperSize>("letter");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const pattern = useMemo(() => stockingPattern(size), [size]);
  const plan = useMemo(() => patternPlan(pattern, paperSize), [pattern, paperSize]);
  const tiles = useMemo(() => usedTiles(pattern, plan), [pattern, plan]);
  const sheets = tiles.length;
  const paperLabel = paperSize === "letter" ? "US Letter" : "A4";
  const spec = pattern.size;

  async function downloadPattern(): Promise<void> {
    setBusy(true);
    setStatus({ kind: "progress", message: `Making the ${spec.label.toLowerCase()} pattern on ${sheets} ${paperLabel} sheets…` });
    try {
      const { exportStockingPatternPdf } = await import("@/lib/stocking-pdf");
      const count = await exportStockingPatternPdf({ size, paperSize });
      setStatus({ kind: "success", message: `Downloaded: ${count} sheets. Print at 100% (Actual Size), then check the 1 in square before cutting.` });
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be made in this browser. Reload the page and try again, or try another browser." });
    } finally {
      setBusy(false);
    }
  }

  async function downloadOutline(): Promise<void> {
    setBusy(true);
    setStatus({ kind: "progress", message: "Making the one-page outline…" });
    try {
      const { exportStockingOutlinePdf } = await import("@/lib/stocking-pdf");
      await exportStockingOutlinePdf({ paperSize });
      setStatus({ kind: "success", message: `Downloaded: the outline on one ${paperLabel} page, ready to colour or cut from card.` });
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be made in this browser. Reload the page and try again, or try another browser." });
    } finally {
      setBusy(false);
    }
  }

  // Preview text is sized in pattern millimetres, so it scales with the drawing.
  const fontMm = Math.max(7, pattern.widthMm / 48);

  return (
    <div className="site-shell" lang="en">
      <a className="skip-link" href="#workspace">
        Skip to the stocking pattern
      </a>
      <SiteHeader locale="en" route="stockingPattern" />

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">FREE SEWING PATTERN</p>
            <h1 id="page-title">Christmas stocking pattern</h1>
            <p className="intro-copy">
              Free PDF download: a printable stocking pattern with a cuff and a hanging loop, in small, medium and large (20 in). Pick a size and your
              paper, download the PDF, and print it at actual size on a home printer. Seam allowance is already added. No sign-up.
            </p>
            <UpdatedNote locale="en" route="stockingPattern" />
          </div>
          <div className="privacy-note">
            <span className="privacy-lock" aria-hidden="true">✂</span>
            <div>
              <strong>Actual size</strong>
              <span>Every sheet has a 1 in square and a 5 cm bar to check the print.</span>
            </div>
          </div>
        </section>

        <div className="stocking-bench">
          <section className="grid-card stocking-preview" aria-labelledby="preview-heading">
            <div className="output-heading">
              <div>
                <p className="section-kicker">PREVIEW</p>
                <h2 id="preview-heading">
                  {`${spec.label}, ${spec.heightIn} in tall`}
                </h2>
              </div>
              <span className="page-badge">
                {sheets} {paperLabel} sheets
              </span>
            </div>
            <div className="stocking-frame">
              <svg
                viewBox={`0 0 ${pattern.widthMm} ${pattern.heightMm}`}
                role="img"
                aria-label={`The ${spec.label.toLowerCase()} stocking, cuff and loop pattern pieces, split across ${sheets} ${paperLabel} sheets`}
              >
                {pattern.pieces.map((piece) => (
                  <g key={piece.id}>
                    <path className="stocking-cut" d={pathData(piece.cut)} />
                    <path className="stocking-sew" d={pathData(piece.sew)} />
                    {piece.fold ? (
                      <line className="stocking-fold" x1={piece.fold[0][0]} y1={piece.fold[0][1]} x2={piece.fold[1][0]} y2={piece.fold[1][1]} />
                    ) : null}
                    {piece.id !== "loop" ? (
                      <text x={piece.labelAt[0]} y={piece.labelAt[1] + fontMm * 0.8} fontSize={fontMm * (piece.id === "stocking" ? 1.25 : 1)} className="stocking-label">
                        {piece.id === "stocking" ? "STOCKING" : "CUFF"}
                      </text>
                    ) : null}
                  </g>
                ))}
                {/* Sheets go on top of the pieces so the joins show across the stocking itself. */}
                {tiles.map((tile, i) => (
                  <g key={tile.index} className="stocking-sheet">
                    <rect x={tile.xMm} y={tile.yMm} width={tile.widthMm} height={tile.heightMm} />
                    <rect className="stocking-sheet-tag" x={tile.xMm + fontMm * 0.35} y={tile.yMm + fontMm * 0.35} width={fontMm * 1.5} height={fontMm * 1.5} rx={fontMm * 0.3} />
                    <text x={tile.xMm + fontMm * 1.1} y={tile.yMm + fontMm * 1.47} fontSize={fontMm} textAnchor="middle">
                      {i + 1}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="stocking-legend">
              <span>Solid: cut</span>
              <span className="legend-sew">Dashed: sew</span>
              <span className="legend-sheet">Numbered boxes: printed sheets</span>
            </p>
          </section>

          <section className="grid-card stocking-settings" aria-labelledby="settings-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">YOUR PATTERN</p>
                <h2 id="settings-heading">Size and paper</h2>
              </div>
            </div>
            <fieldset className="radio-fieldset stocking-field">
              <legend>Stocking size (finished height)</legend>
              <div className="segmented-control three stocking-sizes">
                {STOCKING_SIZES.map((option) => (
                  <label key={option.id}>
                    <input type="radio" name="stocking-size" value={option.id} checked={size === option.id} onChange={() => setSize(option.id)} />
                    <span>
                      <b>{option.label}</b>
                      <small className="stocking-pair">
                        <span>{option.heightIn} in</span>
                        <span>{option.heightCm} cm</span>
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="radio-fieldset stocking-field">
              <legend>Paper in your printer</legend>
              <div className="segmented-control">
                {PAPERS.map((option) => (
                  <label key={option.value}>
                    <input type="radio" name="stocking-paper" value={option.value} checked={paperSize === option.value} onChange={() => setPaperSize(option.value)} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <dl className="stocking-facts">
              <div>
                <dt>Sheets</dt>
                <dd>{sheets}</dd>
              </div>
              <div>
                <dt>Cuff depth</dt>
                <dd className="stocking-pair">
                  <span>{Math.round(spec.cuffDepthMm / 25.4)} in</span>
                  <span>{Math.round(spec.cuffDepthMm / 10)} cm</span>
                </dd>
              </div>
              <div>
                <dt>Seam allowance</dt>
                <dd className="stocking-pair">
                  <span>3/8 in</span>
                  <span>1 cm</span>
                </dd>
              </div>
            </dl>

            <button className="primary-button export-button" type="button" onClick={() => void downloadPattern()} disabled={busy}>
              Download pattern PDF
            </button>
            <button className="secondary-button export-button stocking-outline-button" type="button" onClick={() => void downloadOutline()} disabled={busy}>
              One-page outline PDF
            </button>
            {status ? (
              <p className={STATUS_CLASS[status.kind]} role={status.kind === "error" ? "alert" : "status"} aria-live="polite">
                {status.message}
              </p>
            ) : null}
            <p className="grid-note">
              Print at 100% (Actual Size), not &quot;Fit to page&quot;. Trim each sheet on its corner marks, overlap the edges, and tape them in sheet
              order.
            </p>
            <p className="stocking-cricut">
              Cutting a stocking shape from vinyl, card or wood instead? The{" "}
              <Link href={`${localizedPath("en", "christmasStencils")}#stocking`}>Christmas stocking stencil</Link> is a free PDF, and there is a cut-ready
              SVG for Cricut and Silhouette.
            </p>
          </section>
        </div>

        {children}
      </main>

      <SiteFooter locale="en" />
    </div>
  );
}
