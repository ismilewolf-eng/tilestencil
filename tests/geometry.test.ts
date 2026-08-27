import { describe, expect, it } from "vitest";
import { jsPDF } from "jspdf";
import {
  calculateTilePlan,
  getPaperDimensions,
  getPixelCrop,
  indexToLetters,
  toMillimeters,
} from "../lib/geometry";

describe("physical unit conversion", () => {
  it("converts centimetres and inches to millimetres exactly", () => {
    expect(toMillimeters(2.54, "cm")).toBe(25.4);
    expect(toMillimeters(1, "in")).toBe(25.4);
  });
});

describe("paper orientation", () => {
  it("swaps A4 dimensions for landscape output", () => {
    expect(getPaperDimensions("a4", "portrait")).toMatchObject({ widthMm: 210, heightMm: 297 });
    expect(getPaperDimensions("a4", "landscape")).toMatchObject({ widthMm: 297, heightMm: 210 });
  });
});

describe("tile pagination", () => {
  it("uses physical overlap as the stride between adjacent tiles", () => {
    const plan = calculateTilePlan({
      targetWidthMm: 390,
      targetHeightMm: 300,
      paperSize: "a4",
      orientation: "portrait",
      marginMm: 5,
      overlapMm: 10,
    });

    expect(plan.printableWidthMm).toBe(200);
    expect(plan.strideXmm).toBe(190);
    expect(plan.columns).toBe(2);
    expect(plan.rows).toBe(2);
    expect(plan.tiles[0]).toMatchObject({ label: "A1", xMm: 0, widthMm: 200 });
    expect(plan.tiles[1]).toMatchObject({ label: "A2", xMm: 190, widthMm: 200 });
    expect(plan.tiles[0].xMm + plan.tiles[0].widthMm - plan.tiles[1].xMm).toBe(10);
  });

  it("keeps the final row and column at their true remaining dimensions", () => {
    const plan = calculateTilePlan({
      targetWidthMm: 401,
      targetHeightMm: 300,
      paperSize: "a4",
      orientation: "portrait",
      marginMm: 5,
      overlapMm: 10,
    });
    const finalTile = plan.tiles.at(-1);

    expect(plan.columns).toBe(3);
    expect(plan.rows).toBe(2);
    expect(finalTile).toMatchObject({
      label: "B3",
      xMm: 380,
      yMm: 277,
      widthMm: 21,
      heightMm: 23,
    });
    expect(finalTile!.xMm + finalTile!.widthMm).toBe(401);
    expect(finalTile!.yMm + finalTile!.heightMm).toBe(300);
  });

  it("maps edge tiles to the exact remaining source pixels", () => {
    const plan = calculateTilePlan({
      targetWidthMm: 401,
      targetHeightMm: 300,
      paperSize: "a4",
      orientation: "portrait",
      marginMm: 5,
      overlapMm: 10,
    });
    const crop = getPixelCrop(plan.tiles.at(-1)!, 4010, 3000, 401, 300);

    expect(crop).toEqual({ x: 3800, y: 2770, width: 210, height: 230 });
    expect(crop.x + crop.width).toBe(4010);
    expect(crop.y + crop.height).toBe(3000);
  });

  it("rejects an overlap that would make the printable stride zero or negative", () => {
    expect(() =>
      calculateTilePlan({
        targetWidthMm: 300,
        targetHeightMm: 300,
        paperSize: "a4",
        orientation: "portrait",
        marginMm: 5,
        overlapMm: 200,
      }),
    ).toThrow("Overlap must be smaller");
  });
});

describe("tile labels", () => {
  it("continues row labels after Z", () => {
    expect(indexToLetters(0)).toBe("A");
    expect(indexToLetters(25)).toBe("Z");
    expect(indexToLetters(26)).toBe("AA");
  });
});

describe("PDF paper units", () => {
  it("keeps a landscape A4 page at its millimetre dimensions in jsPDF", () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210],
    });

    expect(pdf.internal.pageSize.getWidth()).toBeCloseTo(297, 6);
    expect(pdf.internal.pageSize.getHeight()).toBeCloseTo(210, 6);
  });
});
