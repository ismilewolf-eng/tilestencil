/**
 * PDFs for the Christmas stocking pattern: the sewing pattern at actual size split across sheets,
 * and a one-page outline for colouring or paper crafts. Everything is drawn as vectors; each sheet
 * draws the whole pattern clipped to its own area, so labels that cross a sheet edge line up again
 * when the sheets are taped together.
 */
import { getPaperDimensions, type PaperSize, type TilePlan } from "@/lib/geometry";
import { drawRegistrationMarks, type JsPdfInstance } from "@/lib/pdf-export";
import { bounds, patternPlan, stockingOutline, stockingPattern, sizeById, usedTiles, type Point, type StockingSize } from "@/lib/stocking";

/** jsPDF calls used here beyond the shared tiled-export type (all present in jsPDF 4). */
type PatternPdf = JsPdfInstance & {
  setFont: (family: string, style?: string) => void;
  setFillColor: (red: number, green: number, blue: number) => void;
  setLineDashPattern: (dashArray: number[], dashPhase: number) => void;
  lines: (lines: number[][], x: number, y: number, scale?: [number, number], style?: string | null, closed?: boolean) => void;
  rect: (x: number, y: number, width: number, height: number, style?: string | null) => void;
  saveGraphicsState: () => void;
  restoreGraphicsState: () => void;
  clip: () => void;
  discardPath: () => void;
};

const INK: [number, number, number] = [34, 32, 27];
const MUTED: [number, number, number] = [70, 65, 58];
const SEW_DASH = [2.2, 1.4];
const FOLD_DASH = [0.6, 1.2];
const PT_PER_MM = 72 / 25.4;

async function newPdf(orientation: "portrait" | "landscape", widthMm: number, heightMm: number): Promise<PatternPdf> {
  const { jsPDF } = await import("jspdf");
  return new jsPDF({ orientation, unit: "mm", format: [widthMm, heightMm], compress: true, putOnlyUsedFonts: true }) as unknown as PatternPdf;
}

/** A closed polygon as one path, so dashes run on around the curves instead of restarting at each point. */
function polygon(pdf: PatternPdf, poly: Point[], map: (p: Point) => Point, style = "S"): void {
  const pts = poly.map(map);
  const deltas = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
  pdf.lines(deltas, pts[0][0], pts[0][1], [1, 1], style, true);
}

function arrowLine(pdf: PatternPdf, [ax, ay]: Point, [bx, by]: Point): void {
  pdf.line(ax, ay, bx, by);
  const head = 3;
  for (const [x, y, dir] of [
    [ax, ay, 1],
    [bx, by, -1],
  ] as const) {
    pdf.line(x, y, x - head * 0.6, y + dir * head);
    pdf.line(x, y, x + head * 0.6, y + dir * head);
  }
}

/**
 * Print note and sheet number. Empty sheets of the grid are skipped, so sheets are numbered in
 * print order and each one names the printed sheets it joins.
 */
function sheetNote(pdf: PatternPdf, tile: TilePlan["tiles"][number], plan: TilePlan, numbers: Map<number, number>, sizeLabel: string): void {
  const sheet = numbers.get(tile.index) ?? 0;
  const neighbours: string[] = [];
  const left = tile.column > 0 ? numbers.get(tile.index - 1) : undefined;
  const above = tile.row > 0 ? numbers.get(tile.index - plan.columns) : undefined;
  if (left) neighbours.push(`right of sheet ${left}`);
  if (above) neighbours.push(`below sheet ${above}`);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MUTED);
  pdf.setFontSize(6.6);
  pdf.text("Print at 100% / Actual Size — do not fit to page", plan.paper.widthMm / 2, 3.8, { align: "center" });
  pdf.setFontSize(6.2);
  pdf.text(
    `Christmas stocking ${sizeLabel} · Sheet ${sheet} of ${numbers.size}${neighbours.length ? ` · goes ${neighbours.join(", ")}` : ""} · ${plan.overlapMm.toFixed(0)} mm overlap`,
    plan.paper.widthMm / 2,
    plan.paper.heightMm - Math.max(2.8, plan.marginMm / 2),
    { align: "center" },
  );
}

export const stockingFileName = (size: StockingSize, paperSize: PaperSize, kind: "pattern" | "outline") =>
  kind === "pattern" ? `christmas-stocking-pattern-${size}-${paperSize}.pdf` : `christmas-stocking-outline-${paperSize}.pdf`;

