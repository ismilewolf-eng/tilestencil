"use client";

import type { ChangeEvent, DragEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PaperSize } from "@/lib/geometry";
import {
  clampInt,
  DEFAULT_GRID_STYLE,
  fitToSurface,
  formatLength,
  makeGrid,
  MAX_COLUMNS,
  MIN_COLUMNS,
  rulerSize,
  type GridColor,
  type GridStyle,
  type GridWeight,
  type LengthUnit,
} from "@/lib/grid";
import { DOWNLOAD_MAX_SIDE, drawGridImage, fitScale, photoJpeg } from "@/lib/grid-canvas";
import { blankGridPlan, exportBlankGridPdf, exportGridPhotoPdf } from "@/lib/grid-pdf";
import { fileStem } from "@/lib/pdf-export";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

// The drawing grid maker (English only): a reference photo with numbered squares, and the same
// grid sized for the paper, canvas or wall it will be drawn on. Nothing leaves the browser.

type Photo = { element: HTMLImageElement; name: string; widthPx: number; heightPx: number; sample: boolean };
/** Feedback shows next to the button that caused it: the photo outputs or the empty grid. */
type Status = { kind: "progress" | "success" | "error"; message: string; from: "photo" | "blank" } | null;

const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp"]);
const PREVIEW_MAX_SIDE = 1400;
const SAMPLE = { src: "/examples/spray-paint-photo.webp", name: "sample-portrait.webp" };
const MM_PER: Record<LengthUnit, number> = { cm: 10, in: 25.4 };
const DEFAULT_SURFACE: Record<LengthUnit, [string, string]> = { in: ["11", "14"], cm: ["30", "40"] };

const STATUS_CLASS: Record<NonNullable<Status>["kind"], string> = {
  progress: "status-message is-progress",
  success: "status-message is-success",
  error: "status-message is-error",
};
const SWATCH_CLASS: Record<GridColor, string> = { black: "grid-swatch is-black", white: "grid-swatch is-white", red: "grid-swatch is-red" };

const COLORS: Array<{ value: GridColor; label: string }> = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "red", label: "Red" },
];
const WEIGHTS: Array<{ value: GridWeight; label: string }> = [
  { value: "thin", label: "Thin" },
  { value: "medium", label: "Medium" },
  { value: "thick", label: "Thick" },
];

function loadPhoto(src: string, name: string, sample: boolean): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve({ element, name, widthPx: element.naturalWidth, heightPx: element.naturalHeight, sample });
    element.onerror = () => reject(new Error("This image could not be opened. Try a JPG, PNG or WebP."));
    element.src = src;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("This file could not be read. Choose the photo again."));
    reader.readAsDataURL(file);
  });
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** Keeps a measurement such as "1 3/4 in" on one line. */
const nb = (text: string) => text.replace(/ /g, " ");

const positive = (text: string) => {
  const value = Number(text);
  return Number.isFinite(value) && value > 0 ? value : null;
};

function StatusLine({ status }: { status: NonNullable<Status> }) {
  return (
    <p className={STATUS_CLASS[status.kind]} role={status.kind === "error" ? "alert" : "status"} aria-live="polite">
      {status.message}
    </p>
  );
}

