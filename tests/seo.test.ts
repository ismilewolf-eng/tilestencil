import { describe, expect, it } from "vitest";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { languageAlternates } from "../lib/locale";
import { SITE_URL } from "../lib/site";

describe("SEO metadata routes", () => {
  it("lists both complete language versions of the tool, privacy page, and guides", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      (SITE_URL + "/zh"),
      SITE_URL,
      (SITE_URL + "/zh/privacy"),
      (SITE_URL + "/privacy"),
      (SITE_URL + "/zh/print-image-on-multiple-pages"),
      (SITE_URL + "/print-image-on-multiple-pages"),
      (SITE_URL + "/zh/print-large-stencil"),
      (SITE_URL + "/print-large-stencil"),
      (SITE_URL + "/zh/print-pattern-actual-size"),
      (SITE_URL + "/print-pattern-actual-size"),
      (SITE_URL + "/zh/print-banner-letters"),
      (SITE_URL + "/print-banner-letters"),
      (SITE_URL + "/zh/print-stained-glass-patterns"),
      (SITE_URL + "/print-stained-glass-patterns"),
      (SITE_URL + "/zh/print-scroll-saw-patterns"),
      (SITE_URL + "/print-scroll-saw-patterns"),
    ]);
  });

  it("links each language version to its Chinese, English, and default alternatives", () => {
    const home = sitemap().find((entry) => entry.url === SITE_URL);

    expect(languageAlternates("home")).toEqual({
      "zh-CN": "/zh",
      en: "/",
      "x-default": "/",
    });
    expect(home?.alternates?.languages).toEqual({
      "zh-CN": (SITE_URL + "/zh"),
      en: SITE_URL,
      "x-default": SITE_URL,
    });
  });

  it("publishes the sitemap from the same canonical site URL", () => {
    expect(robots().sitemap).toBe(SITE_URL + "/sitemap.xml");
  });
});
