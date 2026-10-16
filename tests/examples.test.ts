import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { STENCIL_EXAMPLES } from "@/lib/examples";

describe("landing page examples", () => {
  it("ships both images for every example and credits a free-licence source", () => {
    for (const [name, example] of Object.entries(STENCIL_EXAMPLES)) {
      for (const kind of ["photo", "stencil"]) {
        expect(existsSync(join(process.cwd(), "public", "examples", `${name}-${kind}.webp`)), `${name}-${kind}`).toBe(true);
      }
      expect(["Public domain", "CC0"]).toContain(example.license);
      expect(example.source).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    }
  });
});
