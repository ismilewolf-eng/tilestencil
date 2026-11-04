/**
 * PDF for the gingerbread house template: every sheet from houseSheets(), drawn as vectors at actual
 * size. Each piece is clipped to its own area on the sheet, so a piece split across two sheets lines up
 * again when they are taped together.
 */
import type { PaperSize } from "@/lib/geometry";
import { drawRegistrationMarks, type JsPdfInstance } from "@/lib/pdf-export";
import { houseSheets, housePieces, type HouseSize, type Material, type Point, type Sheet, type Unit } from "@/lib/gingerbread";

type HousePdf = JsPdfInstance & {
  setFont: (family: string, style?: string) => void;
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
const PT_PER_MM = 72 / 25.4;

function polygon(pdf: HousePdf, poly: Point[], map: (p: Point) => Point): void {
  const pts = poly.map(map);
  const deltas = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
  pdf.lines(deltas, pts[0][0], pts[0][1], [1, 1], "S", true);
}

const PIECE_NAME = { front: "Front & back", side: "Side wall", roof: "Roof" } as const;

function sheetNote(pdf: HousePdf, sheet: Sheet, n: number, total: number, sizeLabel: string): void {
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MUTED);
  pdf.setFontSize(6.6);
  pdf.text("Print at 100% / Actual Size — do not fit to page", sheet.widthMm / 2, 4.2, { align: "center" });
  let extra = "";
  const item = sheet.items[0];
  if (sheet.tile && item.part) {
    const { region, plan } = sheet.tile;
    const where: string[] = [];
    if (region.column > 0) where.push(`right of part ${item.part.n - 1}`);
    if (region.row > 0) where.push(`below part ${item.part.n - plan.columns}`);
    extra = ` · ${PIECE_NAME[item.piece.id]} part ${item.part.n} of ${item.part.of}${where.length ? `, goes ${where.join(" and ")}` : ""}`;
  }
  pdf.setFontSize(6.2);
  pdf.text(`Gingerbread house template ${sizeLabel} · Sheet ${n} of ${total}${extra}`, sheet.widthMm / 2, sheet.heightMm - 3, { align: "center" });
}

export const houseFileName = (label: string, paperSize: PaperSize, material: Material) =>
  `gingerbread-house-template-${label.toLowerCase()}-${material}-${paperSize}.pdf`;

/** Returns the number of sheets. */
export async function exportHouseTemplatePdf({
  size,
  sizeLabel,
  fileLabel,
  material,
  unit,
  openings,
  paperSize,
}: {
  size: HouseSize;
  sizeLabel: string;
  fileLabel: string;
  material: Material;
  unit: Unit;
  openings: boolean;
  paperSize: PaperSize;
}): Promise<number> {
  const sheets = houseSheets(housePieces(size, material, unit, openings), paperSize);
  const { jsPDF } = await import("jspdf");
  const first = sheets[0];
  const pdf = new jsPDF({ orientation: first.orientation, unit: "mm", format: [first.widthMm, first.heightMm], compress: true }) as unknown as HousePdf;

  sheets.forEach((sheet, i) => {
    if (i > 0) pdf.addPage([sheet.widthMm, sheet.heightMm], sheet.orientation);
    sheetNote(pdf, sheet, i + 1, sheets.length, sizeLabel);

    for (const item of sheet.items) {
      const { piece, src } = item;
      const map = ([x, y]: Point): Point => [item.pageX + (x - src.x), item.pageY + (y - src.y)];
      pdf.saveGraphicsState();
      pdf.rect(item.pageX - 0.6, item.pageY - 0.6, src.w + 1.2, src.h + 1.2, null);
      pdf.clip();
      pdf.discardPath();

      pdf.setDrawColor(...INK);
      pdf.setLineDashPattern([], 0);
      pdf.setLineWidth(0.5);
      polygon(pdf, piece.outline, map);
      pdf.setDrawColor(...MUTED);
      pdf.setLineWidth(0.3);
      pdf.setLineDashPattern([1.8, 1.2], 0);
      for (const opening of piece.openings) polygon(pdf, opening, map);
      pdf.setLineDashPattern([], 0);

      const [lx, ly] = map(piece.labelAt);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(...INK);
      pdf.text(piece.title, lx, ly + 3.5, { align: "center" });
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(...MUTED);
      const step = (7.5 / PT_PER_MM) * 1.4;
      pdf.text(piece.cut, lx, ly + 3.5 + step + 0.8, { align: "center" });
      pdf.text(piece.dims, lx, ly + 3.5 + 2 * step + 0.8, { align: "center" });
      if (piece.openings.length) {
        pdf.setFontSize(6.5);
        pdf.text("Dashed: optional cut-out", lx, ly + 3.5 + 3 * step + 0.8, { align: "center" });
      }

      if (piece.checkAt) {
        const [tx, ty] = map(piece.checkAt);
        pdf.setDrawColor(...INK);
        pdf.setLineWidth(0.3);
        pdf.rect(tx, ty, 25.4, 25.4, "S");
        pdf.setFontSize(7.5);
        pdf.setTextColor(...INK);
        pdf.text("1 in", tx + 12.7, ty + 14, { align: "center" });
        const barY = ty + 25.4 + 7;
        pdf.line(tx, barY, tx + 50, barY);
        for (let cm = 0; cm <= 5; cm++) pdf.line(tx + cm * 10, barY - (cm % 5 === 0 ? 2.5 : 1.5), tx + cm * 10, barY);
        pdf.text("5 cm", tx + 25, barY + 4, { align: "center" });
        pdf.setTextColor(...MUTED);
        pdf.setFontSize(6.5);
        pdf.text("Measure before cutting", tx, barY + 8.5);
      }
      pdf.restoreGraphicsState();
    }
    if (sheet.tile) drawRegistrationMarks(pdf, sheet.tile.region, sheet.tile.plan);
  });

  pdf.setTextColor(...MUTED);
  pdf.save(houseFileName(fileLabel, paperSize, material));
  return sheets.length;
}
