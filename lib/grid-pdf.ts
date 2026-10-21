/**
 * PDFs for the drawing grid maker. Grid lines and square names are drawn as vectors on top of the
 * photo, so they stay sharp at any print size; the empty grid has no image at all.
 */
import { calculateTilePlan, getPaperDimensions, type PageOrientation, type PaperSize, type TilePlan } from "@/lib/geometry";
import {
  cellName,
  columnLabel,
  formatLength,
  linePositions,
  LINE_MM,
  LINE_RGB,
  rowLabel,
  rowTakesDiagonals,
  type Grid,
  type GridStyle,
  type LengthUnit,
} from "@/lib/grid";
import { drawRegistrationMarks, fileStem, type JsPdfInstance } from "@/lib/pdf-export";

/** jsPDF calls used here beyond the shared tiled-export type. */
type GridPdf = JsPdfInstance & {
  setFillColor: (red: number, green: number, blue: number) => void;
  rect: (x: number, y: number, width: number, height: number, style?: "F" | "S" | "FD") => void;
  getTextWidth: (text: string) => number;
};

const PHOTO_MARGIN_MM = 12;
/** Room outside the photo for column numbers (above) and row letters (left). */
const GUTTER_MM = 7;
const FOOTER_MM = 9;
const LABEL_RGB: [number, number, number] = [70, 65, 58];
/** White lines vanish on paper; the empty grid uses a dark pencil grey instead. */
const PAPER_LINE_RGB: [number, number, number] = [95, 89, 80];

/** Margin and overlap of the empty grid's pages, as in the main poster tool's defaults. */
export const BLANK_GRID_MARGIN_MM = 8;
export const BLANK_GRID_OVERLAP_MM = 5;

const PT_PER_MM = 72 / 25.4;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

async function newPdf(orientation: PageOrientation, widthMm: number, heightMm: number): Promise<GridPdf> {
  const { jsPDF } = await import("jspdf");
  return new jsPDF({ orientation, unit: "mm", format: [widthMm, heightMm], compress: true, putOnlyUsedFonts: true }) as unknown as GridPdf;
}

/**
 * Print note and sheet number for the empty grid. Sheets are counted, not lettered, so they are
 * never confused with square names such as A1.
 */
function drawSheetGuidance(pdf: GridPdf, tile: TilePlan["tiles"][number], plan: TilePlan): void {
  const sheet = tile.index + 1;
  const neighbours: string[] = [];
  if (tile.column > 0) neighbours.push(`right of sheet ${sheet - 1}`);
  if (tile.row > 0) neighbours.push(`below sheet ${sheet - plan.columns}`);
  pdf.setTextColor(70, 65, 58);
  pdf.setFontSize(6.6);
  pdf.text("Print at 100% / Actual Size — do not fit to page", plan.paper.widthMm / 2, 3.8, { align: "center" });
  pdf.setFontSize(6.2);
  pdf.text(
    `Sheet ${sheet} of ${plan.tiles.length}${neighbours.length ? ` · goes ${neighbours.join(", ")}` : ""} · ${plan.overlapMm.toFixed(0)} mm overlap`,
    plan.paper.widthMm / 2,
    plan.paper.heightMm - Math.max(2.8, plan.marginMm / 2),
    { align: "center" },
  );
}

/** Cells as rectangles in grid units scaled by `sx`, `sy` (mm per image pixel), from the line positions. */
function cellEdges(grid: Grid, sx: number, sy: number): { xs: number[]; ys: number[] } {
  const { xs, ys } = linePositions(grid);
  return { xs: xs.map((x) => x * sx), ys: ys.map((y) => y * sy) };
}

/** Liang–Barsky: the part of a segment inside a rectangle, or null. */
export function clipSegment(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  left: number,
  top: number,
  right: number,
  bottom: number,
): [number, number, number, number] | null {
  const dx = x2 - x1;
  const dy = y2 - y1;
  let t0 = 0;
  let t1 = 1;
  for (const [p, q] of [
    [-dx, x1 - left],
    [dx, right - x1],
    [-dy, y1 - top],
    [dy, bottom - y1],
  ] as const) {
    if (p === 0) {
      if (q < 0) return null;
      continue;
    }
    const t = q / p;
    if (p < 0) t0 = Math.max(t0, t);
    else t1 = Math.min(t1, t);
    if (t0 > t1) return null;
  }
  return [x1 + t0 * dx, y1 + t0 * dy, x1 + t1 * dx, y1 + t1 * dy];
}

