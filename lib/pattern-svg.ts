/**
 * Cut-ready SVGs of the Christmas pattern pages (2026-11-10): the same outlines the PDFs print,
 * as closed paths in millimetres for Cricut, Silhouette and laser cutters. Cut lines are solid
 * black strokes; optional details (door, windows, face, buttons) are a second group in red so
 * cutting software can switch them to "draw", "score" or off.
 */
import { BUTTONS, EYES, OUTLINE, scaled } from "@/lib/gingerbreadman";
import { housePieces, type HouseSize, type Material } from "@/lib/gingerbread";
import { stockingPattern, type StockingSize } from "@/lib/stocking";

type Point = [number, number];

const n = (v: number) => (Math.round(v * 100) / 100).toString();
const path = (poly: Point[], dx = 0, dy = 0) => `M${poly.map(([x, y]) => `${n(x + dx)} ${n(y + dy)}`).join("L")}Z`;

function doc(widthMm: number, heightMm: number, title: string, cut: string[], details: string[] = []): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${n(widthMm)}mm" height="${n(heightMm)}mm" viewBox="0 0 ${n(widthMm)} ${n(heightMm)}">`,
    `<title>${title} (tilestencil.com)</title>`,
    `<g id="cut" fill="none" stroke="#000" stroke-width="0.25">${cut.map((d) => `<path d="${d}"/>`).join("")}</g>`,
    details.length ? `<g id="details" fill="none" stroke="#d00" stroke-width="0.25">${details.join("")}</g>` : "",
    `</svg>`,
    "",
  ]
    .filter((line, i, all) => line !== "" || i === all.length - 1)
    .join("\n");
}

const PAD = 2;

/** Stocking, cuff and loop on their cutting lines (seam allowance included), laid out as in the PDF. */
export function stockingSvg(size: StockingSize): string {
  const pattern = stockingPattern(size);
  const xs = pattern.pieces.flatMap((p) => p.cut.map((q) => q[0]));
  const ys = pattern.pieces.flatMap((p) => p.cut.map((q) => q[1]));
  const dx = PAD - Math.min(...xs);
  const dy = PAD - Math.min(...ys);
  return doc(
    Math.max(...xs) + dx + PAD,
    Math.max(...ys) + dy + PAD,
    `Christmas stocking pattern, ${pattern.size.label}`,
    pattern.pieces.map((p) => path(p.cut, dx, dy)),
  );
}

/** Front/back, side wall and roof side by side; door and windows as details. Cut each piece twice. */
export function houseSvg(size: HouseSize, material: Material, openings: boolean): string {
  const pieces = housePieces(size, material, "in", openings);
  const gap = 6;
  let x = PAD;
  const cut: string[] = [];
  const details: string[] = [];
  for (const piece of pieces) {
    cut.push(path(piece.outline, x, PAD));
    for (const opening of piece.openings) details.push(`<path d="${path(opening, x, PAD)}"/>`);
    x += piece.widthMm + gap;
  }
  return doc(x - gap + PAD, Math.max(...pieces.map((p) => p.heightMm)) + 2 * PAD, "Gingerbread house template", cut, details);
}

/** The gingerbread man outline at this height; eyes and buttons as details. */
export function manSvg(heightMm: number, details: boolean): string {
  const outline = scaled(OUTLINE, heightMm, PAD, PAD);
  const width = Math.max(...outline.map((p) => p[0])) + PAD;
  const r = 0.018 * heightMm;
  const dots = details
    ? [...EYES.map((p) => [p, r] as const), ...BUTTONS.map((p) => [p, r * 1.25] as const)].map(
        ([[x, y], radius]) => `<circle cx="${n(PAD + x * heightMm)}" cy="${n(PAD + y * heightMm)}" r="${n(radius)}"/>`,
      )
    : [];
  return doc(width, heightMm + 2 * PAD, "Gingerbread man template", [path(outline)], dots);
}

const MAT_MM = 11.5 * 25.4;
const LONG_MAT_MM = 23.5 * 25.4;

/** What the largest piece fits on, said plainly so nobody pays for a file their machine cannot cut. */
export function fitNote(pieces: Array<[number, number]>): string {
  const short = Math.max(...pieces.map(([w, h]) => Math.min(w, h)));
  const long = Math.max(...pieces.map(([w, h]) => Math.max(w, h)));
  if (long <= MAT_MM) return "At this size every piece fits a 12 × 12 in cutting mat.";
  if (short <= MAT_MM && long <= LONG_MAT_MM) return "At this size the largest piece needs a 12 × 24 in mat.";
  return "At this size the largest piece is too big for a Cricut or Silhouette mat. The SVG suits a laser or large-format cutter.";
}

const box = (poly: Point[]): [number, number] => {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
};

export const stockingFit = (size: StockingSize) => fitNote(stockingPattern(size).pieces.map((p) => box(p.cut)));
export const houseFit = (size: HouseSize, material: Material) => fitNote(housePieces(size, material, "in", false).map((p) => [p.widthMm, p.heightMm]));
export const manFit = (heightMm: number) => fitNote([[heightMm * 0.8381, heightMm]]);