export function GridDrawingApp({ children }: { children?: ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [columnsInput, setColumnsInput] = useState("6");
  const [square, setSquare] = useState(true);
  const [rowsInput, setRowsInput] = useState("8");
  const [style, setStyle] = useState<GridStyle>(DEFAULT_GRID_STYLE);
  const [unit, setUnit] = useState<LengthUnit>("in");
  const [surfaceWidth, setSurfaceWidth] = useState(DEFAULT_SURFACE.in[0]);
  const [surfaceHeight, setSurfaceHeight] = useState(DEFAULT_SURFACE.in[1]);
  const [paperSize, setPaperSize] = useState<PaperSize>("letter");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const setStyleKey = <K extends keyof GridStyle>(key: K, value: GridStyle[K]) => setStyle((current) => ({ ...current, [key]: value }));
  // What is typed stays as typed (so "10" can be entered); the grid uses the nearest allowed number.
  const columns = clampInt(Number(columnsInput) || MIN_COLUMNS, MIN_COLUMNS, MAX_COLUMNS);

  const widthMm = (positive(surfaceWidth) ?? 0) * MM_PER[unit];
  const heightMm = (positive(surfaceHeight) ?? 0) * MM_PER[unit];
  const surfaceValid = widthMm > 0 && heightMm > 0;

  // Without a photo the grid covers the surface itself, so the empty grid works on its own.
  const grid = useMemo(() => {
    const width = photo?.widthPx ?? widthMm;
    const height = photo?.heightPx ?? heightMm;
    if (!(width > 0 && height > 0)) return null;
    return makeGrid(width, height, { columns, square, rows: Number(rowsInput) });
  }, [photo, widthMm, heightMm, columns, square, rowsInput]);

  const surface = useMemo(() => {
    if (!grid || !surfaceValid) return null;
    const fit = fitToSurface(grid, widthMm, heightMm);
    const cellWidthMm = rulerSize(fit.cellWidthMm, unit);
    const cellHeightMm = square ? cellWidthMm : rulerSize(fit.cellHeightMm, unit);
    const drawingWidthMm = (grid.widthPx / grid.cellWidthPx) * cellWidthMm;
    const drawingHeightMm = (grid.heightPx / grid.cellHeightPx) * cellHeightMm;
    const plan = blankGridPlan(drawingWidthMm, drawingHeightMm, paperSize);
    const partialRow = grid.heightPx / grid.cellHeightPx - (grid.rows - 1) < 0.999;
    return {
      cellWidthMm,
      cellHeightMm,
      drawingWidthMm,
      drawingHeightMm,
      spareWidthMm: widthMm - drawingWidthMm,
      spareHeightMm: heightMm - drawingHeightMm,
      pages: plan.tiles.length,
      partialRow,
    };
  }, [grid, surfaceValid, widthMm, heightMm, unit, square, paperSize]);

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !photo || !grid) return;
    try {
      drawGridImage(canvas, photo.element, grid, style, fitScale(photo.widthPx, photo.heightPx, PREVIEW_MAX_SIDE));
    } catch {
      setStatus({ kind: "error", message: "This browser could not draw the preview. Try a smaller photo.", from: "photo" });
    }
  }, [photo, grid, style]);

  useEffect(() => {
    if (status?.kind !== "success") return undefined;
    const timer = window.setTimeout(() => setStatus(null), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function acceptFile(file: File | undefined): Promise<void> {
    if (!file) return;
    if (!ACCEPTED.has(file.type)) {
      setFileError("Choose a JPG, PNG or WebP photo.");
      return;
    }
    setFileError(null);
    setStatus(null);
    try {
      setPhoto(await loadPhoto(await readAsDataUrl(file), file.name, false));
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "This file could not be read.");
    }
  }

  async function loadSample(): Promise<void> {
    setFileError(null);
    try {
      setPhoto(await loadPhoto(SAMPLE.src, SAMPLE.name, true));
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "The sample could not be loaded.");
    }
  }

  function removePhoto(): void {
    setPhoto(null);
    setStatus(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function switchUnit(next: LengthUnit): void {
    if (next === unit) return;
    const convert = (text: string) => {
      const value = positive(text);
      return value === null ? text : String(Number(((value * MM_PER[unit]) / MM_PER[next]).toFixed(next === "cm" ? 1 : 2)));
    };
    setSurfaceWidth(convert(surfaceWidth));
    setSurfaceHeight(convert(surfaceHeight));
    setUnit(next);
  }

  const stem = photo ? fileStem(photo.name) : "drawing";

  async function downloadPng(): Promise<void> {
    if (!photo || !grid) return;
    setBusy(true);
    setStatus({ kind: "progress", message: "Drawing the full-size image…", from: "photo" });
    try {
      const canvas = document.createElement("canvas");
      drawGridImage(canvas, photo.element, grid, style, fitScale(photo.widthPx, photo.heightPx, DOWNLOAD_MAX_SIDE));
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("png");
      download(blob, `${stem}-grid-${grid.columns}x${grid.rows}.png`);
      setStatus({ kind: "success", message: `Saved a ${canvas.width} × ${canvas.height} px PNG with a ${grid.columns} × ${grid.rows} grid.`, from: "photo" });
    } catch {
      setStatus({ kind: "error", message: "The image could not be saved. Crop or shrink the photo, then try again.", from: "photo" });
    } finally {
      setBusy(false);
    }
  }

  async function printPhoto(): Promise<void> {
    if (!photo || !grid) return;
    setBusy(true);
    setStatus({ kind: "progress", message: "Preparing a one-page PDF…", from: "photo" });
    try {
      await exportGridPhotoPdf({
        photo: photoJpeg(photo.element, photo.widthPx, photo.heightPx, style.grayscale),
        grid,
        style,
        paperSize,
        unit,
        name: photo.name,
      });
      setStatus({ kind: "success", message: "Your PDF is ready. Print it at 100% (Actual Size) so the squares match the size written on the page.", from: "photo" });
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be made. Try again, or download the PNG instead.", from: "photo" });
    } finally {
      setBusy(false);
    }
  }

  async function printBlankGrid(): Promise<void> {
    if (!grid || !surface) return;
    setBusy(true);
    setStatus({ kind: "progress", message: "Preparing the empty grid…", from: "blank" });
    try {
      const pages = await exportBlankGridPdf({
        grid,
        cellWidthMm: surface.cellWidthMm,
        cellHeightMm: surface.cellHeightMm,
        style,
        paperSize,
        name: photo?.name ?? "drawing",
        onProgress: (done, total) => setStatus({ kind: "progress", message: `Drawing page ${done} of ${total}…`, from: "blank" }),
      });
      setStatus({ kind: "success", message: `Your ${pages}-page PDF is ready. Print at 100% (Actual Size), then tape the pages together using the corner marks.`, from: "blank" });
    } catch {
      setStatus({ kind: "error", message: "The PDF could not be made. Check the width and height, then try again.", from: "blank" });
    } finally {
      setBusy(false);
    }
  }

  const paperLabel = paperSize === "letter" ? "US Letter" : "A4";
  const rowsShown = grid?.rows ?? 0;

  return (
    <div className="site-shell" lang="en">
      <a className="skip-link" href="#workspace">
        Skip to the grid maker
      </a>
      <SiteHeader locale="en" route="gridDrawing" />

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">GRID METHOD</p>
            <h1 id="page-title">Drawing grid maker</h1>
            <p className="intro-copy">
              Put numbered squares over a reference photo, draw the same squares on your paper, canvas or wall, then copy the picture one square at a
              time. The grid maker also works out how big each square should be on your surface.
            </p>
          </div>
          <div className="privacy-note">
            <span className="privacy-lock" aria-hidden="true">⌁</span>
            <div>
              <strong>No uploads</strong>
              <span>Your photo is drawn on this page and never sent anywhere.</span>
            </div>
          </div>
        </section>

        <div className="grid-bench">
          <section className="grid-card grid-source" aria-labelledby="photo-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">REFERENCE PHOTO</p>
                <h2 id="photo-heading">Choose the photo you will copy</h2>
              </div>
              {photo ? (
                <button className="text-button" type="button" onClick={removePhoto}>
                  Remove photo
                </button>
              ) : null}
            </div>
            <div
              className={`upload-zone${isDragging ? " is-dragging" : ""}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event: DragEvent<HTMLDivElement>) => {
                event.preventDefault();
                setIsDragging(false);
                void acceptFile(event.dataTransfer.files?.[0]);
              }}
            >
              <input
                ref={inputRef}
                id="grid-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="visually-hidden"
                onChange={(event: ChangeEvent<HTMLInputElement>) => void acceptFile(event.target.files?.[0])}
              />
              {photo ? (
                <div className="file-summary">
                  <img src={photo.element.src} alt="" width="72" height="72" />
                  <div>
                    <strong title={photo.name}>{photo.sample ? "Sample portrait" : photo.name}</strong>
                    <span>
                      {photo.widthPx.toLocaleString("en-US")} × {photo.heightPx.toLocaleString("en-US")} px
                    </span>
                  </div>
                  <label className="secondary-button" htmlFor="grid-photo">
                    Replace
                  </label>
                </div>
              ) : (
                <label className="upload-prompt" htmlFor="grid-photo">
                  <span className="upload-glyph" aria-hidden="true">↑</span>
                  <span>
                    <strong>Choose a JPG, PNG or WebP</strong>
                    <small>or drag it here</small>
                  </span>
                </label>
              )}
            </div>
            {!photo ? (
              <div className="preset-bar">
                <span className="preset-bar-label">No photo to hand?</span>
                <div className="preset-buttons">
                  <button type="button" className="preset-pill" onClick={() => void loadSample()}>
                    Try the sample portrait
                  </button>
                </div>
              </div>
            ) : null}
            {photo?.sample ? <p className="grid-credit">Sample: Edward S. Curtis, 1907, public domain.</p> : null}
            {fileError ? (
              <p className="field-error" role="alert">
                {fileError}
              </p>
            ) : null}
          </section>

          <section className="grid-card grid-preview" aria-labelledby="preview-heading">
            <div className="output-heading">
              <div>
                <p className="section-kicker">PREVIEW</p>
                <h2 id="preview-heading">Your photo with the grid</h2>
              </div>
              {photo && grid ? (
                <span className="page-badge">
                  {grid.columns} × {rowsShown}
                </span>
              ) : null}
            </div>
            {photo && grid ? (
              <div className="grid-canvas-frame">
                <canvas ref={previewRef} role="img" aria-label={`The photo with a grid of ${grid.columns} by ${rowsShown} squares`} />
              </div>
            ) : (
              <div className="preview-empty grid-empty">
                <span className="preview-empty-mark" aria-hidden="true">
                  ▦
                </span>
                <p>Choose a photo to see it with the grid.</p>
              </div>
            )}
            <div className="grid-actions">
              <button className="primary-button export-button" type="button" onClick={() => void downloadPng()} disabled={!photo || busy}>
                Download photo with grid (PNG)
              </button>
              <div className="grid-print-row">
                <button className="secondary-button" type="button" onClick={() => void printPhoto()} disabled={!photo || busy}>
                  Print on one page (PDF)
                </button>
                <label className="grid-paper">
                  <span className="visually-hidden">Paper size</span>
                  <select value={paperSize} onChange={(event) => setPaperSize(event.target.value as PaperSize)}>
                    <option value="letter">US Letter</option>
                    <option value="a4">A4</option>
                  </select>
                </label>
              </div>
            </div>
            {status?.from === "photo" ? <StatusLine status={status} /> : null}
          </section>

          <section className="grid-card grid-settings" aria-label="Grid settings">
            <div className="grid-settings-part">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">SQUARES</p>
                  <h2>How many squares</h2>
                </div>
              </div>
              <label className="stencil-threshold grid-columns">
                <span>
                  Squares across <output>{columns}</output>
                </span>
                <input type="range" min={MIN_COLUMNS} max={30} step={1} value={Math.min(columns, 30)} onChange={(event) => setColumnsInput(event.target.value)} />
                <small>Fewer squares are quicker to draw. More squares help with faces and fine detail.</small>
              </label>
              <div className="input-grid two-up">
                <label>
                  <span>Across</span>
                  <div className="number-control">
                    <input
                      type="number"
                      min={MIN_COLUMNS}
                      max={MAX_COLUMNS}
                      step={1}
                      inputMode="numeric"
                      value={columnsInput}
                      onChange={(event) => setColumnsInput(event.target.value)}
                      onBlur={() => setColumnsInput(String(columns))}
                    />
                  </div>
                </label>
                <label>
                  <span>Down</span>
                  <div className="number-control">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      value={square ? rowsShown || "" : rowsInput}
                      disabled={square}
                      onChange={(event) => setRowsInput(event.target.value)}
                      aria-describedby="rows-note"
                    />
                  </div>
                </label>
              </div>
              <label className="check-control">
                <input type="checkbox" checked={square} onChange={(event) => setSquare(event.target.checked)} />
                <span>Keep the squares square</span>
              </label>
              <p className="grid-note" id="rows-note">
                {square
                  ? "Rows follow from the photo's height, so every square is the same shape."
                  : "The photo is split into exactly these rows, so the squares may be rectangles."}
              </p>
            </div>

            <div className="grid-settings-part">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">LINES</p>
                  <h2>How the grid looks</h2>
                </div>
              </div>
              <div className="grid-pickers">
                <fieldset className="radio-fieldset">
                  <legend>Line colour</legend>
                  <div className="segmented-control three">
                    {COLORS.map((option) => (
                      <label key={option.value}>
                        <input type="radio" name="grid-color" value={option.value} checked={style.color === option.value} onChange={() => setStyleKey("color", option.value)} />
                        <span className={SWATCH_CLASS[option.value]}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="radio-fieldset">
                  <legend>Line weight</legend>
                  <div className="segmented-control three">
                    {WEIGHTS.map((option) => (
                      <label key={option.value}>
                        <input type="radio" name="grid-weight" value={option.value} checked={style.weight === option.value} onChange={() => setStyleKey("weight", option.value)} />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="grid-checks">
                <label className="check-control">
                  <input type="checkbox" checked={style.labels} onChange={(event) => setStyleKey("labels", event.target.checked)} />
                  <span>Name the squares (A1, B3…)</span>
                </label>
                <label className="check-control">
                  <input type="checkbox" checked={style.diagonals} onChange={(event) => setStyleKey("diagonals", event.target.checked)} />
                  <span>Add diagonal lines</span>
                </label>
                <label className="check-control">
                  <input type="checkbox" checked={style.grayscale} onChange={(event) => setStyleKey("grayscale", event.target.checked)} />
                  <span>Black-and-white photo</span>
                </label>
              </div>
            </div>
          </section>

          <section className="grid-card grid-surface" aria-labelledby="surface-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">YOUR PAPER, CANVAS OR WALL</p>
                <h2 id="surface-heading">How big to draw the grid</h2>
              </div>
              <div className="unit-switch" aria-label="Measurement unit">
                <button className={unit === "in" ? "is-selected" : undefined} type="button" aria-pressed={unit === "in"} onClick={() => switchUnit("in")}>
                  in
                </button>
                <button className={unit === "cm" ? "is-selected" : undefined} type="button" aria-pressed={unit === "cm"} onClick={() => switchUnit("cm")}>
                  cm
                </button>
              </div>
            </div>
            <div className="input-grid two-up">
              <label>
                <span>Width</span>
                <div className="number-control">
                  <input type="number" min="0.1" step="any" inputMode="decimal" value={surfaceWidth} onChange={(event) => setSurfaceWidth(event.target.value)} />
                  <em>{unit}</em>
                </div>
              </label>
              <label>
                <span>Height</span>
                <div className="number-control">
                  <input type="number" min="0.1" step="any" inputMode="decimal" value={surfaceHeight} onChange={(event) => setSurfaceHeight(event.target.value)} />
                  <em>{unit}</em>
                </div>
              </label>
            </div>
            <div className="grid-result" role="status" aria-live="polite">
              {surface && grid ? (
                <>
                  <p className="grid-result-main">
                    Draw <b>{nb(`${grid.columns} × ${grid.rows}`)}</b> squares, each{" "}
                    <b>
                      {square
                        ? nb(formatLength(surface.cellWidthMm, unit))
                        : `${nb(formatLength(surface.cellWidthMm, unit))} wide × ${nb(formatLength(surface.cellHeightMm, unit))} tall`}
                    </b>
                    .
                  </p>
                  <p className="grid-result-detail">
                    The drawing comes out {nb(formatLength(surface.drawingWidthMm, unit))} × {nb(formatLength(surface.drawingHeightMm, unit))}
                    {surface.spareWidthMm >= MM_PER[unit] / 8 || surface.spareHeightMm >= MM_PER[unit] / 8
                      ? `, leaving ${nb(formatLength(Math.max(surface.spareWidthMm, 0), unit))} spare across and ${nb(formatLength(Math.max(surface.spareHeightMm, 0), unit))} spare down.`
                      : ", filling the surface."}
                    {photo ? (surface.partialRow ? " The bottom row is only part of a square, as on the photo." : "") : " With no photo, the grid covers the whole surface."}
                  </p>
                </>
              ) : (
                <p className="grid-result-detail">Enter the width and height of the surface you will draw on.</p>
              )}
            </div>
            <button className="secondary-button export-button grid-blank-button" type="button" onClick={() => void printBlankGrid()} disabled={!surface || busy}>
              Print the empty grid at full size (PDF)
            </button>
            {status?.from === "blank" ? <StatusLine status={status} /> : null}
            <p className="grid-note">
              {surface ? `${surface.pages} ${paperLabel} page${surface.pages === 1 ? "" : "s"}, printed at 100% (Actual Size). ` : "Printed at 100% (Actual Size). "}
              Tape the pages together using the corner marks, then lay the grid under thin paper to trace it, or use it as a guide when you rule the
              lines on a canvas or wall.
            </p>
          </section>
        </div>

        {children}
      </main>

      <SiteFooter locale="en" />
    </div>
  );
}
