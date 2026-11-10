"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { UpdatedNote } from "@/components/UpdatedNote";
import { PatternSvgOffer } from "@/components/ChristmasPack";
import { houseFit, houseSvg } from "@/lib/pattern-svg";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { PaperSize } from "@/lib/geometry";
import { localizedPath } from "@/lib/locale";
import {
  doughAreaSqIn,
  formatLength,
  HOUSE_PRESETS,
  houseSheets,
  housePieces,
  pathData,
  sizeProblem,
  THICKNESS_MM,
  type HousePreset,
  type HouseSize,
  type Material,
  type Point,
  type Sheet,
  type Unit,
} from "@/lib/gingerbread";

// Gingerbread house template (English only, 2026-11-04): pick a size or type your own, and print the
// front/back, side wall and roof at actual size. Pieces that fit are packed onto single sheets.

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

const FIELDS: Array<{ key: keyof HouseSize; label: string }> = [
  { key: "widthMm", label: "Width (front)" },
  { key: "depthMm", label: "Depth (side)" },
  { key: "wallMm", label: "Wall height" },
  { key: "riseMm", label: "Roof height" },
];

const CLASSIC = HOUSE_PRESETS[1].size;
const toUnit = (mm: number, unit: Unit) => String(unit === "in" ? Math.round((mm / 25.4) * 4) / 4 : Math.round(mm / 5) / 2);
const fromUnit = (value: string, unit: Unit) => Number.parseFloat(value) * (unit === "in" ? 25.4 : 10);

