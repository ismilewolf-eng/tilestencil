import { describe, expect, it } from "vitest";
import { SAMPLE_PRESETS } from "../lib/sample-presets";
import { calculateTilePlan, toMillimeters } from "../lib/geometry";

describe("sample presets", () => {
  it("provides valid data URLs and non-empty dimensions for all presets", () => {
    expect(SAMPLE_PRESETS.length).toBe(3);
    for (const preset of SAMPLE_PRESETS) {
      expect(preset.image.dataUrl).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);
      expect(preset.image.widthPx).toBeGreaterThan(0);
      expect(preset.image.heightPx).toBeGreaterThan(0);
      expect(preset.widthCm).toBeGreaterThan(0);
      expect(preset.heightCm).toBeGreaterThan(0);

      const plan = calculateTilePlan({
        targetWidthMm: toMillimeters(preset.widthCm, "cm"),
        targetHeightMm: toMillimeters(preset.heightCm, "cm"),
        paperSize: preset.paperSize,
        orientation: preset.orientation,
        marginMm: 8,
        overlapMm: 5,
      });
      expect(plan.tiles.length).toBeGreaterThan(0);
    }
  });
});