/** The sewing pattern at actual size, tiled. Returns the number of sheets. */
export async function exportStockingPatternPdf({
  size: sizeId,
  paperSize,
}: {
  size: StockingSize;
  paperSize: PaperSize;
}): Promise<number> {
  const pattern = stockingPattern(sizeId);
  const plan = patternPlan(pattern, paperSize);
  const pdf = await newPdf(plan.orientation, plan.paper.widthMm, plan.paper.heightMm);
  const { size } = pattern;
  const tiles = usedTiles(pattern, plan);
  const numbers = new Map(tiles.map((tile, i) => [tile.index, i + 1]));

  for (const tile of tiles) {
    if (numbers.get(tile.index) !== 1) pdf.addPage([plan.paper.widthMm, plan.paper.heightMm], plan.orientation);
    sheetNote(pdf, tile, plan, numbers, `${size.label} (${size.heightIn} in)`);
    const map = ([x, y]: Point): Point => [tile.pageXmm + (x - tile.xMm), tile.pageYmm + (y - tile.yMm)];

    pdf.saveGraphicsState();
    pdf.rect(tile.pageXmm, tile.pageYmm, tile.widthMm, tile.heightMm, null);
    pdf.clip();
    pdf.discardPath();

    pdf.setDrawColor(...INK);
    for (const piece of pattern.pieces) {
      pdf.setLineDashPattern([], 0);
      pdf.setLineWidth(0.5);
      polygon(pdf, piece.cut, map);
      pdf.setLineDashPattern(SEW_DASH, 0);
      pdf.setLineWidth(0.3);
      polygon(pdf, piece.sew, map);
      if (piece.fold) {
        pdf.setLineDashPattern(FOLD_DASH, 0);
        pdf.setLineWidth(0.35);
        const [a, b] = piece.fold.map(map);
        pdf.line(a[0], a[1], b[0], b[1]);
      }
      pdf.setLineDashPattern([], 0);

      const [lx, ly] = map(piece.labelAt);
      const titlePt = piece.id === "stocking" ? 11 : 9;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(titlePt);
      pdf.setTextColor(...INK);
      pdf.text(piece.title, lx, ly);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...MUTED);
      const step = (8 / PT_PER_MM) * 1.45;
      piece.lines.forEach((line, i) => pdf.text(line, lx, ly + titlePt / PT_PER_MM + 1.5 + i * step));
    }

    // Grainline: lay this arrow along the fabric's straight grain.
    pdf.setDrawColor(...MUTED);
    pdf.setLineWidth(0.35);
    const [g1, g2] = pattern.grain.map(map);
    arrowLine(pdf, g1, g2);
    pdf.setFontSize(7);
    pdf.text("GRAINLINE", g1[0] + 2, (g1[1] + g2[1]) / 2);

    // Check marks: measure these after printing before cutting fabric.
    const [tx, ty] = map(pattern.testAt);
    pdf.setDrawColor(...INK);
    pdf.setLineWidth(0.3);
    pdf.rect(tx, ty, 25.4, 25.4, "S");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...INK);
    pdf.text("1 in", tx + 12.7, ty + 14, { align: "center" });
    const barY = ty + 25.4 + 8;
    pdf.line(tx, barY, tx + 50, barY);
    for (let cm = 0; cm <= 5; cm++) pdf.line(tx + cm * 10, barY - (cm % 5 === 0 ? 2.5 : 1.5), tx + cm * 10, barY);
    pdf.text("5 cm", tx + 25, barY + 4, { align: "center" });
    pdf.setTextColor(...MUTED);
    pdf.setFontSize(7);
    pdf.text("Check these before cutting fabric", tx, barY + 9);
    pdf.text("tilestencil.com/christmas-stocking-pattern", tx, barY + 13);

    pdf.restoreGraphicsState();
    drawRegistrationMarks(pdf, tile, plan);
  }

  pdf.save(stockingFileName(sizeId, paperSize, "pattern"));
  return tiles.length;
}

/** The stocking with its cuff band, one page, as large as fits: for colouring and paper crafts. */
export async function exportStockingOutlinePdf({ paperSize }: { paperSize: PaperSize }): Promise<void> {
  const paper = getPaperDimensions(paperSize, "portrait");
  const pdf = await newPdf("portrait", paper.widthMm, paper.heightMm);
  const size = sizeById("medium");
  const outline = stockingOutline(size.heightMm);
  const box = bounds(outline);
  const margin = 18;
  const footer = 12;
  const scale = Math.min((paper.widthMm - 2 * margin) / (box.maxX - box.minX), (paper.heightMm - 2 * margin - footer) / (box.maxY - box.minY));
  const x0 = (paper.widthMm - (box.maxX - box.minX) * scale) / 2;
  const y0 = margin;
  const map = ([x, y]: Point): Point => [x0 + x * scale, y0 + y * scale];

  pdf.setDrawColor(...INK);
  pdf.setLineWidth(1.1);
  polygon(pdf, outline, map);
  // Cuff band across the top, a little wider than the leg like a real folded cuff.
  const legWidth = size.heightMm * 0.4;
  const over = legWidth * 0.04;
  const cuff = size.cuffDepthMm;
  // Filled white so the leg's side lines don't show through the band.
  pdf.setFillColor(255, 255, 255);
  polygon(pdf, [[-over, 0], [legWidth + over, 0], [legWidth + over, cuff], [-over, cuff]], map, "FD");

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...MUTED);
  pdf.text("Christmas stocking outline · free from tilestencil.com/christmas-stocking-pattern", paper.widthMm / 2, paper.heightMm - margin + 6, { align: "center" });
  pdf.save(stockingFileName("medium", paperSize, "outline"));
}
