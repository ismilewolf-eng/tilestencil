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
      (SITE_URL + "/zh/rasterbator-alternative"),
      (SITE_URL + "/rasterbator-alternative"),
      (SITE_URL + "/zh/print-posters-without-acrobat"),
      (SITE_URL + "/print-posters-without-acrobat"),
      (SITE_URL + "/zh/blockposters-alternative"),
      (SITE_URL + "/blockposters-alternative"),
      (SITE_URL + "/zh/print-a0-to-a4-actual-size"),
      (SITE_URL + "/print-a0-to-a4-actual-size"),
      (SITE_URL + "/zh/photo-to-stencil"),
      (SITE_URL + "/photo-to-stencil"),
      (SITE_URL + "/zh/pumpkin-stencil-maker"),
      (SITE_URL + "/pumpkin-stencil-maker"),
      (SITE_URL + "/zh/letter-stencils"),
      (SITE_URL + "/letter-stencils"),
      (SITE_URL + "/zh/tattoo-stencil-maker"),
      (SITE_URL + "/tattoo-stencil-maker"),
      (SITE_URL + "/zh/cricut-stencil-maker"),
      (SITE_URL + "/cricut-stencil-maker"),
      (SITE_URL + "/zh/spray-paint-stencil-maker"),
      (SITE_URL + "/spray-paint-stencil-maker"),
      (SITE_URL + "/zh/wood-burning-stencil-maker"),
      (SITE_URL + "/wood-burning-stencil-maker"),
      (SITE_URL + "/zh/airbrush-stencil-maker"),
      (SITE_URL + "/airbrush-stencil-maker"),
      (SITE_URL + "/zh/free-stencils"),
      (SITE_URL + "/free-stencils"),
      (SITE_URL + "/zh/free-stencils/halloween"),
      (SITE_URL + "/free-stencils/halloween"),
      (SITE_URL + "/zh/free-stencils/christmas"),
      (SITE_URL + "/free-stencils/christmas"),
      (SITE_URL + "/zh/pricing"),
      (SITE_URL + "/pricing"),
      (SITE_URL + "/zh/terms"),
      (SITE_URL + "/terms"),
      (SITE_URL + "/zh/refund-policy"),
      (SITE_URL + "/refund-policy"),
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
