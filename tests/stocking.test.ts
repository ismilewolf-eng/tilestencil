import { describe, expect, it } from "vitest";
import {
  bounds,
  offsetPolygon,
  patternPlan,
  usedTiles,
  SEAM_ALLOWANCE_MM,
  STOCKING_SIZES,
  stockingOutline,
  stockingPattern,
  type Point,
} from "../lib/stocking";

const distanceToSegment = ([px, py]: Point, [ax, ay]: Point, [bx, by]: Point) => {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};
const distanceToPolygon = (p: Point, poly: Point[]) =>
  Math.min(...poly.map((a, i) => distanceToSegment(p, a, poly[(i + 1) % poly.length])));

describe("christmas stocking pattern", () => {
  it("draws each size at its stated height, 0.7 of it heel to toe", () => {
    for (const size of STOCKING_SIZES) {
      const box = bounds(stockingOutline(size.heightMm));
      expect(box.minX).toBeCloseTo(0, 6);
      expect(box.minY).toBeCloseTo(0, 6);
      expect(box.maxY).toBeCloseTo(size.heightMm, 1);
      expect(box.maxX).toBeCloseTo(size.heightMm * 0.7, 1);
      // Inches and centimetres quoted to readers match the drawing.
      expect(Math.abs(size.heightIn * 25.4 - size.heightMm)).toBeLessThan(1);
      expect(Math.abs(size.heightCm * 10 - size.heightMm)).toBeLessThanOrEqual(5);
    }
  });

  it("keeps the cutting line one seam allowance outside the sewing line", () => {
    const sew = stockingOutline(406);
    const cut = offsetPolygon(sew, SEAM_ALLOWANCE_MM);
    const gaps = cut.map((p) => distanceToPolygon(p, sew));
    expect(Math.min(...gaps)).toBeGreaterThan(SEAM_ALLOWANCE_MM - 0.5);
    // Corners may stick out a little (mitred), never more than about twice the allowance.
    expect(Math.max(...gaps)).toBeLessThan(SEAM_ALLOWANCE_MM * 2);
    const box = bounds(cut);
    expect(box.minX).toBeCloseTo(-SEAM_ALLOWANCE_MM, 0);
    expect(box.minY).toBeCloseTo(-SEAM_ALLOWANCE_MM, 0);
  });

  it("pushes a rectangle out evenly on every side, whichever way it runs", () => {
    const square: Point[] = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
    ];
    expect(offsetPolygon(square, 2)).toEqual([
      [-2, -2],
      [12, -2],
      [12, 12],
      [-2, 12],
    ]);
    const reversed = [...square].reverse();
    expect(bounds(offsetPolygon(reversed, 2))).toEqual({ minX: -2, minY: -2, maxX: 12, maxY: 12 });
  });

  it("lays out the pieces without overlap and inside the canvas", () => {
    for (const size of STOCKING_SIZES) {
      const pattern = stockingPattern(size.id);
      const [stocking, cuff, loop] = pattern.pieces.map((piece) => bounds(piece.cut));
      expect(cuff.minX).toBeGreaterThan(stocking.maxX);
      // The loop sits beside the leg, clear of the stocking's cutting line and left of the cuff.
      const stockingCut = pattern.pieces[0].cut;
      const legRight = Math.max(...stockingCut.filter(([, y]) => y < loop.maxY + 1).map(([x]) => x));
      expect(loop.minX).toBeGreaterThan(legRight);
      expect(loop.maxX).toBeLessThan(cuff.minX);
      for (const box of [stocking, cuff, loop]) {
        expect(box.minX).toBeGreaterThan(-1e-6);
        expect(box.minY).toBeGreaterThan(-1e-6);
        expect(box.maxX).toBeLessThanOrEqual(pattern.widthMm);
        expect(box.maxY).toBeLessThanOrEqual(pattern.heightMm);
      }
      // The cuff is as wide as the leg and twice its finished depth (it folds in half).
      const cuffSew = bounds(pattern.pieces[1].sew);
      expect(cuffSew.maxX - cuffSew.minX).toBeCloseTo(size.heightMm * 0.4, 6);
      expect(cuffSew.maxY - cuffSew.minY).toBeCloseTo(size.cuffDepthMm * 2, 6);
    }
  });

  it("needs a handful of home-printer sheets, fewer for smaller stockings", () => {
    const sheets = (id: "small" | "medium" | "large", paper: "a4" | "letter") => {
      const pattern = stockingPattern(id);
      return usedTiles(pattern, patternPlan(pattern, paper)).length;
    };
    expect(sheets("small", "letter")).toBeLessThanOrEqual(4);
    expect(sheets("medium", "letter")).toBeLessThanOrEqual(5);
    expect(sheets("large", "a4")).toBeLessThanOrEqual(9);
    expect(sheets("small", "a4")).toBeLessThan(sheets("large", "a4"));
  });
});