/** The assembled house, drawn to the chosen proportions, with the four measurements named. */
function HouseDiagram({ size, unit }: { size: HouseSize; unit: Unit }) {
  const { widthMm: W, depthMm: D, wallMm: H, riseMm: R } = size;
  // Oblique view: depth runs up and to the right.
  const p = (x: number, y: number, z: number): Point => [x + y * 0.55, -z - y * 0.32];
  const side = [p(W, 0, 0), p(W, D, 0), p(W, D, H), p(W, 0, H)];
  const roofL = [p(0, 0, H), p(W / 2, 0, H + R), p(W / 2, D, H + R), p(0, D, H)];
  const roofR = [p(W / 2, 0, H + R), p(W, 0, H), p(W, D, H), p(W / 2, D, H + R)];
  const front = [p(0, 0, 0), p(W, 0, 0), p(W, 0, H), p(W / 2, 0, H + R), p(0, 0, H)];
  const all = [...side, ...roofL, ...roofR, ...front];
  const minX = Math.min(...all.map((q) => q[0]));
  const maxX = Math.max(...all.map((q) => q[0]));
  const minY = Math.min(...all.map((q) => q[1]));
  const maxY = Math.max(...all.map((q) => q[1]));
  const span = Math.max(maxX - minX, maxY - minY);
  const pad = span * 0.2;
  const font = span * 0.075;
  const d = (poly: Point[]) => `M${poly.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
  const label = (at: Point, text: string, anchor: "start" | "middle" | "end" = "middle", dy = 0) => (
    <text x={at[0]} y={at[1] + dy} fontSize={font} textAnchor={anchor}>
      {text}
    </text>
  );
  return (
    <svg
      className="gb-diagram"
      viewBox={`${minX - pad} ${minY - pad * 0.6} ${maxX - minX + pad * 2} ${maxY - minY + pad * 1.4}`}
      role="img"
      aria-label={`House ${formatLength(W, unit)} wide, ${formatLength(D, unit)} deep, walls ${formatLength(H, unit)} high, roof ${formatLength(R, unit)} high`}
    >
      <path className="gb-face gb-face-side" d={d(side)} />
      <path className="gb-face gb-face-roof" d={d(roofL)} />
      <path className="gb-face gb-face-roof" d={d(roofR)} />
      <path className="gb-face" d={d(front)} />
      {label(p(W / 2, 0, 0), `width ${formatLength(W, unit)}`, "middle", font * 1.25)}
      {label(p(W, D / 2, 0), `depth ${formatLength(D, unit)}`, "start", font * 1.1)}
      {label([p(0, 0, H / 2)[0] - font * 0.4, p(0, 0, H / 2)[1]], `wall ${formatLength(H, unit)}`, "end", font * 0.35)}
      {label([p(W / 2, 0, H + R)[0] - font * 0.5, p(W / 2, 0, H + R)[1]], `roof ${formatLength(R, unit)}`, "end", font * 0.2)}
    </svg>
  );
}

/** One printed sheet: the paper, the pieces (clipped to their part), and the sheet number. */
function SheetThumb({ sheet, n, paperLabel }: { sheet: Sheet; n: number; paperLabel: string }) {
  const font = Math.min(sheet.widthMm, sheet.heightMm) / 26;
  // Piece names are sized to the sheet, not the piece, so they stay readable in a 150px thumbnail.
  const nameFont = Math.min(sheet.widthMm, sheet.heightMm) / 15;
  const parts = sheet.items.map((i) => (i.part ? `${i.piece.title.toLowerCase()} part ${i.part.n} of ${i.part.of}` : i.piece.title.toLowerCase()));
  return (
    <figure className="gb-sheet">
      <svg viewBox={`0 0 ${sheet.widthMm} ${sheet.heightMm}`} role="img" aria-label={`Sheet ${n}, ${paperLabel} ${sheet.orientation}: ${parts.join(", ")}`}>
        <rect className="gb-paper" x={0} y={0} width={sheet.widthMm} height={sheet.heightMm} />
        {sheet.items.map((item, k) => {
          const { piece, src } = item;
          const id = `gb-clip-${n}-${k}`;
          const tx = item.pageX - src.x;
          const ty = item.pageY - src.y;
          return (
            <g key={k}>
              <clipPath id={id}>
                <rect x={src.x - 0.6} y={src.y - 0.6} width={src.w + 1.2} height={src.h + 1.2} />
              </clipPath>
              <g transform={`translate(${tx} ${ty})`} clipPath={`url(#${id})`}>
                <path className="gb-piece" d={pathData(piece.outline)} />
                {piece.openings.map((o, j) => (
                  <path key={j} className="gb-opening" d={pathData(o)} />
                ))}
                {item.part ? null : (
                  <text className="gb-piece-label" x={piece.labelAt[0]} y={piece.labelAt[1] + nameFont * 1.1} fontSize={nameFont} textAnchor="middle">
                    {piece.id === "front" ? "FRONT" : piece.title}
                  </text>
                )}
              </g>
            </g>
          );
        })}
        <rect className="gb-sheet-tag" x={font * 0.5} y={font * 0.5} width={font * 2} height={font * 2} rx={font * 0.4} />
        <text className="gb-sheet-num" x={font * 1.5} y={font * 1.95} fontSize={font * 1.3} textAnchor="middle">
          {n}
        </text>
        {/* A piece split across sheets is named in the corner of each part, where it can't be cut in half. */}
        {sheet.items[0]?.part ? (
          <text className="gb-piece-cut" x={font * 3} y={font * 1.95} fontSize={nameFont * 0.8}>
            {`${sheet.items[0].piece.id === "front" ? "FRONT" : sheet.items[0].piece.title} ${sheet.items[0].part.n}/${sheet.items[0].part.of}`}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}

export function GingerbreadHouseApp({ children }: { children?: ReactNode }) {
  const [preset, setPreset] = useState<HousePreset>("classic");
  const [unit, setUnit] = useState<Unit>("in");
  const [custom, setCustom] = useState<Record<keyof HouseSize, string>>(() => ({
    widthMm: toUnit(CLASSIC.widthMm, "in"),
    depthMm: toUnit(CLASSIC.depthMm, "in"),
    wallMm: toUnit(CLASSIC.wallMm, "in"),
    riseMm: toUnit(CLASSIC.riseMm, "in"),
  }));
  const [material, setMaterial] = useState<Material>("gingerbread");
  const [paperSize, setPaperSize] = useState<PaperSize>("letter");
  const [openings, setOpenings] = useState(true);
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const customSize: HouseSize = useMemo(
    () => ({
      widthMm: fromUnit(custom.widthMm, unit),
      depthMm: fromUnit(custom.depthMm, unit),
      wallMm: fromUnit(custom.wallMm, unit),
      riseMm: fromUnit(custom.riseMm, unit),
    }),
    [custom, unit],
  );
  const problem = preset === "custom" ? sizeProblem(customSize, unit) : null;
  const presetInfo = HOUSE_PRESETS.find((p) => p.id === preset);
  // While a custom size is out of range, keep showing the last good one (the classic house).
  const size = presetInfo ? presetInfo.size : problem ? CLASSIC : customSize;
  const sizeLabel = presetInfo ? `${presetInfo.label} (${presetInfo.note})` : `custom (${formatLength(size.widthMm, unit)} × ${formatLength(size.depthMm, unit)})`;

  const pieces = useMemo(() => housePieces(size, material, unit, openings), [size, material, unit, openings]);
  const sheets = useMemo(() => houseSheets(pieces, paperSize), [pieces, paperSize]);
  const taped = sheets.filter((s) => s.tile).length;
  const paperLabel = paperSize === "letter" ? "US Letter" : "A4";
  const area = doughAreaSqIn(pieces);
  // A 13 × 18 in half-sheet pan, with room between pieces for spreading.
  const pans = Math.max(1, Math.ceil(area / (13 * 18 * 0.6)));

  function switchUnit(next: Unit) {
    if (next === unit) return;
    setCustom((c) => ({
      widthMm: toUnit(fromUnit(c.widthMm, unit), next),
      depthMm: toUnit(fromUnit(c.depthMm, unit), next),
      wallMm: toUnit(fromUnit(c.wallMm, unit), next),
      riseMm: toUnit(fromUnit(c.riseMm, unit), next),
    }));
    setUnit(next);
  }

  async function download(): Promise<void> {
    if (problem) return;
    setBusy(true);
    setStatus({ kind: "progress", message: `Making the template on ${sheets.length} ${paperLabel} ${sheets.length === 1 ? "sheet" : "sheets"}…` });
    try {
      const { exportHouseTemplatePdf } = await import("@/lib/gingerbread-pdf");
      const count = await exportHouseTemplatePdf({ size, sizeLabel, fileLabel: preset, material, unit, openings, paperSize });
      setStatus({
        kind: "success",
        message: `Downloaded: ${count} ${count === 1 ? "sheet" : "sheets"}. Print at 100% (Actual Size), check the 1 in square on the roof, then cut each piece twice.`,
      });
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be made in this browser. Reload the page and try again, or try another browser." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="site-shell" lang="en">
      <a className="skip-link" href="#workspace">
        Skip to the gingerbread house template
      </a>
      <SiteHeader locale="en" route="gingerbreadHouse" />

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">FREE PRINTABLE TEMPLATE</p>
            <h1 id="page-title">Gingerbread house template</h1>
            <p className="intro-copy">
              Free printable gingerbread house template in any size. Pick Small, Classic or Large, or type your own width, depth and wall height, and
              download a PDF of the front, side walls and roof at actual size. Works for gingerbread or cardboard. No sign-up.
            </p>
            <UpdatedNote locale="en" route="gingerbreadHouse" />
          </div>
          <div className="privacy-note">
            <span className="privacy-lock" aria-hidden="true">⌂</span>
            <div>
              <strong>Pieces that fit together</strong>
              <span>The side walls are cut shorter by the thickness of the dough, so the corners close.</span>
            </div>
          </div>
        </section>

        <div className="stocking-bench">
          <section className="grid-card stocking-preview" aria-labelledby="preview-heading">
            <div className="output-heading">
              <div>
                <p className="section-kicker">WHAT PRINTS</p>
                <h2 id="preview-heading">
                  {sheets.length} {paperLabel} {sheets.length === 1 ? "sheet" : "sheets"}
                </h2>
              </div>
              <span className={taped ? "page-badge" : "page-badge gb-badge-ok"}>{taped ? `${taped} sheets to tape` : "No taping"}</span>
            </div>
            <div className="gb-sheets">
              {sheets.map((sheet, i) => (
                <SheetThumb key={i} sheet={sheet} n={i + 1} paperLabel={paperLabel} />
              ))}
            </div>
            <p className="stocking-legend">
              <span>Solid: cut</span>
              <span className="legend-sew">Dashed: door and windows, optional</span>
            </p>
            <ul className="gb-cutlist" aria-label="Cut list">
              {pieces.map((piece) => (
                <li key={piece.id}>
                  <b>{piece.title.charAt(0) + piece.title.slice(1).toLowerCase()}</b>
                  <span>{piece.dims}</span>
                  <span className="gb-cut-count">{piece.cut}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid-card stocking-settings" aria-labelledby="settings-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">YOUR HOUSE</p>
                <h2 id="settings-heading">Size and paper</h2>
              </div>
            </div>
            <HouseDiagram size={size} unit={unit} />

            <fieldset className="radio-fieldset stocking-field">
              <legend>House size</legend>
              <div className="segmented-control gb-sizes">
                {HOUSE_PRESETS.map((option) => (
                  <label key={option.id}>
                    <input type="radio" name="house-size" value={option.id} checked={preset === option.id} onChange={() => setPreset(option.id)} />
                    <span>
                      <b>{option.label}</b>
                      <small>{option.note}</small>
                    </span>
                  </label>
                ))}
                <label>
                  <input type="radio" name="house-size" value="custom" checked={preset === "custom"} onChange={() => setPreset("custom")} />
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
                  {FIELDS.map((field) => (
                    <label key={field.key} className="gb-input">
                      <span>{field.label}</span>
                      <span className="gb-input-box">
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step={unit === "in" ? 0.25 : 0.5}
                          value={custom[field.key]}
                          aria-invalid={problem ? true : undefined}
                          onChange={(event) => setCustom((c) => ({ ...c, [field.key]: event.target.value }))}
                        />
                        <span aria-hidden="true">{unit}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {problem ? (
                  <p className="status-message is-error" role="alert">
                    {problem} The preview shows the Classic house until then.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="gb-two">
              <fieldset className="radio-fieldset stocking-field">
                <legend>Made from</legend>
                <div className="segmented-control">
                  {(["gingerbread", "cardboard"] as Material[]).map((m) => (
                    <label key={m}>
                      <input type="radio" name="house-material" value={m} checked={material === m} onChange={() => setMaterial(m)} />
                      <span>{m === "gingerbread" ? "Gingerbread" : "Cardboard"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="radio-fieldset stocking-field">
                <legend>Units</legend>
                <div className="segmented-control">
                  {(["in", "cm"] as Unit[]).map((u) => (
                    <label key={u}>
                      <input type="radio" name="house-unit" value={u} checked={unit === u} onChange={() => switchUnit(u)} />
                      <span>{u === "in" ? "Inches" : "cm"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <fieldset className="radio-fieldset stocking-field">
              <legend>Paper in your printer</legend>
              <div className="segmented-control">
                {PAPERS.map((option) => (
                  <label key={option.value}>
                    <input type="radio" name="house-paper" value={option.value} checked={paperSize === option.value} onChange={() => setPaperSize(option.value)} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="gb-check">
              <input type="checkbox" checked={openings} onChange={(event) => setOpenings(event.target.checked)} />
              <span>Door and windows</span>
            </label>

            <dl className="stocking-facts">
              <div>
                <dt>Sheets</dt>
                <dd>{sheets.length}</dd>
              </div>
              <div>
                <dt>{material === "gingerbread" ? "Dough" : "Board"}</dt>
                <dd>{formatLength(THICKNESS_MM[material], unit)}</dd>
              </div>
              <div>
                <dt>{material === "gingerbread" ? "13 × 18 in pans" : "Board area"}</dt>
                <dd>{material === "gingerbread" ? pans : `${Math.round(area)} sq in`}</dd>
              </div>
            </dl>

            <button className="primary-button export-button" type="button" onClick={() => void download()} disabled={busy || Boolean(problem)}>
              Download template PDF
            </button>
            <PatternSvgOffer
              slug="christmas-pattern-gingerbread-house"
              fileName="gingerbread-house-template.svg"
              makeSvg={() => houseSvg(size, material, openings)}
              disabled={Boolean(problem)}
              fit={houseFit(size, material)}
            />
            {status ? (
              <p className={STATUS_CLASS[status.kind]} role={status.kind === "error" ? "alert" : "status"} aria-live="polite">
                {status.message}
              </p>
            ) : null}
            <p className="grid-note">
              Print at 100% (Actual Size), not &quot;Fit to page&quot;. Every piece is cut twice: lay the paper on the rolled dough and cut around it with a
              sharp knife.
            </p>
            <p className="stocking-cricut">
              Decorating the house with icing shapes or a stencilled roof? The <Link href={localizedPath("en", "christmasStencils")}>free Christmas stencils</Link>{" "}
              have snowflakes, stars and trees that print at any size.
            </p>
          </section>
        </div>

        {children}
      </main>

      <SiteFooter locale="en" />
    </div>
  );
}
