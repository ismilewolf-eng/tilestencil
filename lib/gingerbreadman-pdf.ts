/**
 * PDF for the gingerbread man template: one grid sheet of copies, or the figure split across sheets.
 * Everything is vector; tiled sheets draw the whole figure clipped to their own area.
 */
import type { PaperSize } from "@/lib/geometry";
import { drawRegistrationMarks, type JsPdfInstance } from "@/lib/pdf-export";
import { BUTTONS, EYES, KEY_MM, MARGIN_MM, OUTLINE, SMILE, manLayout, scaled, type Point } from "@/lib/gingerbreadman";

type ManPdf = JsPdfInstance & {
  setFont: (family: string, style?: string) => void;
  setLineDashPattern: (dashArray: number[], dashPhase: number) => void;
  lines: (lines: number[][], x: number, y: number, scale?: [number, number], style?: string | null, closed?: boolean) => void;
  rect: (x: number, y: number, width: number, height: number, style?: string | null) => void;
  circle: (x: number, y: number, r: number, style?: string | null) => void;
  saveGraphicsState: () => void;
  restoreGraphicsState: () => void;
  clip: () => void;
  discardPath: () => void;
};

const INK: [number, number, number] = [34, 32, 27];
const MUTED: [number, number, number] = [70, 65, 58];

function polyline(pdf: ManPdf, pts: Point[], closed: boolean): void {
  const deltas = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
  pdf.lines(deltas, pts[0][0], pts[0][1], [1, 1], "S", closed);
}

/** The outline, and optionally the face and buttons, for a figure of this height at (dx, dy). */
function drawMan(pdf: ManPdf, h: number, dx: number, dy: number, details: boolean): void {
  pdf.setDrawColor(...INK);
  pdf.setLineDashPattern([], 0);
  pdf.setLineWidth(h > 200 ? 0.7 : 0.45);
  polyline(pdf, scaled(OUTLINE, h, dx, dy), true);
  if (!details) return;
  pdf.setLineWidth(h > 200 ? 0.5 : 0.3);
  const r = 0.018 * h;
  for (const [x, y] of [...EYES, ...BUTTONS].map(([x, y]) => [dx + x * h, dy + y * h])) pdf.circle(x, y, BUTTONS.length && y > dy + 0.4 * h ? r * 1.25 : r, "S");
  const [sx, sy] = [dx + SMILE[0] * h, dy + SMILE[1] * h];
  const smile: Point[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = (Math.PI * (25 + (130 * i) / 16)) / 180;
    smile.push([sx + 0.065 * h * Math.cos(a), sy - 0.005 * h + 0.04 * h * Math.sin(a)]);
  }
  polyline(pdf, smile, false);
}

function check(pdf: ManPdf, x: number, y: number): void {
  pdf.setDrawColor(...INK);
  pdf.setLineWidth(0.3);
  pdf.rect(x, y, 25.4, 25.4, "S");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...INK);
  pdf.text("1 in", x + 12.7, y + 14, { align: "center" });
  pdf.line(x + 32, y + 20, x + 82, y + 20);
  for (let cm = 0; cm <= 5; cm++) pdf.line(x + 32 + cm * 10, y + (cm % 5 === 0 ? 17.5 : 18.5), x + 32 + cm * 10, y + 20);
  pdf.text("5 cm", x + 57, y + 24.5, { align: "center" });
  pdf.setTextColor(...MUTED);
  pdf.setFontSize(6.5);
  pdf.text("Measure before cutting · tilestencil.com/gingerbread-man-template", x + 32, y + 6);
}

export async function exportManPdf({ heightMm, details, paperSize, label }: { heightMm: number; details: boolean; paperSize: PaperSize; label: string }): Promise<number> {
  const layout = manLayout(heightMm, paperSize);
  const { jsPDF } = await import("jspdf");
  const { paper } = layout;
  const pdf = new jsPDF({ orientation: layout.orientation, unit: "mm", format: [paper.widthMm, paper.heightMm], compress: true }) as unknown as ManPdf;
  const note = (text: string) => {
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...MUTED);
    pdf.setFontSize(6.6);
    pdf.text("Print at 100% / Actual Size - do not fit to page", paper.widthMm / 2, 4, { align: "center" });
    pdf.setFontSize(6.2);
    pdf.text(text, paper.widthMm / 2, paper.heightMm - 3, { align: "center" });
  };

  if (layout.kind === "grid") {
    note(`Gingerbread man template, ${label} · ${layout.copies.length} on this sheet`);
    for (const [x, y] of layout.copies) drawMan(pdf, heightMm, x, y, details);
    check(pdf, MARGIN_MM + 4, paper.heightMm - MARGIN_MM - KEY_MM + 6);
    pdf.save(`gingerbread-man-template-${Math.round(heightMm)}mm-${paperSize}.pdf`);
    return 1;
  }

  const plan = layout.plan!;
  const numbers = new Map(layout.tiles.map((t, i) => [t.index, i + 1]));
  layout.tiles.forEach((tile, i) => {
    if (i > 0) pdf.addPage([paper.widthMm, paper.heightMm], layout.orientation);
    const where: string[] = [];
    const left = tile.column > 0 ? numbers.get(tile.index - 1) : undefined;
    const above = tile.row > 0 ? numbers.get(tile.index - plan.columns) : undefined;
    if (left) where.push(`right of sheet ${left}`);
    if (above) where.push(`below sheet ${above}`);
    note(`Gingerbread man template, ${label} · Sheet ${i + 1} of ${layout.tiles.length}${where.length ? ` · goes ${where.join(", ")}` : ""}`);
    pdf.saveGraphicsState();
    pdf.rect(tile.pageXmm, tile.pageYmm, tile.widthMm, tile.heightMm, null);
    pdf.clip();
    pdf.discardPath();
    const dx = tile.pageXmm - tile.xMm;
    const dy = tile.pageYmm - tile.yMm;
    drawMan(pdf, heightMm, dx, dy, details);
    // The check square sits on the body, below the buttons.
    check(pdf, dx + layout.widthMm / 2 - 41, dy + heightMm * 0.7);
    pdf.restoreGraphicsState();
    drawRegistrationMarks(pdf, tile, plan);
  });
  pdf.save(`gingerbread-man-template-${Math.round(heightMm)}mm-${paperSize}.pdf`);
  return layout.tiles.length;
}
