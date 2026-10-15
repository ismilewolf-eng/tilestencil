import { describe, expect, it } from "vitest";
import { stencilLines } from "@/components/LetterStencilSource";

describe("stencilLines", () => {
  it("splits on new lines and drops blank ones", () => {
    expect(stencilLines("  HELLO \n\n world ")).toEqual(["HELLO", "world"]);
  });

  it("caps the text at 60 characters and 4 lines", () => {
    expect(stencilLines("A\nB\nC\nD\nE")).toEqual(["A", "B", "C", "D"]);
    expect(stencilLines("X".repeat(80))[0]).toHaveLength(60);
  });

  it("returns nothing for empty input", () => {
    expect(stencilLines("   \n ")).toEqual([]);
  });
});
