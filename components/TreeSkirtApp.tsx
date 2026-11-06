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
  DEFAULT_HOLE_MM,
  fabricNeed,
  formatLength,
  PANEL_COUNTS,
  pathData,
  sizeProblem,
  SKIRT_PRESETS,
  skirtPlan,
  skirtTemplate,
  usedTiles,
  type Point,
  type SkirtPreset,
  type SkirtSpec,
  type SkirtStyle,
  type Unit,
} from "@/lib/treeskirt";

// Christmas tree skirt pattern (English only, 2026-11-06): round or paneled, any diameter, printed at
// actual size across home-printer sheets. Nothing is uploaded; the PDF is made in the browser.

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

const toUnit = (mm: number, unit: Unit) => String(unit === "in" ? Math.round((mm / 25.4) * 2) / 2 : Math.round(mm / 10));
const fromUnit = (value: string, unit: Unit) => Number.parseFloat(value) * (unit === "in" ? 25.4 : 10);
/** Yards rounded up to the nearest quarter, as fabric is sold. */
const yards = (mm: number) => {
  const q = Math.ceil(mm / 25.4 / 9);
  const whole = Math.floor(q / 4);
  const frac = ["", "1/4", "1/2", "3/4"][q % 4];
  return `${whole ? whole : ""}${whole && frac ? " " : ""}${frac} yd`.trim();
};

