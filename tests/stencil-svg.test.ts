import { describe, expect, it } from "vitest";
import { stencilSvg, traceMask } from "@/lib/stencil-svg";

function grid(rows: string[]) {
  const width = rows[0].length;
  const mask = new Uint8Array(width * rows.length);
  rows.forEach((row, y) => [...row].forEach((c, x) => (mask[y * width + x] = c === "#" ? 1 : 0)));
  return { mask, width, height: rows.length };
}

/** Parse "M x y L x y ... Z" loops back into polygons. */
function polygons(d: string): number[][] {
  return d
    .split("Z")
    .filter(Boolean)
    .map((loop) => loop.replace(/[ML]/g, " ").trim().split(/\s+/).map(Number));
}

/** Even-odd rasterisation at pixel centres. */
function rasterize(d: string, width: number, height: number): Uint8Array {
  const polys = polygons(d);
  const out = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const cy = y + 0.5;
    for (let x = 0; x < width; x++) {
      const cx = x + 0.5;
      let inside = false;
      for (const p of polys) {
        for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
          const [xi, yi, xj, yj] = [p[i], p[i + 1], p[j], p[j + 1]];
          if (yi > cy !== yj > cy && cx < ((xj - xi) * (cy - yi)) / (yj - yi) + xi) inside = !inside;
        }
      }
      out[y * width + x] = inside ? 1 : 0;
    }
  }
  return out;
}

const mismatches = (a: Uint8Array, b: Uint8Array) => a.reduce((n, v, i) => n + (v !== b[i] ? 1 : 0), 0);

function ring(size: number, thickness: number) {
  const rows: string[] = [];
  for (let y = 0; y < size; y++) {
    let row = "";
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - size / 2 + 0.5, y - size / 2 + 0.5);
      row += d < size / 2 - 1 && d > size / 2 - 1 - thickness ? "#" : ".";
    }
    rows.push(row);
  }
  return grid(rows);
}

describe("traceMask", () => {
  it("traces a square as one 4-corner loop", () => {
    const { mask, width, height } = grid(["......", ".####.", ".####.", ".####.", "......"]);
    const trace = traceMask(mask, width, height, 0);
    expect(trace.loops).toBe(1);
    expect(polygons(trace.d)[0]).toHaveLength(8);
    expect(mismatches(rasterize(trace.d, width, height), mask)).toBe(0);
  });

  it("keeps the hole of a ring open (two loops, even-odd)", () => {
    const { mask, width, height } = ring(24, 4);
    const trace = traceMask(mask, width, height, 0);
    expect(trace.loops).toBe(2);
    expect(mismatches(rasterize(trace.d, width, height), mask)).toBe(0);
  });

  it("keeps pixels that touch only at a corner as separate shapes", () => {
    const { mask, width, height } = grid(["....", ".#..", "..#.", "...."]);
    const trace = traceMask(mask, width, height, 0);
    expect(trace.loops).toBe(2);
    expect(mismatches(rasterize(trace.d, width, height), mask)).toBe(0);
  });

  it("reproduces a noisy mask exactly without simplification", () => {
    const width = 60;
    const height = 40;
    const mask = new Uint8Array(width * height);
    let seed = 7;
    for (let i = 0; i < mask.length; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      mask[i] = seed % 3 === 0 ? 1 : 0;
    }
    const trace = traceMask(mask, width, height, 0);
    expect(mismatches(rasterize(trace.d, width, height), mask)).toBe(0);
  });

  it("simplifies staircases into far fewer points while staying faithful", () => {
    const { mask, width, height } = ring(120, 14);
    const exact = traceMask(mask, width, height, 0);
    const simple = traceMask(mask, width, height, 0.75);
    const count = (d: string) => polygons(d).reduce((n, p) => n + p.length / 2, 0);
    expect(count(simple.d)).toBeLessThan(count(exact.d) * 0.6);
    expect(mismatches(rasterize(simple.d, width, height), mask) / mask.reduce((a, b) => a + b, 0)).toBeLessThan(0.03);
  });
});

describe("stencilSvg", () => {
  it("writes the physical size in millimetres", () => {
    const { mask, width, height } = grid(["....", ".##.", ".##.", "...."]);
    const svg = stencilSvg(traceMask(mask, width, height), width, height, 200, 200);
    expect(svg).toContain('width="200mm"');
    expect(svg).toContain('viewBox="0 0 4 4"');
    expect(svg).toContain('fill-rule="evenodd"');
  });
});
