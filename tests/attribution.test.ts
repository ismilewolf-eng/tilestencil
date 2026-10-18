import { describe, expect, it } from "vitest";
import { CUSTOM_ID_MAX, firstTouchFrom, sanitizeCustomId, sourceTag } from "@/lib/attribution";

const now = new Date("2026-10-18T09:00:00Z");

describe("firstTouchFrom", () => {
  it("records the referring host, utm_source and landing path", () => {
    expect(firstTouchFrom("https://tilestencil.com/free-stencils/halloween?utm_source=chatgpt.com", "https://chatgpt.com/", now)).toEqual({
      ref: "chatgpt.com", utm: "chatgpt.com", landing: "/free-stencils/halloween", date: "2026-10-18",
    });
  });

  it("strips www and treats a missing referrer as direct", () => {
    expect(firstTouchFrom("https://tilestencil.com/", "https://www.google.com/", now)?.ref).toBe("google.com");
    expect(firstTouchFrom("https://tilestencil.com/", "", now)?.ref).toBe("direct");
  });

  it("ignores navigation from our own pages", () => {
    expect(firstTouchFrom("https://tilestencil.com/pricing", "https://tilestencil.com/", now)).toBeNull();
    expect(firstTouchFrom("https://paytest.tilestencil.pages.dev/", "https://paytest.tilestencil.pages.dev/x", now)).toBeNull();
  });

  it("drops characters that could break the tag", () => {
    const touch = firstTouchFrom("https://tilestencil.com/?utm_source=a;b=c<script>", "", now)!;
    expect(touch.utm).toBe("abcscript");
  });
});

describe("sourceTag", () => {
  it("builds a compact tag within PayPal's limit", () => {
    const tag = sourceTag({ ref: "chatgpt.com", utm: "", landing: "/free-stencils/halloween", date: "2026-10-18" }, "/photo-to-stencil");
    expect(tag).toBe("ref=chatgpt.com;land=/free-stencils/halloween;d=2026-10-18;buy=/photo-to-stencil");
    expect(sourceTag({ ref: "x".repeat(40), utm: "y".repeat(30), landing: "/".padEnd(50, "z"), date: "2026-10-18" }, "/".padEnd(40, "p")).length)
      .toBeLessThanOrEqual(CUSTOM_ID_MAX);
  });

  it("marks buyers with no stored touch as unknown", () => {
    expect(sourceTag(null, "/")).toBe("ref=unknown;buy=/");
  });
});

describe("sanitizeCustomId", () => {
  it("accepts only tag characters and non-strings become empty", () => {
    expect(sanitizeCustomId("ref=google.com;<x>")).toBe("ref=google.com;x");
    expect(sanitizeCustomId(42)).toBe("");
    expect(sanitizeCustomId("a".repeat(300))).toHaveLength(CUSTOM_ID_MAX);
  });
});
