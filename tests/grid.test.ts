import { describe, expect, it } from "vitest";
import {
  cellName,
  fitToSurface,
  formatLength,
  linePositions,
  makeGrid,
  rowLabel,
  rulerSize,
} from "../lib/grid";

describe("drawing grid", () => {
  it("keeps squares square and adds rows until the photo's bottom edge", () => {
    const grid = makeGrid(600, 800, { columns: 6, square: true });
    expect(grid).toMatchObject({ columns: 6, rows: 8, cellWidthPx: 100, cellHeightPx: 100 });
    const tall = makeGrid(600, 850, { columns: 6, square: true });
    expect(tall.rows).toBe(9);
    // The last row is cut short: its bottom line is the photo's edge.
    expect(linePositions(tall).ys).toEqual([0, 100, 200, 300, 400, 500, 600, 700, 800, 850]);
    expect(linePositions(tall).xs).toEqual([0, 100, 200, 300, 400, 500, 600]);
  });

  it("does not add a sliver row when the photo divides evenly", () => {
    expect(linePositions(makeGrid(600, 800, { columns: 6, square: true })).ys).toEqual([0, 100, 200, 300, 400, 500, 600, 700, 800]);
    // Floating point: 1000 / 3 squares still end exactly on the edge.
    const grid = makeGrid(1000, 1000, { columns: 3, square: true });
    expect(grid.rows).toBe(3);
    expect(linePositions(grid).ys).toHaveLength(4);
  });

  it("splits into exact rows and columns when squares need not be square", () => {
    const grid = makeGrid(600, 800, { columns: 4, square: false, rows: 5 });
    expect(grid).toMatchObject({ columns: 4, rows: 5, cellWidthPx: 150, cellHeightPx: 160 });
    expect(linePositions(grid).ys).toEqual([0, 160, 320, 480, 640, 800]);
  });

  it("clamps the number of squares to a usable range", () => {
    expect(makeGrid(600, 800, { columns: 1, square: true }).columns).toBe(2);
    expect(makeGrid(600, 800, { columns: 99, square: true }).columns).toBe(40);
    expect(makeGrid(600, 800, { columns: Number.NaN, square: true }).columns).toBe(2);
  });

  it("names squares like a map: lettered rows, numbered columns", () => {
    expect([0, 1, 25, 26, 27, 51, 52].map(rowLabel)).toEqual(["A", "B", "Z", "AA", "AB", "AZ", "BA"]);
    expect(cellName(1, 2)).toBe("B3");
  });

  it("scales the grid to a drawing surface without distorting the photo", () => {
    const grid = makeGrid(600, 800, { columns: 6, square: true });
    // 30 × 50 cm canvas: the width runs out first, 10 cm of height is left over.
    const fit = fitToSurface(grid, 300, 500);
    expect(fit.limitedBy).toBe("width");
    expect(fit.cellWidthMm).toBeCloseTo(50);
    expect(fit.drawingHeightMm).toBeCloseTo(400);
    expect(fit.spareMm).toBeCloseTo(100);
    // A wide wall: the height runs out first.
    const wall = fitToSurface(grid, 3000, 2000);
    expect(wall.limitedBy).toBe("height");
    expect(wall.cellWidthMm).toBeCloseTo(250);
    expect(wall.spareMm).toBeCloseTo(1500);
    expect(fitToSurface(grid, 300, 400).limitedBy).toBe("both");
  });

  it("rounds squares down to what a ruler can mark, so the grid still fits", () => {
    expect(rulerSize(47.6, "cm")).toBe(47);
    expect(rulerSize(46.5, "in")).toBeCloseTo(46.0375); // 1 13/16 in
    expect(rulerSize(44.9, "in")).toBeCloseTo(44.45); // 1 3/4 in
    expect(rulerSize(0.6, "cm")).toBe(0.6);
  });

  it("writes lengths the way a ruler reads", () => {
    expect(formatLength(47, "cm")).toBe("4.7 cm");
    expect(formatLength(500, "cm")).toBe("50 cm");
    expect(formatLength(44.45, "in")).toBe("1 3/4 in");
    expect(formatLength(25.4 * 2, "in")).toBe("2 in");
    expect(formatLength(25.4 * 0.375, "in")).toBe("3/8 in");
    expect(formatLength(46.0375, "in")).toBe("1 13/16 in");
    expect(formatLength(25.4 / 16, "in")).toBe("1/16 in");
    expect(formatLength(0.5, "in")).toBe("0.02 in");
  });
});

describe("drawing grid PDFs", async () => {
  const { blankGridPlan, clipSegment } = await import("../lib/grid-pdf");

  it("clips a diagonal to the part on one page", () => {
    expect(clipSegment(0, 0, 100, 100, 50, 0, 200, 200)).toEqual([50, 50, 100, 100]);
    expect(clipSegment(0, 0, 10, 10, 20, 20, 30, 30)).toBeNull();
    expect(clipSegment(0, 5, 100, 5, 10, 0, 20, 10)).toEqual([10, 5, 20, 5]);
  });

  it("prints the empty grid in whichever orientation needs fewer pages", () => {
    // A wide 55 × 18 cm drawing: 2 landscape sheets instead of 3 portrait ones.
    const wide = blankGridPlan(550, 180, "a4");
    expect(wide.orientation).toBe("landscape");
    expect(wide.tiles.length).toBe(2);
    expect(blankGridPlanPortraitCount(550, 180)).toBe(3);
    // 60 × 20 cm: portrait wins (4 sheets in a row against 3 × 2 landscape).
    expect(blankGridPlan(600, 200, "a4").orientation).toBe("portrait");
    // An 11 × 14 in canvas on Letter.
    expect(blankGridPlan(279.4, 355.6, "letter").tiles.length).toBe(4);
  });
});

function blankGridPlanPortraitCount(widthMm: number, heightMm: number): number {
  // Portrait sheets: 210 − 16 = 194 mm wide, 297 − 16 = 281 mm tall, 5 mm overlap.
  const columns = Math.ceil((widthMm - 5) / (194 - 5));
  const rows = Math.ceil((heightMm - 5) / (281 - 5));
  return columns * rows;
}
