import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { designFiles, GALLERY_CATEGORIES } from "@/lib/gallery";

describe("free stencil gallery", () => {
  for (const category of GALLERY_CATEGORIES) {
    it(`${category.id}: every design ships its files, belongs to a group, and is ours or freely licensed`, () => {
      const groups = new Set(category.groups.map((group) => group.id));
      const slugs = new Set<string>();
      for (const design of category.designs) {
        expect(slugs.has(design.slug), design.slug).toBe(false);
        slugs.add(design.slug);
        expect(groups.has(design.group), design.slug).toBe(true);
        for (const file of Object.values(designFiles(design))) {
          expect(existsSync(join(process.cwd(), "public", file)), file).toBe(true);
        }
        if (!design.own) {
          expect(["Public domain", "CC0"]).toContain(design.license);
          expect(design.source).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
        }
      }
    });
  }
});
