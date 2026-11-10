import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { HOUSE_PRESETS } from "@/lib/gingerbread";
import { ASPECT } from "@/lib/gingerbreadman";
import { houseSvg, manSvg, stockingSvg } from "@/lib/pattern-svg";
import { stockingPattern } from "@/lib/stocking";
import { crc32, zipStore } from "@/lib/zip";

const size = (svg: string) => {
  const m = svg.match(/width="([\d.]+)mm" height="([\d.]+)mm" viewBox="0 0 ([\d.]+) ([\d.]+)"/)!;
  return m.slice(1).map(Number);
};
const count = (svg: string, tag: string) => svg.split(`<${tag} `).length - 1;

describe("cut-ready pattern SVGs", () => {
  it("sizes the stocking in millimetres, one unit per millimetre, with all three pieces", () => {
    const svg = stockingSvg("medium");
    const [w, h, vw, vh] = size(svg);
    expect(w).toBe(vw);
    expect(h).toBe(vh);
    // The cutting line is the finished height plus seam allowance top and bottom.
    const pattern = stockingPattern("medium");
    expect(h).toBeGreaterThan(pattern.size.heightMm);
    expect(h).toBeLessThan(pattern.size.heightMm + 40);
    expect(count(svg, "path")).toBe(3);
    expect(svg).not.toContain("NaN");
  });

  it("puts the three house pieces side by side and keeps door and windows as details", () => {
    const classic = HOUSE_PRESETS[1].size;
    const withOpenings = houseSvg(classic, "gingerbread", true);
    const plain = houseSvg(classic, "gingerbread", false);
    expect(count(plain, "path")).toBe(3);
    expect(count(withOpenings, "path")).toBe(6);
    expect(plain).not.toContain('id="details"');
    const [w, h] = size(plain);
    expect(h).toBeGreaterThanOrEqual(classic.wallMm + classic.riseMm + 4);
    expect(w).toBeGreaterThan(classic.widthMm + classic.depthMm);
  });

  it("draws the gingerbread man at the height asked for", () => {
    const svg = manSvg(254, true);
    const [w, h] = size(svg);
    expect(h).toBeCloseTo(258, 1);
    expect(w).toBeCloseTo(254 * ASPECT + 4, 0);
    expect(count(svg, "circle")).toBe(5);
    expect(count(manSvg(254, false), "circle")).toBe(0);
  });
});

describe("zip", () => {
  it("computes the standard CRC-32", () => {
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926);
  });

  it("writes an archive other tools can read", () => {
    const bytes = zipStore([
      { name: "a.svg", text: "<svg/>" },
      { name: "雪花.svg", text: "<svg>é</svg>" },
    ]);
    const file = join(mkdtempSync(join(tmpdir(), "zip-")), "t.zip");
    writeFileSync(file, bytes);
    const listed = execFileSync("python", ["-X", "utf8", "-c", "import sys,zipfile;z=zipfile.ZipFile(sys.argv[1]);print(z.testzip(), sorted(z.namelist()), z.read('a.svg').decode())", file], { encoding: "utf8" });
    expect(listed.trim()).toBe("None ['a.svg', '雪花.svg'] <svg/>");
  });
});
