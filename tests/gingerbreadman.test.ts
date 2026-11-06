import { describe, expect, it } from "vitest";
import { ASPECT, MAN_PRESETS, OUTLINE, formatLength, manLayout, sizeProblem } from "../lib/gingerbreadman";

describe("gingerbread man template", () => {
  it("stores the outline scaled to a height of 1", () => {
    const ys = OUTLINE.map((p) => p[1]);
    const xs = OUTLINE.map((p) => p[0]);
    expect(Math.min(...ys)).toBeCloseTo(0, 2);
    expect(Math.max(...ys)).toBeCloseTo(1, 2);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(ASPECT, 2);
  });

  it("fits four cookie-size figures on one sheet and splits the door size across sheets", () => {
    const cookie = manLayout(MAN_PRESETS[0].heightMm, "letter");
    expect(cookie.kind).toBe("grid");
    expect(cookie.copies).toHaveLength(4);
    const door = manLayout(MAN_PRESETS[3].heightMm, "letter");
    expect(door.kind).toBe("tiles");
    expect(door.tiles.length).toBe(14);
    expect(door.tiles.length).toBeLessThan(door.plan!.tiles.length);
  });

  it("keeps grid copies inside the sheet and apart", () => {
    for (const paper of ["letter", "a4"] as const) {
      const l = manLayout(MAN_PRESETS[0].heightMm, paper);
      for (const [x, y] of l.copies) {
        expect(x).toBeGreaterThanOrEqual(8 - 0.01);
        expect(x + l.widthMm).toBeLessThanOrEqual(l.paper.widthMm - 8 + 0.01);
        expect(y + l.heightMm).toBeLessThanOrEqual(l.paper.heightMm - 8 + 0.01);
      }
    }
  });

  it("names sizes the way people measure them", () => {
    expect(formatLength(36 * 25.4, "in")).toBe("3 ft");
    expect(formatLength(4 * 25.4, "in")).toBe("4 in");
    expect(formatLength(3.5 * 25.4, "in")).toBe("3 1/2 in");
    expect(sizeProblem(10, "in")).toMatch(/between 2 in and 6 ft/);
  });
});