/** The finished skirt seen from above: the ring, its seams and the opening at the back. */
function SkirtDiagram({ spec, unit }: { spec: SkirtSpec; unit: Unit }) {
  const R = 100;
  const r = Math.max(8, (spec.holeMm / spec.diameterMm) * R * 1.6);
  const gap = 0.07;
  const seams: Point[][] = [];
  if (spec.style === "panels") {
    for (let i = 0; i < spec.panels; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / spec.panels;
      seams.push([
        [r * Math.cos(a), r * Math.sin(a)],
        [R * Math.cos(a), R * Math.sin(a)],
      ]);
    }
  }
  // Panel skirts have a straight-edged outline; round ones a circle. Leave a slit at the back (top).
  const outline: Point[] = [];
  const n = spec.style === "panels" ? spec.panels : 96;
  const start = -Math.PI / 2 + gap;
  const end = (3 * Math.PI) / 2 - gap;
  if (spec.style === "panels") {
    for (let i = 0; i <= n; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const aa = i === 0 ? start : i === n ? end : a;
      // Keep the corners on the circle; the first and last points move in along the edge for the slit.
      const k = i === 0 || i === n ? Math.cos(Math.PI / n) / Math.cos(gap - Math.PI / n) : 1;
      outline.push([R * k * Math.cos(aa), R * k * Math.sin(aa)]);
    }
  } else {
    for (let i = 0; i <= n; i++) {
      const a = start + ((end - start) * i) / n;
      outline.push([R * Math.cos(a), R * Math.sin(a)]);
    }
  }
  for (let i = 24; i >= 0; i--) {
    const a = start + ((end - start) * i) / 24;
    outline.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  const d = `M${outline.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
  return (
    <svg
      className="ts-diagram"
      viewBox="-150 -125 300 268"
      role="img"
      aria-label={`Finished skirt ${formatLength(spec.diameterMm, unit)} across with a ${formatLength(spec.holeMm, unit)} centre opening`}
    >
      <path className="ts-skirt" d={d} />
      {seams.slice(1).map(([a, b], i) => (
        <line key={i} className="ts-seam" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
      ))}
      <line className="ts-dim" x1={-R} y1={R + 14} x2={R} y2={R + 14} />
      <text x={0} y={R + 22} textAnchor="middle" dominantBaseline="hanging">
        {formatLength(spec.diameterMm, unit)}
      </text>
      <text x={0} y={4} textAnchor="middle" className="ts-hole-label">
        {formatLength(spec.holeMm, unit)}
      </text>
      <text x={R * 0.42} y={-R - 6} textAnchor="start">
        opening
      </text>
    </svg>
  );
}

export function TreeSkirtApp({ children }: { children?: ReactNode }) {
  const [preset, setPreset] = useState<SkirtPreset>("medium");
  const [style, setStyle] = useState<SkirtStyle>("round");
  const [panels, setPanels] = useState<number>(8);
  const [unit, setUnit] = useState<Unit>("in");
  const [custom, setCustom] = useState({ diameter: "48", hole: "5" });
  const [paperSize, setPaperSize] = useState<PaperSize>("letter");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const presetInfo = SKIRT_PRESETS.find((p) => p.id === preset);
  const customSpec: SkirtSpec = { style, panels, diameterMm: fromUnit(custom.diameter, unit), holeMm: fromUnit(custom.hole, unit) };
  const problem = preset === "custom" ? sizeProblem(customSpec, unit) : null;
  const fallback = SKIRT_PRESETS[1];
  const spec: SkirtSpec = presetInfo
    ? { style, panels, diameterMm: presetInfo.diameterMm, holeMm: DEFAULT_HOLE_MM }
    : problem
      ? { style, panels, diameterMm: fallback.diameterMm, holeMm: DEFAULT_HOLE_MM }
      : customSpec;

  const template = useMemo(() => skirtTemplate(spec, unit), [spec.style, spec.panels, spec.diameterMm, spec.holeMm, unit]); // eslint-disable-line react-hooks/exhaustive-deps
  const plan = useMemo(() => skirtPlan(template, paperSize), [template, paperSize]);
  const tiles = useMemo(() => usedTiles(template, plan), [template, plan]);
  const fabric = fabricNeed(template);
  const paperLabel = paperSize === "letter" ? "US Letter" : "A4";
  const fontMm = Math.max(10, template.widthMm / 34);
  const roundTooWide = spec.style === "round" && fabric.widthMm > 44 * 25.4;

  function switchUnit(next: Unit) {
    if (next === unit) return;
    setCustom((c) => ({ diameter: toUnit(fromUnit(c.diameter, unit), next), hole: toUnit(fromUnit(c.hole, unit), next) }));
    setUnit(next);
  }

  async function download(): Promise<void> {
    if (problem) return;
    setBusy(true);
    setStatus({ kind: "progress", message: `Making the pattern on ${tiles.length} ${paperLabel} sheets…` });
    try {
      const { exportSkirtPatternPdf } = await import("@/lib/treeskirt-pdf");
      const count = await exportSkirtPatternPdf({ spec, unit, paperSize });
      setStatus({ kind: "success", message: `Downloaded: ${count} sheets. Print at 100% (Actual Size) and check the 1 in square before cutting fabric.` });
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be made in this browser. Reload the page and try again, or try another browser." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="site-shell" lang="en">
      <a className="skip-link" href="#workspace">
        Skip to the tree skirt pattern
      </a>
      <SiteHeader locale="en" route="treeSkirt" />

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">FREE SEWING PATTERN</p>
            <h1 id="page-title">Christmas tree skirt pattern</h1>
            <p className="intro-copy">
              Free printable tree skirt pattern in any size. Choose a round skirt cut on folded fabric or a skirt sewn from 6, 8 or 12 panels, pick 36,
              48 or 60 inches or type your own, and print the template at actual size on a home printer. Seam allowance included. No sign-up.
            </p>
            <UpdatedNote locale="en" route="treeSkirt" />
          </div>
          <div className="privacy-note">
            <span className="privacy-lock" aria-hidden="true">✂</span>
            <div>
              <strong>Actual size</strong>
              <span>The template has a 1 in square and a 5 cm bar to check the print before you cut.</span>
            </div>
          </div>
        </section>

        <div className="stocking-bench">
          <section className="grid-card stocking-preview" aria-labelledby="preview-heading">
            <div className="output-heading">
              <div>
                <p className="section-kicker">PREVIEW</p>
                <h2 id="preview-heading">{spec.style === "round" ? "One quarter of the skirt" : `One panel, cut ${spec.panels}`}</h2>
              </div>
              <span className="page-badge">
                {tiles.length} {paperLabel} sheets
              </span>
            </div>
            <div className="stocking-frame">
              <svg
                viewBox={`${-fontMm * 0.6} ${-fontMm * 0.6} ${template.widthMm + fontMm * 1.2} ${template.heightMm + fontMm * 1.2}`}
                role="img"
                aria-label={`${template.title.toLowerCase()} pattern, split across ${tiles.length} ${paperLabel} sheets`}
              >
                <path className="stocking-cut" d={pathData(template.cut)} />
                <path className="stocking-sew" d={pathData(template.sew)} />
                {template.folds.map(([a, b], i) => (
                  <line key={i} className="ts-fold" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
                ))}
                <text x={template.labelAt[0]} y={template.labelAt[1]} fontSize={fontMm * 1.15} textAnchor="middle" className="stocking-label">
                  {spec.style === "round" ? "QUARTER" : "PANEL"}
                </text>
                {template.folds.length ? (
                  <>
                    {/* Along the top fold, and down the left fold, halfway between the sheet tags. */}
                    <text x={template.widthMm * 0.5} y={fontMm * 3.1} fontSize={fontMm * 0.8} textAnchor="middle" className="ts-fold-label">
                      PLACE ON FOLD
                    </text>
                    <text
                      x={fontMm * 1.4}
                      y={template.heightMm * 0.62}
                      fontSize={fontMm * 0.8}
                      textAnchor="middle"
                      className="ts-fold-label"
                      transform={`rotate(-90 ${fontMm * 1.4} ${template.heightMm * 0.62})`}
                    >
                      PLACE ON FOLD
                    </text>
                  </>
                ) : null}
                {tiles.map((tile, i) => (
                  <g key={tile.index} className="stocking-sheet">
                    <rect x={tile.xMm} y={tile.yMm} width={tile.widthMm} height={tile.heightMm} />
                    <rect className="stocking-sheet-tag" x={tile.xMm + fontMm * 0.35} y={tile.yMm + fontMm * 0.35} width={fontMm * 1.6} height={fontMm * 1.6} rx={fontMm * 0.3} />
                    <text x={tile.xMm + fontMm * 1.15} y={tile.yMm + fontMm * 1.55} fontSize={fontMm} textAnchor="middle">
                      {i + 1}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="stocking-legend">
              <span>Solid: cut</span>
              <span className="legend-sew">Dashed: sew</span>
              {template.folds.length ? <span className="legend-fold">Dash-dot: place on fold</span> : null}
              <span className="legend-sheet">Numbered boxes: printed sheets</span>
            </p>
          </section>

          <section className="grid-card stocking-settings" aria-labelledby="settings-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">YOUR SKIRT</p>
                <h2 id="settings-heading">Size and style</h2>
              </div>
            </div>
            <SkirtDiagram spec={spec} unit={unit} />

            <fieldset className="radio-fieldset stocking-field">
              <legend>Style</legend>
              <div className="segmented-control">
                {(["round", "panels"] as SkirtStyle[]).map((s) => (
                  <label key={s}>
                    <input type="radio" name="skirt-style" value={s} checked={style === s} onChange={() => setStyle(s)} />
                    <span>{s === "round" ? "Round, cut on fold" : "Panels"}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {style === "panels" ? (
              <fieldset className="radio-fieldset stocking-field">
                <legend>Number of panels</legend>
                <div className="segmented-control three">
                  {PANEL_COUNTS.map((p) => (
                    <label key={p}>
                      <input type="radio" name="skirt-panels" value={p} checked={panels === p} onChange={() => setPanels(p)} />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <fieldset className="radio-fieldset stocking-field">
              <legend>Finished size (across)</legend>
              <div className="segmented-control gb-sizes">
                {SKIRT_PRESETS.map((option) => (
                  <label key={option.id}>
                    <input type="radio" name="skirt-size" value={option.id} checked={preset === option.id} onChange={() => setPreset(option.id)} />
                    <span>
                      <b>{option.label}</b>
                      <small>{option.note}</small>
                    </span>
                  </label>
                ))}
                <label>
                  <input type="radio" name="skirt-size" value="custom" checked={preset === "custom"} onChange={() => setPreset("custom")} />
                  <span>
                    <b>Custom</b>
                    <small>your size</small>
                  </span>
                </label>
              </div>
            </fieldset>

            {preset === "custom" ? (
              <div className="gb-custom">
                <div className="gb-custom-grid">
                  {(
                    [
                      ["diameter", "Width across"],
                      ["hole", "Centre opening"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="gb-input">
                      <span>{label}</span>
                      <span className="gb-input-box">
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step={unit === "in" ? 0.5 : 1}
                          value={custom[key]}
                          aria-invalid={problem ? true : undefined}
                          onChange={(event) => setCustom((c) => ({ ...c, [key]: event.target.value }))}
                        />
                        <span aria-hidden="true">{unit}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {problem ? (
                  <p className="status-message is-error" role="alert">
                    {problem} The preview shows the 48 in skirt until then.
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
                      <input type="radio" name="skirt-paper" value={option.value} checked={paperSize === option.value} onChange={() => setPaperSize(option.value)} />
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
                      <input type="radio" name="skirt-unit" value={u} checked={unit === u} onChange={() => switchUnit(u)} />
                      <span>{u === "in" ? "Inches" : "cm"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <dl className="stocking-facts">
              <div>
                <dt>Sheets</dt>
                <dd>{tiles.length}</dd>
              </div>
              <div>
                <dt>Fabric, each layer</dt>
                <dd>
                  {spec.style === "round"
                    ? `${formatLength(fabric.widthMm, unit)} sq`
                    : unit === "in"
                      ? yards(fabric.lengthMm)
                      : `${(Math.ceil(fabric.lengthMm / 100) / 10).toFixed(1)} m`}
                </dd>
              </div>
              <div>
                <dt>Seam allowance</dt>
                <dd>{unit === "in" ? "3/8 in" : "1 cm"}</dd>
              </div>
            </dl>
            <p className="ts-fabric-note">
              {spec.style === "round"
                ? roundTooWide
                  ? `A round skirt this size needs fabric at least ${formatLength(fabric.widthMm, unit)} wide, such as 60 in felt or fleece. For 44 in quilting cotton, choose Panels.`
                  : `Cut from one square of fabric folded in four. Fits on 44 in quilting cotton.`
                : `Panels laid head to tail across 44 in quilting cotton, ${fabric.perRow} per row.`}
            </p>

            <button className="primary-button export-button" type="button" onClick={() => void download()} disabled={busy || Boolean(problem)}>
              Download pattern PDF
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
              Sewing the stockings to go under the tree? The <Link href={localizedPath("en", "stockingPattern")}>Christmas stocking pattern</Link> prints
              the same way, in three sizes.
            </p>
          </section>
        </div>

        {children}
      </main>

      <SiteFooter locale="en" />
    </div>
  );
}
