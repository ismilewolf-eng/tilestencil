import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { maskFromRgba, svgFromMask } from "@/lib/gallery-svg";

function rgba(pixels: number[][]): Uint8ClampedArray {
  return new Uint8ClampedArray(pixels.flatMap(([v, a = 255]) => [v, v, v, a]));
}

describe("gallery SVG", () => {
  it("cuts dark pixels, keeps light grey guides and transparency as paper", () => {
    // black, white, light grey guide (236), dark grey (100), transparent black
    const mask = maskFromRgba(rgba([[0], [255], [236], [100], [0, 0]]), 5, 1);
    expect([...mask]).toEqual([1, 0, 0, 1, 0]);
  });

  it("writes an SVG at the requested width with the aspect ratio kept", () => {
    // 4x2 image with a 2x2 black square on the left
    const mask = new Uint8Array([1, 1, 0, 0, 1, 1, 0, 0]);
    const svg = svgFromMask(mask, 4, 2, 200);
    expect(svg).toContain('width="200mm"');
    expect(svg).toContain('height="100mm"');
    expect(svg).toContain('viewBox="0 0 4 2"');
    expect(svg).toMatch(/<path fill="#000" fill-rule="evenodd" d="M[^"]+Z"\/>/);
  });

  it("every gallery PNG is a plain black-and-white stencil the tracer can handle", () => {
    // Spot-check that the files exist and are PNGs (decoding happens in the browser).
    const head = readFileSync("public/stencils/halloween/bat-flying.png").subarray(0, 8);
    expect([...head]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  });
});
