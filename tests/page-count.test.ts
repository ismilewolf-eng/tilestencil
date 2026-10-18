import { describe, expect, it } from "vitest";
import { sheetsFor } from "@/lib/page-count";

// Independent check of the published examples: stride = paper − 2 × 8 mm margin − 5 mm overlap,
// count = ceil((size − overlap) / stride).
const count = (size: number, paper: number) => Math.ceil((size - 5) / (paper - 16 - 5));

describe("sheetsFor", () => {
  it("matches the formula for the examples quoted on the poster guide", () => {
    const a4 = sheetsFor(600, 900, "a4");
    const portrait = count(600, 210) * count(900, 297);
    const landscape = count(600, 297) * count(900, 210);
    expect(a4.sheets).toBe(Math.min(portrait, landscape));

    const letter = sheetsFor(609.6, 914.4, "letter");
    expect(letter.sheets).toBe(Math.min(count(609.6, 215.9) * count(914.4, 279.4), count(609.6, 279.4) * count(914.4, 215.9)));
  });
});
