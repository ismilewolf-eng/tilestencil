import { describe, expect, it } from "vitest";
import { HOUSE_PRESETS, PAGE_MARGIN_MM, OVERHANG_MM, THICKNESS_MM, doughAreaSqIn, formatLength, houseSheets, housePieces, roofPanelMm, sideWallLengthMm, sizeProblem } from "../lib/gingerbread";

const classic = HOUSE_PRESETS.find((p) => p.id === "classic")!.size;

describe("gingerbread house template", () => {
  it("cuts the side walls short by two thicknesses so they sit between the front and back", () => {
    expect(sideWallLengthMm(classic, "gingerbread")).toBeCloseTo(classic.depthMm - 2 * THICKNESS_MM.gingerbread, 6);
    const [front, side] = housePieces(classic, "cardboard", "in");
    expect(side.widthMm).toBeCloseTo(classic.depthMm - 6, 6);
    expect(side.heightMm).toBeCloseTo(classic.wallMm, 6);
    expect(front.widthMm).toBeCloseTo(classic.widthMm, 6);
    expect(front.heightMm).toBeCloseTo(classic.wallMm + classic.riseMm, 6);
  });

  it("makes each roof panel reach from the peak past the eave, and overhang front and back", () => {
    const { slopeMm, lengthMm } = roofPanelMm(classic);
    expect(slopeMm).toBeCloseTo(Math.hypot(classic.widthMm / 2, classic.riseMm) + OVERHANG_MM, 6);
    expect(lengthMm).toBeCloseTo(classic.depthMm + 2 * OVERHANG_MM, 6);
  });

  it("prints the small house on one sheet and the classic and large one piece per sheet, untaped", () => {
    for (const paper of ["letter", "a4"] as const) {
      const small = houseSheets(housePieces(HOUSE_PRESETS[0].size, "gingerbread", "in"), paper);
      expect(small).toHaveLength(1);
      const sheets = houseSheets(housePieces(classic, "gingerbread", "in"), paper);
      expect(sheets).toHaveLength(3);
      expect(sheets.every((s) => !s.tile)).toBe(true);
      const large = houseSheets(housePieces(HOUSE_PRESETS[2].size, "gingerbread", "in"), paper);
      expect(large.every((s) => !s.tile)).toBe(true);
    }
  });

  it("keeps every packed piece inside the printable area and apart from the others", () => {
    for (const preset of HOUSE_PRESETS) {
      for (const paper of ["letter", "a4"] as const) {
        for (const sheet of houseSheets(housePieces(preset.size, "gingerbread", "cm"), paper)) {
          const boxes = sheet.items.map((i) => ({ x: i.pageX, y: i.pageY, r: i.pageX + i.src.w, b: i.pageY + i.src.h }));
          for (const box of boxes) {
            expect(box.x).toBeGreaterThanOrEqual(PAGE_MARGIN_MM - 0.01);
            expect(box.y).toBeGreaterThanOrEqual(PAGE_MARGIN_MM - 0.01);
            expect(box.r).toBeLessThanOrEqual(sheet.widthMm - PAGE_MARGIN_MM + 0.01);
            expect(box.b).toBeLessThanOrEqual(sheet.heightMm - PAGE_MARGIN_MM + 0.01);
          }
          for (let i = 0; i < boxes.length; i++)
            for (let j = i + 1; j < boxes.length; j++) {
              const a = boxes[i];
              const c = boxes[j];
              expect(a.r <= c.x || c.r <= a.x || a.b <= c.y || c.b <= a.y).toBe(true);
            }
        }
      }
    }
  });

  it("splits a piece too big for one sheet into parts that cover it", () => {
    const big = { widthMm: 10 * 25.4, depthMm: 12 * 25.4, wallMm: 7 * 25.4, riseMm: 5 * 25.4 };
    const sheets = houseSheets(housePieces(big, "gingerbread", "in"), "letter");
    const frontParts = sheets.filter((s) => s.items[0].piece.id === "front" && s.items[0].part);
    expect(frontParts.length).toBeGreaterThan(1);
    expect(frontParts.every((s) => s.items[0].part!.of === frontParts.length)).toBe(true);
  });

  it("quotes sizes the way bakers measure", () => {
    expect(formatLength(6 * 25.4, "in")).toBe("6 in");
    expect(formatLength(4.5 * 25.4, "in")).toBe("4 1/2 in");
    expect(formatLength(6.35, "in")).toBe("1/4 in");
    expect(formatLength(152.4, "cm")).toBe("15 cm");
    expect(Math.round(doughAreaSqIn(housePieces(classic, "gingerbread", "in")))).toBeGreaterThan(200);
  });

  it("rejects custom sizes outside the limits with a readable message", () => {
    expect(sizeProblem(classic, "in")).toBeNull();
    expect(sizeProblem({ ...classic, widthMm: 10 }, "in")).toMatch(/^Width must be between 2 in and 24 in/);
    expect(sizeProblem({ ...classic, riseMm: Number.NaN }, "cm")).toMatch(/^Roof height/);
  });
});
