/**
 * The grid method: where the lines go on a reference photo, how the squares are named, and how
 * big to draw the same grid on a sheet, canvas or wall. Pure functions, no DOM.
 *
 * Rows are lettered from the top (A, B, … Z, AA, AB …) and columns are numbered from the left,
 * so every square has a name like B3 on both the photo and the drawing surface.
 */

export type GridColor = "black" | "white" | "red";
export type GridWeight = "thin" | "medium" | "thick";

export interface GridStyle {
  color: GridColor;
  weight: GridWeight;
  labels: boolean;
  diagonals: boolean;
  grayscale: boolean;
}

export const DEFAULT_GRID_STYLE: GridStyle = { color: "black", weight: "medium", labels: true, diagonals: false, grayscale: false };

export interface Grid {
  columns: number;
  rows: number;
  /** One square in image pixels. With square cells the last row may be cut short by the photo's edge. */
  cellWidthPx: number;
  cellHeightPx: number;
  widthPx: number;
  heightPx: number;
}

export const MIN_COLUMNS = 2;
export const MAX_COLUMNS = 40;
export const MAX_ROWS = 200;

export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/**
 * Square cells (the usual grid method): the photo is split into `columns` across, and as many rows
 * as it takes to reach the bottom. Otherwise the photo is split into exactly `rows` × `columns`.
 */
export function makeGrid(widthPx: number, heightPx: number, options: { columns: number; square: boolean; rows?: number }): Grid {
  const columns = clampInt(options.columns, MIN_COLUMNS, MAX_COLUMNS);
  const cellWidthPx = widthPx / columns;
  if (options.square) {
    const rows = clampInt(Math.ceil(heightPx / cellWidthPx - 1e-6), 1, MAX_ROWS);
    return { columns, rows, cellWidthPx, cellHeightPx: cellWidthPx, widthPx, heightPx };
  }
  const rows = clampInt(options.rows ?? columns, 1, MAX_ROWS);
  return { columns, rows, cellWidthPx, cellHeightPx: heightPx / rows, widthPx, heightPx };
}

/** Line positions in image pixels, outer edges included. The last horizontal line is the photo's bottom edge. */
export function linePositions(grid: Grid): { xs: number[]; ys: number[] } {
  const xs = Array.from({ length: grid.columns + 1 }, (_, i) => (i === grid.columns ? grid.widthPx : i * grid.cellWidthPx));
  const ys = Array.from({ length: grid.rows }, (_, j) => j * grid.cellHeightPx);
  if (grid.heightPx - ys[ys.length - 1] > 1e-6) ys.push(grid.heightPx);
  return { xs, ys };
}

/** Diagonals in a sliver of a last row are noise; rows under half a square get none. */
export function rowTakesDiagonals(grid: Grid, rowHeightPx: number): boolean {
  return rowHeightPx >= grid.cellHeightPx * 0.5 - 1e-9;
}

/** A, B, … Z, AA, AB … */
export function rowLabel(index: number): string {
  let n = index + 1;
  let label = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    label = String.fromCharCode(65 + m) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

export function columnLabel(index: number): string {
  return String(index + 1);
}

export function cellName(row: number, column: number): string {
  return rowLabel(row) + columnLabel(column);
}

export interface SurfaceFit {
  /** Millimetres per image pixel with the photo drawn as large as the surface allows. */
  scale: number;
  cellWidthMm: number;
  cellHeightMm: number;
  drawingWidthMm: number;
  drawingHeightMm: number;
  /** The side the drawing fills; the other side keeps `spareMm` empty. */
  limitedBy: "width" | "height" | "both";
  spareMm: number;
}

/** The photo scaled to fit inside the surface without distortion, and the squares that go with it. */
export function fitToSurface(grid: Grid, surfaceWidthMm: number, surfaceHeightMm: number): SurfaceFit {
  const byWidth = surfaceWidthMm / grid.widthPx;
  const byHeight = surfaceHeightMm / grid.heightPx;
  const scale = Math.min(byWidth, byHeight);
  const drawingWidthMm = grid.widthPx * scale;
  const drawingHeightMm = grid.heightPx * scale;
  const limitedBy = Math.abs(byWidth - byHeight) / scale < 1e-6 ? "both" : byWidth < byHeight ? "width" : "height";
  const spareMm = limitedBy === "width" ? surfaceHeightMm - drawingHeightMm : limitedBy === "height" ? surfaceWidthMm - drawingWidthMm : 0;
  return { scale, cellWidthMm: grid.cellWidthPx * scale, cellHeightMm: grid.cellHeightPx * scale, drawingWidthMm, drawingHeightMm, limitedBy, spareMm };
}

export type LengthUnit = "cm" | "in";

/** What a ruler can measure: millimetres, or sixteenths of an inch. */
export const RULER_STEP_MM: Record<LengthUnit, number> = { cm: 1, in: 25.4 / 16 };

/**
 * A square size you can mark with a ruler: rounded down to the ruler step so the whole grid still
 * fits on the surface. Squares smaller than one step keep their exact size.
 */
export function rulerSize(mm: number, unit: LengthUnit): number {
  const step = RULER_STEP_MM[unit];
  const rounded = Math.floor(mm / step + 1e-9) * step;
  return rounded > 0 ? rounded : mm;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** 47.6 mm → "4.8 cm"; in inches, the nearest sixteenth: 46.04 mm → "1 13/16 in". */
export function formatLength(mm: number, unit: LengthUnit): string {
  if (unit === "cm") return `${Number((mm / 10).toFixed(1))} cm`;
  const sixteenths = Math.round((mm / 25.4) * 16);
  if (sixteenths === 0) return `${Number((mm / 25.4).toFixed(2))} in`;
  const whole = Math.floor(sixteenths / 16);
  const rest = sixteenths % 16;
  if (rest === 0) return `${whole} in`;
  const divisor = gcd(rest, 16);
  const fraction = `${rest / divisor}/${16 / divisor}`;
  return whole ? `${whole} ${fraction} in` : `${fraction} in`;
}

/** Line widths for the downloaded image (share of the photo's long side) and the PDF (mm). */
export const LINE_SHARE: Record<GridWeight, number> = { thin: 0.0012, medium: 0.0024, thick: 0.0042 };
export const LINE_MM: Record<GridWeight, number> = { thin: 0.2, medium: 0.35, thick: 0.6 };
export const LINE_RGB: Record<GridColor, [number, number, number]> = { black: [29, 27, 24], white: [255, 255, 255], red: [214, 51, 42] };
