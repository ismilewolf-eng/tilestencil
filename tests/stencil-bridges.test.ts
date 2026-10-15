import { describe, expect, it } from "vitest";
import { cleanupStencil, findIslands } from "@/lib/stencil-bridges";

/** Build a mask from rows of "#" (black, cut) and "." (white, paper). */
function grid(rows: string[]) {
  const width = rows[0].length;
  const mask = new Uint8Array(width * rows.length);
  rows.forEach((row, y) => [...row].forEach((c, x) => (mask[y * width + x] = c === "#" ? 1 : 0)));
  return { mask, width, height: rows.length };
}

/** Black filled ring with a white centre: the letter O problem. */
function ring(size: number, thickness: number, innerRing = false) {
  const rows: string[] = [];
  for (let y = 0; y < size; y++) {
    let row = "";
    for (let x = 0; x < size; x++) {
      const d = Math.max(Math.abs(x - (size - 1) / 2), Math.abs(y - (size - 1) / 2));
      const outer = (size - 1) / 2 - 2;
      let black = d <= outer && d > outer - thickness;
      if (innerRing) {
        const inner = outer - thickness - 3;
        black ||= d <= inner && d > inner - thickness;
      }
      row += black ? "#" : ".";
    }
    rows.push(row);
  }
  return grid(rows);
}

describe("findIslands", () => {
  it("finds the enclosed centre of a ring and ignores paper touching the edge", () => {
    const { mask, width, height } = ring(21, 3);
    expect(findIslands(mask, width, height).islandIds).toHaveLength(1);
  });

  it("does not treat a shape open to the edge as an island", () => {
    const { mask, width, height } = grid(["#####", "#...#", "#...#", "#...#", "##.##"]);
    expect(findIslands(mask, width, height).islandIds).toHaveLength(0);
  });
});

describe("cleanupStencil", () => {
  it("bridges a ring so nothing falls out", () => {
    const { mask, width, height } = ring(21, 3);
    const result = cleanupStencil(mask, width, height, { bridgePx: 2, minAreaPx: 2 });
    expect(result.islands).toBe(1);
    expect(result.bridged).toBe(1);
    expect(findIslands(result.mask, width, height).islandIds).toHaveLength(0);
    // The ring is still mostly black: only a narrow bridge was carved.
    const before = mask.reduce((a, b) => a + b, 0);
    const after = result.mask.reduce((a, b) => a + b, 0);
    expect(after).toBeLessThan(before);
    expect(after).toBeGreaterThan(before * 0.85);
  });

  it("bridges nested islands", () => {
    const { mask, width, height } = ring(31, 3, true);
    expect(findIslands(mask, width, height).islandIds).toHaveLength(2);
    const result = cleanupStencil(mask, width, height, { bridgePx: 1, minAreaPx: 1 });
    expect(result.bridged).toBe(2);
    expect(findIslands(result.mask, width, height).islandIds).toHaveLength(0);
  });

  it("removes specks too small to cut instead of bridging them", () => {
    const { mask, width, height } = grid([
      ".........",
      ".#####...",
      ".#.###...",
      ".#####.#.",
      ".........",
    ]);
    const result = cleanupStencil(mask, width, height, { bridgePx: 1, minAreaPx: 3 });
    // The 1-pixel white hole and the 1-pixel black dot are both gone.
    expect(result.specksRemoved).toBe(2);
    expect(result.islands).toBe(0);
    expect(result.mask[2 * width + 2]).toBe(1);
    expect(result.mask[3 * width + 7]).toBe(0);
  });

  it("only reports islands when bridging is off", () => {
    const { mask, width, height } = ring(21, 3);
    const result = cleanupStencil(mask, width, height, { bridgePx: 0, minAreaPx: 1 });
    expect(result.islands).toBe(1);
    expect(result.bridged).toBe(0);
    expect(findIslands(result.mask, width, height).islandIds).toHaveLength(1);
  });

  it("handles a large image quickly", () => {
    const size = 1200;
    const rows: string[] = [];
    for (let y = 0; y < size; y++) {
      let row = "";
      for (let x = 0; x < size; x++) {
        // A grid of 400 small rings.
        const cx = x % 60;
        const cy = y % 60;
        const d = Math.max(Math.abs(cx - 30), Math.abs(cy - 30));
        row += d <= 20 && d > 14 ? "#" : ".";
      }
      rows.push(row);
    }
    const { mask, width, height } = grid(rows);
    const started = performance.now();
    const result = cleanupStencil(mask, width, height, { bridgePx: 3, minAreaPx: 9 });
    expect(result.islands).toBe(400);
    expect(result.bridged).toBe(400);
    expect(performance.now() - started).toBeLessThan(3000);
  });
});

describe("cleanupStencil on photo-like input", () => {
  it("fills small white islands instead of bridging them", () => {
    // A black field sprinkled with 2x2 white dots (texture), plus one real ring.
    const size = 60;
    const rows: string[] = [];
    for (let y = 0; y < size; y++) {
      let row = "";
      for (let x = 0; x < size; x++) {
        const dot = x % 6 < 2 && y % 6 < 2 && x > 2 && y > 2 && x < 57 && y < 57;
        row += dot ? "." : "#";
      }
      rows.push(row);
    }
    const { mask, width, height } = grid(rows);
    const result = cleanupStencil(mask, width, height, { bridgePx: 2, minAreaPx: 2, minIslandPx: 9 });
    expect(result.bridged).toBe(0);
    expect(result.islands).toBe(0);
    expect(result.specksRemoved).toBeGreaterThan(50);
  });

  it("reports islands left over when the bridging limit is reached", () => {
    const { mask, width, height } = ring(31, 3, true);
    const result = cleanupStencil(mask, width, height, { bridgePx: 2, minAreaPx: 1, maxIslands: 1 });
    expect(result.islands).toBe(2);
    expect(result.bridged).toBe(1);
    expect(result.unbridged).toBe(1);
  });

  it("draws a straight, narrow bridge", () => {
    const { mask, width, height } = ring(41, 6);
    const result = cleanupStencil(mask, width, height, { bridgePx: 2, minAreaPx: 1 });
    const carved = mask.reduce((a, b) => a + b, 0) - result.mask.reduce((a, b) => a + b, 0);
    // Crossing a 6-pixel ring with a ~2-pixel bridge removes a few dozen pixels at most.
    expect(carved).toBeGreaterThan(5);
    expect(carved).toBeLessThan(40);
  });
});