/** The photo with its grid on one page, as large as the page allows, centred. */
export async function exportGridPhotoPdf({
  photo,
  grid,
  style,
  paperSize,
  unit,
  name,
}: {
  /** The photo as shown (black and white already applied), JPEG data URL. */
  photo: string;
  grid: Grid;
  style: GridStyle;
  paperSize: PaperSize;
  unit: LengthUnit;
  name: string;
}): Promise<void> {
  const orientation: PageOrientation = grid.widthPx > grid.heightPx ? "landscape" : "portrait";
  const paper = getPaperDimensions(paperSize, orientation);
  const pdf = await newPdf(orientation, paper.widthMm, paper.heightMm);
  const gutter = style.labels ? GUTTER_MM : 0;
  const boxWidth = paper.widthMm - 2 * PHOTO_MARGIN_MM - gutter;
  const boxHeight = paper.heightMm - 2 * PHOTO_MARGIN_MM - gutter - FOOTER_MM;
  const scale = Math.min(boxWidth / grid.widthPx, boxHeight / grid.heightPx);
  const width = grid.widthPx * scale;
  const height = grid.heightPx * scale;
  const x0 = PHOTO_MARGIN_MM + gutter + (boxWidth - width) / 2;
  const y0 = PHOTO_MARGIN_MM + gutter + (boxHeight - height) / 2;

  pdf.addImage(photo, "JPEG", x0, y0, width, height, undefined, "FAST");

  const { xs, ys } = cellEdges(grid, scale, scale);
  const [r, g, b] = LINE_RGB[style.color];
  pdf.setDrawColor(r, g, b);
  pdf.setLineWidth(LINE_MM[style.weight]);
  for (const x of xs) pdf.line(x0 + x, y0, x0 + x, y0 + height);
  for (const y of ys) pdf.line(x0, y0 + y, x0 + width, y0 + y);
  if (style.diagonals) {
    pdf.setLineWidth(LINE_MM[style.weight] * 0.6);
    for (let row = 0; row < ys.length - 1; row++) {
      if (!rowTakesDiagonals(grid, (ys[row + 1] - ys[row]) / scale)) continue;
      for (let column = 0; column < xs.length - 1; column++) {
        pdf.line(x0 + xs[column], y0 + ys[row], x0 + xs[column + 1], y0 + ys[row + 1]);
        pdf.line(x0 + xs[column + 1], y0 + ys[row], x0 + xs[column], y0 + ys[row + 1]);
      }
    }
  }

  const cellMm = grid.cellWidthPx * scale;
  if (style.labels) {
    const fontPt = clamp(cellMm * 0.9, 6, 10);
    pdf.setFontSize(fontPt);
    pdf.setTextColor(...LABEL_RGB);
    for (let column = 0; column < xs.length - 1; column++) {
      pdf.text(columnLabel(column), x0 + (xs[column] + xs[column + 1]) / 2, y0 - 2, { align: "center" });
    }
    const capHeightMm = (fontPt / PT_PER_MM) * 0.7;
    for (let row = 0; row < ys.length - 1; row++) {
      pdf.text(rowLabel(row), x0 - 2, y0 + (ys[row] + ys[row + 1]) / 2 + capHeightMm / 2, { align: "right" });
    }
  }

  pdf.setFontSize(7.5);
  pdf.setTextColor(...LABEL_RGB);
  pdf.text(
    `${grid.columns} × ${grid.rows} squares · each square is ${formatLength(cellMm, unit)} on this page when printed at 100% · tilestencil.com/drawing-grid-maker`,
    paper.widthMm / 2,
    paper.heightMm - PHOTO_MARGIN_MM + 3,
    { align: "center" },
  );
  pdf.save(`${fileStem(name)}-grid-${grid.columns}x${grid.rows}.pdf`);
}

/** Pages for an empty grid of this size: whichever orientation needs fewer sheets. */
export function blankGridPlan(widthMm: number, heightMm: number, paperSize: PaperSize): TilePlan {
  const plan = (orientation: PageOrientation) =>
    calculateTilePlan({
      targetWidthMm: widthMm,
      targetHeightMm: heightMm,
      paperSize,
      orientation,
      marginMm: BLANK_GRID_MARGIN_MM,
      overlapMm: BLANK_GRID_OVERLAP_MM,
    });
  const portrait = plan("portrait");
  const landscape = plan("landscape");
  return landscape.tiles.length < portrait.tiles.length ? landscape : portrait;
}

