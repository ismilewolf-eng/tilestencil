import { describe, expect, it } from "vitest";
import { DEFAULT_STENCIL, stencilValue } from "@/lib/pdf-export";

describe("stencilValue", () => {
  it("keeps the original 160 cut-off by default", () => {
    expect(DEFAULT_STENCIL).toEqual({ threshold: 160, invert: false });
    expect(stencilValue(159)).toBe(0);
    expect(stencilValue(160)).toBe(255);
  });

  it("moves the cut-off with the threshold", () => {
    expect(stencilValue(100, { threshold: 90, invert: false })).toBe(255);
    expect(stencilValue(100, { threshold: 120, invert: false })).toBe(0);
  });

  it("swaps black and white when inverted", () => {
    expect(stencilValue(200, { threshold: 160, invert: true })).toBe(0);
    expect(stencilValue(50, { threshold: 160, invert: true })).toBe(255);
  });
});
