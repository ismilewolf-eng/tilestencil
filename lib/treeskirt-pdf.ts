/**
 * PDF for the Christmas tree skirt pattern: the template at actual size, tiled across home-printer
 * sheets. Each sheet draws the whole template clipped to its own area, so lines that cross a sheet
 * edge line up again when the sheets are taped together.
 */
import type { PaperSize, TilePlan } from "@/lib/geometry";
import { drawRegistrationMarks, type JsPdfInstance } from "@/lib/pdf-export";
import { skirtPlan, skirtTemplate, usedTiles, type Point, type SkirtSpec, type Unit } from "@/lib/treeskirt";

type SkirtPdf = JsPdfInstance & {
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

function polygon(pdf: SkirtPdf, poly: Point[], map: (p: Point) => Point): void {
  const pts = poly.map(map);
  const deltas = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
  pdf.lines(deltas, pts[0][0], pts[0][1], [1, 1], "S", true);
}

function sheetNote(pdf: SkirtPdf, tile: TilePlan["tiles"][number], plan: TilePlan, numbers: Map<number, number>, label: string): void {
  const sheet = numbers.get(tile.index) ?? 0;
  const neighbours: string[] = [];
  const left = tile.column > 0 ? numbers.get(tile.index - 1) : undefined;
  const above = tile.row > 0 ? numbers.get(tile.index - plan.columns) : undefined;
  if (left) neighbours.push(`right of sheet ${left}`);
  if (above) neighbours.push(`below sheet ${above}`);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...MUTED);
  pdf.setFontSize(6.6);
  pdf.text("Print at 100% / Actual Size - do not fit to page", plan.paper.widthMm / 2, 3.8, { align: "center" });
  pdf.setFontSize(6.2);
  pdf.text(
    `${label} · Sheet ${sheet} of ${numbers.size}${neighbours.length ? ` · goes ${neighbours.join(", ")}` : ""} · ${plan.overlapMm.toFixed(0)} mm overlap`,
    plan.paper.widthMm / 2,
    plan.paper.heightMm - Math.max(2.8, plan.marginMm / 2),
    { align: "center" },
  );
}

export const skirtFileName = (spec: SkirtSpec, unit: Unit, paperSize: PaperSize) =>
  `christmas-tree-skirt-pattern-${spec.style === "round" ? "round" : `${spec.panels}-panel`}-${Math.round(spec.diameterMm / (unit === "in" ? 25.4 : 10))}${unit}-${paperSize}.pdf`;

/** Returns the number of sheets. */
export async function exportSkirtPatternPdf({ spec, unit, paperSize }: { spec: SkirtSpec; unit: Unit; paperSize: PaperSize }): Promise<number> {
  const t = skirtTemplate(spec, unit);
  const plan = skirtPlan(t, paperSize);
  const tiles = usedTiles(t, plan);
  const numbers = new Map(tiles.map((tile, i) => [tile.index, i + 1]));
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: plan.orientation, unit: "mm", format: [plan.paper.widthMm, plan.paper.heightMm], compress: true }) as unknown as SkirtPdf;
  const label = `Tree skirt ${spec.style === "round" ? "round" : `${spec.panels} panels`}, ${t.lines[0].split(",")[0]}`;

  for (const tile of tiles) {
    if (numbers.get(tile.index) !== 1) pdf.addPage([plan.paper.widthMm, plan.paper.heightMm], plan.orientation);
    sheetNote(pdf, tile, plan, numbers, label);
    const map = ([x, y]: Point): Point => [tile.pageXmm + (x - tile.xMm), tile.pageYmm + (y - tile.yMm)];

    pdf.saveGraphicsState();
    pdf.rect(tile.pageXmm, tile.pageYmm, tile.widthMm, tile.heightMm, null);
    pdf.clip();
    pdf.discardPath();

    pdf.setDrawColor(...INK);
    pdf.setLineDashPattern([], 0);
    pdf.setLineWidth(0.5);
    polygon(pdf, t.cut, map);
    pdf.setLineWidth(0.3);
    pdf.setLineDashPattern([2.2, 1.4], 0);
    polygon(pdf, t.sew, map);

    // Fold edges: long dash and dot, with the instruction written along the line.
    pdf.setLineDashPattern([5, 1.5, 0.6, 1.5], 0);
    pdf.setLineWidth(0.45);
    for (const [a, b] of t.folds) {
      const [pa, pb] = [map(a), map(b)];
      pdf.line(pa[0], pa[1], pb[0], pb[1]);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(...INK);
      const vertical = Math.abs(pa[0] - pb[0]) < 0.01;
      for (let f = 0.25; f < 1; f += 0.25) {
        const x = pa[0] + (pb[0] - pa[0]) * f;
        const y = pa[1] + (pb[1] - pa[1]) * f;
        if (vertical) (pdf as unknown as { text: (t: string, x: number, y: number, o: object) => void }).text("PLACE ON FOLD", x + 3, y, { angle: -90 });
        else pdf.text("PLACE ON FOLD", x, y + 4.5, { align: "center" });
      }
    }
    pdf.setLineDashPattern([], 0);

    const [lx, ly] = map(t.labelAt);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(...INK);
    pdf.text(t.title, lx, ly, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(...MUTED);
    const step = (8.5 / PT_PER_MM) * 1.5;
    t.lines.forEach((line, i) => pdf.text(line, lx, ly + 12 / PT_PER_MM + 2 + i * step, { align: "center" }));
    pdf.text("Solid: cut · Dashed: sew", lx, ly + 12 / PT_PER_MM + 2 + t.lines.length * step, { align: "center" });

    const [tx, ty] = map(t.checkAt);
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
    pdf.text("Measure before cutting fabric", tx, barY + 8.5);
    pdf.text("tilestencil.com/christmas-tree-skirt-pattern", tx, barY + 12);

    pdf.restoreGraphicsState();
    drawRegistrationMarks(pdf, tile, plan);
  }

  pdf.save(skirtFileName(spec, unit, paperSize));
  return tiles.length;
}
