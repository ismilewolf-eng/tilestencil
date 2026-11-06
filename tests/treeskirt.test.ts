import { describe, expect, it } from "vitest";
import { DEFAULT_HOLE_MM, SEAM_MM, SKIRT_PRESETS, fabricNeed, formatLength, sizeProblem, skirtPlan, skirtTemplate, usedTiles } from "../lib/treeskirt";

const medium = SKIRT_PRESETS[1].diameterMm;

describe("christmas tree skirt pattern", () => {
  it("draws a round quarter one seam allowance outside the finished edge, with both straight edges on folds", () => {
    const t = skirtTemplate({ style: "round", diameterMm: medium, holeMm: DEFAULT_HOLE_MM, panels: 8 }, "in");
    expect(t.widthMm).toBeCloseTo(medium / 2 + SEAM_MM, 6);
    const radii = t.cut.map(([x, y]) => Math.hypot(x, y));
    expect(Math.max(...radii)).toBeCloseTo(medium / 2 + SEAM_MM, 3);
    expect(Math.min(...radii)).toBeCloseTo(DEFAULT_HOLE_MM / 2 - SEAM_MM, 3);
    expect(t.folds).toHaveLength(2);
  });

  it("makes panels whose sewing lines add up to the finished circle", () => {
    for (const panels of [6, 8, 12]) {
      const t = skirtTemplate({ style: "panels", diameterMm: medium, holeMm: DEFAULT_HOLE_MM, panels }, "in");
      const [, , outerRight, outerLeft] = t.sew;
      const chord = Math.hypot(outerRight[0] - outerLeft[0], outerRight[1] - outerLeft[1]);
      // The outer edge is the chord of 360/panels degrees on the finished circle.
      expect(chord).toBeCloseTo(medium * Math.sin(Math.PI / panels), 3);
      expect(t.folds).toHaveLength(0);
    }
  });

  it("prints only the sheets the template touches, fewer than the full grid for a round skirt", () => {
    const t = skirtTemplate({ style: "round", diameterMm: medium, holeMm: DEFAULT_HOLE_MM, panels: 8 }, "in");
    const plan = skirtPlan(t, "letter");
    const used = usedTiles(t, plan);
    expect(used.length).toBeLessThan(plan.tiles.length);
    expect(used.length).toBe(9);
  });

  it("says when a round skirt needs fabric wider than quilting cotton", () => {
    const small = fabricNeed(skirtTemplate({ style: "round", diameterMm: SKIRT_PRESETS[0].diameterMm, holeMm: DEFAULT_HOLE_MM, panels: 8 }, "in"));
    const big = fabricNeed(skirtTemplate({ style: "round", diameterMm: medium, holeMm: DEFAULT_HOLE_MM, panels: 8 }, "in"));
    expect(small.widthMm).toBeLessThan(44 * 25.4);
    expect(big.widthMm).toBeGreaterThan(44 * 25.4);
  });

  it("rejects sizes it cannot draw, with a readable reason", () => {
    expect(sizeProblem({ style: "round", diameterMm: medium, holeMm: DEFAULT_HOLE_MM, panels: 8 }, "in")).toBeNull();
    expect(sizeProblem({ style: "round", diameterMm: 10 * 25.4, holeMm: DEFAULT_HOLE_MM, panels: 8 }, "in")).toMatch(/between 20 in and 80 in/);
    expect(sizeProblem({ style: "round", diameterMm: 24 * 25.4, holeMm: 10 * 25.4, panels: 8 }, "in")).toMatch(/too big/);
    expect(formatLength(9.5, "in")).toBe("3/8 in");
  });
});