/**
 * The empty grid at the size of the drawing, split across pages: every square named in its corner
 * (B3 here is B3 on the photo), registration marks and page labels to tape it together.
 */
export async function exportBlankGridPdf({
  grid,
  cellWidthMm,
  cellHeightMm,
  style,
  paperSize,
  name,
  onProgress,
}: {
  grid: Grid;
  cellWidthMm: number;
  cellHeightMm: number;
  style: GridStyle;
  paperSize: PaperSize;
  name: string;
  onProgress?: (done: number, total: number) => void;
}): Promise<number> {
  const sx = cellWidthMm / grid.cellWidthPx;
  const sy = cellHeightMm / grid.cellHeightPx;
  const { xs, ys } = cellEdges(grid, sx, sy);
  const widthMm = xs[xs.length - 1];
  const heightMm = ys[ys.length - 1];
  const plan = blankGridPlan(widthMm, heightMm, paperSize);
  const pdf = await newPdf(plan.orientation, plan.paper.widthMm, plan.paper.heightMm);
  const lineRgb = style.color === "white" ? PAPER_LINE_RGB : LINE_RGB[style.color];
  const fontPt = clamp(Math.min(cellWidthMm, cellHeightMm) * 0.45, 6, 16);
  const fontMm = fontPt / PT_PER_MM;
  const eps = 1e-6;

  for (const tile of plan.tiles) {
    if (tile.index > 0) pdf.addPage([plan.paper.widthMm, plan.paper.heightMm], plan.orientation);
    drawSheetGuidance(pdf, tile, plan);
    const left = tile.xMm;
    const top = tile.yMm;
    const right = tile.xMm + tile.widthMm;
    const bottom = tile.yMm + tile.heightMm;
    const toPageX = (x: number) => tile.pageXmm + (x - left);
    const toPageY = (y: number) => tile.pageYmm + (y - top);

    pdf.setDrawColor(...lineRgb);
    pdf.setLineWidth(LINE_MM[style.weight]);
    for (const x of xs) {
      if (x >= left - eps && x <= right + eps) pdf.line(toPageX(x), toPageY(top), toPageX(x), toPageY(bottom));
    }
    for (const y of ys) {
      if (y >= top - eps && y <= bottom + eps) pdf.line(toPageX(left), toPageY(y), toPageX(right), toPageY(y));
    }
    if (style.diagonals) {
      pdf.setLineWidth(LINE_MM[style.weight] * 0.6);
      for (let row = 0; row < ys.length - 1; row++) {
        if (ys[row + 1] < top || ys[row] > bottom || !rowTakesDiagonals(grid, (ys[row + 1] - ys[row]) / sy)) continue;
        for (let column = 0; column < xs.length - 1; column++) {
          if (xs[column + 1] < left || xs[column] > right) continue;
          for (const [ax, ay, bx, by] of [
            [xs[column], ys[row], xs[column + 1], ys[row + 1]],
            [xs[column + 1], ys[row], xs[column], ys[row + 1]],
          ]) {
            const part = clipSegment(ax, ay, bx, by, left, top, right, bottom);
            if (part) pdf.line(toPageX(part[0]), toPageY(part[1]), toPageX(part[2]), toPageY(part[3]));
          }
        }
      }
    }

    if (style.labels) {
      pdf.setFontSize(fontPt);
      pdf.setTextColor(...LABEL_RGB);
      for (let row = 0; row < ys.length - 1; row++) {
        for (let column = 0; column < xs.length - 1; column++) {
          const x = xs[column] + 1.5;
          const y = ys[row] + fontMm + 1;
          const label = cellName(row, column);
          const labelWidth = pdf.getTextWidth(label);
          if (x >= left && x + labelWidth <= right && y - fontMm >= top && y <= bottom) {
            // A paper-white patch keeps the name readable where a diagonal runs through the corner.
            pdf.setFillColor(255, 255, 255);
            pdf.rect(toPageX(x) - 0.6, toPageY(y) - fontMm * 0.82, labelWidth + 1.2, fontMm * 0.98, "F");
            pdf.text(label, toPageX(x), toPageY(y));
          }
        }
      }
    }
    drawRegistrationMarks(pdf, tile, plan);
    onProgress?.(tile.index + 1, plan.tiles.length);
  }

  pdf.save(`${fileStem(name)}-empty-grid-${grid.columns}x${grid.rows}-${plan.paper.label.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  return plan.tiles.length;
}
